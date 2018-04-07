<?php

require_once('../resources/config.php');

// deal with Mac line endings
ini_set('auto_detect_line_endings',TRUE);

// $username = $_POST['username'];
$email = $_POST['email'];
$role = $_POST['role'];
$password = $_POST['password'];

$email = strtolower($email);
$sql = "SELECT * FROM $usersTable WHERE email = '$email'";
$result = $conn->query($sql);

// if it is not already in the DB then insert it
if ($result->num_rows == 0) {

    // generate the password hash to save in the DB
    $password = password_hash($password, PASSWORD_DEFAULT);

    $stmt =  $conn->prepare("INSERT INTO $usersTable  (email, role, password, enabled) VALUES (?, ?, ?, TRUE)");
    $stmt->bind_param('sss', $email, $role, $password);
    $result = $stmt->execute();

    if ($result) {
        echo " [" . $email . "] created!!!";
    }
    
} else {
    // user already exist, then do nothing
    echo " [" . $email . "] account already exist!!!";
}

$conn->close();

?>