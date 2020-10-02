import '../sass/styles.scss';
import DatePicker from './datepicker';

document.querySelectorAll(`.js-datepicker__picker`).forEach(datepicker => {
    const DP = new DatePicker(
        datepicker,
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
})