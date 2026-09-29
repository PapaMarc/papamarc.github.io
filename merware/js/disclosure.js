(function () {
  "use strict";

  function getPanel(button) {
    return document.getElementById(button.getAttribute("aria-controls"));
  }

  function getRenderedLines(element) {
    const lines = [];
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    let textNode = walker.nextNode();

    while (textNode) {
      if (textNode.textContent.trim()) {
        const range = document.createRange();
        range.selectNodeContents(textNode);
        for (const rect of range.getClientRects()) {
          if (!rect.width || !rect.height) continue;

          const line = lines.find((candidate) => Math.abs(candidate.top - rect.top) < 1.5);
          if (line) {
            line.bottom = Math.max(line.bottom, rect.bottom);
          } else {
            lines.push({ top: rect.top, bottom: rect.bottom });
          }
        }
      }
      textNode = walker.nextNode();
    }

    return lines.sort((left, right) => left.top - right.top);
  }

  function getCollapsedHeight(panel, lineLimit) {
    const panelTop = panel.getBoundingClientRect().top;
    const lines = getRenderedLines(panel);
    if (lines.length <= lineLimit) return null;
    return Math.ceil(lines[lineLimit - 1].bottom - panelTop);
  }

  function updateLineLimitedPanel(button) {
    if (button.getAttribute("aria-expanded") === "true") return;

    const panel = getPanel(button);
    if (!panel) return;

    panel.style.maxHeight = "none";
    const collapsedHeight = getCollapsedHeight(panel, Number(button.dataset.disclosureLines));
    if (collapsedHeight === null) {
      button.hidden = true;
      delete panel.dataset.disclosureCollapsedHeight;
      return;
    }

    button.hidden = false;
    panel.dataset.disclosureCollapsedHeight = String(collapsedHeight);
    panel.style.maxHeight = `${collapsedHeight}px`;
  }

  function setButtonState(button, expanded) {
    button.setAttribute("aria-expanded", String(expanded));
    button.textContent = expanded ? "−" : "+";
    const label = button.dataset.disclosureLabel || "details";
    button.setAttribute("aria-label", `${expanded ? "Collapse" : "Expand"} ${label}`);
  }

  function togglePanel(button) {
    const panel = getPanel(button);
    if (!panel) return;

    const expanded = button.getAttribute("aria-expanded") === "true";
    const isLineLimited = button.dataset.disclosureLines !== undefined;
    setButtonState(button, !expanded);

    function finishTransition(event) {
      if (event.target !== panel || event.propertyName !== "max-height") return;
      panel.removeEventListener("transitionend", finishTransition);
      if (button.getAttribute("aria-expanded") !== String(!expanded)) return;

      if (!expanded) {
        panel.style.maxHeight = "none";
      } else if (!isLineLimited) {
        panel.hidden = true;
        panel.classList.remove("show");
      }
    }

    panel.addEventListener("transitionend", finishTransition);
    if (expanded) {
      panel.style.maxHeight = `${panel.scrollHeight}px`;
      void panel.offsetHeight;
      if (isLineLimited) {
        const collapsedHeight = getCollapsedHeight(panel, Number(button.dataset.disclosureLines));
        if (collapsedHeight === null) {
          button.hidden = true;
          panel.style.maxHeight = "none";
          panel.removeEventListener("transitionend", finishTransition);
          return;
        }
        panel.dataset.disclosureCollapsedHeight = String(collapsedHeight);
        panel.style.maxHeight = `${collapsedHeight}px`;
      } else {
        panel.style.maxHeight = "0px";
      }
    } else {
      panel.hidden = false;
      panel.classList.add("show");
      const currentHeight = panel.getBoundingClientRect().height;
      panel.style.maxHeight = `${currentHeight}px`;
      void panel.offsetHeight;
      panel.style.maxHeight = `${panel.scrollHeight}px`;
    }
  }

  function init() {
    document.addEventListener("click", function (event) {
      const button = event.target.closest(".disclosure-toggle");
      if (button) togglePanel(button);
    });

    window.addEventListener("resize", function () {
      document.querySelectorAll(".disclosure-toggle[data-disclosure-lines]")
        .forEach(updateLineLimitedPanel);
    });
  }

  function enhanceByLines(panel, button, lineLimit) {
    button.dataset.disclosureLines = String(lineLimit);
    button.dataset.disclosureLabel = "reaction";
    setButtonState(button, false);
    updateLineLimitedPanel(button);
  }

  window.MerWareDisclosure = { enhanceByLines, init };
})();