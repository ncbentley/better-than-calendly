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

const customs = currentSchedule.customSlots;

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

let modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

$('p').click(event => {
    if (!(event.target.classList.contains('unavailable') || event.target.classList.contains('label') || event.target.classList.contains('taken'))) {
        for (let i = 0; i < 7; i++) {
            if (event.target.parentNode === $('.day')[i]) {
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
                $('#schedule')[0].value = currentSchedule._id;
                $('#time')[0].value = date.toString();
                modal.style.display = "flex";
            }
        }
    }
});