// ============================================================
//  ADMIN PANEL - Full CRUD for Portfolio
//  Storage keys
// ============================================================
const STORAGE_PROFILE  = 'web_profile_v1';
const STORAGE_ADMINS   = 'web_admins_v1';
const STORAGE_SESSION  = 'web_admin_session';
const STORAGE_SKILLS   = 'web_skills_v1';
const STORAGE_PROJECTS = 'web_projects_v1';
const STORAGE_CONTACT  = 'web_contact_v1';

// ── Active skill tab ──
let currentSkillTab = 'frontend';

// ============================================================
//  DEFAULT DATA
// ============================================================
function seedDefaults() {
    if (!localStorage.getItem(STORAGE_PROFILE)) {
        localStorage.setItem(STORAGE_PROFILE, JSON.stringify({
            name:   'ODBAYAR',
            uni:    'Ikh Zasag International University',
            reg:    'ВК05310111',
            code:   'ЕУ23В075',
            email:  'odbayar@ikhzasag.edu.mn',
            phone:  '70157768',
            bio:    'Software Engineering student. I build web apps and enjoy learning new tech.',
            avatar: ''
        }));
    }
    if (!localStorage.getItem(STORAGE_ADMINS)) {
        localStorage.setItem(STORAGE_ADMINS, JSON.stringify([
            { username: 'admin', password: 'admin123', created: new Date().toISOString() }
        ]));
    }
    if (!localStorage.getItem(STORAGE_SKILLS)) {
        localStorage.setItem(STORAGE_SKILLS, JSON.stringify({
            frontend: [
                { name: 'HTML5',      percent: 90 },
                { name: 'CSS3',       percent: 85 },
                { name: 'JavaScript', percent: 75 }
            ],
            tools: [
                { name: 'VS Code',  icon: 'fas fa-file-code',  color: 'text-cyber-blue'   },
                { name: 'Git',      icon: 'fab fa-git-alt',    color: 'text-cyber-purple' },
                { name: 'GitHub',   icon: 'fab fa-github',     color: 'text-cyber-pink'   },
                { name: 'Terminal', icon: 'fas fa-terminal',   color: 'text-cyber-green'  }
            ]
        }));
    }
    if (!localStorage.getItem(STORAGE_PROJECTS)) {
        localStorage.setItem(STORAGE_PROJECTS, JSON.stringify([
            { title: 'E-Commerce Website', desc: 'A modern e-commerce platform with shopping cart functionality.', link: '#', tags: ['HTML','CSS','JavaScript'], color: 'from-cyber-blue to-cyber-purple',   icon: 'fas fa-shopping-cart' },
            { title: 'Weather App',        desc: 'Real-time weather application with location-based forecasts.',  link: '#', tags: ['HTML','JavaScript','API'],  color: 'from-cyber-purple to-cyber-pink',  icon: 'fas fa-cloud-sun'     },
            { title: 'Task Manager',       desc: 'Productivity app for managing daily tasks and projects.',       link: '#', tags: ['HTML','CSS','JavaScript'], color: 'from-cyber-pink to-cyber-blue',    icon: 'fas fa-tasks'         },
            { title: 'Movie Database',     desc: 'Search and explore movies with detailed information.',          link: '#', tags: ['HTML','API'],              color: 'from-cyber-green to-cyber-blue',   icon: 'fas fa-film'          },
            { title: 'Calculator App',     desc: 'Beautiful calculator with advanced mathematical functions.',   link: '#', tags: ['HTML','CSS','JavaScript'], color: 'from-cyber-red to-cyber-purple',   icon: 'fas fa-calculator'    },
            { title: 'Memory Game',        desc: 'Interactive memory matching game with animations.',            link: '#', tags: ['HTML','CSS','JavaScript'], color: 'from-cyber-blue to-cyber-pink',    icon: 'fas fa-gamepad'       }
        ]));
    }
    if (!localStorage.getItem(STORAGE_CONTACT)) {
        localStorage.setItem(STORAGE_CONTACT, JSON.stringify({
            email:        'odbayar@ikhzasag.edu.mn',
            github:       'https://github.com/odbayar',
            githubText:   'github.com/odbayar',
            facebook:     'https://facebook.com/odbayar',
            facebookText: 'facebook.com/odbayar'
        }));
    }
}

// ============================================================
//  LOAD HELPERS
// ============================================================
function loadProfile()  { try { return JSON.parse(localStorage.getItem(STORAGE_PROFILE)  || '{}'); } catch(e) { return {}; } }
function loadAdmins()   { try { return JSON.parse(localStorage.getItem(STORAGE_ADMINS)   || '[]'); } catch(e) { return []; } }
function loadSkills()   { try { return JSON.parse(localStorage.getItem(STORAGE_SKILLS)   || '{}'); } catch(e) { return { frontend:[], tools:[] }; } }
function loadProjects() { try { return JSON.parse(localStorage.getItem(STORAGE_PROJECTS) || '[]'); } catch(e) { return []; } }
function loadContact()  { try { return JSON.parse(localStorage.getItem(STORAGE_CONTACT)  || '{}'); } catch(e) { return {}; } }
function currentAdmin() { return localStorage.getItem(STORAGE_SESSION); }

// ============================================================
//  RENDER PROFILE on page
// ============================================================
function renderProfile() {
    const p = loadProfile();
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val || ''; };

    set('profileName',  p.name  || 'ODBAYAR');
    set('profileUni',   p.uni   || 'Ikh Zasag International University');
    set('eduName',      p.uni   || 'Ikh Zasag International University');
    set('footer-name',  p.name  || 'Odbayar');
    set('aboutReg',     p.reg   || '');
    set('aboutCode',    p.code  || '');

    // bio
    const bioEl = document.getElementById('aboutBioText');
    if (bioEl && p.bio) bioEl.textContent = p.bio;

    // avatar
    const avatarSrc = p.avatar || `https://placehold.co/160x160/0a0a0a/00ffff?text=${encodeURIComponent((p.name||'OD').slice(0,2))}`;
    ['profileAvatar','profileAvatarPreview'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.src = avatarSrc;
    });
}

// ============================================================
//  RENDER SKILLS on page
// ============================================================
function renderSkills() {
    const skills = loadSkills();

    // Frontend bars
    const frontendEl = document.getElementById('frontendSkillsDisplay');
    if (frontendEl) {
        frontendEl.innerHTML = (skills.frontend || []).map(s => `
            <div>
                <div class="flex justify-between mb-2">
                    <span class="text-white font-rajdhani">${escapeHtml(s.name)}</span>
                    <span class="text-cyber-blue font-orbitron">${s.percent}%</span>
                </div>
                <div class="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div class="skill-bar h-full bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-full" data-width="${s.percent}"></div>
                </div>
            </div>
        `).join('');
        // re-trigger animation
        setTimeout(() => {
            document.querySelectorAll('.skill-bar').forEach(bar => {
                bar.style.width = bar.getAttribute('data-width') + '%';
            });
        }, 100);
    }

    // Tools grid
    const toolsEl = document.getElementById('toolsSkillsDisplay');
    if (toolsEl) {
        toolsEl.innerHTML = (skills.tools || []).map(t => `
            <div class="glass-effect p-4 rounded-lg text-center transform hover:scale-110 transition-all duration-300 border border-transparent hover:border-cyber-purple">
                <i class="${escapeHtml(t.icon)} text-4xl ${escapeHtml(t.color)} mb-3"></i>
                <p class="text-white font-rajdhani font-semibold">${escapeHtml(t.name)}</p>
            </div>
        `).join('');
    }
}

// ============================================================
//  RENDER PROJECTS on page
// ============================================================
function renderProjects() {
    const projects = loadProjects();
    const el = document.getElementById('projectsDisplay');
    if (!el) return;

    const tagColorMap = {
        'HTML':'bg-cyber-blue/20 text-cyber-blue',
        'CSS':'bg-cyber-purple/20 text-cyber-purple',
        'JavaScript':'bg-cyber-pink/20 text-cyber-pink',
        'API':'bg-cyber-green/20 text-cyber-green',
        'React':'bg-cyber-blue/20 text-cyber-blue',
        'default':'bg-white/10 text-white'
    };

    el.innerHTML = projects.map((p, i) => {
        const tags = (p.tags||[]).map(t => {
            const cls = tagColorMap[t] || tagColorMap['default'];
            return `<span class="px-3 py-1 ${cls} text-sm font-rajdhani rounded">${escapeHtml(t)}</span>`;
        }).join('');
        const link = p.link && p.link !== '#' ? `href="${escapeHtml(p.link)}" target="_blank"` : 'href="#"';
        return `
        <div class="project-card glass-effect rounded-lg overflow-hidden group">
            <div class="h-48 bg-gradient-to-br ${escapeHtml(p.color||'from-cyber-blue to-cyber-purple')} relative overflow-hidden">
                <div class="absolute inset-0 flex items-center justify-center">
                    <i class="${escapeHtml(p.icon||'fas fa-code')} text-6xl text-white opacity-20 group-hover:opacity-100 transition-opacity duration-300"></i>
                </div>
                <div class="absolute inset-0 bg-black opacity-0 group-hover:opacity-70 transition-opacity duration-300 flex items-center justify-center">
                    <a ${link} class="px-6 py-3 border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-300 font-orbitron text-sm">
                        VIEW PROJECT
                    </a>
                </div>
            </div>
            <div class="p-6">
                <h3 class="text-xl font-orbitron font-bold text-white mb-2">${escapeHtml(p.title)}</h3>
                <p class="text-gray-400 font-rajdhani mb-4">${escapeHtml(p.desc)}</p>
                <div class="flex flex-wrap gap-2">${tags}</div>
            </div>
        </div>`;
    }).join('');
}

// ============================================================
//  RENDER CONTACT on page
// ============================================================
function renderContact() {
    const c = loadContact();

    const emailLink = document.getElementById('contactEmailLink');
    if (emailLink) {
        emailLink.href = 'mailto:' + (c.email || '');
        emailLink.textContent = c.email || '';
    }
    const githubLink = document.getElementById('contactGithubLink');
    if (githubLink) {
        githubLink.href = c.github || '#';
        githubLink.textContent = c.githubText || c.github || '';
    }
    const fbLink = document.getElementById('contactFacebookLink');
    if (fbLink) {
        fbLink.href = c.facebook || '#';
        fbLink.textContent = c.facebookText || c.facebook || '';
    }
}

// ============================================================
//  ADMIN AUTH
// ============================================================
function setCurrentAdmin(u) {
    if (u) localStorage.setItem(STORAGE_SESSION, u);
    else   localStorage.removeItem(STORAGE_SESSION);
    updateAdminUI();
}

function updateAdminUI() {
    const bar     = document.getElementById('adminBar');
    const navbar  = document.getElementById('navbar');
    const nameEl  = document.getElementById('adminBarName');
    const adminBtn = document.getElementById('adminBtn');
    const logged  = !!currentAdmin();

    if (bar) {
        if (logged) {
            bar.classList.remove('hidden');
            // push navbar down
            if (navbar) navbar.style.top = '42px';
        } else {
            bar.classList.add('hidden');
            if (navbar) navbar.style.top = '0';
        }
    }
    if (nameEl) nameEl.textContent = currentAdmin() || '';
    // Hide admin button when logged in
    if (adminBtn) adminBtn.style.display = logged ? 'none' : '';
}

function openAdminLogin() {
    document.getElementById('adminLoginOverlay').classList.remove('hidden');
    document.getElementById('adminLoginOverlay').classList.add('flex');
    document.getElementById('loginError').classList.add('hidden');
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
    setTimeout(() => document.getElementById('loginUsername').focus(), 100);
}
function closeAdminLogin() {
    document.getElementById('adminLoginOverlay').classList.add('hidden');
    document.getElementById('adminLoginOverlay').classList.remove('flex');
}
function doLogin() {
    const u = document.getElementById('loginUsername').value.trim();
    const p = document.getElementById('loginPassword').value;
    const found = loadAdmins().find(a => a.username === u && a.password === p);
    if (found) {
        setCurrentAdmin(u);
        closeAdminLogin();
        toast('Тавтай морил, ' + u + '! 👋', 'success');
    } else {
        document.getElementById('loginError').classList.remove('hidden');
    }
}
function logout() {
    setCurrentAdmin(null);
    toast('Системээс гарлаа', 'info');
}

// ============================================================
//  PROFILE MODAL
// ============================================================
function openProfileModal() {
    const p = loadProfile();
    document.getElementById('pName').value  = p.name  || '';
    document.getElementById('pUni').value   = p.uni   || '';
    document.getElementById('pReg').value   = p.reg   || '';
    document.getElementById('pCode').value  = p.code  || '';
    document.getElementById('pEmail').value = p.email || '';
    document.getElementById('pPhone').value = p.phone || '';
    document.getElementById('pBio').value   = p.bio   || '';

    const preview = document.getElementById('profileAvatarPreview');
    if (preview) preview.src = p.avatar || `https://placehold.co/80x80/0a0a0a/00ffff?text=${encodeURIComponent((p.name||'OD').slice(0,2))}`;

    const modal = document.getElementById('profileModal');
    delete modal.dataset.pendingAvatar;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}
function closeProfileModal() {
    document.getElementById('profileModal').classList.add('hidden');
    document.getElementById('profileModal').classList.remove('flex');
}
function saveProfile() {
    const p    = loadProfile();
    p.name  = document.getElementById('pName').value.trim();
    p.uni   = document.getElementById('pUni').value.trim();
    p.reg   = document.getElementById('pReg').value.trim();
    p.code  = document.getElementById('pCode').value.trim();
    p.email = document.getElementById('pEmail').value.trim();
    p.phone = document.getElementById('pPhone').value.trim();
    p.bio   = document.getElementById('pBio').value.trim();

    const modal = document.getElementById('profileModal');
    if (modal.dataset.pendingAvatar) {
        p.avatar = modal.dataset.pendingAvatar;
        delete modal.dataset.pendingAvatar;
    }
    localStorage.setItem(STORAGE_PROFILE, JSON.stringify(p));
    renderProfile();
    closeProfileModal();
    toast('Profile амжилттай хадгаллаа ✅', 'success');
}
function handleProfileImageChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(ev) {
        const data = ev.target.result;
        const preview = document.getElementById('profileAvatarPreview');
        if (preview) preview.src = data;
        const modal = document.getElementById('profileModal');
        if (modal) modal.dataset.pendingAvatar = data;
    };
    reader.readAsDataURL(file);
}

// ============================================================
//  SKILLS MODAL
// ============================================================
function openSkillsModal() {
    currentSkillTab = 'frontend';
    renderSkillsModal();
    document.getElementById('skillsModal').classList.remove('hidden');
    document.getElementById('skillsModal').classList.add('flex');
}
function closeSkillsModal() {
    document.getElementById('skillsModal').classList.add('hidden');
    document.getElementById('skillsModal').classList.remove('flex');
}
function setSkillTab(tab) {
    currentSkillTab = tab;
    document.getElementById('tabFrontend').classList.toggle('active', tab === 'frontend');
    document.getElementById('tabTools').classList.toggle('active', tab === 'tools');
    document.getElementById('frontendSkillsList').classList.toggle('hidden', tab !== 'frontend');
    document.getElementById('toolsSkillsList').classList.toggle('hidden', tab !== 'tools');

    const nameInput    = document.getElementById('newSkillName');
    const percentInput = document.getElementById('newSkillPercent');
    if (tab === 'tools') {
        if (percentInput) percentInput.style.display = 'none';
        if (nameInput) nameInput.placeholder = 'Tool нэр (жш: React)';
    } else {
        if (percentInput) percentInput.style.display = '';
        if (nameInput) nameInput.placeholder = 'Skill нэр (жш: React)';
    }
}
function renderSkillsModal() {
    const skills = loadSkills();

    // Frontend list
    const fList = document.getElementById('frontendSkillsList');
    fList.innerHTML = (skills.frontend || []).map((s, i) => `
        <div class="flex items-center gap-2 p-2 bg-black/30 rounded-lg">
            <input value="${escapeHtml(s.name)}" onchange="updateFrontendSkill(${i},'name',this.value)"
                   class="admin-input flex-1 py-1 text-sm">
            <input type="number" min="1" max="100" value="${s.percent}"
                   onchange="updateFrontendSkill(${i},'percent',this.value)"
                   class="admin-input w-16 py-1 text-sm text-center">
            <span class="text-gray-400 text-sm">%</span>
            <button onclick="removeFrontendSkill(${i})" class="text-red-400 hover:text-red-300 px-2">
                <i class="fas fa-trash text-sm"></i>
            </button>
        </div>
    `).join('') || '<p class="text-gray-500 text-sm">Skill байхгүй байна</p>';

    // Tools list
    const toolIconOptions = [
        { v:'fas fa-file-code',   l:'VS Code'  },
        { v:'fab fa-git-alt',     l:'Git'      },
        { v:'fab fa-github',      l:'GitHub'   },
        { v:'fas fa-terminal',    l:'Terminal' },
        { v:'fab fa-react',       l:'React'    },
        { v:'fab fa-node-js',     l:'Node.js'  },
        { v:'fab fa-python',      l:'Python'   },
        { v:'fas fa-database',    l:'Database' },
        { v:'fab fa-docker',      l:'Docker'   },
        { v:'fas fa-code',        l:'Code'     },
    ];
    const colorOptions = [
        { v:'text-cyber-blue',   l:'Blue'   },
        { v:'text-cyber-purple', l:'Purple' },
        { v:'text-cyber-pink',   l:'Pink'   },
        { v:'text-cyber-green',  l:'Green'  },
        { v:'text-cyber-red',    l:'Red'    },
        { v:'text-white',        l:'White'  },
    ];

    const tList = document.getElementById('toolsSkillsList');
    tList.innerHTML = (skills.tools || []).map((t, i) => `
        <div class="flex items-center gap-2 p-2 bg-black/30 rounded-lg">
            <input value="${escapeHtml(t.name)}" onchange="updateTool(${i},'name',this.value)"
                   class="admin-input flex-1 py-1 text-sm">
            <select onchange="updateTool(${i},'icon',this.value)" class="admin-input py-1 text-sm text-xs">
                ${toolIconOptions.map(o => `<option value="${o.v}" ${t.icon===o.v?'selected':''}>${o.l}</option>`).join('')}
            </select>
            <select onchange="updateTool(${i},'color',this.value)" class="admin-input py-1 text-sm text-xs w-24">
                ${colorOptions.map(o => `<option value="${o.v}" ${t.color===o.v?'selected':''}>${o.l}</option>`).join('')}
            </select>
            <button onclick="removeTool(${i})" class="text-red-400 hover:text-red-300 px-2">
                <i class="fas fa-trash text-sm"></i>
            </button>
        </div>
    `).join('') || '<p class="text-gray-500 text-sm">Tool байхгүй байна</p>';
}

// Temp edit in modal (stored in local var)
let _tempSkills = null;
function getTempSkills() {
    if (!_tempSkills) _tempSkills = JSON.parse(JSON.stringify(loadSkills()));
    return _tempSkills;
}
function updateFrontendSkill(i, field, val) {
    const s = getTempSkills();
    if (field === 'percent') s.frontend[i].percent = parseInt(val) || 0;
    else s.frontend[i][field] = val;
}
function removeFrontendSkill(i) {
    const s = getTempSkills();
    s.frontend.splice(i, 1);
    renderSkillsModalFromTemp();
}
function updateTool(i, field, val) {
    const s = getTempSkills();
    s.tools[i][field] = val;
}
function removeTool(i) {
    const s = getTempSkills();
    s.tools.splice(i, 1);
    renderSkillsModalFromTemp();
}
function renderSkillsModalFromTemp() {
    const skills = getTempSkills();
    // temporarily set to render
    const backup = localStorage.getItem(STORAGE_SKILLS);
    localStorage.setItem(STORAGE_SKILLS, JSON.stringify(skills));
    renderSkillsModal();
    localStorage.setItem(STORAGE_SKILLS, backup);
}
function addSkill() {
    const name    = document.getElementById('newSkillName').value.trim();
    const percent = parseInt(document.getElementById('newSkillPercent').value) || 80;
    if (!name) { toast('Skill нэр оруулна уу', 'error'); return; }

    const s = getTempSkills();
    if (currentSkillTab === 'frontend') {
        s.frontend.push({ name, percent });
    } else {
        s.tools.push({ name, icon: 'fas fa-code', color: 'text-cyber-blue' });
    }
    document.getElementById('newSkillName').value    = '';
    document.getElementById('newSkillPercent').value = '';
    renderSkillsModalFromTemp();
}
function saveSkills() {
    // Gather current values from DOM inputs
    const skills = getTempSkills();

    // re-read frontend from DOM
    const fRows = document.querySelectorAll('#frontendSkillsList > div');
    skills.frontend = Array.from(fRows).map(row => {
        const inputs = row.querySelectorAll('input');
        return { name: inputs[0].value.trim(), percent: parseInt(inputs[1].value) || 0 };
    });

    // re-read tools from DOM
    const tRows = document.querySelectorAll('#toolsSkillsList > div');
    skills.tools = Array.from(tRows).map(row => {
        const nameInput  = row.querySelector('input');
        const selects    = row.querySelectorAll('select');
        return {
            name:  nameInput ? nameInput.value.trim() : '',
            icon:  selects[0] ? selects[0].value : 'fas fa-code',
            color: selects[1] ? selects[1].value : 'text-cyber-blue'
        };
    });

    localStorage.setItem(STORAGE_SKILLS, JSON.stringify(skills));
    _tempSkills = null;
    renderSkills();
    closeSkillsModal();
    toast('Skills амжилттай хадгаллаа ✅', 'success');
}

// ============================================================
//  PROJECTS MODAL
// ============================================================
function openProjectsModal() {
    renderProjectsModal();
    document.getElementById('projectsModal').classList.remove('hidden');
    document.getElementById('projectsModal').classList.add('flex');
}
function closeProjectsModal() {
    document.getElementById('projectsModal').classList.add('hidden');
    document.getElementById('projectsModal').classList.remove('flex');
}
function renderProjectsModal() {
    const projects = loadProjects();
    const colorOptions = [
        { v:'from-cyber-blue to-cyber-purple',  l:'Blue → Purple'  },
        { v:'from-cyber-purple to-cyber-pink',  l:'Purple → Pink'  },
        { v:'from-cyber-pink to-cyber-blue',    l:'Pink → Blue'    },
        { v:'from-cyber-green to-cyber-blue',   l:'Green → Blue'   },
        { v:'from-cyber-red to-cyber-purple',   l:'Red → Purple'   },
    ];
    const iconOptions = [
        { v:'fas fa-code',          l:'💻 Code'       },
        { v:'fas fa-shopping-cart', l:'🛒 Cart'        },
        { v:'fas fa-cloud-sun',     l:'☀️ Weather'     },
        { v:'fas fa-tasks',         l:'✅ Tasks'       },
        { v:'fas fa-film',          l:'🎬 Film'        },
        { v:'fas fa-calculator',    l:'🧮 Calculator'  },
        { v:'fas fa-gamepad',       l:'🎮 Game'        },
        { v:'fas fa-mobile-alt',    l:'📱 Mobile'      },
        { v:'fas fa-robot',         l:'🤖 AI'          },
        { v:'fas fa-database',      l:'🗄️ Database'    },
    ];

    const el = document.getElementById('projectsList');
    el.innerHTML = projects.map((p, i) => `
        <div class="p-3 bg-black/30 rounded-lg border border-white/10 space-y-2" id="proj_${i}">
            <div class="flex items-center justify-between mb-1">
                <span class="text-cyber-blue font-orbitron text-sm">#${i+1}</span>
                <button onclick="removeProject(${i})" class="text-red-400 hover:text-red-300 text-sm px-2 py-1 rounded border border-red-500/30 hover:bg-red-500/20">
                    <i class="fas fa-trash mr-1"></i>Delete
                </button>
            </div>
            <div class="grid grid-cols-2 gap-2">
                <div>
                    <label class="admin-label text-xs">Title</label>
                    <input class="admin-input py-1 text-sm" value="${escapeHtml(p.title)}"
                           onchange="updateProject(${i},'title',this.value)">
                </div>
                <div>
                    <label class="admin-label text-xs">Link URL</label>
                    <input class="admin-input py-1 text-sm" value="${escapeHtml(p.link||'#')}"
                           onchange="updateProject(${i},'link',this.value)">
                </div>
                <div class="col-span-2">
                    <label class="admin-label text-xs">Description</label>
                    <textarea class="admin-input py-1 text-sm" rows="2"
                              onchange="updateProject(${i},'desc',this.value)">${escapeHtml(p.desc)}</textarea>
                </div>
                <div>
                    <label class="admin-label text-xs">Tags (таслалаар)</label>
                    <input class="admin-input py-1 text-sm" value="${(p.tags||[]).join(', ')}"
                           onchange="updateProject(${i},'tags',this.value.split(',').map(t=>t.trim()).filter(Boolean))">
                </div>
                <div>
                    <label class="admin-label text-xs">Color</label>
                    <select class="admin-input py-1 text-sm" onchange="updateProject(${i},'color',this.value)">
                        ${colorOptions.map(o=>`<option value="${o.v}" ${p.color===o.v?'selected':''}>${o.l}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label class="admin-label text-xs">Icon</label>
                    <select class="admin-input py-1 text-sm" onchange="updateProject(${i},'icon',this.value)">
                        ${iconOptions.map(o=>`<option value="${o.v}" ${p.icon===o.v?'selected':''}>${o.l}</option>`).join('')}
                    </select>
                </div>
            </div>
        </div>
    `).join('') || '<p class="text-gray-500 text-sm text-center py-4">Project байхгүй байна</p>';
}

let _tempProjects = null;
function getTempProjects() {
    if (!_tempProjects) _tempProjects = JSON.parse(JSON.stringify(loadProjects()));
    return _tempProjects;
}
function updateProject(i, field, val) {
    getTempProjects()[i][field] = val;
}
function removeProject(i) {
    getTempProjects().splice(i, 1);
    renderProjectsModalFromTemp();
}
function renderProjectsModalFromTemp() {
    const backup = localStorage.getItem(STORAGE_PROJECTS);
    localStorage.setItem(STORAGE_PROJECTS, JSON.stringify(getTempProjects()));
    renderProjectsModal();
    localStorage.setItem(STORAGE_PROJECTS, backup);
}
function addProject() {
    const title = document.getElementById('newProjTitle').value.trim();
    const desc  = document.getElementById('newProjDesc').value.trim();
    const link  = document.getElementById('newProjLink').value.trim() || '#';
    const tags  = document.getElementById('newProjTags').value.split(',').map(t=>t.trim()).filter(Boolean);
    const color = document.getElementById('newProjColor').value;
    const icon  = document.getElementById('newProjIcon').value;

    if (!title) { toast('Project нэр оруулна уу', 'error'); return; }
    getTempProjects().push({ title, desc, link, tags, color, icon });
    document.getElementById('newProjTitle').value = '';
    document.getElementById('newProjDesc').value  = '';
    document.getElementById('newProjLink').value  = '';
    document.getElementById('newProjTags').value  = '';
    renderProjectsModalFromTemp();
}
function saveProjects() {
    // Read from DOM
    const rows = document.querySelectorAll('#projectsList > div[id^="proj_"]');
    const projects = Array.from(rows).map(row => {
        const inputs   = row.querySelectorAll('input');
        const textareas = row.querySelectorAll('textarea');
        const selects  = row.querySelectorAll('select');
        return {
            title: inputs[0]   ? inputs[0].value.trim()   : '',
            link:  inputs[1]   ? inputs[1].value.trim()   : '#',
            desc:  textareas[0]? textareas[0].value.trim(): '',
            tags:  inputs[2]   ? inputs[2].value.split(',').map(t=>t.trim()).filter(Boolean) : [],
            color: selects[0]  ? selects[0].value : 'from-cyber-blue to-cyber-purple',
            icon:  selects[1]  ? selects[1].value : 'fas fa-code',
        };
    });

    // Merge with temp (for newly added but not yet in DOM)
    const temp = getTempProjects();
    const finalProjects = temp.map((tp, i) => projects[i] || tp);
    // append any extra from temp not in DOM
    if (temp.length > rows.length) {
        for (let i = rows.length; i < temp.length; i++) finalProjects.push(temp[i]);
    }

    localStorage.setItem(STORAGE_PROJECTS, JSON.stringify(finalProjects));
    _tempProjects = null;
    renderProjects();
    closeProjectsModal();
    toast('Projects амжилттай хадгаллаа ✅', 'success');
}

// ============================================================
//  CONTACT MODAL
// ============================================================
function openContactModal() {
    const c = loadContact();
    document.getElementById('cEmail').value        = c.email        || '';
    document.getElementById('cGithub').value       = c.github       || '';
    document.getElementById('cGithubText').value   = c.githubText   || '';
    document.getElementById('cFacebook').value     = c.facebook     || '';
    document.getElementById('cFacebookText').value = c.facebookText || '';

    document.getElementById('contactModal').classList.remove('hidden');
    document.getElementById('contactModal').classList.add('flex');
}
function closeContactModal() {
    document.getElementById('contactModal').classList.add('hidden');
    document.getElementById('contactModal').classList.remove('flex');
}
function saveContact() {
    const c = {
        email:        document.getElementById('cEmail').value.trim(),
        github:       document.getElementById('cGithub').value.trim(),
        githubText:   document.getElementById('cGithubText').value.trim(),
        facebook:     document.getElementById('cFacebook').value.trim(),
        facebookText: document.getElementById('cFacebookText').value.trim(),
    };
    localStorage.setItem(STORAGE_CONTACT, JSON.stringify(c));
    renderContact();
    closeContactModal();
    toast('Contact мэдээлэл хадгаллаа ✅', 'success');
}

// ============================================================
//  ADMIN MANAGE MODAL
// ============================================================
function openAdminManage() {
    renderAdminTable();
    document.getElementById('adminManageModal').classList.remove('hidden');
    document.getElementById('adminManageModal').classList.add('flex');
}
function closeAdminManage() {
    document.getElementById('adminManageModal').classList.add('hidden');
    document.getElementById('adminManageModal').classList.remove('flex');
}
function renderAdminTable() {
    const admins = loadAdmins();
    const tbody  = document.getElementById('adminTableBody');
    tbody.innerHTML = admins.map((a, i) => `
        <tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
            <td class="py-2 text-gray-400">${String(i+1).padStart(2,'0')}</td>
            <td class="py-2 text-white font-rajdhani">
                <i class="fas fa-user-shield text-cyber-purple mr-2 text-xs"></i>${escapeHtml(a.username)}
            </td>
            <td class="py-2 text-gray-400 text-xs">${a.created ? new Date(a.created).toLocaleDateString() : '-'}</td>
            <td class="py-2 text-right">
                ${admins.length > 1 ? `<button onclick="delAdmin(${i})" class="px-2 py-1 bg-red-600/80 hover:bg-red-500 rounded text-xs transition-colors">
                    <i class="fas fa-trash mr-1"></i>Delete
                </button>` : '<span class="text-xs text-gray-600">Last admin</span>'}
            </td>
        </tr>
    `).join('');
}
function addAdminFromModal() {
    const u = document.getElementById('newAdminUser').value.trim();
    const p = document.getElementById('newAdminPass').value;
    if (!u || !p) { toast('Username болон password оруулна уу', 'error'); return; }
    const admins = loadAdmins();
    if (admins.some(a => a.username === u)) { toast('Username аль хэдийн байна', 'error'); return; }
    admins.push({ username: u, password: p, created: new Date().toISOString() });
    localStorage.setItem(STORAGE_ADMINS, JSON.stringify(admins));
    document.getElementById('newAdminUser').value = '';
    document.getElementById('newAdminPass').value = '';
    renderAdminTable();
    toast('Admin нэмэгдлээ ✅', 'success');
}
function delAdmin(index) {
    const admins = loadAdmins();
    if (admins.length <= 1) { toast('Сүүлчийн admin-г устгах боломжгүй', 'error'); return; }
    if (currentAdmin() && admins[index].username === currentAdmin()) { toast('Өөрийгөө устгах боломжгүй', 'error'); return; }
    if (!confirm('Admin "' + admins[index].username + '"-г устгах уу?')) return;
    admins.splice(index, 1);
    localStorage.setItem(STORAGE_ADMINS, JSON.stringify(admins));
    renderAdminTable();
    toast('Admin устгагдлаа', 'info');
}

// ============================================================
//  TOAST NOTIFICATION
// ============================================================
function toast(msg, type = 'success') {
    const existing = document.getElementById('__toast__');
    if (existing) existing.remove();

    const colors = {
        success: 'border-cyber-green/50 text-cyber-green',
        error:   'border-red-500/50 text-red-400',
        info:    'border-cyber-blue/50 text-cyber-blue',
    };
    const icons = { success:'✅', error:'❌', info:'ℹ️' };

    const t = document.createElement('div');
    t.id = '__toast__';
    t.className = `fixed right-5 bottom-5 bg-[#071022] border ${colors[type]||colors.info} px-5 py-3 rounded-lg shadow-lg font-rajdhani text-sm z-[9999] flex items-center gap-2 animate-slide-in`;
    t.innerHTML = `<span>${icons[type]||'ℹ️'}</span><span>${escapeHtml(msg)}</span>`;
    document.body.appendChild(t);
    setTimeout(() => { t.style.opacity='0'; t.style.transform='translateY(10px)'; t.style.transition='all 0.3s'; setTimeout(()=>t.remove(),300); }, 3000);
}

// ============================================================
//  ESCAPE HTML
// ============================================================
function escapeHtml(s) {
    return String(s||'').replace(/[&<>"']/g, c => ({'&':'&','<':'<','>':'>','"':'"',"'":'&#39;'}[c]));
}

// ============================================================
//  CLOSE MODAL ON OVERLAY CLICK
// ============================================================
['adminLoginOverlay','profileModal','skillsModal','projectsModal','contactModal','adminManageModal'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.add('hidden');
            this.classList.remove('flex');
        }
    });
});

// ============================================================
//  INIT
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    seedDefaults();
    renderProfile();
    renderSkills();
    renderProjects();
    renderContact();
    updateAdminUI();
});
