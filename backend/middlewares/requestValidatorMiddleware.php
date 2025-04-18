<?php

function validator($data, $type, $regex = '') {
    
    switch ($type) {
        case 'string':
            is_string($type);
            strip_tags($data);
            break;
            
        case 'numeric':
            if (!is_numeric($type)) {
                return false;
            }
            break;
    }
    $regex ? preg_match($regex, $data) : '';

    return $data;
}
