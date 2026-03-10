let today = new Date();

let day = String(today.getDate()).padStart(2, '0');
let month = String(today.getMonth() + 1).padStart(2, '0');
let year = today.getFullYear();

let formatted = `${year}-${month}-${day}`;







function addPage() {



    console.log(document.getElementById("add_input_date"));
    document.getElementById("add_input_date").value = formatted;

    document.getElementById("add_button").addEventListener("click", function () {
        console.log("Button clicked!");
        let transaction = {
            id: Date.now(),
            date: document.getElementById("add_input_date").value,
            type: document.getElementById("add_select").value,
            amount: document.getElementById("add_input_amount").value,
            description: document.getElementById("add_textarea").value
        };

        let trimDate = transaction.date.trim();
        let trimType = transaction.type.trim();
        let trimAmount = transaction.amount.trim();

        if (!trimDate || !trimType || !trimAmount) {
            alert("Please fill all mandatory fields!");
        } else {
            saveTransaction(transaction);
            checkExpenseOrIncome(transaction);
            chartValues(transaction);
        }

    });




    function saveTransaction(transaction) {

        let d = new Date(transaction.date);
        let key = (d.getMonth() + 1).toString().padStart(2, '0') + d.getFullYear();

        let data = localStorage.getItem(key);
        let transactions = data ? JSON.parse(data) : [];

        transactions.push(transaction);

        // SORT BY DATE
        transactions.sort((a, b) => new Date(a.date) - new Date(b.date));

        localStorage.setItem(key, JSON.stringify(transactions));

        document.getElementById("add_input_amount").value = "";
        document.getElementById("add_textarea").value = "";
    }

    function checkExpenseOrIncome(transaction) {
        let d = new Date(transaction.date);
        let key = (d.getMonth() + 1).toString().padStart(2, '0') + d.getFullYear();

        let summaryKey = "t-" + key;

        let data = localStorage.getItem(summaryKey);
        let summary = data ? JSON.parse(data) : {
            totalIncome: 0,
            totalExpense: 0,
            balance: 0
        };

        amount = Number(transaction.amount);
        let type = transaction.type;

        if (type === "Money Withdrawl") {
            summary.totalIncome += amount;

        } else {
            summary.totalExpense += amount;
        }

        summary.balance = summary.totalIncome - summary.totalExpense;

        localStorage.setItem(summaryKey, JSON.stringify(summary));

    }


    // function chartValues(transaction) {
    //     let d = new Date(transaction.date);
    //     let key = (d.getMonth() + 1).toString().padStart(2, '0') + d.getFullYear();

    //     let summaryKey = "c-" + key;

    //     let data = localStorage.getItem(summaryKey);
    //     let summary = data ? JSON.parse(data) : [];

    //     amount = Number(transaction.amount);
    //     let type = transaction.type;
    //     if (!data) {
    //         if (type === "Money Withdrawl") {
    //             summaryChart = {
    //                 date: transaction.date,
    //                 income: transaction.amount,
    //                 expense: 0
    //             }
    //             console.log(summaryChart);

    //         } else {
    //             summaryChart = {
    //                 date: transaction.date,
    //                 income: 0,
    //                 expense: transaction.amount
    //             }
    //         }
    //     } else {
    //         if (data.date === transaction.date) {
    //             if (type === "Money Withdrawl") {
    //                 summaryChart = {
    //                     date: transaction.date,
    //                     income: data.amount + transaction.amount,
    //                     expense: 0
    //                 }
    //                 console.log(summaryChart);

    //             } else {
    //                 summaryChart = {
    //                     date: transaction.date,
    //                     income: 0,
    //                     expense: data.amount + transaction.amount
    //                 }
    //             }
    //         } else {
    //             if (type === "Money Withdrawl") {
    //                 summaryChart = {
    //                     date: transaction.date,
    //                     income: transaction.amount,
    //                     expense: 0
    //                 }
    //                 console.log(summaryChart);

    //             } else {
    //                 summaryChart = {
    //                     date: transaction.date,
    //                     income: 0,
    //                     expense: transaction.amount
    //                 }
    //             }


    //         }
    //     }

    //     summary.push(summaryChart);

    //     localStorage.setItem(summaryKey, JSON.stringify(summary));
    // }

    function chartValues(transaction) {
    let d = new Date(transaction.date);
    let key = (d.getMonth() + 1).toString().padStart(2, '0') + d.getFullYear();
    let summaryKey = "c-" + key;

    let data = localStorage.getItem(summaryKey);
    let summary = data ? JSON.parse(data) : [];

    let amount = Number(transaction.amount);
    let type = transaction.type;

    // find existing entry with same date
    let index = summary.findIndex(item => item.date === transaction.date);

    if (index !== -1) {
        // update existing record
        if (type === "Money Withdrawl") {
            summary[index].income += amount;
        } else {
            summary[index].expense += amount;
        }
    } else {
        // create new record
        let summaryChart;

        if (type === "Money Withdrawl") {
            summaryChart = {
                date: transaction.date,
                income: amount,
                expense: 0
            };
        } else {
            summaryChart = {
                date: transaction.date,
                income: 0,
                expense: amount
            };
        }

        summary.push(summaryChart);
    }

    localStorage.setItem(summaryKey, JSON.stringify(summary));
}


}









// index

function indexPage() {

    let d = new Date(formatted);
    let key = (d.getMonth() + 1).toString().padStart(2, '0') + d.getFullYear();
    let summaryKey = "t-" + key;

    let data = localStorage.getItem(summaryKey);
    let summary = data ? JSON.parse(data) : {
        totalIncome: 0,
        totalExpense: 0,
        balance: 0
    };

    document.getElementById("current_balance").textContent = summary.balance;
    document.getElementById("monthly_expense").textContent = summary.totalExpense;
    document.getElementById("monthly_income").textContent = summary.totalIncome;

}


function editPage() {

}



















// Page map



const pageMap = {
    index: indexPage,
    add: addPage,
    edit: editPage
};

document.addEventListener("DOMContentLoaded", function () {

    const path = window.location.pathname; // e.g., "/add.html"
    const page = path.split("/").pop().replace(".html", ""); // "add"

    if (page && pageMap[page]) {
        pageMap[page]();
    }
});