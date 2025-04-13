const express = require('express');
const router = express.Router();
const { getChatConnection, saveMessage, fetchChatMessages} = require('../controllers/chatController');

router.post('/message', saveMessage);

router.post('/getChatConnections', getChatConnection);

router.post('/fetchChatMessages', fetchChatMessages)

module.exports = router;
