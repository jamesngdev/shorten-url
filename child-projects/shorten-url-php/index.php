<?php
// create cache folder
if (!file_exists(__DIR__ . '/cache')) {
    mkdir(__DIR__ . '/cache');
}

function setCacheAPI($url, $data)
{
    $cacheFile = __DIR__ . '/cache/' . md5($url) . '.json';
    file_put_contents($cacheFile, json_encode($data));
}

function getCacheAPI($url)
{
    $cacheFile = __DIR__ . '/cache/' . md5($url) . '.json';
    if (file_exists($cacheFile)) {
        $data = file_get_contents($cacheFile);
        return json_decode($data, true);
    }
    return null;
}

function getShortenUrl($url)
{
    $API_URL = "https://shorten-url-blue-three.vercel.app/api/shorten-url" . $url;
    $cache = getCacheAPI($API_URL);
    if ($cache) {
        return $cache;
    }

    $ch = curl_init($API_URL);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);
    $result = json_decode($response, true);
    setCacheAPI($API_URL, $result);
    return $result;
}

function isBot()
{
    $BOT_USER_AGENTS = [
        'facebookexternalhit',
        'Twitterbot',
        'Googlebot',
        'WhatsApp',
        'Slackbot',
        'LinkedInBot',
        'Pinterest',
        'Applebot',
        'TelegramBot',
    ];
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? ''; // Get the User-Agent from the server variable
    $isBot = false;
    foreach ($BOT_USER_AGENTS as $bot) {
        if (strpos($bot, $userAgent) !== false) {
            $isBot = true;
            break;
        }
    }

    return $isBot;
}

function renderBotPage($data)
{
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <title><?= $data['title'] ?></title>
        <meta name="description" content='<?= $data['description'] ?>'/>
        <meta property="og:title" content='<?= $data['title'] ?>'/>
        <meta property="og:description"
              content='<?= $data['description'] ?>'/>
        <meta property="og:image" content='<?= $data['image'] ?>'/>
    </head>
    </html>
    <?php
}

function renderUserPage($data)
{
    header("Location: " . $data['url']);
    header('HTTP/1.1 302 Found');
    ?>
    <!DOCTYPE html>
    <html>

    <head>
        <meta charset="UTF-8"/>
        <meta http-equiv="refresh" content="0;url='<?= $data['url'] ?>'"/>
        <title>Redirecting to <?= $data['url'] ?></title>
    </head>

    <body>
    Redirecting to <a href="<?= $data['url'] ?>"><?= $data['url'] ?></a>.
    </body>

    </html>
    <?php
}

$isBot = isBot();
$data = getShortenUrl($_SERVER['REQUEST_URI']);
if (!$data['url']) {
    header('HTTP/1.1 404 Not Found');
    exit('404 Not Found');
}
if ($data['is_redirect']) {
    exit(renderUserPage($data));
}
if ($isBot) {
    exit(renderBotPage($data));
}

exit(renderUserPage($data));


