<?php
require_once('syno.php');
require_once('functions.php');

if (isset($_POST['search'])) {
    $path = '/test';
    $name = '';
    $createDateFrom = '';
    $createDateTo = '';
    $createName = '';
    $changeDateFrom = '';
    $changeDateTo = '';
    $changeName = '';

    if (isset($_POST['name'])) $name = $_POST['name'];
    if (isset($_POST['create_date_from'])) $createDateFrom = $_POST['create_date_from'];
    if (isset($_POST['create_date_to'])) $createDateTo = $_POST['create_date_to'];
    if (isset($_POST['create_name'])) $createName = $_POST['create_name'];
    if (isset($_POST['change_date_from'])) $changeDateFrom = $_POST['change_date_from'];
    if (isset($_POST['change_date_to'])) $changeDateTo = $_POST['change_date_to'];
    if (isset($_POST['change_name'])) $changeName = $_POST['change_name'];

    try {
        $syno = new Synology();
    } catch (Exception $e) {
        echo "kon niet verbinden met het bestandssysteem.";
        die;
    }

    $searchParams = array(
        'method' => 'start',
        'version' => 2,
        'folder_path' => '"' . $path . '"',
        'pattern' => $name
    );

    $searchResponse = json_decode($syno->_request('entry.cgi', 'SYNO.FileStation.Search', $searchParams));

    $listParams = array(
        'method' => 'list',
        'version' => 2,
        'taskid' => '"' . $searchResponse->data->taskid . '"',
        'additional' => '["size"]',
        'limit' => '-1'
    );

    $listResponse = json_decode($syno->_request('entry.cgi', 'SYNO.FileStation.Search', $listParams))->data->files;
}
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="stylesheet" href="assets/css/bootstrap.min.css">
    <link rel="stylesheet" href="assets/css/main.css">
    <title>test bestandssysteem</title>
</head>
<body>
    <div class="container">
        <div class="row">
            <div class="col-md-1">
                <a style='cursor: pointer;' href="index.php"><img src="assets/images/back.png" style="margin-top: 5px;"/></a>
            </div>
            <div class="col-md-11">
                <h1>Zoeken</h1>
            </div>
        </div>
        <br/>
        <form method="post" action="">
            <table class="table search-table">
                <tr>
                    <td class="col-1-width">Naam:</td>
                    <td colspan="2" class="stretch-input"><input name="name" type="text"/></td>
                </tr>
                <tr>
                    <td class="col-1-width">Datum aangemaakt:</td>
                    <td>Vanaf <input name="create_date_from" type="date" class="date-input"/></td>
                    <td class="float-right">Tot <input name="create_date_to" type="date"/></td>
                </tr>
                <tr>
                    <td class="col-1-width">Aangemaakt door:</td>
                    <td colspan="2" class="stretch-input"><input name="create_name" type="text"/></td>
                </tr>
                <tr>
                    <td class="col-1-width">Datum laatst gewijzigd:</td>
                    <td>Vanaf <input name="change_date_from" type="date" class="date-input"/></td>
                    <td class="float-right">Tot <input name="change_date_to" type="date"/></td>
                </tr>
                <tr>
                    <td class="col-1-width">Gewijzigd door:</td>
                    <td colspan="2" class="stretch-input"><input name="change_name" type="text"/></td>
                </tr>
                <tr>
                    <td class="col-1-width"></td>
                    <td></td>
                    <td><input type="submit" name="search" class="btn btn-primary float-right" value="Zoeken"></td>
                </tr>
            </table>
        </form>
        <br/>
        <div style="border: #000 1px solid; height: 1px;" class="container-fluid"></div>
        <br/>
        <?php if (isset($_POST['search'])) ShowTable('/test', '/test', $syno, $listResponse); ?>
    </div>
</body>
</html>
