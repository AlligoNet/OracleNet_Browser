<?php
	//database calls to generate the server list go here
	
	//make sure credentials file is hidden in .gitignore .htaccess
	include '../config/db_credentials.php';
	$conn = new mysqli($dbhost, $dbuser, $dbpassword, $dbname);
	if($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	}
	else{
		$query = "SELECT Servers.name, Servers.map, Servers.mode, Servers.players, Servers.maxPlayers, Servers.special, Servers.ping, Servers.xnkid, Servers.lastSeen, radius.raduserpublic.public AS allowPublic FROM (Servers LEFT JOIN radius.raduserpublic ON Servers.name=radius.raduserpublic.username)";
		if(isset($_GET["sub"])){
			if($_GET["sub"] === "map"){
				$query = "SELECT DISTINCT map FROM Servers";
			}
			else{
				$query = "SELECT DISTINCT mode FROM Servers";
			}
		}
		$result = $conn->query($query);
		$rows = array();
		while($row = $result->fetch_assoc()){
			if(!isset($row["mode"])){
				$row["mode"] = "null";
			}
			array_push($rows, $row);
		}
		$conn->close();
		echo json_encode($rows); //note: JS will have to be updated to match new format
	}
?>