const timeZoneService = require('../../backend-logic/time-zone-service');

// BEGIN общая часть на клиенте и сервере
function getTime(tz) { 
  var d = new Date();
  if (tz)
  {
    var currentTimeZoneOffsetInHours = d.getTimezoneOffset() / 60;
    var diff = tz + currentTimeZoneOffsetInHours;
    d = new Date(d.getTime() + diff  * 60 * 60 * 1000);
  }

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

async function renderAddressContent(request) { 
 if (request.query["ssr"] === 'false')
    return '';

  return await render(request.query, async () => await timeZoneService.getTimeZone("vasyaPupkin")) 
};

module.exports = {
   renderAddressContent: renderAddressContent
}