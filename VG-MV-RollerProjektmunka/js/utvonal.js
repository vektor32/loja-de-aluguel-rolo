var ROLLER_HATOTAV_KM = 30
var TARTALEK = 1.2
var BUDAPEST = [47.4979, 19.0540]

var terkep = L.map('utvonalTerkep').setView(BUDAPEST, 13)
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(terkep)

var honnanInput = document.getElementById("honnan")
var hovaInput = document.getElementById("hova")
var minToltes = document.getElementById("minToltes")
var maxTav = document.getElementById("maxTav")
var modellSelect = document.getElementById("modell")
var csakElegendo = document.getElementById("csakElegendo")
var hibaDoboz = document.getElementById("utvonalHiba")
var tervezGomb = document.getElementById("tervezGomb")
var tabla = document.getElementById("rollerTabla")

var honnan = null
var hova = null
var utHosszKm = 0
var utIdoPerc = 0
var honnanMarker = null
var hovaMarker = null
var utvonalVonal = null
var gyalogVonal = null
var rollerReteg = L.layerGroup().addTo(terkep)
var rollerMarkerek = {}
var talalatok = []
function koordinata(szoveg) {
    var r = szoveg.split(',')
    return { lat: parseFloat(r[0]), lon: parseFloat(r[1]) }
}
function tavolsag(a, b) {
    var R = 6371000
    var dLat = (b.lat - a.lat) * Math.PI / 180
    var dLon = (b.lon - a.lon) * Math.PI / 180
    var x = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(dLon / 2) ** 2
    return 2 * R * Math.asin(Math.sqrt(x))
}
function toltoSzin(szam) {
    if (szam >= 85) return "info"
    if (szam >= 55) return "success"
    if (szam > 25) return "warning"
    return "danger"
}
var szinKod = { info: "#0dcaf0", success: "#198754", warning: "#ffc107", danger: "#dc3545" }
function hatotav(roller) {
    return roller.getToltottseg() / 100 * ROLLER_HATOTAV_KM
}
function tavSzoveg(m) {
    return m < 1000 ? Math.round(m) + " m" : (m / 1000).toFixed(1) + " km"
}
function hiba(szoveg) {
    hibaDoboz.textContent = szoveg
    hibaDoboz.classList.toggle("d-none", !szoveg)
}
function pontIkon(osztaly) {
    return L.divIcon({ className: "", html: `<div class="terkepPont ${osztaly}"></div>`, iconSize: [18, 18], iconAnchor: [9, 9] })
}
function szabadRollerek() {
    return rollerek.filter(r => r.getAllapot() == "Szabad")
}
var modellek = [...new Set(rollerek.map(r => r.getModel()))].sort()
modellek.forEach(m => modellSelect.innerHTML += `<option>${m}</option>`)
async function cimKereses(szoveg) {
    var kozvetlen = szoveg.match(/^\s*(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)\s*$/)
    if (kozvetlen) {
        return [{ lat: parseFloat(kozvetlen[1]), lon: parseFloat(kozvetlen[3]), nev: szoveg.trim() }]
    }
    var url = "https://nominatim.openstreetmap.org/search?format=json&limit=5&countrycodes=hu&accept-language=hu" +
        "&viewbox=18.92,47.62,19.34,47.34&bounded=1&q=" + encodeURIComponent(szoveg)
    var valasz = await fetch(url)
    var adat = await valasz.json()
    return adat.map(d => ({ lat: parseFloat(d.lat), lon: parseFloat(d.lon), nev: d.display_name }))
}
async function visszaKereses(lat, lon) {
    try {
        var url = `https://nominatim.openstreetmap.org/reverse?format=json&accept-language=hu&zoom=17&lat=${lat}&lon=${lon}`
        var adat = await (await fetch(url)).json()
        if (adat.address) {
            var a = adat.address
            var utca = [a.road, a.house_number].filter(Boolean).join(" ")
            return utca || adat.display_name.split(",").slice(0, 2).join(",")
        }
    } catch (e) { }
    return lat.toFixed(5) + ", " + lon.toFixed(5)
}
var javaslatIdozito = {}
function javaslatok(input, lista) {
    input.addEventListener("input", () => {
        if (input === honnanInput) honnan = null
        else hova = null
        clearTimeout(javaslatIdozito[lista])
        if (input.value.trim().length < 3) return
        javaslatIdozito[lista] = setTimeout(async () => {
            try {
                var eredmeny = await cimKereses(input.value)
                document.getElementById(lista).innerHTML = eredmeny
                    .map(e => `<option value="${e.nev.replace(/"/g, "&quot;")}"></option>`).join("")
            } catch (e) { }
        }, 600)
    })
}
javaslatok(honnanInput, "honnanLista")
javaslatok(hovaInput, "hovaLista")
function pontBeallit(tipus, pont) {
    if (tipus == "honnan") {
        honnan = pont
        if (honnanMarker) terkep.removeLayer(honnanMarker)
        honnanMarker = L.marker([pont.lat, pont.lon], { icon: pontIkon("honnan"), draggable: true })
            .addTo(terkep).bindTooltip("Honnan")
        honnanMarker.on("dragend", e => huzas("honnan", e.target.getLatLng()))
    } else {
        hova = pont
        if (hovaMarker) terkep.removeLayer(hovaMarker)
        hovaMarker = L.marker([pont.lat, pont.lon], { icon: pontIkon("hova"), draggable: true })
            .addTo(terkep).bindTooltip("Hova")
        hovaMarker.on("dragend", e => huzas("hova", e.target.getLatLng()))
    }
}
async function huzas(tipus, ll) {
    var nev = await visszaKereses(ll.lat, ll.lng)
    var input = tipus == "honnan" ? honnanInput : hovaInput
    input.value = nev
    pontBeallit(tipus, { lat: ll.lat, lon: ll.lng, nev: nev })
    if (honnan && hova) tervezes()
    else rollerekFrissit()
}
terkep.on("click", async e => {
    var tipus = !honnan ? "honnan" : (!hova ? "hova" : null)
    if (!tipus) return
    await huzas(tipus, e.latlng)
})
async function utvonalLekeres(a, b) {
    var koord = `${a.lon},${a.lat};${b.lon},${b.lat}`
    var url = `https://routing.openstreetmap.de/routed-bike/route/v1/driving/${koord}?overview=full&geometries=geojson`
    try {
        var adat = await (await fetch(url)).json()
        if (adat.code == "Ok" && adat.routes.length) {
            var r = adat.routes[0]
            return {
                pontok: r.geometry.coordinates.map(c => [c[1], c[0]]),
                km: r.distance / 1000,
                perc: r.distance / 1000 / 18 * 60
            }
        }
    } catch (e) { }
    var km = tavolsag(a, b) / 1000 * 1.3
    return { pontok: [[a.lat, a.lon], [b.lat, b.lon]], km: km, perc: km / 18 * 60, legvonal: true }
}

async function pontFeloldas(input, meglevo) {
    if (meglevo && meglevo.nev == input.value) return meglevo
    var talalat = await cimKereses(input.value)
    return talalat.length ? talalat[0] : null
}

async function tervezes() {
    hiba("")
    if (!honnanInput.value.trim() || !hovaInput.value.trim()) {
        hiba("Add meg a kiinduló- és a célpontot!")
        return
    }
    tervezGomb.disabled = true
    tervezGomb.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Tervezés...`
    try {
        var a = await pontFeloldas(honnanInput, honnan)
        if (!a) { hiba("Nem található a kiindulópont: " + honnanInput.value); return }
        var b = await pontFeloldas(hovaInput, hova)
        if (!b) { hiba("Nem található a célpont: " + hovaInput.value); return }
        pontBeallit("honnan", a)
        pontBeallit("hova", b)

        var ut = await utvonalLekeres(a, b)
        utHosszKm = ut.km
        utIdoPerc = ut.perc
        if (utvonalVonal) terkep.removeLayer(utvonalVonal)
        utvonalVonal = L.polyline(ut.pontok, { color: "#09090b", weight: 5, opacity: 0.85, dashArray: ut.legvonal ? "8 8" : null }).addTo(terkep)
        terkep.fitBounds(utvonalVonal.getBounds(), { padding: [40, 40] })
        if (ut.legvonal) hiba("Az útvonaltervező nem elérhető, légvonalbeli becslés látható.")

        document.getElementById("osszegzes").classList.remove("d-none")
        document.getElementById("utHossz").textContent = utHosszKm.toFixed(1) + " km"
        document.getElementById("utIdo").textContent = Math.max(1, Math.round(utIdoPerc)) + " p"
        rollerekFrissit()
    } catch (e) {
        hiba("Hiba történt a tervezés közben. Próbáld újra!")
    } finally {
        tervezGomb.disabled = false
        tervezGomb.innerHTML = `<i class="bi bi-compass me-2"></i>Tervezés`
    }
}
function rollerekFrissit() {
    var min = parseInt(minToltes.value)
    var max = parseInt(maxTav.value)
    var modell = modellSelect.value
    var kellKm = utHosszKm * TARTALEK

    talalatok = szabadRollerek()
        .map(r => ({
            roller: r,
            gyalog: honnan ? tavolsag(honnan, koordinata(r.getHely())) : null,
            elegendo: !utHosszKm || hatotav(r) >= kellKm
        }))
        .filter(t => t.roller.getToltottseg() >= min)
        .filter(t => !modell || t.roller.getModel() == modell)
        .filter(t => t.gyalog == null || t.gyalog <= max)
        .filter(t => !csakElegendo.checked || t.elegendo)
        .sort((x, y) => (y.elegendo - x.elegendo) ||
            ((x.gyalog ?? 0) - (y.gyalog ?? 0)) ||
            (y.roller.getToltottseg() - x.roller.getToltottseg()))

    var cim = document.getElementById("tablaCim")
    cim.textContent = honnan ? "Legmegfelelőbb rollerek a kiindulóponthoz" : "Szabad rollerek"
    document.getElementById("utTalalat").textContent = talalatok.length

    tablaKiiras()
    markerekKiiras()
}

function tablaKiiras() {
    if (!talalatok.length) {
        tabla.innerHTML = `<tr><td colspan="7" class="text-center text-secondary py-4">
            Nincs a szűrésnek megfelelő roller. Próbáld lazítani a feltételeken.</td></tr>`
        return
    }
    tabla.innerHTML = talalatok.map((t, i) => {
        var r = t.roller
        var legjobb = i == 0 && honnan && t.elegendo
        var szin = toltoSzin(r.getToltottseg())
        return `<tr class="${legjobb ? "legjobb" : ""}" data-id="${r.getId()}">
            <td>${i + 1}</td>
            <th scope="row">${r.getId()}${legjobb ? '<span class="legjobbCimke">Ajánlott</span>' : ""}</th>
            <td class="hideOnMobile">${r.getModel()}</td>
            <td><div class="progress" role="progressbar" aria-valuenow="${r.getToltottseg()}" aria-valuemin="0" aria-valuemax="100">
                <div class="progress-bar bg-${szin}" style="width: ${r.getToltottseg()}%">${r.getToltottseg()}%</div></div></td>
            <td>${t.gyalog == null ? "–" : tavSzoveg(t.gyalog)}</td>
            <td class="hideOnMobile">${hatotav(r).toFixed(1)} km</td>
            <td class="hideOnMobile">${!utHosszKm ? "–" : t.elegendo
                ? '<span class="border border-success text-success">Igen</span>'
                : '<span class="border border-danger text-danger">Kevés töltés</span>'}</td>
        </tr>`
    }).join("")
}

function markerekKiiras() {
    rollerReteg.clearLayers()
    rollerMarkerek = {}
    if (gyalogVonal) { terkep.removeLayer(gyalogVonal); gyalogVonal = null }
    talalatok.forEach((t, i) => {
        var r = t.roller
        var k = koordinata(r.getHely())
        var legjobb = i == 0 && honnan && t.elegendo
        var m = L.circleMarker([k.lat, k.lon], {
            radius: legjobb ? 11 : 7,
            color: legjobb ? "#09090b" : "#fff",
            weight: legjobb ? 3 : 2,
            fillColor: szinKod[toltoSzin(r.getToltottseg())],
            fillOpacity: 1
        }).bindPopup(`<b>${r.getId()}</b> – ${r.getModel()}<br>
            Töltöttség: ${r.getToltottseg()}%<br>
            Hatótáv: ${hatotav(r).toFixed(1)} km
            ${t.gyalog != null ? "<br>Gyaloglás: " + tavSzoveg(t.gyalog) : ""}`)
        m.addTo(rollerReteg)
        rollerMarkerek[r.getId()] = m
        if (legjobb) {
            gyalogVonal = L.polyline([[honnan.lat, honnan.lon], [k.lat, k.lon]],
                { color: "#71717a", weight: 3, dashArray: "4 6" }).addTo(terkep)
        }
    })
}
tabla.addEventListener("click", e => {
    var sor = e.target.closest("tr[data-id]")
    if (!sor) return
    var m = rollerMarkerek[sor.dataset.id]
    if (m) {
        terkep.setView(m.getLatLng(), 16)
        m.openPopup()
        document.getElementById("utvonalTerkep").scrollIntoView({ behavior: "smooth", block: "center" })
    }
})
document.getElementById("utvonalForm").addEventListener("submit", e => {
    e.preventDefault()
    tervezes()
})
document.getElementById("torlesGomb").addEventListener("click", () => {
    honnan = hova = null
    utHosszKm = utIdoPerc = 0
    honnanInput.value = hovaInput.value = ""
    ;[honnanMarker, hovaMarker, utvonalVonal].forEach(l => l && terkep.removeLayer(l))
    honnanMarker = hovaMarker = utvonalVonal = null
    document.getElementById("osszegzes").classList.add("d-none")
    hiba("")
    terkep.setView(BUDAPEST, 13)
    rollerekFrissit()
})
minToltes.addEventListener("input", () => {
    document.getElementById("minToltesErtek").textContent = minToltes.value
    rollerekFrissit()
})
maxTav.addEventListener("input", () => {
    document.getElementById("maxTavErtek").textContent = maxTav.value
    rollerekFrissit()
})
modellSelect.addEventListener("change", rollerekFrissit)
csakElegendo.addEventListener("change", rollerekFrissit)

rollerekFrissit()
