import { Medication } from "./medication.js";
import { Schedule } from "./schedule.js"
import { addMedication } from "./crud.js";

const schedule = new Schedule();

// Get each element of the UI
const schedule_holder = document.getElementById("schedule-holder");
const addForm_holder = document.getElementById("add-form-holder");
const removeForm_holder = document.getElementById("remove-form-holder");
const ui_screens = [schedule_holder, addForm_holder, removeForm_holder];

async function initClient() {
    ui_screens.forEach(screen => {
        screen.style.display = "none";
        screen.disabled = true;
    });

    schedule_holder.disabled = false;
    schedule_holder.style.display = "block";
    await schedule.update();
    schedule.render(document.getElementById("schedule"));
}

// Add event listeners to dashboard buttons
function toggleScreen(screenIdx, screens) {
    // Hide all screens
    screens.forEach(screen => {
        screen.style.display = "none";
        screen.disabled = true;
    });

    // Set visibility of target screen to true
    screens[screenIdx].style.display = "block";
    screens[screenIdx].disabled = false;
}

document.getElementById("schedule-toggle").addEventListener("click", () => {
    toggleScreen(0, ui_screens);
    schedule.render(document.getElementById("schedule"));
});

document.getElementById("add-toggle").addEventListener("click", () => {
    toggleScreen(1, ui_screens);
});

document.getElementById("remove-toggle").addEventListener("click", () => {
    toggleScreen(2, ui_screens);
});

// Add event listener for add button in Add Form
document.getElementById("add-button").addEventListener("click", async () => {
    // Get form elements 
    const medName = document.getElementById("med-name").value;
    const exp_date = document.getElementById("exp-date").value;
    const refill_date = document.getElementById("refill-date").value;
    const num_refills = document.getElementById("num-refills").value;
    const notes = document.getElementById("notes").value;
    const dayButtonContainer = document.getElementById("day-buttons-container");

    await addMedication(
        medName,
        refill_date,
        exp_date,
        num_refills,
        notes,
        dayButtonContainer
    );

    // Update schedule
    await schedule.update();

    // let curMed = new Medication();
    // curMed.setName(medName);
    // curMed.setExpirationDate(exp_date).setRefillDate(refill_date);
    // curMed.setNotes(notes);
    // curMed.setDays(dayButtonContainer);

    // Update schedule with information
    // schedule.addMedication(curMed.name, curMed.days);
});

// Add event listener for remove button 
document.getElementById("remove-button").addEventListener("click", () => {
    const medName = document.getElementById("med-to-remove").value;
    schedule.removeMedication(medName);
});

await initClient();