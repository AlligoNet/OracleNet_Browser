<?php
	//database calls to generate the server list go here
	
	//make sure credentials file is hidden in .gitignore .htaccess
	include '../config/db_credentials.php';
	$conn = new mysqli($dbhost, $dbuser, $dbpassword, $dbname);
	if($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	}
	else{
		$query = "SELECT ip, port FROM Servers";
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
			$row['ip'] = strip_tags($row['ip']);
			$row['port'] = strip_tags($row['port']);
			array_push($rows, $row);
		}
		$conn->close();
		echo json_encode($rows); //note: JS will have to be updated to match new format
	}
?>