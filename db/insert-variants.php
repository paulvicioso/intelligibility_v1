<?php

require_once('../resources/config.php');

// deal with Mac line endings
ini_set('auto_detect_line_endings',TRUE);

$target_id = $_POST['target_id'];
$target = $_POST['target'];
$new_variant = $_POST['new_variant'];
$user_id = $_POST['user_id'];

$sql = "SELECT * FROM $variantsTable WHERE target_id = $target_id AND variant = '$new_variant'";
$result = $conn->query($sql);

// if it is not already in the DB then insert it
if ($result->num_rows == 0) {

    $stmt =  $conn->prepare("INSERT INTO $variantsTable (target_id, variant, user_id, time) VALUES (?, ?, ?, NOW())");
    $stmt->bind_param('isi', $target_id, $new_variant, $user_id);
    $result = $stmt->execute();

    if ($result) {
        echo " [" . $new_variant . "] inserted";
    }
    
} else {
    // variant already exist, then do nothing
    echo " [" . $new_variant . "] variant already exist!!!";
}

$conn->close();

?>