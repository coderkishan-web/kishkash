// -------------------------
// IMPROVED MOBILE DETECTION & LENIS SETUP
// -------------------------
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function isTouchDevice() {
  return window.innerWidth <= 1024 || 'ontouchstart' in window;
}

// Initialize Lenis with better mobile handling
let lenis;
if (!isMobileDevice()) {
  lenis = new Lenis({
    smooth: true,
    lerp: 0.08,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    infinite: false,
  });
} else {
  // For mobile, we'll use a lighter version or disable completely
  console.log("Mobile device detected - using native scroll");
}

// GSAP + ScrollTrigger setup
gsap.registerPlugin(ScrollTrigger);

// Better ScrollTrigger defaults for mobile
ScrollTrigger.defaults({
  toggleActions: "play none none reverse",
  scroller: isMobileDevice() ? window : undefined,
});

// Update ScrollTrigger on Lenis scroll (desktop only)
if (lenis) {
  lenis.on("scroll", ScrollTrigger.update);
}

// Optimized RAF loop
function raf(time) {
  if (lenis) {
    lenis.raf(time);
  }
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Enhanced resize handler
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    ScrollTrigger.refresh();
  }, 250);
});

console.log("Scroll system initialized ✅");

// -------------------------
// START BUTTON / LOADER
// -------------------------
const startBtn = document.getElementById("startBtn");
const loader = document.getElementById("loader");
const slide = document.getElementById("slide");
const welcome = document.getElementById("welcome");
const counter = document.getElementById("counter");
const content = document.getElementById("content");
const bgMusic = document.getElementById("bgMusic");

// Setup welcome letters
const message = "Welcome To The Arena";
welcome.innerHTML = "";
message.split("").forEach((ch) => {
  const span = document.createElement("span");
  span.textContent = ch === " " ? "\u00A0" : ch;
  span.style.display = "inline-block";
  span.style.opacity = 0;
  welcome.appendChild(span);
});

// Animate welcome text
function animateWelcome() {
  gsap.fromTo(
    "#welcome span",
    { opacity: 0, scale: 0, y: 50, rotationX: 90 },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      rotationX: 0,
      duration: 0.6,
      ease: "back.out(1.7)",
      stagger: 0.03,
    }
  );
}

// Counter with better performance
function startCounter() {
  let count = 0;
  const duration = 2000; // 2 seconds
  const increment = 100 / (duration / 16); // 60fps
  
  function updateCounter() {
    count += increment;
    if (count >= 100) {
      counter.innerText = "100%";
      return;
    }
    counter.innerText = Math.floor(count) + "%";
    requestAnimationFrame(updateCounter);
  }
  updateCounter();
}

// Button melt effect
function meltButton(element) {
  const tl = gsap.timeline();
  tl.to(element, {
    duration: 0.4,
    scaleX: 1.1,
    scaleY: 0.9,
    ease: "power1.inOut",
  })
  .to(element, {
    duration: 1.2,
    y: 120,
    skewX: 40,
    scaleY: 0.2,
    opacity: 0,
    ease: "power4.in",
    onComplete: () => {
      element.style.display = "none";
    },
  }, 0.3);
}

startBtn.addEventListener("click", () => {
  meltButton(startBtn);
  
  // Handle audio play
  const playPromise = bgMusic.play();
  if (playPromise !== undefined) {
    playPromise.catch(e => console.log("Audio play failed:", e));
  }

  setTimeout(() => {
    loader.style.display = "none";
    slide.classList.add("slide-active");
    startCounter();

    setTimeout(() => {
      animateWelcome();
    }, 500);

    setTimeout(() => {
      slide.classList.add("slide-up");
      setTimeout(() => {
        content.style.opacity = "1";
        content.classList.remove("opacity-0");
        // Force refresh after content loads
        ScrollTrigger.refresh();
      }, 600);
    }, 2500);
  }, 1600);
});

// -------------------------
// NAVIGATION GSAP
// -------------------------
const menuBtn = document.getElementById("menu-btn");
const closeBtn = document.getElementById("close-btn");
const menu = document.getElementById("menu");

window.addEventListener("load", () => {
  // Navigation animations
  const navTl = gsap.timeline({ delay: 0.5 });
  
  navTl.from("#nav-left li", {
    opacity: 0,
    y: -20,
    duration: 0.4,
    stagger: 0.1,
    ease: "power2.out",
  })
  .from("#nav-center", {
    opacity: 0,
    scale: 0.8,
    duration: 0.6,
    ease: "back.out(1.7)",
  }, "-=0.2")
  .from("#nav-right li", {
    opacity: 0,
    y: -20,
    duration: 0.4,
    stagger: 0.1,
    ease: "power2.out",
  }, "-=0.4");
  
  // Ensure ScrollTrigger works properly
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 100);
});

// Mobile menu handlers
menuBtn.addEventListener("click", () => {
  menu.classList.remove("hidden");
  const menuTl = gsap.timeline();
  
  menuTl.fromTo(menu, 
    { x: "100%" }, 
    { x: "0%", duration: 0.5, ease: "power3.out" }
  )
  .fromTo("#menu a", 
    { opacity: 0, y: 20 }, 
    { opacity: 1, y: 0, duration: 0.3, stagger: 0.1 }, 
    "-=0.2"
  );
});

closeBtn.addEventListener("click", () => {
  gsap.to(menu, {
    x: "100%",
    duration: 0.4,
    ease: "power3.in",
    onComplete: () => menu.classList.add("hidden"),
  });
});

// -------------------------
// SCROLLTRIGGER NAV CENTER (FIXED)
// -------------------------
// Wait for content to be visible before setting up nav animation
function setupNavAnimation() {
  ScrollTrigger.matchMedia({
    "(min-width: 1024px)": function () {
      gsap.set("#nav-center", { scale: 4, y: -150 });
      gsap.to("#nav-center", {
        scale: 1,
        y: 0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "#content",
          start: "top top",
          end: "20% top",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    },
    "(min-width: 768px) and (max-width: 1023px)": function () {
      gsap.set("#nav-center", { scale: 3, y: -150 });
      gsap.to("#nav-center", {
        scale: 1,
        y: 0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "#content",
          start: "top top",
          end: "20% top",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    },
    "(max-width: 767px)": function () {
      gsap.set("#nav-center", { scale: 2, y: -100 });
      gsap.to("#nav-center", {
        scale: 1,
        y: 0,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "#content",
          start: "top top",
          end: "20% top",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    },
  });
}

// Delay nav animation setup until after loader
setTimeout(() => {
  setupNavAnimation();
}, 5000);

// -------------------------
// CIRCULAR TEXT (OPTIMIZED)
// -------------------------
const text = document.getElementById("text");
let circleType;

if (text && typeof CircleType !== 'undefined') {
  circleType = new CircleType(text);
  circleType.radius(isTouchDevice() ? 35 : 50);
  
  let rotationFrame;
  function updateTextRotation() {
    if (text) {
      text.style.transform = `rotate(${window.scrollY * 0.1}deg)`;
    }
    rotationFrame = null;
  }
  
  window.addEventListener("scroll", () => {
    if (!rotationFrame) {
      rotationFrame = requestAnimationFrame(updateTextRotation);
    }
  }, { passive: true });
}

// -------------------------
// CARD STACK SCROLL (FIXED FOR MOBILE)
// -------------------------
function setupCardStack() {
 
 

  const cards = gsap.utils.toArray("#card-stack .card");
  
  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#case-studies",
      start: "top top",
      end: "+=" + (cards.length * 100) + "%", // enough scroll space
      scrub: true,
      pin: true,
       anticipatePin: 1,
        invalidateOnRefresh: true,
        refreshPriority: -1,
    }
  });
  
  cards.forEach((card, i) => {
    tl.fromTo(card,
      { yPercent: 100, scale: 1, opacity: 0 },
      { yPercent: 0, scale: 1, opacity: 1, duration: 1 },
      i
    );
    if (i > 0) {
      tl.to(cards[i - 1],
        { scale: 0.9, opacity: 0.5, duration: 1 },
        i
      );
    }
  });
}




  setupCardStack();


// -------------------------
// CUSTOM CURSOR (DESKTOP ONLY)
// -------------------------
if (!isTouchDevice()) {
  const cursor = document.getElementById("cursor");
  if (cursor) {
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    function animateCursor() {
      const ease = 0.15;
      cursorX += (mouseX - cursorX) * ease;
      cursorY += (mouseY - cursorY) * ease;
      cursor.style.left = cursorX + "px";
      cursor.style.top = cursorY + "px";
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Cursor interactions
    document.addEventListener("mousedown", () => {
      cursor.classList.add("cursor-active", "cursor-pulse");
    });
    document.addEventListener("mouseup", () => {
      cursor.classList.remove("cursor-active");
    });
    cursor.addEventListener("animationend", () => {
      cursor.classList.remove("cursor-pulse");
    });
    
    // Hover effects
    document.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("cursor-active"));
      el.addEventListener("mouseleave", () => cursor.classList.remove("cursor-active"));
    });
  }
} else {
  // Hide cursor on touch devices
  const cursor = document.getElementById("cursor");
  if (cursor) cursor.style.display = "none";
}

// -------------------------
// WORD ANIMATIONS (OPTIMIZED)needed to be update
// -------------------------
function setupWordAnimations() {
  gsap.utils.toArray(".word").forEach((el, index) => {
    gsap.fromTo(el,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          end: "top 20%",
          scrub: 1,
          invalidateOnRefresh: true,
        }
      }
    );
  });
}

// -------------------------
// DISCOVER SECTION
// -------------------------
function setupDiscoverSection() {
  const discover = gsap.timeline({
  scrollTrigger: {
    trigger: ".discover",
    start: "top 40%",
    end: "bottom top",
    scrub: 2,
  
  }
});
discover.to(".slide1", { y: 220, ease: "power1.out" })
        .to(".slide2", { y: 220, ease: "power1.out" })
        .to(".slide3", { y: 220, ease: "power1.out" })
        .to(".slide4", { y: 220, ease: "power1.out" });

}

// -------------------------
// IMAGE SECTION
// -------------------------
function setupImageSection() {
  gsap.to(".image-section2",{
  clipPath:"circle(100% at 50% 50% )",
  scrollTrigger:{
    trigger : ".image-section > .container",
    start : "top 30%",
    end : "bottom bottom",
    scrub :2,
    pin : true 
  }
});
}

// -------------------------
// INITIALIZE ALL ANIMATIONS
// -------------------------
function initializeAnimations() {
  setupWordAnimations();
  setupDiscoverSection();
  setupImageSection();
}

// Setup animations after content loads
setTimeout(() => {
  initializeAnimations();
}, 6000);

// -------------------------
// AUDIO CONTROLS
// -------------------------
const audio = document.getElementById("bgMusic");
const playPauseBtn = document.getElementById("playPauseBtn");

if (audio && playPauseBtn) {
  audio.volume = 0.3;
  
  playPauseBtn.addEventListener("click", () => {
    if (audio.paused) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          playPauseBtn.innerHTML = `<i class="fas fa-pause text-2xl"></i>`;
        }).catch(e => {
          console.log("Audio play failed:", e);
        });
      }
    } else {
      audio.pause();
      playPauseBtn.innerHTML = `<i class="fas fa-play text-2xl"></i>`;
    }
  });
}

// -------------------------
// MOBILE OPTIMIZATIONS
// -------------------------
if (isMobileDevice() || isTouchDevice()) {
  // Prevent zoom on double tap
  let lastTouchEnd = 0;
  document.addEventListener('touchend', function (event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, false);

  // Handle orientation change
  window.addEventListener('orientationchange', function() {
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);
  });

  // Optimize scroll performance
  let ticking = false;
  function updateScrollTrigger() {
    ScrollTrigger.update();
    ticking = false;
  }
  
  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(updateScrollTrigger);
      ticking = true;
    }
  }, { passive: true });
}

// -------------------------
// SMOOTH ANCHOR LINKS
// -------------------------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      if (lenis) {
        lenis.scrollTo(targetElement, { duration: 1.5 });
      } else {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
    
    // Close mobile menu
    if (menu && !menu.classList.contains('hidden')) {
      gsap.to(menu, {
        x: "100%",
        duration: 0.4,
        ease: "power3.in",
        onComplete: () => menu.classList.add("hidden"),
      });
    }
  });
});

// Force final refresh
window.addEventListener('load', function() {
  setTimeout(() => {
    ScrollTrigger.refresh();
    console.log("Final ScrollTrigger refresh completed");
  }, 1000);
});