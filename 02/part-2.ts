import assert from "assert";
import * as fs from "fs";
import readline from "readline";

/*
	Constants
*/
const ROCK = "rock";
const PAPER = "paper";
const SCISSORS = "scissors";

/* 
	Our types 
*/
let players : Array<player> = [];

type player = {
	wins: number,
	losses: number,
	draws: number,
	hands: Array<hand>,
	score: number
};

const hands : Array<hand> = [
	{ label: ROCK, score: 1, keys: ['A'], beats: SCISSORS },
	{ label: PAPER, score: 2,  keys: ['B'], beats: ROCK },
	{ label: SCISSORS, score: 3,  keys: ['C'], beats: PAPER },
];

type hand = {
	label: typeof ROCK | typeof PAPER | typeof SCISSORS,
	score: number,
	keys: string[],
	beats: string
}


/*
	Our logic
*/
function recordMatch(plays: string[]) {

	// Record the hand
	plays.forEach((value, index) => {
		const player = players[index];
		let hand = hands.find(hand => hand.keys.indexOf(value) >= 0);
		if(!hand) {
			const opponentHand = players[index-1].hands.at(-1);
			assert(opponentHand);

			// x = lose, y = draw, z = win
			switch (value) {
				case "X":
					hand = hands.find(hand => hand.label == opponentHand.beats);
					break;
				case "Y":
					hand = opponentHand;
					break;
				case "Z":
					hand = hands.find(hand => hand.beats == opponentHand.label);
					break;
			}
		}
		assert(hand);
		player.score += hand.score;
		player.hands.push(hand);
	});

	// Record the match outcome
	let playerIndex = 1;
	players.forEach(player => {
		const playerHand = player.hands.at(-1);
		assert(playerHand);

		players.slice(playerIndex)?.forEach(opponent => {
			const opponentHand = opponent.hands.at(-1);
			assert(opponentHand);
			
			if(playerHand.beats == opponentHand.label) {
				player.wins++;
				player.score += 6;
				opponent.losses++;
			}

			else if (opponentHand.beats == playerHand.label) {
				opponent.wins++;
				opponent.score += 6;
				player.losses++;
			}

			else {
				player.draws++;
				player.score += 3;
				opponent.draws++;
				opponent.score += 3;
			}

		});

		playerIndex++;
	});

}

function createPlayers(numberOfPlayers: number) {
	for(let i = 0; i < numberOfPlayers; i++) {
		players.push({
			wins: 0,
			losses: 0,
			draws: 0,
			hands: [],
			score: 0
		});
	}
}

function processLineByLine(path: string) {

	let playersCreated = false;

	return new Promise<void>((resolve, reject) => {

		var rd = readline.createInterface({
			input: fs.createReadStream(path)
		});
		
		rd.on("line", (line) => {
			const plays = line.replace(' ', '').split('');

			if(!playersCreated) {
				createPlayers(plays.length);
				playersCreated = true;
			}

			recordMatch(plays);

		});	
	
		rd.on("close", () => {
			resolve();
		});	
	});
}
  
processLineByLine("./input.txt").then(() => {
	players.forEach(player => console.log(player));
	console.log(`My score: ${players[1].score}`);
});