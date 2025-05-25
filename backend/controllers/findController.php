<?php

require __DIR__.'/../config/config.php';

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$data = json_decode(file_get_contents('php://input'));

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['endpoint'])) {

    switch ($_POST['endpoint']) {

        case 'saveAnimalUserData':
            $jwtData = decodeTokenJWT();
            $db = new DB();

            // Datos del animal
            $specieId = $_POST['specie'];
            $breedId = $_POST['breed'];
            $hairColor = $_POST['hair'];
            $eyesColor = $_POST['eyes'];
            $size = $_POST['size'];
            $age = $_POST['age'];
            $sex = $_POST['sex'];
            $identification = $_POST['identification'];
            $description = strip_tags($_POST['description']);

            // Manejo de imagen
            if (!isset($_FILES['image']) || $_FILES['image']['error'] !== 0) {
                sendHttpError(400, 'Imagen requerida');
            }

            $fileTmpPath = $_FILES['image']['tmp_name'];
            $fileName = $_FILES['image']['name'];
            $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

            $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
            $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            $mimeTypeDetected = finfo_file($finfo, $fileTmpPath);
            finfo_close($finfo);

            if (!in_array($fileExtension, $allowedExtensions) || !in_array($mimeTypeDetected, $allowedMimeTypes)) {
                sendHttpError(400, 'Formato de imagen no permitido');
            }

            $imageName = uniqid() . '_' . $fileName;
            $uploadDir = $_SERVER['DOCUMENT_ROOT'] . '/findnimal/storage/';
            $imagePath = $uploadDir . $imageName;

            // Insertar usuario si no está autenticado
            if ($jwtData === null) {
                $name = strip_tags($_POST['name']);
                $surname = strip_tags($_POST['surname']);
                $email = (filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) ? $_POST['email'] : sendHttpError(400);
                $phone = (preg_match(VALIDATION_PHONE_REGEX, $_POST['phone'])) ? $_POST['phone'] : sendHttpError(400);

                $insertUser = $db->request(
                    "INSERT INTO users (name, surname, email, phone, role, password) VALUES (:name, :surname, :email, :phone, :role, :password)",
                    [
                        'name' => $name,
                        'surname' => $surname,
                        'email' => $email,
                        'phone' => $phone,
                        'role' => 1,
                        'password' => 'default'
                    ]
                );

                if (!$insertUser || $insertUser->rowCount() === 0) {
                    sendHttpError(500);
                }

                $userId = $db->lastInsertId();
                
            } else {
                $userId = $jwtData->data->id;
            }

            // Insertar animal
            $insertAnimal = $db->request(
                "INSERT INTO animals (user_id, breed_id, specie_id, hair_color, eye_color, size, age, sex, identification, description, animal_image, status)
                VALUES (:user_id, :breed_id, :specie_id, :hair, :eyes, :size, :age, :sex, :identification, :description, :animal_image, :status)",
                [
                    'user_id' => $userId,
                    'breed_id' => $breedId,
                    'specie_id' => $specieId,
                    'hair' => $hairColor,
                    'eyes' => $eyesColor,
                    'size' => $size,
                    'age' => $age,
                    'sex' => $sex,
                    'identification' => $identification,
                    'description' => $description,
                    'animal_image' => $imageName,
                    'status' => 1,
                ]
            );

            $animalId = $db->lastInsertId();

            if (!move_uploaded_file($fileTmpPath, $imagePath)) {
                sendHttpError(500, 'Error al guardar imagen');
            }

            if (!$insertAnimal || $insertAnimal->rowCount() === 0) {
                sendHttpError(500);
            }

            $animalsFinded = $db->request("SELECT * FROM animals WHERE status = :status", ['status' => 2]);

            $matchedAnimalIds = [];

            foreach ($animalsFinded as $animal) {
                $match = calculateAnimalMatch($_POST, $animal);

                if ($match >= 80) {
                    $matchedAnimalIds[] = [
                        'userId' => $userId,
                        'animalId' => $animalId,
                        'animalMatchId' => $animal->id,
                        'userIdMatch' => $animal->user_id,
                        'percent' => $match
                    ];
                }
            }

            sendHttpSuccess([
                'match' => !empty($matchedAnimalIds),
                'matches' => $matchedAnimalIds
            ]);

            break;
    }
}

if ($data && isset($data->endpoint)) {
    
    switch ($data->endpoint) {
        case 'getMatchesData':

            $matches = $data->matches;
            $db = new DB();

            $matchesData = [];

            foreach ($matches as $match) {
                $sql = "SELECT a.name as animalName, a.specie_id, a.breed_id, a.sex, a.age, a.animal_image, u.name as userName, u.surname, u.email, u.phone 
                        FROM animals a
                        JOIN users u ON a.user_id = u.id
                        WHERE a.id = :id";

                $matchData = $db->request($sql, ['id' => $match->animalMatchId])[0];

                $sql = "SELECT
                    b.name AS breed,
                    s.name AS specie
                    FROM breeds b
                    LEFT JOIN species s ON b.specie_id = s.id
                    WHERE b.id = :breed_id";

                $specieBreed = $db->request($sql, ['breed_id' => $matchData->breed_id])[0];

                $matchesData[] = [
                    'animalId' => $match->animalId,
                    'animalMatchId' => $match->animalMatchId,
                    'senderUserId' => $match->userId,
                    'animalName' => $matchData->animalName,
                    'specie' => $specieBreed->specie,
                    'breed' => $specieBreed->breed,
                    'sex' => SEX_MAP[$matchData->sex],
                    'age' => AGE_MAP[$matchData->age],
                    'animalImage' => $matchData->animal_image,
                    'userName' => $matchData->userName,
                    'userSurname' => $matchData->surname,
                    'userEmail' => $matchData->email,
                    'userPhone' => $matchData->phone
                ];
            }

            sendHttpSuccess($matchesData);
            break;
    }
}