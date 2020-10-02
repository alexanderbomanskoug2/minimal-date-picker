console.log("Hello Datepicker")
import '../sass/styles.scss';
import DatePicker from './datepicker';

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

console.log(DP);
