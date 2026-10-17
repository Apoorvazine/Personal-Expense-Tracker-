




const form = document.getElementById("expenseForm");
const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const transactionList = document.getElementById("transactionList");
const emptyMessage = document.getElementById("emptyMessage");

let transactions = JSON.parse(
    localStorage.getItem("transactions")
) || [];

function saveTransactions() {
    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
}

function updateSummary() {
    const income = transactions
        .filter(item => item.type === "income")
        .reduce((total, item) => total + item.amount, 0);

    const expense = transactions
        .filter(item => item.type === "expense")
        .reduce((total, item) => total + item.amount, 0);

    document.getElementById("income").textContent =
        "₹" + income.toFixed(2);

    document.getElementById("expense").textContent =
        "₹" + expense.toFixed(2);

    document.getElementById("balance").textContent =
        "₹" + (income - expense).toFixed(2);
}

function displayTransactions() {
    transactionList.innerHTML = "";

    transactions.forEach(function(item) {
        const li = document.createElement("li");

        const info = document.createElement("div");
        info.className = "transaction-info";

        const name = document.createElement("strong");
        name.textContent = item.title;

        const type = document.createElement("small");
        type.textContent =
            item.type === "income" ? "Income" : "Expense";

        info.append(name, type);

        const amount = document.createElement("span");
        amount.className = "transaction-amount";

        const sign = item.type === "income" ? "+" : "-";
        amount.textContent = sign + "₹" + item.amount.toFixed(2);
        amount.style.color =
            item.type === "income" ? "#168653" : "#d94343";

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";

        deleteBtn.addEventListener("click", function() {
            transactions = transactions.filter(
                transaction => transaction.id !== item.id
            );

            saveTransactions();
            displayTransactions();
            updateSummary();
        });

        li.append(info, amount, deleteBtn);
        transactionList.appendChild(li);
    });

    emptyMessage.style.display =
        transactions.length === 0 ? "block" : "none";
}

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const title = titleInput.value.trim();
    const amount = Number(amountInput.value);
    const type = typeInput.value;

    if (!title || !Number.isFinite(amount) || amount <= 0) {
        alert("Please enter a valid name and amount.");
        return;
    }

    transactions.push({
        id: Date.now(),
        title: title,
        amount: amount,
        type: type
    });

    saveTransactions();
    displayTransactions();
    updateSummary();

    form.reset();
});

displayTransactions();
updateSummary();
