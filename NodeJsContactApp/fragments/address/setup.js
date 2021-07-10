const Podlet = require('@podium/podlet');
const serverPart = require('./server');
const view = require('../../view');

function setup(app) 
{
	const podlet = new Podlet({
	    name: 'address', // required
	    version: '1.0.0', // required
	    pathname: '/', // required
	    manifest: '/fragments/address/', // optional, defaults to '/manifest.json'
	    content: '/fragments/address/content', // optional, defaults to '/'
	    development: true, // optional, defaults to false
	});	

	podlet.js({ value: `http://contact.localhost:7100/assets/scripts.js` });
	podlet.css({ value: `http://contact.localhost:7100/assets/styles.css` });
	podlet.view(view.view);

	app.use(podlet.middleware());

	app.get(podlet.content(), async (req, res) => {
		res.status(200).podiumSend(await serverPart.renderAddressContent(req));
	});

	app.get(podlet.manifest(), (req, res) => {
	    res.status(200).send(podlet);
	});
}

module.exports = setup;