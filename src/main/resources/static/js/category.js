let allExpenses = [];

// Fetch expenses from backend and show categories
function fetchExpensesAndShowCategories() {
  fetch('/api/expenses')
    .then(res => res.json())
    .then(data => {
      allExpenses = data;
      showCategoryFolders();
      // Show form when categories shown
      document.getElementById('expense-form').style.display = 'flex';
      document.getElementById('summary-box').style.display = 'none';
    });
}

// Show folders of categories
function showCategoryFolders() {
  const mainView = document.getElementById('main-view');
  mainView.innerHTML = '';
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

// Show all expenses of a category with summary and back button
function showCategoryExpenses(category) {
  const mainView = document.getElementById('main-view');
  mainView.innerHTML = '';

  // Hide add form, show summary box
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
  };

  const heading = document.createElement('h2');
  heading.textContent = category;

  mainView.appendChild(backBtn);
  mainView.appendChild(heading);

  const expenses = allExpenses.filter(e => e.category === category);

  // Calculate totals
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
            } else {
              alert('Delete failed!');
            }
          });
      }
    });

    card.querySelector('.edit-btn').addEventListener('click', () => {
      enableEditMode(card, expense, category);
    });

    list.appendChild(card);
  });

  mainView.appendChild(list);
}

// Edit mode logic on single expense card
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
        } else {
          alert('Update failed!');
        }
      });
  });

  card.querySelector('.cancel-btn').addEventListener('click', () => {
    showCategoryExpenses(category);
  });
}

// Add expense form submit handler
document.getElementById('expense-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const expense = {
    amount: parseFloat(document.getElementById('amount').value),
    category: document.getElementById('category').value.trim(),
    description: document.getElementById('description').value.trim(),
    date: document.getElementById('date').value,
  };

  fetch('/api/expenses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(expense),
  })
    .then((res) => res.json())
    .then(() => {
      this.reset();
      fetchExpensesAndShowCategories();
    })
    .catch((err) => console.error('Error:', err));
});

// Initial load
window.onload = fetchExpensesAndShowCategories;
