import { Form } from "./form.js";
import { Schedule } from "./schedule.js"

const schedule = new Schedule();

// Get each element of the UI
const schedule_holder = document.getElementById("schedule-holder");
const addForm_holder = document.getElementById("add-form-holder");
const removeForm_holder = document.getElementById("remove-form-holder");
const ui_screens = [schedule_holder, addForm_holder, removeForm_holder];

function initClient() {
    ui_screens.forEach(screen => {
        screen.style.display = "none";
        screen.disabled = true;
    });

    schedule_holder.disabled = false;
    schedule_holder.style.display = "block";
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
document.getElementById("add-button").addEventListener("click", () => {
    // Get form elements 
    const medName = document.getElementById("med-name").value;
    const exp_date = document.getElementById("exp-date").value;
    const refill_date = document.getElementById("refill-date");
    const num_refills = document.getElementById("num-refills").value;
    const notes = document.getElementById("notes").value;
    const dayButtonContainer = document.getElementById("day-buttons-container");

    let curForm = new Form();
    curForm.setName(medName);
    curForm.setExpirationDate(exp_date).setRefillDate(refill_date);
    curForm.setNotes(notes);
    curForm.setDays(dayButtonContainer);

    // Update schedule with information
    schedule.addMedication(curForm.name, curForm.days);
});

// Add event listener for remove button 
document.getElementById("remove-button").addEventListener("click", () => {
    const medName = document.getElementById("med-to-remove").value;
    schedule.removeMedication(medName);
});

initClient();