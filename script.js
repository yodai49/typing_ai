var prls = [];//描画する平行四辺形の構造体の配列
var msgBox=[];//描画するメッセージボックスの構造体の配列
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
    if(drawPrl.isMsgBox) ctx2d.lineWidth=2;
    if(drawPrl.trans==undefined) drawPrl.trans=1;
    if(drawPrl.textSize==undefined) drawPrl.textSize=1;
    if(drawPrl.trans<0) drawPrl.trans=Math.max(-1,-(t-msgBox[0].ani)/200);
    if(msgBox.length) {
        if(msgBox[0].flg==2 && drawPrl.trans<0) drawPrl.trans=Math.max(-1,-1+(t-msgBox[0].ani)/200);
    }
    var drawGrad=ctx2d.createLinearGradient(drawPrl.x2,drawPrl.y1,drawPrl.x1,drawPrl.y2);
    const PRL_COLSET=[[[215,213,228,0.7],[145,143,168,0.7],[225,223,238,0.7]],
            [[175,173,188,0.7],[125,123,138,0.7],[185,183,208,0.7]]];
    const FRAME_COLSET=[[20,23,45,0.8],[20,23,45,0.8]];
    const TEXT_COLSET=[[30,30,30],[30,30,30]];
    for(var i = 0;i < 3;i++){
        drawGrad.addColorStop(i/2+0.1*(i==1),'rgba(' + 
         (PRL_COLSET[drawPrl.hoverColSet][i][0]*drawPrl.hoverCounter+PRL_COLSET[drawPrl.colSet][i][0]*(10-drawPrl.hoverCounter))/10 + ',' +  
         (PRL_COLSET[drawPrl.hoverColSet][i][1]*drawPrl.hoverCounter+PRL_COLSET[drawPrl.colSet][i][1]*(10-drawPrl.hoverCounter))/10 + ',' +  
         (PRL_COLSET[drawPrl.hoverColSet][i][2]*drawPrl.hoverCounter+PRL_COLSET[drawPrl.colSet][i][2]*(10-drawPrl.hoverCounter))/10+ ',' + Math.abs(drawPrl.trans * 0.7) + ")")
    }
    ctx2d.fillStyle=drawGrad;
    ctx2d.strokeStyle='rgba(' + 
    (FRAME_COLSET[drawPrl.hoverColSet][0]*drawPrl.hoverCounter+FRAME_COLSET[drawPrl.colSet][0]*(10-drawPrl.hoverCounter))/10 + ',' +  
    (FRAME_COLSET[drawPrl.hoverColSet][1]*drawPrl.hoverCounter+FRAME_COLSET[drawPrl.colSet][1]*(10-drawPrl.hoverCounter))/10 + ',' +  
    (FRAME_COLSET[drawPrl.hoverColSet][2]*drawPrl.hoverCounter+FRAME_COLSET[drawPrl.colSet][2]*(10-drawPrl.hoverCounter))/10+ ','+ Math.abs(drawPrl.trans * 0.8) + ")";
    ctx2d.beginPath();
    if(drawPrl.rev==1){ //反転
        ctx2d.moveTo((drawPrl.x1+drawPrl.x2)/2,drawPrl.y1);
        ctx2d.lineTo(drawPrl.x2-(drawPrl.y2-drawPrl.y1)*0.3,drawPrl.y1);
        ctx2d.lineTo(drawPrl.x2,drawPrl.y2);
        ctx2d.lineTo(drawPrl.x1+(drawPrl.y2-drawPrl.y1)*0.3,drawPrl.y2);
        ctx2d.lineTo(drawPrl.x1,drawPrl.y1);
        ctx2d.lineTo((drawPrl.x1+drawPrl.x2)/2,drawPrl.y1);
    } else{ //通常
        ctx2d.moveTo((drawPrl.x1+drawPrl.x2)/2,drawPrl.y1);
        ctx2d.lineTo(drawPrl.x2,drawPrl.y1);
        ctx2d.lineTo(drawPrl.x2-(drawPrl.y2-drawPrl.y1)*0.3,drawPrl.y2);
        ctx2d.lineTo(drawPrl.x1,drawPrl.y2);
        ctx2d.lineTo(drawPrl.x1+(drawPrl.y2-drawPrl.y1)*0.3,drawPrl.y1);
        ctx2d.lineTo((drawPrl.x1+drawPrl.x2)/2,drawPrl.y1);
    }
    ctx2d.stroke();
    ctx2d.fill();
    if(drawPrl.shadow!=0){
        var shadowGrad=ctx2d.createLinearGradient(drawPrl.x1,drawPrl.y2,drawPrl.x1,drawPrl.y2+15);
        shadowGrad.addColorStop(0,'rgba(0,0,0,1)');
        shadowGrad.addColorStop(0.3,'rgba(0,0,0,0.9)');
        shadowGrad.addColorStop(1,'rgba(0,0,0,0)');
        ctx2d.fillStyle=shadowGrad;
        if(drawPrl.rev==1){　//影を描く
            ctx2d.fillRect(drawPrl.x1,drawPrl.y2,drawPrl.x2-(drawPrl.x1+(drawPrl.y2-drawPrl.y1)*0.3),15);
        } else{
            ctx2d.fillRect(drawPrl.x1,drawPrl.y2,drawPrl.x2-(drawPrl.x1+(drawPrl.y2-drawPrl.y1)*0.3),15);
        }
    }
    ctx2d.fillStyle='rgba(' + 
    (TEXT_COLSET[drawPrl.hoverColSet][0]*drawPrl.hoverCounter+TEXT_COLSET[drawPrl.colSet][0]*(10-drawPrl.hoverCounter))/10 + ',' +  
    (TEXT_COLSET[drawPrl.hoverColSet][1]*drawPrl.hoverCounter+TEXT_COLSET[drawPrl.colSet][1]*(10-drawPrl.hoverCounter))/10 + ',' +  
    (TEXT_COLSET[drawPrl.hoverColSet][2]*drawPrl.hoverCounter+TEXT_COLSET[drawPrl.colSet][2]*(10-drawPrl.hoverCounter))/10+ ',' + Math.abs(drawPrl.trans) + ")";
    ctx2d.font=(drawPrl.y2-drawPrl.y1)*0.34 * drawPrl.textSize + "pt " + MAIN_FONTNAME + "," +JAPANESE_FONTNAME;
    ctx2d.fillText(drawPrl.text,(drawPrl.x2+drawPrl.x1)/2-ctx2d.measureText(drawPrl.text).width/2,drawPrl.y1+(drawPrl.y2-drawPrl.y1)*0.62);
}
function drawMsgbox(){//メッセージボックスの描画関数
    if(msgBox.length){
        b=msgBox[0];
        let myAni = Math.min(1,(t-b.ani)/200);
        let myCharAni = Math.floor((t-b.ani)/50);
        let randomChar1 = CHARA_SET[Math.floor(CHARA_SET.length * Math.random())];
        let randomChar2 = CHARA_SET[Math.floor(CHARA_SET.length * Math.random())];
        if(myCharAni>=28 || myCharAni >= b.text.length) randomChar1 = "";
        if(myCharAni<28 || myCharAni >= 56 || myCharAni >= b.text.length) randomChar2 = "";
        if(b.flg==2) {//消える時
            myAni = 1-myAni;
            myCharAni = 0;
        }
        if(b.flg == 2 && myAni<=0){//メッセージボックスの消滅処理
            prls=prls.filter(item=>item.isMsgBox!=1);
            msgBox.pop();
            return 0;
        } 
        if(b.flg!=1 && b.flg!=2){//指定されたボタンをprlsへプッシュする
            if(b.btns2!=undefined){ //ボタンが２つある時
                prls.push({isMsgBox:1,x1:WIDTH/2-100,y1:HEIGHT/2+30,x2:WIDTH/2-20,y2:HEIGHT/2+50,shadow:0,colSet:0,hoverColSet:1,hoverCounter:0,text:b.btns1.text,trans:-1,onClick:b.btns1.onClick});
                prls.push({isMsgBox:1,x1:WIDTH/2+20,y1:HEIGHT/2+30,x2:WIDTH/2+100,y2:HEIGHT/2+50,shadow:0,colSet:0,hoverColSet:1,hoverCounter:0,text:b.btns2.text,trans:-1,onClick:b.btns2.onClick});
            } else{
                prls.push({isMsgBox:1,x1:WIDTH/2-50,y1:HEIGHT/2+30,x2:WIDTH/2+50,y2:HEIGHT/2+50,shadow:0,colSet:0,hoverColSet:1,hoverCounter:0,text:b.btns1.text,trans:-1,onClick:b.btns1.onClick});
            }
            msgBox[0].flg=1;
        }
        drawPrl({x1:WIDTH/2-250,y1:HEIGHT/2-50,x2:WIDTH/2+250,y2:HEIGHT/2+60,colSet:0,hoverColSet:0,hoverCounter:0,text:"",trans:myAni,onClick:function(){return 0}})
        ctx2d.font="12pt " + JAPANESE_FONTNAME;
        ctx2d.fillStyle="rgba(0,0,0,"  + myAni + ")";
        ctx2d.fillText(b.text.substr(0,Math.min(28,myCharAni))+randomChar1,WIDTH/2-218,HEIGHT/2-15);
        ctx2d.fillText(b.text.substr(28,Math.min(28,myCharAni-28))+randomChar2,WIDTH/2-218,HEIGHT/2+8);
        for(let i = 0;i < prls.length;i++){
            if(prls[i].isMsgBox==1) drawPrl(prls[i]);
        }
    }
}
function drawTitle(){ ///タイトル画面の描画関数
    ctx2d.fillStyle=getRGBA(1,0,1);//黒背景
    ctx2d.fillRect(0,0,WIDTH,HEIGHT);
    drawLoadingCircle(WIDTH-230,230,210,t/3.2,1000);//////////動く丸
    drawLoadingCircle(150,150,130,-t/3,1000);
    drawLoadingCircle(50,HEIGHT-60,250,t/2.7,1000);
    ctx2d.font="55px " + MAIN_FONTNAME;//////////タイトル文字
    ctx2d.fillStyle=getRGBA(2,0,1);
    ctx2d.fillText("A V A - T Y P E",(WIDTH-ctx2d.measureText("A V A - T Y P E").width)/2,HEIGHT/2-30);
    ctx2d.font="25px " + JAPANESE_FONTNAME;
    ctx2d.fillText("アバタイプ",(WIDTH-ctx2d.measureText("アバタイプ").width)/2,HEIGHT/2+40);
    for(let i = 0;i < prls.length;i++){
        if(prls[i].isMsgBox!=1) drawPrl(prls[i]);
    }
}
function drawMenu(){
    drawLoadingCircle(HEIGHT/2+40,HEIGHT/2,HEIGHT/2-25,t/3.2,1000);//////////動く丸
    drawLoadingCircle(WIDTH-25-HEIGHT/3,HEIGHT/3-10,HEIGHT/3-20,-t/3,1000);//////////動く丸
    drawLoadingCircle(WIDTH-100,HEIGHT-60,50,t/2.6,1000);
    for(let i = 0;i < prls.length;i++){
        if(prls[i].isMsgBox!=1) drawPrl(prls[i]);
    }
    var menuBarGrad = ctx2d.createLinearGradient(0,0,WIDTH,65);
    menuBarGrad.addColorStop(0,'rgba(15,15,20,0.9)');
    menuBarGrad.addColorStop(1,'rgba(30,30,42,0.9)');
    ctx2d.fillStyle=menuBarGrad;
    ctx2d.fillRect(0,0,WIDTH,50);
    var menuBarShadowGrad = ctx2d.createLinearGradient(0,50,0,65);
    menuBarShadowGrad.addColorStop(0,'rgba(0,0,0,1)');
    menuBarShadowGrad.addColorStop(0.3,'rgba(0,0,0,0.9)');
    menuBarShadowGrad.addColorStop(1,'rgba(0,0,0,0)');
    ctx2d.fillStyle=menuBarShadowGrad;
    ctx2d.fillRect(0,50,WIDTH,65);
}
function processMouseEvent(){ //平行四辺形ボタンに対してのホバー処理
    mouseStatus=0;
    for(let i = 0;i < prls.length;i++){
        if(mouseY>prls[i].y1 && mouseY<prls[i].y2 && mouseX>prls[i].x1+(prls[i].y2-prls[i].y1)*0.3 && mouseX<prls[i].x2-(prls[i].y2-prls[i].y1)*0.3){
            if(!(msgBox.length && prls[i].isMsgBox!=1)){
                prls[i].hoverCounter++;
                if(prls[i].hoverCounter>10) prls[i].hoverCounter=10;
                mouseStatus=1;
            }
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
                if(!(msgBox.length && prls[i].isMsgBox!=1)){ //メッセージボックス表示中なら、メッセージボックス以外スルー
                    prls[i].onClick();
                    clickX=0,clickY=0;
                    if(prls[i].isMsgBox) msgBox[0].ani=t,msgBox[0].flg=2;
                } 
            }
        }
    }
}
function changeScene(prev,next){ //シーン遷移の関数
    prls=[];
    ctx2dImg.clearRect(0,0,WIDTH,HEIGHT);
    if(next==1){ //タイトル画面に遷移する場合
        prls.push({x1:WIDTH/2-100,y1:HEIGHT/2+100,x2:WIDTH/2+100,y2:HEIGHT/2+150,colSet:0,hoverColSet:1,hoverCounter:0,text:"START",onClick:function(){
            nextScene=2;sceneAni=t;
        }})
    } if(next == 2){
        ctx2dImg.drawImage(backImg[0],0,0,WIDTH,HEIGHT);
        prls.push({x1:570,y1:100,x2:870,y2:195,colSet:0,hoverColSet:1,hoverCounter:0,textSize:0.5,text:"TITLE",onClick:function(){
            msgBox.push({
                text:"本当にタイトルに戻りますか？",
                ani:t,
                btns1:{text:"OK",onClick:function(){nextScene=1;sceneAni=t}},
                btns2:{text:"CANCEL",onClick:function(){return 0;}}});}})
        prls.push({x1:540,y1:215,x2:840,y2:310,colSet:0,hoverColSet:1,hoverCounter:0,textSize:0.5,text:"SETTING",onClick:function(){
            return 0;}})
        prls.push({x1:540,y1:330,x2:858,y2:480,colSet:1,hoverColSet:1,hoverCounter:0,textSize:0.6,text:"",rev:1,onClick:function(){
            return 0;}})
        prls.push({x1:100,y1:100,x2:578,y2:310,colSet:0,hoverColSet:1,hoverCounter:0,textSize:0.4,text:"BATTLE!",rev:0,onClick:function(){
            return 0;}})
        prls.push({x1:100,y1:330,x2:558,y2:480,colSet:0,hoverColSet:1,hoverCounter:0,textSize:0.4,text:"AVATOR",rev:1,onClick:function(){
            return 0;}})
        }
}
function checkLoaded(){
    if(imgLoadedCnt==IMG_CNT){
        imgLoadedCnt=-1;
        sceneAni=performance.now();//ロード完了後にこれを実行
        nextScene=1;
        if(DEBUG_MODE)nextScene=DEBUG_MODE;
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
            drawTitle();
        } else if(scene == 2) { //メニュー画面
            drawMenu();
        }

        /////////////////全シーン共通処理
        drawMsgbox();   
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