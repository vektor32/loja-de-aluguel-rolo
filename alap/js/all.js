const sidebar = document.querySelector(".sidebar"), toggle = document.querySelector("#menuToggle");
function setMenu(open) {
  sidebar.classList.toggle("open", open);
}
toggle.addEventListener("click", () => setMenu(!sidebar.classList.contains("open")));