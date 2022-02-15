function getDrawPos(x1,x2,pos){
    return x1+(x2-x1)*pos;
}
function drawFace(myAvator,x1,y1,x2,y2,t,trans){ //顔面を描画
    ctx2d.beginPath();
    ctx2d.fillStyle="rgba(255,255,255,"+trans+")";//白目
    ctx2d.arc(getDrawPos(x1,x2,0.43),getDrawPos(y1,y2,0.2),(x2-x1)*0.04,0,Math.PI*2);
    ctx2d.fill();
    ctx2d.beginPath();
    ctx2d.arc(getDrawPos(x1,x2,0.57),getDrawPos(y1,y2,0.2),(x2-x1)*0.04,0,Math.PI*2);
    ctx2d.fill();
    if(Math.abs(Math.floor(t/80) % 80-40)==2){//まばたき
        ctx2d.lineWidth=Math.ceil((x2-x1)/100);
        ctx2d.strokeStyle="rgba(0,0,0," + trans + ")";
        ctx2d.beginPath();
        ctx2d.moveTo(getDrawPos(x1,x2,0.445)-(x2-x1)*0.025,getDrawPos(y1,y2,0.2));
        ctx2d.lineTo(getDrawPos(x1,x2,0.445)+(x2-x1)*0.025,getDrawPos(y1,y2,0.2));
        ctx2d.stroke();
        ctx2d.beginPath();
        ctx2d.moveTo(getDrawPos(x1,x2,0.585)-(x2-x1)*0.025,getDrawPos(y1,y2,0.2));
        ctx2d.lineTo(getDrawPos(x1,x2,0.585)+(x2-x1)*0.025,getDrawPos(y1,y2,0.2));
        ctx2d.stroke();
    } else{
        ctx2d.fillStyle="rgba(0,0,0,"+trans+")";//黒目
        ctx2d.beginPath();
        ctx2d.arc(getDrawPos(x1,x2,0.445),getDrawPos(y1,y2,0.2),(x2-x1)*0.025,0,Math.PI*2);
        ctx2d.fill();
        ctx2d.beginPath();
        ctx2d.arc(getDrawPos(x1,x2,0.585),getDrawPos(y1,y2,0.2),(x2-x1)*0.025,0,Math.PI*2);
        ctx2d.fill();
    }
    ctx2d.lineWidth=Math.ceil((x2-x1)/100);
    ctx2d.strokeStyle="rgba(170,0,0," + trans+")";//口
    ctx2d.beginPath();
    ctx2d.moveTo(getDrawPos(x1,x2,0.47),getDrawPos(y1,y2,0.28));
    ctx2d.lineTo(getDrawPos(x1,x2,0.5),getDrawPos(y1,y2,0.31));
    ctx2d.lineTo(getDrawPos(x1,x2,0.53),getDrawPos(y1,y2,0.28));
    ctx2d.stroke();
}
function drawBody1(myAvator,x1,y1,x2,y2,t,trans){//体を描画
    const BODY1_COLSET_DEF=[
        [[220,180,180,1],[220,140,140,1],[230,180,180,1]],
        [[180,180,230,1],[140,140,220,1],[190,190,240,1]],
        [[240,240,220,1],[220,220,120,1],[240,240,220,1]]]
    const BODY1_GRAD_COLSET=[
        [],
        [[180,0,0,1,0],[120,0,0,1,0.4],[190,20,20,1,1]]//赤の仮面
        [[0,180,0,1,0],[0,120,0,1,0.4],[20,190,20,1,1]]];//青の仮面
    var headGrad = ctx2d.createLinearGradient(getDrawPos(x1,x2,0.28),getDrawPos(y1,y2,0.742),getDrawPos(x1,x2,0.72),getDrawPos(y1,y2,0.35));
    for(var i = 0;i < BODY1_GRAD_COLSET[myAvator.item[0]].length;i++){
        headGrad.addColorStop(BODY1_GRAD_COLSET[myAvator.item[0]][i][4],"rgba(" + 
        BODY1_GRAD_COLSET[myAvator.item[0]][i][0]+","+
        BODY1_GRAD_COLSET[myAvator.item[0]][i][1]+","+
        BODY1_GRAD_COLSET[myAvator.item[0]][i][2]+","+
        BODY1_GRAD_COLSET[myAvator.item[0]][i][3]*trans+")")
    }
    if(myAvator.item[0]==0){//ノーマルボディー（チームによって色が変動)
        headGrad.addColorStop(0,"rgba("+BODY1_COLSET_DEF[myAvator.team][0][0]+","+BODY1_COLSET_DEF[myAvator.team][0][1]+","+BODY1_COLSET_DEF[myAvator.team][0][2]+","+BODY1_COLSET_DEF[myAvator.team][0][3]*trans+")")
        headGrad.addColorStop(0.4,"rgba("+BODY1_COLSET_DEF[myAvator.team][1][0]+","+BODY1_COLSET_DEF[myAvator.team][1][1]+","+BODY1_COLSET_DEF[myAvator.team][1][2]+","+BODY1_COLSET_DEF[myAvator.team][1][3]*trans+")")
        headGrad.addColorStop(1,"rgba("+BODY1_COLSET_DEF[myAvator.team][2][0]+","+BODY1_COLSET_DEF[myAvator.team][2][1]+","+BODY1_COLSET_DEF[myAvator.team][2][2]+","+BODY1_COLSET_DEF[myAvator.team][2][3]*trans+")")
    }
    ctx2d.fillStyle=headGrad;
    ctx2d.fillRect(getDrawPos(x1,x2,0.28),getDrawPos(y1,y2,0.35),getDrawPos(x1,x2,0.72)-getDrawPos(x1,x2,0.28),getDrawPos(y1,y2,0.742)-getDrawPos(y1,y2,0.35));
}
function drawBody2(myAvator,x1,y1,x2,y2,t,trans){ //２つ目のボディー要素を描画

}
function drawLimbs(myAvator,x1,y1,x2,y2,t,trans){ //手足を描画
    if(myAvator.item[3]==0){//ノーマル
        ctx2d.fillStyle="rgba(141,104,0," + trans + ")";
        ctx2d.fillRect(getDrawPos(x1,x2,0.21),getDrawPos(y1,y2,0.43),getDrawPos(x1,x2,0.28)-getDrawPos(x1,x2,0.21),getDrawPos(y1,y2,0.61)-getDrawPos(y1,y2,0.43));
        ctx2d.fillRect(getDrawPos(x1,x2,0.72),getDrawPos(y1,y2,0.43),getDrawPos(x1,x2,0.79)-getDrawPos(x1,x2,0.72),getDrawPos(y1,y2,0.61)-getDrawPos(y1,y2,0.43));
        ctx2d.fillRect(getDrawPos(x1,x2,0.38),getDrawPos(y1,y2,0.74),getDrawPos(x1,x2,0.46)-getDrawPos(x1,x2,0.38),getDrawPos(y1,y2,0.9)-getDrawPos(y1,y2,0.74));
        ctx2d.fillRect(getDrawPos(x1,x2,0.54),getDrawPos(y1,y2,0.74),getDrawPos(x1,x2,0.62)-getDrawPos(x1,x2,0.54),getDrawPos(y1,y2,0.9)-getDrawPos(y1,y2,0.74));
    }
}
function drawOthers(myAvator,x1,y1,x2,y2,t,trans){ //その他の装飾品を描画

}
function drawHead(myAvator,x1,y1,x2,y2,t,trans){//頭を描画
    const HEAD_COLSET_DEF=[
        [[220,180,180,1],[220,120,120,1],[230,180,180,1]],
        [[180,180,230,1],[120,120,220,1],[190,190,240,1]],
        [[240,240,220,1],[220,220,120,1],[240,240,220,1]]]
    const HEAD_GRAD_COLSET=[
        [],
        [[180,0,0,1,0],[120,0,0,1,0.4],[190,20,20,1,1]]//赤の仮面
        [[0,180,0,1,0],[0,120,0,1,0.4],[20,190,20,1,1]]];//青の仮面
    var headGrad = ctx2d.createLinearGradient(getDrawPos(x1,x2,0.35),getDrawPos(y1,y2,0.35),getDrawPos(x1,x2,0.65),getDrawPos(y1,y2,0.1));
    for(var i = 0;i < HEAD_GRAD_COLSET[myAvator.item[0]].length;i++){
        headGrad.addColorStop(HEAD_GRAD_COLSET[myAvator.item[0]][i][4],"rgba(" + 
        HEAD_GRAD_COLSET[myAvator.item[0]][i][0]+","+
        HEAD_GRAD_COLSET[myAvator.item[0]][i][1]+","+
        HEAD_GRAD_COLSET[myAvator.item[0]][i][2]+","+
        HEAD_GRAD_COLSET[myAvator.item[0]][i][3]*trans+")")
    }
    if(myAvator.item[0]==0){//ノーマル仮面（チームによって色が変動)
        headGrad.addColorStop(0,"rgba("+HEAD_COLSET_DEF[myAvator.team][0][0]+","+HEAD_COLSET_DEF[myAvator.team][0][1]+","+HEAD_COLSET_DEF[myAvator.team][0][2]+","+HEAD_COLSET_DEF[myAvator.team][0][3]*trans+")")
        headGrad.addColorStop(0.4,"rgba("+HEAD_COLSET_DEF[myAvator.team][1][0]+","+HEAD_COLSET_DEF[myAvator.team][1][1]+","+HEAD_COLSET_DEF[myAvator.team][1][2]+","+HEAD_COLSET_DEF[myAvator.team][1][3]*trans+")")
        headGrad.addColorStop(1,"rgba("+HEAD_COLSET_DEF[myAvator.team][2][0]+","+HEAD_COLSET_DEF[myAvator.team][2][1]+","+HEAD_COLSET_DEF[myAvator.team][2][2]+","+HEAD_COLSET_DEF[myAvator.team][2][3]*trans+")")
    }
    ctx2d.fillStyle=headGrad;
    ctx2d.fillRect(getDrawPos(x1,x2,0.35),getDrawPos(y1,y2,0.1),getDrawPos(x1,x2,0.65)-getDrawPos(x1,x2,0.35),getDrawPos(y1,y2,0.35)-getDrawPos(y1,y2,0.1));
}
function drawAvator(myAvator,x1,y1,x2,y2,t,trans){//アバターを描画する関数
    drawHead(myAvator,x1,y1,x2,y2,t,trans);
    drawFace(myAvator,x1,y1,x2,y2,t,trans);
    drawBody1(myAvator,x1,y1,x2,y2,t,trans);
    drawBody2(myAvator,x1,y1,x2,y2,t,trans);
    drawLimbs(myAvator,x1,y1,x2,y2,t,trans);
    drawOthers(myAvator,x1,y1,x2,y2,t,trans);
}