document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Dark mode script loaded");

    const darkModeToggle = document.getElementById("darkModeToggle");

    if (!darkModeToggle) {
        console.error("❌ Dark Mode Button Not Found!");
        return;
    }

    function toggleDarkMode(forceMode = null) {
        const isDarkMode = forceMode !== null ? forceMode : !document.body.classList.contains("dark-mode");

        document.body.classList.toggle("dark-mode", isDarkMode);
        localStorage.setItem("darkMode", isDarkMode ? "enabled" : "disabled");

        darkModeToggle.innerText = isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode";

        console.log("🔄 Dark Mode Set:", isDarkMode ? "Enabled" : "Disabled");
    }

    // Apply mode from localStorage
    if (localStorage.getItem("darkMode") === "enabled") {
        toggleDarkMode(true);
    }

    // Toggle on button click
    darkModeToggle.addEventListener("click", function () {
        console.log("⚡ Dark Mode Button Clicked!");
        toggleDarkMode();
    });
});
