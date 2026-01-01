document.addEventListener('DOMContentLoaded', function() {
    const navContainer = document.querySelector('.nav-container');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const form = document.querySelector('.contact-form');
    const progressBar = document.querySelector('.scroll-progress');
    const isHomePage = window.location.pathname.endsWith('index.html') || 
                       window.location.pathname === '/' || 
                       window.location.pathname.endsWith('/');

    window.addEventListener('scroll', function() {
        // Navbar shadow/scale effect
        if (window.scrollY > 100) {
            navContainer.style.background = 'rgba(255, 255, 255, 0.98)';
            navContainer.style.padding = '0.3rem 1.2rem';
            navContainer.querySelector('.logo-img').style.height = '35px';
            navContainer.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
        } else {
            navContainer.style.background = 'rgba(255, 255, 255, 0.8)';
            navContainer.style.padding = '0.75rem 2rem';
            navContainer.querySelector('.logo-img').style.height = '60px';
            navContainer.style.boxShadow = '0 4px 20px rgba(37, 99, 235, 0.1)';
        }

        // Scroll Progress Bar
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (progressBar) {
            progressBar.style.width = scrolled + '%';
        }

        // Scroll Spy (Active Nav Link)
        if (isHomePage) {
            let current = '';
            const sections = document.querySelectorAll('section');
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollY >= (sectionTop - 300)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').includes(current)) {
                    link.classList.add('active');
                }
            });
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // 1. Internal link on current page (#section)
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            } 
            // 2. Link to home page section (index.html#section)
            else if (href.includes('index.html') && href.includes('#')) {
                // If we are ALREADY on the home page, treat it as an internal scroll
                if (isHomePage) {
                    e.preventDefault();
                    const targetId = '#' + href.split('#')[1];
                    const targetSection = document.querySelector(targetId);
                    if (targetSection) {
                        const offsetTop = targetSection.offsetTop - 80;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
                // If we are NOT on home page (e.g., on experience.html), 
                // DO NOT preventDefault. Let the browser navigate to index.html#section.
            }
        });
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.service-card, .highlight-card, .info-card, .timeline-item');
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            const name = form.querySelector('input[type="text"]').value;
            const email = form.querySelector('input[type="email"]').value;
            const phone = form.querySelector('input[type="tel"]').value;
            const message = form.querySelector('textarea').value;

            try {
                // Insert into Supabase
                const { data, error } = await supabase
                    .from('leads')
                    .insert([
                        { 
                            name: name, 
                            email: email, 
                            phone: phone, 
                            message: message,
                            status: 'new'
                        }
                    ]);

                if (error) throw error;

                // Success State
                submitBtn.textContent = 'Message Sent!';
                submitBtn.style.background = '#22c55e';
                form.reset();
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);

            } catch (error) {
                console.error('Error submitting form:', error);
                alert('There was a problem sending your message. Please try again or email contact@fcmd.com directly.');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(30px)';

        setTimeout(() => {
            heroTitle.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 200);
    }

    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        heroSubtitle.style.opacity = '0';
        heroSubtitle.style.transform = 'translateY(30px)';

        setTimeout(() => {
            heroSubtitle.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            heroSubtitle.style.opacity = '1';
            heroSubtitle.style.transform = 'translateY(0)';
        }, 400);
    }

    const heroButtons = document.querySelector('.hero-buttons');
    if (heroButtons) {
        heroButtons.style.opacity = '0';
        heroButtons.style.transform = 'translateY(30px)';

        setTimeout(() => {
            heroButtons.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            heroButtons.style.opacity = '1';
            heroButtons.style.transform = 'translateY(0)';
        }, 600);
    }

    // Typing Effect
    const typingText = document.querySelector('.typing-effect');
    if (typingText) {
        const text = typingText.textContent;
        typingText.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                typingText.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        
        // Start typing after initial animations
        setTimeout(typeWriter, 1000);
    }

    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = 100;
        
        let mouse = {
            x: null,
            y: null,
            radius: 150
        }

        window.addEventListener('mousemove', function(event) {
            mouse.x = event.x;
            mouse.y = event.y;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.baseX = this.x;
                this.baseY = this.y;
                this.density = (Math.random() * 30) + 1;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.opacity = Math.random() * 0.5 + 0.2;
            }

            update() {
                // Mouse interaction
                if (mouse.x != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < mouse.radius) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const maxDistance = mouse.radius;
                        const force = (maxDistance - distance) / maxDistance;
                        const directionX = forceDirectionX * force * this.density;
                        const directionY = forceDirectionY * force * this.density;
                        
                        this.x -= directionX;
                        this.y -= directionY;
                    } else {
                        if (this.x !== this.baseX) {
                            let dx = this.x - this.baseX;
                            this.x -= dx/10;
                        }
                        if (this.y !== this.baseY) {
                            let dy = this.y - this.baseY;
                            this.y -= dy/10;
                        }
                    }
                }

                // Normal movement
                this.x += this.speedX;
                this.y += this.speedY;
                
                // Keep base position moving too so they don't snap back to static points
                this.baseX += this.speedX;
                this.baseY += this.speedY;

                if (this.x > canvas.width) { this.x = 0; this.baseX = 0; }
                if (this.x < 0) { this.x = canvas.width; this.baseX = canvas.width; }
                if (this.y > canvas.height) { this.y = 0; this.baseY = 0; }
                if (this.y < 0) { this.y = canvas.height; this.baseY = canvas.height; }
            }

            draw() {
                ctx.fillStyle = `rgba(37, 99, 235, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function connectParticles() {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        const opacity = (1 - distance / 100) * 0.2;
                        ctx.strokeStyle = `rgba(37, 99, 235, ${opacity})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            connectParticles();
            requestAnimationFrame(animate);
        }

        animate();

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;

                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current) + (counter.textContent.includes('+') ? '+' : counter.textContent.includes('%') ? '%' : '');
                        requestAnimationFrame(updateCounter);
                    } else {
                        if (target === 10) {
                            counter.textContent = '10+';
                        } else if (target === 200) {
                            counter.textContent = '200+';
                        } else if (target === 98) {
                            counter.textContent = '98%';
                        }
                    }
                };

                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.feature-number').forEach(counter => {
        counterObserver.observe(counter);
    });

    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    const cursor = document.createElement('div');
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: rgba(99, 102, 241, 0.5);
        pointer-events: none;
        z-index: 10000;
        transition: transform 0.1s ease;
        mix-blend-mode: difference;
        display: none;
    `;
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
        cursor.style.display = 'block';
    });

    document.querySelectorAll('a, button, .service-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
        });
    });

    const sections = document.querySelectorAll('section');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'opacity 1s ease, transform 1s ease';
        sectionObserver.observe(section);
    });

    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousemove', function(e) {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Magnetic effect
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) / 8;
            const deltaY = (y - centerY) / 8;
            
            btn.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

            // Ripple effect
            if (!btn.querySelector('.ripple')) {
                // ... (existing ripple logic kept but cleaner if separate)
            }
        });
        
        btn.addEventListener('mouseleave', function() {
            btn.style.transform = 'translate(0, 0)';
        });

        btn.addEventListener('mouseenter', function(e) {
            // Ripple logic
            const x = e.pageX - this.offsetLeft;
            const y = e.pageY - this.offsetTop;

            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                width: 0;
                height: 0;
                left: ${x}px;
                top: ${y}px;
                transform: translate(-50%, -50%);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                width: 200px;
                height: 200px;
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Mobile Menu Logic
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const menuDrawer = document.querySelector('.mobile-menu-drawer');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    if (menuToggle && menuDrawer) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            menuDrawer.setAttribute('aria-hidden', isExpanded);
            
            menuToggle.classList.toggle('active');
            menuDrawer.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (menuDrawer.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.setAttribute('aria-expanded', 'false');
                menuDrawer.setAttribute('aria-hidden', 'true');
                menuToggle.classList.remove('active');
                menuDrawer.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // --- Dynamic Projects Loader (Supabase) ---
    const projectsContainer = document.getElementById('public-projects-grid');
    if (projectsContainer) {
        async function loadProjects() {
            if (!window.supabase) {
                console.warn('Supabase not ready, retrying...');
                setTimeout(loadProjects, 500);
                return;
            }

            try {
                const { data: projects, error } = await supabase
                    .from('projects')
                    .select('*')
                    .order('display_order', { ascending: true });

                if (error) throw error;

                if (!projects || projects.length === 0) {
                    projectsContainer.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:#64748b;">No projects found yet.</div>';
                    return;
                }

                projectsContainer.innerHTML = '';
                projects.forEach(p => {
                    const card = document.createElement('div');
                    card.className = 'highlight-card project-card';
                    card.style.opacity = '0'; // For animation
                    
                    // Create Tags HTML
                    const tagsHtml = (p.tags || []).map(t => 
                        `<span style="font-size:0.75rem; background:rgba(255,255,255,0.1); padding:2px 8px; border-radius:12px; margin-right:4px;">${t}</span>`
                    ).join('');

                    card.innerHTML = `
                        <div class="project-image-container" style="height:200px; overflow:hidden; border-radius:8px; margin-bottom:1rem; background:#0f172a;">
                            <img src="${p.image_url}" alt="${p.title}" style="width:100%; height:100%; object-fit:cover; opacity:0.8; transition:opacity 0.3s;">
                        </div>
                        <h4 style="margin-top:0;">${p.title}</h4>
                        <div style="margin-bottom:0.5rem; color:#94a3b8;">${tagsHtml}</div>
                        <p>${p.description}</p>
                        <div class="project-meta">
                            <a href="${p.link || '#'}" class="project-link">View Project →</a>
                        </div>
                    `;
                    projectsContainer.appendChild(card);

                    // Re-trigger animation observer for new elements
                    observer.observe(card);
                });

            } catch (err) {
                console.error('Error loading projects:', err);
                projectsContainer.innerHTML = '<div style="color:#ef4444; text-align:center;">Failed to load projects.</div>';
            }
        }
        loadProjects();
    }

    // --- Accessibility Widget ---
    
    // 1. Inject Widget HTML
    const a11yHTML = `
        <div class="a11y-widget">
            <div class="a11y-menu" id="a11y-menu" style="width: 220px;">
                <button class="a11y-option" data-theme="default">Default (Dark)</button>
                <button class="a11y-option" data-theme="high-contrast">High Contrast</button>
                <div style="height:1px; background:rgba(255,255,255,0.1); margin:4px 0;"></div>
                <button class="a11y-option" data-theme="protanopia">Protanopia (No Red)</button>
                <button class="a11y-option" data-theme="deuteranopia">Deuteranopia (No Green)</button>
                <button class="a11y-option" data-theme="tritanopia">Tritanopia (No Blue)</button>
                <button class="a11y-option" data-theme="monochrome">Monochromacy</button>
                
                <div style="border-top:1px solid rgba(255,255,255,0.1); margin-top:8px; padding-top:8px;">
                    <label style="color:white; font-size:0.9rem; display:flex; align-items:center; gap:10px; cursor:pointer; padding:0 8px;">
                        <input type="color" id="custom-color-picker" value="#2563eb" style="width:24px; height:24px; border:none; padding:0; background:none; cursor:pointer;">
                        <span>Tinker's Color</span>
                    </label>
                </div>
            </div>
            <button class="a11y-btn" id="a11y-toggle" aria-label="Accessibility Options">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 14.14 14.14"/></svg>
            </button>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', a11yHTML);

    // 2. Logic
    const a11yToggle = document.getElementById('a11y-toggle');
    const a11yMenu = document.getElementById('a11y-menu');
    const themeBtns = document.querySelectorAll('.a11y-option');
    const colorPicker = document.getElementById('custom-color-picker');
    const html = document.documentElement;

    // Load saved theme & color
    const savedTheme = localStorage.getItem('fcmd-theme') || 'default';
    const savedColor = localStorage.getItem('fcmd-custom-color');

    if (savedTheme !== 'default') {
        html.setAttribute('data-theme', savedTheme);
    }
    
    // Apply custom color if exists (and not in high-contrast mode which needs strict colors)
    if (savedColor && savedTheme !== 'high-contrast') {
        applyCustomColor(savedColor);
        colorPicker.value = savedColor;
    }

    updateActiveBtn(savedTheme);

    a11yToggle.addEventListener('click', () => {
        a11yMenu.classList.toggle('active');
    });

    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.getAttribute('data-theme');
            
            // Apply Theme
            if (theme === 'default') {
                // Hard Reset
                html.removeAttribute('data-theme');
                html.style.removeProperty('--primary-color');
                html.style.removeProperty('--gradient-1');
                localStorage.removeItem('fcmd-custom-color');
                colorPicker.value = '#2563eb'; // Reset picker visual
            } else {
                html.setAttribute('data-theme', theme);
                // Remove custom color overrides so the theme works
                html.style.removeProperty('--primary-color');
                html.style.removeProperty('--gradient-1');
            }

            // Save & UI Update
            localStorage.setItem('fcmd-theme', theme);
            updateActiveBtn(theme);
        });
    });

    // Custom Color Logic
    colorPicker.addEventListener('input', (e) => {
        const color = e.target.value;
        // Switch to default theme if they pick a color (to ensure it shows)
        html.removeAttribute('data-theme');
        localStorage.setItem('fcmd-theme', 'default');
        updateActiveBtn('default');

        applyCustomColor(color);
        localStorage.setItem('fcmd-custom-color', color);
    });

    function applyCustomColor(color) {
        html.style.setProperty('--primary-color', color);
        // Create a simple gradient: Color -> Lighter Version (mixed with white)
        // Since we can't easily mix colors in vanilla JS without a lib, we'll fake it or use the same color
        html.style.setProperty('--gradient-1', `linear-gradient(135deg, ${color} 0%, ${adjustColor(color, 40)} 100%)`);
    }

    // Simple helper to lighten a hex color
    function adjustColor(color, amount) {
        return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
    }

    function updateActiveBtn(theme) {
        themeBtns.forEach(b => {
            if (b.getAttribute('data-theme') === theme) {
                b.classList.add('active');
                b.style.fontWeight = 'bold';
            } else {
                b.classList.remove('active');
                b.style.fontWeight = 'normal';
            }
        });
    }
});
