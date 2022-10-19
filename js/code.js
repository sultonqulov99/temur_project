loginForms.onsubmit =  async event => {
    event.preventDefault()
    const password = passwordInput.value
    let token = window.localStorage.getItem('token')
    console.log(token);
    let response = await request('/accounts/confirmedpassword', 'POST', {
        password
    },'formdata')

    console.log(response);
}