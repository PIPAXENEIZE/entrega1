const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const data = new FormData(registerForm);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);

    try {
        const response = await fetch('/api/sessions/register', {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        // Maneja la respuesta exitosa
        console.log('User registered successfully!');
    } catch (error) {
        console.error('Error during fetch:', error);
    }
});
