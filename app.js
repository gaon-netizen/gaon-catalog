const products = Array.isArray(window.PRODUCTS) ? window.PRODUCTS : [];
let currentCategory = '전체';

const $ = s => document.querySelector(s);
const search = $('#search');
const grid = $('#grid');
const count = $('#count');
const cats = $('#categories');
const source = $('#source');
const tpl = $('#tpl');
const dialog = $('#productDialog');
const dialogClose = $('#dialogClose');
const dialogPhoto = $('#dialogPhoto');
const dialogNoImage = $('#dialogNoImage');
const dialogCategory = $('#dialogCategory');
const dialogName = $('#dialogName');
const dialogInfo = $('#dialogInfo');
const dialogCopy = $('#dialogCopy');
let dialogCode = '';

function normalize(value='') {
  return String(value)
    .toLowerCase()
    .replace(/파이|[ØøΦφ]/g, '')
    .replace(/[×xX＊﹡]/g, '*')
    .replace(/\s+/g, '')
    .trim();
}

function searchable(p) {
  return normalize([p.code,p.name,p.category,p.size,p.spec,p.detail].join(' '));
}

function copyText(text, button) {
  const done = () => {
    const original = button.textContent;
    button.textContent = '복사됨';
    setTimeout(() => button.textContent = original, 900);
  };
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
  } else {
    fallbackCopy(text, done);
  }
}

function fallbackCopy(text, done) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly','');
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); } catch(e) {}
  ta.remove();
  done();
}

function setImage(img, placeholder, p) {
  placeholder.hidden = true;
  img.hidden = false;
  img.alt = `${p.code} ${p.name}`.trim();
  img.onerror = () => {
    img.hidden = true;
    placeholder.hidden = false;
  };
  if (p.image) {
    img.src = p.image;
  } else {
    img.removeAttribute('src');
    img.hidden = true;
    placeholder.hidden = false;
  }
}

function makeCats() {
  const list = ['전체', ...new Set(products.map(p => p.category || '기타'))];
  cats.innerHTML = '';
  list.forEach(c => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip' + (c === currentCategory ? ' active' : '');
    b.textContent = c;
    b.onclick = () => {
      currentCategory = c;
      makeCats();
      render();
    };
    cats.appendChild(b);
  });
}

function toggleRow(fragment, selector, value) {
  const row = fragment.querySelector(selector);
  if (!value) {
    row.hidden = true;
    return;
  }
  row.querySelector('dd').textContent = value;
}

function render() {
  const q = normalize(search.value);
  const list = products.filter(p =>
    (currentCategory === '전체' || (p.category || '기타') === currentCategory) &&
    (!q || searchable(p).includes(q))
  );

  count.textContent = `상품 ${list.length}개`;
  source.textContent = products.length ? `전체 ${products.length}개` : '데이터 없음';
  grid.innerHTML = '';

  if (!list.length) {
    grid.innerHTML = '<div class="empty">조건에 맞는 상품이 없습니다.</div>';
    return;
  }

  const batch = document.createDocumentFragment();
  list.forEach(p => {
    const n = tpl.content.cloneNode(true);
    const card = n.querySelector('.card');
    const img = n.querySelector('.photo');
    const noImage = n.querySelector('.noImage');
    setImage(img, noImage, p);
    n.querySelector('.category').textContent = p.category || '기타';
    n.querySelector('.name').textContent = p.name || p.code;
    n.querySelector('.code').textContent = p.code;
    toggleRow(n, '.row-size', p.size);
    toggleRow(n, '.row-spec', p.spec);
    toggleRow(n, '.row-detail', p.detail);

    const copy = n.querySelector('.copy');
    copy.onclick = e => {
      e.stopPropagation();
      copyText(p.code, copy);
    };

    card.onclick = () => openProduct(p);
    card.onkeydown = e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openProduct(p);
      }
    };
    batch.appendChild(n);
  });
  grid.appendChild(batch);
}

function infoRow(label, value) {
  if (!value) return '';
  return `<div><dt>${label}</dt><dd>${escapeHtml(value)}</dd></div>`;
}

function escapeHtml(value='') {
  return String(value).replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
}

function openProduct(p) {
  dialogCode = p.code;
  dialogCategory.textContent = p.category || '기타';
  dialogName.textContent = p.name || p.code;
  setImage(dialogPhoto, dialogNoImage, p);
  dialogInfo.innerHTML =
    infoRow('상품번호', p.code) +
    infoRow('치수', p.size) +
    infoRow('규격', p.spec) +
    infoRow('상세', p.detail);
  if (typeof dialog.showModal === 'function') dialog.showModal();
}

search.oninput = render;
dialogClose.onclick = () => dialog.close();
dialog.onclick = e => {
  if (e.target === dialog) dialog.close();
};
dialogCopy.onclick = () => copyText(dialogCode, dialogCopy);

makeCats();
render();
