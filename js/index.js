const button = document.getElementById("themeBtn");

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-theme");
    button.textContent = "☀️ Light Mode";
}

button.addEventListener("click", () => {

    document.body.classList.toggle("dark-theme");

    if (document.body.classList.contains("dark-theme")) {
        button.textContent = "☀️ Light Mode";
        localStorage.setItem("theme", "dark");
    } else {
        button.textContent = "🌙 Dark Mode";
        localStorage.setItem("theme", "light");
    }

});