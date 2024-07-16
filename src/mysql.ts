import  mysql  from 'mysql';

const pool = mysql.createPool ({
    "user":"root",
    "password":"@ndriuVinte7zero6dois0zero2",
    "database":"api-yt-project",
    "host":"localhost",
    "port": 3306
})

export { pool };