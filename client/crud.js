// CRUD functionality for forms 

export async function addMedication(
    med_name, refill_date, expiration_date, num_refills, notes, dayBtnContainer) {
   
    // Parse the day button information
    const days = _parseDays(dayBtnContainer);

    let refill_count = num_refills === '' ? 0 : parseInt(num_refills);
    
    // Create document to store in mongodb
    const med_document = {
        "med-name": med_name,
        "refill-date": refill_date,
        "expiration-date": expiration_date,
        "num-refills": refill_count,
        "notes": notes,
        "days": days
    };

    try {
        const res = await fetch("/addMedication", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(med_document)
        });

        const db_response = await res.json();
        return db_response;
    } catch(err) {
        console.error(err);
    }
}

export async function deleteMedication(med_name) {
    try {
        const res = await fetch("/deleteMedication", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ "med-name": med_name })
        });
        
        const db_response = await res.json();
        console.log(db_response);
        return db_response;
    } catch(err) {
        console.error(err);
    }
}

/* Helpers */
function _parseDays(container) {
    // Retrieve state of buttons
    const elements = container.getElementsByTagName("*");
    const buttons = [];

    for (let i in elements) {
        let curElem = elements[i];
        if (curElem.tagName === "INPUT") {
            buttons.push(curElem);
        }
    }

    // Initialize object to store mapping of days to boolean values
    let dayMap = {};
    
    // Populate the map
    let dailyBtn = buttons[0];
    if (dailyBtn.checked) {
        dayMap = {
            sun: true,
            mon: true,
            tue: true,
            wed: true,
            thr: true,
            fri: true,
            sat: true
        };
    } else {
        buttons.forEach((btn) => {
            if (btn.id !== "daily-btn") {
                const day = (btn.id).substring(0, 3);
                dayMap[day] = btn.checked;
            }
        });
    }

    return dayMap;
}