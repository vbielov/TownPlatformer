var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

//Player position
var x = canvas.width/2;
var y = 10;

//Gravity force
var gForce = 0;

//Standing on ground
var grounded = false;

var playerSpeed = 2;

var offsetX = 0;
var offsetY = 0;

//Scene Images
var townBuilding1 = new Image();
townBuilding1.src = '/images/town1.png';
var townBuilding2 = new Image();
townBuilding2.src = '/images/town2.png';
var townBuilding3 = new Image();
townBuilding3.src = '/images/town3.png';
var cartonBox = new Image();
cartonBox.src = '/images/cartonBox.png';

//Scene Objects
var box1 = {x: 340, y: 200, width: 300, height: 400, image: townBuilding1};                
var box2 = {x: 0, y: 220, width: 300, height: 400, image: townBuilding2};
var box3 = {x: 680, y: 220, width: 300, height: 400, image: townBuilding3};

var player = {x: 500, y: 150, width: 45, height: 35, image: cartonBox};

//UI Images
var leftButtonImage = new Image();
leftButtonImage.src = '/images/leftButton.png';
var rightButtonImage = new Image();
rightButtonImage.src = '/images/rightButton.png';

//UI Objects
var leftButton = {image: leftButtonImage, x: 50, y: canvas.height - 100, width: 75, height: 75};
var rightButton = {image: rightButtonImage, x: 150, y: canvas.height - 100, width: 75, height: 75};

//Rect Storage
function rectArray() {
	var rects = [box1, box2, box3];
	for(var i = 0; i < otherPlayers.length; i += 1) {
        if(otherPlayers[i]['id'] === myID) {
        } else {
			var othp = {x: otherPlayers[i].position.x, y: otherPlayers[i].position.y, width: 45, height: 35, image: cartonBox};
			rects.push(othp);
        }
    }
	return rects;
}

function drawRect(posX, posY, scaleX, scaleY) {	
	ctx.beginPath();
	ctx.rect(posX + offsetX, posY + offsetY, scaleX, scaleY);
	ctx.fillStyle = "#FF0000";
	ctx.fill();	
	ctx.closePath()
}

function drawImage(object, offsetToggle) {
	if(offsetToggle) {
		ctx.drawImage(object.image, object.x + offsetX, object.y + offsetY, object.width, object.height);
	} else {
		ctx.drawImage(object.image, object.x, object.y, object.width, object.height);
	}
}

function gravity(g) {
	gForce += g;
	player.y += gForce;
	offsetY -= gForce;
}

function collision(rect1, rect2){
	if (rect1.x < rect2.x + rect2.width &&
		rect1.x + rect1.width > rect2.x &&
		rect1.y < rect2.y + rect2.height &&
		rect1.y + rect1.height > rect2.y) {
		return true;
	}
	return false;
}

var pressedKeyD = false;
var pressedKeyA = false;
window.addEventListener('keypress', function(e) {
	if(e.code == 'KeyD') {
		pressedKeyD = true;
	}
	if(e.code == 'KeyA') {
		pressedKeyA = true;
	}
	if(e.code == 'Space') {
		if(grounded) {
			jump();
		}
	}
});

window.addEventListener('keyup', function(e) {
	if(e.code == 'KeyD') {
		pressedKeyD = false;
	}
	if(e.code == 'KeyA') {
		pressedKeyA = false;
	}
});

var touchPos = null;
window.addEventListener('touchstart', function(e) {
	var touch = e.touches[0];
	touchPos = {x: touch.pageX, y: touch.pageY, width: 0, height: 0};
	if(collision(touchPos, rightButton)) {
		pressedKeyD = true;
		return;
	}
	if(collision(touchPos, leftButton)) {
		pressedKeyA = true;
		return;
	}
	if(grounded == true) {
		jump();
	}
});
window.addEventListener('touchmove', function(e) {
	var touch = e.touches[0];
	touchPos = {x: touch.pageX, y: touch.pageY, width: 0, height: 0};
	if(collision(touchPos, rightButton)) pressedKeyD = true;
	if(collision(touchPos, leftButton)) pressedKeyA = true;
});

window.addEventListener('touchend', function(e) {
	if(collision(touchPos, rightButton)) pressedKeyD = false;
	if(collision(touchPos, leftButton)) pressedKeyA = false;
});

function moveSceneObjects(direction) {
	var rects = rectArray();
	
	var noCollisionExists = true;
	for(i = 0; i < rects.length; i++) {
		var rectsdouble = {x: rects[i].x, y: rects[i].y, 
					width: rects[i].width, height: rects[i].height};
		rectsdouble.x += direction;
		rectsdouble.y += 5;
		if(collision(player, rectsdouble) === true) 
		{
			noCollisionExists = false;
		}
	}
	if(noCollisionExists === true) {
		offsetX += direction;
		player.x -= direction;
	}
}

function jump() {
	gravity(-3);
}

function drawOtherPlayers() {
    for(var i = 0; i < otherPlayers.length; i += 1) {
        if(otherPlayers[i]['id'] === myID) {
        } else {
			var otherPlayer = {x: otherPlayers[i].position.x, y: otherPlayers[i].position.y, width: 45, height: 35, image: cartonBox};
			drawImage(otherPlayer, true);
        }
    }
}

function update() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	var rects = rectArray();

	if(pressedKeyD) moveSceneObjects(-1 * playerSpeed);
	if(pressedKeyA) moveSceneObjects(1 * playerSpeed);

	drawOtherPlayers();
	drawImage(player, true);
	
	
	for(i = 0; i < rects.length; i++) {
		// drawRect(rects[i].x, rects[i].y, rects[i].width, rects[i].height);
		drawImage(rects[i], true);
	}
	
	grounded = false;
	for(i = 0; i < rects.length; i++) {
		if(collision(player, rects[i]) === true) {
			grounded = true;
			gForce = 0;
			gravity(0);
		}
	}
	if(grounded === false) {
		var g = 0.10;
		gravity(g);
	}

	drawImage(leftButton);
	drawImage(rightButton);
}
setInterval(update, 16);