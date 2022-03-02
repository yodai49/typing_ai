var loadPfnw=performance.now();//ページが開かれた時間を記録しておく
var loadedPfnw=-1,loadingCount=0;

// ページの読み込みを待つ
var bgm;

function setSounds(){//サウンドのセットを行う
    bgm = [ //BGM
        new Howl({src:['./sound/Battle_maniacs.mp3'],
                loop:true,
                volue:0.5,
                onload:(e)=>{imgLoadedCnt++}}),
        new Howl({src:['./sound/Cyber_Story.mp3'],
                loop:true,
                volue:0.5,
                onload:(e)=>{imgLoadedCnt++}}),
        new Howl({src:['./sound/Daily_News.mp3'],
                loop:true,
                volue:0.5,
                onload:(e)=>{imgLoadedCnt++}}),
        new Howl({src:['./sound/DETROIT_BEAT.mp3'],
                loop:true,
                volue:0.5,
                onload:(e)=>{imgLoadedCnt++}}),
        new Howl({src:['./sound/Equal_Heavy_Status.mp3'],
                loop:true,
                volue:0.5,
                onload:(e)=>{imgLoadedCnt++}}),
        new Howl({src:['./sound/Fissure.mp3'],
                loop:true,
                volue:0.5,
                onload:(e)=>{imgLoadedCnt++}}),
        new Howl({src:['./sound/Impulse_Crush.mp3'],
                loop:true,
                volue:0.5,
                onload:(e)=>{imgLoadedCnt++}}),
        new Howl({src:['./sound/Rime_on_Trees.mp3'],
                loop:true,
                volue:0.5,
                onload:(e)=>{imgLoadedCnt++}}),
    ]
}

window.addEventListener('load', init); //ロードイベント登録
window.addEventListener('DOMContentLoaded', function(){ //クリックイベント登録
    ctx2d=document.getElementById("myCanvas").getContext("2d");
    ctx2dImg=document.getElementById("myCanvas2").getContext("2d");
    ctx2dSt=document.getElementById("myCanvas2_5").getContext("2d");
    ctx2dCr=document.getElementById("myCanvas2_3").getContext("2d");
    ctx2dSt2=document.getElementById("myCanvas3_5").getContext("2d");
    ctx2d2=document.getElementById("myCanvas4").getContext("2d");
    setSounds();
});
function drawLoadingCircle(x,y,size,t,speed,trans,isTopLevel){
    if(trans == undefined) trans=1;
    if(isTopLevel)ctx2dCr=ctx2d;
    ctx2dCr.lineWidth=size*0.08;
    var ani = [];
    for(var i = 0;i < 5;i++){
        ani[i] = (t/speed+0.5*Math.sin((t+i*130)/speed))*Math.PI;
    }

    ctx2dCr.strokeStyle=getRGBA(3,0,trans*0.8);
    ctx2dCr.beginPath();
    ctx2dCr.arc(x,y,size,Math.PI*0.3/10+ani[0],Math.PI*1/2+ani[0]);
    ctx2dCr.stroke();

    ctx2dCr.beginPath();
    ctx2dCr.strokeStyle=getRGBA(4,0,trans*0.8);
    ctx2dCr.arc(x,y,size,Math.PI*(1/2+0.8/10)+ani[1],Math.PI*(1-0.5/10)+ani[1]);
    ctx2dCr.stroke();

    ctx2dCr.beginPath();
    ctx2dCr.strokeStyle=getRGBA(5,0,trans*0.8);
    ctx2dCr.arc(x,y,size,Math.PI+ani[2],Math.PI*(2-0.2/5)+ani[2]);
    ctx2dCr.stroke();

    ctx2dCr.beginPath();
    ctx2dCr.strokeStyle=getRGBA(6,0,trans*0.8);
    ctx2dCr.arc(x,y,size*0.84,Math.PI*0.8/5+ani[3],Math.PI*3/5+ani[3]);
    ctx2dCr.stroke();

    ctx2dCr.beginPath();
    ctx2dCr.strokeStyle=getRGBA(7,0,trans*0.8);
    ctx2dCr.arc(x,y,size*0.84,Math.PI*3.8/5+ani[4],Math.PI*8/5+ani[4]);
    ctx2dCr.stroke();
    if(isTopLevel)ctx2dCr=document.getElementById("myCanvas2_3").getContext("2d");
}


function init() {
    //ローディング処理////////////////////////////////////////

    //2Dの処理
    ctx2d.width = WIDTH;
    ctx2d.height = HEIGHT;
    ctx2d.textBaseLine="top";
    //画像の格納
    for(var i = 0;i < 6;i++) backImg[i] = new Image();
    backImg[0].src="./img/back_menu.jpeg";
    backImg[1].src="./img/back_battle.jpeg";
    backImg[2].src="./img/back_battle2.jpeg";
    backImg[3].src="./img/back_win.jpeg";
    backImg[4].src="./img/back_lose.jpeg";
    backImg[5].src="./img/back_avator.jpeg";
    coinImg=new Image();
    coinImg.src="./img/coin.png";
    coinImg.onload=()=>{imgLoadedCnt++;};
    arrowImg=new Image();
    arrowImg.src="./img/uparrow.png";
    arrowImg.onload=()=>{imgLoadedCnt++};
    pWinImg=new Image();
    pWinImg.src="./img/pwin.png";
    pWinImg.onload=()=>{imgLoadedCnt++};
    kWinImg=new Image();
    kWinImg.src="./img/kwin.png";
    kWinImg.onload=()=>{imgLoadedCnt++};
    nWinImg=new Image();
    nWinImg.src="./img/nwin.png";
    nWinImg.onload=()=>{imgLoadedCnt++};
    for(var i = 0;i < 7;i++) starImg[i] = new Image(),starImg[i].src="./img/star_" + i + ".png";
    for(var i = 0;i < backImg.length;i++) backImg[i].onload=()=>{imgLoadedCnt++};
    for(var i = 0;i < starImg.length;i++) starImg[i].onload=()=>{imgLoadedCnt++};
    for(var i  = 0;i < 7;i++){
        otherPartsImg[i] = new Image();
        if(i ==0){
            otherPartsImg[i].src = "./img/crown_silver.png";
        }  else if(i == 1){
            otherPartsImg[i].src = "./img/crown_gold.png";
        }else{
            otherPartsImg[i].src = "./img/sword" + (i-2) + ".png";
        }
        otherPartsImg[i].onload=()=>{imgLoadedCnt++;};
    }
    ctx2dImg.fillStyle="rgba(0,0,0,1)";
    ctx2dImg.fillRect(0,0,WIDTH,HEIGHT);    

    tick();

    function tick() {
        t=performance.now()-loadPfnw;
    
        //リセット処理
        ctx2d.clearRect(0,0,WIDTH,HEIGHT);
        ctx2d2.clearRect(0,0,WIDTH,HEIGHT);
    
        ctx2d.font="24px " + MAIN_FONTNAME;
        if(scene!=0){
            ctx2d.fillStyle=getRGBA(2,0,1);
            ctx2d.fillText("ERROR",(WIDTH-ctx2d.measureText("ERROR").width)/2,HEIGHT/2);
        }else if(loadingCount){
            ctx2d.fillStyle=getRGBA(2,0,1);
            ctx2d.fillText("LOADED!",(WIDTH-ctx2d.measureText("LOADED!").width)/2,HEIGHT/2);
        } else{
            ctx2d.fillStyle=getRGBA(2,1000,t);
            ctx2d.fillText("LOADING",(WIDTH-ctx2d.measureText("LOADING").width)/2,HEIGHT/2);
        }
        drawLoadingCircle(WIDTH/2,HEIGHT/2,100,t,1000,1);
        if(DEBUG_MODE) SCENE_ANI=100;
        if(imgLoadedCnt!=IMG_CNT || sceneAni || performance.now() - sceneAni < SCENE_ANI*2.5) requestAnimationFrame(tick);
    }
}