// *****************************************************************************
// Global variable ***********************************************************
var startNode= null; // Which is the start node
var main_document=null; // Which is the main document for send it around
var process_array=new Array(); // Collects all processes
var highlight_step=null;

// *****************************************************************************
// Classes *******************************************************************
// Process Definition class (represents one pi-calculus line) ------------------------------
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
	this.boolContainsFunction=boolContainsFunction;
}

function searchForDoc(my_doc){
	for (var i=0;i<this.elements.length;i++){
		if (this.elements[i] instanceof Document && this.elements[i].document==my_doc){
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

function boolContainsFunction(){
	for (var i=0;i<this.elements.length;i++){
		if (this.elements[i] instanceof Function){
			return true;
		}
	}

	return false;
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

// Print all elements - override toString() method
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

// Process class -----------------------------------------------------------------------
function Process(my_process){
	this.process=my_process;
}

// Override toString() method
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

// Connector class -----------------------------------------------------------------------
function Connector(my_connector){
	this.connector=my_connector;
}

// Override toString() method
Connector.prototype.toString = function toStringConnector(){
	var myString=" <font color='ff0000'>";
	myString=myString+this.connector+"</font> ";
	return myString;
}

// Parentheses class -----------------------------------------------------------------------
function Parentheses(my_parentheses){
	this.parentheses=my_parentheses;
}

// Override toString() method
Parentheses.prototype.toString = function toStringParentheses(){
	var myString="<font color='00ff00'>";
	myString=myString+this.parentheses+"</font>";
	return myString;
}

// Variable class -----------------------------------------------------------------------
function Variable(my_variable){
	this.variable=my_variable;
}

// Override toString() method
Variable.prototype.toString = function toStringVariable(){
	var myString="";
	myString=myString+this.variable;
	return myString;
}

// TempVariable class -----------------------------------------------------------------------
function TempVariable(my_temp_variable){
	this.temp_variable=my_temp_variable;
}

// Override toString() method
TempVariable.prototype.toString = function toStringTempVariable(){
	var myString="temp_var_";
	myString=myString+this.temp_variable;
	return myString;
}

// Channel class -----------------------------------------------------------------------
function Channel(my_channel){
	this.channel=my_channel;
}

// Override toString() method
Channel.prototype.toString = function toStringTempChannel(){
	var myString="channel_";
	myString=myString+this.channel;
	return myString;
}

// Document class ----------------------------------------------------------------------
function Document(my_document){
	this.document=my_document;
}

// Override toString() method
Document.prototype.toString = function toStringDocument(){
	var myString="";
	myString=myString+this.document;
	return myString;
}

// Function class -----------------------------------------------------------------------
function Function(my_function, my_doc){
	this.function=my_function;
	this.doc=my_doc;
}

// Override toString() method
Function.prototype.toString = function toStringFunction(){
	var myString="function_";
	myString=myString+this.function;
	myString=myString+"("+this.doc;
	return myString+")";
}

// New class -----------------------------------------------------------------------
function New(my_channel){
	this.channel=my_channel;
}

// Override toString() method
New.prototype.toString = function toStringNew(){
	var myString="new(";
	myString=myString+this.channel.toString();
	return myString+")";
}

// Error class -----------------------------------------------------------------------
function Error(my_error){
	this.error=my_error;
}

// Override toString() method
Error.prototype.toString = function toStringNew(){
	var myString="ERROR_";
	myString=myString+this.error;
	return myString;
}

// *****************************************************************************
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