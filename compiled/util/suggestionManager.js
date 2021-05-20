"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
const events_1 = require("events");
const mysql = __importStar(require("mysql"));
class SuggestionManager extends events_1.EventEmitter {
    constructor(database) {
        super();
        this.dbdata = database;
        this.pool = mysql.createPool({
            connectionLimit: 15,
            queueLimit: 20,
            host: this.dbdata.host,
            user: this.dbdata.user,
            database: this.dbdata.database,
            password: this.dbdata.password
        });
    }
    async addSuggestion(Suggestion) {
        this.suggID = this._genID(7);
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, con) => {
                if (err)
                    reject(err);
                con.query(`INSERT INTO data_suggestions (ID, Status, Text, UserID, Review, Reviewer, Score) VAULUES('${this.suggID}, 2, '${Suggestion.message}', '${Suggestion.member.id}, null, null, 0')`);
                con.release();
            });
            let data = {
                ID: this.suggID,
                Status: 2,
                Text: Suggestion.message,
                UserID: Suggestion.member.id,
                Review: null,
                Reviewer: null,
                Score: 0
            };
            resolve(data);
            this.emit("suggestionAdd", data);
        });
    }
    async getSuggestion(id) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, con) => {
                if (err)
                    reject(err);
                con.query(`SELECT * FROM data_suggestions WHERE id ='${id}'`, (e, result) => {
                    if (e)
                        reject(e);
                    resolve(result[0]);
                });
            });
        });
    }
    async reviewSuggestion(aod, reason) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, con) => {
                if (err)
                    reject(err);
                con.query(`UPDATE data_suggestions (Review, Reviewer) VALUES(${aod}, '${reason}')`, (err, rows) => {
                    if (err)
                        reject(err);
                    resolve(rows[0]);
                    this.emit("suggestionReview", rows[0]);
                });
            });
        });
    }
    _genID(count) {
        let chars = 'acdefhiklmnoqrstuvwxyz0123456789'.split('');
        let result = '';
        for (let i = 0; i < count; i++) {
            let x = Math.floor(Math.random() * chars.length);
            result += chars[x];
        }
        return result;
    }
}
module.exports = { SuggestionManager };
module.exports = SuggestionManager;
