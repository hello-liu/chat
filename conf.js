// 配置文件
exports.http_port = 8001
exports.socket_port = 8002

exports.pg_conf = {
    //pg的数据库配置信息
    host: '118.89.21.131',
    port: 5432,
    database: 'chat',
    user: 'chat',
    password: 'chat',
    //连接池
    max: 2000,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
}