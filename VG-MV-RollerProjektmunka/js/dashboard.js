var tablazat = document.querySelector(".eredmeny tbody")
frissit()
    var elerheto = 0
    var tolton = 0
    var szervizben = 0
    var alacsonyEnergia = 0 
async function frissit() {
    tablazat.innerHTML = `<tbody></tbody>`
    document.querySelector(".osszes").innerHTML = rollerek.length
    elerheto = 0
    tolton = 0
    szervizben = 0
    alacsonyEnergia = 0
    for (let i = 0; i < rollerek.length; i++) {
        tablazat.innerHTML +=
            `<tr class="rounded-5">
            <th scope="row">${rollerek[i].getId()}</th>
            <td class="hideOnMobile p-2 border-none">${rollerek[i].getModel()}</td>
            <td><div class="progress" role="progressbar" aria-label="${toCapitalize(toltoCsik(rollerek[i].getToltottseg()))} example" aria-valuenow="${rollerek[i].getToltottseg()}" aria-valuemin="0" aria-valuemax="100">
                <div class="progress-bar bg-${toltoCsik(rollerek[i].getToltottseg())}" style="width: ${rollerek[i].getToltottseg()}%">${rollerek[i].getToltottseg()}%</div>
            </div></td>
            <td class="hideOnMobile p-2 border-none"> <span class="border border-${szin(rollerek[i].getAllapot())} text-${szin(rollerek[i].getAllapot())}">${rollerek[i].getAllapot()}</span></td>
            <td>${await getAddressBigDataCloud(rollerek[i].getHely())}</td>
            <td class="hideOnMobile p-2 border-none">${rollerek[i].getIdejeActiv()} m</td>
        </tr>`
    }
    document.querySelector(".elerheto").innerHTML = elerheto
    document.querySelector(".tolton").innerHTML = tolton
    document.querySelector(".alacsonyEnergia").innerHTML = alacsonyEnergia
    document.querySelector(".szervizben").innerHTML = szervizben
}
function szin(szoveg){
    if (szoveg == "Szabad") {
        elerheto++
        return "info"
    } else if (szoveg == "Töltőn") {
        tolton++
        return "warning"
    } else if (szoveg == "Karbantartás alatt") {
        szervizben++
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
        alacsonyEnergia++
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