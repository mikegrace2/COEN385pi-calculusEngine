function parseIt(){
	alert('Parse it!');
	return true;
}

/*function getItemPrice(item){
	for (var i = 0; i < menuitems.length; ++i){
		if (menuitems[i].itemname == item) {// item found
				return menuitems[i].price;
		}
	}
	return 0;
}

function updateOrder(){
	var orderString="";
	var n = document.getElementById("entries").length;
	var completePrice=0;

	for(i=0;i<n;++i) {
		if(document.getElementById("entries").options[i].selected) {
			var selectedItem = document.getElementById("entries").options[i].value;
			var price = getItemPrice(selectedItem);
			orderString += selectedItem+" Price: $"+price+"\n";
			completePrice=completePrice+price;
		}
	}

	var orderheading = "Your order is:\n";
	document.getElementById("summary").value=orderheading + orderString +"total price: $"+completePrice+"\n";
}

function processOrder(){
	alert ("Your order will be ready in 5 min");
}

function registerEvents(){
	var optionList = document.getElementById("entries");
	optionList.onchange = updateOrder;
	var orderBtn = document.getElementById("order");
	orderBtn.onclick = processOrder;
}*/