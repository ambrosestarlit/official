// menu-toggle.js
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".menu-icons");

  toggle.addEventListener("click", () => {
    menu.classList.toggle("active");
  });
});
