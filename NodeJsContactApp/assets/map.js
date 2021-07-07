console.log('map bundle loaded');


class FragmentContactMap extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<div class="map"></div>`;

    ymaps.ready(() =>{
    	this.myMap = new ymaps.Map(this.querySelector('.map'), {
        // При инициализации карты обязательно нужно указать
        // её центр и коэффициент масштабирования.
        center:[55.76, 37.64], // Москва
        zoom:10
    });
    });
  }
}
window.customElements.define("fragment-contact-map", FragmentContactMap);