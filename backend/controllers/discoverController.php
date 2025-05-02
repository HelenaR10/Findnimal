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
        
        break;
}