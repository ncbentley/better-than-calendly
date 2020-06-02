const $labels = $('.labels');
const $tags = $labels.children();
for (let i = 0; i < 25; i++) {
    $($tags[i]).addClass('label');
    if (i > 0) {
        // TODO: 12hr format option
        $($tags[i]).text(`${i-1}:00`.padStart(5, '0'));
    }
}
const now = new Date();
let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const moved  = days.splice(0, now.getDay()); // clever movement to hold correct day order
for (let i = 0; i < moved.length; i++) {
    days.push(moved[i]);
}
for (let i = 0; i < 7; i++) {
    const section = $('.day')[i];
    $(section.children[0]).text(days[i]);
    $(section.children[0]).addClass('label');
    for (let j = 1; j <= currentSchedule.openTime; j++) {
        $(section.children[j]).addClass('unavailable');
    }
    for (let j = 24; j > currentSchedule.closeTime; j--) {
        $(section.children[j]).addClass('unavailable');
    }
}

$('p').click(event => {
    if (!(event.target.classList.contains('unavailable') || event.target.classList.contains('label'))) {
        for (let i = 0; i < 7; i++) {
            if (event.target.parentNode === $('.day')[i]) {
                const day = days[i];
                let hour = -1;
                for (let j = 1; j < 25; j++) { 
                    if (event.target.parentNode.children[j] === event.target) {
                        hour = j - 1;
                        break;
                    }
                }
                const week = 0;
                const time = now.getTime() + (86400000*7*week) + (86400000*i);
                const date = new Date();
                date.setTime(time);
                date.setHours(hour);
                date.setMinutes(0);
                date.setSeconds(0);
                date.setMilliseconds(0);
                console.log(date);

                break;
            }
        }
    }
})

