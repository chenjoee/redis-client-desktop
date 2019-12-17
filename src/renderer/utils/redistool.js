var redis = require('redis');
var redisTool = {}

const EventEmitter = require('events');
const myEmitter = new EventEmitter();

redisTool.start = function (data) {

    var redisClient = {}

    console.log("redis 连接开始 ----")
    redisClient.client = redis.createClient(data.port, data.host);
    redisClient.client.on("error", function (error) {
        setTimeout(() => {
            start(data)
            console.log('redis 重连 ---- ');
        }, 3000)
        myEmitter.emit('error', error); //触发事
    })
    if (data.password) { //是否密码登录
        redisClient.client.auth(data.password, function (err) {
            console.error(err)
            return "error"
        });
    }
    redisClient.client.on('ready', function (err) {
        console.log('redis 连接成功 ---- ');
        myEmitter.emit('ready'); //触发事
    });


    /**
     *同步set set(key, value, expire, pexpireat)
     * @param key
     * @param value
     * @param expire 过期时间 可以字符串
     * @param pexpireat 是否使用毫秒
     * @returns {Promise<any>}
     */
    redisClient.set = function (key, value, expire, pexpireat) {
        return new Promise((resolve, reject) => {
            redisClient.client.set(key, value, function (err, result) {
                if (err) {
                    console.error(err)
                    myEmitter.emit('error', err); //触发错误事件
                    resolve({error: err})
                }
                if (expire) {
                    if (pexpireat) {
                        client.pexpire(key, parseInt(expire));
                    } else {
                        client.expire(key, parseInt(expire));
                    }
                }
                resolve({error: null})
            })
        })
    }
    /***
     * 异步set Exset(key, value, expire, pexpireat)
     * @param key
     * @param value
     * @param expire
     * @param pexpireat
     * @constructor
     */
    redisClient.Exset = function (key, value, expire, pexpireat) {
        redisClient.client.set(key, value, function (err, result) {
            if (err) {
                console.error(err)
                myEmitter.emit('error', err); //触发错误事件
            }
            if (expire) {
                if (pexpireat) {
                    client.pexpire(key, parseInt(expire));
                } else {
                    client.expire(key, parseInt(expire));
                }
            }
        })
    }

    /**
     *同步get get(key)
     * @param key
     * @returns {Promise<any>}
     */
    redisClient.get = function (key) {
        return new Promise((resolve, reject) => {
            redisClient.client.get(key, (err, value) => {
                if (err) {
                    myEmitter.emit('error', err); //触发错误事件
                    resolve({error: err});
                }
                resolve({error: null, result: value});
            });

        })
    }

    /**
     * 同步递减 值必须是数字 incr(key)
     * @param key
     * @returns {Promise<any>}
     */
    redisClient.incr = function (key) { //
        return new Promise((resolve, reject) => {
            redisClient.client.multi().incr(key).exec(function (err, reply) {
                if (err) {
                    myEmitter.emit('error', err); //触发错误事件
                    resolve({error: err})
                } else {
                    resolve({error: null})
                }
            });

        })
    }

    /***
     * 异步递减 值必须是数字 Exincr(key)
     * @param key
     * @constructor
     */
    redisClient.Exincr = function (key) { //递增 异步
        redisClient.client.multi().incr(key).exec(function (err, reply) {
            if (err) {
                myEmitter.emit('error', err); //触发错误事件
                console.error(err)
            }
        });
    }

    /**
     * 从尾部push List
     * @param key
     * @param value
     */
    redisClient.rpush = function (key, value) {
        return new Promise((resolve, reject) => {
            redisClient.client.rpush(key, value, function (err, res) {
                if (err) {
                    myEmitter.emit('error', err); //触发错误事件
                    resolve({error: err})
                } else {
                    resolve({error: null, result: res})
                }
            })
        })
    }

    /**
     * 异步新增list
     * @param key
     * @param value
     * @returns {Promise<any>}
     * @constructor
     */
    redisClient.Exrpush = function (key, value) {
        redisClient.client.rpush(key, value, function (err, res) {
            if (err) {
                myEmitter.emit('error', err); //触发错误事件
                console.error(err)
            }
        })
    }

    /**
     * 同步 删除list lrem(key, num, flag)
     * @param key
     * @param num 删除个数
     * @param flag 指定内容
     * @returns {Promise<any>}
     */
    redisClient.lrem = function (key, num, flag) {
        return new Promise((resolve, reject) => {
            redisClient.client.lrem(key, num, flag, function (err, res) {
                if (err) {
                    myEmitter.emit('error', err); //触发错误事件
                    resolve({error: err})
                } else {
                    resolve({error: null, result: res})
                }
            });
        })
    }

    /**
     * 异步删除list Exlrem (key, num, flag)
     * @param key
     * @param num
     * @param flag
     * @constructor
     */
    redisClient.Exlrem = function (key, num, flag) {
        redisClient.client.lrem(key, num || 1, flag, function (err, res) {
            if (err) {
                myEmitter.emit('error', err); //触发错误事件
                console.error(err)
            }
        });
    }


    /**
     *同步获取全部List
     * @param key
     * @param startSum 开始位数
     * @param stopSum  结束位数 -1为全部
     * @returns {Promise<any>}
     */
    redisClient.lrange = function (key, startSum, stopSum) { //获取全部List
        return new Promise((resolve, reject) => {
            redisClient.client.lrange(key, startSum || 0, stopSum || -1, function (err, res) {
                if (err) {
                    myEmitter.emit('error', err); //触发错误事件
                    resolve({error: err})
                } else {
                    resolve({error: null, result: res})
                }
            });

        })
    }

    /**
     * 同步获取hash
     * @param key
     * @returns {Promise<any>}
     */
    redisClient.hgetall = function (key) { //
        return new Promise((resolve, reject) => {
            redisClient.client.hgetall(key, function (err, res) {
                if (err) {
                    myEmitter.emit('error', err); //触发错误事件
                    resolve({error: err})
                } else {
                    resolve({error: null, result: res})
                }
            });
        })
    }
    /**
     *同步获取指定hash hget (hashkey, key)
     * @param key
     * @param value
     * @returns {Promise<any>}
     */
    redisClient.hget = function (hashkey, key) {
        return new Promise((resolve, reject) => {
            redisClient.client.hget(key, value, function (err, res) {
                if (err) {
                    myEmitter.emit('error', err); //触发错误事件
                    resolve({error: err})
                } else {
                    resolve({error: null, result: res})
                }
            });

        })
    }

    /**
     * 同步设置hash  hset(hashkey, key, value)
     * @param hashkey
     * @param key
     * @param value
     * @returns {Promise<any>}
     */
    redisClient.hset = function (hashkey, key, value) {
        return new Promise((resolve, reject) => {
            redisClient.client.hset(hashkey, key, value, function (err, res) {
                if (err) {
                    myEmitter.emit('error', err); //触发错误事件
                    resolve({error: err})
                } else {
                    resolve({error: null, result: res})
                }
            });
        })
    }
    /**
     * 异步设置hash Exhset(hashkey, key, value)
     * @param hashkey
     * @param key
     * @param value
     * @constructor
     */
    redisClient.Exhset = function (hashkey, key, value) {
        redisClient.client.hset(hashkey, key, value, function (err, res) {
            if (err) {
                myEmitter.emit('error', err); //触发错误事件
                console.error(err)
            }
        });

    }


    return redisClient

}

redisTool.event = myEmitter

export {
    redisTool
}