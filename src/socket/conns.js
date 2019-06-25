var game = require('./game')
var util = require('../moss/util/util')

var id = 0 ;
//websocket 回调处理方法
exports.deal = function (ws,req) {
    
    ws.id = id++
    conns.set(ws.id,ws)
    util.info('conn:'+ws.id)

    //收到消息事件
    ws.on('message', function incoming(message) {
        try{
            game.message( JSON.parse(message) ,ws)
        }catch(e){
            console.log(e.stack)
        }
    });
    //关闭连接事件
    ws.on('close', function () {
        game.message( { method:"logout"  } ,ws)
        util.info('close:'+this.id)
    });
}

exports.

