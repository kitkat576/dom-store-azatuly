class Store {
  #items;

  constructor(initialItems = []) {
    this.#items = Array.isArray(initialItems) ? [...initialItems] : [];
  }

  get count() { return this.#items.length; }

  // ВОТ ЭТОТ МЕТОД ИЩЕТ app.js
  list() {
    return this.#items.map((i) => ({ ...i }));
  }

  add(item) {
    const existing = this.#items.find(
      (i) => i.name.trim().toLowerCase() === item.name.trim().toLowerCase()
    );
    if (existing) {
      existing.qty += item.qty;
      existing.price = item.price;
      return { isNew: false, priceChanged: existing.price !== item.price };
    } else {
      this.#items.push({ name: item.name.trim(), price: item.price, qty: item.qty });
      return { isNew: true };
    }
  }

  update(name, newQty) {
    const item = this.#items.find((i) => i.name === name);
    if (item) {
      if (newQty <= 0) this.remove(name);
      else item.qty = Math.min(newQty, 9999);
    }
  }

  remove(name) {
    this.#items = this.#items.filter((i) => i.name !== name);
  }

  total() {
    return this.#items.reduce((sum, { price, qty }) => sum + price * qty, 0);
  }

  totalUnits() {
    return this.#items.reduce((sum, { qty }) => sum + qty, 0);
  }
}