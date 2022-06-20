export class Form {
    constructor() {
        this.name = "";
        this.exp_date = "";
        this.refill_date = "";
        this.num_refills = 0;
        this.notes = "";
        this.days = {};
    }

    // Setters
    setName(name) {
        this.name = name;
        return this;
    }

    setExpirationDate(exp_date) {
        this.exp_date = exp_date;
        return this;
    }

    setRefillDate(refill_date) {
        this.refill_date = refill_date;
        return this;
    }

    setNotes(notes) {
        this.notes = notes;
        return this;
    }

    setDays(days) {
        // Get the buttons from the container
        const dayButtons = days.getElementsByTagName("*");

        // Get buttons
        const buttons = dayButtons.reduce(acc, element => {
            let curTag = element.tagName;
            if (curTag === "input") {
                acc.push(element);
            }
            return acc;
        }, []);

        // Iterate over each button and check if it was checked
        for (let i = 0; i < buttons.length; ++i) {
            let curBtn = buttons[i];
            let curDay = (curBtn.id).substring(0, 3);
            
            if (curDay === "daily") {
                this.days = {
                    sun: true,
                    mon: true,
                    tue: true,
                    wed: true,
                    thr: true,
                    fri: true,
                    sat: true
                };
                break;
            } else {
                this.days[curDay] = curBtn.checked;
            }
        }
        
        return this;
    }
}