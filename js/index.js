let CACHED_VIDEOS
let CACHED_USERS

const avatar = window.localStorage.getItem('avatar')
avatar && (avatarImg.src = avatar)

async function renderUsers(users, truncate) {
    if (truncate) usersList.innerHTML = null

    for (let user of users) {
        usersList.innerHTML += `
            <li class="channel" onclick="
            (function(){
                window.localStorage.setItem('lastUserId', ${user.id})
                renderVideos(CACHED_VIDEOS.filter(v => v.user.userId == ${user.id}), true)
            })()
            ">
                <a href="#">
                    <img src="${'https://you-tube-web-app.herokuapp.com/' + user.imageUrl}" alt="channel-icon" width="30px" height="30px">
                    <span>${user.firstName}</span>
                </a>
            </li>
        ` 
    }
}

async function renderVideos(videos, truncate) {
    if (truncate) videosList.innerHTML = null
 
    for (let video of videos) {
        const [date, time] = new Date(video.date).toISOString().split('T')
        const readyDate = date.replaceAll('-', '/') + ' | ' + time.slice(0, 5)

        const li = document.createElement('li')
        li.classList.add('iframe')
        li.dataset.id = video.id

        li.innerHTML = `
            <video src="${'https://you-tube-web-app.herokuapp.com/' + video.videoUrl}" controls=""></video>
            <div class="iframe-footer">
                <img src="${'https://you-tube-web-app.herokuapp.com/' + video.user.imageUrl}" alt="channel-icon">
                <div class="iframe-footer-text">
                    <h2 data-id="${video.id}" class="channel-name">${video.name}</h2>
                    <h3 class="iframe-title">${video.user.firstName}</h3>
                    <time class="uploaded-time">${readyDate}</time>
                    <a class="download" href="${API + '/videos/download?file=' + video.link}">
                        <span>${(video.size / 1024 / 1024).toFixed(1)} MB</span>
                        <img src="./img/download.png">
                    </a>
                </div>                  
            </div>
        `

        videosList.append(li)
    }
}

async function getUsers() {
    const users = await request('/users')

    if (!CACHED_USERS) {
        CACHED_USERS = users
        return renderUsers(users, true)
    }
    
    compareUsers(CACHED_USERS, users)
}

async function getVideos() {
    const videos = await request('/videos')

    if (!CACHED_VIDEOS) {
        CACHED_VIDEOS = videos

        updateDataSet(CACHED_VIDEOS)
        return renderVideos(videos, true)
    }

    compareVideos(CACHED_VIDEOS, videos)
}

async function compareUsers(oldUsers, newUsers) {
    if (oldUsers.length < newUsers.length) {
        CACHED_USERS = newUsers
        return renderUsers(newUsers.slice(oldUsers.length), false)
    }
}

async function compareVideos(oldVideos, newVideos) {
    for (let index in oldVideos) {
        const oldEl = oldVideos[index]

        const newEl = newVideos.find(video => video.videoId == oldEl.videoId)
        if (newEl) {
            if (newEl.title === oldEl.title) continue
            
            oldEl.title = newEl.title
            updateVideo(newEl)
        } 

        oldVideos.splice(index, 1)
        deleteVideo(oldEl)
    }

    if (oldVideos.length < newVideos.length) {
        updateDataSet(CACHED_VIDEOS)
        renderVideos(
            newVideos.slice(oldVideos.length).filter(video => {
                const lastUserId = window.localStorage.getItem('lastUserId')
                return lastUserId ? video.user.userId == lastUserId : true
            }),
            false
        )
        CACHED_VIDEOS = newVideos
    }
}

async function updateVideo(video) {
    const interfaceVideo = document.querySelector(`h2[data-id="${video.videoId}"]`)
    if(interfaceVideo) interfaceVideo.textContent = video.title
}

async function deleteVideo(video) {
    const interfaceVideo = document.querySelector(`li[data-id="${video.videoId}"]`)
    if(interfaceVideo) interfaceVideo.remove()
}

async function updateDataSet(videos) {
    datalist.innerHTML = null
    for (let video of videos) {
        let option = document.createElement('option')
        option.value = video.title

        datalist.append(option)
    }
}

async function search(value) {
    return renderVideos(CACHED_VIDEOS.filter(v => v.title.toLowerCase().includes(value.toLowerCase())), true)
}

searchForm.onsubmit = event => {
    event.preventDefault()
    const value = searchInput.value.trim()

    if (value) search(value)
    else searchInput.value = ''
}

searchInput.onkeyup = event => {
    if (!event.target.value) {
        const lastUserId = window.localStorage.getItem('lastUserId')
        renderVideos(CACHED_VIDEOS.filter(v => lastUserId ? v.user.userId == lastUserId : true), true)
    }
}

micButton.onclick = () => {
    const voice = new webkitSpeechRecognition()
    voice.lang = 'uz-UZ'
    voice.continues = false
    voice.start()

    voice.onresult = result => {
        const res = result.results[0][0].transcript.trim()
        searchInput.value = res
        search(res)
    }
}

setInterval(() => {
    getUsers()
    getVideos()
}, 1000)