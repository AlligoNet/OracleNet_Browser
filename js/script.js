//server list
var refreshing = false;
var servers = [];
var modes = [];
var maps = [];
//order for sorting and sorting basis
var reverse = true;
var BasisEnum = {
	NAME: 0,
	MAP: 1,
	MODE: 2,
	PLAYERS: 3,
	SPECIAL: 4,
	PING: 5
}
var basis = BasisEnum.NAME;

function serverSort(a,b){
	var result = 0;
	switch(basis){
		case BasisEnum.NAME:
			result = a.name.localeCompare(b.name);
		break;
		case BasisEnum.MAP:
			result = a.map.localeCompare(b.map);
		break;
		case BasisEnum.MODE:
			result = a.mode.localeCompare(b.mode);
		break;
		case BasisEnum.PLAYERS:
			result = a.players - b.players;
		break;
		case BasisEnum.SPECIAL:
			result = a.special.localeCompare(b.special);
		break;
		case BasisEnum.PING:
			result = b.ping - a.ping;
		break;
		default:
		
	}
	return (reverse ? result : -1 * result);
}

var filters = {
	name: "",
	map: "",
	mode: "",
	excludeEmpty: false,
	excludeFull: false,
	special: "",
	maxPing: 1000
}

function filtered(server){
	if(server.name.toLowerCase().search(filters.name.toLowerCase()) == -1){
		return true;
	}
	if(server.map.toLowerCase().search(filters.map.toLowerCase()) == -1){
		return true;
	}
	if(server.mode.toLowerCase().search(filters.mode.toLowerCase()) == -1){
		return true;
	}
	if(filters.excludeEmpty && server.players == 0){
		return true;
	}
	if(filters.excludeFull && server.players == server.maxPlayers){
		return true;
	}
	if(server.special.toLowerCase().search(filters.special.toLowerCase()) == -1){
		return true;
	}
	if(server.ping > filters.maxPing){
		return true;
	}
	return false;
}

function finishMaps(){
	var inside = "<option value=\"\">" + "all" + "</option>";
	for(x in maps){
    map = maps[x].map;
    if (map == "riverworld") {
      map = "Valhalla";
    }
    if (map == "s3d_turf") {
      map = "Turf";
    }
    if (map == "s3d_avalanche") {
      map = "Avalanche";
    }
    if (map == "s3d_edge") {
      map = "Edge";
    }
    if (map == "s3d_reactor") {
      map = "Reactor";
    }
		inside = inside + "<option value=\"" + map + "\">" + map + "</option>";
	}
	document.getElementById("maps").innerHTML = inside;
	reFilter();
}

function finishModes(){
	var inside = "<option value=\"\">" + "all" + "</option>";
	console.log(modes);
	for(x in modes){
		inside = inside + "<option value=\"" + modes[x].mode + "\">" + modes[x].mode + "</option>";
	}
	document.getElementById("mode").innerHTML = inside;
	reFilter();
}

function continueMaps(response){
	var jsonResponse = JSON.parse(response);
	maps = jsonResponse;
	finishMaps();
}

function continueModes(response){
	var jsonResponse = JSON.parse(response);
	modes = jsonResponse;
	finishModes();
}

function continueRefresh(response){
	var jsonResponse = JSON.parse(response);
	servers = jsonResponse;
	finishRefresh();
}

//up: &#9650; down: &#9660;
function markSorting(cat){
	if(cat == basis){
		return (reverse ? "<br><i class=\"fa fa-sort-desc\"></i>" : "<br><i class=\"fa fa-sort-asc\"></i>");
	}
	else{
		return "<br><i class=\"fa fa-sort\"></i>";
	}
}

function finishRefresh(){
	servers.sort(function(a,b){return serverSort(a,b);});
	var contentsString = "<tr><th onclick=\"order(BasisEnum.NAME)\">Server" + markSorting(BasisEnum.NAME) + "</th><th onclick=\"order(BasisEnum.MAP)\">Map" + markSorting(BasisEnum.MAP) + "</th><th onclick=\"order(BasisEnum.MODE)\">Type" + markSorting(BasisEnum.MODE) + "</th><th onclick=\"order(BasisEnum.PLAYERS)\">Players" + markSorting(BasisEnum.PLAYERS) + "</th><th onclick=\"order(BasisEnum.SPECIAL)\">Tags" + markSorting(BasisEnum.SPECIAL) + "</th><th onclick=\"order(BasisEnum.PING)\">Ping" + markSorting(BasisEnum.PING) + "</th></tr>";
	for(server in servers){
		if(!filtered(servers[server])){
      var map = servers[server].map;
      if (map == "riverworld") {
        map = "Valhalla";
      }
      if (map == "s3d_turf") {
        map = "Turf";
      }
      if (map == "s3d_avalanche") {
        map = "Avalanche";
      }
      if (map == "s3d_edge") {
        map = "Edge";
      }
      if (map == "s3d_reactor") {
        map = "Reactor";
      }
			contentsString = contentsString + "<tr><td><a href=\"connect.php?xnkid=" + servers[server].xnkid + "\">" + servers[server].name + "</a>" + (servers[server].allowPublic? ' <i class="fa fa-link"></i>' : "") + "</td><td><a href=\"#\">" + map + "</a></td><td><a href=\"#\">" + servers[server].mode + "</a></td><td><a href=\"#\">" + servers[server].players + "/" + servers[server].maxPlayers + "</a></td><td><a href=\"#\">" + servers[server].special + "</a></td><td><a href=\"#\">" + servers[server].ping + "</a></td></tr>";
		}
	}
	document.getElementById("serverList").innerHTML = contentsString;
	setTimeout( function(){ refreshing = false;}, 100);
}

function reFilter(){
	var filterForm = document.getElementById("filter-form").elements;
	filters.name = filterForm.namedItem("name").value;
	filters.map = filterForm.namedItem("map").value;
	filters.mode = filterForm.namedItem("mode").value;
	filters.excludeEmpty = filterForm.namedItem("empty").checked;
	filters.excludeFull = filterForm.namedItem("full").checked;
	filters.special = filterForm.namedItem("special").value;
	filters.maxPing = parseInt(filterForm.namedItem("maxPing").value);
	finishRefresh();
}

function order(b){
	reverse = ((basis == b) ? !reverse : true);
	basis = b;
	finishRefresh();
}

function requestServers(){
	var request = new XMLHttpRequest();
	var url = "ajax/serverlist.json.php"; //
	
	request.onreadystatechange=function() {
		if (request.readyState == 4 && request.status == 200){
			continueRefresh(request.responseText);
		}
	}
	request.open("GET" , url, true);
	request.send();
	
}

function requestMaps(){
	var request = new XMLHttpRequest();
	var url = "ajax/serverlist.json.php?sub=map";
	
	request.onreadystatechange=function() {
		if (request.readyState == 4 && request.status == 200){
			continueMaps(request.responseText);
		}
	}
	request.open("GET" , url, true);
	request.send();
	
}

function requestModes(){
	var request = new XMLHttpRequest();
	var url = "ajax/serverlist.json.php?sub=mode";
	
	request.onreadystatechange=function() {
		if (request.readyState == 4 && request.status == 200){
			continueModes(request.responseText);
		}
	}
	request.open("GET" , url, true);
	request.send();
	
}

function refresh(){
	if(refreshing){
		alert("Please wait longer before refreshing.");
	}
	else{
		refreshing = true;
		document.getElementById("serverList").innerHTML = "<tr><th><i class=\"fa fa-spinner fa-pulse fa-5x\"></i></th></tr>";
		requestMaps();
		requestModes();
		requestServers();
	}
}

$(document).ready(function() {
  refresh();
  $('#showFilter').click(function(){
    $('#showFilter').toggleClass('active');
    $('#filters').toggleClass('active');
  });
  $('#refresh').click(function() {
    refresh();
  });
  
  //For the auto refresh.
  window.setInterval(function(){
    refresh();
  }, 25000);
  
  // For background
  //$('.heading').mousemove(function(e){
  //    var amountMovedX = (e.pageX * -1 / 6);
  //    var amountMovedY = (e.pageY * -1 / 6);
  //    $(this).css('background-position', amountMovedX + 'px ' + amountMovedY + 'px');
  //});
});