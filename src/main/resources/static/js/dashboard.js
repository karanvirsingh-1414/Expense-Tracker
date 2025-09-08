const user = JSON.parse(sessionStorage.getItem('user'));
if(!user) {
  window.location.href = 'login.html';
}

// Load user salary and expenses from backend API (to be implemented)
// Display salary, expenses, total, remaining money, etc.
