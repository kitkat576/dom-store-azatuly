// Инициализация хранилища (Товары кофейни вместо пустой таблицы)
// Инициализация хранилища (Расширенный ассортимент AZATULY COFFEE)
const store = new Store([
  { name: 'Кофе Эспрессо бленд (1кг)', price: 9500, qty: 12 },
  { name: 'Кофе Фильтр Эфиопия (1кг)', price: 12500, qty: 4 },
  { name: 'Молоко коровье 3.2% (1л)', price: 450, qty: 48 },
  { name: 'Молоко овсяное (1л)', price: 950, qty: 15 },
  { name: 'Молоко миндальное (1л)', price: 1100, qty: 10 },
  { name: 'Сироп Ванильный (1л)', price: 3200, qty: 3 },
  { name: 'Сироп Соленая Карамель (1л)', price: 3400, qty: 2 },
  { name: 'Матча пудра премиум (100г)', price: 4800, qty: 5 },
  { name: 'Стаканы бумажные 250мл (100шт)', price: 1800, qty: 20 },
  { name: 'Крышки для стаканов (100шт)', price: 800, qty: 20 }
]);

const form = document.getElementById('addProductForm');
const nameInput = document.getElementById('productName');
const priceInput = document.getElementById('productPrice');
const qtyInput = document.getElementById('productQty');

const nameError = document.getElementById('nameError');
const priceError = document.getElementById('priceError');
const qtyError = document.getElementById('qtyError');

const productsTableBody = document.getElementById('productsTableBody');
const emptyState = document.getElementById('emptyState');
const liveTotalEl = document.getElementById('liveTotal');
const itemsCountEl = document.getElementById('itemsCount');
const totalUnitsEl = document.getElementById('totalUnits');
const formSuccessMsg = document.getElementById('formSuccessMsg');
const rowTemplate = document.getElementById('rowTemplate');

function parseStrictPrice(val) {
  const clean = val.replace(/\s+/g, '').replace(',', '.');
  if (!/^\d+(\.\d{1,2})?$/.test(clean)) return NaN;
  return parseFloat(clean);
}

function parseStrictQty(val) {
  const clean = val.replace(/\s+/g, '');
  if (!/^\d+$/.test(clean)) return NaN;
  return parseInt(clean, 10);
}

function validateForm() {
  let isValid = true;

  const nameVal = nameInput.value.trim();
  if (!nameVal) {
    nameError.textContent = 'Укажите название';
    nameInput.classList.add('invalid');
    isValid = false;
  }

  const priceVal = parseStrictPrice(priceInput.value);
  if (isNaN(priceVal) || priceVal <= 0) {
    priceError.textContent = 'Укажите число (например: 1500)';
    priceInput.classList.add('invalid');
    isValid = false;
  } else if (priceVal > 10000000) {
    priceError.textContent = 'Слишком большая цена';
    priceInput.classList.add('invalid');
    isValid = false;
  }

  const qtyVal = parseStrictQty(qtyInput.value);
  if (isNaN(qtyVal) || qtyVal < 1) {
    qtyError.textContent = 'Укажите целое число от 1';
    qtyInput.classList.add('invalid');
    isValid = false;
  } else if (qtyVal > 9999) {
    qtyError.textContent = 'Максимум 9999';
    qtyInput.classList.add('invalid');
    isValid = false;
  }

  return isValid ? { name: nameVal, price: priceVal, qty: qtyVal } : null;
}

function render() {
  const items = store.list();
  productsTableBody.innerHTML = '';

  if (items.length === 0) {
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');

    items.forEach(({ name, price, qty }) => {
      const clone = rowTemplate.content.cloneNode(true);
      
      clone.querySelector('.col-name').textContent = name;
      clone.querySelector('.col-price').textContent = `${price.toLocaleString('ru-RU')} ₸`;
      clone.querySelector('.qty-val').textContent = qty;
      clone.querySelector('.col-sum').textContent = `${(price * qty).toLocaleString('ru-RU')} ₸`;

      const decBtn = clone.querySelector('[data-action="dec"]');
      const incBtn = clone.querySelector('[data-action="inc"]');
      const delBtn = clone.querySelector('[data-action="delete"]');

      decBtn.dataset.name = name;
      incBtn.dataset.name = name;
      delBtn.dataset.name = name;

      if (qty >= 9999) {
        incBtn.disabled = true;
      }

      productsTableBody.appendChild(clone);
    });
  }

  liveTotalEl.textContent = `${store.total().toLocaleString('ru-RU')} ₸`;
  itemsCountEl.textContent = store.count;
  totalUnitsEl.textContent = store.totalUnits();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = validateForm();
  if (data) {
    store.add(data);
    form.reset();
    qtyInput.value = '1';
    
    formSuccessMsg.textContent = `Добавлено: ${data.name}`;
    formSuccessMsg.classList.remove('hidden');
    setTimeout(() => formSuccessMsg.classList.add('hidden'), 3000);

    render();
  }
});

form.addEventListener('input', (e) => {
  const input = e.target;
  if (input.tagName === 'INPUT') {
    input.classList.remove('invalid');
    const errorEl = document.getElementById(`${input.name}Error`);
    if (errorEl) errorEl.textContent = '';
  }
});

productsTableBody.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;

  const action = btn.dataset.action;
  const name = btn.dataset.name;

  if (!action || !name) return;

  const currentItem = store.list().find((i) => i.name === name);
  if (!currentItem) return;

  if (action === 'inc') {
    store.update(name, currentItem.qty + 1);
  } else if (action === 'dec') {
    store.update(name, currentItem.qty - 1);
  } else if (action === 'delete') {
    store.remove(name);
  }

  render();
});

render();