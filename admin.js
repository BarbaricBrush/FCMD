
// DOM Elements
const loginScreen = document.getElementById('login-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const leadsBody = document.getElementById('leads-body');
const totalLeadsEl = document.getElementById('total-leads');
const newLeadsEl = document.getElementById('new-leads');
const logoutBtn = document.getElementById('logout-btn');

// Check Session on Load
async function checkSession() {
    try {
        if (!window.supabase) {
            console.warn('Supabase not ready yet, waiting...');
            setTimeout(checkSession, 500);
            return;
        }
        
        const { data: { session }, error } = await window.supabase.auth.getSession();
        
        if (error) {
            console.error('Session check error:', error);
            showLogin();
            return;
        }

        if (session) {
            console.log('Session found, showing dashboard');
            showDashboard();
        } else {
            console.log('No session, showing login');
            showLogin();
        }
    } catch (err) {
        console.error('Check session failed:', err);
        showLogin();
    }
}

function showLogin() {
    loginScreen.style.display = 'flex';
    dashboardScreen.style.display = 'none';
}

function showDashboard() {
    loginScreen.style.display = 'none';
    dashboardScreen.style.display = 'block';
    fetchLeads();
}

// Login Handler
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Login attempt started...');
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginBtn = loginForm.querySelector('button');
    const originalText = loginBtn.textContent;
    
    loginBtn.textContent = 'Signing in...';
    loginBtn.disabled = true;
    loginError.textContent = '';

    try {
        if (!window.supabase) {
            throw new Error('Supabase client not initialized. Check console.');
        }

        const { data, error } = await window.supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            console.error('Supabase Auth Error:', error);
            throw error;
        }

        console.log('Login successful:', data);
        showDashboard();

    } catch (error) {
        console.error('Login failed:', error);
        loginError.textContent = error.message || 'Invalid credentials. Please try again.';
        loginBtn.textContent = originalText;
        loginBtn.disabled = false;
    }
});

// Logout Handler
logoutBtn.addEventListener('click', async () => {
    await supabase.auth.signOut();
    showLogin();
});

// Fetch Leads
async function fetchLeads() {
    const { data: leads, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching leads:', error);
        return;
    }

    renderLeads(leads);
    updateStats(leads);
}

// Render Table
function renderLeads(leads) {
    leadsBody.innerHTML = '';
    
    if (leads.length === 0) {
        leadsBody.innerHTML = '<tr><td colspan="5" style="text-align:center; color: #64748b;">No leads found yet.</td></tr>';
        return;
    }

    leads.forEach(lead => {
        const date = new Date(lead.created_at).toLocaleDateString();
        const statusClass = `status-${lead.status || 'new'}`;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${date}</td>
            <td style="font-weight: 500;">${lead.name}</td>
            <td>
                <div style="color:white;">${lead.email}</div>
                <div style="font-size: 0.8rem; color: #64748b;">${lead.phone || ''}</div>
            </td>
            <td><span class="status-badge ${statusClass}">${lead.status || 'New'}</span></td>
            <td>
                <button class="action-btn" onclick="openLead('${lead.id}')">View</button>
            </td>
        `;
        leadsBody.appendChild(row);
    });
}

// Update Stats
function updateStats(leads) {
    totalLeadsEl.textContent = leads.length;
    const newCount = leads.filter(l => l.status === 'new').length;
    newLeadsEl.textContent = newCount;
}

// Open Modal
window.openLead = async function(id) {
    const { data: lead } = await supabase.from('leads').select('*').eq('id', id).single();
    if (!lead) return;

    const modal = document.getElementById('view-modal');
    const body = document.getElementById('modal-body');
    const replyBtn = document.getElementById('email-reply-btn');
    const contactBtn = document.getElementById('mark-contacted-btn');

    body.innerHTML = `
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
            <div>
                <label style="color:#64748b; font-size:0.8rem;">Name</label>
                <div style="color:white;">${lead.name}</div>
            </div>
            <div>
                <label style="color:#64748b; font-size:0.8rem;">Date</label>
                <div style="color:white;">${new Date(lead.created_at).toLocaleString()}</div>
            </div>
            <div>
                <label style="color:#64748b; font-size:0.8rem;">Email</label>
                <div style="color:white;">${lead.email}</div>
            </div>
            <div>
                <label style="color:#64748b; font-size:0.8rem;">Phone</label>
                <div style="color:white;">${lead.phone || '-'}</div>
            </div>
        </div>
        <label style="color:#64748b; font-size:0.8rem;">Message</label>
        <div class="message-detail">${lead.message}</div>
    `;

    replyBtn.href = `mailto:${lead.email}?subject=Re: Your enquiry to FCMD`;
    
    contactBtn.onclick = async () => {
        await supabase.from('leads').update({ status: 'contacted' }).eq('id', id);
        modal.style.display = 'none';
        fetchLeads(); // Refresh table
    };

    modal.style.display = 'flex';
}

// Initialize
checkSession();
