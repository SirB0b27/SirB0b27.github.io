<?php
require 'init.php';
if (isset($_POST['method']) === true && empty($_POST['method'] === false)) {
    $chat = new Chat();
    $method = trim($_POST['method']);

    if ($method === 'fetch') {
        $messages = $chat->fetchMessage();
        if (empty($messages) === true) {
            echo 'There are no messages in the chat';
        } else {
            foreach ($messages as $message) {
                ?>
                <div class="message">
                    <a href="#"><?php echo $message['userName']; ?></a> says:
                    <p><?php echo $message['message']; ?></p>
                </div>
<?php
            }
        }
    } else if ($method === 'throw' && isset($_POST['message']) === true) {
        //
        $message = trim($_POST['message']);
        if (empty($message) === false) {
            $chat->throwMessage($_SESSION['userID'], $message);
        }
    }
}
