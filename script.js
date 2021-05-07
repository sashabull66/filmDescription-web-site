const contentArea = document.querySelector('.main__content')
const url = 'https://api.themoviedb.org/3/discover/movie?api_key=c99cf1bb49bf2fded5a5e647873a3dc9&language=ru-US&sort_by=vote_count.desc&page=15'
const urlAdult = 'https://api.themoviedb.org/3/discover/movie?api_key=c99cf1bb49bf2fded5a5e647873a3dc9&language=ru-US&sort_by=popularity.desc&include_adult=true&include_video=true&page=1&with_watch_monetization_types=flatrate'

function sendRequestXhr (method, url, body = null) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url)
        xhr.responseType = 'json'
xhr.setRequestHeader('Content-type', 'application/json')
        xhr.onload = () => {
            if (xhr.status >= 400) {
                reject(xhr.response)
            }
            else {
                resolve(xhr.response)
            }
        }
        xhr.onerror = () => {
            reject(xhr.response)
        }
        xhr.send(JSON.stringify(body))
    })
}

function sendRequestFetch (url) {
    return fetch(url).then( response => {
       return response.json()
    } )
}


function createTwentyElements (url) {
    const xhr = new XMLHttpRequest
    xhr.open('get', url)
    xhr.onload = () => {
        let a = JSON.parse(xhr.response).results
        createContent(a)
    }
    xhr.send()
}

createTwentyElements(url)
createTwentyElements(urlAdult)



createMassive = (massive) => {
    let ans=[];
    massive.map( (a) => {
        ans.push(a)
    })
    return ans
}

let createContent = (someArray) => {
    someArray.map( (a) => {
        let inner = `<p align="center">${a.title}</p>
<img class="poster" src=${'https://image.tmdb.org/t/p/w500'+a.backdrop_path?'https://image.tmdb.org/t/p/w500'+a.backdrop_path:'https://i.pinimg.com/originals/8a/eb/d8/8aebd875fbddd22bf3971c3a7159bdc7.png'} alt="">
<p class="description">${a.overview?a.overview:a.title}</p>
<p>Дата релиза: ${a.release_date}</p>
<p class="rating">${a.vote_average}</p>
`
        let elm = document.createElement('div');
        elm.classList.add('content__item')
        elm.innerHTML=inner;
        contentArea.append(elm)
    } )
}