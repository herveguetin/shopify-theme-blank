export default function (usedCollectionId) {
    return {
        collectionId: usedCollectionId,
        products: [],
        init() {

          // REMOVE

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
}