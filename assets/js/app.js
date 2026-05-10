// ──────────────────────────────────────────────
// CYBERFORGE — COMPLETE FRONTEND APPLICATION
// ──────────────────────────────────────────────

// ─── STATE ──────────────────────────────
let currentPage = 'home';
let currentToolId = null;
let activeCategory = 'all';
let searchQuery = '';
let learnedTools = JSON.parse(localStorage.getItem('cyberforge_learned') || '{}');
let favorites = JSON.parse(localStorage.getItem('cyberforge_favorites') || '[]');
let darkMode = localStorage.getItem('cyberforge_theme') !== 'light';

// ─── INIT ──────────────────────────────
function init() {
    applyTheme();
    setupThemeToggle();
    setupHamburger();
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
}

function applyTheme() {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    const icon = document.querySelector('#themeToggle i');
    if (icon) {
        icon.className = darkMode ? 'fas fa-sun' : 'fas fa-moon';
    }
}

function setupThemeToggle() {
    const btn = document.getElementById('themeToggle');
    if (btn) {
        btn.addEventListener('click', () => {
            darkMode = !darkMode;
            localStorage.setItem('cyberforge_theme', darkMode ? 'dark' : 'light');
            applyTheme();
        });
    }
}

function setupHamburger() {
    const btn = document.getElementById('hamburgerBtn');
    const links = document.getElementById('navLinks');
    if (btn && links) {
        btn.addEventListener('click', () => {
            links.classList.toggle('open');
        });
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav') && links.classList.contains('open')) {
                links.classList.remove('open');
            }
        });
    }
}

function toggleMenu() {
    document.getElementById('navLinks')?.classList.toggle('open');
}

function handleHashChange() {
    const hash = window.location.hash.replace('#', '') || 'home';
    if (hash.startsWith('tool/')) {
        currentToolId = hash.replace('tool/', '');
        currentPage = 'tool-detail';
    } else if (['home', 'tools', 'blog', 'shortcuts', 'resources', 'about'].includes(hash)) {
        currentPage = hash;
        currentToolId = null;
    } else {
        currentPage = 'home';
        currentToolId = null;
    }
    renderPage();
    updateNavActive();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function navigateTo(page, toolId = null) {
    if (toolId) {
        window.location.hash = `tool/${toolId}`;
    } else {
        window.location.hash = page;
    }
    document.getElementById('navLinks')?.classList.remove('open');
}

function updateNavActive() {
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
    });
    const activeLink = document.querySelector(`.nav-links a[data-page="${currentPage === 'tool-detail' ? 'tools' : currentPage}"]`);
    if (activeLink) activeLink.classList.add('active');
}

// ─── RENDER ENGINE ──────────────────────────
function renderPage() {
    const main = document.getElementById('mainContent');
    if (!main) return;
    switch (currentPage) {
        case 'home':
            renderHome(main);
            break;
        case 'tools':
            renderTools(main);
            break;
        case 'tool-detail':
            renderToolDetail(main);
            break;
        case 'blog':
            renderBlog(main);
            break;
        case 'shortcuts':
            renderShortcuts(main);
            break;
        case 'resources':
            renderResources(main);
            break;
        case 'about':
            renderAbout(main);
            break;
        default:
            renderHome(main);
    }
    // Re-bind event listeners after render
    setTimeout(bindDynamicEvents, 50);
}

function bindDynamicEvents() {
    // Copy buttons
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const code = this.getAttribute('data-code');
            copyToClipboard(code);
        });
    });
    // Category pills
    document.querySelectorAll('.cat-pill').forEach(pill => {
        pill.addEventListener('click', function() {
            activeCategory = this.getAttribute('data-cat');
            document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
            this.classList.add('active');
            filterTools();
        });
    });
    // Search inputs
    const searchInput = document.getElementById('toolSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchQuery = this.value.toLowerCase();
            filterTools();
        });
    }
    // Hero search
    const heroSearch = document.getElementById('heroSearchInput');
    if (heroSearch) {
        heroSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchQuery = this.value.toLowerCase();
                navigateTo('tools');
            }
        });
    }
    // Mark learned buttons
    document.querySelectorAll('.mark-learned-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const toolId = this.getAttribute('data-tool');
            toggleLearned(toolId);
            renderPage();
        });
    });
    // Shortcut search
    const shortcutSearch = document.getElementById('shortcutSearch');
    if (shortcutSearch) {
        shortcutSearch.addEventListener('input', function() {
            filterShortcuts(this.value.toLowerCase());
        });
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('✓ Command copied!');
    }).catch(() => {
        showToast('⚠ Failed to copy');
    });
}

function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => toast.classList.remove('show'), 2000);
}

function toggleLearned(toolId) {
    if (learnedTools[toolId]) {
        delete learnedTools[toolId];
    } else {
        learnedTools[toolId] = true;
    }
    localStorage.setItem('cyberforge_learned', JSON.stringify(learnedTools));
}

function isLearned(toolId) {
    return !!learnedTools[toolId];
}

// ─── FILTER TOOLS ──────────────────────────
function filterTools() {
    const grid = document.getElementById('toolsGrid');
    if (!grid) return;
    const cards = grid.querySelectorAll('.tool-card');
    let visibleCount = 0;
    cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        const searchText = card.getAttribute('data-search');
        const catMatch = activeCategory === 'all' || cat === activeCategory;
        const searchMatch = !searchQuery || searchText.includes(searchQuery);
        if (catMatch && searchMatch) {
            card.classList.remove('hidden');
            visibleCount++;
        } else {
            card.classList.add('hidden');
        }
    });
    const noResults = document.getElementById('noResults');
    if (noResults) {
        noResults.classList.toggle('hidden', visibleCount > 0);
    }
    const resultCount = document.getElementById('resultCount');
    if (resultCount) {
        resultCount.textContent = visibleCount;
    }
}

function filterShortcuts(query) {
    const rows = document.querySelectorAll('.shortcut-table tbody tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.classList.toggle('hidden', query && !text.includes(query));
    });
}

// ─── RENDER HOME ──────────────────────────
function renderHome(main) {
    const featuredIds = ['nmap', 'burp-suite', 'metasploit', 'hashcat', 'wireshark', 'sqlmap', 'aircrack-ng',
        'bloodhound'
    ];
    const featuredTools = featuredIds.map(id => toolsData.find(t => t.id === id)).filter(Boolean);
    const latestBlogPosts = [
        { title: 'Getting Started with Ethical Hacking: A Complete Roadmap', date: '2026-05-01', readTime: '8 min',
            excerpt: 'New to cybersecurity? This roadmap covers everything from networking basics to your first bug bounty.' },
        { title: 'Nmap vs Masscan vs RustScan: Which Port Scanner Should You Use?', date: '2026-04-28',
            readTime: '6 min', excerpt: 'A detailed comparison of the three most popular port scanners with benchmarks.' },
        { title: 'Understanding OWASP Top 10 Vulnerabilities in 2026', date: '2026-04-20', readTime: '10 min',
            excerpt: 'Stay current with the most critical web application security risks and how to test for them.' },
    ];

    main.innerHTML = `
    <section class="hero">
      <div class="hero-inner">
        <h1>Master <span>Ethical Hacking</span> Tools</h1>
        <p>Your go-to resource for learning the top 50 penetration testing and cybersecurity tools — safely, practically, and professionally.</p>
        <div class="hero-search">
          <input type="text" id="heroSearchInput" placeholder="Search for a tool... (e.g., nmap, sqlmap, metasploit)" aria-label="Search tools">
          <button onclick="document.getElementById('heroSearchInput').dispatchEvent(new KeyboardEvent('keypress',{key:'Enter'}))"><i class="fas fa-magnifying-glass"></i> Search</button>
        </div>
        <div class="hero-stats">
          <div class="hero-stat"><span class="num">50</span><span class="lbl">Tools Covered</span></div>
          <div class="hero-stat"><span class="num">8</span><span class="lbl">Categories</span></div>
          <div class="hero-stat"><span class="num">100+</span><span class="lbl">Commands</span></div>
          <div class="hero-stat"><span class="num">Free</span><span class="lbl">Forever</span></div>
        </div>
      </div>
    </section>

    <div class="section">
      <div class="section-header">
        <h2><i class="fas fa-star"></i> Featured Tools</h2>
        <a href="#" class="btn btn-outline" onclick="navigateTo('tools')">View All 50 Tools <i class="fas fa-arrow-right"></i></a>
      </div>
      <div class="tools-grid">
        ${featuredTools.map(t => renderToolCard(t)).join('')}
      </div>
    </div>

    <div class="section">
      <div class="section-header">
        <h2><i class="fas fa-newspaper"></i> Latest Blog Posts</h2>
        <a href="#" class="btn btn-outline" onclick="navigateTo('blog')">All Posts <i class="fas fa-arrow-right"></i></a>
      </div>
      ${latestBlogPosts.map(post => `
        <div class="blog-card" onclick="navigateTo('blog')">
          <h3>${post.title}</h3>
          <div class="blog-meta"><span><i class="fas fa-calendar"></i> ${post.date}</span><span><i class="fas fa-clock"></i> ${post.readTime} read</span></div>
          <p class="blog-excerpt">${post.excerpt}</p>
        </div>
      `).join('')}
    </div>`;
}

function renderToolCard(t) {
    const catClass = `cat-${t.category}`;
    return `
    <div class="tool-card ${isLearned(t.id) ? 'learned' : ''}" data-category="${t.category}" data-search="${t.name.toLowerCase()} ${t.tags.join(' ')} ${t.category}" onclick="navigateTo('tools','${t.id}')">
      <span class="learned-badge"><i class="fas fa-check-circle"></i> Learned</span>
      <div class="tool-card-header">
        <div class="tool-card-icon ${catClass}">${t.icon}</div>
        <div>
          <h3>${t.name}</h3>
          <span style="font-size:0.75rem;color:var(--text-muted)">${t.catLabel}</span>
        </div>
      </div>
      <p class="tool-excerpt">${t.excerpt}</p>
      <div class="tool-tags">${t.tags.slice(0,3).map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
    </div>`;
}

// ─── RENDER TOOLS PAGE ──────────────────────────
function renderTools(main) {
    const allTools = toolsData;
    main.innerHTML = `
    <div class="section">
      <div class="section-header">
        <h2><i class="fas fa-wrench"></i> All Tools <span style="font-weight:400;font-size:1rem;color:var(--text-muted)" id="resultCount">${allTools.length}</span></h2>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
          <input type="text" id="toolSearch" placeholder="Search tools..." style="padding:0.5rem 1rem;border-radius:var(--radius-sm);border:1.5px solid var(--border);background:var(--bg-card);color:var(--text-primary);font-family:var(--font-sans);min-width:200px" value="${searchQuery}">
        </div>
      </div>
      <div class="category-pills">
        ${categories.map(c => `<span class="cat-pill ${activeCategory===c.id?'active':''}" data-cat="${c.id}"><i class="fas ${c.icon}"></i> ${c.label}</span>`).join('')}
      </div>
      <div class="tools-grid" id="toolsGrid">
        ${allTools.map(t => renderToolCard(t)).join('')}
      </div>
      <div id="noResults" class="no-results hidden">
        <i class="fas fa-search" style="font-size:2rem;display:block;margin-bottom:0.5rem"></i>
        No tools match your search. Try different keywords or clear filters.
      </div>
    </div>`;
}

// ─── RENDER TOOL DETAIL ──────────────────────────
function renderToolDetail(main) {
    const t = toolsData.find(tool => tool.id === currentToolId);
    if (!t) {
        main.innerHTML =
            '<div class="detail-container text-center"><h2>Tool not found</h2><p><a href="#" onclick="navigateTo(\'tools\')">Back to Tools</a></p></div>';
        return;
    }
    const catClass = `cat-${t.category}`;
    main.innerHTML = `
    <div class="detail-container fade-in">
      <a href="#" class="detail-back" onclick="navigateTo('tools')"><i class="fas fa-arrow-left"></i> Back to All Tools</a>
      <div class="detail-header">
        <div class="detail-icon tool-card-icon ${catClass}" style="width:64px;height:64px;font-size:1.8rem">${t.icon}</div>
        <div>
          <h1>${t.name}</h1>
          <span class="detail-cat" style="background:var(--accent-bg);color:var(--accent)">${t.catLabel}</span>
          <span style="margin-left:0.5rem">${t.tags.map(tag => `<span class="tag">${tag}</span>`).join(' ')}</span>
        </div>
        <button class="btn btn-outline btn-sm mark-learned-btn" data-tool="${t.id}" style="margin-left:auto">
          <i class="fas ${isLearned(t.id) ? 'fa-check-circle' : 'fa-graduation-cap'}"></i>
          ${isLearned(t.id) ? 'Marked Learned' : 'Mark as Learned'}
        </button>
      </div>

      <div class="wh-block">
        <h3><i class="fas fa-question-circle"></i> What is ${t.name}?</h3>
        <p>${t.what}</p>
      </div>

      <div class="wh-block">
        <h3><i class="fas fa-lightbulb"></i> Why Use It?</h3>
        <p>${t.why}</p>
      </div>

      <div class="wh-block">
        <h3><i class="fas fa-clock"></i> When to Use?</h3>
        <p>${t.when}</p>
      </div>

      <div class="wh-block">
        <h3><i class="fas fa-terminal"></i> How to Use? (Installation & Commands)</h3>
        <p>${t.how}</p>
        <pre>${t.commands.map(c => `<span>${c}</span>`).join('\n')}<button class="copy-btn" data-code="${t.commands.join('\n')}"><i class="fas fa-copy"></i> Copy All</button></pre>
      </div>

      <div class="pros-cons">
        <div class="pros">
          <h4><i class="fas fa-check-circle"></i> Pros</h4>
          <ul>${t.pros.map(p => `<li>${p}</li>`).join('')}</ul>
        </div>
        <div class="cons">
          <h4><i class="fas fa-times-circle"></i> Cons</h4>
          <ul>${t.cons.map(c => `<li>${c}</li>`).join('')}</ul>
        </div>
      </div>

      <div class="wh-block">
        <h3><i class="fas fa-shield-halved"></i> Safety & Legal Notes</h3>
        <p style="color:var(--red);font-weight:500">${t.safety}</p>
      </div>

      <div class="wh-block">
        <h3><i class="fas fa-code-branch"></i> Alternatives</h3>
        <p>${t.alternatives.join(', ')}</p>
      </div>

      <div class="wh-block">
        <h3><i class="fas fa-flask"></i> Practice Lab Suggestion</h3>
        <p>${t.lab}</p>
      </div>

      <div class="wh-block">
        <h3><i class="fas fa-link"></i> Related Tools</h3>
        <div class="tools-grid" style="margin-top:0.5rem">
          ${toolsData.filter(rt => rt.category === t.category && rt.id !== t.id).slice(0,3).map(rt => renderToolCard(rt)).join('')}
        </div>
      </div>
    </div>`;
}

// ─── RENDER BLOG ──────────────────────────
function renderBlog(main) {
    const posts = [
        { title: 'Getting Started with Ethical Hacking: A Complete Roadmap', date: '2026-05-01',
            readTime: '8 min', category: 'Beginner',
            excerpt: 'New to cybersecurity? This roadmap covers networking fundamentals, Linux basics, reconnaissance techniques, and your first steps into bug bounty hunting.' },
        { title: 'Nmap vs Masscan vs RustScan: Which Port Scanner Should You Use?', date: '2026-04-28',
            readTime: '6 min', category: 'Tools',
            excerpt: 'We benchmark the three most popular port scanners across different scenarios to help you choose the right tool for your engagement.' },
        { title: 'Understanding OWASP Top 10 Vulnerabilities in 2026', date: '2026-04-20',
            readTime: '10 min', category: 'Web Security',
            excerpt: 'The OWASP Top 10 remains the essential guide to web application risks. Learn what changed and how to test for each vulnerability.' },
        { title: 'Building a Home Cybersecurity Lab on a Budget', date: '2026-04-15', readTime: '12 min',
            category: 'Lab Setup',
            excerpt: 'Create a fully functional penetration testing lab using VirtualBox, Metasploitable, and Docker — all for free.' },
        { title: 'Password Cracking Essentials: Hashcat vs John the Ripper', date: '2026-04-10',
            readTime: '7 min', category: 'Password Security',
            excerpt: 'A detailed comparison of the two most popular password cracking tools with practical examples and benchmark results.' },
        { title: 'Active Directory Attack Paths: BloodHound for Beginners', date: '2026-04-02',
            readTime: '9 min', category: 'Active Directory',
            excerpt: 'Learn how to use BloodHound to visualize and exploit AD attack paths. Essential for modern penetration testers.' },
    ];
    main.innerHTML = `
    <div class="page-container">
      <h1><i class="fas fa-blog"></i> CyberForge Blog</h1>
      <p>Educational articles on ethical hacking, penetration testing, and cybersecurity tools. Always for educational purposes only.</p>
      ${posts.map(post => `
        <div class="blog-card">
          <span class="tag" style="margin-bottom:0.5rem;display:inline-block">${post.category}</span>
          <h3>${post.title}</h3>
          <div class="blog-meta"><span><i class="fas fa-calendar"></i> ${post.date}</span><span><i class="fas fa-clock"></i> ${post.readTime} read</span></div>
          <p class="blog-excerpt">${post.excerpt}</p>
          <button class="btn btn-outline btn-sm" style="margin-top:0.8rem"><i class="fas fa-book-open"></i> Read Article (Coming Soon)</button>
        </div>
      `).join('')}
    </div>`;
}

// ─── RENDER SHORTCUTS ──────────────────────────
function renderShortcuts(main) {
    const shortcuts = [
        { tool: 'Nmap', command: 'nmap -sS -sV -A target.com', description: 'Aggressive scan with service detection' },
        { tool: 'Nmap', command: 'nmap --script vuln target.com', description: 'Run vulnerability scripts' },
        { tool: 'Nmap', command: 'nmap -p 1-65535 target.com', description: 'Scan all ports' },
        { tool: 'SQLMap', command: 'sqlmap -u "URL?id=1" --dbs', description: 'Enumerate databases' },
        { tool: 'SQLMap', command: 'sqlmap -u "URL" -D db -T table --dump', description: 'Dump table contents' },
        { tool: 'Hydra', command: 'hydra -l admin -P wordlist.txt ssh://target', description: 'SSH brute force' },
        { tool: 'Hashcat',
            command: 'hashcat -m 0 -a 0 hashes.txt wordlist.txt',
            description: 'Crack MD5 hashes with dictionary' },
        { tool: 'Gobuster', command: 'gobuster dir -u URL -w wordlist.txt',
            description: 'Directory enumeration' },
        { tool: 'FFuF', command: 'ffuf -u URL/FUZZ -w wordlist.txt -fc 404',
            description: 'Fuzz with status filtering' },
        { tool: 'Netcat', command: 'nc -lvp 4444', description: 'Start listener on port 4444' },
        { tool: 'Netcat', command: 'nc target.com 80', description: 'Connect to port 80' },
        { tool: 'tcpdump', command: 'sudo tcpdump -i eth0 port 443', description: 'Capture HTTPS traffic' },
        { tool: 'Metasploit', command: 'msfconsole -q', description: 'Launch Metasploit quietly' },
        { tool: 'John', command: 'john --wordlist=rockyou.txt hashes.txt',
        description: 'Dictionary attack with John' },
        { tool: 'Aircrack-ng', command: 'aircrack-ng -w wordlist.txt capture.cap',
            description: 'Crack WPA handshake' },
        { tool: 'Burp Suite', command: 'Proxy listener: 127.0.0.1:8080', description: 'Default Burp proxy settings' },
        { tool: 'ExifTool', command: 'exiftool -all= document.pdf', description: 'Remove all metadata' },
        { tool: 'Amass', command: 'amass enum -passive -d target.com', description: 'Passive subdomain enum' },
        { tool: 'BloodHound', command: 'SharpHound.exe -c All', description: 'Collect AD data' },
        { tool: 'Chisel', command: './chisel server -p 8080 --reverse', description: 'Start reverse tunnel server' },
    ];
    main.innerHTML = `
    <div class="page-container">
      <h1><i class="fas fa-keyboard"></i> Quick Command Reference</h1>
      <p>Searchable cheat sheet of essential commands. Click the <i class="fas fa-copy"></i> icon to copy.</p>
      <input type="text" id="shortcutSearch" placeholder="Search commands..." style="width:100%;padding:0.7rem 1rem;border-radius:var(--radius-sm);border:1.5px solid var(--border);background:var(--bg-card);color:var(--text-primary);font-family:var(--font-sans);margin-bottom:1rem">
      <div style="overflow-x:auto">
        <table class="shortcut-table">
          <thead><tr><th>Tool</th><th>Command</th><th>Description</th><th></th></tr></thead>
          <tbody>
            ${shortcuts.map(s => `
              <tr>
                <td><strong>${s.tool}</strong></td>
                <td><code>${s.command}</code></td>
                <td>${s.description}</td>
                <td><button class="copy-btn" data-code="${s.command.replace(/"/g,'&quot;')}" style="position:static"><i class="fas fa-copy"></i></button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
}

// ─── RENDER RESOURCES ──────────────────────────
function renderResources(main) {
    const resources = [
        { icon: 'fa-laptop-code', title: 'TryHackMe',
            desc: 'Hands-on cybersecurity training with guided rooms and challenges.', url: 'https://tryhackme.com',
            badge: 'Highly Recommended' },
        { icon: 'fa-cube', title: 'HackTheBox', desc: 'Advanced penetration testing labs with real-world scenarios.',
            url: 'https://hackthebox.com', badge: 'Pro Level' },
        { icon: 'fa-shield', title: 'PortSwigger Web Security Academy',
            desc: 'Free, high-quality web security training from the makers of Burp Suite.',
            url: 'https://portswigger.net/web-security', badge: 'Free' },
        { icon: 'fa-book', title: 'The Web Application Hacker\'s Handbook',
            desc: 'The definitive book on web application security testing.', url: '#', badge: 'Book' },
        { icon: 'fa-terminal', title: 'OverTheWire',
            desc: 'Learn Linux and security concepts through war games and challenges.', url: 'https://overthewire.org',
            badge: 'Beginner+' },
        { icon: 'fa-flask', title: 'DVWA (Damn Vulnerable Web App)',
            desc: 'PHP/MySQL web application for practicing common vulnerabilities.', url: 'https://github.com/digininja/DVWA',
            badge: 'Lab' },
        { icon: 'fa-server', title: 'Metasploitable 2', desc: 'Intentionally vulnerable Linux VM for penetration testing practice.',
            url: 'https://sourceforge.net/projects/metasploitable/', badge: 'Lab' },
        { icon: 'fa-graduation-cap', title: 'SANS Cyber Aces',
            desc: 'Free online courses covering the fundamentals of cybersecurity.', url: 'https://www.sans.org/cyberaces',
            badge: 'Free Course' },
    ];
    main.innerHTML = `
    <div class="page-container">
      <h1><i class="fas fa-flask"></i> Learning Resources & Safe Labs</h1>
      <p>Curated list of safe, legal platforms and resources to practice your ethical hacking skills. <strong>Always read and follow each platform's terms of service.</strong></p>
      ${resources.map(r => `
        <a href="${r.url}" target="_blank" rel="noopener" class="resource-card">
          <div class="res-icon"><i class="fas ${r.icon}"></i></div>
          <div style="flex:1">
            <h3>${r.title} <span class="tag">${r.badge}</span></h3>
            <p>${r.desc}</p>
          </div>
          <i class="fas fa-external-link-alt" style="color:var(--text-muted)"></i>
        </a>
      `).join('')}
    </div>`;
}

// ─── RENDER ABOUT ──────────────────────────
function renderAbout(main) {
    main.innerHTML = `
    <div class="page-container">
      <h1><i class="fas fa-info-circle"></i> About CyberForge</h1>
      <div class="wh-block">
        <h3>Our Mission</h3>
        <p>CyberForge is a first-class educational platform dedicated to teaching the proper, legal, and ethical use of cybersecurity tools. We believe knowledge should be accessible, practical, and always framed within the context of responsible use.</p>
      </div>
      <div class="wh-block">
        <h3>⚠️ Legal Disclaimer</h3>
        <p style="color:var(--red);font-weight:500">All information on CyberForge is provided <u>for educational and defensive purposes only</u>. The tools and techniques discussed must only be used on systems you own or have explicit written authorization to test. Unauthorized penetration testing, hacking, or any form of cybercrime is illegal and punishable by law. CyberForge and its authors assume no liability for misuse of the information provided.</p>
      </div>
      <div class="wh-block">
        <h3>Who This Is For</h3>
        <p>Cybersecurity students, aspiring ethical hackers, bug bounty hunters, IT professionals, CTF players, and security researchers who want a structured, practical, and safe learning resource.</p>
      </div>
      <div class="wh-block">
        <h3>Contact</h3>
        <p>CyberForge is an independent educational project. For suggestions, corrections, or collaboration inquiries, reach out via the security community forums where this project is shared. We appreciate your feedback!</p>
      </div>
    </div>`;
}

// ─── BOOT ──────────────────────────────
document.addEventListener('DOMContentLoaded', init);
