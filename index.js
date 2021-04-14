const Discord = require('discord.js');
require('dotenv').config();
const axios = require('axios').default;
const client = new Discord.Client();

client.once('ready', () => {
    console.log('Ready!');

    client.user.setActivity('Hey! Im Alive and Kicking!');
});

client.on('message', message => {
    //we need to disregard the message sent by a bot.
    if (message.author.bot) return;

    if (message.content === '!ping') {
        //we use return so qna wont trigger
        return message.channel.send('Pong.');
    }

    qna(message);
});

function qna(message) {
    //check if message is an attachment
    if (message.attachments.size <= 0) {
        return axios({
            method: 'post',
            url: process.env.QNA_HOST + process.env.QNA_ENDPOINT,
            data: {
                //we get the every message that user has sent and send it to our endpoint
                question: message.content,
            },
            headers: {
                'Authorization': `EndpointKey ${process.env.QNA_KEY}`,
                'Content-Type': 'application/json'
            }
        }).then(function(response) {
            message.channel.send(response.data.answers[0].answer)
        }).catch(function(error) {
            console.log(error)
        });
    } else {
        message.channel.send(`It's looks like you have sent an image and i don't support it.`);
    }
}

client.login(process.env.BOT_TOKEN);