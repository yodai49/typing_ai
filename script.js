var prls = [];//描画する平行四辺形の構造体の配列
var msgBox=[];//描画するメッセージボックスの構造体の配列
var previousSettings=[];//直前の設定を保存するため
var typingEffect=[];//タイピングのエフェクト
function processKeypress(myKey,myKeyCode,e){ //キー入力イベント　シーン→キー→条件の順番で分ける
    if(scene==3){//バトル中
        if((myKeyCode == 27|| (myKey=="Q" && playData.settings[0]==0)) && nextScene!=2){//Escキー　タイトルへ戻る
            nextScene=2;sceneAni=t;
            clearTimeout(lastBGMID);
            playSE("esc");
            clickX=0,clickY=0;
            battleData.esc++;
            saveData();
        }
        if((playData.settings[0]==0 && (myKeyCode>=65 && myKeyCode<=90 || myKeyCode==189)) || (playData.settings[0] == 1 && (myKeyCode!=27 && myKeyCode!=16))){//文字入力
            if(battleStatus==2){//入力受理中なら
                //ローマ字なら最適化を実施する
                battleResult.totalStroke++;
                //ここから応急バッチ　かな入力で「ろ」と「ー」が一部反応しない
                if(playData.settings[0] == 1){
                    if(myKeyCode==165 || myKeyCode==124 || myKeyCode==220 || myKeyCode==229) myKey="¥";
                    if(myKeyCode==95) myKey="_";
                }
                //
                if((playData.settings[0]==0 && checkOpt(battleResult.wordSet[battleResult.now].myText,typedText + myKey,playData.settings[1]).isMiss==0) ||(playData.settings[0]==1 && checkKana(battleResult.wordSet[battleResult.now].myText,typedText + keyToKana(myKey,e.shiftKey)).isMiss==0)){
                    let efX,efY=402;
                    ctx2d.font="13pt " + TYPING_FONTNAME;
                    if(playData.settings[0] && ctx2d.measureText(battleResult.wordSet[battleResult.now].myText).width>WIDTH*1.2/3){
                        ctx2d.font="10pt " + TYPING_FONTNAME;
                    }            
                    if(enemyAvatorData.style == 0){
                        efX=ctx2d.measureText(typedText).width+330-ctx2d.measureText(battleResult.wordSet[battleResult.now].myText).width/2;
                    } else if(enemyAvatorData.style == 1){
                        efX=ctx2d.measureText(typedText).width+330-ctx2d.measureText(battleResult.wordSet[battleResult.now].myText).width/2;
                    }
                    typingEffect.push({x:efX-5,y:efY-3,col:Math.floor(avatorData[playData.settings[0]].star/5),ani:0});
                    playSE("typing1");
                    battleResult.myTypeData.push({time:Math.floor(t-battleResult.startTime-totalLossTime),key:myKey,shiftKey:e.shiftKey,isMiss:0,isFirst:(typedText.length==0)});
                    //受理可能な時の処理
                    battleResult.wordSet[battleResult.now].myText = checkOpt(battleResult.wordSet[battleResult.now].myText,typedText + myKey,playData.settings[1]).newTargetStr;
                    if(playData.settings[0] == 0){
                        typedText+=myKey;
                    } else{
                        typedText+=keyToKana(myKey,e.shiftKey);
                    }
                } else{
                    playSE("miss");
                    battleResult.myTypeData.push({time:(t-battleResult.startTime-totalLossTime),key:myKey,shiftKey:e.shiftKey,isMiss:1,isFirst:(typedText.length==0)});
                    //ミスの時の処理
                    battleResult.totalMiss++;
                    missAni=t;
                    missChar=typedText.length;
                }
            }
        }
    } else if(sceneAni==0){//ショートカットキーの場合　シーンごとに分岐→キーを判断
        if(msgBox.length){//メッセージボックス表示中
            if(scene==2 && msgBox[0].selectBattleAvatorWindow){//相手の選択ウィンドウ
                if(myKey=="b") clickX=WIDTH/2+130,clickY=HEIGHT/2+135;
                if(myKey=="c") clickX=WIDTH/2,clickY=HEIGHT/2+145;
                if(myKey=="f") clickX=WIDTH/2-197+(selectBattleAvatorClass-1)*48+20,clickY=HEIGHT/2-152;
                if(myKey=="j") clickX=WIDTH/2-197+(selectBattleAvatorClass+1)*48+20,clickY=HEIGHT/2-152;
                if(myKey=="i") clickX=WIDTH/2-25-(selectBattleAvator-1)*9+15,clickY=HEIGHT/2-78+(selectBattleAvator-1)*30+10;
                if(myKey=="m") clickX=WIDTH/2-25-(selectBattleAvator+1)*9+15,clickY=HEIGHT/2-78+(selectBattleAvator+1)*30+10;
                if(myKey=="I") playData.settings[0]=1-playData.settings[0],saveData(),playSE("enter");
            } else if(msgBox[0].levelUpWindow){//レベルアップ
                if(myKey=="o"  || myKeyCode==13 || myKeyCode==32) clickX=WIDTH/2-10,clickY=HEIGHT/2+140;
            } else if(msgBox[0].starUpWindow){//スターアップ
                if(myKey=="o"  || myKeyCode==13 || myKeyCode==32) clickX=WIDTH/2+180,clickY=HEIGHT/2+55;
            } else if(msgBox[0].missionClearWindow){//ミッションクリア
                if(myKey=="o"  || myKeyCode==13 || myKeyCode==32) clickX=WIDTH/2+180,clickY=HEIGHT/2+55;
            } else if(msgBox[0].firstWinWindow){//初勝利
                if(myKey=="o"  || myKeyCode==13 || myKeyCode==32) clickX=WIDTH/2+180,clickY=HEIGHT/2+55;
            } else if(msgBox[0].refreshEventWindow){
                if(myKeyCode==13 || myKeyCode==32) clickX=WIDTH/2+250,clickY=HEIGHT/2-168;
            }else if(msgBox[0].btns2!=undefined) {//ニ択のメッセージボックス
                if(myKey==String(msgBox[0].btns1.text.substr(0,1)).toLowerCase())  clickX=WIDTH/2-60,clickY=HEIGHT/2+40;
                if(myKey==String(msgBox[0].btns2.text.substr(0,1)).toLowerCase()) clickX=WIDTH/2+60,clickY=HEIGHT/2+40;
            } else if(msgBox[0].btns1!=undefined){
                if(myKey==String(msgBox[0].btns1.text.substr(0,1)).toLowerCase() || myKeyCode==13 || myKeyCode==32)  clickX=WIDTH/2,clickY=HEIGHT/2+40;
            }
        }  else if(scene==1){
            if(myKey=="s" || myKeyCode==13 || myKeyCode==32) clickX=WIDTH/2,clickY=HEIGHT/2+90;

        }else if(scene==2){//メニュー
            if(myKey=="b") clickX=250,clickY=200;
            if(myKey=="o") clickX=650,clickY=150;
            if(myKey=="s") clickX=650,clickY=250;
            if(myKey=="a") clickX=250,clickY=400;
            if(myKey=="t" || myKeyCode==27|| myKey=="Q") saveData(),playSE("enter"),nextScene=1,sceneAni=t;
            if(myKey=="h") clickX=WIDTH-75,clickY=75;
            if(myKey=="I") playData.settings[0]=1-playData.settings[0],saveData(),playSE("enter");
        } else if(scene==4){ //結果
            if(myKey=="t") clickX=460,clickY=120;
            if(myKey=="c") clickX=525,clickY=120;
            if(myKey=="s") clickX=570,clickY=120;
            if(myKey=="r") clickX=720,clickY=HEIGHT-130;    
            if(myKey=="b") clickX=700,clickY=HEIGHT-60;    
        } else if(scene==5){//アバターきせかえ
            if(myKey=="b") clickX=700,clickY=HEIGHT-60;
        } else if(scene==6){//アバターダウンロード
            if(myKey=="b") clickX=760,clickY=HEIGHT-90;
        }else if(scene==7){//設定
            if(myKey=="c") clickX=800,clickY=HEIGHT-90;
            if(myKey=="s") clickX=630,clickY=HEIGHT-90;
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
        if(e.keyCode==32) e.preventDefault();
        processKeypress(e.key,e.keyCode,e);
    });
    document.getElementById("uploadFile").addEventListener("change",function(e){
        if(scene!=1){
            window.alert("データを読み込む前に、タイトル画面に戻ってください。");
            return 0;
        } 
        if(window.confirm("データをアップロードすると、現在の全てのデータが上書きされます。現在のデータを残したい場合は先にバックアップを取ることをおすすめします。\n本当にデータを読み込みますか？")){
                var file = e.target.files;
                var reader = new FileReader();
                reader.readAsText(file[0]);
                reader.onload=function(e2){
                let readtxt=reader.result;
                try{
                    readtxt=decodeURIComponent(escape(atob(readtxt)));
                } catch(er){
                    window.alert("形式にエラーがあります。正常に上書き出来ませんでした。");
                    return 0;
                }
                //チェック処理
                let readResult = setlocalStorageString(readtxt);
                if(readResult==0){
                    window.alert("正常に上書きが完了しました。");
                } else{
                    window.alert("形式にエラーがあります。正常に上書き出来ませんでした。");
                }
            } 
        }else{
            window.alert("データの読み込みをキャンセルしました。");
        }
    })
    document.getElementById("downloadFile").addEventListener("click",function(e){
        loadData();
        var plaintxt=getlocalStorageString();
        plaintxt=btoa(unescape(encodeURIComponent(plaintxt)));
        var blob = new Blob([plaintxt],{"type":"text/plain"});
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.download='AVATYPE_DATA.ava';
        a.href=url;
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    })
});
function drawMouseCursor(){ //マウスカーソルを描画する関数
    ctx2d2.strokeStyle=getRGBA(1,600,t);
    if(mouseStatus) ctx2d2.strokeStyle=getRGBA(3,600,t);
    ctx2d2.fillStyle=getRGBA(2,0,0.5);
    ctx2d2.beginPath();
    ctx2d2.lineWidth=3;
    ctx2d2.arc(mouseX,mouseY,10,0,Math.PI*2);
    ctx2d2.stroke();
    ctx2d2.fill();
}
function refreshWord(startFlg){
    typedText="";
    enemyTypedText="";
    battleResult.now++;
    enemyTypingCharNum=0;
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
    if(drawPrl.trans<0) drawPrl.trans=Math.min(-0.01,Math.max(-1,-(t-msgBox[0].ani)/200));
    if(msgBox.length) {
        if(msgBox[0].flg==2 && drawPrl.trans<0) drawPrl.trans=Math.min(-0.01,Math.max(-1,-1+(t-msgBox[0].ani)/200));
    }
    var drawGrad=ctx2d.createLinearGradient(drawPrl.x2,drawPrl.y1,drawPrl.x1,drawPrl.y2);
    const PRL_COLSET=[[[213,213,223,1],[141,141,151,1],[230,230,235,1]], //灰色用
            [[165,163,168,1],[125,123,128,1],[175,173,178,1]], //灰色ホバー用
            [[175,173,188,1.2],[125,123,138,1.2],[185,183,208,1.2],[135,133,148,1.2]],//透けにくい灰色(メッセージボックス用) アニメーション対応済み
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
            [[200,200,220,1.2],[60,60,80,1.3],[230,230,240,1]],//画面のタイトル用 14
            [[255,255,255,0.9],[255,255,255,1],[223,223,223,0.9]],//battleCircleの背景　15
            [[100,120,80,1],[120,130,140,1],[120,180,150,1]],//青緑 16
            [[180,220,220,1],[130,170,170,1],[80,120,120,1]],//ローマ字　17
            [[220,180,220,1],[170,130,170,1],[120,80,120,1]],//カナ　18
        ];
    const FRAME_COLSET=[[20,20,20,0.8],[0,0,0,0.8],[20,23,20,0.8],[40,20,5,0.8],[40,20,5,0.8],
                        [20,23,20,0],[20,23,20,0.8],[20,20,20,0.8],[20,20,20,0.8],[20,20,20,0.8],[20,20,20,0.8],[0,0,0,1],[0,0,0,1],[0,0,0,1],[0,0,0,1],[100,0,0,1],[0,0,0,1],[0,0,0,1],[0,0,0,1]];
    const TEXT_COLSET=[[0,0,0],[0,0,0],[0,0,0],[255,255,255],[255,255,255],
                        [255,255,255],[255,255,255],[255,255,255],[255,255,255],[255,255,255],[255,255,255],[255,255,255],[0,0,0],[255,255,255],[255,255,255],[255,255,255],[255,255,255],[0,0,0],[0,0,0]];
    for(var i = 0;i < 3;i++){
        drawGrad.addColorStop(i/2+0.1*(i==1),'rgba(' + 
         (PRL_COLSET[drawPrl.hoverColSet][i][0]*drawPrl.hoverCounter+PRL_COLSET[drawPrl.colSet][i][0]*(10-drawPrl.hoverCounter))/10 + ',' +  
         (PRL_COLSET[drawPrl.hoverColSet][i][1]*drawPrl.hoverCounter+PRL_COLSET[drawPrl.colSet][i][1]*(10-drawPrl.hoverCounter))/10 + ',' +  
         (PRL_COLSET[drawPrl.hoverColSet][i][2]*drawPrl.hoverCounter+PRL_COLSET[drawPrl.colSet][i][2]*(10-drawPrl.hoverCounter))/10+ ',' + PRL_COLSET[drawPrl.hoverColSet][i][3]*Math.abs(drawPrl.trans * 0.7) + ")")
    }
    if(drawPrl.gradAni!=undefined){//背景のアニメーション
        if(Math.floor(drawPrl.gradAni/500) % 3 == 0){
            drawGrad.addColorStop(1-(drawPrl.gradAni/500-Math.floor(drawPrl.gradAni/500)),'rgba(' + 
            (PRL_COLSET[drawPrl.hoverColSet][3][0]*drawPrl.hoverCounter+PRL_COLSET[drawPrl.colSet][3][0]*(10-drawPrl.hoverCounter))/10 + ',' +  
            (PRL_COLSET[drawPrl.hoverColSet][3][1]*drawPrl.hoverCounter+PRL_COLSET[drawPrl.colSet][3][1]*(10-drawPrl.hoverCounter))/10 + ',' +  
            (PRL_COLSET[drawPrl.hoverColSet][3][2]*drawPrl.hoverCounter+PRL_COLSET[drawPrl.colSet][3][2]*(10-drawPrl.hoverCounter))/10+ ',' + PRL_COLSET[drawPrl.hoverColSet][3][3]*Math.abs(drawPrl.trans * 0.7) + ")")   
        }
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
        }
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
function drawImgToMainCanvas(){
    //メインキャンバスに結果画面の円と画像を描く関数
    ctx2d.drawImage(backImg[3],0,0,WIDTH,HEIGHT);//負けたら4
    drawLoadingCircle(300,300,250,t*0.4,1000,1,1);
    drawLoadingCircle(800,400,120,t*-0.8,1000,1,1);
}
function getDayText(){
    //現在の日付を表す文字列を返す
    let myDate = new Date();
return  myDate.getFullYear()+
        ('00' + (Number(myDate.getMonth())+1)).slice(-2) +
        ('00'  + myDate.getDate()).slice(-2) + "_"+
        ('00' + myDate.getHours()).slice(-2) +
        ('00' + myDate.getMinutes()).slice(-2);
}
function setDeleteWindowButton(){
    //削除ウィンドウのボタンの色をセットする
    for(let i = 0;i<prls.length;i++){
        if(prls[i].id >=100 && prls[i].id<=102){
            //タブのボタンなら
            if(prls[i].id-100 == deleteClass){
                prls[i].colSet = 1;
                prls[i].hoverColSet=1;
            } else {
                prls[i].colSet = 0;
                prls[i].hoverColSet=1;
            }
        } else if(prls[i].id >= 110 && prls[i].id <= 115){
            //削除ボタンなら
            if(localAvator[deleteClass+2].length > prls[i].id-110){
                prls[i].colSet = 0;
                prls[i].hoverColSet=1;
                prls[i].noDestruct=0;
            } else{
                prls[i].colSet = 13;
                prls[i].hoverColSet=13;
                prls[i].noDestruct=1;
            }
        }
    }
}
function drawFlash(){//フラッシュ演出 スターアップのみ
    if(msgBox.length==0) return 0;
    if(msgBox[0].starUpWindow && msgBox[0].flg==1 && 1-Math.min(1,(t-msgBox[0].ani)/1000)!=0){
        ctx2d.fillStyle=getRGBA(2,0,1-Math.min(1,(t-msgBox[0].ani)/1000));
        ctx2d.fillRect(0,0,WIDTH,HEIGHT);
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
                                btns2:{text:"CANCEL",sound:"cancel",onClick:function(){msgBox.push({
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
                prls.push({isMsgBox:1,x1:WIDTH/2+50,y1:HEIGHT/2+112,x2:WIDTH/2+205,y2:HEIGHT/2+162,shadow:0,colSet:3,textSize:0.9,hoverColSet:4,hoverCounter:0,noDestruct:1,lineWidth:8,sound:"battle",text:"BATTLE!",trans:-1,onClick:function(){
                    if(localAvator[selectBattleAvatorClass].length > selectBattleAvator){
                        for(let i = 0;i < prls.length;i++){
                            if(prls[i].text=="BATTLE!" && prls[i].colSet==3) prls[i].colSet=13,prls[i].hoverColSet=13;
                        }
                        sceneAni=t;
                        nextScene=3;////バトル開始ボタン　敵データのセットなどをここにおく
                        battleAni=t;//バトル開始時のアニメーション
                        setTimeout(function(){
                            if(scene==3) playSE("battleStart");
                        },500);
                        playSE("battleStart");
                    } else{
                        //敵を選択していないのにバトルを押した時　効果音などをここに入れる
                    }
                }});
                prls.push({isMsgBox:1,x1:WIDTH/2-50,y1:HEIGHT/2+132,x2:WIDTH/2+45,y2:HEIGHT/2+162,shadow:0,colSet:13,textSize:0.9,hoverColSet:14,hoverCounter:0,lineWidth:2,text:"CANCEL",sound:"cancel",trans:-1,onClick:function(){}});
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
                        setAvatorSelectButton(localAvator);
                    }});
                }
                setAvatorSelectButton(localAvator);
                prls.push({isMsgBox:1,x1:WIDTH/2+130,y1:HEIGHT/2-162,x2:WIDTH/2+288,y2:HEIGHT/2-130,shadow:0,colSet:0,textSize:0.9,hoverColSet:1,lineWidth:4,hoverCounter:0,sound:"enter",text:"オンラインアバター",trans:-1,onClick:function(){
                    sceneAni=t;
                    nextScene=6;
                }});
                prls.push({isMsgBox:1,x1:WIDTH/2-274,y1:HEIGHT/2-117,x2:WIDTH/2+28,y2:HEIGHT/2+100,shadow:0,colSet:14,textSize:0.9,hoverColSet:14,lineWidth:2,noDestruct:1,hoverCounter:0,text:"",trans:-1});
                prls.push({isMsgBox:1,x1:WIDTH/2-28,y1:HEIGHT/2-117,x2:WIDTH/2+275,y2:HEIGHT/2+100,shadow:0,colSet:0,textSize:0.9,hoverColSet:0,lineWidth:4,noDestruct:1,hoverCounter:0,text:"",trans:-1});
                for(let i = 0;i < 6;i++){
                    prls.push({isMsgBox:1,x1:WIDTH/2-25-i*9,y1:HEIGHT/2-78+i*30,x2:WIDTH/2+10-i*9,y2:HEIGHT/2-58+i*30,id:i+10,shadow:0,colSet:0+3*(i == selectBattleAvator),noDestruct:1,textSize:1.1,hoverColSet:1+3*(i == selectBattleAvator),hoverCounter:0,lineWidth:3,text:"選択",trans:-1,onClick:function(){
                        if(localAvator[selectBattleAvatorClass].length<=i) return 0;
                        selectBattleAvator=i;
                        setAvatorSelectButton(localAvator);
                    }});
                    ctx2d.fillText("- - -",WIDTH/2-190-i*9,HEIGHT/2-65+i*30);
                }
                setAvatorSelectButton(localAvator);
                setLADBattleSaveData();
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
                                    document.getElementById("nameBoxCreate").style.display="none";nextScene=2,sceneAni=t;
                                }},
                                btns2:{text:"CANCEL",suond:"cancel",onClick:function(){ //アバター作成の初期ウィンドウを表示
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
            ctx2d.font="8pt " + JAPANESE_FONTNAME;
            ctx2d.fillText("※後から変更可能",WIDTH/2-253.5,HEIGHT/2+35);
            ctx2d.fillText("好きな色を選ぼう！",WIDTH/2-268.5,HEIGHT/2+90);
            drawPrl({x1:WIDTH/2+13,y1:HEIGHT/2-130,x2:WIDTH/2+300,y2:HEIGHT/2+63,colSet:13,hoverColSet:13,shadow:0,hoverCounter:0,text:"",trans:myAni*1.1,onClick:function(){return 0}})
            drawAvator(avatorData[0],WIDTH/2+58,HEIGHT/2-128,WIDTH/2+255,HEIGHT/2+55,t,myAni);
        } else if(msgBox[0].levelUpWindow){//レベルアップウィンドウ
            if(msgBox[0].flg!=1 && msgBox[0].flg!=2){//ボタンをprlsへプッシュする
                prls.push({isMsgBox:1,x1:WIDTH/2-110,y1:HEIGHT/2+122,x2:WIDTH/2+45,y2:HEIGHT/2+162,shadow:0,colSet:3,textSize:0.9,hoverColSet:4,hoverCounter:0,lineWidth:8,text:"OK!",trans:-1,onClick:function(){}});
                msgBox[0].flg=1;
            }
            drawPrl({x1:WIDTH/2-66,y1:HEIGHT/2-210,x2:WIDTH/2+110,y2:HEIGHT/2-175,colSet:3,hoverColSet:3,hoverCounter:0,text:"レベルアップ！",trans:myAni*1.1})
            drawPrl({x1:WIDTH/2-170,y1:HEIGHT/2-170,x2:WIDTH/2+190,y2:HEIGHT/2+170,colSet:2,hoverColSet:2,hoverCounter:0,text:"",trans:myAni*1.1,onClick:function(){return 0}})
            drawPrl({x1:WIDTH/2-113,y1:HEIGHT/2-162,x2:WIDTH/2+177,y2:HEIGHT/2+8,shadow:0,colSet:13,hoverColSet:13,hoverCounter:0,text:"",trans:myAni*1.1,onClick:function(){return 0}})
            ctx2d.fillStyle=getRGBA(0,0,myAni);
            ctx2d.font="16pt "+MAIN_FONTNAME;
            ctx2d.fillText(playData.level-1,WIDTH/2-80,HEIGHT/2+45);
            ctx2d.fillText(">",WIDTH/2-20,HEIGHT/2+45);
            ctx2d.fillStyle=getRGBA(12,0,myAni);
            ctx2d.fillText(playData.level,WIDTH/2+20,HEIGHT/2+45);
            ctx2d.fillStyle=getRGBA(0,0,myAni);
            ctx2d.font="12pt "+JAPANESE_FONTNAME;
            let levelUpMsgText=avatorData[0].name + "のレベルが" + playData.level + "に上がった！";
            if(levelUpMsgText.length > Math.floor((t-resultAni)/70)) levelUpMsgText=levelUpMsgText.substr(0,Math.floor((t-resultAni)/70)-1) + CHARA_SET[Math.floor(Math.random()*CHARA_SET.length)];
            levelUpMsgText=levelUpMsgText.substr(0,Math.min(levelUpMsgText.length,Math.floor((t-resultAni)/70)))
            ctx2d.fillText(levelUpMsgText.substr(0,12),-10+(WIDTH-ctx2d.measureText(levelUpMsgText.substr(0,13)).width)/2,HEIGHT/2+72);
            ctx2d.fillText(levelUpMsgText.substr(12,12),-10+(WIDTH-ctx2d.measureText(levelUpMsgText.substr(0,13)).width)/2,HEIGHT/2+95);
            drawAvator(avatorData[0],WIDTH/2-95+28,HEIGHT/2-155,WIDTH/2+113,HEIGHT/2+10,1,myAni*1.1);
            ctx2d.drawImage(arrowImg,WIDTH/2+73,HEIGHT/2+23 - (8)*Math.max(0,Math.sin(t/150)*3-2.7),25,25);
        } else if(msgBox[0].starUpWindow){//スターアップウィンドウ
            if(msgBox[0].flg!=1 && msgBox[0].flg!=2){//ボタンをprlsへプッシュする
                prls.push({isMsgBox:1,x1:WIDTH/2+100,y1:HEIGHT/2+40,x2:WIDTH/2+232,y2:HEIGHT/2+70,shadow:0,colSet:3,textSize:0.9,hoverColSet:4,hoverCounter:0,lineWidth:8,text:"OK!",trans:-1,onClick:function(){}});
                msgBox[0].flg=1;
            }
            drawPrl({x1:WIDTH/2-230,y1:HEIGHT/2-120,x2:WIDTH/2-10,y2:HEIGHT/2-85,colSet:3,hoverColSet:3,hoverCounter:0,text:"スターランクアップ！",trans:myAni*1.1})
            drawPrl({x1:WIDTH/2-280,y1:HEIGHT/2-80,x2:WIDTH/2+280,y2:HEIGHT/2+80,colSet:2,hoverColSet:2,hoverCounter:0,text:"",trans:myAni*1.1})
            drawPrl({x1:WIDTH/2-267,y1:HEIGHT/2-70,x2:WIDTH/2-60,y2:HEIGHT/2+70,shadow:0,colSet:13,hoverColSet:13,hoverCounter:0,text:"",trans:myAni*1.1})
            ctx2d.fillStyle=getRGBA(0,0,myAni);
            ctx2d.font="13pt "+JAPANESE_FONTNAME;
            let starUpMsgText=avatorData[0].name + "のスターランクがアップした！";
            if(starUpMsgText.length > Math.floor((t-resultAni)/50)) starUpMsgText=starUpMsgText.substr(0,Math.floor((t-resultAni)/50)-1) + CHARA_SET[Math.floor(Math.random()*CHARA_SET.length)];
            levelUpMsgText=starUpMsgText.substr(0,Math.min(starUpMsgText.length,Math.floor((t-resultAni)/50)))
            ctx2d.fillText(starUpMsgText.substr(0,16),55+(WIDTH-ctx2d.measureText("のスターランクがアップした！").width)/2,HEIGHT/2+10);
            ctx2d.fillText(starUpMsgText.substr(16,16),55+(WIDTH-ctx2d.measureText("のスターランクがアップした！").width)/2,HEIGHT/2+35);
            drawAvator(avatorData[0],WIDTH/2-250,HEIGHT/2-75,WIDTH/2-90,HEIGHT/2+75,1,myAni*1.1);
            drawPrl({x1:WIDTH/2-65,y1:HEIGHT/2-70,x2:WIDTH/2+263,y2:HEIGHT/2-15,colSet:13,hoverColSet:16,shadow:0,hoverCounter:0,text:"",trans:myAni*1.1})
            let starUpSize = Math.max(45,350-(Math.max(0,t-msgBox[0].ani-500))/1.1);
            if(myAni > 0.8 && starUpSize<200) drawStar(avatorData[0],WIDTH/2-45+22.5-starUpSize*5/2+45*3.95/2,HEIGHT/2-65+22.5-starUpSize/2,starUpSize);
            ctx2d.drawImage(arrowImg,WIDTH/2+213,HEIGHT/2-55 - (8)*Math.max(0,Math.sin(t/150)*3-2.7),25,25);
        } else if(msgBox[0].missionClearWindow){//ミッションクリアウィンドウ
            let realRatio=Math.max(0,Math.min(1,(t-resultAni-200)/1200))
            let realRatioCoin=Math.max(0,Math.min(1,(t-resultAni-1200)/1200))
            if(msgBox[0].flg!=1 && msgBox[0].flg!=2){//ボタンをprlsへプッシュする
                prls.push({isMsgBox:1,x1:WIDTH/2+100,y1:HEIGHT/2+40,x2:WIDTH/2+232,y2:HEIGHT/2+70,shadow:0,colSet:3,textSize:0.9,hoverColSet:4,hoverCounter:0,lineWidth:8,text:"OK!",trans:-1,onClick:function(){}});
                msgBox[0].flg=1;
            }
            drawPrl({x1:WIDTH/2-230,y1:HEIGHT/2-120,x2:WIDTH/2-10,y2:HEIGHT/2-85,colSet:3,hoverColSet:3,hoverCounter:0,text:"ミッションクリア！",trans:myAni*1.1})
            drawPrl({x1:WIDTH/2-280,y1:HEIGHT/2-80,x2:WIDTH/2+280,y2:HEIGHT/2+80,colSet:2,hoverColSet:2,hoverCounter:0,text:"",trans:myAni*1.1})
            ctx2d.fillStyle=getRGBA(0,0,myAni);
            ctx2d.font="12pt "+JAPANESE_FONTNAME;
            let starUpMsgText="デイリーミッション「" + getMissionText(dailyMission.detail[msgBox[0].missionNum]) +"」クリア！";
            if(starUpMsgText.length > Math.floor((t-resultAni)/50)) starUpMsgText=starUpMsgText.substr(0,Math.floor((t-resultAni)/50)-1) + CHARA_SET[Math.floor(Math.random()*CHARA_SET.length)];
            levelUpMsgText=starUpMsgText.substr(0,Math.min(starUpMsgText.length,Math.floor((t-resultAni)/50)))
            if(("デイリーミッション「" + getMissionText(dailyMission.detail[msgBox[0].missionNum]) +"」クリア！").length>31){
                ctx2d.fillText(starUpMsgText.substr(0,31),-225+(WIDTH)/2,HEIGHT/2-12);
                ctx2d.fillText(starUpMsgText.substr(31,31),-225+(WIDTH)/2,HEIGHT/2+15);
            }else{
                ctx2d.fillText(starUpMsgText.substr(0,31),-225+(WIDTH)/2,HEIGHT/2+1.5);
            }
            if(realRatioCoin){
                ctx2d.fillText("獲得コイン " + Math.floor(realRatioCoin*dailyMission.detail[msgBox[0].missionNum].achieve )+ "ゴールド",-210+(WIDTH/2),HEIGHT/2+55);
            } else{
                ctx2d.fillText("獲得コイン ",-210+(WIDTH/2),HEIGHT/2+55);
            }
            ctx2d.drawImage(coinImg,WIDTH/2-248,HEIGHT/2+30,38,38);
            ctx2d.fillStyle=getRGBA(0,0,1);
            ctx2d.font="10pt "+JAPANESE_FONTNAME;
            ctx2d.fillText(Math.floor(dailyMission.detail[msgBox[0].missionNum].progress*realRatio),-ctx2d.measureText("9999").width-190+WIDTH/2,HEIGHT/2-47);
            ctx2d.fillText("/",-183+WIDTH/2,HEIGHT/2-47);
            ctx2d.fillText(dailyMission.detail[msgBox[0].missionNum].max,-170+WIDTH/2,HEIGHT/2-47);
            drawPrl({x1:WIDTH/2-120,y1:HEIGHT/2-55,x2:WIDTH/2-120+375,y2:HEIGHT/2-50,shadow:0,lineWidth:2,colSet:13,hoverColSet:13,hoverCounter:0,text:"",trans:myAni*1.1})
            drawPrl({x1:WIDTH/2-120,y1:HEIGHT/2-55,x2:WIDTH/2-120+realRatio*375,y2:HEIGHT/2-50,shadow:0,lineWidth:2,colSet:5,hoverColSet:5,hoverCounter:0,text:"",trans:myAni*1.1})
        }else if(msgBox[0].itemGetWindow){//アイテムゲットウィンドウ
            if(msgBox[0].flg!=1 && msgBox[0].flg!=2){//ボタンをprlsへプッシュする
                prls.push({isMsgBox:1,x1:WIDTH/2-204,y1:HEIGHT/2+50,x2:WIDTH/2-128,y2:HEIGHT/2+70,shadow:0,colSet:3,textSize:0.9,hoverColSet:4,hoverCounter:0,lineWidth:2,text:"YES",trans:-1,onClick:function(){
                    avatorData[0].item = avatorData[1].item;
                    for(let i = 0;i < 10;i++){//装備中のアイテムの装備を外す
                        if(playData.item[msgBox[0].itemClass][i] == 1)playData.item[msgBox[0].itemClass][i]=3;
                    }
                    playData.item[msgBox[0].itemClass][msgBox[0].itemNum] = 1;//新しいものを装備
                    msgBox.push({
                        text:ITEM_DATA[msgBox[0].itemClass][msgBox[0].itemNum][0]+"を装備しました！",
                        ani:t,
                        btns1:{text:"OK",onClick:function(){}}});
                    saveData();
                }});
                prls.push({isMsgBox:1,x1:WIDTH/2+68-160,y1:HEIGHT/2+50,x2:WIDTH/2-6,y2:HEIGHT/2+70,shadow:0,colSet:13,textSize:0.9,hoverColSet:14,hoverCounter:0,lineWidth:2,text:"NO",trans:-1,onClick:function(){
                    avatorData[1].item = avatorData[0].item;
                    msgBox.push({
                        text:"アバター画面からいつでも装備することができます。",
                        ani:t,
                        btns1:{text:"OK",onClick:function(){}}});
                    saveData();
                }});
                msgBox[0].flg=1;
            }
            drawPrl({x1:WIDTH/2-230,y1:HEIGHT/2-120,x2:WIDTH/2-10,y2:HEIGHT/2-85,colSet:3,hoverColSet:3,hoverCounter:0,text:"アイテム獲得！",trans:myAni*1.1})
            drawPrl({x1:WIDTH/2-280,y1:HEIGHT/2-80,x2:WIDTH/2+280,y2:HEIGHT/2+80,colSet:2,hoverColSet:2,hoverCounter:0,text:"",trans:myAni*1.1})
            drawPrl({x1:WIDTH/2+55,y1:HEIGHT/2-73,x2:WIDTH/2+270,y2:HEIGHT/2+69,colSet:13,shadow:0,hoverColSet:13,hoverCounter:0,text:"",lineWidth:3,trans:myAni*1.1})
            drawPrl({x1:WIDTH/2-254,y1:HEIGHT/2-15,x2:WIDTH/2+64,y2:HEIGHT/2+35,colSet:12,shadow:0,hoverColSet:12,hoverCounter:0,text:"",lineWidth:1,trans:myAni*1.1})
            drawAvator(avatorData[1],WIDTH/2+85,HEIGHT/2-70,WIDTH/2+245,HEIGHT/2+70,t,1);
            ctx2d.fillStyle=getRGBA(0,0,myAni);
            ctx2d.font="12pt "+JAPANESE_FONTNAME;
            let itemGetText="アイテム「" + ITEM_DATA[msgBox[0].itemClass][msgBox[0].itemNum][0] +"」を獲得！";
            if(itemGetText.length > Math.floor((t-resultAni)/50)) itemGetText=itemGetText.substr(0,Math.floor((t-resultAni)/50)-1) + CHARA_SET[Math.floor(Math.random()*CHARA_SET.length)];
            itemGetText=itemGetText.substr(0,Math.min(itemGetText.length,Math.floor((t-resultAni)/50)))
            ctx2d.fillText(itemGetText,-225+(WIDTH)/2,HEIGHT/2+1.5-55);
            ctx2d.fillText("今すぐ装備しますか？",-225+(WIDTH)/2,HEIGHT/2+1.5-31);
            ctx2d.font="9pt "+JAPANESE_FONTNAME;
            let itemGetExp = "効果：" + ITEM_DATA[msgBox[0].itemClass][msgBox[0].itemNum][2].replace("*",ITEM_DATA[msgBox[0].itemClass][msgBox[0].itemNum][3][0]);
            ctx2d.fillText(itemGetExp.substr(0,24),-239+(WIDTH)/2,HEIGHT/2+5);
            ctx2d.fillText(itemGetExp.substr(24,24),-239+(WIDTH)/2,HEIGHT/2+22);
            
        } else if(msgBox[0].firstWinWindow){//初回勝利ウィンドウ
            if(msgBox[0].flg!=1 && msgBox[0].flg!=2){//ボタンをprlsへプッシュする
                prls.push({isMsgBox:1,x1:WIDTH/2+100,y1:HEIGHT/2+40,x2:WIDTH/2+232,y2:HEIGHT/2+70,shadow:0,colSet:3,textSize:0.9,hoverColSet:4,hoverCounter:0,lineWidth:8,text:"OK!",trans:-1,onClick:function(){}});
                msgBox[0].flg=1;
            }
            drawPrl({x1:WIDTH/2-230,y1:HEIGHT/2-120,x2:WIDTH/2-10,y2:HEIGHT/2-85,colSet:3,hoverColSet:3,hoverCounter:0,text:"初勝利！",trans:myAni*1.1})
            drawPrl({x1:WIDTH/2-280,y1:HEIGHT/2-80,x2:WIDTH/2+280,y2:HEIGHT/2+80,colSet:2,hoverColSet:2,hoverCounter:0,text:"",trans:myAni*1.1})
            drawPrl({x1:WIDTH/2-267,y1:HEIGHT/2-70,x2:WIDTH/2-60,y2:HEIGHT/2+70,shadow:0,colSet:13,hoverColSet:13,hoverCounter:0,text:"",trans:myAni*1.1})
            ctx2d.fillStyle=getRGBA(0,0,myAni);
            ctx2d.font="13pt "+JAPANESE_FONTNAME;
            let firstWinTxt=enemyAvatorData.name + "に初勝利した！　４コインを獲得！";
            if(firstWinTxt.length > Math.floor((t-resultAni)/50)) firstWinTxt=firstWinTxt.substr(0,Math.floor((t-resultAni)/50)-1) + CHARA_SET[Math.floor(Math.random()*CHARA_SET.length)];
            levelUpMsgText=firstWinTxt.substr(0,Math.min(firstWinTxt.length,Math.floor((t-resultAni)/50)))
            ctx2d.fillText(firstWinTxt.substr(0,14),WIDTH/2-50,HEIGHT/2-40);
            ctx2d.fillText(firstWinTxt.substr(14,14),WIDTH/2-57.5,HEIGHT/2-15);
            ctx2d.fillText("所持コイン " + playData.coin + "ゴールド",WIDTH/2-40,HEIGHT/2+20);
            ctx2d.drawImage(coinImg,WIDTH/2-70,HEIGHT/2+0,30,30);
            if(msgBox[0].pknWin==0){
                ctx2d.drawImage(nWinImg,WIDTH/2+195,HEIGHT/2-60,60,60);
            } else if(msgBox[0].pknWin==1){
                ctx2d.drawImage(kWinImg,WIDTH/2+200,HEIGHT/2-60,60,60);
            } else if(msgBox[0].pknWin==2){
                ctx2d.drawImage(pWinImg,WIDTH/2+200,HEIGHT/2-60,60,60);
            }
            drawAvator(avatorData[0],WIDTH/2-250,HEIGHT/2-70,WIDTH/2-90,HEIGHT/2+80,1,myAni*1.1);
        }else if(msgBox[0].bonusHelpWindow){//ボーナスのヘルプウィンドウ
            if(msgBox[0].flg!=1 && msgBox[0].flg!=2){//ボタンをprlsへプッシュする
                prls.push({isMsgBox:1,x1:WIDTH/2+230,y1:HEIGHT/2-160,x2:WIDTH/2+281,y2:HEIGHT/2-135,shadow:0,colSet:13,textSize:0.9,hoverColSet:11,hoverCounter:0,lineWidth:2,text:"✕",trans:-1,onClick:function(){}});
                msgBox[0].flg=1;
            }
            drawPrl({x1:WIDTH/2-182,y1:HEIGHT/2-200,x2:WIDTH/2+30,y2:HEIGHT/2-165,colSet:1,hoverColSet:2,hoverCounter:0,text:"ボーナス説明",trans:myAni*1.1})
            drawPrl({x1:WIDTH/2-280,y1:HEIGHT/2-160,x2:WIDTH/2+280,y2:HEIGHT/2+160,colSet:2,hoverColSet:2,hoverCounter:0,text:"",trans:myAni*1.1})
            ctx2d.fillStyle=getRGBA(0,0,myAni);
            for(let i = 0;i < 5;i++){
                ctx2d.font="12pt "+JAPANESE_FONTNAME;
                ctx2d.fillText(BONUS_NAME[i],-179+(WIDTH)/2-i*17.4,HEIGHT/2-135+i*58);
                ctx2d.font="9pt "+JAPANESE_FONTNAME;
                if(i!=2){
                    ctx2d.fillText(BONUS_EXP[i].substr(0,35),-159+(WIDTH)/2-(i+0.3)*17.4,HEIGHT/2-135+(i+0.3)*58);
                    ctx2d.fillText(BONUS_EXP[i].substr(35,35),-159+(WIDTH)/2-(i+0.55)*17.4,HEIGHT/2-135+(i+0.55)*58);    
                } else{
                    ctx2d.fillText(BONUS_EXP[i].substr(0,20),-159+(WIDTH)/2-(i+0.3)*17.4,HEIGHT/2-135+(i+0.3)*58);
                    ctx2d.fillText(BONUS_EXP[i].substr(20,20),-159+(WIDTH)/2-(i+0.55)*17.4,HEIGHT/2-135+(i+0.55)*58);    
                }
            }
            ctx2d.font="6pt "+MAIN_FONTNAME;
            ctx2d.fillText("ENEMY",(WIDTH)/2+151,HEIGHT/2-25);
            ctx2d.fillText("YOU",WIDTH/2+41,HEIGHT/2+26);
            for(let i = 0;i < 4;i++){
                for (let j = 0;j < 4;j++){ //j-1が自分のチーム
                    let drawColSet=1;
                    let drawTableText="";
                    if(i==0) {
                        if(j==1) drawColSet=5,drawTableText="R";
                        if(j==2) drawColSet=7,drawTableText="B";
                        if(j==3) drawColSet=9,drawTableText="Y";
                    }else if(j==0){
                        if(i==1) drawColSet=5,drawTableText="R";
                        if(i==2) drawColSet=7,drawTableText="B";
                        if(i==3) drawColSet=9,drawTableText="Y";
                    } else{
                        if(((j-1+6-i+1)% 3) ==2) drawColSet=3,drawTableText="+20%";
                        if(((j-1+6-i+1)% 3) ==1) drawColSet=13,drawTableText="+20%";
                        if(((j-1+6-i+1)% 3) ==0) drawColSet=1,drawTableText="0%";
                    }
                    if(i+j!=0)drawPrl({x1:WIDTH/2+80+ i*35-j*5.7,y1:HEIGHT/2-20+j*19,x2:WIDTH/2+80+i*35+32-j*5.7,y2:HEIGHT/2-20 + j*19+ 15 ,lineWidth:1,shadow:0,isTop:1,trans:myAni,colSet:drawColSet,hoverColSet:drawColSet,hoverCounter:0,textSize:1.2,text:drawTableText});
                }
            }
            drawPrl({x1:WIDTH/2-91,y1:120+1*21,x2:WIDTH/2-91+23,y2:120+1*21+15,lineWidth:1,shadow:0,isTop:1,trans:myAni,colSet:16,hoverColSet:16,hoverCounter:0,textSize:1.2,text:RANK_TEXT[0]});
            drawPrl({x1:WIDTH/2-44,y1:120+1*21,x2:WIDTH/2-44+23,y2:120+1*21+15,lineWidth:1,shadow:0,isTop:1,trans:myAni,colSet:13,hoverColSet:13,hoverCounter:0,textSize:1.2,text:RANK_TEXT[5]});
            drawPrl({x1:WIDTH/2+70,y1:120+1*21,x2:WIDTH/2+70+23,y2:120+1*21+15,lineWidth:1,shadow:0,isTop:1,trans:myAni,colSet:8,hoverColSet:8,hoverCounter:0,textSize:1.2,text:RANK_TEXT[3]});
            drawPrl({x1:WIDTH/2-133,y1:177+1*21,x2:WIDTH/2-133+23,y2:177+1*21+15,lineWidth:1,shadow:0,isTop:1,trans:myAni,colSet:16,hoverColSet:16,hoverCounter:0,textSize:1.2,text:RANK_TEXT[0]});
            drawPrl({x1:WIDTH/2-83,y1:177+1*21,x2:WIDTH/2-83+23,y2:177+1*21+15,lineWidth:1,shadow:0,isTop:1,trans:myAni,colSet:13,hoverColSet:13,hoverCounter:0,textSize:1.2,text:RANK_TEXT[5]});
            drawPrl({x1:WIDTH/2+31,y1:177+1*21,x2:WIDTH/2+31+23,y2:177+1*21+15,lineWidth:1,shadow:0,isTop:1,trans:myAni,colSet:8,hoverColSet:8,hoverCounter:0,textSize:1.2,text:RANK_TEXT[3]});
        } else if(msgBox[0].generalHelpWindow){//メニューのヘルプウィンドウ
            if(msgBox[0].flg!=1 && msgBox[0].flg!=2){//ボタンをprlsへプッシュする
                prls.push({isMsgBox:1,x1:WIDTH/2+230,y1:HEIGHT/2-180,x2:WIDTH/2+281,y2:HEIGHT/2-155,shadow:0,colSet:13,textSize:0.9,hoverColSet:11,hoverCounter:0,lineWidth:2,text:"✕",trans:-1,onClick:function(){}});
                prls.push({isMsgBox:1,x1:WIDTH/2-54-50,y1:HEIGHT/2+150,x2:WIDTH/2-54-10,y2:HEIGHT/2+176,shadow:0,colSet:0,textSize:0.9,hoverColSet:1,hoverCounter:0,lineWidth:2,noDestruct:1,text:"＜",trans:-1,onClick:function(){msgBox[0].currentPage=Math.max(0,msgBox[0].currentPage-1);}});
                prls.push({isMsgBox:1,x1:WIDTH/2-54+60,y1:HEIGHT/2+150,x2:WIDTH/2-54+100,y2:HEIGHT/2+176,shadow:0,colSet:0,textSize:0.9,hoverColSet:1,hoverCounter:0,lineWidth:2,noDestruct:1,text:"＞",trans:-1,onClick:function(){msgBox[0].currentPage=Math.min(2,msgBox[0].currentPage+1);}});
                msgBox[0].flg=1;
            }
            drawPrl({x1:WIDTH/2-280,y1:HEIGHT/2-180,x2:WIDTH/2+280,y2:HEIGHT/2+180,colSet:2,hoverColSet:2,hoverCounter:0,text:"",trans:myAni*1.1})
            if(msgBox[0].currentPage==0){//1ページ目
                drawPrl({x1:WIDTH/2-182,y1:HEIGHT/2-180,x2:WIDTH/2+100,y2:HEIGHT/2-145,shadow:0,lineWidth:1,textSize:1.5,colSet:11,hoverColSet:11,hoverCounter:0,text:"",trans:myAni*1.1})
                drawPrl({x1:WIDTH/2-232,y1:HEIGHT/2+10,x2:WIDTH/2+2,y2:HEIGHT/2+45,shadow:0,lineWidth:1,textSize:1.5,colSet:11,hoverColSet:11,hoverCounter:0,text:"",trans:myAni*1.1})
                drawPrl({x1:WIDTH/2-0,y1:HEIGHT/2+10,x2:WIDTH/2+216,y2:HEIGHT/2+45,shadow:0,lineWidth:1,textSize:1.5,colSet:11,hoverColSet:11,hoverCounter:0,text:"",trans:myAni*1.1})
                ctx2d.fillStyle=getRGBA(2,0,myAni);
                ctx2d.font="15pt "+JAPANESE_FONTNAME;
                ctx2d.fillText("AVA-TYPEについて",312,115);
                ctx2d.fillText("スター",261.5,303);
                ctx2d.fillText("コイン",491.5,303);
                ctx2d.fillStyle=getRGBA(0,0,myAni);
                ctx2d.font="11pt "+JAPANESE_FONTNAME;
                ctx2d.fillText("AVA-TYPEは、その人のタイピングを正",306,145);
                ctx2d.fillText("確に再現した「アバター」と対戦できる",301.5,160);
                ctx2d.fillText("ことが特徴のタイピングゲームです。",297,175);
                drawPrl({x1:263,y1:192,x2:565,y2:HEIGHT/2,shadow:0,lineWidth:3,colSet:2,hoverColSet:2,hoverCounter:0,text:"",trans:myAni*1.1})
                drawPrl({x1:282,y1:192,x2:350,y2:208,shadow:0,lineWidth:3,textSize:1.5,colSet:16,hoverColSet:16,hoverCounter:0,text:"TIPS",trans:myAni*1.1})
                drawPrl({x1:WIDTH/2-259,y1:HEIGHT/2+46,x2:WIDTH/2-10,y2:HEIGHT/2+140,shadow:0,lineWidth:3,colSet:2,hoverColSet:2,hoverCounter:0,text:"",trans:myAni*1.1})
                drawPrl({x1:WIDTH/2-27,y1:HEIGHT/2+46,x2:WIDTH/2+204,y2:HEIGHT/2+140,shadow:0,colSet:2,lineWidth:3,hoverColSet:2,hoverCounter:0,text:"",trans:myAni*1.1})
                ctx2d.font="10pt "+JAPANESE_FONTNAME;
                ctx2d.fillText("アバターはバトルを重ねるごとにレベルアッ",286,225);
                ctx2d.fillText("プしていきます。勝負を重ねて、あなただけ",281.5,240);
                ctx2d.fillText("の最強アバターを作りましょう！",277,255);
                ctx2d.fillText("バトルの回数を重ねる、基準以上",251.5,335);
                ctx2d.fillText("のKPMを記録するなどの一定条件",247,350);
                ctx2d.fillText("を満たすと、称号としてスターが",242.5,365);
                ctx2d.fillText("認定されます。青→緑→黄→赤→？",238,380);
                ctx2d.fillText("と進化していきます。",233.5,394);
                ctx2d.fillText("デイリーミッションをクリアし",481,335);
                ctx2d.fillText("たり敵に初勝利したりするとコ",476.5,350);
                ctx2d.fillText("インを獲得できます。AVATOR",472,365);
                ctx2d.fillText("メニューにあるITEM SHOPでコ",467.5,380);
                ctx2d.fillText("インをアイテムと交換できます。",463,395);

                drawPrl({x1:WIDTH/2+70,y1:HEIGHT/2-145,x2:WIDTH/2+260,y2:HEIGHT/2,shadow:0,colSet:1,hoverColSet:1,hoverCounter:0,text:"",trans:myAni*1.1})
                drawAvator(avatorData[0],WIDTH/2+90,HEIGHT/2-137,WIDTH/2+230,HEIGHT/2,t,myAni);
                if(myAni>=0.7){
                    ctx2d.drawImage(coinImg,543,278,40,40);
                    drawStar(EVENT_ENEMY_DATA[4],330,285,22);
                }
            } else if(msgBox[0].currentPage==1){
                drawPrl({x1:WIDTH/2-182,y1:HEIGHT/2-180,x2:WIDTH/2+150,y2:HEIGHT/2-145,shadow:0,lineWidth:1,textSize:1.5,colSet:11,hoverColSet:11,hoverCounter:0,text:"",trans:myAni*1.1})
                drawPrl({x1:WIDTH/2-232,y1:HEIGHT/2-20,x2:WIDTH/2+100,y2:HEIGHT/2+15,shadow:0,lineWidth:1,textSize:1.5,colSet:11,hoverColSet:11,hoverCounter:0,text:"",trans:myAni*1.1})
                drawPrl({x1:270,y1:182,x2:726,y2:HEIGHT/2-28,shadow:0,lineWidth:3,colSet:2,hoverColSet:2,hoverCounter:0,text:"",trans:myAni*1.1})
                drawPrl({x1:283,y1:182,x2:350,y2:198,shadow:0,lineWidth:3,textSize:1.5,colSet:16,hoverColSet:16,hoverCounter:0,text:"TIPS",trans:myAni*1.1})
                ctx2d.fillStyle=getRGBA(2,0,myAni);
                ctx2d.font="15pt "+JAPANESE_FONTNAME;
                ctx2d.fillText("オンラインアバター",312,115);
                ctx2d.fillText("イベント・デイリーミッション",261.5,273);
                ctx2d.font="10pt "+JAPANESE_FONTNAME;
                ctx2d.fillStyle=getRGBA(0,0,myAni);
                ctx2d.fillText("AVA-TYPEでの総打鍵数が　　　　を超えると、オンライン上に自分の",301,143);
                ctx2d.fillText("アバターデータをアップロードできます！　アバターのタイピングには",296.5,158);
                ctx2d.fillText("あなたの速度や正確性、得意なキー、最適化などが反映されます。",292,173);

                ctx2d.fillText("ローマ字入力とカナ入力のアバターのタイピングデータはそれぞれ",285,216);
                ctx2d.fillText("別々に作成されます。ただし、見た目やスターは共通です。",280.5,231);

                ctx2d.fillText("毎朝5時に、デイリーミッションとイベントが更新されます！　デイリー",253,306);
                ctx2d.fillText("ミッションをクリアすると、大量のコインをゲット可能です。イベント",248.5,321);
                ctx2d.fillText("は以下の5種類で、当日限定の敵アバターも出現します。",244,336);
                ctx2d.font="8pt "+JAPANESE_FONTNAME;
                ctx2d.fillText("火曜日",310,353);
                ctx2d.fillText("水曜日",305.8,367);
                ctx2d.fillText("金曜日",301.6,381);
                ctx2d.fillText("該当チームは経験値ボーナス25%＋一回の勝利につき1ゴールド獲",350.8,360);
                ctx2d.fillText("得！　さらに該当チームに有利なイベントアバター出現確率UP！",346.6,374);
                ctx2d.fillText("土曜日　全チーム、獲得経験値ボーナス20%！",297.4,395);
                ctx2d.fillText("日曜日　全チーム、一回の勝利につき1ゴールドずつ獲得！",293.2,409);
                drawPrl({x1:240,y1:344,x2:300,y2:356,shadow:0,lineWidth:1,textSize:1.5,colSet:5,hoverColSet:16,hoverCounter:0,text:"RED",trans:myAni*1.1})
                drawPrl({x1:235.8,y1:358,x2:295.8,y2:370,shadow:0,lineWidth:1,textSize:1.5,colSet:7,hoverColSet:16,hoverCounter:0,text:"BLUE",trans:myAni*1.1})
                drawPrl({x1:231.6,y1:372,x2:291.6,y2:384,shadow:0,lineWidth:1,textSize:1.5,colSet:9,hoverColSet:16,hoverCounter:0,text:"YELLOW",trans:myAni*1.1})
                drawPrl({x1:227.4,y1:386,x2:287.4,y2:398,shadow:0,lineWidth:1,textSize:1.5,colSet:16,hoverColSet:16,hoverCounter:0,text:"EXP",trans:myAni*1.1})
                drawPrl({x1:223.2,y1:400,x2:283.2,y2:412,shadow:0,lineWidth:1,textSize:1.5,colSet:3,hoverColSet:16,hoverCounter:0,text:"GOLD",trans:myAni*1.1})
                ctx2d.font="10pt "+JAPANESE_FONTNAME;
                ctx2d.fillStyle=getRGBA(8,0,myAni);
                ctx2d.fillText("10000",464.5,143);
            } else if(msgBox[0].currentPage==2){
                drawPrl({x1:WIDTH/2-182,y1:HEIGHT/2-180,x2:WIDTH/2+150,y2:HEIGHT/2-145,shadow:0,lineWidth:1,textSize:1.5,colSet:11,hoverColSet:11,hoverCounter:0,text:"",trans:myAni*1.1})
                drawPrl({x1:WIDTH/2-241,y1:HEIGHT/2+10,x2:WIDTH/2+91,y2:HEIGHT/2+45,shadow:0,lineWidth:1,textSize:1.5,colSet:11,hoverColSet:11,hoverCounter:0,text:"",trans:myAni*1.1})
                drawPrl({x1:261,y1:212,x2:717,y2:HEIGHT/2+2,shadow:0,lineWidth:3,colSet:2,hoverColSet:2,hoverCounter:0,text:"",trans:myAni*1.1})
                drawPrl({x1:274,y1:212,x2:341,y2:228,shadow:0,lineWidth:3,textSize:1.5,colSet:16,hoverColSet:16,hoverCounter:0,text:"TIPS",trans:myAni*1.1})
                ctx2d.fillStyle=getRGBA(2,0,myAni);
                ctx2d.font="15pt "+JAPANESE_FONTNAME;
                ctx2d.fillText("敵アバター",312,115);
                ctx2d.fillText("チーム",252.5,303);
                ctx2d.font="10pt "+JAPANESE_FONTNAME;
                ctx2d.fillStyle=getRGBA(0,0,myAni);
                ctx2d.fillText("対戦できる敵アバターには3種類あります。",301,143);
                ctx2d.fillText("「CP」とは、アバターの強さを表す指標です。ローマ字入力はKPMが",271,246);
                ctx2d.fillText("そのままCPに、カナ入力は換算されたKPMがCPになります。",268.5,261);
                ctx2d.fillText("アバターは3つのチームに分かれます。所属",242.5,338);
                ctx2d.fillText("チームの相性によって、右のように経験値",238,353);
                ctx2d.fillText("ボーナスを獲得できます。",233.5,368);
                ctx2d.fillText("チーム相性のよいアバターと対戦して、効",227.5,388);
                ctx2d.fillText("率的にレベルを上げましょう！",223,403);
                ctx2d.font="8pt "+JAPANESE_FONTNAME;
                ctx2d.fillStyle=getRGBA(0,0,myAni);
                ctx2d.fillText("デフォルトで用意されている6つのアバター。初心者〜中級者向け。",356,163);
                ctx2d.fillText("日替わりで出現するアバター。中級者〜上級者向け。経験値ボーナス10%。",350,183);
                ctx2d.fillText("実際のタイパーをコピーしたアバター。経験値ボーナス20%。",344,201);

                drawPrl({x1:290.8,y1:153,x2:350.8,y2:166,shadow:0,lineWidth:1,textSize:1.5,colSet:1,hoverColSet:16,hoverCounter:0,text:"COM",trans:myAni*1.1})
                drawPrl({x1:285.4,y1:173,x2:345.4,y2:186,shadow:0,lineWidth:1,textSize:1.5,colSet:1,hoverColSet:16,hoverCounter:0,text:"EVENT",trans:myAni*1.1})
                drawPrl({x1:280,y1:191,x2:340,y2:204,shadow:0,lineWidth:1,textSize:1.5,colSet:1,hoverColSet:16,hoverCounter:0,text:"USER",trans:myAni*1.1})

                ctx2d.font="6pt "+MAIN_FONTNAME;
                ctx2d.fillText("ENEMY",(WIDTH)/2+145-89*0.3,HEIGHT/2+60);
                ctx2d.fillText("YOU",WIDTH/2+41-95*0.3,HEIGHT/2+26+85);
                for(let i = 0;i < 4;i++){
                    for (let j = 0;j < 4;j++){ //j-1が自分のチーム
                        let drawColSet=1;
                        let drawTableText="";
                        if(i==0) {
                            if(j==1) drawColSet=5,drawTableText="R";
                            if(j==2) drawColSet=7,drawTableText="B";
                            if(j==3) drawColSet=9,drawTableText="Y";
                        }else if(j==0){
                            if(i==1) drawColSet=5,drawTableText="R";
                            if(i==2) drawColSet=7,drawTableText="B";
                            if(i==3) drawColSet=9,drawTableText="Y";
                        } else{
                            if(((j-1+6-i+1)% 3) ==2) drawColSet=3,drawTableText="+20%";
                            if(((j-1+6-i+1)% 3) ==1) drawColSet=13,drawTableText="+20%";
                            if(((j-1+6-i+1)% 3) ==0) drawColSet=1,drawTableText="0%";
                        }
                        if(i+j!=0)drawPrl({x1:WIDTH/2+44+ i*35-j*5.7,y1:HEIGHT/2+65+j*19,x2:WIDTH/2+44+i*35+32-j*5.7,y2:HEIGHT/2+65 + j*19+ 15 ,lineWidth:1,shadow:0,isTop:1,trans:myAni,colSet:drawColSet,hoverColSet:drawColSet,hoverCounter:0,textSize:1.2,text:drawTableText});
                    }
                }
            }

            ///ここから全ページ共通処理
            ctx2d.fillStyle=getRGBA(0,0,myAni);
            ctx2d.font="11pt "+JAPANESE_FONTNAME;
            ctx2d.fillText((msgBox[0].currentPage+1)+"/3",WIDTH/2-43,HEIGHT/2+168);
        } else if(msgBox[0].refreshEventWindow){//イベント更新ウィンドウ
            if(msgBox[0].flg!=1 && msgBox[0].flg!=2){//ボタンをprlsへプッシュする
                prls.push({isMsgBox:1,x1:WIDTH/2+230,y1:HEIGHT/2-180,x2:WIDTH/2+281,y2:HEIGHT/2-155,shadow:0,colSet:13,textSize:0.9,hoverColSet:11,hoverCounter:0,lineWidth:2,text:"✕",trans:-1,onClick:function(){}});
                msgBox[0].flg=1;
            }
            let eventCol=dailyMission.event*2+4;
            if(dailyMission.event==0) eventCol=13;
            if(dailyMission.event==4) eventCol=16;
            if(dailyMission.event==5) eventCol=3;
            drawPrl({x1:WIDTH/2-280,y1:HEIGHT/2-180,x2:WIDTH/2+280,y2:HEIGHT/2+180,colSet:2,hoverColSet:2,hoverCounter:0,text:"",trans:myAni*1.1})
            drawPrl({x1:WIDTH/2-186,y1:HEIGHT/2-180,x2:WIDTH/2+220,y2:HEIGHT/2-131,shadow:0,lineWidth:3,textSize:1.5,colSet:4,hoverColSet:11,hoverCounter:0,text:"",trans:myAni*1.1})
            drawPrl({x1:WIDTH/2-253,y1:HEIGHT/2+60,x2:WIDTH/2-19,y2:HEIGHT/2+170,shadow:0,lineWidth:1,textSize:1.5,colSet:2,hoverColSet:11,hoverCounter:0,text:"",trans:myAni*1.1})
            drawPrl({x1:WIDTH/2-40,y1:HEIGHT/2+60,x2:WIDTH/2+197,y2:HEIGHT/2+170,shadow:0,lineWidth:1,textSize:1.5,colSet:2,hoverColSet:11,hoverCounter:0,text:"",trans:myAni*1.1})
            drawPrl({x1:WIDTH/2-230,y1:HEIGHT/2+60,x2:WIDTH/2-19,y2:HEIGHT/2+90,shadow:0,lineWidth:1,textSize:1.5,colSet:16,hoverColSet:11,hoverCounter:0,text:"",trans:myAni*1.5})
            drawPrl({x1:WIDTH/2-17,y1:HEIGHT/2+60,x2:WIDTH/2+197,y2:HEIGHT/2+90,shadow:0,lineWidth:1,textSize:1.5,colSet:11,hoverColSet:11,hoverCounter:0,text:"",trans:myAni*1.5})
            ctx2d.fillStyle=getRGBA(2,0,myAni);
            ctx2d.font="21pt "+MAIN_FONTNAME;
            ctx2d.fillText("DAILY MISSION!",310.5,127);
            ctx2d.fillStyle=getRGBA(0,0,myAni);
            ctx2d.font="11pt "+JAPANESE_FONTNAME;
            ctx2d.fillText("本日のデイリーミッションが更新されました！",301.5,160);
            for(let i = 0;i < 3;i++){
                let baseX=WIDTH/2-186-i*15,baseY=HEIGHT/2-80+i*50;
                drawPrl({x1:baseX,y1:baseY-5,x2:baseX+425,y2:baseY+28,colSet:2,shadow:0,lineWidth:2,hoverColSet:2,hoverCounter:0,text:"",trans:myAni*1.1})
                drawPrl({x1:baseX-10,y1:baseY-15,x2:baseX+140,y2:baseY+3,colSet:13,shadow:0,hoverColSet:2,hoverCounter:0,text:"",trans:myAni*1.1})
                for(let j = 0;j < 3;j++){
                    drawPrl({x1:baseX+145+j*20,y1:baseY-15,x2:baseX+145+j*20+15,y2:baseY+3,colSet:13,shadow:0,hoverColSet:2,hoverCounter:0,text:"",trans:myAni*1.1})
                }
                ctx2d.fillStyle=getRGBA(2,0,myAni);
                ctx2d.font="11pt "+MAIN_FONTNAME;
                ctx2d.fillText("MISSION" + (i+1),baseX,baseY);
                ctx2d.fillStyle=getRGBA(0,0,myAni);
                ctx2d.font="10pt "+JAPANESE_FONTNAME;
                ctx2d.fillText(getMissionText(dailyMission.detail[i]),baseX+15,baseY+20);
                ctx2d.fillText(dailyMission.detail[i].achieve + "ゴールド",baseX+325,baseY+20);
                if(myAni>=0.7) ctx2d.drawImage(coinImg,baseX+300,baseY+1,30,30);
            }
            ctx2d.fillStyle=getRGBA(2,0,myAni);
            ctx2d.font="11pt "+JAPANESE_FONTNAME;
            ctx2d.fillText("限定アバター出現中！",WIDTH/2-217,HEIGHT/2+80);
            ctx2d.fillText("イベント情報",WIDTH/2-5,HEIGHT/2+80);
            ctx2d.fillStyle=getRGBA(0,0,myAni);
            ctx2d.font="9pt "+JAPANESE_FONTNAME;
            ctx2d.fillText((localAvator[1].length) + "体の限定アバターが出現中！",WIDTH/2-224,HEIGHT/2+108);
            for(let i = 0;i < Math.min(localAvator[1].length,4);i++){
                let baseX=WIDTH/2-230-i*4.5,baseY=HEIGHT/2+124+i*15;
                if(i==3){
                    ctx2d.font="6pt "+MAIN_FONTNAME;
                    ctx2d.fillText("etc...",baseX+20,baseY);
                } else{
                    ctx2d.font="8pt "+JAPANESE_FONTNAME;
                    ctx2d.fillText("・"+(localAvator[1][i].name),baseX,baseY,75);
                    ctx2d.font="6pt "+MAIN_FONTNAME;
                    ctx2d.fillText("CP "+ (localAvator[1][i].cp),baseX+80,baseY);    
                }
            }
            if(localAvator[1].length) drawAvator(localAvator[1][0],WIDTH/2-10-105,HEIGHT/2+120-30+23,WIDTH/2-52,HEIGHT/2+200-40+13,t,1)
            //ここからイベント関連 
            ctx2d.fillStyle=getRGBA(0,0,myAni);
            ctx2d.font="9pt "+JAPANESE_FONTNAME;
            if(dailyMission.event==0){
                ctx2d.fillText("本日のイベント開催はありません。",WIDTH/2-10,HEIGHT/2+108);
            } else{
                for(let i = 0;i <EVENT_EXP[dailyMission.event].length;i++){
                    let baseX=WIDTH/2-23-i*4.5,baseY=HEIGHT/2+134 + i * 15;
                    ctx2d.font="7pt "+JAPANESE_FONTNAME;
                    ctx2d.fillText("・"+EVENT_EXP[dailyMission.event][i],baseX,baseY,190);
                }    
                drawPrl({x1:WIDTH/2-17,y1:HEIGHT/2+95,x2:WIDTH/2+180,y2:HEIGHT/2+118,shadow:0,lineWidth:3,textSize:1.1,colSet:eventCol,hoverColSet:11,hoverCounter:0,text:EVENT_NAME[dailyMission.event]+"イベント開催中！",trans:myAni*1.5})
            }
            drawPrl({x1:WIDTH/2+102,y1:HEIGHT/2+55,x2:WIDTH/2+203,y2:HEIGHT/2+70,shadow:0,lineWidth:1,textSize:1.4,colSet:5,hoverColSet:11,hoverCounter:0,text:"毎朝5時にリセット",trans:myAni*1.5})

        } else if(msgBox[0].avatorDeleteWindow){//アバター削除ウィンドウ
            if(msgBox[0].flg!=1 && msgBox[0].flg!=2){//ボタンをprlsへプッシュする
                prls.push({isMsgBox:1,x1:WIDTH/2+80,y1:HEIGHT/2+120,x2:WIDTH/2+190,y2:HEIGHT/2+155,shadow:0,colSet:0,textSize:0.9,hoverColSet:1,hoverCounter:0,lineWidth:2,text:"戻る",trans:-1,onClick:function(){}});
                msgBox[0].flg=1;
                for(let i = 0;i < 7;i++){
                    if(i!=0){
                        let baseY= 180+i*30;
                        let baseX= 590 -i*9;
                        prls.push({isMsgBox:1,x1:baseX+95,y1:baseY-3,x2:baseX+140,y2:baseY+20,id:110+i-1,shadow:0,colSet:0,textSize:1,hoverColSet:1,hoverCounter:0,lineWidth:2,text:"削除",trans:-1,onClick:function(){
                            if(localAvator[deleteClass+2].length > i-1){
                                msgBox.push({
                                    text:"本当にアバター" + localAvator[deleteClass+2][i-1].name　+"を削除しますか？　削除しても戦績は保存されます。",
                                    ani:t,
                                    btns1:{text:"YES",onClick:function(){
                                        //ここに削除処理を追加
                                        localAvator[deleteClass+2].splice(i-1,1);
                                        setShowLocalAvator(onlineAvatorOrder,onlineAvatorCol,onlineAvatorStyle);
                                        setOrderButton();
                                        msgBox.push({
                                            text:"アバターを削除しました。",
                                            ani:t,
                                            btns1:{text:"OK",onClick:function(){
                                                msgBox.push({
                                                    ani:t,
                                                    avatorDeleteWindow:1,
                                                    flg:0});    
                                    
                                            }}});
                                        saveData();
                                    }},
                                    btns2:{text:"NO",onClick:function(){
                                        //スルー
                                        msgBox.push({
                                            ani:t,
                                            avatorDeleteWindow:1,
                                            flg:0});                                
                                    }}
                                });
                            } else{
                                //削除できないのに削除ボタンを押した場合
                            }
                        }});    
                    }
                }
                for(let i = 0;i < 3;i++){
                    prls.push({isMsgBox:1,x1:290+i*60,y1:145,x2:290+i*60+55,y2:165,id:100+i,noDestruct:1,shadow:0,colSet:0,textSize:1,hoverColSet:1,hoverCounter:0,lineWidth:2,text:AVATOR_CLASS_TEXT[i+2],trans:-1,onClick:function(){
                        deleteClass=i;
                        setDeleteWindowButton();
                    }});
                }
                deleteClass=0;
                setDeleteWindowButton();
            }
            drawPrl({x1:WIDTH/2-280,y1:HEIGHT/2-160,x2:WIDTH/2+280,y2:HEIGHT/2+160,colSet:2,hoverColSet:2,hoverCounter:0,text:"",trans:myAni*1.1})
            ctx2d.fillStyle=getRGBA(0,0,myAni);
            ctx2d.font="14pt " + JAPANESE_FONTNAME;
            ctx2d.fillText("保存済みアバターの削除",300,134);
            ctx2d.font="11pt " + JAPANESE_FONTNAME;
            for(let i = 0;i < 7;i++){
                let baseY= 180+i*30;
                let baseX= 290-i*9;
                let drawName = "- - -";
                let drawCP = "----";
                let drawAcc = "---";
                let drawDate = "----/--/--";
                if(localAvator[deleteClass+2].length > i-1 && i){
                    drawName = localAvator[deleteClass+2][i-1].name;
                    drawCP = localAvator[deleteClass+2][i-1].cp;
                    drawAcc=localAvator[deleteClass+2][i-1].typingData.acc + "%";
                    let tempDrawDate=getBattleDataSave(localAvator[deleteClass+2][i-1].id).date;
                    let drawYear=tempDrawDate.substr(0,4);
                    let drawMonth=Number(tempDrawDate.substr(4,2))+1;
                    let drawDay=tempDrawDate.substr(6,2);
                    drawDate = drawYear + "/" + ('00' + drawMonth).slice(-2) + "/" + drawDay;
                    if(myAni>0.8) drawTeamCircle(baseX+2,baseY+8,5,localAvator[deleteClass+2][i-1].team,1);
                } else if (i == 0){
                    drawName = "NAME";
                    drawCP = "CP";
                    drawAcc = "ACC";
                    drawDate="DATE";
                }
                ctx2d.fillStyle=getRGBA(0,0,myAni);
                ctx2d.font="12pt " + MAIN_FONTNAME + "," + JAPANESE_FONTNAME;
                ctx2d.fillText(drawName,baseX+18,baseY+13);
                ctx2d.font="10pt " + MAIN_FONTNAME + "," + JAPANESE_FONTNAME;
                ctx2d.fillText(drawCP,baseX+138,baseY+13);
                ctx2d.fillText(drawAcc,baseX+190,baseY+13);
                ctx2d.fillText(drawDate,baseX+250,baseY+13);
            }
        }else{ //通常のメッセージボックス
            if(myCharAni>=28 || myCharAni >= msgBox[0].text.length) randomChar1 = "";
            if(myCharAni<28 || myCharAni >= 56 || myCharAni >= msgBox[0].text.length) randomChar2 = "";
            if(msgBox[0].flg!=1 && msgBox[0].flg!=2){//指定されたボタンをprlsへプッシュする
                if(msgBox[0].btns2!=undefined){ //ボタンが２つある時
                    prls.push({isMsgBox:1,sound:msgBox[0].btns1.sound,x1:WIDTH/2-100,y1:HEIGHT/2+30,x2:WIDTH/2-20,y2:HEIGHT/2+50,shadow:0,colSet:0,hoverColSet:1,hoverCounter:0,text:msgBox[0].btns1.text,trans:-1,onClick:msgBox[0].btns1.onClick});
                    prls.push({isMsgBox:1,sound:msgBox[0].btns2.sound,x1:WIDTH/2+20,y1:HEIGHT/2+30,x2:WIDTH/2+100,y2:HEIGHT/2+50,shadow:0,colSet:0,hoverColSet:1,hoverCounter:0,text:msgBox[0].btns2.text,trans:-1,onClick:msgBox[0].btns2.onClick});
                } else{
                    prls.push({isMsgBox:1,sound:msgBox[0].btns1.sound,x1:WIDTH/2-50,y1:HEIGHT/2+30,x2:WIDTH/2+50,y2:HEIGHT/2+50,shadow:0,colSet:0,hoverColSet:1,hoverCounter:0,text:msgBox[0].btns1.text,trans:-1,onClick:msgBox[0].btns1.onClick});
                }
                playSE("msg");
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
                    drawPrl({x1:WIDTH/2-160+i*50,y1:HEIGHT/2+50,x2:WIDTH/2-120+i*50,y2:HEIGHT/2+80,colSet:12,hoverColSet:12,lineWidth:3,shadow:0,hoverCounter:0,text:"",trans:0.5+0.5*Math.sin(t/120)})
                }
            }
            const INPUT_TYPE=["ローマ字","カナ"]; 
            for(var i = 0;i < 2;i++){ //入力方式選択
                if(playData.settings[0] == i){
                    drawPrl({isMsgBox:1,x1:WIDTH/2-143.5+i*85,y1:HEIGHT/2-5,x2:WIDTH/2-68.5+i*85,y2:HEIGHT/2+25,shadow:0,colSet:3,lineWidth:4,hoverColSet:4,hoverCounter:0,lineWidth:4+2*Math.sin(t/120),textSize:0.9,text:INPUT_TYPE[i],trans:-1,noDestruct:1});
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
            ctx2d.fillText("NAME",WIDTH/2-180+9,HEIGHT/2-65-30);
            ctx2d.fillText("CP",WIDTH/2-70+15,HEIGHT/2-65-30);
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
                    ctx2d.fillRect(WIDTH/2-81-i*9,HEIGHT/2-67+i*30,15,4);
                    if(msgBox[0].flg!=2){
                        //有利なチームなら矢印を表示
                        if(localAvator[selectBattleAvatorClass][i].team != 3 && (3+avatorData[0].team-localAvator[selectBattleAvatorClass][i].team)%3 == 2){
                            ctx2d.drawImage(arrowImg,WIDTH/2-181-i*9,HEIGHT/2-78+i*30 - (5)*Math.max(0,Math.sin(t/150)*3-2.7),13,13);
                        }
                        //勝ったことがあれば勲章を表示
                        if(localAvator[selectBattleAvatorClass][i].pWin){
                            ctx2d.drawImage(pWinImg,WIDTH/2-206-i*9-10,HEIGHT/2-65+i*30-15,23,23);
                        } else if(localAvator[selectBattleAvatorClass][i].kWin){
                            ctx2d.drawImage(kWinImg,WIDTH/2-206-i*9-10,HEIGHT/2-65+i*30-15,23,23);
                        } else if(localAvator[selectBattleAvatorClass][i].win){
                            ctx2d.drawImage(nWinImg,WIDTH/2-206-i*9-10,HEIGHT/2-65+i*30-15,23,23);
                        }
                    }
                    ctx2d.fillStyle=getRGBA(0,0,myAni);
                    ctx2d.font="10pt " + JAPANESE_FONTNAME;
                    ctx2d.fillText(localAvator[selectBattleAvatorClass][i].name,WIDTH/2-166-i*9,HEIGHT/2-65+i*30,80);
                    ctx2d.font="10pt " + JAPANESE_FONTNAME;
                    ctx2d.fillText(INPUT_STYLE_SHORT[localAvator[selectBattleAvatorClass][i].style],WIDTH/2-78-i*9,HEIGHT/2-65+i*30);
                    if(localAvator[selectBattleAvatorClass][i].cp-avatorData[playData.settings[0]].cp>50){//格上
                        ctx2d.fillStyle=getRGBA(11,0,myAni);
                    } else if(localAvator[selectBattleAvatorClass][i].cp-avatorData[playData.settings[0]].cp<-50){//格下
                        ctx2d.fillStyle=getRGBA(10,0,myAni);
                    }
                    if(avatorData[playData.settings[0]].cp == 0)ctx2d.fillStyle=getRGBA(0,0,myAni);
                    ctx2d.fillText(processShowData(Math.round(localAvator[selectBattleAvatorClass][i].cp)),WIDTH/2-59-i*9,HEIGHT/2-65+i*30,25);
                    if(msgBox[0].flg!=2) drawTeamCircle(WIDTH/2-188-i*9,HEIGHT/2-70+i*30,5,localAvator[selectBattleAvatorClass][i].team);
                } else {
                    ctx2d.fillStyle=getRGBA(0,0,myAni);
                    ctx2d.fillText("- - -",WIDTH/2-190-i*9,HEIGHT/2-65+i*30);
                    ctx2d.fillText("-",WIDTH/2-92-i*9,HEIGHT/2-65+i*30);
                    ctx2d.fillText("---",WIDTH/2-65-i*9,HEIGHT/2-65+i*30);
                }
            }
            ctx2d.font="7pt " + JAPANESE_FONTNAME;
            ctx2d.fillStyle=getRGBA(0,0,myAni);
            ctx2d.fillText("※イベントアバターは経験値ボーナス10%、",WIDTH/2-270,HEIGHT/2+143);
            ctx2d.fillText("ユーザーアバターは経験値ボーナス20%！",WIDTH/2-260,HEIGHT/2+153);
            
            ctx2d.font="8pt " + JAPANESE_FONTNAME;
            ctx2d.fillText("格下",WIDTH/2-240,HEIGHT/2+124);
            ctx2d.fillText("同格",WIDTH/2-170,HEIGHT/2+124);
            ctx2d.fillText("格上",WIDTH/2-100,HEIGHT/2+124);
            ctx2d.fillText("黒色",WIDTH/2-200,HEIGHT/2+124);
            ctx2d.fillStyle=getRGBA(10,0,myAni);
            ctx2d.fillText("緑色",WIDTH/2-270,HEIGHT/2+124);
            ctx2d.fillStyle=getRGBA(11,0,myAni);
            ctx2d.fillText("赤色",WIDTH/2-130,HEIGHT/2+124);
            drawPrl({isMsgBox:1,x1:WIDTH/2+93,y1:HEIGHT/2-116,x2:WIDTH/2+93+40,y2:HEIGHT/2-101,shadow:0,colSet:3,noDestruct:1,textSize:0.9,hoverColSet:3,hoverCounter:0,lineWidth:0.1,text:"YOU",trans:-1});
            drawPrl({isMsgBox:1,x1:WIDTH/2+93+140,y1:HEIGHT/2-116,x2:WIDTH/2+93+140+40,y2:HEIGHT/2-101,shadow:0,colSet:13,noDestruct:1,textSize:0.9,hoverColSet:13,hoverCounter:0,lineWidth:0.1,text:"ENEMY",trans:-1});
            ctx2d.font="16pt " + JAPANESE_FONTNAME;
            ctx2d.fillStyle=getRGBA(0,0,myAni);
            ctx2d.fillText("VS",WIDTH/2+120,HEIGHT/2-45);
            drawPrl({isMsgBox:1,x1:WIDTH/2-183+selectBattleAvatorClass*48,y1:HEIGHT/2-141,x2:WIDTH/2-180+selectBattleAvatorClass*48,y2:HEIGHT/2-116,shadow:0,colSet:13,noDestruct:1,textSize:0.9,hoverColSet:13,hoverCounter:0,lineWidth:0.1,text:"",trans:-1});
            if(localAvator[1].length){//イベントアバター出現中の文字
                if(dailyMission.rare){
                    drawPrl({isMsgBox:0,x1:WIDTH/2-190+43+23,y1:HEIGHT/2-171-(5)*Math.max(0,Math.sin(t/210)*3-2.7),x2:WIDTH/2-190+43+27,y2:HEIGHT/2-165-(5)*Math.max(0,Math.sin(t/210)*3-2.7),shadow:0,colSet:16,noDestruct:1,textSize:1.3,hoverColSet:16,hoverCounter:0,lineWidth:0.1,text:"",trans:-1});
                    drawPrl({isMsgBox:0,x1:WIDTH/2-190+38,y1:HEIGHT/2-190-(5)*Math.max(0,Math.sin(t/210)*3-2.7),x2:WIDTH/2-135+50,y2:HEIGHT/2-171-(5)*Math.max(0,Math.sin(t/210)*3-2.7),shadow:0,colSet:16,noDestruct:1,textSize:1,hoverColSet:16,hoverCounter:0,lineWidth:0.1,text:"レア出現中！",trans:-1});    
                } else{
                    drawPrl({isMsgBox:0,x1:WIDTH/2-190+43+23,y1:HEIGHT/2-171-(5)*Math.max(0,Math.sin(t/210)*3-2.7),x2:WIDTH/2-190+43+27,y2:HEIGHT/2-165-(5)*Math.max(0,Math.sin(t/210)*3-2.7),shadow:0,colSet:3,noDestruct:1,textSize:1.3,hoverColSet:3,hoverCounter:0,lineWidth:0.1,text:"",trans:-1});
                    drawPrl({isMsgBox:0,x1:WIDTH/2-190+43,y1:HEIGHT/2-186-(5)*Math.max(0,Math.sin(t/210)*3-2.7),x2:WIDTH/2-135+45,y2:HEIGHT/2-171-(5)*Math.max(0,Math.sin(t/210)*3-2.7),shadow:0,colSet:3,noDestruct:1,textSize:1.3,hoverColSet:3,hoverCounter:0,lineWidth:0.1,text:"出現中！",trans:-1});    
                }
            }
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
                if(localAvator[selectBattleAvatorClass][selectBattleAvator].dropItem != undefined){
                    drawPrl({isMsgBox:0,x1:650,y1:253,x2:720,y2:268,shadow:0,colSet:16,noDestruct:1,hoverColSet:3,hoverCounter:0,lineWidth:0.1,textSize:1.3,text:"DROP " + Math.round(localAvator[selectBattleAvatorClass][selectBattleAvator].dropProb*100) + "%",trans:-1});    
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
                    if(i==2) drawINFO= localAvator[selectBattleAvatorClass][selectBattleAvator].cp;
                    if(i==3) drawINFO= processShowData(Number(localAvator[selectBattleAvatorClass][selectBattleAvator].typingData.acc))+"%";
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
            if(selectBattleAvatorClass>=2 && localAvator[2].length+localAvator[3].length+localAvator[4].length==0){
                //アバター未保存時
                drawPrl({isMsgBox:0,x1:WIDTH/2-240,y1:HEIGHT/2-33,x2:WIDTH/2-38,y2:HEIGHT/2+10,shadow:0,colSet:11,hoverColSet:3,hoverCounter:0,lineWidth:0.1,textSize:1.3,text:"",trans:-1});
                ctx2d.font="9pt " + JAPANESE_FONTNAME;
                ctx2d.fillStyle=getRGBA(2,0,myAni);
                ctx2d.fillText("右上の「オンラインアバター」",WIDTH/2-220,HEIGHT/2-15);
                ctx2d.fillText("をクリックしてアバター追加！",WIDTH/2-224.5,HEIGHT/2);
            }
        }
    }
}
function drawTitle(){ ///タイトル画面の描画関数
    drawLoadingCircle(WIDTH/2-290,HEIGHT/2-20,30,-t/3,1000);
    drawLoadingCircle(WIDTH/2+290,HEIGHT/2-20,30,t/3.3,1000);
    for(let i = 0;i < 20;i++){
        var distToMouse=1000*Math.pow(1+Math.abs(delayMouseY-HEIGHT/20*i-10),-0.5);
        ctx2d.fillStyle="rgba(0,0,"+(10+distToMouse) +",1)";
        ctx2d.fillRect(30,HEIGHT/20*i,30,20)
        ctx2d.fillRect(WIDTH-60,HEIGHT/20*i,30,20)
        distToMouse=1000*Math.pow(1+Math.abs(delayMouseX-WIDTH/20*i-15),-0.5);
        ctx2d.fillStyle="rgba(0,0,"+(10+distToMouse) +",1)";
        ctx2d.fillRect(WIDTH/20*i,10,20,30)
        ctx2d.fillRect(WIDTH/20*i,HEIGHT-40,20,30)
    }
    ctx2d.strokeStyle="rgba(200,200,200," + (0.2*Math.sin(t/100)+0.3) + ")";
    ctx2d.beginPath();
    ctx2d.lineWidth=1;
    ctx2d.moveTo(0,delayMouseY);
    ctx2d.lineTo(WIDTH,delayMouseY);
    ctx2d.moveTo(delayMouseX,0);
    ctx2d.lineTo(delayMouseX,HEIGHT);
    ctx2d.stroke();
    ctx2dCr.font="55px " + MAIN_FONTNAME;//////////タイトル文字
    ctx2dCr.fillStyle=getRGBA(2,0,1);
    ctx2dCr.fillText("A V A - T Y P E",(WIDTH-ctx2dCr.measureText("A V A - T Y P E").width)/2,HEIGHT/2);
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
                prls[i].sound="error";
            } else if(prls[i].id-10==selectBattleAvator){
                prls[i].colSet=3;
                prls[i].hoverColSet=4;
                prls[i].sound="cursor";
            }  else{
                prls[i].colSet=0;
                prls[i].hoverColSet=1;
                prls[i].sound="cursor";
            }
        }
    }
}
function drawMenuOnce(){
    //メニュー画面のうち一回しか描画しないものを描画
//    var ctx2dSil=document.getElementById("myCanvas3_5").getContext("2d");
}
function drawMenu(){
    pfnw=performance.now();
    drawLoadingCircle(HEIGHT/2+40,HEIGHT/2,HEIGHT/2-25,t/3.2,1000);//////////動く丸
    drawLoadingCircle(WIDTH-25-HEIGHT/3,HEIGHT/3-10,HEIGHT/3-20,-t/3,1000);//////////動く丸
    drawLoadingCircle(WIDTH-100,HEIGHT-60,50,t/2.6,1000);
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
    drawPrl({x1:796,y1:21,x2:823,y2:28,colSet:17+playData.settings[0],hoverColSet:2,hoverCounter:0,shadow:0,lineWidth:0.1,text:"",trans:1});
    ctx2d.font="11pt " + JAPANESE_FONTNAME;
    ctx2d.fillStyle=getRGBA(2,0,1);
    ctx2d.fillText(INPUT_STYLE_SHORT[playData.settings[0]],805,23);
    let showMenubarCP=avatorData[playData.settings[0]].cp;
    if(avatorData[playData.settings[0]].cp==0) showMenubarCP="--";
    ctx2d.fillText("CP. " + showMenubarCP,826-ctx2d.measureText("CP. " + avatorData[playData.settings[0]].cp).width,50);
    ctx2d.fillText("LV. " + playData.level,WIDTH-ctx2d.measureText("LV. " + playData.level).width-30,24);
    drawStar(avatorData[0],WIDTH-122,32,21);
    drawAvator(avatorData[0],5,5,55,55,t,1);//アバターの画像

    for(let i = 0;i < prls.length;i++){
        if(prls[i].isMsgBox!=1) drawPrl(prls[i]);
    }

    //シルエット
    ctx2d.drawImage(silhoutteImg[1],140,230,80,80);
    ctx2d.drawImage(silhoutteImg[2],590,249,30,50);
    ctx2d.drawImage(silhoutteImg[0],600,130,55,50);

    drawLoadingCircle(WIDTH/2+110,30,15,-t/2.7,1000); //メニューバーここまで
    drawGhost(165,385,245,470,t+72,1);//アバター横のアバター画像
    ctx2d.font="14pt " + JAPANESE_FONTNAME;
    drawTeamCircle(ctx2d.measureText(avatorData[0].name).width+83,30,7,avatorData[0].team);
    ctx2d.fillStyle=getRGBA(0,0,1);
    let myDate = new Date();
    myDate.setHours(myDate.getHours() - 5);
    if(myDate.getSeconds()==0) myDate.setMinutes(myDate.getMinutes() - 1);
    let hours = myDate.getHours();
    let minutes =myDate.getMinutes();
    let seconds= myDate.getSeconds();
    if(dailyMission.date!= myDate.getDay()) {
        setDailyMission(),saveData();//デイリーミッションの更新処理　セーブもする
        msgBox.push({ani:t,refreshEventWindow:1});
        //ミッションウィンドウを表示
    }

    for(let i = 0;i < 3;i++){
        if(dailyMission.detail[i].progress == dailyMission.detail[i].max){
            drawPrl({x1:567+i*9.6,y1:379+i*32,x2:826+i*9.6,y2:407+i*32,rev:1,lineWidth:1,shadow:0,colSet:14,hoverColSet:14,hoverCounter:0,textSize:0.6,text:""});
        } else if(dailyMission.detail[i].team!=-1){
            drawPrl({x1:567+i*9.6,y1:379+i*32,x2:826+i*9.6,y2:407+i*32,rev:1,lineWidth:1,shadow:0,colSet:0,hoverColSet:0,hoverCounter:0,textSize:0.6,text:""});
            drawPrl({x1:558+i*9.6,y1:379+i*32,x2:574+i*9.6,y2:407+i*32,rev:1,lineWidth:0.1,shadow:0,colSet:5+((dailyMission.detail[i].team+2)%3)*2,hoverColSet:3+dailyMission.detail[i].team*2,hoverCounter:0,textSize:0.6,text:""});
        } else{
            drawPrl({x1:567+i*9.6,y1:379+i*32,x2:826+i*9.6,y2:407+i*32,rev:1,lineWidth:1,shadow:0,colSet:0,hoverColSet:0,hoverCounter:0,textSize:0.6,text:""});
            drawPrl({x1:558+i*9.6,y1:379+i*32,x2:574+i*9.6,y2:407+i*32,rev:1,lineWidth:0.1,shadow:0,colSet:13,hoverColSet:13,hoverCounter:0,textSize:0.6,text:""});
        }
    }
    ctx2d.fillStyle=getRGBA(0,0,1); //アバター作成可能な場合
    if(avatorData[playData.settings[0]].uploaded==0){
        if(avatorData[playData.settings[0]].typingData.stroke>=10000){
            ctx2d.fillStyle=getRGBA(2,0,1); 
            drawPrl({x1:685,y1:105,x2:880,y2:130,lineWidth:1,shadow:0,colSet:3,hoverColSet:0,trans:1.5,hoverCounter:0,textSize:0.9,text:"アバター作成で50ゴールド獲得！"});
        } else {
            ctx2d.font="8pt " + JAPANESE_FONTNAME;
            ctx2d.fillText("作成まであと" + (10000-avatorData[playData.settings[0]].typingData.stroke)+"打鍵",860-ctx2d.measureText("作成まであと" + (10000-avatorData[playData.settings[0]].typingData.stroke)+"打鍵").width,125);    
        }
    }

    ctx2d.fillStyle=getRGBA(0,0,1); //デイリーミッション関連
    ctx2d.font="19pt " + MAIN_FONTNAME;
    ctx2d.fillText("DAILY",560,370);
    ctx2d.font="8pt " + JAPANESE_FONTNAME;
    ctx2d.fillText("更新まであと",651,370);
    ctx2d.font="14pt " + DIGIT_FONTNAME;
    ctx2d.fillText(("00"+(24-hours-1)).slice(-2) + ":"+("00"+(60-minutes-1)).slice(-2)+":"+("00"+Number(60-seconds)%60).slice(-2),721,370);
    ctx2d.font="8pt " + JAPANESE_FONTNAME;
    let baseExpTime = t/5000 - Math.floor(t/5000);
    let eventExp = EVENT_EXP[dailyMission.event][Math.floor((t/5000)) % EVENT_EXP[dailyMission.event].length];
    eventExp = eventExp.substr(0,Math.max(0,Math.floor(Math.min(baseExpTime,1-baseExpTime)*80)-3));
    if(eventExp.length && eventExp.length != EVENT_EXP[dailyMission.event][Math.floor((t/5000)) % EVENT_EXP[dailyMission.event].length].length) eventExp+=CHARA_SET[Math.floor(Math.random() * CHARA_SET.length)];
    ctx2d.fillText(eventExp,594,487);

    //達成度合い等ここから
    for(let i = 0;i < 3;i++){
        ctx2d.font="7.5pt " + JAPANESE_FONTNAME;
        ctx2d.fillStyle=getRGBA(0,0,1);
        ctx2d.fillText(getMissionText(dailyMission.detail[i]),573+9.6*i,390 + i * 32);
        ctx2d.font="7pt " + JAPANESE_FONTNAME;
        ctx2d.fillText(dailyMission.detail[i].progress,600+9.6*i-ctx2d.measureText(dailyMission.detail[i].progress).width,403 + i * 32);
        ctx2d.fillText("/",601+9.6*i,403 + i * 32);
        ctx2d.fillText(dailyMission.detail[i].max,605+9.6*i,403 + i * 32);
        ctx2d.fillText(dailyMission.detail[i].achieve,750+9.6*i,403 + i * 32);
        ctx2d.fillText("ゴールド",773+9.6*i,403 + i * 32);
        for(let j = 0;j < 5;j++){
            drawPrl({x1:639+j*20+i*6.9,y1:395+i*32,x2:655+j*20+i*6.9,y2:403+i*32,rev:1,lineWidth:3,shadow:0,colSet:0,hoverColSet:0,hoverCounter:0,textSize:0.6,text:""});
            if(dailyMission.detail[i].progress && Math.min(1,Math.max(0,(dailyMission.detail[i].progress-dailyMission.detail[i].max*0.2*j)/(dailyMission.detail[i].max*0.2)))>0) 
                drawPrl({x1:639+j*20+i*6.9,y1:395+i*32,rev:1,x2:639+i*6.9+j*20+16*Math.min(1,Math.max(0,(dailyMission.detail[i].progress-dailyMission.detail[i].max*0.2*j)/(dailyMission.detail[i].max*0.2))),y2:403+i*32,lineWidth:3,shadow:0,colSet:5,hoverColSet:0,hoverCounter:0,textSize:0.6,text:""});    
        }
        ctx2d.drawImage(coinImg,736+9.6*i,391+i*32,15,15);
    }

    for(let i = 0;i < 3;i++){
        if(dailyMission.detail[i].progress == dailyMission.detail[i].max){
            drawPrl({x1:760+i*9.6,y1:374+i*32,x2:826+i*9.6,y2:390+i*32,rev:1,lineWidth:1,shadow:0,colSet:3,hoverColSet:3,hoverCounter:0,textSize:0.9,text:"CLEAR"});
        }
    }
    if(dailyMission.event){//イベント開催時
        if(dailyMission.event <= 3){
            drawPrl({x1:658,y1:324,x2:834,y2:350,rev:1,lineWidth:0.1,shadow:0,colSet:3+dailyMission.event*2,hoverColSet:3+dailyMission.event*2,hoverCounter:0,textSize:1,text:TEAM_TEXT[dailyMission.event-1] + "イベント開催中！"});
        } else if(dailyMission.event == 4){
            drawPrl({x1:658,y1:324,x2:834,y2:350,rev:1,lineWidth:0.1,shadow:0,colSet:16,trans:2,hoverColSet:3+dailyMission.event*2,hoverCounter:0,textSize:1,text:"EXPアップイベント開催中！"});
        } else if(dailyMission.event==5){
            drawPrl({x1:658,y1:324,x2:834,y2:350,rev:1,lineWidth:0.1,shadow:0,colSet:3,hoverColSet:3+dailyMission.event*2,hoverCounter:0,textSize:1,text:"ゴールドイベント開催中！"});
        }
    }
    //デイリーミッションここまで

}
function getLastEnemyKpmClass(myTypingData,num,baseKpm,isKPM){
    //タイピングデータから直前のnumキーまでの平均KPMを計算
    let realNum=0,aveKpm=0;
    let kpmMode=isKPM;
    if (kpmMode==undefined) kpmMode=0;
    for(let i = 0;i < num;i++){
        if(myTypingData.length-2-i < 0) break;
        let lastKpm = 60000/(myTypingData[myTypingData.length-1-i].time-myTypingData[myTypingData.length-2-i].time);
        if(isNaN(lastKpm)) lastKpm=9999;
        aveKpm = (aveKpm * realNum + lastKpm) / (realNum+1);
        realNum++;
    }
    if(kpmMode) return aveKpm;
    for(let i = 0;i < CLASS_KPM_RATIO.length;i++){
        if(aveKpm/baseKpm<CLASS_KPM_RATIO[i]) return i;
    }
    return CLASS_KPM_RATIO.length-1;//見つからなかったら一番最後のクラスに分類
}
function replaceEnemyOpt(plainText,prob,bf,af,replacement){
    //敵の最適化を処理する関数　plainText内のbfをafで置換した文字列を返す（確率はprob)
    //拗音の処理、全て置換する処理を追加
    //    ["tya","cha"],["tyu","chu"],["tyo","cho"],
    //replacementには配列で渡す　["hu","fu","c"]のように渡すと、"hu"の前が"c"のもの("chu")を"cfu"と変換しないようにできる
    let afterText="";
    let omit = "";
    if(replacement.length == 2)  omit = replacement[2];
    while(plainText.indexOf(bf) != -1){
        if(Math.random()<prob && plainText.substr(plainText.indexOf(bf)-1,1).indexOf(omit)==-1){//置換する時
            if(bf.substr(0,1) != af.substr(0,1) && plainText.substr(plainText.indexOf(bf)-1,1) == bf.substr(0,1)){
                //拗音の場合
                plainText=plainText.substr(0,plainText.indexOf(bf)-1)+af.substr(0,1) + plainText.substr(plainText.indexOf(bf));
            }
            afterText+=plainText.substr(0,plainText.indexOf(bf))+af;
            plainText=plainText.substr(plainText.indexOf(bf)+bf.length);
        } else {//それ以外    abcabc  bc ->  cabc (ab)
            afterText+=plainText.substr(0,plainText.indexOf(bf)+1);
            plainText=plainText.substr(plainText.indexOf(bf)+1);
        }
    }
    afterText+=plainText;
    return afterText;
}
function modifyEnemyTypeData(){
    //敵のタイピングデータを調整する関数
    //平均的なKPMが最高でもCP*1.2におさまるようにする
    let counter=0;
    while (enemyTypingAnalysis() > enemyAvatorData.typingData.kpm +30){
        counter++;
        for(let i = 0;i < 25;i++){
            for(let j = 1;j < battleResult.enemyTypeData[i].length;j++){
                battleResult.enemyTypeData[i][j].time*=1.03;
            }    
        }
    }
}
function getEnemyTypeData(i,mode,str){
    ////敵のタイピングデータの生成を行う関数

    let tempTypeData=[];
    let enemyTypingChar=0;
    let enemyTypingTime=(Math.random()*0.75+0.55)*enemyAvatorData.typingData.firstSpeed;
    let myFirstSpeed = enemyTypingTime;
    let enemyLastMiss=0;//直前の文字がミスかどうか
    let enemyLastCong=0;//直前文字が詰まっているかどうか
    let enemyTextAfterOpt = battleResult.wordSet[i].enemyText;
    if(mode == 1) enemyTextAfterOpt=str;
    for(let i = 0;i < OPT_SET.length;i++){//最適化を行う
        enemyTextAfterOpt=replaceEnemyOpt(enemyTextAfterOpt,enemyAvatorData.typingData.optData[i].count / enemyAvatorData.typingData.optData[i].total,OPT_SET[i][0],OPT_SET[i][1],OPT_SET);
        //拗音にも対応するようにあとで修正
    }
    while(true){
        let thisChar=enemyTextAfterOpt.substr(enemyTypingChar,1);//次に打つべき文字
        let charKpm=(2*enemyAvatorData.typingData.kpm+2.3*enemyAvatorData.typingData.keyData[getAllCharaSetNum(thisChar)].kpm)/2;//その文字のkpm
        let myStab = enemyAvatorData.typingData.keyData[getAllCharaSetNum(thisChar)].stability;
        charKpm=charKpm*Math.max(0.3,(1+6*(Math.random()-0.5)*myStab));//キーごとの安定性でぶらす
        if(Math.random()<0.3){//speedTensorの影響を受ける
            let lastClass3 = getLastEnemyKpmClass(battleResult.enemyTypeData[i],3,enemyAvatorData.typingData.kpm);//これまでのタイピングクラスを格納
            let lastClass6 = getLastEnemyKpmClass(battleResult.enemyTypeData[i],6,enemyAvatorData.typingData.kpm);
            let lastClass9 = getLastEnemyKpmClass(battleResult.enemyTypeData[i],9,enemyAvatorData.typingData.kpm);
            charKpm = charKpm * 0.35 + enemyAvatorData.typingData.speedTensor[lastClass3][lastClass6][lastClass9].kpm*0.7; 
        }
        charKpm = charKpm * (1 + Math.max(0.5,myStab*2)*(0.7*(Math.random()-0.5)));//ランダム性をもたせる
        if(getLastEnemyKpmClass(battleResult.enemyTypeData[i],6,enemyAvatorData.typingData.kpm,1) > enemyAvatorData.typingData.kpm*1.5 || 
           getLastEnemyKpmClass(battleResult.enemyTypeData[i],9,enemyAvatorData.typingData.kpm,1) > enemyAvatorData.typingData.kpm*1.25){
            charKpm=Math.min(charKpm*0.5,enemyAvatorData.typingData.kpm*0.9);
        }
        if(charKpm>enemyAvatorData.typingData.kpm*1.8 && Math.random()<0.25){
            charKpm=Math.min(charKpm*0.8,enemyAvatorData.typingData.kpm*1.8);
        }
        let charTime=60000/charKpm;//その文字の打鍵までにかかる時間（ミリ秒）
        if(enemyTypingChar!=0) enemyTypingTime+=charTime;//1文字目以外のときは所要時間を足す
        if((!enemyLastMiss && Math.random()*100 > enemyAvatorData.typingData.acc) ||
                (enemyLastMiss && Math.random() > 1/enemyAvatorData.typingData.missChain)){ //ミスの時
                    tempTypeData.push({
                char:"_",
                time:enemyTypingTime});
            enemyLastMiss=1;
            enemyLastCong=0;
        } else{
            if((!enemyLastCong && Math.random() < enemyAvatorData.typingData.cong.prob) || 
                    (enemyLastCong && Math.random() > 1/enemyAvatorData.typingData.cong.key)){//詰まっている時
                enemyTypingTime+=Math.min(400,charTime*2);//400ミリ秒以上は詰まらない(止まったように感じる)
                enemyLastCong=1;
            } else{ //詰まっていない時
                enemyLastCong=0;
            }
            tempTypeData.push({
                char:thisChar,
                time:enemyTypingTime});
            enemyTypingChar++;
            enemyLastMiss=0;
        }
        if(enemyTypingChar>enemyTextAfterOpt.length) break;
    }
    if(mode!=undefined) return 60000 * (enemyTextAfterOpt.length-1)/ (enemyTypingTime-myFirstSpeed);
    return tempTypeData;
}
function setBattleResultDefault(){ //ワードもここで選ぶ
    //wordsはどちらが獲得したか(0未　1自分　2相手　3現在) //pointは自分が何ポイント獲得したか　//nowは現在何ワード目か(0からスタート)
    //wordSetは出題ワードを格納 totalTimeは通算打鍵時間
    battleResult = {words:[3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],point:0,now:-1,wordSet:[],totalTime:0,totalStroke:0,totalMiss:0,
        kpm:0,acc:0,cp:0,startTime:-1,win:0,kWin:0,pWin:0,bonus:[0,0,0,0,0],itemBonus:[0,0,0,0,0],baseExp:0,exp:0,coin:0,wordCP:[],wordEnemyCP:[],
        maxCP:-9999,minCP:9999,achieveDailyMission:[0,0,0],pointRank:0,accRank:0,levelUp:0,notice:[],enemyTypeData:[],myTypeData:[]};
    for(let i = 0;i < 25;i++){//出題ワードをセット
        let tempWordNum;
        battleResult.enemyTypeData[i]=[];
        while(true){
            tempWordNum=Math.floor(Math.random()*word2.length);
            if(word2[tempWordNum].split(",")[1].length>12 && word2[tempWordNum].split(",")[1].length<21) break;
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
        battleResult.enemyTypeData[i]=getEnemyTypeData(i);
    }
    modifyEnemyTypeData();
    battleResult.wordSet[25]={};
    battleResult.wordSet[25].enemyText="";
    battleResult.wordSet[25].text="";
    battleResult.wordSet[25].myText="";
    lossTimeSum=0;
    totalLossTime=0;
    winLoseAni=0;
    typingEffect=[];
}
function enemyTypingAnalysis(){
    let aveKpm=0;
    for(let i =0;i < 25;i++){
        let thistimeKpm=60000/battleResult.enemyTypeData[i][battleResult.enemyTypeData[i].length-1].time;
        thistimeKpm*=battleResult.wordSet[i].enemyText.length;
        aveKpm+=thistimeKpm;
    }
    aveKpm/=25;
    return aveKpm;
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
function getEfX(myEf){
    return myEf.ani*120;
}
function getEfY(myEf){
    return myEf.col*120;
}
function drawTypingEffect(){
    if(playData.settings[2]==1) return 0;
    for(let i = 0;i < typingEffect.length;i++){
        ctx2d.drawImage(canHid,getEfX(typingEffect[i]),getEfY(typingEffect[i]),120,120,typingEffect[i].x,typingEffect[i].y,30,30);
        typingEffect[i].ani+=1;
        if(typingEffect[i].ani==10) typingEffect.splice(i,1);
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
    ctx2d.fillText("CP " + enemyAvatorData.cp,WIDTH-140,HEIGHT*1.3/3-60);
    ctx2d.fillStyle=getRGBA(0,0,1);
    ctx2d.fillText("/ 25",270,HEIGHT*1.5/3+20);
    ctx2d.fillText("/ 25", WIDTH*2/3+15,60);
    ctx2d.font="10pt " + MAIN_FONTNAME + ","+ JAPANESE_FONTNAME;
    if(battleStatus==4 || nextScene == 4){//終了アニメーション中は結果画面の表示と矛盾がないようにする
        ctx2d.fillText("KPM: " +processShowData(Number(battleResult.kpm).toFixed(1)),146,HEIGHT*1.5/3+35);
        ctx2d.fillText("ACC: " +processShowData(Number(battleResult.acc).toFixed(1))+"%",141.5,HEIGHT*1.5/3+50);
    } else{
        ctx2d.fillText("KPM: " +processShowData(Number((battleResult.totalStroke-battleResult.totalMiss)/(t-battleResult.startTime-totalLossTime)*60000).toFixed(1)),146,HEIGHT*1.5/3+35);
        ctx2d.fillText("ACC: " +processShowData(Number((battleResult.totalStroke-battleResult.totalMiss)/battleResult.totalStroke*100).toFixed(1))+"%",141.5,HEIGHT*1.5/3+50);    
    }
    if(battleStatus==0 && t-battleAni < BATTLE_ANI){ //開始時のアニメーション
        let battleOpeningOffset=Math.floor(30-(9*1030/(1000*((t-battleAni-250)/1000)+9/1000))-1);
        if(isNaN(battleOpeningOffset)) battleOpeningOffset=WIDTH;
        ctx2d.fillStyle="rgba(0,0,0,"+Math.min(1,Math.max(0,((BATTLE_ANI-(t-battleAni))/200)))+")";
        ctx2d.fillRect(0,0,WIDTH,HEIGHT);
        drawLoadingCircle(WIDTH/2,HEIGHT/2,HEIGHT/2-20,t*5,1000,Math.min(1,Math.max(0,((BATTLE_ANI-(t-battleAni))/200))),1);
        drawPrl({x1:50,y1:HEIGHT-50,x2:WIDTH*1.5/3-40,y2:HEIGHT-10,colSet:13,trans:Math.min(1,Math.max(0,((BATTLE_ANI-(t-battleAni))/200))),hoverColSet:13,hoverCounter:0,textSize:0.6,text:""});
        drawPrl({x1:60+WIDTH*1.5/3,y1:HEIGHT/2+80,x2:WIDTH-50,y2:HEIGHT/2+130,colSet:13,trans:Math.min(1,Math.max(0,((BATTLE_ANI-(t-battleAni))/200))),hoverColSet:13,hoverCounter:0,textSize:0.6,text:""});
        drawAvator(avatorData[0],Math.min(WIDTH-200,battleOpeningOffset/15)+50,HEIGHT*1/3-20,Math.min(WIDTH-200,battleOpeningOffset/15)+WIDTH*1.5/3-40,-20+HEIGHT*1/3+WIDTH*1.5/3-90,t,Math.min(1,Math.max(0,((BATTLE_ANI-(t-battleAni))/200))));
        drawAvator(enemyAvatorData,-Math.min(WIDTH-200,battleOpeningOffset/15)+WIDTH*1.5/3+40,20,-Math.min(WIDTH-200,battleOpeningOffset/15)+WIDTH-40,20+WIDTH*1.5/3-90,t,Math.min(1,Math.max(0,((BATTLE_ANI-(t-battleAni))/200))));
        ctx2d.fillStyle="rgba(255,255,255,"+(0.4+0.3*Math.sin(t/100))*Math.min(1,Math.max(0,((BATTLE_ANI-(t-battleAni))/200)))+")";
        ctx2d.font="36pt " + MAIN_FONTNAME;
        ctx2d.fillText("BATTLE!",30,60);
        ctx2d.fillStyle="rgba(255,255,255,"+Math.min(1,Math.max(0,((BATTLE_ANI-(t-battleAni))/200)))+")";
        ctx2d.font="10pt " + MAIN_FONTNAME;
        ctx2d.fillText("CP",40,HEIGHT-80);
        ctx2d.fillText("CP",WIDTH-140,HEIGHT-220);
        ctx2d.font="28pt " + MAIN_FONTNAME + "," + JAPANESE_FONTNAME;
        ctx2d.fillText(avatorData[0].name,battleOpeningOffset+70,170);
        ctx2d.fillText(enemyAvatorData.name,-battleOpeningOffset+WIDTH-300,HEIGHT-80);
        ctx2d.fillText(processShowData(Math.floor(avatorData[playData.settings[0]].cp),1),70,HEIGHT-40);
        ctx2d.fillText(processShowData(Math.floor(enemyAvatorData.cp),1),WIDTH-130,HEIGHT-180);
        ctx2d.fillStyle="rgba(200,0,0,"+Math.min(1,Math.max(0,((BATTLE_ANI-(t-battleAni))/200)))+")";
        let effectVSTrans = 1-Math.min(1,Math.max(0,((BATTLE_ANI-(t-battleAni))-1400)/50));
        ctx2d.fillStyle="rgba(200,0,0,"+effectVSTrans+")";
        let effectFontSize=28*(1-1/1.1+1/(effectVSTrans+0.1));
        ctx2d.font=effectFontSize+"pt " + MAIN_FONTNAME + "," + JAPANESE_FONTNAME;
        ctx2d.fillText("VS",(WIDTH-ctx2d.measureText("VS").width)/2,HEIGHT/2+4);
        drawTeamCircle(37+battleOpeningOffset,157,16,avatorData[0].team,Math.min(1,Math.max(0,((BATTLE_ANI-(t-battleAni))/200))));
        drawTeamCircle(-battleOpeningOffset+WIDTH-333,HEIGHT-93,16,enemyAvatorData.team,Math.min(1,Math.max(0,((BATTLE_ANI-(t-battleAni))/200))));
        drawPrl({x1:WIDTH/2-120,y1:HEIGHT-75,x2:WIDTH/2-110+180,y2:HEIGHT-85+43,colSet:2,trans:Math.min(1,Math.max(0,((BATTLE_ANI-(t-battleAni))/200))),hoverColSet:2,hoverCounter:0,textSize:0.6,text:""});
        drawPrl({x1:WIDTH/2-120+120,y1:HEIGHT-85-70,x2:WIDTH/2-110+300,y2:HEIGHT-85-37,colSet:2,trans:Math.min(1,Math.max(0,((BATTLE_ANI-(t-battleAni))/200))),hoverColSet:2,hoverCounter:0,textSize:0.6,text:""});
        if(t-battleAni < BATTLE_ANI-200){
            drawStar(avatorData[0],WIDTH/2-110,HEIGHT-73,30);
            drawStar(enemyAvatorData,WIDTH/2+10,HEIGHT-153,30);
        }
        let effectPosX=Math.max(0,(BATTLE_ANI-(t-battleAni))-1400);
        if(Math.random()<0.3 && t-battleAni<BATTLE_ANI-200) typingEffect.push({x:effectPosX+WIDTH/2+45+Math.random()*25,y:HEIGHT/3+50+Math.random()*25,col:Math.floor(enemyAvatorData.star/5),ani:0});
        if(Math.random()<0.3 && t-battleAni<BATTLE_ANI-200) typingEffect.push({x:-effectPosX+WIDTH/2-105+Math.random()*25,y:HEIGHT/3+50+Math.random()*25,col:Math.floor(avatorData[playData.settings[0]].star/5),ani:0});
    } else{
        if(battleStatus==0) battleStatus=1,battleAni=t,countDownSec=-1;//カウントダウンを開始
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
                ctx2d.arc((WIDTH+30*1.78*((battleResult.now-1)-12.5))/2+24,HEIGHT/2-70,20/((t-lossTimeT)/200+2)+10,0,Math.PI*2);
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
        if(countDownSec!= 3-Math.floor((t-battleAni)/1000) && 3-Math.floor((t-battleAni)/1000)>=1 && countDownSec!="GO") playSE("count");
        if(0 >= 3-Math.floor((t-battleAni)/1000) && countDownSec!="GO") playSE("countGo");
        countDownSec = 3-Math.floor((t-battleAni)/1000);
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
            if(battleResult.pWin){//パーフェクト勝利
                drawLoadingCircle(WIDTH/2,HEIGHT/2,battleFinishAnimation,t*1.5,1000,1);
                let pWinGrad=ctx2d.createLinearGradient(0,HEIGHT,WIDTH,0);
                pWinGrad.addColorStop(0,"rgba(200,230,250,"+Math.min(0.8,((t-battleAni)/200))+")");
                pWinGrad.addColorStop(0.4,"rgba(180,160,240,"+Math.min(0.8,((t-battleAni-200)/200))+")");
                pWinGrad.addColorStop(1,"rgba(255,255,255,"+Math.min(0.8,((t-battleAni-400)/200))+")");
                ctx2d.fillStyle=pWinGrad;
                ctx2d.fillRect(0,(HEIGHT- Math.floor((128+Math.min(124,512/((t-battleAni))))))/2-80,WIDTH, Math.floor((128+Math.min(124,512/((t-battleAni)))))+100)
                let pWinSize=Math.max(120,240-(Math.max(0,t-battleAni))/3);
                ctx2d.fillStyle=getRGBA(0,0,1);
                for(let i = 0;i  < "PERFECT!".length;i++){
                    if(t-battleFinishAnimation>i*50){
                        battleFinishAnimation = (98+Math.min(1024,1024/((t-battleAni-i*50)/5)));  
                        ctx2d.font= Math.floor(battleFinishAnimation/1.3) +"pt " + MAIN_FONTNAME;
                        ctx2d.fillText("PERFECT!".substr(i,1),(WIDTH+(i-3.5)*185)/2,HEIGHT/2+22);
                    }
                }
                ctx2d.font= "12pt " + MAIN_FONTNAME;
                ctx2d.drawImage(pWinImg,WIDTH-80-pWinSize/2,HEIGHT/2-25-pWinSize/2,pWinSize,pWinSize);
                ctx2d.fillText("PERFECT!",WIDTH-80-ctx2d.measureText("PERFECT!").width/2,HEIGHT/2+40);
            } else {
                drawLoadingCircle(WIDTH/2,HEIGHT/2,battleFinishAnimation,t*1.5,1000,1);
                ctx2d.fillStyle="rgba(160,120,0,0.8)";
                ctx2d.fillRect(0,(HEIGHT- Math.floor((128+Math.min(124,512/((t-battleAni))))))/2-80,WIDTH, Math.floor((128+Math.min(124,512/((t-battleAni)))))+100)
                ctx2d.fillStyle=getRGBA(2,0,1);
                battleFinishAnimation = (128+Math.min(1024,1024/((t-battleAni+1)/5)));
                ctx2d.font= Math.floor(battleFinishAnimation/1.3) +"pt " + MAIN_FONTNAME;
                ctx2d.fillText("W",(WIDTH-200-ctx2d.measureText("W").width)/2,HEIGHT/2+30);
                if(t-battleFinishAnimation>200){
                    battleFinishAnimation = (128+Math.min(1024,1024/((t-battleAni-200)/5)));  
                    ctx2d.font= Math.floor(battleFinishAnimation/1.3) +"pt " + MAIN_FONTNAME;
                    ctx2d.fillText("I",(WIDTH-ctx2d.measureText("I").width)/2,HEIGHT/2+30);
                }
                if(t-battleFinishAnimation >400){
                    battleFinishAnimation = (128+Math.min(1024,1024/((t-battleAni-400)/5))); 
                    ctx2d.font= Math.floor(battleFinishAnimation/1.3) +"pt " + MAIN_FONTNAME;
                    ctx2d.fillText("N",(WIDTH+200-ctx2d.measureText("N").width)/2,HEIGHT/2+30);
                }
                if(battleResult.kWin){//完全勝利
                    let kWinSize=(100+Math.min(1024,1024/((t-battleAni+1)/5))); 
                    ctx2d.font= "12pt " + MAIN_FONTNAME + "," + JAPANESE_FONTNAME;
                    let kWinText=("完全勝利!").substr(0,Math.floor(Math.max(0,(t-battleFinishAnimation-400)/5)))
                    ctx2d.drawImage(kWinImg,WIDTH-150-kWinSize/2,HEIGHT/2-25-kWinSize/2,kWinSize,kWinSize);
                    ctx2d.fillText(kWinText,WIDTH-150-ctx2d.measureText(kWinText).width/2,HEIGHT/2+40);
                } 
            }
        } else{//敗北
            ctx2d.fillStyle="rgba(0,0,20,"+ Math.min(1,(t-battleAni)/500) + ")";
            ctx2d.fillRect(0,(HEIGHT- Math.floor((128+Math.min(124,512/((t-battleAni))))))/2-80,WIDTH, Math.floor((128+Math.min(124,512/((t-battleAni)))))+100)
            ctx2d.font= 256/2.5 + "pt " + MAIN_FONTNAME;
            ctx2d.fillStyle="rgba(255,255,255,"+ Math.min(1,(t-battleAni-500)/500) + ")";
            ctx2d.fillText("LOSE",(WIDTH-ctx2d.measureText("LOSE").width)/2,HEIGHT/2+25);
        }
    }
    drawTypingEffect();
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
        if(myAvatorData[0].team == 0) tempBonus+=ITEM_DATA[0][1][3][playData.itemLevel[0][1]];
    } else if(myAvatorData[0].item[0] == 2){
        if(myAvatorData[0].team == 1) tempBonus+=ITEM_DATA[0][2][3][playData.itemLevel[0][2]];
    }else if(myAvatorData[0].item[0] == 3){
        if(myAvatorData[0].team == 2) tempBonus+=ITEM_DATA[0][3][3][playData.itemLevel[0][3]];
    }else if(myAvatorData[0].item[0] == 4){
        tempBonus+=ITEM_DATA[0][4][3][playData.itemLevel[0][4]];;
    }else if(myAvatorData[0].item[0] == 8){
        tempBonus+=ITEM_DATA[0][8][3][playData.itemLevel[0][8]];;
    }else if(myAvatorData[0].item[0] == 9){
        tempBonus+=ITEM_DATA[0][9][3][playData.itemLevel[0][9]];;
    }
    tempBonusArray[0]+=tempBonus;
    //ここからbody1
    if(myAvatorData[0].item[1] == 1){
        if(myAvatorData[0].team == 0) tempBonus+=ITEM_DATA[1][1][3][playData.itemLevel[1][1]];
    } else if(myAvatorData[0].item[1] == 2){
        if(myAvatorData[0].team == 1) tempBonus+=ITEM_DATA[1][2][3][playData.itemLevel[1][2]];
    }else if(myAvatorData[0].item[1] == 3){
        if(myAvatorData[0].team == 2) tempBonus+=ITEM_DATA[1][3][3][playData.itemLevel[1][3]];
    }else if(myAvatorData[0].item[1] == 4){
        tempBonus+=ITEM_DATA[1][4][3][playData.itemLevel[1][4]];;
    }else if(myAvatorData[0].item[1] == 8){
        tempBonus+=ITEM_DATA[1][8][3][playData.itemLevel[1][8]];
    }else if(myAvatorData[0].item[1] == 9){
        tempBonus+=ITEM_DATA[1][9][3][playData.itemLevel[1][9]];
    }
    tempBonusArray[1]+=tempBonus-tempBonusArray[0];
    //ここからbody2
    if(myAvatorData[0].item[2] == 1){
        if(myAvatorData[0].team == 0) tempBonus+=ITEM_DATA[2][1][3][playData.itemLevel[2][1]];
    } else if(myAvatorData[0].item[2] == 2){
        if(myAvatorData[0].team == 1) tempBonus+=ITEM_DATA[2][2][3][playData.itemLevel[2][2]];
    }else if(myAvatorData[0].item[2] == 3){
        if(myAvatorData[0].team == 2) tempBonus+=ITEM_DATA[2][3][3][playData.itemLevel[2][3]];
    }else if(myAvatorData[0].item[2] == 4){
        if(enemyAvatorData.kind==1 || enemyAvatorData.kind==2) tempBonus+=ITEM_DATA[2][4][3][playData.itemLevel[2][4]];
    }else if(myAvatorData[0].item[2] == 5){
        if(enemyAvatorData.kind==1 || enemyAvatorData.kind==2) tempBonus+=ITEM_DATA[2][5][3][playData.itemLevel[2][5]];
    }else if(myAvatorData[0].item[2] == 6){
        if(battleResult.acc >= 98) tempBonus+=ITEM_DATA[2][6][3][playData.itemLevel[2][6]];
    }else if(myAvatorData[0].item[2] == 7){
        if(dailyMission.detail[0].progress == dailyMission.detail[0].max && dailyMission.detail[1].progress == dailyMission.detail[1].max && dailyMission.detail[2].progress == dailyMission.detail[2].max) 
            tempBonus+=ITEM_DATA[2][7][3][playData.itemLevel[2][7]];
    }else if(myAvatorData[0].item[2] == 8){
        if(battleResult.kWin) tempBonus+=ITEM_DATA[2][8][3][playData.itemLevel[2][8]];
    }else if(myAvatorData[0].item[2] == 9){
        if(battleResult.pWin) tempBonus+=ITEM_DATA[2][9][3][playData.itemLevel[2][9]];
    }
    tempBonusArray[2]+=tempBonus-(tempBonusArray[0]+tempBonusArray[1]);
    //ここからlimbs
    if(myAvatorData[0].item[3] == 1){
        if(dailyMission.date == 6) tempBonus+=ITEM_DATA[3][1][3][playData.itemLevel[3][1]];
    } else if(myAvatorData[0].item[3] == 2){
        if(dailyMission.date == 0) tempBonus+=ITEM_DATA[3][2][3][playData.itemLevel[3][2]];
    }else if(myAvatorData[0].item[3] == 3){
        if(dailyMission.date > 0 && dailyMission.date < 6) tempBonus+=ITEM_DATA[3][3][3][playData.itemLevel[3][3]];
    }else if(myAvatorData[0].item[3] == 4){//闇の靴
        let myDate = new Date();
        if(myDate.getHours() < 5 || myDate.getHours() >= 19) tempBonus+=ITEM_DATA[3][4][3][playData.itemLevel[3][4]];
    }else if(myAvatorData[0].item[3] == 8){
        tempBonus+=ITEM_DATA[3][8][3][playData.itemLevel[3][8]];
    }else if(myAvatorData[0].item[3] == 9){
        tempBonus+=ITEM_DATA[3][9][3][playData.itemLevel[3][9]];
    }
    tempBonusArray[3]+=tempBonus-(tempBonusArray[0]+tempBonusArray[1]+tempBonusArray[2]);
    //ここから金銀銅の処理
    if(myAvatorData[0].item[0] == 5 && myAvatorData[0].item[1] == 5 && myAvatorData[0].item[3] == 5){
        tempBonus+=ITEM_DATA[0][5][3][playData.itemLevel[0][5]];
        tempBonusArray[0] = 5;
        tempBonusArray[1] = 8;
        tempBonusArray[2] = 2;
    } else if(myAvatorData[0].item[0] == 6 && myAvatorData[0].item[1] == 6 && myAvatorData[0].item[3] == 6){
        tempBonus+=ITEM_DATA[0][6][3][playData.itemLevel[0][6]];
        tempBonusArray[0] = 8;
        tempBonusArray[1] = 12;
        tempBonusArray[2] = 5;
    } else if(myAvatorData[0].item[0] == 7 && myAvatorData[0].item[1] == 7 && myAvatorData[0].item[3] == 7){
        tempBonus+=ITEM_DATA[0][7][3][playData.itemLevel[0][7]];
        tempBonusArray[0] = 10;
        tempBonusArray[1] = 20;
        tempBonusArray[2] = 5;
    }

    //ここからothers
    if(myAvatorData[0].item[4] == 1){
        tempCoin+=ITEM_DATA[4][1][3][playData.itemLevel[4][1]];
    } else if(myAvatorData[0].item[4] == 3){
        if(battleResult.acc <= 90) tempBonus+=ITEM_DATA[4][3][3][playData.itemLevel[4][3]];
    }else if(myAvatorData[0].item[4] == 4){
        if(battleResult.pWin) tempCoin+=ITEM_DATA[4][4][3][playData.itemLevel[4][4]];
    }else if(myAvatorData[0].item[4] == 5){
        if(battleResult.cp >= 500 && battleResult.win) tempBonus+=ITEM_DATA[4][5][3][playData.itemLevel[4][5]];
    }else if(myAvatorData[0].item[4] == 6){
        if(battleResult.cp >= 600 && battleResult.win) tempBonus+=ITEM_DATA[4][6][3][playData.itemLevel[4][6]];
    }else if(myAvatorData[0].item[4] == 7){
        if(battleResult.cp >= 650 && battleResult.win) tempBonus+=ITEM_DATA[4][7][3][playData.itemLevel[4][7]];
    }else if(myAvatorData[0].item[4] == 8){
        if(battleResult.cp >= 650 && battleResult.win && battleResult.acc >= 97) tempBonus+=ITEM_DATA[4][8][3][playData.itemLevel[4][8]],tempCoin+=2;
    }else if(myAvatorData[0].item[4] == 9){
        if(battleResult.cp >= 700 && battleResult.win && battleResult.acc >= 97) tempBonus+=ITEM_DATA[4][9][3][playData.itemLevel[4][9]],tempCoin+=4;
    }
    tempBonusArray[4]+=tempBonus-(tempBonusArray[0]+tempBonusArray[1]+tempBonusArray[2]+tempBonusArray[3]);
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
                if(enemyAvatorData.team == dailyMission.detail[i].team) dailyMission.detail[i].progress+=battleResult.win;
            }else if(dailyMission.detail[i].type == 4){
                if(enemyAvatorData.team == dailyMission.detail[i].team) dailyMission.detail[i].progress++;
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
                if(enemyAvatorData.team == dailyMission.detail[i].team) dailyMission.detail[i].progress+=battleResult.point;
            }else if(dailyMission.detail[i].type == 12){
                if(enemyAvatorData.team == dailyMission.detail[i].team) dailyMission.detail[i].progress+=battleResult.totalStroke-battleResult.totalMiss;
            }else if(dailyMission.detail[i].type == 13){
                if(enemyAvatorData.kind ==0) dailyMission.detail[i].progress+=battleResult.win;
            }
            if(dailyMission.detail[i].progress >= dailyMission.detail[i].max){
                //ミッション達成時
                dailyMission.detail[i].progress = dailyMission.detail[i].max;
                battleResult.achieveDailyMission[i]=1;
                battleResult.coin+=dailyMission.detail[i].achieve;
                battleResult.notice.push({
                    missionNum:i,
                    ani:t,
                    missionClearWindow:1,
                    flg:0});
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
 
    if(battleResult.totalStroke){ //アバターデータのtypingDataは特例でここで更新
        let typingAnalysis = analyzeTyping(playData.settings[0],battleResult.myTypeData);//分析結果を取得
        updateTypingData(playData.settings[0],typingAnalysis); //更新はこの関数
        battleResult.kpm = typingAnalysis.kpm;
        battleResult.acc =typingAnalysis.acc;
        if(isNaN(battleResult.acc)) battleResult.acc=0;
        if(isNaN(battleResult.kpm)) battleResult.kpm=0;
        battleResult.cp = battleResult.kpm;
        if(inputStyle) battleResult.cp*=COEF_R2K;
        battleResult.cp=Number(battleResult.cp).toFixed(1);
        if(battleResult.point == 25) {
            battleResult.kWin=1;//完全勝利
        }else{
            battleResult.kWin = 0;
        }
        if(battleResult.point == 25 && Number(battleResult.acc) == 100) {
            battleResult.pWin=1;//パーフェクト勝利
        }else{
            battleResult.pWin = 0;
        }
    }
    //ランクを算出
    if(battleResult.acc == 100){
        battleResult.accRank=0;
    } else if(battleResult.acc >= 98){
        battleResult.accRank=1;
    } else if(battleResult.acc >= 95){
        battleResult.accRank=2;
    }else if(battleResult.acc >= 93){
        battleResult.accRank=3;
    }else if(battleResult.acc >= 90){
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
    //アバター新規作成可能時の通知は最後に出す（最初にpushしておく）
    if(avatorData[inputStyle].typingData.stroke<10000 && avatorData[inputStyle].typingData.stroke +battleResult.totalStroke-battleResult.totalMiss>=10000){
        battleResult.notice.push({
            text:"新しいオンラインアバターが作成可能です！　アバター作成で50コイン獲得出来ます。今すぐオンラインアバターを作成しますか？",
            ani:t,
            btns1:{text:"あとで",onClick:function(){
                battleResult.notice.push({
                    text:"メニュー画面→オンラインアバターから、いつでも作成可能です。",
                    ani:t,
                    btns1:{text:"OK",onClick:function(){}}})
            }},
            btns2:{text:"今すぐ作成！",onClick:function(){nextScene=6,sceneAni=t}}});
    }
    //ボーナス等をセット
    battleResult.bonus[0] = Math.ceil(Math.max(0,2*battleResult.point-25)/1.5);//ワード補正
    battleResult.bonus[1] = Math.ceil(Math.pow(Math.max(0,(Number(battleResult.acc)-93)),1.5)*1.5);//正確性補正
    battleResult.bonus[2] = 0;
    if((3+avatorData[0].team-enemyAvatorData.team)%3 == 2) battleResult.bonus[2] = TEAM_BONUS;
    if((3+avatorData[0].team-enemyAvatorData.team)%3 == 1) battleResult.bonus[2] = -TEAM_BONUS;
    battleResult.bonus[3] = getItemBonus(avatorData);
    battleResult.itemBonus=getItemBonus(avatorData,1);
    battleResult.coin+=getItemBonus(avatorData,0,1);
    if(dailyMission.detail[0].progress == dailyMission.detail[0].max && dailyMission.detail[1].progress == dailyMission.detail[1].max && dailyMission.detail[2].progress == dailyMission.detail[2].max && battleResult.win) 
        battleResult.coin+=2;//すべてのミッションクリア後に勝利で１コイン獲得
    battleResult.bonus[4] = 0;//イベントボーナス
    if(dailyMission.event == avatorData[0].team+1) battleResult.bonus[2] = 25,battleResult.coin+=battleResult.win;//イベント中なら25%ボーナス、1コイン獲得
    if(dailyMission.event==4){//経験値イベント
        battleResult.bonus[4] = 20;
    } else if(dailyMission.event==5){ //ゴールドイベント
        battleResult.coin+=battleResult.win;
    }
    if(enemyAvatorData.kind == 0) battleResult.bonus[4] += 20;//ユーザーアバターの場合20%ボーナス
    if(enemyAvatorData.kind == 1) battleResult.bonus[4] += 10;//イベントアバターの場合10%ボーナス
    if(avatorData[inputStyle].cp>enemyAvatorData.cp){//自分のほうが強い
        battleResult.baseExp = Math.max(5,Math.ceil(playData.level * 6.3/5* Math.max(0.3,Math.min(2,(1+Math.atan((-Number(avatorData[inputStyle].cp) + Number(enemyAvatorData.cp))/140)*2/Math.PI)))));
    } else{//格上に勝利
        battleResult.baseExp = Math.max(5,Math.ceil(playData.level * 8/5* Math.min(2,(1+Math.atan((-Number(avatorData[inputStyle].cp) + Number(enemyAvatorData.cp))/50)*2/Math.PI))));
    }
    if(battleResult.win == 0) battleResult.baseExp= Math.floor(battleResult.baseExp/2);
    battleResult.exp = Math.round(battleResult.baseExp * (100+battleResult.bonus[0]+battleResult.bonus[1]+battleResult.bonus[2]+battleResult.bonus[3]+battleResult.bonus[4])/100);
    if(battleResult.win==1 && getBattleDataSave(enemyAvatorData.id).win == 0){
        //初勝利ボーナス
        battleResult.coin+=4;//4コイン獲得
        let tempPKN=0;
        if(battleResult.kWin) tempPKN=1;
        if (battleResult.pWin) tempPKN=2;
        battleResult.notice.push({
            ani:t,
            firstWinWindow:1,
            pknWin:tempPKN,
            flg:0});
    }
    //dailyMissionに関する更新
    dailyMission.battle++;
    dailyMission.win+=battleResult.win;
    dailyMission.totalStroke+=battleResult.totalStroke-battleResult.totalMiss;
    dailyMission.word+=battleResult.point;
    processDailyMission();
    //avatorDataに関する更新
    avatorData[inputStyle].typingData.stroke += battleResult.totalStroke-battleResult.totalMiss;
    avatorData[inputStyle].typingData.miss+=battleResult.totalMiss;
    avatorData[inputStyle].cp = avatorData[inputStyle].typingData.kpm;
    if(inputStyle) avatorData[inputStyle].cp = Number(avatorData[inputStyle].cp*COEF_R2K).toFixed(1);
    //battleDataに関する更新
    battleData.battle++;
    battleData.win += battleResult.win;
    battleData.stroke+=battleResult.totalStroke-battleResult.totalMiss;
    battleData.miss += battleResult.totalMiss;
    battleData.word+=battleResult.point;
    battleData.detail[enemyRank].battle++;
    battleData.detail[enemyRank].win+=battleResult.win;
    //battleDataSaveに関する更新
    setBattleDataSave(enemyAvatorData.id,battleResult);

    //playDataに関する更新
    let remainExp=battleResult.exp;
    while(remainExp>0){
        if(getNextLvExp(playData) <=remainExp){//レベルアップ時
            remainExp-=getNextLvExp(playData);
            playData.exp+=getNextLvExp(playData);
            playData.level++;
            battleResult.levelUp=1;
        } else{//レベルアップなし
            playData.exp+=remainExp;
            remainExp=0;
            break;
        }
    }
    if(getNextStarStroke(avatorData,battleData)  <= 0 && 
        getNextStarKPM(avatorData,battleAni).style == playData.settings[0] && 
        getNextStarKPM(avatorData,battleAni).value <= avatorData[playData.settings[0]].typingData.kpm){
        //星アップ
        avatorData[0].star++;
        avatorData[1].star++;
        battleResult.notice.push({
            ani:t,
            starUpWindow:1,
            flg:0});
    }
    playData.coin+=battleResult.coin;
    //アイテムの獲得処理はここへ
    if(battleResult.win && battleResult.acc <= 90 && playData.item[4][3]==0){//乱れ打ちの冠
        playData.item[4][3]=1;
        battleResult.notice.push({
            ani:t,
            itemGetWindow:1,
            itemNum:3,
            itemClass:4,
            flg:0});
        avatorData[1].item[4] = 3;
    }
    if(battleResult.pWin && playData.item[4][4]==0){//パーフェクトの冠
        playData.item[4][4]=1;
        battleResult.notice.push({
            ani:t,
            itemGetWindow:1,
            itemNum:4,
            itemClass:4,
            flg:0});
        avatorData[1].item[4] = 4;
    }
    if(enemyAvatorData.dropItem!=undefined && battleResult.win){
        let tempDice=Math.random();
        if(tempDice<enemyAvatorData.dropProb){
            //アイテム獲得
            let itemClass = Math.floor(enemyAvatorData.dropItem/10);
            let itemNum = enemyAvatorData.dropItem - itemClass*10;
            if(playData.item[itemClass][itemNum] == 0){//所持していない時に限り獲得
                playData.item[itemClass][itemNum]=1;
                battleResult.notice.push({
                    ani:t,
                    itemGetWindow:1,
                    itemNum:itemNum,
                    itemClass:itemClass,
                    flg:0});
            }
            avatorData[1].item[itemClass]=itemNum;
        }
    }

    saveData();
}
function processMsgBoxSE(){//msgBox関連の効果音を鳴らす関数
    if(msgBox[0].starUpWindow){
        playSE("statusUp");
        playSE("star");
    } else if(msgBox[0].missionClearWindow){
        playSE("missionClear"); 
    } else if(msgBox[0].levelUpWindow){
        playSE("statusUp");
    } else if(msgBox[0].firstWinWindow){
        playSE("statusUp");
    } else if(msgBox[0].itemGetWindow){
        playSE("statusUp");
    } else if(msgBox[0].text.substr(0,3)=="新しい"){
        playSE("statusUp");
    }
}
function processBattleEndBGM(){
    //勝負終了時の効果音を処理する関数
    processBGM(-1);//BGMを全てストップ
    if(battleResult.pWin){
        playSE("pWin");
    } else if(battleResult.win){
        playSE("win");
    } else {
        playSE("lose");
    }
    if(battleResult.pWin||battleResult.kWin) setTimeout(function(){playSE("badge");},5400)
    setTimeout(function(){playSE("exp");},4110)
    for(let i = 0;i < 7;i++){
        if(i==6){
            setTimeout(function(){playSE("bonusD");},3205+i*240)
        } else{
            setTimeout(function(){playSE("bonus");},3205+i*240)
        }
    }
}
function processBattle(){ //バトルの処理関数　制御系はここへ
    if(battleStatus==2){//打っている途中
/*        if(Math.random()<0.18) { //ランダムで打つ処理
            enemyTypedText=enemyTypedText+battleResult.wordSet[battleResult.now].enemyText.substr(enemyTypedText.length,1);
            if(Math.random()<0.1) enemyMissAni=t;
        }*/
        if(enemyTypingCharNum<battleResult.enemyTypeData[battleResult.now].length){
            if(battleResult.enemyTypeData[battleResult.now][enemyTypingCharNum].time < (t-wordT)){
                //敵が文字を打つ処理
                if(checkOpt(battleResult.wordSet[battleResult.now].enemyText,enemyTypedText+battleResult.enemyTypeData[battleResult.now][enemyTypingCharNum].char,1).isMiss){
                    enemyMissAni=t;
                } else{
                    let efX,efY=443;
                    ctx2d.font="13pt " + TYPING_FONTNAME;
                    if(enemyAvatorData.style && ctx2d.measureText(battleResult.wordSet[battleResult.now].enemyText).width>WIDTH*1.2/3){
                        ctx2d.font="10pt " + TYPING_FONTNAME;
                    }
                    if(enemyAvatorData.style == 0){
                        efX=ctx2d.measureText(enemyTypedText).width+330-ctx2d.measureText(battleResult.wordSet[battleResult.now].enemyText).width/2;
                    } else if(enemyAvatorData.style == 1){
                        efX=ctx2d.measureText(enemyTypedText).width+330-ctx2d.measureText(battleResult.wordSet[battleResult.now].enemyText).width/2;
                    } 
                    typingEffect.push({x:efX-5,y:efY-3,col:Math.floor(enemyAvatorData.star/5),ani:0});
                    playSE("typing2");
                    enemyTypedText+=battleResult.enemyTypeData[battleResult.now][enemyTypingCharNum].char;
                    battleResult.wordSet[battleResult.now].enemyText=
                        checkOpt(battleResult.wordSet[battleResult.now].enemyText,enemyTypedText,1).newTargetStr;
                }
                enemyTypingCharNum++;
            }
        }
        if(battleResult.wordSet[battleResult.now].myText.length <= typedText.length){
            ///全部ワードを打ち切っていたら 　　ワード獲得処理
            playSE("word1");
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
                if(battleResult.point == 13) winLoseAni=t, playSE("winD");
            }  else{//終端ワードの処理
                battleResult.now++;
                battleStatus=4;
                battleAni=t;
                processBattleResult();//バトルの終了処理
                processBattleEndBGM();
            }
        } else if(battleResult.wordSet[battleResult.now].enemyText.length <= enemyTypedText.length){
            ///相手が全部ワードを打ち切っていたら 　　ワード損失処理
            playSE("word2");
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
                if(battleResult.now-battleResult.point == 13) winLoseAni=-t, playSE("loseD");;
            } else{//終端ワードの処理
                battleResult.now++;
                battleStatus=4;
                battleAni=t;
                processBattleResult();//バトルの終了処理
                processBattleEndBGM();
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
    drawBattleCircle(battleResult,450,30,20,t-resultAni,1);
    drawPrl({x1:126,y1:269,x2:230,y2:275,lineWidth:0.1,shadow:0,colSet:0,hoverColSet:0,hoverCounter:0,textSize:0.6,text:""});
    drawPrl({x1:311,y1:269,x2:451,y2:275,lineWidth:0.1,shadow:0,colSet:0,hoverColSet:0,hoverCounter:0,textSize:0.6,text:""});
    drawPrl({x1:124-137*0.3,y1:406,x2:228,y2:412,lineWidth:0.1,shadow:0,colSet:0,hoverColSet:0,hoverCounter:0,textSize:0.6,text:""});
    drawPrl({x1:309-137*0.3,y1:406,x2:413,y2:412,lineWidth:0.1,shadow:0,colSet:0,hoverColSet:0,hoverCounter:0,textSize:0.6,text:""});
    //テキストここから
    drawStar(avatorData[0],131-42,421,24);
    ctx2d.drawImage(coinImg,590+2*6.3,154-2*21,30,30);
    drawAvator(avatorData[0],535-15,HEIGHT-150,652,HEIGHT-30,t,1);
    drawTeamCircle(672,394,6,avatorData[0].team,1);

    //左半分
    if(battleResult.win){
        drawPrl({x1:155,y1:168,x2:413,y2:176,lineWidth:0.1,shadow:0,colSet:3,hoverColSet:3,hoverCounter:0,textSize:0.6,text:""});        
        ctx2d.font="16pt " +  JAPANESE_FONTNAME;
        ctx2d.fillStyle=getRGBA(0,0,1);
        let resultAniChar = Math.min((enemyAvatorData.name + "に勝利した！").length,Math.floor(t-resultAni)/70);
        let resultAniCharInput = CHARA_SET[Math.floor(CHARA_SET.length*Math.random())];
        if(resultAniChar==(enemyAvatorData.name + "に勝利した！").length) resultAniCharInput="";
        ctx2d.fillText((enemyAvatorData.name + "に勝利した！").substr(0,resultAniChar) + resultAniCharInput,170,172);
    } else{
        drawPrl({x1:155,y1:168,x2:413,y2:176,lineWidth:0.1,shadow:0,colSet:16,hoverColSet:16,hoverCounter:0,textSize:0.6,text:""});        
        ctx2d.font="16pt " +  JAPANESE_FONTNAME;
        ctx2d.fillStyle=getRGBA(0,0,1);
        let resultAniChar = Math.min((enemyAvatorData.name + "に敗北した...").length,Math.floor(t-resultAni)/70);
        let resultAniCharInput = CHARA_SET[Math.floor(CHARA_SET.length*Math.random())];
        if(resultAniChar==(enemyAvatorData.name + "に敗北した...").length) resultAniCharInput="";
        ctx2d.fillText((enemyAvatorData.name + "に敗北した...").substr(0,resultAniChar) + resultAniCharInput,170,172);
    }
    drawTeamCircle(160,166,6,enemyAvatorData.team,1);
    ctx2d.fillStyle=getRGBA(0,0,1);
    ctx2d.font="12pt " +  JAPANESE_FONTNAME;
    ctx2d.fillText("本日の戦績",130,273);
    ctx2d.fillText("KPM Graph",315,273);
    ctx2d.fillText("スターランク",128-137*0.3,410);
    ctx2d.fillText("ミッション",313-137*0.3,410);
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
        ctx2d.font="7pt " +  JAPANESE_FONTNAME;//ミッション
        ctx2d.fillStyle=getRGBA(0,0,1);
        ctx2d.fillText(getMissionText(dailyMission.detail[i]),319-173*0.3-7.5*i,430 + i * 25);
        if(dailyMission.detail[i].progress != dailyMission.detail[i].max){
            let realRatio=(Math.min(1,Math.max(0,((t-resultAni)/200-5-(i))/2)));
            ctx2d.fillText(Math.floor(dailyMission.detail[i].progress*realRatio),474-ctx2d.measureText(dailyMission.detail[i].progress).width-173*0.3-7.5*(i+0.4),430 + (i+0.44) * 25);
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
        let realRatio=(Math.min(1,Math.max(0,((t-resultAni)/200-3.5-(i))/2)));
        if(i==0) ctx2d.fillText((Math.floor(realRatio*dailyMission.win)),165-(20+i*20)*0.3,293+i*20);
        if(i==1) ctx2d.fillText(Number(realRatio*dailyMission.win/dailyMission.battle*100).toFixed(1) + "%",165-(20+i*20)*0.3,293+i*20);
        if(i==3) {
            ctx2d.fillText(Math.floor(realRatio*dailyMission.word),200-(20+i*20)*0.3,293+i*20);        
        }
        if(i==4) {
            ctx2d.fillText(Math.floor(realRatio*dailyMission.totalStroke),200-(20+i*20)*0.3,293+i*20);
        }
    }

    for(let i = 0;i < 2;i++){
        for(let j = 0;j < 3;j++){
            let drawData="";
            let realRatio=(Math.min(1,Math.max(0,((t-resultAni)/200-2-(i+j))/2)));
            if(i==0 && j == 0) drawData=Math.floor(battleResult.kpm*realRatio*10)/10;
            if(i==0 && j ==1) drawData=Math.floor(battleResult.acc*realRatio*10)/10;
            if(i==0 && j == 2) {
//                drawData=Number(avatorData[0].cp*realRatio).toFixed(1);
                drawData=Number(avatorData[playData.settings[0]].cp).toFixed(1);
                let drawDataRaw=Number(avatorData[playData.settings[0]].cp).toFixed(1);
//                let drawDataRaw=Number(avatorData[0].cp).toFixed(1);
                if(drawDataRaw< battleResult.cp) ctx2d.drawImage(arrowImg,200+ctx2d.measureText(drawDataRaw).width-22*0.3*(j+1)+60,185+j*22 - (8)*Math.max(0,Math.sin(t/150)*3-2.7),15,15);
            }
            if(i==1 && j == 0) drawData=Math.floor(battleResult.point*realRatio);
            if(i==1 && j == 1) drawData=Math.floor((25-battleResult.point)*realRatio);
            if(i==1 && j == 2) drawData=Math.floor(battleResult.totalStroke*realRatio);
            ctx2d.fillText(processShowData(drawData),250-22*0.3*(j+1)+i*200,200+j*22);
            if(i == 0 && j == 1) ctx2d.fillText("%",ctx2d.measureText(drawData).width+260-22*0.3*(j+1)+i*180,200+j*22);
        }
    }
    let realRatio=(Math.min(1,Math.max(0,((t-resultAni)/200-3.5-(0))/2)));
    ctx2d.fillText(Math.floor(realRatio*(dailyMission.battle-dailyMission.win)),235-(20+0*20)*0.3,293+0*20);
    ctx2d.fillText(processShowData(getNextStarStroke(avatorData,battleData)),198-174*0.3,468);
    if(!getNextStarKPM(avatorData,battleData).value){
        ctx2d.fillText(processShowData("---"),198-195*0.3,489);
    } else{
        ctx2d.fillText(processShowData(getNextStarKPM(avatorData,battleData).value),198-195*0.3,489);
    }

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
            ctx2d.lineTo(getGraphPos(0.98,1-(i*strokeHeight-graphMinCP)/(graphMaxCP-graphMinCP)).x,getGraphPos(1,1-(i*strokeHeight-graphMinCP)/(graphMaxCP-graphMinCP)).y);
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
            ctx2d.fillText(BONUS_NAME[i-1],615-i*6.3,167+i*21);
            ctx2d.fillText("%",865-i*6.3,169+i*21);
        } else{
            ctx2d.font="12pt " + DIGIT_FONTNAME + ","+JAPANESE_FONTNAME;            
            ctx2d.fillText("合計ボーナス",605-i*6.3,169+i*21);
            ctx2d.fillText("%",865-i*6.3,169+i*21);
        }
    }
    ctx2d.font="10pt " + DIGIT_FONTNAME + ","+JAPANESE_FONTNAME;
    ctx2d.fillStyle=getRGBA(2,0,1);
    realRatio=(Math.min(1,Math.max(0,((t-resultAni)/200-2.5)/2)));
    ctx2d.fillText("所持：" + Math.floor(realRatio*playData.coin) + "ゴールド",620+2*6.3,174-2*21);
    for(let i = 0;i < 7 ;i++){
        let transExpBonus=Math.max(0,Math.min(1,(t-resultAni)/200-3-i*1.2));
        ctx2d.fillStyle=getRGBA(0,0,transExpBonus);
        if(i==0){
            ctx2d.font=(8*(1/(transExpBonus+0.1)-1/1.1)+10)+"pt " + DIGIT_FONTNAME + ","+JAPANESE_FONTNAME;
            ctx2d.fillText(battleResult.baseExp,840-i*6.3,169+i*21);
        } else if(i!=6){
            ctx2d.font=(8*(1/(transExpBonus+0.1)-1/1.1)+10)+"pt " + DIGIT_FONTNAME + ","+JAPANESE_FONTNAME;
            if(battleResult.bonus[i-1] > 0) ctx2d.fillStyle=getRGBA(14,0,Math.min(1,(t-resultAni)/200-3-i*1.2));
            if(battleResult.bonus[i-1] < 0) ctx2d.fillStyle=getRGBA(13,0,Math.min(1,(t-resultAni)/200-3-i*1.2));
            ctx2d.fillText(battleResult.bonus[i-1],840-i*6.3-ctx2d.measureText(battleResult.bonus[i-1]).width/2,167+i*21);
            if(battleResult.bonus[i-1] >0){
                ctx2d.drawImage(arrowImg,890-i*6.3,156+i*21 - (5)*Math.max(0,Math.sin(t/150)*3-2.7),15,15);
            }
        } else{
            ctx2d.font=(8*(1/(transExpBonus+0.1)-1/1.1)+12)+"pt " + DIGIT_FONTNAME + ","+JAPANESE_FONTNAME;
            if(battleResult.bonus[0] + battleResult.bonus[1] + battleResult.bonus[2] + battleResult.bonus[3] + battleResult.bonus[4] >0){
                ctx2d.drawImage(arrowImg,890-i*6.3,156+i*21 - (5)*Math.max(0,Math.sin(t/150)*3-2.7),15,15);
                ctx2d.fillStyle=getRGBA(14,0,Math.min(1,(t-resultAni)/200-3-i*1.2));
            }
            ctx2d.fillText(battleResult.bonus[0]+battleResult.bonus[1]+battleResult.bonus[2]+battleResult.bonus[3]+battleResult.bonus[4],825-i*6.3,169+i*21);
        }
        if(i ==3){
            drawPrl({x1:715-2*6.3,y1:176+2*21,x2:715-2*6.3+30,y2:176+2*21+15,lineWidth:1,shadow:0,isTop:1,colSet:avatorData[0].team*2+5,hoverColSet:avatorData[0].team*2+5+1,hoverCounter:0,textSize:1,text:"YOU"});
            ctx2d.fillText("VS",755-i*6.3,164+i*21);
            drawPrl({x1:720-2*6.3+45,y1:176+2*21,x2:720-2*6.3+75,y2:176+2*21+15,lineWidth:1,shadow:0,isTop:1,colSet:enemyAvatorData.team*2+5,hoverColSet:enemyAvatorData.team*2+5+1,hoverCounter:0,textSize:1,text:"ENE"});
        }
        if(i == 0){
            let pointRankColSet=13;
            if(battleResult.pointRank==0){
                pointRankColSet=16;
            }else if(battleResult.pointRank==2){
                pointRankColSet=0;
            }else if(battleResult.pointRank==1){
                pointRankColSet=3;
            } else if(battleResult.pointRank == 3){
                pointRankColSet=8;
            }
            drawPrl({x1:715-0*6.3,y1:176+0*21,x2:715-0*6.3+30,y2:176+0*21+15,lineWidth:1,shadow:0,isTop:1,colSet:pointRankColSet,hoverColSet:pointRankColSet,hoverCounter:0,textSize:1.2,text:RANK_TEXT[battleResult.pointRank]});
        }
        if(i == 1){
            let accRankColSet=13;
            if(battleResult.accRank==0){
                accRankColSet=16;
            }else if(battleResult.accRank==2){
                accRankColSet=0;
            }else if(battleResult.accRank==1){
                accRankColSet=3;
            } else if(battleResult.accRank == 3){
                accRankColSet=8;
            }
            drawPrl({x1:715-1*6.3,y1:176+1*21,x2:715-1*6.3+30,y2:176+1*21+15,lineWidth:1,shadow:0,isTop:1,colSet:accRankColSet,hoverColSet:accRankColSet,hoverCounter:0,textSize:1.2,text:RANK_TEXT[battleResult.accRank]});
        }
        if(i== 4){//エネミーボーナス
            if(enemyAvatorData.kind == 2){//COMのとき
                drawPrl({x1:715-i*6.3,y1:176+i*21,x2:726-i*6.3+30,y2:176+i*21+15,lineWidth:1,shadow:0,isTop:1,colSet:0,hoverColSet:0,hoverCounter:0,textSize:1.2,text:AVATOR_KIND_TEXT[enemyAvatorData.kind]});
            } else{
                drawPrl({x1:715-i*6.3,y1:176+i*21,x2:726-i*6.3+30,y2:176+i*21+15,lineWidth:1,shadow:0,isTop:1,colSet:3,hoverColSet:3,hoverCounter:0,textSize:1.2,text:AVATOR_KIND_TEXT[enemyAvatorData.kind]});
            }
        }
        if(i==3){//アイテムボーナス
            for(j = 0;j < 5;j++){
                if(battleResult.itemBonus[j] >0){
                    drawPrl({x1:715-i*6.3 + j * 17,y1:176+i*21,x2:726-i*6.3+8+j*17,y2:176+i*21+15,lineWidth:1,shadow:0,isTop:1,colSet:3,hoverColSet:3,hoverCounter:0,textSize:1.2,text:PARTS_TEXT_SHORT[j]});
                } else{
                    drawPrl({x1:715-i*6.3 + j * 17,y1:176+i*21,x2:726-i*6.3+8+j*17,y2:176+i*21+15,lineWidth:1,shadow:0,isTop:1,colSet:13,hoverColSet:13,hoverCounter:0,textSize:1.2,text:PARTS_TEXT_SHORT[j]});
                }
            }
        }
    }
    realRatio=(Math.min(1,Math.max(0,((t-resultAni)/200-11.5)/4.5)));
    ctx2d.fillStyle=getRGBA(0,0,1);
    if(battleResult.levelUp){//レベルアップあり　獲得経験値の表示
        let transExpBonus=Math.max(0,Math.min(1,(t-resultAni)/200-3-8*1.2));
        ctx2d.fillStyle=getRGBA(0,0,transExpBonus);
        ctx2d.font=(4*(1/(transExpBonus+0.1)-1/1.1)+12)+"pt " + DIGIT_FONTNAME + ","+JAPANESE_FONTNAME;

        ctx2d.fillText("次Lvまであと " + Math.floor(getNextLvExp(playData)+(1-realRatio)*battleResult.exp-(getLvExp(playData.level)-getLvExp(playData.level-1))) + " EXP",740-8.8*6.6,164+8.8*22);
        ctx2d.fillText("LV. " + (playData.level-1),615-8.8*6.6,164+8.8*22);
        drawPrl({x1:605-7.3*6.9,y1:169+7.3*23,x2:900-7.3*6.9,y2:173+7.3*23,colSet:13,shadow:0,lineWidth:1,hoverColSet:1,hoverCounter:0,textSize:0.6,text:""});
        drawPrl({x1:605-7.3*6.9,y1:169+7.3*23,x2:605-7.3*6.9+295*(((playData.exp-(1-realRatio)*battleResult.exp-getLvExp(playData.level-2))/(getLvExp(playData.level-1)-getLvExp(playData.level-2)))),y2:173+7.3*23,colSet:3,shadow:0,lineWidth:1,hoverColSet:1,hoverCounter:0,textSize:0.6,text:""});
        if(playData.exp-(1-realRatio)*battleResult.exp>=getLvExp(playData.level-1)){
            battleResult.levelUp=0;//レベルアップアニメーション終了
            battleResult.notice.push({
                level:playData.level,
                ani:t,
                levelUpWindow:1,
                flg:0});
        }
    } else{//レベルアップなし
        let transExpBonus=Math.max(0,Math.min(1,(t-resultAni)/200-3-9*1.2));
        ctx2d.fillStyle=getRGBA(0,0,transExpBonus);
        ctx2d.font=(4*(1/(transExpBonus+0.1)-1/1.1)+12)+"pt " + DIGIT_FONTNAME + ","+JAPANESE_FONTNAME;

        ctx2d.fillText("次Lvまであと " + Math.floor(getNextLvExp(playData)+(1-realRatio)*battleResult.exp) + " EXP",740-8.8*6.6,164+8.8*22);
        ctx2d.fillText("LV. " + playData.level,615-8.8*6.6,164+8.8*22);
        drawPrl({x1:605-7.3*6.9,y1:169+7.3*23,x2:900-7.3*6.9,y2:173+7.3*23,colSet:13,shadow:0,lineWidth:1,hoverColSet:1,hoverCounter:0,textSize:0.6,text:""});
        drawPrl({x1:605-7.3*6.9,y1:169+7.3*23,x2:605-7.3*6.9+295*(getNextLvExp(playData,1,(1-realRatio)*battleResult.exp)),y2:173+7.3*23,colSet:3,shadow:0,lineWidth:1,hoverColSet:1,hoverCounter:0,textSize:0.6,text:""});
    }
    let transExpBonus=Math.max(0,Math.min(1,(t-resultAni)/200-3-8*1.2));
    ctx2d.fillStyle=getRGBA(0,0,transExpBonus);
    ctx2d.font=(4*(1/(transExpBonus+0.1)-1/1.1)+16)+"pt " + DIGIT_FONTNAME + ","+JAPANESE_FONTNAME;
    ctx2d.fillText("獲得経験値",605-7*6.9,169+7*23);
    ctx2d.fillText("EXP",865-7*6.9,169+7*23);
    ctx2d.font="16pt " + DIGIT_FONTNAME;
    ctx2d.fillStyle=getRGBA(0,0,Math.min(1,Math.max(0,(t-resultAni)/200-12)));
    ctx2d.fillText(Math.floor(battleResult.exp*realRatio),815-7*6.9,169+7*23);
    if(battleResult.pWin){
        let transBadge=Math.max(0,Math.min(1,(t-resultAni)/200-3-10*1.2));
        let pWinSize=(20*(1/(transBadge+0.1)-1/1.1)+80);
        if(transBadge) ctx2d.drawImage(pWinImg,520-pWinSize/2,190-pWinSize/2,pWinSize,pWinSize);
        ctx2d.font="8pt " + MAIN_FONTNAME + ","+JAPANESE_FONTNAME;
        ctx2d.fillStyle=getRGBA(0,0,transBadge);
        ctx2d.fillText("PERFECT",520-ctx2d.measureText("PERFECT").width/2,235);    
    } else if(battleResult.kWin){
        let transBadge=Math.max(0,Math.min(1,(t-resultAni)/200-3-10*1.2));
        let kWinSize=(20*(1/(transBadge+0.1)-1/1.1)+80);
        if(transBadge) ctx2d.drawImage(kWinImg,520-kWinSize/2,190-kWinSize/2,kWinSize,kWinSize);
        ctx2d.font="8pt " + MAIN_FONTNAME + ","+JAPANESE_FONTNAME;
        ctx2d.fillStyle=getRGBA(0,0,transBadge);
        ctx2d.fillText("完全勝利",520-ctx2d.measureText("完全勝利").width/2,235);    
    }
    if(battleResult.coin) drawPrl({x1:765,y1:108,x2:WIDTH-19,y2:133,colSet:3,shadow:0,hoverColSet:3,hoverCounter:0,textSize:1,text:battleResult.coin + "ゴールドを獲得！"});//コイン
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
    drawPrl({x1:592,y1:140,x2:910,y2:410,shadow:0,colSet:1,hoverColSet:1,hoverCounter:0,lineWidth:3,textSize:0.95,text:""});
    drawPrl({x1:599,y1:348,x2:842,y2:406,shadow:0,colSet:1,trans:Math.min(1,Math.max(0,(t-selectPartsAni)/300-0/5)),hoverColSet:1,hoverCounter:0,lineWidth:3,textSize:0.95,text:""});
    drawPrl({x1:679,y1:60,x2:810,y2:85,colSet:14,hoverColSet:1,hoverCounter:0,shadow:0,textSize:1.3,text:"ITEM SHOP"});
    for(let i = 0;i < 5;i++){
        drawPrl({x1:467+i*23,y1:312,x2:487+i*23,y2:320,lineWidth:3,shadow:0,colSet:0,hoverColSet:0,hoverCounter:0,textSize:0.6,text:""});
        if(battleData.battle && Math.max(0,(battleData.win-battleData.battle*0.2*i)/(battleData.battle*0.2))>0) drawPrl({x1:467+i*23,y1:312,x2:469+i*23+18*Math.min(1,Math.max(0,(battleData.win-battleData.battle*0.2*i)/(battleData.battle*0.2))),y2:320,lineWidth:3,shadow:0,colSet:5,hoverColSet:0,hoverCounter:0,textSize:0.6,text:""});
    }
    drawPrl({x1:690+selectParts*50,y1:120,x2:697+selectParts*50,y2:138,lineWidth:0.1,shadow:0,colSet:13,hoverColSet:13,hoverCounter:0,textSize:0.6,text:""});
    drawAvator(avatorData[0],146,156,352,335,t,1);
    for(let i = 0;i < prls.length;i++){
        if(prls[i].isMsgBox!=1) drawPrl(prls[i]);
    }
    ctx2d.font="7pt " + JAPANESE_FONTNAME;
    ctx2d.fillStyle=getRGBA(2,0,1);
    ctx2d.fillText("セールは毎朝5時にリセット！",810,83);
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
    ctx2d.drawImage(coinImg,578,408,33,33);
    ctx2d.fillText("所持コイン",608,430);
    ctx2d.font="10pt " + JAPANESE_FONTNAME;
    ctx2d.fillText("ゴールド",769,430);
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
    ctx2d.fillText(processShowData(avatorData[playData.settings[0]].cp,1),412,242);
    ctx2d.fillText(processShowData(Number(avatorData[0].typingData.kpm).toFixed(1),1),403,272);
    ctx2d.fillText(processShowData(Number(avatorData[1].typingData.kpm).toFixed(1),1),394,302);

    ctx2d.fillText(processShowData(battleData.win),525,242);
    ctx2d.fillText(processShowData(battleData.battle-battleData.win),516,272);
    ctx2d.fillText(processShowData(Number(battleData.win/battleData.battle*100).toFixed(1))+"%",507,302);
    ctx2d.fillText(processShowData(Number(battleData.detail[0].win/battleData.detail[0].battle*100).toFixed(1))+"%",493.5,362);
    ctx2d.fillText(processShowData(Number(battleData.detail[1].win/battleData.detail[1].battle*100).toFixed(1))+"%",486,387);
    ctx2d.fillText(processShowData(Number(battleData.detail[2].win/battleData.detail[2].battle*100).toFixed(1))+"%",479.5,412);
    ctx2d.fillText(processShowData(battleData.stroke),472,437,100);
    ctx2d.fillText(processShowData(battleData.battle),464.5,462);
    ctx2d.fillText(processShowData(battleData.esc),457,487);
    ctx2d.fillText(playData.coin,759-ctx2d.measureText(playData.coin).width,430);
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
            ctx2d.fillText(getDiscountPrice(ITEM_DATA[selectParts][i][1],playData.itemDiscount[selectParts][i]),814-i*6,156+i*20);
            if(playData.itemDiscount[selectParts][i]){
                ctx2d.fillRect(798-i*6,145+i*20,20,1);
                ctx2d.font="6pt " + JAPANESE_FONTNAME;
                ctx2d.fillText(getDiscountPrice(ITEM_DATA[selectParts][i][1],0),800-i*6,148+i*20,23);
                drawPrl({x1:815-i*6-75,y1:156+i*20-11,x2:815-i*6-28,y2:156+i*20+3,lineWidth:0.1,shadow:0,colSet:3,hoverColSet:13,hoverCounter:0,trans:Math.min(1,Math.max(0,(t-selectPartsAni)/300-i/5)),textSize:1.2,text:"50%OFF"});
                ctx2d.font="8pt " + JAPANESE_FONTNAME;
                if(Math.min(1,Math.max(0,(t-selectPartsAni)/300-i/5))>0.5) ctx2d.drawImage(coinImg,795-i*6,144+i*20,18,18);
            } else{
                if(Math.min(1,Math.max(0,(t-selectPartsAni)/300-i/5))>0.5) ctx2d.drawImage(coinImg,795-i*6,144+i*20,18,18);
            }
        } else if((playData.item[selectParts][i]==0 || playData.item[selectParts][i] == 2) && ITEM_DATA[selectParts][i][1]==-1){
            ctx2d.fillText("？？？",675-i*6,156+i*20);
            if(Math.min(1,Math.max(0,(t-selectPartsAni)/300-i/5))>0.5) ctx2d.drawImage(coinImg,795-i*6,144+i*20,18,18);
            ctx2d.fillText("- - -",815-i*6,156+i*20);
        }else{
            ctx2d.fillText(ITEM_DATA[selectParts][i][0],675-i*6,156+i*20);
            if(ITEM_DATA[selectParts][i][0]!="装備なし"){
                ctx2d.fillText("購入済み",772-i*6,156+i*20);
            }
        }
    }
    ctx2d.fillStyle=getRGBA(0,0,Math.min(1,Math.max(0,(t-selectPartsAni)/300-0/5)));
    let itemExp = ITEM_DATA[selectParts][avatorData[0].item[selectParts]][2].replace("*",
                ITEM_DATA[selectParts][avatorData[0].item[selectParts]][3][playData.itemLevel[selectParts][avatorData[0].item[selectParts]]]);
    ctx2d.fillText(itemExp.substr(0,19),620,363);
    ctx2d.fillText(itemExp.substr(19,19),620-5.1,378);
    drawStrengthText(selectParts,avatorData[0].item[selectParts]);//強化関連テキストを描く
    ctx2d.font="8pt " + JAPANESE_FONTNAME;
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
    drawLoadingCircle(WIDTH-130,230,160,-t/2.3,1000);//////////動く丸
    drawLoadingCircle(280,HEIGHT-140,220,t/3.3,1000);
    for(let i = 0;i < prls.length;i++){
        if(prls[i].isMsgBox!=1 && prls[i].isTop!=1) drawPrl(prls[i]);
    }
    ctx2d.font="8pt " + JAPANESE_FONTNAME;
    ctx2d.fillStyle=getRGBA(0,0,1);
    ctx2d.fillText("並び替え",168,187);
    ctx2d.fillText("入力方式",480,187);
    ctx2d.fillText("所属チーム",580,187);
    ctx2d.fillStyle=getRGBA(2,0,1);
    if(playData.lastFetchDate==undefined){
        ctx2d.fillText("最終更新 ----/--/--",438,137);
    } else{
        ctx2d.fillText("最終更新 " + playData.lastFetchDate,438,137);
    }
    if(avatorData[createAvatorStyle].typingData.stroke<10000){
        ctx2d.fillText("アバター作成まであと" + (10000-avatorData[createAvatorStyle].typingData.stroke) + "打鍵",782,137);
    }
    for(let i = 0;i < 4;i++){
        let showNum = i+4*onlineShowPage;
        let drawLv="--",drawName="---",drawCP="---",drawAcc="---",drawDate="----/--/--";
        let baseX=118+i*130,baseY = 335;
        drawPrl({x1:87+i*130,y1:196,x2:87+i*130+190,y2:431,shadow:0,colSet:14,hoverColSet:1,lineWidth:3,hoverCounter:0,textSize:0.8,text:""});
        drawPrl({x1:87+i*130,y1:330,x2:87+i*130+150,y2:431,shadow:0,colSet:1,hoverColSet:1,lineWidth:1,hoverCounter:0,textSize:0.8,text:""});
        drawPrl({x1:baseX+100,y1:baseY-140,x2:baseX+160,y2:baseY-117,shadow:0,colSet:13,hoverColSet:1,lineWidth:0.1,hoverCounter:0,textSize:1,text:""});
        if(showEnemyAvator.length > showNum){//表示対象なら
           // draw
            drawAvator(showEnemyAvator[showNum],118+i*130,204,103+i*130+160,328,t,1);
            drawStar(showEnemyAvator[showNum],baseX-6,baseY+20,19);
            drawTeamCircle(baseX+4,baseY+8,4,showEnemyAvator[showNum].team,1)
            drawPrl({x1:baseX,y1:baseY-26,x2:baseX+30,y2:baseY-6,shadow:0,colSet:17+showEnemyAvator[showNum].style,hoverColSet:1,lineWidth:1,hoverCounter:0,textSize:1,text:INPUT_STYLE_SHORT[showEnemyAvator[showNum].style]});
            if(getBattleDataSave(showEnemyAvator[showNum].id).pWin){
                ctx2d.drawImage(pWinImg,baseX+94,baseY-37,32,32);
            } else if(getBattleDataSave(showEnemyAvator[showNum].id).kWin){
                ctx2d.drawImage(kWinImg,baseX+94,baseY-37,32,32);
            } else if(getBattleDataSave(showEnemyAvator[showNum].id).win){
                ctx2d.drawImage(nWinImg,baseX+94,baseY-37,32,32);
            }
            drawLv=showEnemyAvator[showNum].level;
            drawName=showEnemyAvator[showNum].name;
            drawCP=showEnemyAvator[showNum].cp;
            drawAcc=showEnemyAvator[showNum].typingData.acc;
            let myMonth=showEnemyAvator[showNum].date.substr(4,2);
            let showMonth = Number(myMonth)+1
            drawDate = showEnemyAvator[showNum].date.substr(0,4) + "/" + ('00'+showMonth).slice(-2) + "/" + showEnemyAvator[showNum].date.substr(6,2);

            if(showEnemyAvator[showNum].rankGen>=1 && showEnemyAvator[showNum].rankGen<=3){
                drawPrl({x1:baseX+105,y1:baseY-116,x2:baseX+152,y2:baseY-100,shadow:0,colSet:3,trans:2,hoverColSet:16,lineWidth:1,hoverCounter:0,textSize:1.2,text:"総合 "+showEnemyAvator[showNum].rankGen+"位"});
            } else if(showEnemyAvator[showNum].rankGen==4 || showEnemyAvator[showNum].rankGen==5){    
                drawPrl({x1:baseX+105,y1:baseY-116,x2:baseX+152,y2:baseY-100,shadow:0,colSet:16,trans:2,hoverColSet:16,lineWidth:1,hoverCounter:0,textSize:1.1,text:"BEST 5"});
            } else if(showEnemyAvator[showNum].rankGen>=6 && showEnemyAvator[showNum].rankGen<=10){
                drawPrl({x1:baseX+105,y1:baseY-116,x2:baseX+152,y2:baseY-100,shadow:0,colSet:1,trans:2,hoverColSet:16,lineWidth:1,hoverCounter:0,textSize:1,text:"BEST 10"});
            } 
        }else{
            drawGhost(118+i*130,204,103+i*130+160,328,t,1);
            drawPrl({x1:baseX,y1:baseY-26,x2:baseX+30,y2:baseY-6,shadow:0,colSet:13,hoverColSet:1,lineWidth:1,hoverCounter:0,textSize:1,text:""});
        }   
        
        ctx2d.fillStyle=getRGBA(0,0,1);
        ctx2d.font="10pt " + JAPANESE_FONTNAME;
        ctx2d.fillText(drawName,baseX+13,baseY+13,100);
        ctx2d.font="10pt " + MAIN_FONTNAME;
        ctx2d.fillText("CP ",baseX-12,baseY+56);
        ctx2d.fillText(processShowData(drawCP,1),baseX+20,baseY+56);
        ctx2d.font="8pt " + MAIN_FONTNAME;
        ctx2d.fillText("ACC",baseX-15.6,baseY+72);
        ctx2d.fillText(processShowData(drawAcc,1),baseX+16.6,baseY+72);
        ctx2d.font="8pt " + MAIN_FONTNAME + "," + JAPANESE_FONTNAME;
        ctx2d.fillText("更新 " + drawDate,baseX-21.8,baseY+90);
        ctx2d.fillStyle=getRGBA(2,0,1);
        ctx2d.font="9pt " + MAIN_FONTNAME + "," + JAPANESE_FONTNAME;
        ctx2d.fillText("LV " + drawLv,baseX+150-ctx2d.measureText("LV " + drawLv).width,baseY-124);
    }

    if(avatorData[createAvatorStyle].uploaded==0 && getAvailableCreateAvator()==1){
        drawPrl({x1:836,y1:142,x2:940,y2:158,shadow:0,colSet:16,hoverColSet:4,lineWidth:3,hoverCounter:0,textSize:1.2,text:"50ゴールド獲得！",onClick:function(){}});
    }
    //画面右側　自分のアバター
    drawPrl({x1:732,y1:192,x2:916,y2:330,shadow:0,colSet:14,hoverColSet:1,lineWidth:3,hoverCounter:0,textSize:0.8,text:""});
    drawPrl({x1:850,y1:192,x2:916,y2:217,shadow:0,colSet:13,hoverColSet:1,lineWidth:0.1,hoverCounter:0,textSize:0.8,text:""});
    drawAvator(avatorData[0],744,199,894,333,t,1);
    ctx2d.font="9pt " + MAIN_FONTNAME;
    ctx2d.fillStyle=getRGBA(2,0,1);
    ctx2d.fillText("LV " + playData.level,905-ctx2d.measureText("LV " + playData.level).width,209);
    drawPrl({x1:840,y1:333,x2:875,y2:353,shadow:0,colSet:17+createAvatorStyle,hoverColSet:1,lineWidth:1,hoverCounter:0,textSize:1.2,text:INPUT_STYLE_SHORT[createAvatorStyle]});
    ctx2d.font="12pt " + JAPANESE_FONTNAME;
    ctx2d.fillStyle=getRGBA(0,0,1);
    ctx2d.fillText(avatorData[createAvatorStyle].name,745,351,96);
    ctx2d.font="10pt " + MAIN_FONTNAME;
    ctx2d.fillText("CP " + processShowData(avatorData[createAvatorStyle].cp,1),714,400);
    ctx2d.font="8pt " + MAIN_FONTNAME;
    ctx2d.fillText("ACC " + processShowData(avatorData[createAvatorStyle].typingData.acc,1),796,400);
    drawTeamCircle(735,347,5,avatorData[createAvatorStyle].team,1);
    drawStar(avatorData[0],720,359,20);
    for(let i = 0;i < prls.length;i++){
        if(prls[i].isMsgBox!=1 && prls[i].isTop==1) drawPrl(prls[i]);
    }

    //ローディング中の表示
    if(dataFetchStatus==0){
        drawLoadingCircle(370,310,80,t,1000,1,1);//////////動く丸
        ctx2d.fillStyle=getRGBA(2,500,t);
        ctx2d.fillText("LOADING...",340,310);
    } else if(dataFetchStatus==2){
        drawPrl({x1:200,y1:285,x2:570,y2:320,shadow:0,colSet:13,hoverColSet:1,lineWidth:1,hoverCounter:0,textSize:1,text:"データの取得に失敗しました。"});
    } else if(dataFetchStatus==1 && showEnemyAvator.length==0){
        drawPrl({x1:180,y1:285,x2:590,y2:320,shadow:0,colSet:13,hoverColSet:1,lineWidth:1,hoverCounter:0,textSize:1,text:"該当するアバターデータがありません。"});
    }
    if(dataSaveStatus==0){//アップロード中の表示
        drawLoadingCircle(800,310,50,t,1000,1,1);//////////動く丸
        ctx2d.fillStyle=getRGBA(2,500,t);
        ctx2d.fillText("LOADING...",770,310);
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
function drawStrengthText(parts,num){
    //強化出来ない場合の例外処理をあとで追加　現状はundefined表示
    ctx2d.fillText("LV" + (playData.itemLevel[parts][num]+1),660-5.1,400);
    let strengthItem="ボーナス";
    let strengthItem2="%";
    if(parts==4 && num == 4 || parts==4 && num == 1) strengthItem="コイン",strengthItem2="";//PF冠のみ例外
    ctx2d.font="7pt " + JAPANESE_FONTNAME;
    ctx2d.fillText(strengthItem,690-5.1,400);
    ctx2d.fillText(ITEM_DATA[parts][num][3][(playData.itemLevel[parts][num])] + strengthItem2,733-ctx2d.measureText(ITEM_DATA[parts][num][3][(playData.itemLevel[parts][num])] + strengthItem2).width/2,400);
    if (ITEM_DATA[parts][num][3].length-1>playData.itemLevel[parts][num]){
        ctx2d.fillText(">",750-5.1,400);
        ctx2d.fillText(ITEM_DATA[parts][num][3][(playData.itemLevel[parts][num]+1)] +strengthItem2,763-ctx2d.measureText(ITEM_DATA[parts][num][3][(playData.itemLevel[parts][num]+1)] +strengthItem2).width/2,400);
        ctx2d.fillText(getStrengthMoney(parts,num),797-5.1,400);
    } else {
        ctx2d.fillText("> - - -",750-5.1,400);
        ctx2d.fillText("---",800-5.1,400);
    }
    ctx2d.drawImage(coinImg,773,384,25,25);
}
function processStrength(parts,num){
    //強化を実行する関数
    if(getStrengthAvailable(parts,num)==0) return 0;
    if(getStrengthAvailable(parts,num)==1){
        msgBox.push({
            text:"強化に必要なお金が足りません。",
            ani:t,
            btns1:{text:"OK",onClick:function(){}}});
        return 0;
    }
    msgBox.push({
        text:getStrengthMoney(parts,num) + "ゴールドを消費して、アイテム" + ITEM_DATA[parts][num][0]+"を強化しますか？",
        ani:t,
        btns1:{text:"YES",onClick:function(){
            playData.coin=Math.max(0,playData.coin-getStrengthMoney(parts,num));
            playData.itemLevel[parts][num]++;
            saveData();
            setItemButtons(selectParts);
            msgBox.push({//何かここに強化の演出を追加したい
                text:"アイテム"+ITEM_DATA[parts][num][0]+"を強化しました！",
                ani:t,
                btns1:{text:"OK",onClick:function(){}}});    
        }},
        btns2:{text:"NO",onClick:function(){}}});
}
function getStrengthMoney(parts,num){
    //強化に必要なお金を計算　基本、アイテムの値段で固定 -1のものは例外処理
    let strengthMoney= Math.floor(ITEM_DATA[parts][num][1] * (0.6+playData.itemLevel[parts][num]/4));
    if(strengthMoney<0) strengthMoney= Math.floor(ITEM_DATA[parts][num][4] * (0.6+playData.itemLevel[parts][num]/4));
    return strengthMoney;
}
function getStrengthAvailable(parts,num){
    //強化可能かどうかを判定 0なら不可能（レベルマックスor未所持）　1ならお金が足りない　2なら可能
    if(playData.itemLevel[parts][num] >= ITEM_DATA[parts][num][3].length-1) return 0;
    if(playData.item[parts][num]!=1) return 0;
    if(playData.coin < getStrengthMoney(parts,num)) return 1;
    return 2;
}
function setDiscount(){//割引額をセットする関数
    for(let i = 0;i < 5;i++){
        for(let j = 0;j < 10;j++){
            //ここに割引をセットする処理を追加
            playData.itemDiscount[i][j] = 0;
            if(getPseudoRandom(30+j,13+10*i+j) < 2){
                playData.itemDiscount[i][j]=1;
            }
        }
    }
}
function getDiscountPrice(price,discount){
    //値引き後の値段を返す関数
    if(discount) return Math.ceil(price/2);
    return price;
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
                prls[i].sound="cursor";
            } else if(playData.item[parts][prls[i].id] == 1){
                prls[i].text="装備中";
                prls[i].colSet=13;
                prls[i].hoverColSet=13;
                prls[i].sound="cursor";
            } else if(playData.item[parts][prls[i].id] == 2){
                prls[i].text="購入";
                prls[i].colSet=3;
                prls[i].hoverColSet=4;
                prls[i].sound="cursor";
            } else if(playData.item[parts][prls[i].id] == 3){
                prls[i].text="装備";
                prls[i].colSet=3;
                prls[i].hoverColSet=4;
                prls[i].sound="puton";
            } 
        } else if(prls[i].id==99){//強化ボタンなら
            if(0!=getStrengthAvailable(selectParts,avatorData[0].item[parts])){
                prls[i].colSet=3;
                prls[i].hoverColSet=4;
            } else {
                prls[i].colSet=13;
                prls[i].hoverColSet=13;
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
        if(playData.coin < getDiscountPrice(ITEM_DATA[parts][num][1],playData.itemDiscount[parts][num])){
            msgBox.push({
                text:"コインが足りません。",
                ani:t,
                btns1:{text:"OK",onClick:function(){}}});
        } else{
            msgBox.push({
                text:ITEM_DATA[parts][num][0] + "を購入しますか？",
                ani:t,
                btns1:{sound:"buy",text:"YES",onClick:function(){
                    for(let i = 0;i < 10;i++) {
                        if(playData.item[parts][i] == 1) playData.item[parts][i] = 3;
                        if(playData.item[parts][i] == 2) playData.item[parts][i] = 0; 
                    }
                    playData.item[parts][num] = 1;
                    playData.coin-=getDiscountPrice(ITEM_DATA[parts][num][1],playData.itemDiscount[parts][num]);
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
                btns2:{sound:"cancel",text:"NO",onClick:function(){
                }}});

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
function playPrlSE(myPrl){
    if (myPrl.sound!=undefined){
        playSE(myPrl.sound);
    }else if(myPrl.colSet==13){
        playSE("error");
    } else if(myPrl.colSet==3){
        playSE("enter");
    } else {
        playSE("cursor");
    }
}
function processClick(){
    for(var i = 0;i < prls.length;i++){
        if(sceneAni==0) {
            if(clickY>prls[i].y1 && clickY<prls[i].y2 && clickX>prls[i].x1+(prls[i].y2-prls[i].y1)*0.3 && clickX<prls[i].x2-(prls[i].y2-prls[i].y1)*0.3){
                if(!(msgBox.length && prls[i].isMsgBox!=1) && prls[i].onClick!=undefined){ //メッセージボックス表示中なら、メッセージボックス以外スルー　onclickが定義されていない場合もスルー
                    playPrlSE(prls[i]);
                    prls[i].onClick();
                    clickX=0,clickY=0;
                    if(prls[i].isMsgBox&& prls[i].noDestruct!=1)  msgBox[0].ani=t,msgBox[0].flg=2;
                } 
            }
        }
    }
}
function playSE(strAr){
    let offSE=0;
    let offTyp=0;
    let offETyp=0;
    let offMiss=0;
    if(playData!=undefined){
        offSE=playData.settings[4];
        offTyp=playData.settings[5];
        offETyp=playData.settings[7];
        offMiss=playData.settings[6];    
    }
    strEach=strAr.split(" ");
    for(let i = 0;i < strEach.length;i++){
        str=strEach[i];
        if(offSE) return 0;
        if(str=="typing1"){//タイピングの効果音
            if(offTyp) return 0;
            se[17].play();
        } else if(str=="typing2"){
            if(offETyp) return 0;
            se[16].play();
        }else if(str == "miss"){//ミス時の効果音
            if(offMiss) return 0;
            se[21].play();
        } else if(str == "enter"){//決定時の効果音
            se[2].play();
        } else if(str == "enterS"){//重要な決定時の効果音
            //未実装
        } else if(str == "cancel"){//キャンセル時の効果音
            se[4].play();
        } else if(str == "count"){//カウントダウン時の効果音
            se[20].play();
        }else if(str == "countGo"){//カウントダウン時の効果音
            se[22].play();
        }else if(str == "cursor"){//カーソルをあわせた時の効果音
            se[6].play();
        }else if(str == "buy"){//購入した時の効果音
            se[7].play();
        } else if(str=="puton"){//装着時の効果音
            se[9].play();
        } else if(str == "esc"){//エスケープ
            se[8].play();
        } else if(str=="error"){//エラー
            se[10].play();
        } else if(str=="window"){//ウィンドウ
            se[11].play();
        } else if(str=="battle"){//バトル
            if(!firstLaunchFlg) se[12].play();
//            se[12].play();
        } else if(str=="battleStart"){//バトルスタート
            se[13].play();
        }else if(str == "winD"){//勝ち確定
            se[14].play();
        } else if(str=="loseD"){//負け確定
            se[15].play();
        } else if(str=="word1"){//ワード獲得自分
            se[18].play();
        } else if(str=="word2"){//ワード獲得相手
            se[19].play();
        } else if(str == "win"){//勝ち
            se[23].play();
        } else if(str == "lose"){//負け
            se[24].play();
        } else if(str == "statusUp"){//ステータスアップ
            se[25].play();
        } else if(str == "missionClear"){//ミッションクリア
            se[26].play();
        } else if(str == "msg"){//メッセージの表示
            se[27].play();
        } else if(str=="exp"){//経験値
            se[28].play();
        } else if(str == "pWin"){//パーフェクト勝利
            se[29].play();
        } else if(str == "bonus"){//ボーナス
            se[30].play();
        } else if(str == "bonusD"){//ボーナス確定
            se[31].play();
        } else if(str == "badge"){//バッジ
            se[32].play();
        } else if(str == "screenshot"){//スクショ
            se[33].play();
        } else if(str=="star"){//スターアップ
            se[34].play();
        }
    }
}
function processBGM(prev,next){
    //BGMの再生とストップを管理する関数
    if(playData==undefined) return 0;
    bgm[0].stop();
    bgm[1].stop();
    bgm[2].stop();
    bgm[3].stop();
    bgm[4].stop();
    bgm[5].stop();
    bgm[6].stop();
    bgm[7].stop();
    if(playData.settings[3]) return 0;
    if(prev==-1) return 0;
    let bgmNum=0;
    if(next==2){
        let myDate = new Date();
        myDate.setHours(myDate.getHours() - 5);
        if(myDate.getSeconds()==0) myDate.setMinutes(myDate.getMinutes() - 1);
        bgmNum=1;//1,2から選ぶ
        if(myDate.getDay % 2) bgmNum=2;//1,2から選ぶ
    } 
    if(next==3) {
        bgmNum=0;//0,4,5,6から選ぶ
        if(enemyAvatorData.cp - avatorData[playData.settings[0]].cp > 20){
            bgmNum = 5;
        } else if(enemyAvatorData.cp - avatorData[playData.settings[0]].cp > 7){
            bgmNum = 0;
        } else if (enemyAvatorData.cp - avatorData[playData.settings[0]].cp > -7){
            bgmNum = 4;
        } else{
            bgmNum = 6;
        }
    }
    if(next==4) bgmNum=3;//結果画面
    if(next==5) bgmNum=7;
    if(next==6 || next==7) bgmNum=7;
    if(next!=1) {
        if(next==3){
            lastBGMID = setTimeout(function(){
                if(scene == 3 && !sceneAni) bgm[bgmNum].play();},4700)
        } else{
            bgm[bgmNum].play(),bgm[bgmNum].fade(0,1,1000);
        }
    }
}
function getBattleResultText(twitterMode){
    let spChar="\n";
    if(twitterMode) spChar="%0a";
    //バトルの結果をコピーする関数
    let text="";
    if(twitterMode) text+="『AVA-TYPE』で";
    text +=enemyAvatorData.name + "(CP:" +enemyAvatorData.cp +")に";
    if(battleResult.pWin){
        text+="【✨パーフェクト勝利！】";
    } else if(battleResult.kWin){
        text+="【👑完全勝利！】";
    } else if(battleResult.win){
        text+="勝利！"
    } else {
        text+="敗北...";
    }
    text+=spChar;
    text+="WORD: " + battleResult.point + " / 25"+spChar;
    text+="CP:" + battleResult.cp + " ACC:" + battleResult.acc;
    text+=spChar+spChar;
    for(let i = 0;i <battleResult.words.length;i++){
        if(battleResult.words[i]==1){
            text+="🔶"
        } else if(battleResult.words[i]==2){
            text+="⬛"
        } else{
            text+="・"
        }
        if(i % 5 == 4) text+=spChar;
    }
    return text;
}

function changeScene(prev,next){ //シーン遷移の関数
    prls=[];
    msgBox=[];
    ctx2dImg.clearRect(0,0,WIDTH,HEIGHT);
    ctx2dSt.clearRect(0,0,WIDTH,HEIGHT);
    ctx2dSt2.clearRect(0,0,WIDTH,HEIGHT);
    clickX=0,clickY=0;
    if(next==1){ //タイトル画面に遷移する場合
        ctx2dImg.fillStyle="rgba(0,0,0,1)";
        ctx2dImg.drawImage(backImg[4],0,0,WIDTH,HEIGHT);
        prls.push({x1:WIDTH/2-100,y1:HEIGHT/2+50,x2:WIDTH/2+100,y2:HEIGHT/2+100,colSet:0,hoverColSet:1,hoverCounter:0,sound:"battle",text:"START",onClick:function(){
            if(firstLaunchFlg){ //初回起動時
                msgBox.push({
                    text:"AVA-TYPEへようこそ！　まずはアバターの作成を行いましょう。",
                    ani:t,
                    btns1:{text:"OK",onClick:function(){ //アバター作成の初期ウィンドウを表示
                        resetData();
                        msgBox.push({createAvatorWindow:1,
                        text:"",
                        ani:t+200,
                        flg:0,
                        });}}});
            } else{
                loadData();
                prls[0].colSet=13;
                prls[0].hoverColSet=13;
                nextScene=2;sceneAni=t;
            }
        }})
    } else if(next == 2){//メニュー
        ctx2dImg.drawImage(backImg[0],0,0,WIDTH,HEIGHT);
        drawMenuOnce();
        prls.push({x1:574,y1:110,x2:873,y2:205,colSet:0,hoverColSet:1,hoverCounter:0,textSize:0.5,sound:"cursor",text:"ONLINE",subText:"オンラインアバター",onClick:function(){
            nextScene=6,sceneAni=t;}})
        prls.push({x1:WIDTH-55,y1:65,x2:WIDTH-4,y2:85,colSet:0,hoverColSet:1,hoverCounter:0,lineWidth:2,shadow:0,textSize:1.2,sound:"cursor",text:"TITLE",onClick:function(){
            msgBox.push({
                text:"本当にタイトルに戻りますか？",
                ani:t,
                btns1:{text:"OK",onClick:function(){nextScene=1;sceneAni=t}},
        btns2:{text:"CANCEL",sound:"cancel",onClick:function(){return 0;}}});}})
        prls.push({x1:WIDTH-90,y1:65,x2:WIDTH-55,y2:85,colSet:0,hoverColSet:1,hoverCounter:0,lineWidth:2,shadow:0,textSize:1.2,sound:"cursor",text:"？",onClick:function(){
            msgBox.push({ani:t,generalHelpWindow:1,currentPage:0})}})
        prls.push({x1:540,y1:225,x2:843,y2:320,colSet:0,hoverColSet:1,hoverCounter:0,textSize:0.5,sound:"enter",text:"SETTING",subText:"設定",onClick:function(){
            nextScene=7,sceneAni=t;
            for(let i = 0;i < 9;i++){previousSettings[i] = playData.settings[i]}}})
//        let onlineAvatorMenuCol=0,onlineAvatorMenuText="オンラインアバター";
 //       prls.push({x1:700,y1:35,x2:831,y2:54,colSet:onlineAvatorMenuCol,hoverColSet:onlineAvatorMenuCol+1,hoverCounter:0,textSize:1,lineWidth:2,textSize:1.2,shadow:0,text:onlineAvatorMenuText,onClick:function(){
   //         nextScene=6,sceneAni=t;}})
        prls.push({x1:540,y1:340,x2:861,y2:495,colSet:1,hoverColSet:1,hoverCounter:0,textSize:0.6,text:"",rev:1,onClick:function(){
            return 0;}})
        prls.push({x1:100,y1:110,x2:578,y2:320,colSet:0,hoverColSet:1,hoverCounter:0,textSize:0.4,sound:"window",text:"BATTLE!",subText:"対戦",rev:0,onClick:function(){
            msgBox.push({selectBattleAvatorWindow:1,ani:t});}})
        prls.push({x1:100,y1:340,x2:558,y2:495,colSet:0,hoverColSet:1,hoverCounter:0,textSize:0.4,sound:"enter",text:"AVATOR",subText:"アバター",rev:1,onClick:function(){
            nextScene=5,sceneAni=t;}})
        if(firstLaunchFlg) {
            saveData();
            setAvatorData(0);
            saveData();
            msgBox.push({ani:t,generalHelpWindow:1,currentPage:0});
        }
    }  else if(next==3){//試合
        battleStatus=0;//バトル開始のアニメーションモードへ
        enemyAvatorData = localAvator[selectBattleAvatorClass][selectBattleAvator];
        setBattleResultDefault();//バトルデータのセットを呼び出し
        refreshWord(1);
        ctx2dImg.drawImage(backImg[1],0,0,WIDTH,HEIGHT);

    } else if(next==4){//試合結果
        ctx2dImg.drawImage(backImg[3],0,0,WIDTH,HEIGHT);//負けたら4
        prls.push({x1:30,y1:30,x2:450,y2:133,colSet:14,hoverColSet:14,hoverCounter:0,textSize:0.85,text:"RESULT"});
        prls.push({x1:685,y1:HEIGHT-160,x2:WIDTH-25-75,y2:HEIGHT-100,colSet:0,hoverColSet:1,hoverCounter:0,textSize:0.8,sound:"battle battleStart",text:"RETRY",subText:"再戦",onClick:function(){
        if(t-resultAni < 2500){
            t=resultAni+2500;
        } else{
            //リトライ処理
            sceneAni=t;
            nextScene=3;////バトル開始ボタン　敵データのセットなどをここにおく
            battleAni=t;//バトル開始時のアニメーション
        } 
        }});
        prls.push({x1:664,y1:HEIGHT-90,x2:WIDTH-25-96,y2:HEIGHT-30,colSet:0,hoverColSet:1,hoverCounter:0,textSize:0.8,sound:"cancel",text:"BACK",subText:"戻る",onClick:function(){
            if(t-resultAni < 2500){
                t=resultAni+2500;
            } else{
                //メニューへ戻る
                nextScene=2;
                sceneAni=t;
            } 
        }});
        prls.push({x1:WIDTH-65,y1:148,x2:WIDTH-38,y2:165,lineWidth:2,shadow:0,isTop:1,colSet:13,hoverColSet:14,hoverCounter:0,textSize:1,sound:"window",text:"？",onClick:function(){
            msgBox.push({bonusHelpWindow:1,
                text:"",
                ani:t,
                flg:0});
            }});//ボーナスのヘルプウィンドウ
        prls.push({x1:490,y1:110,x2:545,y2:133,lineWidth:3,shadow:0,isTop:1,colSet:0,hoverColSet:1,hoverCounter:0,textSize:1,sound:"window",text:"Copy",onClick:function(){
            //結果のコピー
            if(navigator.clipboard){
                 navigator.clipboard.writeText(getBattleResultText())
                    .then(() => { 
                        msgBox.push({
                            text:"バトルの結果をクリップボードにコピーしました！",
                            ani:t,
                            btns1:{text:"OK",onClick:function(){}}});
                        })
                    .catch(err => {
                        msgBox.push({
                            text:"バトル結果のコピーに失敗しました。",
                            ani:t,
                            btns1:{text:"OK",onClick:function(){}}});
                })
            } else{
                msgBox.push({
                    text:"バトル結果のコピーに失敗しました。",
                    ani:t,
                    btns1:{text:"OK",onClick:function(){}}});
            }
        }});
        prls.push({x1:435,y1:110,x2:490,y2:133,lineWidth:3,shadow:0,isTop:1,colSet:0,hoverColSet:1,hoverCounter:0,textSize:1,sound:"window",text:"Tweet",onClick:function(){
            //結果のツイート
            window.open("https://twitter.com/share?url=https://typworld.net/avatype/&text=" + 
            getBattleResultText(1) + "%0a%23AVATYPE %23タイピング %23TypWorld" 
            + "&count=none&lang=ja");
            }});
        prls.push({x1:545,y1:110,x2:600,y2:133,lineWidth:3,shadow:0,isTop:1,colSet:0,hoverColSet:1,hoverCounter:0,textSize:1,sound:"screenshot",text:"ScShot",onClick:function(){
            drawImgToMainCanvas();
            drawResult();
            let resultCanvas=document.getElementById("myCanvas");
            var a = document.createElement('a');
            a.href = resultCanvas.toDataURL('image/jpeg', 0.85);
            a.download = 'AVA-TYPE_'+enemyAvatorData.name + '_'+ getDayText() + '.jpg';
            a.click();
        }});//結果のスクショ
    } else if(next==5){//アバター　きせかえ
        ctx2dImg.drawImage(backImg[5],0,0,WIDTH,HEIGHT);
        prls.push({x1:30,y1:30,x2:450,y2:130,colSet:14,hoverColSet:14,hoverCounter:14,textSize:0.8,text:"AVATOR"});
        prls.push({x1:430,y1:90,x2:663,y2:130,colSet:0,hoverColSet:1,hoverCounter:0,textSize:0.8,sound:"enter",text:"オンラインアバター",onClick:function(){nextScene=6,sceneAni=t}});
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
        prls.push({x1:650,y1:HEIGHT-90,x2:826,y2:HEIGHT-30,colSet:0,hoverColSet:1,hoverCounter:0,textSize:0.6,sound:"cancel",text:"BACK",subText:"戻る",onClick:function(){
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
        prls.push({x1:604,y1:388,x2:650,y2:403,shadow:0,lineWidth:2,id:99,colSet:3,hoverColSet:4,hoverCounter:0,textSize:1.2,text:"強化！",onClick:function(){
            //強化の処理
            processStrength(selectParts,avatorData[0].item[selectParts]);
        }});
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
        setDiscount();
        setItemButtons(selectParts);
    
    } else if(next==6){//アバター管理
        ctx2dImg.drawImage(backImg[4],0,0,WIDTH,HEIGHT);
        prls.push({x1:30,y1:30,x2:450,y2:130,colSet:14,hoverColSet:14,hoverCounter:0,textSize:0.8,text:"ONLINE AVA."});
        prls.push({x1:65,y1:145,x2:690,y2:HEIGHT-60,colSet:0,hoverColSet:0,hoverCounter:0,textSize:0.8,text:""});
        prls.push({x1:51,y1:280,x2:116,y2:340,colSet:0,hoverColSet:1,hoverCounter:0,textSize:0.8,text:"＜",onClick:function(){
            onlineShowPage--;
            if(onlineShowPage<0) onlineShowPage=Math.max(0,Math.floor((showEnemyAvator.length-1)/4));
            setOrderButton();
        }});
        prls.push({x1:641,y1:280,x2:706,y2:340,colSet:0,hoverColSet:1,hoverCounter:0,textSize:0.8,text:"＞",onClick:function(){
            onlineShowPage++;
            if(onlineShowPage && Math.floor((showEnemyAvator.length-1)/4)<onlineShowPage) onlineShowPage= 0;
            setOrderButton();
        }});
        prls.push({x1:700,y1:145,x2:940,y2:HEIGHT-130,colSet:0,hoverColSet:0,hoverCounter:0,textSize:0.8,text:""});
        prls.push({x1:620,y1:115,x2:699,y2:140,colSet:0,hoverColSet:1,hoverCounter:0,textSize:1,shadow:0,sound:"window",text:"削除",onClick:function(){
            msgBox.push({
                ani:t,
                avatorDeleteWindow:1,
                flg:0});    
        }});
        prls.push({x1:680,y1:HEIGHT-120,x2:858,y2:HEIGHT-60,colSet:0,hoverColSet:1,hoverCounter:0,textSize:0.6,sound:"cancel",text:"BACK",subText:"戻る",onClick:function(){
            if(dataSaveStatus==0 || dataFetchStatus==0) return 0;
            saveData();
            nextScene=2;
            sceneAni=t;}});
        onlineAvatorCol=[1,1,1];
        onlineAvatorOrder=0;
        onlineAvatorStyle=[1,1];
        onlineShowPage=0;
        dataSaveStatus=1;
        createAvatorStyle=playData.settings[0];
        for(let i = 0;i < 4;i++){
            prls.push({x1:165+i*63,y1:151,x2:165+i*63+60,y2:171,id:i,shadow:0,colSet:0,hoverColSet:1,lineWidth:3,hoverCounter:0,textSize:1.2,text:ENEMY_ORDER[i],onClick:function(){
                onlineAvatorOrder=i;
                setShowLocalAvator(onlineAvatorOrder,onlineAvatorCol,onlineAvatorStyle);
                setOrderButton();
            }});
        }
        for(let i = 0;i < 2;i++){//入力方式
            prls.push({x1:485+i*33,y1:151,x2:485+i*33+30,y2:171,id:i+10,shadow:0,colSet:0,hoverColSet:1,lineWidth:3,hoverCounter:0,textSize:1.2,text:INPUT_STYLE_SHORT[i],onClick:function(){
                onlineAvatorStyle[i]=1-onlineAvatorStyle[i];
                setShowLocalAvator(onlineAvatorOrder,onlineAvatorCol,onlineAvatorStyle);
                setOrderButton();
            }});
        }
        for(let i = 0;i < 3;i++){//チーム
            prls.push({x1:585+i*33,y1:151,x2:585+i*33+30,y2:171,id:i+20,shadow:0,colSet:i*2+5,hoverColSet:i*2+5+1,lineWidth:3,hoverCounter:0,textSize:1.2,text:TEAM_TEXT[i].substr(0,1),onClick:function(){
                onlineAvatorCol[i]=1-onlineAvatorCol[i];
                setShowLocalAvator(onlineAvatorOrder,onlineAvatorCol,onlineAvatorStyle);
                setOrderButton();
            }});
        }
        for(let i = 0;i < 4;i++){//ダウンロードボタン
            prls.push({x1:90+i*130,y1:441,x2:90+i*130+100,y2:471,id:i+30,shadow:0,colSet:0,hoverColSet:1,lineWidth:3,hoverCounter:0,textSize:0.8,text:"アバターを追加",onClick:function(){
                if(dataSaveStatus==0 || dataFetchStatus==0) return 0;
                let myText=getPrlsText(i+30);
                if(myText==ONLINE_AVATOR_STATUS[0]){//更新
                    for(let j = 0;j < 3;j++){
                        for(let k = 0;k< localAvator[j+2].length;k++){
                            if(localAvator[j+2][k].id == showEnemyAvator[i+onlineShowPage*4].id){
                                localAvator[j+2][k] = JSON.parse(JSON.stringify(showEnemyAvator[i+onlineShowPage*4],undefined,1))//ディープコピー
                            }
                        }
                    }
                    for(let j = 0;j < battleDataSave.length;j++){
                        if(battleDataSave[j].id == showEnemyAvator[i+onlineShowPage*4].id){
                            battleDataSave[j].date= showEnemyAvator[i+onlineShowPage*4].date;
                        }
                    }
                    setShowLocalAvator(onlineAvatorOrder,onlineAvatorCol,onlineAvatorStyle);
                    setOrderButton();
                    msgBox.push({
                        text:"アバターの情報を更新しました！",
                        ani:t,
                        btns1:{text:"OK",onClick:function(){}}});
                    saveData();
                } else if(myText == ONLINE_AVATOR_STATUS[1]){//削除
                    deleteNCMBAvator(showEnemyAvator[i+4*onlineShowPage].id);
                } else if(myText==ONLINE_AVATOR_STATUS[2]){//追加
                    let addFlg=0;
                    for(let j = 0;j < 3;j++){
                        if(!addFlg && localAvator[j+2].length<6){
                            localAvator[j+2][localAvator[j+2].length] = JSON.parse(JSON.stringify(showEnemyAvator[i+onlineShowPage*4],undefined,1))//ディープコピー
                            addFlg=1;
                        }
                    }
                    if(addFlg==0){
                        msgBox.push({//更新できなかった時
                            text:"手持ちのアバターデータがいっぱいです。「削除」ボタンから、不要なダウンロード済みアバターを削除してください。",
                            ani:t,
                            btns1:{text:"OK",onClick:function(){}}});
                    } else{
                        battleDataSave.push({
                            id:showEnemyAvator[i+onlineShowPage*4].id,
                            battle:0,
                            win:0,
                            kWin:0,
                            pWin:0,
                            date:showEnemyAvator[i+onlineShowPage*4].date
                        });
                        playSE("enter");
                        setShowLocalAvator(onlineAvatorOrder,onlineAvatorCol,onlineAvatorStyle);
                        setOrderButton(); 
                        msgBox.push({
                            text:"アバターを追加しました！",
                            ani:t,
                            btns1:{text:"OK",onClick:function(){}}});
                        saveData();
                    }
                } else if(myText==ONLINE_AVATOR_STATUS[3]){//作成不能
                    //スルー
                }
                setShowLocalAvator(onlineAvatorOrder,onlineAvatorCol,onlineAvatorStyle);
                setOrderButton();
            }});
        }
        prls.push({x1:732,y1:310,x2:780,y2:330,shadow:0,colSet:0,hoverColSet:1,isTop:1,lineWidth:3,hoverCounter:0,textSize:1.1,text:"入力切替",onClick:function(){
            createAvatorStyle=1-createAvatorStyle;
            setOrderButton();
        }});
        prls.push({x1:776,y1:152,x2:930,y2:182,id:9,shadow:0,colSet:3,hoverColSet:4,lineWidth:3,hoverCounter:0,textSize:0.8,text:"アバター作成！",onClick:function(){
            if(dataSaveStatus==0 || dataFetchStatus==0) return 0;
            if(getAvailableCreateAvator()==1){//新規作成
                msgBox.push({
                    text:"アバターをオンライン上に作成すると、誰でもあなたのアバターと対戦出来るようになります。アバターを作成しますか？",
                    ani:t,
                    btns1:{text:"YES",onClick:function(){
                        //自分のアバターを作成する処理をここに追加
                        uploadNCMBAvatorData(avatorData[createAvatorStyle]);
                    }},
                    btns2:{text:"NO",onClick:function(){return 0;}}})    
            } else if(getAvailableCreateAvator() == 2){//更新
                msgBox.push({
                    text:"作成済みのアバターデータを更新しますか？",
                    ani:t,
                    btns1:{text:"YES",onClick:function(){
                        //自分のアバターを更新する処理
                        updateNCMBAvatorData(avatorData[createAvatorStyle].id,avatorData[createAvatorStyle]);
                    }},
                    btns2:{text:"NO",onClick:function(){return 0;}}})
            } else if(getAvailableCreateAvator() == 3){
                msgBox.push({
                    text:"アバターの更新は1時間に1回までです。また、前回の更新から一回以上のプレイが必要です。",
                    ani:t,
                    btns1:{text:"OK",onClick:function(){}}});
            } else if(getAvailableCreateAvator() == 4){
                msgBox.push({
                    text:"アバターを作成するために必要な打鍵数が足りません。",
                    ani:t,
                    btns1:{text:"OK",onClick:function(){}}});
            }
        }});
        setNCMBEnemyAvator();//NCMBからデータを取ってくる
        setShowLocalAvator();//表示を既定値でセットする
        setOrderButton();
    } else if(next==7){ //設定
        ctx2dImg.drawImage(backImg[2],0,0,WIDTH,HEIGHT);
        prls.push({x1:30,y1:30,x2:450,y2:130,colSet:14,hoverColSet:14,hoverCounter:0,textSize:0.8,text:"SETTING"});
        prls.push({x1:65,y1:160,x2:640,y2:HEIGHT-60,colSet:0,hoverColSet:0,hoverCounter:0,textSize:0.8,text:""});
        prls.push({x1:550,y1:HEIGHT-120,x2:720,y2:HEIGHT-60,colSet:0,hoverColSet:1,hoverCounter:0,textSize:0.6,sound:"enter",text:"SAVE",subText:"設定を保存",onClick:function(){
            nextScene=2,sceneAni=t,saveData();}});
        prls.push({x1:710,y1:HEIGHT-120,x2:880,y2:HEIGHT-60,colSet:0,hoverColSet:1,hoverCounter:0,textSize:0.6,text:"CANCEL",sound:"cursor",subText:"キャンセル",onClick:function(){
            msgBox.push({
                text:"変更を保存せずにメニュー画面へ戻りますか？",
                ani:t,
                btns1:{text:"YES",sound:"cancel",onClick:function(){nextScene=2,sceneAni=t;
                for(let i = 0;i < 9;i++){playData.settings[i] = previousSettings[i]};
                saveData()}},
                btns2:{text:"NO",sound:"cursor",onClick:function(){return 0;}}})
        }});
        for(let i = 0; i < 9;i++){
            let offset= 10*(i >= 3) + 10*(i>=8);
            if(i != 8){
                prls.push({x1:-i*8.7+460,y1:i*29+180+offset,x2:-i*8.7+535,y2:i*29+180+24+offset,lineWidth:2,shadow:0,colSet:12,hoverColSet:12,hoverCounter:0,textSize:0.8,text:SETTING_SELECT[i][0],onClick:function(){
                    playData.settings[i] = 0; 
                    if(i==3) processBGM(0,7);
                    if(i==4) playSE("cursor");
                }});
                prls.push({x1:-i*8.7+540,y1:i*29+180+offset,x2:-i*8.7+615,y2:i*29+180+24+offset,lineWidth:2,shadow:0,colSet:12,hoverColSet:12,hoverCounter:0,textSize:0.8,text:SETTING_SELECT[i][1],onClick:function(){
                    playData.settings[i] = 1;
                    if(i==3) processBGM(-1);
                }});
            } else {
                prls.push({x1:-i*8.7+460,y1:i*29+180+offset,x2:-i*8.7+615,y2:i*29+180+24+offset,lineWidth:2,shadow:0,colSet:13,hoverColSet:13,hoverCounter:0,textSize:0.8,text:SETTING_SELECT[i][0],onClick:function(){
                    msgBox.push({
                        text:"すべてのプレイデータをリセットしますか？　プレイデータをダウンロードしていない場合、データの復元はできません。",
                        ani:t,
                        btns1:{text:"OK",onClick:function(){resetData(),
                            msgBox.push({text:"すべてのプレイデータをリセットしました。タイトル画面へ戻ります。",ani:t,btns1:{text:"OK",onClick:function(){nextScene=1,sceneAni=t;}}})}},
                        btns2:{text:"CANCEL",sound:"cancel",onClick:function(){return 0;}}})
                    }
                })
            }
        }
    }
    processBGM(prev,next);//BGM
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
        if(scene) ctx2d.clearRect(0,0,WIDTH,HEIGHT),ctx2d2.clearRect(0,0,WIDTH,HEIGHT),ctx2dCr.clearRect(0,0,WIDTH,HEIGHT);

        if(scene==1){ //タイトル画面
            drawTitle();
            delayMouseX=0.9*delayMouseX+0.1*mouseX;
            delayMouseY=0.9*delayMouseY+0.1*mouseY;
        } else if(scene == 2) { //メニュー画面
            drawMenu();
        } else if(scene == 3){ //バトル画面
            processBattle();
            drawBattle();
        }else if(scene == 4){ //結果画面
            if(!msgBox.length && battleResult.notice.length) {
                msgBox.push(battleResult.notice.pop());
                msgBox[0].ani=t;
                processMsgBoxSE();
            }
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
        drawFlash();
        drawMouseCursor();
        processMouseEvent();
        if(clickX && clickY) processClick();
        ///////////////
        if(sceneAni){
            if(nextScene!=scene){
                ctx2d2.fillStyle="rgba(0,0,0," + (t-sceneAni)/(SCENE_ANI * (1+1*(scene==1 || scene==0|| nextScene == 3)))+")";
                ctx2d2.fillRect(0,0,WIDTH,HEIGHT);
                if(t-sceneAni > SCENE_ANI * (1+1*(scene==1 || scene==0 || nextScene == 3))) scene=nextScene,sceneAni=t,changeScene(scene,nextScene);
            } else{
                ctx2d2.fillStyle="rgba(0,0,0," + (1-(t-sceneAni)/SCENE_ANI)+")";
                ctx2d2.fillRect(0,0,WIDTH,HEIGHT);
                if(t-sceneAni > SCENE_ANI) sceneAni=0;
            }
        }
        requestAnimationFrame(tick);
    }
}