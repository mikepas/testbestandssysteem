<?php
if (!isset($_POST['item'])) {
    echo "No item detected.";
    die;
}

require_once('functions.php');
$item = json_decode($_POST['item']);
$name = preg_replace('/\\.[^.\\s]{3,4}$/', '', $item->name);
$readableATime = formatTime($item->additional->time->atime);
$readableCrTime = formatTime($item->additional->time->crtime);
$size = calculateBytes($item->additional->size);
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
                <h1>Info over <?php echo ($item->isdir ? "de folder " : "het bestand "); ?><?php echo $item->name; ?></h1>
            </div>
        </div>
        <br/>
        <form method="post" action="rename.php">
            <table class="table">
                <tr>
                    <td>Naam:</td>
                    <td>
                        <input type="text" name="name" value='<?php echo $name; ?>'/>
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
                    <td><?php echo $size; ?></td>
                </tr>
                <tr>
                    <td>Laatst geopend op:</td>
                    <td><?php echo $readableATime; ?></td>
                </tr>
                <tr>
                    <td>Aangemaakt op:</td>
                    <td><?php echo $readableCrTime; ?></td>
                </tr>
            </table>
            <input type="submit" name="submit" class="btn btn-primary float-right" value="Naam wijzigen">
        </form>
    </div>
</body>
</html>
