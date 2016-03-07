// Global variable ***********************************************************
var startNode= null;
var main_document=null;
var picode=null;
var process_array=new Array(); // Collects all processes

// Classes *******************************************************************
function Process(my_process_name, my_code, my_x, my_y){
	this.process=my_process_name;
	this.code=my_code;
	this.x_coord=my_x;
	this.y_coord=my_y;
}

// functions *****************************************************************
function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {vars[key] = value;});
	return vars;
}

function checkIt(){
	//alert('Check OK!');
	return true;
}

function goBack() {
	window.history.back();
}

// Parsing part ****************************************************************
// connetors: ? ! new() . | ( ) =
// variables: x, y, z
// channels: a, b, c, d
// processes: P, Q, R, S
function parsingALine(process_obj){
	if (process_obj.process==startNode){
		document.write("<font color='0000ff'>start_"+identifyTextSegment(process_obj.process)+"</font><font color='0000ff'> = </font>");
	}else{
		document.write("<font color='ff00ff'>"+identifyTextSegment(process_obj.process)+"</font><font color='0000ff'> = </font>");
	}

	var text="";
	for (var i=0;i<process_obj.code.length;i++){
		if (process_obj.code[i]=='?'){
			document.write(identifyTextSegment(text));
			text="";
			document.write(" <font color='ff0000'>?</font> ");
			continue;
		}else if (process_obj.code[i]=='!'){
			document.write(identifyTextSegment(text));
			text="";
			document.write(" <font color='ff0000'>!</font> ");
			continue;
		}else if (process_obj.code[i]=='.'){
			document.write(identifyTextSegment(text));
			text="";
			document.write(" <font color='ff0000'>.</font> ");
			continue;
		}else if (process_obj.code[i]=='|'){
			document.write(identifyTextSegment(text));
			text="";
			document.write(" <font color='ff0000'>|</font> ");
			continue;
		}else if (process_obj.code[i]=='('){
			document.write(identifyTextSegment(text));
			text="";
			document.write("<font color='00ff00'>(</font>");
			continue;
		}else if (process_obj.code[i]==')'){
			document.write(identifyTextSegment(text));
			text="";
			document.write("<font color='00ff00'>)</font>");
			continue;
		}

		// text
		text=text.concat(process_obj.code[i]);
	}

	if (text.length!=0){
		document.write(identifyTextSegment(text));
		text="";
	}
	document.write("<br>\n");
}

// variables: x, y, z
// channels: a, b, c, d
function identifyTextSegment(input){
	var text=input.trim();

	if (text.length==0){
		return "";
	}

	// Must be a variable or a channel
	if (text.length==1){
		if (text[0]=='a'){
			return "channel_a";
		}
		else if (text[0]=='b'){
			return "channel_b";
		}
		else if (text[0]=='c'){
			return "channel_c";
		}
		else if (text[0]=='d'){
			return "channel_d";
		}
		else if (text[0]=='e'){
			return "channel_e";
		}
		else if (text[0]=='f'){
			return "channel_f";
		}
		else if (text[0]=='x'){
			return "var_x";
		}
		else if (text[0]=='y'){
			return "var_y";
		}
		else if (text[0]=='z'){
			return "var_z";
		}
		else{
			return "temp_"+text[0];
		}
	}

	if (text.length==3 && text=="new"){
		return "new";
	}

	for (var i=0;i<process_array.length;i++){
		if (text==process_array[i].process){
			return "process_"+process_array[i].process;
		}
	}

	if (text=== main_document){
		return "document_"+text;
	}

	if (text[0] === text[0].toUpperCase()){
		return "Function_"+text;
	}else{
		return "temp_"+text;
	}
}

// drawing functions ****************************************************************
function drawBoxWithTextAndSwimLane(ctx, x, y, text){
	ctx.lineWidth="4";
	ctx.rect(x,y,110,50);

	ctx.font = "25px Arial";
	ctx.lineWidth="2";
	ctx.fillStyle = '#000000';
	ctx.strokeText(text,15+x,30+y);

	ctx.moveTo(x+50,y+50);
	ctx.lineTo(x+50,y+330);

	ctx.fillRect(x+46,y+65,8,260);
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

	ctx.moveTo(x+23,y+80);
	ctx.lineTo(x+23,y+345);

	ctx.fillRect(x+19,y+85,8,255);
	ctx.stroke();
}

// PiExecution.html page ******************************************
function selectExample(sel){
	if (sel=='1'){
		var example=
		"Printer=b?doc.Println(doc).Printer\n"+
		"Server=a!b.Server\n"+
		"Client=a?p.p!doc\n"+
		"Life=new(a).new(b).(Client|Server|Printer)\n";
		document.getElementsByName("picode")[0].value=example;
		document.getElementsByName("start")[0].value="Life";
		document.getElementsByName("main_document")[0].value="doc";
	}else if (sel=='2'){
		var example=
		"Printer1=b?doc.Println(doc).Printer1\n"+
		"Printer2=c?doc.Println(doc).Printer2\n"+
		"Server=(a!b+a!c).Server\n"+
		"Client=a?p.p!doc\n"+
		"Life=new(a).new(b).new(c).(Client|Server|Printer1|Printer2)\n";
		document.getElementsByName("picode")[0].value=example;
		document.getElementsByName("start")[0].value="Life";
		document.getElementsByName("main_document")[0].value="doc";
	}else if (sel=='3'){
		var example=
		"Printer1=b?doc.Println(doc).Printer1\n"+
		"Printer2=c?doc.Println(doc).Printer2\n"+
		"Server=((b?e.a!e)|(c?f.a!f)|(b?e.d!e)|(c?f.d!f)).Server\n"+
		"Client1=a?p.p!doc\n"+
		"Client2=d?p.p!doc\n"+
		"Life=new(a).new(b).new(c).new(d).new(e).new(f).(Client1|Client2|Server|Printer1|Printer2)\n";
		document.getElementsByName("picode")[0].value=example;
		document.getElementsByName("start")[0].value="Life";
		document.getElementsByName("main_document")[0].value="doc";
	}else{
		document.getElementsByName("picode")[0].value="ERROR!";
		document.getElementsByName("start")[0].value="ERROR";
		document.getElementsByName("main_document")[0].value="ERROR";
	}
}