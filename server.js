const express = require('express')
const fs = require('fs');
const Papa = require('papaparse');
const parse = require('csv-parse');
const https = require('https');
const request = require('request')
const csv=require('csvtojson');



const app = express()

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(3000, () => console.log('Example app listening on port 3000!'))


request("https://docs.google.com/spreadsheets/d/e/2PACX-1vRUFVchvd30vNnaVsGjod3u3wgd88McwZz13vVrekYLNqNWpJmU8mHoX22Sv0AJ73X6i4gSZsRfQkI6/pub?output=csv").pipe(fs.createWriteStream('data.csv'))
	.on('finish', function() {
		csv({
		    noheader:true,
		    output: "csv"
		})
		.fromFile('data.csv')
		.then((data)=>{
		    console.log(data);


			let rawdata = fs.readFileSync('templates.json');  
			let templates = JSON.parse(rawdata);  
			console.log("templates", templates);

			decks = {}
			data.slice(1).forEach(function(card) {
				if (!(card[1] in decks)) {
					decks[card[1]] = [];
				}

				decks[card[1]].push({
					fields: {
						name: card[0],
						data: card.slice(4)
					},
					copies: card[3],
					template: card[2]
				});
			});

			console.log(decks);
			for (var deck in decks) {
				console.log("making deck " + deck)
				//makeDeck(decks[deck], templates, deck);
			}
		})
	})


