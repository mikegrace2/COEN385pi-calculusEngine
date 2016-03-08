// drawing functions ****************************************************************
function drawLineWithText(fromX, fromY, toX, toY, text){
		ctx.moveTo(fromX, fromY);
		ctx.lineTo(toX, toY);

		ctx.moveTo(toX-4, toY);
		ctx.lineTo(toX-10-4, toY-10);
		ctx.moveTo(toX-4, toY);
		ctx.lineTo(toX-10-4, toY+10);
		ctx.stroke();

		ctx.font = "10px Arial";
		ctx.lineWidth="1";
		ctx.fillStyle = '#000000';
		ctx.strokeText(text, fromX+50, fromY-5);
}

function drawBoxWithTextAndSwimLane(ctx, x, y, text){
	ctx.lineWidth="4";
	ctx.rect(x,y,110,50);

	ctx.font = "25px Arial";
	ctx.lineWidth="2";
	ctx.fillStyle = '#000000';
	ctx.strokeText(text,15+x,30+y);

	ctx.moveTo(x+50,y+50);
	ctx.lineTo(x+50,y+275);

	ctx.fillRect(x+46,y+65,8,200);
	ctx.stroke();
}

function drawUseCase(ctx, x, y){
	ctx.beginPath();
	ctx.arc(x+20, y+20, 10, 0,Math.PI*2, true);
	ctx.lineWidth = 3;
	ctx.strokeStyle = '#000000';
	ctx.closePath();

	ctx.moveTo(x+20,y+30);
	ctx.lineTo(x+20,y+40);

	ctx.moveTo(x+5,y+50);
	ctx.lineTo(x+20,y+40);

	ctx.moveTo(x+20,y+40);
	ctx.lineTo(x+40,y+50);

	ctx.moveTo(x+20,y+40);
	ctx.lineTo(x+20,y+60);

	ctx.moveTo(x+5,y+70);
	ctx.lineTo(x+20,y+60);

	ctx.moveTo(x+20,y+60);
	ctx.lineTo(x+40,y+70);

	ctx.lineWidth = 2;

	ctx.moveTo(x+23,y+80);
	ctx.lineTo(x+23,y+290);

	ctx.fillRect(x+19,y+85,8,195);
	ctx.stroke();
}