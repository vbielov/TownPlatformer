const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8082});

var players = [];
const spawnPos = {x: 240, y: 170};
wss.on("connection", ws => {
    console.log("New client connected");

    ws.on("message", data => {
        var msg = JSON.parse(data);
        switch(msg.type) {
            case "testFunction":
                console.log(msg.text);
                break;
            case "getPlayers":
                ws.send(JSON.stringify({type: "returnPlayers", players: players}));
                break;
            case "addPlayer":
                AddPlayer(msg.id); 
                console.log("Added player by id: " + msg.id);
                break;
            case "removePlayer":
                RemovePlayer(msg.id); 
                console.log("Removed player by id: " + msg.id);
                break;
            case "updatePlayer":
                UpdatePlayer(msg.id, msg.pos);
                // console.log("Updated player by id " + msg.id + " in position: " + msg.pos);
                break;
        }
    });

    ws.on("close", () => {
        console.log("Player disconected");
    });
});

function AddPlayer(id) {
    players.push({id: id, position: spawnPos, sleep: 0, arrIndex: 0});
}
function RemovePlayer(inputID) {
    var index = findWithAttr(players, 'id', inputID);
    players.splice(index, 1);
}
function UpdatePlayer(inputID, pos) {
    var index = findWithAttr(players, 'id', inputID);
    players[index].position = pos;
    players[index].sleep = 0;
    players[index].arrIndex = index;
}
function findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
    return -1;
}
setInterval(SleepController, 1000)
function SleepController() {
    for(var i = 0; i < players.length; i++) {
        players[i]["sleep"] += 1;
        if(players[i]["sleep"] > 5) {
            RemovePlayer(players[i].id);
        }
    }
}