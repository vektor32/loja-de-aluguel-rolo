function frissit(){
    document.querySelector(".kartyak-rollerek").innerHTML = ""
    for (let i = 0; i < rollerek.length; i++) {
        document.querySelector(".kartyak-rollerek").innerHTML += `
            <div class="card col-lg-4 me-3 mb-3" style="width: 18rem;">
                <i class="bi bi-scooter fs-1 text-center"></i>
                <div class="card-body">
                <h5 class="card-title rollerNev mb-3">${rollerek[i].getModel()}</h5>
                <div class="progress-bar progress-rollerek bg-${toltoCsik(rollerek[i].getToltottseg())}" style="width: ${rollerek[i].getToltottseg()}%">${rollerek[i].getToltottseg()}%</div>
                <p class="card-text toltottseg">${scooters[i].status}</p>
                <p class="card-text toltottseg">${scooters[i].lastActive}</p>
                <p class="card-text toltottseg">${rollerek[i].getHely()}</p>
                <a href="#" class="btn btn-info">Megtekintés</a>
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
frissit()