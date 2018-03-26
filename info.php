<?php
if (!isset($_POST['item'])) {
    echo "No item detected.";
    die;
}
$item = json_decode($_POST['item']);
$atime = $item->additional->time->atime;
$crtime = $item->additional->time->crtime;
$readableATime = date("H:i:s\ d-m-Y ", $atime);
$readableCrTime = date("H:i:s\ d-m-Y ", $crtime);
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
        <form method="post" action="">
            <table class="table">
                <tr>
                    <td>Naam:</td>
                    <td><input type="text" value='<?php echo $item->name; ?>'/></td>
                </tr>
                <tr>
                    <td>Owner:</td>
                    <td><input type="text" value='<?php echo $item->additional->owner->user; ?>'/></td>
                </tr>
                <tr>
                    <td>Size:</td>
                    <td><input type="text" value='<?php echo $item->additional->size; ?>'/></td>
                </tr>
                <tr>
                    <td>Laatst geopend op:</td>
                    <td><input type="text" value='<?php echo $readableATime; ?>'/></td>
                </tr>
                <tr>
                    <td>Aangemaakt op:</td>
                    <td><input type="text" value='<?php echo $readableCrTime; ?>'/></td>
                </tr>
            </table>
            <input type="submit" class="btn btn-primary float-right">Aanpassen</input>
        </form>
    </div>
</body>
</html>
