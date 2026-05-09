const fs = require('fs');

const cowFile = fs.readFileSync('src/game-logic/reducers/addCowToInventory.ts', 'utf8');
if (!cowFile.includes('export const addCowToInventory = (state: farmhand.state, cow: farmhand.cow): farmhand.state => {')) {
   throw new Error("Missing typings in addCowToInventory");
}

const kegFile = fs.readFileSync('src/game-logic/reducers/addKegToCellarInventory.ts', 'utf8');
if (!kegFile.includes('export const addKegToCellarInventory = (state: farmhand.state, keg: farmhand.keg): farmhand.state => {')) {
   throw new Error("Missing typings in addKegToCellarInventory");
}

const gitignore = fs.readFileSync('.gitignore', 'utf8');
if (gitignore.includes('src/game-logic/reducers/')) {
   throw new Error("Found src/game-logic/reducers/ in gitignore");
}

console.log("Verified all PR comments fixes are applied.");
