class DatePicker {
    constructor(months = false, days = false) {
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

        console.log(days)
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

        this.getDatepickers().forEach(datepicker => {
            this.addMonthListeners(datepicker);
            this.addYearListener(datepicker);
            this.appendDayElements(datepicker);
            this.appendDateToDayElements(datepicker);
            this.addCalendarListeners(datepicker);
            this.appendDayHeaders(datepicker);
            this.setStartingValues(datepicker);

            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type == "attributes") {
                        if (mutation.attributeName === this.MONTH) {
                            let currentYear = parseInt(datepicker.getAttribute(this.YEAR));
                            let currentMonth = parseInt(datepicker.getAttribute(this.MONTH));
                            this.appendDateToDayElements(datepicker, new Date(`${currentYear}/${currentMonth+1}/1`));
                        }

                        if (mutation.attributeName === this.YEAR) {
                            let currentYear = parseInt(datepicker.getAttribute(this.YEAR));
                            datepicker.querySelector(`.${this.YEAR}`).value = currentYear;  
                        }
                    }
                });
            });
              
            observer.observe(datepicker, {
                attributes: true //configure it to listen to attribute changes
            });

        })
    }

    getDatepickers() {
        return document.querySelectorAll(`.${this.BASE}__picker`);
    }

    //Data building
    setStartingValues(datepicker) {
        const day = this.getCurrentDay();
        
        datepicker.setAttribute(this.MONTH, this.getCurrentMonth());
        datepicker.setAttribute(this.YEAR, this.getCurrentYear());
        datepicker.querySelector(`.${this.MONTH}`).innerHTML = this.getMonthName(this.getCurrentMonth());
        datepicker.querySelector(`.${this.YEAR}`).value = this.getCurrentYear();
        datepicker.querySelector(`[${this.DAY} = "${day}"]`).setAttribute('js-datepicker--selected', true);
    }

    
    /**
     * Add titles to each column
     * @param  {} datepicker
     */
    appendDayHeaders(datepicker) {
        for (let iteration = 0; iteration < 7; iteration++) {
            let day = document.createElement("div");
            day.innerHTML = this.getWeekday(iteration).substring(0,2);
            datepicker.querySelector('.js-datepicker__calendar-header').appendChild(day);  
        }
    }

    /**
     * Add divs for days in calendar
     * @param  {} datepicker
     */
    appendDayElements(datepicker) {
        for (let iteration = 0; iteration < 42; iteration++) {
            let day = document.createElement("div");
            day.setAttribute("js-datepicker--day--index", iteration);
            day.setAttribute(this.DAY, "");
            datepicker.querySelector(`[${this.CALENDAR}]`).appendChild(day);  
        }
    }

    appendDateToDayElements(datepicker, date = false) {
        let startIndex = this.getMonthStartDayIndex(date) -1;
        let monthLength = this.getMonthLength(date)
        let dateInt = 1

        for (let iteration = 0; iteration < 42; iteration++) {
            let elm = datepicker.querySelector(`[js-datepicker--day--index="${iteration}"]`);
            if (iteration  >= startIndex && dateInt <= monthLength) {
                elm.innerHTML = dateInt;
                elm.setAttribute(this.DAY, dateInt);
                dateInt++;
                startIndex++;
            } else {
                elm.setAttribute('disabled', true);
                elm.innerHTML = "";
            }
        }
    }

    //Runtime preparations
    addYearListener(datepicker) {
        datepicker.querySelector(`[${this.YEAR}]`).addEventListener("change", (e) => {
            this.updateYear(datepicker, false, false, e.target.value);
        });
    }

    addMonthListeners(datepicker) {
        datepicker.querySelector(`[${this.PREVMONTH}]`).addEventListener("click", () => {
            this.updateMonth(datepicker, true)
        })

        datepicker.querySelector(`[${this.NEXTMONTH}]`).addEventListener("click", () => {
            this.updateMonth(datepicker, false, true)
        })
    }

    addCalendarListeners(datepicker) {
        let days = datepicker.querySelectorAll(`[${this.DAY}]`);
        days.forEach((day) => {
            day.addEventListener("click", (e) => {
                if(!e.target.hasAttribute('disabled')) {
                    let elm = datepicker.querySelector(`[js-datepicker--selected]`)
                    if (elm) {
                        elm.removeAttribute("js-datepicker--selected")
                    }
        
                    e.target.setAttribute('js-datepicker--selected', true);
                    this.updateFieldValue(datepicker)
                }
                
            })
        })
    }

    updateFieldValue(datepicker) {
        let arr = [
            parseInt(datepicker.getAttribute(this.YEAR)),
            parseInt(datepicker.getAttribute(this.MONTH)) +1,
            datepicker.querySelector("[js-datepicker--selected]").innerHTML
        ]

        const builtDate = arr.join('/');
        const timestamp = new Date(builtDate)

        document.querySelector(`[js-datepicker='${datepicker.getAttribute('js-datepicker')}']`).value = builtDate;
        document.querySelector(`[js-datepicker='${datepicker.getAttribute('js-datepicker')}']`).setAttribute('value', Date.parse(timestamp));
    }

    //Runtime functions
    updateMonth(datepicker, sub = false, add = false) {
        let currentMonth = parseInt(datepicker.getAttribute(this.MONTH));
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

        datepicker.setAttribute(this.MONTH, newMonth);
        this.updateMonthTitle(datepicker);
        this.resetDay(datepicker)

        if (updateYear) this.updateYear(datepicker, sub, add);
    }

    updateMonthTitle(datepicker) {
        let currentMonth = parseInt(datepicker.getAttribute(this.MONTH));
        datepicker.querySelector(`.${this.MONTH}`).innerHTML = this.getMonthName(currentMonth)
    }

    updateYear(datepicker, sub = false, add = false, specificYear = false) {
        if (specificYear) {
            datepicker.setAttribute(this.YEAR, specificYear);
            this.updateFieldValue(datepicker)
            return
        }

        let currentYear = parseInt(datepicker.getAttribute(this.YEAR));

        if (add) {
            datepicker.setAttribute(this.YEAR, currentYear +1);
            return
        }

        if (sub) {
            datepicker.setAttribute(this.YEAR, currentYear -1);
            return
        }
    }

    resetDay(datepicker) {
        let elm = datepicker.querySelector(`[js-datepicker--selected]`)

        if (elm) {
            elm.removeAttribute("js-datepicker--selected")
        }
    }

    //Helper functions
    getMonthStartDayIndex(d = false) {
        d = d ? d : new Date();
        let index = new Date(d.getFullYear(d), d.getMonth(d), 1).getDay();
        
        return index === 0 ? index = 7 : index;
    }

    /**
     * @param  {Date} d A date object
     * @return  {Int} Days in month
     */
    getMonthLength(d = false) {
        d = d ? d : new Date();
        return new Date(d.getFullYear(d), d.getMonth(d) + 1, 0).getDate();
    }

    /**
     * @return  {Int} Current Day
     */
    getCurrentDay() {
        const d = new Date();
        return d.getDate();
    }

    /**
     * @return  {Int} Current month
     */
    getCurrentMonth() {
        const d = new Date();
        return d.getMonth();
    }

    /**
     * @return {Int} Current year
     */
    getCurrentYear() {
        const d = new Date();
        return d.getFullYear();
    }
    
    /**
     * Returns name of month
     * @param  {} month
     * @return {String} Name of month
     */
    getMonthName(month) {
        return this.monthsNames[month];
    }

    /**
     * Returns name of day of week
     * @param  {} day
     * @return String with day of week
     */
    getWeekday(day) {
        return this.daysNames[day];
    }
}
const DP = new DatePicker(
    [
        "Januari",
        "Feburari",
        "Mars",
        "April",
        "Maj",
        "Juni",
        "Juli",
        "Augusti",
        "September",
        "Oktober",
        "November",
        "December"
    ], [
        "Måndag",
        "Tisdag",
        "Onsdag",
        "Torsdag",
        "Fredag",
        "Lördag",
        "Söndag"
    ]
);