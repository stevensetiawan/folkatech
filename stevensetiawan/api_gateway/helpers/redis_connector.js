const Redis = require('ioredis');

const redis = new Redis({
    host: process.env.REDIS_HOST,//redisConfig.host, //
    port: process.env.REDIS_PORT,//redisConfig.port, //
    //password: redisConfig.password,//redisConfig.password, //
    // db: 1
});

const publisher = new Redis({
    host: process.env.REDIS_HOST,//redisConfig.host, //
    port: process.env.REDIS_PORT,//redisConfig.port, //
    // password: process.env.REDIS_PASS,//redisConfig.password, //
    // db: 2
})

module.exports = {
    get: async function(key){
        let result = null
        let error = null
        try{
            result = await redis.get(key);
        } catch (error) {
            console.log(error)
        }
        return [result, error]
    },
    set: async function(key, value, exp){
        let result = false
        let error = null
        try {
            await redis.set(key, value, 'EX', exp);
            result = true
        } catch (error) {
            console.log(error)
        }
        return [result, error]
    },
    lpushx: async function(key, value){
        let result = false
        let error = null
        try {
            await redis.lpushx(key, value);
            result = true
        } catch (error) {
            console.log(error)
        }
        return [result, error]
    },
    lpush: async function(key, value){
        let result = false
        let error = null
        try {
            await redis.lpush(key, value);
            result = true
        } catch (error) {
            console.log(error)
        }
        return [result, error]
    },
    lrange: async function(key, start_arr, end_arr){
        let result = false
        let error = null
        try {
            result = await redis.lrange(key, start_arr, end_arr);
        } catch (error) {
            console.log(error)
        }
        return [result, error]
    },
    flushdb: async function(){
        let result = false
        let error = null
        try {
            await redis.flushdb();
            result = true
        } catch (error) {
            console.log(error)
        }
        return [result, error]
    },
    publish: async function(key, message){
        publisher.publish(key, JSON.stringify(message))
    }
}
