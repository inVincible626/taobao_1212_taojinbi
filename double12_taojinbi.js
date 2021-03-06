//最大执行次数
var MAX_EPOCH = 64

//主题关键字匹配
var REG_STRING = "去逛双|逛高比例|逛猜你喜|逛淘|逛逛大牌|逛好店领|逛聚划算|逛一逛|搜一搜|浏览|来拍卖|看|天猫国际|小鸡|逛健康|逛大家|欢乐造12|逛优质|逛苏"

//点击控件
function btn_click(x) { if (x) x.click() }

//点击控件所在坐标
function click_position(x) { click(x.bounds().centerX(), x.bounds().centerY()) }

//淘金币10秒任务是否完成
function finished10s() {
    let x = textContains('浏览以下商品').findOne(5)
    return x && x.parent().childCount() > 6
}


function assure_click(btn_x) {
    for (let i = 0; i < 3; i++) {
        if (btn_x.click()) break
        sleep(500)
    }
}

//等待sec秒，有完成提示后立即返回
function wait(sec) {
    while (sec--) {
        let a1 = textMatches('点我领取奖励|任务已完成|任务已经完成|任务完成').findOne(5)
        let a10 = finished10s()
        let a = descMatches('任务完成|快去领奖吧').findOne(1000)
        if (a1 || a10 || a) {
            console.log('到时返回' + a1 + ' ' + a10 + ' ' + a); break
        }
    }
}

//根据正则表达式获取任务
function get_task(reg_str) {
    textMatches('累计任务奖励|今日任务').findOne(5000);
    for (let ii = 0; ii < 2; ii++) {
        let list_x = text('去完成').find()
        let reg = new RegExp(reg_str)
        for (let i = 0; i < list_x.length; i++) {
            txt = list_x[i].parent().child(0).child(0).text() //主标题
            //console.log(txt)
            if (reg.test(txt)) {
                console.log(txt)
                toast(txt)
                return list_x[i]
            }
        }
        scrollDown(0);sleep(1000)
    }
    return null
}

//执行简单的浏览任务
function do_simple_task(sec) {
    for (let i = 0; i < MAX_EPOCH; i++) {
        let btn_todo = get_task(REG_STRING)
        if (!btn_todo) break
        assure_click(btn_todo); wait(sec); back(); sleep(1000);
        click('残忍离开'); click('回到淘宝')
        btn_click(textContains('领取').findOne(1500))
    }
    console.log('简单浏览任务，已经完成');
}

//水果农场任务
function fruit_farm_task() {
    console.log('农场领水果任务')
    let btn_todo = text('去施肥').findOne(1000)
    if (!btn_todo) {
        btn_todo = get_task('农场')
        if (!btn_todo) return
    }
    btn_todo.click(); sleep(8000)
    //获取右窗体
    let right_window = idContains('4404179171').findOne(3000)
    let right_window_bounds = right_window.bounds()
    //获取并点击领取肥料的按钮
    x = right_window_bounds.left + right_window_bounds.width() / 2
    y = right_window_bounds.bottom - right_window_bounds.height() / 2
    click(x, y); sleep(1000)
    btn_click(text('去施肥，赚更多肥料').findOne(1000))
    //点击施肥按钮
    x = right_window_bounds.left
    y = right_window_bounds.bottom - right_window_bounds.height() / 3
    click(x, y); sleep(3000); back()
    btn_click(text('领取奖励').findOne(2000))
}


//淘宝成就签到
function achievement_signin_task() {
    let btn_todo = get_task('淘宝成就')
    if (!btn_todo) return
    btn_todo.click()
    click_position(text('月度账单').findOne(3000))
    sleep(1500); back(); sleep(1000); back()
    btn_click(text('领取奖励').findOne(1000))
}

//签到领话费
function signin_phonecharge_task() {
    let btn_todo = get_task('签到领话费')
    if (!btn_todo) return
    btn_todo.click()
    btn_click(text('立即领取').findOne(10000))
    sleep(9000); back();
    btn_click(text('领取奖励').findOne(1000))
}

//掷色子任务
function dice_task() {
    let btn_todo = get_task('淘宝人生逛街领能量')
    if (!btn_todo) return
    btn_todo.click()
    sleep(12000)
    click(device.width * 0.3, device.height * 0.62)
    sleep(1000)
    console.log(click(device.width * .48, device.height * 0.62))
    //click(device.width * .48, device.height * 0.68)
    sleep(3000); back(); sleep(1000);
    click(device.width * .48, device.height * 0.62)
    //click(device.width * .48, device.height * 0.58)
    btn_click(text('领取奖励').findOne(1500))
}

//主函数
function main() {
    btn_click(text('领欢乐币').findOne(500))
    do_simple_task(18)
    fruit_farm_task()
    if (text('今日任务').findOne(500)) {  //下面是淘金币特有的任务
        signin_phonecharge_task()
        dice_task()
        achievement_signin_task()
    }
}
main()
