const carrefourHandler = require('./bots/carrefour');
const youtubeHandler = require('./bots/youtube');
const uberHandler = require('./bots/uber');

function parser(rawMessage = "") {
  const carrefourPrefix = "?"
  const uberPrefix = "!"
  const youtubePrefix = ";"

  
  const currentPrefix = rawMessage.slice(0,1)
  const message = rawMessage.slice(1)

  switch (currentPrefix){
    case carrefourPrefix:
      return carrefourHandler(message)
    case uberPrefix:
      return uberHandler(message)
    case youtubePrefix:
      return youtubeHandler(message.slice(1))
    default:
      console.log("message was not meant for a bot :( ")
      return ""
  }
    
}

module.exports = parser;
