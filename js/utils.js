const API = 'https://you-tube-web-app.herokuapp.com'

async function request(path, method = 'GET', body, option) {
    let response
    if (option !== 'formdata') {
        response = await fetch(API + path, {
            method,
            headers: {
                'Content-Type': 'application/json',
                token: window.localStorage.getItem('token')
            },
            body: JSON.stringify(body) || null
        })
    }

    if (option === 'formdata') {
        const formData = new FormData()
        for (let key in body) {
            formData.append(key, body[key])
        }

        response = await fetch(API + path, {
            method,
            headers: {
                token: window.localStorage.getItem('token')
            },
            body: formData
        })
    }

    if (response.status === 403) {
        window.localStorage.clear()
        window.location = '/login.html'
    }

    response = await response.json()

    return response
}

function CE(...elements) {
    return elements.map(el => document.createElement(el))
}