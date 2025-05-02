<?php

require __DIR__.'/../config/config.php';

$data = json_decode(file_get_contents('php://input'));

if ($data && isset($data->endpoint)) {
    
    switch ($data->endpoint) {
        case 'getSpeciesAndBreedsData':
            
            $db = new DB();

            $sql = "SELECT
                    b.id AS breed_id,
                    b.name AS breed_name,
                    s.id AS specie_id,
                    s.name AS specie_name
                    FROM breeds b
                    JOIN species s ON s.id = specie_id";

            $data = $db->request($sql);

            sendHttpSuccess($data);

            break;

        case 'getProfileData':

            $jwtData = decodeTokenJWT();

            $db = new DB();

            $userId = (is_integer($jwtData->data->id)) ? $jwtData->data->id : null;

            $sql = "SELECT
                    u.name AS user_name,
                    u.surname,
                    u.phone,
                    u.location,
                    u.image AS user_image,
                    u.role,
                    a.specie_id,
                    a.id AS animal_id
                    FROM users u
                    JOIN animals a ON a.user_id = u.id
                    WHERE u.id = :id
                    GROUP BY a.id
                    ORDER BY a.name";

            $user = $db->request($sql, ['id' => $userId]);
            $userData = [];

            $dogsCount = 0;
            $catsCount = 0;
            $exoticsCount = 0;

            foreach ($user as $data) {
                $userDataExists = !empty($userData);

                switch ($data->specie_id) {
                    case 1:
                        $dogsCount++;
                        break;
                    case 2:
                        $catsCount++;
                        break;
                    case 3:
                        $exoticsCount++;
                        break;
                }
                
                if (!$userDataExists) {
                    $userData = [
                        'email' => $jwtData->data->email,
                        'userName' => $data->user_name,
                        'surname' => $data->surname,
                        'location' => $data->location,
                        'phone' => $data->phone,
                        'image' => $data->user_image,
                        'role' => $data->role,
                        'dogsCount' => 0,
                        'exoticsCount' => 0,
                        'catsCount' => 0,
                        'animals' => [],
                    ];
                }

                $userData['animals'][] = [
                    'id' => $data->animal_id,
                    'specie' => $data->specie_id,
                ];

                $userData['dogsCount'] = $dogsCount;
                $userData['catsCount'] = $catsCount;
                $userData['exoticsCount'] = $exoticsCount;
            }
            
            sendHttpSuccess($userData);
            
            break;

           case 'getAllPosts':
            
            $jwtData = decodeTokenJWT();

            $db = new DB();

            $userId = (is_integer($jwtData->data->id)) ? $jwtData->data->id : null;

            $sql = "SELECT
                    p.id AS post_id,
                    p.user_id,
                    a.id AS animal_id,
                    a.specie_id AS specie_id,
                    a.breed_id AS breed_id,
                    a.name,
                    a.age,
                    a.sex,
                    a.description,
                    a.animal_image
                    FROM posts p
                    LEFT JOIN animals a ON p.animal_id = a.id
                    WHERE p.user_id = :id
                    ORDER BY p.id";

            $data = $db->request($sql, ['id' => $userId]);

            sendHttpSuccess($data);
            break;

            case 'deletePost':
                $animalId = $data->animalId;

                $db = new DB();

                $sql = "DELETE FROM animals WHERE id = :id";

                $data = $db->request($sql, ['id' => $animalId]);

                sendHttpSuccess();

                break;
    }  
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['endpoint'])) {

    switch ($_POST['endpoint']) {

        case 'createPost':
            $jwtData = decodeTokenJWT();
            $userId = (is_integer($jwtData->data->id)) ? $jwtData->data->id : null;

            $db = new DB();

            $name = filter_var($_POST['name']) ?? null;
            $breedId = $_POST['breed'] ?? null;
            $specieId = $_POST['specie'] ?? null;
            $age = $_POST['age'] ?? null;
            $sex = $_POST['sex'] ?? null;
            $description = filter_var($_POST['description']) ?? null;

            try {
                if (!isset($_FILES['image']) && $_FILES['image']['error'] !== 0) { 
                    sendHttpError(400);
                }

                 // Variables de la imagen
                $fileTmpPath = $_FILES['image']['tmp_name'];
                $fileName = $_FILES['image']['name'];
                $fileType = $_FILES['image']['type'];

                $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
                $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

                $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

                $finfo = finfo_open(FILEINFO_MIME_TYPE);
                $mimeTypeDetected = finfo_file($finfo, $fileTmpPath);
                finfo_close($finfo);

                if (!in_array($fileExtension, $allowedExtensions) || !in_array($mimeTypeDetected, $allowedMimeTypes)) {
                    throw new Exception("Formato de imagen no permitido.");
                }

                    // Preparar el nombre final de la imagen
                $imageName = uniqid() . '_' . $fileName;
                $uploadDir = $_SERVER['DOCUMENT_ROOT'] . '/findnimal/storage/';
                $imagePath = $uploadDir . $imageName;

                $sql = "INSERT INTO animals (user_id, breed_id, specie_id, name, age, sex, description, animal_image) 
                        VALUES (:user_id, :breed_id, :specie_id, :name, :age, :sex, :description, :animal_image)";
                
                $params = $db->request($sql, [
                    'user_id' => $userId,
                    'breed_id' => $breedId, 
                    'specie_id' => $specieId, 
                    'name' => $name, 
                    'age' => $age, 
                    'sex' => $sex, 
                    'description' => $description, 
                    'animal_image' => $imageName
                ]);
                
                $animalId = $db->lastInsertId();

                $sql = "INSERT INTO posts (user_id, animal_id) VALUES (:user_id, :animal_id)";
                $result = $db->request($sql, ['user_id' => $userId, 'animal_id' => $animalId]);

                $postId = $db->lastInsertId();
                
                if (!move_uploaded_file($fileTmpPath, $imagePath)) {
                    throw new Exception('Error al mover la imagen al servidor.');
                }

                $postData = [
                    'id' => $postId,
                    'user_id' => $userId,
                    'animalData' => [
                        'name' => $name, 
                        'specie_id' => $specieId, 
                        'breed_id' => $breedId, 
                        'sex' => $sex, 
                        'age' => $age, 
                        'description' => $description, 
                        'animal_image' => $imageName
                    ]
                ];

                if ($result->rowCount() !== false) {
                    sendHttpSuccess($postData);
                } else {
                    sendHttpError(500);
                }
            
            } catch (\Throwable $th) {
                sendHttpError(500, $th->getMessage());
            }
    
            break;

        case 'editPost':
            $jwtData = decodeTokenJWT();
            $userId = (is_integer($jwtData->data->id)) ? $jwtData->data->id : null;

            $db = new DB();
            $postId = ($_POST['postId']);
            $animalId = ($_POST['animalId']);
            $animalImageName = ($_POST['animalImageName']);
            $name = filter_var($_POST['name']) ?? null;
            $breedId = $_POST['breed'] ?? null;
            $specieId = $_POST['specie'] ?? null;
            $age = $_POST['age'] ?? null;
            $sex = $_POST['sex'] ?? null;
            $description = filter_var($_POST['description']) ?? null;

            try {
                $oldImagePath = $_SERVER['DOCUMENT_ROOT'] . "/findnimal/storage/$animalImageName";
                $imageName = null;

                if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) { 

                    if (file_exists($oldImagePath)) {
                        unlink($oldImagePath);
                    }

                    // Variables de la imagen
                    $fileTmpPath = $_FILES['image']['tmp_name'];
                    $fileName = $_FILES['image']['name'];
                    $fileType = $_FILES['image']['type'];

                    $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
                    $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

                    $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

                    $finfo = finfo_open(FILEINFO_MIME_TYPE);
                    $mimeTypeDetected = finfo_file($finfo, $fileTmpPath);
                    finfo_close($finfo);

                    if (!in_array($fileExtension, $allowedExtensions) || !in_array($mimeTypeDetected, $allowedMimeTypes)) {
                        throw new Exception("Formato de imagen no permitido.");
                    }

                        // Preparar el nombre final de la imagen
                    $imageName = uniqid() . '_' . $fileName;
                    $uploadDir = $_SERVER['DOCUMENT_ROOT'] . '/findnimal/storage/';
                    $imagePath = $uploadDir . $imageName;

                    if (!move_uploaded_file($fileTmpPath, $imagePath)) {
                        throw new Exception('Error al mover la imagen al servidor.');
                    }
                }

                $sql = "UPDATE animals SET user_id = :user_id, 
                                           breed_id = :breed_id, 
                                           specie_id = :specie_id, 
                                           name = :name,
                                           age = :age,
                                           sex = :sex,
                                           description = :description";
                
                $params = [
                    'animal_id' => $animalId,
                    'user_id' => $userId,
                    'breed_id' => $breedId, 
                    'specie_id' => $specieId, 
                    'name' => $name, 
                    'age' => $age, 
                    'sex' => $sex, 
                    'description' => $description
                ];

                if ($imageName) {
                    $sql .= ", animal_image = :animal_image";
                    $params['animal_image'] = $imageName;
                }

                $sql .= " WHERE id = :animal_id";

                $result = $db->request($sql, $params);

                $postData = [
                    'id' => $postId,
                    'user_id' => $userId,
                    'animalData' => [
                        'name' => $name, 
                        'specie_id' => $specieId, 
                        'breed_id' => $breedId, 
                        'sex' => $sex, 
                        'age' => $age, 
                        'description' => $description,
                        'animal_image' => $imageName ?? $animalImageName
                    ]
                ];

                if ($result->rowCount() !== false) {
                    sendHttpSuccess($postData);
                } else {
                    sendHttpError(500);
                }
                
            } catch (\Throwable $th) {
                sendHttpError(500, $th->getMessage());
            }
    
            break;

        case 'editProfile':
            $jwtData = decodeTokenJWT();
            $userId = (is_integer($jwtData->data->id)) ? $jwtData->data->id : null;

            $db = new DB();

            $email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL) ? $_POST['email'] : null;
            $name = filter_var($_POST['name']) ?? null;
            $surname = filter_var($_POST['surname']) ?? null;
            $phone = preg_match(VALIDATION_PHONE_REGEX, $_POST['phone']) ? $_POST['phone'] : null;
            $location = filter_var($_POST['location']) ?? null;
            $role = is_numeric($_POST['role']) ? (int)$_POST['role'] : null;
            $userImage = ($_POST['userImage']);

            try {
                $oldImagePath = $_SERVER['DOCUMENT_ROOT'] . "/findnimal/storage/user/$userImage";
                $imageName = null;
                $password = null;

                if (!empty($_POST['password']) && preg_match(VALIDATION_PASSWORD_REGEX, $_POST['password'])) {
                    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
                }

                if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) { 

                    if (file_exists($oldImagePath)) {
                        unlink($oldImagePath);
                    }

                    // Variables de la imagen
                    $fileTmpPath = $_FILES['image']['tmp_name'];
                    $fileName = $_FILES['image']['name'];
                    $fileType = $_FILES['image']['type'];

                    $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
                    $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

                    $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

                    $finfo = finfo_open(FILEINFO_MIME_TYPE);
                    $mimeTypeDetected = finfo_file($finfo, $fileTmpPath);
                    finfo_close($finfo);

                    if (!in_array($fileExtension, $allowedExtensions) || !in_array($mimeTypeDetected, $allowedMimeTypes)) {
                        throw new Exception("Formato de imagen no permitido.");
                    }

                        // Preparar el nombre final de la imagen
                    $imageName = uniqid() . '_' . $fileName;
                    $uploadDir = $_SERVER['DOCUMENT_ROOT'] . '/findnimal/storage/user/';
                    $imagePath = $uploadDir . $imageName;
                    
                    if (!move_uploaded_file($fileTmpPath, $imagePath)) {
                        throw new Exception('Error al mover la imagen al servidor.');
                    }
                }

                $sql = "UPDATE users SET email = :email,
                                        name = :name,
                                        surname = :surname, 
                                        phone = :phone,
                                        location = :location,
                                        role = :role";
                
                $params = [
                    'user_id' => $userId,
                    'email' => $email,
                    'name' => $name, 
                    'surname' => $surname, 
                    'phone' => $phone, 
                    'location' => $location, 
                    'role' => $role
                ];

                if ($imageName) {
                    $sql .= ", image = :user_image";
                    $params['user_image'] = $imageName;
                }

                if ($password !== null) {
                    $sql .= ", password = :password";
                    $params['password'] = $password;
                }

                $sql .= " WHERE id = :user_id";

                $result = $db->request($sql, $params);

                $user = [
                    'user_id' => $userId,
                    'userData' => [
                        'email' => $email, 
                        'name' => $name, 
                        'surname' => $surname, 
                        'phone' => $phone, 
                        'location' => $location, 
                        'role' => $role,
                        'user_image' => $imageName ?? $userImage
                    ]
                ];

                if ($result->rowCount() !== false) {
                    sendHttpSuccess($user);
                } else {
                    sendHttpError(500);
                }
                
            } catch (\Throwable $th) {
                sendHttpError(500, $th->getMessage());
            }
    
            break;
    }
}