
// DOM Elements
const loginScreen = document.getElementById('login-screen');
const dashboardScreen = document.getElementById('dashboard-screen');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const leadsBody = document.getElementById('leads-body');
const totalLeadsEl = document.getElementById('total-leads');
const newLeadsEl = document.getElementById('new-leads');
const logoutBtn = document.getElementById('logout-btn');

// Tabs & Projects Elements
const navBtns = document.querySelectorAll('.nav-btn');
const tabContents = document.querySelectorAll('.tab-content');
const projectForm = document.getElementById('project-form');
const projectsGrid = document.getElementById('projects-grid');

// Tab Switching
navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update Buttons
        navBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Show Content
        const target = btn.getAttribute('data-tab');
        tabContents.forEach(content => {
            content.style.display = content.id === `tab-${target}` ? 'block' : 'none';
        });
    });
});

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
    fetchProjects();
}

// ----------------- PROJECTS LOGIC ----------------- //

async function fetchProjects() {
    const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error fetching projects:', error);
        return;
    }
    renderProjects(projects);
}

function renderProjects(projects) {
    projectsGrid.innerHTML = '';
    
    projects.forEach(p => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
            <img src="${p.image_url}" class="project-img" alt="${p.title}" onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
            <div class="project-body">
                <div class="project-title">${p.title}</div>
                <div style="font-size:0.8rem; color:#94a3b8; margin-bottom:0.5rem;">${p.description}</div>
                <div style="display:flex; gap:0.3rem; flex-wrap:wrap;">
                    ${(p.tags || []).map(t => `<span style="background:rgba(255,255,255,0.1); padding:2px 6px; border-radius:4px; font-size:0.7rem; color:#cbd5e1;">${t}</span>`).join('')}
                </div>
                <div class="project-actions">
                    <button onclick="deleteProject('${p.id}')" style="background:#ef4444; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer; font-size:0.8rem;">Delete</button>
                    <a href="${p.link}" target="_blank" style="color:#3b82f6; font-size:0.8rem; text-decoration:none; display:flex; align-items:center;">View Link &rarr;</a>
                </div>
            </div>
        `;
        projectsGrid.appendChild(card);
    });
}

// Add Project
projectForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = projectForm.querySelector('button');
    const originalText = btn.textContent;
    btn.textContent = 'Saving...';
    btn.disabled = true;

    const title = document.getElementById('proj-title').value;
    const desc = document.getElementById('proj-desc').value;
    const link = document.getElementById('proj-link').value;
    const image = document.getElementById('proj-image').value;
    const tagsStr = document.getElementById('proj-tags').value;
    const tags = tagsStr.split(',').map(t => t.trim()).filter(t => t);

    const { error } = await supabase.from('projects').insert([{
        title, description: desc, link, image_url: image, tags, display_order: 99
    }]);

    if (error) {
        console.error('Error adding project:', error);
        alert('Failed to add project');
    } else {
        projectForm.reset();
        fetchProjects();
    }

    btn.textContent = originalText;
    btn.disabled = false;
});

window.deleteProject = async function(id) {
    if (!confirm('Are you sure you want to delete this project?')) return;

    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) {
        console.error('Delete failed:', error);
        alert('Could not delete project');
    } else {
        fetchProjects();
    }
}

// ----------------- AUTH & LEADS LOGIC ----------------- //

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
