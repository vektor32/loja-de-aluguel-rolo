class Profil {
    #nev
    #felhNev
    #email
    #jelszo
    constructor(nev, felhNev, email, jelszo) {
        this.setNev(nev)
        this.setFelhNev(felhNev)
        this.setEmail(email)
        this.setJelszo(jelszo)
    }
    adatEgyezes(felhnev, jelszo) {
        return this.#felhNev === felhnev && this.#jelszo === jelszo
    }
    setNev(nev) {
        this.#nev = nev
    }
    setFelhNev(felhNev) {
        this.#felhNev = felhNev
    }
    setEmail(email) {
        this.#email = email
    }
    setJelszo(jelszo) {
        this.#jelszo = jelszo
    }
    getNev() {
        return this.#nev
    }
    getFelhNev() {
        return this.#felhNev
    }
    getEmail() {
        return this.#email
    }
    getJelszo() {
        return this.#jelszo
    }
}
