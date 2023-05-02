const cardsWrapper = document.querySelector('.card__wrapper')

function createCard(title, body) {
  return `
    <div class="card">
        <div class="card__title">${title}</div>
        <div class="card__text">${body}</div>
    </div>
  `
}


fetch('data.json')
  .then(data => data.json())
  .then(res => {
    res.cards.forEach(({title, body}) => {
      cardsWrapper.innerHTML += createCard(title, body)
    })
})