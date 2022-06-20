export class Schedule {
    constructor() {
        this.daysOfWeek = [
            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thr",
            "Fri",
            "Sat"
        ];

        this.grid = [];
        this.grid[0] = this.daysOfWeek;
    }

    render(table) {
        // Re-render schedule when an update occurs
        table.innerHTML = '';

        for (let i = 0; i < this.grid.length; ++i) {
            // Create new table row
            const curRow = document.createElement("tr");
            curRow.id = i > 0 ? `row-${i}` : "table-headers";
            for (let j = 0; j < this.grid[i].length; ++j) {
                // Check if we are re-rendering the days
                if (i === 0) {
                    let curDay = this.grid[i][j];
                    const curCell = document.createElement("th");
                    curCell.id = curDay;
                    curCell.classList.add("day");
                    curCell.innerText = curDay;

                    curRow.appendChild(curCell);
                } else {
                    const curCell = document.createElement("td");
                    curCell.classList.add("table-cell");
                    let curMed = this.grid[i][j];
                    
                    // Update contents of current cell 
                    if (curMed) {
                        // Add a checkbox button
                        const takenBtn = _createCheckbox(curMed);
                        curCell.appendChild(takenBtn.label);
                        curCell.appendChild(takenBtn.button);
                    } else {
                        curCell.innerText = "";
                    }

                    curRow.appendChild(curCell);
                }
            }

            // Add current row to the table
            table.appendChild(curRow);
        }
    }

    _createCheckbox(label) {
        // Create the label and checkbox elements
        const labelElem = document.createElement("label");
        const checkBtn = document.createElement("input");
        
        // Set attributes for label element
        labelElem.setAttribute("for", label);
        labelElem.innerText = label;

        // Set attributes for checkbox button
        checkBtn.setAttribute("type", "checkbox");
        checkBtn.id = label;

        return {button: checkBtn, label: labelElem};
    }

    /**
     * Add a medication to the schedule
     * @param {string} name the name of the medication to add
     * @param {Object<String, boolean>} days the days of the week to take the medication
     */
    addMedication(name, days) {
        let newRow = [];
        for (let day in days) {
            if (days[day]) {
                newRow.push(name);
            } else {
                newRow.push(null);
            }
        }
        this.grid[this.grind.length] = newRow;
    }

    /**
     * Remove the medication with the given name from the schedule
     * @param {String} name the name of the medication to remove
     */
    removeMedication(name) {
        for (let i = 1; i < this.grid.length; ++i) {
            for (let j = 0; j < this.grid[i].length; ++j) {
                if (this.grid[i][j] === name) {
                    this.grid[i][j] = null;
                }
            }
        }
    }
}