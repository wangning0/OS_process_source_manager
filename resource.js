const List = require('./List');

class Resource {
    constructor(name, units) {
        // resource 的名字，只能为R1 R2 R3 R4
        this.RID = name;
        // 状态
		this.totalUnits = units;
		this.availableUnits = units;
        // 在资源等待列表中的第一个进程的索引
		this.waitingList = new List();	
    }
}

module.exports = Resource;