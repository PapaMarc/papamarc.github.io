(function () {
  const audio = document.getElementById("bg-audio");
  const checkbox = document.getElementById("bg-toggle");
  const label = document.querySelector(".playButton");
  if (!checkbox || !label || !audio) return;

  checkbox.checked = !audio.paused;
  label.setAttribute("aria-pressed", checkbox.checked ? "true" : "false");

  checkbox.addEventListener("change", function () {
    if (checkbox.checked) {
      audio
        .play()
        .then(() => {
          label.setAttribute("aria-pressed", "true");
        })
        .catch(() => {
          checkbox.checked = false;
          label.setAttribute("aria-pressed", "false");
        });
    } else {
      audio.pause();
      label.setAttribute("aria-pressed", "false");
    }
  });

  audio.addEventListener("play", () => {
    checkbox.checked = true;
    label.setAttribute("aria-pressed", "true");
  });
  audio.addEventListener("pause", () => {
    checkbox.checked = false;
    label.setAttribute("aria-pressed", "false");
  });
})();
