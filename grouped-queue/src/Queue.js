
/**
 * 每个子任务组的队列
 */
function SubQueue() {
  this.__queue__ = [];
}

SubQueue.prototype.push = function(task) {
  this.__queue__.push(task);
}

SubQueue.prototype.shift = function() {
  return this.__queue__.shift();
}

SubQueue.prototype.run = function(skip, done) {
  if (this.__queue__.length === 0) return skip();
  this.shift()(done);
}

module.exports = Queue;

/**
 * 带有分组的任务队列
 * 
 * @param {*} subQueues 
 */
function Queue(subQueues) {
  // 去重
  this.subQueues = Array.from(new Set(subQueues));
  this.__queue__ = {};
  this.running = false;

  this.subQueues.forEach((queueName) => {
    this.__queue__[queueName] = new SubQueue();
  });
}

/**
 * 
 * @param {*} name 
 * @param {*} task 
 */
Queue.prototype.add = function(queueName, task) {
  if (typeof queueName !== 'string') {
    task = queueName;
    queueName = 'default';
  }

  this.__queue__[queueName].push(task);
  // 为了add完成之后，再全部执行，所有这里采用了异步的方式执行
  setTimeout(this.run.bind(this, queueName))
}

Queue.prototype.run = function(queueName) {
  console.log(queueName)
  if (this.running) return;
  this.running = true;
  this.exec(() => {
    this.running =false;
  });
}

Queue.prototype.exec = function(done) {
  var pointer = -1;
  var queueName = this.subQueues;
  var next = function next() {
    if (!this.running) return done();
    pointer++;
    if (pointer >= queueName.length) return done();
    var currentSubQueue = this.__queue__[queueName[pointer]];
    currentSubQueue.run(next.bind(this), this.exec.bind(this, done));
  }.bind(this);

  next();
}


