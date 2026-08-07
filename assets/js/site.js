/*!
 * Shova Rani — site.js
 * Minimal, dependency-free progressive enhancement.
 * Sections: theme toggle, mobile nav drawer, scroll-spy, abstract modal,
 * citation copy, gallery lightbox, click-to-play video, award filters.
 */
(function () {
  "use strict";

  /* ---------------- Theme toggle ---------------- */
  var root = document.documentElement;
  var themeBtn = document.querySelector("[data-theme-toggle]");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var current = root.getAttribute("data-theme");
      var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      var isDark = current ? current === "dark" : prefersDark;
      var next = isDark ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      themeBtn.setAttribute("aria-pressed", String(next === "dark"));
    });
  }

  /* ---------------- Mobile nav drawer ---------------- */
  var navToggle = document.querySelector("[data-nav-toggle]");
  var drawer = document.querySelector("[data-nav-drawer]");
  if (navToggle && drawer) {
    var closeBtn = drawer.querySelector("[data-nav-close]");
    var backdrop = drawer.querySelector("[data-nav-backdrop]");
    var links = drawer.querySelectorAll("a");

    function openDrawer() {
      drawer.setAttribute("data-open", "true");
      navToggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
      if (closeBtn) closeBtn.focus();
      document.addEventListener("keydown", onKeydown);
    }
    function closeDrawer() {
      drawer.setAttribute("data-open", "false");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      navToggle.focus();
      document.removeEventListener("keydown", onKeydown);
    }
    function onKeydown(e) {
      if (e.key === "Escape") closeDrawer();
    }
    navToggle.addEventListener("click", openDrawer);
    if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
    if (backdrop) backdrop.addEventListener("click", closeDrawer);
    links.forEach(function (a) { a.addEventListener("click", closeDrawer); });
  }

  /* ---------------- Scroll-spy ---------------- */
  var navLinks = document.querySelectorAll(".nav-list a[href^='#'], .nav-list a[href*='index.html#']");
  var sections = [];
  navLinks.forEach(function (a) {
    var id = a.getAttribute("href").split("#")[1];
    var el = id && document.getElementById(id);
    if (el) sections.push({ id: id, el: el, link: a });
  });
  if (sections.length && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var match = sections.find(function (s) { return s.el === entry.target; });
          if (!match) return;
          if (entry.isIntersecting) {
            navLinks.forEach(function (a) { a.removeAttribute("aria-current"); });
            match.link.setAttribute("aria-current", "true");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) { observer.observe(s.el); });
  }

  /* ---------------- Abstract / info modal ---------------- */
  document.querySelectorAll("[data-open-modal]").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      var id = trigger.getAttribute("data-open-modal");
      var dialog = document.getElementById(id);
      if (dialog && typeof dialog.showModal === "function") {
        dialog.showModal();
      }
    });
  });
  document.querySelectorAll("dialog.modal").forEach(function (dialog) {
    var closeEls = dialog.querySelectorAll("[data-close-modal]");
    closeEls.forEach(function (el) {
      el.addEventListener("click", function () { dialog.close(); });
    });
    dialog.addEventListener("click", function (e) {
      var rect = dialog.getBoundingClientRect();
      var inside =
        rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX && e.clientX <= rect.left + rect.width;
      if (!inside) dialog.close();
    });
  });

  /* ---------------- Citation copy ---------------- */
  document.querySelectorAll("[data-copy-cite]").forEach(function (btn) {
    var originalLabel = btn.textContent;
    btn.addEventListener("click", function () {
      var targetId = btn.getAttribute("data-copy-cite");
      var src = document.getElementById(targetId);
      if (!src) return;
      var text = src.textContent.trim();
      var done = function () {
        btn.textContent = "Copied";
        btn.setAttribute("aria-live", "polite");
        setTimeout(function () { btn.textContent = originalLabel; }, 1500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, done);
      } else {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); } catch (e) {}
        document.body.removeChild(ta);
        done();
      }
    });
  });

  /* ---------------- Award filter chips ---------------- */
  var chips = document.querySelectorAll("[data-filter-chip]");
  var awardItems = document.querySelectorAll("[data-award-cat]");
  if (chips.length && awardItems.length) {
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
        chip.setAttribute("aria-pressed", "true");
        var cat = chip.getAttribute("data-filter-chip");
        awardItems.forEach(function (item) {
          var itemCats = (item.getAttribute("data-award-cat") || "").split(" ");
          if (cat === "all" || itemCats.indexOf(cat) !== -1) {
            item.removeAttribute("hidden");
          } else {
            item.setAttribute("hidden", "");
          }
        });
      });
    });
  }

  /* ---------------- Gallery lightbox (gallery.html) ---------------- */
  var lightbox = document.getElementById("lightbox");
  if (lightbox) {
    var lbImg = lightbox.querySelector("[data-lb-img]");
    var lbCaption = lightbox.querySelector("[data-lb-caption]");
    var galleryButtons = Array.prototype.slice.call(document.querySelectorAll("[data-lb-open]"));
    var currentIndex = -1;

    function showAt(index) {
      if (index < 0 || index >= galleryButtons.length) return;
      currentIndex = index;
      var btn = galleryButtons[index];
      var full = btn.getAttribute("data-full") || btn.querySelector("img").src;
      var caption = btn.getAttribute("data-caption") || "";
      lbImg.src = full;
      lbImg.alt = btn.querySelector("img") ? btn.querySelector("img").alt : "";
      lbCaption.textContent = caption;
    }

    galleryButtons.forEach(function (btn, i) {
      btn.addEventListener("click", function () {
        showAt(i);
        if (typeof lightbox.showModal === "function") lightbox.showModal();
      });
    });

    lightbox.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") showAt((currentIndex + 1) % galleryButtons.length);
      if (e.key === "ArrowLeft") showAt((currentIndex - 1 + galleryButtons.length) % galleryButtons.length);
    });

    var closeEls = lightbox.querySelectorAll("[data-close-modal]");
    closeEls.forEach(function (el) { el.addEventListener("click", function () { lightbox.close(); }); });
    lightbox.addEventListener("click", function (e) {
      var rect = lightbox.getBoundingClientRect();
      var inside =
        rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX && e.clientX <= rect.left + rect.width;
      if (!inside) lightbox.close();
    });

    /* basic touch swipe */
    var touchStartX = null;
    lightbox.addEventListener("touchstart", function (e) { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    lightbox.addEventListener("touchend", function (e) {
      if (touchStartX === null) return;
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) {
        if (dx < 0) showAt((currentIndex + 1) % galleryButtons.length);
        else showAt((currentIndex - 1 + galleryButtons.length) % galleryButtons.length);
      }
      touchStartX = null;
    }, { passive: true });
  }

  /* ---------------- Obfuscated email reassembly ---------------- */
  document.querySelectorAll("[data-email-user]").forEach(function (el) {
    var user = el.getAttribute("data-email-user");
    var domain = el.getAttribute("data-email-domain");
    if (!user || !domain) return;
    var address = user + "@" + domain;
    el.textContent = address;
    if (el.tagName === "A") el.setAttribute("href", "mailto:" + address);
  });

  /* ---------------- Footer year ---------------- */
  var yearEl = document.querySelector("[data-current-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
