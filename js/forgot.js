loginForm.onsubmit =  async event => {
    event.preventDefault()
    const email = emailInput.value
    let response = await request('/accounts/email', 'POST', {
        email
    },'formdata')
    window.location = 'file:///home/abduhoshim/Temur_project/YouTube_Client/confirmPassword.html'
}