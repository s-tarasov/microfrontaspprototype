(function(){

function getTime() {
  var d = new Date();
  var h = (d.getHours()).toString();
  var m = (d.getMinutes()).toString();
  var s = (d.getSeconds()).toString();
  var h2 = ("0" + h).slice(-2);
  var m2 = ("0" + m).slice(-2);
  var s2 = ("0" + s).slice(-2);
  return h2 + ":" + m2 + ":" + s2;
}

function render(fragmentParams) {
     if (fragmentParams["compact-form"] === "true")
       return `
         NodeJsApp   <b>Это компактная форма</b>
       `;

      return `
      NodeJsApp   <b>Это полная форма!!!</b>

         <div class="digital-clock">
                <div class="time">`+ getTime() +`</div>
                <div class="picture"></div>                
         </div>
        `;
   }

function readAttrubutes(el){
  var result = {};
  for (var i = 0, atts = el.attributes, n = atts.length, arr = []; i < n; i++){
    result[atts[i].nodeName] = atts[i].value; 
  }
  return result;
}

class FragmentContactAddress extends HTMLElement {
  connectedCallback() {
    var fragmentParams = readAttrubutes(this);
    this.innerHTML = render(fragmentParams);
    var el = this;
    if (fragmentParams["compact-form"] !== "true"){    
      setInterval(() =>{ 
        var timeEl = el.querySelector(".time"); 
        timeEl.innerHTML = getTime();
      }, 1000);  
    }
  }
}
window.customElements.define("fragment-contact-address", FragmentContactAddress);


})();