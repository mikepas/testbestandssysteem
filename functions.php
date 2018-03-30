<?php

function calculateBytes($bytes)
{
    $size = array('b','kB','MB','GB','TB','PB','EB','ZB','YB');
    $factor = floor((strlen($bytes) - 1) / 3);
    return sprintf("%.2f", $bytes / pow(1024, $factor)) . " " . @$size[$factor];
}

function formatTime($time) {
    return date("d-m-Y\ H:i:s", $time);
}

function IsMSOfficeDocument($extention) {
    $officeExtensions = ['docx', 'doc', 'xls', 'csv', 'xlsx', 'ppt', 'pptx'];
    $fileType = strtolower($extention);

    if (in_array($fileType, $officeExtensions)) {
        if ($fileType == 'csv' || $fileType == 'xls' || $fileType == 'xlsx') {
            return "excel";
        } else if ($fileType == 'docx' || $fileType == 'doc') {
            return "word";
        } else if ($fileType == 'ppt' || $fileType == 'pptx') {
            return "powerpoint";
        }
    } else {
        return false;
    }
}

function ShowTable($root, $path, $syno, $list) {

    echo "<table class='table table-hover'>
            <thead>
                <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Size</th>
                    <th>Owner</th>
                    <th></th>
                    <th></th>
                    <th>
                        <a href='new-folder.php?path=$path' class='btn btn-link new-folder'><img src='assets/images/new_folder.png' class='icon'/></a>
                    </th>
                </tr>
            </thead>";

    if ($path != $root) {
        echo "<tr><td><img src='assets/images/folder.png' class='icon'/></td>
                <td>
                    <form method='post'>
                        <input type='hidden'  id='open' name='open' value='" . substr($path, 0, strrpos($path, '/')) . "'>
                        <button type='submit' class='btn btn-link' style='padding:0;'> . . . </button>
                    </form>
                </td>
                <td></td><td></td><td></td><td></td><td></td><td></td></tr>";
    }

    foreach ($list as $item) {
        $downloadUrl = $syno->download(array('method' => 'download', 'version' => 2, 'mode' => '"download"'), $item->path);

        if (substr($item->name, 0, 1) !== "#") {
            $owner = $item->additional->owner->user;

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
                    <td><a href='info.php?path=$item->path' style='padding:0;'><img src='assets/images/info.png' class='icon'/></a></td>
                    <td><a href='$downloadUrl'><img src='assets/images/download.png' class='icon'/></a></td>
                    <td><a href='delete.php?path=$item->path' onclick=\"return  confirm('Weet je zeker dat je $item->name wilt verwijderen?')\"><img src='assets/images/delete.png' class='icon'/></a></td></tr>";
        }
    }
    echo "</table>";
}