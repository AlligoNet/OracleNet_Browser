<!DOCTYPE html>
<html>
	<head>
		<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">
    <link rel="stylesheet" type="text/css" href="css/style.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
		<?php
			//ini_set('display_errors', 1); error_reporting(E_ALL);
			if(isset($_GET["xnkid"])){
				//database calls to generate a custom URI to be handled by the client program go here
				include 'config/db_credentials.php';
				$conn = new mysqli($dbhost, $dbuser, $dbpassword, $dbname);
				
				if($conn->connect_error) {
					$err = "Database connection error.";
				}
				else{
					//$query = $conn->prepare("SELECT Servers.players, Servers.maxPlayers, Servers.xnaddr, Servers.ipaddr, IPAddresses.publicIP, IPAddresses.port, IPAddresses.open, IPAddresses.name, Users.allowPublic FROM ((Servers LEFT JOIN IPAddresses ON Servers.ipaddr=IPAddresses.localIP) LEFT JOIN Users ON IPAddresses.name=Users.name) WHERE xnkid=?");
					$query = $conn->prepare("SELECT Servers.name, Servers.mode, Servers.map, Servers.players, Servers.maxPlayers, Servers.xnaddr, Servers.ipaddr, IPAddresses.publicIP, IPAddresses.port FROM (Servers LEFT JOIN IPAddresses ON Servers.name=IPAddresses.username) WHERE Servers.xnkid=?");
					$xnkid = $_GET["xnkid"];
					$query->bind_param("s", $xnkid);
					$query->execute();
					$result = $query->get_result();

					if($row = $result->fetch_assoc()){
						$uri = true;
					}
					else {
						$err = "server not found";
					}

					$query->close();
					$conn->close();
					if(isset($uri)){
						//header( 'Location: XXXX://' . $uri ) ;
					}
				}
			}
			function test_number($data) {
			  $data = intval($data);
			  return $data;
			}
		?>
	</head>
	<body>
    <?php include('connect-top.html'); ?>
		<?php
			$conn2 = new mysqli($dbhost, $dbuser, $dbpassword, 'radius');
				
				if($conn2->connect_error) {
					$err = "Database connection error.";
				}
				else{
					$query2 = $conn2->prepare("SELECT public FROM raduserpublic WHERE username=?");
					$name = $row["name"];
					$query2->bind_param("s", $name);
					$query2->execute();
					$result = $query2->get_result();

					if($row2 = $result->fetch_assoc()){
						$allowPublic = $row2['public'];
					}
					else
						$allowPublic = false;

					$query2->close();
					$conn2->close();
					if(isset($uri)){
						//header( 'Location: XXXX://' . $uri ) ;
					}
				}
			if(isset($err)){
				echo "Unable to connect to server: " . $err;
			}
			if(isset($qerr)){
				echo "Unable to execute query: " . $qerr;
			}
			if(isset($uri)){
        $map = $row["map"];
        $gamemode = $row["mode"];
        
        
        if($map == "riverworld") {
          $map = "valhalla";
        }
        if($map == "s3d_reactor") {
          $map = "reactor";
        }
				echo "Server found:";
				echo "<br>Host: " . $row["name"];
				echo "<br>players: " . $row["players"] . '/' . $row["maxPlayers"];
				echo "<br>Local IP: " . $row["ipaddr"];
        echo "<br>Map: " . $map;
        echo "<br>Mode: " . $gamemode;
				if($row["publicIP"] && $allowPublic){
					echo '<br>Direct connection available:';
					echo "<br>Public IP: " . $row["publicIP"];
					echo "<br>Port: " . $row["port"];
				}
				else{
					if(!$row["publicIP"]) echo "<br>Direct Connection information not available for this game.";
					else echo "<br>Direct Connection information is available for this game:";
					if(!$allowPublic) echo "<br>Host has not enabled Direct Connection.";
					else{
						
					}
				}
			}
		?>
		<br><a href="javascript:history.back()"><i class="fa fa-caret-square-o-left fa-3x"></i></a>
    <script type="text/javascript">
      $(document).ready(function() {
        //Setup Vars
        var map = '<?php echo $map; ?>';
        var gamemode = '<?php echo $gamemode; ?>';
        
        if (map == "valhalla") {
          $(".map-header").css({"background" : "url(http://i.imgur.com/XpjbO8O.jpg)","background-size" : "cover"});
        }
        if (map == "guardian") {
          $(".map-header").css({"background" : "(http://i.imgur.com/pzTzmcx.jpg)","background-size" : "cover"});
        }
        if (map == "reactor") {
          $(".map-header").css({"background" : "(http://i.imgur.com/HrcOQMR.jpg)","background-size" : "cover"});
        }
        switch (gamemode) {
          case "slayer":
            $(".gametype-text").html("Slayer");
            $("#gametype-icon").attr("src","http://img2.wikia.nocookie.net/__cb20090710214445/halo/images/0/0e/Slayer_Icon.svg");
            break;
          case "infection":
            $(".gametype-text").html("Infection");
            $("#gametype-icon").attr("src","http://img1.wikia.nocookie.net/__cb20090710215751/halo/images/3/3c/Infection_Symbol.svg");
            break;
          case "ctf":
            $(".gametype-text").html("CTF");
            $("#gametype-icon").attr("src","http://img3.wikia.nocookie.net/__cb20090710215222/halo/images/5/59/CTF_Icon.svg");
            break;
          default:
            $(".gametype-text").html("Unknown");
            $("#gametype-icon").attr("src","http://img2.wikia.nocookie.net/__cb20090710214445/halo/images/0/0e/Slayer_Icon.svg");
            break;
        }
      });
    </script>
	</body>
</html>