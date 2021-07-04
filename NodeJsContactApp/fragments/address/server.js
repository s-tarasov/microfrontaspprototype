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

module.exports = {
   renderAddressContent: function(req) {
   	if (req.query["compact-form"] === 'true')
       return `
         NodeJsApp   <b>Это компактная форма</b>
       `;

      return `
      NodeJsApp   <b>Это полная форма!!!</b>

         <div class="digital-clock">
                <div id="a">`+ getTime() +`</div>
                <div id="picture"></div>                
         </div>
        `;
   }
}