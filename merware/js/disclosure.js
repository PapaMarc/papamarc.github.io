(function () {
  "use strict";

  const inlineDisclosureStates = new Map();

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

          const line = lines.find(
            (candidate) => Math.abs(candidate.top - rect.top) < 1.5,
          );
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

  function getTextNodes(element) {
    const nodes = [];
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    let textNode = walker.nextNode();
    while (textNode) {
      if (textNode.textContent.length) nodes.push(textNode);
      textNode = walker.nextNode();
    }
    return nodes;
  }

  function getRangeRects(textNode, endOffset) {
    const range = document.createRange();
    range.setStart(textNode, 0);
    range.setEnd(textNode, endOffset);
    return Array.from(range.getClientRects());
  }

  function findCutPosition(panel, lineLimit) {
    const lines = getRenderedLines(panel);
    if (lines.length <= lineLimit) return null;

    const targetTop = lines[lineLimit - 1].top;
    let candidate = null;
    const textNodes = getTextNodes(panel);
    for (let nodeIndex = 0; nodeIndex < textNodes.length; nodeIndex++) {
      const textNode = textNodes[nodeIndex];
      const textLength = textNode.textContent.length;
      const rects = textLength ? getRangeRects(textNode, textLength) : [];
      if (!rects.length) continue;

      if (rects[0].top > targetTop + 1.5) break;
      const lastTop = rects[rects.length - 1].top;
      if (lastTop > targetTop + 1.5) {
        let low = 0;
        let high = textLength;
        while (low < high) {
          const middle = Math.ceil((low + high) / 2);
          const prefixRects = getRangeRects(textNode, middle);
          const prefixLastTop = prefixRects[prefixRects.length - 1]?.top;
          if (prefixLastTop !== undefined && prefixLastTop <= targetTop + 1.5) {
            low = middle;
          } else {
            high = middle - 1;
          }
        }
        if (low > 0) {
          candidate = { node: textNode, nodeIndex, offset: low, targetTop };
        }
        break;
      }

      candidate = { node: textNode, nodeIndex, offset: textLength, targetTop };
    }

    return candidate;
  }

  function findEarlierCutPosition(panel, cutPosition) {
    const textNodes = getTextNodes(panel);
    const node = textNodes[cutPosition.nodeIndex];
    if (!node) return null;

    const prefix = node.textContent.slice(0, cutPosition.offset);
    const wordStart = prefix.lastIndexOf(" ");
    if (wordStart > 0) {
      return { ...cutPosition, node, offset: wordStart };
    }

    const previousIndex = cutPosition.nodeIndex - 1;
    const previousNode = textNodes[previousIndex];
    return previousNode
      ? {
          ...cutPosition,
          node: previousNode,
          nodeIndex: previousIndex,
          offset: previousNode.textContent.length,
        }
      : null;
  }

  function insertInlineMarker(panel, button, cutPosition) {
    const marker = document.createElement("span");
    marker.className = "disclosure-inline-marker";

    const ellipsis = document.createElement("span");
    ellipsis.textContent = "…";
    ellipsis.setAttribute("aria-hidden", "true");
    marker.append(ellipsis, button);

    const range = document.createRange();
    range.setStart(cutPosition.node, cutPosition.offset);
    range.collapse(true);
    range.insertNode(marker);

    const block = marker.parentElement.closest("p, li");
    if (!block) {
      marker.remove();
      return null;
    }

    const inlineContinuation = document.createElement("span");
    inlineContinuation.className = "disclosure-continuation";
    const inlineRange = document.createRange();
    inlineRange.setStartAfter(marker);
    inlineRange.setEnd(block, block.childNodes.length);
    inlineContinuation.append(inlineRange.extractContents());
    inlineContinuation.hidden = true;
    marker.parentNode.insertBefore(inlineContinuation, marker.nextSibling);

    const blockRoot = block.tagName === "LI" ? block.parentElement : block;
    let blockContinuation = null;
    if (block.tagName === "LI" && block.nextElementSibling) {
      blockContinuation = document.createElement("div");
      blockContinuation.className = "disclosure-continuation-blocks";
      const continuationList = block.parentElement.cloneNode(false);
      while (block.nextElementSibling) {
        continuationList.append(block.nextElementSibling);
      }
      blockContinuation.append(continuationList);
    }

    if (blockRoot.nextSibling) {
      if (!blockContinuation) {
        blockContinuation = document.createElement("div");
        blockContinuation.className = "disclosure-continuation-blocks";
      }
      while (blockRoot.nextSibling) {
        blockContinuation.append(blockRoot.nextSibling);
      }
      panel.insertBefore(blockContinuation, blockRoot.nextSibling);
    }

    if (blockContinuation) blockContinuation.hidden = true;
    const markerRect = marker.getBoundingClientRect();
    if (Math.abs(markerRect.top - cutPosition.targetTop) > 3) return null;

    return { marker, inlineContinuation, blockContinuation };
  }

  function rebuildInlineDisclosure(state) {
    const { panel, button, originalNodes, lineLimit } = state;
    const expanded = button.getAttribute("aria-expanded") === "true";
    panel.replaceChildren(...originalNodes.map((node) => node.cloneNode(true)));
    panel.style.maxHeight = "none";
    button.hidden = true;
    setButtonState(button, expanded);

    let cutPosition = findCutPosition(panel, lineLimit);
    if (!cutPosition) return;

    button.hidden = false;
    let inserted = null;
    while (cutPosition) {
      inserted = insertInlineMarker(panel, button, cutPosition);
      if (inserted) break;
      panel.replaceChildren(
        ...originalNodes.map((node) => node.cloneNode(true)),
      );
      cutPosition = findEarlierCutPosition(panel, cutPosition);
    }

    if (!inserted) {
      panel.replaceChildren(
        ...originalNodes.map((node) => node.cloneNode(true)),
      );
      button.hidden = true;
      return;
    }

    state.inlineContinuation = inserted.inlineContinuation;
    state.blockContinuation = inserted.blockContinuation;
    inserted.inlineContinuation.hidden = !expanded;
    if (inserted.blockContinuation) {
      inserted.blockContinuation.hidden = !expanded;
    }
  }

  function updateLineLimitedPanel(button) {
    if (button.getAttribute("aria-expanded") === "true") return;

    const panel = getPanel(button);
    if (!panel) return;

    panel.style.maxHeight = "none";
    const collapsedHeight = getCollapsedHeight(
      panel,
      Number(button.dataset.disclosureLines),
    );
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
    button.setAttribute(
      "aria-label",
      `${expanded ? "Collapse" : "Expand"} ${label}`,
    );
  }

  function togglePanel(button) {
    const panel = getPanel(button);
    if (!panel) return;

    const expanded = button.getAttribute("aria-expanded") === "true";
    setButtonState(button, !expanded);

    const inlineState = inlineDisclosureStates.get(button);
    if (inlineState) {
      inlineState.inlineContinuation.hidden = expanded;
      if (inlineState.blockContinuation) {
        inlineState.blockContinuation.hidden = expanded;
      }
      return;
    }

    function finishTransition(event) {
      if (event.target !== panel || event.propertyName !== "max-height") return;
      panel.removeEventListener("transitionend", finishTransition);
      if (button.getAttribute("aria-expanded") !== String(!expanded)) return;

      if (!expanded) {
        panel.style.maxHeight = "none";
      } else {
        panel.hidden = true;
        panel.classList.remove("show");
      }
    }

    panel.addEventListener("transitionend", finishTransition);
    if (expanded) {
      panel.style.maxHeight = `${panel.scrollHeight}px`;
      void panel.offsetHeight;
      panel.style.maxHeight = "0px";
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
      inlineDisclosureStates.forEach(rebuildInlineDisclosure);
    });
  }

  function enhanceByLines(panel, button, lineLimit) {
    button.dataset.disclosureLines = String(lineLimit);
    button.dataset.disclosureLabel = "reaction";
    setButtonState(button, false);
    const state = {
      panel,
      button,
      lineLimit,
      originalNodes: Array.from(panel.childNodes, (node) =>
        node.cloneNode(true),
      ),
      inlineContinuation: null,
      blockContinuation: null,
    };
    inlineDisclosureStates.set(button, state);
    rebuildInlineDisclosure(state);
  }

  window.MerWareDisclosure = { enhanceByLines, init };
})();
