import validator from 'validator';

import {isId} from '~/helpers/validate';
import {emitToRoom} from '~/helpers/socket';
import Message from '~/models/Message';

import {replyToMessage} from "./bot";
import config from "config";

const botUserId = config.get('devBotId');

/**
 * Given a messageId string identifier, finds its chat object.
 */
export function findMessage(messageId, otherParams) {
  if (!isId(messageId)) {
    throw 'Message ID is invalid.';
  }

  const params = Object.assign({ _id: messageId}, otherParams);
  return Message.findOne(params).exec().then((message) => {
    if (!message) throw 'No message matched the given parameters.';

    return message;
  });
}

/**
 * Given an existing userId and chatId, save a new message with the given string
 * content.
 */
export function createMessage(userId, chatId, values) {
  const sanitizedContent = validator.trim(values.content);

  if (validator.isEmpty(values.content)) {
    throw 'Message cannot be empty.';
  }

  const newMessage = new Message();
  newMessage.owner = userId;
  newMessage.chat = chatId;
  newMessage.content = sanitizedContent;
  newMessage.type = values.type;
  newMessage.specifics = values.specifics;

  return newMessage.save();
}

/**
 * Emit a message to everyone in the room.
 * Emission will run in background.
 */
export function emitMessage(roomId, message) {
  const reply = replyToMessage(message);
  if (reply != null) {
    const botMessage = new Message();
    botMessage.owner = botUserId;
    botMessage.chat = message.chat;
    botMessage.content = reply;
    botMessage.type = 'plain';

    botMessage.save();

    emitToRoom(roomId, 'ReceiveMessage', message);
    return emitToRoom(roomId, 'ReceiveMessage', botMessage);
  }
  return emitToRoom(roomId, 'ReceiveMessage', message);
}
