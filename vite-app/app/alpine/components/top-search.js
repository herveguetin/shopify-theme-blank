export default function () {
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
}