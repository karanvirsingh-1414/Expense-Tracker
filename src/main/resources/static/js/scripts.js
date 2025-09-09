let allExpenses = [];

// Fetch all expenses and show category folders (main view)
function fetchExpensesAndShowCategories() {
  fetch(`/api/expenses?username=${JSON.parse(sessionStorage.getItem('user')).username}`)
    .then(res => res.json())
    .then(data => {
      console.log('Fetched expenses:', data);
      allExpenses = data;
      showCategoryFolders();
      // Show form and hide summary box on category view
      document.getElementById('expense-form').style.display = 'flex';
      document.getElementById('summary-box').style.display = 'none';
    })
    .catch(err => {
      console.error('Error fetching expenses:', err);
      alert('Failed to load expenses.');
    });
}

// Show all category folders as clickable divs
function showCategoryFolders() {
  const mainView = document.getElementById('main-view');
  mainView.innerHTML = '';
  if (allExpenses.length === 0) {
    mainView.innerHTML = '<p>No expenses found. Add your first one!</p>';
    return;
  }
  const categories = [...new Set(allExpenses.map(e => e.category))];

  const folderContainer = document.createElement('div');
  folderContainer.className = 'category-folder-container';

  categories.forEach(category => {
    const folder = document.createElement('div');
    folder.className = 'category-folder';
    folder.textContent = category;
    folder.addEventListener('click', () => showCategoryExpenses(category));
    folderContainer.appendChild(folder);
  });

  mainView.appendChild(folderContainer);
}

// Show expenses for a specific category with summary and back button
function showCategoryExpenses(category) {
  const mainView = document.getElementById('main-view');
  mainView.innerHTML = '';

  // Hide form and show summary box
  document.getElementById('expense-form').style.display = 'none';
  const summaryBox = document.getElementById('summary-box');
  summaryBox.style.display = 'block';

  const backBtn = document.createElement('button');
  backBtn.textContent = 'Back';
  backBtn.className = 'back-btn';
  backBtn.onclick = () => {
    summaryBox.style.display = 'none';
    document.getElementById('expense-form').style.display = 'flex';
    fetchExpensesAndShowCategories();
    fetchExpenseSummary();
  };

  const heading = document.createElement('h2');
  heading.textContent = category;

  mainView.appendChild(backBtn);
  mainView.appendChild(heading);

  // Expenses filter by category
  const expenses = allExpenses.filter(e => e.category === category);

  // Calculate summary values
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const salary = parseFloat(document.getElementById('salary-amount').textContent);
  document.getElementById('total-expenses').textContent = totalExpenses.toFixed(2);
  document.getElementById('remaining-money').textContent = (salary - totalExpenses).toFixed(2);

  const list = document.createElement('div');
  list.className = 'card-list';

  expenses.forEach(expense => {
    const card = document.createElement('div');
    card.className = 'expense-card';

    card.innerHTML = `
      <div class="expense-amount">₹${expense.amount.toFixed(2)}</div>
      <div class="expense-description"><i>${expense.description}</i></div>
      <div class="expense-date">${expense.date}</div>
      <button class="edit-btn">Edit</button>
      <button class="delete-btn">Delete</button>
    `;

    card.querySelector('.delete-btn').addEventListener('click', () => {
      if (confirm('Delete this expense?')) {
        fetch(`/api/expenses/${expense.id}`, { method: 'DELETE' })
          .then(res => {
            if (res.ok) {
              alert('Deleted');
              fetchExpensesAndShowCategories();
              fetchExpenseSummary();
            } else {
              alert('Delete failed!');
            }
          })
          .catch(() => alert('Error deleting expense.'));
      }
    });

    card.querySelector('.edit-btn').addEventListener('click', () => {
      enableEditMode(card, expense, category);
    });

    list.appendChild(card);
  });

  mainView.appendChild(list);
}

// Enable edit mode for a specific expense card
function enableEditMode(card, expense, category) {
  card.classList.add('edit-mode');
  card.innerHTML = `
    <input type="number" id="edit-amount" value="${expense.amount}" />
    <input type="text" id="edit-description" value="${expense.description}" />
    <input type="date" id="edit-date" value="${expense.date}" />
    <button class="save-btn">Save</button>
    <button class="cancel-btn">Cancel</button>
  `;

  card.querySelector('.save-btn').addEventListener('click', () => {
    const updatedExpense = {
      amount: parseFloat(card.querySelector('#edit-amount').value),
      category: category,
      description: card.querySelector('#edit-description').value,
      date: card.querySelector('#edit-date').value,
      user: JSON.parse(sessionStorage.getItem('user'))
    };
    fetch(`/api/expenses/${expense.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedExpense),
    })
      .then(res => {
        if (res.ok) {
          alert('Updated!');
          fetchExpensesAndShowCategories();
          fetchExpenseSummary();
        } else {
          alert('Update failed!');
        }
      })
      .catch(() => alert('Error updating expense.'));
  });

  card.querySelector('.cancel-btn').addEventListener('click', () => {
    showCategoryExpenses(category);
  });
}

// Add new expense handler
document.getElementById('expense-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const user = JSON.parse(sessionStorage.getItem('user'));

  const expense = {
    amount: parseFloat(document.getElementById('amount').value),
    category: document.getElementById('category').value.trim(),
    description: document.getElementById('description').value.trim(),
    date: document.getElementById('date').value,
    user: user  // Link expense to logged-in user
  };

  fetch('/api/expenses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(expense),
  })
    .then(res => {
      if (res.ok) {
        this.reset();
        fetchExpensesAndShowCategories();
        fetchExpenseSummary();
      } else {
        alert('Failed to add expense.');
      }
    })
    .catch(() => alert('Error while adding expense.'));
});

// Fetch summary info from backend
function fetchExpenseSummary() {
  const user = JSON.parse(sessionStorage.getItem('user'));
  fetch(`/api/expenses/summary?username=${user.username}`)
    .then(res => {
      if (!res.ok) throw new Error('Summary fetch failed');
      return res.json();
    })
    .then(data => {
      document.getElementById('salary-amount').textContent = data.salary.toFixed(2);
      document.getElementById('total-expenses').textContent = data.totalExpense.toFixed(2);
      document.getElementById('remaining-money').textContent = data.remainingMoney.toFixed(2);
      document.getElementById('summary-box').style.display = 'block';
    })
    .catch(err => {
      console.error(err);
      alert('Error loading summary');
    });
}

// Initial page load
window.onload = function () {
  fetchExpenseSummary();
  fetchExpensesAndShowCategories();
};
