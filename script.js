const pig = document.getElementById("piggie");
const pigShadow = document.getElementById("pigShadow");
const video = document.getElementById("giftVideo");
const videoPlaceholder = document.getElementById("videoPlaceholder");

let pigX = -80;
let direction = 1;
let lastTime = performance.now();
let pauseUntil = 0;

// The pig roams continuously across the viewport.
// It pauses occasionally and flips direction at the edges.
function animatePig(now) {
  const delta = Math.min(now - lastTime, 40);
  lastTime = now;

  const pigWidth = pig.offsetWidth || 58;
  const maxX = window.innerWidth - pigWidth - 8;

  if (now > pauseUntil) {
    pigX += direction * delta * 0.075;

    if (pigX >= maxX) {
      pigX = maxX;
      direction = -1;
      pauseUntil = now + 700;
    } else if (pigX <= 8) {
      pigX = 8;
      direction = 1;
      pauseUntil = now + 700;
    }
  }

  const walkingBob = now > pauseUntil
    ? Math.sin(now * 0.012) * 3
    : 0;

  pig.style.transform =
    `translate3d(${pigX}px, ${walkingBob}px, 0) scaleX(${direction})`;

  pigShadow.style.transform =
    `translate3d(${pigX + pigWidth * 0.1}px, 0, 0) scaleX(${direction})`;

  requestAnimationFrame(animatePig);
}

requestAnimationFrame(animatePig);

// If the real video hasn't been supplied yet, keep the friendly placeholder.
// Once assets/video.mp4 exists and loads, the placeholder disappears.
video.addEventListener("loadeddata", () => {
  videoPlaceholder.style.display = "none";
});

video.addEventListener("error", () => {
  videoPlaceholder.style.display = "flex";
});

// Give the pig a slightly different roaming position when the page is resized.
window.addEventListener("resize", () => {
  pigX = Math.min(pigX, Math.max(8, window.innerWidth - (pig.offsetWidth || 58) - 8));
});

// Tiny click interaction: clicking the page makes a little heart pop up.
// It intentionally stays subtle.
document.addEventListener("click", (event) => {
  if (
    event.target.closest("video") ||
    event.target.closest("a") ||
    event.target.closest("button")
  ) return;

  const heart = document.createElement("span");
  heart.textContent = Math.random() > 0.5 ? "♡" : "🌿";
  heart.style.position = "fixed";
  heart.style.left = `${event.clientX}px`;
  heart.style.top = `${event.clientY}px`;
  heart.style.zIndex = "100";
  heart.style.pointerEvents = "none";
  heart.style.fontSize = "20px";
  heart.style.transition = "transform 900ms ease, opacity 900ms ease";
  document.body.appendChild(heart);

  requestAnimationFrame(() => {
    heart.style.transform = "translateY(-65px) scale(1.35)";
    heart.style.opacity = "0";
  });

  setTimeout(() => heart.remove(), 950);
});
