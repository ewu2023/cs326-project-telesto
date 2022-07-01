import * as medicationViewer from "./medication.js";
import { Schedule } from "./schedule.js";
import * as crudUtils from "./crud.js";

const schedule = new Schedule();

// Get each element of the UI
const schedule_holder = document.getElementById("schedule-holder");
const addForm_holder = document.getElementById("add-form-holder");
const removeForm_holder = document.getElementById("remove-form-holder");
const notes_holder = document.getElementById("notes-holder");
const ui_screens = [schedule_holder, addForm_holder, removeForm_holder, notes_holder];

// Get Add Form elements
const med_text_box = document.getElementById("med-name");
const exp_date_box = document.getElementById("exp-date");
const refill_date_box = document.getElementById("refill-date");
const num_refills_box = document.getElementById("num-refills");
const notes_box = document.getElementById("notes");
const dayButtonContainer = document.getElementById("day-buttons-container");
const addConfirm = document.getElementById("add-confirm");

// Get Note search bar elements
const search_box = document.getElementById("search-box");
const search_btn = document.getElementById("search-btn");
const search_result = document.getElementById("search-result");

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
    addConfirm.innerHTML = '';
});

document.getElementById("remove-toggle").addEventListener("click", () => {
    toggleScreen(2, ui_screens);
    document.getElementById("med-to-remove").value = '';
    document.getElementById("delete-confirm").innerHTML = '';
});

document.getElementById("notes-toggle").addEventListener("click", () => {
    toggleScreen(3, ui_screens);
    // TODO: load in previously searched item into the div
});

// Add event listener for add button in Add Form
document.getElementById("add-button").addEventListener("click", async () => {
    // Get form elements 
    const medName = med_text_box.value;
    const exp_date = exp_date_box.value;
    const refill_date = refill_date_box.value;
    const num_refills = num_refills_box.value;
    const notes = notes_box.value;

    // Check if required fields have been filled
    if (medName === '' || exp_date === '' || refill_date === '') {
        addConfirm.innerHTML = "<strong>Please ensure all fields in red are filled out.</strong>"
    } else {
        try {
            const res = await crudUtils.addMedication(
                medName,
                refill_date,
                exp_date,
                num_refills,
                notes,
                dayButtonContainer
            );
            
            if (res.acknowledged) {
                addConfirm.innerHTML = `<strong>${medName} was added successfully.</strong>`

                // Clear all text boxes
                med_text_box.value = '';
                exp_date_box.value = '';
                refill_date_box.value = '';
                num_refills_box.value = '';
                notes_box.value = '';

                // Update schedule
                await schedule.update();
            } else {
                addConfirm.innerHTML = `<strong>An error occurred while adding ${medName}</strong>`;
            }
        } catch(err) {
            addConfirm.innerHTML = `<strong>An error occurred, please try again.</strong>`
            console.error(err);
        }
    }
});

// Add event listener for remove button 
document.getElementById("remove-button").addEventListener("click", async () => {
    // Get the name of the medication to remove
    const medName = document.getElementById("med-to-remove").value;
    
    // Wait for database to delete medication
    try {
        const res = await crudUtils.deleteMedication(medName);
        if (res.deletedCount > 0) {
            document.getElementById("med-to-remove").value = '';
            document.getElementById("delete-confirm").innerHTML = `<strong>${medName} has been deleted</strong>`;
            await schedule.update();
        } else {
            document.getElementById("delete-confirm").innerHTML = `<strong>${medName} does not exist</strong>`;
        }
    } catch(err) {
        console.error(err);
        document.getElementById("delete-confirm").innerHTML = `<strong>An error occurred while deleting ${medName}.`
    }
});

search_btn.addEventListener("click", async () => {
    const med_name = search_box.value;
    if (med_name === '') {
        search_result.innerHTML = `<strong>Invalid medication name<strong>`;
    } else {
        try {
            const res = await crudUtils.readMedication(med_name);
            // TODO: Create an editable form from the information taken from the database
            medicationViewer.render(search_result, res);
            // TODO: Save this information to local storage
        } catch(err) {
            console.error(err);
            search_result.innerHTML = `<strong>An error occurred while searching for ${med_name}</strong>`;
        }
    }
});

await initClient();