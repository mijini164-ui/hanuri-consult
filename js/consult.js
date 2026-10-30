/* 신규 상담 안내문 만들기
   - 왼쪽 입력칸(data-f) → 안내문의 data-b 자리에 들어가요.
   - 안내문의 고정 글(data-k)은 '글 직접 고치기'를 켜면 눌러서 고칠 수 있어요.
   - 입력한 내용과 고친 글은 이 기기(localStorage, 'consult_v2')에만 저장돼요. 서버로 가지 않아요. */
(function () {
  "use strict";
  var KEY = "consult_v2", OLD = "consult_v1";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* 큰 제목 예시: 줄바꿈은 그대로, [ ] 안은 주황색 */
  var TITLES = [
    "책을 [읽는] 아이에서\n[생각하는] 아이로",
    "읽는 힘이\n[생각하는 힘]이 돼요",
    "생각하는 힘이\n[공부의 차이]를 만들어요",
    "한 권을 읽어도\n[제대로, 깊이] 있게",
    "선생님과 함께\n[읽고, 말하고, 쓰는] 시간"
  ];
  var PHIL = [
    "아이가 책 속에서 스스로 답을 찾을 때까지 기다리고 질문해 주는 선생님이 되고 싶어요.\n한 권을 읽어도 제대로 읽고, 내 생각을 말할 수 있는 아이로 키울게요.",
    "정답을 알려 주기보다 생각하는 방법을 가르쳐요.\n아이 한 명 한 명의 속도를 존중하며, 매주 조금씩 자라는 모습을 학부모님과 함께 나눌게요.",
    "책을 좋아하는 아이가 공부도 즐거워한다고 믿어요.\n읽는 즐거움을 먼저 찾아 주고, 그 즐거움이 생각하는 힘으로 이어지도록 이끌게요."
  ];
  var POINTS = [
    ["매달 수업 피드백", "수업계획서와 아이별 수업 피드백을 학부모님께 보내 드려요."],
    ["한 명 한 명 맞춤 지도", "소그룹이라 아이 수준에 맞춰 읽기 전략과 질문을 달리해요."],
    ["글쓰기 첨삭", "아이가 쓴 글을 선생님이 직접 첨삭하고, 고쳐 쓰며 실력을 키워요."],
    ["숙제 안내문", "차시별 숙제를 정리해 교재에 붙여 드려 집에서도 챙기기 쉬워요."],
    ["토론이 있는 교실", "매달 토의·토론으로 내 생각을 말하는 힘을 길러요."],
    ["몰입독서 함께 운영", "읽기가 아직 어려운 아이는 선생님과 같이 읽는 몰입독서로 시작해요."],
    ["빠진 수업은 보강", "공휴일이나 사정으로 빠진 수업은 보강 일정을 잡아 드려요."],
    ["가까운 우리 동네 교실", "아이가 혼자 오가기 편한 가까운 곳에서 수업해요."]
  ];
  /* 수업 시간 안내에서 고르는 과정: [이름, 대상, 짧은 소개] */
  var COURSES = [
    ["정규 과정", [
      ["꿈꾸는 새싹", "6~7세", "읽기·쓰기·말하기·듣기를 통합해 바른 독서 습관과 초등 학습의 기초를 다져요."],
      ["어휘리더", "초1~2", "어휘가 자라면 생각이 자라요. 다양한 어휘 활동으로 문해력의 기초를 다져요."],
      ["독서리더", "초3~4", "교과 배경지식과 다양한 독서 경험으로 사고력과 표현력을 키워요."],
      ["논리리더", "초5~6", "읽기·토론·글쓰기로 초등 논리·사고력을 완성해요."],
      ["소크라테스", "중1~3", "단계별 독해 훈련과 토론·글쓰기로 서·논술형 평가와 수행평가를 대비해요."]
    ]],
    ["교과 연계 과정", [
      ["과학탐탐", "초3", "과학 기초 개념을 책으로 탐색하고 탐구하는 과학 독서예요."],
      ["한국사 뛰어넘기", "초4", "읽고 재미있게 배우는 역사 독서로 한국사의 흐름을 잡아요."],
      ["세계문화지리", "초5", "세계 문화를 지리적 시각으로 이해하며 통합적 사고를 키워요."],
      ["세계사 뛰어넘기", "초6", "중학교 역사 교육과정과 연계해 세계사의 흐름을 정리해요."],
      ["고등문학", "중3", "갈래별 문학의 원리를 익혀 고등 문학을 미리 준비해요."]
    ]],
    ["몰입독서", [
      ["몰입독서", "유치~중1", "선생님과 같이 읽으며 읽기 전략을 배우고, 수업 시간 안에 책 한 권을 끝까지 읽어요."]
    ]],
    ["특강", [
      ["다다어휘", "초2~4", "핵심 어휘 학습으로 문해력의 기초가 되는 어휘력을 키워요."],
      ["한국사봄", "초5~6", "교과서 흐름을 잡는 통합 한국사로 역사를 이해하는 힘을 길러요."],
      ["똑독해", "초5~6", "비문학 독해의 기초부터 실전까지, 사회·과학·경제 지문을 읽어요."],
      ["갈래별 문학독해", "중1~2", "갈래별·주제별로 문학 작품을 깊이 읽고 감상하는 힘을 키워요."],
      ["교과문학탐독", "중2~3", "교과서 수록 작품을 깊이 읽고 작품으로 세상을 이해해요."],
      ["고등 통합사회", "중3", "사회 개념을 통합적으로 이해하며 고등 공부를 준비해요."]
    ]]
  ];
  var CMAP = {};
  COURSES.forEach(function (g) { g[1].forEach(function (c) { CMAP[c[0]] = c; }); });
  var CUSTOM = "__custom__";
  function blankSlot() { return { course: "", day: "", time: "", name: "", grade: "", intro: "" }; }

  var DEF = {
    title: TITLES[0],
    room: "", teacher: "", phone: "", place: "",
    branch: "한우리 안산단원지부", branchTel: "031-413-1919",
    phil: PHIL[0],
    points: [POINTS[0].slice(), POINTS[1].slice(), POINTS[2].slice()],
    slots: [blankSlot(), blankSlot(), blankSlot()],
    rule: "· 주 1회(한 달 4회) 수업이 기본이에요 (주 2회도 가능해요)\n· 2명 70분 · 3명 80분 · 4명 이상 90분\n· 6~7세는 40분 수업이에요\n· 한 반은 2~6명이에요 (6~7세는 4명까지)\n· 매달 필독서와 워크북으로 수업해요",
    closing: "아이의 생각이 자라는 시간,\n한우리가 함께할게요.",
    text: {}
  };
  var PH = { room: "○○교실", teacher: "○○○", phone: "010-0000-0000", phil: "선생님의 교육 철학을 적어 주세요." };

  var state = load();
  function load() {
    var s = null;
    try { s = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) {}
    if (!s) { try { s = JSON.parse(localStorage.getItem(OLD) || "null"); if (s) { delete s.slots; delete s.text; } } catch (e) {} }
    var o = JSON.parse(JSON.stringify(DEF));
    if (s && typeof s === "object") for (var k in o) if (k in s) o[k] = s[k];
    if (!Array.isArray(o.points)) o.points = DEF.points;
    if (!Array.isArray(o.slots) || o.slots.some(function (r) { return !r || typeof r !== "object" || Array.isArray(r); })) o.slots = DEF.slots;
    if (!o.text || typeof o.text !== "object") o.text = {};
    return o;
  }
  var saveT = 0;
  function save() {
    clearTimeout(saveT);
    saveT = setTimeout(flush, 250);
  }
  function flush() { clearTimeout(saveT); try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  window.addEventListener("pagehide", flush);

  /* ── 안내문 고정 글 ── */
  var ORIG = {};
  $$("[data-k]").forEach(function (el) {
    ORIG[el.dataset.k] = el.innerHTML;
    if (state.text[el.dataset.k] != null) el.innerHTML = state.text[el.dataset.k];
    el.addEventListener("input", function () { state.text[el.dataset.k] = el.innerHTML; save(); });
  });
  $("#editMode").addEventListener("change", function () {
    var on = this.checked;
    $("#pages").classList.toggle("editing", on);
    $$("[data-k]").forEach(function (el) { if (on) el.setAttribute("contenteditable", "true"); else el.removeAttribute("contenteditable"); });
  });
  $("#resetText").addEventListener("click", function () {
    if (!confirm("안내문에서 직접 고친 글을 모두 처음 글로 되돌릴까요? (왼쪽에 적은 내용은 그대로예요)")) return;
    state.text = {};
    $$("[data-k]").forEach(function (el) { el.innerHTML = ORIG[el.dataset.k]; });
    save(); say("안내문 글을 처음으로 되돌렸어요.");
  });

  /* ── 입력칸 ── */
  $$("[data-f]").forEach(function (el) {
    el.value = state[el.dataset.f] || "";
    el.addEventListener("input", function () { state[el.dataset.f] = el.value; render(); save(); });
  });
  function chip(box, label, title, fn) {
    var b = document.createElement("button");
    b.type = "button"; b.textContent = label; if (title) b.title = title;
    b.addEventListener("click", fn); box.appendChild(b);
  }
  TITLES.forEach(function (t) {
    chip($("#titleChips"), t.replace(/[\[\]]/g, "").replace(/\n/g, " "), "", function () { state.title = t; $("#f-title").value = t; render(); save(); });
  });
  PHIL.forEach(function (t, i) {
    chip($("#philChips"), "예시 " + (i + 1) + ": " + t.split("\n")[0].slice(0, 18) + "…", t, function () { state.phil = t; $("#f-phil").value = t; render(); save(); });
  });
  POINTS.forEach(function (p) {
    chip($("#pointChips"), "+ " + p[0], p[1], function () {
      var i = state.points.findIndex(function (q) { return !q[0] && !q[1]; });
      if (i < 0) { if (state.points.length >= 3) { say("세 칸이 모두 찼어요. 바꿀 칸의 ✕를 먼저 눌러 비워 주세요.", true); return; } state.points.push(["", ""]); i = state.points.length - 1; }
      state.points[i] = p.slice(); drawPoints(); render(); save();
    });
  });

  function drawPoints() {
    while (state.points.length < 3) state.points.push(["", ""]);
    state.points = state.points.slice(0, 3);
    var box = $("#points"); box.innerHTML = "";
    state.points.forEach(function (p, i) {
      var d = document.createElement("div"); d.className = "pt";
      d.innerHTML = '<span class="n">특별한 점 ' + (i + 1) + '</span><button type="button" class="x" aria-label="비우기">✕</button>' +
        '<input aria-label="제목" placeholder="제목 (짧게)"><textarea rows="2" aria-label="설명" placeholder="한두 줄 설명"></textarea>';
      var t = d.querySelector("input"), s = d.querySelector("textarea");
      t.value = p[0]; s.value = p[1];
      t.addEventListener("input", function () { state.points[i][0] = t.value; render(); save(); });
      s.addEventListener("input", function () { state.points[i][1] = s.value; render(); save(); });
      d.querySelector(".x").addEventListener("click", function () { state.points[i] = ["", ""]; drawPoints(); render(); save(); });
      box.appendChild(d);
    });
  }

  var OPTS = '<option value="">과정 고르기</option>' + COURSES.map(function (g) {
    return '<optgroup label="' + g[0] + '">' + g[1].map(function (c) { return '<option value="' + c[0] + '">' + c[0] + ' (' + c[1] + ')</option>'; }).join("") + "</optgroup>";
  }).join("") + '<option value="' + CUSTOM + '">직접 적기</option>';
  function drawSlots() {
    var box = $("#slots"); box.innerHTML = "";
    state.slots.forEach(function (r, i) {
      var d = document.createElement("div"); d.className = "slot2";
      d.innerHTML = '<div class="slot-row"><select aria-label="과정 ' + (i + 1) + '">' + OPTS + '</select>' +
        '<button type="button" class="x" aria-label="반 지우기">✕</button></div>' +
        '<div class="slot-row3"><input data-s="grade" aria-label="대상" placeholder="대상 (예: 초3)"><input data-s="day" aria-label="요일" placeholder="요일 (예: 화)"><input data-s="time" aria-label="시간" placeholder="시간 (예: 4:00~5:30)"></div>' +
        '<div class="slot-custom"' + (r.course === CUSTOM ? "" : " hidden") + '><input data-s="name" aria-label="과정 이름" placeholder="과정 이름"><textarea data-s="intro" rows="2" aria-label="과정 소개" placeholder="과정 소개 한 줄"></textarea></div>';
      var sel = d.querySelector("select");
      sel.value = r.course || "";
      $$("[data-s]", d).forEach(function (inp) {
        var k = inp.dataset.s;
        inp.value = k === "grade" ? (r.grade || (CMAP[r.course] ? CMAP[r.course][1] : "")) : (r[k] || "");
        inp.addEventListener("input", function () { r[k] = inp.value; render(); save(); });
      });
      sel.addEventListener("change", function () {
        r.course = sel.value;
        r.grade = CMAP[r.course] ? CMAP[r.course][1] : "";
        d.querySelector("[data-s=grade]").value = r.grade;
        d.querySelector(".slot-custom").hidden = r.course !== CUSTOM;
        render(); save();
      });
      d.querySelector(".x").addEventListener("click", function () { state.slots.splice(i, 1); if (!state.slots.length) state.slots.push(blankSlot()); drawSlots(); render(); save(); });
      box.appendChild(d);
    });
  }
  $("#addSlot").addEventListener("click", function () { state.slots.push(blankSlot()); drawSlots(); save(); var s = $$("#slots select"); s[s.length - 1].focus(); });

  /* ── 안내문에 반영 ── */
  function put(el, v, ph) {
    if (v) { el.textContent = v; el.classList.remove("ph"); }
    else if (ph) { el.textContent = ph; el.classList.add("ph"); }
    else { el.textContent = ""; }
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function titleHtml(t) {
    return esc(t.trim()).replace(/\[([^\]]+)\]/g, "<em>$1</em>").replace(/\n/g, "<br>");
  }
  function slotName(r) { return r.course === CUSTOM ? (r.name || "").trim() : r.course; }
  function slotIntro(r) { return r.course === CUSTOM ? (r.intro || "").trim() : (CMAP[r.course] ? CMAP[r.course][2] : ""); }
  function render() {
    $$("[data-b]").forEach(function (el) { var f = el.dataset.b; put(el, (state[f] || "").trim(), PH[f]); });
    $$("[data-b-wrap]").forEach(function (el) { el.hidden = !(state[el.dataset.bWrap] || "").trim(); });
    $("#titleOut").innerHTML = (state.title || "").trim() ? titleHtml(state.title) : '<span class="ph">큰 제목을 적어 주세요</span>';
    var pts = state.points.filter(function (p) { return (p[0] || "").trim() || (p[1] || "").trim(); });
    $("#ptsOut").innerHTML = pts.length ? pts.map(function (p, i) {
      return "<div><small>POINT " + (i + 1) + "</small><b>" + esc(p[0]) + "</b><span>" + esc(p[1]) + "</span></div>";
    }).join("") : '<div class="ph" style="grid-column:1/-1">왼쪽에서 우리 교실만의 특별한 점을 골라 주세요.</div>';
    $("#ptsOut").style.gridTemplateColumns = "repeat(" + Math.max(1, Math.min(3, pts.length)) + ",1fr)";
    var rows = state.slots.filter(function (r) { return slotName(r) || (r.day || "").trim() || (r.time || "").trim(); });
    $("#slotsOut").innerHTML = rows.length ? rows.map(function (r) {
      return "<tr><td>" + esc(slotName(r) || "") + "</td><td>" + esc(r.grade || "") + "</td><td>" + esc(r.day || "") + "</td><td>" + esc(r.time || "") + "</td></tr>";
    }).join("") : '<tr class="empty"><td colspan="4">수업 시간은 상담 후 아이에게 맞춰 정해요.</td></tr>';
    var seen = {}, intros = [];
    rows.forEach(function (r) { var n = slotName(r), t = slotIntro(r); if (n && t && !seen[n]) { seen[n] = 1; intros.push([n, r.grade || "", t]); } });
    $("#introOut").innerHTML = intros.map(function (c) {
      return "<div><b>" + esc(c[0]) + "</b>" + (c[1] ? "<small>" + esc(c[1]) + "</small>" : "") + "<span>" + esc(c[2]) + "</span></div>";
    }).join("");
    $("#introOut").hidden = !intros.length;
    var over = $("#page3").scrollHeight > 1124;
    $("#page3").classList.toggle("tight", over);
    if (over && $("#page3").scrollHeight > 1124) say("3장 내용이 넘쳐요. 반을 줄이거나 수업 기준 글을 짧게 해 주세요.", true);
    else if ($("#status").classList.contains("err") && /3장/.test($("#status").textContent)) say("");
  }

  /* ── 미리보기 크기 맞추기 ── */
  function fit() {
    var pv = $("#preview"), pg = $("#pages");
    var w = pv.clientWidth, s = Math.min(1, w / 794);
    pg.style.transform = s < 1 ? "scale(" + s + ")" : "";
    pv.style.height = s < 1 ? Math.ceil(pg.scrollHeight * s) + "px" : "";
  }
  window.addEventListener("resize", fit);

  /* ── 저장 ── */
  var MOB = /Android|iPhone|iPad|iPod|KAKAOTALK|NAVER|Line\//i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent));
  function say(t, err) { var s = $("#status"); s.textContent = t; s.classList.toggle("err", !!err); }
  function busy(on) { $$(".actions button").forEach(function (b) { b.disabled = on; }); }
  function fname(ext) {
    var r = (state.room || "").trim().replace(/[\\/:*?"<>|]/g, "").replace(/\s+/g, "_");
    return "신규상담안내문" + (r ? "_" + r : "") + "." + ext;
  }
  async function shots() {
    if (!window.html2canvas) throw new Error("그림 만드는 도구를 불러오지 못했어요. 인터넷 연결을 확인하고 새로고침해 주세요.");
    try { if (document.fonts && document.fonts.ready) await document.fonts.ready; } catch (e) {}
    var pg = $("#pages"), keep = pg.style.transform, wasEdit = pg.classList.contains("editing");
    pg.style.transform = ""; pg.classList.remove("editing"); document.body.classList.add("capturing");
    if (document.activeElement) document.activeElement.blur();
    try {
      var out = [];
      for (var i = 1; i <= 3; i++) {
        out.push(await html2canvas($("#page" + i), { scale: 2, backgroundColor: "#fffdf9", useCORS: true, logging: false, windowWidth: 1400 }));
      }
      return out;
    } finally {
      pg.style.transform = keep; if (wasEdit) pg.classList.add("editing"); document.body.classList.remove("capturing");
    }
  }
  function toBlob(c, type, q) { return new Promise(function (res) { c.toBlob(res, type, q); }); }
  async function store(name, blob, canvases) {
    var dl = await window.claude.use("downloads");
    try { await dl.save({ filename: name, data: blob }); say("저장했어요: " + name); }
    catch (e) {
      if (e && e.code === "declined") { say("저장을 취소했어요."); return; }
      if (e && e.code === "unavailable" && canvases) { showImgs(canvases); say("그림을 길게 눌러 저장해 주세요."); return; }
      throw e;
    }
  }
  function showImgs(cs) {
    var box = $("#viewerImgs"); box.innerHTML = "";
    cs.forEach(function (c, i) { var im = new Image(); im.alt = (i + 1) + "장"; im.src = c.toDataURL("image/jpeg", 0.92); box.appendChild(im); });
    $("#viewer").hidden = false;
  }
  $("#viewerClose").addEventListener("click", function () { $("#viewer").hidden = true; });

  $("#savePdf").addEventListener("click", async function () {
    busy(true); say("PDF를 만들고 있어요…");
    try {
      var cs = await shots();
      var J = window.jspdf && window.jspdf.jsPDF;
      if (!J) throw new Error("PDF 도구를 불러오지 못했어요. 새로고침해 주세요.");
      var pdf = new J({ orientation: "p", unit: "mm", format: "a4" });
      cs.forEach(function (c, i) { if (i) pdf.addPage(); pdf.addImage(c.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, 210, 297); });
      await store(fname("pdf"), pdf.output("blob"), cs);
    } catch (e) { say((e && e.message) || "저장하지 못했어요.", true); }
    busy(false);
  });
  $("#savePng").addEventListener("click", async function () {
    busy(true); say("그림을 만들고 있어요…");
    try {
      var cs = await shots();
      if (MOB) { showImgs(cs); say("그림을 길게 눌러 저장해 주세요."); }
      else {
        var zip = new JSZip(), base = fname("png").replace(/\.png$/, "");
        for (var i = 0; i < cs.length; i++) zip.file(base + "_" + (i + 1) + ".png", await toBlob(cs[i], "image/png"));
        await store(base + ".zip", await zip.generateAsync({ type: "blob" }), cs);
      }
    } catch (e) { say((e && e.message) || "저장하지 못했어요.", true); }
    busy(false);
  });
  $("#print").addEventListener("click", function () { window.print(); });

  drawPoints(); drawSlots(); render(); fit();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
})();
