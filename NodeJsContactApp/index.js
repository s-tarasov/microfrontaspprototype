const express = require('express');
const Podlet = require('@podium/podlet');
const utils = require('@podium/utils');
const addressFragment = require('./fragments/address/server');

const app = express();


// fragments api
const podlet = new Podlet({
    name: 'address', // required
    version: '1.0.0', // required
    pathname: '/', // required
    manifest: '/fragments/address/', // optional, defaults to '/manifest.json'
    content: '/fragments/address/content', // optional, defaults to '/'
    development: true, // optional, defaults to false
});

podlet.view((incoming, body, head) => { return `<!doctype html>
<html lang="${incoming.context.locale}">
    <head>
        <meta charset="${incoming.view.encoding}">
        ${incoming.css.map(utils.buildLinkElement).join('\n')}
    
    </head>
    <body>
        ${body}
        ${incoming.js.map(utils.buildScriptElement).join('\n')}
    </body>
</html>`;
});

app.use(podlet.middleware());

app.get(podlet.content(), (req, res) => {
	res.status(200).podiumSend(addressFragment.renderAddressContent(req));
});

app.get(podlet.manifest(), (req, res) => {
    res.status(200).send(podlet);
});



// JS CSS

podlet.js({ value: `http://contact.localhost:7100/assets/scripts.js` });
podlet.css({ value: `http://contact.localhost:7100/assets/styles.css` });

app.use('/assets', express.static('assets'));

app.listen(7100);