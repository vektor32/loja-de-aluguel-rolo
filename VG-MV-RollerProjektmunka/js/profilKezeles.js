function profilBetoltes() {
    var nev = localStorage.getItem("profil_nev")
    if (nev == null) {
        return new Profil("Kiss Anna", "admin", "admin@scooterfleet.hu", "admin123")
    }
    return new Profil(nev, localStorage.getItem("profil_felhNev"), localStorage.getItem("profil_email"), localStorage.getItem("profil_jelszo"))
}
function profilMentes() {
    localStorage.setItem("profil_nev", profil.getNev())
    localStorage.setItem("profil_felhNev", profil.getFelhNev())
    localStorage.setItem("profil_email", profil.getEmail())
    localStorage.setItem("profil_jelszo", profil.getJelszo())
}
var profil = profilBetoltes()
var bejelentkezve = localStorage.getItem("bejelentkezve") == "1"
var loginModalEl = document.getElementById("loginModal")
var loginForm = document.getElementById("loginForm")
var loginFelhNev = document.getElementById("lgFelhNev")
var loginJelszo = document.getElementById("lgJelszo")
var profilModalEl = document.getElementById("profilModal")
var profilForm = document.getElementById("profilForm")
var pfNev = document.getElementById("pfNev")
var pfFelhNev = document.getElementById("pfFelhNev")
var pfEmail = document.getElementById("pfEmail")
var pfJelszo = document.getElementById("pfJelszo")
var toastEl = document.getElementById("uzenetToast")
var toastSzoveg = document.getElementById("uzenetToastSzoveg")
var loginModal = new bootstrap.Modal(loginModalEl)
var profilModal = new bootstrap.Modal(profilModalEl)
var toast = new bootstrap.Toast(toastEl, { delay: 3000 })
function uzenet(szoveg) {
    toastSzoveg.textContent = szoveg
    toast.show()
}
function felulet() {
    var nevek = document.querySelectorAll(".js-profil-nev")
    for (let i = 0; i < nevek.length; i++) {
        if (bejelentkezve) {
            nevek[i].textContent = profil.getNev()
        } else {
            nevek[i].textContent = "Vendég"
        }
    }
    var csakBelepve = document.querySelectorAll('[data-auth-csak="be"]')
    for (let i = 0; i < csakBelepve.length; i++) {
        if (bejelentkezve) {
            csakBelepve[i].classList.remove("hidden")
        } else {
            csakBelepve[i].classList.add("hidden")
        }
    }
    var csakKilepve = document.querySelectorAll('[data-auth-csak="ki"]')
    for (let i = 0; i < csakKilepve.length; i++) {
        if (bejelentkezve) {
            csakKilepve[i].classList.add("hidden")
        } else {
            csakKilepve[i].classList.remove("hidden")
        }
    }
}
function bejelentkezesGomb() {
    loginModal.show()
}
function profilGomb() {
    if (bejelentkezve) {
        profilModal.show()
    } else {
        loginModal.show()
    }
}
function kijelentkezesGomb() {
    if (bejelentkezve) {
        bejelentkezve = false
        localStorage.removeItem("bejelentkezve")
        felulet()
        uzenet("Sikeresen kijelentkeztél.")
    }
}
var loginGombok = document.querySelectorAll('[data-auth="login"]')
for (let i = 0; i < loginGombok.length; i++) {
    loginGombok[i].addEventListener("click", bejelentkezesGomb)
}
var profilGombok = document.querySelectorAll('[data-auth="profile"]')
for (let i = 0; i < profilGombok.length; i++) {
    profilGombok[i].addEventListener("click", profilGomb)
}
var logoutGombok = document.querySelectorAll('[data-auth="logout"]')
for (let i = 0; i < logoutGombok.length; i++) {
    logoutGombok[i].addEventListener("click", kijelentkezesGomb)
}
loginForm.addEventListener("submit", ()=> {
    if (profil.adatEgyezes(loginFelhNev.value.trim(), loginJelszo.value)) {
        bejelentkezve = true
        localStorage.setItem("bejelentkezve", "1")
        loginModal.hide()
        felulet()
        uzenet("Üdv, " + profil.getNev() + "!")
    } else {
    }
})
profilModalEl.addEventListener("show.bs.modal", ()=> {
    pfNev.value = profil.getNev()
    pfFelhNev.value = profil.getFelhNev()
    pfEmail.value = profil.getEmail()
    pfJelszo.value = ""
})
document.querySelector(".mentes").addEventListener("click", ()=> {
    var nev = pfNev.value.trim()
    var felhNev = pfFelhNev.value.trim()
    var email = pfEmail.value.trim()
    var jelszo = pfJelszo.value

    profil.setNev(nev)
    profil.setFelhNev(felhNev)
    profil.setEmail(email)
    if (jelszo != "") {
        profil.setJelszo(jelszo)
    }
    profilMentes()
    profilModal.hide()
    felulet()
    uzenet("A profil adatai elmentve.")
})
felulet()