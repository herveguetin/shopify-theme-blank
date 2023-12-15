import algoliasearch from 'algoliasearch/lite';
import { history } from 'instantsearch.js/es/lib/routers';

export default function() {

  const FACET_VALUE_AGGREGATOR = '~';
  const APP_ID = 'M61UXZM0A8';
  const API_KEY = '4d9f7d038f7fdbfdbf5528bacf6bda0c';
  const INDEX_NAME = 'jbclair_products';
  const SEARCH_HITS_PER_PAGE = 5;

  return {
    index: {},
    helper: {},
    products: [],
    filters: [],
    facets: [],
    history: history(),
    state: {},

    init() {
      this.$watch('state', v => this.onStateUpdate())
      window.addEventListener('popstate', (event) => this.routeToState())
      this.history.start();
      this.index = algoliasearch(APP_ID, API_KEY).initIndex(INDEX_NAME);
      this.routeToState();
      this.mergeShopifyConfig();
    },

    onStateUpdate() {
      this.stateToRoute();
      this.search().then(response => this.products = response.hits);
    },

    routeToState() {
      let state = this.history.read();
      state.facets = [];
      for (const [key, value] of Object.entries(state)) {
        const matchingFacet = window.shopifyCollectionConfig.facets.find(facet => facet.attribute === key);
        if (matchingFacet) {
          state.facets.push({ attribute: key, values: value.split(FACET_VALUE_AGGREGATOR) });
          delete state[key];
        }
      }
      this.state = state;
    },

    stateToRoute() {
      const { facets, ...UIState } = this.state;
      this.state.facets.map(facet => UIState[facet.attribute] = facet.values.join(FACET_VALUE_AGGREGATOR));
      this.history.write(UIState);
    },

    mergeShopifyConfig() {
      const config = window.shopifyCollectionConfig;
      this.filters = config.filters.filter(filter => filter.value !== '');
      this.search(false).then(response => { // get all possible facets values
        let facets = config.facets.map(facet => {
          facet.values = Object.keys(response.facets[facet.attribute]);
          return facet;
        });
        this.facets = facets.filter(facet => facet.values.length > 1);
      });
    },

    search(isFaceted = true) {
      return this.index.search(this.state.q, {
        hitsPerPage: SEARCH_HITS_PER_PAGE,
        page: this.state.page,
        facets: window.shopifyCollectionConfig.facets.map(facet => facet.attribute),
        facetFilters: this.facetFilters(isFaceted)
      });
    },

    facetFilters(isFaceted) {
      const format = (config) => config.join(':');
      const activeFacets = (!isFaceted) ? [] : this.state.facets
        .map(facet => facet.values.map(value => format([facet.attribute, value])));
      const filters = this.filters
        .map(filter => format([filter.attribute, filter.value]));
      return activeFacets.concat(filters);
    },

    toggleFacetValue(toggledFacet, toggledValue) {
      let facet = this.state.facets.find(activeFacet => activeFacet.attribute === toggledFacet.attribute);
      const facetValue = (facet) ? facet.values.find(activeValue => activeValue === toggledValue) : undefined;
      const config = [(facet) ? '1' : '0', (facetValue) ? '1' : '0'].join(':');

      switch (config) {
        case '0:0':
          facet = Object.assign({}, toggledFacet);
          facet.values = [toggledValue];
          this.state.facets.push(facet);
          break;
        case '1:0':
          facet.values.push(toggledValue);
          break;
        case '1:1':
          facet.values = facet.values.filter(value => value !== toggledValue);
          break;
      }
      this.state.facets = this.state.facets.filter(facet => facet.values.length)
    }
  };
}
