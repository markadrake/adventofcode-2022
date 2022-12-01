import * as fs from "fs";
import readline from "readline";

const elves : Array<number> = [];

function processLineByLine(path: string) {

	return new Promise<void>((resolve, reject) => {
		let calories = 0;

		var rd = readline.createInterface({
			input: fs.createReadStream(path)
		});
		
		rd.on("line", (line) => {
	
			if(!line) {
				elves.push(calories);
				calories = 0;
				return;
			}
	
			calories += parseInt(line);
		});	
	
		rd.on("close", () => {
			resolve();
		});	
	});
}
  
processLineByLine("./input.txt").then(() => {
	elves.sort((a, b) => a > b ? -1 : 1);
	let sum = elves.slice(0, 3).reduce((previousValue, currentValue) => previousValue + currentValue);
	console.log(sum);
});