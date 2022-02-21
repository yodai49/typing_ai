const WIDTH = 960;
const HEIGHT = 540;
const MAIN_FONTNAME = "Orbitron";
const DIGIT_FONTNAME = "Quantico";
const JAPANESE_FONTNAME = "Stick";
const TYPING_FONTNAME="sans-serif";
const DEBUG_MODE=3;//数字の番号のシーンからスタート
const IMG_CNT = 22;//読みこむイメージの総数
const COEF_R2K=1.5;//ローマ字からカナへのkpm変換の係数
const TEAM_BONUS = 25;//チームのボーナス値　%で指定
var SCENE_ANI=400; //ロード終了後のアニメーション時間(DEBUGMODEによって変更するためvarで宣言)
const WAIT_TIME=300;
const BATTLE_ANI=2500;//バトル開始時のアニメーションの持続時間
const TEAM_TEXT=["RED","BLUE","YELLOW"];
const KPM_STAR=[[0,0,0,0,0,150,0,0,0,0,250,0,0,0,0,400,0,0,0,0,550,0,0,0,0,700,0,0,0,0],[0,0,0,0,0,100,0,0,0,0,180,0,0,0,0,280,0,0,0,0,380,0,0,0,0,500,0,0,0,0]];//スターごとの必要KPM
const STROKE_STAR=[0,1000,3000,5000,8000,12000,18000,25000,33000,42000,55000,65000,77000,88500,100000,120000,150000,185000,240000,300000,320000,350000,390000,440000,500000,580000,670000,780000,890000,1000000];
const PARTS_TEXT=["HEAD","BODY1","BODY2","LIMBS","OTHER"];
const BONUS_NAME=["ワードボーナス","正確性ボーナス","チームボーナス","アイテムボーナス","アバターボーナス"];
const RANK_TEXT=["S","A","B","C","D","E"];
const AVATOR_CLASS_TEXT = ["COM","EVENT","USER1","USER2","USER3"];
const RESULT_TEXT=[["kpm","acc","今回のCP"],["獲得ワード","損失ワード","打鍵数"]];
const SETTING_NAME=[
    "入力方法",
    "非効率な最適化",
    "カウントダウン",
    "BGM",
    "SE",
    "打鍵音",
    "ミスタイプ音",
    "相手の打鍵音",
    "データのリセット"
]
const INPUT_STYLE_SHORT=["R","K"];
const BATTLE_INFO=["","LV","CP","ACC"];
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
const ITEM_DATA = [
    [["ノーマルな仮面",0,"普通の仮面。特に効果はない。"],//HEAD
    ["赤の仮面",15,"所属チームがREDの場合、経験値ボーナス5%"],
    ["青の仮面",15,"所属チームがBLUEの場合、経験値ボーナス5%"],
    ["黄色の仮面",15,"所属チームがYELLOWの場合、経験値ボーナス5%"],
    ["黒の仮面",70,"全所属チームに対して経験値ボーナス8%"],
    ["銅の兜",120,"HEAD、BODY1、LIMBSを銅で揃えると経験値ボーナス12%"],
    ["銀の兜",240,"HEAD、BODY1、LIMBSを銀で揃えると経験値ボーナス14%"],
    ["金の兜",480,"HEAD、BODY1、LIMBSを金で揃えると経験値ボーナス16%"],
    ["透明な兜",800,"無条件で経験値ボーナス12%"],
    ["幻の兜",2000,"無条件で経験値ボーナス16%"]],
    [["ノーマルな服",0,"普通の服。特に効果はない。"],//BODY1
    ["赤の服",30,"所属チームがREDの場合、経験値ボーナス6%"],
    ["青の服",30,"所属チームがBLUEの場合、経験値ボーナス6%"],
    ["黄色の服",30,"所属チームがYELLOWの場合、経験値ボーナス6%"],
    ["黒の服",150,"全所属チームに対して経験値ボーナス10%"],
    ["銅の鎧",220,"HEAD、BODY1、LIMBSを銅で揃えると合計で経験値ボーナス12%"],
    ["銀の鎧",450,"HEAD、BODY1、LIMBSを銀で揃えると合計で経験値ボーナス14%"],
    ["金の鎧",760,"HEAD、BODY1、LIMBSを金で揃えると合計で経験値ボーナス16%"],
    ["透明な鎧",1500,"無条件で経験値ボーナス15%"],
    ["幻の鎧",4000,"無条件で経験値ボーナス20%"]],
    [["装備なし",0,"装備なし"],//BODY2
    ["赤のバッチ",8,"所属チームがREDの場合、経験値ボーナス6%"],
    ["青のバッチ",8,"所属チームがBLUEの場合、経験値ボーナス6%"],
    ["黄色のバッチ",8,"所属チームがYELLOWの場合、経験値ボーナス6%"],
    ["COMバッチ",50,"COMとの対戦で経験値ボーナス5%"],
    ["COMバッチEx",80,"COMとの対戦で経験値ボーナス15%"],
    ["正確性バッチ",350,"正確性98%以上で勝利すると経験値ボーナス10%"],
    ["MSバッチ",450,"デイリーミッションクリア後の試合で経験値ボーナス15%"],
    ["完全勝利バッチ",500,"完全勝利すると経験値ボーナス15%"],
    ["PFバッチ",700,"パーフェクト勝利すると経験値ボーナス30%"]],
    [["装備なし",0,"装備なし"],//LIMBS
    ["土星の靴",15,"土曜日にプレイすると経験値ボーナス12%"],
    ["太陽の靴",15,"日曜日にプレイすると経験値ボーナス12%"],
    ["地球の靴",15,"平日にプレイすると経験値ボーナス10%"],
    ["闇の靴",70,"夜間(19:00〜翌5:00)に勝利するとボーナス8%"],
    ["銅の篭手",100,"HEAD、BODY1、LIMBSを銅で揃えると経験値ボーナス12%"],
    ["銀の篭手",200,"HEAD、BODY1、LIMBSを銀で揃えると経験値ボーナス16%"],
    ["金の篭手",400,"HEAD、BODY1、LIMBSを金で揃えると経験値ボーナス24%"],
    ["透明な篭手",700,"無条件で経験値ボーナス10%"],
    ["幻の篭手",1500,"無条件で経験値ボーナス15%"]],
    [["装備なし",0,"装備なし"],//OTHERS
    ["絢爛な首飾り",2000,"プレイごとに1コイン獲得できる"],
    ["鞍替えの紋章",2500,"チームを変更することができる使い捨ての紋章"],
    ["乱れ打ちの冠",-1,"90%以下で勝利すると経験値ボーナス10%"],
    ["パーフェクトの冠",-1,"パーフェクト勝利すると3コイン獲得できる"],
    ["修験者の剣",-1,"CP300以上で勝利すると経験値ボーナス4%"],
    ["速打者の剣",-1,"CP450以上で勝利すると経験値ボーナス8%"],
    ["師匠の剣",-1,"CP600以上で勝利すると経験値ボーナス12%"],
    ["伝説の剣",-1,"CP650以上＋正確性97%以上で勝利するとボーナス20%＋2コイン"],
    ["神の剣",-1,"CP700以上＋正確性97%以上で勝利するとボーナス25%＋4コイン"]]
]