import addToCart from "./components/add-to-cart";
import carousel from "./components/carousel";
import collection from "./components/collection";
import miniCart from "./components/mini-cart";
import topSearch from "./components/top-search";

export default [
  {
    xdata: 'addToCart',
    component: addToCart
  },
  {
    xdata: 'carousel',
    component: carousel
  },
  {
    xdata: 'collection',
    component: collection
  },
  {
    xdata: 'miniCart',
    component: miniCart
  },
  {
    xdata: 'topSearch',
    component: topSearch
  }
]