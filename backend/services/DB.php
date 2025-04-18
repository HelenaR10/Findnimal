<?php

class DB {
    private $conn;
    
    public function __construct() {
        try {
            $this->conn = new PDO(
                "mysql:host=".DB_HOST.";port=".DB_PORT.";dbname=".DB_NAME, 
                DB_USER, 
                DB_PASSWORD, 
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ
                ]
            );
        } catch (PDOException $e) {
            throw new Exception("Error on conection: {$e->getMessage()}");
        }
    }

    public function request($sql, $data) {
        try {
            $stmt = $this->conn->prepare($sql);
            
            $stmt->execute($data);
    
            return $result = (stripos($sql, 'SELECT') === 0) ? $stmt->fetchAll() : $stmt;

        } catch (PDOException $e) {
            throw new Exception("Error on conection: {$e->getMessage()}");
        }
    }

    public function lastInsertId() {
        return $this->conn->lastInsertId();
    }
}
// class DB {
//     private $conn;

//     public function __construct() {
//         $this->conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT);

//         if ($this->conn->connect_errno) {
//             throw new Exception("Error on conection: {$this->conn->connect_error}");
//         }
//     }

//     public function request($sql, $type = '', ...$data) {
//         $stmt = $this->conn->prepare($sql);
        
//         if (!$stmt) {
//             throw new Exception("Error preparing the query: {$this->conn->error}");
//         }
        
//         $stmt->bind_param($type, ...$data);
//         $stmt->execute();

//         $result = (stripos($sql, 'SELECT') === 0) ? $stmt->get_result() : $stmt;

//         return $result;
//     }

//     public function __destruct() {
//         $this->conn->close();
//     }
// }