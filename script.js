
  // -------------------------
  // LENIS + SCROLLTRIGGER SYNC
  // -------------------------
  const lenis = new Lenis({
    autoRaf: true, // handles RAF automatically
    smooth: true,
    lerp: 0.09,
  });
  gsap.registerPlugin(ScrollTrigger);
  // Sync Lenis with ScrollTrigger
  lenis.on("scroll", ScrollTrigger.update);

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
  message.split("").forEach((ch) => {
    const span = document.createElement("span");
    span.textContent = ch;
    span.style.display = "inline-block";
    span.style.opacity = 0;
    welcome.appendChild(span);
  });

  // Animate welcome text
  function animateWelcome() {
    gsap.fromTo(
      "#welcome span",
      { opacity: 0, scale: 0, y: 80, rotationX: 180 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        rotationX: 0,
        duration: 0.8,
        ease: "back",
        stagger: 0.05,
      }
    );
  }

  // Counter
  function startCounter() {
    let count = 0;
    const interval = setInterval(() => {
      count++;
      counter.innerText = count + "%";
      if (count >= 100) clearInterval(interval);
    }, 20);
  }

  // Button melt
  function meltButton(element) {
    gsap.to(element, {
      duration: 0.4,
      scaleX: 1.1,
      scaleY: 0.9,
      ease: "power1.inOut",
    });
    gsap.to(element, {
      duration: 1.2,
      y: 120,
      skewX: 40,
      scaleY: 0.2,
      opacity: 0,
      ease: "power4.in",
      delay: 0.3,
      onComplete: () => {
        element.style.display = "none";
      },
    });
  }

  startBtn.addEventListener("click", () => {
    meltButton(startBtn);
    bgMusic.play();

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
          content.classList.add("opacity-100");
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

  gsap.registerPlugin(ScrollTrigger);

  window.addEventListener("load", () => {
    gsap.from("#nav-left li", {
      opacity: 0,
      y: -30,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out",
    });
    gsap.from("#nav-center", {
      opacity: 0,
      scale: 0.8,
      duration: 0.8,
      delay: 0.3,
      ease: "back.out(1.7)",
    });
    gsap.from("#nav-right li", {
      opacity: 0,
      y: -30,
      duration: 0.6,
      stagger: 0.1,
      delay: 0.5,
      ease: "power3.out",
    });
  });

  menuBtn.addEventListener("click", () => {
    menu.classList.remove("hidden");
    gsap.fromTo(
      menu,
      { x: "100%" },
      { x: "0%", duration: 0.6, ease: "power4.out" }
    );
    gsap.fromTo(
      "#menu a",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, delay: 0.2 }
    );
  });

  closeBtn.addEventListener("click", () => {
    gsap.to(menu, {
      x: "100%",
      duration: 0.5,
      ease: "power4.in",
      onComplete: () => menu.classList.add("hidden"),
    });
  });

  // ScrollTrigger: center logo scaling
  gsap.fromTo(
    "#nav-center",
    { scale: 4, y: -150 },
    {
      scale: 1,
      y: 0,
      ease: "power2.out",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "20% top",
        scrub: true,
      },
    }
  );

  // -------------------------
  // CIRCULAR TEXT
  // -------------------------
  const text = document.getElementById("text");
  const rotate = new CircleType(text).radius(50);

  window.addEventListener("scroll", () => {
    text.style.transform = "rotate(" + window.scrollY * 0.15 + "deg)";
  });

  // -------------------------
  // CARD STACK SCROLL
  // -------------------------
  const cards = gsap.utils.toArray("#card-stack .card");

  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#case-studies",
      start: "top top",
      end: "+=" + (cards.length * 100) + "%", // enough scroll space
      scrub: true,
      pin: true,
    }
  });

  cards.forEach((card, i) => {
    // Bring next card in
    tl.fromTo(card,
      { yPercent: 100, scale: 1, opacity: 0 },
      { yPercent: 0, scale: 1, opacity: 1, duration: 1 },
      i
    );

    // Fade & shrink previous card
    if (i > 0) {
      tl.to(cards[i - 1],
        { scale: 0.9, opacity: 0.5, duration: 1 },
        i
      );
    }
  });
  // -------------------------
  // CUSTOM CURSOR
  // -------------------------
  const cursor = document.getElementById("cursor");
  let mouseX = 0,
    mouseY = 0;
  let cursorX = 0,
    cursorY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.left = cursorX + "px";
    cursor.style.top = cursorY + "px";
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.addEventListener("mousedown", () => {
    cursor.classList.add("cursor-active", "cursor-pulse");
  });

  document.addEventListener("mouseup", () => {
    cursor.classList.remove("cursor-active");
  });

  cursor.addEventListener("animationend", () => {
    cursor.classList.remove("cursor-pulse");
  });

  document.querySelectorAll("a, button").forEach((el) => {
    el.addEventListener("mouseenter", () =>
      cursor.classList.add("cursor-active")
    );
    el.addEventListener("mouseleave", () =>
      cursor.classList.remove("cursor-active")
    );
  });

  
  gsap.utils.toArray(".word").forEach((el) => {
    gsap.fromTo(el,
      { y: 100, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",   // when it enters viewport
          end: "top 20%",     // when it leaves
          scrub: true,        // smooth sync with scroll
        }
      }
    );
  });


  // discover 

gsap.registerPlugin(ScrollTrigger);

const discover = gsap.timeline({
  scrollTrigger: {
    trigger: ".discover", // parent instead of .slide
    start: "top 20%",     // animate when it enters viewport
    end: "bottom top",    // defines range of scroll
    scrub: 2,

  }
});

discover.to(".slide1", { y: 220, ease: "power1.out" })
        .to(".slide2", { y: 220, ease: "power1.out" })
        .to(".slide3", { y: 220, ease: "power1.out" })
        .to(".slide4", { y: 220, ease: "power1.out" });

        // image sec 
        gsap.to(".image-section2",{
          clipPath:"circle(100% at 50% 50% )",
          scrollTrigger:{
            trigger : ".image-section > .container",
            start : "top 20%",
            end : "bottom bottom",
            scrub :2,
            pin : true 
          }
        })


        // audio 
         const audio = document.getElementById("bgMusic");
  const btn = document.getElementById("playPauseBtn");

  // Set default volume lower (0.0 to 1.0)
  audio.volume = 0.3;

  btn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      btn.innerHTML = `<i class="fas fa-pause text-2xl"></i>`; // Pause icon
    } else {
      audio.pause();
      btn.innerHTML = `<i class="fas fa-play text-2xl"></i>`; // Play icon
    }
  });