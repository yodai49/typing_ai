var t = 0; //グローバルタイム 毎ターンperformance.now()を格納
var scene=0;//シーン遷移  0:ローディング画面　1:タイトル画面
var nextScene=0;//次のシーン
var sceneAni=0;//シーンのアニメーション
var ctx2d,ctx2dImg;//キャンバス（メイン）とキャンバス（背景画像）
var mouseX=0,mouseY=0,clickX=0,clickY=0,mouseStatus=0;
var backImg= [],imgLoadedCnt=0;//背景イメージ格納用
var starImg=[];//スターの画像格納用
var otherPartsImg=[];//冠、剣の画像
var coinImg;
var firstLaunchFlg=0;//初回起動を検知するフラグ
var selectParts=0,selectPartsAni=0;//着せかえ画面で選択中のパーツを保存
if(localStorage.getItem("avatorData") == null) firstLaunchFlg=1;

/*var avatorData = [{name:"NAME",team:0,star:0,item:[0,0,0,0,0],style:0,typingData:{kpm:0,accuracy:0}},{name:"NAME",team:0,star:0,item:[0,0,0,0,0],style:1,typingData:{}}];//ローマ字、カナの順番でアバターデータを格納
var playData = {coin:0,exp:0,level:1,settings:[0,0,0,0,0,0,0,0],item:[[1,0,0,0,0,0,0,0,0,0],[1,0,0,0,0,0,0,0,0,0],[1,0,0,0,0,0,0,0,0,0],[1,0,0,0,0,0,0,0,0,0],[1,0,0,0,0,0,0,0,0,0]]};
var battleData = {win:0,lose:0,esc:0,stroke:0,word:0,miss:0,kpm:0,detail:[{battle:0,win:0},{battle:0,win:0},{battle:0,win:0}]};
var localAvator = [];
var todayBattleData = {battle:0,win:0,esc:0,stroke:0,miss:0,word:0,kpm:0,detail:[{battle:0,win:0},{battle:0,win:0},{battle:0,win:0}]};
var dailyMission = {id:"",detail:[{type:0,progress:0},{type:0,progress:0},{type:0,progress:0}]};
*/
var playData;
var battleData;
var localAvator;
var todayBattleData;
var dailyMission;

function getNextLvExp(myPlayData){ //次レベルまでの必要EXPを計算する
    let lv=myPlayData.level;
    let tempExp=8;
    for(let i = 2;i <= lv+1;i++){
        tempExp=Math.floor(tempExp*1.05+i*10);
    }
    return tempExp-myPlayData.exp;
}
function getNextStarKPM(myAvatorData,myBattleData){ //次レベルまでの必要KPMを計算する
    let starRank=Math.floor(myAvatorData.star/5);
    if(starRank==5) return "MAX_LEVEL";
    return Math.max(0,KPM_STAR[starRank+1]-myBattleData.kpm);
}
function getNextStarStroke(myAvatorData,myBattleData){ //次レベルまでの必要打鍵数を計算する
    let star=myAvatorData.star;
    if(star==29) return "MAX_LEVEL";
    return Math.max(0,STROKE_STAR[star+1]-myBattleData.stroke);
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
function loadData(){//データをローカルストレージから読み込む関数
    avatorData = JSON.parse(localStorage.getItem('avatorData'));
    playData = JSON.parse(localStorage.getItem('playData'));
    battleData = JSON.parse(localStorage.getItem('battleData'));
    localAvator = JSON.parse(localStorage.getItem('localAvator'));
    todayBattleData = JSON.parse(localStorage.getItem('todayBattleData'));
    dailyMission = JSON.parse(localStorage.getItem('dailyMission'));
    if(avatorData==null) avatorData=avatorData = [{name:"NAME",team:0,star:0,item:[0,0,0,0,0],style:0,typingData:{}},{name:"NAME",team:0,star:0,item:[0,0,0,0,0],style:1,typingData:{}}];
    if(playData==null) playData = {coin:0,exp:0,level:0,settings:[0,1,0,0,0,0,0,0,0],item:[[1,0,0,0,0,0,0,0,0,0],[1,0,0,0,0,0,0,0,0,0],[1,0,0,0,0,0,0,0,0,0],[1,0,0,0,0,0,0,0,0,0],[1,0,0,0,0,0,0,0,0,0]]};
    if (battleData==null) battleData = {battle:0,win:0,esc:0,stroke:0,word:0,miss:0,kpm:0,detail:[{battle:0,win:0},{battle:0,win:0},{battle:0,win:0}]};
    if(localAvator==null) localAvator = [];
    if(todayBattleData==null) todayBattleData = {battle:0,win:0,esc:0,stroke:0,miss:0,word:0,kpm:0,detail:[{battle:0,win:0},{battle:0,win:0},{battle:0,win:0}]};
    if(dailyMission==null) dailyMission = {id:"",detail:[{type:0,progress:0},{type:0,progress:0},{type:0,progress:0}]};
}
function resetData(){//データをリセットし、変数に既定値をセットする関数
    localStorage.clear();
    avatorData = [{name:"NAME",team:0,star:0,item:[0,0,0,0,0],style:0,typingData:{}},{name:"NAME",team:0,star:0,item:[0,0,0,0,0],style:1,typingData:{}}];
    playData = {coin:0,exp:0,level:1,settings:[0,0,1,0,0,0,0,0,0],item:[[1,0,0,0,0,0,0,0,0,0],[1,0,0,0,0,0,0,0,0,0],[1,0,0,0,0,0,0,0,0,0],[1,0,0,0,0,0,0,0,0,0],[1,0,0,0,0,0,0,0,0,0]]};
    battleData = {battle:0,win:0,esc:0,stroke:0,word:0,miss:0,kpm:0,detail:[{battle:0,win:0},{battle:0,win:0},{battle:0,win:0}]};
    localAvator = [];
    todayBattleData = {battle:0,win:0,esc:0,stroke:0,miss:0,word:0,kpm:0,detail:[{battle:0,win:0},{battle:0,win:0},{battle:0,win:0}]};
    dailyMission = {id:"",detail:[{type:0,progress:0},{type:0,progress:0},{type:0,progress:0}]};
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