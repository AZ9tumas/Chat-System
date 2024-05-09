
function enterChat() {
    var username = document.getElementById('username').value;

    localStorage.setItem('username', username);

    //Redirect
    window.location.href = 'chat.html';
}

/*
let lastIndex = 0;
function load_messages() {
    const chatBox = document.getElementById('chatBox');
    chatBox.innerHTML = '';

    fetch(`/poll?lastIndex=${lastIndex}`)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to load messages');
            }
        })
        .then(data => {
            if (data.length > 0) {
                data.forEach(message => {
                    displayMessage(message.username, message.content);
                });
                lastIndex += data.length;
            }
            load_messages(); // Poll for new messages again
        })
        .catch(error => {
            console.error('Error loading messages:', error);
        });
}*/

let lastMessageCount = 0;

async function load_messages() {
    try {
        const response = await fetch('/load');
        if (!response.ok) {
            throw new Error('Failed to load messages');
        }

        const data = await response.json(); /* An array */

        /* If new messages are not found, leave. */
        if (lastMessageCount == data.length) return
        lastMessageCount = data.length

        /* Found new messages */
        console.log("Messages till now:", lastMessageCount);

        /* Clear existing messages */
        const chatBox = document.getElementById('chatBox');
        chatBox.innerHTML = '';

        data.forEach(message => {
            displayMessage(message.username, message.content);
        });

        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (error) {
        console.error('Error loading messages:', error);
    }
}

function displayMessage(username, messageContent) {
    var messageElement = document.createElement('div');
    messageElement.classList.add('message');

    var senderElement = document.createElement('span');
    senderElement.classList.add('sender');
    senderElement.textContent = username + ':';
    messageElement.appendChild(senderElement);

    var contentElement = document.createElement('p');
    contentElement.textContent = messageContent;
    messageElement.appendChild(contentElement);

    var chatBox = document.querySelector('.chat-box');
    chatBox.appendChild(messageElement);
}

function sendMessage() {
    var messageInput = document.getElementById('messageInput');
    
    var messageContent = messageInput.value;

    if (messageContent.trim() !== '') {

        var username = localStorage.getItem('username')
        //displayMessage(username, messageContent);

        fetch('/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'username=' + encodeURIComponent(username) + '&message=' + 
                encodeURIComponent(messageContent),
        })
        .then(response => {
            if (response.ok) {
                console.log('Message sent successfully');
                messageInput.value = '';
            } else {
                console.error('Failed to send message');
            }
        })
        .catch(error => {
            console.error('Error sending message:', error);
        });

        messageInput.value = '';
    }
}

function handleKeyPress(event) {
    if (event.keyCode === 13) {

        // Prevent the default action (e.g., adding a newline)
        event.preventDefault();
        sendMessage();
    }
}

document.getElementById('messageInput').addEventListener('keypress', handleKeyPress);
setInterval(load_messages, 500);