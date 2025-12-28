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
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(form);
            const name = form.querySelector('input[type="text"]').value;
            const email = form.querySelector('input[type="email"]').value;
            const phone = form.querySelector('input[type="tel"]').value;
            const message = form.querySelector('textarea').value;

            alert(`Thank you for your message, ${name}! We will get back to you soon at ${email}.`);

            form.reset();
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
});
