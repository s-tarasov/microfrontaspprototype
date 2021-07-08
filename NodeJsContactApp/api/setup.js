const timeZoneService = require('../backend-logic/time-zone-service');

function setup(app) 
{
	app.get("/a/contact/api/timezone", async (req, res) => {
		var tz = await timeZoneService.getTimeZone("vasyaPupkin");
	    res.status(200).send({tz:tz});
	});
}

module.exports = setup;