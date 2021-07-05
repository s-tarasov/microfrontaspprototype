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
     if (fragmentParams["compact-form"] === 'true')
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

function renderAddressContent(request) { 
 if (request.query["ssr"] === 'false')
    return '';

  return render(request.query) 
};

module.exports = {
   renderAddressContent: renderAddressContent
}