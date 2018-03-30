<?php
if (!isset($_GET['path'])) {
    echo "Geen folder path meegegeven.";
}
if (isset($_POST['newfolder'])) {

    require_once('syno.php');

    try {
        $syno = new Synology();
    } catch (Exception $e) {
        echo "kon niet verbinden met het bestandssysteem.";
        die;
    }

    $response = $syno->createFolder($_GET['path'], $_POST['name']);

    if ($response->success) {
        header('Location: http://localhost/testbestandssysteem/');
    } else {
        echo "<script type=\"text/javascript\">alert(\"Could not create folder.\");window.location.replace(\"http://localhost/testbestandssysteem/\");</script>";
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="stylesheet" href="assets/css/bootstrap.min.css">
    <title>test bestandssysteem</title>
</head>
<body>
<div class="container">
    <div class="row">
        <div class="col-md-1">
            <a style='cursor: pointer;' onclick="window.history.back();"><img src="assets/images/back.png" style="margin-top: 5px;"/></i></a>
        </div>
        <div class="col-md-11">
            <h1>Nieuwe map aanmaken</h1>
        </div>
    </div>
    <br/>
    <form method="post" action="new-folder.php?path=<?php echo $_GET['path']; ?>">
        <table class="table">
            <tr>
                <td>Locatie:</td>
                <td><?php echo $_GET['path']; ?></td>
            </tr>
            <tr>
                <td>Naam:</td>
                <td>
                    <input type="text" name="name" style="width: 300px;"/>
                </td>
            </tr>
        </table>
        <input type="submit" name="newfolder" class="btn btn-primary float-right" value="Aanmaken">
    </form>
</div>
</body>
</html>