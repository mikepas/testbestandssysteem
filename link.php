<?php
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://192.168.5.220:5005/test/childtest/grandchildtest/tekst2site.docx");
curl_setopt($ch, CURLOPT_USERPWD, implode(':', array('opendocument','Power123')));
curl_setopt($ch, CURLOPT_HEADER, 1);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 'http://google.com');
curl_exec($ch);
var_dump(curl_getinfo($ch,CURLINFO_EFFECTIVE_URL));
curl_close($ch);
