const userId = 1;

// URL से transaction ID लेना
const urlParams = new URLSearchParams(window.location.search);
const transactionId = urlParams.get("id");


// Existing transaction की details load करना
async function loadTransaction() {

    if (!transactionId) {
        document.getElementById("message").textContent =
            "Transaction ID not found.";
        return;
    }

    try {

        const response = await fetch(
            `http://localhost:8080/api/transactions?userId=${userId}`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch transactions");
        }

        const transactions = await response.json();

        const transaction = transactions.find(
            item => item.id == transactionId
        );

        if (!transaction) {
            document.getElementById("message").textContent =
                "Transaction not found.";
            return;
        }

        // Form में old data भरना
        document.getElementById("title").value =
            transaction.title;

        document.getElementById("amount").value =
            transaction.amount;

        document.getElementById("type").value =
            transaction.type;

        document.getElementById("category").value =
            transaction.category;

        document.getElementById("date").value =
            transaction.date;

    } catch (error) {

        console.error("UPDATE ERROR:",error);

        document.getElementById("message").textContent =
            error.message;
    }
}


// Update transaction
document.getElementById("editTransactionForm")
    .addEventListener("submit", async function(event) {

        event.preventDefault();

        const updatedTransaction = {

            title: document.getElementById("title").value,

            amount: Number(
                document.getElementById("amount").value
            ),

            type: document.getElementById("type").value,

            category: document.getElementById("category").value,

            date: document.getElementById("date").value
        };


        try {

            const response = await fetch(
                `http://localhost:8080/api/transactions/${transactionId}?userId=${userId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(updatedTransaction)
                }
            );

            const result = await response.text();


            if (response.ok) {

                document.getElementById("message").textContent =
                    "Transaction updated successfully!";

                setTimeout(function() {

                    window.location.href =
                        "transactions.html";

                }, 1000);

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


// Page load होते ही transaction की details लाओ
loadTransaction();