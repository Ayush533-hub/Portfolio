/* ==========================================================================
   PORTFOLIO MAIN ENGINE
   ========================================================================== */

// Initialize Lucide Icons
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
  
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  init3DCardTilt();
  init3DStarfield();
});

/* ==========================================================================
   1. NAVBAR SCROLL & ACTIVE INDICATORS
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-link');
  
  window.addEventListener('scroll', () => {
    // Navbar visual contraction
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Scrollspy active section link highlighters
    let currentSectionId = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      // Adjust trigger offset for better responsive scroll feedback
      if (window.scrollY >= (sectionTop - varTriggerOffset(sectionHeight))) {
        currentSectionId = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });
  
  function varTriggerOffset(height) {
    const isMobile = window.innerWidth <= 768;
    return isMobile ? height * 0.4 : height * 0.35;
  }
}

/* ==========================================================================
   2. MOBILE NAVIGATION OVERLAY
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('menu-toggle');
  const navOverlay = document.getElementById('mobile-nav');
  const overlayLinks = document.querySelectorAll('.mobile-link');
  
  if (!toggleBtn || !navOverlay) return;
  
  toggleBtn.addEventListener('click', () => {
    navOverlay.classList.toggle('active');
    
    // Toggle menu icon state (hamburger vs close)
    const icon = toggleBtn.querySelector('i');
    if (navOverlay.classList.contains('active')) {
      icon.setAttribute('data-lucide', 'x');
    } else {
      icon.setAttribute('data-lucide', 'menu');
    }
    window.lucide.createIcons();
  });
  
  // Close menu when clicking on overlay navigation items
  overlayLinks.forEach(link => {
    link.addEventListener('click', () => {
      navOverlay.classList.remove('active');
      const icon = toggleBtn.querySelector('i');
      icon.setAttribute('data-lucide', 'menu');
      window.lucide.createIcons();
    });
  });
}

/* ==========================================================================
   3. HIGH PERFORMANCE SCROLL REVEAL (TEXT & CARDS)
   ========================================================================== */
function initScrollReveal() {
  // Add js-enabled class to body to toggle CSS hidden states safely
  document.body.classList.add('js-enabled');
  
  // Elements to apply scroll-driven visual entries
  const headings = document.querySelectorAll('.section-header');
  const textCards = document.querySelectorAll('.about-text-card');
  const projectContainers = document.querySelectorAll('.project-container');
  const contactBlocks = document.querySelectorAll('.contact-info-block, .contact-form-card');
  
  headings.forEach(el => el.classList.add('scroll-reveal'));
  textCards.forEach(el => el.classList.add('scroll-reveal'));
  projectContainers.forEach(el => el.classList.add('scroll-reveal'));
  contactBlocks.forEach(el => el.classList.add('scroll-reveal'));
  
  // Stagger skills loading animations dynamically
  const skillCards = document.querySelectorAll('.skill-card');
  skillCards.forEach((card, index) => {
    card.classList.add('scroll-reveal');
    // Stagger based on column layout positioning
    card.style.transitionDelay = `${(index % 2) * 0.12}s`;
  });

  // Use native IntersectionObserver (runs off the main thread for 60fps performance)
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve to clean up resources after initial reveal
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null, // Default viewport
    threshold: 0.1, // Trigger when 10% visible
    rootMargin: '0px 0px -40px 0px'
  });
  
  // Bind all targets to observer
  document.querySelectorAll('.scroll-reveal').forEach(el => {
    revealObserver.observe(el);
  });
}

/* ==========================================================================
   4. 3D INTERACTIVE CARD TILT PHYSICS
   ========================================================================== */
function init3DCardTilt() {
  const tiltCards = document.querySelectorAll('.tilt-target');
  
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      
      // Get mouse coords relative to card container
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate relative percentages from card center (-1 to 1)
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const deltaX = (x - centerX) / centerX;
      const deltaY = (y - centerY) / centerY;
      
      // Tilt intensities
      const intensity = card.dataset.tiltIntensity || 12;
      const rotX = -deltaY * intensity;
      const rotY = deltaX * intensity;
      
      // Pass styles dynamically to CSS Variables
      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
      
      // Spotlight dynamic glow coordinates
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
      
      // Customize glowing boundary overlays if provided
      if (card.dataset.glowColor) {
        card.style.borderColor = card.dataset.glowColor;
        card.style.boxShadow = `0 15px 35px rgba(0,0,0,0.4), 0 0 20px ${card.dataset.glowColor}25`;
      }
    });
    
    card.addEventListener('mouseleave', () => {
      // Return cards smoothly back to neutral geometry
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      card.style.borderColor = '';
      card.style.boxShadow = '';
    });
  });
}

/* ==========================================================================
   5. 3D SCROLLABLE SPACE PARTICLE CANVAS
   ========================================================================== */
function init3DStarfield() {
  const canvas = document.getElementById('canvas-3d');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  // Set dimensions
  let width = window.innerWidth;
  let height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
  
  // Particle configuration
  const starCount = window.innerWidth <= 768 ? 200 : 380;
  const stars = [];
  
  // Coordinates span spaces from -1000 to +1000, Depth z runs from 0 to 2000
  const depthLimit = 2000;
  
  // Colors mimicking a space nebula glow
  const colors = [
    'rgba(255, 255, 255, 0.95)', // White star
    'rgba(255, 255, 255, 0.85)',
    'rgba(0, 242, 254, 0.85)',   // Neon Cyan
    'rgba(127, 0, 255, 0.85)',   // Neon Purple
    'rgba(255, 0, 127, 0.85)',   // Nebular Pink
  ];
  
  // Initialize particles
  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: (Math.random() - 0.5) * 2200,
      y: (Math.random() - 0.5) * 2200,
      z: Math.random() * depthLimit,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 2 + 0.6
    });
  }
  
  // Scroll positions tracker variables
  let targetScrollZ = 0;
  let currentScrollZ = 0;
  
  // Horizontal/vertical ambient drift offsets
  let driftX = 0;
  let driftY = 0;
  let targetDriftX = 0;
  let targetDriftY = 0;
  
  window.addEventListener('scroll', () => {
    // Scroll depth movement scaling factor (1.8x scroll speed along Z-axis)
    targetScrollZ = window.scrollY * 1.8;
  });
  
  window.addEventListener('mousemove', (e) => {
    // Parallax background drift responding to cursor coordinates
    targetDriftX = ((e.clientX - width / 2) / width) * 70;
    targetDriftY = ((e.clientY - height / 2) / height) * 70;
  });
  
  window.addEventListener('resize', () => {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  });
  
  // Animation render tick loop
  function draw() {
    // Clear canvas viewport
    ctx.fillStyle = '#06040a';
    ctx.fillRect(0, 0, width, height);
    
    // Interpolate scroll and drift offsets for cinematic motion easing
    currentScrollZ += (targetScrollZ - currentScrollZ) * 0.08;
    driftX += (targetDriftX - driftX) * 0.05;
    driftY += (targetDriftY - driftY) * 0.05;
    
    // Base rotational drift (very subtle stars movement)
    const time = Date.now() * 0.0003;
    
    stars.forEach(star => {
      // Subtract scroll offset to fly forward
      let adjustedZ = star.z - currentScrollZ;
      
      // Infinite wrapping bounds
      while (adjustedZ <= 0) adjustedZ += depthLimit;
      while (adjustedZ > depthLimit) adjustedZ -= depthLimit;
      
      // Horizontal drift mapping
      // Add a slight rotation to make stars shift dynamically
      const angle = time + (star.z * 0.0005);
      const orbitX = star.x * Math.cos(0.002) - star.y * Math.sin(0.002);
      const orbitY = star.x * Math.sin(0.002) + star.y * Math.cos(0.002);
      
      // Perspective divide projection
      const fov = 400; // FOV perspective scale
      const scale = fov / adjustedZ;
      
      // Project X and Y onto the 2D viewport coordinates
      const projX = (orbitX * scale) + (width / 2) - driftX * (adjustedZ / depthLimit);
      const projY = (orbitY * scale) + (height / 2) - driftY * (adjustedZ / depthLimit);
      
      // Draw projected star only if inside viewport boundary frames
      if (projX >= 0 && projX <= width && projY >= 0 && projY <= height) {
        const starSize = star.size * scale;
        
        // Depth-based transparency mapping (fade stars when too close or in deep background)
        let opacity = 1.0;
        if (adjustedZ > depthLimit - 400) {
          // Fade in/out at extreme depth boundary
          opacity = (depthLimit - adjustedZ) / 400;
        } else if (adjustedZ < 250) {
          // Fade out as it flies behind camera
          opacity = adjustedZ / 250;
        }
        
        // Clamp opacity safely
        opacity = Math.min(1.0, Math.max(0.0, opacity));
        
        // Apply drawing properties
        ctx.fillStyle = star.color;
        ctx.globalAlpha = opacity;
        
        ctx.beginPath();
        ctx.arc(projX, projY, Math.max(0.1, starSize), 0, Math.PI * 2);
        ctx.fill();
        
        // Add subtle bloom glow to bright, large stars (lag-free vector concentric rendering)
        if (star.size > 1.8 && opacity > 0.6) {
          ctx.fillStyle = star.color;
          ctx.globalAlpha = opacity * 0.25;
          ctx.beginPath();
          ctx.arc(projX, projY, starSize * 2.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = opacity; // restore original alpha for core star
        }
      }
    });
    
    ctx.globalAlpha = 1.0; // Reset canvas drawing transparency
    requestAnimationFrame(draw);
  }
  
  draw();
}
