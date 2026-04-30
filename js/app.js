const BASE = '';
function showToast(msg, type = 'success', ms = 3000) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.className = 'toast ' + type;
    setTimeout(() => { toast.className = 'toast hidden'; }, ms);
}
function post(url, params = {}) {
    const body = new URLSearchParams(params);
    return fetch(BASE + url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString()
    }).then(r => r.json());
}
function get(url) {
    return fetch(BASE + url).then(r => r.json());
}
function renderQueue(queue) {
    const { currentServing, waitingTokens, averageServiceTime } = queue;
    document.getElementById('current-token').textContent = currentServing ? currentServing.token : 'None';
    document.getElementById('avg-time').textContent = averageServiceTime;
    const badge = document.getElementById('queue-badge');
    if (badge) badge.textContent = waitingTokens.length;
    
    const header = document.getElementById('queue-list-header');
    if (header) {
        header.textContent = 'Queue (' + waitingTokens.length + ' people)';
    }

    const resultTokenEl = document.querySelector('#token-result .token-big');
    if (resultTokenEl) {
        const myToken = resultTokenEl.textContent;
        const resultMsgEl = document.querySelector('#token-result p');
        if (resultMsgEl) {
            if (currentServing && currentServing.token === myToken) {
                resultMsgEl.textContent = 'You are being served!';
            } else if (waitingTokens.find(t => t.token === myToken)) {
                resultMsgEl.textContent = 'You are in the queue!';
            } else {
                resultMsgEl.textContent = 'Service completed or queue reset.';
            }
        }
    }

    const grid = document.getElementById('token-grid');
    if (!grid) return;
    grid.innerHTML = '';
    if (waitingTokens.length === 0) {
        grid.innerHTML = '<p class="empty-msg">Queue is empty — be the first!</p>';
        return;
    }
    waitingTokens.forEach((t, i) => {
        const chip = document.createElement('div');
        chip.innerHTML = `${t.token} - ${t.estimatedWaitTime} min`;
        grid.appendChild(chip);
    });
}
document.getElementById('get-token-btn').addEventListener('click', () => {
    post('/TokenQueueApp/generateToken').then(data => {
        if (!data.success) { showToast('Error generating token', 'error'); return; }
        const result = document.getElementById('token-result');
        result.innerHTML =
            `<div class="token-big">${data.token.token}</div>
             <p>You are in the queue!</p>`;
        result.classList.remove('hidden');
        showToast('Token ' + data.token.token + ' generated!', 'success');
        pollStatus();
    }).catch(() => showToast('Network error', 'error'));
});
document.getElementById('search-btn').addEventListener('click', searchToken);
document.getElementById('search-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') searchToken();
});
function searchToken() {
    const query = document.getElementById('search-input').value.trim();
    if (!query) { showToast('Enter a token number', 'error'); return; }
    post('/TokenQueueApp/searchToken', { token: query }).then(data => {
        const el = $('search-result');
        el.classList.remove('hidden', 'success', 'error');
        if (!data.success) {
            el.classList.add('error');
            el.innerHTML = `<strong>Not found.</strong> Check the token number and try again.`;
            return;
        }
        el.classList.add('success');
        const t = data.token;
        let info = `<strong>${t.token}</strong> &nbsp;·&nbsp; Status: <em>${t.status}</em>`;
        if (t.status === 'waiting') {
            info += `<br>Position: #${data.position} &nbsp;·&nbsp; Est. wait: ~${data.estimatedWaitTime} min`;
        } else if (t.status === 'serving') {
            info += `<br>You are currently being served!`;
        } else {
            info += `<br>Service completed.`;
        }
        el.innerHTML = info;
    }).catch(() => showToast('Network error', 'error'));
}
function pollStatus() {
    get('/TokenQueueApp/queueStatus').then(data => {
        if (data.success) renderQueue(data.queue);
    }).catch(() => { });
}
setInterval(pollStatus, 4000);
pollStatus();
