var util = require('../util/util')
const uuidv1 = require('uuid/v1');


//添加用户
exports.add = function(req, res, body){
    //tin
    // util.info("add user")
    const pool = util.getPool();
    (async () => {
        
        const client = await pool.connect()

        try {
            await client.query('begin')
            const sql = "insert into tb_sys_user(dept_id, nickname, sex, age, pwd, "
                +"account, phone, email,idnumber, address, "
                +"money, integral, head, flag, create_time, "
                +"remark)"
                +"values ($1, $2, $3, $4, $5, "
                +"$6, $7, $8, $9, $10, "
                +"0, 0, $11, '0', now(), "
                +"$12 )";
            const params = [body.deptId, body.nickname, body.sex, body.age, body.pwd, 
                body.account, body.phone, body.email, body.idnumber, body.address, 
                body.head, 
                body.remark]
            await client.query(sql, params)
            await client.query('commit')
            res.end(`{"code":"ok","msg":"添加成功！"}`)

        } catch (e) {
            await client.query('rollback')
            throw e
        } finally {
            client.release()
        }
    })().catch(e =>{
        res.end(`{"code":"error","msg":"添加失败！"}`);
        console.error(e.stack);
    })

}

//删除用户
exports.del = function(req, res, body){
    //tin
    util.info("del user")

    res.end("del user")
}

//登录
exports.login = function(req, res, body){
    //tin
    util.info("login")

    const pool = util.getPool();
    (async () => {
        
        const client = await pool.connect()

        try {
            await client.query('begin')
            const sql = "select * from tb_sys_user where account = $1";
            const params = [body.user_name]
            var result = await client.query(sql, params)


            var rows = result.rows;
            if(rows.length < 1){
                res.end(`{"code":"error","msg":"用户名不存在！"}`)
            }else{
                var row = rows[0];
                if(row.pwd == body.password){
                    //记录session
                    var token = uuidv1().replace(/-/g,"")
                    const sql = "insert into tb_sys_session(token,value ) values ($1,$2)"
                    const params = [token,row]
                    var result = await client.query(sql, params)

                    var back = {"code":"ok","msg":"登录成功！","token":token,"userInfo":row}
                    res.end( util.toStringNoPwd(back) )
                }else{
                    res.end(`{"code":"error","msg":"密码错误！"}`)
                }
            }

            await client.query('commit')
        } catch (e) {
            await client.query('rollback')
            throw e
        } finally {
            client.release()
        }
    })().catch(e =>{
        res.end(`{"code":"error","msg":"服务器异常！"}`);
        console.error(e.stack);
    })
    
}

//权限验证
exports.has = async function(token,method){
    //tin
    util.info("has")

    var back = null

    const pool = util.getPool();
    await (async () => {

        const client = await pool.connect()

        try {
            await client.query('begin')
            const sql = "select * from tb_sys_session where token = $1";
            const params = [token]
            var result = await client.query(sql, params)

            await client.query('commit')

            var rows = result.rows;
            if(rows.length < 1){
                back = `{"code":"error","msg":"无效的token！"}`
            }


        } catch (e) {
            await client.query('rollback')
            throw e
        } finally {
            client.release()
        }
    })().catch(e =>{
        back = `{"code":"error","msg":"服务器异常！"}`;
        console.error(e.stack);
    })
    return back

}