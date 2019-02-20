import products from './products';

export default {
  items: [],
  currency: 'USD',
  total: 0,

  add(productId, quantity = 1) {
    const product = products[productId];

    if (!product) {
      throw new Error('Unknown product');
    }

    const item = this.items.find(line => line.product.id === productId);

    if (item) {
      this.update(productId, item.quantity + quantity);
    } else {
      this.items.push({
        product,
        quantity,
        subtotal: product.price * quantity,
      });

      this.recalculate();
    }
  },

  update(productId, quantity) {
    const item = this.items.find(line => line.product.id === productId);

    if (!item) {
      throw new Error('Item does not exist');
    }

    item.quantity = quantity;
    item.subtotal = item.product.price * item.quantity;

    this.recalculate();
  },

  remove(productId) {
    const itemIndex = this.items.findIndex(line => line.product.id === productId);

    if (itemIndex < 0) {
      throw new Error('Item does not exist');
    }

    this.items.splice(itemIndex, 1);

    this.recalculate();
  },

  recalculate() {
    this.total = 0;

    this.items.forEach((item) => {
      item.subtotal = item.product.price * item.quantity;

      this.total += item.subtotal;
    });
  },
};
