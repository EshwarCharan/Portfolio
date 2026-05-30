/* =============================================
   ESHWAR CHARAN — PORTFOLIO SCRIPT
   ============================================= */

// ===== CUSTOM CURSOR =====
const cursor     = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursor.style.transform = `translate(${mouseX}px,${mouseY}px) translate(-50%,-50%)`;
});
function animateCursor() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.transform = `translate(${ringX}px,${ringY}px) translate(-50%,-50%)`;
    requestAnimationFrame(animateCursor);
}
animateCursor();
document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; cursorRing.style.opacity = '0'; });
document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; cursorRing.style.opacity = '.45'; });

// ===== STAR CANVAS =====
const canvas = document.getElementById('star-canvas');
const ctx    = canvas.getContext('2d');
let stars    = [];
function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
function createStars() {
    stars = [];
    const count = Math.floor((canvas.width * canvas.height) / 5500);
    for (let i = 0; i < count; i++) {
        stars.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height,
            r: Math.random()*1.1+0.2, o: Math.random(), spd: Math.random()*.004+.001, dir: Math.random()>.5?1:-1 });
    }
}
function drawStars() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    stars.forEach(s => {
        s.o += s.spd * s.dir;
        if (s.o>=1||s.o<=0.05) s.dir*=-1;
        ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
        ctx.fillStyle = `rgba(180,200,255,${s.o * 0.7})`; ctx.fill();
    });
    requestAnimationFrame(drawStars);
}
resizeCanvas(); createStars(); drawStars();
window.addEventListener('resize', () => { resizeCanvas(); createStars(); });

// ===== PRELOADER =====
window.addEventListener('load', () => {
    const pre = document.getElementById('preloader');
    setTimeout(() => {
        pre.classList.add('hidden');
        setTimeout(() => pre.remove(), 700);
    }, 900);
});

// ===== THEME TOGGLE =====
const themeBtn = document.querySelector('.theme-btn');
const saved    = localStorage.getItem('eshwar-theme') || 'dark';
document.documentElement.setAttribute('data-theme', saved);
syncThemeIcon(saved);
canvas.style.opacity = saved === 'light' ? '0.25' : '0.6';

themeBtn.addEventListener('click', () => {
    const cur  = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('eshwar-theme', next);
    syncThemeIcon(next);
    canvas.style.opacity = next === 'light' ? '0.25' : '0.6';
});
function syncThemeIcon(theme) {
    const i = themeBtn.querySelector('i');
    i.className = theme === 'dark' ? 'bx bx-sun' : 'bx bx-moon';
}

// ===== MENU TOGGLE =====
const menuIcon = document.querySelector('#menu-icon');
const navbar   = document.querySelector('.navbar');
menuIcon.addEventListener('click', () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
});

// ===== STICKY HEADER + ACTIVE NAV =====
const header   = document.querySelector('header');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('header nav a');
window.addEventListener('scroll', () => {
    header.classList.toggle('sticky', window.scrollY > 80);
    sections.forEach(sec => {
        const top = window.scrollY, offset = sec.offsetTop - 160, height = sec.offsetHeight, id = sec.getAttribute('id');
        if (top >= offset && top < offset + height) {
            navLinks.forEach(l => l.classList.remove('active'));
            const active = document.querySelector(`header nav a[href="#${id}"]`);
            if (active) active.classList.add('active');
        }
    });
    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');
    triggerSkillBars();
    revealOnScroll();
});

// ===== SCROLL REVEAL =====
function revealOnScroll() {
    document.querySelectorAll('.reveal').forEach(el => {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.88) el.classList.add('visible');
    });
}
revealOnScroll();

// ===== SKILL BARS =====
let barsTriggered = false;
function triggerSkillBars() {
    if (barsTriggered) return;
    const section = document.querySelector('.services');
    if (!section) return;
    if (section.getBoundingClientRect().top < window.innerHeight * 0.85) {
        document.querySelectorAll('.bar-fill').forEach(bar => { bar.style.width = bar.dataset.w + '%'; });
        barsTriggered = true;
    }
}

// ===== PORTFOLIO FILTER =====
document.querySelectorAll('.f-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.f-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        document.querySelectorAll('.proj-card').forEach(card => {
            card.classList.toggle('hidden', filter !== 'all' && card.dataset.cat !== filter);
        });
    });
});

// ===== TYPED JS =====
new Typed('.multiple-text', {
    strings: ['MCA Student', 'Python Developer', 'ML Engineer', 'Web Developer', 'Backend Developer'],
    typeSpeed: 75, backSpeed: 55, backDelay: 1800, loop: true
});

// ===== TERMINAL ANIMATION =====
const terminalLines = [
    { type: 'cmd',    text: 'whoami' },
    { type: 'out',    text: 'eshwar-charan-adluri' },
    { type: 'cmd',    text: 'cat skills.json' },
    { type: 'json',   pairs: [['languages', '"Python", "Java"'], ['ml', '"NLP", "Scikit-learn"'], ['backend', '"Flask", "Django"'], ['frontend', '"React.js"']] },
    { type: 'cmd',    text: 'ls projects/' },
    { type: 'out',    text: 'green-guard/  ai-techfec/  attendance-app/' },
    { type: 'cmd',    text: 'echo $STATUS' },
    { type: 'out',    text: '🟢 Open to opportunities' },
];

async function runTerminal() {
    const body = document.getElementById('terminal-body');
    if (!body) return;
    await sleep(1200);
    for (const line of terminalLines) {
        if (line.type === 'cmd') {
            const el = document.createElement('div');
            el.className = 't-line';
            el.innerHTML = `<span class="t-prompt">❯</span><span class="t-cmd"> ${escHtml(line.text)}</span>`;
            body.appendChild(el);
            await sleep(400);
        } else if (line.type === 'out') {
            const el = document.createElement('div');
            el.className = 't-output';
            el.textContent = line.text;
            body.appendChild(el);
            await sleep(300);
        } else if (line.type === 'json') {
            const open = document.createElement('div'); open.className = 't-output'; open.textContent = '{'; body.appendChild(open);
            for (const [k, v] of line.pairs) {
                const el = document.createElement('div');
                el.className = 't-output';
                el.innerHTML = `  <span class="t-key">"${k}"</span>: <span class="t-val">[${v}]</span>`;
                body.appendChild(el);
                await sleep(180);
            }
            const close = document.createElement('div'); close.className = 't-output'; close.textContent = '}'; body.appendChild(close);
            await sleep(250);
        }
        body.scrollTop = body.scrollHeight;
    }
    // blinking cursor at end
    const cur = document.createElement('div');
    cur.className = 't-line';
    cur.innerHTML = `<span class="t-prompt">❯</span><span class="t-cursor"></span>`;
    body.appendChild(cur);
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function escHtml(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;'); }
runTerminal();

// ===== PROJECT CANVAS ANIMATIONS =====
function initProjectCanvases() {
    document.querySelectorAll('.proj-canvas').forEach(canvas => {
        const type = canvas.dataset.type;
        const ctx  = canvas.getContext('2d');
        canvas.width  = canvas.offsetWidth  || 400;
        canvas.height = canvas.offsetHeight || 180;

        if (type === 'android') drawAndroidViz(ctx, canvas.width, canvas.height);
        if (type === 'ml')      drawMLViz(ctx, canvas.width, canvas.height);
        if (type === 'fraud')   drawFraudViz(ctx, canvas.width, canvas.height);
    });
}

// Android: phone wireframe + data bars
function drawAndroidViz(ctx, w, h) {
    ctx.clearRect(0,0,w,h);
    // subtle grid
    ctx.strokeStyle = 'rgba(34,197,94,0.08)';
    ctx.lineWidth = 1;
    for (let x=0;x<w;x+=24) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
    for (let y=0;y<h;y+=24) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }
    // phone outline
    const px=w/2-28,py=18,pw=56,ph=h-32;
    ctx.strokeStyle='rgba(34,197,94,0.5)'; ctx.lineWidth=1.5;
    roundRect(ctx,px,py,pw,ph,6); ctx.stroke();
    // screen lines
    ctx.strokeStyle='rgba(34,197,94,0.3)'; ctx.lineWidth=1;
    [py+18,py+28,py+38,py+48].forEach(y => {
        ctx.beginPath(); ctx.moveTo(px+6,y); ctx.lineTo(px+pw-6,y); ctx.stroke();
    });
    // attendance dots
    const cols=4,rows=3,gx=px+8,gy=py+58,gs=10;
    for(let r=0;r<rows;r++) for(let c=0;c<cols;c++) {
        const present = Math.random()>.25;
        ctx.beginPath(); ctx.arc(gx+c*gs,gy+r*gs,3,0,Math.PI*2);
        ctx.fillStyle=present?'rgba(34,197,94,0.7)':'rgba(239,68,68,0.5)'; ctx.fill();
    }
    // glow
    const g=ctx.createRadialGradient(w/2,h,0,w/2,h,w*.6);
    g.addColorStop(0,'rgba(34,197,94,0.12)'); g.addColorStop(1,'transparent');
    ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
}

// ML: neural network nodes
function drawMLViz(ctx, w, h) {
    ctx.clearRect(0,0,w,h);
    const layers = [[1,2],[2,3],[3,3],[2,1]];
    const lw = w/(layers.length+1);
    const positions = layers.map((l,li) =>
        l.map((_,ni) => ({ x: lw*(li+1), y: h/(l.length+1)*(ni+1) }))
    );
    // connections
    for(let i=0;i<positions.length-1;i++) {
        positions[i].forEach(from => {
            positions[i+1].forEach(to => {
                const active = Math.random()>.4;
                ctx.beginPath(); ctx.moveTo(from.x,from.y); ctx.lineTo(to.x,to.y);
                ctx.strokeStyle = active?'rgba(79,142,247,0.3)':'rgba(79,142,247,0.08)';
                ctx.lineWidth=1; ctx.stroke();
            });
        });
    }
    // nodes
    positions.flat().forEach((p,i) => {
        const r=7, active=Math.random()>.3;
        ctx.beginPath(); ctx.arc(p.x,p.y,r,0,Math.PI*2);
        ctx.fillStyle = active?'rgba(79,142,247,0.85)':'rgba(79,142,247,0.28)'; ctx.fill();
        if(active){ ctx.beginPath(); ctx.arc(p.x,p.y,r+4,0,Math.PI*2); ctx.strokeStyle='rgba(79,142,247,0.15)'; ctx.lineWidth=1; ctx.stroke(); }
    });
    // glow
    const g=ctx.createRadialGradient(w/2,h/2,0,w/2,h/2,w*.5);
    g.addColorStop(0,'rgba(79,142,247,0.08)'); g.addColorStop(1,'transparent');
    ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
}

// Fraud: chart + alert indicators
function drawFraudViz(ctx, w, h) {
    ctx.clearRect(0,0,w,h);
    // line chart
    const pts=16, pad=20;
    const data=[42,55,48,62,45,70,52,88,60,75,50,65,90,58,72,55];
    const maxD=Math.max(...data), minD=Math.min(...data);
    const gx=(w-pad*2)/pts, gy=(h-pad*2)/(maxD-minD);
    // area fill
    ctx.beginPath();
    ctx.moveTo(pad, h-pad-(data[0]-minD)*gy);
    data.forEach((d,i) => ctx.lineTo(pad+i*gx, h-pad-(d-minD)*gy));
    ctx.lineTo(pad+(pts-1)*gx, h-pad); ctx.lineTo(pad, h-pad); ctx.closePath();
    const areaGrad=ctx.createLinearGradient(0,0,0,h);
    areaGrad.addColorStop(0,'rgba(34,211,238,0.2)'); areaGrad.addColorStop(1,'rgba(34,211,238,0.0)');
    ctx.fillStyle=areaGrad; ctx.fill();
    // line
    ctx.beginPath();
    data.forEach((d,i) => i===0 ? ctx.moveTo(pad+i*gx, h-pad-(d-minD)*gy) : ctx.lineTo(pad+i*gx, h-pad-(d-minD)*gy));
    ctx.strokeStyle='rgba(34,211,238,0.7)'; ctx.lineWidth=2; ctx.stroke();
    // fraud spikes
    [7,12].forEach(i => {
        const x=pad+i*gx, y=h-pad-(data[i]-minD)*gy;
        ctx.beginPath(); ctx.arc(x,y,5,0,Math.PI*2);
        ctx.fillStyle='rgba(244,114,182,0.9)'; ctx.fill();
        ctx.beginPath(); ctx.arc(x,y,9,0,Math.PI*2);
        ctx.strokeStyle='rgba(244,114,182,0.4)'; ctx.lineWidth=1.5; ctx.stroke();
    });
    // glow
    const g=ctx.createRadialGradient(w/2,h,0,w/2,h,w*.6);
    g.addColorStop(0,'rgba(34,211,238,0.1)'); g.addColorStop(1,'transparent');
    ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
}

function roundRect(ctx,x,y,w,h,r) {
    ctx.beginPath();
    ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.arcTo(x+w,y,x+w,y+r,r);
    ctx.lineTo(x+w,y+h-r); ctx.arcTo(x+w,y+h,x+w-r,y+h,r);
    ctx.lineTo(x+r,y+h); ctx.arcTo(x,y+h,x,y+h-r,r);
    ctx.lineTo(x,y+r); ctx.arcTo(x,y,x+r,y,r); ctx.closePath();
}

// Run after DOM is ready
window.addEventListener('load', () => {
    setTimeout(initProjectCanvases, 200);
});
window.addEventListener('resize', initProjectCanvases);

// ===== CONTACT FORM =====
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxXA-s8NtsG8mS4h7S4S6qqjRljrQIkvhaIeDERcjjE73TpDPb_AaKjnc_ndlq7CVyY/exec';
const form = document.forms['contact-form'];
function toast(msg, ok = true) {
    let t = document.getElementById('toast');
    t.innerHTML = `<i class='bx ${ok?"bx-check-circle":"bx-error-circle"}' style="color:${ok?'var(--accent)':'#f472b6'};"></i> ${msg}`;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 4500);
}
if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        const btn = form.querySelector('[type=submit]');
        btn.innerHTML = `<i class='bx bx-loader-alt bx-spin'></i> Sending...`; btn.disabled = true;
        fetch(SCRIPT_URL, { method: 'POST', body: new FormData(form) })
            .then(() => { toast("Message sent! I'll be in touch soon 🚀"); form.reset(); })
            .catch(() => toast("Couldn't send — try emailing directly.", false))
            .finally(() => { btn.innerHTML = `<i class='bx bx-send'></i> Send Message`; btn.disabled = false; });
    });
}

// ===== SCROLL REVEAL (ScrollReveal lib) =====
ScrollReveal({ distance: '50px', duration: 1600, delay: 100, easing: 'cubic-bezier(0.4,0,0.2,1)' });
ScrollReveal().reveal('.home-content',  { origin: 'left' });
ScrollReveal().reveal('.home-visual',   { origin: 'right' });
ScrollReveal().reveal('.about-visual',  { origin: 'left' });
ScrollReveal().reveal('.about-content', { origin: 'right' });
ScrollReveal().reveal('.skill-card',    { origin: 'bottom', interval: 150 });
ScrollReveal().reveal('.tl-item',       { origin: 'left',   interval: 150 });
ScrollReveal().reveal('.ach-card',      { origin: 'bottom', interval: 150 });
ScrollReveal().reveal('.proj-card',     { origin: 'bottom', interval: 100 });
ScrollReveal().reveal('.contact-info',  { origin: 'left' });
ScrollReveal().reveal('.contact form',  { origin: 'right' });