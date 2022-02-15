const WIDTH = 960;
const HEIGHT = 540;
const MAIN_FONTNAME = "Orbitron";
const JAPANESE_FONTNAME = "Stick";
const DEBUG_MODE=0;//数字の番号のシーンからスタート
const IMG_CNT = 1;//読みこむイメージの総数
var SCENE_ANI=400; //ロード終了後のアニメーション時間(DEBUGMODEによって変更するためvarで宣言)

const CHARA_SET=[
    "あ","い","う","え","お",
    "か","き","く","け","こ",
    "さ","し","す","せ","そ",
    "た","ち","つ","て","と",
    "な","に","ぬ","ね","の",
    "は","ひ","ふ","へ","ほ",
    "ま","み","む","め","も",
    "や","ー","ゆ","-","よ",
    "ら","り","る","れ","ろ",
    "わ","を","ん","-","-",    
    "が","ぎ","ぐ","げ","ご",
    "ざ","じ","ず","ぜ","ぞ",
    "だ","ぢ","づ","で","ど",
    "ば","び","ぶ","べ","ぼ",
    "ぱ","ぴ","ぷ","ぺ","ぽ",
    "ゃ","ゅ","ょ","っ","-",
    "ぁ","ぃ","ぅ","ぇ","ぉ"
]
const AFTER_CHARA_SET=[
    "a","i","u","e","o",
    "ka","ki","ku","ke","ko",
    "sa","si","su","se","so",
    "ta","ti","tu","te","to",
    "na","ni","nu","ne","no",
    "ha","hi","hu","he","ho",
    "ma","mi","mu","me","mo",
    "ya","-","yu","-","yo",
    "ra","ri","ru","re","ro",
    "wa","wo","nn","-","-",    
    "ga","gi","gu","ge","go",
    "za","zi","zu","ze","zo",
    "da","di","du","de","do",
    "ba","bi","bu","be","bo",
    "pa","pi","pu","pe","po",
    "lya","lyu","lyo","!","-",
    "la","li","lu","le","lo"
]
