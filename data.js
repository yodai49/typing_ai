var t = 0; //グローバルタイム 毎ターンperformance.now()を格納
var scene=0;//シーン遷移  0:ローディング画面　1:タイトル画面
var nextScene=0;//次のシーン
var sceneAni=0;//シーンのアニメーション
var ctx2d,ctx2dImg;//キャンバス（メイン）とキャンバス（背景画像）
var mouseX=0,mouseY=0,clickX=0,clickY=0,mouseStatus=0;
var backImg= [],imgLoadedCnt=0;//背景イメージ格納用
var firstLaunchFlg=0;//初回起動を検知するフラグ
if(localStorage.getItem("avatorData") == null) firstLaunchFlg=1;

var avatorData = [{name:"NAME",team:0,star:0,item:[0,0,0,0,0],style:0,typingData:{}},{name:"NAME",team:0,star:0,item:[0,0,0,0,0],style:1,typingData:{}}];//ローマ字、カナの順番でアバターデータを格納
var playData = {coin:0,exp:0,level:0,settings:[0,0,0,0,0,0,0,0],item:[[1,0,0,0,0,0,0,0,0,0],[1,0,0,0,0,0,0,0,0,0],[1,0,0,0,0,0,0,0,0,0],[1,0,0,0,0,0,0,0,0,0],[1,0,0,0,0,0,0,0,0,0]]};
var battleData = {battle:0,win:0,esc:0,stroke:0,word:0,miss:0,kpm:0,detail:[{battle:0,win:0},{battle:0,win:0},{battle:0,win:0}]};
var localAvator = [];
var todayBattleData = {battle:0,win:0,esc:0,stroke:0,miss:0,word:0,kpm:0,detail:[{battle:0,win:0},{battle:0,win:0},{battle:0,win:0}]};
var dailyMission = {id:"",detail:[{type:0,progress:0},{type:0,progress:0},{type:0,progress:0}]};

function saveData(){//データをローカルストレージへ保存する関数
    localStorage.setItem('avatorData', JSON.stringify(avatorData,undefined,1));
    localStorage.setItem('playData', JSON.stringify(avatorData,undefined,1));
    localStorage.setItem('battleData', JSON.stringify(avatorData,undefined,1));
    localStorage.setItem('localAvator', JSON.stringify(avatorData,undefined,1));
    localStorage.setItem('todayBattleData', JSON.stringify(avatorData,undefined,1));
    localStorage.setItem('dailyMission', JSON.stringify(avatorData,undefined,1));
}
function loadData(){//データをローカルストレージから読み込む関数
    avatorData = JSON.parse(localStorage.getItem('avatorData'));
    playData = JSON.parse(localStorage.getItem('playData'));
    battleData = JSON.parse(localStorage.getItem('battleData'));
    localAvator = JSON.parse(localStorage.getItem('localAvator'));
    todayBattleData = JSON.parse(localStorage.getItem('todayBattleData'));
    dailyMission = JSON.parse(localStorage.getItem('dailyMission'));
}
function setAvatorData(dir){//アバターデータをセットする dir:0なら0から1へ、dir:1なら1から0へ
    avatorData[1-dir].name=avatorData[dir].name;
    avatorData[1-dir].team=avatorData[dir].team;
    avatorData[1-dir].star=avatorData[dir].star;
    for(var i = 0;i < avatorData[dir].item.length;i++){
        avatorData[1-dir].item[i]=avatorData[dir].item[i];
    }
}