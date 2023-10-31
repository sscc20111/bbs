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

    $email = $data["email"];
    $password = $date("password");
    $nickname = $data["nickname"];

    $sql = "INSERT INTO login (id, password, email) VALUES ('$nickname', '$password', '$email')";

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
