(function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav-main");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  var dropdownBtn = document.querySelector(".nav-dropdown-toggle");
  var dropdown = document.querySelector(".nav-dropdown");
  if (!dropdownBtn || !dropdown) return;

  function closeDropdown() {
    dropdownBtn.setAttribute("aria-expanded", "false");
    dropdown.setAttribute("hidden", "");
    dropdown.classList.remove("is-open");
  }

  function openDropdown() {
    dropdownBtn.setAttribute("aria-expanded", "true");
    dropdown.removeAttribute("hidden");
    dropdown.classList.add("is-open");
  }

  function toggleDropdown() {
    var expanded = dropdownBtn.getAttribute("aria-expanded") === "true";
    if (expanded) closeDropdown();
    else openDropdown();
  }

  dropdownBtn.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    toggleDropdown();
  });

  dropdown.addEventListener("click", function (e) {
    e.stopPropagation();
  });

  document.addEventListener("click", function () {
    closeDropdown();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeDropdown();
  });
})();
