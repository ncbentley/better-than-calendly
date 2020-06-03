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

let customs = currentSchedule.customSlots;

const appointments = currentSchedule.appointments;
let baseTime = new Date()
baseTime.setHours(0)
baseTime.setMinutes(0)
baseTime.setSeconds(0)
baseTime.setMilliseconds(0)
baseTime = baseTime.getTime();
appointments.forEach(appointment => {
    const time = new Date(appointment.time);
    const difference = time - baseTime;
    const day = Math.floor(difference / (86400*1000));
    const hour = (difference / 1000) % 86400 / 3600;
    $($('.day')[day].children[hour+1]).addClass('taken');
});
customs.forEach(custom => {
    const time = new Date(custom);
    const difference = time - baseTime;
    const day = Math.floor(difference / (86400*1000));
    const hour = (difference / 1000) % 86400 / 3600;
    $($('.day')[day].children[hour+1]).toggleClass('unavailable');
});

console.log(customs);

$('p').click(event => {
    if (!(event.target.classList.contains('label') || event.target.classList.contains('taken'))) {
        $(event.target).toggleClass('unavailable');
        for (let i = 0; i < 7; i++) {
            const section = $('.day')[i];
            if (section === event.target.parentNode) {
                const day = i;
                for (let j = 1; j < 25; j++) {
                    if (section.children[j] === event.target) {
                        const hour = j - 1;
                        const extra = day * 86400 * 1000 + (hour * 3600 * 1000);
                        const time = baseTime + extra;
                        if (customs.includes(time)) {
                            customs.splice(customs.indexOf(time), 1);
                        } else {
                            customs.push(time);
                        }
                    }
                }
            }
        }
    }
});

$('button').click(event => {
    for (let i = 0; i < customs.length; i++) {
        $('#edit')[0].append($(`<input type="number" name="customSlots" value=${customs[i]} hidden />`)[0]);
    }
    $('form')[0].submit();
})