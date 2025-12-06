// 🌙 Share Button Logic
function shareDua() {
  const title = document.title;
  const desc = document.querySelector('meta[name="description"]').content;
  const url = window.location.href;

  if (navigator.share) {
    navigator.share({ title, text: desc, url });
  } else {
    navigator.clipboard.writeText(url);
    alert("Link copied!");
  }
}

// ✨ Swipe Logic
const duaPages = [];  // Auto-filled when page loads
for (let i = 1; i <= 100; i++) {
  duaPages.push(`dua${i}.html`);
}

let current = duaPages.indexOf(location.pathname.split('/').pop());

function goPrev() {
  if (current > 0) location.href = duaPages[current - 1];
}
function goNext() {
  if (current < duaPages.length - 1) location.href = duaPages[current + 1];
}

// Touch gesture
let startX = 0;
document.addEventListener('touchstart', e => startX = e.changedTouches[0].screenX);
document.addEventListener('touchend', e => {
  let endX = e.changedTouches[0].screenX;
  if (endX < startX - 50) goNext();
  if (endX > startX + 50) goPrev();
});
