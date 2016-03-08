// Global variable ***********************************************************
var startNode= null; // Which is the start node
var main_document=null; // Which is the main document for send it around
var process_array=new Array(); // Collects all processes

// Classes *******************************************************************
// Process Definition ------------------------------------------------------------------
function ProcessDefinition(my_process_name, my_code, my_x, my_y, my_elements, my_sequence){
	this.process=my_process_name;
	this.code=my_code;
	this.x_coord=my_x;
	this.y_coord=my_y;
	this.elements=my_elements;
	this.sequence=my_sequence;
	this.searchForDoc=searchForDoc;
	this.getFirstChannelFromTheBack=getFirstChannelFromTheBack;
	this.containsChannel=containsChannel;
	this.getChannelAfterExclamationMark=getChannelAfterExclamationMark;
	this.docContainsFunction=docContainsFunction;
}

function searchForDoc(){
	for (var i=0;i<this.elements.length;i++){
		if (this.elements[i] instanceof Document && this.elements[i].document==main_document){
			return true;
		}
	}

	return false;
}

function docContainsFunction(){
	for (var i=0;i<this.elements.length;i++){
		if (this.elements[i] instanceof Function){
			return this.elements[i].function+"("+this.elements[i].doc+")";
		}
	}

	return "";
}

function getFirstChannelFromTheBack(){
	for (var i=this.elements.length-1;i>=0;--i){
		if (this.elements[i] instanceof Channel){
			return this.elements[i].channel;
			break;
		}
	}
}

function getChannelAfterExclamationMark(my_channel){
	for (var i=0;i<this.elements.length;i++){
		if (this.elements[i] instanceof Channel && this.elements[i].channel==my_channel){
			if (this.elements[i+1] instanceof Connector && this.elements[i+1].connector == '!'){
				return this.elements[i+2].channel;
			}
		}
	}
}

function containsChannel(my_channel){
	for (var i=this.elements.length-1;i>=0;--i){
		if (this.elements[i] instanceof Channel && this.elements[i].channel==my_channel){
			return true
		}
	}
}

// Print all elements
ProcessDefinition.prototype.toString = function toStringProcessDefinition(){
	var myString="";
	myString=myString+identifyTextSegment(this.process)+" = ";
	for (var i=0;i<this.elements.length;i++){
		myString=myString+this.elements[i];
	}
	//myString=myString+" --- (Canvas x="+this.x_coord+" y="+this.y_coord+")\n";
	myString=myString+"<br>\n";
	return myString;
}

// Process -----------------------------------------------------------------------
function Process(my_process){
	this.process=my_process;
}

Process.prototype.toString = function toStringProcess(){
	if (this.process==startNode){
		var myString="<font color='0000ff'>start_process_";
		myString=myString+this.process;
		return myString+"</font>";
	}else{
		var myString="<font color='ff00ff'>process_";
		myString=myString+this.process;
		return myString+"</font>";
	}
}

// Connector -----------------------------------------------------------------------
function Connector(my_connector){
	this.connector=my_connector;
}

Connector.prototype.toString = function toStringConnector(){
	var myString=" <font color='ff0000'>";
	myString=myString+this.connector+"</font> ";
	return myString;
}

// Parentheses -----------------------------------------------------------------------
function Parentheses(my_parentheses){
	this.parentheses=my_parentheses;
}

Parentheses.prototype.toString = function toStringParentheses(){
	var myString="<font color='00ff00'>";
	myString=myString+this.parentheses+"</font>";
	return myString;
}

// Variable -----------------------------------------------------------------------
function Variable(my_variable){
	this.variable=my_variable;
}

Variable.prototype.toString = function toStringVariable(){
	var myString="";
	myString=myString+this.variable;
	return myString;
}

// TempVariable -----------------------------------------------------------------------
function TempVariable(my_temp_variable){
	this.temp_variable=my_temp_variable;
}

TempVariable.prototype.toString = function toStringTempVariable(){
	var myString="temp_var_";
	myString=myString+this.temp_variable;
	return myString;
}

// Channel -----------------------------------------------------------------------
function Channel(my_channel){
	this.channel=my_channel;
}

Channel.prototype.toString = function toStringTempChannel(){
	var myString="channel_";
	myString=myString+this.channel;
	return myString;
}

// Document ----------------------------------------------------------------------
function Document(my_document){
	this.document=my_document;
}

Document.prototype.toString = function toStringDocument(){
	var myString="";
	myString=myString+this.document;
	return myString;
}

// Function -----------------------------------------------------------------------
function Function(my_function, my_doc){
	this.function=my_function;
	this.doc=my_doc;
}

Function.prototype.toString = function toStringFunction(){
	var myString="function_";
	myString=myString+this.function;
	myString=myString+"("+this.doc;
	return myString+")";
}

// New -----------------------------------------------------------------------
function New(my_channel){
	this.channel=my_channel;
}

New.prototype.toString = function toStringNew(){
	var myString="new(";
	myString=myString+this.channel.toString();
	return myString+")";
}

//  -----------------------------------------------------------------------
function Error(my_error){
	this.error=my_error;
}

Error.prototype.toString = function toStringNew(){
	var myString="ERROR_";
	myString=myString+this.error;
	return myString;
}

// functions *****************************************************************
function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {vars[key] = value;});
	return vars;
}

function goBack() {
	window.history.back();
}

// Parsing part ****************************************************************
// connetors: ? ! new() . | ( ) =
function parsingALine(process_obj){
	var text="";
	var foundFunction=null;
	for (var i=0;i<process_obj.code.length;i++){
		if (
			process_obj.code[i]=='?' ||
			process_obj.code[i]=='!' ||
			process_obj.code[i]=='.' ||
			process_obj.code[i]=='+' ||
			process_obj.code[i]=='|'
		){
			process_obj.elements.push(identifyTextSegment(text));
			process_obj.elements.push(new Connector(process_obj.code[i]));
			text=""; // reset it
		}else if (process_obj.code[i]=='(' || process_obj.code[i]==')'){
			var obj=identifyTextSegment(text);
			process_obj.elements.push(obj);

			// Special case for "new(a)"
			if (obj instanceof New){
				var next_channel_obj=identifyTextSegment(process_obj.code[++i]);
				obj.channel=next_channel_obj;
				++i;// we also do not need ')'
			} else if (obj instanceof Function && foundFunction == null){
				//alert("FOUND FUNCTION, and saved it! obj="+obj);
				foundFunction=obj;
			} else if (obj instanceof Document && foundFunction != null){
				//alert("Document for Function! obj="+obj);
				foundFunction.doc=obj;
				process_obj.elements.pop();// not needed anymore, already included into function
				foundFunction=null;
			}

			text=""; // reset it
		} else {
			// add next letter to text
			text=text.concat(process_obj.code[i]);
		}
	}

	// don't forget the last text
	if (text.length!=0){
		process_obj.elements.push(identifyTextSegment(text));
		text="";
	}
}

// Identify
// processes: P, Q, R, S
// variables: x, y, z and temp variables
// channels: a, b, c, d, e, f
// procees
// document
// function
function identifyTextSegment(input){
	var text=input.trim();

	if (text.length==0){
		return "";
	}

	// Must be a variable or a channel
	if (text.length==1){
		if (text[0]=='a'){
			return new Channel("a");
		}
		else if (text[0]=='b'){
			return new Channel("b");
		}
		else if (text[0]=='c'){
			return new Channel("c");
		}
		else if (text[0]=='d'){
			return new Channel("d");
		}
		else if (text[0]=='e'){
			return new Channel("e");
		}
		else if (text[0]=='f'){
			return new Channel("f");
		}
		else if (text[0]=='x'){
			return new Variable("x");
		}
		else if (text[0]=='y'){
			return new Variable("y");
		}
		else if (text[0]=='z'){
			return new Variable("z");
		}
		else{
			return new TempVariable(text[0]);
		}
	}

	if (text.length==3 && text=="new"){
		return new New(null);
	}

	for (var i=0;i<process_array.length;i++){
		if (text==process_array[i].process){
			return new Process(process_array[i].process);
		}
	}

	if (text=== main_document){
		return new Document(text);
	}

	if (text[0] === text[0].toUpperCase()){
		return new Function(text, null);
	}else{
		return new Error(text);
	}
}

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