function showToast(msg, type = 'error', ms = 3000) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.className = 'toast ' + type;
    setTimeout(() => { toast.className = 'toast hidden'; }, ms);
}
document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errEl = document.getElementById('login-error-msg');
    const btn = document.getElementById('login-btn');
    if (!username || !password) {
        errEl.textContent = 'Please fill in all fields.';
        errEl.classList.remove('hidden');
        return;
    }
    btn.disabled = true;
    btn.textContent = 'Signing in…';
    errEl.classList.add('hidden');
    const body = new URLSearchParams({ username, password });
    fetch('/TokenQueueApp/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString()
    })
        .then(r => r.json())
        .then(data => {
            if (data.success) {
                showToast('Login successful! Redirecting…', 'success', 1500);
                setTimeout(() => { window.location.href = '/TokenQueueApp/admin.jsp'; }, 800);
            } else {
                errEl.textContent = data.message || 'Invalid credentials.';
                errEl.classList.remove('hidden');
                btn.disabled = false;
                btn.textContent = 'Sign In';
            }
        })
        .catch(() => {
            errEl.textContent = 'Network error. Please try again.';
            errEl.classList.remove('hidden');
            btn.disabled = false;
            btn.textContent = 'Sign In';
        });
});
