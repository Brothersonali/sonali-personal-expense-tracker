const userId = 1;

document.getElementById("transactionForm")
    .addEventListener("submit", async function(event) {

        event.preventDefault();

        const transaction = {
            title: document.getElementById("title").value,
            amount: Number(document.getElementById("amount").value),
            type: document.getElementById("type").value,
            category: document.getElementById("category").value,
            date: document.getElementById("date").value
        };

        try {

            const response = await fetch(
                `http://localhost:8080/api/transactions?userId=${userId}`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(transaction)
                }
            );

            const result = await response.text();

            if (response.ok) {

                document.getElementById("message").textContent =
                    "Transaction added successfully!";

                document.getElementById("transactionForm").reset();

            } else {

                document.getElementById("message").textContent =
                    result;
            }

        } catch (error) {

            console.error(error);

            document.getElementById("message").textContent =
                "Something went wrong. Please try again.";
        }
    });