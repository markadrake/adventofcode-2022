import assert from "assert";
import * as fs from "fs";
import readline from "readline";

/*
	Types
*/
type Rucksack = {
	compartments: Array<string[]>,
	misplacedItem: string[1],
	priority: number
}

/*
	Logic
*/
const rucksacks: Array<Rucksack> = [];

function prioritizeChar(char: string[1]) {

	let charCode = char.charCodeAt(0);

	// a-z: 1-26
	if(charCode >= 97 && charCode <= 122) {
		return charCode - 96;
	}

	// A-Z: 27-52
	else if(charCode >= 65 && charCode <= 90) {
		return charCode - 38;
	}

	return 0;
};

function processLineByLine(path: string) {

	return new Promise<void>((resolve, reject) => {

		var rd = readline.createInterface({
			input: fs.createReadStream(path)
		});
		
		rd.on("line", (line) => {
			const items = line.split('');

			const compartment1 = items.slice(0, items.length/2);
			assert(compartment1);

			const compartment2 = items.slice(items.length/2);
			assert(compartment2);

			const misplacedItem = compartment2.find(c => {
				return compartment1.indexOf(c) >= 0;
			});
			assert(misplacedItem);

			const rucksack: Rucksack = {
				compartments: [
					compartment1,
					compartment2
				],
				misplacedItem: misplacedItem,
				priority: prioritizeChar(misplacedItem)
			};

			rucksacks.push(rucksack);
		});	
	
		rd.on("close", () => {
			resolve();
		});	
	});
}
  
processLineByLine("./input.txt").then(() => {
	console.log(`There are ${rucksacks.length} rucksacks total.`);

	let sum = 0;

	rucksacks.forEach((rucksack, id) => {
		console.log(`Rucksack #${id} has misplaced item: ${rucksack.misplacedItem} with priority: ${rucksack.priority}`);
		sum+=rucksack.priority;
	});

	console.log(`The total priority is: ${sum}`);
});