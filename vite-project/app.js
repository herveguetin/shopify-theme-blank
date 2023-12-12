  // Utilities
  window.formatPrice = function (price, locale, currency) {
    return parseFloat(price).toLocaleString(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  document.addEventListener('alpine:init', () => {
    // Components
    Alpine.data('addToCart', (usedProduct = {}, usedBoxConfig = {}) => {
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
    });

    Alpine.data('miniCart', () => {
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
    });

    Alpine.data('topSearch', () => {
      const MIN_QUERY_LENGTH = 3;

      return {
        isOpen: false,
        q: '',
        results: {},
        canShowNoResults: false,
        get products() {
          return this.results.resources ? this.results.resources.results.products : [];
        },
        open() {
          this.reset();
          this.isOpen = true;
        },
        reset() {
          this.q = '';
          this.results = {};
          this.canShowNoResults = false;
        },
        query() {
          if (this.q.length > MIN_QUERY_LENGTH) {
            this.canShowNoResults = false;
            fetch(window.Shopify.routes.root + 'search/suggest.json?q=' + this.q)
              .then((response) => response.json())
              .then((suggestions) => {
                this.results = suggestions;
                this.canShowNoResults = true;
              });
          }
        },
      };
    });

    Alpine.data('carousel', () => {
      return {
        init() {
          new Swiper(this.$el, {
            navigation: {
              nextEl: this.$refs.btn_next,
              prevEl: this.$refs.btn_prev,
            },
            slidesPerView: 4,
            spaceBetween: 20,
          });
        },
      };
    });

    Alpine.data('collection', (usedCollectionId) => {
      return {
        collectionId: usedCollectionId,
        products: [],
        init() {
          const that = this;
          (function (d, script) {
            script = d.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.onload = function () {
              that.search();
            };
            script.src = 'https://cdn.jsdelivr.net/npm/algoliasearch@4.20.0/dist/algoliasearch.umd.js';
            d.getElementsByTagName('head')[0].appendChild(script);
          })(document);
        },
        search() {
          const client = algoliasearch('M61UXZM0A8', '4d9f7d038f7fdbfdbf5528bacf6bda0c');
          const index = client.initIndex('jbclair_products');
          index
            .search('', {
              filters: 'collections:' + this.collectionId,
            })
            .then(({ hits }) => {
              this.products = hits;
            });
        },
      };
    });

    // Stores
    Alpine.store('cart', {
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
    });
  });