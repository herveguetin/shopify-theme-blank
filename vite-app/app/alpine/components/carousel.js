export default function () {
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
}