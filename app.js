(function () {
  var FREE = 75000, SERVICE = 2000, KEY = 'dapurantar-cart';
  var AREAS = [
    { n: 'Menteng', base: 25, fee: 8000 },
    { n: 'Senayan', base: 25, fee: 8000 },
    { n: 'Kemang', base: 30, fee: 8000 },
    { n: 'Tebet', base: 30, fee: 8000 },
    { n: 'Grogol', base: 30, fee: 8000 },
    { n: 'Cilandak', base: 35, fee: 10000 },
    { n: 'Kelapa Gading', base: 35, fee: 10000 },
    { n: 'Pantai Indah Kapuk', base: 40, fee: 12000 }
  ];
  var PAYS = ['QRIS', 'GoPay', 'OVO', 'Dana', 'Cash to courier'];
  var CATS = ['All', 'Rice', 'Noodles & Meatballs', 'Satay & Grill', 'Snacks', 'Drinks'];
  var SPICE = ['Not spicy', 'Mildly spicy', 'Spicy', 'Very spicy'];
  var D = [
    { id: 'n1', c: 'Rice', n: 'Nasi Goreng Kampung', d: 'Shrimp-paste fried rice with a sunny-side-up egg, pickles, and crackers.', p: 28000, s: 2, t: 10, k: ['#C98A3B', '#E9C46A', '#6A994E'] },
    { id: 'n2', c: 'Rice', n: 'Nasi Ayam Penyet', d: 'Smashed fried chicken with shallot sambal, tempeh, and fresh raw vegetables.', p: 32000, s: 3, t: 15, k: ['#D9A441', '#C8321C', '#6A994E'] },
    { id: 'n3', c: 'Rice', n: 'Nasi Rendang Padang', d: 'Beef rendang cooked for six hours, cassava leaves, and green chili sambal.', p: 42000, s: 2, t: 12, k: ['#6B3A24', '#4C8B4A', '#B33A2A'] },
    { id: 'n4', c: 'Rice', n: 'Nasi Uduk Komplit', d: 'Coconut-milk rice with vermicelli, chili-glazed egg, and fried shallots.', p: 26000, s: 1, t: 10, k: ['#EFE2B8', '#C8321C', '#D9A441'] },
    { id: 'm1', c: 'Noodles & Meatballs', n: 'Bakso Urat Jumbo', d: 'Large tendon meatballs, yellow noodles, tofu, and beef broth.', p: 30000, s: 1, t: 12, k: ['#8C6A4A', '#E9C46A', '#6A994E'] },
    { id: 'm2', c: 'Noodles & Meatballs', n: 'Mie Ayam Pangsit', d: 'Chewy noodles, soy-glazed chicken, mustard greens, and fried wontons.', p: 24000, s: 0, t: 10, k: ['#D9A441', '#7A4B2A', '#6A994E'] },
    { id: 'm3', c: 'Noodles & Meatballs', n: 'Soto Betawi', d: 'Creamy coconut-milk broth with beef, beef lung, and melinjo crackers.', p: 38000, s: 1, t: 14, k: ['#F0DFA6', '#9A5B34', '#6A994E'] },
    { id: 'm4', c: 'Noodles & Meatballs', n: 'Mie Goreng Jawa', d: 'Sweet-savory fried noodles with egg and pickles.', p: 27000, s: 1, t: 10, k: ['#B5702E', '#E9C46A', '#6A994E'] },
    { id: 's1', c: 'Satay & Grill', n: 'Sate Ayam Madura', d: 'Ten chicken satay skewers, peanut sauce, rice cake, and shallots.', p: 34000, s: 1, t: 18, k: ['#8A4B26', '#D9A441', '#C8321C'] },
    { id: 's2', c: 'Satay & Grill', n: 'Sate Taichan', d: 'Grilled chicken without peanut sauce, with hot chili sambal and lime.', p: 32000, s: 3, t: 15, k: ['#EFE2B8', '#C8321C', '#6A994E'] },
    { id: 's3', c: 'Satay & Grill', n: 'Ikan Bakar Jimbaran', d: 'Grilled snapper, sambal matah, and warm white rice.', p: 48000, s: 2, t: 20, k: ['#C98A3B', '#E9C46A', '#C8321C'] },
    { id: 's4', c: 'Satay & Grill', n: 'Ayam Bakar Taliwang', d: 'Lombok-style chili-marinated grilled chicken with plecing water spinach.', p: 40000, s: 3, t: 20, k: ['#A8441F', '#6A994E', '#E9C46A'] },
    { id: 'c1', c: 'Snacks', n: 'Pisang Goreng Madu', d: 'Crispy fried kepok bananas drizzled with honey and sesame seeds.', p: 16000, s: 0, t: 8, k: ['#E9B949', '#C98A3B', '#F4E3A1'] },
    { id: 'c2', c: 'Snacks', n: 'Batagor Bandung', d: 'Fried tofu and fish dumplings with peanut sauce, soy sauce, and lime.', p: 22000, s: 1, t: 10, k: ['#D9A441', '#8A4B26', '#6A994E'] },
    { id: 'c3', c: 'Snacks', n: 'Martabak Telur Mini', d: 'Thin pastry filled with egg, minced meat, and spring onion.', p: 25000, s: 1, t: 15, k: ['#C98A3B', '#E9C46A', '#6A994E'] },
    { id: 'c4', c: 'Snacks', n: 'Risol Mayo', d: 'Four rissoles filled with sausage, egg, and mayonnaise, fried crisp.', p: 18000, s: 0, t: 8, k: ['#D9A441', '#F4E3A1', '#C8321C'] },
    { id: 'd1', c: 'Drinks', n: 'Es Teh Tarik', d: 'Strong tea pulled with sweetened condensed milk, lots of ice.', p: 12000, s: 0, t: 5, k: ['#B5702E', '#F4E3A1', '#8A4B26'] },
    { id: 'd2', c: 'Drinks', n: 'Es Kopi Susu Gula Aren', d: 'Espresso, fresh milk, and palm sugar syrup.', p: 20000, s: 0, t: 6, k: ['#7A4B2A', '#F4E3A1', '#B5702E'] },
    { id: 'd3', c: 'Drinks', n: 'Es Cendol', d: 'Green cendol jelly, coconut milk, and liquid palm sugar.', p: 16000, s: 0, t: 6, k: ['#6A994E', '#F4E3A1', '#8A4B26'] },
    { id: 'd4', c: 'Drinks', n: 'Jus Alpukat', d: 'Buttery avocado blended with milk and chocolate syrup.', p: 18000, s: 0, t: 6, k: ['#8FB04F', '#6B4423', '#E9E3A1'] }
  ];
  var byId = {};
  D.forEach(function (x) { byId[x.id] = x; });

  var $ = function (id) { return document.getElementById(id); };
  var cart = {}, cat = 'All', q = '', lastFocus = null;
  var user = null, voucher = '', pendingCheckout = false, areaTouched = false;
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, PHONE = /^(\+62|62|0)8\d{8,11}$/;
  var VOUCHERS = {
    SAVE10: { min: 50000, label: '10% off up to Rp15.000', calc: function (s) { return Math.min(15000, Math.round(s * 0.1)); } },
    FREESHIP: { min: 40000, label: 'Free delivery', calc: null },
    NEW20: { min: 60000, label: 'Rp20.000 off first order', calc: function () { return 20000; }, newOnly: true }
  };

  try {
    var raw = localStorage.getItem(KEY);
    if (raw) {
      var o = JSON.parse(raw);
      for (var k in o) { if (byId[k] && o[k] > 0) cart[k] = Math.min(20, o[k] | 0); }
    }
  } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} }

  function rp(n) { return 'Rp' + Math.round(n).toLocaleString('id-ID'); }
  function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

  function plate(x, i) {
    var r = (i * 37) % 360, k = x.k;
    return '<svg viewBox="0 0 120 120" aria-hidden="true">' +
      '<circle cx="60" cy="60" r="56" fill="var(--rim)"/>' +
      '<circle cx="60" cy="60" r="45" fill="var(--surface)"/>' +
      '<g transform="rotate(' + r + ' 60 60)">' +
      '<ellipse cx="58" cy="62" rx="26" ry="20" fill="' + k[0] + '"/>' +
      '<ellipse cx="74" cy="50" rx="13" ry="10" fill="' + k[1] + '"/>' +
      '<circle cx="42" cy="46" r="7" fill="' + k[2] + '"/>' +
      '<circle cx="48" cy="78" r="4" fill="' + k[2] + '"/>' +
      '<circle cx="80" cy="74" r="3.5" fill="' + k[1] + '"/>' +
      '</g></svg>';
  }

  function ctl(id) {
    var n = cart[id] || 0;
    if (!n) return '<button class="add" type="button" data-act="add" data-id="' + id + '">Add</button>';
    return '<div class="step" role="group" aria-label="Quantity ' + esc(byId[id].n) + '">' +
      '<button type="button" data-act="dec" data-id="' + id + '" aria-label="Decrease">&minus;</button>' +
      '<output>' + n + '</output>' +
      '<button type="button" data-act="inc" data-id="' + id + '" aria-label="Increase">+</button></div>';
  }

  function renderChips() {
    $('chips').innerHTML = CATS.map(function (c) {
      return '<button class="chip" type="button" data-cat="' + esc(c) + '" aria-pressed="' + (c === cat) + '">' + esc(c) + '</button>';
    }).join('');
  }

  function renderGrid() {
    var term = q.trim().toLowerCase();
    var list = D.filter(function (x) {
      return (cat === 'All' || x.c === cat) && (!term || (x.n + ' ' + x.d).toLowerCase().indexOf(term) > -1);
    });
    $('menuCount').textContent = list.length + ' dishes';
    if (!list.length) {
      $('grid').innerHTML = '<p class="empty">No dishes match &ldquo;' + esc(q) + '&rdquo;. Try another word or choose the All category.</p>';
      return;
    }
    $('grid').innerHTML = list.map(function (x) {
      var bars = '';
      for (var i = 1; i <= 3; i++) bars += '<i class="' + (i <= x.s ? 'on' : '') + '"></i>';
      return '<article class="card" data-card="' + x.id + '">' +
        '<div class="plate">' + plate(x, D.indexOf(x)) + '</div>' +
        '<div class="info"><h3>' + esc(x.n) + '</h3><p class="desc">' + esc(x.d) + '</p>' +
        '<div class="meta"><span class="bars" aria-hidden="true">' + bars + '</span><span>' + SPICE[x.s] + '</span><span aria-hidden="true">&middot;</span><span class="mono">' + x.t + ' min to cook</span></div></div>' +
        '<div class="foot"><span class="price">' + rp(x.p) + '</span><span class="ctl">' + ctl(x.id) + '</span></div></article>';
    }).join('');
  }

  function areaSel() { return AREAS[$('area-sel').selectedIndex] || AREAS[0]; }

  function calc() {
    var sub = 0, count = 0, prep = 0;
    for (var id in cart) {
      var x = byId[id];
      sub += x.p * cart[id]; count += cart[id]; prep = Math.max(prep, x.t);
    }
    var a = areaSel(), free = sub >= FREE;
    var ship = !sub ? 0 : (free ? 0 : a.fee), svc = sub ? SERVICE : 0;
    var v = voucherState(sub), disc = 0;
    if (v.ok) disc = (v.code === 'FREESHIP') ? ship : v.amount;
    disc = Math.min(disc, sub + ship + svc);
    return { sub: sub, count: count, prep: prep, area: a, free: free, ship: ship, svc: svc, disc: disc, vcode: v.ok ? v.code : '', total: sub + ship + svc - disc };
  }

  function voucherState(sub) {
    var v = VOUCHERS[voucher];
    if (!voucher || !v) return { ok: false, msg: '' };
    if (v.newOnly && (!user || ordersOf().length)) {
      return { ok: false, msg: user ? 'Code NEW20 is only for a first order.' : 'Log in first to use code NEW20.' };
    }
    if (sub < v.min) return { ok: false, msg: 'Code ' + voucher + ' requires a minimum spend of ' + rp(v.min) + '.' };
    return { ok: true, code: voucher, amount: v.calc ? v.calc(sub) : 0, msg: v.label + ' applied.' };
  }

  function renderCart() {
    var c = calc(), ids = Object.keys(cart);
    $('cartCount').textContent = c.count;
    $('lines').innerHTML = ids.length ? ids.map(function (id) {
      var x = byId[id], n = cart[id];
      return '<div class="line"><div><h3>' + esc(x.n) + '</h3><span class="each mono">' + rp(x.p) + '</span></div>' +
        '<div class="sum mono">' + rp(x.p * n) + '</div>' +
        '<div class="step" role="group" aria-label="Quantity ' + esc(x.n) + '">' +
        '<button type="button" data-act="dec" data-id="' + id + '" aria-label="Decrease">&minus;</button><output>' + n + '</output>' +
        '<button type="button" data-act="inc" data-id="' + id + '" aria-label="Increase">+</button></div></div>';
    }).join('') : '<p class="cart-empty">Your cart is empty. Add dishes from the menu.</p>';

    var fr = $('free');
    if (c.sub) {
      fr.hidden = false;
      $('freeText').textContent = c.free ? 'Free delivery unlocked.' : 'Add ' + rp(FREE - c.sub) + ' more for free delivery.';
      $('freeBar').style.width = Math.min(100, c.sub / FREE * 100) + '%';
    } else fr.hidden = true;

    $('tSub').textContent = rp(c.sub);
    $('tShip').textContent = !c.sub ? rp(0) : (c.free ? 'Free' : rp(c.ship));
    $('tSvc').textContent = rp(c.svc);
    $('rowDisc').hidden = !c.disc;
    $('tDisc').textContent = '−' + rp(c.disc);
    $('discLabel').textContent = 'Voucher ' + c.vcode;
    var vs = voucherState(c.sub);
    $('vMsg').textContent = voucher ? vs.msg : '';
    $('vMsg').className = 'vmsg' + (voucher && vs.ok ? ' ok' : '');
    $('vClear').hidden = !voucher;
    $('tTotal').textContent = rp(c.total);
    $('submitBtn').disabled = !c.count;
    $('submitBtn').textContent = c.count ? 'Place order · ' + rp(c.total) : 'Place order';
  }

  function change(id, act) {
    var n = cart[id] || 0;
    if (act === 'add' || act === 'inc') n = Math.min(20, n + 1);
    else n = n - 1;
    if (n <= 0) delete cart[id]; else cart[id] = n;
    save();
    var card = document.querySelector('[data-card="' + id + '"] .ctl');
    if (card) card.innerHTML = ctl(id);
    renderCart();
    return card;
  }

  function onAct(e) {
    var b = e.target.closest('[data-act]');
    if (!b) return;
    var id = b.getAttribute('data-id'), act = b.getAttribute('data-act');
    var inCart = !!b.closest('#lines');
    var card = change(id, act);
    var target = inCart
      ? ($('lines').querySelector('[data-id="' + id + '"][data-act="' + act + '"]') || $('lines').querySelector('button'))
      : (card && (card.querySelector('[data-act="' + act + '"]') || card.querySelector('button')));
    if (target) target.focus();
  }
  $('grid').addEventListener('click', onAct);
  $('lines').addEventListener('click', onAct);

  $('chips').addEventListener('click', function (e) {
    var b = e.target.closest('[data-cat]');
    if (!b) return;
    cat = b.getAttribute('data-cat');
    renderChips(); renderGrid();
    var again = document.querySelector('[data-cat="' + cat.replace(/"/g, '\\"') + '"]');
    if (again) again.focus();
  });
  $('searchInput').addEventListener('input', function (e) { q = e.target.value; renderGrid(); });

  /* Static fills */
  $('areaRows').innerHTML = AREAS.map(function (a) {
    return '<tr><td>' + esc(a.n) + '</td><td class="num">' + a.base + ' min</td><td class="num">' + rp(a.fee) + '</td></tr>';
  }).join('');
  $('area-sel').innerHTML = AREAS.map(function (a) {
    return '<option>' + esc(a.n) + ' (fee ' + rp(a.fee) + ')</option>';
  }).join('');
  $('pays').innerHTML = PAYS.map(function (p, i) {
    return '<label class="pay"><input type="radio" name="pay" value="' + esc(p) + '"' + (i === 0 ? ' checked' : '') + '><span>' + esc(p) + '</span></label>';
  }).join('');
  $('area-sel').addEventListener('change', function () { areaTouched = true; renderCart(); });

  /* Drawer */
  function openDrawer() {
    lastFocus = document.activeElement;
    prefill();
    $('cartView').style.display = 'flex'; $('doneView').style.display = 'none';
    $('scrim').hidden = false;
    $('drawer').classList.add('open'); $('drawer').setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(function () { $('closeBtn').focus(); }, 30);
  }
  function closeDrawer() {
    $('scrim').hidden = true;
    $('drawer').classList.remove('open'); $('drawer').setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $('cartBtn').addEventListener('click', openDrawer);
  $('closeBtn').addEventListener('click', closeDrawer);
  $('closeBtn2').addEventListener('click', closeDrawer);
  $('scrim').addEventListener('click', closeDrawer);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && $('drawer').classList.contains('open') && $('authModal').hidden) closeDrawer();
  });

  $('checkout').addEventListener('submit', function (e) {
    e.preventDefault();
    var c = calc();
    if (!c.count) return;
    if (!user) {
      pendingCheckout = true;
      openAuth('login', 'Log in or sign up first to complete your order. Your cart contents are saved.');
      return;
    }
    var addr = $('address').value.trim();
    if (addr.length < 8) {
      $('err').textContent = 'Enter your full delivery address, for example street name and number.';
      $('address').focus();
      return;
    }
    $('err').textContent = '';
    var pay = document.querySelector('input[name="pay"]:checked').value;
    var no = '#DA-' + (1000 + Math.floor(Math.random() * 9000));
    var lo = c.area.base + c.prep;
    addOrder({
      no: no, t: Date.now(), area: c.area.n, lo: lo, prep: c.prep, pay: pay, total: c.total, addr: addr,
      items: Object.keys(cart).map(function (id) { return { id: id, n: byId[id].n, q: cart[id], p: byId[id].p }; })
    });
    var rows = Object.keys(cart).map(function (id) {
      return '<div class="row"><span>' + cart[id] + 'x ' + esc(byId[id].n) + '</span><span>' + Math.round(byId[id].p * cart[id]).toLocaleString('id-ID') + '</span></div>';
    }).join('');
    rows += '<div class="row" style="color:var(--muted)"><span>Delivery fee ' + esc(c.area.n) + '</span><span>' + (c.free ? 'Free' : c.ship.toLocaleString('id-ID')) + '</span></div>';
    rows += '<div class="row" style="color:var(--muted)"><span>Service fee</span><span>' + c.svc.toLocaleString('id-ID') + '</span></div>';
    if (c.disc) rows += '<div class="row" style="color:var(--ok)"><span>Voucher ' + esc(c.vcode) + '</span><span>-' + c.disc.toLocaleString('id-ID') + '</span></div>';
    $('dNo').textContent = 'Receipt ' + no;
    $('dRows').innerHTML = rows;
    $('dTotal').textContent = rp(c.total);
    $('dPay').textContent = pay;
    $('dEta').textContent = 'Arrives in about ' + lo + '-' + (lo + 10) + ' minutes';
    cart = {}; save(); voucher = ''; $('voucherCode').value = '';
    renderGrid(); renderCart();
    $('cartView').style.display = 'none'; $('doneView').style.display = 'flex';
    $('againBtn').focus();
  });
  $('againBtn').addEventListener('click', function () {
    cart = {}; save(); renderGrid(); renderCart(); closeDrawer();
  });

  /* ---------- Account (demo): stored in this browser only ---------- */
  var mem = {};
  function sget(k, def) {
    try { var r = localStorage.getItem(k); if (r !== null) return JSON.parse(r); } catch (e) {}
    return (k in mem) ? mem[k] : def;
  }
  function sset(k, v) { mem[k] = v; try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  var USERS = 'da-users', SESS = 'da-session', ORD = 'da-orders';
  function users() { return sget(USERS, {}); }
  function saveUser(u) { var all = users(); all[u.email] = u; sset(USERS, all); user = u; }
  function allOrders() { return sget(ORD, {}); }
  function ordersOf() { return user ? (allOrders()[user.email] || []) : []; }
  function addOrder(o) { var all = allOrders(); (all[user.email] = all[user.email] || []).unshift(o); sset(ORD, all); }
  function newSalt() { return Math.random().toString(36).slice(2) + Date.now().toString(36); }
  function hashPw(pw, salt) {
    var s = salt + ':' + pw;
    if (window.crypto && crypto.subtle && window.TextEncoder) {
      return crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)).then(function (b) {
        return Array.prototype.map.call(new Uint8Array(b), function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
      });
    }
    var h = 5381;
    for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return Promise.resolve('x' + (h >>> 0).toString(16));
  }

  var toastT;
  function toast(msg) {
    var t = $('toast'); t.textContent = msg; t.hidden = false;
    clearTimeout(toastT); toastT = setTimeout(function () { t.hidden = true; }, 3200);
  }
  function fe(id, msg) {
    var el = $(id), er = $(id + '-e');
    if (er) er.textContent = msg || '';
    if (el) el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    return !msg;
  }
  function pwProblem(pw) {
    if (pw.length < 8) return 'Password must be at least 8 characters.';
    if (!/[A-Za-z]/.test(pw) || !/\d/.test(pw)) return 'Password must contain letters and numbers.';
    return '';
  }

  /* Auth modal */
  var authReturn = null, failN = 0, failUntil = 0;
  function setAuthMode(mode, msg) {
    var titles = { login: 'Log in', register: 'Create account', forgot: 'Forgot password' };
    $('authTitle').textContent = titles[mode];
    $('loginForm').hidden = mode !== 'login';
    $('registerForm').hidden = mode !== 'register';
    $('forgotForm').hidden = mode !== 'forgot';
    $('authTabs').hidden = mode === 'forgot';
    $('tabLogin').setAttribute('aria-selected', mode === 'login');
    $('tabRegister').setAttribute('aria-selected', mode === 'register');
    $('authMsg').textContent = msg || '';
    ['l-email', 'l-pw', 'r-name', 'r-email', 'r-phone', 'r-pw', 'r-pw2', 'r-terms', 'f-email'].forEach(function (id) { fe(id, ''); });
    $('f-ok').textContent = '';
  }
  function openAuth(mode, msg) {
    authReturn = document.activeElement;
    setAuthMode(mode || 'login', msg);
    $('authScrim').hidden = false; $('authModal').hidden = false;
    document.body.style.overflow = 'hidden';
    setTimeout(function () {
      var f = $('authModal').querySelector('form:not([hidden]) input');
      if (f) f.focus();
    }, 30);
  }
  function closeAuth() {
    $('authScrim').hidden = true; $('authModal').hidden = true;
    if (!$('drawer').classList.contains('open')) document.body.style.overflow = '';
    if (authReturn && authReturn.focus) authReturn.focus();
  }
  $('loginBtn').addEventListener('click', function () { openAuth('login'); });
  $('registerBtn').addEventListener('click', function () { openAuth('register'); });
  $('hintLogin').addEventListener('click', function () { openAuth('login'); });
  $('authClose').addEventListener('click', function () { pendingCheckout = false; closeAuth(); });
  $('authScrim').addEventListener('click', function () { pendingCheckout = false; closeAuth(); });
  $('toForgot').addEventListener('click', function () { setAuthMode('forgot'); $('f-email').focus(); });
  $('authModal').addEventListener('click', function (e) {
    var b = e.target.closest('[data-mode]');
    if (!b) return;
    setAuthMode(b.getAttribute('data-mode'), '');
    var f = $('authModal').querySelector('form:not([hidden]) input');
    if (f) f.focus();
  });
  document.addEventListener('click', function (e) {
    var t = e.target.closest('.pwt');
    if (t) {
      var inp = $(t.getAttribute('data-for')), show = inp.type === 'password';
      inp.type = show ? 'text' : 'password';
      t.textContent = show ? 'Hide' : 'Show';
      t.setAttribute('aria-pressed', show);
    }
    if (!e.target.closest('#userBox')) closeUserMenu();
  });

  function failLogin() {
    failN++;
    if (failN >= 5) { failUntil = Date.now() + 30000; failN = 0; }
    fe('l-pw', 'Incorrect email or password.');
  }
  function loginAs(u) {
    user = u; sset(SESS, u.email);
    $('loginForm').reset(); $('registerForm').reset();
    areaTouched = false;
    renderUser();
    closeAuth();
    toast('Welcome, ' + u.name.split(' ')[0] + '.');
    prefill();
    if (pendingCheckout) {
      pendingCheckout = false;
      if ($('drawer').classList.contains('open')) $('submitBtn').focus();
    }
  }
  $('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var email = $('l-email').value.trim().toLowerCase(), pw = $('l-pw').value;
    var ok = fe('l-email', EMAIL.test(email) ? '' : 'Enter a valid email address.');
    ok = fe('l-pw', pw ? '' : 'Enter your password.') && ok;
    if (!ok) return;
    if (Date.now() < failUntil) { fe('l-pw', 'Too many attempts. Try again in 30 seconds.'); return; }
    var u = users()[email];
    if (!u) { failLogin(); return; }
    hashPw(pw, u.salt).then(function (h) {
      if (h !== u.hash) { failLogin(); return; }
      failN = 0; loginAs(u);
    });
  });
  $('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var name = $('r-name').value.trim(), email = $('r-email').value.trim().toLowerCase();
    var phone = $('r-phone').value.replace(/[\s-]/g, ''), pw = $('r-pw').value, pw2 = $('r-pw2').value;
    var ok = fe('r-name', name.length < 2 ? 'Enter your full name.' : '');
    ok = fe('r-email', !EMAIL.test(email) ? 'Enter a valid email address.' : (users()[email] ? 'This email is already registered. Please log in.' : '')) && ok;
    ok = fe('r-phone', PHONE.test(phone) ? '' : 'Invalid phone number, for example 0812 3456 7890.') && ok;
    ok = fe('r-pw', pwProblem(pw)) && ok;
    ok = fe('r-pw2', pw2 === pw ? '' : 'Passwords do not match.') && ok;
    ok = fe('r-terms', $('r-terms').checked ? '' : 'Tick the agreement box to continue.') && ok;
    if (!ok) return;
    var salt = newSalt();
    hashPw(pw, salt).then(function (h) {
      var u = { email: email, name: name, phone: phone, salt: salt, hash: h, addr: '', area: 0, created: Date.now() };
      saveUser(u);
      loginAs(u);
    });
  });
  $('forgotForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var email = $('f-email').value.trim().toLowerCase();
    if (!fe('f-email', EMAIL.test(email) ? '' : 'Enter a valid email address.')) { $('f-ok').textContent = ''; return; }
    $('f-ok').textContent = 'If that email is registered, a reset link will be sent. Since this is a demo site, no email is actually sent.';
  });

  /* Header and user menu */
  function renderUser() {
    $('guestBox').hidden = !!user; $('userBox').hidden = !user;
    $('loginHint').hidden = !!user;
    if (user) {
      $('uInit').textContent = user.name.trim().charAt(0).toUpperCase();
      $('uName').textContent = user.name.trim().split(' ')[0];
      $('uMail').textContent = user.email;
    }
    renderCart();
  }
  function closeUserMenu() { $('userMenu').hidden = true; $('userBtn').setAttribute('aria-expanded', 'false'); }
  $('userBtn').addEventListener('click', function () {
    var open = $('userMenu').hidden;
    $('userMenu').hidden = !open;
    $('userBtn').setAttribute('aria-expanded', open);
  });
  $('userMenu').addEventListener('click', function (e) {
    var b = e.target.closest('[data-go]');
    if (!b) return;
    closeUserMenu();
    var go = b.getAttribute('data-go');
    if (go === 'logout') logout(); else showView('account', go);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (!$('authModal').hidden) { pendingCheckout = false; closeAuth(); }
    else if (!$('userMenu').hidden) { closeUserMenu(); $('userBtn').focus(); }
  });
  function logout() {
    sset(SESS, null); user = null; voucher = ''; $('voucherCode').value = '';
    renderUser(); showView('home');
    toast('You have been logged out.');
  }
  function prefill() {
    if (!user) return;
    if (!$('address').value && user.addr) $('address').value = user.addr;
    if (!areaTouched && user.area != null) $('area-sel').selectedIndex = user.area;
    renderCart();
  }

  /* Views */
  function showView(v, tab) {
    if (v === 'account' && !user) { openAuth('login', 'Log in to open your account.'); return; }
    $('homeView').hidden = (v === 'account');
    $('accountView').hidden = (v !== 'account');
    if (v === 'account') { renderAccount(); setTab(tab === 'history' ? 'history' : 'profile'); }
    window.scrollTo(0, 0);
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    e.preventDefault();
    if (!$('accountView').hidden) showView('home');
    if (id === 'top') { window.scrollTo(0, 0); return; }
    var el = document.getElementById(id);
    if (el) setTimeout(function () { el.scrollIntoView(); }, 0);
  });

  /* Account view */
  $('p-area').innerHTML = $('area-sel').innerHTML;
  function setTab(t) {
    $('profilePanel').hidden = t !== 'profile'; $('historyPanel').hidden = t !== 'history';
    $('tabProfile').setAttribute('aria-selected', t === 'profile');
    $('tabHistory').setAttribute('aria-selected', t === 'history');
    if (t === 'history') renderHistory();
  }
  $('acctTabs').addEventListener('click', function (e) {
    var b = e.target.closest('[data-tab]');
    if (b) setTab(b.getAttribute('data-tab'));
  });
  $('aOut').addEventListener('click', logout);

  function orderStatus(o) {
    if (o.cancelled) return { t: 'Cancelled', k: 'bad' };
    var m = (Date.now() - o.t) / 60000;
    if (m < 2) return { t: 'Awaiting confirmation', k: 'go', cancel: true };
    if (m < o.prep + 2) return { t: 'Being cooked', k: 'go' };
    if (m < o.lo) return { t: 'On the way', k: 'go' };
    return { t: 'Completed', k: 'ok' };
  }
  function renderHistory() {
    var list = ordersOf();
    if (!list.length) {
      $('history').innerHTML = '<div class="panel"><p class="muted">No orders yet. Your first order can use code NEW20.</p><p style="margin-top:14px"><a class="btn btn-primary" href="#menu">View menu</a></p></div>';
      return;
    }
    $('history').innerHTML = list.map(function (o) {
      var s = orderStatus(o);
      var when = new Date(o.t).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
      var items = o.items.map(function (i) { return i.q + 'x ' + esc(i.n); }).join(', ');
      return '<article class="order"><div class="order-top"><b class="mono">' + esc(o.no) + '</b><span class="pill ' + s.k + '">' + s.t + '</span></div>' +
        '<p>' + items + '</p>' +
        '<p>' + esc(when) + ' &middot; ' + esc(o.area) + ' &middot; ' + esc(o.pay) + '</p>' +
        '<div class="order-top"><b class="mono">' + rp(o.total) + '</b><span class="order-act">' +
        (s.cancel ? '<button class="btn-sm" type="button" data-cancel="' + esc(o.no) + '">Cancel</button>' : '') +
        '<button class="btn-sm" type="button" data-reorder="' + esc(o.no) + '">Order again</button></span></div></article>';
    }).join('');
  }
  $('history').addEventListener('click', function (e) {
    var c = e.target.closest('[data-cancel]'), r = e.target.closest('[data-reorder]');
    if (c) {
      var no = c.getAttribute('data-cancel'), all = allOrders();
      (all[user.email] || []).forEach(function (o) { if (o.no === no && orderStatus(o).cancel) o.cancelled = true; });
      sset(ORD, all); renderHistory(); renderAccount(); toast('Order ' + no + ' cancelled.');
    }
    if (r) {
      var no2 = r.getAttribute('data-reorder');
      ordersOf().forEach(function (o) {
        if (o.no !== no2) return;
        o.items.forEach(function (i) { if (byId[i.id]) cart[i.id] = Math.min(20, (cart[i.id] || 0) + i.q); });
      });
      save(); renderGrid(); renderCart(); showView('home'); openDrawer();
      toast('Items added to your cart.');
    }
  });
  setInterval(function () {
    if (!$('accountView').hidden && !$('historyPanel').hidden) renderHistory();
  }, 30000);

  function renderAccount() {
    var list = ordersOf(), spent = 0;
    list.forEach(function (o) { if (!o.cancelled) spent += o.total; });
    $('aHello').textContent = 'Hello, ' + user.name.trim().split(' ')[0];
    $('aMeta').textContent = user.email;
    $('aCount').textContent = list.length;
    $('aSpent').textContent = rp(spent);
    $('p-name').value = user.name; $('p-phone').value = user.phone || '';
    $('p-addr').value = user.addr || ''; $('p-area').selectedIndex = user.area || 0;
    ['p-name', 'p-phone', 'c-old', 'c-new'].forEach(function (id) { fe(id, ''); });
  }
  $('profileForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var name = $('p-name').value.trim(), phone = $('p-phone').value.replace(/[\s-]/g, '');
    var ok = fe('p-name', name.length < 2 ? 'Enter your full name.' : '');
    ok = fe('p-phone', (!phone || PHONE.test(phone)) ? '' : 'Invalid phone number, for example 0812 3456 7890.') && ok;
    if (!ok) return;
    user.name = name; user.phone = phone; user.addr = $('p-addr').value.trim(); user.area = $('p-area').selectedIndex;
    saveUser(user); areaTouched = false; renderUser(); renderAccount(); toast('Profile saved.');
  });
  $('passwordForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var oldPw = $('c-old').value, newPw = $('c-new').value;
    var ok = fe('c-old', oldPw ? '' : 'Enter your current password.');
    ok = fe('c-new', pwProblem(newPw)) && ok;
    if (!ok) return;
    hashPw(oldPw, user.salt).then(function (h) {
      if (h !== user.hash) { fe('c-old', 'Current password is incorrect.'); return; }
      var salt = newSalt();
      hashPw(newPw, salt).then(function (h2) {
        user.salt = salt; user.hash = h2; saveUser(user);
        $('passwordForm').reset(); toast('Password changed.');
      });
    });
  });

  /* Voucher */
  $('vApply').addEventListener('click', function () {
    var code = $('voucherCode').value.trim().toUpperCase();
    if (!code) { $('vMsg').className = 'vmsg'; $('vMsg').textContent = 'Enter a voucher code first.'; return; }
    if (!VOUCHERS[code]) { voucher = ''; renderCart(); $('vMsg').className = 'vmsg'; $('vMsg').textContent = 'Unknown code. Try SAVE10.'; return; }
    voucher = code; renderCart();
  });
  $('voucherCode').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); $('vApply').click(); } });
  $('vClear').addEventListener('click', function () { voucher = ''; $('voucherCode').value = ''; renderCart(); });
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-voucher]');
    if (!b) return;
    voucher = b.getAttribute('data-voucher'); $('voucherCode').value = voucher; renderCart();
    toast('Code ' + voucher + ' added to your cart.');
  });

  /* Contact */
  $('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var n = $('k-name').value.trim(), m = $('k-email').value.trim(), t = $('k-msg').value.trim();
    var ok = fe('k-name', n.length < 2 ? 'Enter your name.' : '');
    ok = fe('k-email', EMAIL.test(m) ? '' : 'Enter a valid email address.') && ok;
    ok = fe('k-msg', t.length < 10 ? 'Write a message of at least 10 characters.' : '') && ok;
    if (!ok) { $('k-ok').textContent = ''; return; }
    $('k-ok').textContent = 'Thank you, ' + n.split(' ')[0] + '. Since this is a demo site, the message is not sent to anyone.';
    $('contactForm').reset();
  });

  /* Start */
  var em = sget(SESS, null);
  if (em && users()[em]) user = users()[em];
  renderUser();
  renderChips(); renderGrid(); renderCart();
})();
