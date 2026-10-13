var kivalasztott = -1;
function frissit(){
    document.querySelector(".kartyak").innerHTML = ""
    for (let i = 0; i < rollerek.length; i++) {
        if(rollerek[i].getAllapot().toLowerCase().match("karbantartás alatt")){
            document.querySelector(".kartyak").innerHTML += `
                <div class="card col-lg-4 me-3" style="width: 18rem;">
                    <i class="bi bi-scooter fs-1 text-center"></i>
                    <div class="card-body">
                    <h5 class="card-title rollerNev">${rollerek[i].getModel()}</h5>
                    <p class="card-text toltottseg">${rollerek[i].getToltottseg()}%</p>
                    <a href="#" class="btn btn-info" onclick="kivalasztas(${i})">Megtekintés</a>
                    </div>
                </div>
            `
        }
    }
}
frissit()
function kivalasztas(i){
    kivalasztott = i
    kivalasztottKiiras()
}
function szin(szoveg){
    if (szoveg == "Szabad") {
        return "info"
    } else if (szoveg == "Töltőn") {
        return "warning"
    } else if (szoveg == "Karbantartás alatt") {
        return "danger"
    }else{
        return "success"
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
function toCapitalize(szoveg) {
    var eredmeny = szoveg[0].toUpperCase()
    for (let i = 1; i < szoveg.length; i++) {
        eredmeny += szoveg[i].toLowerCase()
    }
    return eredmeny
}
function kivalasztottKiiras(){
    document.querySelector(".kivalasztott .col-lg-12 tbody").innerHTML = ""
    document.querySelector(".kivalasztott .col-lg-12 tbody").innerHTML += `
            <tr class="rounded-5">
            <th scope="row">${rollerek[kivalasztott].getId()}</th>
            <td class="hideOnMobile p-2 border-none">${rollerek[kivalasztott].getModel()}</td>
            <td><div class="progress" role="progressbar" aria-label="${toCapitalize(toltoCsik(rollerek[kivalasztott].getToltottseg()))} example" aria-valuenow="${rollerek[kivalasztott].getToltottseg()}" aria-valuemin="0" aria-valuemax="100">
                <div class="progress-bar bg-${toltoCsik(rollerek[kivalasztott].getToltottseg())}" style="width: ${rollerek[kivalasztott].getToltottseg()}%">${rollerek[kivalasztott].getToltottseg()}%</div>
            </div></td>
            <td class="hideOnMobile p-2 border-none"> <span class="border border-${szin(rollerek[kivalasztott].getAllapot())} text-${szin(rollerek[kivalasztott].getAllapot())}">${rollerek[kivalasztott].getAllapot()}</span></td>
            <td class="hideOnMobile p-2 border-none">${scooters[kivalasztott].lastActive} m</td>
        </tr>
    `
}