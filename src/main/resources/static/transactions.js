const currentUser = JSON.parse(localStorage.getItem("currentUser"));
const userId = currentUser?.id;


// ================= LOAD TRANSACTIONS =================

async function loadTransactions() {

    try {

        const response = await fetch(
            `http://localhost:8080/api/transactions?userId=${userId}`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch transactions");
        }

        const transactions = await response.json();

        displayTransactions(transactions);

    } catch (error) {

        console.error(error);

        document.getElementById("transactionList").innerHTML =
            `<p class="empty-message">
                Unable to load transactions.
            </p>`;
    }
}


// ================= DISPLAY TRANSACTIONS =================

function displayTransactions(transactions) {

    const transactionList =
        document.getElementById("transactionList");

    if (transactions.length === 0) {

        transactionList.innerHTML =
            `<p class="empty-message">
                No transactions found.
            </p>`;

        return;
    }

    transactionList.innerHTML = "";

    transactions.forEach(transaction => {

        const transactionItem =
            document.createElement("div");

        transactionItem.className = "transaction-item";

        transactionItem.innerHTML = `

            <div class="transaction-info">

                <h3>
                    ${transaction.title}
                </h3>

                <p>
                    Category: ${transaction.category}
                </p>

                <p>
                    Date: ${transaction.date}
                </p>

            </div>


            <div class="transaction-right">

                <span class="amount">
                    ₹${transaction.amount}
                </span>

                <span class="type">
                    ${transaction.type}
                </span>

                <div class="action-buttons">

                    <button
                        class="edit-btn"
                        onclick="editTransaction(${transaction.id})">
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteTransaction(${transaction.id})">
                        Delete
                    </button>

                </div>

            </div>
        `;

        transactionList.appendChild(transactionItem);

    });
}


// ================= EDIT TRANSACTION =================

function editTransaction(id) {

    window.location.href =
        `edit-transaction.html?id=${id}`;
}


// ================= DELETE TRANSACTION =================

async function deleteTransaction(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this transaction?");

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(
            `http://localhost:8080/api/transactions/${id}?userId=${userId}`,
            {
                method: "DELETE"
            }
        );

        if (response.ok) {

            alert("Transaction deleted successfully!");

            loadTransactions();

        } else {

            alert("Failed to delete transaction.");

        }

    } catch (error) {

        console.error(error);

        alert("Something went wrong.");

    }
}


// ================= FILTER TRANSACTIONS =================

document.getElementById("filterBtn")
    .addEventListener("click", async function() {

        console.log("Filter button clicked");

        const type =
            document.getElementById("typeFilter").value;

        const category =
            document.getElementById("categoryFilter").value.trim();

        const fromDate =
            document.getElementById("fromDate").value;

        const toDate =
            document.getElementById("toDate").value;


        try {

            // First load all transactions
            const response = await fetch(
                `http://localhost:8080/api/transactions?userId=${userId}`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch transactions");
            }

            let transactions = await response.json();


            // ================= TYPE FILTER =================

            if (type) {

                transactions = transactions.filter(transaction =>
                    transaction.type.toLowerCase() ===
                    type.toLowerCase()
                );
            }


            // ================= CATEGORY FILTER =================

            if (category) {

                transactions = transactions.filter(transaction =>
                    transaction.category &&
                    transaction.category.toLowerCase() ===
                    category.toLowerCase()
                );
            }


            // ================= FROM DATE FILTER =================

            if (fromDate) {

                transactions = transactions.filter(transaction =>
                    transaction.date >= fromDate
                );
            }


            // ================= TO DATE FILTER =================

            if (toDate) {

                transactions = transactions.filter(transaction =>
                    transaction.date <= toDate
                );
            }


            // ================= DATE VALIDATION =================

            if (fromDate && toDate && fromDate > toDate) {

                alert("From Date cannot be greater than To Date.");
                return;
            }


            console.log(
                "Final filtered transactions:",
                transactions
            );

            displayTransactions(transactions);

        } catch (error) {

            console.error("FILTER ERROR:", error);

            document.getElementById("transactionList").innerHTML =
                `<p class="empty-message">
                    Unable to filter transactions.
                </p>`;
        }

    });


// ================= CLEAR FILTER =================

document.getElementById("clearFilterBtn")
    .addEventListener("click", function() {

        document.getElementById("typeFilter").value = "";

        document.getElementById("categoryFilter").value = "";

        document.getElementById("fromDate").value = "";

        document.getElementById("toDate").value = "";

        loadTransactions();

    });


// ================= START =================

loadTransactions();