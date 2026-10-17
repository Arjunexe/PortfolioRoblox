// Background particles
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
function resizeParticles() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particles = Array.from({ length: Math.min(Math.floor(canvas.width * canvas.height / 15000), 80) }, () => ({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        size: Math.random() * 2 + .5,
        vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3,
        opacity: Math.random() * .5 + .1,
        color: Math.random() > .5 ? '168,85,247' : '34,211,238'
    }));
}
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.opacity})`;
        ctx.fill();
        if (!reducedMotion.matches) {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        }
    });
    for (let i = 0; i < particles.length; i++) {
        for (let k = i + 1; k < particles.length; k++) {
            const a = particles[i], b = particles[k];
            const distance = Math.hypot(a.x - b.x, a.y - b.y);
            if (distance < 150) {
                ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
                ctx.strokeStyle = `rgba(168,85,247,${.06 * (1 - distance / 150)})`;
                ctx.lineWidth = .5; ctx.stroke();
            }
        }
    }
}
let particleFrame;
function runParticles() {
    cancelAnimationFrame(particleFrame);
    drawParticles();
    if (!reducedMotion.matches && !document.hidden) particleFrame = requestAnimationFrame(runParticles);
}
resizeParticles(); runParticles();
window.addEventListener('resize', () => { resizeParticles(); runParticles(); });
reducedMotion.addEventListener('change', runParticles);
document.addEventListener('visibilitychange', runParticles);

// ===========================
// Navbar Scroll Effect
// ===========================
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
});

// ===========================
// Mobile Menu
// ===========================
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-nav-link');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ===========================
// Smooth Scroll for nav links
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        const target = href === '#' ? document.getElementById('hero') : document.querySelector(href);
        if (target) {
            const offset = 80;
            const position = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top: position, behavior: 'smooth' });
        }
    });
});

// ===========================
// Scroll Reveal Animation
// ===========================
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, parseInt(delay));
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ===========================
// Stat Counter Animation
// ===========================
const statNumbers = document.querySelectorAll('.stat-number');

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.target);
            animateCounter(entry.target, target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(num => counterObserver.observe(num));

function animateCounter(element, target) {
    let current = 0;
    const duration = 2000;
    const step = target / (duration / 16);

    function update() {
        current += step;
        if (current >= target) {
            element.textContent = target;
            return;
        }
        element.textContent = Math.floor(current);
        requestAnimationFrame(update);
    }

    update();
}

// ===========================
// Active Nav Link on Scroll
// ===========================
const sections = document.querySelectorAll('.section, #hero');
const navLinks = document.querySelectorAll('.nav-link:not(.nav-link-cta)');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, { threshold: 0.3 });

sections.forEach(section => sectionObserver.observe(section));

// ===========================
// Portfolio Image Modal
// ===========================
const portfolioCards = document.querySelectorAll('.portfolio-card');

portfolioCards.forEach(card => {
    card.addEventListener('click', () => {
        const img = card.querySelector('.portfolio-image img');
        const title = card.querySelector('.portfolio-info h3').textContent;
        showImageModal(img.src, title);
    });
});

function showImageModal(src, title) {
    // Check if modal already exists
    let existing = document.getElementById('image-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'image-modal';
    modal.style.cssText = `
        position: fixed;
        inset: 0;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(7, 6, 11, 0.9);
        backdrop-filter: blur(10px);
        padding: 40px;
        cursor: pointer;
        animation: fadeIn 0.3s ease;
    `;

    modal.innerHTML = `
        <div style="
            max-width: 800px;
            max-height: 90vh;
            position: relative;
            animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        " onclick="event.stopPropagation()">
            <h3 style="
                color: #f0ecf7;
                font-family: 'Outfit', sans-serif;
                font-size: 1.25rem;
                margin-bottom: 16px;
                text-align: center;
            ">${title}</h3>
            <img src="${src}" alt="${title}" style="
                max-width: 100%;
                max-height: 75vh;
                border-radius: 16px;
                border: 1px solid rgba(168, 85, 247, 0.3);
                box-shadow: 0 20px 60px rgba(168, 85, 247, 0.2);
            ">
            <button onclick="this.closest('#image-modal').remove()" style="
                position: absolute;
                top: -8px;
                right: -8px;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                border: 1px solid rgba(168, 85, 247, 0.3);
                background: rgba(7, 6, 11, 0.9);
                color: #f0ecf7;
                font-size: 1.2rem;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            ">✕</button>
        </div>
    `;

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
    `;
    modal.appendChild(style);

    modal.addEventListener('click', () => modal.remove());
    document.addEventListener('keydown', function handler(e) {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', handler);
        }
    });

    document.body.appendChild(modal);
}

