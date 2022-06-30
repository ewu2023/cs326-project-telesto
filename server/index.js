import express from "express";
import logger from "morgan";

const app = express();
const port = process.env.PORT || 3000;

// Attach middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(logger('dev'));

// Path for adding medication
app.post("/addMedication", (req, res) => {
    // TODO: Call on database to store medication
});

// Path for removing medication
app.post("removeMedication", (req, res) => {
    // TODO: Call on database to remove medication
});

// Path for retrieving schedule
app.get("/schedule", (req, res) => {
    // TODO: Retrieve day information for each medication from db
});

// Path for retrieving notes
app.get("/notes", (req, res) => {
    // TODO: Retrieve medication info + instructions from db
});

// Path for updating medication
app.post("/updateMedication", (req, res) => {
    // TODO: Update given medication's information in db
});

app.listen(port, () => {
    console.log(`Medication Monitor started on port ${port}`);
});