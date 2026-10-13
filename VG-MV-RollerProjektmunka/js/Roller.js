class Roller {
    #id
    #model
    #toltottseg
    #idejeActiv
    #hely
    #allapot
    constructor(id, model, toltottseg, allapot, hely, idejeActiv) {
        this.setId(id)
        this.setModel(model)
        this.setToltottseg(toltottseg)
        this.setAllapot(allapot)
        this.setHely(hely)
        this.setIdejeActiv(idejeActiv)
    }
    igenybevetel() {
        if (this.getAllapot().toLowerCase() == "szabad") {
            this.setAllapot("Bérlés alatt")
            return true
        } else {
            return false
        }
    }
    visszaHoz() {
        if (this.getAllapot().toLowerCase() == "bérlés alatt") {
            this.setAllapot("Szabad")
            return true
        } else {
            return false
        }
    }
    felCsatlakoztatas() {
        if ((this.getAllapot().toLowerCase() != "töltőn" && this.getAllapot().toLowerCase() != "karbantartás alatt") && this.getToltottseg() != 100) {
            this.setAllapot("Töltőn")
            this.setToltottseg(100)
            return true
        } else {
            return false
        }
    }
    leCsatlakoztatas() {
        if (this.getAllapot().toLowerCase() == "töltőn") {
            this.setAllapot("Szabad")
            return true
        } else {
            return false
        }
    }
    karbantartas() {
        if (this.getAllapot().toLowerCase() != "karbantartás alatt") {
            this.setAllapot("Karbantartás alatt")
            return true
        } else {
            return false
        }
    }
    terepreEngedes() {
        if (this.getAllapot().toLowerCase() == "karbantartás alatt") {
            this.setAllapot("Szabad")
            return true
        } else {
            return false
        }
    }
    toCapitalize(szoveg) {
        var eredmeny = szoveg[0].toUpperCase()
        for (let i = 1; i < szoveg.length; i++) {
            eredmeny += szoveg[i].toLowerCase()
        }
        return eredmeny
    }
    setModel(model) {
        this.#model = model
    }
    setId(id) {
        this.#id = id
    }
    setToltottseg(toltottseg) {
        if (toltottseg < 0) {
            this.#toltottseg = 0
        } else if (toltottseg > 100) {
            this.#toltottseg = 100
        } else {
            this.#toltottseg = toltottseg
        }
    }
    setIdejeActiv(idejeActiv) {
        if (idejeActiv < 0) {
            this.#idejeActiv = 0
        } else {
            this.#idejeActiv = idejeActiv
        }
    }
    setHely(hely) {
        this.#hely = hely
    }
    setAllapot(allapot) {
        if (allapot.toLowerCase() == "szabad"||
            allapot.toLowerCase() == "bérlés alatt"||
            this.toCapitalize(allapot) == "Töltőn"||
            allapot.toLowerCase() == "karbantartás alatt") {
            this.#allapot = this.toCapitalize(allapot)
        }else{
            this.#allapot = "Szabad"
        }
    }
    getId() {
        return this.#id
    }
    getToltottseg() {
        return this.#toltottseg
    }
    getIdejeActiv() {
        return this.#idejeActiv
    }
    getHely() {
        return this.#hely
    }
    getAllapot() {
        return this.#allapot
    }
    getModel() {
        return this.#model
    }
}