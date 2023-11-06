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

    $nickname = $conn->real_escape_string($data["nickname"]);

    $sql = "SELECT password, salt FROM login WHERE id = '$nickname'";
    $result = $conn->query($sql);

    if ($result && $result->num_rows === 1) {
        $row = $result->fetch_assoc();
        $storedHashedPassword = $row["password"];
        $salt = $row["salt"];
        $combinedPassword = $data["password"] . $salt;

        if (password_verify($combinedPassword, $storedHashedPassword)) {
            $response = array('message' => 'Login successful', 'login' => 'successful');
        } else {
            $response = array('message' => 'Login failed', 'login' => 'failed');
        }
    } else {
        $response = array('message' => 'User not found', 'login' => 'not found');
    }

    echo json_encode($response);
}

$conn->close();
?>
