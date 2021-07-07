const Podlet = require('@podium/podlet');
const view = require('../../view');

function setup(app) 
{
	const podlet = new Podlet({
	    name: 'map', // required
	    version: '1.0.0', // required
	    pathname: '/', // required
	    manifest: '/fragments/map/', // optional, defaults to '/manifest.json'
	    content: '/fragments/map/content', // optional, defaults to '/'
	    development: true, // optional, defaults to false
	});	

	podlet.js({ value: `https://api-maps.yandex.ru/2.0/?load=package.standard&lang=ru-RU` });
	podlet.js({ value: `http://contact.localhost:7100/assets/map.js` });

	podlet.css({ value: `http://contact.localhost:7100/assets/map.css` });
	podlet.view(view.view);

	app.use(podlet.middleware());

	app.get(podlet.content(), (req, res) => {
		res.status(200).podiumSend('');
	});

	app.get(podlet.manifest(), (req, res) => {
	    res.status(200).send(podlet);
	});
}

module.exports = setup;