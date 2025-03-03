document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("sidebar");
    const sidebarToggle = document.getElementById("sidebarToggle");
    const closeSidebar = document.getElementById("closeSidebar");

    if (sidebar && sidebarToggle) {
        sidebarToggle.addEventListener("click", function () {
            sidebar.classList.add("active");
        });

        closeSidebar.addEventListener("click", function () {
            sidebar.classList.remove("active");
        });
    } else {
        console.error("Sidebar or toggle button not found");
    }
});
