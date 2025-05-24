export function partikle(opts) {
    const { nodeId, particleColor = 'white', particlesAmount = 100, maxFPS = 60 } = opts;
    let lastTimestamp = 0;
    const timestep = 1000 / maxFPS;
    const container = document.getElementById(nodeId);
    if (!container) {
        console.error(`Element with ID ${nodeId} not found.`);
        return;
    }
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    container.appendChild(canvas);
    class Particle {
        constructor(x, y, size, speedX, speedY) {
            this.x = x;
            this.y = y;
            this.size = size;
            this.speedX = speedX;
            this.speedY = speedY;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = particleColor;
            ctx.fill();
            ctx.closePath();
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x + this.size > canvas.width || this.x - this.size < 0) {
                this.speedX *= -1;
            }
            if (this.y + this.size > canvas.height || this.y - this.size < 0) {
                this.speedY *= -1;
            }
        }
    }
    const particlesArray = [];
    function initParticles() {
        particlesArray.length = 0;
        for (let i = 0; i < particlesAmount; i++) {
            const size = Math.random() * 3 + 1;
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const speedX = (Math.random() - 0.5) * 0.5;
            const speedY = (Math.random() - 0.5) * 0.5;
            particlesArray.push(new Particle(x, y, size, speedX, speedY));
        }
    }
    function getDistance(p1, p2) {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    function connectParticles() {
        const maxDistance = 100;
        for (let i = 0; i < particlesArray.length; i++) {
            for (let j = i + 1; j < particlesArray.length; j++) {
                const distance = getDistance(particlesArray[i], particlesArray[j]);
                if (distance < maxDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(${hexToRgb(particleColor)}, ${1 - distance / maxDistance})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                    ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                    ctx.stroke();
                    ctx.closePath();
                }
            }
        }
    }
    function hexToRgb(color) {
        let c;
        if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(color)) {
            c = color.substring(1).split('');
            if (c.length === 3)
                c = [c[0], c[0], c[1], c[1], c[2], c[2]];
            c = '0x' + c.join('');
            return [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',');
        }
        if (/^rgba?\((\d+),\s*(\d+),\s*(\d+)\)$/.test(color)) {
            return color.match(/\d+/g).slice(0, 3).join(',');
        }
        return '255,255,255';
    }
    function animateParticles(timestamp) {
        requestAnimationFrame(animateParticles);
        if (timestamp - lastTimestamp < timestep)
            return;
        lastTimestamp = timestamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particlesArray.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
    }
    window.addEventListener('resize', () => {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        initParticles();
    });
    initParticles();
    requestAnimationFrame(animateParticles);
}
