import HelpersClass from './helpers';
const Helpers = new HelpersClass();

export default class DatePicker {
    constructor(datepicker = false, months = false, days = false) {
        if(!datepicker) {throw 'Parameter is not a number!';}
        
        this.DATEPICKER = datepicker;
        this.BASE       = "js-datepicker";
        this.PICKER     = `.${this.BASE}__picker`;
        this.YEAR       = `${this.BASE}__year`;
        this.MONTH      = `${this.BASE}__month`;
        this.DAY        = `${this.BASE}--day`;
        this.CALENDAR   = `${this.BASE}__calendar`
        this.PREVMONTH  = `${this.BASE}__prev`;
        this.NEXTMONTH  = `${this.BASE}__next`;

        this.daysNames = days ? days : [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
        ];

        this.monthsNames = months ? months : [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ];

        Helpers.daysNames   = this.daysNames;
        Helpers.monthsNames = this.monthsNames;

        this.addMonthListeners();
        this.addYearListener();
        this.appendDayElements();
        this.appendDateToDayElements();
        this.addCalendarListeners();
        this.appendDayHeaders();
        this.setStartingValues();

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type == "attributes") {
                    if (mutation.attributeName === this.MONTH) {
                        let currentYear = parseInt(this.DATEPICKER.getAttribute(this.YEAR));
                        let currentMonth = parseInt(this.DATEPICKER.getAttribute(this.MONTH));
                        this.appendDateToDayElements(new Date(`${currentYear}/${currentMonth+1}/1`));
                    }

                    if (mutation.attributeName === this.YEAR) {
                        let currentYear = parseInt(this.DATEPICKER.getAttribute(this.YEAR));
                        this.DATEPICKER.querySelector(`.${this.YEAR}`).value = currentYear;  
                    }
                }
            });
        });
            
        observer.observe(this.DATEPICKER, {
            attributes: true //configure it to listen to attribute changes
        });
    }

    //Data building
    setStartingValues() {
        const day = Helpers.getCurrentDay();
        
        this.DATEPICKER.setAttribute(this.MONTH, Helpers.getCurrentMonth());
        this.DATEPICKER.setAttribute(this.YEAR, Helpers.getCurrentYear());
        this.DATEPICKER.querySelector(`.${this.MONTH}`).innerHTML = Helpers.getMonthName(Helpers.getCurrentMonth());
        this.DATEPICKER.querySelector(`.${this.YEAR}`).value = Helpers.getCurrentYear();
        this.DATEPICKER.querySelector(`[${this.DAY} = "${day}"]`).setAttribute('js-datepicker--selected', true);
    }

    
    /**
     * Add titles to each column
     * @param  {} datepicker
     */
    appendDayHeaders() {
        for (let iteration = 0; iteration < 7; iteration++) {
            let day = document.createElement("div");
            day.innerHTML = Helpers.getWeekday(iteration).substring(0,2);
            this.DATEPICKER.querySelector('.js-datepicker__calendar-header').appendChild(day);  
        }
    }

    /**
     * Add divs for days in calendar
     * @param  {} datepicker
     */
    appendDayElements() {
        for (let iteration = 0; iteration < 42; iteration++) {
            let day = document.createElement("div");
            day.setAttribute("js-datepicker--day--index", iteration);
            day.setAttribute(this.DAY, "");
            this.DATEPICKER.querySelector(`[${this.CALENDAR}]`).appendChild(day);  
        }
    }

    appendDateToDayElements(date = false) {
        let startIndex = Helpers.getMonthStartDayIndex(date) -1;
        let monthLength = Helpers.getMonthLength(date)
        let dateInt = 1;
        let rest = 1;

        for (let iteration = 0; iteration < 42; iteration++) {
            let elm = this.DATEPICKER.querySelector(`[js-datepicker--day--index="${iteration}"]`);
            elm.innerHTML = '';
            elm.setAttribute(this.DAY, false);
            elm.removeAttribute('disabled');
            elm.removeAttribute('notInMonth');

            if(iteration < startIndex) {
                elm.innerHTML = 'X';
                elm.setAttribute('disabled', true);
                elm.setAttribute('notInMonth', true);
            }

            if (iteration >= startIndex && dateInt <= monthLength) {
                elm.innerHTML = dateInt;
                elm.setAttribute(this.DAY, dateInt);
            } 
            
            if (dateInt > monthLength) {
                elm.innerHTML = rest;
                elm.setAttribute('disabled', true);
                elm.setAttribute('notInMonth', true);
                rest++;
            }

            if(dateInt > monthLength || (iteration >= startIndex && dateInt <= monthLength)) {
                dateInt++;
            }
        }
    }

    //Runtime preparations
    addYearListener() {
        this.DATEPICKER.querySelector(`[${this.YEAR}]`).addEventListener("change", (e) => {
            this.updateYear(false, false, e.target.value);
        });
    }

    addMonthListeners() {
        this.DATEPICKER.querySelector(`[${this.PREVMONTH}]`).addEventListener("click", () => {
            this.updateMonth(true)
        })

        this.DATEPICKER.querySelector(`[${this.NEXTMONTH}]`).addEventListener("click", () => {
            this.updateMonth(false, true)
        })
    }

    addCalendarListeners() {
        let days = this.DATEPICKER.querySelectorAll(`[${this.DAY}]`);
        days.forEach((day) => {
            day.addEventListener("click", (e) => {
                if(!e.target.hasAttribute('disabled')) {
                    let elm = this.DATEPICKER.querySelector(`[js-datepicker--selected]`)
                    if (elm) {
                        elm.removeAttribute("js-datepicker--selected")
                    }
        
                    e.target.setAttribute('js-datepicker--selected', true);
                    this.updateFieldValue()
                }
                
            })
        })
    }

    updateFieldValue() {
        let arr = [
            parseInt(this.DATEPICKER.getAttribute(this.YEAR)),
            parseInt(this.DATEPICKER.getAttribute(this.MONTH)) +1,
            this.DATEPICKER.querySelector("[js-datepicker--selected]").innerHTML
        ]

        const builtDate = arr.join('/');
        const timestamp = new Date(builtDate)

        document.querySelector(`[js-datepicker='${this.DATEPICKER.getAttribute('js-datepicker')}']`).value = builtDate;
        document.querySelector(`[js-datepicker='${this.DATEPICKER.getAttribute('js-datepicker')}']`).setAttribute('value', Date.parse(timestamp));
    }

    //Runtime functions
    updateMonth(sub = false, add = false) {
        let currentMonth = parseInt(this.DATEPICKER.getAttribute(this.MONTH));
        let newMonth;
        let updateYear;

        if (add) {
            newMonth = currentMonth === 11 ? 0 : currentMonth +1;
            updateYear = currentMonth === 11 ? true : false;
        }

        if (sub) {
            newMonth = currentMonth === 0 ? 11 : currentMonth -1;
            updateYear = currentMonth === 0 ? true : false;
        }

        this.DATEPICKER.setAttribute(this.MONTH, newMonth);
        this.updateMonthTitle();
        this.resetDay()

        if (updateYear) this.updateYear(sub, add);
    }

    updateMonthTitle() {
        let currentMonth = parseInt(this.DATEPICKER.getAttribute(this.MONTH));
        this.DATEPICKER.querySelector(`.${this.MONTH}`).innerHTML = Helpers.getMonthName(currentMonth)
    }

    updateYear(sub = false, add = false, specificYear = false) {
        if (specificYear) {
            this.DATEPICKER.setAttribute(this.YEAR, specificYear);
            this.updateFieldValue()
            return
        }

        let currentYear = parseInt(this.DATEPICKER.getAttribute(this.YEAR));

        if (add) {
            this.DATEPICKER.setAttribute(this.YEAR, currentYear +1);
            return
        }

        if (sub) {
            this.DATEPICKER.setAttribute(this.YEAR, currentYear -1);
            return
        }
    }

    resetDay() {
        let elm = this.DATEPICKER.querySelector(`[js-datepicker--selected]`)

        if (elm) {
            elm.removeAttribute("js-datepicker--selected")
        }
    }
}