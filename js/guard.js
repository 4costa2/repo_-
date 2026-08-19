import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.8/firebase-auth.js";


function verificarUsuario(){

    if(!auth.currentUser){
        location.replace("index.html");
    }

}


onAuthStateChanged(auth, (user)=>{

    if(!user){
        location.replace("index.html");
    }

});


window.addEventListener("pageshow", (event)=>{

    if(event.persisted){
        verificarUsuario();
    }

});