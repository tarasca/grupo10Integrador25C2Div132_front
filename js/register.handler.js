var form = document.getElementById('registerForm');

document.addEventListener('DOMContentLoaded', () => {
    form.addEventListener('submit', registerUser);
    setDeco(4);
});

const API_URL = "http://localhost:3000";

const handleFetch = async (url, options) => {
    return await fetch(url, options).then(handleError);
};

const handleError = (res) => {
    if(!res.ok) throw new Error(res.statusText);
    return res;
};

const errorMsj = {
    correo: {valueMissing: "Es requerido."},
    contraseña: {valueMissing: "Es requerido."}
};

const setDeco = async (range) => {
    let h2 = document.getElementById('deco');
    for(let i = 0; i < range; i++){
        h2.innerText += '⫘⫘⫘⫘⫘⫘'; 
    }
}

const registerUser = async (event) => {
    event.preventDefault();
    
    const obj = {
        correo: document.getElementById("correo").value,
        contraseña: document.getElementById("contraseña").value
    };
    //checkeo de campos
    if(form.checkValidity()){ 
        alert("registro de usuario exitoso.");
        //realiza el post
        try{
            let res = await handleFetch(`${API_URL}/auth/login`,{
                method: "POST",
                headers: {"content-type": "application/json"},
                body: JSON.stringify(obj)
            })
            let register = await res.json();
            console.log(`register Usuario: ${register}`);
            return register;
        }
        catch(err){
            alert(err);
        }
    }
    else{
        const invalidFields = form.querySelectorAll(':invalid');
        invalidFields.forEach( e => {
            let id = e.id;
            const divError = document.getElementById(`error-${id}`);

            if(errorMsj[id]){
                for(let error in e.validity){
                    if(e.validity[error]){
                        divError.textContent =  errorMsj[id][error];
                        break;
                    }
                }
            }
        })
    }
};