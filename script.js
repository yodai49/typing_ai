var prls = [];//描画する平行四辺形の構造体の配列
function keypress(mykey,mykeycode){ //キー入力イベント

}

window.addEventListener('load', init); //ロードイベント登録
window.addEventListener('mousemove',function(e){ //マウスが動いた時に座標をセット
    mouseX=e.clientX-document.getElementById("myCanvas").getBoundingClientRect().left;
    mouseY=e.clientY-document.getElementById("myCanvas").getBoundingClientRect().top;
})
window.addEventListener('click',function(e){//クリックされた時に座標をセット
    clickX=mouseX;
    clickY=mouseY;
})
window.addEventListener('DOMContentLoaded', function(){ ///キー入力イベント登録
    window.addEventListener("keydown", function(e){
      keypress(e.key,e.keyCode);
    });
});
function drawMouseCursor(){ //マウスカーソルを描画する関数
    ctx2d.strokeStyle=getRGBA(1,600,t);
    if(mouseStatus) ctx2d.strokeStyle=getRGBA(3,600,t);
    ctx2d.fillStyle=getRGBA(2,0,0.5);
    ctx2d.beginPath();
    ctx2d.lineWidth=3;
    ctx2d.arc(mouseX,mouseY,10,0,Math.PI*2);
    ctx2d.stroke();
    ctx2d.fill();
}
function drawPrl(drawPrl){//平行四辺形を描画する関数
    ctx2d.lineWidth=6;
    var drawGrad=ctx2d.createLinearGradient(drawPrl.x2,drawPrl.y1,drawPrl.x1,drawPrl.y2);
    const PRL_COLSET=[[[215,213,228,0.7],[145,143,168,0.7],[225,223,238,0.7]],
            [[175,173,188,0.7],[125,123,138,0.7],[185,183,208,0.7]]];
    const FRAME_COLSET=[[20,23,45,0.8],[20,23,45,0.8]];
    const TEXT_COLSET=[[30,30,30],[30,30,30]];
    for(var i = 0;i < 3;i++){
        drawGrad.addColorStop(i/2+0.1*(i==1),'rgba(' + 
         (PRL_COLSET[drawPrl.hoverColSet][i][0]*drawPrl.hoverCounter+PRL_COLSET[drawPrl.colSet][i][0]*(10-drawPrl.hoverCounter))/10 + ',' +  
         (PRL_COLSET[drawPrl.hoverColSet][i][1]*drawPrl.hoverCounter+PRL_COLSET[drawPrl.colSet][i][1]*(10-drawPrl.hoverCounter))/10 + ',' +  
         (PRL_COLSET[drawPrl.hoverColSet][i][2]*drawPrl.hoverCounter+PRL_COLSET[drawPrl.colSet][i][2]*(10-drawPrl.hoverCounter))/10+ ',0.7)')
    }
    ctx2d.fillStyle=drawGrad;
    ctx2d.strokeStyle='rgba(' + 
    (FRAME_COLSET[drawPrl.hoverColSet][0]*drawPrl.hoverCounter+FRAME_COLSET[drawPrl.colSet][0]*(10-drawPrl.hoverCounter))/10 + ',' +  
    (FRAME_COLSET[drawPrl.hoverColSet][1]*drawPrl.hoverCounter+FRAME_COLSET[drawPrl.colSet][1]*(10-drawPrl.hoverCounter))/10 + ',' +  
    (FRAME_COLSET[drawPrl.hoverColSet][2]*drawPrl.hoverCounter+FRAME_COLSET[drawPrl.colSet][2]*(10-drawPrl.hoverCounter))/10+ ',0.8)';
    ctx2d.beginPath();
    ctx2d.moveTo((drawPrl.x1+drawPrl.x2)/2,drawPrl.y1);
    ctx2d.lineTo(drawPrl.x2,drawPrl.y1);
    ctx2d.lineTo(drawPrl.x2-(drawPrl.y2-drawPrl.y1)*0.3,drawPrl.y2);
    ctx2d.lineTo(drawPrl.x1,drawPrl.y2);
    ctx2d.lineTo(drawPrl.x1+(drawPrl.y2-drawPrl.y1)*0.3,drawPrl.y1);
    ctx2d.lineTo((drawPrl.x1+drawPrl.x2)/2,drawPrl.y1);
    ctx2d.stroke();
    ctx2d.fill();
    ctx2d.fillStyle='rgba(' + 
    (TEXT_COLSET[drawPrl.hoverColSet][0]*drawPrl.hoverCounter+TEXT_COLSET[drawPrl.colSet][0]*(10-drawPrl.hoverCounter))/10 + ',' +  
    (TEXT_COLSET[drawPrl.hoverColSet][1]*drawPrl.hoverCounter+TEXT_COLSET[drawPrl.colSet][1]*(10-drawPrl.hoverCounter))/10 + ',' +  
    (TEXT_COLSET[drawPrl.hoverColSet][2]*drawPrl.hoverCounter+TEXT_COLSET[drawPrl.colSet][2]*(10-drawPrl.hoverCounter))/10+ ',1)';
    ctx2d.font=(drawPrl.y2-drawPrl.y1)*0.34 + "pt " + JAPANESE_FONTNAME;
    ctx2d.fillText(drawPrl.text,(drawPrl.x2+drawPrl.x1)/2-ctx2d.measureText(drawPrl.text).width/2,drawPrl.y1+(drawPrl.y2-drawPrl.y1)*0.62);
}
function drawTitleScene(){ ///タイトル画面の描画関数
    ctx2d.fillStyle=getRGBA(1,0,1);//黒背景
    ctx2d.fillRect(0,0,WIDTH,HEIGHT);
    drawLoadingCircle(WIDTH-230,230,210,t/3.2,1000);//////////動く丸
    drawLoadingCircle(150,150,130,t/3,1000);
    drawLoadingCircle(50,HEIGHT-60,250,t/2.7,1000);
    ctx2d.font="55px " + MAIN_FONTNAME;//////////タイトル文字
    ctx2d.fillStyle=getRGBA(2,0,1);
    ctx2d.fillText("A V A - T Y P E",(WIDTH-ctx2d.measureText("A V A - T Y P E").width)/2,HEIGHT/2-30);
    ctx2d.font="25px " + JAPANESE_FONTNAME;
    ctx2d.fillText("アバタイプ",(WIDTH-ctx2d.measureText("アバタイプ").width)/2,HEIGHT/2+40);
    drawPrl(prls[0]);
}
function drawMenu(){
    ctx2d.fillStyle="rgba(175,175,225,0.2)";
    ctx2d.fillRect(30+(t/2-(Math.floor(t/2/960)*960)),50,60,10);
    drawPrl(prls[0]);
}
function processMouseEvent(){ //平行四辺形ボタンに対してのホバー処理
    mouseStatus=0;
    for(var i = 0;i < prls.length;i++){
        if(mouseY>prls[i].y1 && mouseY<prls[i].y2 && mouseX>prls[i].x1+(prls[i].y2-prls[i].y1)*0.3 && mouseX<prls[i].x2-(prls[i].y2-prls[i].y1)*0.3){
            prls[i].hoverCounter++;
            if(prls[i].hoverCounter>10) prls[i].hoverCounter=10;
            mouseStatus=1;
        } else{
            prls[i].hoverCounter--;
            if(prls[i].hoverCounter<0) prls[i].hoverCounter=0;
        }
    }
}
function processClicked(){
    for(var i = 0;i < prls.length;i++){
        if(prls[i].hoverCounter && sceneAni==0) {
            if(clickY>prls[i].y1 && clickY<prls[i].y2 && clickX>prls[i].x1+(prls[i].y2-prls[i].y1)*0.3 && clickX<prls[i].x2-(prls[i].y2-prls[i].y1)*0.3){
               prls[i].onClick();
               clickX=0,clickY=0;
            }
        }
    }
}
function changeScene(prev,next){ //シーン遷移の関数
    prls=[];
    ctx2dImg.clearRect(0,0,WIDTH,HEIGHT);
    if(next==1){ //タイトル画面に遷移する場合
        prls.push({x1:WIDTH/2-100,y1:HEIGHT/2+100,x2:WIDTH/2+100,y2:HEIGHT/2+150,colSet:0,hoverColSet:1,hoverCounter:0,text:"START",onClick:function(){nextScene=2;sceneAni=t;}})
    } if(next == 2){
        ctx2dImg.drawImage(backImg[0],0,0,WIDTH,HEIGHT);
        prls.push({x1:100,y1:100,x2:300,y2:250,colSet:0,hoverColSet:1,hoverCounter:0,text:"MENU",onClick:function(){nextScene=1;sceneAni=t;}})
    }
}
function checkLoaded(){
    if(imgLoadedCnt==IMG_CNT){
        imgLoadedCnt=-1;
        sceneAni=performance.now();//ロード完了後にこれを実行
        nextScene=1;
    }
}
function init() {
    //ローディング処理////////////////////////////////////////

    tick();

    function tick() {
        t=performance.now();
        if(sceneAni==0 && imgLoadedCnt!=-1) checkLoaded();

        //2次元のリセット処理
        if(scene) ctx2d.clearRect(0,0,WIDTH,HEIGHT);

        if(scene==1){ //タイトル画面
            drawTitleScene();
        } else if(scene == 2) { //メニュー画面
            drawMenu();
        }

        /////////////////全シーン共通処理
        drawMouseCursor();
        processMouseEvent();
        if(clickX && clickY) processClicked();
        ///////////////
        if(sceneAni){
            if(nextScene!=scene){
                ctx2d.fillStyle="rgba(0,0,0," + (t-sceneAni)/(SCENE_ANI * (1+(scene==1 || scene==0)))+")";
                ctx2d.fillRect(0,0,WIDTH,HEIGHT);
                if(t-sceneAni > SCENE_ANI * (1+(scene==1 || scene==0))) scene=nextScene,sceneAni=t,changeScene(scene,nextScene);
            } else{
                ctx2d.fillStyle="rgba(0,0,0," + (1-(t-sceneAni)/SCENE_ANI)+")";
                ctx2d.fillRect(0,0,WIDTH,HEIGHT);
                if(t-sceneAni > SCENE_ANI) sceneAni=0;
            }
        }
        requestAnimationFrame(tick);
    }
}