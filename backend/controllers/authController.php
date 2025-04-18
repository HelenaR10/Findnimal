<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1); 

require __DIR__.'/../config/config.php';

$data = json_decode(file_get_contents('php://input'));

switch ($data->endpoint) {

    case 'login':

        $email = (filter_var($data->email, FILTER_VALIDATE_EMAIL)) ? $data->email : sendHttpError(400);
        $password = (($data->password = strip_tags($data->password)) && preg_match(VALIDATION_PASSWORD_REGEX, $data->password)) ? $data->password : sendHttpError(400);

        $db = new DB();
        
        $sql = "SELECT id, name, email, password FROM users WHERE email = :email";
        $res = $db->request($sql, ['email' => $data->email]);
        $user = $res[0] ?? null;

        if ($user) {
            $isPasswordValid = password_verify($password, $user->password) ? $user->password : sendHttpError(400, 'invalid user');
        }

        $jwtData = [
            'id' => $user->id, 
            'name' => $user->name,
            'email' => $email,
        ];
        
        sendHttpSuccess(['name' => $user->name, 'email' => $email, 'token' => generateTokenJWT($jwtData)]);

        break;

    case 'register':

        //crear middleware
        $email = (filter_var($data->email, FILTER_VALIDATE_EMAIL)) ? $data->email : sendHttpError(400);
        $password = (($data->password = strip_tags($data->password)) && preg_match(VALIDATION_PASSWORD_REGEX, $data->password)) ? password_hash($data->password, PASSWORD_DEFAULT) : sendHttpError(400);
        $phone = (preg_match(VALIDATION_PHONE_REGEX, $data->phone)) ? $data->phone : sendHttpError(400);
        $name = strip_tags($data->name);
        $surname = strip_tags($data->surname);
        // ***************************************

        $db = new DB();
        
        $sql = 'SELECT EXISTS(SELECT email FROM users WHERE email = :email) AS userExists';
        $res = $db->request($sql, ['email' => $data->email]);

        $user = $res[0] ?? null;

        $userExists = !empty($user->userExists);
        
        if ($userExists) {
            sendHttpError(500, 'error on register');
        }

        $sql = 'INSERT INTO users (name, surname, phone, email, password) VALUES (:name, :surname, :phone, :email, :password)';
        $res = $db->request($sql, ['name' => $name, 'surname' => $surname, 'phone' => $phone, 'email' => $email, 'password' => $password]);
        
        if ($res) {
            $userId = $db->lastInsertId();

            $jwtData = [
                'id' => $userId,
                'name' => $name,
                'email' => $email,
            ];
            
            sendHttpSuccess(['name' => $name, 'email' => $email, 'token' => generateTokenJWT($jwtData)]);
        }   
        
        break;
}