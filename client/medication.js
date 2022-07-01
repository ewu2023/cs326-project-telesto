export function render(element, med_data) {
    // Create an unordered list using the medication data
    element.innerHTML = '';
    const infoList = createList(med_data);
    element.appendChild(infoList);
}

function createList(med_data) {
    // Create an unordered list
    const listElement = document.createElement("ul");

    // Get the fields from the data
    const field_to_data = {
        "Medication Name": med_data["med-name"],
        "Refill Date": med_data["refill-date"],
        "Expiration Date": med_data["expiration-date"],
        "# of Refills": med_data["num-refills"],
        "Notes": med_data["notes"]
    };

    field_to_data["Days to Take"] = generateDayStr(med_data["days"]);

    // Add items to the list
    for (let field in field_to_data) {
        // Create line of text to put in list
        const curLine = `${field}: ${field_to_data[field]}`;
        const listItem = document.createElement("li");

        // Add item to list
        listItem.innerText = curLine;
        listElement.appendChild(listItem);
    }

    return listElement;
}

function generateDayStr(days) {
    let dayArr = [];
    let trueCount = 0;
    for (let day in days) {
        if (days[day]) {
            dayArr.push(day);
            trueCount += 1;
        }
    }

    if (trueCount === 7) {
        return "Daily";
    }

    return dayArr.join(", ");
}