// Import the discord.js module
const Discord = require('discord.js');
const _ = require('lodash');

// Create an instance of a Discord client
const client = new Discord.Client();
const request = require('request-promise');
const weiMultiplier = 1000000000000000000;
// The token of your bot - https://discordapp.com/developers/applications/me
const token = require('../keys.js').token;
const contractaddress = require('../keys.js').contractAddress;
const etherscanApi = require('../keys.js').etherscanApi;

// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted
client.on('ready', () => {
  console.log('I am ready!');
});

let priceCheck;
// Create an event listener for messages
client.on('message', message => {
    // If the message is "ping"
    if (message.content === 'ping') {
      // Send "pong" to the same channel
      message.channel.send('pong');
    }
    // List help commands
    if (message.content === '/help') {
        message.channel.send(`List of commands:
        \`/price\` - Get's current DIVI price
        \`/totalSupply\` - Get's DIVI total supply
        \`/mktcap\` - Get's current DIVI market cap
        \`/exchanges\` - Get's list of current exchanges selling DIVX
        \`/friends\` - Tell's you how many friends you have`)
    }
    // Find current price from CMC 
    priceCheck = () => { 
        let priceCall = {
        uri: 'https://api.coinmarketcap.com/v1/ticker/divi/',
        qs: {
            convert: 'USD'
        },
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true
    };
    request(priceCall)
        .then(function(res) {
            console.log('price has been checked');
            let vol;
            _.forEach(res[0], function(value, key) {
                if (key === "24h_volume_usd") {
                    vol = value;
                }
            });
            message.channel.send(`The current DIVX price in USD is $${_.round(res[0].price_usd, 3)}
            \nThe current DIVI price in BTC is ${res[0].price_btc}
            \nThe current Market Cap is $${res[0].market_cap_usd}
            \nThe 24 hour volume of DIVX is $${vol}`)
        })
        .catch(function(err) {
            console.log(err);
        });
    }
    if (message.content === '/price') {
        setInterval(priceCheck, 60000);
    }
    // Find total supply of tokens from etherscan
    if (message.content === '/totalSupply') {
        const totalSupply = {
            uri: 'https://api.etherscan.io/api',
            qs: {
                module: 'stats',
                action: 'tokensupply',
                contractaddress: contractaddress,
                apikey: etherscanApi
            },
            json: true
        };
        request(totalSupply)
            .then(function(res) {
                console.log(res);
                message.channel.send(`The total supply of DIVX is and always will be: ${res.result / weiMultiplier} DIVX`)
            })
            .catch(function(err) {
                console.log(`ohhh noo!`)
            })
        message.channel.send()
    }
    // List exchanges where DIVX is available
    if (message.content === '/exchanges') {
        message.channel.send(`We are currently on: \n
        Cryptopia: https://goo.gl/A8Gd9M\n
        EtherDelta: https://goo.gl/mH8X9b`)
    }
    // How many friends?
    if (message.content === '/friends') {
        let numFriends = Math.floor(Math.random() * 10);
        if (numFriends > 0) {
            message.channel.send(`You have ${numFriends} friends`);
        } else {
            message.channel.send(`Loser has no friends`);
        }
        
    }
    // If someone asks when moon tell them to fuck off
    if (message.content === 'when moon') {
        message.channel.send('when mars');
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