import assert from "assert";
import "fs";
import * as fs from "fs";

// Read input data
const input = fs.readFileSync("input.txt", { encoding: "utf-8" });

// Separate our crate data from instructions
const [cratesData, instructions] = input.split("\n\n");

// Create crates (...)
const stacks: string[][] = [];

// Work from the bottom up
const stacksData = cratesData.split("\n").reverse().slice(1);

for (let i = 0; i < (stacksData[0].length) / 4; i++) {
	stacks.push(stacksData.reduce<Array<string>>((result, x) => {
		let crate = x.slice(i * 4, i * 4 + 3);
		if(crate.trim() != "")
			result.push(crate);
		return result;
	}, []));
}

// Read the instructions
instructions.split("\n").forEach(instruction => {
	const [move, fromAndTo] = instruction.replace("move ", '').split(" from ");
	const [from, to] = fromAndTo.split(" to ");
	
	// Perform the instruction
	const fromStack = stacks[parseInt(from) - 1];
	const toStack = stacks[parseInt(to) - 1];
	for(let i = 0, l = parseInt(move); i < l; i++) {
		const crate = fromStack.pop();
		assert(crate);
		toStack.push(crate);
	}
});

// Print answer
let answer = "";
stacks.forEach((stack, i) => {
	console.log(`Stack No. ${i + 1} Top Crate: ${stack.at(-1)}`);
	answer += stack.at(-1);
});
console.log(`Answer: ${answer.replaceAll('[', '').replaceAll(']','')}`);