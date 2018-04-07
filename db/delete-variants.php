<?php

require_once('../resources/config.php');

// deal with Mac line endings
ini_set('auto_detect_line_endings',TRUE);

$target_id = $_POST['target_id'];
$target = $_POST['target'];
$deleted_variant = $_POST['deleted_variant'];
$user_id = $_POST['user_id'];

$sql = "SELECT * FROM $variantsTable WHERE target_id = $target_id AND variant = '$deleted_variant'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {

    $row = $result->fetch_object();
    $id = $row->id;
    $sql = "DELETE FROM $variantsTable WHERE id = $id";
    $result = $conn->query($sql);
    
    if ($result) {
        echo " [" . $deleted_variant . "] was deleted";
    }
    
} else {
    echo "An error ocurred!!!, rows returned: " . $result->num_rows;
    trigger_error('Invalid query: ' . $conn->error);
}

$conn->close();

?>