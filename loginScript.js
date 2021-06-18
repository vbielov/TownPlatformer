// Плавные анимации между 250мс задержки
// Добавить показатель пинга

const ws = new WebSocket("ws://25.83.201.71:8082");

var onlineDisplay = document.getElementById("onlineDisplay");
var myID = -1;
var loginHtml = document.getElementById("loginHtml");
var otherPlayers = [];
var connectedToServer = false;
var logged = false;

ws.addEventListener("open", () => {
    console.log("We are connected!");
    connectedToServer = true;
    // SendToServer({type: "testFunction", text: "Hello my cutie~"});
});

function SendToServer(data) {
    if(connectedToServer) {
        ws.send(JSON.stringify(data));
    }
}

ws.addEventListener("message", ({ data }) => {
    var msg = JSON.parse(data);
    switch(msg.type) {
        case "returnPlayers":
            if(!myID > -1 && !logged) {
                onlineDisplay.innerHTML = "Сейчас играют: " + msg.players.length;
                // var testInfo = "";
                // for(var i = 0; i < msg.players.length; i++) {
                //     testInfo = testInfo + "Игрок: ID: " + msg.players[i].id + ", POSITION: x=" + msg.players[i].position.x + " y=" + msg.players[i].position.y + " ID: " + msg.players[i].arrIndex + "<br>";
                // }
                // onlineDisplay.innerHTML = testInfo;
            }
            
            otherPlayers = msg.players; 
            break;
    }
});

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function OnlineDisplay() {
    SendToServer({type: "getPlayers"});
    //Кнопка мультилпеера
    if(connectedToServer) {
        document.getElementById('MultiplayerButton').style.background = '#5ad3ab';
        document.getElementById('MultiplayerButton').style.color = '#fff';
    } else {
        document.getElementById('MultiplayerButton').style.background = '#47a888';
        document.getElementById('MultiplayerButton').style.color = '#225242';
        onlineDisplay.innerHTML = "Сервер оффлайн";
    }
}

function ConnectToMultiplayer() {
    if(connectedToServer) {
        var tempID = getRandomInt(255);
        for(var i = 0; i < otherPlayers.length; i++) {
            if(otherPlayers[i]['id'] === tempID) {
                ConnectToMultiplayer();
                return;
            }
        }
        myID = tempID;
        SendToServer({type: "addPlayer", id: myID});
        console.log("Logging with ID: " + myID);
        InitiateGame();
        logged = true;
    }
}

function ConnectToSingleplayer() {
    InitiateGame();
    logged = true;
}

function InitiateGame() {
    loginHtml.remove();
    var canvas = document.createElement('canvas');
    canvas.id     = "gameCanvas";
    canvas.width  = 960;
    canvas.height = 400;
    document.body.appendChild(canvas);
    var gameScript = document.createElement('script');
    gameScript.src = "/gameScript.js";
    document.body.appendChild(gameScript);
}

setInterval(function() {
    if(logged == false) {
        OnlineDisplay();
        return;
    }
    if(connectedToServer && myID > 0) {
        SendToServer({type: "updatePlayer", id: myID, pos: player});
        SendToServer({type: "getPlayers"});
    }
}, 10);