$('.description').click(event => {
    this.location.href = `/appointments/${event.target.parentNode.parentNode.id}`;
});

const params = window.location.search.substring(1).split('&');
let week = 0;
for (let i = 0; i < params.length; i++) {
    if (params[i].substring(0, 4) === 'week') {
        week = params[i].substring(5, params[i].length);
    }
}

let baseTime = new Date()
baseTime.setHours(0)
baseTime.setMinutes(0)
baseTime.setSeconds(0)
baseTime.setMilliseconds(0)
baseTime = baseTime.getTime();
baseTime += ((86400 * 1000 * 7) * week);

const $labels = $('.labels');
const $tags = $labels.children();
for (let i = 0; i < 25; i++) {
    $($tags[i]).addClass('label');
    if (i > 0) {
        // TODO: 12hr format option
        $($tags[i]).text(`${i - 1}:00`.padStart(5, '0'));
    }
}
const now = new Date();
let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
const moved = days.splice(0, now.getDay()); // clever movement to hold correct day order
for (let i = 0; i < moved.length; i++) {
    days.push(moved[i]);
}
for (let i = 0; i < 7; i++) {
    const section = $('.day')[i];
    const date = baseTime + (86400 * 1000 * i);
    const day = [new Date(date).getDate(), new Date(date).getMonth() + 1];
    $(section.children[0]).text(`${days[i]} ${day[1]}/${day[0]}`);
    $(section.children[0]).addClass('label');
}

appointments.forEach(appointment => {
    const time = new Date(appointment.time);
    const difference = time - baseTime;
    if (difference > 0 && difference < (86400 * 1000 * 7)) {
        const day = Math.floor(difference / (86400 * 1000));
        const hour = (difference / 1000) % 86400 / 3600;
        $($('.day')[day].children[hour + 1]).addClass('taken');
        $($('.day')[day].children[hour + 1]).attr("id", appointment._id);
    }
});

$(".taken").click(event => {
    const id = $(event.target).attr("id");
    window.location.href = (`/appointments/${id}`);
});

$('.button-div div').click(event => {
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
    window.location.href = `/appointments/?week=${week}`;
})

$(".container")[0].style.display = "flex";