<?php
$servername = "localhost";
$username = "sscc20111";
$password = "ska!6631418";
$dbname = "sscc20111_godohosting_com";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json_data = file_get_contents("php://input");
    $data = json_decode($json_data, true);

    $text = $data["text"];
    $style = $data["style"];
    // $user_data = $data["user_data"];
    $state = $data["state"];
    $date = date("Y-m-d");
    $ip = $_SERVER["REMOTE_ADDR"];

    // $sql = "INSERT INTO testDB (text, date, ip, style, user_data, state) VALUES ('$text', '$date', '$ip', '$style', '$user_data', '$state')";
    $sql = "INSERT INTO testDB (text, date, ip, style, state) VALUES ('$text', '$date', '$ip', '$style', '$state')";

    if ($conn->query($sql) === TRUE) {
        $response = array('message' => 'Post saved successfully');
        echo json_encode($response);
    } else {
        $response = array('message' => 'Error saving post: ' . $conn->error);
        echo json_encode($response);
    }
}

$conn->close();
?>
