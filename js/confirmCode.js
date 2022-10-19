loginForm.onsubmit =  async event => {
    event.preventDefault()
    const email = emailInput.value
    const code = emailCodeInput.value
    let response = await request('/accounts/emailverify', 'POST', {
        email,
        code
    },'formdata')
    console.log(response.token);
    window.localStorage.setItem('token', response.token)
    window.location = 'file:///home/abduhoshim/Temur_project/YouTube_Client/code.html'

}