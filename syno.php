<?php

class Synology {
    private $username;
    private $password;
    private $protocol;
    private $hostname;
    private $port;
    private $https;
    private $session;
    public $sid = null;
    private $debug = false;
    private $curl;
    private $common_error_codes = array(
        100 => 'Unknown error',
        101 => 'Invalid parameters',
        102 => 'API does not exist',
        103 => 'Method does not exist',
        104 => 'This API version is not supported',
        105 => 'Insufficient user privilege',
        106 => 'Connection time out',
        107 => 'Multiple login detected',
        400 => 'Invalid parameter of file operation',
    );

    /**
     * Synology constructor.
     * @param string $username
     * @param string $password
     * @param string $protocol
     * @param string $hostname
     * @param int $port
     * @param bool $https
     * @param string $session
     * @throws Exception
     */
    function __construct($username = 'admin', $password = '', $protocol = 'http', $hostname = '192.168.5.220', $port = 5000, $https = false, $session = 'FileStation') {
        $this->username = $username;
        $this->password = $password;
        $this->protocol = $protocol;
        $this->hostname = $hostname;
        $this->port = $port;
        $this->https = $https;
        $this->session = $session;
        if (!function_exists('curl_init')) {
            throw new Exception('php cURL extension must be installed and enabled');
        }
        $this->curl = curl_init();
        curl_setopt($this->curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($this->curl, CURLOPT_RETURNTRANSFER, 1);

        //login
        try {
            $this->Login();
        } catch (Exception $e) {
            echo "kon niet verbinden met het bestandssysteem.";
            die;
        }
        //var_dump($this->download());
        //var_dump($this->getThumb());
        //var_dump($this->checkPermission());
        //print_r($this->coreUser());
        //print_r($this->Info());
    }

    function __destruct() {
        $this->Logout();
    }

    public function _request($path, $api, $params = array()) {
        $params = array_merge(array(
            'api' => $api,
            'version' => 1,
            '_sid' => '"'.$this->sid.'"',
        ), $params);
        $url = ($this->https ? 'https' : 'http') . '://' . $this->hostname . ':' . $this->port . '/webapi/' . $path . '?' . http_build_query($params);
        curl_setopt($this->curl, CURLOPT_URL, $url);
        if ($this->debug) echo $url . "<br/>";
        $response = curl_exec($this->curl);
        $object = json_decode($response);

        //var_dump(curl_getinfo($this->curl, CURLINFO_HTTP_CODE));
        //echo "</br>";
        //Common error
        if ($object != null) {
            if (!$object->success && array_key_exists($object->error->code, $this->common_error_codes)) {
                echo $this->common_error_codes[$object->error->code]."</br>";
            }
        }

        return $response;
    }

    /**
     * @throws Exception
     */
    public function Login() {
        $response = json_decode($this->_request('auth.cgi', 'SYNO.API.Auth', array('account' => $this->username, 'passwd' => $this->password, 'method' => 'Login', 'version' => 3, 'format' => 'sid', 'session' => 'FileStation')));
        if ($response->success) {
            $this->sid = $response->data->sid;
        } else {
            throw new Exception('Could not login (Error code: ' . $response->error->code. ')');
        }
    }

    public function Logout() {
        $this->_request('auth.cgi', 'SYNO.API.Auth', array('method' => 'Logout'));
    }

    public function Info($query = 'SYNO.') {
        return $this->_request('query.cgi', 'SYNO.API.Info', array('query' => $query, 'method' => 'Query'));
    }

    public function FileStationInfo() {
        return $this->_request('entry.cgi', 'SYNO.FileStation.Info', array('method' => 'get', 'version' => 2));
    }

    public function GetList($params = array(), $path) {
        $params = array_merge(array(
            'folder_path' => $path,
        ), $params);
        return json_decode($this->_request('entry.cgi', 'SYNO.FileStation.List', $params));
    }

    public function GetFileInfo($path) {
        $params = array_merge(array(
            'version' => 2,
            'method' => 'getinfo',
            'additional' => '["real_path", "size", "owner", "time", "perm", "mount_point_type", "type"]',
            'path' => '["'.$path.'"]'
        ));
        return $this->_request('entry.cgi', 'SYNO.FileStation.List', $params);
    }

    public function download($params = array(), $filePath) {
        $params = array_merge(array(
            'api' => 'SYNO.FileStation.Download',
            '_sid' => '"'.$this->sid.'"',
            'path' => $filePath,
        ), $params);
        return ($this->https ? 'https' : 'http') . '://' . $this->hostname . ':' . $this->port . '/webapi/entry.cgi?' . http_build_query($params);
    }

    public function rename($filePath, $name) {
        $params = array_merge(array(
            'version' => 2,
            'method' => 'rename',
            'path' => '["'.$filePath.'"]',
            'name' => '["'.$name.'"]'
        ));
        return json_decode($this->_request('entry.cgi', 'SYNO.FileStation.Rename', $params));
    }

    function upload() {
        $filename = $_FILES['file']['name'];
        $filedata = $_FILES['file']['tmp_name'];
        $data = array ( "api" => 'SYNO.FileStation.Upload',
            "version" => "2",
            "method" => "upload",
            "path" => $_POST['path'],
            "create_parents" => 'true',
            'file' => curl_file_create($filedata, $_FILES['file']['type'], $filename),
            "filename" => $filename);

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "http://192.168.5.220:5000/webapi/entry.cgi?_sid=$this->sid");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array("Content-Type:multipart/form-data"));
        $response = json_decode(curl_exec($ch));
        if ($response->success == false) {
            if ($response->error->code == "414") echo "<p class='error'>Het bestand bestaat al.</p>";
        }
        curl_close($ch);
    }

    function createFolder($path, $name) {
        $params = array_merge(array(
            'version' => 2,
            'method' => 'create',
            'folder_path' => '["'.$path.'"]',
            'name' => '["'.$name.'"]'
        ));
        return json_decode($this->_request('entry.cgi', 'SYNO.FileStation.CreateFolder', $params));
    }
}