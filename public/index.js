function createNewListItems() {
	var list = document.getElementById('hws');
	for(var i=1; i<=40; i++){
    var entry = document.createElement('li');
    entry.className = "item";
    entry.appendChild(document.createTextNode("firstname"));
    list.appendChild(entry);
	}
}

window.onload = function() {
   createNewListItems();
}
