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
            this.pool.getConnection(async (err, con) => {
                if (err)
                    reject(err);
                con.query(`INSERT INTO data_suggestions (ID, Status, Text, UserID, Review, Score) VALUES('${this.suggID}', '2', '${Suggestion.message}', '${Suggestion.member.id}', 'null', '0')`, async (err, rows) => {
                    if (err)
                        reject(err);
                    resolve(await this._getData(this.suggID));
                });
                con.release();
                this.emit("suggestionAdd", await this._getData(this.suggID));
            });
        });
    }
    async getSuggestion(id) {
        let aw = await this._getData(id);
        return new Promise((resolve, reject) => {
            resolve(aw);
        });
    }
    async reviewSuggestion(id, aod, reason, UID) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection(async (err, con) => {
                if (err)
                    reject(err);
                con.query(`UPDATE data_suggestions SET Status = '${aod}', Review = '${reason}', Reviewer = '${UID}' WHERE ID = '${id}'`, async (err, rows) => {
                    if (err)
                        reject(err);
                    resolve(await this._getData(id));
                });
                con.release();
                this.emit("suggestionReview", await this._getData(id));
            });
        });
    }
    async deleteSuggestion(id) {
        async function re() {
            this.emit("suggestionDelete", await this._getData(this.id));
            return await this._getData(this.id);
        }
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, con) => {
                con.query(`DELETE FROM data_suggestions where ID = '${id}'`, (err, rows) => {
                    if (err)
                        reject(err);
                    resolve(rows[0]);
                    this.emit("suggestionDelete", re());
                });
                con.release();
            });
        });
    }
    async getAllSuggestions() {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, con) => {
                con.query(`SELECT * FROM data_suggestions`, (err, rows) => {
                    if (err)
                        reject(err);
                    resolve(rows);
                });
                con.release();
            });
        });
    }
    async markAP(id, mid) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, con) => {
                con.query(`UPDATE data_suggestions SET MsgID = '${mid}' WHERE ID = '${id}'`, (err, rows) => {
                    if (err)
                        reject(err);
                });
                if (err)
                    reject(err);
                resolve();
                con.release();
            });
            this.emit("markAP");
        });
    }
    getPing() {
        let d = Date.now();
        let sqp;
        this.pool.getConnection((err, con) => {
            con.ping((err) => {
                if (err)
                    throw err;
                sqp = Date.now();
            });
        });
        return sqp - d;
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
    async _getDataPromise(id) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, con) => {
                if (err)
                    reject(err);
                con.query(`SELECT * FROM data_suggestions WHERE ID='${id}'`, (err, rows) => {
                    if (err)
                        reject(err);
                    resolve(rows[0]);
                });
            });
        });
    }
    async _getData(id) {
        return await this._getDataPromise(id);
    }
}
module.exports = { SuggestionManager };
module.exports = SuggestionManager;
