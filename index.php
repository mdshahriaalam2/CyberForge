<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CyberForge — Master Ethical Hacking Tools</title>
    <meta name="description" content="Master the top 50 ethical hacking & penetration testing tools with rich, practical, and safe learning content. Learn like a professional.">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <!-- ─── NAVIGATION ─────────────────────────── -->
    <nav class="nav" id="mainNav">
        <div class="nav-inner">
            <a href="#" class="nav-logo" onclick="navigateTo('home')" title="CyberForge Home">
                <div class="logo-icon"><i class="fas fa-shield-halved"></i></div>
                CyberForge
            </a>
            <button class="hamburger" id="hamburgerBtn" aria-label="Toggle menu" onclick="toggleMenu()">
                <i class="fas fa-bars"></i>
            </button>
            <ul class="nav-links" id="navLinks">
                <li><a href="#" onclick="navigateTo('home')" class="active" data-page="home"><i class="fas fa-home"></i> Home</a></li>
                <li><a href="#" onclick="navigateTo('tools')" data-page="tools"><i class="fas fa-wrench"></i> Tools</a></li>
                <li><a href="#" onclick="navigateTo('blog')" data-page="blog"><i class="fas fa-blog"></i> Blog</a></li>
                <li><a href="#" onclick="navigateTo('shortcuts')" data-page="shortcuts"><i class="fas fa-keyboard"></i> Shortcuts</a></li>
                <li><a href="#" onclick="navigateTo('resources')" data-page="resources"><i class="fas fa-flask"></i> Resources</a></li>
                <li><a href="#" onclick="navigateTo('about')" data-page="about"><i class="fas fa-info-circle"></i> About</a></li>
            </ul>
            <div class="nav-actions">
                <button class="btn-icon" id="themeToggle" aria-label="Toggle dark/light mode" title="Toggle theme">
                    <i class="fas fa-moon"></i>
                </button>
            </div>
        </div>
    </nav>

    <!-- ─── MAIN CONTENT AREA ──────────────────── -->
    <main id="mainContent">
        <!-- Dynamically rendered by JS -->
    </main>

    <!-- ─── TOAST NOTIFICATION ──────────────────── -->
    <div class="toast" id="toast"></div>

    <!-- ─── FOOTER ─────────────────────────────── -->
    <footer class="footer" id="mainFooter">
        <div class="disclaimer">
            <i class="fas fa-exclamation-triangle"></i>
            <strong>⚠️ Educational Purpose Only:</strong> All information on CyberForge is for educational and defensive cybersecurity learning only.
            Unauthorized hacking, penetration testing without permission, or any malicious use of these tools is <u>illegal</u>.
            Always obtain written authorization before testing any system you do not own.
        </div>
        <p>© 2026 <strong>CyberForge</strong> — Master Ethical Hacking Tools. Built with ❤️ for the cybersecurity community.</p>
        <p style="margin-top:0.3rem;"><a href="#" onclick="navigateTo('about')">About & Contact</a> · <a href="#" onclick="navigateTo('resources')">Learning Resources</a></p>
    </footer>

    <!-- Assets -->
    <script src="assets/js/data.js"></script>
    <script src="assets/js/app.js"></script>
</body>
</html>