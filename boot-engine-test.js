/*
 * VOS-BOOT-ENGINE v2.0.9 (2026-07-05)
 * Copyright (c) 2026 Visio US LLC. All rights reserved.
 * PROPRIETARY SOFTWARE - UNAUTHORIZED USE PROHIBITED.
 *
 * XCSAIOS/VisioOS boot display engine - three.js CRT edition.
 * v2.0.9: glow dial pass - 'Established' tightened + stacked (16/8/8/4 hot
 * strikes: wide 24/12 diluted to sub-quantum alpha in the dim tube top),
 * Cyberdyne halo softened to single 12 fill + round-join glow stroke so
 * corners carry glow evenly. 'All systems nominal.' untouched (blessed).
 * v2.0.8: extra-glow pass - triple-strike bloom on 'All systems nominal.'
 * and SKYNET 'Established' (v1 layered text-shadow intensity), red halo
 * underlay behind the Cyberdyne logo; banner brand XCSAIOS -> VisioOS.
 * v2.0.7: scanlines pixel-locked static (integer 3px period, floor-based -
 * no drift term, no sub-pixel moire doubling).
 * v2.0.6: split scanlines (0.42 field / 0.14 text - glow bridges the gaps,
 * near-solid glyphs with faint striping), classic block cursor while typing,
 * breathing cycle 5s -> 4s.
 * v2.0.5: thin-duty scanlines (glyphs keep ~80 percent of pixels), CRT bar
 * reshaped 3.5-lines-tall hard-bottom fade-up, saturation stage for vibrancy.
 * v2.0.4: roll bar fixed downward @10s sweep, 3x stronger and wider; field
 * darkened; breathing slowed to 5s damaged-tube cycle; text +40 percent.
 * v2.0.3: RobCo field pass - the whole tube glows: green phosphor FIELD
 * (center-bright, strong tube vignette) with text composited additively on
 * top; scan bands at near-double contrast carving the full field; roll bar,
 * flicker, per-glyph bloom retained. Flat glass. 60s post-animation persist.
 * Same terminal, same text, same pacing, same sounds as v1 - now drawn to a
 * canvas texture and rendered through a WebGL CRT shader (barrel curvature,
 * scanlines, vignette, phosphor flicker). Requires three.js r128 (loaded from
 * cdnjs at runtime). If three.js fails to load or WebGL init throws, the full
 * v1 DOM renderer (embedded below) takes over - identical classic output.
 *
 * Data contract (unchanged from v1): window.VOS_BOOT_DATA
 *   { osver, date, bootver, platform, workspace, mcp_fs("online"|"offline"),
 *     cores:[[name,ver]...], ntrig, skills:[[name,ver]...],
 *     mode, username, writelock, ctxk, ceilk, contver, contstate }
 * mcp_fs is the ONLY field the booting client may edit (DB_STEP2).
 */
(function () {
  'use strict';
  var D = window.VOS_BOOT_DATA;
  var root = document.getElementById('vos-boot');
  if (!root) { root = document.createElement('div'); root.id = 'vos-boot'; document.body.appendChild(root); }
  if (!D) { root.textContent = 'VOS boot engine: VOS_BOOT_DATA missing - stub corrupted.'; return; }

  /* ---------- shared: line array built from data ---------- */
  var BAR = new Array(61).join('=');
  var W = 60;
  function center(s) { var p = Math.floor((W - s.length) / 2); return new Array(p + 1).join(' ') + s; }
  function pad(s, w) { var n = Math.max(3, w - s.length); return s + new Array(n + 1).join('.'); }

  var coreLines = [], i, j;
  for (i = 0; i < D.cores.length; i++) {
    coreLines.push({ t: '        ' + pad(D.cores[i][0] + ' v' + D.cores[i][1], 28) + ' online.', c: '#00ff41', s: 6 });
  }
  var maxSk = 0;
  for (j = 0; j < D.skills.length; j++) {
    var l1 = (D.skills[j][0] + ' v' + D.skills[j][1]).length;
    if (l1 > maxSk) maxSk = l1;
  }
  var skW = Math.max(30, maxSk + 3);
  var skillLines = [];
  for (j = 0; j < D.skills.length; j++) {
    skillLines.push({ t: '        ' + pad(D.skills[j][0] + ' v' + D.skills[j][1], skW) + ' standby.', c: '#ffaa00', s: 5 });
  }
  var fsOnline = (D.mcp_fs === 'online');

  var L = [
    { t: BAR, c: '#00ff41', s: 2 },
    { t: '   VisioOS  -  XCS AI OPERATING SYSTEM', c: '#00ff41', s: 6 },
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

  /* ---------- shared: click audio ---------- */
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

  /* ================= three.js CRT renderer ================= */
  function crtBoot() {
    var CW = 528, PADL = 24, PADT = 24, LH = 21, FS = 13, SC = 2;
    var CH = PADT * 2 + L.length * LH;
    var cw = CW * SC, ch = CH * SC;

    root.innerHTML = '';
    var glc = document.createElement('canvas');
    glc.style.cssText = 'display:block;border-radius:12px;width:' + CW + 'px;height:' + CH + 'px;';
    root.appendChild(glc);

    var tcan = document.createElement('canvas');
    tcan.width = cw; tcan.height = ch;
    var ctx = tcan.getContext('2d');

    var ren = new THREE.WebGLRenderer({ canvas: glc, antialias: false, alpha: true });
    ren.setSize(CW, CH, false);
    ren.setClearColor(0x000000, 0);
    var scene = new THREE.Scene();
    var cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    var tex = new THREE.CanvasTexture(tcan);
    tex.minFilter = THREE.LinearFilter; tex.magFilter = THREE.LinearFilter;
    var mat = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: { tDiffuse: { value: tex }, time: { value: 0 } },
      vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.0,1.0);}',
      fragmentShader: [
        'varying vec2 vUv;uniform sampler2D tDiffuse;uniform float time;',
        'void main(){',
        ' vec2 uv=vUv;',
        ' vec3 tex=texture2D(tDiffuse,uv).rgb;',
        ' tex+=texture2D(tDiffuse,uv+vec2(0.0007,0.0)).rgb*vec3(0.04,0.0,0.0);',
        ' tex+=texture2D(tDiffuse,uv-vec2(0.0007,0.0)).rgb*vec3(0.0,0.0,0.04);',
        ' float vig=16.0*uv.x*uv.y*(1.0-uv.x)*(1.0-uv.y);',
        ' vec3 field=vec3(0.05,0.17,0.07)*pow(vig,0.50);',
        ' float py=floor(uv.y*' + CH.toFixed(1) + ');',
        ' float lf=(mod(py,3.0)<1.0)?1.0:0.0;',
        ' vec3 col=field*(1.0-0.42*lf)+tex*(1.05+0.20*pow(vig,0.30))*(1.0-0.14*lf);',
        ' float rel=fract(uv.y+time*0.10);',
        ' col*=1.0+0.30*smoothstep(0.065,0.0,rel);',
        ' vec3 lum=vec3(dot(col,vec3(0.299,0.587,0.114)));',
        ' col=mix(lum,col,1.35);',
        ' col*=1.0+0.10*sin(time*1.571)+0.008*sin(time*9.0);',
        ' gl_FragColor=vec4(col,1.0);',
        '}'].join('\n')
    });
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));

    /* typewriter state machine */
    var idx = 0, ci = 0, nextAt = 0, endAt = 0, done = false;
    var skyStart = 0, skyEstablished = false;

    function stepState(now) {
      if (done || idx >= L.length) {
        if (!done) { done = true; endAt = now + 60000; }
        return;
      }
      var l = L[idx];
      if (l.h) {
        if (!skyStart) { skyStart = now; nextAt = now + 650; }
        if (now >= nextAt) { idx++; ci = 0; nextAt = now + 20; }
        return;
      }
      if (l.t === '') {
        if (now >= nextAt) {
          if (nextAt === 0) { nextAt = now + (l.d || 33); return; }
          idx++; ci = 0; nextAt = 0;
        }
        return;
      }
      if (l.u && !skyEstablished) skyEstablished = true;
      while (now >= nextAt && ci < l.t.length) {
        var chr = l.t[ci];
        if (chr !== ' ' && Math.random() > 0.6) click();
        ci++;
        nextAt = (nextAt || now) + (l.s || 5);
      }
      if (ci >= l.t.length) { idx++; ci = 0; nextAt = now + 20; }
    }

    function drawSkynet(y, now) {
      var x = PADL * SC, fpx = FS * SC;
      ctx.fillStyle = '#666666';
      ctx.fillText('   SKYNET UPLINK: ', x, y);
      var lab = ctx.measureText('   SKYNET UPLINK: ').width;
      var dots, stat, statColor, glow = false;
      if (skyEstablished) { dots = '......'; stat = 'Established'; statColor = '#ff2222'; glow = true; }
      else {
        var n = 1 + Math.floor(((now - skyStart) / 300)) % 6;
        dots = new Array(n + 1).join('.') + new Array(6 - n + 1).join(' ');
        stat = 'connecting'; statColor = '#ffaa00';
      }
      ctx.fillStyle = skyEstablished ? '#666666' : '#ffaa00';
      ctx.fillText(dots, x + lab, y);
      var dw = ctx.measureText(dots + ' ').width;
      ctx.fillStyle = statColor;
      if (glow) {
        ctx.shadowColor = '#ff1111';
        ctx.shadowBlur = 16 * SC; ctx.fillText(stat, x + lab + dw, y);
        ctx.shadowBlur = 8 * SC; ctx.fillText(stat, x + lab + dw, y);
        ctx.shadowBlur = 8 * SC; ctx.fillText(stat, x + lab + dw, y);
        ctx.shadowBlur = 4 * SC;
      }
      ctx.fillText(stat, x + lab + dw, y);
      ctx.shadowBlur = 0;
      var vis = skyEstablished ? 1 : Math.min(1, Math.max(0, (now - skyStart - 150) / 400));
      if (vis > 0) {
        var lx = x + 370 * SC, lw = 90 * SC, lhh = 45 * SC, ly = y - lhh + fpx + 6 * SC;
        ctx.save();
        ctx.globalAlpha = vis;
        ctx.beginPath();
        ctx.moveTo(lx + lw / 2, ly);
        ctx.lineTo(lx + lw * 0.9875, ly + lhh * 0.975);
        ctx.lineTo(lx + lw * 0.0125, ly + lhh * 0.975);
        ctx.closePath();
        ctx.shadowColor = '#ff2222'; ctx.shadowBlur = 12 * SC;
        ctx.fillStyle = '#cc1111'; ctx.fill();
        ctx.lineJoin = 'round'; ctx.lineWidth = 2.5 * SC;
        ctx.strokeStyle = '#cc1111'; ctx.shadowBlur = 8 * SC; ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.clip();
        ctx.fillStyle = '#330000'; ctx.fillRect(lx, ly, lw, lhh);
        ctx.fillStyle = '#cc1111'; ctx.globalAlpha = vis * 0.85;
        for (var s = 0; s < 20; s++) ctx.fillRect(lx, ly + s * (lhh / 20), lw, lhh / 32);
        ctx.globalAlpha = vis;
        ctx.strokeStyle = '#050a05'; ctx.lineWidth = 10 * SC * (45 / 80);
        ctx.beginPath();
        ctx.moveTo(lx + lw * 0.256, ly + lhh * 0.175); ctx.lineTo(lx + lw * 0.5, ly + lhh * 0.675);
        ctx.moveTo(lx + lw * 0.744, ly + lhh * 0.175); ctx.lineTo(lx + lw * 0.5, ly + lhh * 0.675);
        ctx.moveTo(lx + lw * 0.5, ly + lhh * 0.675); ctx.lineTo(lx + lw * 0.5, ly + lhh * 0.975);
        ctx.stroke();
        ctx.restore();
      }
    }

    function drawFrame(now) {
      ctx.fillStyle = '#050a05';
      ctx.fillRect(0, 0, cw, ch);
      ctx.font = (FS * SC) + 'px "Courier New",monospace';
      ctx.textBaseline = 'top';
      var y = PADT * SC;
      for (var k = 0; k < L.length && k <= idx; k++) {
        var l = L[k];
        if (l.h) { drawSkynet(y, now); }
        else if (l.t !== '') {
          var txt = (k < idx) ? l.t : l.t.slice(0, ci);
          ctx.shadowColor = l.c || '#00ff41';
          ctx.fillStyle = l.c || '#00ff41';
          ctx.shadowBlur = (l.g ? 26 : 5) * SC;
          if (txt) ctx.fillText(txt, PADL * SC, y);
          if (txt && l.g) {
            ctx.shadowBlur = 12 * SC; ctx.fillText(txt, PADL * SC, y);
            ctx.shadowBlur = 6 * SC; ctx.fillText(txt, PADL * SC, y);
          }
          if (k === idx && !done) {
            var cwid = ctx.measureText(txt).width;
            ctx.fillRect(PADL * SC + cwid + 2, y, ctx.measureText('M').width, FS * SC * 1.05);
          }
          ctx.shadowBlur = 0;
        }
        y += LH * SC;
      }
    }

    function anim(t) {
      stepState(t);
      drawFrame(t);
      tex.needsUpdate = true;
      mat.uniforms.time.value = t / 1000;
      ren.render(scene, cam);
      if (!done || t < endAt) requestAnimationFrame(anim);
    }
    requestAnimationFrame(anim);
  }

  /* ================= v1 DOM fallback renderer ================= */
  function domBoot() {
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
    var el = document.getElementById('t');
    function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
    function tp(l) {
      return new Promise(function (resolve) {
        var sp = document.createElement('span');
        sp.style.color = l.c || '#00ff41';
        if (l.g) sp.style.textShadow = '0 0 6px #00ff41, 0 0 14px #00cc33';
        el.appendChild(sp);
        if (l.u) upgradeToEstablished();
        var k = 0;
        (function step() {
          if (k >= l.t.length) { el.appendChild(document.createTextNode('\n')); resolve(); return; }
          sp.textContent += l.t[k];
          if (l.t[k] !== ' ' && Math.random() > 0.6) click();
          k++;
          setTimeout(step, l.s || 5);
        })();
      });
    }
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
  }

  /* ---------- loader: three.js from cdnjs, DOM fallback on any failure ---------- */
  function start() {
    try { crtBoot(); } catch (e) { try { domBoot(); } catch (e2) { root.textContent = 'VOS boot engine failed: ' + e2; } }
  }
  if (window.THREE) { start(); }
  else {
    var s = document.createElement('script');
    var to = setTimeout(function () { s.onload = s.onerror = null; domBoot(); }, 10000);
    s.onload = function () { clearTimeout(to); start(); };
    s.onerror = function () { clearTimeout(to); domBoot(); };
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    document.head.appendChild(s);
  }
})();
