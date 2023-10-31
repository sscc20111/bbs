<?php
$servername = "localhost";
$username = "sscc20111";
$password = "ska!6631418";
$dbname = "sscc20111_godohosting_com";

$conn = new mysqli($servername, $username, $password, $dbname);
echo "데이터 삭제 성공!";
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $json_data = file_get_contents("php://input");
    $data = json_decode($json_data, true);

    $id = $data["id"];
    echo json_encode($id);

    $sql = "DELETE FROM testDB WHERE id = $id";
    if ($conn->query($sql) === TRUE) {
        echo "데이터 삭제 성공!";
    } else {
        echo "데이터 삭제 실패: " . $conn->error;
    }
}

$conn->close();
?>
