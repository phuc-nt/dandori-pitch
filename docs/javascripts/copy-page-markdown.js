/**
 * copy-page-markdown.js
 * Adds a "Copy Markdown" button at the top of each page's content area.
 * Reads window.PAGE_MARKDOWN (injected by overrides/main.html via MkDocs template)
 * and copies it to the clipboard.
 */

(function () {
  "use strict";

  function createCopyButton() {
    var btn = document.createElement("button");
    btn.textContent = "Copy Markdown";
    btn.title = "Copy this page's raw markdown source to clipboard";
    btn.style.cssText = [
      "display:inline-flex",
      "align-items:center",
      "gap:5px",
      "padding:4px 12px",
      "background:transparent",
      "color:var(--md-typeset-color,#333)",
      "border:1px solid var(--md-default-fg-color--lighter,#ccc)",
      "border-radius:4px",
      "font-size:0.75rem",
      "font-weight:600",
      "letter-spacing:0.02em",
      "cursor:pointer",
      "opacity:0.7",
      "transition:opacity 0.2s, border-color 0.2s",
      "float:right",
      "margin-bottom:0.5rem",
    ].join(";");

    btn.addEventListener("mouseenter", function () { btn.style.opacity = "1"; });
    btn.addEventListener("mouseleave", function () { btn.style.opacity = "0.7"; });

    btn.addEventListener("click", function () {
      var markdown = window.PAGE_MARKDOWN;
      if (!markdown) {
        btn.textContent = "Not available";
        return;
      }

      navigator.clipboard.writeText(markdown).then(
        function () {
          btn.textContent = "Copied!";
          setTimeout(function () { btn.textContent = "Copy Markdown"; }, 2000);
        },
        function () {
          // Fallback for older browsers
          var ta = document.createElement("textarea");
          ta.value = markdown;
          ta.style.cssText = "position:fixed;top:-9999px;left:-9999px";
          document.body.appendChild(ta);
          ta.select();
          try {
            document.execCommand("copy");
            btn.textContent = "Copied!";
            setTimeout(function () { btn.textContent = "Copy Markdown"; }, 2000);
          } catch (e) {
            btn.textContent = "Failed";
          }
          document.body.removeChild(ta);
        }
      );
    });

    return btn;
  }

  function injectCopyButton() {
    if (!window.PAGE_MARKDOWN) return;

    // Material theme: .md-content__inner holds the article body
    var article = document.querySelector(".md-content__inner");
    if (!article) return;

    // Avoid double-injection on SPA navigation
    if (article.querySelector(".dandori-copy-btn")) return;

    var btn = createCopyButton();
    btn.classList.add("dandori-copy-btn");

    // Insert before the first heading so it floats top-right
    var firstChild = article.firstElementChild;
    if (firstChild) {
      article.insertBefore(btn, firstChild);
    } else {
      article.appendChild(btn);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectCopyButton);
  } else {
    injectCopyButton();
  }

  // Re-inject on MkDocs Material SPA navigation
  document.addEventListener("DOMContentSwitch", function () {
    // PAGE_MARKDOWN is re-set by the template on each page load
    // Give the DOM a tick to settle
    setTimeout(injectCopyButton, 50);
  });
})();
