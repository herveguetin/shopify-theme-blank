export default function (usedProduct = {}, usedBoxConfig = {}) {
    return {
        product: usedProduct,
        boxConfig: usedBoxConfig,
        isLoading: false,
        addProductToCart() {
          this.isLoading = true;
          fetch(window.Shopify.routes.root + 'cart/add.js', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              items: [
                {
                  id: this.product.variants[0].id,
                  quantity: 1,
                  properties: {
                    _box: JSON.stringify(this.boxConfig),
                    _timestamp: this.$store.cart.timestamp(this.product),
                  },
                },
              ],
            }),
          })
            .then((response) => response.json())
            .then((itemLines) => {
              this.isLoading = false;
              const addedItem = itemLines.items[0];
              this.$dispatch('cart-item-added', { item: addedItem });
              this.$store.cart.fetchCart();
            });
        },
    };
}