export default class Helpers {

    /**
     * @param  {Array} names An array of names of days in order
     * @return  {Void}
     */
    set daysNames(names) {
        this.cDaysNames = names
    }

    /**
     * @param  {Array} names An array of names of months in order
     * @return  {Void}
     */
    set monthsNames(names) {
        this.cMonthsNames = names
    }

    /**
     * @param  {Date} d A date object
     * @return  {Int} Index of the weeks starting day
     */
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
        return this.cMonthsNames[month];
    }

    /**
     * Returns name of day of week
     * @param  {} day
     * @return String with day of week
     */
    getWeekday(day) {
        return this.cDaysNames[day];
    }
}