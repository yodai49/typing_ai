//タイピングの分析を行うモジュール
/*

| analyzeTyping(style,typingData);
|    //タイピングの分析を行った構造体を返却する関数
|    // style:　入力方式 0ならローマ字、1ならカナ　指定なしでローマ字
|    // typingData: タイピングデータを表す構造体　[{time:152, key:"a", shiftKey:0, isMiss:0, isFirst: 0},{...}]
|    // (return): タイピングデータの分析結果を表す構造体　{kpm: ,acc:, }
*/

function analyzeTyping(style,typingData){
    //タイピングの分析を行った構造体を返却する関数
    // style:　入力方式 0ならローマ字、1ならカナ　指定なしでローマ字
    // typingData: タイピングデータを表す構造体　[{time:152, key:"a", shiftKey:0, isMiss:0, isFirst: 0},{...}]
    // (return): タイピングデータの分析結果を表す構造体　{kpm: ,acc:, }
    return {kpm:0,acc:0};
}
