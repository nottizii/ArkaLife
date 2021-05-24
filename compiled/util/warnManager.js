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
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const mysql = __importStar(require("mysql"));
class WarningManager extends events_1.EventEmitter {
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
        this.date = new Date();
    }
    async addWarn(Staff, User, message, Reason) {
        this.wid = this._genID(7);
        return new Promise((resolve, reject) => {
            this.pool.getConnection(async (err, con) => {
                if (err)
                    reject(err);
                con.query(`INSERT INTO  data_warnings (ID, Staff, User, Reason, Date, MID) VALUES('${this.wid}', ${Staff.id}, ${User.id}, ${Reason}, '${this.date.toUTCString()}', '${message.id}')`, async (err) => {
                    if (err)
                        reject(err);
                    resolve(await this._getData(this.wid));
                });
                this.emit("warnAdd", await this._getData(this.wid));
            });
        });
    }
    async getWarn(id) {
        let aw = await this._getData(id);
        return new Promise((resolve, reject) => {
            resolve(aw);
        });
    }
    async deleteWarn(id) {
        return new Promise((resolve, reject) => {
            this.pool.getConnection(async (err, con) => {
                if (err)
                    reject(err);
                con.query(`DELETE FROM data_warnings WHERE ID='${id}'`, async (err) => {
                    if (err)
                        reject(err);
                    resolve(await this._getData(id));
                });
                this.emit("warnDelete", await this._getData(id));
            });
        });
    }
    _genID(count) {
        let chars = 'acdefhiklmnoqrstuvwxyzABCDEFGHIJKLMNOPQRSTUV0123456789'.split('');
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
                con.query(`SELECT * FROM data_warnings WHERE ID='${id}'`, (err, rows) => {
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
exports.default = WarningManager;
module.exports = { WarningManager };
