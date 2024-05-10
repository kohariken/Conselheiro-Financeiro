let incomes = [];
let expenses = [];

function addIncome() {
    const description = document.getElementById('income-description').value;
    const amount = parseFloat(document.getElementById('income-amount').value);
    const day = parseInt(document.getElementById('income-day').value);
    if (isNaN(amount) || amount <= 0 || isNaN(day) || day < 1 || day > 31) {
        alert("Por favor, insira descrições válidas e valores para dia e receita.");
        return;
    }
    incomes.push({ description, amount, day });
    updateDisplay();
}

function addExpense() {
    const description = document.getElementById('expense-description').value;
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const day = parseInt(document.getElementById('expense-day').value);
    if (isNaN(amount) || amount <= 0 || isNaN(day) || day < 1 || day > 31) {
        alert("Por favor, insira descrições válidas e valores para dia e despesa.");
        return;
    }
    expenses.push({ description, amount, day });
    updateDisplay();
}

function deleteIncome(index) {
    incomes.splice(index, 1);
    updateDisplay();
}

function deleteExpense(index) {
    expenses.splice(index, 1);
    updateDisplay();
}

function updateDisplay() {
    // Update Tables
    updateTables();

    // Calculate and Update Daily Balances
    const dailyBalances = calculateDailyBalances();

    // Update Days Container
    updateDaysContainer(dailyBalances);

    // Update Local Storage
    localStorage.setItem('incomes', JSON.stringify(incomes));
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

function updateTables() {
    const incomeTable = document.getElementById('incomes-table').getElementsByTagName('tbody')[0];
    const expenseTable = document.getElementById('expenses-table').getElementsByTagName('tbody')[0];

    incomeTable.innerHTML = '';
    incomes.forEach((income, index) => {
        incomeTable.innerHTML += `<tr><td>${income.description}</td><td>R$ ${income.amount.toFixed(2)}</td><td>${income.day}</td><td><button onclick="deleteIncome(${index})">Excluir</button></td></tr>`;
    });
    expenseTable.innerHTML = '';
    expenses.forEach((expense, index) => {
        expenseTable.innerHTML += `<tr><td>${expense.description}</td><td>R$ ${expense.amount.toFixed(2)}</td><td>${expense.day}</td><td><button onclick="deleteExpense(${index})">Excluir</button></td></tr>`;
    });
}

function calculateDailyBalances() {
    const currentDate = new Date();
    const monthDayCount = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    let dailyBalances = Array(monthDayCount).fill(0);

    incomes.forEach(income => {
        for (let day = income.day - 1; day < monthDayCount; day++) {
            dailyBalances[day] += income.amount;
        }
    });

    expenses.forEach(expense => {
        for (let day = expense.day - 1; day < monthDayCount; day++) {
            dailyBalances[day] -= expense.amount;
        }
    });

    return dailyBalances;
}

function updateDaysContainer(dailyBalances) {
    const daysContainer = document.getElementById('days-container');
    daysContainer.innerHTML = '';
    dailyBalances.forEach((balance, index) => {
        const dayElement = document.createElement('div');
        dayElement.className = 'day';
        dayElement.textContent = `Dia ${index + 1}: R$ ${balance.toFixed(2)}`;
        if (balance <= 0) {
            dayElement.style.backgroundColor = "purple"; // Purple for zero or negative balance
        } else if (balance < 249) {
            dayElement.classList.add('below-minimum');
        } else if (balance >= 250 && balance <= 799) {
            dayElement.classList.add('warning-level');
        } else {
            dayElement.style.backgroundColor = "#4CAF50";  // Green for good financial health
        }
        daysContainer.appendChild(dayElement);
    });
}

window.onload = function() {
    incomes = JSON.parse(localStorage.getItem('incomes')) || [];
    expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    updateDisplay();
}
