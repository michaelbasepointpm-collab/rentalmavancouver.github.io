/* =====================================================================
   ALMA — main.js
   Progressive enhancement only. The page is fully usable with JS off.
   All motion respects prefers-reduced-motion and animates transform/
   opacity only (Emil rules). Pointer-fine checks keep effects off touch.
   ===================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;

  /* ---- Current year in footer ---------------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---- Mobile nav ---------------------------------------------------- */
  var toggle = document.querySelector(".nav-toggle");
  var body = document.body;
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    // Close after choosing a destination or pressing Escape.
    document.querySelectorAll(".nav-mobile a").forEach(function (a) {
      a.addEventListener("click", closeNav);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && body.classList.contains("nav-open")) closeNav();
    });
  }
  function closeNav() {
    body.classList.remove("nav-open");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    }
  }

  /* ---- Reveal on scroll (IntersectionObserver) ----------------------- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });

    // Stagger children of [data-stagger] via a per-item delay.
    document.querySelectorAll("[data-stagger]").forEach(function (group) {
      Array.prototype.forEach.call(group.children, function (child, i) {
        child.style.setProperty("--d", (i * 70) + "ms");
      });
    });
  }

  /* ---- Hero parallax (rAF-throttled, transform only) ----------------- */
  var parallaxEls = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  if (!reduceMotion && parallaxEls.length) {
    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        var y = window.pageYOffset;
        parallaxEls.forEach(function (el) {
          var speed = parseFloat(el.getAttribute("data-parallax")) || 0.15;
          el.style.transform = "translate3d(0," + (y * speed).toFixed(1) + "px,0)";
        });
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---- Magnetic buttons (pointer-fine only) -------------------------- */
  if (finePointer && !reduceMotion) {
    var STRENGTH = 0.35;   // how far the element follows the cursor
    var MAX = 14;          // px clamp so it stays subtle
    document.querySelectorAll(".magnetic").forEach(function (wrap) {
      wrap.addEventListener("pointermove", function (e) {
        var r = wrap.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) * STRENGTH;
        var dy = (e.clientY - (r.top + r.height / 2)) * STRENGTH;
        dx = Math.max(-MAX, Math.min(MAX, dx));
        dy = Math.max(-MAX, Math.min(MAX, dy));
        wrap.style.transition = "transform 60ms cubic-bezier(0.22,1,0.36,1)";
        wrap.style.transform = "translate3d(" + dx + "px," + dy + "px,0)";
      });
      wrap.addEventListener("pointerleave", function () {
        wrap.style.transition = "transform 320ms cubic-bezier(0.22,1,0.36,1)";
        wrap.style.transform = "translate3d(0,0,0)";
      });
    });
  }
})();
