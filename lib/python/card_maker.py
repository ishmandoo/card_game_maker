import csv
import json
import svgwrite

dwg = svgwrite.Drawing('test.svg', profile='tiny')

class Card:
	def __init__(self, name, data, template):
		self.name = name
		self.data = data
		self.template = template
	def __repr__(self):
		string = ""
		print self.template
		fields = self.template['fields']
		for field_name in fields:
			field = fields[field_name]
			print field
			if field_name != 'name':
				string += field['format'].format(*self.data)
		return string
	def makeSvgObjects(self, origin_x, origin_y):
		fields = self.template['fields']
		for field_name in fields:
			if field_name != 'name':
				field = fields[field_name]
				text = field['format'].format(*self.data)
				x = int(field['left']) + origin_x
				y = int(field['top']) + origin_y
				width = int(field['width'])
				dwg.add(dwg.text(text=text, insert=(x, y), textLength=10))


class Deck:
	def __init__(self, name):
		self.name = name
		self.cards = []
	def addCard(self, card):
		self.cards.append(card)


templates = {}
with open('templates.json') as json_data:
    templates = json.load(json_data)


decks = {}
with open('data.csv', 'rb') as f:
	reader = csv.reader(f)
	for row in list(reader)[1:]:
		name = row[0]
		deck_name = row[1]
		template_name = row[2]
		copies = int(row[3])
		data = row[4:]

		if deck_name not in decks:
			decks[deck_name] = Deck(deck_name)

		for i in range(copies):
			decks[deck_name].addCard(Card(name, data, templates[template_name]))

print decks["main"].cards[0].makeSvgObjects(0, 0)

dwg.save()