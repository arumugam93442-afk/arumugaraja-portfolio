/* ============================================================
   ARUMUGA RAJA  — PORTFOLIO SCRIPT
   Plain JavaScript. Each block below handles one feature and
   is commented so you can read it top to bottom.
   ============================================================ */

// Run everything only after the HTML is fully loaded.
document.addEventListener("DOMContentLoaded", function () {

  // Does the visitor prefer reduced motion? If so we skip the
  // heavier animations (particles, formulas) to be respectful.
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


  /* ----------------------------------------------------------
     1. FOOTER YEAR
     Automatically shows the current year in the footer.
     ---------------------------------------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ----------------------------------------------------------
     2. MOBILE MENU (hamburger)
     Toggle the dropdown open/closed, and close it again
     whenever a link inside it is clicked.
     ---------------------------------------------------------- */
  const hamburger = document.getElementById("hamburger");
  const navLinks  = document.getElementById("navLinks");

  hamburger.addEventListener("click", function () {
    const isOpen = navLinks.classList.toggle("open");   // add/remove .open
    hamburger.classList.toggle("open");                 // animate bars -> X
    hamburger.setAttribute("aria-expanded", isOpen);    // accessibility
  });

  // Close the menu after clicking any link (nice on mobile)
  navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("open");
      hamburger.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });


  /* ----------------------------------------------------------
     3. NAVBAR ON SCROLL
     Add a frosted background to the navbar once the user
     scrolls down a little.
     ---------------------------------------------------------- */
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", function () {
    if (window.scrollY > 40) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
  });


  /* ----------------------------------------------------------
     4. ACTIVE NAV LINK
     Highlight the menu item for whichever section is on screen.
     We use IntersectionObserver, which tells us when a section
     enters or leaves the viewport.
     ---------------------------------------------------------- */
  const sections = document.querySelectorAll("section[id]");
  const linkFor  = {};   // quick lookup: section id -> its nav link

  navLinks.querySelectorAll("a").forEach(function (link) {
    const id = link.getAttribute("href").replace("#", "");
    linkFor[id] = link;
  });

  const navObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      const link = linkFor[entry.target.id];
      if (!link) return;
      // When a section is nicely in view, mark its link active
      if (entry.isIntersecting) {
        navLinks.querySelectorAll("a").forEach(a => a.classList.remove("active"));
        link.classList.add("active");
      }
    });
  }, { rootMargin: "-45% 0px -45% 0px" });   // "in view" = middle of screen

  sections.forEach(s => navObserver.observe(s));


  /* ----------------------------------------------------------
     5. SCROLL REVEAL + PROGRESS BARS
     Any element with class "reveal" fades up when it appears.
     When the skills section appears, we also fill the bars.
     ---------------------------------------------------------- */
  const revealEls = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("visible");   // trigger the fade-up

      // If this element contains skill bars, fill them now.
      const bars = entry.target.querySelectorAll(".bar-fill");
      bars.forEach(function (bar) {
        const level = bar.getAttribute("data-level");   // e.g. "85"
        bar.style.width = level + "%";                  // animate to width
      });

      // If this element contains stat numbers, animate them to their target.
      const statNums = entry.target.querySelectorAll('.stat-num');
      statNums.forEach(function (el) {
        const target = parseInt(el.getAttribute('data-target')) || 0;
        const duration = 1100; // ms
        let startTime = null;

        function step(ts) {
          if (!startTime) startTime = ts;
          const progress = Math.min((ts - startTime) / duration, 1);
          const value = Math.floor(progress * target);
          el.textContent = value;
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = target; // ensure exact final value
        }

        requestAnimationFrame(step);
      });

      observer.unobserve(entry.target);   // reveal once, then stop watching
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ----------------------------------------------------------
     6. FLOATING FORMULAS (background)
     Create faint math/physics symbols that drift slowly upward.
     Skipped if the visitor prefers reduced motion.
     ---------------------------------------------------------- */
  const formulaLayer = document.getElementById("formulas");

  // The symbols requested in the brief, plus a couple more.
 const FORMULAS = [
  "NQ",
  "ES",
  "YM",
  "μ",
  "σ",
  "β",
  "Δ",
  "∑",
  "∫",
  "λ",
  "α",
  "RTY",
  "P(A|B)",
  "Var(X)",
  "Black-Scholes"
];

  if (formulaLayer && !reduceMotion) {
    // The four cardinal routes plus a random diagonal. Each formula picks
    // one independently, so symbols drift in from every direction.
    const ROUTES = ["leftToRight", "rightToLeft", "topToBottom", "bottomToTop", "diagonal"];

    FORMULAS.forEach(function (text) {
      const span = document.createElement("span");
      span.className = "formula";
      span.textContent = text;

      // Random start position, size, speed and (negative) delay so each
      // symbol is already mid-flight and feels natural.
      span.style.left              = Math.random() * 100 + "%";
      span.style.top               = Math.random() * 100 + "%";
      span.style.fontSize          = (Math.random() * 1.1 + 0.9) + "rem";
      span.style.animationDuration = (Math.random() * 10 + 14) + "s";
      span.style.animationDelay    = (Math.random() * -20) + "s";

      // Choose this symbol's route and how far it travels (in px).
      const route = ROUTES[Math.floor(Math.random() * ROUTES.length)];
      const dist  = Math.random() * 160 + 120;          // 120–280px
      let fx = 0, fy = 0, tx = 0, ty = 0;

      if (route === "leftToRight")      { fx = -dist; tx =  dist; }
      else if (route === "rightToLeft") { fx =  dist; tx = -dist; }
      else if (route === "topToBottom") { fy = -dist; ty =  dist; }
      else if (route === "bottomToTop") { fy =  dist; ty = -dist; }
      else {
        // Random diagonal: independent direction and distance per axis,
        // so the angle differs from one symbol to the next.
        const sx = Math.random() < 0.5 ? -1 : 1;
        const sy = Math.random() < 0.5 ? -1 : 1;
        const dx = Math.random() * 160 + 120;
        const dy = Math.random() * 160 + 120;
        fx = -dx * sx; tx = dx * sx;
        fy = -dy * sy; ty = dy * sy;
      }

      // Feed the chosen route into the CSS keyframes (see .formula / floatDrift).
      span.style.setProperty("--fx", fx + "px");
      span.style.setProperty("--fy", fy + "px");
      span.style.setProperty("--tx", tx + "px");
      span.style.setProperty("--ty", ty + "px");

      formulaLayer.appendChild(span);
    });
  }

  /* ----------------------------------------------------------
     7. CANDLESTICK CHART (hero visual)
     Build a small row of candles. Each candle has a thin wick
     and a body. "Up" candles are hollow, "down" candles filled.
     ---------------------------------------------------------- */
  const candles = document.getElementById("candles");

if (candles) {
  const candleData = [
    { open: 12, close: 28, high: 38, low: 6 },
    { open: 30, close: 45, high: 55, low: 24 },
    { open: 42, close: 58, high: 70, low: 35 },
    { open: 55, close: 72, high: 85, low: 47 },
    { open: 70, close: 58, high: 82, low: 50 },
    { open: 56, close: 40, high: 66, low: 28 },
    { open: 42, close: 62, high: 74, low: 34 },
    { open: 60, close: 82, high: 95, low: 54 }
  ];

  candles.innerHTML = "";

  candleData.forEach((c) => {
    const candle = document.createElement("div");
    candle.className = `candle ${c.close >= c.open ? "up" : "down"}`;

    const wick = document.createElement("div");
    wick.className = "wick";
    wick.style.bottom = `${c.low}%`;
    wick.style.height = `${c.high - c.low}%`;

    const body = document.createElement("div");
    body.className = "body";
    body.style.bottom = `${Math.min(c.open, c.close)}%`;
    body.style.height = `${Math.abs(c.close - c.open)}%`;

    candle.appendChild(wick);
    candle.appendChild(body);
    candles.appendChild(candle);
  });
}


  /* ----------------------------------------------------------
     8. PARTICLE BACKGROUND (canvas)
     White dots that drift around and link up with faint lines
     when they get close — a calm "data network" feel.
     ---------------------------------------------------------- */
  const canvas = document.getElementById("particles");
  const ctx = canvas.getContext("2d");
  let particles = [];
  let width, height;

  function resizeCanvas() {
    width  = canvas.width  = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.min(Math.floor((width * height) / 15000), 90);

    for (let i = 0; i < count; i++) {
      // Each particle picks its own random angle and speed,
      // so the network never reads as one shared "route".
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 0.3 + 0.15;

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        r: Math.random() * 1.6 + 0.6
      });
    }
  }

  // Draw one frame.
  function drawParticles() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Move the dot.
      p.x += p.vx;
      p.y += p.vy;

      // Bounce naturally off the edges instead of teleport-wrapping.
      if (p.x < 0) { p.x = 0; p.vx *= -1; }
      if (p.x > width) { p.x = width; p.vx *= -1; }
      if (p.y < 0) { p.y = 0; p.vy *= -1; }
      if (p.y > height) { p.y = height; p.vy *= -1; }

      // Draw the dot.
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.55)";
      ctx.fill();

      // Draw faint lines to nearby dots.
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dist = Math.hypot(p.x - q.x, p.y - q.y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          // Fade the line out as the dots move apart.
          ctx.strokeStyle = "rgba(255,255,255," + (0.12 * (1 - dist / 120)) + ")";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(drawParticles);   // loop forever
  }

  // Start the particle system.
  resizeCanvas();
  createParticles();

  if (reduceMotion) {
    // Draw a single static frame instead of animating.
    particles.forEach(function (p) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.fill();
    });
  } else {
    drawParticles();
  }

  // Rebuild particles when the window is resized.
  window.addEventListener("resize", function () {
    resizeCanvas();
    createParticles();
  });


  /* ----------------------------------------------------------
     9. CONTACT FORM
     This is a front-end demo (no server). On submit we stop the
     page reloading, show a thank-you note, and clear the fields.
     To make it really send email, connect a service like
     Formspree, EmailJS, or your own backend.
     ---------------------------------------------------------- */
  const form = document.getElementById("contactForm");
  const note = document.getElementById("formNote");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();   // don't reload the page

      // Very light validation.
      const name  = form.name.value.trim();
      const email = form.email.value.trim();
      const msg   = form.message.value.trim();

      if (!name || !email || !msg) {
        note.textContent = "Please fill in every field.";
        return;
      }

      note.textContent = "Thanks, " + name + " — your message has been noted.";
      form.reset();
    });
  }

});