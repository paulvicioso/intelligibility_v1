<?php

require_once('../resources/config.php');

// open the JSON array
$variantsJSON = '[';

$sql = "SELECT * FROM $targesTable ORDER BY id ASC";

$targets = array();

if ($targets_results = $conn->query($sql)) {
	
	while($target_row = $targets_results->fetch_object()) {

        $curID = $target_row->id;
        $word = $target_row->word;

        $variantsJSON .= '{"index": "' . $curID . '", "target": "' . $word . '",';
        $sql = "SELECT * FROM $variantsTable WHERE target_id = $curID";
        $variants_results = $conn->query($sql);
        
        if ($variants_results->num_rows > 0) {
            $variantsJSON .= '"variants": [';
            while($variants_row = $variants_results->fetch_object()) {
                $variant_word = $variants_row->variant;
                $variantsJSON .= '"' . $variant_word . '",';
            }
            $variantsJSON = rtrim($variantsJSON, ',');
            $variantsJSON .= ']},';
        } else {
            $variantsJSON .= '"variants": []},';
        }
	}
} else {
	echo "Error: " . $conn->error;
	// 	die("No info found in the Control table");
}

// get rid of final comma and close the JSON array
$variantsJSON = rtrim($variantsJSON, ',');
$variantsJSON .= ']';

// $variantsJSON = json_decode($variantsJSON);
// echo json_encode($variantsJSON);
echo $variantsJSON;

// close thd DB connection
$conn->close();

?>