class List {
    // 构造函数 创建一个空的List, 
    constructor() {
        // List中第一个进程的索引 头指针
        this.head = -1;
    }
    
    // 链表的插入
    insert(processes, processIndex) {
        if(this.head == -1) {
            this.head = processIndex;
        } else {
            // 链表的插入
            let currentProcess = this.head;
            while(processes[currentProcess].next != -1) {
                currentProcess = processes[currentProcess].next;
            }
            processes[currentProcess].next = processIndex;
        }
    }

    // 链表的移除
    remove(processes, processIndex) {
        console.log(.insert)
    }
}

const list = new List();
list.remove();