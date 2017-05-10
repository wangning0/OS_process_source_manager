const {NUM_PROCESSES, NUM_READY_LIST, NUM_RESOURCES } = require('./constants');
const Process = require('./Process');
const List = require('./List');
const Resource = require('./Resource');
const State = require('./state');

class ProcessAndResourceManager {
    constructor() {
        this.currentProcess = -1;
        // 初始化进程
        this.processes = [];
        for(let i = 0; i < NUM_PROCESSES; i++) {
            this.processes.push(new Process({
                used: false
            }));
        }
        // 初始化资源
        this.resources = [];
        this.resources[0] = new Resource('R1', 1);
        this.resources[1] = new Resource('R2', 2);
        this.resources[2] = new Resource('R3', 3);
        this.resources[3] = new Resource('R4', 4);
        // 初始化就绪队列
        this.readyList = [];
        for(let i = 0; i < NUM_READY_LIST; i++) {
            this.readyList.push(new List());
        }
        // 创建init进程，权限为0 没有父母、兄弟节点
        // 该进程初始化则为ready状态
        this.processes[0] = new Process({
            thePID: 'init',
            theState: State.RUNNING,
            theParent: -1,
            theOlderSibling: -1,
            thePriority: 0,
            used: true
        });
        this.readyList[0].insert(processes, 0);
        this.currentProcess = 0;
    }

    /**
     * 初始化 
     * @return 返回当前运行的进程
     */
    init() {
        // 初始化进程
        this.processes = [];
        for(let i = 0; i < NUM_PROCESSES; i++) {
            this.processes.push(new Process({
                used: false
            }));
        }
        // 初始化资源
        this.resources = [];
        this.resources[0] = new Resource('R1', 1);
        this.resources[1] = new Resource('R2', 2);
        this.resources[2] = new Resource('R3', 3);
        this.resources[3] = new Resource('R4', 4);
        // 初始化就绪队列
        this.readyList = [];
        for(let i = 0; i < NUM_READY_LIST; i++) {
            this.readyList.push(new List());
        }
        // 创建init进程，权限为0 没有父母、兄弟节点
        // 该进程初始化则为ready状态
        this.processes[0] = new Process({
            thePID: 'init',
            theState: State.RUNNING,
            theParent: -1,
            theOlderSibling: -1,
            thePriority: 0,
            used: true
        });
        this.readyList[0].insert(this.processes, 0);
        this.currentProcess = 0;
        // 调用scheduler
        return this.scheduler();
    }

    /**
     * 创建一个新的进程
     * @param name 进程的名字，要独一无二, 并且为单个字符
     * @param p 进程的优先级 1/2
     * @return string 当前运行的进程
     */

     create(name, p) {
         // 创建不存在的优先级进程,则报错
        if(!(p == 1) || (p == 2)) {
            return `不存在的priority${p}`
        }

        // if(name.length != 1) {
        //     return `进程的名字必须为单字符`
        // }

        // 检测名字是否有相同的
        this.processes.map((p => {
            if(p.PID == name) {
                return `进程的名字必须是独一无二的`;
            }
        }))

        // 查找进程列表中的第一个空闲的
        let index = -1;
        for(let i = 0; i < this.processes.length; i++) {
            if(!this.processes[i].used) {
                index = i;
                break;
            }
        }

        // 如果没有空闲的进程列表,则报错
        if(index == -1) {
            return `所有的进程都被使用了`;
        }
        
        // currentProcess => parentProcess
        const parent = currentProcess;

        // older sibling
        const olderSibling = this.findYoungestChild(parent);
        
        if(this.processes[parent].child == -1) {
            this.processes[parent].child = index;
        }

        if(olderSibling != -1) {
            this.processes[olderSibling].youngerSibling = index;
        }

        // 初始化新的process
        this.processes[index] = new Process({
            thePID: name,
            theState: State.READY,
            theParent: parent,
            theOlderSibling: olderSibling,
            thePriority: p,
            used: true
        })

        // 插入就绪队列
        this.readyList[p],insert(this.processes, index);

        return scheduler();
     }

     
     /**
      * 杀死进程
      * @param 进程名字
      * @return 当前运行的进程
      */
     destory(name) {
        // if(name.length != 1) {
        //     return `进程的名字必须为单字符`
        // }

        // // 确定进程列表中的进程索引
        // let index = -1;
        // for(let i = 0; i < this.processes.length; i++) {
        //     if(name == this.processes[i].PID) {
        //         index = i;
        //     }
        // }

        // // 如果process不存在processes List
        // if(index == -1) {
        //     return `不存在process${name}`;
        // }

        // // 
        // const currentlyRunning = this.currentProcess;

     }
    
    
}

module.exports =  ProcessAndResourceManager;