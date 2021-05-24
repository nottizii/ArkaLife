import { GuildMember } from 'discord.js'
import { EventEmitter } from 'events'
import * as mysql from 'mysql'

export default class SuggestionManager extends EventEmitter {
    dbdata: mysql.ConnectionConfig
    pool: mysql.Pool
    suggID: string
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
    }
    async addSuggestion(Suggestion: Suggestion):Promise<SuggestionData> {
        this.suggID = this._genID(7)
        return new Promise((resolve, reject) => {
            this.pool.getConnection(async(err: mysql.MysqlError, con: mysql.PoolConnection) => {
                if(err) reject(err)
                con.query(`INSERT INTO data_suggestions (ID, Status, Text, UserID, Review, Score) VALUES('${this.suggID}', '2', '${Suggestion.message}', '${Suggestion.member.id}', 'null', '0')`, async(err, rows) => {
                    if(err) reject(err)
                    resolve(await this._getData(this.suggID))
                })
                con.release()
                this.emit("suggestionAdd", await this._getData(this.suggID))
            })
        })
    }

    async getSuggestion(id:string):Promise<SuggestionData>{
        let aw = await this._getData(id)
        return new Promise((resolve, reject) => {
            resolve(aw)
        })
    }

    async reviewSuggestion(id:string, aod:number, reason:string, UID:string):Promise<SuggestionData> {
        return new Promise((resolve, reject) => {
            this.pool.getConnection(async(err: mysql.MysqlError, con: mysql.PoolConnection) => {
                if(err) reject(err)
                con.query(`UPDATE data_suggestions SET Status = '${aod}', Review = '${reason}', Reviewer = '${UID}' WHERE ID = '${id}'`, async(err, rows) => {
                    if(err) reject(err)
                    resolve(await this._getData(id))         
                })
                con.release()
                this.emit("suggestionReview", await this._getData(id))
            })
        })
    }

    async deleteSuggestion(id:string):Promise<SuggestionData> {
        async function re() {
            this.emit("suggestionDelete", await this._getData(this.id))
            return await this._getData(this.id)
        }
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err: mysql.MysqlError, con: mysql.PoolConnection) => {
                con.query(`DELETE FROM data_suggestions where ID = '${id}'`, (err, rows) => {
                    if(err) reject(err)
                    resolve(rows[0] as SuggestionData)
                    this.emit("suggestionDelete", re())
                })
                con.release()
            })
        })
    }

    async getAllSuggestions():Promise<SuggestionDataArray> {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err: mysql.MysqlError, con: mysql.PoolConnection) => {
                con.query(`SELECT * FROM data_suggestions`, (err, rows) => {
                    if(err) reject(err)
                    resolve(rows as SuggestionDataArray)
                })
                con.release()
            })
        })
    }

    async markAP(id:string, mid:string):Promise<void> {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err: mysql.MysqlError, con: mysql.PoolConnection) => {
                con.query(`UPDATE data_suggestions SET MsgID = '${mid}' WHERE ID = '${id}'`, (err, rows) => {
                    if(err) reject(err)
                })
                if(err) reject(err)
                resolve()
                con.release()  
            })
            this.emit("markAP")
        })
    }

    getPing():number {
        let d = Date.now()
        let sqp;
        this.pool.getConnection((err, con) => {
            con.ping((err) => {
                if(err) throw err
                sqp = Date.now()
            })
        })
        return sqp - d
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

    private async _getDataPromise(id:string):Promise<SuggestionData> {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err: mysql.MysqlError, con: mysql.PoolConnection) => {
                if(err) reject(err)
                con.query(`SELECT * FROM data_suggestions WHERE ID='${id}'`, (err, rows) => {
                    if(err) reject(err)
                    resolve(rows[0] as SuggestionData)
                })
            })
        })
    }

    private async _getData(id:string) {
        return await this._getDataPromise(id)
    }
}

interface Suggestion {
    member: GuildMember
    message: string
}

interface SuggestionData {
    ID: string
    Status: number
    Text: string
    UserID: GuildMember["id"]
    Review: string
    Reviewer: string | GuildMember["id"]
    Score: number,
    MsgID: string
}

type SuggestionDataArray = Array<SuggestionData>

module.exports = { SuggestionManager }