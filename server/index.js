import "dotenv/config";
import express from "express";
import logger from "morgan";
import { database } from "./database.js";

const app = express();
const port = process.env.PORT || 3000;

// Attach middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(logger('dev'));

app.use('/', express.static('client'))

// Initialize database
const db = new database(process.env.DATABASE_URL);
await db.connect();
await db.init();

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