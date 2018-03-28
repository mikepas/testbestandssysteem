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

if (isset($_POST['new-folder'])) {
    $syno->newFolder();
    // ga hier verder!
}

$backUrl = substr($path, 0, strrpos($path, "/"));

$list = $syno->GetList( array('method' => 'list', 'version' => 2, 'sort_by' => 'type', 'additional' => '["real_path", "size", "owner", "time", "perm", "mount_point_type", "type"]'), $path)->data->files;
//if (!$list->success) $list = null;
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
                <a href="search.php?path=<?php echo $root; ?>" style="margin: 10px;" class='float-right'><img src="assets/images/search.png" style="margin: 9px" class="icon"/></a>
            </div>
            <h4 style="text-align: center;"><?php echo ltrim($path, "/"); ?></h4>
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Size</th>
                        <th>Owner</th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th>
                            <form method='post'>
                                <input type='hidden'  id='new-folder' name='new-folder' value='<?php echo $path; ?>'>
                                <button type='submit' class='btn btn-link new-folder'><img src="assets/images/new_folder.png" class="icon"/></button>
                            </form>
                        </th>
                    </tr>
                </thead>
                <?php
                if ($path != $root) {
                    echo "<tr><td><img src='assets/images/folder.png' class='icon'/></td>
                            <td>
                                <form method='post'>
                                    <input type='hidden'  id='open' name='open' value='$backUrl'>
                                    <button type='submit' class='btn btn-link' style='padding:0;'> . . . </button>
                                </form>
                            </td>
                            <td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>";
                }

                foreach ($list as $item) {
                    $downloadUrl = $syno->download(array('method' => 'download', 'version' => 2, 'mode' => '"download"'), $item->path);

                    if (substr($item->name, 0, 1) !== "#") {
                        $owner = $item->additional->owner->user;
                        $info = json_encode($item);

                        if ($item->isdir) {
                            $type = "folder";

                            echo "
                                <tr>
                                    <td><img src='assets/images/folder.png' class='icon'/></i></td>
                                    <!--<td><a href='#' onclick=\"openFolder('$item->path');\">$item->name</a></td>-->
                                    <td>
                                        <form method='post'>
                                            <input type='hidden'  id='open' name='open' value='$item->path'>
                                            <button type='submit' class='btn btn-link' style='padding:0;'>$item->name</button>
                                        </form>
                                    </td>
                                    <td>$type</td>
                                    <td></td>";
                        } else {
                            $type = "bestand";
                            $isMSOfficeDocument = IsMSOfficeDocument($item->additional->type);
                            $size = calculateBytes($item->additional->size);

                            if ($isMSOfficeDocument != false) {
                                if ($isMSOfficeDocument == "excel") {
                                    $openUrl = "ms-excel:ofe|u|http://192.168.5.220:5005$item->path";

                                } else if ($isMSOfficeDocument == "word") {
                                    $openUrl = "ms-word:ofe|u|http://192.168.5.220:5005$item->path";
                                } else if ($isMSOfficeDocument == "powerpoint") {
                                    $openUrl = "ms-powerpoint:ofe|u|http://192.168.5.220:5005$item->path";
                                }
                            } else {
                                $openUrl = $syno->download(array('method' => 'download', 'version' => 2, 'mode' => '"open"'), $item->path);
                            }

                            echo "
                                <tr>
                                    <td><img src='assets/images/file.png' class='icon'/></td>
                                    <td><a href='$openUrl'>$item->name</a></td>
                                    <td>$type</td>
                                    <td>$size</td>";
                        }

                        echo "  <td>$owner</td>
                                <td>
                                    <form action='info.php' method='post'>
                                        <input type='hidden' name='item' value='$info'/>
                                        <button type='submit' class='btn btn-link' style='padding:0;'><img src='assets/images/info.png' class='icon'/></button>
                                    </form>
                                </td>
                                <td><a href='$downloadUrl'><img src='assets/images/download.png' class='icon'/></a></td>
                                <td><a href='delete.php?path=$item->path' onclick=\"return  confirm('Weet je zeker dat je $item->name wilt verwijderen?')\"><img src='assets/images/delete.png' class='icon'/></a></td>
                                <td>".(($item->isdir) ? '' : '<a href="link.php"><img src="assets/images/link.png" class="icon"/></a>')."</td></tr>";
                    }
                }
                ?>
            </table>
            <br/>
            <div style="border: #000 1px solid; height: 1px;" class="container-fluid"></div>
            <br/>

            <form action="http://192.168.5.220:5000/webapi/entry.cgi?_sid=<?php echo $syno->sid; ?>"
                  enctype="multipart/form-data"
                  method="POST">
                <h3>Uploaden naar de map <?php echo substr($path, strrpos($path, '/') + 1); ?></h3>
                <br/>
                <div class="custom-file" style="width: 350px;">
                    <input type="hidden" name="api" value="SYNO.FileStation.Upload">
                    <input type="hidden" name="version" value="2">
                    <input type="hidden" name="method" value="upload">
                    <input type="hidden" name="path" value="<?php echo $path; ?>">
                    <input type="hidden" name="create_parents" value="true">
                    <input type="file" name="file" id="upload-photo">
                </div>
                <br/>
                <br/>
                <input type="submit" value="Uploaden" class="btn btn-primary">
            </form>
        </div>
    </body>
</html>
