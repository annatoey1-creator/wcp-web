// Mobile menu
var nav = document.getElementById('nav');
document.getElementById('menuBtn').addEventListener('click', function () { nav.classList.toggle('open'); });
nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') nav.classList.remove('open'); });

// Hero slider
var slides = document.querySelectorAll('.slide');
var dotsBox = document.getElementById('dots');
var current = 0, timer;
slides.forEach(function (_, i) {
  var b = document.createElement('button');
  b.setAttribute('aria-label', 'สไลด์ ' + (i + 1));
  b.addEventListener('click', function () { show(i); restart(); });
  dotsBox.appendChild(b);
});
function show(i) {
  slides[current].classList.remove('active');
  dotsBox.children[current].classList.remove('active');
  current = i;
  slides[current].classList.add('active');
  dotsBox.children[current].classList.add('active');
}
function restart() {
  clearInterval(timer);
  timer = setInterval(function () { show((current + 1) % slides.length); }, 5000);
}
dotsBox.children[0].classList.add('active');
restart();

// Product tabs
document.getElementById('tabs').addEventListener('click', function (e) {
  var btn = e.target.closest('button');
  if (!btn) return;
  document.querySelectorAll('#tabs button').forEach(function (b) { b.classList.toggle('active', b === btn); });
  document.querySelectorAll('.panel').forEach(function (p) { p.classList.toggle('active', p.dataset.panel === btn.dataset.tab); });
});

document.getElementById('year').textContent = new Date().getFullYear();
