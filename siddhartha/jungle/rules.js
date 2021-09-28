rules = ["Dou Shou Qi : Rules and Info",
	"1. This is a two player game, so grab a family member or buddy to play with you. ",
	"2. When all of the pieces of one color have green squares in the top corner, it is that player's turn.",
	"3. When a square is colored brown, it means that the piece selected can move to that square",
	"4. All pieces can move one square vertically or horizontally.",
	"5. When pieces attack each other, whichever piece has the higher number wins.",
	"6. Rats can traverse through water, but cannot eat the elephant from the water",
	"7. Rats can eat elephants, elephants cannot eat rats.",
	"8.1. Lions and Tigers can jump across the water in any direction,",
	"8.2 as long as a rat is not in the water blocking the path, and there is no higher ranking player on the other side.",
	"9. Now have fun and get started!!!",
	"This wonderful and exciting game was created by your favorite person, Siddhartha Biswas"
]

function print_rules() {
	console.log("rules.length =", rules.length)
	context.font = "20px Georgia";
	for (r_i = 0; r_i < rules.length; r_i++) {
		context.fillText(rules[r_i], 710, 50 + (r_i * 30))
	}
}
