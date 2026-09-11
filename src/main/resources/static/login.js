document.getElementById("loginForm").addEventListener("submit", async function(event) {

    event.preventDefault();

    const loginData = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    try {

        const response = await fetch("http://localhost:8080/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginData)
        });

        const result = await response.text();
        console.log("LOGIN RESPONSE RAW:", result);

        if (response.ok) {
            const user = JSON.parse(result);
            localStorage.setItem("currentUser",JSON.stringify(user));
            localStorage.setItem("studentUser",JSON.stringify(user));

            document.getElementById("message").textContent =
                "Login successful!";
                window.location.href = "dashboard.html";

        } else {

            document.getElementById("message").textContent =
                result;
        }

    } catch (error) {

        document.getElementById("message").textContent =
            "Something went wrong. Please try again.";
    }
});