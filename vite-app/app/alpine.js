
import Alpine from 'alpinejs'
import components from './alpine/components'
import stores from './alpine/stores'

window.Alpine = Alpine

document.addEventListener('alpine:init', () => {
    components.map(component => Alpine.data(component.xdata, component.component))
    stores.map(store => Alpine.store(store.name, store.store))
});

Alpine.start()