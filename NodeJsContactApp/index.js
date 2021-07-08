const express = require('express');

const setupAddressFragment = require('./fragments/address/setup');
const setupMapFragment = require('./fragments/map/setup');
const setupApi = require('./api/setup');

const app = express();
app.use('/assets', express.static('assets'));

setupAddressFragment(app);
setupMapFragment(app);
setupApi(app);

app.listen(7100);