$('.description').click(event => {
    this.location.href = `/schedules/${event.target.parentNode.parentNode.id}`;
})