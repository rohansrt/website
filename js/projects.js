(function () {
  'use strict';

  // ── Utilities ─────────────────────────────────────────────────────────────────

  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ── Detail panel content renderers ────────────────────────────────────────────

  function renderColContent(content) {
    if (content.type === 'text') {
      return '<p class="egm-body-text">' + esc(content.text) + '</p>';
    }
    if (content.type === 'groups') {
      return content.groups.map(function (g) {
        return '<div class="egm-group">' +
          '<p class="egm-group-title">' + esc(g.title) + '</p>' +
          '<ul class="egm-list">' +
          g.items.map(function (item) { return '<li>' + esc(item) + '</li>'; }).join('') +
          '</ul></div>';
      }).join('');
    }
    if (content.type === 'list') {
      return '<ul class="egm-list">' +
        content.items.map(function (item) { return '<li>' + esc(item) + '</li>'; }).join('') +
        '</ul>';
    }
    if (content.type === 'flow') {
      return '<div class="egm-flow">' +
        content.steps.map(function (step, i) {
          return '<div class="egm-flow-step">' +
            '<img src="' + esc(step.icon) + '" alt="" class="egm-flow-icon">' +
            '<span class="egm-flow-label">' + esc(step.label) + '</span>' +
            '</div>' +
            (i < content.steps.length - 1 ? '<div class="egm-flow-arrow">↓</div>' : '');
        }).join('') +
        '</div>';
    }
    if (content.type === 'text-chart') {
      return '<p class="egm-body-text">' + esc(content.text) + '</p>' +
        '<div class="egm-chart-wrap">' +
        '<svg class="egm-chart" viewBox="0 0 110 56" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<path d="M4 52 C20 46, 40 38, 58 28 S88 12, 106 4" stroke="#173F7A" stroke-width="2" stroke-linecap="round" fill="none"/>' +
        '<path d="M4 52 C20 46, 40 38, 58 28 S88 12, 106 4 L106 56 L4 56 Z" fill="rgba(23,63,122,0.07)"/>' +
        '</svg></div>';
    }
    if (content.type === 'quote') {
      return '<blockquote class="egm-quote">“' + esc(content.text) + '”</blockquote>';
    }
    return '';
  }

  function renderCol(col) {
    var classes = 'egm-col' +
      (col.noBorder  ? ' egm-col--no-border' : '') +
      (col.isFounder ? ' egm-col--founder'   : '');
    return '<div class="' + classes + '">' +
      '<div class="egm-col-hdr">' +
        '<img src="' + esc(col.icon) + '" alt="" class="egm-col-icon">' +
        '<span class="egm-col-title">' + esc(col.title) + '</span>' +
      '</div>' +
      renderColContent(col.content) +
      '</div>';
  }

  // ── Card DOM builder ──────────────────────────────────────────────────────────

  function buildCard(data) {
    var taglineHTML = esc(data.tagline).replace(/\n/g, '<br/>');

    var stripsHTML = data.card.strips.map(function (strip) {
      return '<div class="eg-strip-item" title="' + esc(strip.label) + '">' +
        '<img src="' + esc(strip.icon) + '" alt="' + esc(strip.label) + '" class="eg-strip-icon"/>' +
        '<span class="eg-strip-label">' + esc(strip.label) + '</span>' +
        '</div>' +
        '<div class="eg-strip-sep"></div>';
    }).join('');

    var el = document.createElement('div');
    el.className = 'eg-card';
    el.innerHTML =
      '<div class="eg-row1">' +
        '<h1 class="eg-title' + (data.titleSmall ? ' eg-title--sm' : '') + '">' + esc(data.title) + '</h1>' +
        '<a href="' + esc(data.mvpLink) + '" target="_blank" rel="noopener" class="eg-mvp-btn">' +
          '<span class="eg-mvp-arrow">↗</span> VIEW MVP' +
        '</a>' +
      '</div>' +
      '<div class="eg-divider"></div>' +
      '<div class="eg-row3">' +
        '<div class="eg-left">' +
          '<p class="eg-tagline">' + taglineHTML + '</p>' +
          '<p class="eg-category">' + esc(data.category) + '</p>' +
        '</div>' +
        '<div class="eg-right">' +
          '<img src="' + esc(data.heroImage) + '" alt="' + esc(data.title) + ' hero" class="eg-hero-img"/>' +
        '</div>' +
      '</div>' +
      '<hr class="eg-hr"/>' +
      '<div class="eg-strips">' +
        stripsHTML +
        '<div class="eg-strip-item eg-strip-details">' +
          '<span class="eg-strip-plus">+</span>' +
          '<span class="eg-strip-label"><strong>DETAILS</strong></span>' +
          '<svg class="eg-strip-icon-details" viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="#0F2454" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
            '<line x1="5" y1="12" x2="19" y2="12"/>' +
            '<polyline points="13 6 19 12 13 18"/>' +
          '</svg>' +
        '</div>' +
      '</div>';
    return el;
  }

  // ── Professional Card DOM builder ────────────────────────────────────────

  function buildProfessionalCard(data) {
    var stripsHTML = data.card.strips.map(function (strip) {
      return '<div class="eg-strip-item" title="' + esc(strip.label) + '">' +
        '<img src="' + esc(strip.icon) + '" alt="' + esc(strip.label) + '" class="eg-strip-icon"/>' +
        '<span class="eg-strip-label">' + esc(strip.label) + '</span>' +
        '</div>' +
        '<div class="eg-strip-sep"></div>';
    }).join('');

    var el = document.createElement('div');
    el.className = 'eg-card eg-card--pro';
    el.dataset.id = data.id;
    el.innerHTML =
      '<div class="eg-row1">' +
        '<h1 class="eg-title' + (data.titleSmall ? ' eg-title--sm' : '') + '">' + esc(data.title) + '</h1>' +
        '<img src="' + esc(data.heroImage) + '" alt="' + esc(data.title) + ' ecosystem" class="eg-pro-hero"/>' +
      '</div>' +
      '<div class="eg-divider"></div>' +
      '<div class="eg-pro-overview">' +
        '<p class="eg-pro-overview-text">' + esc(data.tagline) + '</p>' +
        '<p class="eg-category">' + esc(data.category) + '</p>' +
      '</div>' +
      '<hr class="eg-hr"/>' +
      '<div class="eg-strips">' +
        stripsHTML +
        '<div class="eg-strip-item eg-strip-details">' +
          '<span class="eg-strip-plus">+</span>' +
          '<span class="eg-strip-label"><strong>DETAILS</strong></span>' +
          '<svg class="eg-strip-icon-details" viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="#0F2454" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
            '<line x1="5" y1="12" x2="19" y2="12"/>' +
            '<polyline points="13 6 19 12 13 18"/>' +
          '</svg>' +
        '</div>' +
      '</div>';
    return el;
  }

  // ── Detail modal DOM builder ──────────────────────────────────────────────────

  function buildModal(data) {
    var d = data.detail;
    var taglineHTML = esc(data.tagline).replace(/\n/g, '<br>');

    var row1HTML = d.row1.map(renderCol).join('');

    var row2HTML =
      '<div class="egm-row2-inner">' +
        '<div class="egm-col-hdr">' +
          '<img src="' + esc(d.row2.icon) + '" alt="" class="egm-col-icon">' +
          '<span class="egm-col-title">' + esc(d.row2.title) + '</span>' +
        '</div>' +
        '<div class="egm-pills">' +
          d.row2.pills.map(function (p) { return '<span class="egm-pill">' + esc(p) + '</span>'; }).join('') +
        '</div>' +
      '</div>';

    var row3HTML = d.row3.map(renderCol).join('');

    var el = document.createElement('div');
    el.id = 'modal-' + data.id;
    el.className = 'egm-overlay';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-label', data.title + ' project details');
    el.innerHTML =
      '<div class="egm-modal">' +
        '<button class="egm-close-btn" aria-label="Close modal">✕</button>' +
        '<div class="egm-header">' +
          '<div class="egm-header-left">' +
            '<button class="egm-back-btn">' +
              '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>' +
              'Back' +
            '</button>' +
            '<h1 class="egm-title">' + esc(data.title) + '</h1>' +
            '<div class="egm-underline"></div>' +
            '<p class="egm-tagline">' + taglineHTML + '</p>' +
            '<p class="egm-category">' + esc(data.category) + '</p>' +
          '</div>' +
          '<div class="egm-header-right">' +
            '<a href="' + esc(data.mvpLink) + '" target="_blank" rel="noopener" class="egm-mvp-btn-header">' +
              '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>' +
              'VIEW MVP' +
            '</a>' +
            '<img src="' + esc(data.heroImage) + '" alt="' + esc(data.title) + ' illustration" class="egm-hero-img">' +
          '</div>' +
        '</div>' +
        '<div class="egm-row egm-row1">' + row1HTML + '</div>' +
        '<div class="egm-row egm-row2">' + row2HTML + '</div>' +
        '<div class="egm-row egm-row3">' + row3HTML + '</div>' +
      '</div>';
    return el;
  }

  // ── Placeholder card DOM builder ──────────────────────────────────────────────

  function buildPlaceholderCard(entry) {
    var el = document.createElement('div');
    el.className = 'eg-card eg-card--placeholder';
    el.innerHTML =
      '<div class="eg-named-placeholder">' +
        '<h2 class="eg-np-name">' + esc(entry.name) + '</h2>' +
        '<span class="eg-placeholder-label">Coming Soon</span>' +
      '</div>';
    return el;
  }

  // ── Event wiring ──────────────────────────────────────────────────────────────

  // One global ESC handler closes whichever modal is open.
  // scrollY is stored as a data attribute on the modal element so this
  // handler can restore the page position without sharing closure state.
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var open = document.querySelector('.egm-overlay.open');
    if (!open) return;
    open.classList.remove('open');
    var y = parseInt(open.dataset.scrollY || '0', 10);
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.body.style.overflowY = '';
    window.scrollTo(0, y);
  });

  function wireModalEvents(cardEl, modalEl) {
    var scrollY = 0;

    function openModal() {
      scrollY = window.scrollY;
      modalEl.dataset.scrollY = scrollY;
      modalEl.classList.add('open');
      document.body.style.position = 'fixed';
      document.body.style.top = '-' + scrollY + 'px';
      document.body.style.width = '100%';
      document.body.style.overflowY = 'scroll';
    }

    function closeModal() {
      modalEl.classList.remove('open');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflowY = '';
      window.scrollTo(0, scrollY);
    }

    cardEl.querySelector('.eg-strip-details').addEventListener('click', function (e) {
      e.stopPropagation();
      openModal();
    });
    modalEl.querySelector('.egm-close-btn').addEventListener('click', closeModal);
    modalEl.querySelector('.egm-back-btn').addEventListener('click', closeModal);
    modalEl.addEventListener('click', function (e) {
      if (e.target === modalEl) closeModal();
    });
  }

  // ── Loader ────────────────────────────────────────────────────────────────────

  function loadFullProject(slot, id) {
    fetch('assets/projects/' + id + '.json')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var cardEl = data.projectType === 'professional' ? buildProfessionalCard(data) : buildCard(data);
        slot.parentNode.replaceChild(cardEl, slot);

        var modalEl = buildModal(data);
        document.body.appendChild(modalEl);

        wireModalEvents(cardEl, modalEl);
      });
  }

  // ── Bootstrap ─────────────────────────────────────────────────────────────────
  // Reads projects-index.json and populates every tab panel automatically.
  // To add a project: create its JSON file and add its id to projects-index.json.

  fetch('assets/projects/projects-index.json')
    .then(function (r) { return r.json(); })
    .then(function (index) {
      Object.keys(index).forEach(function (tab) {
        var row = document.querySelector('#tab-' + tab + ' .proj-cards-row');
        if (!row) return;

        index[tab].forEach(function (entry) {
          if (entry.placeholder) {
            row.appendChild(buildPlaceholderCard(entry));
          } else {
            var slot = document.createElement('div');
            row.appendChild(slot);
            loadFullProject(slot, entry.id);
          }
        });
      });
    });
})();
