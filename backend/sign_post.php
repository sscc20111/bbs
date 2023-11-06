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

    $email = $conn->real_escape_string($data["email"]);
    $nickname = $conn->real_escape_string($data["nickname"]);
    $userpassword = $data["password"];

    // Check if the nickname already exists
    $check_sql = "SELECT * FROM login WHERE id = '$nickname'";
    $check_result = $conn->query($check_sql);

    if ($check_result->num_rows > 0) {
        $response = array('message' => '중복된 닉네임이 존재합니다!');
        echo json_encode($response);
        $conn->close();
        exit(); // Stop execution since we don't want to proceed with insertion
    }

    // Generate a random salt
    $salt = bin2hex(random_bytes(16));

    // Combine password and salt, then hash
    $combinedPassword = $userpassword . $salt;
    $hashedPassword = password_hash($combinedPassword, PASSWORD_BCRYPT);

    $date = date("Y-m-d H:i:s");

    $sql = "INSERT INTO login (id, password, salt, email, created_at) VALUES ('$nickname', '$hashedPassword', '$salt', '$email', '$date')";

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
