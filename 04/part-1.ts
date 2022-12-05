import assert from "assert";
import * as fs from "fs";
import readline from "readline";

/*
	Types
*/

/*
	Logic
*/
let pairsDoingEachOthersWork = 0;

function processLineByLine(path: string) {

	return new Promise<void>((resolve, reject) => {

		var rd = readline.createInterface({
			input: fs.createReadStream(path)
		});
		
		rd.on("line", (line) => {
			const items = line.split(',');

			const elf1 = items[0].split('-').map(char => parseInt(char));
			const elf1Sections = Array.from(new Array(elf1[1] - elf1[0] + 1), (x, i) => i + elf1[0])

			const elf2 = items[1].split('-').map(char => parseInt(char));
			const elf2Sections = Array.from(new Array(elf2[1] - elf2[0] + 1), (x, i) => i + elf2[0])

			// Does either elf have the other's full workload
			let needle = elf1Sections.length <= elf2Sections.length ? elf1Sections : elf2Sections;
			let haystack = elf1Sections.length <= elf2Sections.length ? elf2Sections : elf1Sections;

			let areTheyRepeating = needle.every(section => haystack.includes(section));
			pairsDoingEachOthersWork += areTheyRepeating ? 1 : 0;
		});	
	
		rd.on("close", () => {
			resolve();
		});	
	});
}
  
processLineByLine("./input.txt").then(() => {
	console.log(`${pairsDoingEachOthersWork} elves are repeating their work!`);
});