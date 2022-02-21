var prls = [];//描画する平行四辺形の構造体の配列
var msgBox=[];//描画するメッセージボックスの構造体の配列
var previousSettings=[];//直前の設定を保存するため
function processKeypress(myKey,myKeyCode,e){ //キー入力イベント　シーン→キー→条件の順番で分ける
    if(scene==3){//バトル中
        if(myKeyCode == 27 && nextScene!=2){//Escキー　タイトルへ戻る
            nextScene=2;sceneAni=t;
            clickX=0,clickY=0;
            battleData.esc++;
            saveData();
        }
        if((playData.settings[0]==0 && (myKeyCode>=65 && myKeyCode<=90 || myKeyCode==189)) || (playData.settings[0] == 1 && (myKeyCode!=27 && myKeyCode!=16))){//文字入力
            if(battleStatus==2){//入力受理中なら
                //ローマ字なら最適化を実施する
                battleResult.totalStroke++;
                if((playData.settings[0]==0 && checkOpt(battleResult.wordSet[battleResult.now].myText,typedText + myKey).isMiss==0) ||(playData.settings[0]==1 && checkKana(battleResult.wordSet[battleResult.now].myText,typedText + keyToKana(myKey,e.shiftKey)).isMiss==0)){
                    //受理可能な時の処理
                    battleResult.wordSet[battleResult.now].myText = checkOpt(battleResult.wordSet[battleResult.now].myText,typedText + myKey).newTargetStr;
                    if(playData.settings[0] == 0){
                        typedText+=myKey;
                    } else{
                        typedText+=keyToKana(myKey,e.shiftKey);
                    }
                } else{
                    //ミスの時の処理
                    battleResult.totalMiss++;
                    missAni=t;
                    missChar=typedText.length;
                }
            }
        }
    }
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
        processKeypress(e.key,e.keyCode,e);
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
function refreshWord(startFlg){
    typedText="";
    enemyTypedText="";
    battleResult.now++;
    if(startFlg) return 0;
    battleStatus=3;
    battleAni=t;
}
function drawTeamCircle(x,y,size,team,trans){
    if(trans == undefined) trans = 1;
    ctx2d.lineWidth=2;//チームを表す円
    ctx2d.strokeStyle="rgba(0,0,0,"+trans + ")";
    let teamGrad=ctx2d.createLinearGradient(x-size,y+size,x+size,y-size);
    if(team==0){
        teamGrad.addColorStop(0,'rgba(100,10,10,'+trans + ')');
        teamGrad.addColorStop(1,'rgba(200,10,10,'+trans+')');
    } else if(team==1){
        teamGrad.addColorStop(0,'rgba(10,10,100,'+trans + ')');
        teamGrad.addColorStop(1,'rgba(10,10,200,'+trans + ')');
    } else if(team==2){
        teamGrad.addColorStop(0,'rgba(130,100,10,'+trans + ')');
        teamGrad.addColorStop(1,'rgba(200,200,10,'+trans + ')');
    } else { //無所属
        teamGrad.addColorStop(0,'rgba(50,50,50,'+trans + ')');
        teamGrad.addColorStop(1,'rgba(130,130,130,'+trans + ')');
    }
    ctx2d.fillStyle=teamGrad;
    ctx2d.beginPath();
    ctx2d.arc(x,y,size,0,Math.PI*2);
    ctx2d.fill();
    ctx2d.stroke();
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
    const PRL_COLSET=[[[213,213,223,1],[141,141,151,1],[230,230,235,1]], //灰色用
            [[165,163,168,1],[125,123,128,1],[175,173,178,1]], //灰色ホバー用
            [[175,173,188,1.2],[125,123,138,1.2],[185,183,208,1.2]],//透けにくい灰色(メッセージボックス用)
            [[255,192,0,1.2],[127,96,0,1.2],[255,192,0,1.2]],//黄色（決定など）
            [[225,162,0,1.2],[97,66,0,1.2],[225,162,0,1.2]],//黄色ホバー
            [[185,0,0,1.2],[137,0,0,1.2],[185,0,0,1.2]],//赤  (5)
            [[145,0,0,1.2],[57,0,0,1.2],[145,0,0,1.2]],
            [[0,15,200,1.2],[0,10,120,1.2],[0,15,210,1.2]],//青
            [[0,5,180,1.2],[0,5,130,1.2],[0,5,180,1.2]],
            [[180,160,0,1.2],[130,110,0,1.2],[180,162,0,1.2]],//黄
            [[140,122,0,1.2],[90,70,0,1.2],[140,122,0,1.2]], //(10)
            [[0,0,0,0.8],[0,0,0,0.8],[0,0,0,0.8]],//黒やや透明
            [[0,0,0,0],[0,0,0,0],[0,0,0,0]],//透明　枠のみ
            [[40,40,40,1.2],[2,3,8,1.2],[40,40,40,1.2]],//濃い灰色（キャンセル系） 13
            [[141,141,141,0.85],[34,42,53,0.81],[135,135,135,1]],//画面のタイトル用 14
            [[255,255,255,0.9],[255,255,255,1],[223,223,223,0.9]],//battleCircleの背景　15
            [[100,120,80,1],[120,130,140,1],[120,180,150,1]]//青緑 16
        ];
    const FRAME_COLSET=[[20,20,20,0.8],[0,0,0,0.8],[20,23,20,0.8],[40,20,5,0.8],[40,20,5,0.8],
                        [20,23,20,0],[20,23,20,0.8],[20,20,20,0.8],[20,20,20,0.8],[20,20,20,0.8],[20,20,20,0.8],[0,0,0,1],[0,0,0,1],[0,0,0,1],[0,0,0,1],[100,0,0,1],[0,0,0,1]];
    const TEXT_COLSET=[[0,0,0],[0,0,0],[0,0,0],[255,255,255],[255,255,255],
                        [255,255,255],[255,255,255],[255,255,255],[255,255,255],[255,255,255],[255,255,255],[255,255,255],[0,0,0],[255,255,255],[255,255,255],[255,255,255],[255,255,255]];
    for(var i = 0;i < 3;i++){
        drawGrad.addColorStop(i/2+0.1*(i==1),'rgba(' + 
         (PRL_COLSET[drawPrl.hoverColSet][i][0]*drawPrl.hoverCounter+PRL_COLSET[drawPrl.colSet][i][0]*(10-drawPrl.hoverCounter))/10 + ',' +  
         (PRL_COLSET[drawPrl.hoverColSet][i][1]*drawPrl.hoverCounter+PRL_COLSET[drawPrl.colSet][i][1]*(10-drawPrl.hoverCounter))/10 + ',' +  
         (PRL_COLSET[drawPrl.hoverColSet][i][2]*drawPrl.hoverCounter+PRL_COLSET[drawPrl.colSet][i][2]*(10-drawPrl.hoverCounter))/10+ ',' + PRL_COLSET[drawPrl.hoverColSet][i][3]*Math.abs(drawPrl.trans * 0.7) + ")")
    }
    if(drawPrl.shadow!=0){　//影を描く
        var shadowGrad=ctx2d.createLinearGradient(drawPrl.x1,drawPrl.y2,drawPrl.x1,drawPrl.y2+15);
        shadowGrad.addColorStop(0,'rgba(0,0,0,'+drawPrl.trans*0.8+')');
        shadowGrad.addColorStop(0.3,'rgba(0,0,0,'+drawPrl.trans*0.7+')');
        shadowGrad.addColorStop(1,'rgba(0,0,0,0)');
        ctx2d.fillStyle=shadowGrad;
        if(drawPrl.rev==1){
            ctx2d.fillRect(drawPrl.x1+((drawPrl.y2-drawPrl.y1)*0.3)-ctx2d.lineWidth/2,drawPrl.y2,drawPrl.x2-(drawPrl.x1+(drawPrl.y2-drawPrl.y1)*0.3)+ctx2d.lineWidth,15);
        } else{
            ctx2d.fillRect(drawPrl.x1-ctx2d.lineWidth/2,drawPrl.y2,drawPrl.x2-(drawPrl.x1+(drawPrl.y2-drawPrl.y1)*0.3)+ctx2d.lineWidth,15);
        }
        ctx2d.beginPath();
        if(drawPrl.rev==1){ //反転の影
            ctx2d.moveTo(drawPrl.x1-ctx2d.lineWidth/2,drawPrl.y1);
            ctx2d.lineTo(drawPrl.x1-ctx2d.lineWidth/2,drawPrl.y1+15);
            ctx2d.lineTo(drawPrl.x1-ctx2d.lineWidth/2+(drawPrl.y2-drawPrl.y1)*0.3,drawPrl.y2+15);
            ctx2d.lineTo(drawPrl.x1+(drawPrl.y2-drawPrl.y1)*0.3-ctx2d.lineWidth/2,drawPrl.y2);
            ctx2d.lineTo(drawPrl.x1-ctx2d.lineWidth/2,drawPrl.y1);
//            shadowGrad=ctx2d.createLinearGradient(drawPrl.x2,drawPrl.y2,drawPrl.x2-15/0.3,drawPrl.y2+15);
        } else{ //通常の影
            ctx2d.moveTo(drawPrl.x2+ctx2d.lineWidth/2,drawPrl.y1);
            ctx2d.lineTo(drawPrl.x2+ctx2d.lineWidth/2,drawPrl.y1+15);
            ctx2d.lineTo(drawPrl.x2+ctx2d.lineWidth/2-(drawPrl.y2-drawPrl.y1)*0.3,drawPrl.y2+15);
            ctx2d.lineTo(drawPrl.x2+ctx2d.lineWidth/2-(drawPrl.y2-drawPrl.y1)*0.3,drawPrl.y2);
            ctx2d.moveTo(drawPrl.x2+ctx2d.lineWidth/2,drawPrl.y1);
            //shadowGrad=ctx2d.createLinearGradient(drawPrl.x2,drawPrl.y2,drawPrl.x2+15/0.3,drawPrl.y2+15);
        }/*
        shadowGrad.addColorStop(0,'rgba(0,0,0,'+drawPrl.trans+')');
        shadowGrad.addColorStop(0.3,'rgba(0,0,0,'+drawPrl.trans*0.9+')');
        shadowGrad.addColorStop(1,'rgba(0,0,0,0)');*/
        ctx2d.fillStyle='rgba(0,0,0,0.4)';
        ctx2d.fill();
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
        ctx2d.fillText(drawPrl.subText,(drawPrl.x2+drawPrl.x1)/2-ctx2d.measureText(drawPrl.subText).width/2,drawPrl.y1+(drawPrl.y2-drawPrl.y1)*0.73);
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
        if(msgBox[0].changeNameWindow){ //アバターの名前変更ウィンドウ
            if(msgBox[0].flg!=1 && msgBox[0].flg!=2){//作成ボタンをprlsへプッシュする
                prls.push({isMsgBox:1,x1:WIDTH/2-123,y1:HEIGHT/2+23,x2:WIDTH/2-20,y2:HEIGHT/2+48,shadow:0,colSet:3,textSize:0.9,hoverColSet:4,hoverCounter:0,lineWidth:5,text:"変更",trans:-1,onClick:function(){
                    //アバター作成可能判定処理をここへ
                    let tempName=document.getElementById("nameBoxChange").value;
                    if(tempName.length>8){ //9文字以上
                        document.getElementById("nameBoxChange").style.display="none";
                        msgBox.push({
                            text:"名前が長すぎます。8文字以内にしてください。",
                            ani:t,
                            btns1:{text:"OK",onClick:function(){ //アバター作成の初期ウィンドウを表示
                                msgBox.push({changeNameWindow:1,
                                text:"",
                                ani:t+200,
                                flg:0,
                                });}}});
                    } else if(tempName.length==0){//名前が未入力
                        document.getElementById("nameBoxChange").style.display="none";
                        msgBox.push({
                            text:"名前を入力してください。",
                            ani:t,
                            btns1:{text:"OK",onClick:function(){ //アバター作成の初期ウィンドウを表示
                                msgBox.push({changeNameWindow:1,
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
                            document.getElementById("nameBoxChange").style.display="none";
                            msgBox.push({
                                text:"名前に使用できない文字が含まれています。",
                                ani:t,
                                btns1:{text:"OK",onClick:function(){ //アバター作成の初期ウィンドウを表示
                                    msgBox.push({changeNameWindow:1,
                                    text:"",
                                    ani:t+200,
                                    flg:0,
                                    });}}});
                        } else{//作成可能な時
                            document.getElementById("nameBoxChange").style.display="none";
                            msgBox.push({
                                text:"名前を「" + tempName + "」に変更しますか？",
                                ani:t,
                                btns1:{text:"OK",onClick:function(){ //名称変更
                                    avatorData[0].name=tempName;
                                    document.getElementById("nameBoxChange").style.display="none";
                                    msgBox.push({
                                        text:"名前を「"+ tempName+"」に変更しました。",
                                        ani:t,
                                        btns1:{text:"OK",onClick:function(){}}
                                    })
                                }},
                                btns2:{text:"CANCEL",onClick:function(){msgBox.push({
                                    text:"名前の変更をキャンセルしました。",
                                    ani:t,
                                    btns1:{text:"OK",onClick:function(){}}
                                })}}});
                        }
                    }
                }});
                prls.push({isMsgBox:1,x1:WIDTH/2-10,y1:HEIGHT/2+23,x2:WIDTH/2+88,y2:HEIGHT/2+48,shadow:0,colSet:13,textSize:0.8,hoverColSet:11,hoverCounter:0,text:"キャンセル",trans:-1,onClick:function(){document.getElementById("nameBoxChange").style.display="none";}});
                document.getElementById("nameBoxChange").style.display="inline";
                document.getElementById("nameBoxChange").value=avatorData[0].name;
                msgBox[0].flg=1;
            }
            drawPrl({x1:WIDTH/2-200,y1:HEIGHT/2-100,x2:WIDTH/2+200,y2:HEIGHT/2+60,colSet:2,hoverColSet:2,hoverCounter:0,text:"",trans:myAni*1.1,onClick:function(){return 0}})
            ctx2d.font="18pt " + JAPANESE_FONTNAME;
            ctx2d.fillStyle=getRGBA(0,0,myAni);
            ctx2d.fillText("名前の変更",WIDTH/2-143,HEIGHT/2-70);
            ctx2d.font="12pt " + JAPANESE_FONTNAME;
            ctx2d.fillText("新しい名前を入力してください。",WIDTH/2-149,HEIGHT/2-40);
        } else if(msgBox[0].changeTeamWindow){//アバターのチーム変更ウィンドウ
            if(msgBox[0].flg!=1 && msgBox[0].flg!=2){//作成ボタンをprlsへプッシュする
                prls.push({isMsgBox:1,x1:WIDTH/2-123,y1:HEIGHT/2+63,x2:WIDTH/2-20,y2:HEIGHT/2+88,shadow:0,colSet:3,textSize:0.9,hoverColSet:4,hoverCounter:0,lineWidth:5,text:"変更",trans:-1,onClick:function(){
                    if(avatorData[0].team!=avatorData[1].team){
                        msgBox.push({
                            text:"「鞍替えの紋章」を使用して、チームを" + TEAM_TEXT[avatorData[1].team] + "に変更しますか？　変更は保存され、メニュー画面に戻ります。",
                            ani:t,
                            btns1:{text:"YES",onClick:function(){ //チーム変更
                                avatorData[0].team=avatorData[1].team;
                                playData.item[4][2]=0;//アイテム消費
                                document.getElementById("nameBoxChange").style.display="none";
                                msgBox.push({
                                    text:"チームを"+ TEAM_TEXT[avatorData[1].team]+"に変更しました。メニュー画面に戻ります。",
                                    ani:t,
                                    btns1:{text:"OK",onClick:function(){setAvatorData(0),saveData(),sceneAni=t,nextScene=2;}}
                                })
                            }},
                            btns2:{text:"NO",onClick:function(){//変更のキャンセル
                                avatorData[1].team=avatorData[0].team;
                                msgBox.push({text:"チームの変更をキャンセルしました。",
                                    ani:t,
                                    btns1:{text:"OK",onClick:function(){}}
                            })}}});
                    } else{
                        msgBox.push({
                            text:"現在と同じチームです。",
                            ani:t,
                            btns1:{text:"OK",onClick:function(){
                                msgBox.push({changeTeamWindow:1,
                                    text:"",
                                    ani:t,
                                    flg:0});
                            }}
                        })
                    }
                }});
                prls.push({isMsgBox:1,x1:WIDTH/2-10,y1:HEIGHT/2+63,x2:WIDTH/2+88,y2:HEIGHT/2+88,shadow:0,colSet:13,textSize:0.8,hoverColSet:11,hoverCounter:0,text:"キャンセル",trans:-1,onClick:function(){document.getElementById("nameBoxChange").style.display="none";}});
                prls.push({isMsgBox:1,x1:WIDTH/2-100,y1:HEIGHT/2+13,x2:WIDTH/2-40,y2:HEIGHT/2+38,shadow:0,colSet:5,textSize:0.9,hoverColSet:6,hoverCounter:0,text:"",trans:-1,noDestruct:1,onClick:function(){avatorData[1].team=0;}});
                prls.push({isMsgBox:1,x1:WIDTH/2-30,y1:HEIGHT/2+13,x2:WIDTH/2+30,y2:HEIGHT/2+38,shadow:0,colSet:7,textSize:0.8,hoverColSet:8,hoverCounter:0,text:"",trans:-1,noDestruct:1,onClick:function(){avatorData[1].team=1;}});
                prls.push({isMsgBox:1,x1:WIDTH/2+40,y1:HEIGHT/2+13,x2:WIDTH/2+100,y2:HEIGHT/2+38,shadow:0,colSet:9,textSize:0.8,hoverColSet:10,hoverCounter:0,text:"",trans:-1,noDestruct:1,onClick:function(){avatorData[1].team=2;}});
                msgBox[0].flg=1;
            }
            drawPrl({x1:WIDTH/2-200,y1:HEIGHT/2-100,x2:WIDTH/2+200,y2:HEIGHT/2+100,colSet:2,hoverColSet:2,hoverCounter:0,text:"",trans:myAni*1.1,onClick:function(){return 0}})
            ctx2d.font="18pt " + JAPANESE_FONTNAME;
            ctx2d.fillStyle=getRGBA(0,0,myAni);
            ctx2d.fillText("チームの変更",WIDTH/2-143,HEIGHT/2-65);
            ctx2d.font="11pt " + JAPANESE_FONTNAME;
            ctx2d.fillText("チームの変更には、アイテム「鞍替えの紋章」",WIDTH/2-144,HEIGHT/2-30);
            ctx2d.fillText("を消費します。どのチームに変更しますか？",WIDTH/2-144,HEIGHT/2-10);
        }  else if(msgBox[0].selectBattleAvatorWindow){//戦う相手の選択ウィンドウ
            if(msgBox[0].flg!=1 && msgBox[0].flg!=2){//ボタンをprlsへプッシュする
                prls.push({isMsgBox:1,x1:WIDTH/2+50,y1:HEIGHT/2+112,x2:WIDTH/2+205,y2:HEIGHT/2+162,shadow:0,colSet:3,textSize:0.9,hoverColSet:4,hoverCounter:0,noDestruct:1,lineWidth:8,text:"BATTLE!",trans:-1,onClick:function(){
                    if(localAvator[selectBattleAvatorClass].length > selectBattleAvator){
                        sceneAni=t;
                        nextScene=3;////バトル開始ボタン　敵データのセットなどをここにおく
                        battleAni=t;//バトル開始時のアニメーション
                        battleStatus=0;//バトル開始のアニメーションモードへ
                        enemyAvatorData = localAvator[selectBattleAvatorClass][selectBattleAvator];
                        setBattleResultDefault();//バトルデータのセットを呼び出し
                        refreshWord(1);
                    } else{
                        //敵を選択していないのにバトルを押した時　効果音などをここに入れる
                    }
                }});
                prls.push({isMsgBox:1,x1:WIDTH/2-50,y1:HEIGHT/2+132,x2:WIDTH/2+45,y2:HEIGHT/2+162,shadow:0,colSet:14,textSize:0.9,hoverColSet:13,hoverCounter:0,lineWidth:2,text:"CANCEL",trans:-1,onClick:function(){}});
                for(let i = 0;i < 5;i++){
                    prls.push({isMsgBox:1,x1:WIDTH/2-197+i*48,y1:HEIGHT/2-162,x2:WIDTH/2-152+i*48,y2:HEIGHT/2-142,id:i,shadow:0,colSet:0+(i == selectBattleAvatorClass),noDestruct:1,textSize:0.9,hoverColSet:1,hoverCounter:0,lineWidth:3,text:AVATOR_CLASS_TEXT[i],trans:-1,onClick:function(){
                        for(let j = 0;j < prls.length;j++){
                            if(prls[j].id == i){
                                prls[j].colSet=1;
                            }else if(prls[j].id>=0 && prls[j].id<=4){
                                prls[j].colSet=0;
                            } 
                        }
                        selectBattleAvatorClass=i;
                        selectBattleAvator=0;
//                        setAvatorSelectButtonEach(localAvator);
                        setAvatorSelectButton(localAvator);
                    }});
                }
                setAvatorSelectButton(localAvator);
                prls.push({isMsgBox:1,x1:WIDTH/2+130,y1:HEIGHT/2-162,x2:WIDTH/2+288,y2:HEIGHT/2-130,shadow:0,colSet:14,textSize:0.9,hoverColSet:13,lineWidth:4,hoverCounter:0,text:"アバターの管理",trans:-1,onClick:function(){
                    sceneAni=t;
                    nextScene=6;
                }});
                prls.push({isMsgBox:1,x1:WIDTH/2-269,y1:HEIGHT/2-117,x2:WIDTH/2+28,y2:HEIGHT/2+100,shadow:0,colSet:14,textSize:0.9,hoverColSet:14,lineWidth:2,noDestruct:1,hoverCounter:0,text:"",trans:-1});
                prls.push({isMsgBox:1,x1:WIDTH/2-28,y1:HEIGHT/2-117,x2:WIDTH/2+275,y2:HEIGHT/2+100,shadow:0,colSet:0,textSize:0.9,hoverColSet:0,lineWidth:4,noDestruct:1,hoverCounter:0,text:"",trans:-1});
                for(let i = 0;i < 6;i++){
                    prls.push({isMsgBox:1,x1:WIDTH/2-25-i*9,y1:HEIGHT/2-78+i*30,x2:WIDTH/2+10-i*9,y2:HEIGHT/2-58+i*30,id:i+10,shadow:0,colSet:0+3*(i == selectBattleAvator),noDestruct:1,textSize:0.9,hoverColSet:1+3*(i == selectBattleAvator),hoverCounter:0,lineWidth:3,text:"選択",trans:-1,onClick:function(){
                        if(localAvator[selectBattleAvatorClass].length<=i) return 0;
                        selectBattleAvator=i;
                        setAvatorSelectButton(localAvator);
                    }});
                    ctx2d.fillText("- - -",WIDTH/2-190-i*9,HEIGHT/2-65+i*30);
                }
                setAvatorSelectButton(localAvator);
                msgBox[0].flg=1;
            }
            drawPrl({x1:WIDTH/2-300,y1:HEIGHT/2-170,x2:WIDTH/2+300,y2:HEIGHT/2+170,colSet:2,hoverColSet:2,hoverCounter:0,text:"",trans:myAni*1.1,onClick:function(){return 0}})
        } else if(msgBox[0].createAvatorWindow==1){ //アバター作成ウィンドウ
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
                prls.push({isMsgBox:1,x1:WIDTH/2+30,y1:HEIGHT/2+98,x2:WIDTH/2+110,y2:HEIGHT/2+128,shadow:0,colSet:13,textSize:0.8,hoverColSet:11,hoverCounter:0,text:"キャンセル",trans:-1,onClick:function(){document.getElementById("nameBoxCreate").style.display="none";}});
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
        } else{
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
        } else if(msgBox[0].changeTeamWindow){//チーム変更ウィンドウ
            for(let i = 0;i < 3;i++){
                if (i == avatorData[1].team){
                    drawPrl({isMsgBox:1,x1:WIDTH/2-100+70*i,y1:HEIGHT/2+13,x2:WIDTH/2-40+70*i,y2:HEIGHT/2+38,shadow:0,colSet:12,textSize:0.8,hoverColSet:12,lineWidth:7,hoverCounter:0,text:"",trans:-1});
                } else{
                    drawPrl({isMsgBox:1,x1:WIDTH/2-100+70*i,y1:HEIGHT/2+13,x2:WIDTH/2-40+70*i,y2:HEIGHT/2+38,shadow:0,colSet:11,textSize:0.8,hoverColSet:11,lineWidth:0,hoverCounter:0,text:"",trans:-1});
                }
            }
        } else if(msgBox[0].selectBattleAvatorWindow){//バトル相手選択ウィンドウ
            ctx2d.font="8pt " + JAPANESE_FONTNAME;
            ctx2d.fillStyle=getRGBA(9,0,myAni);
            ctx2d.fillText("NAME",WIDTH/2-190+9,HEIGHT/2-65-30);
            ctx2d.fillText("CP",WIDTH/2-70+15,HEIGHT/2-65-30);
            ctx2d.font="10pt " + JAPANESE_FONTNAME;
            ctx2d.fillStyle=getRGBA(0,0,myAni);
            for (let i = 0;i < 6;i++){
                if(localAvator[selectBattleAvatorClass].length>i){
                    let styleGrad=ctx2d.createLinearGradient(WIDTH/2-83-i*9,HEIGHT/2-70+i*30+7,WIDTH/2-83-i*9+15,HEIGHT/2-70+i*30+7);
                    if(localAvator[selectBattleAvatorClass][i].style == 0){
                        styleGrad.addColorStop(0,"rgba(180,220,220," + myAni*0.8 + ")");
                        styleGrad.addColorStop(1,"rgba(80,120,120," + myAni*0.8 + ")");
                    } else{
                        styleGrad.addColorStop(0,"rgba(220,180,220," + myAni*0.8 + ")");
                        styleGrad.addColorStop(1,"rgba(120,80,120," + myAni*0.8 + ")");
                    }
                    ctx2d.fillStyle=styleGrad;
                    ctx2d.fillRect(WIDTH/2-83-i*9,HEIGHT/2-67+i*30,15,4);
                    //有利なチームなら矢印を表示
                    if(msgBox[0].flg!=2 && localAvator[selectBattleAvatorClass][i].team != 3 && (3+avatorData[0].team-localAvator[selectBattleAvatorClass][i].team)%3 == 2){
                        ctx2d.drawImage(arrowImg,WIDTH/2-213-i*9,HEIGHT/2-78+i*30 - (5)*Math.max(0,Math.sin(t/150)*3-2.7),15,15);
                    }
                    ctx2d.fillStyle=getRGBA(0,0,myAni);
                    if(localAvator[selectBattleAvatorClass][i].name.length>=8){
                        ctx2d.font="8pt " + JAPANESE_FONTNAME;
                    }
                    ctx2d.fillText(localAvator[selectBattleAvatorClass][i].name,WIDTH/2-174-i*9,HEIGHT/2-65+i*30);
                    if(localAvator[selectBattleAvatorClass][i].name.length>=8){
                        ctx2d.font="8pt " + JAPANESE_FONTNAME;
                    }
                    ctx2d.fillText(INPUT_STYLE_SHORT[localAvator[selectBattleAvatorClass][i].style],WIDTH/2-80-i*9,HEIGHT/2-65+i*30);
                    if(localAvator[selectBattleAvatorClass][i].typingData.kpm-avatorData[playData.settings[0]].cp>50){//格上
                        ctx2d.fillStyle=getRGBA(11,0,myAni);
                    } else if(localAvator[selectBattleAvatorClass][i].typingData.kpm-avatorData[playData.settings[0]].cp<-50){//格下
                        ctx2d.fillStyle=getRGBA(10,0,myAni);
                    }
                    ctx2d.fillText(processShowData(localAvator[selectBattleAvatorClass][i].cp),WIDTH/2-59-i*9,HEIGHT/2-65+i*30);
                    if(msgBox[0].flg!=2) drawTeamCircle(WIDTH/2-188-i*9,HEIGHT/2-70+i*30,5,localAvator[selectBattleAvatorClass][i].team);
                } else {
                    ctx2d.fillStyle=getRGBA(0,0,myAni);
                    ctx2d.fillText("- - -",WIDTH/2-190-i*9,HEIGHT/2-65+i*30);
                    ctx2d.fillText("-",WIDTH/2-92-i*9,HEIGHT/2-65+i*30);
                    ctx2d.fillText("---",WIDTH/2-65-i*9,HEIGHT/2-65+i*30);
                }
            }
            drawPrl({isMsgBox:1,x1:WIDTH/2+93,y1:HEIGHT/2-116,x2:WIDTH/2+93+40,y2:HEIGHT/2-101,shadow:0,colSet:3,noDestruct:1,textSize:0.9,hoverColSet:3,hoverCounter:0,lineWidth:0.1,text:"YOU",trans:-1});
            drawPrl({isMsgBox:1,x1:WIDTH/2+93+140,y1:HEIGHT/2-116,x2:WIDTH/2+93+140+40,y2:HEIGHT/2-101,shadow:0,colSet:13,noDestruct:1,textSize:0.9,hoverColSet:13,hoverCounter:0,lineWidth:0.1,text:"ENEMY",trans:-1});
            ctx2d.font="16pt " + JAPANESE_FONTNAME;
            ctx2d.fillStyle=getRGBA(0,0,myAni);
            ctx2d.fillText("VS",WIDTH/2+120,HEIGHT/2-45);
            drawPrl({isMsgBox:1,x1:WIDTH/2-183+selectBattleAvatorClass*48,y1:HEIGHT/2-141,x2:WIDTH/2-180+selectBattleAvatorClass*48,y2:HEIGHT/2-116,shadow:0,colSet:13,noDestruct:13,textSize:0.9,hoverColSet:13,hoverCounter:0,lineWidth:0.1,text:"",trans:-1});
            if(msgBox[0].flg!=2){
                drawAvator(avatorData[0],WIDTH/2+5,HEIGHT/2-105,WIDTH/2+125,HEIGHT/2+5,t,1);//自分側データの描画
                drawStar(avatorData[0],WIDTH/2+10,HEIGHT/2,15);
                drawTeamCircle(WIDTH/2+20,HEIGHT/2-10,5,avatorData[0].team);
            }
            if(localAvator[selectBattleAvatorClass][selectBattleAvator] != null){//敵側のデータの描画
                if(msgBox[0].flg!=2 && localAvator[selectBattleAvatorClass][selectBattleAvator].team != 3 && (3+avatorData[0].team-localAvator[selectBattleAvatorClass][selectBattleAvator].team)%3 == 2){
                    ctx2d.drawImage(arrowImg,WIDTH/2+123,HEIGHT/2-20 - (5)*Math.max(0,Math.sin(t/150)*3-2.7),15,15);
                }
                drawPrl({isMsgBox:1,x1:WIDTH/2-220-selectBattleAvator*9,y1:HEIGHT/2-83+selectBattleAvator*30,x2:
                    WIDTH/2+15-selectBattleAvator*9,y2:HEIGHT/2-54+selectBattleAvator*30,shadow:0,colSet:12,noDestruct:1,textSize:0.9,hoverColSet:12,hoverCounter:0,lineWidth:2,text:"",trans:-1});
                if(msgBox[0].flg!=2){
                    drawAvator(localAvator[selectBattleAvatorClass][selectBattleAvator],WIDTH/2+145,HEIGHT/2-105,WIDTH/2+255,HEIGHT/2+5,t*1.1,1);
                    drawStar(localAvator[selectBattleAvatorClass][selectBattleAvator],WIDTH/2+140,HEIGHT/2,15);
                    drawTeamCircle(WIDTH/2+150,HEIGHT/2-10,5,localAvator[selectBattleAvatorClass][selectBattleAvator].team);    
                }
            } else{
                drawGhost(WIDTH/2+140,HEIGHT/2-115,WIDTH/2+260,HEIGHT/2+5,t*1.1,1);
            }
            ctx2d.lineWidth=1;
            ctx2d.strokeStyle=getRGBA(0,0,myAni);
            ctx2d.fillStyle=getRGBA(0,0,myAni);
            for(let i = 0;i < 4;i++){
                if(i==0) ctx2d.font="10pt " + MAIN_FONTNAME + "," + JAPANESE_FONTNAME;
                if(i==1) ctx2d.font="8pt " + MAIN_FONTNAME + "," + JAPANESE_FONTNAME;
                ctx2d.beginPath();
                ctx2d.moveTo(WIDTH/2+0-i*5.4,HEIGHT/2+38+i*18);
                ctx2d.lineTo(WIDTH/2+220-i*5.4,HEIGHT/2+38+i*18);
                ctx2d.stroke();
                ctx2d.fillText(BATTLE_INFO[i],WIDTH/2+110-ctx2d.measureText(BATTLE_INFO[i]).width/2-i*5.4,HEIGHT/2+35+i*18);
                let drawINFO="";
                if(i==0) drawINFO= avatorData[0].name;
                if(i==1) drawINFO= playData.level;
                if(i==2) drawINFO= avatorData[playData.settings[0]].cp;
                if(i==3) drawINFO= processShowData(Number((battleData.stroke-battleData.miss)/battleData.stroke*100).toFixed(1))+"%";
                ctx2d.fillText(drawINFO,WIDTH/2+50-ctx2d.measureText(drawINFO).width/2-i*5.4,HEIGHT/2+35+i*18);
                if(localAvator[selectBattleAvatorClass][selectBattleAvator] != null){//敵側のデータ
                    drawINFO="";
                    if(i==0) drawINFO= localAvator[selectBattleAvatorClass][selectBattleAvator].name;
                    if(i==1) drawINFO= localAvator[selectBattleAvatorClass][selectBattleAvator].level;
                    if(i==2) drawINFO= localAvator[selectBattleAvatorClass][selectBattleAvator].typingData.kpm;
                    if(i==3) drawINFO= processShowData(Number((localAvator[selectBattleAvatorClass][selectBattleAvator].typingData.stroke-localAvator[selectBattleAvatorClass][selectBattleAvator].typingData.miss)/localAvator[selectBattleAvatorClass][selectBattleAvator].typingData.stroke*100).toFixed(1))+"%";
                    if((i==1 && drawINFO<playData.level) || (i==2 && drawINFO<avatorData[playData.settings[0]].cp) || (i==3 && battleData.stroke && drawINFO  < Number((battleData.stroke-battleData.miss)/battleData.stroke*100).toFixed(1))){
                        //アバターに勝っている
                        let infoGrad = ctx2d.createLinearGradient(WIDTH/2+29-i*5.4,HEIGHT/2+33+i*18+3,WIDTH/2+29-i*5.4+40,HEIGHT/2+33+i*18-3);
                        infoGrad.addColorStop(0,"rgba(130,0,0," + 0.9*myAni + ")");
                        infoGrad.addColorStop(0.4,"rgba(250,0,0," + 0.3*myAni + ")");
                        infoGrad.addColorStop(1,"rgba(50,0,0," + 0.9*myAni + ")");
                        ctx2d.fillStyle=infoGrad;
                        ctx2d.fillRect(WIDTH/2+29-i*5.4,HEIGHT/2+33+i*18,40,3);
                    } else if((i==1 && drawINFO>playData.level) || (i==2 && drawINFO>avatorData[playData.settings[0]].cp) || (i==3 && (!battleData.stroke || drawINFO > Number((battleData.stroke-battleData.miss)/battleData.stroke*100).toFixed(1)))){
                        let infoGrad = ctx2d.createLinearGradient(WIDTH/2+154-i*5.4,HEIGHT/2+33+i*18+3,WIDTH/2+154-i*5.4+40,HEIGHT/2+33+i*18-3)
                        infoGrad.addColorStop(0,"rgba(130,0,0," + 0.9*myAni + ")");
                        infoGrad.addColorStop(0.4,"rgba(250,0,0," + 0.3*myAni + ")");
                        infoGrad.addColorStop(1,"rgba(50,0,0," + 0.9*myAni + ")");
                        ctx2d.fillStyle=infoGrad;
                        ctx2d.fillRect(WIDTH/2+154-i*5.4,HEIGHT/2+33+i*18,40,3);
                    }
                    ctx2d.fillStyle=getRGBA(0,0,myAni);
                    ctx2d.fillText(drawINFO,WIDTH/2+175-ctx2d.measureText(drawINFO).width/2-i*5.4,HEIGHT/2+35+i*18);                        
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
function setAvatorSelectButton(myLocalAvator){
    for(let i = 0;i < prls.length;i++){
        if(prls[i].id>=10 && prls[i].id <= 15){
            if (myLocalAvator[selectBattleAvatorClass].length<=prls[i].id-10){
                prls[i].colSet=13;
                prls[i].hoverColSet=13;
            } else if(prls[i].id-10==selectBattleAvator){
                prls[i].colSet=3;
                prls[i].hoverColSet=4;
            }  else{
                prls[i].colSet=0;
                prls[i].hoverColSet=1;
            }
        }
    }
}
function drawMenu(){
    pfnw=performance.now();
    drawLoadingCircle(HEIGHT/2+40,HEIGHT/2,HEIGHT/2-25,t/3.2,1000);//////////動く丸
    drawLoadingCircle(WIDTH-25-HEIGHT/3,HEIGHT/3-10,HEIGHT/3-20,-t/3,1000);//////////動く丸
    drawLoadingCircle(WIDTH-100,HEIGHT-60,50,t/2.6,1000);
    for(let i = 0;i < prls.length;i++){
        if(prls[i].isMsgBox!=1) drawPrl(prls[i]);
    }
    if(dailyMission.event){//イベント開催時
        drawPrl({x1:658,y1:324,x2:834,y2:350,rev:1,lineWidth:0.1,shadow:0,colSet:3+dailyMission.event*2,hoverColSet:3+dailyMission.event*2,hoverCounter:0,textSize:1,text:TEAM_TEXT[dailyMission.event-1] + "イベント開催中！"});
    }
    for(let i = 0;i < 3;i++){
        if(dailyMission.detail[i].progress == dailyMission.detail[i].max){
            drawPrl({x1:567+i*9.6,y1:384+i*32,x2:826+i*9.6,y2:412+i*32,rev:1,lineWidth:1,shadow:0,colSet:14,hoverColSet:14,hoverCounter:0,textSize:0.6,text:""});
            drawPrl({x1:760+i*9.6,y1:380+i*32,x2:826+i*9.6,y2:396+i*32,rev:1,lineWidth:1,shadow:0,colSet:3,hoverColSet:3,hoverCounter:0,textSize:0.9,text:"CLEAR"});
        } else if(dailyMission.detail[i].team){
            drawPrl({x1:567+i*9.6,y1:384+i*32,x2:826+i*9.6,y2:412+i*32,rev:1,lineWidth:1,shadow:0,colSet:0,hoverColSet:0,hoverCounter:0,textSize:0.6,text:""});
            drawPrl({x1:558+i*9.6,y1:384+i*32,x2:574+i*9.6,y2:412+i*32,rev:1,lineWidth:0.1,shadow:0,colSet:3+dailyMission.detail[i].team*2,hoverColSet:3+dailyMission.detail[i].team*2,hoverCounter:0,textSize:0.6,text:""});
        } else{
            drawPrl({x1:567+i*9.6,y1:384+i*32,x2:826+i*9.6,y2:412+i*32,rev:1,lineWidth:1,shadow:0,colSet:0,hoverColSet:0,hoverCounter:0,textSize:0.6,text:""});
            drawPrl({x1:558+i*9.6,y1:384+i*32,x2:574+i*9.6,y2:412+i*32,rev:1,lineWidth:0.1,shadow:0,colSet:13,hoverColSet:13,hoverCounter:0,textSize:0.6,text:""});
        }
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
    var menuBarMiniGrad = ctx2d.createLinearGradient(WIDTH-120,0,WIDTH,0);
    menuBarMiniGrad.addColorStop(1,'rgba(0,0,40,1)');
    menuBarMiniGrad.addColorStop(0.7,'rgba(0,0,20,0.9)');
    menuBarMiniGrad.addColorStop(0,'rgba(30,30,40,1)');
    ctx2d.fillStyle=menuBarMiniGrad;
    ctx2d.fillRect(WIDTH-120,20,120,8);
    ctx2d.font="19pt " + MAIN_FONTNAME;//AVA-TYPEの文字
    ctx2d.fillStyle=getRGBA(2,0,1);
    ctx2d.fillText("AVA-TYPE",(WIDTH-ctx2d.measureText("AVA-TYPE").width)/2,40);
    ctx2d.font="14pt " + JAPANESE_FONTNAME;
    ctx2d.fillText(avatorData[0].name,65,36);
    ctx2d.font="11pt " + JAPANESE_FONTNAME;
    ctx2d.fillText("LV. " + playData.level,WIDTH-ctx2d.measureText("LV. " + playData.level).width-30,24);
    drawStar(avatorData[0],WIDTH-122,32,21);
    drawAvator(avatorData[0],5,5,55,55,t,1);//アバターの画像
    drawLoadingCircle(WIDTH/2+110,30,15,-t/2.7,1000); //メニューバーここまで
    ctx2d.fillStyle=getRGBA(0,0,1); //デイリーミッション系
    ctx2d.font="19pt " + MAIN_FONTNAME;
    ctx2d.fillText("DAILY",560,370);
    ctx2d.font="8pt " + JAPANESE_FONTNAME;
    ctx2d.fillText("更新まであと",651,370);
    ctx2d.font="14pt " + DIGIT_FONTNAME;
    let myDate = new Date();
    myDate.setHours(myDate.getHours() - 5);
    if(myDate.getSeconds()==0) myDate.setMinutes(myDate.getMinutes() - 1);
    let hours = myDate.getHours();
    let minutes =myDate.getMinutes();
    let seconds= myDate.getSeconds();
    if(dailyMission.date!= myDate.getDay()) setDailyMission(),saveData();    ;//デイリーミッションの更新処理　セーブもする
    ctx2d.fillText(("00"+(24-hours-1)).slice(-2) + ":"+("00"+(60-minutes-1)).slice(-2)+":"+("00"+Number(60-seconds)%60).slice(-2),721,370);
    //達成度合い等ここから
    for(let i = 0;i < 3;i++){
        ctx2d.font="8pt " + JAPANESE_FONTNAME;
        ctx2d.fillStyle=getRGBA(0,0,1);
        ctx2d.fillText(getMissionText(dailyMission.detail[i]),573+9.6*i,394 + i * 32);
        ctx2d.font="7pt " + JAPANESE_FONTNAME;
        ctx2d.fillText(dailyMission.detail[i].progress,600+9.6*i-ctx2d.measureText(dailyMission.detail[i].progress).width,408 + i * 32);
        ctx2d.fillText("/",601+9.6*i,408 + i * 32);
        ctx2d.fillText(dailyMission.detail[i].max,605+9.6*i,408 + i * 32);
        ctx2d.fillText(dailyMission.detail[i].achieve,750+9.6*i,408 + i * 32);
        ctx2d.fillText("マイル",773+9.6*i,408 + i * 32);
        for(let j = 0;j < 5;j++){
            drawPrl({x1:639+j*20+i*6.9,y1:400+i*32,x2:655+j*20+i*6.9,y2:408+i*32,rev:1,lineWidth:3,shadow:0,colSet:0,hoverColSet:0,hoverCounter:0,textSize:0.6,text:""});
            if(dailyMission.detail[i].progress && Math.min(1,Math.max(0,(dailyMission.detail[i].progress-dailyMission.detail[i].max*0.2*j)/(dailyMission.detail[i].max*0.2)))>0) 
                drawPrl({x1:639+j*20+i*6.9,y1:400+i*32,rev:1,x2:639+i*6.9+j*20+16*Math.min(1,Math.max(0,(dailyMission.detail[i].progress-dailyMission.detail[i].max*0.2*j)/(dailyMission.detail[i].max*0.2))),y2:408+i*32,lineWidth:3,shadow:0,colSet:5,hoverColSet:0,hoverCounter:0,textSize:0.6,text:""});    
        }
        ctx2d.drawImage(coinImg,736+9.6*i,396+i*32,15,15);
    }

    //デイリーミッションここまで
    drawAvator(avatorData[0],165,375,245,455,t+72,1);//アバター横のアバター画像
    ctx2d.font="14pt " + JAPANESE_FONTNAME;
    drawTeamCircle(ctx2d.measureText(avatorData[0].name).width+83,30,7,avatorData[0].team);
}
function setBattleResultDefault(){ //ワードもここで選ぶ
    //wordsはどちらが獲得したか(0未　1自分　2相手　3現在) //pointは自分が何ポイント獲得したか　//nowは現在何ワード目か(0からスタート)
    //wordSetは出題ワードを格納 totalTimeは通算打鍵時間
    battleResult = {words:[3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],point:0,now:-1,wordSet:[],totalTime:0,totalStroke:0,totalMiss:0,kpm:0,acc:0,cp:0,startTime:-1,win:0,kWin:0,pWin:0,bonus:[0,0,0,0,0],itemBonus:[0,0,0,0,0],baseExp:0,exp:0,coin:0,wordCP:[],wordEnemyCP:[],maxCP:-9999,minCP:9999,achieveDailyMission:[0,0,0],pointRank:0,accRank:0,};
    for(let i = 0;i < 25;i++){//出題ワードをセット
        let tempWordNum=Math.floor(Math.random()*word2.length);
        while(word2[tempWordNum].length>41){
            tempWordNum=Math.floor(Math.random()*word2.length);
        }
        battleResult.wordSet[i] = {num:tempWordNum,
        text:word2[tempWordNum].split(",")[0],enemyText:"",myText:""};
        if(playData.settings[0]==0){
            battleResult.wordSet[i].myText=getRome(word2[tempWordNum].split(",")[1]);
        } else{
            battleResult.wordSet[i].myText=getKana(word2[tempWordNum].split(",")[1]);
        }
        if(enemyAvatorData.style==0){
            battleResult.wordSet[i].enemyText=getRome(word2[tempWordNum].split(",")[1]);
        } else{
            battleResult.wordSet[i].enemyText=getKana(word2[tempWordNum].split(",")[1]);
        }     
    }
    battleResult.wordSet[25]={};
    battleResult.wordSet[25].enemyText="";
    battleResult.wordSet[25].text="";
    battleResult.wordSet[25].myText="";
    lossTimeSum=0;
    totalLossTime=0;
    winLoseAni=0;
}
function drawBattleCircle(myBattleResult,x,y,size,time,resultMode){
    if(time==undefined) time = t;
    if(resultMode==undefined) resultMode=1;
    if(resultMode){
        drawPrl({x1:x,y1:y,x2:x+size*0.8*30,y2:y+size,colSet:0,trans:1,hoverColSet:1,hoverCounter:0,textSize:0.6,text:""});
    } else{
        drawPrl({x1:x,y1:y,x2:x+size*0.8*30,y2:y+size,colSet:15,trans:1,hoverColSet:1,hoverCounter:0,textSize:0.6,text:""});
    }
    ctx2d.lineWidth=2.5;
    for(let i = 0;i < 25;i++){
        let trans = Math.min(1,Math.max((time-i*40) / 100));
        ctx2d.strokeStyle="rgba(0,0,0," + trans + ")";
        ctx2d.beginPath();
        ctx2d.arc(-2+x+0.89*size*(i+1.6),y + size*0.5,size*0.35,0,Math.PI*2);
        if(myBattleResult.words[i] == 0){//未奪取
            ctx2d.stroke();
        } else if(myBattleResult.words[i] == 1){//自分が奪取
            let battleCircleGrad=ctx2d.createLinearGradient(-2+x+0.89*size*(i+1.6)-size*0.35,y+size*0.85,-2+x+0.89*size*(i+1.6)+size*0.35,y+size*0.15)
            battleCircleGrad.addColorStop(0,"rgba(60,40,0," + trans+")");
            battleCircleGrad.addColorStop(1,"rgba(220,190,0," + trans+")");
            ctx2d.fillStyle=battleCircleGrad;
            ctx2d.fill();
            ctx2d.stroke();
        } else if(myBattleResult.words[i] == 2){ //相手が奪取
            let battleCircleGrad=ctx2d.createLinearGradient(-2+x+0.89*size*(i+1.6)-size*0.35,y+size*0.85,-2+x+0.89*size*(i+1.6)+size*0.35,y+size*0.15)
            battleCircleGrad.addColorStop(0,"rgba(0,0,0," + trans+")");
            battleCircleGrad.addColorStop(1,"rgba(100,100,110," + trans+")");
            ctx2d.fillStyle=battleCircleGrad;
            ctx2d.fill();
            ctx2d.stroke();
        } else if(myBattleResult.words[i] == 3){//奪取中
            ctx2d.strokeStyle="rgba(150,0,0," + trans+ ")";
            ctx2d.fillStyle="rgba(220,160,160," + trans*0.5 + ")";
            ctx2d.fill();
            ctx2d.stroke();
            ctx2d.strokeStyle="rgba(0,0,0," + trans + ")";
        }
    }
}
function drawBattle(){ ///バトル画面の描画関数
    for(let i = 0;i < prls.length;i++){
        if(prls[i].isMsgBox!=1) drawPrl(prls[i]);
    }
    //枠の描画などはここに
    ctx2d.strokeStyle="rgba(100,0,0,1)";
    ctx2d.lineWidth=4;
    ctx2d.beginPath();
    ctx2d.moveTo(0,184);
    ctx2d.lineTo(500,184);
    ctx2d.moveTo(500,216);
    ctx2d.lineTo(WIDTH,216);
    ctx2d.stroke();
    drawLoadingCircle(200,150,140+5*Math.sin(t/600),-t*2,1000,1);
    drawLoadingCircle(WIDTH-100,HEIGHT-30,280+8*Math.sin(t/600),t*2,1000,1);
    drawBattleCircle(battleResult,130,HEIGHT/3+5,30,t);
    drawPrl({x1:-140+WIDTH*1.5/3,y1:30,x2:WIDTH*1.5/3+30,y2:HEIGHT/3-30,colSet:14,trans:1,hoverColSet:1,hoverCounter:0,textSize:0.6,text:""});//アバターの外枠
    drawPrl({x1:WIDTH*1.5/3+100,y1:HEIGHT*2/3+30,x2:WIDTH*1.5/3+270,y2:HEIGHT-30,colSet:14,trans:1,hoverColSet:1,hoverCounter:0,textSize:0.6,text:""}); //アバターの外枠
    drawAvator(enemyAvatorData,-130+WIDTH*1.5/3,33,WIDTH*1.5/3+10,HEIGHT/3-27,t,1);
    drawAvator(avatorData[0],WIDTH*1.5/3+116,HEIGHT*2/3+33,WIDTH*1.5/3+246,HEIGHT-27,t,1);
    drawPrl({x1:30,y1:HEIGHT*1.2/3+40,x2:135,y2:HEIGHT-30,colSet:0,trans:1,hoverColSet:1,hoverCounter:0,textSize:0.6,lineWidth:0.1,text:""});
    drawPrl({x1:30,y1:HEIGHT*1.2/3+40,x2:135,y2:HEIGHT-30,colSet:0,trans:1,hoverColSet:1,hoverCounter:0,textSize:0.6,lineWidth:0.1,text:""});
    if(winLoseAni){
        if(winLoseAni<0){//負け確定
            drawPrl({x1:30,y1:HEIGHT*1.2/3+40,x2:135,y2:HEIGHT-30,colSet:13,trans:(0.5+0.5*Math.sin((t+winLoseAni)/50)),hoverColSet:13,hoverCounter:0,textSize:0.6,lineWidth:0.1,text:""});
        } else{ //勝ち確定
            drawPrl({x1:30,y1:HEIGHT*1.2/3+40,x2:135,y2:HEIGHT-30,colSet:3,trans:(0.5+0.5*Math.sin((t-winLoseAni)/50)),hoverColSet:3,hoverCounter:0,textSize:0.6,lineWidth:0.1,text:""});
        }
        if(t-Math.abs(winLoseAni) > 950) winLoseAni=0;
    } else if(battleResult.point >= 13){ //勝ち確定
        drawPrl({x1:30,y1:HEIGHT*1.2/3+40,x2:135,y2:HEIGHT-30,colSet:3,trans:1,hoverColSet:3,hoverCounter:0,textSize:0.6,lineWidth:0.1,text:""});
    } else if(battleResult.now-battleResult.point >= 13){ //負け確定
        drawPrl({x1:30,y1:HEIGHT*1.2/3+40,x2:135,y2:HEIGHT-30,colSet:13,trans:1,hoverColSet:13,hoverCounter:0,textSize:0.6,lineWidth:0.1,text:""});
    }
    for(let i = 0;i < 7;i++){ //ワードの取得状況
        if(i==3){
            drawPrl({x1:100-i*10.8,y1:HEIGHT*1.2/3+43+i*36,x2:130-i*10.8,y2:HEIGHT*1.2/3+43+i*36+32,shadow:0,colSet:12,trans:1,hoverColSet:12,hoverCounter:0,textSize:0.6,lineWidth:2,text:""});
        }else{
            drawPrl({x1:100-i*10.8,y1:HEIGHT*1.2/3+43+i*36,x2:130-i*10.8,y2:HEIGHT*1.2/3+43+i*36+32,shadow:0,colSet:0,trans:1,hoverColSet:1,hoverCounter:0,textSize:0.6,lineWidth:2,text:""});
        }
        if(battleResult.now-battleResult.point >= 10+i){//敵の処理
            drawPrl({x1:100-i*10.8,y1:HEIGHT*1.2/3+43+i*36,x2:130-i*10.8,y2:HEIGHT*1.2/3+43+i*36+32,shadow:0,colSet:13,trans:1,hoverColSet:1,hoverCounter:0,textSize:0.6,lineWidth:2,text:""});
        }
        if(-battleResult.point+16<=i){//自分の処理
            drawPrl({x1:100-i*10.8,y1:HEIGHT*1.2/3+43+i*36,x2:130-i*10.8,y2:HEIGHT*1.2/3+43+i*36+32,shadow:0,colSet:3,trans:1,hoverColSet:1,hoverCounter:0,textSize:0.6,lineWidth:2,text:""});
        }
    }
    drawPrl({x1:70,y1:HEIGHT*1.2/3+40,x2:WIDTH*2/3,y2:HEIGHT-30,colSet:0,trans:1,hoverColSet:1,hoverCounter:0,textSize:0.6,text:""});
    drawPrl({x1:10+WIDTH*1.5/3,y1:30,x2:WIDTH-50,y2:HEIGHT/3-30,colSet:0,trans:1,hoverColSet:1,hoverCounter:0,textSize:0.6,text:""});
    drawPrl({x1:WIDTH*2/3-70,y1:HEIGHT*1.2/3+16,x2:WIDTH*2/3+7,y2:HEIGHT*1.2/3+36,colSet:3,shadow:0,trans:1.5,hoverColSet:3,hoverCounter:0,lineWidth:4,textSize:1,text:"YOU"});
    drawPrl({x1:WIDTH*1.5/3+3,y1:HEIGHT/3-27,x2:WIDTH*1.5/3+80,y2:HEIGHT/3-10,colSet:13,trans:1.5,hoverColSet:3,shadow:0,hoverCounter:0,lineWidth:4,textSize:1,text:"ENEMY"});
    drawStar(avatorData[0],WIDTH*2/3-160,HEIGHT*1.2/3+50,25);
    drawStar(enemyAvatorData,WIDTH-180,40,20);
    drawTeamCircle(130,HEIGHT*1.3/3+5,10,avatorData[0].team,1);
    drawTeamCircle(WIDTH-320,HEIGHT*1.3/3-68,10,enemyAvatorData.team,1);
    drawPrl({x1:100,y1:410,x2:100+30,y2:410+15,colSet:3,shadow:0,trans:1.5,hoverColSet:3,hoverCounter:0,lineWidth:4,textSize:1,text:"YOU"});
    drawPrl({x1:100-11.1,y1:447,x2:100-11.1+30,y2:447+15,colSet:13,trans:1.5,hoverColSet:3,shadow:0,hoverCounter:0,lineWidth:4,textSize:1,text:"ENEMY"});
    ctx2d.fillStyle=getRGBA(2,0,1);
    ctx2d.font="18pt " + MAIN_FONTNAME + ","+ JAPANESE_FONTNAME;
    ctx2d.fillText(avatorData[0].name,145,HEIGHT*1.3/3+15);
    ctx2d.font="14pt " + MAIN_FONTNAME + ","+ JAPANESE_FONTNAME;
    ctx2d.fillText(enemyAvatorData.name,WIDTH-300,HEIGHT*1.3/3-60);
    ctx2d.fillStyle=getRGBA(0,0,1);
    ctx2d.fillText("WORD  " + ("00"+Math.max(0,battleResult.point)).slice(-2),150,HEIGHT*1.5/3+15);
    ctx2d.fillText("WORD  " + ("00"+Math.max(0,(battleResult.now-battleResult.point))).slice(-2), WIDTH*2/3-110,55);
    ctx2d.font="12pt " + MAIN_FONTNAME + ","+ JAPANESE_FONTNAME;
    ctx2d.fillStyle=getRGBA(2,0,1);
    ctx2d.fillText("CP " + avatorData[playData.settings[0]].cp,ctx2d.measureText(avatorData[0].name).width+220,HEIGHT*1.3/3+15);
    ctx2d.fillText("CP " + enemyAvatorData.typingData.kpm,WIDTH-140,HEIGHT*1.3/3-60);
    ctx2d.fillStyle=getRGBA(0,0,1);
    ctx2d.fillText("/ 25",270,HEIGHT*1.5/3+20);
    ctx2d.fillText("/ 25", WIDTH*2/3+15,60);
    ctx2d.font="10pt " + MAIN_FONTNAME + ","+ JAPANESE_FONTNAME;
    ctx2d.fillText("KPM: " +processShowData(Number((battleResult.totalStroke-battleResult.totalMiss)/(t-battleResult.startTime-totalLossTime)*60000).toFixed(1)),146,HEIGHT*1.5/3+35);
    ctx2d.fillText("ACC: " +processShowData(Number((battleResult.totalStroke-battleResult.totalMiss)/battleResult.totalStroke*100).toFixed(1))+"%",141.5,HEIGHT*1.5/3+50);
    if(battleStatus==0 && t-battleAni < BATTLE_ANI){ //開始時のアニメーション
        let battleOpeningOffset=Math.floor(30-(9*1030/(1000*((t-battleAni-250)/1000)+9/1000))-1);
        if(isNaN(battleOpeningOffset)) battleOpeningOffset=WIDTH;
        ctx2d.fillStyle="rgba(0,0,0,"+Math.min(1,Math.max(0,((BATTLE_ANI-(t-battleAni))/200)))+")";
        ctx2d.fillRect(0,0,WIDTH,HEIGHT);
        drawLoadingCircle(WIDTH/2,HEIGHT/2,HEIGHT/2-20,t*5,1000,Math.min(1,Math.max(0,((BATTLE_ANI-(t-battleAni))/200))));
        drawPrl({x1:50,y1:HEIGHT-50,x2:WIDTH*1.5/3-40,y2:HEIGHT-10,colSet:13,trans:Math.min(1,Math.max(0,((BATTLE_ANI-(t-battleAni))/200))),hoverColSet:13,hoverCounter:0,textSize:0.6,text:""});
        drawPrl({x1:60+WIDTH*1.5/3,y1:HEIGHT/2+80,x2:WIDTH-50,y2:HEIGHT/2+130,colSet:13,trans:Math.min(1,Math.max(0,((BATTLE_ANI-(t-battleAni))/200))),hoverColSet:13,hoverCounter:0,textSize:0.6,text:""});
        drawAvator(avatorData[0],Math.min(WIDTH-200,battleOpeningOffset/15)+50,HEIGHT*1/3-20,Math.min(WIDTH-200,battleOpeningOffset/15)+WIDTH*1.5/3-40,-20+HEIGHT*1/3+WIDTH*1.5/3-90,t,Math.min(1,Math.max(0,((BATTLE_ANI-(t-battleAni))/200))));
        drawAvator(enemyAvatorData,-Math.min(WIDTH-200,battleOpeningOffset/15)+WIDTH*1.5/3+40,20,-Math.min(WIDTH-200,battleOpeningOffset/15)+WIDTH-40,20+WIDTH*1.5/3-90,t,Math.min(1,Math.max(0,((BATTLE_ANI-(t-battleAni))/200))));
        ctx2d.fillStyle="rgba(255,255,255,"+(0.4+0.3*Math.sin(t/100))*Math.min(1,Math.max(0,((BATTLE_ANI-(t-battleAni))/200)))+")";
        ctx2d.font="36pt " + MAIN_FONTNAME;
        ctx2d.fillText("BATTLE!",20,80);
        ctx2d.fillStyle="rgba(255,255,255,"+Math.min(1,Math.max(0,((BATTLE_ANI-(t-battleAni))/200)))+")";
        ctx2d.font="10pt " + MAIN_FONTNAME;
        ctx2d.fillText("CP",40,HEIGHT-80);
        ctx2d.fillText("CP",WIDTH-140,HEIGHT-220);
        ctx2d.font="28pt " + MAIN_FONTNAME + "," + JAPANESE_FONTNAME;
        ctx2d.fillText(avatorData[0].name,battleOpeningOffset+70,170);
        ctx2d.fillText(enemyAvatorData.name,-battleOpeningOffset+WIDTH-300,HEIGHT-80);
        ctx2d.fillText(Math.floor(avatorData[playData.settings[0]].cp),70,HEIGHT-40);
        ctx2d.fillText(Math.floor(enemyAvatorData.typingData.kpm),WIDTH-130,HEIGHT-180);
        ctx2d.fillStyle="rgba(200,0,0,"+Math.min(1,Math.max(0,((BATTLE_ANI-(t-battleAni))/200)))+")";
        ctx2d.fillText("VS",(WIDTH-ctx2d.measureText("VS").width)/2,HEIGHT/2);
        drawTeamCircle(37+battleOpeningOffset,157,16,avatorData[0].team,Math.min(1,Math.max(0,((BATTLE_ANI-(t-battleAni))/200))));
        drawTeamCircle(-battleOpeningOffset+WIDTH-333,HEIGHT-93,16,enemyAvatorData.team,Math.min(1,Math.max(0,((BATTLE_ANI-(t-battleAni))/200))));
        drawPrl({x1:WIDTH/2-120,y1:HEIGHT-75,x2:WIDTH/2-110+180,y2:HEIGHT-85+43,colSet:2,trans:Math.min(1,Math.max(0,((BATTLE_ANI-(t-battleAni))/200))),hoverColSet:2,hoverCounter:0,textSize:0.6,text:""});
        drawPrl({x1:WIDTH/2-120+120,y1:HEIGHT-85-70,x2:WIDTH/2-110+300,y2:HEIGHT-85-37,colSet:2,trans:Math.min(1,Math.max(0,((BATTLE_ANI-(t-battleAni))/200))),hoverColSet:2,hoverCounter:0,textSize:0.6,text:""});
        if(t-battleAni < BATTLE_ANI-200){
            drawStar(avatorData[0],WIDTH/2-110,HEIGHT-73,30);
            drawStar(enemyAvatorData,WIDTH/2+10,HEIGHT-153,30);
        }
    } else{
        if(battleStatus==0) battleStatus=1,battleAni=t;//カウントダウンを開始
    }
    if(battleStatus ==1 || battleStatus==3||battleStatus==4||battleStatus==5){
        ctx2d.fillText("- - - - -",350-ctx2d.measureText("- - - - -").width/2,350);
        ctx2d.fillText("- - - - -",350-ctx2d.measureText("- - - - -").width/2,383);
        if(battleStatus==3 && battleResult.now!=0){//待機中なら直前のkpmを表示
            ctx2d.fillStyle=getRGBA(12,0,1-(t-lossTimeT)/200+0.2);
            ctx2d.font="14pt " + MAIN_FONTNAME;
            if(getWord==1){//直前のワードを自分が取っていたら
                //48間隔
                ctx2d.fillText(lastKpm,330-ctx2d.measureText(lastKpm).width/2,423);
                ctx2d.fillStyle=getRGBA(0,0,1-(t-lossTimeT)/200+0.2);
                ctx2d.fillText(lastKpmE,330-ctx2d.measureText(lastKpmE).width/2,463);    

                ctx2d.fillStyle=getRGBA(12,0,0.5-(t-lossTimeT)/400);
                ctx2d.beginPath();
                ctx2d.strokeStyle=getRGBA(0,0,0.5-(t-lossTimeT)/400);
                ctx2d.lineWidth=3;
                ctx2d.arc((WIDTH+30*1.78*(battleResult.now-12.5))/2+24,HEIGHT/2-70,20/((t-lossTimeT)/200+2)+10,0,Math.PI*2);
                ctx2d.fill();
                ctx2d.stroke();
            } else{
                ctx2d.fillText(lastKpmE,330-ctx2d.measureText(lastKpmE).width/2,463);    
                ctx2d.fillStyle=getRGBA(0,0,1-(t-lossTimeT)/200+0.2);
                ctx2d.fillText(lastKpm,330-ctx2d.measureText(lastKpm).width/2,423);
            }
        }
        ctx2d.fillStyle=getRGBA(0,0,1);
        ctx2d.font="11pt " + TYPING_FONTNAME;
        ctx2d.fillText("- - -",700-ctx2d.measureText("- - -").width/2,95);
        ctx2d.font="9pt " + TYPING_FONTNAME;
        ctx2d.fillText("- - -",700-ctx2d.measureText("- - -").width/2,115);
    } else if(battleStatus == 2 || battleStatus == 4){//戦闘中なら
        ctx2d.font="18pt " + TYPING_FONTNAME;
        let drawText1 = battleResult.wordSet[battleResult.now].text.substr(0,15);
        let drawText2 = battleResult.wordSet[battleResult.now].text.substr(15,15);
        if(drawText2.length <= 2) {
            drawText1 = battleResult.wordSet[battleResult.now].text.substr(0,13);
            drawText2 = battleResult.wordSet[battleResult.now].text.substr(13,13);
        }
        ctx2d.fillText(drawText1,350-ctx2d.measureText(drawText1).width/2,350);
        ctx2d.fillText(drawText2,350-ctx2d.measureText(drawText2).width/2,383);
        ctx2d.font="13pt " + TYPING_FONTNAME;
        if(playData.settings[0] && ctx2d.measureText(battleResult.wordSet[battleResult.now].myText).width>WIDTH*1.2/3){
            ctx2d.font="10pt " + TYPING_FONTNAME;
        }
        ctx2d.fillStyle="rgba(150,0,0," + Math.min(1,Math.max(0,(1-(t-missAni)/200))) + ")"; //ミスの赤い四角
        if(playData.settings[0] == 0){
            ctx2d.fillRect(ctx2d.measureText(typedText).width+330-ctx2d.measureText(battleResult.wordSet[battleResult.now].myText).width/2,403,ctx2d.measureText("A").width*0.6,22);
        } else{
            ctx2d.fillRect(ctx2d.measureText(typedText).width+330-ctx2d.measureText(battleResult.wordSet[battleResult.now].myText).width/2,403,ctx2d.measureText("あ").width*0.6,22);
        }
        ctx2d.fillStyle=getRGBA(0,0,1);
        ctx2d.fillText(battleResult.wordSet[battleResult.now].myText,330-ctx2d.measureText(battleResult.wordSet[battleResult.now].myText).width/2,420);
        ctx2d.font="13pt " + TYPING_FONTNAME;
        if(enemyAvatorData.style && ctx2d.measureText(battleResult.wordSet[battleResult.now].enemyText).width>WIDTH*1.2/3){
            ctx2d.font="10pt " + TYPING_FONTNAME;
        }
        ctx2d.fillStyle="rgba(150,0,0," + Math.min(1,Math.max(0,(1-(t-enemyMissAni)/200))) + ")"; //ミスの赤い四角
        if(enemyAvatorData.style == 0){
            ctx2d.fillRect(ctx2d.measureText(enemyTypedText).width+330-ctx2d.measureText(battleResult.wordSet[battleResult.now].enemyText).width/2,443,ctx2d.measureText("A").width*0.9,22);
        } else if(enemyAvatorData.style == 1){
            ctx2d.fillRect(ctx2d.measureText(enemyTypedText).width+330-ctx2d.measureText(battleResult.wordSet[battleResult.now].enemyText).width/2,443,ctx2d.measureText("あ").width*0.9,22);
        } 
        ctx2d.fillStyle=getRGBA(0,0,1);

        ctx2d.fillText(battleResult.wordSet[battleResult.now].enemyText,330-ctx2d.measureText(battleResult.wordSet[battleResult.now].enemyText).width/2,460);
        ctx2d.fillStyle=getRGBA(2,0,1);
        ctx2d.font="13pt " + TYPING_FONTNAME;
        if(playData.settings[0] && ctx2d.measureText(battleResult.wordSet[battleResult.now].myText).width>WIDTH*1.2/3){
            ctx2d.font="10pt " + TYPING_FONTNAME;
        }
        ctx2d.fillText(typedText,330-ctx2d.measureText(battleResult.wordSet[battleResult.now].myText).width/2,420);
        ctx2d.font="13pt " + TYPING_FONTNAME;
        if(enemyAvatorData.style && ctx2d.measureText(battleResult.wordSet[battleResult.now].enemyText).width>WIDTH*1.2/3){
            ctx2d.font="10pt " + TYPING_FONTNAME;
        }
        ctx2d.fillText(enemyTypedText,330-ctx2d.measureText(battleResult.wordSet[battleResult.now].enemyText).width/2,460);
        ctx2d.fillStyle=getRGBA(0,0,1);
        ctx2d.font="11pt " + TYPING_FONTNAME;
        ctx2d.fillText(battleResult.wordSet[battleResult.now].text,700-ctx2d.measureText(battleResult.wordSet[battleResult.now].text).width/2,95);
        ctx2d.font="9pt " + TYPING_FONTNAME;
        ctx2d.fillText(battleResult.wordSet[battleResult.now].enemyText,700-ctx2d.measureText(battleResult.wordSet[battleResult.now].enemyText).width/2,115);
        ctx2d.fillStyle="rgba(150,0,0," + Math.min(1,Math.max(0,(1-(t-enemyMissAni)/200))) + ")"; //ミスの赤い四角
        if(enemyAvatorData.style == 0){
            ctx2d.fillRect(ctx2d.measureText(enemyTypedText).width+700-ctx2d.measureText(battleResult.wordSet[battleResult.now].enemyText).width/2,103,ctx2d.measureText("A").width*0.8,12);
        } else if(enemyAvatorData.style == 1){
            ctx2d.fillRect(ctx2d.measureText(enemyTypedText).width+700-ctx2d.measureText(battleResult.wordSet[battleResult.now].enemyText).width/2,103,ctx2d.measureText("あ").width*0.8,12);
        } 
        ctx2d.fillStyle=getRGBA(2,0,1);
        ctx2d.fillText(enemyTypedText,700-ctx2d.measureText(battleResult.wordSet[battleResult.now].enemyText).width/2,115);
    }
    if(battleStatus==1){ //カウントダウン画面
        ctx2d.font= Math.floor((128+Math.min(124,512/((t-battleAni)%1000)))) +"pt " + MAIN_FONTNAME;
        let rawCountDownSec = 3-(t-battleAni)/1000;
        let countDownSec = 3-Math.floor((t-battleAni)/1000);
        if(playData.settings[2] == 1) countDownSec-=3,rawCountDownSec-=3;
        if(countDownSec == 0) countDownSec="GO";
        if(rawCountDownSec<-0.3) battleAni=t,battleStatus=3,battleResult.startTime=t,lossTimeT=t;//カウントダウン終了　待機モードへ
        ctx2d.fillStyle="rgba(0,0,0,0.6)";
        if(countDownSec=="GO") ctx2d.fillStyle="rgba(100,0,0,0.8)";
        ctx2d.fillRect(0,(HEIGHT- Math.floor((128+Math.min(124,512/((t-battleAni)%1000)))))/2-80,WIDTH, Math.floor((128+Math.min(124,512/((t-battleAni)%1000))))+100)
        ctx2d.fillStyle=getRGBA(2,0,1);
        ctx2d.fillText(countDownSec,(WIDTH-ctx2d.measureText(countDownSec).width)/2,HEIGHT/2+30);
    }
    if(battleStatus==4){//終了アニメーション
        let battleFinishAnimation = (256+Math.min(256,512/((t-battleAni))));
        if(battleResult.win==1){//勝利
            drawLoadingCircle(WIDTH/2,HEIGHT/2,battleFinishAnimation,t*1.5,1000,1);
            ctx2d.fillStyle="rgba(160,120,0,0.8)";
            ctx2d.fillRect(0,(HEIGHT- Math.floor((128+Math.min(124,512/((t-battleAni))))))/2-80,WIDTH, Math.floor((128+Math.min(124,512/((t-battleAni)))))+100)
            ctx2d.fillStyle=getRGBA(2,0,1);
            battleFinishAnimation = (128+Math.min(1024,1024/((t-battleAni)/5)));
            ctx2d.font= Math.floor(battleFinishAnimation/1.3) +"pt " + MAIN_FONTNAME;
            ctx2d.fillText("W",(WIDTH-200-ctx2d.measureText("W").width)/2,HEIGHT/2+30);
            if(t-battleFinishAnimation>=200){
                battleFinishAnimation = (128+Math.min(1024,1024/((t-battleAni-200)/5)));  
                ctx2d.font= Math.floor(battleFinishAnimation/1.3) +"pt " + MAIN_FONTNAME;
                ctx2d.fillText("I",(WIDTH-ctx2d.measureText("I").width)/2,HEIGHT/2+30);
            }
            if(t-battleFinishAnimation >= 400){
                battleFinishAnimation = (128+Math.min(1024,1024/((t-battleAni-400)/5))); 
                ctx2d.font= Math.floor(battleFinishAnimation/1.3) +"pt " + MAIN_FONTNAME;
                ctx2d.fillText("N",(WIDTH+200-ctx2d.measureText("N").width)/2,HEIGHT/2+30);
            }
        } else{//敗北
            ctx2d.fillStyle="rgba(0,0,20,"+ Math.min(1,(t-battleAni)/500) + ")";
            ctx2d.fillRect(0,(HEIGHT- Math.floor((128+Math.min(124,512/((t-battleAni))))))/2-80,WIDTH, Math.floor((128+Math.min(124,512/((t-battleAni)))))+100)
            ctx2d.font= 256/2.5 + "pt " + MAIN_FONTNAME;
            ctx2d.fillStyle="rgba(255,255,255,"+ Math.min(1,(t-battleAni-500)/500) + ")";
            ctx2d.fillText("LOSE",(WIDTH-ctx2d.measureText("LOSE").width)/2,HEIGHT/2+25);
        }
    }
}
function getItemBonus(myAvatorData,isArray,isCoin){
    //アイテムボーナスを計算する関数 %で返却
    //myAvatorDataは配列で渡す
    //isArrayが1の場合、配列でボーナスを返却
    //isCoinが1の場合、獲得コイン数を返却
    let tempBonus=0;
    let tempCoin=0;
    let tempBonusArray=[0,0,0,0,0];
    //ここからhead
    if(myAvatorData[0].item[0] == 1){
        if(myAvatorData[0].team == 0) tempBonus+=5;
    } else if(myAvatorData[0].item[0] == 2){
        if(myAvatorData[0].team == 1) tempBonus+=5;
    }else if(myAvatorData[0].item[0] == 3){
        if(myAvatorData[0].team == 2) tempBonus+=5;
    }else if(myAvatorData[0].item[0] == 4){
        tempBonus+=8;        
    }else if(myAvatorData[0].item[0] == 8){
        tempBonus+=12;
    }else if(myAvatorData[0].item[0] == 9){
        tempBonus+=16;
    }
    tempBonusArray[0]+=tempBonus;
    //ここからbody1
    if(myAvatorData[0].item[1] == 1){
        if(myAvatorData[0].team == 0) tempBonus+=6;
    } else if(myAvatorData[0].item[1] == 2){
        if(myAvatorData[0].team == 1) tempBonus+=6;
    }else if(myAvatorData[0].item[1] == 3){
        if(myAvatorData[0].team == 2) tempBonus+=6;
    }else if(myAvatorData[0].item[1] == 4){
        tempBonus+=10;
    }else if(myAvatorData[0].item[1] == 8){
        tempBonus+=15;
    }else if(myAvatorData[0].item[1] == 9){
        tempBonus+=20;
    }
    tempBonusArray[1]+=tempBonus-tempBonusArray[0];
    //ここからbody2
    if(myAvatorData[0].item[2] == 1){
        if(myAvatorData[0].team == 0) tempBonus+=6;
    } else if(myAvatorData[0].item[2] == 2){
        if(myAvatorData[0].team == 1) tempBonus+=6;
    }else if(myAvatorData[0].item[2] == 3){
        if(myAvatorData[0].team == 2) tempBonus+=6;
    }else if(myAvatorData[0].item[2] == 4){
        if(enemyAvatorData.kind==1 || enemyAvatorData.kind==2) tempBonus+=5;
    }else if(myAvatorData[0].item[2] == 5){
        if(enemyAvatorData.kind==1 || enemyAvatorData.kind==2) tempBonus+=15;
    }else if(myAvatorData[0].item[2] == 6){
        if(battleResult.acc >= 98) tempBonus+=10;
    }else if(myAvatorData[0].item[2] == 7){
        if(dailyMission.detail[0].progress == dailyMission.detail[0].max && dailyMission.detail[1].progress == dailyMission.detail[1].max && dailyMission.detail[2].progress == dailyMission.detail[2].max) tempBonus+=15;
    }else if(myAvatorData[0].item[2] == 8){
        if(battleResult.kWin) tempBonus+=15;
    }else if(myAvatorData[0].item[2] == 9){
        if(battleResult.pWin) tempBonus+=30;
    }
    tempBonusArray[2]+=tempBonus-(tempBonusArray[0]+tempBonusArray[1]);
    //ここからlimbs
    if(myAvatorData[0].item[3] == 1){
        if(dailyMission.date == 6) tempBonus+=12;
    } else if(myAvatorData[0].item[3] == 2){
        if(dailyMission.date == 0) tempBonus+=12;
    }else if(myAvatorData[0].item[3] == 3){
        if(dailyMission.date > 0 && dailyMission.date < 6) tempBonus+=10;
    }else if(myAvatorData[0].item[3] == 4){//闇の靴
        let myDate = new Date();
        if(myDate.getHours() < 5 || myDate.getHours() >= 19) tempBonus+=8;
    }else if(myAvatorData[0].item[3] == 8){
        tempBonus+=10;
    }else if(myAvatorData[0].item[3] == 9){
        tempBonus+=15;
    }
    tempBonusArray[3]+=tempBonus-(tempBonusArray[0]+tempBonusArray[1]+tempBonusArray[2]);
    //ここから金銀銅の処理
    if(myAvatorData[0].item[0] == 5 && myAvatorData[0].item[1] == 5 && myAvatorData[0].item[3] == 5){
        tempBonus+=12;
        tempBonusArray[0] = 12;
        tempBonusArray[1] = 12;
        tempBonusArray[2] = 12;
    } else if(myAvatorData[0].item[0] == 6 && myAvatorData[0].item[1] == 6 && myAvatorData[0].item[3] == 6){
        tempBonus+=16;
        tempBonusArray[0] = 16;
        tempBonusArray[1] = 16;
        tempBonusArray[2] = 16;
    } else if(myAvatorData[0].item[0] == 7 && myAvatorData[0].item[1] == 7 && myAvatorData[0].item[3] == 7){
        tempBonus+=24;
        tempBonusArray[0] = 24;
        tempBonusArray[1] = 24;
        tempBonusArray[2] = 24;
    }

    //ここからothers
    if(myAvatorData[0].item[4] == 1){
        tempCoin++;
    } else if(myAvatorData[0].item[4] == 3){
        if(battleResult.acc <= 90) tempBonus+=10;
    }else if(myAvatorData[0].item[4] == 4){
        if(battleResult.pWin) tempCoin+=3;
    }else if(myAvatorData[0].item[4] == 5){
        if(battleResult.cp >= 300 && battleResult.win) tempBonus+=4;
    }else if(myAvatorData[0].item[4] == 6){
        if(battleResult.cp >= 450 && battleResult.win) tempBonus+=8;
    }else if(myAvatorData[0].item[4] == 7){
        if(battleResult.cp >= 600 && battleResult.win) tempBonus+=12;
    }else if(myAvatorData[0].item[4] == 8){
        if(battleResult.cp >= 650 && battleResult.win && battleResult.acc >= 97) tempBonus+=20,tempCoin+=2;
    }else if(myAvatorData[0].item[4] == 9){
        if(battleResult.cp >= 700 && battleResult.win && battleResult.acc >= 97) tempBonus+=25,tempCoin+=4;
    }
    tempBonusArray[4]+=tempBonus-(tempBonusArray[0]+tempBonusArray[1]+tempBonusArray[2]-tempBonusArray[3]);
    if(isArray) return tempBonusArray;
    if(isCoin) return tempCoin;
    return tempBonus;
}
function processDailyMission(){
    //デイリーミッションの進捗を管理する関数
    for(let i = 0;i < 3;i++){
        if(dailyMission.detail[i].progress != dailyMission.detail[i].max){//未達成なら達成チェック
            if(dailyMission.detail[i].type == 0){
                dailyMission.detail[i].progress+=battleResult.totalStroke-battleResult.totalMiss;
            } else if(dailyMission.detail[i].type == 1){
                dailyMission.detail[i].progress+=battleResult.win;
            }else if(dailyMission.detail[i].type == 2){
                dailyMission.detail[i].progress+=battleResult.point;
            }else if(dailyMission.detail[i].type == 3){
                if(enemyAvatorData.team == dailyMission.detail[i].team -1) dailyMission.detail[i].progress+=battleResult.win;
            }else if(dailyMission.detail[i].type == 4){
                if(enemyAvatorData.team == dailyMission.detail[i].team -1) dailyMission.detail[i].progress++;
            }else if(dailyMission.detail[i].type == 5){
                if(battleResult.acc >= dailyMission.detail[i].require) dailyMission.detail[i].progress+=battleResult.win;
            }else if(dailyMission.detail[i].type == 6){
                if(battleResult.cp >= dailyMission.detail[i].require) dailyMission.detail[i].progress+=battleResult.win;
            }else if(dailyMission.detail[i].type == 7){
                if(enemyAvatorData.cp >= dailyMission.detail[i].require) dailyMission.detail[i].progress+=battleResult.win;
            }else if(dailyMission.detail[i].type == 8){
                if(battleResult.point >= dailyMission.detail[i].require) dailyMission.detail[i].progress+=battleResult.win;
            }else if(dailyMission.detail[i].type == 9){
                if(enemyAvatorData.cp >= dailyMission.detail[i].require && battleResult.kWin) dailyMission.detail[i].progress+=1;
            }else if(dailyMission.detail[i].type == 10){
                if(enemyAvatorData.cp >= dailyMission.detail[i].require && battleResult.pWin) dailyMission.detail[i].progress+=1;
            }else if(dailyMission.detail[i].type == 11){
                if(enemyAvatorData.team >= dailyMission.detail[i].team-1) dailyMission.detail[i].progress+=battleResult.point;
            }else if(dailyMission.detail[i].type == 12){
                if(enemyAvatorData.team >= dailyMission.detail[i].team-1) dailyMission.detail[i].progress+=battleResult.totalStroke-battleResult.totalMiss;
            }else if(dailyMission.detail[i].type == 13){
                if(enemyAvatorData.kind ==0) dailyMission.detail[i].progress+=battleResult.win;
            }
            if(dailyMission.detail[i].progress >= dailyMission.detail[i].max){
                //ミッション達成時
                dailyMission.detail[i].progress = dailyMission.detail[i].max;
                battleResult.achieveDailyMission[i]=1;
                battleResult.coin+=dailyMission.detail[i].achieve;
            }
        }
    }
}
function processBattleResult(){//バトル結果の処理関数　終了直後（アニメーション直前）に呼び出される　経験値の書き換えなどをここに書く
    let inputStyle=playData.settings[0];//入力方式
    let enemyRank = 1;//敵のランクをセット　0格上　1同格　2格下
    if(enemyAvatorData.cp - avatorData[inputStyle].cp > 50){
        enemyRank=0;
    }  else if(enemyAvatorData.cp - avatorData[inputStyle].cp < -50){
        enemyRank=2;
    }
    //battleResultに関する更新
    if(battleResult.point >= 13){
        battleResult.win=1;
    } else{
        battleResult.win = 0;
    }
    if(battleResult.point == 25) {
        battleResult.kWin=1;//完全勝利
    }else{
        battleResult.kWin = 0;
    }
    if(battleResult.point == 25 && battleResult.acc == 100) {
        battleResult.pWin=1;//パーフェクト勝利
    }else{
        battleResult.pWin = 0;
    }
    battleResult.kpm = Number((battleResult.totalStroke-battleResult.totalMiss)/(t-battleResult.startTime-totalLossTime)*60000).toFixed(1);
    battleResult.acc = Number((battleResult.totalStroke-battleResult.totalMiss)/battleResult.totalStroke*100).toFixed(1);
    if(isNaN(battleResult.acc)) battleResult.acc=0;
    if(isNaN(battleResult.kpm)) battleResult.kpm=0;
    battleResult.cp = battleResult.kpm;
    if(inputStyle) battleResult.cp*=COEF_R2K;
    battleResult.cp=Number(battleResult.cp).toFixed(1);
    //ランクを算出
    if(battleResult.acc == 100){
        battleResult.accRank=0;
    } else if(battleResult.acc >= 98){
        battleResult.accRank=1;
    } else if(battleResult.acc >= 95){
        battleResult.accRank=2;
    }else if(battleResult.acc >= 93){
        battleResult.accRank=3;
    }else if(battleResult.acc >= 0){
        battleResult.accRank=4;
    } else{
        battleResult.accRank=5;
    }
    if(battleResult.point == 25){
        battleResult.pointRank=0;
    } else if(battleResult.point >= 22){
        battleResult.pointRank=1;
    } else if(battleResult.point >= 18){
        battleResult.pointRank=2;
    }else if(battleResult.point >= 13){
        battleResult.pointRank=3;
    }else if(battleResult.point >= 8){
        battleResult.pointRank=4;
    } else{
        battleResult.pointRank=5;
    }
    //ボーナス等をセット
    battleResult.bonus[0] = Math.round(Math.max(0,2*battleResult.point-25)/1.5);//ワード補正
    battleResult.bonus[1] = Math.round(Math.pow(Math.max(0,(Number(battleResult.acc)-95)),1.5)*2);//正確性補正
    battleResult.bonus[2] = 0;
    if((3+avatorData[0].team-enemyAvatorData.team)%3 == 2) battleResult.bonus[2] = TEAM_BONUS;
    if((3+avatorData[0].team-enemyAvatorData.team)%3 == 2) battleResult.bonus[2] = -TEAM_BONUS;
    battleResult.bonus[3] = getItemBonus(avatorData);
    battleResult.itemBonus=getItemBonus(avatorData,1);
    battleResult.coin+=getItemBonus(avatorData,0,1);
    battleResult.bonus[4] = 0;//イベントボーナス　
    if(dailyMission.event == avatorData[0].team+1) battleResult.bonus[4] = 25;//イベント中なら25%ボーナス
    if(enemyAvatorData.kind == 0) battleResult.bonus[4] += 20;//ユーザーアバターの場合20%ボーナス
    battleResult.baseExp = Math.max(5,Math.ceil(playData.level * 6/5* (1+Math.atan((avatorData[inputStyle].cp - enemyAvatorData.cp))*2/Math.PI)));
    if(battleResult.win == 0) battleResult.baseExp= Math.floor(battleResult.baseExp/3);
    battleResult.exp = Math.round(battleResult.baseExp * (100+battleResult.bonus[0]+battleResult.bonus[1]+battleResult.bonus[2]+battleResult.bonus[3]+battleResult.bonus[4])/100);
    //dailyMissionに関する更新
    dailyMission.battle++;
    dailyMission.win+=battleResult.win;
    dailyMission.totalStroke+=battleResult.totalStroke;
    dailyMission.word+=battleResult.point;
    processDailyMission();
    //avatorDataに関する更新
    if(battleResult.totalStroke){
        avatorData[inputStyle].typingData.kpm = Number((avatorData[inputStyle].typingData.kpm * avatorData[inputStyle].typingData.stroke  + battleResult.kpm * battleResult.totalStroke)/(avatorData[inputStyle].typingData.stroke+battleResult.totalStroke)).toFixed(1);
        avatorData[inputStyle].typingData.acc = Number((avatorData[inputStyle].typingData.acc * avatorData[inputStyle].typingData.acc  + battleResult.acc * battleResult.totalStroke)/(avatorData[inputStyle].typingData.stroke+battleResult.totalStroke)).toFixed(1);    
    }
    avatorData[inputStyle].typingData.stroke += battleResult.totalStroke;
    avatorData[inputStyle].typingData.miss+=battleResult.totalMiss;
    avatorData[inputStyle].cp = avatorData[inputStyle].typingData.kpm;
    if(inputStyle) avatorData[inputStyle].cp = Number(avatorData[inputStyle].cp*COEF_R2K).toFixed(1);
    //battleDataに関する更新
    battleData.battle++;
    battleData.win += battleResult.win;
    battleData.stroke+=battleResult.totalStroke;
    battleData.miss += battleResult.totalMiss;
    battleData.word+=battleResult.point;
    battleData.detail[enemyRank].battle++;
    battleData.detail[enemyRank].win+=battleResult.win;
    //playDataに関する更新
    let remainExp=battleResult.exp;
    while(remainExp>0){
        if(getNextLvExp(playData) <=remainExp){//レベルアップ時
            remainExp-=getNextLvExp(playData);
            playData.exp+=getNextLvExp(playData);
            playData.level++;
        } else{//レベルアップなし
            playData.exp+=remainExp;
            remainExp=0;
            break;
        }
    }
    if(getNextStarStroke(avatorData,battleData)  <= 0 && getNextStarKPM(avatorData,battleAni).style == playData.settings[0] && getNextStarKPM(avatorData,battleAni).value <= avatorData[playData.settings[0]].typingData.kpm){
        //星アップ
        avatorData[0].star++;
        avatorData[1].star++;
    }
    playData.coin+=battleResult.coin;
    saveData();
}
function processBattle(){ //バトルの処理関数　制御系はここへ
    if(battleStatus==2){//打っている途中
        if(Math.random()<0.18) {
            enemyTypedText=enemyTypedText+battleResult.wordSet[battleResult.now].enemyText.substr(enemyTypedText.length,1);
            if(Math.random()<0.1) enemyMissAni=t;
        }
        if(battleResult.wordSet[battleResult.now].myText.length <= typedText.length){
            ///全部ワードを打ち切っていたら 　　ワード獲得処理
            lastKpm=Number(typedText.length / (t-wordT)*60000).toFixed(1);
            lastKpmE=Number(enemyTypedText.length / (t-wordT)*60000).toFixed(1);
            battleResult.point++;
            battleResult.words[battleResult.now]=1;
            battleResult.wordCP[battleResult.now] = Number(lastKpm);
            battleResult.wordEnemyCP[battleResult.now] = Number(lastKpmE);
            if(playData.settings[0]) battleResult.wordCP[battleResult.now]*=COEF_R2K;
            if(enemyAvatorData.style) battleResult.wordEnemyCP[battleResult.now]*=COEF_R2K;
            if(battleResult.maxCP < Math.max(battleResult.wordCP[battleResult.now],battleResult.wordEnemyCP[battleResult.now])) battleResult.maxCP=Math.max(battleResult.wordCP[battleResult.now],battleResult.wordEnemyCP[battleResult.now]);
            if(battleResult.minCP > Math.min(battleResult.wordCP[battleResult.now],battleResult.wordEnemyCP[battleResult.now])) battleResult.minCP=Math.min(battleResult.wordCP[battleResult.now],battleResult.wordEnemyCP[battleResult.now]);
            if(battleResult.now!=24){
                battleResult.words[battleResult.now+1]=3;
                lossTimeT=t;
                refreshWord();
                getWord=1;
                if(battleResult.point == 13) winLoseAni=t;
            }  else{//終端ワードの処理
                battleStatus=4;
                battleAni=t;
                processBattleResult();//バトルの終了処理
            }
        } else if(battleResult.wordSet[battleResult.now].enemyText.length <= enemyTypedText.length){
            ///相手が全部ワードを打ち切っていたら 　　ワード損失処理
            lastKpm=Number(typedText.length / (t-wordT)*60000).toFixed(1);
            lastKpmE=Number(enemyTypedText.length / (t-wordT)*60000).toFixed(1);
            battleResult.words[battleResult.now]=2;
            battleResult.wordCP[battleResult.now] = Number(lastKpm);
            battleResult.wordEnemyCP[battleResult.now] = Number(lastKpmE);
            if(playData.settings[0]) battleResult.wordCP[battleResult.now]*=COEF_R2K;
            if(enemyAvatorData.style) battleResult.wordEnemyCP[battleResult.now]*=COEF_R2K;
            if(battleResult.maxCP < Math.max(battleResult.wordCP[battleResult.now],battleResult.wordEnemyCP[battleResult.now])) battleResult.maxCP=Math.max(battleResult.wordCP[battleResult.now],battleResult.wordEnemyCP[battleResult.now]);
            if(battleResult.minCP > Math.min(battleResult.wordCP[battleResult.now],battleResult.wordEnemyCP[battleResult.now])) battleResult.minCP=Math.min(battleResult.wordCP[battleResult.now],battleResult.wordEnemyCP[battleResult.now]);
            if(battleResult.now!=24) {
                battleResult.words[battleResult.now+1]=3;
                lossTimeT=t;
                refreshWord();
                getWord=0;
                if(battleResult.now-battleResult.point == 13) winLoseAni=-t;
            } else{//終端ワードの処理
                battleStatus=4;
                battleAni=t;
                processBattleResult();//バトルの終了処理
            }
        } 
    }else if(battleStatus == 3){//待機中
        if(t-battleAni > WAIT_TIME){ //次のワードへ
            battleAni=t;
            battleStatus=2;
            lossTimeSum+=t-lossTimeT;
            wordT=t;
        }
        totalLossTime=lossTimeSum+t-lossTimeT;
    } else if(battleStatus==4){ //終了アニメーション
        if(t-battleAni > 2500){ //結果画面へ
            nextScene=4;
            sceneAni=t;
            battleStatus=5;
            resultAni=t;
        }
        totalLossTime=lossTimeSum+t-lossTimeT;
    }
}
function drawResult(){ ///結果画面の描画関数
    drawLoadingCircle(300,300,250,t*0.4,1000,1);
    drawLoadingCircle(800,400,120,t*-0.8,1000,1);
    for(let i = 0;i < prls.length;i++){
        if(prls[i].isMsgBox!=1 && prls[i].isTop!=1) drawPrl(prls[i]);
    }
    //左半分
    drawPrl({x1:40,y1:143,x2:590,y2:HEIGHT-30,colSet:0,hoverColSet:1,hoverCounter:0,textSize:0.6,text:""});
    drawPrl({x1:88,y1:253,x2:300,y2:380,colSet:1,lineWidth:2,shadow:0,hoverColSet:1,hoverCounter:0,textSize:0.6,text:""});
    drawPrl({x1:272,y1:253,x2:545,y2:380,colSet:1,lineWidth:2,shadow:0,hoverColSet:1,hoverCounter:0,textSize:0.6,text:""});
    drawPrl({x1:88-(117*0.3),y1:390,x2:300-(137*0.3),y2:HEIGHT-40,colSet:1,lineWidth:2,shadow:0,hoverColSet:1,hoverCounter:0,textSize:0.6,text:""});
    drawPrl({x1:272-(117*0.3),y1:390,x2:545-(137*0.3),y2:HEIGHT-40,colSet:1,lineWidth:2,shadow:0,hoverColSet:1,hoverCounter:0,textSize:0.6,text:""});
    //右半分
    drawPrl({x1:535,y1:143,x2:WIDTH-30,y2:HEIGHT-175,colSet:0,hoverColSet:1,hoverCounter:0,textSize:0.6,text:""});
    drawPrl({x1:535-43,y1:HEIGHT-160,x2:695,y2:HEIGHT-30,colSet:14,hoverColSet:1,hoverCounter:0,textSize:0.6,text:""});
    drawAvator(avatorData[0],535-15,HEIGHT-150,652,HEIGHT-30,t,1);
    drawBattleCircle(battleResult,450,30,20,t-resultAni,1);
    drawPrl({x1:130,y1:269,x2:230,y2:275,lineWidth:0.1,shadow:0,colSet:16,hoverColSet:0,hoverCounter:0,textSize:0.6,text:""});
    drawPrl({x1:315,y1:269,x2:451,y2:275,lineWidth:0.1,shadow:0,colSet:16,hoverColSet:0,hoverCounter:0,textSize:0.6,text:""});
    drawPrl({x1:128-137*0.3,y1:406,x2:228,y2:412,lineWidth:0.1,shadow:0,colSet:16,hoverColSet:0,hoverCounter:0,textSize:0.6,text:""});
    drawPrl({x1:313-137*0.3,y1:406,x2:413,y2:412,lineWidth:0.1,shadow:0,colSet:16,hoverColSet:0,hoverCounter:0,textSize:0.6,text:""});
    //テキストここから
    //左半分
    ctx2d.fillStyle=getRGBA(0,0,1);
    ctx2d.font="16pt " +  JAPANESE_FONTNAME;
    if(battleResult.win){
        ctx2d.fillText(enemyAvatorData.name + "に勝利した！",160,172);
    } else{
        ctx2d.fillText(enemyAvatorData.name + "に敗北した...",160,172);
    }
    ctx2d.font="12pt " +  JAPANESE_FONTNAME;
    ctx2d.fillText("本日の戦績",130,273);
    ctx2d.fillText("KPM Graph",315,273);
    ctx2d.fillText("スターランク",128-137*0.3,410);
    ctx2d.fillText("ミッション",313-137*0.3,410);
    drawStar(avatorData[0],131-42,421,24);
    ctx2d.font="10pt " +  JAPANESE_FONTNAME;
    ctx2d.fillText("次の星まで",123-174*0.3,468);
    ctx2d.fillText("必要KPM",123-195*0.3,489);
    ctx2d.fillText("打鍵",255-174*0.3,468);
    for(let i = 0;i < 5;i++){
        if(i==0) ctx2d.fillText("勝利",130-(20+i*20)*0.3,293+i*20);
        if(i==1) ctx2d.fillText("勝率",130-(20+i*20)*0.3,293+i*20);
        if(i==3) {
            ctx2d.fillText("獲得ワード",130-(20+i*20)*0.3,293+i*20);
        }
        if(i==4) {
            ctx2d.fillText("打鍵数",130-(20+i*20)*0.3,293+i*20);
        }
    }
    ctx2d.fillText("敗北",200-(20+0*20)*0.3,293+0*20);

    ctx2d.font="12pt " +  JAPANESE_FONTNAME;//日本語部分の描画

    for(let i = 0;i < 2;i++){
        for(let j = 0;j < 3;j++){
            ctx2d.fillText(RESULT_TEXT[i][j],160-22*0.3*(j+1)+i*200,200+j*22);
        }
    }
    for(let i = 0;i < 3;i++){
        ctx2d.font="8pt " +  JAPANESE_FONTNAME;//ミッション
        ctx2d.fillStyle=getRGBA(0,0,1);
        ctx2d.fillText(getMissionText(dailyMission.detail[i]),319-173*0.3-7.5*i,430 + i * 25);
        if(dailyMission.detail[i].progress != dailyMission.detail[i].max){
            ctx2d.fillText(dailyMission.detail[i].progress,474-ctx2d.measureText(dailyMission.detail[i].progress).width-173*0.3-7.5*(i+0.4),430 + (i+0.44) * 25);
            ctx2d.fillText("/",479-173*0.3-7.5*(i+0.44),430 + (i+0.4) * 25);
            ctx2d.fillText(dailyMission.detail[i].max,489-173*0.3-7.5*(i+0.4),430 + (i+0.44) * 25);    
        } else{//既にクリアしている場合
            drawPrl({x1:469-173*0.3-7.5*(i+0.4),y1:412+(i+0.44)*25,x2:542-173*0.3-7.5*(i+0.4),y2:428+(i+0.44)*25,lineWidth:2,shadow:0,colSet:3,trans:0.8,hoverColSet:3,hoverCounter:0,textSize:1.2,text:"CLEAR!"});
        }
        drawPrl({x1:319-173*0.3-7.5*(i+0.4),y1:422+(i+0.44)*25,x2:439-173*0.3-7.5*(i+0.4),y2:428+(i+0.44)*25,lineWidth:2,shadow:0,colSet:0,hoverColSet:0,hoverCounter:0,textSize:0.6,text:""});
        if(dailyMission.detail[i].progress) drawPrl({x1:319-173*0.3-7.5*(i+0.4),y1:422+(i+0.44)*25,x2:120* (dailyMission.detail[i].progress/dailyMission.detail[i].max)+ 319-173*0.3-7.5*(i+0.4),y2:428+(i+0.44)*25,lineWidth:2,shadow:0,colSet:5,hoverColSet:0,hoverCounter:0,textSize:0.6,text:""});
    }
    ctx2d.font="12pt " +  DIGIT_FONTNAME;//数字部分の描画
    ctx2d.fillStyle=getRGBA(0,0,1);
    for(let i = 0;i < 5;i++){
        if(i==0) ctx2d.fillText((dailyMission.win),165-(20+i*20)*0.3,293+i*20);
        if(i==1) ctx2d.fillText(Number(dailyMission.win/dailyMission.battle*100).toFixed(1) + "%",165-(20+i*20)*0.3,293+i*20);
        if(i==3) {
            ctx2d.fillText(dailyMission.word,200-(20+i*20)*0.3,293+i*20);        
        }
        if(i==4) {
            ctx2d.fillText(dailyMission.totalStroke,200-(20+i*20)*0.3,293+i*20);
        }
    }

    for(let i = 0;i < 2;i++){
        for(let j = 0;j < 3;j++){
            let drawData="";
            if(i==0 && j == 0) drawData=battleResult.kpm;
            if(i==0 && j ==1) drawData=battleResult.acc;
            if(i==0 && j == 2) drawData=battleResult.cp;
            if(i==1 && j == 0) drawData=battleResult.point;
            if(i==1 && j == 1) drawData=25-battleResult.point;
            if(i==1 && j == 2) drawData=battleResult.totalStroke;
            ctx2d.fillText(processShowData(drawData),250-22*0.3*(j+1)+i*200,200+j*22);
            if(i == 0 && j == 1) ctx2d.fillText("%",ctx2d.measureText(drawData).width+260-22*0.3*(j+1)+i*180,200+j*22);
        }
    }
    ctx2d.fillText((dailyMission.battle-dailyMission.win),235-(20+0*20)*0.3,293+0*20);
    ctx2d.fillText(processShowData(getNextStarStroke(avatorData,battleData)),198-174*0.3,468);
    ctx2d.fillText(processShowData(getNextStarKPM(avatorData,battleData).value),198-195*0.3,489);

    //勝率のグラフ
    for(let i = 0;i < 5;i++){
        drawPrl({x1:147+i*23,y1:321,x2:167+i*23,y2:329,lineWidth:3,shadow:0,colSet:0,hoverColSet:0,hoverCounter:0,textSize:0.6,text:""});
        if(dailyMission.battle && Math.max(0,(dailyMission.win-dailyMission.battle*0.2*i)/(dailyMission.battle*0.2))>0) drawPrl({x1:147+i*23,y1:321,x2:149+i*23+18*Math.min(1,Math.max(0,(dailyMission.win-dailyMission.battle*0.2*i)/(dailyMission.battle*0.2))),y2:329,lineWidth:3,shadow:0,colSet:5,hoverColSet:0,hoverCounter:0,textSize:0.6,text:""});
    }
    //KPMグラフ
    battleResult.minCP=Number(battleResult.minCP);
    battleResult.maxCP=Number(battleResult.maxCP);
    
    drawPrl({x1:282,y1:283,x2:525,y2:370,colSet:13,lineWidth:2,shadow:0,hoverColSet:1,hoverCounter:0,textSize:0.6,text:""});

    let graphMaxCP=Math.ceil(battleResult.maxCP/10)*10
    let graphMinCP=Math.floor(battleResult.minCP/10)*10
    ctx2d.lineWidth=1;

    let strokeHeight=150; //罫線の描画
    if(graphMaxCP-graphMinCP > 1000) strokeHeight=300;
    ctx2d.beginPath();
    ctx2d.strokeStyle="rgba(255,255,255,0.8)";
    ctx2d.fillStyle="rgba(255,255,255,1)";
    ctx2d.font="6pt " + DIGIT_FONTNAME;
    for(let i = 0;i < 10;i++){
        if(i * strokeHeight > battleResult.minCP && i * strokeHeight<battleResult.maxCP){
            ctx2d.moveTo(getGraphPos(0,1-(i*strokeHeight-graphMinCP)/(graphMaxCP-graphMinCP)).x,getGraphPos(0,1-(i*strokeHeight-graphMinCP)/(graphMaxCP-graphMinCP)).y);
            ctx2d.lineTo(getGraphPos(1,1-(i*strokeHeight-graphMinCP)/(graphMaxCP-graphMinCP)).x,getGraphPos(1,1-(i*strokeHeight-graphMinCP)/(graphMaxCP-graphMinCP)).y);
            ctx2d.fillText(i*strokeHeight,getGraphPos(1,1-(i*strokeHeight-graphMinCP)/(graphMaxCP-graphMinCP)).x,getGraphPos(1,1-(i*strokeHeight-graphMinCP)/(graphMaxCP-graphMinCP)).y+2);
        }
    }
    ctx2d.stroke();
    
    ctx2d.strokeStyle="rgba(200,5,5,0.5)";//相手のグラフ
    ctx2d.beginPath();
    for(let i = 0;i < 25;i++){
        battleResult.wordCP[i] = Number(battleResult.wordCP[i]);
        if(isNaN(battleResult.wordEnemyCP[i])) battleResult.wordEnemyCP[i]=(graphMaxCP+graphMinCP)/2;
        if(i==0){
            ctx2d.moveTo(getGraphPos(1/25*i,1-(battleResult.wordEnemyCP[i]-graphMinCP)/(graphMaxCP-graphMinCP)).x,getGraphPos(1/25*i,1-(battleResult.wordEnemyCP[i]-graphMinCP)/(graphMaxCP-graphMinCP)).y);
        } else{
            ctx2d.lineTo(getGraphPos(1/25*i,1-(battleResult.wordEnemyCP[i]-graphMinCP)/(graphMaxCP-graphMinCP)).x,getGraphPos(1/25*i,1-(battleResult.wordEnemyCP[i]-graphMinCP)/(graphMaxCP-graphMinCP)).y);
        }
    }
    ctx2d.stroke();

    ctx2d.strokeStyle="rgba(255,255,255,1)";//自分のグラフ
    ctx2d.beginPath();
    for(let i = 0;i < 25;i++){
        battleResult.wordCP[i] = Number(battleResult.wordCP[i]);
        if(isNaN(battleResult.wordCP[i])) battleResult.wordCP[i]=(graphMaxCP+graphMinCP)/2;
        if(i==0){
            ctx2d.moveTo(getGraphPos(1/25*i,1-(battleResult.wordCP[i]-graphMinCP)/(graphMaxCP-graphMinCP)).x,getGraphPos(1/25*i,1-(battleResult.wordCP[i]-graphMinCP)/(graphMaxCP-graphMinCP)).y);
        } else{
            ctx2d.lineTo(getGraphPos(1/25*i,1-(battleResult.wordCP[i]-graphMinCP)/(graphMaxCP-graphMinCP)).x,getGraphPos(1/25*i,1-(battleResult.wordCP[i]-graphMinCP)/(graphMaxCP-graphMinCP)).y);
        }
    }
    ctx2d.stroke();
    ctx2d.strokeStyle="rgba(0,0,0,1)";
    ctx2d.lineWidth=1;
    for(let i = 0;i < 25;i++){ //取っている方に円を表示
        ctx2d.beginPath();
        if(battleResult.words[i] == 1){
            ctx2d.fillStyle="rgba(180,130,0,1)";
            ctx2d.arc(getGraphPos(1/25*i,1-(battleResult.wordCP[i]-graphMinCP)/(graphMaxCP-graphMinCP)).x,getGraphPos(1/25*i,1-(battleResult.wordCP[i]-graphMinCP)/(graphMaxCP-graphMinCP)).y,3,0,Math.PI*2);
        } else if(battleResult.words[i] == 2){
            ctx2d.fillStyle="rgba(30,30,30,1)";
            ctx2d.arc(getGraphPos(1/25*i,1-(battleResult.wordEnemyCP[i]-graphMinCP)/(graphMaxCP-graphMinCP)).x,getGraphPos(1/25*i,1-(battleResult.wordEnemyCP[i]-graphMinCP)/(graphMaxCP-graphMinCP)).y,2,0,Math.PI*2);
        }
        ctx2d.fill();
    }
    //経験値系の表示
    ctx2d.font="12pt " + JAPANESE_FONTNAME;
    for(let i = 0;i < 7;i++){
        ctx2d.fillStyle="rgba(0,0,0,1)";
        if(i==0){
            ctx2d.fillText("獲得ポイント",605-i*6.3,169+i*21);
            ctx2d.fillText("pt",865-i*6.3,169+i*21);
        } else if(i!=6){
            ctx2d.font="10pt " + JAPANESE_FONTNAME;
            ctx2d.fillText(BONUS_NAME[i-1],605-i*6.3,169+i*21);
            ctx2d.fillText("%",865-i*6.3,169+i*21);
        } else{
            ctx2d.font="12pt " + DIGIT_FONTNAME + ","+JAPANESE_FONTNAME;            
            ctx2d.fillText("合計ボーナス",605-i*6.3,169+i*21);
            ctx2d.fillText("%",865-i*6.3,169+i*21);
        }
    }
    ctx2d.fillText("Lv " + playData.level,615-8.8*6.6,164+8.8*22);
    ctx2d.font="12pt " + DIGIT_FONTNAME + ","+JAPANESE_FONTNAME;
    ctx2d.fillStyle=getRGBA(2,0,1);
    ctx2d.fillText(playData.coin + "マイル",620+2*6.3,174-2*21);
    ctx2d.drawImage(coinImg,590+2*6.3,154-2*21,30,30);
    for(let i = 0;i < 7 ;i++){
        ctx2d.fillStyle=getRGBA(0,0,1);
        if(i==0){
            ctx2d.fillText(battleResult.baseExp,825-i*6.3,169+i*21);
        } else if(i!=6){
            ctx2d.font="10pt " + DIGIT_FONTNAME + ","+JAPANESE_FONTNAME;
            if(battleResult.bonus[i-1] > 0) ctx2d.fillStyle=getRGBA(14,0,1);
            if(battleResult.bonus[i-1] < 0) ctx2d.fillStyle=getRGBA(13,0,1);
            ctx2d.fillText(battleResult.bonus[i-1],825-i*6.3,169+i*21);
            if(battleResult.bonus[i-1] >0){
                ctx2d.drawImage(arrowImg,890-i*6.3,156+i*21 - (5)*Math.max(0,Math.sin(t/150)*3-2.7),15,15);
            }
        } else{
            ctx2d.font="12pt " + DIGIT_FONTNAME + ","+JAPANESE_FONTNAME;
            if(battleResult.bonus[0] + battleResult.bonus[1] + battleResult.bonus[2] + battleResult.bonus[3] + battleResult.bonus[4] >0){
                ctx2d.drawImage(arrowImg,890-i*6.3,156+i*21 - (5)*Math.max(0,Math.sin(t/150)*3-2.7),15,15);
                ctx2d.fillStyle=getRGBA(14,0,1);
            }
            ctx2d.fillText(battleResult.bonus[0]+battleResult.bonus[1]+battleResult.bonus[2]+battleResult.bonus[3]+battleResult.bonus[4],825-i*6.3,169+i*21);
        }
        if(i == 3){
            drawPrl({x1:715-2*6.3,y1:176+2*21,x2:715-2*6.3+30,y2:176+2*21+15,lineWidth:1,shadow:0,isTop:1,colSet:avatorData[0].team*2+5,hoverColSet:avatorData[0].team*2+5+1,hoverCounter:0,textSize:1,text:"YOU"});
            ctx2d.fillText("VS",755-i*6.3,164+i*21);
            drawPrl({x1:720-2*6.3+45,y1:176+2*21,x2:720-2*6.3+75,y2:176+2*21+15,lineWidth:1,shadow:0,isTop:1,colSet:enemyAvatorData.team*2+5,hoverColSet:enemyAvatorData.team*2+5+1,hoverCounter:0,textSize:1,text:"ENE"});
        }
        if(i == 1){
            let pointRankColSet=13;
            if(battleResult.pointRank==0){
                pointRankColSet=3;
            }else if(battleResult.pointRank==2){
                pointRankColSet=0;
            }else if(battleResult.pointRank==1){
                pointRankColSet=16;
            }
            drawPrl({x1:715-0*6.3,y1:176+0*21,x2:715-0*6.3+30,y2:176+0*21+15,lineWidth:1,shadow:0,isTop:1,colSet:pointRankColSet,hoverColSet:pointRankColSet,hoverCounter:0,textSize:1.2,text:RANK_TEXT[battleResult.pointRank]});
        }
        if(i == 2){
            let accRankColSet=13;
            if(battleResult.accRank==0){
                accRankColSet=3;
            }else if(battleResult.accRank==2){
                accRankColSet=0;
            }else if(battleResult.accRank==1){
                accRankColSet=16;
            }
            drawPrl({x1:715-1*6.3,y1:176+1*21,x2:715-1*6.3+30,y2:176+1*21+15,lineWidth:1,shadow:0,isTop:1,colSet:accRankColSet,hoverColSet:accRankColSet,hoverCounter:0,textSize:1.2,text:RANK_TEXT[battleResult.accRank]});
        }
    }
    ctx2d.fillStyle=getRGBA(0,0,1);
    ctx2d.fillText("次Lvまであと " + getNextLvExp(playData) + " EXP",740-8.8*6.6,164+8.8*22);
    ctx2d.font="16pt " + JAPANESE_FONTNAME;
    ctx2d.fillText("獲得経験値",605-7*6.9,169+7*23);
    ctx2d.fillText("EXP",865-7*6.9,169+7*23);
    ctx2d.font="16pt " + DIGIT_FONTNAME;
    ctx2d.fillText(battleResult.exp,815-7*6.9,169+7*23);
    drawPrl({x1:605-7.3*6.9,y1:169+7.3*23,x2:900-7.3*6.9,y2:173+7.3*23,colSet:13,shadow:0,lineWidth:1,hoverColSet:1,hoverCounter:0,textSize:0.6,text:""});
    drawPrl({x1:605-7.3*6.9,y1:169+7.3*23,x2:605-7.3*6.9+295*(getNextLvExp(playData,1)),y2:173+7.3*23,colSet:3,shadow:0,lineWidth:1,hoverColSet:1,hoverCounter:0,textSize:0.6,text:""});

    if(battleResult.coin) drawPrl({x1:765,y1:108,x2:WIDTH-19,y2:133,colSet:3,shadow:0,hoverColSet:3,hoverCounter:0,textSize:1,text:battleResult.coin + "マイルを獲得！"});//コイン
    for(let i = 0;i < prls.length;i++){
        if(prls[i].isMsgBox!=1 && prls[i].isTop==1) drawPrl(prls[i]);
    }
}
function drawAvator1(){ ///アバターきせかえ画面の描画関数
    drawLoadingCircle(WIDTH/2+40,HEIGHT/2-200,240,t/3.2,1000);//////////動く丸
    drawLoadingCircle(WIDTH-HEIGHT/3,HEIGHT/3+290,HEIGHT/3-20,-t/3,1000);//////////動く丸
    drawLoadingCircle(100,HEIGHT-60,150,t/2.6,1000);
    drawPrl({x1:60,y1:143,x2:648,y2:HEIGHT-30,colSet:0,hoverColSet:1,hoverCounter:0,textSize:0.6,text:""});
    drawPrl({x1:125,y1:152,x2:378,y2:331,lineWidth:2,shadow:0,colSet:11,hoverColSet:11,hoverCounter:0,textSize:0.6,text:""});
    drawPrl({x1:572,y1:90,x2:WIDTH-25,y2:HEIGHT-100,colSet:0,hoverColSet:1,hoverCounter:0,textSize:0.6,text:""});
    drawPrl({x1:592,y1:140,x2:910,y2:400,shadow:0,colSet:1,hoverColSet:1,hoverCounter:0,lineWidth:3,textSize:0.95,text:""});
    drawPrl({x1:600,y1:348,x2:842,y2:395,shadow:0,colSet:1,trans:Math.min(1,Math.max(0,(t-selectPartsAni)/300-11/5)),hoverColSet:1,hoverCounter:0,lineWidth:3,textSize:0.95,text:""});
    for(let i = 0;i < 5;i++){
        drawPrl({x1:467+i*23,y1:312,x2:487+i*23,y2:320,lineWidth:3,shadow:0,colSet:0,hoverColSet:0,hoverCounter:0,textSize:0.6,text:""});
        if(battleData.battle && Math.max(0,(battleData.win-battleData.battle*0.2*i)/(battleData.battle*0.2))>0) drawPrl({x1:467+i*23,y1:312,x2:469+i*23+18*Math.min(1,Math.max(0,(battleData.win-battleData.battle*0.2*i)/(battleData.battle*0.2))),y2:320,lineWidth:3,shadow:0,colSet:5,hoverColSet:0,hoverCounter:0,textSize:0.6,text:""});
    }
    drawPrl({x1:690+selectParts*50,y1:120,x2:697+selectParts*50,y2:138,lineWidth:0.1,shadow:0,colSet:13,hoverColSet:13,hoverCounter:0,textSize:0.6,text:""});
    drawAvator(avatorData[0],146,156,352,335,t,1);
    for(let i = 0;i < prls.length;i++){
        if(prls[i].isMsgBox!=1) drawPrl(prls[i]);
    }
    ctx2d.font="13.5pt " + JAPANESE_FONTNAME;
    ctx2d.fillStyle=getRGBA(0,0,1);
    ctx2d.fillText("名前",388,172);
    ctx2d.fillText("チーム",379,202);
    if(avatorData[0].name.length>=8){
        ctx2d.font="12pt " + JAPANESE_FONTNAME;
    }
    ctx2d.fillText(avatorData[0].name,458,172);
    ctx2d.font="13.5pt " + JAPANESE_FONTNAME;
    ctx2d.fillText(TEAM_TEXT[avatorData[0].team],471,202);
    ctx2d.fillText("LV.",120,360);
    ctx2d.fillText("EXP",210,360);
    ctx2d.font="12pt " + JAPANESE_FONTNAME;
    ctx2d.drawImage(coinImg,600,408,33,33);
    ctx2d.fillText("所持コイン",630,430);
    ctx2d.font="10pt " + JAPANESE_FONTNAME;
    ctx2d.fillText("マイル",785,430);
    ctx2d.fillText("CP(" + INPUT_STYLE_SHORT[playData.settings[0]] +")",367,242);
    ctx2d.fillText("kpm(R)",358,272);
    ctx2d.fillText("kpm(K)",349,302);
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
    ctx2d.fillText(playData.level,160,360);
    ctx2d.fillText(playData.exp,270,360);
    ctx2d.font="12pt " + DIGIT_FONTNAME;
    ctx2d.fillText(processShowData(avatorData[playData.settings[0]].cp),412,242);
    ctx2d.fillText(processShowData(Number(avatorData[0].typingData.kpm).toFixed(1)),403,272);
    ctx2d.fillText(processShowData(Number(avatorData[1].typingData.kpm).toFixed(1)),394,302);

    ctx2d.fillText(processShowData(battleData.win),525,242);
    ctx2d.fillText(processShowData(battleData.battle-battleData.win),516,272);
    ctx2d.fillText(processShowData(Number(battleData.win/battleData.battle*100).toFixed(1))+"%",507,302);
    ctx2d.fillText(processShowData(Number(battleData.detail[0].win/battleData.detail[0].battle*100).toFixed(1))+"%",493.5,362);
    ctx2d.fillText(processShowData(Number(battleData.detail[1].win/battleData.detail[1].battle*100).toFixed(1))+"%",486,387);
    ctx2d.fillText(processShowData(Number(battleData.detail[2].win/battleData.detail[2].battle*100).toFixed(1))+"%",479.5,412);
    ctx2d.fillText(processShowData(battleData.stroke),472,437,100);
    ctx2d.fillText(processShowData(battleData.win + battleData.loes),464.5,462);
    ctx2d.fillText(processShowData(battleData.esc),457,487);
    ctx2d.fillText(playData.coin,775-ctx2d.measureText(playData.coin).width,430);
    ctx2d.fillText(processShowData(getNextLvExp(playData)),160-ctx2d.measureText(processShowData(getNextLvExp(playData))).width/2,457);
    ctx2d.strokeStyle=getRGBA(0,0,1);//　　円（星）
    ctx2d.lineWidth=5;
    ctx2d.beginPath();
    ctx2d.arc(280,450,52,0,Math.PI*2);
    ctx2d.stroke();
    ctx2d.strokeStyle="rgba(130,0,0,1)";//　　円の星　赤
    if(getNextStarKPM(avatorData,battleData).value >0){//KPM不足時
        //以下、ストローク部分の表示
        ctx2d.fillText(processShowData(getNextStarStroke(avatorData,battleData)),280-ctx2d.measureText(processShowData(getNextStarStroke(avatorData,battleData))).width/2,452);//円の内部のテキスト
        ctx2d.font="8pt " + JAPANESE_FONTNAME;
        ctx2d.fillText("STROKE",280-ctx2d.measureText("STROKE").width/2,466);
        ctx2d.font="7pt " + JAPANESE_FONTNAME;
        ctx2d.fillText("必要KPM:" + getNextStarKPM(avatorData,battleData).value,280-ctx2d.measureText("必要KPM:" + getNextStarKPM(avatorData,battleData).value).width/2,481);
        ctx2d.fillText("(" + SETTING_SELECT[0][getNextStarKPM(avatorData,battleData).style] + ")",280-ctx2d.measureText("(" + SETTING_SELECT[0][getNextStarKPM(avatorData,battleData).style] + ")").width/2,490);
        ctx2d.beginPath();
        ctx2d.arc(280,450,52,Math.PI*-0.5,Math.PI*(getNextStarStroke(avatorData,battleData,1)*2-0.5));
        ctx2d.stroke();
    } else{ //ストロークのみ不足時
        ctx2d.fillText(processShowData(getNextStarStroke(avatorData,battleData)),280-ctx2d.measureText(processShowData(getNextStarStroke(avatorData,battleData))).width/2,457);//円の内部のテキスト
        ctx2d.font="8pt " + JAPANESE_FONTNAME;
        ctx2d.fillText("STROKE",280-ctx2d.measureText("STROKE").width/2,477);
        ctx2d.beginPath();
        ctx2d.arc(280,450,52,Math.PI*-0.5,Math.PI*(getNextStarStroke(avatorData,battleData,1)*2-0.5));
        ctx2d.stroke();
    }
    ctx2d.font="8pt " + JAPANESE_FONTNAME;
    ctx2d.fillText("次Lvまで",160-ctx2d.measureText("次Lvまで").width/2,435);
    ctx2d.fillText("EXP",160-ctx2d.measureText("EXP").width/2,477);
    ctx2d.fillText("次のスターまで",280-ctx2d.measureText("次のスターまで").width/2,435);
    for(let i = 0;i<10;i++){
        ctx2d.fillStyle=getRGBA(0,0,Math.min(1,Math.max(0,(t-selectPartsAni)/300-i/5)));
        if(i == avatorData[0].item[selectParts]){
            ctx2d.fillStyle=getRGBA(0,900,t);
        }
        if((playData.item[selectParts][i]==0 || playData.item[selectParts][i] == 2) && ITEM_DATA[selectParts][i][1]!=-1){
            ctx2d.fillText(ITEM_DATA[selectParts][i][0],675-i*6,156+i*20);
            if(Math.min(1,Math.max(0,(t-selectPartsAni)/300-i/5))>0.5) ctx2d.drawImage(coinImg,755-i*6,142+i*20,18,18);
            ctx2d.fillText(ITEM_DATA[selectParts][i][1],775-i*6,156+i*20);
            ctx2d.fillText("マイル",805-i*6,156+i*20);
        } else if((playData.item[selectParts][i]==0 || playData.item[selectParts][i] == 2) && ITEM_DATA[selectParts][i][1]==-1){
            ctx2d.fillText("？？？",675-i*6,156+i*20);
            if(Math.min(1,Math.max(0,(t-selectPartsAni)/300-i/5))>0.5) ctx2d.drawImage(coinImg,755-i*6,142+i*20,18,18);
            ctx2d.fillText("- - -",775-i*6,156+i*20);
            ctx2d.fillText("マイル",805-i*6,156+i*20);
        }else{
            ctx2d.fillText(ITEM_DATA[selectParts][i][0],675-i*6,156+i*20);
            if(ITEM_DATA[selectParts][i][0]!="装備なし"){
                ctx2d.fillText("購入済み",795-i*6,156+i*20);
            }
        }
    }
    ctx2d.fillStyle=getRGBA(0,0,Math.min(1,Math.max(0,(t-selectPartsAni)/300-11/5)));
    ctx2d.fillText(ITEM_DATA[selectParts][avatorData[0].item[selectParts]][2].substr(0,19),620,366);
    ctx2d.fillText(ITEM_DATA[selectParts][avatorData[0].item[selectParts]][2].substr(19,19),620,383);
    drawStar(avatorData[0],165,368,20);
    drawTeamCircle(459,196,6,avatorData[0].team);

    ctx2d.strokeStyle=getRGBA(0,0,1);//　　円（レベル)
    ctx2d.lineWidth=5;
    ctx2d.beginPath();
    ctx2d.arc(160,450,52,0,Math.PI*2);
    ctx2d.stroke();
    ctx2d.strokeStyle="rgba(130,0,0,1)";//　　円　赤
    ctx2d.beginPath();
    ctx2d.arc(160,450,52,-Math.PI*0.5,Math.PI*(getNextLvExp(playData,1)*2-0.5));
    ctx2d.stroke();
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
function setItemButtons(parts){
    for(let i = 0;i < prls.length;i++){
        if(0<=prls[i].id && prls[i].id<=9){ //装着のボタンなら
            if(playData.item[parts][prls[i].id] == 0){
                if(ITEM_DATA[parts][prls[i].id][1] != -1){
                    prls[i].text="選択";
                } else{
                    prls[i].text="- - -";
                }
                prls[i].colSet=0;
                prls[i].hoverColSet=1;
            } else if(playData.item[parts][prls[i].id] == 1){
                prls[i].text="装備中";
                prls[i].colSet=3;
                prls[i].hoverColSet=3;
            } else if(playData.item[parts][prls[i].id] == 2){
                prls[i].text="購入";
                prls[i].colSet=3;
                prls[i].hoverColSet=4;
            } else if(playData.item[parts][prls[i].id] == 3){
                prls[i].text="装備";
                prls[i].colSet=14;
                prls[i].hoverColSet=1;
            }
        }
    }
}
function sendChangeRequest(parts,num){
    if(playData.item[parts][num]==0 && ITEM_DATA[parts][num][1] != -1){//未所持　試着する
        avatorData[0].item[parts] = num;
        for(let i = 0;i < 10;i++) {
            if(playData.item[parts][i] == 1) playData.item[parts][i] = 3;
            if(playData.item[parts][i] == 2) playData.item[parts][i] = 0; 
        }
        playData.item[parts][num] = 2;
    } else if(playData.item[parts][num] == 1){ //装備中時

    } else if(playData.item[parts][num] == 2){ //試着時
        //購入の可否を判断
        if(playData.coin < ITEM_DATA[parts][num][1]){
            msgBox.push({
                text:"コインが足りません。",
                ani:t,
                btns1:{text:"OK",onClick:function(){}}});
        } else{
            msgBox.push({
                text:ITEM_DATA[parts][num][0] + "を購入しますか？",
                ani:t,
                btns1:{text:"YES",onClick:function(){
                    for(let i = 0;i < 10;i++) {
                        if(playData.item[parts][i] == 1) playData.item[parts][i] = 3;
                        if(playData.item[parts][i] == 2) playData.item[parts][i] = 0; 
                    }
                    playData.item[parts][num] = 1;
                    playData.coin-=ITEM_DATA[parts][num][1];
                    avatorData[0].item[parts] = num;
                    setAvatorData(0);
                    saveData();
                    msgBox.push({
                        text:ITEM_DATA[parts][num][0] + "を購入しました！",
                        ani:t,
                        btns1:{text:"OK",onClick:function(){}}});
                    sendChangeRequest(parts,num);
                    setItemButtons(parts);
                }},
                btns2:{text:"NO",onClick:function(){}}});

        }
    } else if(playData.item[parts][num] == 3){ //持っているが未着用
        avatorData[0].item[parts] = num;
        for(let i = 0;i < 10;i++) {
            if(playData.item[parts][i] == 1) playData.item[parts][i] = 3;
            if(playData.item[parts][i] == 2) playData.item[parts][i] = 0; 
        }
        playData.item[parts][num] = 1;
    } 
    setItemButtons(parts);
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
    clickX=0,clickY=0;
    if(next==1){ //タイトル画面に遷移する場合
        prls.push({x1:WIDTH/2-100,y1:HEIGHT/2+100,x2:WIDTH/2+100,y2:HEIGHT/2+150,colSet:0,hoverColSet:1,hoverCounter:0,text:"START",onClick:function(){
            if(firstLaunchFlg){ //初回起動時
                msgBox.push({
                    text:"AVA-TYPEへようこそ！　まずはアバターの作成を行いましょう。",
                    ani:t,
                    btns1:{text:"OK",onClick:function(){ //アバター作成の初期ウィンドウを表示
                        resetData();
                        saveData();
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
            msgBox.push({selectBattleAvatorWindow:1,ani:t});}})
        prls.push({x1:100,y1:340,x2:558,y2:490,colSet:0,hoverColSet:1,hoverCounter:0,textSize:0.4,text:"AVATOR",subText:"アバター",rev:1,onClick:function(){
            nextScene=5,sceneAni=t;}})
    }  else if(next==3){//試合
        ctx2dImg.drawImage(backImg[1],0,0,WIDTH,HEIGHT);

    } else if(next==4){//試合結果
        ctx2dImg.drawImage(backImg[3],0,0,WIDTH,HEIGHT);//負けたら4
        prls.push({x1:30,y1:30,x2:450,y2:130,colSet:14,hoverColSet:14,hoverCounter:0,textSize:0.85,text:"RESULT"});
        prls.push({x1:685,y1:HEIGHT-160,x2:WIDTH-25-75,y2:HEIGHT-100,colSet:0,hoverColSet:1,hoverCounter:0,textSize:0.8,text:"RETRY",subText:"再戦",onClick:function(){
            //リトライ処理
            sceneAni=t;
            nextScene=3;////バトル開始ボタン　敵データのセットなどをここにおく
            battleAni=t;//バトル開始時のアニメーション
            battleStatus=0;//バトル開始のアニメーションモードへ
            enemyAvatorData = localAvator[selectBattleAvatorClass][selectBattleAvator];
            setBattleResultDefault();//バトルデータのセットを呼び出し
            refreshWord(1);
        }});
        prls.push({x1:664,y1:HEIGHT-90,x2:WIDTH-25-96,y2:HEIGHT-30,colSet:0,hoverColSet:1,hoverCounter:0,textSize:0.8,text:"BACK",subText:"戻る",onClick:function(){
            //メニューへ戻る
            nextScene=2;
            sceneAni=t;
        }});
        prls.push({x1:715-3*6.3,y1:176+3*21,x2:715-3*6.3+40,y2:176+3*21+15,lineWidth:1,shadow:0,isTop:1,colSet:13,hoverColSet:14,hoverCounter:0,textSize:1.4,text:"詳細",onClick:function(){
            //アイテムボーナスの詳細ウィンドウを表示する処理をここに追加 battleResult.itemBonus
        }});//アイテムボーナスの詳細ウィンドウ
        prls.push({x1:WIDTH-65,y1:148,x2:WIDTH-35,y2:165,lineWidth:2,shadow:0,isTop:1,colSet:13,hoverColSet:14,hoverCounter:0,textSize:1.4,text:"？",onClick:function(){
            //ボーナスのヘルプウィンドウを表示する処理をここにおく
        }});//ボーナスのヘルプウィンドウ

    } else if(next==5){//アバター　きせかえ
        ctx2dImg.drawImage(backImg[5],0,0,WIDTH,HEIGHT);
        prls.push({x1:30,y1:30,x2:450,y2:130,colSet:14,hoverColSet:14,hoverCounter:14,textSize:0.8,text:"AVATOR"});
        prls.push({x1:430,y1:90,x2:663,y2:130,colSet:0,hoverColSet:1,hoverCounter:0,textSize:0.8,text:"アバター管理",onClick:function(){nextScene=6,sceneAni=t}});
        for(let i = 0;i < 5;i++){
            prls.push({x1:675+i*50,y1:100,x2:722+i*50,y2:120,shadow:0,colSet:0+(i==0),hoverColSet:1,hoverCounter:0,lineWidth:3,textSize:0.95,id:i+10,text:PARTS_TEXT[i],onClick:function(){
                selectParts=i,selectPartsAni=t,setItemButtons(selectParts);
                for(let j = 0;j < prls.length;j++){//選択中のタブの色を変える
                    if(prls[j].id==10+i){
                        prls[j].colSet=1;
                    } else if(prls[j].id>=10 && prls[j].id<=14){
                        if(playData.item[prls[j].id-10][avatorData[0].item[prls[j].id-10]] == 2){
                            prls[j].colSet=14;
                        } else {
                            prls[j].colSet=0;
                        }
                    }
                }

            }});
        }
        for(let i = 0;i < 10;i++){
            prls.push({x1:849-i*6,y1:146+i*20,x2:902-i*6,y2:162+i*20,shadow:0,colSet:0,hoverColSet:1,hoverCounter:0,lineWidth:3,textSize:1.2,id:i,text:"選択",onClick:function(){
                sendChangeRequest(selectParts,i);
            }});
        }
        setItemButtons(selectParts);
        prls.push({x1:650,y1:HEIGHT-90,x2:826,y2:HEIGHT-30,colSet:0,hoverColSet:1,hoverCounter:0,textSize:0.6,text:"BACK",subText:"戻る",onClick:function(){
            /* 試着中のアイテムをチェック　*/
            let selectingFlg=0;
            for(let i = 0;i < 5;i++){
                if(playData.item[i][avatorData[0].item[i]] == 2){
                    selectingFlg=1;
                }
            }
            if(selectingFlg) {
                msgBox.push({
                    text:"選択中の未購入アイテムがあります。デフォルト装備に戻し、メニューへ戻りますか？",
                    ani:t,
                    btns1:{text:"YES",onClick:function(){
                        for(let i = 0;i < 5;i++){
                            if(playData.item[i][avatorData[0].item[i]] == 2){
                                playData.item[i][avatorData[0].item[i]]=0;
                                playData.item[i][0]=1;
                                avatorData[0].item[i] = 0;
                            }
                        }
                        nextScene=2,sceneAni=t,setAvatorData(0),saveData();
                    }},
                    btns2:{text:"NO",onClick:function(){}}});
            } else {
                nextScene=2,sceneAni=t,setAvatorData(0),saveData();}}
            });
        prls.push({x1:589,y1:157,x2:629,y2:177,shadow:0,lineWidth:2,colSet:13,hoverColSet:11,hoverCounter:0,textSize:1,text:"変更",onClick:function(){
            msgBox.push({changeNameWindow:1,
                text:"",
                ani:t,
                flg:0});}});
        prls.push({x1:580,y1:187,x2:620,y2:207,shadow:0,lineWidth:2,colSet:13,hoverColSet:11,hoverCounter:0,textSize:1,text:"変更",onClick:function(){
            if(playData.item[4][2]!=0){ //アイテムを持っているとき
                msgBox.push({changeTeamWindow:1,
                text:"",
                ani:t,
                flg:0});
            } else{　//持っていない時
                msgBox.push({
                    text:"所属チームを変更するには、アイテム「鞍替えの紋章」が必要です。",
                    ani:t,
                    btns1:{text:"OK",onClick:function(){}}})
            }}});
    
    } else if(next==6){//アバター管理
        ctx2dImg.drawImage(backImg[4],0,0,WIDTH,HEIGHT);
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
                btns1:{text:"YES",onClick:function(){nextScene=2,sceneAni=t;
                for(let i = 0;i < 9;i++){playData.settings[i] = previousSettings[i]};
                saveData()}},
                btns2:{text:"NO",onClick:function(){return 0;}}})
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
                        btns1:{text:"OK",onClick:function(){resetData(),
                            msgBox.push({text:"すべてのプレイデータをリセットしました。タイトル画面へ戻ります。",ani:t,btns1:{text:"OK",onClick:function(){nextScene=1,sceneAni=t;}}})}},
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
        if(DEBUG_MODE==3) enemyAvatorData=localAvator[0][0],setBattleResultDefault(),battleResult.now=24;
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
            processBattle();
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
                ctx2d.fillStyle="rgba(0,0,0," + (t-sceneAni)/(SCENE_ANI * (1+1*(scene==1 || scene==0|| nextScene == 3)))+")";
                ctx2d.fillRect(0,0,WIDTH,HEIGHT);
                if(t-sceneAni > SCENE_ANI * (1+1*(scene==1 || scene==0 || nextScene == 3))) scene=nextScene,sceneAni=t,changeScene(scene,nextScene);
            } else{
                ctx2d.fillStyle="rgba(0,0,0," + (1-(t-sceneAni)/SCENE_ANI)+")";
                ctx2d.fillRect(0,0,WIDTH,HEIGHT);
                if(t-sceneAni > SCENE_ANI) sceneAni=0;
            }
        }
        requestAnimationFrame(tick);
    }
}