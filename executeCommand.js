/**
 * @author: wing
 * @desc: 调度任务
 */
const handleError = require('./handleError');
const manager = require('./processAndResourceManager');
function executeCommand(rl, input) {
    const _input = input.trim();
    const reg = /\S+/g;

    if(_input == '') {
        rl.prompt();
        return;
    }
    const commandParams = _input.match(input);
    const commandParamsNum = commandArr.length;
    if(!(commandParamsNum >= 1 && commandParams <= 3)) {
        handleError();
        return;
    }
    
    if(commandParamsNum == 1 && commandParams[0] === "init"){
        console.log(manager.init());
    } else if (commandParamsNum == 3 && commandParams[0] === "cr"){
        console.log(manager.create(commandParams[1], parseInt(commandParams[2])));
    } else if (commandParamsNum == 2 && commandParams[0] === "de"){
        console.log(manager.destroy(commandParams[1]));
    } else if (commandParamsNum == 3 && commandParams[0] === "req"){
        console.log(manager.request(commandParams[1], parseInt(commandParams[2])));
    } else if (commandParamsNum == 3 && commandParams[0] === "rel"){
        console.log(manager.release(commandParams[1], parseInt(commandParams[2])));
    } else if (commandParamsNum == 1 && commandParams[0] === "to"){
        console.log(manager.timeout());
    } else {
        handleError();
        return;
    }
    
    console.log(' ');
}
module.exports = executeCommand;