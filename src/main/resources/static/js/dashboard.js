const user = JSON.parse(sessionStorage.getItem('user'));
if (!user) {
  window.location.href = 'login.html';
}

// Fetch and show expense summary and expenses list
function fetchExpenseSummary() {
  fetch(`/api/expenses/summary?username=${user.username}`)
    .then(res => {
      if (res.ok) return res.json();
      throw new Error('Failed to fetch summary');
    })
    .then(data => {
      document.getElementById('salary-amount').textContent = data.salary.toFixed(2);
      document.getElementById('total-expenses').textContent = data.totalExpense.toFixed(2);
      document.getElementById('remaining-money').textContent = data.remainingMoney.toFixed(2);
      document.getElementById('summary-box').style.display = 'block';
    })
    .catch(err => {
      console.error(err);
      alert('Error loading data');
    });
}

// Fetch and show user-specific expenses in main view as cards
function fetchAndShowExpenses() {
  fetch(`/api/expenses?username=${user.username}`)
    .then(res => res.json())
    .then(expenses => {
      const mainView = document.getElementById('main-view');
      mainView.innerHTML = ''; // Clear previous content

      if (expenses.length === 0) {
        mainView.innerHTML = '<p>No expenses found.</p>';
        return;
      }

      expenses.forEach(expense => {
        const card = document.createElement('div');
        card.className = 'expense-card';
        card.innerHTML = `
          <div class="expense-amount">₹${expense.amount.toFixed(2)}</div>
          <div class="expense-description"><i>${expense.description || ''}</i></div>
          <div class="expense-category">${expense.category}</div>
          <div class="expense-date">${expense.date}</div>
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Delete</button>
        `;

        // Delete expense handler
        card.querySelector('.delete-btn').addEventListener('click', () => {
          if (confirm('Delete this expense?')) {
            fetch(`/api/expenses/${expense.id}`, { method: 'DELETE' })
              .then(res => {
                if (res.ok) {
                  alert('Deleted');
                  fetchAndShowExpenses();
                  fetchExpenseSummary();
                } else {
                  alert('Delete failed!');
                }
              });
          }
        });

        // Edit expense handler (implementation can be added here)

        mainView.appendChild(card);
      });
    });
}

// Call both on page load
window.onload = function () {
  fetchExpenseSummary();
  fetchAndShowExpenses();
};
