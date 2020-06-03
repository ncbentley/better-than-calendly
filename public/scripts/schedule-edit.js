const params = window.location.search.substring(1).split('&');
let week = 0;
for (let i = 0; i < params.length; i++) {
    if (params[i].substring(0, 4) === 'week') {
        week = params[i].substring(5, params[i].length);
    }
}

const appointments = currentSchedule.appointments;
let baseTime = new Date()
baseTime.setHours(0)
baseTime.setMinutes(0)
baseTime.setSeconds(0)
baseTime.setMilliseconds(0)
baseTime = baseTime.getTime();
baseTime += ((86400*1000*7) * week);

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
let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
const moved  = days.splice(0, now.getDay()); // clever movement to hold correct day order
for (let i = 0; i < moved.length; i++) {
    days.push(moved[i]);
}
for (let i = 0; i < 7; i++) {
    const section = $('.day')[i];
    const date = baseTime + (86400*1000*i);
    const day = [new Date(date).getDate(), new Date(date).getMonth()+1];
    $(section.children[0]).text(`${days[i]} ${day[1]}/${day[0]}`);
    $(section.children[0]).addClass('label');
    for (let j = 1; j <= currentSchedule.openTime; j++) {
        $(section.children[j]).addClass('unavailable');
    }
    for (let j = 24; j > currentSchedule.closeTime; j--) {
        $(section.children[j]).addClass('unavailable');
    }
}

let customs = currentSchedule.customSlots;

appointments.forEach(appointment => {
    const time = new Date(appointment.time);
    const difference = time - baseTime;
    if (difference > 0 && difference < (86400*1000*7)) {
        const day = Math.floor(difference / (86400*1000));
        const hour = (difference / 1000) % 86400 / 3600;
        $($('.day')[day].children[hour+1]).addClass('taken');
    }
});
customs.forEach(custom => {
    const time = new Date(custom);
    const difference = time - baseTime;
    if (difference > 0 && difference < (86400*1000*7)) {
        const day = Math.floor(difference / (86400*1000));
        const hour = (difference / 1000) % 86400 / 3600;
        $($('.day')[day].children[hour+1]).toggleClass('unavailable');
    }
});

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

$('.button-div div').click(event => {
    for (let i = 0; i < customs.length; i++) {
        $('#edit')[0].append($(`<input type="number" name="customSlots" value=${customs[i]} hidden />`)[0]);
    }
    $.ajax({
        url: `/schedules/${currentSchedule._id}?_method=PUT`,
        type: 'POST',
        data: $('form').serialize(),
        success: function() { 
            let direction = '';
            try {
                direction = event.target.children[0].classList[0];
            } catch (error) {
                direction = event.target.classList[0];
            }
            if (direction === 'next') {
                week++;
            } else {
                week--;
            }
            window.location.href = `/schedules/${currentSchedule._id}/edit?week=${week}`;
        }
    });
});

$('main')[0].style.display = 'flex';