"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
let d = new Date();
module.exports = {
    name: "messageDelete",
    run: async (messages) => {
        let client = messages.first().client;
        let file = fs_1.default.createWriteStream(path_1.default.join(__dirname, "../../storage") + 'messageDeleteBulk.txt');
        messages.forEach(m => {
            file.write(`[${m.member.displayName} | ${m.member.id}] >> ${m.content}\n`);
        });
        file.end();
        const log = new discord_js_1.MessageAttachment(path_1.default.join(__dirname, "../../storage") + 'messageDeleteBulk.txt');
        client.logs?.send(log);
    }
};
