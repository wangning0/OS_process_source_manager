class Process {
    constructor({
        used = false,
        thePID,
        theState,
        theParent,
        theOlderSibling,
        thePriority
    }) {
        // process 的名字
        this.PID = thePID;
        // 确定是否正在使用PCB
        this.used = used;
        // 已经请求成功的资源
        this.holdResources = new Array(4); // (R1,R2,R3,R4)
        // 正在请求的资源清单
        this.requestedResources = new Array(4); // (R1,R2,R3,R4)
        // runing ready blocked 类型
        this.type = theState;
        // next process 的索引
        this.next = -1;
        // process tree
        this.parent = theParent;
        this.child = -1;
        this.olderSibling = theOlderSibling;
        this.youngerSibling = -1;
        // process 的优先级 只能为1/2
        this.priority = thePriority;
    }
}

module.exports = Process;