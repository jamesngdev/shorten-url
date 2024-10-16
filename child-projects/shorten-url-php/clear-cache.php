<?php
//clear cache folder
$cacheFolder = __DIR__ . '/cache';
$files = glob($cacheFolder . '/*');
foreach ($files as $file) {
    if (is_file($file)) {
        unlink($file);
    }
}
echo 'Cache cleared';