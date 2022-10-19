registerForm.onsubmit = async event => {
    event.preventDefault()

    const firstName = firstnameInput.value.trim()
    const lastName = lastnameInput.value.trim()
    const email = emailInput.value.trim()
    const password = passwordInput.value.trim()
    const image = uploadInput.files[0]

    if (!(firstName && lastName && email && password && image)) {
        return errorMessage.textContent = 'All fields must be compeleted!'
    }

    let response = await request('/accounts/registr', 'POST', {
        firstName,
        lastName,
        email,
        password,
        image
    }, 'formdata')

    registerForm.reset()
    if (response.status > 205) {
        return errorMessage.textContent = response.message
    }

    // window.localStorage.setItem('token', response.token)
    // window.localStorage.setItem('avatar', API + '/' + response.data.avatar)

    errorMessage.textContent = response.message
    errorMessage.style.color = 'green'

    setTimeout(() => {
        window.location = '/admin.html'
    }, 1000)
}
