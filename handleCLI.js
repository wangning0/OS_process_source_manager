const readline = require('readline');

function handleCLI() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: 'Testshell> '
    })
    console.log('Testshell> init')
    rl.prompt();
    rl.on('line', (line) => {
        // console.log(`received: ${line}`);
        rl.prompt();
    })
}

module.exports = handleCLI;