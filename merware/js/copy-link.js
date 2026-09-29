(function () {
  "use strict";

  const scriptUrl = document.currentScript.src;
  const iconUrl = new URL("../resources/icons/copyLink.png", scriptUrl).href;

  async function writeClipboardText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return;
      } catch {
        // Fall through to the selection-based copy for restricted contexts.
      }
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();

    if (!copied) {
      throw new Error("Clipboard copy failed.");
    }
  }

  function createButton(getText) {
    const control = document.createElement("span");
    control.className = "copy-link-control";

    const button = document.createElement("button");
    button.className = "copy-link-button";
    button.type = "button";
    button.setAttribute("aria-label", "Copy link");
    button.title = "Copy link";

    const icon = document.createElement("img");
    icon.src = iconUrl;
    icon.alt = "";
    icon.setAttribute("aria-hidden", "true");
    button.append(icon);

    const status = document.createElement("span");
    status.className = "copy-link-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");

    let resetTimer;
    button.addEventListener("click", async function () {
      button.disabled = true;
      try {
        await writeClipboardText(getText());
        button.dataset.copyState = "copied";
        status.textContent = "Link copied to clipboard.";
        button.title = "Copied";
      } catch {
        button.dataset.copyState = "error";
        status.textContent = "Unable to copy link.";
        button.title = "Copy failed";
      }

      window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(function () {
        delete button.dataset.copyState;
        status.textContent = "";
        button.title = "Copy link";
        button.disabled = false;
      }, 1600);
    });

    control.append(button, status);
    return control;
  }

  window.MerWareCopyLink = { createButton };
})();
