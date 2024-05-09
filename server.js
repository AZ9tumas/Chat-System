const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const messagesFilePath = path.join(__dirname, 'messages.txt');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});

// Load existing messages
let messages = [];
if (fs.existsSync(messagesFilePath)) {
    const messagesData = fs.readFileSync(messagesFilePath, 'utf8');
    if (messagesData.trim() !== '') {
        messages = JSON.parse(messagesData);
    }
}

/* Endpoint for long polling
app.get('/poll', (req, res) => {
    // Check if there are any new messages
    const newMessages = req.query.lastIndex < messages.length ? messages.slice(req.query.lastIndex) : [];
    if (newMessages.length > 0) {
        // If there are new messages, send them immediately
        console.log("Found")
        res.json(newMessages);
    }
});*/

app.post('/messages', (req, res) => {
    const message = {
        username: req.body.username,
        content: req.body.message
    };

    // Add the new message to the messages array
    messages.push(message);

    console.log(messages);

    // Save the updated messages to the JSON file
    fs.writeFileSync(messagesFilePath, JSON.stringify(messages));

    res.sendStatus(200); // Send a success status
});

app.get('/load', (req, res) => {
    res.json(messages);
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
