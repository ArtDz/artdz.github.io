<?php
$data = json_decode(file_get_contents('data.json'), true);

$new_data = json_decode(file_get_contents('php://input'), true);

if (!empty($new_data)) {
    $cards = isset($data['cards']) ? $data['cards'] : array();

    if ($new_data['title'] === 'clear') {
        // remove all existing data if title is "clear"
        $data['cards'] = array();
    } else {
        // add new data with a new unique id
        $cards[] = $new_data;

        $data['cards'] = $cards;
    }

    $content = json_encode($data);

    file_put_contents('data.json', $content);

    echo 'Новые данные добавлены в файл';
} else {
    echo 'Данные не были получены';
}