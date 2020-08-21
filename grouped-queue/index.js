const Queue = require('./src/Queue')

/**
 * 1. 任务一: 整理行头
 *  . 起床
 *  . 刷牙洗脸
 *  . 吃早餐
 * 2. 任务二： 公司工作
 *  . 打开电脑
 *  . 工作
 * 3. 回家
 */
const TASK_ONE = 'PREPARE';
const TASK_TWO = 'COMPANY';
const TASK_END = 'END';

const queue = new Queue([TASK_ONE, TASK_TWO, TASK_END])

queue.add(TASK_ONE, (next) => {
  console.log('起床')
  next();
});
queue.add(TASK_ONE, (next) => {
  console.log('刷牙洗脸')
  next();
});
queue.add(TASK_ONE, (next) => {
  console.log('吃早餐')
  next();
});

queue.add(TASK_TWO, (next) => {
  console.log('打开电脑')
  next();
});
queue.add(TASK_TWO, (next) => {
  console.log('工作')
  next();
});

queue.add(TASK_END, (next) => {
  console.log('回家')
  next();
});