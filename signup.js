const APPS_SCRIPT_WEB_APP_URL = "";

const form = document.getElementById("waitlist-form");
const statusEl = document.getElementById("form-status");

if (form && statusEl) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    const walletAddress = String(formData.get("walletAddress") || "").trim();
    const twitterHandle = String(formData.get("twitterHandle") || "").trim();

    if (!walletAddress || !twitterHandle) {
      statusEl.textContent = "Please complete both fields.";
      statusEl.dataset.state = "error";
      return;
    }

    if (!APPS_SCRIPT_WEB_APP_URL) {
      statusEl.textContent =
        "Submission endpoint is not configured yet. Add your Google Apps Script Web App URL in signup.js.";
      statusEl.dataset.state = "error";
      return;
    }

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Submitting...";
    }

    statusEl.textContent = "";
    statusEl.dataset.state = "";

    try {
      const response = await fetch(APPS_SCRIPT_WEB_APP_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress,
          twitterHandle,
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      form.reset();
      statusEl.textContent = "Thanks. You are on the waitlist.";
      statusEl.dataset.state = "success";
    } catch (error) {
      console.error(error);
      statusEl.textContent = "Submission failed. Please try again.";
      statusEl.dataset.state = "error";
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Sign up";
      }
    }
  });
}
