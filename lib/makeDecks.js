String.prototype.format = function () {
    a = this;
    for (k in arguments) {
        a = a.replace("{" + k + "}", arguments[k])
        a = a.replace(/\n/g, "<br />");
    }
    return a
}


function makeCard(card, templates, deckDiv) {
    console.log('making card ', card.fields.name)

    console.log(card.template)

    var template = templates[card.template];
    console.log(template)
    var fields = template.fields;

    var cardDiv = jQuery('<div/>', {
        class: "card"
    }).appendTo(deckDiv);

    $('<img class="portrait", src="images/' + card.fields.name.replace(/[^0-9a-z]/gi, '').toLowerCase() + '.jpg">').appendTo(cardDiv);

    $('<img class="bg", src="images/' + template.image + '">').appendTo(cardDiv);

    if (template.faders) {
        for (var i = 0; i < template.faders.length; i++) {
            var fader = template.faders[i];
            for (var j = 0; j < fader.tops.length; j++) {
                var tops = fader.tops;
                var lefts = fader.lefts;
                var value = card.fields.data[fader.index];
                var opacity = 1.;
                if (j >= value) {
                    var opacity = 0.4;
                }
                $('<img class="icon", src="images/' + fader.image + '", style="top:' + tops[j] + '; left:' + lefts[j] + ';opacity:' + opacity + ';">').appendTo(cardDiv);
            }
        }

    }


    for (var fieldName in fields) {
        var properties = template.fields[fieldName];

        var data = card.fields.data;
        if (fieldName == "name") {
            data = card.fields.name
        }
        var fieldDiv = jQuery('<div/>', {
            class: fieldName
        })
        fieldDiv.html("{0}");
        for (var propertyName in properties) {
            if (propertyName == "format") {
                fieldDiv.html(template.fields[fieldName][propertyName]);
            } else {
                fieldDiv.css(propertyName, template.fields[fieldName][propertyName])
            }
        }

        if (Array.isArray(data)) {
            fieldDiv.html((fieldDiv.html()).format(...data));
        } else {
            fieldDiv.html((fieldDiv.html()).format(data));
        }

        fieldDiv.appendTo(cardDiv);
    }

}

function makeDeck(cards, templates, name, print) {

    var deckDiv = jQuery('<div/>', {
        class: "deck",
        id: name
    }).appendTo('#decks');

    //jQuery('<br>').appendTo('#decks')
    var count = 0

    cards.forEach(function (card) {

        var copies = 1
        if (card.hasOwnProperty("copies")) {
            copies = card.copies
        }

        for (var i = 0; i < copies; i++) {
            count += 1;
            makeCard(card, templates, deckDiv);
        }
    });

    if (print) {
        html2canvas(deckDiv[0]).then(function(canvas) {
    
            var a = document.createElement('a');
            a.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
            a.download =  name + '_' + count + '.jpg';
            a.click();
        });

    }

}

function makeDecks(document, url, print) {
    document.ready(function () {
    
        $.ajaxSetup({ cache: false });
        console.log("fetching templates")
        $.getJSON("templates.json", function (templates) {
            console.log("templates", templates);
            Papa.parse(url + "&bust=" + (new Date).getTime(), {
                download: true,
                complete: function (results) {
                    console.log(results)
                    decks = {}
                    results.data.slice(1).forEach(function (card) {
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
                        makeDeck(decks[deck], templates, deck, print && deck.length > 0);
                    }
                }
            });
    
    
        });
    });

}