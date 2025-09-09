document.getElementById('register-form').addEventListener('submit', function(e) {
  e.preventDefault();

  fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: document.getElementById('username').value,
      password: document.getElementById('password').value,
      name: document.getElementById('name').value
      // salary is NOT sent here
    }),
  })
  .then(res => {
    if(res.ok) {
      alert('Registration successful! Please login.');
      window.location.href = 'login.html';
    } else {
      res.text().then(text => {
        document.getElementById('msg').textContent = text;
      });
    }
  });
});
