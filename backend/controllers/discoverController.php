<?php

require __DIR__.'/../config/config.php';

$data = json_decode(file_get_contents('php://input'));

switch ($data->endpoint) {

    case 'getOrganizations':

        $search = (filter_var($data->search)) ? $data->search : '';
        $filters = (is_array($data->filter)) ? $data->filter : [];

        $db = new DB();
        $order = '';
        $whereFilters = '';
        $locationFilter = '';
        $speciesIds = [];

        
        foreach ($filters as $index => $filter) {

            switch ($filter) {
                case 'orderFilterAsc':
                    $order = 'ASC';
                    break;
                case 'orderFilterDesc':
                    $order = 'DESC';
                    break;
                case 'dogFilter':
                    $speciesIds[] = 1;
                    break;
                case 'catFilter':
                    $speciesIds[] = 2;
                    break;
                case 'exoticFilter':
                    $speciesIds[] = 3;
                    break;
                case 'madridFilter':
                    $locationFilter = "AND u.location = 'Madrid'";
                    break;
            }
        }

        $speciesFilter = (!empty($speciesIds)) ? 'AND u.id IN (SELECT user_id FROM animals a WHERE a.specie_id IN ('.implode(',', $speciesIds).')) ' : '';
        $searchFilter = ($search) ? " AND u.name LIKE '%$search%'" : '';

        $sql = "SELECT
                    u.id,
                    u.name AS user_name,
                    u.location,
                    s.name,
                    COUNT(a.id) AS animal_count
                FROM
                    users u
                CROSS JOIN species s
                LEFT JOIN animals a
                    ON a.user_id = u.id AND a.specie_id = s.id
                WHERE u.role = :role $speciesFilter $locationFilter $searchFilter
                GROUP BY
                    u.id, s.id
                ORDER BY u.name $order";

        $organizations = $db->request($sql, ['role' => USER_ORGANIZATION_ROLE]);
        
        $organizationsData = [];
        
        foreach ($organizations as $organization) {
            $organizationExists = !empty($organizationsData[$organization->id]);
            
            if (!$organizationExists) {
                
                $organizationsData[$organization->id] = [
                    'id' => $organization->id,
                    'name' => $organization->user_name,
                    'location' => $organization->location,
                    'species' => []
                ];
            }

            $organizationsData[$organization->id]['species'][] = [
                'name' => $organization->name,
                'count' => $organization->animal_count
            ];
        }
        
        sendHttpSuccess($organizationsData);
        
        break;

    case 'getOrganizationProfile':
            $db = new DB();

            $organizationId = is_numeric($data->userId) ? $data->userId : null;

            $sql = "SELECT
                    u.email,
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

            $user = $db->request($sql, ['id' => $organizationId]);
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
                        'email' => $data->email,
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

        case 'getOrganizationPosts':

            $db = new DB();

            $organizationId = is_numeric($data->userId) ? $data->userId : null;

            $sql = "SELECT
                    p.id AS post_id,
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

            $data = $db->request($sql, ['id' => $organizationId]);

            sendHttpSuccess($data);
            break;

    case 'saveNotification':

        $jwtData = decodeTokenJWT() ?? null;

        $db = new DB();

        if (!$jwtData && $data->senderUserId) { 
            $senderUserId = $data->senderUserId;

        } else {
            $senderUserId = (is_numeric($jwtData->data->id)) ? $jwtData->data->id : null;
        }

        $animalId = (is_numeric($data->animalId)) ? $data->animalId : null;

        $sql = "SELECT
                a.user_id AS dest_user_id,
                a.name AS animal_name,
                a.specie_id,
                a.age,
                a.sex,
                a.animal_image,
                u.name AS user_name,
                u.surname AS surname,
                u.location,
                u.phone,
                u.email
                FROM animals a
                LEFT JOIN users u ON a.user_id = u.id
                WHERE a.id = :id
                GROUP BY a.id";

        $senderUserData = $db->request($sql, ['id' => $animalId])[0];

        $sql = "INSERT INTO notifications (dest_user_id, sender_user_id, animal_id, readed) 
                VALUES (:dest_user_id, :sender_user_id, :animal_id, :readed)";

        $params = $db->request($sql, [
            'dest_user_id' => $senderUserData->dest_user_id, 
            'sender_user_id' => $senderUserId, 
            'animal_id' => $animalId, 
            'readed' => null
        ]);
                
        if ($params->rowCount() == false) {
            sendHttpError(500);
        }

        $notificationId = $db->lastInsertId();
        
        $userData = [
            'notificationId' => $notificationId,
            'userName' => $senderUserData->user_name,
            'surname' => $senderUserData->surname,
            'location' => $senderUserData->location,
            'phone' => $senderUserData->phone,
            'email' => $senderUserData->email,
            'animalName' => $senderUserData->animal_name,
            'animalSpecie' => $senderUserData->specie_id,
            'animalSex' => $senderUserData->sex,
            'animalAge' => $senderUserData->age,
            'animalImage' => $senderUserData->animal_image,
        ];

        sendHttpSuccess($userData);

        break;
}