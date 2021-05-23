"use strict";
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const discord_js_1 = require("discord.js");
const chalk = require('chalk');
function load(client) {
    client = { ...discord_js_1.Client };
    return true;
}
module.exports = { load };
module.exports = load;
