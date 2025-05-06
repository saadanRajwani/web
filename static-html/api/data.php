<?php
header('Content-Type: application/json');

// Mock data for the application
$data = [
  'khatm' => [
    'number' => 1,
    'type' => 'Full Quran',
    'participants' => 25,
    'progress' => 35,
    'sections_completed' => 12
  ],
  'user' => [
    'name' => 'User',
    'completedSections' => 3,
    'percentile' => '75th'
  ],
  'completions' => [
    ['user' => 'Ahmed', 'para' => 5, 'date' => '2023-05-15'],
    ['user' => 'Fatima', 'para' => 8, 'date' => '2023-05-14'],
    ['user' => 'Ali', 'para' => 12, 'date' => '2023-05-13']
  ]
];

echo json_encode($data);
?>