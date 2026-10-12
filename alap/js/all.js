const sidebar = document.querySelector(".sidebar"), toggle = document.querySelector("#menuToggle");
function setMenu(open) {
  sidebar.classList.toggle("open", open);
}
toggle.addEventListener("click", () => setMenu(!sidebar.classList.contains("open")));
const scooters = [
  { id: "SC142", model: "Xiaomi Mi Pro 2", battery: 85, status: "Szabad", location: "47.4979,19.0540", lastActive: 2 },
  { id: "SC981", model: "Ninebot Max G30", battery: 12, status: "Töltőn", location: "47.5112,19.0557", lastActive: 15 },
  { id: "SC533", model: "Segway Ninebot ES2", battery: 94, status: "Szabad", location: "47.4984,19.0715", lastActive: 1 },
  { id: "SC720", model: "Xiaomi Essential", battery: 45, status: "Bérlés alatt", location: "47.4862,19.0721", lastActive: 0 },
  { id: "SC315", model: "Ninebot Max G30", battery: 100, status: "Szabad", location: "47.5085,19.0224", lastActive: 5 },
  { id: "SC804", model: "Xiaomi Mi Pro 2", battery: 8, status: "Karbantartás alatt", location: "47.5250,19.0620", lastActive: 120 },
  { id: "SC269", model: "Ninebot F40I", battery: 67, status: "Bérlés alatt", location: "47.4950,19.0610", lastActive: 0 },
  { id: "SC651", model: "Xiaomi Essential", battery: 10, status: "Töltőn", location: "47.5000,19.0810", lastActive: 45 },
  { id: "SC492", model: "Segway Ninebot ES4", battery: 88, status: "Szabad", location: "47.4965,19.0515", lastActive: 3 },
  { id: "SC117", model: "Ninebot Max G30", battery: 52, status: "Bérlés alatt", location: "47.5065,19.0638", lastActive: 0 },
  { id: "SC893", model: "Xiaomi Mi Pro 2", battery: 78, status: "Szabad", location: "47.5149,19.0776", lastActive: 8 },
  { id: "SC358", model: "Ninebot F30", battery: 91, status: "Szabad", location: "47.4851,19.0510", lastActive: 4 },
  { id: "SC744", model: "Xiaomi Essential", battery: 20, status: "Töltőn", location: "47.4789,19.0583", lastActive: 30 },
  { id: "SC509", model: "Segway Ninebot ES2", battery: 24, status: "Karbantartás alatt", location: "47.5015,19.0700", lastActive: 240 },
  { id: "SC622", model: "Ninebot Max G30", battery: 65, status: "Szabad", location: "47.4891,19.0617", lastActive: 6 },
  { id: "SC189", model: "Xiaomi Mi Pro 2", battery: 40, status: "Bérlés alatt", location: "47.5140,19.0460", lastActive: 0 },
  { id: "SC934", model: "Ninebot F40I", battery: 99, status: "Szabad", location: "47.4920,19.0550", lastActive: 2 },
  { id: "SC411", model: "Xiaomi Essential", battery: 82, status: "Szabad", location: "47.4960,19.0490", lastActive: 7 },
  { id: "SC276", model: "Segway Ninebot ES4", battery: 15, status: "Töltőn", location: "47.4380,19.0230", lastActive: 60 },
  { id: "SC585", model: "Ninebot Max G30", battery: 73, status: "Szabad", location: "47.5299,19.0504", lastActive: 10 },
  { id: "SC812", model: "Xiaomi Mi Pro 2", battery: 33, status: "Bérlés alatt", location: "47.4730,19.0640", lastActive: 0 },
  { id: "SC340", model: "Ninebot F30", battery: 95, status: "Szabad", location: "47.4875,19.0550", lastActive: 1 },
  { id: "SC679", model: "Xiaomi Essential", battery: 5, status: "Karbantartás alatt", location: "47.4780,19.0850", lastActive: 180 },
  { id: "SC198", model: "Segway Ninebot ES2", battery: 58, status: "Bérlés alatt", location: "47.4900,19.0680", lastActive: 0 },
  { id: "SC905", model: "Ninebot Max G30", battery: 84, status: "Szabad", location: "47.5075,19.0380", lastActive: 5 },
  { id: "SC447", model: "Xiaomi Mi Pro 2", battery: 22, status: "Töltőn", location: "47.5180,19.0600", lastActive: 50 },
  { id: "SC763", model: "Ninebot F40I", battery: 90, status: "Szabad", location: "47.4990,19.0400", lastActive: 3 },
  { id: "SC231", model: "Xiaomi Essential", battery: 71, status: "Szabad", location: "47.5090,19.0560", lastActive: 9 },
  { id: "SC556", model: "Segway Ninebot ES4", battery: 38, status: "Bérlés alatt", location: "47.5300,19.0700", lastActive: 0 },
  { id: "SC888", model: "Ninebot Max G30", battery: 100, status: "Szabad", location: "47.4860,19.0730", lastActive: 2 }
];
var rollerek=[]
for (let i = 0; i < scooters.length; i++) {
  var roller=new Roller(scooters[i].id,scooters[i].model,scooters[i].battery,scooters[i].status,scooters[i].location,scooters[i].lastActive)
  rollerek.push(roller)
}
//Ai
let map;
function initMap() {
    map = L.map('map').setView([47.4979, 19.0540], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    rollerek.forEach(roller => {
        let coordText = roller.getHely(); 
        let parts = coordText.replace(/[°NSE]/g, '').split(',');
        let lat = parseFloat(parts[0]);
        let lon = parseFloat(parts[1]);
        if (!isNaN(lat) && !isNaN(lon)) {
            let marker = L.marker([lat, lon]).addTo(map);
            marker.bindPopup(`
                <b>ID:</b> ${roller.getId()}<br>
                <b>Model:</b> ${roller.getModel()}<br>
                <b>Status:</b> ${roller.getAllapot()}<br>
                <b>Battery:</b> ${roller.getToltottseg()}%
            `);
        }
    });
}
window.onload = function() {
    initMap();
};