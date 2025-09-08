// Function to delete expense by ID
function deleteExpense(id) {
  fetch(`/api/expenses/${id}`, {
    method: 'DELETE',
  })
  .then(response => {
    if(response.ok) {
      alert('Expense deleted successfully');
      loadExpenses();
    } else {
      alert('Failed to delete expense');
    }
  })
  .catch(err => console.error('API error:', err));
}

// Function to enable edit mode on a card
function enableEditMode(card, expense) {
  card.classList.add('edit-mode');
  card.innerHTML = `
    <input type="number" id="edit-amount" value="${expense.amount}" />
    <input type="text" id="edit-category" value="${expense.category}" />
    <input type="text" id="edit-description" value="${expense.description}" />
    <input type="date" id="edit-date" value="${expense.date}" />
    <button class="save-btn">Save</button>
    <button class="cancel-btn">Cancel</button>
  `;

  card.querySelector('.save-btn').addEventListener('click', () => {
    const updatedExpense = {
      amount: parseFloat(card.querySelector('#edit-amount').value),
      category: card.querySelector('#edit-category').value,
      description: card.querySelector('#edit-description').value,
      date: card.querySelector('#edit-date').value,
    };

    fetch(`/api/expenses/${expense.id}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(updatedExpense),
    })
    .then(response => response.json())
    .then(() => {
      alert('Expense updated successfully');
      loadExpenses();
    })
    .catch(err => console.error('API error:', err));
  });

  card.querySelector('.cancel-btn').addEventListener('click', () => {
    loadExpenses();
  });
}

function loadExpenses() {
  fetch('/api/expenses')
    .then(response => response.json())
    .then(data => {
      const listDiv = document.getElementById('expense-list');
      listDiv.innerHTML = '';
      data.forEach(expense => {
        const card = document.createElement('div');
        card.classList.add('expense-card');

        card.innerHTML = `
          <div class="expense-category">${expense.category}</div>
          <div class="expense-amount">₹${expense.amount.toFixed(2)}</div>
          <div class="expense-description">${expense.description}</div>
          <div class="expense-date">${expense.date}</div>
          <button class="edit-btn">Edit</button>
          <button class="delete-btn" onclick="deleteExpense(${expense.id})">Delete</button>
        `;

        card.querySelector('.edit-btn').addEventListener('click', () => {
          enableEditMode(card, expense);
        });

        listDiv.appendChild(card);
      });
    })
    .catch(err => console.error('API error:', err));
}

// Form submit handling to add new expense
document.getElementById('expense-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const expense = {
    amount: parseFloat(document.getElementById('amount').value),
    category: document.getElementById('category').value,
    description: document.getElementById('description').value,
    date: document.getElementById('date').value
  };
  
  fetch('/api/expenses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(expense)
  })
  .then(response => response.json())
  .then(data => {
    alert('Expense added successfully');
    loadExpenses();
  })
  .catch(err => console.error('Error:', err));
});






// Load expenses on page load
window.onload = loadExpenses;
