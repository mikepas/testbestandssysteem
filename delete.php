<?php

if (!isset($_GET['path'])) {
    echo "No file path detected.";
    die;
}

require_once('syno.php');

try {
    $syno = new Synology();
} catch (Exception $e) {
    echo "kon niet verbinden met het bestandssysteem.";
    die;
}

$deleteParams = array(
    'method' => 'start',
    'version' => 2,
    'path' => $_GET['path'],
);

$deleteResponse = json_decode($syno->_request('entry.cgi', 'SYNO.FileStation.Delete', $deleteParams));

$statusParams = array(
    'method' => 'status',
    'version' => 2,
    'taskid' => '"'.$deleteResponse->data->taskid. '"',
);

$statusResponse = json_decode($syno->_request('entry.cgi', 'SYNO.FileStation.Delete', $statusParams));

if ($statusResponse->success) header('Location: http://localhost/testbestandssysteem/');

?>

<script type="text/javascript">
    alert("Could not delete.");
    window.location.replace("http://localhost/testbestandssysteem/");
</script>

