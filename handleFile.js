module.exports = function() {
    const readline = require('readline');
    const fs = require('fs');

    const dataStream = fs.createReadStream('./input.txt', {
        flags: 'r',
        encoding: 'utf8'
    });

    const rl = readline.createInterface({
        input: dataStream,
    })

    rl.on('line', (line) => {
        // ...todo
    })
    
}