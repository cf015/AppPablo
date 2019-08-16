
var urlImg = '';
var titulo = '';
var date2 = '';
var coordenadas = [];
var urlAudioPrueba = '';
var arrayContact = [];
var arrayDatos = [];
var db = window.openDatabase("tutorialdb", "1.0", "tutorial database", 1000000); //will create database tutorialdb or open it

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
      var takePhoto = document.getElementById('takePhoto');
      takePhoto.addEventListener('click', app.takePhoto, false);
      var imagenGuardada = document.getElementById('photoLibrary');
      imagenGuardada.addEventListener('click', app.findPhoto, false);
      var enviarDatos = document.getElementById('enviarDatos');
      enviarDatos.addEventListener('click', app.enviarDatos, false);
      var contactoUser = document.getElementById('contactoUser');
      contactoUser.addEventListener('click', app.contactUser, false);
    },

    takePhoto: function(){

      navigator.camera.getPicture(app.onPhotoDataSuccess, app.onFail, { quality: 20, 
        destinationType: Camera.DestinationType.DATA_URLFILE_URI, saveToPhotoAlbum:true });
    },

    findPhoto: function(){
      navigator.camera.getPicture(app.photoSuccess, app.onFailPhoto, {
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
           destinationType: Camera.DestinationType.FILE_URI,
            targetWidth: 300,
            targetHeight: 300,
             quality:100,
             correctOrientation: true,
             saveToPhotoAlbum: true,
             cameraDirection: 1,

      })
    },

    photoSuccess: function(imageData){

      urlImg = imageData;

      var photo2 = document.getElementById('photo');

        photo2.style.display = 'block';

        photo2.src = imageData;

         navigator.globalization.dateToString(

        new Date(),

        function (date) {
          date2 = date.value;
          alert(date2);
          //alert('date: ' + date.value + '\n');
        },

        function () {
          alert('Error getting dateString\n'),
        {formatLength:'short', selector:'date and time'}
      }

    );

    },


    onPhotoDataSuccess: function(imageData) {
         
        urlImg = imageData;

        var photo = document.getElementById('photo');

        photo.style.display = 'block';

        photo.src = imageData;

         navigator.globalization.dateToString(

        new Date(),

        function (date) {
          date2 = date.value;
          alert(date2);
          //alert('date: ' + date.value + '\n');
        },

        function () {
          alert('Error getting dateString\n'),
        {formatLength:'short', selector:'date and time'}
      }

    );
        
     },

     onFail: function(message) {
        alert('Failed because: ' + message);
     },

     onFailPhoto: function(message) {
        alert('Failed because: ' + message);
     },

     contactUser: function(){
       navigator.contacts.pickContact(function(contact){
            //alert('The following contact has been selected:' + JSON.stringify(contact['phoneNumbers'][0]['value']));
            var nombreContact = JSON.stringify(contact['name']['formatted']);
            var numberContact = JSON.stringify(contact['phoneNumbers'][0]['value']);

            arrayContact.push(nombreContact);
            arrayContact.push(numberContact);
            document.getElementById('nameContact').innerHTML = arrayContact[0];
            document.getElementById('contactNumber').innerHTML = arrayContact[1];

        },
        function(err){
            console.log('Error: ' + err);
        });
     },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        navigator.geolocation.getCurrentPosition(app.onSuccess, app.onError);

         db.transaction(populateDB, errorCB, successCB);

        function populateDB(tx){

           tx.executeSql('CREATE TABLE IF NOT EXISTS tests (id INTEGER ,titulo TEXT , coordenadas TEXT , audioPrueba TEXT, date TEXT, contact TEXT, urlImage TEXT)');
        }

        function errorCB(err) {
         alert("Error processing SQL: "+err.code);
        }

        function successCB() {
          alert("success!");
        }
    },

    onSuccess: function(position){
      var element = document.getElementById('geolocation');
      coordenadas.push(position.coords.latitude);
      coordenadas.push(position.coords.longitude);

      element.innerHTML = 
      'Latitude: ' + coordenadas[0] + '<br />' +
      'Longitude: ' + coordenadas[1] + '<br />';
    },

    onError: function(error){
      alert('code: '    + error.code    + '\n' +
      'message: ' + error.message + '\n');
    },

    enviarDatos: function(){

    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {

      document.getElementById("signUpEmail").onclick=register;
      document.getElementById("loginEmail").onclick=login;
      document.getElementById("logOut").onclick=logOut;
      document.getElementById("enviarDatos").onclick=enviarDatos;
      document.getElementById("obtenerDatos").onclick=obtenerDatos;
      document.getElementById("insertarDatos").onclick=insertarDatos;
      document.getElementById("obtenerDatosTabla").onclick=obtenerDatosTabla;
      document.getElementById("borrarDatos").onclick=borrarDatos;
    }

};


function register(){

}

function login(){

   $('#contenido').show(); 
     $('#emailRegister').hide();
     $('#buttonsRegister').hide();   

}

function logOut(){
   $('#emailRegister').show();
    $('#buttonsRegister').show(); 
    $('#contenido').hide();   

}

function enviarDatos(){

    db.transaction(function(tx){
 
 tx.executeSql("select * from tests",[],function(tx,result){

   var url = "http://172.16.24.16:8000/api/test";
   var len = result.rows.length;
 
   for (var i=0; i<len; i++){
    var test = result.rows.item(i).audioPrueba;

    $.ajax({
      
        type:"POST",
        url: url,
        dataType: "json",
        data: {
          "titulo": result.rows.item(i).titulo,
          "coordenadas": result.rows.item(i).coordenadas,
          "audioPrueba": result.rows.item(i).audioPrueba,
          "date": result.rows.item(i).date,
          "contact": result.rows.item(i).contact,
          "urlImage": result.rows.item(i).urlImage
        },

        success: function(resp){
          alert("Datos subidos correctamente.");
          db.transaction(function(transaction) {
            transaction.executeSql("DELETE FROM tests", [],
            function(tx, result) {
              alert("Registro eliminado.");
              $(location).attr('href','index.html');

            },

          function(error){
            alert('Something went Wrong');
          });

          });  
        },
        error: function(){
          alert("Error");
        }
      })
   }
 
 });
});

}

function obtenerDatos(){

   navigator.device.capture.captureAudio(captureSuccess, captureError, {limit: 2});
}

function captureSuccess(mediaFiles) {
        var i, len;
        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
            //alert(JSON.stringify(mediaFiles[i]['fullPath']));
            urlAudioPrueba = JSON.stringify(mediaFiles[i]['fullPath']);
        }
    }

function captureError(error) {
        var msg = 'An error occurred during capture: ' + error.code;
        navigator.notification.alert(msg, null, 'Uh oh!');
    }

 /*function uploadFile(mediaFile) {
        var ft = new FileTransfer(),
            path = mediaFile.fullPath,
            name = mediaFile.name;

        ft.upload(path,
            "http://192.168.0.107:8000/api/test",
            function(result) {
                console.log('Upload success: ' + result.responseCode);
                console.log(result.bytesSent + ' bytes sent');
            },
            function(error) {
                console.log('Error uploading file ' + path + ': ' + error.code);
            },
            { fileName: name });
    }*/



function insertarDatos(){

  db.transaction(insertNote, errorCB, successCB);

function insertNote(tx){
 var titulo2 = document.getElementById('title').value;

   tx.executeSql("INSERT INTO tests (titulo,coordenadas,audioPrueba,date,contact,urlImage) VALUES (?,?,?,?,?,?)",[titulo2,coordenadas,urlAudioPrueba,date2,arrayContact,urlImg]);
}

function errorCB(err) {
 alert("Error processing SQL: "+err.code);
}

function successCB() {
  alert("elemento guardado");
}
}


function obtenerDatosTabla(){

  db.transaction(function(tx){
 
 tx.executeSql("select * from tests",[],function(tx,result){

  var len = result.rows.length;
    
  var titleObtener = document.getElementById("titleImg");
   titleObtener.innerHTML = 'Numero de registros a subir' + " " + len;

   for (var i=0; i<len; i++){
    var test = result.rows.item(i).audioPrueba;
    // Add list item
      var ul = document.getElementById("list");
      var li = document.createElement("li");
      li.appendChild(document.createTextNode(test));
      ul.appendChild(li);
   }
 
 });
});
}

function borrarDatos(){

db.transaction(function(transaction) {
  transaction.executeSql("DELETE FROM tests", [],
  function(tx, result) {
    alert("Registro eliminado.");
    $(location).attr('href','index.html');
  },

  function(error){
    alert('Something went Wrong');
  });

});

}



