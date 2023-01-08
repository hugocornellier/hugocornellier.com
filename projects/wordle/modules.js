
import fs from 'fs';

function test()
{
    const data = fs.readFileSync('/fiveletters.txt');
    const splitData = data.split('\n');
    const randomNumber = Math.floor(Math.random() * splitDate.length);
    const line = splitData.splice(randomNumber, 1);
    console.log(line); // random line
}
