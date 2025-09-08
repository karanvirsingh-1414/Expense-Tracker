const user = JSON.parse(sessionStorage.getItem('user'));
if(!user) {
  window.location.href = 'login.html'; // if not logged in redirect
}

document.getElementById('profile-form').addEventListener('submit', function(e) {
  e.preventDefault();
  fetch(`/api/auth/profile/${user.id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: document.getElementById('name').value,
      salary: parseFloat(document.getElementById('salary').value),
    }),
  }).then(res => {
    if(res.ok) {
      alert('Profile updated! Redirecting to Dashboard.');
      window.location.href = 'index.html';
    }
  });
});
