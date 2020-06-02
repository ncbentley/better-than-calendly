const $labels = $('.labels');
const $tags = $labels.children();
for (let i = 1; i < 25; i++) {
    // TODO: 12hr format option
    $($tags[i]).text(`${i-1}:00`.padStart(5, '0'));
}
const now = new Date();
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
for (let i = 1; i < 8; i++) {
    let day = now.getDay() + i - 1;
    if (day > 6) {
        day -= 7;
    }
    const section = $('.day')[i-1];
    $(section.children[0]).text(days[day]);
    for (let j = 1; j <= currentSchedule.openTime; j++) {
        $(section.children[j]).addClass('unavailable');
    }
    for (let j = 24; j > currentSchedule.closeTime; j--) {
        $(section.children[j]).addClass('unavailable');
    }
}

