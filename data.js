var t = 0; //グローバルタイム 毎ターンperformance.now()を格納
var scene=0;//シーン遷移  0:ローディング画面　1:タイトル画面
var nextScene=0;//次のシーン
var sceneAni=0;//シーンのアニメーション
var ctx2d,ctx2dImg;//キャンバス（メイン）とキャンバス（背景画像）
var mouseX=0,mouseY=0,clickX=0,clickY=0,mouseStatus=0;
var backImg= [],imgLoadedCnt=0;//背景イメージ格納用
var starImg=[];//スターの画像格納用
var otherPartsImg=[];//冠、剣の画像
var coinImg,arrowImg;//コインと矢印の画像
var firstLaunchFlg=0;//初回起動を検知するフラグ
var selectParts=0,selectPartsAni=0;//着せかえ画面で選択中のパーツを保存
var battleAni=0,enemyAvatorData,battleResult,battleStatus=0,typedText="",enemyTypedText="",totalLossTime=0,lossTimeT=0,lossTimeSum=0,getWord=0;//バトルデータの保持用 battlestatusは0ならアニメーション中、1ならカウントダウン中、2ならゲーム中、3ならゲームの待機中、4なら終了アニメーション中
var missAni=0,missChar=0,enemyMissAni=0,enemyMissChar=0,lastKpm=0,wordT=0,lastKpmE=0;//missAniはミスをした時のtを格納　missCharはミスした位置
var selectBattleAvator=0,selectBattleAvatorClass=0,selectBattleAvatorAni=0,winLoseAni=0;//選択中のバトルアバター
if(localStorage.getItem("avatorData") == null) firstLaunchFlg=1;

var playData;
var battleData;
var localAvator;
var todayBattleData;
var dailyMission;

function getNextLvExp(myPlayData,ratioMode){ //次レベルまでの必要EXPを計算する ratioModeが1なら現状の達成割合を返す
    let lv=myPlayData.level;
    let tempExp=8,prevTempExp=0;
    for(let i = 2;i <= lv;i++){
        prevTempExp=tempExp;
        tempExp=Math.floor(tempExp*1.05+i*10);
    }
    if(ratioMode){
        if(lv==99) return 1;
        return Math.min(1,Math.max(0,(myPlayData.exp-prevTempExp)/(tempExp-prevTempExp)));
    } else{
        return tempExp-myPlayData.exp;
    }
}
function getNextStarKPM(myAvatorData,myBattleData,ratioMode){ //次のスターまでの必要KPMを計算する
    // 2つの入力方式のうち高い方の数値を採用 ただしその方式における入力数が2000未満なら他を採用
    //返却するのは構造体　{style:入力方式　value:値}　ratioMode==0の時、値は必要なKPMの値をそのまま返す
    //myAvatorDataは配列で渡す！
    let star=myAvatorData[0].star;
    if(star==29) return "MAX_LEVEL";
    let style=1;
    if(KPM_STAR[0][star+1]-myAvatorData[0].typingData.kpm <KPM_STAR[1][star+1]- myAvatorData[1].typingData.kpm || isNaN(myAvatorData[1].typingData.kpm)) style=0;
    if(myAvatorData[style].typingData.stroke < 2000) style=1-style;
    if(ratioMode){
        return {value:Math.min(1,myAvatorData[style].typingData.kpm/KPM_STAR[style][star+1]),style:style};
    } else{
        return {value:Math.max(0,KPM_STAR[style][star+1]),style:style};
    }
}
function getNextStarStroke(myAvatorData,myBattleData,ratioMode){ //次のスターまでの必要打鍵数を計算する
    let star=myAvatorData.star;
    if(star==29) return "MAX_LEVEL";
    if(ratioMode){
        return Math.max(0,(myBattleData.stroke-STROKE_STAR[star])/(STROKE_STAR[star+1]-STROKE_STAR[star])); 
    } else{
        return Math.max(0,STROKE_STAR[star+1]-myBattleData.stroke);
    }
}

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
                    [180,30,20],//やや明るい赤
                    [180,180,180],//灰色　９
                    [120,205,120], //黄緑10
                    [100,0,0],//くらい赤 11
                    [210,140,0],//明るい黄色 12
                    []
                ];
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
    if(isNaN(data) || (data == undefined) || (data == null) || (data == -1)) return "---";
    return data;
}
function getPseudoRandom(max,mode){//現在の日付から疑似乱数を返す //maxは最大値　//modeは乱数のモード
    if(max == undefined) max = 10000;
    if(mode == undefined) mode=0;
    const RANDOM_PRIME=[[7257,7247,7243,7219,7213,7211,8069,8061,8087,7727,7741,7753],
                        [6121,6131,6133,6353,6359,6361,6367,6581,6983,6991,6977,6799],
                        [9011,9013,8431,7187,7193,7451,7457,6983,6991,6803,6991,8053]]
    var myDate = new Date();
    let y_dash = myDate.getFullYear()-2000;
    let month = myDate.getMonth()+1;
    let day = myDate.getDate();
    let r1 = Math.floor(((y_dash*RANDOM_PRIME[mode][0]*12*31+month*RANDOM_PRIME[mode][1]*12+day*RANDOM_PRIME[mode][2])%1000)/10)%10;
    let r2 = Math.floor(((y_dash*RANDOM_PRIME[mode][3]*12*31+month*RANDOM_PRIME[mode][4]*12+day*RANDOM_PRIME[mode][5])%1000)/10)%10;
    let r3 = Math.floor(((y_dash*RANDOM_PRIME[mode][6]*12*31+month*RANDOM_PRIME[mode][7]*12+day*RANDOM_PRIME[mode][8])%1000)/10)%10;
    let r4 = Math.floor(((y_dash*RANDOM_PRIME[mode][9]*12*31+month*RANDOM_PRIME[mode][10]*12+day*RANDOM_PRIME[mode][11])%1000)/10)%10;
    let r = r1*1000+r2*100+r3*10+r4;
    return r % max;
}
function getMissionText(myMission){//ミッションのテキストを返す関数
    if(myMission.type==0){
        return myMission.max + "打鍵打とう";
    } else if(myMission.type == 1){
        return myMission.max + "勝しよう";
    }else if(myMission.type == 2){
        return myMission.max + "ワード奪取しよう";
    }else if(myMission.type == 3){
        return TEAM_TEXT[myMission.team-1]+"チームに" + myMission.max + "勝しよう";
    }else if(myMission.type == 4){
        return TEAM_TEXT[myMission.team-1]+"チームと" + myMission.max + "回戦おう";
    }else if(myMission.type == 5){
        return "正確性" + myMission.require+"%以上で" + myMission.max + "勝しよう";
    }else if(myMission.type == 6){
        return "KPM" + myMission.require+"以上で" + myMission.max + "勝しよう";
    }else if(myMission.type == 7){
        return "KPM" + myMission.require+"以上のアバターに" + myMission.max + "勝しよう";
    }else if(myMission.type == 8){
        return myMission.require+"ワード以上奪取して" + myMission.max + "勝しよう";
    }else if(myMission.type == 9){
        return "KPM" + myMission.require+"以上のアバターに完全勝利しよう";
    }else if(myMission.type == 10){
        return "KPM" + myMission.require+"以上のアバターにPF勝利しよう";
    }else if(myMission.type == 11){
        return TEAM_TEXT[myMission.team-1]+"チームのアバターから" + myMission.max + "ワード奪取しよう";
    }else if(myMission.type == 12){
        return TEAM_TEXT[myMission.team-1]+"チームのアバターで" + myMission.max + "打鍵しよう";
    }else if(myMission.type == 13){
        return "ユーザーアバターに" + myMission.max + "勝しよう";
    }
}
function setDailyMission(){ //その日のデイリーミッションをセットする関数
    var myDate = new Date();
    let day = myDate.getDay();//曜日
    let inputStyle=0;
    if(avatorData[0].typingData.stroke==0) inputStyle=1;
    let baseKPM=avatorData[inputStyle].typingData.kpm;
    if(baseKPM<100 || isNaN(baseKPM)) baseKPM=150;
    if(day == 2) {//火曜日
        dailyMission.event=1;
    } else if(day == 3){//水
        dailyMission.event=2;
    } else if(day == 5){ //金
        dailyMission.event=3;
    } else{
        dailyMission.event=0;
    }
    myDate.setHours(myDate.getHours() - 5);
    if(myDate.getSeconds()==0) myDate.setMinutes(myDate.getMinutes() - 1);
    dailyMission.date=myDate.getDate();
    let myRand=[];
    for(let i = 0;i < 3;i++){
        myRand[i]= getPseudoRandom(10000,i); //0-9999までの乱数を格納
        if(dailyMission.event != 0 && i!=2){ //上2つはイベント関連ミッション
            dailyMission.detail[i].require=0;
            if(myRand[i] % 4==0){
                dailyMission.detail[i].type = 3;
                dailyMission.detail[i].max=myRand[i] % 8+3;
                dailyMission.detail[i].achieve=dailyMission.detail[i].max*3;
            } else if(myRand[i] % 4==1){
                dailyMission.detail[i].type = 4;
                dailyMission.detail[i].max=myRand[i] % 11+5;
                dailyMission.detail[i].achieve=dailyMission.detail[i].max*2;
            } else if(myRand[i] % 4==2){
                dailyMission.detail[i].type = 11;
                dailyMission.detail[i].max=(myRand[i] % 8)*10+30;
                dailyMission.detail[i].achieve=dailyMission.detail[i].max*0.2;
            } else if(myRand[i] % 4==3){
                dailyMission.detail[i].type = 12;
                dailyMission.detail[i].max=(myRand[i] % 7)*500+1000;
                dailyMission.detail[i].achieve=dailyMission.detail[i].max*0.01;
            }
            dailyMission.detail[i].team = dailyMission.event;
            dailyMission.detail[i].progess=0;
        } else{
            dailyMission.detail[i].team=0;
            dailyMission.detail[i].require=0;
            if(myRand[i] %42 <= 4){//〇〇打鍵打とう
                dailyMission.detail[i].type = 0;
                dailyMission.detail[i].max=(myRand[i] % 14)*500+1000;
                dailyMission.detail[i].achieve=dailyMission.detail[i].max*0.005;
            } else if(myRand[i] %42<= 9){
                dailyMission.detail[i].type = 1;
                dailyMission.detail[i].max=myRand[i] % 8+3;
                dailyMission.detail[i].achieve=dailyMission.detail[i].max*2;        
            } else if(myRand[i]%42 <= 14){
                dailyMission.detail[i].type = 2;
                dailyMission.detail[i].max=(myRand[i] % 16)*10+50;
                dailyMission.detail[i].achieve=dailyMission.detail[i].max*0.1;
            } else if(myRand[i]%42 <= 16){
                dailyMission.detail[i].type = 3;
                dailyMission.detail[i].max=myRand[i] % 8+3;
                dailyMission.detail[i].achieve=dailyMission.detail[i].max*3;
                dailyMission.detail[i].team=Math.floor(myRand[i]/100)%3+1;
            } else if(myRand[i]%42 <= 18){
                dailyMission.detail[i].type = 4;
                dailyMission.detail[i].max=(myRand[i] % 11)+5;
                dailyMission.detail[i].achieve=dailyMission.detail[i].max*2;     
                dailyMission.detail[i].team=Math.floor(myRand[i]/100)%3+1;   
            } else if(myRand[i]%42 <= 21){
                dailyMission.detail[i].type = 5;
                dailyMission.detail[i].max=myRand[i] % 4+2;
                dailyMission.detail[i].achieve=dailyMission.detail[i].max*3;
                dailyMission.detail[i].require=Math.floor(myRand[i] / 10)%5+95;
                dailyMission.detail[i].achieve*=(1+(dailyMission.detail[i].require-95)/10);
            } else if(myRand[i]%42 <= 24){
                dailyMission.detail[i].type = 6;
                dailyMission.detail[i].max=myRand[i] % 5+2;
                dailyMission.detail[i].achieve=dailyMission.detail[i].max*2;
                dailyMission.detail[i].require=(Math.floor(myRand[i] / 10)%6)/10+0.7;
                dailyMission.detail[i].achieve*=((dailyMission.detail[i].require*2)-0.4);
                dailyMission.detail[i].require*=baseKPM;
                dailyMission.detail[i].require=Math.floor(dailyMission.detail[i].require/5)*5;
            } else if(myRand[i]%42 <= 28){
                dailyMission.detail[i].type = 7;
                dailyMission.detail[i].max=myRand[i] % 5+2;
                dailyMission.detail[i].achieve=dailyMission.detail[i].max*2.5;
                dailyMission.detail[i].require=(Math.floor(myRand[i] / 10)%6)/10+0.7;
                dailyMission.detail[i].achieve*=((dailyMission.detail[i].require*2)-0.4);
                dailyMission.detail[i].require*=baseKPM;
                dailyMission.detail[i].require=Math.floor(dailyMission.detail[i].require/5)*5;
            } else if(myRand[i]%42 <= 31){
                dailyMission.detail[i].type = 8;
                dailyMission.detail[i].max=myRand[i] % 5+2;
                dailyMission.detail[i].achieve=dailyMission.detail[i].max*2.5;
                dailyMission.detail[i].require=Math.floor(myRand[i] / 10)%6+15;
                dailyMission.detail[i].achieve*=(1+(dailyMission.detail[i].require-15)/10);
            } else if(myRand[i]%42 <= 33){
                dailyMission.detail[i].type = 9;
                dailyMission.detail[i].max=1;
                dailyMission.detail[i].require=(myRand[i] % 4)*0.1+0.7;
                dailyMission.detail[i].achieve=10*(1+(dailyMission.detail[i].max-0.7)*2.5);
                dailyMission.detail[i].require*=baseKPM;
                dailyMission.detail[i].require=Math.floor(dailyMission.detail[i].require/5)*5;
            } else if(myRand[i]%42 <= 34){
                dailyMission.detail[i].type = 10;
                dailyMission.detail[i].max=1;
                dailyMission.detail[i].require=(myRand[i] % 4)*0.1+0.7;
                dailyMission.detail[i].achieve=20*(1+(dailyMission.detail[i].max-0.7)*2.5);
                dailyMission.detail[i].require*=baseKPM;
                dailyMission.detail[i].require=Math.floor(dailyMission.detail[i].require/5)*5;
            } else if(myRand[i]%42 <= 36){
                dailyMission.detail[i].type = 11;
                dailyMission.detail[i].max=(myRand[i] % 13)*10+30;
                dailyMission.detail[i].achieve=dailyMission.detail[i].max*0.2;
                dailyMission.detail[i].team=Math.floor(myRand[i]/100)%3+1;
            } else if(myRand[i]%42 <= 38){
                dailyMission.detail[i].type = 12;
                dailyMission.detail[i].max=(myRand[i] % 7)*500+1000;
                dailyMission.detail[i].achieve=dailyMission.detail[i].max*0.01;
                dailyMission.detail[i].team=Math.floor(myRand[i]/100)%3+1;
            } else if(myRand[i]%42 <= 41){
                dailyMission.detail[i].type = 13;
                dailyMission.detail[i].max=myRand[i] % 8+3;
                dailyMission.detail[i].achieve=dailyMission.detail[i].max*4;
            } 
            dailyMission.detail[i].progess=0;
            dailyMission.detail[i].max=Math.ceil(dailyMission.detail[i].max);
            dailyMission.detail[i].achieve=Math.ceil(dailyMission.detail[i].achieve);
        }
    }
}
function resetTodayBattleData(){ //その日のバトルデータをリセットする関数
    todayBattleData=null;
    setDefault();
}

function saveData(){//データをローカルストレージへ保存する関数
    localStorage.setItem('avatorData', JSON.stringify(avatorData,undefined,1));
    localStorage.setItem('playData', JSON.stringify(playData,undefined,1));
    localStorage.setItem('battleData', JSON.stringify(battleData,undefined,1));
    localStorage.setItem('localAvator', JSON.stringify(localAvator,undefined,1));
    localStorage.setItem('todayBattleData', JSON.stringify(todayBattleData,undefined,1));
    localStorage.setItem('dailyMission', JSON.stringify(dailyMission,undefined,1));
    firstLaunchFlg=0;
}
function setDefault(force){ //プレイデータの変数に既定値をセットする関数 forceに1をセットすると強制でセット
    if(avatorData==null || force) avatorData = [
        {name:"NAME",team:0,star:0,item:[0,0,0,0,0],style:0,typingData:{kpm:-1,stroke:0,miss:0},kind:0,cp:0},
        {name:"NAME",team:0,star:0,item:[0,0,0,0,0],style:1,typingData:{kpm:-1,stroke:0,miss:0},kind:0,cp:0}];
    if(playData==null || force) playData = {coin:0,exp:0,level:1,settings:[0,1,0,0,0,0,0,0,0],item:[[1,0,0,0,0,0,0,0,0,0],[1,0,0,0,0,0,0,0,0,0],[1,0,0,0,0,0,0,0,0,0],[1,0,0,0,0,0,0,0,0,0],[1,0,0,0,0,0,0,0,0,0]]};
    if (battleData==null || force) battleData = {battle:0,win:0,esc:0,stroke:0,word:0,miss:0,detail:[{battle:0,win:0},{battle:0,win:0},{battle:0,win:0}]};
    if(localAvator==null || force) localAvator = [ //デフォルトアバターのデータ
    [{name:"SAMPLE1",team:3,star:0,level:5,item:[5,6,0,0,0],style:0,cp:124,typingData:{kpm:124,stroke:17,miss:1},kind:0},//kpmは換算　kpmRは実際のkpm
    {name:"SAMPLE2",team:0,star:0,level:8,item:[4,3,0,0,0],style:1,cp:200,typingData:{kpm:179,stroke:18,miss:1},kind:0},
    {name:"SAMPLE3",team:1,star:0,level:13,item:[5,1,0,0,0],style:0,cp:255,typingData:{kpm:225,stroke:20,miss:1},kind:0},
    {name:"SAMPLE4",team:2,star:0,level:22,item:[5,2,0,0,0],style:1,cp:308,typingData:{kpm:308,stroke:16,miss:1},kind:0},
    {name:"SAMPLE5",team:2,star:0,level:28,item:[6,4,1,0,0],style:1,cp:500,typingData:{kpm:412,stroke:24,miss:1},kind:0},
    {name:"SAMPLE6",team:1,star:0,level:32,item:[7,3,2,0,0],style:0,cp:482,typingData:{kpm:482,stroke:26,miss:1},kind:0}],[],[],[],[]];
    if(todayBattleData==null || force) todayBattleData = {battle:0,win:0,esc:0,stroke:0,miss:0,word:0,detail:[{battle:0,win:0},{battle:0,win:0},{battle:0,win:0}]};
    if(dailyMission==null || force) dailyMission = {date:null,event:0,detail:[{type:0,require:0,team:0,max:0,progress:0,achieve:0},{type:0,require:0,team:0,max:0,progress:0,achieve:0},{type:0,require:0,team:0,max:0,progress:0,achieve:0}]};
}
function loadData(){//データをローカルストレージから読み込む関数
    avatorData = JSON.parse(localStorage.getItem('avatorData'));
    playData = JSON.parse(localStorage.getItem('playData'));
    battleData = JSON.parse(localStorage.getItem('battleData'));
    localAvator = JSON.parse(localStorage.getItem('localAvator'));
    todayBattleData = JSON.parse(localStorage.getItem('todayBattleData'));
    dailyMission = JSON.parse(localStorage.getItem('dailyMission'));
    setDefault();
}
function resetData(){//データをリセットし、変数に既定値をセットする関数
    localStorage.clear();
    setDefault(1);
    firstLaunchFlg=1;
}
function setAvatorData(dir){//アバターデータをセットする dir:0なら0から1へ、dir:1なら1から0へ
    avatorData[1-dir].name=avatorData[dir].name;
    avatorData[1-dir].team=avatorData[dir].team;
    avatorData[1-dir].star=avatorData[dir].star;
    for(var i = 0;i < avatorData[dir].item.length;i++){
        avatorData[1-dir].item[i]=avatorData[dir].item[i];
    }
}