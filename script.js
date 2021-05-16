let contentArea = document.querySelector('.main__content');
let paginatorArea = document.querySelector('.paginator');
let contentItem = document.querySelectorAll('.content__item');
const paginatorOneBtn = document.querySelector('#page1');
const allContentInPage = document.querySelector('.wrapper');
const body = document.querySelector("body");
const sortSelector = document.querySelector('#sort')
const logInBtn = document.querySelector('#login_btn')

let usersAccounts = {
    user1: {
        id: 1,
        login: 'Admin',
        password: 665544,
        status: 'admin',
        eMail: 'admin@main.com'
    },
    user2: {
        id: 2,
        login: 'Elephant',
        password: 12345,
        status: 'user',
        eMail: 'elephant@user.com'
    },
    user3: {
        id: 3,
        login: 'Rhino',
        password: 12345,
        status: 'user',
        eMail: 'rhino@user.com'
    },
}

function firstInit(someArr) {
    localStorage.clear();
    localStorage.setItem('usersAccounts', JSON.stringify(usersAccounts))
    someArr = JSON.parse(localStorage.getItem('usersAccounts'))
    return someArr
}

const localSTR = {
    sortSettings: 'none', // тут хранить настройки сортировки (дефолт none)
    currentPage: 1, // тут хранить значение текущего номера страницы с контентом
    savedPages: {}, // тут кешируются страницы
    url: {
        'none': 'https://api.themoviedb.org/3/discover/movie?api_key=c99cf1bb49bf2fded5a5e647873a3dc9&language=ru-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=',
        'vote_average.desc': 'https://api.themoviedb.org/3/discover/movie?api_key=c99cf1bb49bf2fded5a5e647873a3dc9&language=ru-US&sort_by=vote_average.desc&include_adult=false&include_video=false&page=',
        'vote_average.asc': 'https://api.themoviedb.org/3/discover/movie?api_key=c99cf1bb49bf2fded5a5e647873a3dc9&language=ru-US&sort_by=vote_average.asc&include_adult=false&include_video=false&page=',
        'release_date.desc': 'https://api.themoviedb.org/3/discover/movie?api_key=c99cf1bb49bf2fded5a5e647873a3dc9&language=ru-US&sort_by=release_date.desc&include_adult=false&include_video=false&page=',
        'release_date.asc': 'https://api.themoviedb.org/3/discover/movie?api_key=c99cf1bb49bf2fded5a5e647873a3dc9&language=ru-US&sort_by=release_date.asc&include_adult=false&include_video=false&page=',
    }
};

sortSelector.addEventListener('change', (event) => {
    localSTR.sortSettings = event.currentTarget.value;

    pageRender(localSTR.currentPage, localSTR.sortSettings)
})

contentArea.addEventListener('click', (event) => { // слушатель клика на блок с контентом
    if (event.target !== event.currentTarget) { // если клик был не мимо элементов контента
        allContentInPage.classList.toggle('hardHide') // скрыть весь контент
        let modalWindowWrapper = document.createElement('div') // создать див
        modalWindowWrapper.classList.add('modal__wrapper') // добавить диву класс
        let modalWindow = document.createElement('div') // создать див2
        modalWindow.classList.add('modal__window') // добавить диву2 класс
        modalWindow.innerHTML = event.target.closest('.content__item').innerHTML // в див2 вставить все содержимое элемента по которому был клик
        modalWindowWrapper.append(modalWindow) // добавить див2 в див
        body.append(modalWindowWrapper) // добавить этот див внутрь body
    } else if (event.target === event.currentTarget) { // если клик был не по элементам контента
        return null // вернуть null
    }
    document.querySelector('.modal__wrapper').addEventListener('click', (event) => { // добавить слушатель
        allContentInPage.classList.remove('hardHide') // отобразить весь контент
        body.lastElementChild.remove() // удлить модалку
    })


})

window.onload = () => { // после загрузки страницы
    sortSelector.value = 'none' // сортировщик в положение none
    paginatorOneBtn.click() // эмуляция клика на первую кнопку в пагинаторе при загрузке страницы
}

paginatorArea.addEventListener('click', (event) => {
    if (event.target === event.currentTarget || event.target.id === 'left' || event.target.id === 'right') {
        return null
    } // защита от клика мимо цифровых кнопок пагинации
    else {
        localSTR.currentPage = parseInt(event.target.innerText) // присвоить переменной счетчику цифровое значение кликнутой кнопки
        paginatorArea.childNodes.forEach((children) => {
            children.classList = 'paginator__btn' // присвоить всем кнопкам базовый класс
        })
        event.target.classList.add('active') // присвоить кликнутой кнопке класс active
        pageRender(localSTR.currentPage, localSTR.sortSettings)
    }
})

const newXMLHttpRequest = (urlAddress) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest
        xhr.open('get', urlAddress)
        xhr.onload = () => {
            if (xhr.status >= 400) {
                reject(xhr.response)
            } else {
                resolve(xhr.response)
            }
        }
        xhr.send()
    })
}

const createContent = (someArray) => {
    contentArea.innerHTML = ''; // очистить весь контент
    someArray.map((a) => {
        let inner = `<p class="title">${a.title}</p>
<img class="poster" src=${'https://image.tmdb.org/t/p/w500' + a.poster_path && a.poster_path != null ? 'https://image.tmdb.org/t/p/w500' + a.poster_path : 'https://sun9-20.userapi.com/impg/876v8pITxlaCwYzYTx9AMZtbbetQ3tL1eO26-Q/wRvY7oCaNKk.jpg?size=500x750&quality=96&sign=b0bdb851991d936cd1e83349907988ce&type=album'} alt="">
<p class="description">${a.overview ? a.overview : a.title}</p>
<div class="hover">
<p class="release_data">Дата релиза: ${a.release_date}</p>
<p class="rating">Рейтинг ${a.vote_average}</p>
</div>
<p class="genres">Жанр ${a.genre_ids}</p>
<p class="popularity">Популярность ${a.popularity}</p>
<p class="vote_count">${a.vote_count}</p>
`
        let elm = document.createElement('div');
        elm.classList.add('content__item')
        elm.innerHTML = inner;
        contentArea.append(elm)
    })
}

const pageRender = () => {
    let currentUrl = localSTR.url[localSTR.sortSettings] + localSTR.currentPage // текущий адрес = адрес с фильтром + номер текущ. стр
    newXMLHttpRequest(currentUrl) // сделать запрос на сервер
        .then((answer) => { // после успешного запроса на серв...
            createContent(JSON.parse(answer).results); // создать контент из ответа серва
            //localSTR.savedPages[localSTR.currentPage] = JSON.parse(answer).results; // записать в кэш образ ответа
        })
}

function signIn() {
    let allContentInPage = document.querySelector('.wrapper');
    allContentInPage.querySelectorAll('*').forEach((el)=>{
        el.classList.add('hardHide')
    }) // скрыть весь контент
    let x = document.createElement('div')
    x.innerHTML = `<div class="modal__wrapper">
                        <div class="login_wnd">
                          <input id="login">
                          <input id="password">
                          <button id="subm">logIn</button>
                        </div>
                      </div>` // добавить этот див внутрь body
    allContentInPage.append(x)
    const modalWrapper = document.querySelector('.modal__wrapper');
    modalWrapper.addEventListener('click', (event)=>{
        if (event.currentTarget === event.target) {
            x.remove()
            allContentInPage.querySelectorAll('*').forEach((el)=>{
                el.classList.remove('hardHide')
            })
        }
    })


}

logInBtn.addEventListener('click', (event) => {
    event.target.classList.add('hardHide')
    signIn()
})