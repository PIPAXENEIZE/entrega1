document.addEventListener("DOMContentLoaded", function () {
    sesion_expired();
    setInterval(sesion_expired, 1000); // Verifica cada segundo
});

function sesion_expired() {
    const loged = JSON.parse(localStorage.getItem("loged")) || { timestamp: 0 };
    const sessionDuration = 5 * 60 * 1000;
    const currentTimestamp = new Date().getTime();

    if (currentTimestamp - loged.timestamp >= sessionDuration) {
        window.location.href = "login.html";
    }
}
