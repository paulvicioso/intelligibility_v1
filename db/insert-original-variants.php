<?php

require_once('../resources/config.php');

// deal with Mac line endings
ini_set('auto_detect_line_endings',TRUE);

$insertedCounter = 0;
$targetCounter = 0;

if (($handle = fopen("words_list.csv", "r")) !== FALSE) {
    while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
        $totalWords = count($data);
        // echo "<p> $totalWords fields in line $row: <br /></p>";
        $targetCounter++;
        if ($totalWords > 1) {

            $sql = "SELECT id FROM $targesTable WHERE word = '$data[0]'";
            $result = $conn->query($sql);

            if ($result->num_rows > 0) {
                // echo "Target: [" . $data[0] . "] ";
                $row = $result->fetch_object();
                // echo $row->id;
                $targetID = $row->id;
                echo "ID: [" . $targetID . "] Target: [" . $data[0] . "] Variants:";
                for ($c = 1; $c < $totalWords; $c++) {
                    if ($data[$c] !== '') {
                        // echo "Data: " . $data[$c] . "<br/>";
                        $sql = "INSERT INTO $variantsTable (target_id, variant, user_id, time) VALUES ($targetID, '$data[$c]', 1, NOW())";
                        if ($result = $conn->query($sql)) {
                            echo " [" . $data[$c] . "]";
                            $insertedCounter++;
                        } else {
                            echo "Error: [" . $data[$c] . "] NOT inserted<br>";
                        }
                    }
                }

                echo "<br>";

            } else {
                echo "Target : [" . $data[0] . "] NOT FOUND!!!<br>";
            }
        } else {
            echo "No variants for : [" . $data[0] . "]<br>";
        }
    }

    echo "<br><b>Total processed: " . $targetCounter . ", Inserted: " . $insertedCounter . "</b><br>";

    fclose($handle);
}

$conn->close();

?>