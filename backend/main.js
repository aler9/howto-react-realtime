
const koa = require("koa");
const koaRouter = require("koa-router");
const koaSend = require("koa-send");
const webSocket = require("ws");


const conns = {};

const limit = (val, lower, upper) => {
    if (val < lower) {
        return lower;
    }
    if (val > upper) {
        return upper;
    }
    return val;
};

const randomInInterval = (min, max) => {
    return Math.random() * (max - min) + min;
};

const collideWithPlayer = (ballX, ballY, playerX, playerY) => {
    return (ballX + 20) >= playerX && ballX <= (playerX + 100) &&
        (ballY + 20) >= playerY && ballY <= (playerY + 20);
};

const inputKeys = new Array(250);

const state = {
    ready: true,
    player1Pos: 20,
    player2Pos: 50,
    ballX: 250,
    ballY: 250,
    ballDirection: randomInInterval(-Math.PI, +Math.PI),
};

const run = () => {
    if (inputKeys[65] == true) { // left
        state.player1Pos -= 20;
        state.player1Pos = limit(state.player1Pos, 0, 400);
    }
    if (inputKeys[68] == true) { // right
        state.player1Pos += 20;
        state.player1Pos = limit(state.player1Pos, 0, 400);
    }
    if (inputKeys[37] == true) { // left
        state.player2Pos -= 20;
        state.player2Pos = limit(state.player2Pos, 0, 400);
    }
    if (inputKeys[39] == true) { // right
        state.player2Pos += 20;
        state.player2Pos = limit(state.player2Pos, 0, 400);
    }

    state.ballX += 5 * Math.cos(state.ballDirection);
    state.ballY += 5 * Math.sin(state.ballDirection);

    if (state.ballY < 0) { // bordo superiore
        reset(state);

    } else if (state.ballY > (500 - 20)) { // bordo inferiore
        reset(state);

    } else if (state.ballX < 0) { // bordo sinistro
        if (state.ballDirection < 0) {
            state.ballDirection = randomInInterval(- Math.PI / 2, 0);
        } else {
            state.ballDirection = randomInInterval(0, + Math.PI / 2);
        }

    } else if (state.ballX > (500 - 20)) { // bordo destro
        if (state.ballDirection > 0) {
            state.ballDirection = randomInInterval(Math.PI / 2, Math.PI);
        } else {
            state.ballDirection = randomInInterval(- Math.PI, - Math.PI / 2);
        }

    } else if (collideWithPlayer(state.ballX, state.ballY, state.player1Pos, 20)) {
        state.ballDirection = randomInInterval(0, Math.PI);

    } else if (collideWithPlayer(state.ballX, state.ballY, state.player2Pos, 460)) {
        state.ballDirection = randomInInterval(- Math.PI, 0);
    }

    for (const id in conns) {
        conns[id].send(JSON.stringify(state));
    }
};

const reset = (state) => {
    state.ballX = 250;
    state.ballY = 250;
    state.ballDirection = randomInInterval(-Math.PI, +Math.PI);
};

// support CTRL-C
process.on("SIGINT", () => process.exit());

const main = async () => {
    const server = new koa();
    const router = new koaRouter();
    const wss = new webSocket.Server({ noServer: true });

    router.get("/static/script.js", async (ctx) => await koaSend(ctx, "./static/script.js"));
    router.get("/static/style.css", async (ctx) => await koaSend(ctx, "./static/style.css"));
    router.get("/", async (ctx) => {
        ctx.type = 'text/html; charset=utf-8';
        await koaSend(ctx, "./index.tpl")
    });

    setInterval(run, 20);

    router.get("/ws", async (ctx) => {
        ctx.respond = false;
        const conn = await new Promise((resolve) => {
            wss.handleUpgrade(ctx.req, ctx.request.socket, Buffer.alloc(0), resolve);
        });

        const curConnId = Object.keys(conns).length;
        conns[curConnId] = conn;

        conn.on("message", (msg) => {
            data = JSON.parse(msg);
            inputKeys[data.code] = data.state;
        });

        conn.on("close", () => {
            delete conns[curConnId];
        });
    })

    server.use(router.routes());
    server.listen(8080);
};

main().catch((e) => { console.error(e); process.exit(1); });
