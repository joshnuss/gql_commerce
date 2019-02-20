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
      item.quantity += quantity;
      item.subtotal = product.price * item.quantity;
    } else {
      this.items.push({
        product,
        quantity,
        subtotal: product.price * quantity,
      });
    }
  }
};
