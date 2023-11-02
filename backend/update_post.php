<?php
$servername = "localhost";
$username = "sscc20111";
$password = "ska!6631418";
$dbname = "sscc20111_godohosting_com";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $json_data = file_get_contents("php://input");
    $data = json_decode($json_data, true);

    $id = $data["id"];
    $text = $data["text"];
    $state = $data["state"];
    $style = $data["style"];
    
    $sql = "UPDATE testDB SET text = '$text', state = '$state', style = '$style' WHERE id = $id";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(array("message" => "Data updated successfully"));
    } else {
        echo json_encode(array("error" => "Data update failed: " . $conn->error));
    }
}

$conn->close();
?>