// PULPO Production — small progressive enhancements. The page works without this file.
document.documentElement.classList.remove("no-js");

// ---- Mobile menu ----
const toggle = document.querySelector(".menu-toggle");
const nav = document.getElementById("primary-nav");

function setMenu(open) {
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  nav.classList.toggle("is-open", open);
}
toggle?.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
nav?.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

// ---- Sticky stack: keep tall sections readable ----
// Each section in .stack sticks at (--stack × --stack-step). If a section is
// taller than the space below that point, it would freeze before its bottom
// is visible, so we raise its sticky point (negative top) just enough.
// ---- Tentacles: size each column to its drawing so it runs the full section height ----
// The drawing keeps its proportions (never cropped). Its column is as wide as the drawing
// needs to be as tall as the section, as long as the text keeps a comfortable width.
function sizeArt() {
  document.querySelectorAll(".service").forEach((s) => {
    s.style.removeProperty("--cell-w");
    if (innerWidth <= 760) return;              // phones: tentacle sits under the text (CSS)
    const img = s.querySelector(".art img");
    const ratio = (+img.getAttribute("width") / +img.getAttribute("height")) || 1;   // drawing proportions (HTML attributes)
    const W = s.clientWidth;
    const minText = Math.min(860, W * 0.6);
    for (let i = 0; i < 3; i++) {               // a few passes: column width changes the text height
      const needed = s.offsetHeight * 0.97 * ratio / 0.96 + 8;   // matches the .art insets
      const cell = Math.max(220, Math.min(W - minText, needed));
      s.style.setProperty("--cell-w", `${Math.round(cell)}px`);
    }
  });
}

const stackSections = document.querySelectorAll(".stack > .stack-item");
function fitStack() {
  const step = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--stack-step")) || 0;
  stackSections.forEach((sec) => {
    const i = parseFloat(sec.style.getPropertyValue("--stack")) || 0;
    const wanted = i * step;
    const room = window.innerHeight - sec.offsetHeight;
    sec.style.top = room < wanted ? `${room}px` : "";
  });
}
const relayout = () => { sizeArt(); fitStack(); };
relayout();
window.addEventListener("resize", relayout);
window.addEventListener("load", relayout); // fonts/images can change heights
document.addEventListener("languagechange", relayout); // French text is longer

// ---- Fade-up reveal on scroll ----
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal, .art, .founder-reveal").forEach((el) => io.observe(el));

// ---- Founder portrait: gentle parallax drift while scrolling past ----
const parallaxImgs = document.querySelectorAll("[data-parallax]");
if (parallaxImgs.length && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  let ticking = false;
  const update = () => {
    parallaxImgs.forEach((img) => {
      const r = img.parentElement.getBoundingClientRect();
      const progress = (r.top + r.height / 2) / (innerHeight + r.height) - 0.5; // -0.5 … 0.5
      img.style.transform = `translateY(${(-progress * 10 - 5).toFixed(2)}%)`;
    });
    ticking = false;
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
}

// ---- Contact form: send without leaving the page ----
// Without JS the form still works: it posts to Web3Forms and shows their thank-you page.
document.querySelectorAll("[data-contact-form]").forEach((form) => {
  const status = form.querySelector(".form-status");
  const button = form.querySelector('button[type="submit"]');
  const t = (key, fallback) => (window.i18n ? window.i18n.t(key) : fallback);
  const show = (msg, kind) => { status.textContent = msg; status.className = `form-status is-${kind}`; };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (form.access_key.value.includes("YOUR_ACCESS_KEY")) {
      show(t("contact.unconfigured", "Form not configured yet: add the Web3Forms access key in index.html."), "error");
      return;
    }
    button.disabled = true;
    show(t("contact.sending", "Sending…"), "pending");
    try {
      const res = await fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Request failed");
      form.reset();
      show(t("contact.ok", "Thanks! Your message has been sent."), "ok");
    } catch (err) {
      show(t("contact.error", "Sorry, something went wrong. Please email us directly at alcarasproduction@gmail.com."), "error");
    } finally {
      button.disabled = false;
    }
  });
});

// ---- Footer year ----
document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
