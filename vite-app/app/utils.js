window.formatPrice = function (price) {
    return parseFloat(price).toLocaleString(window.appConfig.shop.locale, {
        style: 'currency',
        currency: window.appConfig.shop.currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};