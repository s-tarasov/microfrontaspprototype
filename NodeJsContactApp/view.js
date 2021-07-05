const utils = require('@podium/utils');
const querystring = require('querystring');

module.exports = {
  view: (incoming, body, head) => {      
       var fragmentParamsHtml = ''; 
       for (const [key, value] of Object.entries(incoming.request.query)) {
           fragmentParamsHtml+=` ${key}="${value}"`;
        }
        
        return `<!doctype html>
    <html lang="${incoming.context.locale}">
        <head>
            <meta charset="${incoming.view.encoding}">
            ${incoming.css.map(utils.buildLinkElement).join('\n')}
        
        </head>
        <body>
            <fragment-contact-${incoming.name} ${fragmentParamsHtml}>${body}</fragment-contact-${incoming.name}>        
            ${incoming.js.map(utils.buildScriptElement).join('\n')}
        </body>
    </html>`;
    }
}