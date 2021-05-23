let fdbconnection = require("../functions/dbconnection");
let importardb = async () => {
    //conexión con DB
    let connection = await fdbconnection.run();
    if (!connection) {
        return console.log("An error ocurred while trying to connect to the database.");
    }
    console.log('This can take a little.');
    let sql = "CREATE TABLE IF NOT EXISTS bot_tickets (type VARCHAR(10) DEFAULT NULL , user_id VARCHAR(50) NOT NULL COMMENT 'User ID, category name, panel message ID', channel_id VARCHAR(50) DEFAULT NULL COMMENT 'Ticket channel id or panel channel id', createdAt VARCHAR(50) DEFAULT NULL COMMENT 'Date of creation or ban', category VARCHAR(150) BINARY CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Banning reason', open TINYINT(1) DEFAULT NULL) ENGINE = INNODB, CHARACTER SET utf8mb4, COLLATE utf8mb4_unicode_ci, COMMENT = 'Tickets data for Discord Bot';";
    connection.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            console.log("An error ocurred (#1285)");
            connection.end();
        }
        else {
            console.log("table bot_tickets succesfully created.");
            let sql2 = "CREATE TABLE IF NOT EXISTS bot_ticket_punishments (type VARCHAR(10) DEFAULT NULL,  user_id VARCHAR(50) DEFAULT NULL,  staff_id VARCHAR(50) DEFAULT NULL,  reason VARCHAR(255) DEFAULT NULL,  date VARCHAR(60) DEFAULT NULL) ENGINE = INNODB,CHARACTER SET utf8mb4,COLLATE utf8mb4_unicode_ci;";
            connection.query(sql2, (err, results) => {
                if (err) {
                    console.log(err);
                    connection.end();
                    return console.log("An error ocurred (#2342)");
                }
                else {
                    console.log("table bot_ticket_punishments succesfully created.");
                    let sql3 = "CREATE TABLE IF NOT EXISTS bot_categories (type VARCHAR(15) DEFAULT NULL , name VARCHAR(50) DEFAULT NULL , count INT(4) DEFAULT NULL , panel_message VARCHAR(300) DEFAULT NULL , emoji VARCHAR(100) DEFAULT NULL , perms VARCHAR(500) DEFAULT NULL , welcome_message VARCHAR(300) DEFAULT NULL , channel_id VARCHAR(255) DEFAULT NULL , panel_id VARCHAR(255) DEFAULT NULL) ENGINE = INNODB,AVG_ROW_LENGTH = 16384 , CHARACTER SET utf8mb4 , COLLATE utf8mb4_unicode_ci , COMMENT = 'Categories and tickets';";
                    connection.query(sql3, (err, results) => {
                        if (err) {
                            console.log(err);
                            connection.end();
                            return console.log("An error ocurred (#4623)");
                        }
                        else {
                            console.log("table bot_ticket_punishments succesfully created.");
                            connection.end();
                            console.log('Process completed.');
                        }
                    });
                }
            });
        }
    });
};
importardb();
