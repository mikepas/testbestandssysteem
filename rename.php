<?php
if (isset($_POST['submit'])) {
    require_once('syno.php');
    try {
        $syno = new Synology();
    } catch (Exception $e) {
        echo "kon niet verbinden met het bestandssysteem.";
        die;
    }
    $filename = $_POST['name'] . "." . $_POST['type'];
    $response = $syno->rename($_POST['filepath'], $filename);
    header('location: info.php');
} else {
    echo "ongeldige request.";
    die;
}