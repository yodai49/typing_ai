var loadPfnw=performance.now();//ページが開かれた時間を記録しておく
var loadedPfnw=-1,loadingCount=0;

// ページの読み込みを待つ

window.addEventListener('load', init); //ロードイベント登録
window.addEventListener('DOMContentLoaded', function(){ //クリックイベント登録
    ctx2d=document.getElementById("myCanvas").getContext("2d");
    ctx2dImg=document.getElementById("myCanvas2").getContext("2d");
    window.addEventListener("keydown", function(e){

    });
});

function getRGBA(col,T,t,r,g,b){
    // 色の指定に使う関数　Tは点滅の周期(0で点滅なし)、tはカウント用、固定透明度 colに-1を指定するとr,g,bが有効
    const COLSET = [[0,0,0], //BLACK
                    [15,15,25], // DARK GRAY BLUE
                    [240,240,240],// WHITE
                    [160,25,15],//DEEP RED
                    [107,76,0], //黄土色
                    [111,28,3],//茶色
                    [83,10,140],//紫色
                    [255,234,145],//クリーム色
                    [180,30,20]]; //やや明るい赤
    if(col>=0){
        r=COLSET[col][0];
        g=COLSET[col][1];
        b=COLSET[col][2];
    }
    if(T){
        return "rgba("  + r + "," + g + "," + b + "," + (0.4+0.3*Math.sin(t/T*Math.PI*2)) + ")";
    } else{
        return "rgba("  + r + "," + g + "," + b + ","+t+")";
    }
}
function processShowData(data){//データ表示時にNaNなどが表示されないようにする関数
    if(isNaN(data) || (data == undefined) || (data == null)) return "---";
    return data;
}
function drawLoadingCircle(x,y,size,t,speed){
    ctx2d.lineWidth=size*0.08;
    var ani = [];
    for(var i = 0;i < 5;i++){
        ani[i] = (t/speed+0.5*Math.sin((t+i*130)/speed))*Math.PI;
    }

    ctx2d.strokeStyle=getRGBA(3,0,0.8);
    ctx2d.beginPath();
    ctx2d.arc(x,y,size,Math.PI*0.3/10+ani[0],Math.PI*1/2+ani[0]);
    ctx2d.stroke();

    ctx2d.beginPath();
    ctx2d.strokeStyle=getRGBA(4,0,0.8);
    ctx2d.arc(x,y,size,Math.PI*(1/2+0.8/10)+ani[1],Math.PI*(1-0.5/10)+ani[1]);
    ctx2d.stroke();

    ctx2d.beginPath();
    ctx2d.strokeStyle=getRGBA(5,0,0.8);
    ctx2d.arc(x,y,size,Math.PI+ani[2],Math.PI*(2-0.2/5)+ani[2]);
    ctx2d.stroke();

    ctx2d.beginPath();
    ctx2d.strokeStyle=getRGBA(6,0,0.8);
    ctx2d.arc(x,y,size*0.84,Math.PI*0.8/5+ani[3],Math.PI*3/5+ani[3]);
    ctx2d.stroke();

    ctx2d.beginPath();
    ctx2d.strokeStyle=getRGBA(7,0,0.8);
    ctx2d.arc(x,y,size*0.84,Math.PI*3.8/5+ani[4],Math.PI*8/5+ani[4]);
    ctx2d.stroke();
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
    tick();

    function tick() {
        t=performance.now()-loadPfnw;
    
        //リセット処理
        ctx2d.clearRect(0,0,WIDTH,HEIGHT);
    
        ctx2d.fillStyle=getRGBA(0,0,t);
        ctx2d.fillStyle="rgba(0,0,0,1)";
        ctx2d.fillRect(0,0,WIDTH,HEIGHT);
    
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
        drawLoadingCircle(WIDTH/2,HEIGHT/2,100,t,1000);
        if(DEBUG_MODE) SCENE_ANI=100;
        if(imgLoadedCnt!=IMG_CNT || sceneAni || performance.now() - sceneAni < SCENE_ANI*2.5) requestAnimationFrame(tick);
    }
}