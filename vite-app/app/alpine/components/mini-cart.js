export default function () {
    return {
        isOpen: false,
        get products() {
          return this.$store.cart.itemLines;
        },
        get total() {
          return this.$store.cart.cart.total_price / 100;
        },
        get itemsCount() {
          return this.products.reduce((accumulator, product) => accumulator + product.quantity, 0);
        },
        quantityLabel(product) {
          let label = product.quantity + ' bouteille(s)';
          if (product.properties._box_data) {
            const boxData = product.properties._box_data;
            let labelItems = [];
            if (boxData.nb_of_boxes > 0) {
              labelItems.push(boxData.nb_of_boxes + ' caisse(s)');
            }
            if (boxData.nb_of_remaining_bottles > 0) {
              labelItems.push(boxData.nb_of_remaining_bottles + ' bouteille(s)');
            }
            label = labelItems.join(' + ');
          }
          return label;
        },
        remove(product) {
          const variantId = product.variant_id;
          const update = {};
          update[variantId] = 0;
          fetch(window.Shopify.routes.root + 'cart/update.js', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              updates: update,
            }),
          }).then((response) => this.$store.cart.fetchCart());
        },
    };
}