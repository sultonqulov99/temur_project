async function renderVideos(videos, truncate) {
    if (truncate) videosList.innerHTML = null

    for (let video of videos) {
        const li = document.createElement('li')
        li.classList.add('video-item')
            
        li.innerHTML = `
            <video controls="true" src="${API + '/' + video.link}"></video>
            <p onkeydown="updateVideo(event, ${video.videoId})" class="content" contenteditable="true">${video.title}</p>
            <img onclick="deleteVideo(event, ${video.videoId})" class="delete-icon" src="./img/delete.png" width="25">
        `

        videosList.append(li)
    }
}

async function updateVideo(event, videoId) {
    const title = event.target.textContent.trim()

    if (event.keyCode !== 13 || !title) return

    event.target.textContent = title
    event.target.blur()

    let response = await request('/admin/videos/' + videoId, 'PUT', {
        title
    })
    
    if(response.status > 205) {
        return errorMessage.textContent = response.message
    }
}

async function deleteVideo(event, videoId) {
    let response = await request('/admin/videos/' + videoId, 'DELETE')
    
    if(response.status > 205) {
        return errorMessage.textContent = response.message
    }

    event.target.parentNode.remove()
}

videoForm.onsubmit = async event => {
    event.preventDefault()

    const title = videoInput.value.trim()
    const file = uploadInput.files[0]

    if (!(title && file)) {
        return errorMessage.textContent = 'All fields must be compeleted!'
    }

    if (title.length > 50) {
        return errorMessage.textContent = 'Invalid title!'
    }

    if (file.size > 50_000_000) {
        return errorMessage.textContent = 'File is too large!'
    }

    videoForm.reset()

    const response = await request('/admin/videos', 'POST', {
        title,
        file
    }, 'formdata')

    if (response.status > 205) {
        return errorMessage.textContent = response.message
    }

    renderVideos([response.data], false)
    errorMessage.textContent = null
}

async function getVideos() {
    const videos = await request('/admin/videos')
    renderVideos(videos, true)
}

logoutBtn.onclick = () => {
    window.localStorage.clear()
    window.location = '/login.html'
}

getVideos()