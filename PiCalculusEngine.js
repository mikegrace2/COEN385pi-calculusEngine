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