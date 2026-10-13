async function kiir(){
    document.querySelector(".kartyak-rollerek").innerHTML = ""
    for (let i = 0; i < rollerek.length; i++) {
        document.querySelector(".kartyak-rollerek").innerHTML += `
            <div class="card zserbo col-lg-4 me-3 mb-3" style="width: 18rem;">
                <i class="bi bi-scooter fs-1 text-center"></i>
                <div class="card-body">
                <h5 class="card-title rollerNev mb-3">${rollerek[i].getModel()}</h5>
                <div class="progress-bar progress-rollerek bg-${toltoCsik(rollerek[i].getToltottseg())}" style="width: ${rollerek[i].getToltottseg()}%">${rollerek[i].getToltottseg()}%</div>
                <p class="card-text toltottseg">${scooters[i].status}</p>
                <p class="card-text toltottseg">${scooters[i].lastActive}</p>
                <p class="card-text toltottseg">${await getAddressBigDataCloud(rollerek[i].getHely())}</p>
                <div class="d-flex justify-content-evenly">
                    <a href="#" class="btn btn-info" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="szerkeztes(${i})">Szerkeztés</a>
                    <a href="#" class=" border border-danger p-2 px-3 rounded-5"data-bs-toggle="modal" data-bs-target="#tolroModal" onclick="idtad(${i})"><i class="bi bi-trash-fill text-danger"></i></a>
                </div>
                </div>
            </div>
        `
    }
}
function toltoCsik(szam) {
    if (szam >= 85) {
        return "info"
    } else if (szam >= 55 && szam < 85) {
        return "success"
    } else if (szam > 25 && szam < 55) {
        return "warning"
    } else {
        return "danger"
    }
}
function torles(){
    rollerek.splice(szerkeztesztendo,1)
    kiir()
}
function idtad(index){
    szerkeztesztendo=index
}
kiir()
var szerkeztesztendo=-1
async function szerkeztes(index){
    var model = document.querySelector("#model")
    var hely = document.querySelector("#hely")
    model.value=rollerek[index].getModel()
    hely.value=await getAddressBigDataCloud(rollerek[index].getHely())
    szerkeztesztendo=index
}
document.querySelector(".frissites").addEventListener('click',async()=>{
    var model = document.querySelector("#model")
    var hely = document.querySelector("#hely")
    rollerek[szerkeztesztendo].setModel(model.value)
    rollerek[szerkeztesztendo].setHely(await getCoordinatesFromName(hely.value))
    kiir()
})