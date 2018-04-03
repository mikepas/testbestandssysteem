<?php

require_once('syno.php');
require_once('functions.php');

try {
    $syno = new Synology();
} catch (Exception $e) {
    echo "kon niet verbinden met het bestandssysteem.";
    die;
}

$root = "/test";
$path = $root;

if (isset($_POST['open']) && $_POST['open'] != null) $path = $_POST['open'];

if(isset($_POST['upload'])) $syno->upload();
if(isset($_POST['newfolder'])) $syno->createFolder($path, $_POST['foldername']);
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
            <div class="clearfix">
                <form method='post' class="float-right" style="margin: 10px;">
                    <input type='hidden'  id='open' name='open' value='<?php echo $path; ?>'>
                    <button type='submit' class='btn btn-link'><img src="assets/images/reload.png" class="icon"/></button>
                </form>
                <a href="search.php" style="margin: 10px;" class='float-right'><img src="assets/images/search.png" style="margin: 9px" class="icon"/></a>
            </div>
            <h4 style="text-align: center;"><?php echo ltrim($path, "/"); ?></h4>
            <?php
            $list = $syno->GetList( array('method' => 'list', 'version' => 2, 'sort_by' => 'type', 'additional' => '["real_path", "size", "owner", "time", "perm", "mount_point_type", "type"]'), $path)->data->files;
            ShowTable($root, $path, $syno, $list);
            ?>
            <br/>
            <div style="border: #000 1px solid; height: 1px;" class="container-fluid"></div>
            <br/>
            <div class="container">
                <div class="row">
                    <div class="col border-left">
                        <h3>Uploaden naar <?php echo substr($path, strrpos($path, '/') + 1); ?></h3>
                        <br/>
                        <form enctype="multipart/form-data" method="POST">
                            <input type="hidden" name="path" value="<?php echo $path; ?>"/>
                            <input type="file" name="file"/>
                            <br/><br/>
                            <input type="submit" name="upload" value="Uploaden" class="btn btn-primary"/>
                        </form>
                    </div>
                    <div class="col border-left">
                        <h3>Map toevoegen aan <?php echo substr($path, strrpos($path, '/') + 1); ?></h3>
                        <br/>
                        <form method="POST">
                            <input type="text" name="foldername" placeholder="Naam van de map..."/>
                            <br/><br/>
                            <input type="submit" name="newfolder" value="Toevoegen" class="btn btn-primary"/>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>
