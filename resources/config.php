<?php

// Define these as constants so that they can't be changed
DEFINE ('DBUSER', 'hillab');
DEFINE ('DBHOST', 'localhost');
DEFINE ('DBNAME', 'hillab');
DEFINE ('LOGUSER', 'hillab');

$targesTable = "its_targets";
$variantsTable = "its_variants";
$usersTable = "its_users";
$loginAttemptsTable = "its_login_attempts";

// Create connection
$conn = new mysqli(DBHOST, DBUSER, DBPWD, DBNAME);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
    exit();
}

function insert_login_attempt($user_id, $status) {

    global $conn; // Need the connection.
    global $loginAttemptsTable;
    global $usersTable;

    // insert the new intent in the log
    $conn->query("INSERT INTO $loginAttemptsTable (user_id, status, time) VALUES ('$user_id', '$status', NOW())");

    // if legit user then register last login
    if ($status == 'SUCCESS') {
        $conn->query("UPDATE $usersTable SET last_login = NOW() WHERE id = $user_id");
    }
    
}

?>