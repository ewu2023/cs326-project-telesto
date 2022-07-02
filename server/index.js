import "dotenv/config";
import express from "express";
import logger from "morgan";
import { database } from "./database.js";

// Authentication
import users from "./users.js"
import auth from "./auth.js"
import expressSession from 'express-session';
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(dirname(__filename));

const app = express();
const port = process.env.PORT || 3000;

const sessionConfig = {
    secret: process.env.SECRET || 'SECRET',
    resave: false,
    saveUninitialized: false
}

// Attach middleware
app.use(expressSession(sessionConfig));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(logger('dev'));

app.use('/static', express.static('client'));

function checkLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/login");
    }
}

auth.configure(app);

// Initialize database
const db = new database(process.env.DATABASE_URL);
await db.connect();

// Path for routing to static content
app.get("/", checkLoggedIn, async (req, res) => {
    // Need to retrieve user medications from database
    const curUser = req.user;
    const uid = curUser["_id"].toString();
    await db.init(uid);
    res.redirect("/static");
});

// URL for login
app.get("/login", (req, res) => {
    res.sendFile("client/login.html", {root: __dirname});
});

// Path for handling logging in to site
app.post(
    "/login",
    auth.authenticate('local', {
        successRedirect: "/",
        failureRedirect: "/login"
    })
);

// Path for logging out of site
app.get("/logout", (req, res, next) => {
    // This structure is required as of passport ver. 0.6.0
    // This version came out a few days after the Spring 2022 semester!
    // Source: https://stackoverflow.com/questions/72336177/error-reqlogout-requires-a-callback-function
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        res.redirect("/login");
    });
});

app.get("/register", (req, res) => {
    res.sendFile("client/register.html", {root: __dirname});
});

app.post("/register", (req, res) => {
    const {username, password} = req.body;
    // Attempt to add the user to the database
    if (users.addUser(username, password)) {
        // Redirect user to login page
        res.redirect("/login");
    } else {
        res.redirect("/register");
    }
});

// Path for adding medication
app.post("/addMedication", async (req, res) => {
    // TODO: Call on database to store medication
    const med = req.body;
    const db_response = await db.addMedication(med);
    res.status(200).json(db_response);
});

// Path for removing medication
app.post("/deleteMedication", async (req, res) => {
    // TODO: Call on database to remove medication
    const med_name = req.body;
    const db_response = await db.deleteMedication(med_name["med-name"]);
    res.status(200).json(db_response);
});

// Path for retrieving schedule
app.get("/schedule", async (req, res) => {
    // TODO: Retrieve day information for each medication from db
    try {
        // Fetch medication data from database
        const med_data = await db.readAllMedication();

        // Extract schedule information 
        const schedule_info = {};
        med_data.forEach((med) => {
            const med_name = med["med-name"];
            const days = med["days"];
            schedule_info[med_name] = days;
        });

        // Write response 
        res.status(200).json(schedule_info);
    } catch(err) {
        res.status(500).send(err);
    }
});

// Path for retrieving notes
app.get("/notes", async (req, res) => {
    // TODO: Retrieve medication info + instructions from db
    try {
        const med_name = req.header("med-name");
        const med_data = await db.getByName(med_name);
        res.status(200).json(med_data);
    } catch(err) {
        res.status(500).send(err);
    }
});

// Path for updating medication
app.post("/updateMedication", async (req, res) => {
    // TODO: Update given medication's information in db
    try {
        // Re-implement
        const med_data = req.body;
        const target = med_data[0];
        const fields = med_data[1];
        const db_response = await db.updateMedication(target, fields);
        res.status(200).json(db_response);
    } catch(err) {
        res.status(500).send(err);
    }
});

app.listen(port, () => {
    console.log(`Medication Monitor started on port ${port}`);
});