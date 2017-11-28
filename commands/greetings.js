// Import the discord.js module
const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();
const request = require('request-promise');
// The token of your bot - https://discordapp.com/developers/applications/me
const token = require('../keys.js').token;

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on('ready', () => {
  console.log('I am ready!');
});

// Create an event listener for messages
client.on('message', message => {
    // If the message is "ping"
    if (message.content === 'ping') {
      // Send "pong" to the same channel
      message.channel.send('pong');
    }
    if (message.content === '/help') {
        message.channel.send(`List of commands:
        \`/price\` - Get's current DIVI price
        \`/totalSupply\` - Get's DIVI total supply
        \`/mktcap\` - Get's current DIVI market cap
        \`/friends\` - Tell's you how many friends you have`)
    }
    if (message.content === '/price') {
        const priceCheck = {
            uri: 'https://api.coinmarketcap.com/v1/ticker/divi/',
            qs: {
                convert: 'USD'
            },
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true
        };
        request(priceCheck)
            .then(function(res) {
                console.log(res);
                message.channel.send(`The current DIVI price in USD is $${res[0].price_usd}\nThe current DIVI price in BTC is ${res[0].price_btc}`)
            })
            .catch(function(err) {
                console.log(`nahhhhh nigga`);
            });
    }
  });

// Create an event listener for new guild members
client.on('guildMemberAdd', member => {
  // Send the message to a designated channel on a server:
  const channel = member.guild.channels.find('name', 'member-log');
  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member
  channel.send(`Welcome to the server, ${member}, try typing \`/help\` for a list of commands`);
});

// Log our bot in
client.login(token);