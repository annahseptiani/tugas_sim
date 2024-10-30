const emailInput = document.querySelector('#emailInput');
const passwordInput = document.querySelector('#passwordInput');
const btnLogin = document.querySelector('#btnLogin');
const message = document.querySelector('#message');
let database = [
    {
        'email':'annah@gmail.com',
        'password':'123'
    },
    {
        'email':'akbar@gmail.com',
        'password':'456'
    },
    {
        'email':'saskia@gmail.com',
        'password':'789'
    }
]
btnLogin.addEventListener('click', ()=>{
    message.innerHTML = '';
    let email = emailInput.value;
    let password = passwordInput.value;
    let validate = true;
    if(email === ''){
        validate = false;
        message.innerHTML += '<div class="alert alert-danger">Email tidak boleh kosong</div>'
    }
    if(password === ''){
        validate = false;
        message.innerHTML += '<div class="alert alert-danger">Password tidak boleh kosong</div>'
    }

    if(validate) {
        let success = {'email':false, 'password':false};
        for(let i=0; i<database.length; i++){
            if(email == database[i]['email']){
                success.email = true;
                if(password == database[i]['password']){
                    success.password = true;
                }
            }
        }
        if(success.email){
            if(success.password){
                document.location.href = 'dashboard.html';
            }else{
                message.innerHTML = '<div class="alert alert-danger">Password Salah</div>'
            }
        }else{
            message.innerHTML = '<div class="alert alert-danger">Email tidak dikenali</div>'
        }
    }
});
