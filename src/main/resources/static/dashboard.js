// LOGIN CHECK
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (!currentUser) {
    window.location.href = "login.html";
}

const userId = currentUser.id;


// LOAD DASHBOARD
async function loadDashboard() {
    try {
        const response = await fetch(
            `http://localhost:8080/api/transactions?userId=${userId}`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch transactions");
        }

        const transactions = await response.json();

        let totalIncome = 0;
        let totalExpense = 0;

        transactions.forEach(transaction => {
            const amount = Number(transaction.amount);

            if (transaction.type.toLowerCase() === "income") {
                totalIncome += amount;
            } else if (transaction.type.toLowerCase() === "expense") {
                totalExpense += amount;
            }
        });

        const totalBalance = totalIncome - totalExpense;

        document.getElementById("totalIncome").textContent = `₹${totalIncome}`;
        document.getElementById("totalExpense").textContent = `₹${totalExpense}`;
        document.getElementById("totalBalance").textContent = `₹${totalBalance}`;

        document.getElementById("chartIncome").textContent = `₹${totalIncome}`;
        document.getElementById("chartExpense").textContent = `₹${totalExpense}`;

        const maximum = Math.max(totalIncome, totalExpense, 1);

        const incomeHeight = (totalIncome / maximum) * 180;
        const expenseHeight = (totalExpense / maximum) * 180;

        document.getElementById("incomeBar").style.height =
            `${incomeHeight}px`;

        document.getElementById("expenseBar").style.height =
            `${expenseHeight}px`;

        displayTransactions(transactions);

    } catch (error) {
        console.error(error);

        document.getElementById("transactionList").innerHTML =
            `<p class="empty-message">Unable to load transactions.</p>`;
    }
}


// DISPLAY RECENT TRANSACTIONS
function displayTransactions(transactions) {

    const transactionList =
        document.getElementById("transactionList");

    if (transactions.length === 0) {

        transactionList.innerHTML =
            `<p class="empty-message">No transactions found.</p>`;

        return;
    }

    transactionList.innerHTML = "";

    transactions.slice(-5).reverse().forEach(transaction => {

        const transactionItem =
            document.createElement("div");

        transactionItem.className = "transaction-item";

        const amountClass =
            transaction.type.toLowerCase() === "income"
                ? "income-amount"
                : "expense-amount";

        transactionItem.innerHTML = `
            <div>
                <h3>${transaction.title}</h3>
                <p>Category: ${transaction.category}</p>
                <p>Date: ${transaction.date}</p>
            </div>

            <div>
                <strong class="${amountClass}">
                    ₹${transaction.amount}
                </strong>

                <p>${transaction.type}</p>
            </div>
        `;

        transactionList.appendChild(transactionItem);
    });
}


// ADD TRANSACTION
document.getElementById("addTransactionBtn")
    .addEventListener("click", function() {

        window.location.href = "add-transaction.html";

    });


// VIEW ALL
document.getElementById("viewAllBtn")
    .addEventListener("click", function() {

        window.location.href = "transactions.html";

    });


// LOGOUT
document.getElementById("logoutBtn")
    .addEventListener("click", function() {

        localStorage.removeItem("currentUser");
        localStorage.removeItem("studentUser");

        window.location.href = "login.html";

    });


// START DASHBOARD
loadDashboard();