import { GuildMember } from 'discord.js'
import { EventEmitter } from 'events'
import * as mysql from 'mysql'

class SuggestionManager extends EventEmitter {
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
            this.pool.getConnection((err: mysql.MysqlError, con: mysql.PoolConnection) => {
                if(err) reject(err)
                con.query(`INSERT INTO data_suggestions (ID, Status, Text, UserID, Review, Reviewer, Score) VAULUES('${this.suggID}, 2, '${Suggestion.message}', '${Suggestion.member.id}, null, null, 0')`)
                con.release()
            })
            let data = {
                ID: this.suggID,
                Status: 2,
                Text: Suggestion.message,
                UserID: Suggestion.member.id,
                Review: null,
                Reviewer: null,
                Score: 0
            }
            resolve(data)
            this.emit("suggestionAdd", data as SuggestionData)
        })
        
    }

    async getSuggestion(id:string):Promise<SuggestionData>{
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err: mysql.MysqlError, con: mysql.PoolConnection) => {
                if(err) reject(err);
                con.query(`SELECT * FROM data_suggestions WHERE id ='${id}'`, (e, result) => {
                    if(e) reject(e);
                    resolve(result[0] as SuggestionData)
                })
            })
        })
    }

    async reviewSuggestion(aod:number, reason:string):Promise<SuggestionData> {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err: mysql.MysqlError, con: mysql.PoolConnection) => {
                if(err) reject(err)
                con.query(`UPDATE data_suggestions (Review, Reviewer) VALUES(${aod}, '${reason}')`, (err, rows) => {
                    if(err) reject(err)
                    resolve(rows[0] as SuggestionData)
                    this.emit("suggestionReview", rows[0] as SuggestionData)
                })
            })
        })
    }

    private _genID(count:number):string{
        let chars = 'acdefhiklmnoqrstuvwxyz0123456789'.split('');
        let result = '';
        for(let i=0; i<count; i++){
          let x = Math.floor(Math.random() * chars.length);
          result += chars[x];
        }
        return result;
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
    Score: number
}

export = SuggestionManager

module.exports = { SuggestionManager }