var sendRegister = () => {
    let re = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})');
    var register = new window.XMLHttpRequest();
    let uemail = document.getElementById('email').value;
    let uname = document.getElementById('rusername').value;
    let upassword = document.getElementById('rpassword').value;
    let data ={
        email: uemail,
        name: uname
    };
    register.open('post',"/checkreg",false);
    register.setRequestHeader('Content-Type','application/json');
    register.send(JSON.stringify(data));
    let response = JSON.parse(register.response);
    // console.log(response)
    if(response.username) {
        alert('Username is already in use');
        event.preventDefault();
        return false
    } else if (response.email) {
        alert('Email is already in use');
        event.preventDefault();
        return false
    }
    // else if(upassword.search(re) === -1){
    //     alert('Password must contain a uppercase letter, lowercase letter, a number and a special character(!@#\\$%\\^&\\*)')
    //     event.preventDefault();
    //     return false
    // }
}

var sendLogin = () => {
    var register = new window.XMLHttpRequest();
    let uname = document.getElementById('username').value;
    let upassword = document.getElementById('password').value;
    let data = {
        username: uname,
        password: upassword
    };
    register.open('post',"/checklogin",false);
    register.setRequestHeader('Content-Type','application/json');
    register.send(JSON.stringify(data));
    let response = JSON.parse(register.response);
    
    if (response) {
        alert('Incorrect Login');
        event.preventDefault();
        return false
    }
}