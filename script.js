/* =============================================
   ELMED Online Academy — Under Construction Page
   ============================================= */

(function () {
  "use strict";

  // ---- Initialize Lucide icons (shadcn/ui uses Lucide) ----
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  // ---- Dark / Light Mode Toggle ----
  (function initTheme() {
    const toggle = document.getElementById("theme-toggle");
    if (!toggle) return;

    const STORAGE_KEY = "elmed-theme";

    // Determine initial theme
    function getPreferredTheme() {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "light" || stored === "dark") return stored;
      return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    }

    function setTheme(theme) {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem(STORAGE_KEY, theme);
    }

    // Apply theme without transition on first load
    setTheme(getPreferredTheme());

    // Smooth transition class for subsequent toggles
    let transitionTimeout;
    function toggleTheme() {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      const next = current === "dark" ? "light" : "dark";

      document.documentElement.classList.add("theme-transitioning");
      clearTimeout(transitionTimeout);
      transitionTimeout = setTimeout(() => {
        document.documentElement.classList.remove("theme-transitioning");
      }, 400);

      setTheme(next);
    }

    toggle.addEventListener("click", toggleTheme);
  })();

  // ---- Countdown Timer ----
  // FIX: launchDate is now a FIXED date instead of "today + 60 days"
  // (previously it recalculated on every page load, so the countdown
  // never actually counted down — it just reset to ~60 days each visit).
  // Set this to your real launch date/time.
  const launchDate = new Date("2026-09-04T00:00:00");

  const countdownDays = document.getElementById("countdown-days");
  const countdownHours = document.getElementById("countdown-hours");
  const countdownMinutes = document.getElementById("countdown-minutes");
  const countdownSeconds = document.getElementById("countdown-seconds");

  let countdownInterval;

  function updateCountdown() {
    const now = new Date();
    const diff = launchDate.getTime() - now.getTime();

    if (diff <= 0) {
      const countdownEl = document.getElementById("countdown");
      if (countdownEl) countdownEl.classList.add("hidden");
      clearInterval(countdownInterval); // FIX: stop the timer once launch has passed
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (countdownDays) countdownDays.textContent = String(days).padStart(2, "0");
    if (countdownHours) countdownHours.textContent = String(hours).padStart(2, "0");
    if (countdownMinutes) countdownMinutes.textContent = String(minutes).padStart(2, "0");
    if (countdownSeconds) countdownSeconds.textContent = String(seconds).padStart(2, "0");
  }

  updateCountdown();
  countdownInterval = setInterval(updateCountdown, 1000);

  // ---- Email Signup Form ----
  const form = document.getElementById("signup-form");
  const submitBtn = document.getElementById("submit-btn");
  const emailInput = document.getElementById("email");
  const successMsg = document.getElementById("success-message");
  const emailError = document.getElementById("email-error");
  const consentCheckbox = document.getElementById("consent-checkbox");

  if (!form || !submitBtn || !emailInput || !successMsg || !emailError || !consentCheckbox) return;

  function validateEmail(value) {
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      return { valid: false, message: "" };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return { valid: false, message: "Please enter a valid email address" };
    }
    return { valid: true, message: "" };
  }

  function showError(message) {
    if (message) {
      emailError.textContent = message;
      emailError.classList.add("is-visible");
      emailInput.classList.add("input-error-state");
    } else {
      emailError.textContent = "";
      emailError.classList.remove("is-visible");
      emailInput.classList.remove("input-error-state");
    }
  }

  emailInput.addEventListener("input", function () {
    const result = validateEmail(this.value);
    if (this.value.trim().length > 0) {
      showError(result.valid ? "" : result.message);
    } else {
      showError("");
    }
  });

  emailInput.addEventListener("blur", function () {
    const result = validateEmail(this.value);
    if (this.value.trim().length > 0 && !result.valid) {
      showError(result.message);
    } else {
      showError("");
    }
  });

  const consentError = document.createElement("span");
  consentError.className = "input-error";
  consentError.id = "consent-error";
  consentError.setAttribute("aria-live", "polite");
  consentCheckbox.closest(".consent-label").after(consentError);

  function showConsentError(message) {
    if (message) {
      consentError.textContent = message;
      consentError.classList.add("is-visible");
    } else {
      consentError.textContent = "";
      consentError.classList.remove("is-visible");
    }
  }

  consentCheckbox.addEventListener("change", function () {
    if (this.checked) {
      showConsentError("");
    }
  });

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const emailResult = validateEmail(emailInput.value);
    if (!emailResult.valid) {
      showError(emailResult.message || "Please enter your email address");
      emailInput.focus();
      return;
    }

    if (!consentCheckbox.checked) {
      showConsentError("You must agree to the Privacy Policy to continue.");
      consentCheckbox.focus();
      return;
    }

    showError("");
    showConsentError("");

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending\u2026";

    const email = emailInput.value.trim();

    try {
      await fetch("https://formspree.io/f/xrewogzv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email }),
      });
    } catch {
      // Silently absorb errors
    }

    form.querySelector(".form-row").classList.add("hidden");
    form.querySelector(".consent-row").classList.add("hidden");
    submitBtn.classList.add("hidden");
    successMsg.classList.remove("hidden");
  });
})();
