(function(){

// BEGIN общая часть на клиенте и сервере
function getTime(tz) { 
  var d = new Date();
  
  var currentTimeZoneOffsetInHours = d.getTimezoneOffset() / 60;
  var diff = tz + currentTimeZoneOffsetInHours;
  d = new Date(d.getTime() + diff  * 60 * 60 * 1000);

  var h = (d.getHours()).toString();
  var m = (d.getMinutes()).toString();
  var s = (d.getSeconds()).toString();
  var h2 = ("0" + h).slice(-2);
  var m2 = ("0" + m).slice(-2);
  var s2 = ("0" + s).slice(-2);
  return h2 + ":" + m2 + ":" + s2;
}

async function render(fragmentParams, getTimezone) {
     if (fragmentParams["compact-form"] === 'true')
       return `
         NodeJsApp   <b>Это компактная форма</b>
       `;

       var tz = await getTimezone();

      return `
      NodeJsApp   <b>Это полная форма!!!</b>

         <div class="digital-clock">
                <div class="time">`+ getTime(tz) +`</div>
                <div class="picture"></div>                
         </div>
        `;
   }
// END общая часть на клиенте и сервере

function readAttrubutes(el){ // read DOM element attributes to object {"attrName":"attrValue"}
  var result = {};
  for (var i = 0, atts = el.attributes, n = atts.length, arr = []; i < n; i++){
    result[atts[i].nodeName] = atts[i].value; 
  }
  return result;
}

class FragmentContactAddress extends HTMLElement {
  async connectedCallback() {
    var fragmentParams = readAttrubutes(this);
    this.innerHTML = await render(fragmentParams, async () => await this.getTimezone());    

    if (fragmentParams["compact-form"] !== "true"){ 
      var el = this;
      setInterval(async () =>{ 
        var timeEl = el.querySelector(".time"); 
        timeEl.innerHTML = getTime(await this.getTimezone());
      }, 1000);  
    }
  }

  getTimezone() {
    if (this._tz)
       return this._tz;

      this._tz = fetch(`/a/contact/api/timezone`)
        .then(res => res.json())
        .then(resJson => {
            return resJson.tz;
        })
        return this._tz;    
  }
}
window.customElements.define("fragment-contact-address", FragmentContactAddress);


})();