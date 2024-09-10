import "./style.scss";
import "./ani.scss";
import axios from 'axios'
const wx = require('weixin-js-sdk')

declare global {
    interface window{
        addEventListener:()=>{}
    }
}

// 设置初始化高度
const bannerElement = document.querySelector('.banner') as HTMLDivElement
bannerElement.style.height = window.innerHeight + 'px'
const startTime = Date.now()

const closeLoading = function(){
    const loadingEl = document.querySelector('.loading') as HTMLDivElement
    loadingEl.classList.add('hide')
    setTimeout(()=>{
        loadingEl.remove();
        
    },200)
}

const heartScale = function(){
    const allHeart = document.querySelectorAll('.hearts img');
    const width = window.innerWidth
    const height = window.innerHeight
    setInterval(()=>{
        const randomIndex = Math.floor(allHeart.length*Math.random()) 
        const randomTop = Math.floor(height*Math.random())
        const randomLeft = Math.floor(width*Math.random())

        const focusEl = allHeart[randomIndex] as HTMLElement
        if(focusEl.classList.contains('active')){
            return false
        }
        // reset 
        focusEl.style.top = randomTop + 'px'
        focusEl.style.left = randomLeft + 'px'

        focusEl.classList.add('active')
        focusEl.onanimationend = ()=>{
            focusEl.onanimationend=()=>{
                focusEl.classList.remove('active')
            }
        }
    },400)
}
heartScale()

// 监听时间
const flowTimeListen = function(){
    const flow = [
        new Date('2024-10-02 00:00:00').getTime(),
        new Date('2024-10-02 08:00:00').getTime(),
        new Date('2024-10-02 09:00:00').getTime(),
        new Date('2024-10-02 10:00:00').getTime(),
        new Date('2024-10-02 11:00:00').getTime(),
        new Date('2024-10-02 12:00:00').getTime(),
    ]
    setInterval(()=>{
        const now = Date.now()
        const steps = document.querySelectorAll('.step')
        let active = false
        for(let i = steps.length-1;i>=0;i--){
            const stepEl = steps[i];
            const stepMaxTime = flow[i]
            stepEl.classList.remove('active')
            if(active){
                if(!stepEl.classList.contains('past')){
                    stepEl.classList.add('past')
                }
            }else if(now>stepMaxTime){
                if(!stepEl.classList.contains('active')){
                    stepEl.classList.add('active')
                    active = true
                }
            }
        }
    },1000)
}
flowTimeListen()

// 资源加载完成时移除loading
window.addEventListener('load',()=>{
    const endTime = Date.now()
    const minDuration = 2000
    if(endTime-startTime<minDuration){
        setTimeout(()=>{
            closeLoading()
            startElementInSight()
        },minDuration - (endTime-startTime))
    }else{
        closeLoading()
        startElementInSight()  

    }
})

const isInSight = function(img:HTMLElement) {
    const bound = img.getBoundingClientRect();
    const clientHeight = window.innerHeight;
    //如果只考虑向下滚动加载
    //const clientWidth = window.innerWeight;
    return bound.top <= clientHeight - 100; // +100延迟加载
}

const initElAniState = (el:Element)=>{
    if(!el.classList.contains('active-ani')){
        el.classList.add('active-ani')
    }
}

const startElementInSight = ()=>{
    let allWillAniEl = Array.from(document.querySelectorAll('.ready-ani'));
    // 两种监听方式
    if ('IntersectionObserver' in window) {
        const ob = new IntersectionObserver((changes) => {
            for (const change of changes) {
                if (0 < change.intersectionRatio && change.intersectionRatio <= 1) {
                    initElAniState(change.target);
                    ob.unobserve(change.target);
                }
            }
        })
        allWillAniEl.forEach((el:Element) => {
            ob.observe(el);
        })
    } else {
        (window as any).addEventListener('scroll',()=>{
            allWillAniEl.forEach((el:HTMLElement) => {
                if (isInSight(el)) {
                    initElAniState(el);
                }
            })
        })
    }

    // 直接进行一次判断
    allWillAniEl.forEach((el:HTMLElement) => {
        if (isInSight(el)) {
            initElAniState(el);
        }
    })
}
const query = location.search
const initWxConfig = function(res:any){
    const {appId,nonceStr,signature,timestamp} = res.data.data

    wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: appId, // 必填，公众号的唯一标识
        timestamp: timestamp, // 必填，生成签名的时间戳
        nonceStr: nonceStr, // 必填，生成签名的随机串
        signature: signature,// 必填，签名
        jsApiList: [
            // 'updateTimelineShareData',
            // 'updateAppMessageShareData',
            'onMenuShareTimeline',
            'onMenuShareAppMessage',
            'openLocation'
        ] // 必填，需要使用的JS接口列表
    });
  
}

axios.get(`https://llh.stelaino.top/wechat/signature-test?url=https://llh.stelaino.top/`).then(initWxConfig)




wx.ready(function () {      //需在用户可能点击分享按钮前就先调用
    const title = '赖龙辉&廖永萍婚礼邀请函'
    const link = 'https://blinkjun.github.io/wedding-invite/'
    const imageUrl = 'https://blinkjun.github.io/wedding-invite/img/HRQ11517.jpg'
    const desc = '欢迎您来参加我们的婚礼'

    wx.updateTimelineShareData({ 
      title:title , // 分享标题
      link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl:imageUrl , // 分享图标
    })
    wx.updateAppMessageShareData({ 
        title: title, // 分享标题
        desc: desc, // 分享描述
        link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: imageUrl, // 分享图标
    })
    wx.onMenuShareTimeline({
        title: title, // 分享标题
        link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: imageUrl, // 分享图标
    })
    wx.onMenuShareAppMessage({
        title: title, // 分享标题
        desc: desc, // 分享描述
        link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: imageUrl // 分享图标
    });
});


document.querySelector('.address-liao').addEventListener('click',()=>{
    wx.openLocation({
        latitude: 24.880055, // 纬度，浮点数，范围为90 ~ -90
        longitude: 114.84389, // 经度，浮点数，范围为180 ~ -180。
        name: '龙南市新欧段', // 位置名
        address: '江西省赣州市龙南市新欧段与农水段交叉口东南40米，新华商店往新欧段前行300米', // 地址详情说明
        scale: 15, // 地图缩放级别,整型值,范围从1~28。默认为最大
        infoUrl: 'https://map.baidu.com/poi/%E6%96%B0%E5%8D%8E%E5%95%86%E5%BA%97/@12784483.325065985,2849589.618896227,11.2z?uid=43ea272e4b7e5fa7465726cb&ugc_type=3&ugc_ver=1&device_ratio=2&compat=1&pcevaname=pc4.1&querytype=detailConInfo&da_src=shareurl' // 在查看位置界面底部显示的超链接,可点击跳转
    });
})

document.querySelector('.address-sunrise').addEventListener('click',()=>{
    wx.openLocation({
        latitude: 24.910531, // 纬度，浮点数，范围为90 ~ -90
        longitude: 114.82157, // 经度，浮点数，范围为180 ~ -180。
        name: '龙南市凯利亚德酒店', // 位置名
        address: '凯利亚德酒店(赣州龙南世界客家民俗文化城店)--金水大道500号', // 地址详情说明
        scale: 15, // 地图缩放级别,整型值,范围从1~28。默认为最大
        infoUrl: 'https://map.baidu.com/poi/%E5%87%AF%E9%87%8C%E4%BA%9A%E5%BE%B7%E9%85%92%E5%BA%97(%E8%B5%A3%E5%B7%9E%E9%BE%99%E5%8D%97%E4%B8%96%E7%95%8C%E5%AE%A2%E5%AE%B6%E6%B0%91%E4%BF%97%E6%96%87%E5%8C%96%E5%9F%8E%E5%BA%97)/@12782017.655,2846629.15,19z?uid=d662f5a40a0fe937283a9fdf&ugc_type=3&ugc_ver=1&device_ratio=2&compat=1&pcevaname=pc4.1&querytype=detailConInfo&da_src=shareurl' // 在查看位置界面底部显示的超链接,可点击跳转
    });
})

document.querySelector('.address-jun').addEventListener('click',()=>{
    wx.openLocation({
        latitude: 24.638228, // 纬度，浮点数，范围为90 ~ -90
        longitude: 114.650527, // 经度，浮点数，范围为180 ~ -180。
        name: '杨太马坪', // 位置名
        address: '赣州市龙南市杨村镇杨太村马坪', // 地址详情说明
        scale: 15, // 地图缩放级别,整型值,范围从1~28。默认为最大
        infoUrl: 'https://map.baidu.com/poi/%E9%BE%99%E5%8D%97%E5%8E%BF%E6%9D%A8%E6%9D%91%E9%95%87%E6%9D%A8%E5%A4%A7%E6%9D%91%E6%B0%91%E5%A7%94%E5%91%98%E4%BC%9A/@12762961.883133767,2815583.0574614783,12.82z?uid=745e06ae13e510e7932ca3fe&ugc_type=3&ugc_ver=1&device_ratio=2&compat=1&pcevaname=pc4.1&querytype=detailConInfo&da_src=shareurl' // 在查看位置界面底部显示的超链接,可点击跳转
    });
})
document.querySelector('.address-res').addEventListener('click',()=>{
    wx.openLocation({
        latitude: 24.638487, // 纬度，浮点数，范围为90 ~ -90
        longitude: 114.650527, // 经度，浮点数，范围为180 ~ -180。
        name: '杨太马坪祖厅', // 位置名
        address: '赣州市龙南市杨村镇杨太村马坪祖厅--杨太村委会进入内部路沿马路直行三百米', // 地址详情说明
        scale: 15, // 地图缩放级别,整型值,范围从1~28。默认为最大
        infoUrl: 'https://map.baidu.com/poi/%E9%BE%99%E5%8D%97%E5%8E%BF%E6%9D%A8%E6%9D%91%E9%95%87%E6%9D%A8%E5%A4%A7%E6%9D%91%E6%B0%91%E5%A7%94%E5%91%98%E4%BC%9A/@12762961.883133767,2815583.0574614783,12.82z?uid=745e06ae13e510e7932ca3fe&ugc_type=3&ugc_ver=1&device_ratio=2&compat=1&pcevaname=pc4.1&querytype=detailConInfo&da_src=shareurl' // 在查看位置界面底部显示的超链接,可点击跳转
    });
})


const musicBtn = document.querySelector('.play-toggle')
const btnPlay = musicBtn.querySelector('.play')
const btnMute = musicBtn.querySelector('.mute')
const player = document.querySelector('#audio') as HTMLAudioElement

musicBtn.addEventListener('click',()=>{
    if(player.paused){
        btnPlay.classList.remove('hide')
        btnMute.classList.add('hide')
        player.play()
    }else{
        player.pause()
        btnMute.classList.remove('hide')
        btnPlay.classList.add('hide')
    }
})
document.addEventListener('WeixinJSBridgeReady',()=>{
    player.play()
    btnPlay.classList.remove('hide')
    btnMute.classList.add('hide')
});







