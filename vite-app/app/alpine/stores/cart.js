import Alpine from 'alpinejs'
import persist from '@alpinejs/persist'

Alpine.plugin(persist)

export default {
    itemLines: Alpine.$persist([]).as('cart_lines'),
    cart: {},
    init() {
      this.fetchCart();
    },
    fetchCart() {
      fetch(window.Shopify.routes.root + 'cart.js')
        .then((response) => response.json())
        .then((cart) => {
          fetch('/apps/second-app/cart/', {
            method: 'POST',
            headers: {
              'ngrok-skip-browser-warning': 'true',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(cart),
          })
            .then((cartResponse) => cartResponse.json())
            .then((cartObject) => {
              this.cart = cartObject;
              this.itemLines = cartObject.items;
            });
        });
    },
    removeItemLine(removedItemLine) {
      this.itemLines = this.itemLines.filter((itemLine) => itemLine.variant_id !== removedItemLine.variant_id);
    },
    timestamp(product) {
      const existingLine = this.itemLines.find((line) => {
        return line.id === product.variants[0].id;
      });
      return existingLine !== undefined ? existingLine.properties._timestamp : Date.now();
    },
  }