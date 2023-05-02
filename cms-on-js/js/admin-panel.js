window.addEventListener('DOMContentLoaded', () => {
  // Авторизация пользователя

  const loginForm = document.querySelector('#login')

  loginForm.addEventListener('submit', e => {
    e.preventDefault()
    const login = loginForm.querySelector('input[type="text"]')
    const password = loginForm.querySelector('input[type="password"]')

    if (login.value === 'admin' && password.value === '2') {
      loginForm.parentElement.style.display = 'none'
      const main = document.createElement('main')
      main.innerHTML = `
        <div class="tabs">
            <button class="tab btn create__post">Создать запись</button>
            <button class="tab btn all__posts">Опубликованные записи</button>
        </div>
      
      
        <div class="tabs__wrapper">
      
            <div id="create__post" class="login">
                <h1>Создать запись</h1>
                <form id="post" method="post">
                    <input type="text" name="u" placeholder="Введите заголовок" required="required" />
                    <textarea placeholder="Введите текст" required></textarea>
                    <button type="submit" class="btn btn-primary btn-block btn-large">Опубликовать запись</button>
                </form>
            </div>
      
            <div class="card__wrapper">
                <h1 class="cards__edit">Все записи</h1>
            </div>
        </div>
      `

      document.body.append(main)

      init()
    }
  })

  function init() {

// Создание новой записи
    const postForm = document.querySelector('#post')

    const postData = async data => {
      await fetch('server.php', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: data
      })
    }

// Создаем уникальный id для каждой записи
    let id = 4

// При нажатии на кнопку создается объект записи и добавляется в json-файл
    postForm.addEventListener('submit', e => {
      e.preventDefault()
      const head = postForm.querySelector('input[type="text"]')
      const body = postForm.querySelector('textarea')

      const obj = {}
      obj.title = head.value
      obj.body = body.value
      obj.id = id
      id++

      postData(JSON.stringify(obj))
        .then(() => postForm.reset())
    })

// Отображение всех записей

    function showAllPosts() {
      const cardsWrapper = document.querySelector('.card__wrapper')
      cardsWrapper.innerHTML = ''

      function createCard(title, body, id) {
        return `
    <div class="card">
        <div class="card__title">${title}</div>
        <div class="card__text">${body}</div>
        <div class="card__buttons">
                <button data-id="${id}" class="btn card__btn delete">Удалить</button>
                <button class="btn card__btn edit">Редактировать</button>
        </div>
    </div>
  `
      }

      function clearJsonFile() {
        postData(JSON.stringify({title: 'clear'}))
      }

      fetch('data.json')
        .then(data => data.json())
        .then(res => {
          res.cards.forEach(({title, body, id}) => {
            cardsWrapper.innerHTML += createCard(title, body, id)
          })
          return res
        })
        .then((res) => {
          // Удаление записи
          cardsWrapper.querySelectorAll('.card').forEach((card, i) => {
            card.addEventListener('click', (e) => {
              const target = e.target

              if (target.classList.contains('delete')) {
                target.closest('.card').remove()

                res.cards = res.cards.filter(card => {
                  return card.id !== +target.getAttribute('data-id')
                });

                clearJsonFile()

                res.cards.forEach(card => {
                  postData(JSON.stringify(card))
                })
              }

            })
          })
        })
    }


// Табы "создать" и "показать" запись/записи
    const createPostBtn = document.querySelector('.create__post'),
      showAllPostsBtn = document.querySelector('.all__posts'),
      createPostForm = document.getElementById('create__post'),
      allPosts = document.querySelector('.card__wrapper')

    createPostBtn.addEventListener('click', () => {
      allPosts.style.display = 'none'
      createPostForm.style.display = 'block'
    })

    showAllPostsBtn.addEventListener('click', () => {
      createPostForm.style.display = 'none'
      allPosts.style.display = 'grid'
      showAllPosts()
    })
  }



})