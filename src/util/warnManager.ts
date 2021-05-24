import { GuildMember, Message } from 'discord.js'
import { EventEmitter } from 'events'
import * as mysql from 'mysql'

export class warningManager extends EventEmitter {
    dbdata: mysql.ConnectionConfig
    pool: mysql.Pool
    wid?: string
    date?: Date
    constructor(database: mysql.ConnectionConfig) {
            super()
            this.dbdata = database
            this.pool = mysql.createPool({
                connectionLimit: 15,
                queueLimit: 20,
                host: this.dbdata.host,
                user: this.dbdata.user,
                database: this.dbdata.database,
                password: this.dbdata.password
            })
            this.date = new Date()
    }

    async addWarn(Staff: GuildMember, User: GuildMember, message: Message, Reason?: string):Promise<WarnData> {
        this.wid = this._genID(7)
        return new Promise((resolve, reject) => {
            this.pool.getConnection(async(err, con) => {
                if(err) reject(err)
                con.query(`INSERT INTO  data_warnings (ID, Staff, User, Reason, Date, MID) VALUES('${this.wid}', '${Staff.id}', '${User.id}', '${Reason}', '${this.date.toUTCString()}', '${message.id}')`, async(err) => {
                    if(err) reject(err)
                    resolve(await this._getData(this.wid))
                })
                this.emit("warnAdd", await this._getData(this.wid))
            })
        })
    }

    async getWarn(id:string):Promise<WarnData> {
        let aw = await this._getData(id)
        return new Promise((resolve, reject) => {
            resolve(aw)
        })
    }

    async deleteWarn(id:string):Promise<string> {
        return new Promise((resolve, reject) => {
            this.pool.getConnection(async(err, con) => {
                if(err) reject(err)
                con.query(`DELETE FROM data_warnings WHERE ID='${id}'`, async(err) => {
                    if(err) reject(err)
                    resolve(id)
                })
                this.emit("warnDelete", id)
            })
        })
    }

    async getPing():Promise<number> {
        return new Promise((resolve, reject) => {
            let d = Date.now()
            this.pool.getConnection(async(err, con) => {
                await con.ping((err) => {
                    if(err) throw err
                    let sqp = Date.now()
                    resolve(Math.floor(sqp - d))
                })
            })
        })
    }

    private _genID(count:number):string{
        let chars = 'acdefhiklmnoqrstuvwxyzABCDEFGHIJKLMNOPQRSTUV0123456789'.split('');
        let result = '';
        for(let i=0; i<count; i++){
          let x = Math.floor(Math.random() * chars.length);
          result += chars[x];
        }
        return result;
    }

    private async _getDataPromise(id:string):Promise<WarnData> {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err: mysql.MysqlError, con: mysql.PoolConnection) => {
                if(err) reject(err)
                con.query(`SELECT * FROM data_warnings WHERE ID='${id}'`, (err, rows) => {
                    if(err) reject(err)
                    resolve(rows[0])
                })
            })
        })
    }

    private async _getData(id:string) {
        return await this._getDataPromise(id)
    }
}

interface WarnData {
    ID: string
    Staff: string
    User: string
    Reason: string
    Date: Date
    MID: string
}

module.exports = { warningManager }