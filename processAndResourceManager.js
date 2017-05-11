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
        this.readyList[0].insert(this.processes, 0);
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
        if(!(p == 1 || p == 2)) {
            return `不存在的priority${p}`
        }

        // if(name.length != 1) {
        //     return `进程的名字必须为单字符`
        // }

        // 检测名字是否有相同的
        this.processes.forEach((p => {
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
        const parent = this.currentProcess;

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
        this.readyList[p].insert(this.processes, index);
        return this.scheduler();
     }

     
     /**
      * 杀死进程
      * @param 进程名字
      * @return 当前运行的进程
      */
     destroy(name) {
        // if(name.length != 1) {
        //     return `进程的名字必须为单字符`
        // }

        // 确定进程列表中的进程索引
        let index = -1;
        for(let i = 0; i < this.processes.length; i++) {
            if(name == this.processes[i].PID) {
                index = i;
            }
        }

        // 如果process不存在processes List
        if(index == -1) {
            return `不存在process${name}`;
        }

        // 确定当前正在运行的进程
        const currentlyRunning = this.currentProcess;

        // 检查当前运行的进程是否为要被杀死的进程的祖先
        let ancestor = false;
        let parent = this.processes[index].parent;
        while(parent != -1) {
            if(parent == currentlyRunning) {
                ancestor = true;
                break;
            }
            parent = this.processes[parent].parent;
        }

        // 只有为当前进程或者是当前进程的祖先进程才能被kill
        if(!(index == currentlyRunning || ancestor)) {
            return `只有为当前进程或者是当前进程的祖先进程才能被kill`;
        }

        // 破坏所有进程的后代
        this.killTree(index);
        // 调度器
        return this.scheduler();
     }
    
    /**
     * 级联的删除要销毁的进程及其后代进程
     * @param processIndex 进程索引
     */
    killTree(processIndex) {
        // 确定要kill的进程的子进程，递归调用
        let currentProcess = this.processes[processIndex].child;
        let previousProcess = -1;

        while(currentProcess != -1) {
            previousProcess = currentProcess;
            currentProcess = this.processes[currentProcess].youngerSibling;
            killTree(previousProcess);
        }

        // 释放杀死进程所持有的资源，并且检查是否满足阻塞队列中的请求
        for(let i = 0; i < this.processes[processIndex].holdResources.length; i++) {
            if(this.processes[processIndex].holdResources[i] > 0) {
                this.resources[i].availableUnits += this.processes[processIndex].holdResources[i];
                this.checkResourceGranting(i);
            }
        }

        // 更新进程树
        const parent = this.processes[processIndex].parent;
        const olderSibling = this.processes[processIndex].olderSibling;
        const youngerSibling = this.processes[processIndex].youngerSibling;

        if(this.processes[parent].child == processIndex) {
            this.processes[parent].child = youngerSibling;
        }

        if(olderSibling != -1) {
            this.processes[olderSibling].youngerSibling = youngerSibling;
        }

        if(youngerSibling != -1){
			this.processes[youngerSibling].olderSibling = olderSibling;
		}

        // 更新read List
        const p = this.processes[processIndex].priority;
        this.readyList[p].remove(this.processes, processIndex);

        // 更新waiting lists
        for(let i = 0; i < this.resources.length; i++) {
            this.resources[i].waitingList.remove(this.processes, processIndex);
        }

        // 删除PCB
        this.processes[processIndex] = new Process({
            used: false
        })
    }

    /**
     * 当前进程请求给定数量单位的指定资源
     * @param RID 资源名字
     * @param numUnits 请求的数量, 必须是正整数
     * @return 当前进程
     */
    request(RID, numUnits) {
        if(numUnits <= 0) {
            return `请求资源的数量要大于0`;
        }

        const resIndex = this.getResourceIndex(RID);

        if(resIndex == -1) {
            return `不存在${RID}资源`;
        }
        
        // 请求数量大于该资源的最大值，则报错
        if(numUnits > this.resources[resIndex].totalUnits) {
            return `请求数量超出该资源所拥有最大值`;
        }

        const currentlyRunning = this.currentProcess;
        if(numUnits <= this.resources[resIndex].availableUnits) {
            this.resources[resIndex].availableUnits -= numUnits;
            this.processes[currentlyRunning].holdResources[resIndex] += numUnits;
        } else {
            this.processes[currentlyRunning].requestedResources[resIndex] += numUnits;
            this.processes[currentlyRunning].type = State.BLOCKED;
            this.processes[currentlyRunning].list = RID;
            const p = this.processes[currentlyRunning].priority;
            this.readyList[p].remove(this.processes, currentlyRunning);
            this.resources[resIndex].waitingList.insert(this.processes, currentlyRunning);
        }

        return this.scheduler();
    }

    /**
     * 释放所给定数目的指定资源
     * @param RID 资源类型
     * @param numUnits 释放数目
     * @return 当前运行进程
     */
    release(RID, numUnits) {
        if(numUnits <= 0) {
            return `释放资源的数量要大于0`;
        }

        const resIndex = this.getResourceIndex(RID);
        const currentlyRunning = this.currentProcess;

        if(resIndex == -1) {
            return `不存在${RID}资源`;
        }
        
        // 如果我们释放一个该进程未持有的资源，则报错
        if(this.processes[currentlyRunning].holdResources[resIndex]) {
            return `当前进程未持有该资源`;
        }

        if(numUnits > this.processes[currentlyRunning].holdResources[resIndex]) {
            return `释放资源数量超出该进程所持有数量`;
        }

        this.resources[resIndex].availableUnits += numUnits;

        this.processes[currentlyRunning].holdResources[resIndex] -= numUnits;

        checkResourceGranting(resIndex);

        return this.scheduler();
    }

    /**
     * 调度下一个运行的process
     * @return 当前运行进程
     */
    scheduler() {
        const p = this.highestPriorityProcess();
        if(this.processes[p].priority > this.processes[this.currentProcess].priority || this.processes[this.currentProcess].type != State.RUNNING || !this.processes[this.currentProcess].used) {
            this.currentProcess = p;
            this.processes[this.currentProcess].type = State.RUNNING;
        }

        return this.processes[this.currentProcess].PID;
    }
    
    /**
     * 获取等待队列中优先级最高的进程
     * @return 等待队列中优先级最高的进程的索引
     */
     highestPriorityProcess() {
         let processIndex = -1;
         for(let i = 2; i >=0; i--) {
             if(this.readyList[i].head != -1) {
                 processIndex = this.readyList[i].head;
                 break;
             }
         }
         return processIndex;
     }

     /**
      * 根据RID，返回资源索引
      * @param RID 资源名
      * @return 资源索引
      */
      getResourceIndex(RID) {
        let resIndex;
		// The RID determines the index of the resource in the resources array.
        switch (RID){
            case "R1":
                resIndex = 0;
                break;
            case "R2":
                resIndex = 1;
                break;
            case "R3":
                resIndex = 2;
                break;
            case "R4":
                resIndex = 3;
                break;
            default:
                resIndex = -1;
                break;
        }
        return resIndex;
      }

      /**
       * 模拟硬件中断
       * @return 当前执行进程
       */
      timeout() {
          const p = this.processes[this.currentProcess].priority;
          this.readyList[p].remove(this.processes, this.currentProcess);
          this.processes[this.currentProcess].type = State.READY;
          this.readyList[p].insert(this.processes, this.currentProcess);

          return this.scheduler();
      }

      /**
       * 找出指定进程最近创建的子进程
       * @param processIndex 指定的进程索引
       * @return 指定进程最近创建的子进程
       */
      findYoungestChild(processIndex) {
          let currentProcess = this.processes[processIndex].child;
          let previousProcess = -1;
          while(currentProcess != -1) {
              previousProcess = currentProcess;
              currentProcess = this.processes[currentProcess].youngerSibling;
          }
          return previousProcess;
      }

      /**
       * 检查资源是否满足等待队列中进程的请求，满足则授予资源(FIFO)
       * @param resIndex 资源索引
       */
      checkResourceGranting(resIndex) {
        let headProcess = this.resources[resIndex].waitingList.head;
        while(headProcess != -1 && this.resources[resIndex].availableUnits >= this.processes[headProcess].requestedResources[resIndex]) {
            this.resources[resIndex].availableUnits -= this.processes[headProcess].requestedResources[resIndex];
            this.processes[headProcess].holdResources[resIndex] += this.processes[headProcess].requestedResources[resIndex];
            this.processes[headProcess].requestedResources[resIndex] -= this.processes[headProcess].requestedResources[resIndex];

            this.resources[resIndex].waitingList.remove(this.processes, headProcess);
            this.processes[headProcess].type = State.READY;
            this.processes[headProcess].list = 'RL';
            const p = this.processes[headProcess].priority;
            this.readyList[p].insert(this.processes, headProcess);

            headProcess = this.resources[resIndex].waitingList.head;
        }
      }
}

module.exports =  ProcessAndResourceManager;