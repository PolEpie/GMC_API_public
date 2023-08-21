const express = require("express");
const { config } = require("dotenv");
const cors = require("cors");
const { wrapper } = require("axios-cookiejar-support");
const { CookieJar, Cookie } = require("tough-cookie");
const axios = require("axios");

const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

config();

/* Express Part */
const app = express();

app.use(
    cors({
        credentials: true,
        methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
        //saveUninitialized: true,
        origin: true,
    })
);

app.options(
    "*",
    cors({
        credentials: true,
        methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
        //saveUninitialized: true,
        origin: true,
    })
);

const getCSRFTOKEN = async () => {
    const cookies = await jar.getCookies(process.env.SERVER_URL);

    const csrftoken = cookies.find((cookie) => cookie.key === "csrftoken");

    return csrftoken.value;
};

const connect = async () => {
    await client.get(process.env.SERVER_URL);

    const csrftoken = await getCSRFTOKEN();

    console.log(csrftoken);

    const resp = await client.post(
        `${process.env.SERVER_URL}/login/auth/`,
        {
            username: process.env.USERNAME,
            password: process.env.PASSWORD,
            rememberme: true,
        },
        {
            headers: {
                Origin: process.env.SERVER_URL,
                Referer: `${process.env.SERVER_URL}/login`,
                "X-Csrftoken": csrftoken,
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }
    );

    return resp.data;
};

app.get("/start", async (req, res, next) => {
    if (req.query.access !== process.env.ACCESS_KEY)
        res.status(401).send("Unauthorized");

    const resp = await connect();

    if (!resp.done) res.status(500).send("Something broke with auth!");

    const csrftoken = await getCSRFTOKEN();

    await client.post(
        `${process.env.SERVER_URL}/dashboard/game/servers/${process.env.SERVER_ID}/start/`,
        {},
        {
            headers: {
                Origin: process.env.SERVER_URL,
                Referer: `${process.env.SERVER_URL}/dashboard/game/servers/20/`,
                "X-Csrftoken": csrftoken,
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }
    );

    res.status(200).send("Server started!");
});

app.get("/stop", async (req, res, next) => {
    if (req.query.access !== process.env.ACCESS_KEY)
        res.status(401).send("Unauthorized");

    const resp = await connect();

    if (!resp.done) res.status(500).send("Something broke with auth!");

    const csrftoken = await getCSRFTOKEN();

    await client.post(
        `${process.env.SERVER_URL}/dashboard/game/servers/${process.env.SERVER_ID}/stop/`,
        {},
        {
            headers: {
                Origin: process.env.SERVER_URL,
                Referer: `${process.env.SERVER_URL}/dashboard/game/servers/${process.env.SERVER_ID}/`,
                "X-Csrftoken": csrftoken,
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }
    );
    res.status(200).send("Server stopped!");
});

app.get("/send", async (req, res, next) => {
    if (req.query.access !== process.env.ACCESS_KEY)
        res.status(401).send("Unauthorized");

    const resp = await connect();

    if (!resp.done) res.status(500).send("Something broke with auth!");

    const csrftoken = await getCSRFTOKEN();

    console.log(req.query.command);

    const resppppp = await client.post(
        `${process.env.SERVER_URL}/dashboard/game/servers/${process.env.SERVER_ID}/console/send/`,
        {
            consolecommand: req.query.command,
        },
        {
            headers: {
                Origin: process.env.SERVER_URL,
                Referer: `${process.env.SERVER_URL}/dashboard/game/servers/${process.env.SERVER_ID}/`,
                "X-Csrftoken": csrftoken,
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }
    );

    if (resppppp.data.status === "Done") {
        res.status(200).send("Command Send!");
        return;
    }

    res.status(500).send("Something broke with command!");
});

app.listen(6000);

module.exports = app;
