const timeZoneService = require('../backend-logic/time-zone-service');

function setup(app) 
{
	app.get("/a/contact/api/timezone", async (req, res) => {
		var context = JSON.parse(req.headers["x-context"]) ;		
		var tz = await timeZoneService.getTimeZone(context.isAuthenticated);
	    res.status(200).send({tz:tz});
	});
}

module.exports = setup;