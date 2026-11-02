/* ============================================================
   ONE WISH WILLOW — generative artwork
   The willow is drawn in SVG at load time: trunk, roots,
   weeping branches, leaves, ribbons, and a face in the bark.
   ============================================================ */

(function () {
  "use strict";

  const NS = "http://www.w3.org/2000/svg";
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const small = window.innerWidth < 820;

  function el(name, attrs) {
    const node = document.createElementNS(NS, name);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        node.setAttribute(k, attrs[k]);
      });
    }
    return node;
  }

  function rand(a, b) {
    return a + Math.random() * (b - a);
  }

  function cubicPoint(p0, p1, p2, p3, t) {
    const mt = 1 - t;
    const a = mt * mt * mt;
    const b = 3 * mt * mt * t;
    const c = 3 * mt * t * t;
    const d = t * t * t;
    return {
      x: a * p0.x + b * p1.x + c * p2.x + d * p3.x,
      y: a * p0.y + b * p1.y + c * p2.y + d * p3.y
    };
  }

  function cubicTangent(p0, p1, p2, p3, t) {
    const mt = 1 - t;
    return {
      x: 3 * mt * mt * (p1.x - p0.x) + 6 * mt * t * (p2.x - p1.x) + 3 * t * t * (p3.x - p2.x),
      y: 3 * mt * mt * (p1.y - p0.y) + 6 * mt * t * (p2.y - p1.y) + 3 * t * t * (p3.y - p2.y)
    };
  }

  /* ---------------- the willow ---------------- */

  function buildWillow(mount) {
    if (!mount) return;
    const svg = el("svg", {
      class: "willow-svg",
      viewBox: "0 0 1000 1000",
      preserveAspectRatio: "xMidYMax meet",
      "aria-hidden": "true"
    });

    const defs = el("defs");
    defs.innerHTML = [
      '<linearGradient id="barkGrad" x1="0" y1="0" x2="1" y2="0">',
      '<stop offset="0" stop-color="#1c130d"/>',
      '<stop offset=".32" stop-color="#3a281b"/>',
      '<stop offset=".55" stop-color="#513823"/>',
      '<stop offset=".78" stop-color="#2e2016"/>',
      '<stop offset="1" stop-color="#17100b"/>',
      "</linearGradient>",
      '<linearGradient id="barkLight" x1="0" y1="0" x2="1" y2="0">',
      '<stop offset="0" stop-color="#6b4a2d" stop-opacity="0"/>',
      '<stop offset=".5" stop-color="#7d5a37" stop-opacity=".55"/>',
      '<stop offset="1" stop-color="#4a3320" stop-opacity="0"/>',
      "</linearGradient>",
      '<linearGradient id="leafBack" x1="0" y1="0" x2="0" y2="1">',
      '<stop offset="0" stop-color="#1c4031"/>',
      '<stop offset="1" stop-color="#0a1f18"/>',
      "</linearGradient>",
      '<linearGradient id="leafMid" x1="0" y1="0" x2="1" y2="1">',
      '<stop offset="0" stop-color="#396b4c"/>',
      '<stop offset="1" stop-color="#173a2a"/>',
      "</linearGradient>",
      '<linearGradient id="leafFront" x1="0" y1="0" x2="1" y2="1">',
      '<stop offset="0" stop-color="#b5cf9d"/>',
      '<stop offset=".45" stop-color="#86ae83"/>',
      '<stop offset="1" stop-color="#4f7d5c"/>',
      "</linearGradient>",
      '<linearGradient id="leafGold" x1="0" y1="0" x2="1" y2="1">',
      '<stop offset="0" stop-color="#dbc98c"/>',
      '<stop offset="1" stop-color="#9e9d5f"/>',
      "</linearGradient>",
      '<radialGradient id="treeGlow" cx="50%" cy="42%" r="50%">',
      '<stop offset="0" stop-color="#8fd0a2" stop-opacity=".16"/>',
      '<stop offset=".55" stop-color="#5f9a77" stop-opacity=".07"/>',
      '<stop offset="1" stop-color="#2d5a42" stop-opacity="0"/>',
      "</radialGradient>",
      '<radialGradient id="faceGlow" cx="50%" cy="50%" r="50%">',
      '<stop offset="0" stop-color="#b9e6a6" stop-opacity=".8"/>',
      '<stop offset="1" stop-color="#b9e6a6" stop-opacity="0"/>',
      "</radialGradient>",
      '<filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">',
      '<feGaussianBlur stdDeviation="4" result="b"/>',
      '<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>',
      "</filter>",
      '<filter id="backBlur" x="-30%" y="-30%" width="160%" height="160%">',
      '<feGaussianBlur stdDeviation="1.4"/>',
      "</filter>",
      '<filter id="massBlur" x="-40%" y="-40%" width="180%" height="180%">',
      '<feGaussianBlur stdDeviation="16"/>',
      "</filter>"
    ].join("");
    svg.appendChild(defs);

    // aura behind the canopy
    svg.appendChild(el("ellipse", {
      cx: 500, cy: 360, rx: 410, ry: 320, fill: "url(#treeGlow)"
    }));

    // soft masses of foliage, to give the canopy a body
    const mass = el("g", { class: "foliage-mass", filter: "url(#massBlur)" });
    for (let i = 0; i < 24; i++) {
      mass.appendChild(el("ellipse", {
        cx: 500 + rand(-340, 340),
        cy: 300 + rand(-90, 170),
        rx: rand(45, 120),
        ry: rand(30, 85),
        fill: i % 4 === 0 ? "#1d4835" : "#123227",
        opacity: rand(0.18, 0.42),
        transform: "rotate(" + rand(-30, 30).toFixed(0) + " " + (500 + rand(-340, 340)) + " " + (300 + rand(-90, 170)) + ")"
      }));
    }
    svg.appendChild(mass);

    const back = el("g", { class: "canopy canopy--back", filter: "url(#backBlur)" });
    const mid = el("g", { class: "canopy canopy--mid" });
    const front = el("g", { class: "canopy canopy--front" });
    const trunkG = el("g", { class: "trunk" });
    const faceG = el("g", { class: "willow-face" });
    const ribbonG = el("g", { class: "ribbons" });

    svg.appendChild(back);
    svg.appendChild(trunkG);
    svg.appendChild(faceG);
    svg.appendChild(mid);
    svg.appendChild(front);
    svg.appendChild(ribbonG);

    /* ---- trunk ---- */
    const trunk = el("path", {
      d: "M441 930 C446 846 452 772 460 704 C468 636 468 574 459 520 C471 507 485 499 500 499 C515 499 529 507 541 520 C533 574 533 636 541 704 C549 772 556 846 561 930 Z",
      fill: "url(#barkGrad)"
    });
    trunkG.appendChild(trunk);

    // root flares
    [
      "M447 905 C420 925 392 936 356 946",
      "M556 905 C585 926 616 936 654 946",
      "M470 924 C462 942 452 952 438 962",
      "M534 924 C544 944 556 954 572 962"
    ].forEach(function (d, i) {
      trunkG.appendChild(el("path", {
        d: d, stroke: i < 2 ? "#2a1c13" : "#241810",
        "stroke-width": i < 2 ? 19 : 12, "stroke-linecap": "round", fill: "none"
      }));
    });

    // bark light
    trunkG.appendChild(el("path", {
      d: "M492 512 C486 590 488 670 494 748 C500 826 505 878 507 922",
      stroke: "url(#barkLight)", "stroke-width": 9, "stroke-linecap": "round", fill: "none"
    }));

    // bark grooves
    for (let i = 0; i < 9; i++) {
      const x = rand(466, 534);
      const y = rand(540, 900);
      const len = rand(24, 80);
      trunkG.appendChild(el("path", {
        d: "M" + x + " " + y + " C" + (x - 4) + " " + (y + len * 0.4) + " " + (x + 3) + " " + (y + len * 0.7) + " " + (x - 1) + " " + (y + len),
        stroke: Math.random() > 0.5 ? "#1a120d" : "#5b3f27",
        "stroke-width": rand(0.8, 1.8), opacity: 0.55, fill: "none", "stroke-linecap": "round"
      }));
    }

    // main limbs
    const limbs = [
      { d: "M500 560 C495 492 486 432 466 384", w: 25 },
      { d: "M470 392 C454 356 432 330 404 310", w: 15 },
      { d: "M468 388 C486 342 512 312 544 292", w: 13 },
      { d: "M478 470 C436 438 400 416 362 402", w: 14 },
      { d: "M522 478 C566 446 604 424 644 410", w: 14 },
      { d: "M488 510 C440 494 398 488 356 490", w: 10 },
      { d: "M514 516 C562 500 604 494 648 498", w: 10 },
      { d: "M466 384 C450 352 424 330 392 316", w: 8 },
      { d: "M548 300 C566 274 592 258 620 248", w: 7 },
      { d: "M406 312 C382 292 356 280 328 274", w: 6 }
    ];
    limbs.forEach(function (l) {
      trunkG.appendChild(el("path", {
        d: l.d, stroke: "url(#barkGrad)", "stroke-width": l.w,
        "stroke-linecap": "round", fill: "none"
      }));
    });

    // fine twigs
    for (let i = 0; i < 16; i++) {
      const sx = rand(330, 670);
      const sy = rand(280, 420);
      const ex = sx + rand(-90, 90);
      const ey = sy + rand(-70, 40);
      trunkG.appendChild(el("path", {
        d: "M" + sx + " " + sy + " Q" + ((sx + ex) / 2 + rand(-20, 20)) + " " + ((sy + ey) / 2) + " " + ex + " " + ey,
        stroke: "#3d2a1b", "stroke-width": rand(2, 5), "stroke-linecap": "round", fill: "none", opacity: 0.9
      }));
    }

    /* ---- face in the bark ---- */
    faceG.innerHTML = [
      '<ellipse cx="482" cy="622" rx="7.5" ry="4.6" fill="#0a0b07"/>',
      '<ellipse cx="518" cy="622" rx="7.5" ry="4.6" fill="#0a0b07"/>',
      '<circle class="eye-glow" cx="482" cy="622" r="10" fill="url(#faceGlow)" opacity=".5"/>',
      '<circle class="eye-glow" cx="518" cy="622" r="10" fill="url(#faceGlow)" opacity=".5"/>',
      '<circle cx="482" cy="622" r="1.6" fill="#d7f0bb"/>',
      '<circle cx="518" cy="622" r="1.6" fill="#d7f0bb"/>',
      '<path d="M487 664 C494 658 506 658 513 664 C506 672 494 672 487 664 Z" fill="#0c0a07" opacity=".85"/>'
    ].join("");
    faceG.querySelectorAll("path,ellipse").forEach(function (n) {
      n.setAttribute("filter", "url(#softGlow)");
    });

    /* ---- weeping strands ---- */
    function addStrand(layer, opts) {
      const p0 = { x: opts.sx, y: opts.sy };
      const p1 = {
        x: opts.sx + (opts.ex - opts.sx) * 0.22 + rand(-55, 55),
        y: opts.sy + (opts.ey - opts.sy) * 0.28
      };
      const p2 = {
        x: opts.ex - (opts.ex - opts.sx) * 0.1 + rand(-40, 40),
        y: opts.ey - (opts.ey - opts.sy) * 0.26
      };
      const p3 = { x: opts.ex, y: opts.ey };

      const path = el("path", {
        d: "M" + p0.x + " " + p0.y + " C" + p1.x + " " + p1.y + " " + p2.x + " " + p2.y + " " + p3.x + " " + p3.y,
        stroke: opts.color,
        "stroke-width": opts.width,
        "stroke-linecap": "round",
        fill: "none",
        opacity: opts.opacity
      });
      path.setAttribute("class", "strand");
      path.style.setProperty("--ox", p0.x + "px");
      path.style.setProperty("--oy", p0.y + "px");
      path.style.setProperty("--dur", rand(opts.dur[0], opts.dur[1]).toFixed(2) + "s");
      path.style.setProperty("--delay", (-Math.random() * 8).toFixed(2) + "s");
      layer.appendChild(path);

      if (!opts.leaves) return;

      const count = opts.leaves;
      for (let i = 0; i < count; i++) {
        const t = 0.18 + (i / count) * 0.78 + rand(-0.02, 0.02);
        const pt = cubicPoint(p0, p1, p2, p3, t);
        const tan = cubicTangent(p0, p1, p2, p3, t);
        const angle = Math.atan2(tan.y, tan.x) * 180 / Math.PI - 90 + rand(-18, 18);
        const off = rand(-7, 7);
        const leaf = el("ellipse", {
          cx: pt.x + rand(-4, 4),
          cy: pt.y + off,
          rx: rand(2.4, 4),
          ry: rand(8, 13.5),
          fill: opts.leafColor,
          opacity: rand(0.58, 0.96),
          transform: "rotate(" + angle.toFixed(1) + " " + pt.x + " " + pt.y + ")"
        });
        leaf.setAttribute("class", opts.glowLeaves ? "leaf leaf--glow" : "leaf");
        layer.appendChild(leaf);

        if (i % 2 === 0) {
          layer.appendChild(el("ellipse", {
            cx: pt.x + rand(-8, 8),
            cy: pt.y + rand(-2, 8),
            rx: rand(1.6, 2.8),
            ry: rand(5, 9),
            fill: opts.leafColor,
            opacity: rand(0.4, 0.8),
            transform: "rotate(" + (angle + rand(18, 48)).toFixed(1) + " " + pt.x + " " + pt.y + ")"
          })).setAttribute("class", "leaf");
        }
      }
    }

    const backCount = small ? 34 : 62;
    for (let i = 0; i < backCount; i++) {
      const sx = rand(260, 740);
      const sy = rand(210, 390);
      addStrand(back, {
        sx: sx, sy: sy,
        ex: sx + rand(-150, 150),
        ey: rand(500, 810),
        color: i % 5 === 0 ? "#244c38" : "#132f24",
        width: rand(1, 2.2),
        opacity: rand(0.35, 0.7),
        dur: [11, 18],
        leaves: 0
      });
    }

    const midCount = small ? 28 : 50;
    for (let i = 0; i < midCount; i++) {
      const sx = rand(230, 770);
      const sy = rand(240, 430);
      addStrand(mid, {
        sx: sx, sy: sy,
        ex: sx + rand(-170, 170),
        ey: rand(520, 860),
        color: i % 7 === 0 ? "#3f7453" : "#28543d",
        width: rand(1.3, 2.6),
        opacity: rand(0.45, 0.85),
        dur: [9, 15],
        leaves: Math.random() > 0.42 ? 4 : 0,
        leafColor: "url(#leafMid)"
      });
    }

    const frontCount = small ? 22 : 36;
    for (let i = 0; i < frontCount; i++) {
      const sx = rand(270, 730);
      const sy = rand(260, 460);
      addStrand(front, {
        sx: sx, sy: sy,
        ex: sx + rand(-150, 150),
        ey: rand(540, 900),
        color: i % 6 === 0 ? "#6f9a6c" : "#477a55",
        width: rand(1.1, 2.2),
        opacity: rand(0.4, 0.8),
        dur: [7.5, 13],
        leaves: small ? 7 : 11,
        leafColor: i % 9 === 0 ? "url(#leafGold)" : (i % 3 === 0 ? "url(#leafMid)" : "url(#leafFront)"),
        glowLeaves: i % 3 === 0
      });
    }

    // clusters of leaves around the crown, to thicken the silhouette
    for (let c = 0; c < (small ? 22 : 38); c++) {
      const cx = 500 + rand(-280, 280);
      const cy = 265 + rand(-70, 175);
      for (let k = 0; k < 3; k++) {
        const lx = cx + rand(-24, 24);
        const ly = cy + rand(-18, 18);
        const leaf = el("ellipse", {
          cx: lx, cy: ly,
          rx: rand(2.2, 3.8),
          ry: rand(7, 12),
          fill: Math.random() > 0.82 ? "url(#leafGold)" : (Math.random() > 0.45 ? "url(#leafMid)" : "url(#leafFront)"),
          opacity: rand(0.5, 0.9),
          transform: "rotate(" + rand(30, 150).toFixed(0) + " " + lx + " " + ly + ")"
        });
        leaf.setAttribute("class", "leaf");
        front.appendChild(leaf);
      }
    }

    // a few low, trailing wisps
    for (let i = 0; i < (small ? 5 : 9); i++) {
      const sx = rand(320, 680);
      addStrand(front, {
        sx: sx, sy: rand(420, 520),
        ex: sx + rand(-90, 90),
        ey: rand(820, 960),
        color: "#3d6b4d",
        width: rand(0.8, 1.4),
        opacity: rand(0.3, 0.55),
        dur: [8, 14],
        leaves: 4,
        leafColor: "url(#leafMid)"
      });
    }

    /* ---- ribbons ---- */
    const ribbonColors = ["#c39b56", "#d6c193", "#9c5a41", "#7b9a83", "#b58a4c", "#c9b47e"];
    for (let i = 0; i < (small ? 4 : 7); i++) {
      const x = rand(320, 690);
      const y = rand(400, 560);
      const len = rand(70, 175);
      const bend = rand(-18, 18);
      const color = ribbonColors[i % ribbonColors.length];
      const g = el("g", { class: "ribbon" });
      g.style.setProperty("--ox", x + "px");
      g.style.setProperty("--oy", y + "px");
      g.style.setProperty("--dur", rand(6, 11).toFixed(2) + "s");
      g.style.setProperty("--delay", (-Math.random() * 7).toFixed(2) + "s");
      g.appendChild(el("path", {
        d: "M" + x + " " + y + " C" + (x + bend) + " " + (y + len * 0.3) + " " + (x - bend) + " " + (y + len * 0.7) + " " + (x + bend * 0.4) + " " + (y + len),
        stroke: color, "stroke-width": rand(5, 10), "stroke-linecap": "round", fill: "none", opacity: rand(0.3, 0.52)
      }));
      g.appendChild(el("path", {
        d: "M" + x + " " + y + " C" + (x + bend) + " " + (y + len * 0.3) + " " + (x - bend) + " " + (y + len * 0.7) + " " + (x + bend * 0.4) + " " + (y + len),
        stroke: "#f2e2b8", "stroke-width": 0.8, "stroke-linecap": "round", fill: "none", opacity: 0.28
      }));
      g.appendChild(el("circle", {
        cx: x + bend * 0.4, cy: y + len, r: rand(2, 3.4), fill: "#e8cf91", opacity: 0.55
      }));
      ribbonG.appendChild(g);
    }

    mount.appendChild(svg);
  }

  /* ---------------- particles ---------------- */

  function scatterStars(container, count) {
    if (!container) return;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const s = document.createElement("i");
      s.className = "star";
      const size = rand(0.6, 1.9);
      s.style.left = rand(2, 98) + "%";
      s.style.top = rand(1, 68) + "%";
      s.style.width = size + "px";
      s.style.height = size + "px";
      s.style.setProperty("--tw", rand(3, 8).toFixed(2) + "s");
      s.style.setProperty("--td", (-Math.random() * 8).toFixed(2) + "s");
      s.style.setProperty("--to", rand(0.35, 0.95).toFixed(2));
      frag.appendChild(s);
    }
    container.appendChild(frag);
  }

  function scatterFireflies(container, count) {
    if (!container) return;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const f = document.createElement("i");
      f.className = "firefly";
      f.style.left = rand(12, 88) + "%";
      f.style.top = rand(38, 86) + "%";
      f.style.setProperty("--dx", rand(-60, 60).toFixed(0) + "px");
      f.style.setProperty("--dy", rand(-90, -20).toFixed(0) + "px");
      f.style.setProperty("--dur", rand(10, 22).toFixed(2) + "s");
      f.style.setProperty("--delay", (-Math.random() * 20).toFixed(2) + "s");
      frag.appendChild(f);
    }
    container.appendChild(frag);
  }

  function scatterPetals(container, count) {
    if (!container) return;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const p = document.createElement("i");
      p.className = "petal";
      p.style.left = rand(20, 90) + "%";
      p.style.setProperty("--dur", rand(14, 30).toFixed(2) + "s");
      p.style.setProperty("--delay", (-Math.random() * 30).toFixed(2) + "s");
      p.style.setProperty("--drift", rand(-120, 160).toFixed(0) + "px");
      p.style.setProperty("--spin", rand(200, 700).toFixed(0) + "deg");
      const scale = rand(0.6, 1.3);
      p.style.transform = "scale(" + scale + ")";
      frag.appendChild(p);
    }
    container.appendChild(frag);
  }

  function burstLeaves(container, count, originX, originY) {
    if (!container) return;
    for (let i = 0; i < count; i++) {
      const leaf = document.createElement("i");
      leaf.className = "burst-leaf";
      const x = originX + rand(-30, 30);
      const y = originY + rand(-20, 20);
      leaf.style.left = x + "px";
      leaf.style.top = y + "px";
      leaf.style.setProperty("--bx", rand(-160, 160).toFixed(0) + "px");
      leaf.style.setProperty("--by", rand(-180, 160).toFixed(0) + "px");
      leaf.style.setProperty("--br", rand(-320, 320).toFixed(0) + "deg");
      leaf.style.setProperty("--bd", rand(0.9, 1.9).toFixed(2) + "s");
      leaf.style.animationDelay = rand(0, 0.12).toFixed(2) + "s";
      container.appendChild(leaf);
      (function (node) {
        setTimeout(function () {
          if (node.parentNode) node.parentNode.removeChild(node);
        }, 2400);
      })(leaf);
    }
  }

  window.WillowArt = {
    buildWillow: buildWillow,
    scatterStars: scatterStars,
    scatterFireflies: scatterFireflies,
    scatterPetals: scatterPetals,
    burstLeaves: burstLeaves,
    reduced: reduce
  };
})();
