var conns = require('./conns')
var util = require('../moss/util/util')

//世界的人
var world = new Map();
//默认记录几条历史记录
var worldMsg = [];
var worldMsgSize = 10;

//房间
var rooms = new Map();

//websocket 回调处理方法
exports.message = function (message, ws ) {
    
    var method = message.method
    switch(method){
        case 'toWorld':
            //世界消息
            toWorld(message,ws)
            break;
        case 'toRoom':
            //房间消息
            toRoom(message,ws)
            break;
        case 'toPersonal':
            //个人消息
            toPersonal(message,ws)
            break;
        case 'inWorld':
            inWorld(message,ws)
            break;
        case 'inRoom':
            inRoom(message,ws)
            break;
        case 'logout':
            logout(message,ws)
            break;
        case 'login':
            login(message,ws)
            break;
        default :
            //不认识的消息
    }
}

function send (ws,message) {
    if(ws.readyState == 1){
        ws.send(message)
    }
}

var iw = {"method":"inWorld","name":"阿三"}
function inWorld(message,ws) {
    var name = message.name
    var wsId = ws.id
    ws.name = name
    world.set(wsId,ws)

    for(msg in worldMsg){
        sendWorld( worldMsg )
    }
    sendWorld("【"+name+"】加入聊天室！")
}

var ir = {"method":"inRoom","roomId":"room_1","name":"阿三"}
function inRoom(message,ws) {
    var roomId = message.roomId
    var name = message.name
    var wsId = ws.id

    var room = rooms.get(roomId)
    //不存在则创建房间
    if(!room){
        room = new Map();
        rooms.set(roomId,room )
    }
    room.set(wsId,ws)

    //加入到房间中
    ws.name = name
    world.set(wsId,ws)

    //发送加入信息
    for(value of room){
        var id = value[0]
        var s = value[1]
        send(s,"【"+name+"】加入聊天室！")
    }
}

var tw = {"method":"toWorld","msg":"hello world"}
function toWorld(message,ws) {

    var msg = message.msg
    var name = ws.name

    sendWorld("【"+name+"】" + msg)
}

function sendWorld( msg ) {
    if(worldMsg.length < worldMsgSize){
        worldMsg.push(msg);
    }else{
        worldMsg.shift()
        worldMsg.push(msg)
    }
    for(value of world){
        var id = value[0]
        var s = value[1]
        send(s,msg)
    }
}

var tr = {"method":"toRoom","msg":"hello room"}
function toRoom(message,ws) {

    var roomId = message.roomId
    var msg = message.msg
    var name = ws.name

    var room = rooms.get(roomId)
    //存在房间
    if(room){
        //发送加入信息
        for(value of room){
            var id = value[0]
            var s = value[1]
            send(s,"【"+name+"】"+msg)
        }
    }
}

function logout(message,ws) {
    var wsId = ws.id
    var name = ws.name;
    world.delete(wsId)

    for(value of world) {
        var id = value[0]
        var s = value[1]
        send(s,  "【"+name+"】退出聊天室！" )
    }
}

function login(message,ws) {

    var name = message.name
    ws.name = name
}



