var prls = [];//描画する平行四辺形の構造体の配列
var msgBox=[];//描画するメッセージボックスの構造体の配列
var previousSettings=[];//直前の設定を保存するため
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
    if(drawPrl.lineWidth!=undefined) ctx2d.lineWidth=drawPrl.lineWidth;
    if(drawPrl.trans==undefined) drawPrl.trans=1;
    if(drawPrl.textSize==undefined) drawPrl.textSize=1;
    if(drawPrl.trans<0) drawPrl.trans=Math.max(-1,-(t-msgBox[0].ani)/200);
    if(msgBox.length) {
        if(msgBox[0].flg==2 && drawPrl.trans<0) drawPrl.trans=Math.max(-1,-1+(t-msgBox[0].ani)/200);
    }
    var drawGrad=ctx2d.createLinearGradient(drawPrl.x2,drawPrl.y1,drawPrl.x1,drawPrl.y2);
    const PRL_COLSET=[[[213,213,213,1],[141,141,141,1],[230,230,230,1]], //灰色用
            [[165,163,168,1],[125,123,128,1],[175,173,178,1]], //灰色ホバー用
            [[175,173,188,1.2],[125,123,138,1.2],[185,183,208,1.2]],//透けにくい灰色(メッセージボックス用)
            [[255,192,0,1.2],[127,96,0,1.2],[255,192,0,1.2]],//黄色（決定など）
            [[225,162,0,1.2],[97,66,0,1.2],[225,162,0,1.2]],//黄色ホバー
            [[185,0,0,1.2],[97,0,0,1.2],[185,0,0,1.2]],//赤  (5)
            [[145,0,0,1.2],[57,0,0,1.2],[145,0,0,1.2]],
            [[0,15,200,1.2],[0,10,120,1.2],[0,15,210,1.2]],//青
            [[0,5,180,1.2],[0,5,130,1.2],[0,5,180,1.2]],
            [[180,160,0,1.2],[130,110,0,1.2],[180,162,0,1.2]],//黄
            [[140,122,0,1.2],[90,70,0,1.2],[140,122,0,1.2]], //(10)
            [[0,0,0,0.8],[0,0,0,0.8],[0,0,0,0.8]],//黒やや透明
            [[0,0,0,0],[0,0,0,0],[0,0,0,0]],//透明　枠のみ
            [[40,40,40,1.2],[2,3,8,1.2],[40,40,40,1.2]],//濃い灰色（キャンセル系） 13
            [[141,141,141,0.75],[34,42,53,0.81],[135,135,135,1]],];//画面のタイトル用 14
    const FRAME_COLSET=[[20,20,20,0.8],[0,0,0,0.8],[20,23,20,0.8],[40,20,5,0.8],[40,20,5,0.8],
                        [20,23,20,0],[20,23,20,0.8],[20,20,20,0.8],[20,20,20,0.8],[20,20,20,0.8],[20,20,20,0.8],[0,0,0,1],[0,0,0,1],[0,0,0,1],[0,0,0,1],];
    const TEXT_COLSET=[[30,30,30],[30,30,30],[30,30,30],[255,255,255],[255,255,255],
                        [0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[255,255,255],[0,0,0],[255,255,255],[255,255,255]];
    for(var i = 0;i < 3;i++){
        drawGrad.addColorStop(i/2+0.1*(i==1),'rgba(' + 
         (PRL_COLSET[drawPrl.hoverColSet][i][0]*drawPrl.hoverCounter+PRL_COLSET[drawPrl.colSet][i][0]*(10-drawPrl.hoverCounter))/10 + ',' +  
         (PRL_COLSET[drawPrl.hoverColSet][i][1]*drawPrl.hoverCounter+PRL_COLSET[drawPrl.colSet][i][1]*(10-drawPrl.hoverCounter))/10 + ',' +  
         (PRL_COLSET[drawPrl.hoverColSet][i][2]*drawPrl.hoverCounter+PRL_COLSET[drawPrl.colSet][i][2]*(10-drawPrl.hoverCounter))/10+ ',' + PRL_COLSET[drawPrl.hoverColSet][i][3]*Math.abs(drawPrl.trans * 0.7) + ")")
    }
    if(drawPrl.shadow!=0){　//影を描く
        var shadowGrad=ctx2d.createLinearGradient(drawPrl.x1,drawPrl.y2,drawPrl.x1,drawPrl.y2+15);
        shadowGrad.addColorStop(0,'rgba(0,0,0,'+drawPrl.trans+')');
        shadowGrad.addColorStop(0.3,'rgba(0,0,0,'+drawPrl.trans*0.9+')');
        shadowGrad.addColorStop(1,'rgba(0,0,0,0)');
        ctx2d.fillStyle=shadowGrad;
        if(drawPrl.rev==1){
            ctx2d.fillRect(drawPrl.x1+((drawPrl.y2-drawPrl.y1)*0.3)-ctx2d.lineWidth/2,drawPrl.y2,drawPrl.x2-(drawPrl.x1+(drawPrl.y2-drawPrl.y1)*0.3)+ctx2d.lineWidth,15);
        } else{
            ctx2d.fillRect(drawPrl.x1-ctx2d.lineWidth/2,drawPrl.y2,drawPrl.x2-(drawPrl.x1+(drawPrl.y2-drawPrl.y1)*0.3)+ctx2d.lineWidth,15);
        }
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

    ctx2d.fillStyle='rgba(' + 
    (TEXT_COLSET[drawPrl.hoverColSet][0]*drawPrl.hoverCounter+TEXT_COLSET[drawPrl.colSet][0]*(10-drawPrl.hoverCounter))/10 + ',' +  
    (TEXT_COLSET[drawPrl.hoverColSet][1]*drawPrl.hoverCounter+TEXT_COLSET[drawPrl.colSet][1]*(10-drawPrl.hoverCounter))/10 + ',' +  
    (TEXT_COLSET[drawPrl.hoverColSet][2]*drawPrl.hoverCounter+TEXT_COLSET[drawPrl.colSet][2]*(10-drawPrl.hoverCounter))/10+ ',' + 2*Math.abs(drawPrl.trans) + ")";
    if(drawPrl.subText!=undefined){ //サブテキストあり
        ctx2d.font=(drawPrl.y2-drawPrl.y1)*0.34 * drawPrl.textSize + "pt " + MAIN_FONTNAME + "," +JAPANESE_FONTNAME;
        ctx2d.fillText(drawPrl.text,(drawPrl.x2+drawPrl.x1)/2-ctx2d.measureText(drawPrl.text).width/2,drawPrl.y1+(drawPrl.y2-drawPrl.y1)*0.5);
        ctx2d.font=(drawPrl.y2-drawPrl.y1)*0.24 * drawPrl.textSize + "pt " + MAIN_FONTNAME + "," +JAPANESE_FONTNAME;
        ctx2d.fillText(drawPrl.subText,(drawPrl.x2+drawPrl.x1)/2-ctx2d.measureText(drawPrl.subText).width/2,drawPrl.y1+(drawPrl.y2-drawPrl.y1)*0.72);    
    } else{　//サブテキストなし
        ctx2d.font=(drawPrl.y2-drawPrl.y1)*0.34 * drawPrl.textSize + "pt " + MAIN_FONTNAME + "," +JAPANESE_FONTNAME;
        ctx2d.fillText(drawPrl.text,(drawPrl.x2+drawPrl.x1)/2-ctx2d.measureText(drawPrl.text).width/2,drawPrl.y1+(drawPrl.y2-drawPrl.y1)*0.63);    
    }
}
function drawMsgbox(){//メッセージボックスの描画関数
    if(msgBox.length){
        let myAni = Math.min(1,(t-msgBox[0].ani)/200);
        let myCharAni = Math.floor((t-msgBox[0].ani)/50);
        let randomChar1 = CHARA_SET[Math.floor(CHARA_SET.length * Math.random())];
        let randomChar2 = CHARA_SET[Math.floor(CHARA_SET.length * Math.random())];
        if(msgBox[0].flg==2) {//消える時
            myAni = 1-myAni;
            myCharAni = 0;
        }
        if(msgBox[0].flg == 2 && myAni<=0){//メッセージボックスの消滅処理
            prls=prls.filter(item=>item.isMsgBox!=1);
            msgBox.shift();
            return 0;
        }
        if(msgBox[0].createAvatorWindow!=1){ //アバター作成ウィンドウ以外
            if(myCharAni>=28 || myCharAni >= msgBox[0].text.length) randomChar1 = "";
            if(myCharAni<28 || myCharAni >= 56 || myCharAni >= msgBox[0].text.length) randomChar2 = "";
            if(msgBox[0].flg!=1 && msgBox[0].flg!=2){//指定されたボタンをprlsへプッシュする
                if(msgBox[0].btns2!=undefined){ //ボタンが２つある時
                    prls.push({isMsgBox:1,x1:WIDTH/2-100,y1:HEIGHT/2+30,x2:WIDTH/2-20,y2:HEIGHT/2+50,shadow:0,colSet:0,hoverColSet:1,hoverCounter:0,text:msgBox[0].btns1.text,trans:-1,onClick:msgBox[0].btns1.onClick});
                    prls.push({isMsgBox:1,x1:WIDTH/2+20,y1:HEIGHT/2+30,x2:WIDTH/2+100,y2:HEIGHT/2+50,shadow:0,colSet:0,hoverColSet:1,hoverCounter:0,text:msgBox[0].btns2.text,trans:-1,onClick:msgBox[0].btns2.onClick});
                } else{
                    prls.push({isMsgBox:1,x1:WIDTH/2-50,y1:HEIGHT/2+30,x2:WIDTH/2+50,y2:HEIGHT/2+50,shadow:0,colSet:0,hoverColSet:1,hoverCounter:0,text:msgBox[0].btns1.text,trans:-1,onClick:msgBox[0].btns1.onClick});
                }
                msgBox[0].flg=1;
            }
            drawPrl({x1:WIDTH/2-250,y1:HEIGHT/2-50,x2:WIDTH/2+250,y2:HEIGHT/2+60,colSet:2,hoverColSet:2,hoverCounter:0,text:"",trans:myAni,onClick:function(){return 0}})
            ctx2d.font="12pt " + JAPANESE_FONTNAME;
            ctx2d.fillStyle="rgba(0,0,0,"  + myAni + ")";
            ctx2d.fillText(msgBox[0].text.substr(0,Math.min(28,myCharAni))+randomChar1,WIDTH/2-218,HEIGHT/2-15);
            ctx2d.fillText(msgBox[0].text.substr(28,Math.min(28,myCharAni-28))+randomChar2,WIDTH/2-218,HEIGHT/2+8);
        } else{ //アバター作成ウィンドウ
            if(msgBox[0].flg!=1 && msgBox[0].flg!=2){//作成ボタンをprlsへプッシュする
                prls.push({isMsgBox:1,x1:WIDTH/2+110,y1:HEIGHT/2+78,x2:WIDTH/2+240,y2:HEIGHT/2+128,shadow:0,colSet:3,textSize:0.9,hoverColSet:4,hoverCounter:0,lineWidth:5,text:"作成！",trans:-1,onClick:function(){
                    //アバター作成可能判定処理をここへ
                    let tempName=document.getElementById("nameBoxCreate").value;
                    if(tempName.length>8){ //9文字以上
                        document.getElementById("nameBoxCreate").style.display="none";
                        msgBox.push({
                            text:"名前が長すぎます。8文字以内にしてください。",
                            ani:t,
                            btns1:{text:"OK",onClick:function(){ //アバター作成の初期ウィンドウを表示
                                msgBox.push({createAvatorWindow:1,
                                text:"",
                                ani:t+200,
                                flg:0,
                                });}}});
                    } else if(tempName.length==0){//名前が未入力
                        document.getElementById("nameBoxCreate").style.display="none";
                        msgBox.push({
                            text:"名前を入力してください。",
                            ani:t,
                            btns1:{text:"OK",onClick:function(){ //アバター作成の初期ウィンドウを表示
                                msgBox.push({createAvatorWindow:1,
                                text:"",
                                ani:t+200,
                                flg:0,
                                });}}});
                    }else { 
                        let invalidChara=" :?#[]!$&'()*+,;=\"<>%~|",invalidFlg=0;
                        for(let i = 0;i < invalidChara.length;i++){
                            if(tempName.indexOf(invalidChara.substr(i,1))!=-1) invalidFlg=1;
                        }
                        if(invalidFlg){//使用できない文字が含まれていた時
                            document.getElementById("nameBoxCreate").style.display="none";
                            msgBox.push({
                                text:"名前に使用できない文字が含まれています。",
                                ani:t,
                                btns1:{text:"OK",onClick:function(){ //アバター作成の初期ウィンドウを表示
                                    msgBox.push({createAvatorWindow:1,
                                    text:"",
                                    ani:t+200,
                                    flg:0,
                                    });}}});
                        } else{//作成可能な時
                            document.getElementById("nameBoxCreate").style.display="none";
                            avatorData[0].name=tempName;
                            msgBox.push({
                                text:"新しいアバター「" + tempName + "」を作成しますか？",
                                ani:t,
                                btns1:{text:"OK",onClick:function(){ //アバター作成
                                    setAvatorData(0);
                                    saveData();
                                    document.getElementById("nameBoxCreate").style.display="none";nextScene=2,sceneAni=t;
                                }},
                                btns2:{text:"CANCEL",onClick:function(){ //アバター作成の初期ウィンドウを表示
                                    msgBox.push({createAvatorWindow:1,
                                    text:"",
                                    ani:t+200,
                                    flg:0,
                                    });}}});
                        }
                    }
                }});
                prls.push({isMsgBox:1,x1:WIDTH/2+30,y1:HEIGHT/2+98,x2:WIDTH/2+110,y2:HEIGHT/2+128,shadow:0,colSet:13,textSize:0.8,hoverColSet:13,hoverCounter:0,text:"キャンセル",trans:-1,onClick:function(){document.getElementById("nameBoxCreate").style.display="none";}});
                prls.push({isMsgBox:1,x1:WIDTH/2-160,y1:HEIGHT/2+50,x2:WIDTH/2-120,y2:HEIGHT/2+80,shadow:0,colSet:5,hoverColSet:6,hoverCounter:0,lineWidth:0,text:"",trans:-1,noDestruct:1,onClick:function(){avatorData[0].team=0;}}); //チーム選択ボタン
                prls.push({isMsgBox:1,x1:WIDTH/2-110,y1:HEIGHT/2+50,x2:WIDTH/2-70,y2:HEIGHT/2+80,shadow:0,colSet:7,hoverColSet:8,hoverCounter:0,lineWidth:0,text:"",trans:-1,noDestruct:1,onClick:function(){avatorData[0].team=1;}});
                prls.push({isMsgBox:1,x1:WIDTH/2-60,y1:HEIGHT/2+50,x2:WIDTH/2-20,y2:HEIGHT/2+80,shadow:0,colSet:9,hoverColSet:10,hoverCounter:0,lineWidth:0,text:"",trans:-1,noDestruct:1,onClick:function(){avatorData[0].team=2;}});
                prls.push({isMsgBox:1,x1:WIDTH/2-143.5,y1:HEIGHT/2-5,x2:WIDTH/2-68.5,y2:HEIGHT/2+25,shadow:0,colSet:12,hoverColSet:12,hoverCounter:0,lineWidth:0,text:"",trans:-1,noDestruct:1,onClick:function(){playData.settings[0] = 0;}}); //入力方式選択ボタン
                prls.push({isMsgBox:1,x1:WIDTH/2-58.5,y1:HEIGHT/2-5,x2:WIDTH/2+16.5,y2:HEIGHT/2+25,shadow:0,colSet:12,hoverColSet:12,hoverCounter:0,lineWidth:0,text:"",trans:-1,noDestruct:1,onClick:function(){playData.settings[0] = 1;}});
                document.getElementById("nameBoxCreate").style.display="inline";
                msgBox[0].flg=1;
            }
            drawPrl({x1:WIDTH/2-320,y1:HEIGHT/2-140,x2:WIDTH/2+320,y2:HEIGHT/2+140,colSet:2,hoverColSet:2,hoverCounter:0,text:"",trans:myAni*1.1,onClick:function(){return 0}})
            ctx2d.font="18pt " + JAPANESE_FONTNAME;
            ctx2d.fillStyle=getRGBA(0,0,1);
            ctx2d.fillText("新規アバター作成",WIDTH/2-223,HEIGHT/2-100);
            ctx2d.font="12pt " + JAPANESE_FONTNAME;
            ctx2d.fillText("名前",WIDTH/2-237,HEIGHT/2-40);
            ctx2d.fillText("入力方式",WIDTH/2-253.5,HEIGHT/2+15);
            ctx2d.fillText("所属チーム",WIDTH/2-270,HEIGHT/2+70);
            drawPrl({x1:WIDTH/2+13,y1:HEIGHT/2-130,x2:WIDTH/2+300,y2:HEIGHT/2+63,colSet:13,hoverColSet:13,shadow:0,hoverCounter:0,text:"",trans:myAni*1.1,onClick:function(){return 0}})
            drawAvator(avatorData[0],WIDTH/2+58,HEIGHT/2-128,WIDTH/2+255,HEIGHT/2+55,t,myAni);
        }
        for(let i = 0;i < prls.length;i++){
            if(prls[i].isMsgBox==1) drawPrl(prls[i]);
        }
        if(msgBox[0].createAvatorWindow){ //アバター作成ウィンドウで上に被せるもの
            for(let i = 0;i < 3;i++){ //チーム選択
                if(avatorData[0].team!=i){ //選択チームではないとき
                    drawPrl({x1:WIDTH/2-160+i*50,y1:HEIGHT/2+50,x2:WIDTH/2-120+i*50,y2:HEIGHT/2+80,colSet:11,hoverColSet:11,lineWidth:0.1,shadow:0,hoverCounter:0,text:"",trans:myAni*1.1})
                } else{//選択チーム
                    drawPrl({x1:WIDTH/2-160+i*50,y1:HEIGHT/2+50,x2:WIDTH/2-120+i*50,y2:HEIGHT/2+80,colSet:12,hoverColSet:12,lineWidth:5,shadow:0,hoverCounter:0,text:"",trans:myAni*1.1})
                }
            }
            const INPUT_TYPE=["ローマ字","カナ"]; 
            for(var i = 0;i < 2;i++){ //入力方式選択
                if(playData.settings[0] == i){
                    drawPrl({isMsgBox:1,x1:WIDTH/2-143.5+i*85,y1:HEIGHT/2-5,x2:WIDTH/2-68.5+i*85,y2:HEIGHT/2+25,shadow:0,colSet:3,lineWidth:4,hoverColSet:4,hoverCounter:0,lineWidth:6,textSize:0.9,text:INPUT_TYPE[i],trans:-1,noDestruct:1});
                } else{
                    drawPrl({isMsgBox:1,x1:WIDTH/2-143.5+i*85,y1:HEIGHT/2-5,x2:WIDTH/2-68.5+i*85,y2:HEIGHT/2+25,shadow:0,colSet:13,lineWidth:4,hoverColSet:13,hoverCounter:0,lineWidth:2,textSize:0.9,text:INPUT_TYPE[i],trans:-1,noDestruct:1});
                }
            }
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
    var menuBarGrad = ctx2d.createLinearGradient(0,0,WIDTH,60); ///メニューバー
    menuBarGrad.addColorStop(0,'rgba(75,75,80,0.95)');
    menuBarGrad.addColorStop(0.3,'rgba(40,40,40,0.95)');
    menuBarGrad.addColorStop(1,'rgba(70,70,85,0.95)');
    ctx2d.fillStyle=menuBarGrad;
    ctx2d.fillRect(0,0,WIDTH,60);
    var menuBarShadowGrad = ctx2d.createLinearGradient(0,60,0,75);
    menuBarShadowGrad.addColorStop(0,'rgba(0,0,0,1)');
    menuBarShadowGrad.addColorStop(0.3,'rgba(0,0,0,0.9)');
    menuBarShadowGrad.addColorStop(1,'rgba(0,0,0,0)');
    ctx2d.fillStyle=menuBarShadowGrad;
    ctx2d.fillRect(0,60,WIDTH,75);
    ctx2d.font="19pt " + MAIN_FONTNAME;//AVA-TYPEの文字
    ctx2d.fillStyle=getRGBA(2,0,1);
    ctx2d.fillText("AVA-TYPE",(WIDTH-ctx2d.measureText("AVA-TYPE").width)/2,40);
    ctx2d.font="14pt " + JAPANESE_FONTNAME;
    ctx2d.fillText(avatorData[0].name,65,36);
    drawAvator(avatorData[0],5,5,55,55,t,1);//アバターの画像
    drawLoadingCircle(WIDTH/2+110,30,15,-t/2.7,1000); //メニューバーここまで
    ctx2d.fillStyle=getRGBA(0,0,1); //デイリーミッション
    ctx2d.font="19pt " + MAIN_FONTNAME;
    ctx2d.fillText("DAILY",560,370);
    drawAvator(avatorData[0],165,375,245,455,t+72,1);//アバター横のアバター画像
    ctx2d.beginPath();
    ctx2d.arc(ctx2d.measureText(avatorData[0].name).width+68,30,7,0,Math.PI*2);
    ctx2d.lineWidth=1;
    var teamGrad=ctx2d.createLinearGradient(ctx2d.measureText(avatorData[0].name).width+31,37,ctx2d.measureText(avatorData[0].name).width+44,23);
    if(avatorData[0].team==0){
        teamGrad.addColorStop(0,'rgba(100,10,10,1)');
        teamGrad.addColorStop(0,'rgba(200,10,10,1)');
    } else if(avatorData[0].team==1){
        teamGrad.addColorStop(0,'rgba(10,10,100,1)');
        teamGrad.addColorStop(0,'rgba(10,10,200,1)');
    } else if(avatorData[0].team==2){
        teamGrad.addColorStop(0,'rgba(130,100,10,1)');
        teamGrad.addColorStop(0,'rgba(200,200,10,1)');
    }
    ctx2d.fillStyle=teamGrad;
    ctx2d.strokeStyle=getRGBA(0,0,1);
    ctx2d.fill();
    ctx2d.stroke();
}
function drawBattle(){ ///バトル画面の描画関数
    for(let i = 0;i < prls.length;i++){
        if(prls[i].isMsgBox!=1) drawPrl(prls[i]);
    }
}
function drawResult(){ ///結果画面の描画関数
    for(let i = 0;i < prls.length;i++){
        if(prls[i].isMsgBox!=1) drawPrl(prls[i]);
    }
}
function drawAvator1(){ ///アバターきせかえ画面の描画関数
    drawPrl({x1:60,y1:143,x2:648,y2:HEIGHT-30,colSet:0,hoverColSet:1,hoverCounter:0,textSize:0.6,text:""});
    drawPrl({x1:125,y1:152,x2:378,y2:331,lineWidth:2,shadow:0,colSet:11,hoverColSet:11,hoverCounter:0,textSize:0.6,text:""});
    drawPrl({x1:572,y1:90,x2:WIDTH-25,y2:HEIGHT-100,colSet:0,hoverColSet:1,hoverCounter:0,textSize:0.6,text:""});
    drawAvator(avatorData[0],146,152,352,331,t,1);
    for(let i = 0;i < prls.length;i++){
        if(prls[i].isMsgBox!=1) drawPrl(prls[i]);
    }
    ctx2d.font="14pt " + JAPANESE_FONTNAME;
    ctx2d.fillStyle=getRGBA(0,0,1);
    ctx2d.fillText("名前",388,172);
    ctx2d.fillText("チーム",379,202);
    ctx2d.fillText("LV.",120,360);
    ctx2d.fillText("EXP",210,360);
    ctx2d.font="10pt " + JAPANESE_FONTNAME;
    ctx2d.fillText("kpm",367,242);
    ctx2d.fillText("acc",358,272);
    ctx2d.fillText("換算kpm",349,302);
    ctx2d.fillText("勝利",485,242);
    ctx2d.fillText("敗北",476,272);
    ctx2d.fillText("勝率",467,302);
    ctx2d.fillText("勝率(格上)",403.5,362);
    ctx2d.fillText("勝率(同格)",396,387);
    ctx2d.fillText("勝率(格下)",389.5,412);
    ctx2d.fillText("総打鍵",382,437);
    ctx2d.fillText("総プレイ",374.5,462);
    ctx2d.fillText("総リタイア",367,487);
    ctx2d.font="14pt " + DIGIT_FONTNAME;
    ctx2d.fillText("19",160,360);
    ctx2d.fillText("325,532",270,360);
    ctx2d.font="12pt " + DIGIT_FONTNAME;
    ctx2d.fillText("9999.9",407,242);
    ctx2d.fillText("100.0%",398,272);
    ctx2d.fillText("9999.9",389,322);
    ctx2d.fillText("9999",525,242);
    ctx2d.fillText("9999",516,272);
    ctx2d.fillText("100.0%",507,302);
    ctx2d.fillText("100.0%",493.5,362);
    ctx2d.fillText("100.0%",486,387);
    ctx2d.fillText("100.0%",479.5,412);
    ctx2d.fillText("999999999",442,437);
    ctx2d.fillText("999999",464.5,462);
    ctx2d.fillText("999999",457,487);
}
function drawAvator2(){ ///アバター管理画面の描画関数
    for(let i = 0;i < prls.length;i++){
        if(prls[i].isMsgBox!=1) drawPrl(prls[i]);
    }
}
function drawSetting(){ ///設定画面の描画関数
    drawLoadingCircle(WIDTH-230,230,160,t/3.2,1000);//////////動く丸
    drawLoadingCircle(50,HEIGHT-60,220,t/2.7,1000);
    for(let i = 0;i < prls.length;i++){
        if(prls[i].isMsgBox!=1) drawPrl(prls[i]);
    }
    for(let i = 0;i < 9;i++){
        let offset= 10*(i >= 3) + 10*(i>=8);
        ctx2d.font="14pt " + JAPANESE_FONTNAME;
        ctx2d.lineWidth=1;
        ctx2d.strokeStyle=getRGBA(0,0,1);
        ctx2d.fillStyle=getRGBA(0,0,1);
        ctx2d.fillText(SETTING_NAME[i],-i*8.7-offset*0.3+180,i*29+195+offset);
        if(i != 8){
            if(playData.settings[i] == 0){
                drawPrl({x1:-i*8.7+460,y1:i*29+180+offset,x2:-i*8.7+535,y2:i*29+180+24+offset,lineWidth:2,shadow:0,colSet:3,hoverColSet:3,hoverCounter:0,textSize:0.8,text:SETTING_SELECT[i][0]});
                drawPrl({x1:-i*8.7+540,y1:i*29+180+offset,x2:-i*8.7+615,y2:i*29+180+24+offset,lineWidth:2,shadow:0,colSet:13,hoverColSet:13,hoverCounter:0,textSize:0.8,text:SETTING_SELECT[i][1]});
            } else{
                drawPrl({x1:-i*8.7+460,y1:i*29+180+offset,x2:-i*8.7+535,y2:i*29+180+24+offset,lineWidth:2,shadow:0,colSet:13,hoverColSet:13,hoverCounter:0,textSize:0.8,text:SETTING_SELECT[i][0]});
                drawPrl({x1:-i*8.7+540,y1:i*29+180+offset,x2:-i*8.7+615,y2:i*29+180+24+offset,lineWidth:2,shadow:0,colSet:3,hoverColSet:3,hoverCounter:0,textSize:0.8,text:SETTING_SELECT[i][1]});
            }
        }
    }
}
function processMouseEvent(){ //平行四辺形ボタンに対してのホバー処理
    mouseStatus=0;
    for(let i = 0;i < prls.length;i++){
        if(mouseY>prls[i].y1 && mouseY<prls[i].y2 && mouseX>prls[i].x1+(prls[i].y2-prls[i].y1)*0.3 && mouseX<prls[i].x2-(prls[i].y2-prls[i].y1)*0.3){
            if(!(msgBox.length && prls[i].isMsgBox!=1)){
                prls[i].hoverCounter++;
                if(prls[i].hoverCounter>10) prls[i].hoverCounter=10;
                if(prls[i].onClick!=undefined)mouseStatus=1;
            }
        } else{
            prls[i].hoverCounter--;
            if(prls[i].hoverCounter<0) prls[i].hoverCounter=0;
        }
    }
}
function processClick(){
    for(var i = 0;i < prls.length;i++){
        if(prls[i].hoverCounter && sceneAni==0) {
            if(clickY>prls[i].y1 && clickY<prls[i].y2 && clickX>prls[i].x1+(prls[i].y2-prls[i].y1)*0.3 && clickX<prls[i].x2-(prls[i].y2-prls[i].y1)*0.3){
                if(!(msgBox.length && prls[i].isMsgBox!=1) && prls[i].onClick!=undefined){ //メッセージボックス表示中なら、メッセージボックス以外スルー　onclickが定義されていない場合もスルー
                    prls[i].onClick();
                    clickX=0,clickY=0;
                    if(prls[i].isMsgBox&& prls[i].noDestruct!=1)  msgBox[0].ani=t,msgBox[0].flg=2;
                } 
            }
        }
    }
}
function changeScene(prev,next){ //シーン遷移の関数
    prls=[];
    msgBox=[];
    ctx2dImg.clearRect(0,0,WIDTH,HEIGHT);
    if(next==1){ //タイトル画面に遷移する場合
        prls.push({x1:WIDTH/2-100,y1:HEIGHT/2+100,x2:WIDTH/2+100,y2:HEIGHT/2+150,colSet:0,hoverColSet:1,hoverCounter:0,text:"START",onClick:function(){
            if(firstLaunchFlg){ //初回起動時
                msgBox.push({
                    text:"AVA-TYPEへようこそ！　まずはアバターの作成を行いましょう。",
                    ani:t,
                    btns1:{text:"OK",onClick:function(){ //アバター作成の初期ウィンドウを表示
                        msgBox.push({createAvatorWindow:1,
                        text:"",
                        ani:t+200,
                        flg:0,
                        });}}});
            } else{
                loadData();
                nextScene=2;sceneAni=t;
            }
        }})
    } else if(next == 2){
        ctx2dImg.drawImage(backImg[0],0,0,WIDTH,HEIGHT);
        prls.push({x1:570,y1:110,x2:870,y2:205,colSet:0,hoverColSet:1,hoverCounter:0,textSize:0.5,text:"TITLE",subText:"タイトル",onClick:function(){
            msgBox.push({
                text:"本当にタイトルに戻りますか？",
                ani:t,
                btns1:{text:"OK",onClick:function(){nextScene=1;sceneAni=t}},
                btns2:{text:"CANCEL",onClick:function(){return 0;}}});}})
        prls.push({x1:540,y1:225,x2:840,y2:320,colSet:0,hoverColSet:1,hoverCounter:0,textSize:0.5,text:"SETTING",subText:"設定",onClick:function(){
            nextScene=7,sceneAni=t;
            for(let i = 0;i < 9;i++){previousSettings[i] = playData.settings[i]}}})
        prls.push({x1:540,y1:340,x2:858,y2:490,colSet:1,hoverColSet:1,hoverCounter:0,textSize:0.6,text:"",rev:1,onClick:function(){
            return 0;}})
        prls.push({x1:100,y1:110,x2:578,y2:320,colSet:0,hoverColSet:1,hoverCounter:0,textSize:0.4,text:"BATTLE!",subText:"対戦",rev:0,onClick:function(){
            nextScene=3,sceneAni=t;}})
        prls.push({x1:100,y1:340,x2:558,y2:490,colSet:0,hoverColSet:1,hoverCounter:0,textSize:0.4,text:"AVATOR",subText:"アバター",rev:1,onClick:function(){
            nextScene=5,sceneAni=t;}})
    }  else if(next==3){//試合
        ctx2dImg.drawImage(backImg[1],0,0,WIDTH,HEIGHT);

    } else if(next==4){//試合結果
        ctx2dImg.drawImage(backImg[3],0,0,WIDTH,HEIGHT);//負けたら4
        prls.push({x1:30,y1:30,x2:450,y2:130,colSet:14,hoverColSet:14,hoverCounter:0,textSize:0.8,text:"RESULT"});
    } else if(next==5){//アバター　きせかえ
        ctx2dImg.drawImage(backImg[5],0,0,WIDTH,HEIGHT);
        prls.push({x1:30,y1:30,x2:450,y2:130,colSet:14,hoverColSet:14,hoverCounter:14,textSize:0.8,text:"AVATOR"});
        prls.push({x1:430,y1:90,x2:663,y2:130,colSet:0,hoverColSet:1,hoverCounter:0,textSize:0.8,text:"アバター管理",onClick:function(){nextScene=6,sceneAni=t}});
        prls.push({x1:550,y1:HEIGHT-90,x2:720,y2:HEIGHT-30,colSet:0,hoverColSet:1,hoverCounter:0,textSize:0.6,text:"SAVE",subText:"保存",onClick:function(){
            nextScene=2,sceneAni=t,setAvatorData(0),saveData();}});
        prls.push({x1:710,y1:HEIGHT-90,x2:880,y2:HEIGHT-30,colSet:0,hoverColSet:1,hoverCounter:0,textSize:0.6,text:"CANCEL",subText:"キャンセル",onClick:function(){
            msgBox.push({
                text:"変更を保存せずにメニュー画面へ戻りますか？",
                ani:t,
                btns1:{text:"OK",onClick:function(){nextScene=2,sceneAni=t;
                setAvatorData(1),
                saveData()}},
                btns2:{text:"CANCEL",onClick:function(){return 0;}}})
        }});
    } else if(next==6){//アバター管理
        ctx2dImg.drawImage(backImg[0],0,0,WIDTH,HEIGHT);
        prls.push({x1:30,y1:30,x2:450,y2:130,colSet:14,hoverColSet:14,hoverCounter:0,textSize:0.8,text:"AVATOR"});
    } else if(next==7){ //設定
        ctx2dImg.drawImage(backImg[2],0,0,WIDTH,HEIGHT);
        prls.push({x1:30,y1:30,x2:450,y2:130,colSet:14,hoverColSet:14,hoverCounter:0,textSize:0.8,text:"SETTING"});
        prls.push({x1:65,y1:160,x2:640,y2:HEIGHT-60,colSet:0,hoverColSet:0,hoverCounter:0,textSize:0.8,text:""});
        prls.push({x1:550,y1:HEIGHT-120,x2:720,y2:HEIGHT-60,colSet:0,hoverColSet:1,hoverCounter:0,textSize:0.6,text:"SAVE",subText:"保存",onClick:function(){
            nextScene=2,sceneAni=t,saveData();}});
        prls.push({x1:710,y1:HEIGHT-120,x2:880,y2:HEIGHT-60,colSet:0,hoverColSet:1,hoverCounter:0,textSize:0.6,text:"CANCEL",subText:"キャンセル",onClick:function(){
            msgBox.push({
                text:"変更を保存せずにメニュー画面へ戻りますか？",
                ani:t,
                btns1:{text:"OK",onClick:function(){nextScene=2,sceneAni=t;
                for(let i = 0;i < 9;i++){playData.settings[i] = previousSettings[i]};
                saveData()}},
                btns2:{text:"CANCEL",onClick:function(){return 0;}}})
        }});
        for(let i = 0; i < 9;i++){
            let offset= 10*(i >= 3) + 10*(i>=8);
            if(i != 8){
                prls.push({x1:-i*8.7+460,y1:i*29+180+offset,x2:-i*8.7+535,y2:i*29+180+24+offset,lineWidth:2,shadow:0,colSet:12,hoverColSet:12,hoverCounter:0,textSize:0.8,text:SETTING_SELECT[i][0],onClick:function(){playData.settings[i] = 0;}});
                prls.push({x1:-i*8.7+540,y1:i*29+180+offset,x2:-i*8.7+615,y2:i*29+180+24+offset,lineWidth:2,shadow:0,colSet:12,hoverColSet:12,hoverCounter:0,textSize:0.8,text:SETTING_SELECT[i][1],onClick:function(){playData.settings[i] = 1;}});    
            } else {
                prls.push({x1:-i*8.7+460,y1:i*29+180+offset,x2:-i*8.7+615,y2:i*29+180+24+offset,lineWidth:2,shadow:0,colSet:13,hoverColSet:13,hoverCounter:0,textSize:0.8,text:SETTING_SELECT[i][0],onClick:function(){
                    msgBox.push({
                        text:"すべてのプレイデータをリセットしますか？　プレイデータをダウンロードしていない場合、データの復元はできません。",
                        ani:t,
                        btns1:{text:"OK",onClick:function(){resetData(),nextScene=1,sceneAni=t;}},
                        btns2:{text:"CANCEL",onClick:function(){return 0;}}})
                    }
                })
            }
        }
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
    if(DEBUG_MODE) loadData();
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
        } else if(scene == 3){ //バトル画面
            drawBattle();
        }else if(scene == 4){ //結果画面
            drawResult();
        }else if(scene == 5){ //アバターきせかえ画面
            drawAvator1();
        }else if(scene == 6){ //アバター管理画面
            drawAvator2();
        }else if(scene == 7){//設定画面
            drawSetting();
        }

        /////////////////全シーン共通処理
        drawMsgbox();   
        drawMouseCursor();
        processMouseEvent();
        if(clickX && clickY) processClick();
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