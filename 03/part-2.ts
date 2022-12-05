import assert from "assert";
import * as fs from "fs";
import readline from "readline";

/*
	Types
*/
type RucksackGroup = {
	rucksacks: Array<Rucksack>,
	badge: string[1] | null,
	priority: number | null
}

type Rucksack = {
	items: string[]
}

/*
	Logic
*/
const groups: Array<RucksackGroup> = [];
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

			const rucksack: Rucksack = {
				items
			};

			rucksacks.push(rucksack);
		});	
	
		rd.on("close", () => {
			resolve();
		});	
	});
}
  
processLineByLine("./input.txt").then(() => {

	// Organize the rucksacks by group
	rucksacks.forEach((rucksack, index) => {
		let groupIndex = Math.floor(index / 3);

		if(groups[groupIndex]) {
			groups[groupIndex].rucksacks.push(rucksack);
		} else {
			groups[groupIndex] = {
				rucksacks: [rucksack],
				badge: null,
				priority: null
			}
		}
	});

	// Find the badge in each group, and the sum
	let sum = 0;

	groups.forEach(group => {

		console.log("new group:");
		group.rucksacks.forEach(rucksack => console.log(rucksack));

		let items = group.rucksacks[0].items;

		let badge = items.find(item =>
			group.rucksacks[1].items.indexOf(item) >= 0 &&
			group.rucksacks[2].items.indexOf(item) >= 0
		);
		assert(badge);

		group.badge = badge;
		group.priority = prioritizeChar(badge);
		sum += group.priority;
	});

	console.log(groups);
	console.log(`Total priority: ${sum}`);
});