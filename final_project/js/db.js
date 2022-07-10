// Import the functions you need from the SDKs you need
import { initializeApp} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, set, onValue, update, remove, get, child } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import "https://cdn.jsdelivr.net/npm/flatpickr"
import "https://npmcdn.com/flatpickr/dist/l10n/ro.js"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
flatpickr.localize(flatpickr.l10ns.ro);
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
let doctori = document.getElementById("dr_id");
let date_calendaristice = document.getElementById("calendar");
let ore_disponibile = document.getElementById("available_hours");
// show doctors in option group with id=dr_id
get(child(dbRef, "Doctori/")).then((snapshot) => {
    let option = document.createElement("option");
    if (snapshot.exists()) {
        snapshot.forEach((child) => {
            option = document.createElement("option");
            option.text = child.key;
            doctori.add(option);
        });
    } else {
        console.log("No data available");
    }
})
    .catch((error) => {
        console.error(error);
    });
var s = new Array();
document.getElementById("dr_id").addEventListener("change", function () {
    date_calendaristice.value = "";
    ore_disponibile.innerHTML = "";
    let option = document.createElement("option");
    option.text = "Selectati ora dorita";
    option.disabled = true;
    option.selected = true;
    option.hidden = true;
    ore_disponibile.add(option);
    s = getDatesFromDoctors();
    setTimeout(function () {
        // set a timeout to wait for the data to be loaded
        flatpickr('#calendar', {
            "locale": "ro",
            minDate: "today",
            inline: true,
            dateFormat: "j-n-Y",
            enable: [
                function (date) {
                    // return true to enable
                    return s.includes(date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear());
                }
            ]
        });
    }, 300);
});
// get selected doctor and return childs in date_calendaristice
function getDatesFromDoctors() {
    var av_dates = new Array();
    var x = "";
    // date_calendaristice.innerHTML = "";
    let doctor = doctori.value;
    // let option = document.createElement("option");
    // option.text = "";
    // date_calendaristice.add(option);
    get(child(dbRef, "Doctori/" + doctor + "/date_calendaristice/")).then((snapshot) => {
        if (snapshot.exists()) {
            snapshot.forEach((child) => {
                av_dates.push(child.key);
                x += child.key;
                // console.log(x);
                // console.log(av_dates[av_dates.length-1]);
                // option = document.createElement("option");
                // console.log(date[a]);
                // let option = document.createElement("option");
                // option.text = child.key;
                // date_calendaristice.add(option);
            });
            // return x.date;
        } else {
            console.log("No data available");
        }
        // console.log(av_dates);
        // return av_dates ;
    })
        .catch((error) => {
            console.error(error);
        });
    // return the av_dates array outside the function
    // console.log(x);
    return av_dates;
}
//get selected doctor and date and return childs in ore_disponibile
date_calendaristice.addEventListener("change", () => {
    ore_disponibile.innerHTML = "";
    let doctor = doctori.value;
    let data = date_calendaristice.value;
    let option = document.createElement("option");
    option.text = "Selectați ora dorită";
    option.disabled = true;
    option.selected = true;
    option.hidden = true;
    option.value = "";
    ore_disponibile.add(option);
    get(child(dbRef, "Doctori/" + doctor + "/date_calendaristice/" + data + "/")).then((snapshot) => {
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                // console log grandchilds
                get(child(dbRef, "Doctori/" + doctor + "/date_calendaristice/" + data + "/" + childSnapshot.key + "/")).then((snapshot) => {
                    if (snapshot.exists()) {
                        snapshot.forEach((child) => {
                            if (child.val() == 1) {
                                option = document.createElement("option");
                                option.text = child.key;
                                ore_disponibile.add(option);
                            }
                        });
                    } else {
                        console.log("No data available");
                    }
                })
                    .catch((error) => {
                        console.error(error);
                    });
            });
        } else {
            console.log("No data available");
        }
    })
        .catch((error) => {
            console.error(error);
        });
});
var saveData = document.getElementById("saveData");
// buton programare, salveaza datele in baza de date
saveData.addEventListener('click', (e) => {
    // check for all the fields to have something in them
    let doctor = doctori.value;
    let data = date_calendaristice.value;
    let ora = ore_disponibile.value;
    let firstName = document.getElementById('patient_name');
    let phone = document.getElementById('patient_phonenumber');
    let email = document.getElementById('patient_email');
    // pattern for email address
    var pattern = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (doctori.value == "") {
        Swal.fire({
            icon: 'error',
            title: 'Eroare',
            text: 'Trebuie să selectați un medic!',
            confirmButtonText: 'Ok'
        })
        return;
    }
    if (date_calendaristice.value == "") {
        Swal.fire({
            icon: 'error',
            title: 'Eroare',
            text: 'Trebuie să selectați o dată calendaristică!',
            confirmButtonText: 'Ok'
        })
        return;
    }
    if (ore_disponibile.value == "") {
        Swal.fire({
            icon: 'error',
            title: 'Eroare',
            text: 'Trebuie să selectați o oră!',
            confirmButtonText: 'Ok'
        })
        return;
    }
    if (firstName.value == "") {
        Swal.fire({
            icon: 'error',
            title: 'Eroare',
            text: 'Trebuie să introduci un nume!',
            confirmButtonText: 'Ok'
        })
        return;
    }
    if (phone.value == "" || phone.value.length != 10) {
        Swal.fire({
            icon: 'error',
            title: 'Eroare',
            text: 'Trebuie să introduci un număr de telefon corect!',
            confirmButtonText: 'Ok'
        })
        return;
    }
    // method to check if email is valid
    if (email.value == "" || !pattern.test(email.value)) {
        Swal.fire({
            icon: 'error',
            title: 'Eroare',
            text: 'Trebuie să introduci un email valid!',
            confirmButtonText: 'Ok'
        })
        return;
    }
    // if all the fields are filled, save the data
    var codProgramare = randomClientAppCode();
    set(ref(database, 'Doctori/' + doctor + '/Programari/' + codProgramare), {
        Nume: firstName.value,
        Telefon: phone.value,
        Email: email.value,
        Data_Programarii: date_calendaristice.value,
        Ora: ore_disponibile.value,
        Cod_Programare: codProgramare
    });
        // schimba valabilitatea intervalelor orare pentru doctorul selectat
    let hourAvailability = ref(database, "Doctori/" + doctor + "/date_calendaristice/" + data + "/" + ora + "/" + ora);
    set(hourAvailability, 0);
    // console.log('Doctori/' + doctor + '/Programari/' + codProgramare);
    Swal.fire({
        icon: 'success',
        title: 'Felicitări',
        html: 'Programare realizată cu succes, vă mulțumim!' + '<br/> <strong>' + codProgramare + ' </strong><br/>' +  " Acesta este codul dumneavoastră de programare, îl puteți folosi pentru a vedea programarea dumneavoastră.",
        confirmButtonText: `Ok`,
    }).then((result) => {  
        
        if (result.isConfirmed) {    
            window.location.reload(true);    
        } 
    });
});
document.getElementById("checkData").addEventListener('click', (e) => {
    // check the code for the patient   
    // get the code from the input field
    //simple timeout function
    let code = document.getElementById('patient_code').value;
    //get all doctors from database in an array
    let doctors = [];
    setTimeout(function () {    // wait for the database to load
        get(child(dbRef, "Doctori/")).then((snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    doctors.push(childSnapshot.key);
                });
            } else {
                console.log("No data available");
            }
        })
            .catch((error) => {
                console.error(error);
            });
    }, 300);
    setTimeout(function () {
        // console.log(doctors);
        // get the data from the database
        for (let i = 0; i < doctors.length; i++) {
            get(child(dbRef, "Doctori/" + doctors[i] + "/Programari/")).then((snapshot) => {
                if (snapshot.exists()) {
                    snapshot.forEach((childSnapshot) => {
                        get(child(dbRef, "Doctori/" + doctors[i] + "/Programari/" + childSnapshot.key + "/")).then((snapshot) => {
                            var patient = {
                                Nume: snapshot.val().Nume,
                                Telefon: snapshot.val().Telefon,
                                Email: snapshot.val().Email,
                                Data_Programarii: snapshot.val().Data_Programarii,
                                Ora: snapshot.val().Ora,
                                Cod_Programare: snapshot.val().Cod_Programare
                            }
                            // console.log(patient);
                            if (snapshot.val().Cod_Programare == code) {
                                Swal.fire({
                                    icon: 'info',
                                    title: patient.Nume,
                                    text: 'Aveți o programare la data de ' + patient.Data_Programarii + ' la ora ' + patient.Ora,
                                    showCancelButton: true,
                                    cancelButtonText: 'Anulează',
                                    confirmButtonText: 'Ok',
                                }).then((result) => {  
                                    if (!result.isConfirmed) {    
                                        // console.log("Anulat");  
                                        // remove the child from the database
                                      let deleteAppointment = ref(database, "Doctori/" + doctors[i] + "/Programari/" + childSnapshot.key);
                                      set(deleteAppointment, null).then(() => {
                                            // console.log(ref(database, "Doctori/" + doctors[i] + "/date_calendaristice/" + patient.Data_Programarii + "/" + patient.Ora + "/" + patient.Ora));
                                        let hourAvailability = ref(database, "Doctori/" + doctors[i] + "/date_calendaristice/" + patient.Data_Programarii + "/" + patient.Ora + "/" + patient.Ora);
                                        set(hourAvailability, 1);

                                            Swal.fire({
                                                icon: 'success',
                                                title: 'Programare anulată',
                                                text: 'Programarea a fost anulată cu succes!',
                                                confirmButtonText: 'Ok'
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    window.location.reload(true);
                                                }
                                            });
                                        })
                                      
                                        } 
                                });
                                return;
                            }
                        })
                            .catch((error) => {
                                console.error(error);
                            });
                    });
                } else {
                    console.log("No data available");
                }
            })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, 500);
});
// functie pentru a creea un cod unic fiecarei programari, pe care clientul il poate folosi pentru a vedea programarea
function randomClientAppCode() {
    var text = Math.random().toString(36).slice(2);
    return text;
}
// document.getElementById("phoneNumber").addEventListener()
// get all doctors from database and add them to the select element with id "abd"
get(child(dbRef, "Doctori/")).then((snapshot) => {
    if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
            var option = document.createElement("option");
            option.text = childSnapshot.key;
            document.getElementById("about_doctors").add(option);
        });
    } else {
        console.log("No data available");
    }
})
    .catch((error) => {
        console.error(error);
    });
document.getElementById("about_doctors").addEventListener('change', (e) => {
    // check if option is empty
    var name = document.getElementById("dr_name");
    var title = document.getElementById("description_title");
    var description = document.getElementById("description_text");
    var photo = document.getElementById("profile_img");
    if (document.getElementById("about_doctors").value == "Ace Clinic") {
        name.innerHTML = "Ace Clinic";
        title.innerHTML = "Servicii medicale de specialitate pentru tine si familia ta";
        description.innerHTML = "Misiunea noastră este de a informa și educa pacienții și de a le oferi planuri de tratament eficiente și precise pentru afecțiunile de care aceștia suferă. Cabinetele folosesc o bază de date informatizată în care se stochează informația actului medical pentru fiecare pacient in parte, astfel încât există posibilitatea urmăririi în timp a acestuia și aprecierea evoluției diferitelor afecțiuni.";
        photo.src = "../images/doctors/clinic.png";
        return;
    }
    // get the doctor selected
    // show from profile child title description and photo
    // get the data from the database
    // empty the div with id "about_doctor"
    let doctor = document.getElementById("about_doctors").value;
    get(child(dbRef, "Doctori/" + doctor + "/Profil")).then((snapshot) => {
        if (snapshot.exists()) {
            name.innerHTML = "Dr." + doctor;
            title.innerHTML = snapshot.val().Titlu;
            description.innerHTML = snapshot.val().Descriere;
            photo.src = snapshot.val().Poza;
        } else {
            console.log("No data available");
        }
    })
        .catch((error) => {
            console.error(error);
        }
        );
});