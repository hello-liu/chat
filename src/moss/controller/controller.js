var util = require('../util/util')
var user_service = require('../service/user_service')

//统一处理方法
exports.api = async function(req, res, body){
    // util.info(body)

    var method = body.method
    //鉴权
    var flag = await  check(body);
    if(flag != null){
        res.end(flag)
    }

    // 分发处理
    switch(method){
        //用户
        case 'user.add': user_service.add(req, res, body) ; break
        case 'user.del': user_service.del(req, res, body) ; break
        case 'user.login': user_service.login(req, res, body) ; break

        //其他
        default: res.end(`{"code":"error","msg":"方法不存在"}`)
    }

    async function check(body) {

        //默认能通过的方法
        var pass = ["user.login"]

        var method = body.method
        var token = body.token

        for(var m of pass){
            if( m == method ){
                return null
            }
        }
        if(!token){
            return `{"code":"error","msg":"缺少token参数！"}`
        }else{
            return await user_service.has(token,method)
        }
    }

}