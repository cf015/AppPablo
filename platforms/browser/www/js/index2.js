var imagenes=[];
var titulos=[];
var urlImg = '';

 var firebaseConfig = {
            apiKey: "AIzaSyDjQ__bBxw8HKI82JLWUp81hUx2hBS8IAg",
            authDomain: "proyectoejemplo-5338b.firebaseapp.com",
            databaseURL: "https://proyectoejemplo-5338b.firebaseio.com",
            projectId: "proyectoejemplo-5338b",
            storageBucket: "",
            messagingSenderId: "1050668543180",
            appId: "1:1050668543180:web:b797a19406e5a7db"
        }
        // Initialize Firebase.
    firebase.initializeApp(firebaseConfig);


var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready')
         navigator.geolocation.getCurrentPosition(app.onSuccess, app.onError)
    },

    onSuccess: function(position){
      var element = document.getElementById('geolocation');
      element.innerHTML = 'Latitude: '           + position.coords.latitude              + '<br />' +
      'Longitude: '          + position.coords.longitude             + '<br />' +
      'Altitude: '           + position.coords.altitude              + '<br />' +
      'Accuracy: '           + position.coords.accuracy              + '<br />' +
      'Altitude Accuracy: '  + position.coords.altitudeAccuracy      + '<br />' +
      'Heading: '            + position.coords.heading               + '<br />' +
      'Speed: '              + position.coords.speed                 + '<br />' +
      'Timestamp: '          + position.timestamp                    + '<br />';
    },

    onError: function(error){
      alert('code: '    + error.code    + '\n' +
      'message: ' + error.message + '\n');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
      document.getElementById("hacer_foto").onclick=hacer_foto;
      document.getElementById("enviarDatos").onclick=enviarDatos;
      document.getElementById("signUpEmail").onclick=register;
      document.getElementById("loginEmail").onclick=login;
       document.getElementById("logOut").onclick=logOut;

      let provisional1=localStorage.getItem("imagenes");
      if(provisional1!=nul && provisional1!=undefined){
          let provisional2=localStorage.getItem("titulos");
          imagenes=provisional1.split("***");
          titulos=provisional2.split("***");
          for (let k=0; k<imagenes.length;k++) {
            document.getElementById("fotos").innerHTML+=
            "<div class='foto'><img src='"+imagenes[k]+"'><div class='titulo' >"+titulos[k]+"</div><div class='icono_borrar'><img src='img/bo.png' onclick='borrar(this.)' ></div></div>";
          }
      }
    }
};

function hacer_foto (){
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI, saveToPhotoAlbum:true	 
    });
}


function register(){

  const auth = firebase.auth();
  const userEmailInput =  document.getElementById("userEmail").value;
  const userPasswordInput =  document.getElementById("userPassword").value;

  auth.createUserWithEmailAndPassword(userEmailInput, userPasswordInput);
}

function login(){

  const auth = firebase.auth();
  const userEmailInput =  document.getElementById("userEmail").value;
  const userPasswordInput =  document.getElementById("userPassword").value;
  auth.signInWithEmailAndPassword(userEmailInput, userPasswordInput);

  auth.onAuthStateChanged(firebaseUser => {
  if (firebaseUser) {
    alert("UsuarioLogeado");
   console.log(firebaseUser.uid);
  } 
  else {
   console.log('not logged in')
  }
});

}

function logOut(){

  const auth = firebase.auth();
  const userEmailInput =  document.getElementById("userEmail").value;
  const userPasswordInput =  document.getElementById("userPassword").value;

  //auth.signInWithEmailAndPassword(userEmailInput, userPasswordInput);
}


function enviarDatos(){

  /*const auth = firebase.auth();
  auth.onAuthStateChanged(firebaseUser => {
  if (firebaseUser) {
    var userId = firebaseUser.uid;
   console.log(firebaseUser.uid);
  } 
  else {
   console.log('not logged in')
  }
  });*/


  var database = firebase.firestore();

  database.collection("registroDatos").add({
    titulo: "TituloEjemplo5",
    ubicacion: "ubicacion5",
    imgUrl: urlImg
  })
  .then(function(docRef) {
    console.log("Document written with ID: ", docRef.id);
})
.catch(function(error) {
    console.error("Error adding document: ", error);
});
  
  /*firebase.database().ref('registroDatos/' + userId).set({
    titulo: "tituloEjemplo2",
    ubicacion: "ubicacionEjemplo2",
    imgUrl : "imgUrlEjemplo3"
  });*/
}

function onPhotoDataSuccess(imageURI) {
    urlImg = imageURI;
    im =imageURI;
    navigator.notification.prompt("Nombre de la Foto: ", acabar_foto, "Titulo", ["OK", "Sin titulo mmvrg"], "");   
    
}

function acabar_foto(contenido){
    let botonpulsado=contenido.buttonIndex;
    let textoescrito=contenido.input1;
    if(botonpulsado==2){
        textoescrito="(Sin titulo)";
    }
    imagenes.push(im);
    titulos.push(textoescrito);
   guardar();
   document.getElementById("fotos").innerHTML+=
    "<div class='foto'><img src='"+im+"'><div class='titulo' >"+textoescrito+"</div><div class='icono_borrar'><img src='img/bo.png' onclick='borrar(this)' ></div></div>";
}

function borrar(clicado){
    let abuelo=clicado.parentNode.parentNode;
    let bisabuelo=abuelo.parentNode;
    let index=Array.prototype.indexOf.call(bisabuelo.children,abuelo);
    imagenes.splice(index,1);
    titulos.splice(index,1);
    abuelo.style.display="none";
    if(titulos.length<1){
        localStorage.removeItem("imagenes");    
        localStorage.removeItem("titulos");
    }else{
        guardar();
    }
    
}

function guardar (){
    let provisional1=imagenes.join("***");
    let provisional2=titulos.join("***");
    localStorage.setItem("imagenes",provisional1);
    localStorage.setItem("titulos", provisional2);
   
}

function onFail(message) {
    alert('Failed because: ' + message);
}


app.initialize();