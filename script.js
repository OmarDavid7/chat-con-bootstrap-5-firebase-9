 
const btnSalir = document.getElementById("btnSalir");
const btnIngresar = document.getElementById("btnIngresar");
const chat = document.getElementById("chat");
const formulario = document.getElementById("formulario");
const btnEnviar = document.getElementById("btnEnviar");
const texto = document.getElementById("texto");
const imagen = document.getElementById("imagen");
const template = document.getElementById("template");

 
 import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
 import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup, 
    onAuthStateChanged,
    signOut
} from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js'
 import { 
    getFirestore, 
    collection, 
    addDoc, 
    query, 
    onSnapshot,
    orderBy
} from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js'

 const firebaseConfig = {
   apiKey: "AIzaSyDghV1WoUxdF5m9HueZJkeVTEPteYTXeyY",
   authDomain: "chat-friends-28826.firebaseapp.com",
   projectId: "chat-friends-28826",
   storageBucket: "chat-friends-28826.appspot.com",
   messagingSenderId: "178521794835",
   appId: "1:178521794835:web:fd40e9728a7b39642bd2e6"
 };

 let unsubscribe;

 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const auth = getAuth(app);
 const db = getFirestore(app);

 const eliminarElemento = (elemento)=>{
    elemento.classList.add("d-none");
 }

 const visualizarElemento = (elemento)=>{
    elemento.classList.remove("d-none")
 }

 onAuthStateChanged(auth, (user) => {
    if (user) {
        visualizarElemento(btnSalir);
        eliminarElemento(btnIngresar);
        visualizarElemento(formulario)
        visualizarElemento(chat)
        eliminarElemento(texto);
        eliminarElemento(imagen);

    const q = query(collection(db, "chats"), orderBy("fecha"));
    chat.innerHTML = "";
        unsubscribe = onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
              console.log("New msg: ", change.doc.data());
              
              //manipulando el template
              const clone = template.content.cloneNode(true);
              clone.querySelector("span").textContent = change.doc.data().msg;
              if(user.uid === change.doc.data().uid){
                clone.querySelector("div").classList.add("text-end");
                clone.querySelector("span").classList.add("bg-success");
              }else{
                clone.querySelector("div").classList.add("text-start");
                clone.querySelector("span").classList.add("bg-secondary");
              }
              chat.append(clone);
          }

          chat.scrollTop = chat.scrollHeight;
        });
      });
  

    } else {
        visualizarElemento(btnIngresar);
        eliminarElemento(btnSalir);
        eliminarElemento(formulario);
        eliminarElemento(chat)
        visualizarElemento(imagen);
        visualizarElemento(texto);

        if(unsubscribe){
            unsubscribe();
        }
    }
  });
 
 btnIngresar.addEventListener("click", async ()=>{
     try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        console.log(result);
    } catch (error) {
        console.log(error)
    }
 });

 btnSalir.addEventListener(("click"), async()=>{
    await signOut(auth);
 });

formulario.addEventListener(("submit"), async(e)=>{
    e.preventDefault();
    if(!formulario.msg.value.trim()){
        formulario.msg.value = "";
        formulario.msg.focus();
        return console.log("Tienes que escribir algo");
    }
    try {
        btnEnviar.disabled = true
        await addDoc(collection(db,"chats"),{
            msg: formulario.msg.value.trim(),
            uid: auth.currentUser.uid,
            fecha: new Date(),
        });
        formulario.msg.value = "";
    } catch (error) {
        console.log(error);
    }
    finally{
        btnEnviar.disabled = false;
    }
})