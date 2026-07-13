/* =====================================================================
   ALMA — units.js
   Available Units page: data, rendering, sorting, video modal, Apply
   (mailto) and Book a tour (Calendly). Vanilla JS, progressive
   enhancement. Motion is transform/opacity only and reduced-motion safe.
   ===================================================================== */
(function () {
  "use strict";

  /* ------------------------------------------------------------------
     DATA — edit these lists as availability changes.
     videoId = the part after "/embed/" (or "v=") in the YouTube URL;
     the card thumbnail and in-page player activate automatically.
     UNITS_STANDARD = regular leases. UNITS_SHORT = short-term, min 4 months.
     ------------------------------------------------------------------ */
  var UNITS_STANDARD = [
    { num: 553, rent: 1694, videoId: "asOgn4Gsgzs" },
    { num: 365, rent: 1841, videoId: "6ZWoaPv2iuM" },
    { num: 672, rent: 1891, videoId: "euMLwF_natU" },
    { num: 361, rent: 1950, videoId: "MOkXb2JNf2o" },
    { num: 364, rent: 1995, videoId: "8OgAuV5E0AM" }
  ];
  var UNITS_SHORT = [
    { num: 256, rent: 1757, videoId: "9ky6iQ1oBow" },
    { num: 571, rent: 2041, videoId: "8hyo_6ry4wU" }
  ];
  var UNITS = UNITS_STANDARD.concat(UNITS_SHORT); // combined, for currency + schema

  var CALENDLY_URL = "https://calendly.com/basepointpm/alma-gastown";
  var APPLY_EMAIL = "michael@basepointpm.com";

  /* ---- Currency ----------------------------------------------------- */
  // Prices are stored in CAD. Conversion works instantly with built-in fallback
  // rates, then refines with live rates (Frankfurter / ECB) when reachable.
  var CURRENCIES = ["CAD", "USD", "EUR", "GBP", "BRL", "KRW"]; // KRW = South Korea
  var activeCurrency = "CAD";
  // Approximate CAD -> currency multipliers; updated live on load when possible.
  var ratesCache = { CAD: 1, USD: 0.73, EUR: 0.67, GBP: 0.57, BRL: 3.95, KRW: 1010 };
  var ratesLive = false;

  function formatMoney(cadAmount, currency, rate) {
    var amount = cadAmount * (rate || 1);
    // en-US renders CAD as "CA$" (distinct from USD "$"), EUR/GBP/BRL/KRW as their symbols.
    return new Intl.NumberFormat("en-US", {
      style: "currency", currency: currency, maximumFractionDigits: 0
    }).format(amount);
  }

  function paintPrices(currency) {
    var rate = ratesCache[currency] || 1;
    document.querySelectorAll(".money").forEach(function (m) {
      m.textContent = formatMoney(Number(m.dataset.cad), currency, rate);
    });
    document.querySelectorAll(".currency-btn").forEach(function (b) {
      var on = b.dataset.currency === currency;
      b.classList.toggle("active", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  // Select + convert immediately (never blocked by the network).
  function changeCurrency(currency) {
    activeCurrency = currency;
    paintPrices(currency);
  }

  // Refresh live rates once; repaint if a converted currency is showing.
  function refreshRates() {
    if (ratesLive) return;
    var to = CURRENCIES.filter(function (c) { return c !== "CAD"; }).join(",");
    fetch("https://api.frankfurter.app/latest?from=CAD&to=" + to)
      .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
      .then(function (data) {
        if (data && data.rates) { for (var k in data.rates) ratesCache[k] = data.rates[k]; }
        ratesCache.CAD = 1; ratesLive = true;
        if (activeCurrency !== "CAD") paintPrices(activeCurrency);
      })
      .catch(function (err) { console.warn("Live FX rates unavailable, using estimates.", err); });
  }

  function applyHref(num) {
    var subject = "ALMA " + num + " - Rental Application";
    var body = "Hi Michael,\n\nI would like to apply for unit " + num +
      ", please let me know the next steps.";
    return "mailto:" + APPLY_EMAIL +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);
  }

  function escapeAttr(s) {
    return String(s).replace(/"/g, "&quot;");
  }

  /* ---- Sorting ------------------------------------------------------ */
  var SORTERS = {
    affordable: function (a, b) { return a.rent - b.rent; },
    highest: function (a, b) { return b.rent - a.rent; },
    unit: function (a, b) { return a.num - b.num; }
  };

  /* ---- Card markup -------------------------------------------------- */
  function cardHTML(u) {
    var hasVideo = !!u.videoId;
    var thumb = hasVideo
      ? 'style="background-image:url(https://img.youtube.com/vi/' + escapeAttr(u.videoId) + '/hqdefault.jpg)"'
      : "";

    var mediaInner = hasVideo
      ? '<button class="play-btn" data-video="' + escapeAttr(u.videoId) +
        '" data-unit="' + u.num + '" aria-label="Play walkthrough video for unit ' + u.num + '">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>' +
        "</button>"
      : "";

    var calendarSvg = '<svg viewBox="0 0 448 512" aria-hidden="true"><path d="M128 0c13.3 0 24 10.7 24 24V64H296V24c0-13.3 10.7-24 24-24s24 10.7 24 24V64h40c35.3 0 64 28.7 64 64v16 48V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V192 144 128C0 92.7 28.7 64 64 64h40V24c0-13.3 10.7-24 24-24zM400 192H48V448c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V192zM64 112c-8.8 0-16 7.2-16 16v16H400V128c0-8.8-7.2-16-16-16H64z"/></svg>';

    return '' +
      '<article class="unit-card reveal" aria-labelledby="unit-' + u.num + '-title">' +
        '<div class="unit-media" ' + thumb + ' role="img" aria-label="ALMA studio unit ' + u.num + '">' +
          mediaInner +
        "</div>" +
        '<div class="unit-body">' +
          '<h3 class="unit-name" id="unit-' + u.num + '-title">Unit ' + u.num + "</h3>" +
          '<p class="unit-price"><span class="money" data-cad="' + u.rent + '">' +
            formatMoney(u.rent, "CAD", 1) + '</span><span class="per"> / month</span></p>' +
          '<div class="unit-actions">' +
            '<a class="btn-apply" href="' + applyHref(u.num) + '"><span>Apply now</span></a>' +
            '<button class="btn-tour js-tour"><span class="text">Book a tour</span>' + calendarSvg + "</button>" +
          "</div>" +
        "</div>" +
      "</article>";
  }

  /* ---- Render ------------------------------------------------------- */
  var grid = document.getElementById("unit-grid");
  var shortGrid = document.getElementById("unit-grid-short");
  var status = document.getElementById("unit-status");
  var sortSelect = document.getElementById("sort");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function revealCards(gridEl) {
    var cards = gridEl.querySelectorAll(".reveal");
    if (reduceMotion) {
      cards.forEach(function (c) { c.classList.add("is-in"); });
    } else {
      cards.forEach(function (c, i) {
        c.style.setProperty("--d", (i * 45) + "ms");
        requestAnimationFrame(function () { requestAnimationFrame(function () { c.classList.add("is-in"); }); });
      });
    }
  }

  function render(sortKey) {
    if (!grid) return;
    var list = UNITS_STANDARD.slice().sort(SORTERS[sortKey] || SORTERS.affordable);
    grid.innerHTML = list.map(cardHTML).join("");

    if (status) {
      var labels = { affordable: "most affordable first", highest: "highest price first", unit: "by unit number" };
      status.textContent = list.length + " studios available, sorted " + (labels[sortKey] || labels.affordable) + ".";
    }
    revealCards(grid);

    // Keep the selected currency after a re-sort (spans were rebuilt).
    if (activeCurrency !== "CAD") paintPrices(activeCurrency);
  }

  function renderShort() {
    if (!shortGrid) return;
    var list = UNITS_SHORT.slice().sort(SORTERS.affordable);
    shortGrid.innerHTML = list.map(cardHTML).join("");
    revealCards(shortGrid);
    if (activeCurrency !== "CAD") paintPrices(activeCurrency);
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", function () { render(sortSelect.value); });
  }
  render(sortSelect ? sortSelect.value : "affordable");
  renderShort();

  /* ---- Currency switcher wiring ------------------------------------- */
  document.querySelectorAll(".currency-btn").forEach(function (btn) {
    btn.addEventListener("click", function () { changeCurrency(btn.dataset.currency); });
  });
  refreshRates(); // upgrade fallback estimates to live rates when reachable

  /* ---- SEO: inject ItemList JSON-LD from the same data (no drift) ---- */
  (function injectSchema() {
    var items = UNITS.slice().sort(SORTERS.affordable).map(function (u, i) {
      return {
        "@type": "Offer",
        "position": i + 1,
        "name": "ALMA Studio Unit " + u.num,
        "category": "Studio apartment",
        "price": u.rent.toFixed(2),
        "priceCurrency": "CAD",
        "businessFunction": "http://purl.org/goodrelations/v1#LeaseOut",
        "availability": "https://schema.org/InStock",
        "areaServed": "Gastown, Vancouver, BC"
      };
    });
    var data = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "ALMA available studios in Gastown, Vancouver",
      "numberOfItems": items.length,
      "itemListElement": items
    };
    var s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(data);
    document.head.appendChild(s);
  })();

  /* ---- Calendly (event delegation) ---------------------------------- */
  document.addEventListener("click", function (e) {
    var tour = e.target.closest && e.target.closest(".js-tour");
    if (!tour) return;
    e.preventDefault();
    if (window.Calendly && typeof window.Calendly.initPopupWidget === "function") {
      window.Calendly.initPopupWidget({ url: CALENDLY_URL });
    } else {
      // Fallback if the widget script is blocked/unloaded.
      window.open(CALENDLY_URL, "_blank", "noopener");
    }
  });

  /* ---- Video modal (event delegation) ------------------------------- */
  var modal = document.getElementById("video-modal");
  var modalFrame = document.getElementById("video-frame");
  var lastFocused = null;

  function openVideo(videoId, unit) {
    if (!modal || !modalFrame || !videoId) return;
    lastFocused = document.activeElement;

    // Build the embed URL. Adding &origin only on http(s) avoids the "null"
    // origin you get from file:// (which itself triggers YouTube Error 153).
    var origin = window.location.origin;
    var src = "https://www.youtube.com/embed/" + encodeURIComponent(videoId) +
      "?autoplay=1&rel=0&playsinline=1&modestbranding=1" +
      (origin && origin.indexOf("http") === 0 ? "&origin=" + encodeURIComponent(origin) : "");

    var iframe = document.createElement("iframe");
    iframe.src = src;
    iframe.title = "ALMA unit " + (unit || "") + " walkthrough";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = "strict-origin-when-cross-origin"; // fix for YouTube Error 153
    modalFrame.innerHTML = "";
    modalFrame.appendChild(iframe);

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    var closeBtn = modal.querySelector(".modal-close");
    if (closeBtn) closeBtn.focus();
  }

  function closeVideo() {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    if (modalFrame) modalFrame.innerHTML = ""; // stops playback
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  document.addEventListener("click", function (e) {
    var play = e.target.closest && e.target.closest(".play-btn");
    if (play) {
      e.preventDefault();
      openVideo(play.getAttribute("data-video"), play.getAttribute("data-unit"));
      return;
    }
    if (e.target.closest && e.target.closest("[data-close-modal]")) {
      e.preventDefault();
      closeVideo();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (!modal || !modal.classList.contains("is-open")) return;
    if (e.key === "Escape") { closeVideo(); return; }
    // Simple focus trap between the close button and the dialog.
    if (e.key === "Tab") {
      var focusables = modal.querySelectorAll("button, iframe, [href]");
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
})();
