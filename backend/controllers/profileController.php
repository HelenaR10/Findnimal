<?php

require __DIR__.'/../config/config.php';
require_once __DIR__ . '/../services/StorageService.php';

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

            $userId = (is_numeric($jwtData->data->id)) ? $jwtData->data->id : null;

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
                    LEFT JOIN animals a ON a.user_id = u.id
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

            $userId = (is_numeric($jwtData->data->id)) ? $jwtData->data->id : null;

            $sql = "SELECT
                    p.id AS post_id,
                    p.user_id,
                    a.id AS animal_id,
                    a.specie_id AS specie_id,
                    a.breed_id AS breed_id,
                    a.name,
                    a.age,
                    a.sex,
                    a.hair_color,
                    a.eye_color,
                    a.size,
                    a.identification,
                    a.description,
                    a.animal_image
                    FROM posts p
                    LEFT JOIN animals a ON p.animal_id = a.id
                    WHERE p.user_id = :id
                    ORDER BY p.id";

            $data = $db->request($sql, ['id' => $userId]);

            $posts = [];

            foreach($data as $post) {

                $sql = "SELECT
                    b.name AS breed,
                    s.name AS specie
                    FROM breeds b
                    LEFT JOIN species s ON b.specie_id = s.id
                    WHERE b.id = :breed_id";

                $specieBreed = $db->request($sql, ['breed_id' => $post->breed_id])[0];

                $posts[] = [
                    'post_id' => $post->post_id,
                    'user_id' => $post->user_id,
                    'animal_id' => $post->animal_id,
                    'specie' => $specieBreed->specie,
                    'specie_id' => $post->specie_id,
                    'breed' => $specieBreed->breed,
                    'breed_id' => $post->breed_id,
                    'sex' => SEX_MAP[$post->sex],
                    'sex_id' => $post->sex,
                    'age' => AGE_MAP[$post->age],
                    'age_id' => $post->age,
                    'name' => $post->name,
                    'description' => $post->description,
                    'animal_image' => $post->animal_image,
                    'hair_color' => $post->hair_color,
                    'eye_color' => $post->eye_color,
                    'size' => $post->size,
                    'identification' => $post->identification
                ];
            }

            sendHttpSuccess($posts);
            break;

            case 'deletePost':
                $animalId = $data->animalId;

                $db = new DB();

                // Primero obtenemos la URL de la imagen
                $sql = "SELECT animal_image FROM animals WHERE id = :id";
                $animal = $db->request($sql, ['id' => $animalId])[0];

                // Eliminamos la imagen de Google Cloud Storage
                if ($animal && $animal->animal_image) {
                    $storageService = new StorageService();
                    $storageService->deleteFile($animal->animal_image, 'animals');
                }

                // Finalmente eliminamos el registro de la base de datos
                $sql = "DELETE FROM animals WHERE id = :id";
                $data = $db->request($sql, ['id' => $animalId]);

                sendHttpSuccess();
                break;
            
            case 'getMailBoxData':
            
                $jwtData = decodeTokenJWT();

                $db = new DB();

                $userId = (is_numeric($jwtData->data->id)) ? $jwtData->data->id : null;

                $sql = "SELECT id, sender_user_id, animal_id FROM notifications WHERE dest_user_id = :dest_user_id order by id";

                $notifications = $db->request($sql, ['dest_user_id' => $userId]);
                
                if (empty($notifications)) {
                    sendHttpSuccess([]);
                    return;
                }

                $mailBoxData = [];

                foreach ($notifications as $notification) {

                    $sql = "SELECT
                            u.name AS user_name,
                            u.surname,
                            u.phone,
                            u.email,
                            u.image AS user_image
                            FROM users u
                            WHERE u.id = :sender_user_id
                            ORDER BY u.name";
                    
                    $senderUserData = $db->request($sql, ['sender_user_id' => $notification->sender_user_id])[0];

                    $sql = "SELECT
                            a.name AS animal_name,
                            a.animal_image
                            FROM animals a
                            WHERE a.id = :animal_id
                            ORDER BY a.name";
                    
                    $animalData = $db->request($sql, ['animal_id' => $notification->animal_id])[0];

                    $mailBoxData[] = [
                        'notificationId' => $notification->id,
                        'senderName' => $senderUserData->user_name,
                        'senderSurname' => $senderUserData->surname,
                        'senderEmail' => $senderUserData->email,
                        'senderPhone' => $senderUserData->phone,
                        'senderImage' => $senderUserData->user_image,
                        'animalName' => $animalData->animal_name,
                        'animalImage' => $animalData->animal_image,
                    ];
                }
                
                sendHttpSuccess($mailBoxData);
                break;

            case 'deleteNotification':

                $notificationId = $data->notificationId;

                $db = new DB();

                $sql = "DELETE FROM notifications WHERE id = :id";

                $data = $db->request($sql, ['id' => $notificationId]);

                sendHttpSuccess();

                break;
    }  
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['endpoint'])) {

    switch ($_POST['endpoint']) {

        case 'createPost':
            $jwtData = decodeTokenJWT();
            $userId = (is_numeric($jwtData->data->id)) ? $jwtData->data->id : null;

            $db = new DB();

            $name = strip_tags($_POST['name']) ?? null;
            $breedId = $_POST['breed'] ?? null;
            $specieId = $_POST['specie'] ?? null;
            $hairColor = $_POST['hair'];
            $eyesColor = $_POST['eyes'];
            $size = $_POST['size'];
            $age = $_POST['age'] ?? null;
            $sex = $_POST['sex'] ?? null;
            $identification = $_POST['identification'];
            $description = strip_tags($_POST['description']) ?? null;

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

                $mimeTypeDetected = mime_content_type($fileTmpPath);

                if (!in_array($fileExtension, $allowedExtensions) || !in_array($mimeTypeDetected, $allowedMimeTypes)) {
                    throw new Exception("Formato de imagen no permitido.");
                }

                // Preparar el nombre final de la imagen
                $imageName = uniqid() . '_' . $fileName;
                
                // Subir la imagen a Google Cloud Storage
                $storageService = new StorageService();
                $imageUrl = $storageService->uploadFile($fileTmpPath, $imageName, 'animals');

                $sql = "INSERT INTO animals (user_id, name, breed_id, specie_id, hair_color, eye_color, size, age, sex, identification, description, animal_image, status)
                VALUES (:user_id, :name, :breed_id, :specie_id, :hair, :eyes, :size, :age, :sex, :identification, :description, :animal_image, :status)";
                
                $params = $db->request($sql, [
                    'user_id' => $userId,
                    'name' => $name,
                    'breed_id' => $breedId,
                    'specie_id' => $specieId,
                    'hair' => $hairColor,
                    'eyes' => $eyesColor,
                    'size' => $size,
                    'age' => $age,
                    'sex' => $sex,
                    'identification' => $identification,
                    'description' => $description,
                    'animal_image' => $imageUrl,
                    'status' => 2,
                ]);
                
                $animalId = $db->lastInsertId();

                $sql = "INSERT INTO posts (user_id, animal_id) VALUES (:user_id, :animal_id)";
                $result = $db->request($sql, ['user_id' => $userId, 'animal_id' => $animalId]);

                $postId = $db->lastInsertId();

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
                        'animal_image' => $imageUrl
                    ]
                ];

                if ($result->rowCount() !== 0) {
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
            $userId = (is_numeric($jwtData->data->id)) ? $jwtData->data->id : null;

            $db = new DB();
            $postId = ($_POST['postId']);
            $animalId = ($_POST['animalId']);
            $animalImageName = ($_POST['animalImageName']);
            $name = strip_tags($_POST['name']) ?? null;
            $breedId = $_POST['breed'] ?? null;
            $specieId = $_POST['specie'] ?? null;
            $age = $_POST['age'] ?? null;
            $sex = $_POST['sex'] ?? null;
            $description = strip_tags($_POST['description']) ?? null;

            try {
                $storageService = new StorageService();
                $imageUrl = $animalImageName; // Mantener la URL actual por defecto

                if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) { 
                    // Variables de la imagen
                    $fileTmpPath = $_FILES['image']['tmp_name'];
                    $fileName = $_FILES['image']['name'];
                    $fileType = $_FILES['image']['type'];

                    $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
                    $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

                    $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

                    $mimeTypeDetected = mime_content_type($fileTmpPath);

                    if (!in_array($fileExtension, $allowedExtensions) || !in_array($mimeTypeDetected, $allowedMimeTypes)) {
                        throw new Exception("Formato de imagen no permitido.");
                    }

                    // Preparar el nombre final de la imagen
                    $imageName = uniqid() . '_' . $fileName;
                    
                    // Subir la nueva imagen a Google Cloud Storage
                    $imageUrl = $storageService->uploadFile($fileTmpPath, $imageName, 'animals');
                    
                    // Eliminar la imagen anterior de Google Cloud Storage
                    if ($animalImageName) {
                        $storageService->deleteFile($animalImageName, 'animals');
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

                if ($imageUrl) {
                    $sql .= ", animal_image = :animal_image";
                    $params['animal_image'] = $imageUrl;
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
                        'animal_image' => $imageUrl
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
            $userId = (is_numeric($jwtData->data->id)) ? $jwtData->data->id : null;

            $db = new DB();

            $email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL) ? $_POST['email'] : null;
            $name = strip_tags($_POST['name']) ?? null;
            $surname = strip_tags($_POST['surname']) ?? null;
            $phone = preg_match(VALIDATION_PHONE_REGEX, $_POST['phone']) ? $_POST['phone'] : null;
            $location = strip_tags($_POST['location']) ?? null;
            $role = is_numeric($_POST['role']) ? (int)$_POST['role'] : null;
            $userImage = isset($_POST['userImage']) && $_POST['userImage'] !== 'undefined' ? $_POST['userImage'] : null;

            try {
                $imageUrl = $userImage;
                $password = null;

                if (!empty($_POST['password']) && preg_match(VALIDATION_PASSWORD_REGEX, $_POST['password'])) {
                    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
                }

                if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) { 
                    $storageService = new StorageService();
                    
                    $fileTmpPath = $_FILES['image']['tmp_name'];
                    $fileName = $_FILES['image']['name'];
                    $fileType = $_FILES['image']['type'];

                    $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
                    $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

                    $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

                    $mimeTypeDetected = mime_content_type($fileTmpPath);

                    if (!in_array($fileExtension, $allowedExtensions) || !in_array($mimeTypeDetected, $allowedMimeTypes)) {
                        throw new Exception("Formato de imagen no permitido.");
                    }

                    $imageName = uniqid() . '_' . $fileName;
                
                    $imageUrl = $storageService->uploadFile($fileTmpPath, $imageName, 'user');
                    
                    if ($userImage) {
                        $storageService->deleteFile($userImage, 'user');
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

                if ($imageUrl) {
                    $sql .= ", image = :user_image";
                    $params['user_image'] = $imageUrl;
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
                        'user_image' => $imageUrl
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