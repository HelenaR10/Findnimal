<?php

function calculateAnimalMatch($property, $animal) {
    $animalTotal = 0;
    $matches = 0;

     $rows = [
        'specie' => 'specie_id',
        'breed' => 'breed_id',
        'hair' => 'hair_color',
        'eyes' => 'eye_color',
        'size' => 'size',
        'age' => 'age',
        'sex' => 'sex',
        'identification' => 'identification'
    ];

    foreach ($rows as $postKey => $animalKey) {
        $animalTotal++;

        if (
            isset($property[$postKey]) &&
            isset($animal->$animalKey) &&
            $property[$postKey] == $animal->$animalKey
        ) {
            $matches++;
        }
    }

    return ($matches / $animalTotal) * 100;
}