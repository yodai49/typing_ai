const WIDTH = 960;
const HEIGHT = 540;
const MAIN_FONTNAME = "Orbitron";
const DIGIT_FONTNAME = "Quantico";
const JAPANESE_FONTNAME = "Stick";
const TYPING_FONTNAME="sans-serif";
const DEBUG_MODE=0;//数字の番号のシーンからスタート ONにするとアバターは毎回更新
const IMG_CNT = 71;//読みこむイメージ等の総数
const FETCH_NUM=500;//一度にアバター一覧から取ってくる個数
const COEF_R2K=1.5;//ローマ字からカナへのkpm変換の係数
const TEAM_BONUS = 25;//チームのボーナス値　%で指定
var SCENE_ANI=400; //ロード終了後のアニメーション時間(DEBUGMODEによって変更するためvarで宣言)
const WAIT_TIME=300;
const BATTLE_ANI=2500;//バトル開始時のアニメーションの持続時間
const TEAM_TEXT=["RED","BLUE","YELLOW"];
const TEAM_TEXT_JPN=["赤","青","黄"];
const KPM_STAR=[[0,0,0,0,0,150,0,0,0,0,250,0,0,0,0,400,0,0,0,0,550,0,0,0,0,700,0,0,0,0],[0,0,0,0,0,100,0,0,0,0,180,0,0,0,0,280,0,0,0,0,380,0,0,0,0,500,0,0,0,0]];//スターごとの必要KPM
const STROKE_STAR=[0,1000,3000,5000,8000,12000,18000,25000,33000,42000,55000,65000,77000,88500,100000,120000,150000,185000,240000,300000,320000,350000,390000,440000,500000,580000,670000,780000,890000,1000000];
const PARTS_TEXT=["HEAD","BODY1","BODY2","LIMBS","OTHER"];
PARTS_TEXT_SHORT=["H","1","2","L","O"];
const BONUS_NAME=["ワードボーナス","正確性ボーナス","チームボーナス","アイテムボーナス","エネミーボーナス"];
const BONUS_EXP = ["獲得ワードを　　から　　の6段階で評価。　　以上の場合、獲得ワード数に応じてボーナス。",
                    "正確性を　　から　　の6段階で評価。　　以上の場合、正確性に応じてボーナス。",
                    "チームの相性によるボーナス。イベント開催時は該当チームに別途ボーナス20%。",
                    "装備しているアイテムによるボーナス。",
                    "敵アバターの種類によるボーナス。ユーザーが作成したアバターの場合、ボーナス20%。"]
const RANK_TEXT=["S","A","B","C","D","E"];
const AVATOR_CLASS_TEXT = ["COM","EVENT","USER1","USER2","USER3"];
const AVATOR_KIND_TEXT=["USER","EVENT","COM"];
const RESULT_TEXT=[["kpm","acc","新しいCP"],["獲得ワード","損失ワード","打鍵数"]];
const SETTING_NAME=[
    "入力方法",
    "非効率な最適化",
    "タイピング時のエフェクト",
    "BGM",
    "SE",
    "打鍵音",
    "ミスタイプ音",
    "相手の打鍵音",
    "データのリセット"
]
const EVENT_EXP=[
    ["ミッションをクリアしてコインを貯めよう！","全ミッションクリア後に勝利で1コイン獲得！"],
    ["イベント限定アバター出現中！","REDチームはボーナス25%＋1ゴールド獲得！","全ミッションクリア後に勝利で1コイン獲得！"],
    ["イベント限定アバター出現中！","BLUEチームはボーナス25%＋1ゴールド獲得！","全ミッションクリア後に勝利で1コイン獲得！"],
    ["イベント限定アバター出現中！","YELLOWチームはボーナス25%＋1ゴールド獲得！","全ミッションクリア後に勝利で1コイン獲得！"],
    ["EXPアップイベント開催中！","全チーム、勝利でEXPボーナス20%獲得！"],
    ["ゴールド大放出イベント開催中！","全チーム、一回の勝利で1ゴールド獲得！"]
]
const INPUT_STYLE_SHORT=["R","K"];
const INPUT_STLYE=["ローマ字","カナ"];
const BATTLE_INFO=["","LV","CP","ACC"];
const ONLINE_AVATOR_STATUS=["アバター更新","アバター削除","アバター追加！","アバター追加"];
const SETTING_SELECT=[
    ["ローマ字","カナ"],
    ["有効","無効"],
    ["ON","OFF"],
    ["ON","OFF"],
    ["ON","OFF"],
    ["ON","OFF"],
    ["ON","OFF"],
    ["ON","OFF"],
    ["リセットする",""],
]
const ENEMY_ORDER=["おすすめ","新着順","CP順","レベル順"];
const ITEM_DATA = [
    [["ノーマルな仮面",0,"普通の仮面。特に効果はない。"],//HEAD
    ["赤の仮面",15,"所属チームがREDの場合、経験値ボーナス5%"],
    ["青の仮面",15,"所属チームがBLUEの場合、経験値ボーナス5%"],
    ["黄色の仮面",15,"所属チームがYELLOWの場合、経験値ボーナス5%"],
    ["黒の仮面",50,"全所属チームに対して経験値ボーナス8%"],
    ["銅の兜",100,"HEAD、BODY1、LIMBSを銅で揃えると経験値ボーナス12%"],
    ["銀の兜",150,"HEAD、BODY1、LIMBSを銀で揃えると経験値ボーナス14%"],
    ["金の兜",210,"HEAD、BODY1、LIMBSを金で揃えると経験値ボーナス16%"],
    ["透明な兜",400,"無条件で経験値ボーナス12%"],
    ["幻の兜",1000,"無条件で経験値ボーナス16%"]],
    [["ノーマルな服",0,"普通の服。特に効果はない。"],//BODY1
    ["赤の服",30,"所属チームがREDの場合、経験値ボーナス6%"],
    ["青の服",30,"所属チームがBLUEの場合、経験値ボーナス6%"],
    ["黄色の服",30,"所属チームがYELLOWの場合、経験値ボーナス6%"],
    ["黒の服",100,"全所属チームに対して経験値ボーナス10%"],
    ["銅の鎧",140,"HEAD、BODY1、LIMBSを銅で揃えると合計で経験値ボーナス15%"],
    ["銀の鎧",260,"HEAD、BODY1、LIMBSを銀で揃えると合計で経験値ボーナス25%"],
    ["金の鎧",380,"HEAD、BODY1、LIMBSを金で揃えると合計で経験値ボーナス35%"],
    ["透明な鎧",500,"無条件で経験値ボーナス15%"],
    ["幻の鎧",1500,"無条件で経験値ボーナス20%"]],
    [["装備なし",0,"装備なし"],//BODY2
    ["赤のバッチ",8,"所属チームがREDの場合、経験値ボーナス6%"],
    ["青のバッチ",8,"所属チームがBLUEの場合、経験値ボーナス6%"],
    ["黄色のバッチ",8,"所属チームがYELLOWの場合、経験値ボーナス6%"],
    ["COMバッチ",50,"COMとの対戦で経験値ボーナス5%"],
    ["COMバッチEx",80,"COMとの対戦で経験値ボーナス15%"],
    ["正確性バッチ",120,"正確性98%以上で勝利すると経験値ボーナス10%"],
    ["MSバッチ",150,"デイリーミッションクリア後の試合で経験値ボーナス15%"],
    ["完全勝利バッチ",400,"完全勝利すると経験値ボーナス15%"],
    ["PFバッチ",600,"パーフェクト勝利すると経験値ボーナス30%"]],
    [["装備なし",0,"装備なし"],//LIMBS
    ["土星の靴",15,"土曜日にプレイすると経験値ボーナス12%"],
    ["太陽の靴",15,"日曜日にプレイすると経験値ボーナス12%"],
    ["地球の靴",15,"平日にプレイすると経験値ボーナス10%"],
    ["闇の靴",70,"夜間(19:00〜翌5:00)にプレイするとボーナス8%"],
    ["銅の篭手",80,"HEAD、BODY1、LIMBSを銅で揃えると経験値ボーナス12%"],
    ["銀の篭手",120,"HEAD、BODY1、LIMBSを銀で揃えると経験値ボーナス16%"],
    ["金の篭手",300,"HEAD、BODY1、LIMBSを金で揃えると経験値ボーナス24%"],
    ["透明な篭手",400,"無条件で経験値ボーナス10%"],
    ["幻の篭手",1200,"無条件で経験値ボーナス15%"]],
    [["装備なし",0,"装備なし"],//OTHERS
    ["絢爛な首飾り",400,"プレイごとに1コイン獲得できる"],
    ["鞍替えの紋章",1000,"チームを変更することができる使い捨ての紋章"],
    ["乱れ打ちの冠",-1,"90%以下で勝利すると経験値ボーナス10%"],
    ["パーフェクトの冠",-1,"パーフェクト勝利すると3コイン獲得できる"],
    ["修験者の剣",-1,"CP500以上で勝利すると経験値ボーナス5%"],
    ["速打者の剣",-1,"CP600以上で勝利すると経験値ボーナス10%"],
    ["師匠の剣",-1,"CP650以上で勝利すると経験値ボーナス15%"],
    ["伝説の剣",-1,"CP650以上＋正確性97%以上で勝利するとボーナス20%＋2コイン"],
    ["神の剣",-1,"CP700以上＋正確性97%以上で勝利するとボーナス25%＋4コイン"]]
]
const EVENT_ENEMY_DATA=[
    {name:"*の手下",team:-1,star:4,level:9,item:[-1,0,0,0,0],style:0,cp:-1,
        typingData:{kpm:280,acc:96.0,stroke:17,miss:1},kind:1,prob:43,id:"d2b09c01-d756-4b30-923d-1456f947340c"},
    {name:"*の使い",team:-1,star:6,level:12,item:[-1,-1,0,0,0],style:1,cp:-1,
        typingData:{kpm:360/COEF_R2K,acc:93.6,stroke:18,miss:1},kind:1,prob:36,id:"3b0eadf6-4f16-418d-b05d-ecb37e2ed33c"},
    {name:"*の騎士",team:-1,star:7,level:13,item:[-1,-1,-1,0,0],style:0,cp:-1,
        typingData:{kpm:440,acc:96.2,stroke:20,miss:1},kind:1,prob:40,id:"5497254e-a4a8-4b20-b8bb-12e3c5a92a21"},
    {name:"*の子爵",team:-1,star:9,level:15,item:[5,-1,-1,0,0],style:0,cp:-1,
        typingData:{kpm:500,acc:95.1,stroke:16,miss:1},kind:1,prob:38,id:"86635819-04ad-4bb5-a26e-bdbed45658cf"},
    {name:"*の伯爵",team:-1,star:12,level:19,item:[6,-1,-1,1,0],style:1,cp:-1,
        typingData:{kpm:560/COEF_R2K,acc:96.3,stroke:24,miss:1},kind:1,prob:35,id:"4592ef82-7ed5-422e-bf4d-68961218ea96"},
    {name:"*の公爵",team:-1,star:13,level:22,item:[7,-1,-1,1,0],style:1,cp:-1,
        typingData:{kpm:600/COEF_R2K,acc:92.5,stroke:26,miss:1},kind:1,prob:30,id:"7be8071c-400e-427f-9324-a7699dd7b62c"},
    {name:"*の名打鍵手",team:-1,star:16,level:25,item:[4,-1,0,1,0],style:0,cp:-1,
        typingData:{kpm:640,acc:94.5,stroke:17,miss:1},kind:1,prob:28,id:"2d4f7eb6-6806-410d-b52a-c0dfe8934530"},
    {name:"*の魔神",team:-1,star:19,level:27,item:[-1,4,-1,1,0],style:1,cp:-1,
        typingData:{kpm:720/COEF_R2K,acc:87.7,stroke:19,miss:1},kind:1,prob:24,id:"52dcd08f-6d6d-476f-b2cf-f29a22ae522e"},
    {name:"スケルトン",team:2,star:16,level:19,item:[8,8,8,8,0],style:0,cp:-1,
        typingData:{kpm:580,acc:100,stroke:20,miss:1},kind:1,prob:18,id:"dd517d27-7ac0-4477-94a3-9431929e4b34"},
    {name:"炎鬼妖",team:1,star:19,level:33,item:[1,1,1,4,0],style:1,cp:-1,
        typingData:{kpm:642/COEF_R2K,acc:97.5,stroke:24,miss:1},kind:1,prob:12,event:[1],id:"9299dc21-b462-4660-b9c4-fc11c4d9d091"},
    {name:"雪剣武",team:0,star:19,level:33,item:[2,2,2,4,0],style:0,cp:-1,
        typingData:{kpm:630,acc:97.9,stroke:16,miss:1},kind:1,prob:12,event:[2],id:"a3cdc66b-0178-4a00-9ac1-4fd7c18dffab"},
    {name:"電閃狐",team:2,star:19,level:33,item:[3,3,3,4,0],style:0,cp:-1,
        typingData:{kpm:623,acc:98.6,stroke:26,miss:1},kind:1,prob:12,event:[3],id:"573e8808-f2a1-47b3-9425-2e5b9dda9344"},
    {name:"ブロンズヒュドラ",team:1,star:20,level:5,item:[5,5,0,5,5],style:1,cp:-1,
        typingData:{kpm:600/COEF_R2K,acc:94.2,stroke:17,miss:1},kind:1,prob:18,dropItem:5,dropProb:0.3,id:"ed3cca6e-20ed-41b9-9b3a-ba1acead15e2"},
    {name:"シルバーキマイラ",team:1,star:21,level:8,item:[6,6,0,6,6],style:0,cp:-1,
        typingData:{kpm:625,acc:96.4,stroke:18,miss:1},kind:1,prob:15,dropItem:6,dropProb:0.25,id:"60702bf9-bd80-4876-b639-2176637f4239"},
    {name:"ゴールドゴーレム",team:0,star:22,level:13,item:[7,7,0,7,7],style:1,cp:-1,
        typingData:{kpm:660/COEF_R2K,acc:97.2,stroke:20,miss:1},kind:1,prob:12,dropItem:7,dropProb:0.15,id:"9659eab0-eff8-43d9-9758-628d47be36f6"},
    {name:"闇の皇帝",team:1,star:24,level:65,item:[4,4,0,4,4],style:0,cp:-1,
        typingData:{kpm:670,acc:90.2,stroke:16,miss:1},kind:1,prob:40,event:[4,5],id:"9f75c729-2b04-4231-85d7-820837e49772"},
    {name:"幻竜",team:2,star:28,level:72,item:[9,9,0,9,8],style:1,cp:-1,
        typingData:{kpm:700/COEF_R2K,acc:96.9,stroke:26,miss:1},kind:1,prob:25,dropItem:8,dropProb:1,event:[4,5],id:"81dfe6f9-d952-4dd3-bd3b-3ec972d32783"},
    {name:"改・幻竜",team:0,star:29,level:77,item:[9,9,9,9,9],style:0,cp:-1,
        typingData:{kpm:740,acc:98.7,stroke:26,miss:1},kind:1,prob:20,event:[4,5],dropItem:9,dropProb:1,id:"c3b61317-d229-4622-ad85-1541101b2c3f"}]