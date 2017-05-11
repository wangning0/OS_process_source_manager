const readline = require('readline');
const executeCommand  = require('./executeCommand');

function handleCLI() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: 'Testshell> '
    })
    rl.prompt();
    executeCommand(rl, 'init');
    rl.prompt();
    rl.on('line', (line) => {
        executeCommand(rl, line);
        rl.prompt();
    })
}

module.exports = handleCLI;