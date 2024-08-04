document.addEventListener("DOMContentLoaded", () => {
    const botonLogin = document.querySelector("#btn-login");
    const contenedor = document.querySelector("#contenedor");
    const inputs = document.querySelectorAll("input");

    const getTimestamp = () => new Date().getTime();
    const sessionDuration = 10 * 60 * 1000;

    const loged = JSON.parse(localStorage.getItem("loged")) || { timestamp: 0 };

    const loginConnect = (user) => {
        contenedor.innerHTML = `<h1>LOGEADO <strong>${user}</strong>, REDIRIGIENDO</h1>`;
        setTimeout(() => {
            window.location.href = "index.html";
        }, 4000)
    };

    if (getTimestamp() - loged.timestamp < sessionDuration) {
        loginConnect(loged.usuario);
    }

    const userDefault = {
        user: '',
        password: ''
    };

    inputs.forEach((input) => {
        input.addEventListener("input", ({ target: { name, value } }) => {
            userDefault[name] = value;
        });
    });

    botonLogin.addEventListener("click", () => {
        const logintrue = dataBase.find((userEvent) => {
            return userEvent.user === userDefault.user && userEvent.password === userDefault.password;
        });

        if (logintrue) {
            loginConnect(userDefault.user);
            const timestamp = getTimestamp();
            localStorage.setItem("loged", JSON.stringify({ usuario: userDefault.user, timestamp }));
            window.location.href = "index.html";
        } else {
            Swal.fire({
                icon: "error",
                title: "ERROR",
                text: "Usuario y/o Contraseña Incorrectos!"
            });
        }
    });
});
