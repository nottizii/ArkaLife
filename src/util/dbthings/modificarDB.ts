let dbconnection = require("../functions/dbconnection");

let importdb = async () => {
    //conexión con DB

    let connection = await dbconnection.run()
    if(!connection) {
        return console.log("An error ocurred while trying to connect to the database.");
    }
    console.log('This can take a little.');
    let sql = "ALTER TABLE bot_categories MODIFY panel_message VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;";
    connection.query(sql, (err, result) => {
        if(err) {
            console.log(err);
            console.log("An error ocurred (#1285)");
            connection.end();
        } else {
		console.log("listo");
        }
    })
}
importdb();