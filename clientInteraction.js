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
});

document.getElementById("add-toggle").addEventListener("click", () => {
    toggleScreen(1, ui_screens);
});

document.getElementById("remove-toggle").addEventListener("click", () => {
    toggleScreen(2, ui_screens);
});

initClient();