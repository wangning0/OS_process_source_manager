const executeCommand  = require('./executeCommand');

module.exports = function() {
    const readline = require('readline');
    const fs = require('fs');

    const dataStream = fs.createReadStream('./input.txt', {
        flags: 'r',
        encoding: 'utf8'
    });

    const rl = readline.createInterface({
        input: dataStream,
        prompt: 'Testshell> '
    })
    executeCommand(rl, 'init');
    rl.prompt();
    rl.on('line', (line) => {
        executeCommand(rl, line);
    })
    
}