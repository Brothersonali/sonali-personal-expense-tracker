document.getElementById("registerForm").addEventListener("submit", async function(event) {

    event.preventDefault();

    const user = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    try {

        const response = await fetch("http://localhost:8080/api/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });

        const result = await response.text();

        if (response.ok) {

            document.getElementById("message").textContent =
                "Registration successful!";

            document.getElementById("registerForm").reset();

        } else {

            document.getElementById("message").textContent =
                result;
        }

    } catch (error) {

        document.getElementById("message").textContent =
            "Something went wrong. Please try again.";
    }
});