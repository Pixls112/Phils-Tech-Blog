const loginFormHandler = async (event) => {
    event.preventDefault();
  
    const name = document.querySelector('#username-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();
  
    if (name && password) {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        body: JSON.stringify({ name, password }),
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        // reloads page to profile page when successfully logged in
        document.location.replace('/profile');
      } else {
        alert("Login failed wrong username or passowrd");
      }
    }
  };
  
  document
    .querySelector('.login-form')
    .addEventListener('submit', loginFormHandler);