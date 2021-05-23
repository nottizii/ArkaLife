const { database } = require("../../storage/settings.json");
const mysql = require("mysql");
module.exports = {
    nombre: "dbconnection",
    run: async () => {
        return new Promise((res, rej) => {
            //conexión con DB
            let connection = mysql.createConnection({
                host: database.host,
                user: database.user,
                password: database.password,
                database: database.database,
                port: database.port ?? 3306
            });
            connection.connect(function (error) {
                if (error) {
                    console.log(error);
                    rej("Ha ocurrido un error");
                }
                else {
                    //console.log('[dbconnection.js] Conexión correcta.');
                    return res(connection);
                }
            });
        });
    }
};
