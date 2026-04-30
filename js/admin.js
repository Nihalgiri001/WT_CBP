function showToast(msg, type = 'success', ms = 3000) {
    const t = $('toast');
    t.textContent = msg;
    t.className = 'toast ' + type;
    setTimeout(() => { t.className = 'toast hidden'; }, ms);
}
function post(url, params = {}) {
    const body = new URLSearchParams(params);
    return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString()
    }).then(r => {
        if (r.status === 401) { window.location.href = '/TokenQueueApp/login.jsp'; }
        return r.json();
    });
}
function renderQueue(queue) {
    const { currentServing, waitingTokens, completedTokens, averageServiceTime } = queue;
    document.getElementById('stat-waiting').textContent = waitingTokens.length;
    document.getElementById('stat-serving').textContent = currentServing ? currentServing.token : '—';
    document.getElementById('stat-completed').textContent = completedTokens.length;
    document.getElementById('stat-avg').textContent = averageServiceTime + ' min';
    const badge = document.getElementById('admin-queue-badge');
    if (badge) badge.textContent = waitingTokens.length;
    const compBadge = document.getElementById('completed-badge');
    if (compBadge) compBadge.textContent = completedTokens.length;
    const tbody = document.getElementById('waiting-tbody');
    tbody.innerHTML = '';
    if (waitingTokens.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-msg">No tokens in queue</td></tr>';
    } else {
        waitingTokens.forEach((t, i) => {
            const tr = document.createElement('tr');
            if (i === 0) tr.className = 'row-next';
            tr.innerHTML = `
                <td>${i + 1}</td>
                <td><strong>${t.token}</strong></td>
                <td><span class="status-badge status-waiting">waiting</span></td>
                <td>~${t.estimatedWaitTime} min</td>
                <td><small>${t.timestamp}</small></td>`;
            tbody.appendChild(tr);
        });
    }
    if (currentServing) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>0</td>
            <td><strong>${currentServing.token}</strong></td>
            <td><span class="status-badge status-serving">serving</span></td>
            <td>—</td>
            <td><small>${currentServing.timestamp}</small></td>`;
        tbody.insertBefore(tr, tbody.firstChild);
    }
    const ctbody = document.getElementById('completed-tbody');
    ctbody.innerHTML = '';
    if (completedTokens.length === 0) {
        ctbody.innerHTML = '<tr><td colspan="3" class="empty-msg">None yet</td></tr>';
    } else {
        [...completedTokens].reverse().forEach(t => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${t.token}</strong></td>
                <td><span class="status-badge status-completed">completed</span></td>
                <td><small>${t.timestamp}</small></td>`;
            ctbody.appendChild(tr);
        });
    }
}
document.getElementById('next-token-btn').addEventListener('click', () => {
    post('/TokenQueueApp/nextToken').then(data => {
        if (!data.success) { showToast(data.message || 'Error', 'error'); return; }
        renderQueue(data.queue);
        showToast('Serving next token!', 'success');
    }).catch(() => showToast('Network error', 'error'));
});
document.getElementById('reset-queue-btn').addEventListener('click', () => {
    if (!confirm('Reset the entire queue? This cannot be undone.')) return;
    post('/TokenQueueApp/resetQueue').then(data => {
        if (!data.success) { showToast(data.message || 'Error', 'error'); return; }
        showToast('Queue has been reset.', 'success');
        pollStatus();
    }).catch(() => showToast('Network error', 'error'));
});
document.getElementById('update-time-btn').addEventListener('click', () => {
    const val = document.getElementById('avg-service-input').value;
    post('/TokenQueueApp/updateTime', { averageServiceTime: val }).then(data => {
        if (!data.success) { showToast(data.message || 'Invalid value', 'error'); return; }
        renderQueue(data.queue);
        showToast('Service time updated to ' + data.averageServiceTime + ' min', 'success');
    }).catch(() => showToast('Network error', 'error'));
});
document.getElementById('logout-btn').addEventListener('click', () => {
    post('/TokenQueueApp/logout').then(() => {
        window.location.href = '/TokenQueueApp/login.jsp';
    });
});
function pollStatus() {
    fetch('/TokenQueueApp/queueStatus')
        .then(r => {
            if (r.status === 401) { window.location.href = '/TokenQueueApp/login.jsp'; }
            return r.json();
        })
        .then(data => { if (data.success) renderQueue(data.queue); })
        .catch(() => { });
}
setInterval(pollStatus, 4000);
pollStatus();