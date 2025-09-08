document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault();
  fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: document.getElementById('username').value,
      password: document.getElementById('password').value,
    }),
  })
  .then(response => {
    if(response.ok) return response.json();
    throw new Error('Invalid credentials');
  })
  .then(user => {
    // Store user info in localStorage/sessionStorage (demo only, not secure)
    sessionStorage.setItem('user', JSON.stringify(user));
    // Redirect to profile page after login
    window.location.href = 'profile.html';
  })
  .catch(err => {
    document.getElementById('msg').textContent = err.message;
  });
});
