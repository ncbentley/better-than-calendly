$('.description').click(event => {
    this.location.href = `/appointments/${event.target.parentNode.parentNode.id}`;
})