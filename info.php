<?php
if (!isset($_GET['path'])) {
    echo "No item detected.";
    header('location: http://localhost/testbestandssysteem');
}

require_once('functions.php');
require_once('syno.php');

try {
    $syno = new Synology();
} catch (Exception $e) {
    echo "kon niet verbinden met het bestandssysteem.";
    die;
}

$list = json_decode($syno->GetFileInfo($_GET['path']))->data->files;

foreach ($list as $key) {
    $item = $key;
}

if ($item->code == '408') {
    echo "filepath not found";
    die;
}

if (isset($_POST['rename'])) {
    if ($_POST['type'] == 'folder') {
        $filename = $_POST['name'];
    } else {
        $filename = $_POST['name'] . "." . $_POST['type'];
    }
    $response = $syno->rename($_POST['filepath'], $filename);
    $path = pathinfo($_POST['filepath']);
    $path = $path['dirname'] . "/" . $filename;
    header("location: info.php?path=$path");
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
                <a style='cursor: pointer;' href="index.php"><img src="assets/images/back.png" style="margin-top: 5px;"/></i></a>
            </div>
            <div class="col-md-11">
                <h1>Info over <?php echo ($item->isdir ? "de folder " : "het bestand "); ?><?php echo $item->name; ?></h1>
            </div>
        </div>
        <br/>
        <form method="post">
            <table class="table">
                <tr>
                    <td>Naam:</td>
                    <td>
                        <input type="text" name="name" value='<?php echo preg_replace('/\\.[^.\\s]{3,4}$/', '', $item->name); ?>' style="width: 300px;"/>
                        <input type="hidden" name="filepath" value='<?php echo $item->path; ?>'/>
                        <input type="hidden" name="type" value='<?php echo (($item->isdir) ? 'folder' : strtolower($item->additional->type)); ?>'/>
                    </td>
                </tr>
                <tr>
                    <td>Extensie:</td>
                    <td><?php echo (($item->isdir) ? 'folder' : strtolower($item->additional->type)); ?></td>
                </tr>
                <tr>
                    <td>Locatie:</td>
                    <td><?php echo $item->path; ?></td>
                </tr>
                <tr>
                    <td>Eigenaar:</td>
                    <td><?php echo $item->additional->owner->user; ?></td>
                </tr>
                <tr>
                    <td>Grootte:</td>
                    <td><?php echo calculateBytes($item->additional->size); ?></td>
                </tr>
                <tr>
                    <td>Laatst geopend op:</td>
                    <td><?php echo formatTime($item->additional->time->atime); ?></td>
                </tr>
                <tr>
                    <td>Aangemaakt op:</td>
                    <td><?php echo formatTime($item->additional->time->crtime); ?></td>
                </tr>
            </table>
            <input type="submit" name="rename" class="btn btn-primary float-right" value="Naam wijzigen">
        </form>
    </div>
</body>
</html>
