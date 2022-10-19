loginForm.onsubmit =  async event => {
    event.preventDefault()

    const email = emailInput.value.trim()
    const password = passwordInput.value.trim()

    if (!(email && password)) {
        return errorMessage.textContent = 'All fields must be compeleted!'
    }

    let response = await request('/accounts/login', 'POST', {
        email,
        password
    },'formdata')

    loginForm.reset()

    if(response.status > 205) {
        return errorMessage.textContent = response.message
    }
    window.localStorage.setItem('token', response.token)
    // window.localStorage.setItem('avatar', API + '/' + response.data.avatar)

    errorMessage.textContent = response.message
    errorMessage.style.color = 'green'

    setTimeout(() => {
        window.location = 'file:///home/abduhoshim/Temur_project/YouTube_Client/admin.html'
    }, 1000)
}
