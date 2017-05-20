const TelegramBot = require('node-telegram-bot-api');
const BBCMicrobit = require('bbc-microbit')

// replace the value below with the Telegram token you receive from @BotFather
const token = '';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});
const telegram_id = '';

const pin = 0;

function init() {
	myStart();
}

function myStart() {
	BBCMicrobit.discover(function(microbit) {
		console.log('\tdiscovered microbit: id = %s, address = %s', microbit.id, microbit.address);

		microbit.on('disconnect', function() {
			console.log('\tmicrobit disconnected!');
			bot.sendMessage(telegram_id, 'bot: microbit disconnected!');
			init();
		});

		microbit.on('pinDataChange', function(pin, value) {
			//console.log('\ton -> pin data change: pin = %d, value = %d', pin, value);

			//console.log(value);
			if(value == 2) {
				console.log('Door Closed');
				bot.sendMessage(telegram_id, 'Warning: Door closed');
			} else {
				console.log('Door Opened');
				bot.sendMessage(telegram_id, 'Warning: Door opened');
			}

		});

		console.log('connecting to microbit');
		microbit.connectAndSetUp(function() {
			console.log('\tconnected to microbit');
			bot.sendMessage(telegram_id, 'Connected to microbit');

			//console.log('setting pin %d as input', pin);
			microbit.pinInput(pin, function() {
				console.log('\tpin set as input');

				//console.log('setting pin %d as analog', pin);
				microbit.pinAnalog(pin, function() {
					//console.log('\tpin set as analog');

					//console.log('subscribing to pin data');
					microbit.subscribePinData(function() {
						//console.log('\tsubscribed to pin data');
					});
				});
			});
		});
	});

}

init();
