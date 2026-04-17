// GLOBAL INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    initBackground();
    initTheme();
    loadContent();
    initDiscordAnimation();
});

// 1. BACKGROUND ANIMATION (THREE.JS)
let bgObjects = { torus: null, material: null };

function initBackground() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    // Basic Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Geometry
    const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
    const material = new THREE.MeshBasicMaterial({ 
        color: 0x3b82f6, 
        wireframe: true, 
        transparent: true, 
        opacity: 0.1 
    });
    const torus = new THREE.Mesh(geometry, material);
    scene.add(torus);
    camera.position.z = 35;

    bgObjects.torus = torus;
    bgObjects.material = material;

    let rotationSpeed = 0.002;

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        torus.rotation.x += rotationSpeed;
        torus.rotation.y += rotationSpeed;
        renderer.render(scene, camera);
        
        // Return to normal speed if boosted
        if (rotationSpeed > 0.002) {
            rotationSpeed *= 0.98;
        }
    }
    animate();

    window.boostBg = (speed) => {
        rotationSpeed = speed;
    };

    // Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// 2. THEME ENGINE
function initTheme() {
    const btn = document.getElementById('theme-btn');
    if (!btn) return;

    const setTheme = (theme) => {
        if (theme === 'light') {
            document.body.classList.add('light-mode');
            btn.textContent = 'DARK 🌙';
            if (bgObjects.material) {
                bgObjects.material.color.setHex(0x2563eb); 
                bgObjects.material.opacity = 0.15;
            }
        } else {
            document.body.classList.remove('light-mode');
            btn.textContent = 'WHITE ☀️';
            if (bgObjects.material) {
                bgObjects.material.color.setHex(0x3b82f6);
                bgObjects.material.opacity = 0.1;
            }
        }
        localStorage.setItem('theme', theme);
    };

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    // Check initial state after a small delay to ensure bgObjects is ready
    setTimeout(() => setTheme(savedTheme), 50);

    btn.onclick = () => {
        const newTheme = document.body.classList.contains('light-mode') ? 'dark' : 'light';
        setTheme(newTheme);
    };
}

// 3. CONTENT LOADERS
async function loadContent() {
    // Pages / Domains
    const pagesContainer = document.getElementById('pages-container');
    if (pagesContainer) {
        try {
            const res = await fetch('domains.json');
            const data = await res.json();
            pagesContainer.innerHTML = data.map(d => `
                <a href="${d.url}" target="_blank" class="card">
                    <h3>${d.name}</h3>
                    <p>${d.description}</p>
                </a>
            `).join('');
        } catch (e) { console.warn("Fehler beim Laden von domains.json"); }
    }

    // Projects
    const projectsContainer = document.getElementById('projects-container');
    if (projectsContainer) {
        try {
            const res = await fetch('projects.json');
            const data = await res.json();
            projectsContainer.innerHTML = data.map(p => `
                <div class="card project-card">
                    <span class="category">${p.category}</span>
                    <h3>${p.title}</h3>
                    <p>${p.description}</p>
                    <div class="tags">
                        ${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}
                    </div>
                    ${p.link !== '#' ? `<a href="${p.link}" target="_blank" class="card-btn">${p.linkText}</a>` : ''}
                </div>
            `).join('');
        } catch (e) { console.warn("Fehler beim Laden von projects.json"); }
    }

    // Media
    const mediaContainer = document.getElementById('media-container');
    if (mediaContainer) {
        try {
            const res = await fetch('media.json');
            const data = await res.json();
            mediaContainer.innerHTML = data.map(m => `
                <div class="card media-card">
                    <div class="media-type">${m.type}</div>
                    <h3>${m.title}</h3>
                    <p>${m.description}</p>
                    ${m.url !== '#' ? `<a href="${m.url}" target="_blank" class="card-btn">Ansehen</a>` : ''}
                </div>
            `).join('');
        } catch (e) { console.warn("Fehler beim Laden von media.json"); }
    }
}

// 4. DISCORD ANIMATION
function initDiscordAnimation() {
    const btn = document.querySelector('.discord-btn');
    if (!btn) return;

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const url = btn.href;

        // Visual Feedback
        btn.classList.add('discord-active');
        if (window.boostBg) window.boostBg(0.15);
        if (bgObjects.material) bgObjects.material.color.setHex(0x5865F2);

        // Flash Effect
        const flash = document.createElement('div');
        flash.className = 'page-flash';
        document.body.appendChild(flash);

        setTimeout(() => {
            window.location.href = url;
        }, 800);
    });
}