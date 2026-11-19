/* ALTER · 另一个我 —— 落地页交互
 * 纯原生 JS，无依赖。演示区为前端模拟，不代表完整 App 判定。
 */
(function () {
  'use strict';

  var PRODUCT_URL = 'https://elizabeth819.github.io/alter-english/';

  /* ---------------- 顶部栏 & 移动 CTA ---------------- */

  var header = document.getElementById('siteHeader');
  var mobileCta = document.getElementById('mobileCta');

  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
    if (mobileCta) {
      var show = window.scrollY > 560;
      var footer = document.querySelector('.site-footer');
      if (footer) {
        var rect = footer.getBoundingClientRect();
        if (rect.top < window.innerHeight - 40) show = false;
      }
      mobileCta.classList.toggle('is-visible', show);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------- 入场动画 ---------------- */

  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------------- 15 集剧情 ---------------- */

  var SEASONS = {
    1: {
      label: '第 1 季 · 开学',
      episodes: [
        { en: 'First Day, Zero Friends', cn: '开学第一天，最后一个空位在你旁边。', free: true },
        { en: 'Canteen, 12:05', cn: '三号窗口，她端着餐盘问你旁边有没有人。', free: true },
        { en: 'The Group Chat', cn: '23:41，群里那条消息像是在说你。' },
        { en: 'Club Audition', cn: '候场区里，你的三分钟要开始了。' },
        { en: 'The Night Before', cn: '凌晨 1:31，明天那场考试你还没准备好。' }
      ]
    },
    2: {
      label: '第 2 季 · 校外',
      episodes: [
        { en: 'First Shift', cn: '第一次兼职，柜台前没人教你怎么开口。' },
        { en: 'Train to Somewhere', cn: '七号站台，你可以去任何地方，但得先问清楚。' },
        { en: 'Dinner, Interrupted', cn: '饭桌上那张纸，把今晚变成了一场谈判。' },
        { en: '@maya_irl', cn: '私聊框里，对方问你敢不敢开语音。' },
        { en: 'Last Day', cn: '空桌子、最后一顿午饭，还有一句没说出口的话。' }
      ]
    },
    3: {
      label: '第 3 季 · 往前走',
      episodes: [
        { en: 'The Interview Room', cn: '第一个问题就把你问住了，但后面还有两问。' },
        { en: 'Lost in Transit', cn: '航班取消，你被困在另一个国家的柜台前。' },
        { en: 'The Argument', cn: '铅笔圈住的那行字，决定了你要不要争一次。' },
        { en: 'Small Talk, Big Room', cn: '满屋子陌生人，你要在一分钟内让人记住你。' },
        { en: 'See You Around', cn: '最后一张合照，你要不要说出那句再见。' }
      ]
    }
  };

  var episodeList = document.getElementById('episodeList');
  var seasonTabs = Array.prototype.slice.call(document.querySelectorAll('.season-tab'));

  function esc(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function renderSeason(index) {
    if (!episodeList) return;
    var season = SEASONS[index];
    var html = season.episodes.map(function (ep, i) {
      var num = '0' + (i + 1);
      return '' +
        '<a class="episode' + (ep.free ? ' is-free' : '') + '" href="' + PRODUCT_URL + '" target="_blank" rel="noopener">' +
          (ep.free ? '<span class="ep-badge">免费</span>' : '') +
          '<span class="ep-num">' + num + '</span>' +
          '<span class="ep-body">' +
            '<h3>' + esc(ep.en) + '</h3>' +
            '<p>' + esc(ep.cn) + '</p>' +
            '<p class="ep-cn">' + esc(season.label) + ' · 第 ' + (i + 1) + ' 集</p>' +
          '</span>' +
        '</a>';
    }).join('');
    episodeList.innerHTML = html;
  }

  seasonTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      seasonTabs.forEach(function (t) {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      renderSeason(tab.getAttribute('data-season'));
    });
  });

  renderSeason(1);

  /* ---------------- 分支演示 ---------------- */

  var branchResult = document.getElementById('branchResult');
  var branchBtns = Array.prototype.slice.call(document.querySelectorAll('.branch-opt'));
  var BRANCHES = {
    a: '群里安静了 30 秒。然后 Leo 发来一句：「okay this actually goes hard.」<br />—— 这句回复会出现在第 4 集的开场。',
    b: '对方先回了一个「?」，你把解释打了一半又删掉。<br />第二天，他主动坐到了你旁边 —— 第 4 集从这里开始。'
  };

  branchBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var key = btn.getAttribute('data-branch');
      branchBtns.forEach(function (b) { b.classList.remove('is-picked'); });
      btn.classList.add('is-picked');
      if (branchResult) {
        branchResult.hidden = false;
        branchResult.innerHTML = '<b style="color:#ffc0dc">你选了 ' + key.toUpperCase() + '</b><br />' + BRANCHES[key];
      }
    });
  });

  /* ---------------- 拼句演示 ---------------- */

  var sentenceBox = document.getElementById('sentenceBox');
  var chunkPool = document.getElementById('chunkPool');
  var submitBtn = document.getElementById('submitSentence');
  var resetBtn = document.getElementById('resetSentence');
  var resultBox = document.getElementById('demoResult');
  var tierName = document.getElementById('tierName');
  var tierScale = document.getElementById('tierScale');
  var yourSentence = document.getElementById('yourSentence');
  var nativeLine = document.querySelector('.native-line');
  var whyLine = document.querySelector('.why');

  var picked = [];
  var NATIVE = "No, go ahead — I'm new here, by the way.";

  var TIERS = {
    1: { name: '第 1 档 · 再想想', sub: '先听懂她在问什么', why: '她在问这个位子有没有人。先回答这个问题，再想别的。' },
    2: { name: '第 2 档 · 还差一点', sub: '意思到了，但没答到点上', why: '只说了 go ahead 还不够。先给一个 No，对方才知道你是在回答「有没有人」，而不是在犹豫。' },
    3: { name: '第 3 档 · 顺序不对', sub: '词都对，但多了不该在的词', why: '把 No 和 go ahead 放在最前面，别让对方猜。sorry、actually 这类词先留着，句子会更干净。' },
    4: { name: '第 4 档 · 能懂', sub: '意思对，语气也对', why: '这样已经完全能听懂。再补一个 by the way，把自我介绍接得更像顺口一提。' },
    5: { name: '第 5 档 · 地道', sub: '母语者也会这么说', why: '先答 No 再给 go ahead，对方立刻知道位子空着。by the way 把自我介绍接得轻一点，不像查户口。' }
  };

  function resetDemo() {
    picked = [];
    Array.prototype.forEach.call(chunkPool.querySelectorAll('.word-chip'), function (chip) {
      chip.classList.remove('is-used');
    });
    sentenceBox.innerHTML = '';
    resultBox.hidden = true;
  }

  function renderSentence() {
    sentenceBox.innerHTML = '';
    picked.forEach(function (item, i) {
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'word-chip word-chip--placed';
      chip.textContent = item.word;
      chip.setAttribute('aria-label', '移除 ' + item.word);
      chip.addEventListener('click', function () {
        picked.splice(i, 1);
        Array.prototype.forEach.call(chunkPool.querySelectorAll('.word-chip'), function (c) {
          if (c.getAttribute('data-word') === item.word) c.classList.remove('is-used');
        });
        renderSentence();
        resultBox.hidden = true;
      });
      sentenceBox.appendChild(chip);
    });
    submitBtn.disabled = picked.length === 0;
  }

  function grade() {
    var words = picked.map(function (p) { return p.word; });
    var has = function (w) { return words.indexOf(w) > -1; };
    var extras = has('someone') || has('sorry') || has('actually');
    if (has('No') && has('go ahead') && has("I'm new here") && has('by the way')) return 5;
    if (has('No') && has('go ahead') && has("I'm new here")) return 4;
    if (has('No') && has('go ahead') && extras) return 3;
    if (has('No') && has('go ahead')) return 4;
    if (has('go ahead') || has('No')) return 2;
    return 1;
  }

  if (chunkPool) {
    chunkPool.addEventListener('click', function (e) {
      var chip = e.target.closest('.word-chip');
      if (!chip || chip.classList.contains('is-used')) return;
      picked.push({ word: chip.getAttribute('data-word') });
      chip.classList.add('is-used');
      renderSentence();
      resultBox.hidden = true;
    });
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', function () {
      if (!picked.length) return;
      var tier = grade();
      var meta = TIERS[tier];
      var sentence = picked.map(function (p) { return p.word; }).join(' ');
      sentence = sentence.replace(/\s([.,!?])/g, '$1');
      if (/[.!?]$/.test(sentence) === false) sentence += '.';
      yourSentence.textContent = sentence;
      tierName.innerHTML = meta.name + '<small>' + meta.sub + '</small>';
      Array.prototype.forEach.call(tierScale.children, function (bar, i) {
        bar.classList.toggle('on', i < tier);
      });
      nativeLine.style.display = tier >= 4 ? '' : 'none';
      whyLine.innerHTML = '<b>为什么这么说：</b>' + meta.why;
      resultBox.hidden = false;
      resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  if (resetBtn) resetBtn.addEventListener('click', resetDemo);

  resetDemo();

  /* ---------------- 定价切换 ---------------- */

  var toggleBtns = Array.prototype.slice.call(document.querySelectorAll('.price-toggle button'));

  function setCycle(cycle) {
    toggleBtns.forEach(function (b) {
      b.classList.toggle('is-active', b.getAttribute('data-cycle') === cycle);
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-annual]'), function (el) {
      var val = el.getAttribute('data-' + cycle);
      if (val !== null) el.textContent = val;
    });
  }

  toggleBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      setCycle(btn.getAttribute('data-cycle'));
    });
  });

  setCycle('annual');
})();
