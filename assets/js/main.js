/* =====================================================================
   Paskuhang Pinoy — Victory Pulilan Serve Team & Leaders Christmas Party
   ---------------------------------------------------------------------
   Walang build step, walang dependencies. I-edit lang ang CONFIG sa baba.
   ===================================================================== */
(function () {
  "use strict";

  /* ===================================================================
     CONFIG — ito lang ang karaniwang binabago
     =================================================================== */
  var CONFIG = {
    // Petsa at oras ng event (Philippine time, UTC+8)
    eventISO: '2026-12-05T17:00:00+08:00',
    eventTitle: 'Paskuhang Pinoy — Serve Team & Leaders Christmas Party',
    eventDetails: 'Victory Pulilan Serve Team & Leaders Christmas Party. ' +
                  'Dress code: Kulturang Pinoy. Food cart booth design contest kada ministry.',
    eventLocation: '',               // ilagay ang venue kapag final na
    calStartUTC: '20261205T090000Z', // 5:00 PM PH
    calEndUTC:   '20261205T140000Z'  // 10:00 PM PH
  };

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ===================================================================
     Parol (Filipino Christmas star lantern), drawn as SVG
     =================================================================== */
  function parol(fill, accent, scale) {
    scale = scale || 1;
    var star = '50,2 61.2,34.6 95.7,35.2 68.1,55.9 78.2,88.8 50,69 21.8,88.8 31.9,55.9 4.3,35.2 38.8,34.6';
    var tips = [[50, 2], [95.7, 35.2], [78.2, 88.8], [21.8, 88.8], [4.3, 35.2]];
    var rays = tips.map(function (t) {
      return '<line x1="50" y1="50" x2="' + t[0] + '" y2="' + t[1] + '" stroke="' + accent + '" stroke-width="2" opacity=".65"/>';
    }).join('');
    return '<svg viewBox="0 0 100 150" width="' + (100 * scale) + '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'
      + '<path d="M28 88 L22 146 L33 128 L38 92 Z" fill="' + accent + '" opacity=".9"/>'
      + '<path d="M72 88 L78 146 L67 128 L62 92 Z" fill="' + accent + '" opacity=".9"/>'
      + '<polygon points="' + star + '" fill="' + fill + '" stroke="#fff6e5" stroke-width="3" stroke-linejoin="round"/>'
      + rays
      + '<circle cx="50" cy="50" r="7" fill="#fff6e5" opacity=".85"/>'
      + '</svg>';
  }

  var hero = $('#hero');
  var small = window.matchMedia('(max-width: 640px)').matches;
  [
    { fill: '#ef1f2b', accent: '#ffc83d', s: 0.70, left: '3%', top: '5%', cls: 'sway' },
    { fill: '#ffc83d', accent: '#ef1f2b', s: 0.60, right: '3%', top: '6%', cls: 'glow' }
  ].forEach(function (p, i) {
    var d = document.createElement('div');
    d.className = 'parol ' + p.cls;
    if (p.left) { d.style.left = p.left; } else { d.style.right = p.right; }
    d.style.top = p.top;
    d.style.animationDelay = (-i * 1.6) + 's';
    d.innerHTML = parol(p.fill, p.accent, small ? p.s * 0.62 : p.s);
    hero.appendChild(d);
  });

  [['div1', '#ef1f2b', '#ffc83d'], ['div2', '#17a35c', '#fff6e5']]
    .forEach(function (d) {
      var el = document.getElementById(d[0]);
      if (el) el.innerHTML = parol(d[1], d[2], 0.5);
    });

  /* ===================================================================
     Title + ribbon fitting
     =================================================================== */
  function fitTitle() {
    var svg = $('#titleSvg');
    if (!svg) return;
    try {
      var bb = svg.getBBox(), pad = 12;
      if (bb.width > 0) {
        svg.setAttribute('viewBox', (bb.x - pad) + ' ' + (bb.y - pad) + ' ' + (bb.width + pad * 2) + ' ' + (bb.height + pad * 2));
      }
    } catch (e) { /* older browsers: keep the default viewBox */ }
  }

  function fitRibbon() {
    var box = $('.ribbon'), b = box && box.querySelector('b');
    if (!b) return;
    var cs = getComputedStyle(box);
    var chrome = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight)
               + parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);
    var avail = Math.min(window.innerWidth - 32, 1080) - chrome - 6;
    var size = Math.min(window.innerWidth * 0.027, 22.4);
    b.style.fontSize = size + 'px';
    var guard = 0;
    while (b.scrollWidth > avail && size > 6.5 && guard++ < 80) {
      size -= 0.4;
      b.style.fontSize = size + 'px';
    }
  }

  fitTitle(); fitRibbon();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { fitTitle(); fitRibbon(); });
  }

  /* ===================================================================
     Bokeh lights
     =================================================================== */
  var bokeh = $('#bokeh');
  var lightColors = ['#ffc83d', '#ef1f2b', '#17a35c', '#2f7fd4', '#ffe6a8'];
  if (!reduce && bokeh) {
    for (var i = 0; i < 28; i++) {
      var dot = document.createElement('i');
      var size = 6 + Math.random() * 22;
      dot.style.width = size + 'px';
      dot.style.height = size + 'px';
      dot.style.left = (Math.random() * 100) + '%';
      dot.style.top = (38 + Math.random() * 62) + '%';
      dot.style.background = lightColors[i % lightColors.length];
      dot.style.animationDuration = (9 + Math.random() * 11) + 's';
      dot.style.animationDelay = (-Math.random() * 14) + 's';
      bokeh.appendChild(dot);
    }
  }

  /* ===================================================================
     Banderitas
     =================================================================== */
  var flagColors = ['#ef1f2b', '#ffc83d', '#17a35c', '#fff6e5', '#ef1f2b', '#2f7fd4'];
  function drawBanderitas(el, flip) {
    if (!el) return;
    var w = Math.max(el.clientWidth, 320), h = 46, span = 44;
    var n = Math.ceil(w / span), sag = 12, parts = [];
    parts.push('<path d="M0,6 Q' + (w / 2) + ',' + (6 + sag * 2) + ' ' + w + ',6" fill="none" stroke="rgba(255,246,229,.6)" stroke-width="2"/>');
    for (var i = 0; i <= n; i++) {
      var t = i / n, x = t * w;
      var y = 6 + Math.sin(Math.PI * t) * sag * 1.35;
      parts.push('<polygon points="' + (x - 14) + ',' + y + ' ' + (x + 14) + ',' + y + ' ' + x + ',' + (y + 23) + '" fill="' + flagColors[i % flagColors.length] + '" opacity=".97"/>');
    }
    var g = flip ? '<g transform="translate(0,' + h + ') scale(1,-1)">' + parts.join('') + '</g>' : parts.join('');
    el.innerHTML = '<svg viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" aria-hidden="true">' + g + '</svg>';
  }
  function drawBunting() {
    drawBanderitas($('#bander-top'), false);
    drawBanderitas($('#bander-bottom'), true);
  }
  drawBunting();

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { drawBunting(); fitRibbon(); }, 140);
  });

  /* ===================================================================
     Ministry food cart assignments
     =================================================================== */
  var ministries = [
    ['Admin', 'Turon &amp; Banana Cue'],
    ['TSM', 'Hotdogs &amp; Marshmallows'],
    ['Ushering', 'Balut, Mani &amp; Crackers'],
    ['Production &amp; Discipleship', 'Sweet Corn &amp; Popcorn'],
    ['Kids Ministry', 'Taho'],
    ['Music Ministry', 'Palamig, Buko Juice &amp; Ice Scramble'],
    ['Communications', 'Sorbetes'],
    ['Prayer Team', 'Puto &amp; Kutsinta'],
    ['Calumpit', 'Fishball &amp; Ihaw-Ihaw / Isaw']
  ];
  $('#ministries').innerHTML = ministries.map(function (m, i) {
    return '<div class="card"><div class="n">' + (i + 1) + '</div><div><h3>' + m[0] + '</h3><p>' + m[1] + '</p></div></div>';
  }).join('');

  /* ===================================================================
     Dress code pegs — palitan ang src para sa ibang litrato
     =================================================================== */
  var looks = [
    { src: 'assets/img/peg5.webp', t: 'Barong &amp; Filipiniana',     d: 'Klasikong piña barong at eleganteng Filipiniana na may panuelo.' },
    { src: 'assets/img/peg6.webp', t: 'Katipunero &amp; Maria Clara', d: 'Kamisa de chino na may pulang panyo, baro at tapis na plaid.' },
    { src: 'assets/img/peg7.webp', t: "Barong &amp; Baro't Saya",     d: 'Barong at baro\'t saya — simple, malinis, at tunay na Pinoy.' },
    { src: 'assets/img/peg8.webp', t: 'Probinsyano &amp; Terno',      d: 'Salakot at earth tones, katambal ang bulaklaking modernong terno.' }
  ];
  $('#wear-grid').innerHTML = looks.map(function (l) {
    return '<figure><div class="ph">'
      + '<img src="' + l.src + '" alt="' + l.t.replace(/&amp;/g, 'at') + '" loading="lazy" width="900" height="900">'
      + '</div><figcaption><h3>' + l.t + '</h3><p>' + l.d + '</p></figcaption></figure>';
  }).join('');

  /* ===================================================================
     Countdown
     =================================================================== */
  var target = new Date(CONFIG.eventISO).getTime();
  function pad(v) { return v < 10 ? '0' + v : '' + v; }
  function tick() {
    var diff = target - Date.now();
    if (diff <= 0) {
      $('#countdown').innerHTML =
        '<div class="cd-box" style="min-width:auto;padding:.9rem 1.5rem">' +
        '<span class="cd-num" style="font-size:1.2rem">Maligayang Paskuhang Pinoy!</span></div>';
      clearInterval(timer);
      return;
    }
    var s = Math.floor(diff / 1000);
    $('#cd-d').textContent = Math.floor(s / 86400);
    $('#cd-h').textContent = pad(Math.floor(s / 3600) % 24);
    $('#cd-m').textContent = pad(Math.floor(s / 60) % 60);
    $('#cd-s').textContent = pad(s % 60);
  }
  tick();
  var timer = setInterval(tick, 1000);

  /* ===================================================================
     Calendar + share
     =================================================================== */
  $('#cal').href = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
    + '&text=' + encodeURIComponent(CONFIG.eventTitle)
    + '&dates=' + CONFIG.calStartUTC + '/' + CONFIG.calEndUTC
    + '&details=' + encodeURIComponent(CONFIG.eventDetails)
    + (CONFIG.eventLocation ? '&location=' + encodeURIComponent(CONFIG.eventLocation) : '');

  $('#share').addEventListener('click', function (e) {
    e.preventDefault();
    var data = {
      title: 'Paskuhang Pinoy',
      text: 'Kita-kits sa Paskuhang Pinoy — Disyembre 5, 2026, ika-5 ng hapon!',
      url: location.href
    };
    if (navigator.share) {
      navigator.share(data).catch(function () {});
    } else if (navigator.clipboard) {
      var btn = this, label = btn.textContent;
      navigator.clipboard.writeText(location.href).then(function () {
        btn.textContent = 'Na-copy ang link!';
        setTimeout(function () { btn.textContent = label; }, 2000);
      }).catch(function () {});
    }
  });

  /* ===================================================================
     Scroll reveal
     =================================================================== */
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    $$('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('in'); });
  }
})();
