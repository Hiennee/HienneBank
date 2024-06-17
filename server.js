var express = require("express")
var cors = require("cors")
var mysql = require("mysql2/promise")
var e = require("express")
var https = require("https")
var fs = require("fs")

var app = express()
app.use(cors())
app.use(express.json())

var server = https.createServer({
    cert: fs.readFileSync("./CA/hihienne.com+4.pem"),
    key: fs.readFileSync("./CA/hihienne.com+4-key.pem"),
    requestCert: true,
    rejectUnauthorized: false,
}, app)

var db = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "123456",
    database: "MobileAppProj"
})

app.get("/users", async (req, res) => {
    var listData = [];
    (await db).query("SELECT * FROM USER").then((result) => {
        result[0].forEach((r) => {
            listData.push(r)
        })
        return listData
    }).then((listData) => {
        console.log(listData);
        res.send(listData);
    })
})

app.post("/register", async (req, res) => {
    var { username, banknum, phonenum, password } = req.body;
    var result = await (await db).query(`SELECT * FROM USER WHERE username = '${username}'`);
    if (result[0].length > 0)
    {
        res.status(345).send({ message: "User name " + username + " already exists" });
        console.log("User name " + username + " already exists");
        return
    }
    (await db).query(`INSERT INTO USER VALUES ('${username}', '${banknum}', '${phonenum}', '${password}', 0.0)`).then(() => {
        res.status(234).send({ message: "Successfully registered user " + username + ", with password: " + password });
        console.log("Successfully registered user " + username + ", with password: " + password);
    }).catch((e) => console.log(e))
})

app.post("/login", async (req, res) => {
    var { username, password } = req.body;
    var result = await (await db).query(`SELECT * FROM USER WHERE username = '${username}' and password = '${password}'`);
    if (result[0].length == 0) {
        res.status(345).send({ message: "Invalid Username or Password" });
        console.log("Invalid Username or Password")
        return;
    }
    res.status(234).send(result[0].at(0));
    console.log(result[0].at(0));
})

app.put("/update/users/username/:username/", async (req, res) => 
{
    console.log(req.body)
    var { newUserName } = req.body;

    var result = await (await db).query(`SELECT * FROM USER WHERE username = '${req.params.username}'`)
    if (result[0].length == 0) {
        res.status(345).send({ message: "Username doesn't exist" });
        console.log("Username doesn't exist");
        return;
    }

    var result = await (await db).query(`SELECT * FROM USER WHERE username = '${newUserName}'`)
    if (result[0].length > 0) {
        res.status(346).send({ message: `Username ${newUserName} already exist` });
        console.log(`Username ${newUserName} already exist`);
        return;
    }

    var result = await (await db).query(`UPDATE USER SET username = '${newUserName}' where username = '${req.params.username}'`)
    res.status(234).send({ message: `Updated user ${req.params.username} to ${newUserName}` })
    console.log(`Updated user ${req.params.username} to ${newUserName}`)
})

app.put("/update/users/password/:username", async (req, res) => 
{
    var { newPassword } = req.body;

    var result = await (await db).query(`SELECT * FROM USER WHERE username = '${req.params.username}'`)
    if (result[0].length == 0) {
        res.status(345).send({ message: "Username doesn't exist" });
        console.log("Username doesn't exist");
        return;
    }
    
    var result = await (await db).query(`UPDATE USER SET password = '${newPassword}' where username = '${req.params.username}'`)
    res.status(234).send({message: `Updated user ${req.params.username}'s password to ${newPassword}`})
    console.log(`Updated user ${req.params.username}'s password to ${newPassword}`)
})

app.put("/update/users/banknum/:username/", async (req, res) => 
{
    var { newBanknum } = req.body;

    var result = await (await db).query(`SELECT * FROM USER WHERE username = '${req.params.username}'`)
    if (result[0].length == 0) {
        res.status(345).send({ message: "Username doesn't exist" });
        console.log("Username doesn't exist");
        return;
    }
    var result = await (await db).query(`SELECT * FROM USER WHERE banknum = '${newBanknum}'`)
    if (result[0].length > 0) {
        res.status(346).send({ message: `Bank number ${newBanknum} has already been taken` });
        console.log(`Bank number ${newBanknum} has already been taken`);
        return;
    }
    var result = await (await db).query(`UPDATE USER SET banknum = '${newBanknum}' where username = '${req.params.username}'`)
    res.status(234).send({message: `Updated user ${req.params.username}'s bank number to ${newBanknum}`})
    console.log(`Updated user ${req.params.username}'s bank number to ${newBanknum}`)
})

app.put("/update/users/phonenum/:username/", async (req, res) => 
{
    var { newPhonenum } = req.body;

    var result = await (await db).query(`SELECT * FROM USER WHERE username = '${req.params.username}'`)
    if (result[0].length == 0) {
        res.status(345).send({ message: "Username doesn't exist" });
        console.log("Username doesn't exist");
        return;
    }
    var result = await (await db).query(`SELECT * FROM USER WHERE phonenum = '${newPhonenum}'`)
    if (result[0].length > 0) {
        res.status(346).send({ message: `Phone number ${newPhonenum} has already been taken` });
        console.log(`Phone number ${newPhonenum} has already been taken`);
        return;
    }
    var result = await (await db).query(`UPDATE USER SET phonenum = '${newPhonenum}' where username = '${req.params.username}'`)
    res.status(234).send({ message: `Updated user ${req.params.username}'s phone number to ${newPhonenum}` })
    console.log(`Updated user ${req.params.username}'s phone number to ${newPhonenum}`)
})

app.delete("/users/delete", async (req, res) => {
    (await db).query(`DELETE FROM USER`).then(() => {
        res.send({ message: "Successfully deleted all users in table USER" });
        console.log("Successfully deleted all users in table USER")
    })
    .catch((err) => {
        console.log(err)
        res.send(err)
    })
})
// ----------------------------------------- CRUD Money and MoneyHistory ---------------------------------------------
app.get("/money/:username", async (req, res) =>
{
    var result = await (await db).query(`SELECT money FROM USER where username = '${req.params.username}'`);
    if (result[0].length == 0) {
        console.log("Error getting money from user " + req.params.username);
        res.status(345).send({ message: "Error getting money from user " + req.params.username });
        return
    }
    res.status(234).send(result[0].at(0));
    console.log(result[0].at(0));
})

app.get("/histories", async (req, res) => 
{
    var result = await (await db).query("SELECT * FROM MoneyHistory");
    var listData = []
    result[0].forEach((r) => {
        listData.push(r)
        console.log(r)
    })
    res.status(234).send(listData);
    console.log(listData)
})

app.get("/history/:username", async (req, res) => 
    {
        var result = await (await db).query(`SELECT * FROM MoneyHistory WHERE username = '${req.params.username}'`);
        var listData = []
        result[0].forEach((r) => {
            listData.push(r)
            console.log(r)
        })
        res.status(234).send(listData);
        console.log(listData)
    })

app.post("/money/add", async (req, res) =>
{
    var { username, source, destination, destination_banknum, money, date } = req.body;
    console.log(req.body);
    var result = await (await db).query(`SELECT * FROM USER WHERE username = '${username}'`);
    if (result[0].length == 0) {
        res.status(345).send({ message: "Invalid Username" });
        console.log("Invalid Username");
        return
    }
    await (await db).query(`UPDATE USER SET money = money + ${money} where username = '${username}'`)
    .then((result) => {
        res.status(234).send({ message: "Successfully add " + money + "$ to the user " + username })
        console.log("Successfully add " + money + "$ to the user " + username)
    })
    .catch((err) => console.log(err));

    var remainMoney = (await (await db).query(`SELECT money FROM USER WHERE username = '${username}'`))[0].at(0).money;
    console.log("Remain: ", remainMoney)
    const ADD_MONEY_DESCRIPTION = `${username} NAP TIEN (+${money} đ) TU ${source}`;
    // (ACTION, USERNAME, DESTINATION, DESTINATION_BANKNUM, SOURCE, SOURCE_BANKNUM, MONEY, REMAINMONEY, DATE)
    await (await db).query(`INSERT INTO MoneyHistory VALUES ('ADD', '${username}', '${username}', '${destination_banknum}', '${source}', '${source}', ${money}, ${remainMoney}, '${date}', '${ADD_MONEY_DESCRIPTION}')`).then((result) => {
        console.log(`[ADD] Account: ${username} | from: ${source} to: ${destination}, amount: ${money}, remain: ${remainMoney}, date: ${date}`);
    })
})

app.post("/money/withdraw", async (req, res) =>
{
    var { username, source, source_banknum, destination, money, date } = req.body;
    var result = await (await db).query(`SELECT * FROM USER WHERE username = '${username}'`);
    if (result[0].length == 0) {
        res.status(345).send({ message: "Invalid Username" });
        console.log("Invalid Username");
        return
    }
    await (await db).query(`UPDATE USER SET money = money - ${money} where username = '${username}'`)
    .then((result) => {
        res.status(234).send({ message: "Successfully withdrawn " + money + "$ from the user " + username + " to " + destination });
        console.log("Successfully withdrawn " + money + "$ from the user " + username + " to " + destination);
    })
    .catch((err) => console.log(err));
    
    var remainMoney = (await (await db).query(`SELECT money FROM USER WHERE username = '${username}'`))[0].at(0).money;
    const WITHDRAW_MONEY_DESCRIPTION = `${username} RUT TIEN (-${money} đ) VE ${destination}`;
    // (ACTION, USERNAME, DESTINATION, DESTINATION_BANKNUM, SOURCE, SOURCE_BANKNUM, MONEY, REMAINMONEY, DATE)
    await (await db).query(`INSERT INTO MoneyHistory VALUES ('WITHDRAW', '${username}', '${destination}', '${destination}', '${source}', '${source_banknum}', ${money}, ${remainMoney}, '${date}', '${WITHDRAW_MONEY_DESCRIPTION}')`).then((result) => {
        console.log(`[WITHDRAW] Account: ${username} | from: ${destination} to: ${source}, amount: ${money}, remain: ${remainMoney}, date: ${date}`);
    }) 
})

app.post("/money/transfer", async (req, res) =>
{
    var { username, source_banknum, destination, destination_banknum, money, date, description } = req.body;
    var result = await (await db).query(`SELECT * FROM USER WHERE username = '${username}'`);
    if (result[0].length == 0) {
        res.status(345).send({ message: "Invalid Username" });
        console.log("Invalid Username");
        return
    }
    var result = await (await db).query(`SELECT * FROM USER WHERE username = '${destination}'`);
    if (result[0].length == 0) {
        res.status(346).send({ message: "Invalid Destination" });
        console.log("Invalid Destination");
        return
    }

    await (await db).query(`UPDATE USER SET money = money - ${money} where username = '${username}'`)
    .then((result) => {
        res.status(234).send({ message: "Successfully withdrawn " + money + "$ from the user " + username + " to " + destination });
        console.log("Successfully withdrawn " + money + "$ from the user " + username + " to " + destination);
    })
    .catch((err) => console.log(err));

    var remainMoneyTransferer = (await (await db).query(`SELECT money FROM USER WHERE username = '${username}'`))[0].at(0).money;
    console.log("Remain: ", remainMoneyTransferer)
    await (await db).query(`UPDATE USER SET money = money + ${money} where username = '${destination}'`)
    .then((result) => {
        //res.status(234).send({ message: "Successfully receive " + money + "$ from the user " + username });
        console.log("Successfully receive " + money + "$ from the user " + username);
    })
    .catch((err) => console.log(err));

    var remainMoneyReceiver = (await (await db).query(`SELECT money FROM USER WHERE username = '${destination}'`))[0].at(0).money;
    console.log("Remain: ", remainMoneyReceiver)
    // (ACTION, USERNAME, DESTINATION, DESTINATION_BANKNUM, SOURCE, SOURCE_BANKNUM, MONEY, REMAINMONEY, DATE)
    await (await db).query(`INSERT INTO MoneyHistory VALUES ('WITHDRAW', '${username}', '${destination}', '${destination_banknum}','${username}', '${source_banknum}', '${money}', '${remainMoneyTransferer}', '${date}', N'${description}')`).then((result) => {
        console.log(`[WITHDRAW] Account: ${username} | from: ${username} to: ${destination}, amount: ${money}, remain: ${remainMoneyReceiver}, date: ${date}, description: ${description}`);
    })
    await (await db).query(`INSERT INTO MoneyHistory VALUES ('ADD', '${destination}', '${destination}', '${destination_banknum}', '${username}', '${source_banknum}', '${money}', '${remainMoneyReceiver}', '${date}', N'${description}')`).then((result) => {
        console.log(`[ADD] Account: ${destination} | from: ${username} to: ${destination}, amount: ${money}, remain: ${remainMoneyTransferer}, date: ${date}, description: ${description}`);
    })
})

app.delete("/history/delete", async (req, res) =>
{
    await (await db).query("DELETE FROM MoneyHistory").then(() => {
        console.log("Successfully deleted histories");
        res.send({ message: "Successfully deleted histories" });
        return
    })
    .catch((err) => {
        console.log(err)
    });
})
// ----------------------------------------- Bank numbers ---------------------------------------------
app.get("/banknum/:username", async (req, res) => 
{
    var result = await (await db).query(`SELECT banknum FROM User WHERE username = '${req.params.username}'`)
    if (result[0].length == 0) {
        console.log("Invalid Username");
        res.status(345).send({ message: "Invalid Username" });
        return
    }
    res.send(result[0].at(0));
    console.log(result[0].at(0));
})    

app.listen(8080, async () => {
    console.log("Server is online");
    // var a = await db
    // a.connect().then(() => {
    //     console.log("asd")
    // })
    (await db).connect().then(() => {console.log("Connected to the database!")})
})

// server.listen(8080, async () => {
//     console.log("Server is online using HTTPS");
//     // var a = await db
//     // a.connect().then(() => {
//     //     console.log("asd")
//     // })
//     (await db).connect().then(() => {console.log("Connected to the database!")})
// })
