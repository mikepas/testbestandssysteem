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
            echo "login failed";
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
                //echo $this->common_error_codes[$object->error->code]."</br>";
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

    public function GetList($params = array(), $path) {
        $params = array_merge(array(
            'folder_path' => $path,
        ), $params);
        return json_decode($this->_request('entry.cgi', 'SYNO.FileStation.List', $params));
    }

    public function FileStationInfo() {
        return $this->_request('entry.cgi', 'SYNO.FileStation.Info', array('method' => 'get', 'version' => 2));
    }

    public function coreUser() {
        return json_decode($this->_request('entry.cgi', 'SYNO.FileStation.UserGrp', array('method' => 'get', 'version' => 1)));
    }

    public function getThumb() {
        return $this->_request('entry.cgi', 'SYNO.FileStation.Thumb', array('method' => 'get', 'version' => 2, 'path' => '"/test/childtest/Logo_feetfirstson.png"'));
    }

    public function checkPermission() {
        return json_decode($this->_request('entry.cgi', 'SYNO.FileStation.CheckPermission', array('method' => 'write', 'version' => 3, 'path' => '"/test"', 'filename' => '"test.zip"', 'overwrite' => 'true')));
    }

    public function download($path, $api, $params = array(), $filePath) {
        $params = array_merge(array(
            'api' => $api,
            'version' => 1,
            '_sid' => '"'.$this->sid.'"',
            'path' => $filePath,
        ), $params);
        return ($this->https ? 'https' : 'http') . '://' . $this->hostname . ':' . $this->port . '/webapi/' . $path . '?' . http_build_query($params);
    }
}