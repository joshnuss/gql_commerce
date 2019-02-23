import products from './products';
import pubsub from './pubsub';

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
      this.fireChanged();
    }
  },

  update(productId, quantity) {
    const item = this.items.find(line => line.product.id === productId);

    if (!item) {
      throw new Error('Item does not exist');
    }

    const oldQuantity = item.quantity;

    item.quantity = quantity;
    item.subtotal = item.product.price * item.quantity;

    this.recalculate();

    if (oldQuantity !== quantity) {
      this.fireChanged();
    }
  },

  increment(productId, by) {
    const item = this.items.find(line => line.product.id === productId);

    if (!item) {
      throw new Error('Item does not exist');
    }

    this.update(productId, item.quantity + by);
  },

  decrement(productId, by) {
    const item = this.items.find(line => line.product.id === productId);

    if (!item) {
      throw new Error('Item does not exist');
    }

    if (item.quantity < by) {
      throw new Error(`Cannot decrement by ${by}`);
    }

    if (item.quantity === by) {
      this.remove(productId);
    } else {
      this.update(productId, item.quantity - by);
    }
  },

  remove(productId) {
    const itemIndex = this.items.findIndex(line => line.product.id === productId);

    if (itemIndex < 0) {
      throw new Error('Item does not exist');
    }

    this.items.splice(itemIndex, 1);

    this.recalculate();
    this.fireChanged();
  },

  empty() {
    this.items = [];
    this.recalculate();
    this.fireChanged();
  },

  recalculate() {
    this.total = 0;

    this.items.forEach((item) => {
      item.subtotal = item.product.price * item.quantity;

      this.total += item.subtotal;
    });
  },

  fireChanged() {
    pubsub.publish('cartChanged', { cartChanged: this });
  },
};
