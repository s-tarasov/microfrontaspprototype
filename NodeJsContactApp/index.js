const express = require('express');
const Podlet = require('@podium/podlet');

const app = express();

const podlet = new Podlet({
    name: 'myPodlet', // required
    version: '1.0.0', // required
    pathname: '/', // required
    manifest: '/fragments/address/manifest.json', // optional, defaults to '/manifest.json'
    content: '/fragments/address/', // optional, defaults to '/'
    development: true, // optional, defaults to false
});
podlet.js({ value: `http://my-podlet.com/assets/scripts.js` });

app.use(podlet.middleware());

app.get(podlet.content(), (req, res) => {
	if (req.query["compact-form"] === 'true')
        res.status(200).podiumSend(`
         NodeJsApp   <b>Это компактная форма</b>
       `);
	else
	    res.status(200).podiumSend(`
         NodeJsApp   <b>Это полная форма!!</b>
        `);
});

app.get(podlet.manifest(), (req, res) => {
    res.status(200).send(podlet);
});

app.listen(7100);