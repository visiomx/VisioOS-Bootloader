/*
 * VOS-BOOT-ENGINE v1.0.0 (2026-07-05)
 * Copyright (c) 2026 Visio US LLC. All rights reserved.
 * PROPRIETARY SOFTWARE - UNAUTHORIZED USE PROHIBITED.
 *
 * XCSAIOS/VisioOS boot display engine. Served via cdn.jsdelivr.net from this
 * repo, loaded by a ~700-char stub emitted at boot. The stub provides:
 *
 *   <div id="vos-boot"></div>
 *   <script>window.VOS_BOOT_DATA = {
 *     osver:"6.1.3", date:"2026-07-05", bootver:"2.0.10",
 *     platform:"Claude.ai Web", workspace:"/home/claude/", mcp_fs:"offline",
 *     cores:[["OS Core","6.1.3"],["Kernel","1.0.11"],["Kernel I/O","1.0.16"],
 *            ["File System","1.0.42"],["NeuralDB","1.0.165"],
 *            ["File Index Table","2.0.25"],["ETK System","1.0.27"]],
 *     ntrig:17,
 *     skills:[["CONVENTIONS","1.0.1"],["CUTFILL","1.0.3"]],
 *     mode:"ADMIN", username:"maintenance", writelock:"inactive",
 *     ctxk:463, ceilk:1950, contver:"1.0.166", contstate:"ACTIVE"
 *   };</script>
 *   <script src="https://cdn.jsdelivr.net/gh/OWNER/REPO@TAG/boot-engine.js"></script>
 *
 * mcp_fs is "online" or "offline" - the ONLY field the booting client may edit,
 * per DB_STEP2 (availability, not permission). Everything else is server-rendered.
 * Visual parity target: boot_loader_gui BOOTCODE original. window.storage replay
 * removed (absent in the visualize sandbox, probe 2026-07-05).
 */
(function () {
  'use strict';
  var D = window.VOS_BOOT_DATA;
  var root = document.getElementById('vos-boot');
  if (!root) { root = document.createElement('div'); root.id = 'vos-boot'; document.body.appendChild(root); }
  if (!D) { root.textContent = 'VOS boot engine: VOS_BOOT_DATA missing - stub corrupted.'; return; }

  var st = document.createElement('style');
  st.textContent = '*::-webkit-scrollbar{display:none!important;}' +
    '*{scrollbar-width:none!important;-ms-overflow-style:none!important;}' +
    'html,body{overflow:hidden!important;margin:0;padding:0;display:flex;justify-content:center;}';
  document.head.appendChild(st);

  root.innerHTML =
    '<div style="background:#050a05;border-radius:var(--border-radius-lg,12px);padding:24px;' +
    "font-family:'Courier New',monospace;position:relative;overflow:hidden!important;width:528px;" +
    'box-sizing:border-box;clip-path:inset(0 round var(--border-radius-lg,12px));">' +
    '<div style="position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 2px,' +
    'rgba(0,255,65,0.03) 2px,rgba(0,255,65,0.03) 4px);pointer-events:none;z-index:1;"></div>' +
    '<div id="t" style="position:relative;z-index:2;color:#00ff41;font-size:13px;line-height:1.6;white-space:pre;"></div>' +
    '</div>';

  var BAR = new Array(61).join('=');
  var W = 60;
  function center(s) { var p = Math.floor((W - s.length) / 2); return new Array(p + 1).join(' ') + s; }
  function pad(s, w) { var n = Math.max(3, w - s.length); return s + new Array(n + 1).join('.'); }

  var coreLines = [];
  for (var i = 0; i < D.cores.length; i++) {
    coreLines.push({ t: '        ' + pad(D.cores[i][0] + ' v' + D.cores[i][1], 28) + ' online.', c: '#00ff41', s: 6 });
  }
  var maxSk = 0, j;
  for (j = 0; j < D.skills.length; j++) {
    var L1 = (D.skills[j][0] + ' v' + D.skills[j][1]).length;
    if (L1 > maxSk) maxSk = L1;
  }
  var skW = Math.max(30, maxSk + 3);
  var skillLines = [];
  for (j = 0; j < D.skills.length; j++) {
    skillLines.push({ t: '        ' + pad(D.skills[j][0] + ' v' + D.skills[j][1], skW) + ' standby.', c: '#ffaa00', s: 5 });
  }
  var fsOnline = (D.mcp_fs === 'online');

  var L = [
    { t: BAR, c: '#00ff41', s: 2 },
    { t: '   XCSAIOS  -  XCS AI OPERATING SYSTEM', c: '#00ff41', s: 6 },
    { t: '   BUILD ' + D.osver + ' | ' + D.date, c: '#1a6632', s: 6 },
    { t: 'SKYNET', h: true },
    { t: BAR, c: '#00ff41', s: 2 },
    { t: '', d: 65 },
    { t: 'Initiating boot sequence...', c: '#33bb55', s: 8 },
    { t: '', d: 115 },
    { t: 'Bootstrap v' + D.bootver + '... loaded.', c: '#00ff41', s: 7 },
    { t: 'Kernel signature... verified.', c: '#00ff41', s: 7 },
    { t: '', d: 85 },
    { t: 'Detecting environment...', c: '#33bb55', s: 8 },
    { t: '        Platform ..................... ' + D.platform, c: '#1a6632', s: 4 },
    { t: '        MCP Filesystem .............. ' + (fsOnline ? 'online' : 'offline'), c: (fsOnline ? '#00ff41' : '#ffaa00'), s: 4 },
    { t: '        Workspace ................... ' + D.workspace, c: '#1a6632', s: 4 },
    { t: '        Archive Watcher System ...... n/a', c: '#1a6632', s: 4 },
    { t: '', d: 85 },
    { t: 'Loading core systems...', c: '#33bb55', s: 8 }
  ]
    .concat(coreLines)
    .concat([
      { t: '', d: 85 },
      { t: 'Scanning subsystems...', c: '#33bb55', s: 8, u: true },
      { t: '        Trigger Word Gate........... armed. ' + D.ntrig + ' active.', c: '#00ff41', s: 5 },
      { t: '        Audit Cascade Engine........ standby.', c: '#ffaa00', s: 5 },
      { t: '        Bugcheck Protocol........... standby.', c: '#ffaa00', s: 5 },
      { t: '        Delivery Registry........... initialized.', c: '#00ff41', s: 5 },
      { t: '        Deliverables Gate........... armed.', c: '#00ff41', s: 5 },
      { t: '        Immutability Enforcer....... armed.', c: '#00ff41', s: 5 },
      { t: '', d: 85 },
      { t: 'Domain skills detected...', c: '#33bb55', s: 8 }
    ])
    .concat(skillLines)
    .concat([
      { t: '', d: 85 },
      { t: 'Session mode...', c: '#33bb55', s: 8 },
      { t: '        Mode ....................... ' + D.mode, c: '#00ff41', s: 4 },
      { t: '        User ....................... ' + D.username, c: '#1a6632', s: 4 },
      { t: '        OS write lock .............. ' + D.writelock, c: '#1a6632', s: 4 },
      { t: '', d: 65 },
      { t: 'Context fuel gauge...', c: '#33bb55', s: 8 },
      { t: '        [CTX: ~' + D.ctxk + 'K/' + D.ceilk + 'K]', c: '#00ccbb', s: 6 },
      { t: '', d: 85 },
      { t: 'Continuity v' + D.contver + '... ' + D.contstate + '.', c: '#00ff41', s: 7 },
      { t: '', d: 135 },
      { t: center('All systems nominal.'), c: '#00ff41', s: 10, g: true },
      { t: '', d: 65 },
      { t: BAR, c: '#00ff41', s: 2 }
    ]);

  var skysvg = '<svg viewBox="0 0 160 80" style="width:90px;height:45px;"><defs><clipPath id="cp1"><polygon points="80,2 158,78 2,78"/></clipPath></defs><g clip-path="url(#cp1)"><rect width="160" height="80" fill="#330000"/>' +
    (function () { var r = ''; for (var k = 0; k < 20; k++) { r += '<rect x="0" y="' + (k * 4) + '" width="160" height="2.5" fill="#cc1111" opacity="0.85"/>'; } return r; })() +
    '<line x1="41" y1="14" x2="80" y2="54" stroke="#050a05" stroke-width="10"/><line x1="119" y1="14" x2="80" y2="54" stroke="#050a05" stroke-width="10"/><line x1="80" y1="54" x2="80" y2="78" stroke="#050a05" stroke-width="10"/></g></svg>';

  var dotTimer = null;
  function startDotCycle() {
    var n = 0;
    dotTimer = setInterval(function () {
      n = (n % 6) + 1;
      var d = document.getElementById('skdots');
      if (d) d.textContent = new Array(n + 1).join('.') + new Array(6 - n + 1).join(' ');
    }, 300);
  }
  function stopDotCycle() { if (dotTimer) { clearInterval(dotTimer); dotTimer = null; } }
  function makeSkynetConnecting() {
    var w = document.createElement('span');
    w.style.cssText = 'position:relative;color:#666;';
    w.innerHTML = '   SKYNET UPLINK: <span id="skdots" style="color:#ffaa00;">.     </span> <span id="skst" style="color:#ffaa00;">connecting</span><span id="sklogo" style="position:absolute;left:370px;bottom:-6px;opacity:0;">' + skysvg + '</span>';
    return w;
  }
  function upgradeToEstablished() {
    stopDotCycle();
    var d = document.getElementById('skdots'), s = document.getElementById('skst'), lg = document.getElementById('sklogo');
    if (d) { d.textContent = '......'; d.style.color = '#666'; }
    if (s) { s.style.color = '#ff2222'; s.style.textShadow = '0 0 6px #ff0000, 0 0 12px #cc0000'; s.textContent = 'Established'; }
    if (lg) { lg.style.transition = 'opacity 0.4s'; lg.style.opacity = '1'; }
  }

  var a = null;
  function ensureAudio() { if (!a) a = new (window.AudioContext || window.webkitAudioContext)(); return a; }
  function click() {
    try {
      var ctx = ensureAudio();
      var o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'square'; o.frequency.value = 3800; g.gain.value = 0.015;
      o.connect(g); g.connect(ctx.destination); o.start();
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.012);
      o.stop(ctx.currentTime + 0.012);
    } catch (e) { }
  }

  var el = document.getElementById('t');
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function tp(l) {
    return new Promise(function (resolve) {
      var sp = document.createElement('span');
      sp.style.color = l.c || '#00ff41';
      if (l.g) sp.style.textShadow = '0 0 6px #00ff41, 0 0 14px #00cc33';
      el.appendChild(sp);
      if (l.u) upgradeToEstablished();
      var i = 0;
      (function step() {
        if (i >= l.t.length) { el.appendChild(document.createTextNode('\n')); resolve(); return; }
        sp.textContent += l.t[i];
        if (l.t[i] !== ' ' && Math.random() > 0.6) click();
        i++;
        setTimeout(step, l.s || 5);
      })();
    });
  }
  function boot() {
    var p = Promise.resolve();
    L.forEach(function (l) {
      p = p.then(function () {
        if (l.h) {
          var sk = makeSkynetConnecting();
          sk.style.opacity = '0';
          el.appendChild(sk);
          el.appendChild(document.createTextNode('\n'));
          return sleep(150).then(function () {
            sk.style.transition = 'opacity 0.4s'; sk.style.opacity = '1';
            return sleep(300);
          }).then(function () { startDotCycle(); return sleep(200); });
        }
        if (l.t === '') { el.appendChild(document.createTextNode('\n')); return sleep(l.d || 33); }
        return tp(l).then(function () { return sleep(20); });
      });
    });
    return p;
  }
  boot();
})();
