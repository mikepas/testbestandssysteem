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