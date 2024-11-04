
function partikle(opts) {
  const { nodeId, particleColor = 'white', particlesAmount = 100, maxFPS = 60 } = opts
  // timestamps are ms passed since document creation.
  // lastTimestamp can be initialized to 0, if main loop is executed immediately
  let lastTimestamp = 0;
  const timestep = 1000 / maxFPS; // ms for each frame

  // Get the container by node ID
  const container = document.getElementById(nodeId);

  if (!container) {
    console.error(`Element with ID ${nodeId} not found.`);
    return;
  }

  // Create and set up the canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Set the canvas size to the size of the container
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
  canvas.style.position = 'absolute';
  canvas.style.top = 0;
  canvas.style.left = 0;
  container.appendChild(canvas);

  // Particle class to represent each floating particle
  class Particle {
    constructor(x, y, size, speedX, speedY) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.speedX = speedX;
      this.speedY = speedY;
    }

    // Draw a particle on the canvas
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = particleColor; // Set the color of the particle
      ctx.fill();
      ctx.closePath();
    }

    // Update particle position
    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      // Bounce particles off the canvas edges
      if (this.x + this.size > canvas.width || this.x - this.size < 0) {
        this.speedX *= -1;
      }
      if (this.y + this.size > canvas.height || this.y - this.size < 0) {
        this.speedY *= -1;
      }
    }
  }

  // Array to store all particles
  const particlesArray = [];

  // Create multiple particles and push them into the particlesArray
  function initParticles() {
    particlesArray.length = 0; // Clear previous particles
    for (let i = 0; i < particlesAmount; i++) {
      const size = Math.random() * 3 + 1; // Particle size between 1 and 6
      const x = Math.random() * canvas.width; // Random x position
      const y = Math.random() * canvas.height; // Random y position
      const speedX = (Math.random() - 0.5) * 0.5; // Random horizontal speed
      const speedY = (Math.random() - 0.5) * 0.5; // Random vertical speed
      particlesArray.push(new Particle(x, y, size, speedX, speedY));
    }
  }

  // Function to calculate the distance between two particles
  function getDistance(particle1, particle2) {
    const dx = particle1.x - particle2.x;
    const dy = particle1.y - particle2.y;
    return Math.sqrt(dx * dx + dy * dy); // Pythagorean theorem
  }

  // Draw lines between particles that are closer than a threshold
  function connectParticles() {
    const maxDistance = 100;
    for (let i = 0; i < particlesArray.length; i++) {
      for (let j = i + 1; j < particlesArray.length; j++) {
        const distance = getDistance(particlesArray[i], particlesArray[j]);
        if (distance < maxDistance) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${hexToRgb(particleColor)}, ${1 - distance / maxDistance})`; // Fades with distance
          ctx.lineWidth = 1;
          ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
          ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
          ctx.stroke();
          ctx.closePath();
        }
      }
    }
  }

  // Helper function to convert hex or color names to RGB
  function hexToRgb(hex) {
    let c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('');
      if (c.length === 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = '0x' + c.join('');
      return [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',');
    }
    if (/^rgba?\((\d+),\s*(\d+),\s*(\d+)\)$/.test(hex)) {
      return hex.match(/\d+/g).slice(0, 3).join(',');
    }
    // Default to white if invalid color
    return '255,255,255';
  }

  // Animate particles
  function animateParticles(timestamp) {
    requestAnimationFrame(animateParticles); // Continue the animation
    // skip if timestep ms hasn't passed since last frame
    if (timestamp - lastTimestamp < timestep) return;

    lastTimestamp = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Update and draw each particle
    particlesArray.forEach(particle => {
      particle.update();
      particle.draw();
    });

    connectParticles(); // Draw lines between particles
  }

  // Handle canvas resizing
  window.addEventListener('resize', () => {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    initParticles(); // Re-initialize particles on resize
  });

  // Initialize particles and start animation
  initParticles();
  requestAnimationFrame(animateParticles);
}

/*
// Example usage:
<script src="https://unpkg.com/partikle"></script>
<div class="particle-canvas-wrapper" style="width: 100%; height: 100vh; position: relative; overflow: hidden;">
  <div class="particle-canvas"></div>
</div>
<script>
partikle({
  nodeId: 'particle-canvas',
  particleColor: '#fefefe',
  particlesAmount: 400
});
</script>
*/
