const mysql = require("mysql");
let con = mysql.createConnection({
    host: "51.222.29.111",
    user: "u272_VjI7IPlU9A",
    database: "s272_data",
    password: "m2f51=t.2xLWm2c!LgRhgpwp"
});
let sqp;
let d = Date.now();
con.ping((err) => {
    if (err)
        throw err;
    console.log(Date.now() - d);
});
