/* ============================================================
   BOT & BOLT — SCRIPT.JS
   - Navbar scroll effect
   - Mobile menu toggle
   - Scroll-triggered animations (AOS-lite)
   - Counter animations
   - Particle canvas
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ---- Navbar scroll ---- */
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            navbar.classList.toggle('scrolled', window.scrollY > 40);
        }, { passive: true });
    }

    /* ---- Mobile menu ---- */
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            const isOpen = hamburger.classList.toggle('open');
            mobileMenu.classList.toggle('open', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close mobile menu when a link is clicked
        mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                mobileMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
                hamburger.classList.remove('open');
                mobileMenu.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    }

    /* ---- AOS-lite Intersection Observer ---- */
    const aosElements = document.querySelectorAll('[data-aos]');

    if (aosElements.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.getAttribute('data-aos-delay') || 0;
                    setTimeout(() => {
                        entry.target.classList.add('aos-animate');
                    }, parseInt(delay));
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -60px 0px'
        });

        aosElements.forEach(el => observer.observe(el));
    }

    /* ---- Counter animations ---- */
    const animateCounter = (el, target, duration = 2000, suffix = '') => {
        const start = performance.now();
        const startVal = 0;
        const isDecimal = target % 1 !== 0;

        const update = (timestamp) => {
            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = startVal + (target - startVal) * eased;
            el.textContent = isDecimal ? current.toFixed(1) : Math.round(current).toLocaleString();
            if (progress < 1) requestAnimationFrame(update);
        };

        requestAnimationFrame(update);
    };

    // Hero stats
    const heroStats = document.querySelectorAll('.stat-number');
    if (heroStats.length) {
        const heroObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const count = parseFloat(el.getAttribute('data-count'));
                    animateCounter(el, count, 2200);
                    heroObs.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        heroStats.forEach(el => heroObs.observe(el));
    }

    // Impact section counters
    const impactCounters = document.querySelectorAll('.counter-num');
    if (impactCounters.length) {
        const impactObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const count = parseFloat(el.getAttribute('data-count'));
                    animateCounter(el, count, 2500);
                    impactObs.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        impactCounters.forEach(el => impactObs.observe(el));
    }

    /* ---- Canvas particle background ---- */
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    pointer-events: none; z-index: 0; opacity: 0.4;
  `;
    document.getElementById('bgParticles')?.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    const colors = ['rgba(62,109,180,', 'rgba(147,125,186,', 'rgba(196,181,232,'];

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.alpha = Math.random() * 0.4 + 0.05;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < -10 || this.x > canvas.width + 10 ||
                this.y < -10 || this.y > canvas.height + 10) this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color + this.alpha + ')';
            ctx.fill();
        }
    }

    const initParticles = () => {
        particles = [];
        const count = Math.min(Math.floor((canvas.width * canvas.height) / 18000), 80);
        for (let i = 0; i < count; i++) particles.push(new Particle());
    };

    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        animId = requestAnimationFrame(animate);
    };

    resize();
    initParticles();
    animate();

    window.addEventListener('resize', () => {
        resize();
        initParticles();
    }, { passive: true });

    /* ---- Smooth scroll for anchor links ---- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    /* ---- Upload card drag interaction ---- */
    const uploadArea = document.getElementById('heroUpload');
    if (uploadArea) {
        ['dragenter', 'dragover'].forEach(evt => {
            uploadArea.addEventListener(evt, (e) => {
                e.preventDefault();
                uploadArea.style.background = 'rgba(147,125,186,0.06)';
                uploadArea.style.borderColor = 'rgba(147,125,186,0.4)';
            });
        });

        ['dragleave', 'drop'].forEach(evt => {
            uploadArea.addEventListener(evt, (e) => {
                e.preventDefault();
                uploadArea.style.background = '';
                uploadArea.style.borderColor = '';
                if (evt === 'drop') {
                    const files = e.dataTransfer?.files;
                    if (files && files.length) {
                        // Feed dropped file into the same processing flow as click-upload
                        const fakeInput = { files };
                        if (typeof handleHeroUpload === 'function') handleHeroUpload(fakeInput);
                    }
                }
            });
        });
        // NOTE: click is handled by onclick="document.getElementById('heroFileInput').click()" in HTML
    }


    /* ---- Active nav link highlighting ---- */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    if (sections.length && navLinks.length) {
        const sectionObs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => {
                        link.classList.toggle(
                            'nav-link-active',
                            link.getAttribute('href') === '#' + entry.target.id
                        );
                    });
                }
            });
        }, { threshold: 0.4 });
        sections.forEach(s => sectionObs.observe(s));
    }

    /* ---- Auth nav state ---- */
    function initAuthNav() {
        const user = JSON.parse(localStorage.getItem('bnb_user') || 'null');
        if (!user) return; // not logged in — keep "Sign In" button as-is

        // Desktop: replace <a class="nav-btn-outline"> with user avatar+dropdown
        const signInBtn = document.querySelector('a.nav-btn-outline[href="login.html"]');
        if (signInBtn) {
            const initials = user.name ? user.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase() : '?';
            const dropdown = document.createElement('div');
            dropdown.className = 'nav-user-wrap';
            dropdown.innerHTML = `
                <button class="nav-user-avatar" aria-label="Account menu" onclick="toggleUserMenu(event)">
                    <span class="nav-user-initials">${initials}</span>
                </button>
                <div class="nav-user-dropdown" id="navUserMenu">
                    <div class="nav-user-info">
                        <div class="nav-user-name">${user.name}</div>
                        <div class="nav-user-email">${user.email}</div>
                    </div>
                    <hr class="nav-user-sep"/>
                    <a href="profile.html?tab=details" class="nav-user-item">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        Account Details
                    </a>
                    <a href="profile.html?tab=orders" class="nav-user-item">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                        My Orders
                    </a>
                    <button class="nav-user-item nav-user-signout" onclick="signOut()">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        Sign Out
                    </button>
                </div>`;

            signInBtn.replaceWith(dropdown);
        }

        // Mobile menu: replace "Sign In" link
        const mobileSignIn = document.querySelector('.mobile-menu a[href="login.html"]');
        if (mobileSignIn) {
            const mobileUser = document.createElement('div');
            mobileUser.innerHTML = `
                <div style="padding:10px 20px;font-size:0.88rem;font-weight:600;color:var(--text-secondary);border-bottom:1px solid rgba(147,125,186,0.1)">${user.name}</div>
                <a href="profile.html?tab=details" class="mobile-link">Account Details</a>
                <a href="profile.html?tab=orders" class="mobile-link">My Orders</a>
                <button class="mobile-link" onclick="signOut()" style="width:100%;text-align:left;border:none;background:none;cursor:pointer;color:#ef4444;font-family:'Outfit',sans-serif">Sign Out</button>`;
            mobileSignIn.replaceWith(...mobileUser.childNodes);
        }
    }

    window.toggleUserMenu = function (e) {
        e.stopPropagation();
        const menu = document.getElementById('navUserMenu');
        if (menu) menu.classList.toggle('open');
    };

    window.signOut = function () {
        localStorage.removeItem('bnb_user');
        window.location.href = 'login.html';
    };

    // Close dropdown on outside click
    document.addEventListener('click', () => {
        document.getElementById('navUserMenu')?.classList.remove('open');
    });

    initAuthNav();

});
