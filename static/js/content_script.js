function clickLogin() {
    var loginBtn = document.getElementById(config.loginButtonDivId);
    var username = document.getElementById(config.usernameDivId);
    var password = document.getElementById(config.passwordDivId);
    if(typeof(loginBtn) !== undefined && loginBtn !== null ){
        username.setAttribute('value',config.usernameValue);
        password.setAttribute('value',config.passwordValue);
        loginBtn.click();
    }    
}

clickLogin();
