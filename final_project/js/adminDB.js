// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, set, onValue, update, remove, get, child, } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDuu-fQdykkEJViGD8lT8J9Nw2XE12uJAA",
    authDomain: "licenta-aef78.firebaseapp.com",
    databaseURL: "https://licenta-aef78-default-rtdb.firebaseio.com",
    projectId: "licenta-aef78",
    storageBucket: "licenta-aef78.appspot.com",
    messagingSenderId: "307984639618",
    appId: "1:307984639618:web:990bb02448323cdf7bb69b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const dbRef = ref(database);

var register = document.getElementById('register-btn');


var logged = 0;
var doctor = "";






// employer code should be AceClinic
let code = "";
//store in code the Cod angajare from firebase value
get(child(dbRef, "Cod angajare")).then((snapshot) => {
    if (snapshot.exists()) {

        code = snapshot.val();
    } else {
        console.log("No data available");
    }
})
    .catch((error) => {
        console.error(error);
    });


register.addEventListener('click', function (e) {
    var username = document.getElementById('register-name').value;
    var password = document.getElementById('register-password').value;
    var confPassword = document.getElementById('register-confirm-password').value;
    var employer_code = document.getElementById('register-employer-code').value;
    // check if all the inputs are filled
    if (username == "" || password == "" || confPassword == "" || employer_code == "") {
        Swal.fire({
            icon: 'error',
            title: 'Eroare',
            text: 'Completați toate campurile!',
            showConfirmButton: false,
            timer: 2500
        })
        return;
    }
    if ((password == confPassword) && (employer_code == CryptoJS.AES.decrypt(code, "secret key 123").toString(CryptoJS.enc.Utf8))) {
        var user = {
            username: username,
            password: CryptoJS.AES.encrypt(password, "secret key 123").toString(),
        }
        //check in database if user already exists
        get(child(dbRef, "Utilizatori/" + username)).then((snapshot) => {
            if (snapshot.exists()) {
                Swal.fire({
                    icon: 'error',
                    title: 'Eroare',
                    text: 'Utilizatorul există deja!',
                })
            }
            else {
                logged = 1;
                set(child(dbRef, "Utilizatori/" + username), user);
                document.getElementById("register_form").style.display = 'none';
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Contul a fost realizat cu succes! </br> Acum puteți să vă autentificați!',
                    showConfirmButton: false,
                    timer: 1500
                })
                document.getElementById("login_form").style.display = 'block';
                document.getElementById("login-name").removeAttribute("disabled");
                document.getElementById("login-password").removeAttribute("disabled");
            }
        }
        );

    }
    else {
        Swal.fire({
            icon: 'error',
            title: 'Eroare',
            text: 'Parolele nu coincid sau codul angajării nu este corect!',
            footer: 'Încearcă din nou!'
        })
    }
});

var login = document.getElementById('login-btn');

login.addEventListener('click', function (e) {
    var username = document.getElementById('login-name').value;
    var password = document.getElementById('login-password').value;
    if (username == "" || password == "") {
        Swal.fire({
            icon: 'error',
            title: 'Eroare',
            text: 'Completați toate câmpurile!',
            showConfirmButton: false,
            timer: 2500
        })
        return;
    }
    get(child(dbRef, "Utilizatori/" + username)).then((snapshot) => {
        if (snapshot.exists()) {
            if (CryptoJS.AES.decrypt(snapshot.val().password, "secret key 123").toString(CryptoJS.enc.Utf8) == password) {
                doctor = username;
                logged = 1;
                document.getElementById("login_form").style.display = "none";
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Conectare realizată cu succes, Bine ați venit Dr. ' + username + '!',
                    confirmButtonText:
                        '<i id="log-btn"></i> Ok!',
                })
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Eroare',
                    text: 'Parola este greșită!',
                })
            }
        }
        else {
            Swal.fire({
                icon: 'error',
                title: 'Eroare',
                text: 'Utilizatorul nu există!',
            })
        }
    });


    var table = document.getElementById('table');


    setTimeout(function () {
        if (logged == 1) {
            console.log("logged");
            document.getElementById("doctorData").style.display = "block";
            document.getElementById("title").innerHTML = "Bine ați venit  </br> Dr. " + doctor;
            get(child(dbRef, "Doctori/" + doctor + "/Programari")).then((snapshot) => {
                if (snapshot.exists()) {
                    snapshot.forEach((child) => {
                        var date = child.val().Data_Programarii; 
                        var pacient = child.val().Nume;
                        var hour = child.val().Ora;
                        var phone = child.val().Telefon;
                        var email = child.val().Email;
                        //create a table with all the data
                        var tbodyRef = document.getElementById('table').getElementsByTagName('tbody')[0];
                        var row = document.createElement("tr");
                        row.className = "item";
                        var cell1 = row.insertCell(0);
                        var cell2 = row.insertCell(1);
                        var cell3 = row.insertCell(2);
                        var cell4 = row.insertCell(3);
                        var cell5 = row.insertCell(4);

                        cell1.innerHTML = pacient;
                        cell2.innerHTML = reverseString(date);;
                        cell3.innerHTML = hour;
                        cell4.innerHTML = phone;
                        cell5.innerHTML = email;
                        tbodyRef.appendChild(row);
                    });

                } else {
                    console.log("No data available");
                }
            })
                .catch((error) => {
                    console.error(error);
                }
                );
        }

    }
        , 300);
});
 
flatpickr('#calendar', {
    enableTime: true,
    "locale": "ro",
    minDate: "today",
    minuteIncrement : 30,
    dateFormat: "j-n-Y H:i",
    minTime: "07:00",
    maxTime: "19:30",
    // on change display the date and time
    onClose: function (selectedDates, dateStr, instance) {
        document.getElementById("avDate").addEventListener('click', function (e) {
        var doctor = document.getElementById('login-name').value;
        console.log(dateStr.split(" "));
        set(ref(database ,'Doctori/' + doctor + '/date_calendaristice/' + dateStr.split(" ")[0] + "/" + dateStr.split(" ")[1] ), {
            [dateStr.split(" ")[1]] : 1
          });
          //alert succes
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Data a fost adăugată cu succes!',
                showConfirmButton: false,
                timer: 1000
            })       
    });
}
 });

function reverseString(str) {
    // Step 1. Use the split() method to return a new array
    var splitString = str.split("-"); // var splitString = "hello".split("");
    // ["h", "e", "l", "l", "o"]
 
    // Step 2. Use the reverse() method to reverse the new created array
    var reverseArray = splitString.reverse(); // var reverseArray = ["h", "e", "l", "l", "o"].reverse();
    // ["o", "l", "l", "e", "h"]
 
    // Step 3. Use the join() method to join all elements of the array into a string
    var joinArray = reverseArray.join("-"); // var joinArray = ["o", "l", "l", "e", "h"].join("");
    // "olleh"
    
    //Step 4. Return the reversed string
    return joinArray; // "olleh"
}

// profile function insert data into the database
document.getElementById("profile_btn").addEventListener('click', function (e) {
    var photoSrc = document.getElementById('filename').value;
    var title =     document.getElementById('description_title').value;
    var description = document.getElementById('description_text').value;
    console.log(photoSrc);  
    var doctor = document.getElementById('login-name').value;
    // use set to set the data
    set(ref(database ,'Doctori/' + doctor + '/Profil/'), {
        Titlu: title,
        Descriere: description,
        Poza: photoSrc
    });

});

