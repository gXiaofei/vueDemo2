// 加载LowDB

const path = window.require('path');
const low = require('lowdb');
const LocalStorage = require('lowdb/adapters/LocalStorage');
const adapter = new LocalStorage('transferdb.json');
const db = low(adapter);
db.defaults({ uploadList: [], downloadList: [], doneList: [] }).write();

export default db;
