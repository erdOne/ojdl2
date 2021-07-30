export class Queue {
  constructor(l, fn) {
    this.tail = this.head = null;
    this.size = 0;
    this.requestFunction = fn;
    this.limit = l;
    this.free = Array.from({ length: l }).map((i, j)=>j);
  }

  setLimit(l) {
    for (var i = this.limit; i < l; i++)
      this.free.push(i);
    this.limit = l;
  }

  enqueue(x) {
    var a = { value: x };
    if (!this.size)
      this.tail = this.head = a;
    else {
      this.tail.rear = a;
      this.tail = a;
    }
    this.size++;
  }

  dequeue() {
    this.size--;
    var a = this.head;
    this.head = a.rear;
    return a.value;
  }

  request() {
    return new Promise((res, rej) => {
      this.enqueue(res);
      this.tryResolveRequest().catch(rej);
    });
  }

  async tryResolveRequest() {
    if (this.size === 0) return;
    var id;
    do if (!this.free.length) return;
    else id = this.free.pop();
    while (id >= this.limit);
    //console.log("given boxid", id);
    this.dequeue()(await this.requestFunction(id, async ()=>{
      //console.log("retrieved boxid", id);
      this.free.push(id);
      await this.tryResolveRequest();
    }));
  }
}

import { spawn } from "child_process";

export function spawnP(...args) {
  const stdout_threshold = 1 << 25; // need to adjust when OLE implemented
  const stderr_threshold = 1 << 25;
  return new Promise((res, rej)=>{
    // console.log(args);
    var proc = spawn(...args);
    var obj = {
      pid: proc.pid,
      stdout: "",
      stderr: ""
    };
    proc.stdout.on("data", data => {
      // console.log("stdout", data.length);
      if (obj.stdout.length + data.length >= stdout_threshold) {
        // OLE
        obj.stderr = "!!! Output Limit Exceed !!!\n";
      } else {
        obj.stdout += data;
      }
    });
    proc.stderr.on("data", data => {
      // console.log("stderr", data.length);
      obj.stderr += data;
      if (obj.stderr.length >= stderr_threshold) {
        obj.stderr = obj.stderr.substr(0, stderr_threshold);
        obj.stderr += "...";
      }
    });
    proc.stderr.on("error", error => { obj.error = error; });
    proc.on("close", (status, signal) => res({ status, signal, ...obj }));
    proc.on("error", (status, signal) => rej({ status, signal, ...obj }));
  });
}

export function ord(x) {
  x = parseInt(x) % 100;
  if (x >= 10 && x <= 20) return x + "th";
  switch (x % 10) {
    case 1: return x + "st";
    case 2: return x + "nd";
    case 3: return x + "rd";
    default: return x + "th";
  }
}

export function tryfork(process, msg) {
  if (process.status)
    throw [msg, process.status, String(process.stderr)];
}

function wait(t) {
  return new Promise(res => setTimeout(res, t));
}

export async function doWhile(prom, pred) {
  var result = await prom();
  if (!pred(result)) return result;
  await wait(1000);
  return doWhile(prom, pred);
}
