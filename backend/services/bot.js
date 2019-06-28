/**
 * Given a mesage, it tries to match it with a pattern and answer it.
 */
export function replyToMessage(messageText) {
  if (messageText.content.indexOf('@bot') >= 0) {
    if (messageText.content.toLowerCase().indexOf('weather') >= 0) {
      return "It's always sunny in Philadelphia"
    } else if (messageText.content.toLowerCase().indexOf('help') >= 0) {
      return "You can find help in the FAQ section,";
    } else if (messageText.content.toLowerCase().indexOf('hello') >= 0) {
      return "I'm DevBot, how can I be of help?";
    } else {
      return "I'm still training, I don't yet know how to help you with that."
    }
  }
  return null;
}
