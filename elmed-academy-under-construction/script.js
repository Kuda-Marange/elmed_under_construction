/* =============================================
   ELMED Online Academy — Under Construction Page
   ============================================= */

(function () {
  "use strict";

  const form = document.getElementById("signup-form");
  const submitBtn = document.getElementById("submit-btn");
  const emailInput = document.getElementById("email");
  const successMsg = document.getElementById("success-message");

  if (!form || !submitBtn || !emailInput || !successMsg) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Basic validation — rely on native HTML5 validation
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Disable button and show loading state
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
      // Silently absorb errors — submission will still show success
    }

    // Replace form with success message
    form.querySelector(".form-row").classList.add("hidden");
    submitBtn.classList.add("hidden");
    successMsg.classList.remove("hidden");
  });
})();