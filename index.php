<?php
/*
error_reporting(0);

require('webdav_client.php');

$wdc = new webdav_client();
$wdc->set_server('192.168.5.220');
$wdc->set_port(5005);
$wdc->set_user('admin');
$wdc->set_pass('');
// use HTTP/1.1
$wdc->set_protocol(1);
// enable debugging
$wdc->set_debug(false);


if (!$wdc->open()) {
    print 'Error: could not open server connection';
    exit;
}

// check if server supports webdav rfc 2518
if (!$wdc->check_webdav()) {
    print 'Error: server does not support webdav or user/password may be wrong';
    exit;
}

$dir = $wdc->ls('/test');
//print_r($dir);

//$http_status = $wdc->get('/test/childtest/grandchildtest/tekst2site.docx', $buffer);
//print 'webdav server returns ' . $http_status . '. Buffer is filled with ' . strlen($buffer). ' Bytes.<br>';
*/

require_once('syno.php');

$syno = new Synology();

$path = "/test";
if (isset($_POST['open']) && $_POST['open'] != null) $path = $_POST['open'];
unset($_POST);
$backUrl = substr($path, 0, strrpos($path, "/"));
?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
        <script src="assets/js/fa-solid.js"></script>
        <script src="assets/js/fontawesome.js"></script>
        <title>testbestandssysteem</title>
    </head>
    <body>
        <div class="container">
            <div class="row">
                <div class="col-md-9">
                    <h1>Testomgeving bestandssysteem</h1>
                </div>
                <div class="col-md-3">
                    <button onclick="window.location.reload(true);" class="btn btn-success float-right" style="margin: 10px;">
                        <i class="fas fa-sync"></i>
                    </button>
                    <button class="btn btn-primary float-right" style="margin: 10px;">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
            </div>
            <a href="ms-word:ofe|u|http://192.168.5.220:5005/test/childtest/grandchildtest/tekst2site.docx">test</a>
            <br/>
            <!--<table class="table">
                <th>Filename</th><th>Size</th><th>Creationdate</th><th>Resource Type</th><th>Content Type</th><th>Activelock Depth</th><th>Activelock Owner</th><th>Activelock Token</th><th>Activelock Type</th>
                <?php
                /*foreach($dir as $e) {
                    $ts = $wdc->iso8601totime($e['creationdate']);
                    $line = sprintf('<tr><td>%s&nbsp;</td><td>%s&nbsp;</td><td>%s&nbsp;</td><td>%s&nbsp;</td><td>%s&nbsp;</td><td>%s&nbsp;</td><td>%s&nbsp;</td><td>%s&nbsp;</td><td>%s&nbsp;</td></tr>',
                        $e['href'],
                        $e['getcontentlength'],
                        date('d.m.Y H:i:s',$ts),
                        $e['resourcetype'],
                        $e['getcontenttype'],
                        $e['activelock_depth'],
                        $e['activelock_owner'],
                        $e['activelock_token'],
                        $e['activelock_type']
                    );
                    print urldecode($line);
                }*/
                ?>
            </table>-->
            <div><h4 style="text-align: center;"><?php echo ltrim($path, "/"); ?></h4></div>
            <table class="table">
                <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Size</th>
                    <th>Owner</th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                </tr>
                <?php
                if ($path != "/test") echo "<tr><td><a style='cursor: pointer;' onclick=\"openFolder('$backUrl');\"><i class='fas fa-arrow-left fa-lg'></i></a></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>";

                $list = $syno->GetList( array('method' => 'list', 'version' => 2, 'sort_by' => 'type', 'additional' => '["real_path", "size", "owner", "time", "perm", "mount_point_type", "type"]'), $path)->data->files;

                foreach ($list as $item) {
                    if (substr($item->name, 0, 1) !== "#") {
                        $owner = $item->additional->owner->user;
                        $info = json_encode($item);

                        if ($item->isdir) {
                            $type = "folder";

                            echo "
                                <tr>
                                    <td><i class='fas fa-folder-open fa-lg'></i></td>
                                    <td><a href='#' onclick=\"openFolder('$item->path');\">$item->name</a></td>
                                    <td>$type</td>
                                    <td></td>";
                        } else {
                            $type = "bestand";
                            $openInOffice = false;
                            $openUrl = "#";

                            $bytes = $item->additional->size;
                            $size = array('bytes','kB','MB','GB','TB','PB','EB','ZB','YB');
                            $factor = floor((strlen($bytes) - 1) / 3);
                            $size = sprintf("%.2f", $bytes / pow(1024, $factor)) . " " . @$size[$factor];

                            $officeExtensions = ['docx', 'xls'];
                            if (in_array(pathinfo($item->name, PATHINFO_EXTENSION), $officeExtensions)) $openInOffice = true;

                            if (!$openInOffice) {
                                $openUrl = $syno->download('entry.cgi', 'SYNO.FileStation.Download', array('method' => 'download', 'version' => 2, 'mode' => '"open"'), $item->path);
                            }

                            echo "
                                <tr>
                                    <td><i class='fas fa-file fa-lg'></i></td>
                                    <td><a href='$openUrl' onclick='edit(\"$path\", \"$item->name\", this)'>$item->name</a></td>
                                    <td>$type</td>
                                    <td>$size</td>";
                        }

                        $downloadUrl = $syno->download('entry.cgi', 'SYNO.FileStation.Download', array('method' => 'download', 'version' => 2, 'mode' => '"download"'), $item->path);

                        echo "  <td>$owner</td>
                                <td>
                                    <form action='info.php' method='post'>
                                        <input type='hidden' name='item' value='$info'/>
                                        <button type='submit' class='btn btn-link' style='padding:0px;'>Info</button>
                                    </form>
                                </td>
                                <td><a href='$downloadUrl'>Download</a></td>
                                <td><a href='delete.php?path=$item->path' onclick=\"return  confirm('Weet je zeker dat je $item->name wilt verwijderen?')\">Delete</a></td>
                                <td><a href='#'>Link</a></td></tr>";
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
                <h2>Uploaden naar <?php echo ltrim($path, "/"); ?></h2>
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

            <form method="post" name="redirect" id="redirect">
                <input type="hidden" id="open" name="open" value="">
                <input type="submit" style="display: none;">
            </form>
        </div>

        <script type="text/javascript" src="ITHitWebDAVClient.js" ></script>
        <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
        <script src="assets/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
        <script type="text/javascript">
            function openFolder(path) {
                document.getElementById("open").value = path;
                console.log(document.getElementById("open").value);
                document.getElementById("redirect").submit();
            }

            function edit(path, filename, event) {
                var filePath = path + "/" + filename;

                //ITHit.WebDAV.Client.DocManager.DavProtocolEditDocument(
                    //filePath,                                 // Document URL(s)
                    //path,                                     // Mount URL
                    //errorCallback(),                          // Function to call if protocol app is not installed
                    //null,                                     // Reserved
                    //'Current',                                // Which browser to copy cookies from: 'Current', 'All', 'None'
                    //'.AspNet.ApplicationCookie',              // Cookie(s) to copy.
                    //'/',                                      // URL to navigate to if any cookie from the list is not found.
                    //'Edit'                                    // Command to execute: 'Edit', 'OpenWith'
                //);

                //var sDocumentUrl = "http://192.168.5.220:5005" + path;
                //var ns = ITHit.WebDAV.Client;
                //var oNs = ITHit.WebDAV.Client.DocManager;
                //var session = new ns.WebDavSession();
                //console.log(session);
                //if (oNs.IsMicrosoftOfficeDocument(sDocumentUrl)) {
                    //oNs.MicrosoftOfficeEditDocument(sDocumentUrl, errorCallback());
                //} else {
                    //oNs.DavProtocolEditDocument(sDocumentUrl, null, errorCallback());
                //}

                let href = window.location.href;
                if (!href.indexOf("#")) {
                    href += "#";
                }
                if (href !== event.href) return;

                ITHit.WebDAV.Client.DocManager.EditDocument("http://192.168.5.220:5005" + filePath, "http://192.168.5.220:5005/", errorCallback);
            }

            function errorCallback() {
                //let installerFilePath = "Plugins/" + ITHit.WebDAV.Client.DocManager.GetInstallFileName();

                //if (confirm("Opening this type of file requires a protocol installation. Select OK to download the protocol installer.")){
                    //window.open(installerFilePath);
                //}
            }
        </script>
    </body>
</html>
