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
    await db.addMedication(med);
    res.status(200).json({status: "success"});
});

// Path for removing medication
app.post("/deleteMedication", async (req, res) => {
    // TODO: Call on database to remove medication
    const med_id = req.body;
    await db.deleteMedication(med_id["_id"]);
    res.status(200).json({status: "success"});
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
        const med_id = req.body["_id"];
        const med_data = await db.getMedication(med_id);
        res.status(200).json(med_data);
    } catch(err) {
        res.status(500).send(err);
    }
});

// Path for updating medication
app.post("/updateMedication", async (req, res) => {
    // TODO: Update given medication's information in db
    try {
        const med_new_data = req.body;
        const res_json = await db.updateMedication(med_new_data);
        res.status(200).send(res_json);
    } catch(err) {
        res.status(500).send(err);
    }
});

app.listen(port, () => {
    console.log(`Medication Monitor started on port ${port}`);
});