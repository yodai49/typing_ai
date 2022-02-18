//最適化の処理を行うモジュール
/*

| getRome(s)
|    //ひらがなから標準的な打鍵ローマ字を返却する関数
|    // s:　ローマ字を取得する単語　ひらがな
|    // (return): sの標準的な打鍵ローマ字

| checkOpt(targetStr,typingStr,typistMode)
|    // 入力が受理可能かどうかを判断する関数
|    // typingStrの最後の文字が受理可能化どうかを判定する
|    // targetStr 標準的な打鍵ローマ字
|    // typingStr 打鍵されたローマ字
|    // typistMode 非効率な最適化を弾くかどうか　1なら非効率なものは受理しない　指定なしなら0
|    // (return): 1-最適化可能(受理可能)　0-最適化不可能(受理不可能)

*/

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
    "ゃ","ゅ","ょ","っ","ー",
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
    "wa","wo","*","-","-",    
    "ga","gi","gu","ge","go",
    "za","zi","zu","ze","zo",
    "da","di","du","de","do",
    "ba","bi","bu","be","bo",
    "pa","pi","pu","pe","po",
    "lya","lyu","lyo","+","ー",
    "la","li","lu","le","lo"
]
const optList=["kilya,kya","kili,kyi","kilyu,kyu","kile,kye","kilyo,kyo",
"silya,sya","sili,syi","silyu,syu","sile,sye","silyo,syo",
"tilya,tya","tili,tyi","tilyu,tyu","tile,tye","tilyo,tyo",
"telya,tha","teli,thi","telyu,thu","tele,the","telyo,tho",
"nilya,nya","nili,nyi","nilyu,nyu","nile,nye","nilyo,nyo",
"hilya,hya","hili,hyi","hilyu,hyu","hile,hye","hilyo,hyo",
"hulya,fa","huli,fi","hule,fe","hulo,fo",
"milya,mya","mili,myi","milyu,myu","mile,mye","milyo,myo",
"rilya,rya","rili,ryi","rilyu,ryu","rile,rye","rilyo,ryo",
"gilya,gya","gili,gyi","gilyu,gyu","gile,gye","gilyo,gyo",
"zilya,zya","zili,zyi","zilyu,zyu","zile,zye","zilyo,zyo",
"dilya,dya","dili,dyi","dilyu,dyu","dile,dye","dilyo,dyo",
"delya,dha","deli,dhi","delyu,dhu","dele,dhe","delyo,dho",
"bilya,bya","bili,byi","bilyu,byu","bile,bye","bilyo,byo",
"pilya,pya","pili,pyi","pilyu,pyu","pile,pye","pilyo,pyo",
"uli,wi","ule,we"]

function getRome(s,noOpt){
    //ひらがなから標準的な打鍵ローマ字を返却する関数 "*"と"+"が含まれる文字列は不可
    //標準的な打鍵ローマ字は、optListにある最適化とltuの母音重ねによる最適化を施した打ち方　nはできるだけ1つ
    // s:　ローマ字を取得する単語　ひらがな
    // noOpt: 最適化を拒否するかどうか（英文に使用）　現時点では日本語と英語の混在は不可
    // (return): sの標準的な打鍵ローマ字
    let afterS="";
    for(let i = 0;i < s.length;i++){
        let searchFlg=0;
        for(let j = 0;j < CHARA_SET.length;j++){
            if(CHARA_SET[j] == s.substr(i,1)){
                afterS+=AFTER_CHARA_SET[j];
                searchFlg=1;
                break;
            }
        }
        if(!searchFlg) afterS+=s.substr(i,1);
        if(searchFlg){//処理を保留した特殊文字を処理
            if(afterS.substr(afterS.length-1,1) == "*"){//「ん」の場合
                if(i == s.length-1){//末尾の「ん」はnが2回必要
                    afterS=afterS.substr(0,afterS.length-1) + "nn";
                } else{//その他  あ行orな行or「ん」が続くなら2回必要
                    if(s[i+1] == "あ" || s[i+1] == "い" || s[i+1] == "う" || s[i+1] == "え" || s[i+1] == "お" || s[i+1] == "ん"
                    || s[i+1] == "な" || s[i+1] == "に" || s[i+1] == "ぬ" || s[i+1] == "ね" || s[i+1] == "の"){
                        afterS=afterS.substr(0,afterS.length-1) + "nn";
                    } else{
                        afterS=afterS.substr(0,afterS.length-1) + "n";
                    }
                }
            } else if(afterS.substr(afterS.length-1,1) == "+"){//「っ」の場合
                if(i != s.length-1){//末尾の「っ」以外を処理
                    //あ行orな行or「ん」が続く時以外に処理
                    if(!(s[i+1] == "あ" || s[i+1] == "い" || s[i+1] == "う" || s[i+1] == "え" || s[i+1] == "お" || s[i+1] == "ん"
                    || s[i+1] == "な" || s[i+1] == "に" || s[i+1] == "ぬ" || s[i+1] == "ね" || s[i+1] == "の")){
                        let nextChildChar="";//続く子音
                        for(let j = 0;j < CHARA_SET.length;j++){
                            if(CHARA_SET[j] == s.substr(i+1,1)) {
                                nextChildChar=AFTER_CHARA_SET[j].substr(0,1);
                                break;
                            }
                        }
                        if(nextChildChar!="") {
                            afterS=afterS.substr(0,afterS.length-1) + nextChildChar;
                        } else{
                            afterS=afterS.substr(0,afterS.length-1) + "ltu";
                        }
                    }
                }
            }
        }
    }
    if(noOpt) return afterS;
    for(let i = 0; i < optList.length;i++){
        if(afterS.indexOf(optList[i].split(",")[0])!=-1){
            afterS=afterS.split(optList[i].split(",")[0]).join(optList[i].split(",")[1]);
        }
    }
    return afterS;
}

function checkOpt(targetStr,typingStr,typistMode){
    // 入力が受理可能かどうかを判断する関数
    // typingStrの最後の文字が受理可能化どうかを判定する
    // targetStr 標準的な打鍵ローマ字
    // typingStr 打鍵されたローマ字
    // typistMode 非効率な最適化を弾くかどうか　1なら非効率なものは受理しない　指定なしなら0
    // (return): {isMiss: 0-最適化可能(受理可能)　1-最適化不可能(受理不可能), newTargetStr:最適化を適用した後の文字列}
    if(typistMode==undefined) typistMode=0;
    if(targetStr.substr(0,typingStr.length) == typingStr) return {isMiss:0,newTargetStr:targetStr};//同じ文字列なら受理
    if(targetStr.substr(typingStr.length-1,1) == "k"){//// ca cu co
        if(typingStr.substr(typingStr.length-1,1) == "c"){
            if(targetStr.substr(typingStr.length,1) == "a" || targetStr.substr(typingStr.length,1) == "u" || targetStr.substr(typingStr.length,1) == "o"){
                return {isMiss:0,newTargetStr:targetStr.substr(0,typingStr.length-1) + "c" + targetStr.substr(typingStr.length)};
            }
        }
    }
    if(targetStr.substr(typingStr.length-1,1) == "s"){ ///si se > ci ce
        if(typingStr.substr(typingStr.length-1,1) == "c"){
            if(targetStr.substr(typingStr.length,1) == "i" || targetStr.substr(typingStr.length,1) == "e"){
                return {isMiss:0,newTargetStr:targetStr.substr(0,typingStr.length-1) + "c" + targetStr.substr(typingStr.length)};
            }
        }
    }
    if(targetStr.substr(typingStr.length-1,1) == "z"){ ///zi>ji
        if(typingStr.substr(typingStr.length-1,1) == "j"){
            if(targetStr.substr(typingStr.length,1) == "i"){
                return {isMiss:0,newTargetStr:targetStr.substr(0,typingStr.length-1) + "j" + targetStr.substr(typingStr.length)};
            }
        }
    }
    if(targetStr.substr(typingStr.length-1,1) == "l"){ /// la>xa
        if(typingStr.substr(typingStr.length-1,1) == "x"){
            if(targetStr.substr(typingStr.length,1) == "a"||targetStr.substr(typingStr.length,1) == "i"||targetStr.substr(typingStr.length,1) == "u"||targetStr.substr(typingStr.length,1) == "e"||targetStr.substr(typingStr.length,1) == "o" ||targetStr.substr(typingStr.length,1) == "t" ||targetStr.substr(typingStr.length,1) == "y"){
                return {isMiss:0,newTargetStr:targetStr.substr(0,typingStr.length-1) + "x" + targetStr.substr(typingStr.length)};
            }
        }
    }
    if(targetStr.substr(typingStr.length-1,1) == "n"){ /// n>nn
        if(typingStr.substr(typingStr.length-2,1) == "n"){
            if(typingStr.substr(typingStr.length-3,1) !="n" && !(targetStr.substr(typingStr.length-1,1) == "a"||targetStr.substr(typingStr.length-1,1) == "i"||targetStr.substr(typingStr.length-1,1) == "u"||targetStr.substr(typingStr.length-1,1) == "e"||targetStr.substr(typingStr.length-1,1) == "o")){
                return {isMiss:0,newTargetStr:targetStr.substr(0,typingStr.length) + "n" + targetStr.substr(typingStr.length)};
            }
        }
    }
    if(targetStr.substr(typingStr.length-1,1) == "x"){ /// nn>xn
        if(typingStr.substr(typingStr.length-1,1) == "n"){
            if(typingStr.substr(typingStr.length-1,1) =="n" && !(targetStr.substr(typingStr.length,1) == "a"||targetStr.substr(typingStr.length,1) == "i"||targetStr.substr(typingStr.length,1) == "u"||targetStr.substr(typingStr.length,1) == "e"||targetStr.substr(typingStr.length,1) == "o")){
                return {isMiss:0,newTargetStr:targetStr.substr(0,typingStr.length-1) + "x" + targetStr.substr(typingStr.length)};
            }
        }
    }
    //syo>sho
    //ti>chi
    //tya>cha,cya
    //zya>jya,ja
    //cca cci jjiなど
    return {isMiss:1,newTargetStr:targetStr};//それ以外なら不受理（最適化未実装)
}