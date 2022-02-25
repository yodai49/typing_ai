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
        [[180,0,0,1,0],[120,0,0,1,0.4],[190,20,20,1,1]],//赤の服
        [[0,0,180,1,0],[0,0,120,1,0.4],[20,20,190,1,1]],//青の服
        [[210,210,0,1,0],[190,190,0,1,0.4],[210,210,0,1,1]],//黄色の服
        [[45,45,45,1,0],[5,5,5,1,0.4],[40,40,40,1,1]],//黒の服
        [[86,22,4,1,0],[146,70,24,1,0.4],[151,107,47,1,1]],//銅
        [[159,160,160,1,0],[185,195,201,1,0.4],[119,119,110,1,1]],//銀
        [[169,150,0,1,0],[160,122,22,1,0.4],[191,146,36,1,1]],//金
        [[0,0,0,0.3,0],[0,0,0,0.05,0.4],[0,0,0,0.2,1]],//透明
        [[210,210,240,1,0.2],[240,210,213,1,0.4],[244,244,244,1,1]]];//幻    
    var bodyGrad = ctx2d.createLinearGradient(getDrawPos(x1,x2,0.28),getDrawPos(y1,y2,0.742),getDrawPos(x1,x2,0.72),getDrawPos(y1,y2,0.35));
    if(myAvator==-1) {
        ctx2d.fillStyle="rgba(30,30,30," + trans + ")";
        ctx2d.fillRect(getDrawPos(x1,x2,0.28),getDrawPos(y1,y2,0.35),getDrawPos(x1,x2,0.72)-getDrawPos(x1,x2,0.28),getDrawPos(y1,y2,0.742)-getDrawPos(y1,y2,0.35));
        return 0;    
    }for(var i = 0;i < BODY1_GRAD_COLSET[myAvator.item[1]].length;i++){
        bodyGrad.addColorStop(BODY1_GRAD_COLSET[myAvator.item[1]][i][4],"rgba(" + 
        BODY1_GRAD_COLSET[myAvator.item[1]][i][0]+","+
        BODY1_GRAD_COLSET[myAvator.item[1]][i][1]+","+
        BODY1_GRAD_COLSET[myAvator.item[1]][i][2]+","+
        BODY1_GRAD_COLSET[myAvator.item[1]][i][3]*trans+")")
    }
    if(myAvator.item[1]==0){//ノーマルボディー（チームによって色が変動)
        bodyGrad.addColorStop(0,"rgba("+BODY1_COLSET_DEF[myAvator.team][0][0]+","+BODY1_COLSET_DEF[myAvator.team][0][1]+","+BODY1_COLSET_DEF[myAvator.team][0][2]+","+BODY1_COLSET_DEF[myAvator.team][0][3]*trans+")")
        bodyGrad.addColorStop(0.4,"rgba("+BODY1_COLSET_DEF[myAvator.team][1][0]+","+BODY1_COLSET_DEF[myAvator.team][1][1]+","+BODY1_COLSET_DEF[myAvator.team][1][2]+","+BODY1_COLSET_DEF[myAvator.team][1][3]*trans+")")
        bodyGrad.addColorStop(1,"rgba("+BODY1_COLSET_DEF[myAvator.team][2][0]+","+BODY1_COLSET_DEF[myAvator.team][2][1]+","+BODY1_COLSET_DEF[myAvator.team][2][2]+","+BODY1_COLSET_DEF[myAvator.team][2][3]*trans+")")
    }
    ctx2d.fillStyle=bodyGrad;
    ctx2d.fillRect(getDrawPos(x1,x2,0.28),getDrawPos(y1,y2,0.35),getDrawPos(x1,x2,0.72)-getDrawPos(x1,x2,0.28),getDrawPos(y1,y2,0.742)-getDrawPos(y1,y2,0.35));
}
function drawBody2(myAvator,x1,y1,x2,y2,t,trans){ //２つ目のボディー要素を描画
    var body2Grad;
    ctx2d.lineWidth=Math.ceil((x2-x1)/100)/2;
    ctx2d.strokeStyle="rgba(0,0,0,"+trans+")";
    if(myAvator.item[2] == 1){ //赤のバッチ
        body2Grad=ctx2d.createLinearGradient(getDrawPos(x1,x2,0.5),getDrawPos(y1,y2,0.47),getDrawPos(x1,x2,0.6),getDrawPos(y1,y2,0.42));
        body2Grad.addColorStop(0,"rgba(180,0,0,"+trans+")");
        body2Grad.addColorStop(0.4,"rgba(120,0,0,"+trans+")");
        body2Grad.addColorStop(1,"rgba(190,20,20,"+trans+")");
        ctx2d.fillStyle=body2Grad;
        ctx2d.beginPath();
        ctx2d.arc(getDrawPos(x1,x2,0.575),getDrawPos(y1,y2,0.455),getDrawPos(x1,x2,0.6)-getDrawPos(x1,x2,0.575),0,Math.PI*2);
        ctx2d.fill();
        ctx2d.stroke();
    } else if(myAvator.item[2] == 2){//青のバッチ
        body2Grad=ctx2d.createLinearGradient(getDrawPos(x1,x2,0.5),getDrawPos(y1,y2,0.47),getDrawPos(x1,x2,0.6),getDrawPos(y1,y2,0.42));
        body2Grad.addColorStop(0,"rgba(0,0,180,"+trans+")");
        body2Grad.addColorStop(0.4,"rgba(0,0,120,"+trans+")");
        body2Grad.addColorStop(1,"rgba(20,20,190,"+trans+")");
        ctx2d.fillStyle=body2Grad;
        ctx2d.beginPath();
        ctx2d.arc(getDrawPos(x1,x2,0.575),getDrawPos(y1,y2,0.455),getDrawPos(x1,x2,0.6)-getDrawPos(x1,x2,0.575),0,Math.PI*2);
        ctx2d.fill();
        ctx2d.stroke();
    }else if(myAvator.item[2] == 3){//黄のバッチ
        body2Grad=ctx2d.createLinearGradient(getDrawPos(x1,x2,0.5),getDrawPos(y1,y2,0.47),getDrawPos(x1,x2,0.6),getDrawPos(y1,y2,0.42));
        body2Grad.addColorStop(0,"rgba(210,210,0,"+trans+")");
        body2Grad.addColorStop(0.4,"rgba(190,190,0,"+trans+")");
        body2Grad.addColorStop(1,"rgba(210,210,210,"+trans+")");
        ctx2d.fillStyle=body2Grad;
        ctx2d.beginPath();
        ctx2d.arc(getDrawPos(x1,x2,0.575),getDrawPos(y1,y2,0.455),getDrawPos(x1,x2,0.6)-getDrawPos(x1,x2,0.575),0,Math.PI*2);
        ctx2d.fill();
        ctx2d.stroke();
    }else if(myAvator.item[2] == 4){ //COMバッチ
        ctx2d.lineWidth*=2/3;
        ctx2d.strokeRect(getDrawPos(x1,x2,0.55),getDrawPos(y1,y2,0.43),getDrawPos(x1,x2,0.6)-getDrawPos(x1,x2,0.55),getDrawPos(x1,x2,0.6)-getDrawPos(x1,x2,0.57));
        ctx2d.strokeRect(getDrawPos(x1,x2,0.54),getDrawPos(y1,y2,0.47),getDrawPos(x1,x2,0.61)-getDrawPos(x1,x2,0.54),getDrawPos(x1,x2,0.6)-getDrawPos(x1,x2,0.55));
        ctx2d.fillStyle="rgba(240,240,220," + trans + ")";
        ctx2d.fillRect(getDrawPos(x1,x2,0.55),getDrawPos(y1,y2,0.43),getDrawPos(x1,x2,0.6)-getDrawPos(x1,x2,0.55),getDrawPos(x1,x2,0.6)-getDrawPos(x1,x2,0.57));
        ctx2d.fillRect(getDrawPos(x1,x2,0.54),getDrawPos(y1,y2,0.47),getDrawPos(x1,x2,0.61)-getDrawPos(x1,x2,0.54),getDrawPos(x1,x2,0.6)-getDrawPos(x1,x2,0.55));
    }else if(myAvator.item[2] == 5){ //COMバッチEX
        ctx2d.lineWidth*=2/3;
        ctx2d.strokeRect(getDrawPos(x1,x2,0.55),getDrawPos(y1,y2,0.43),getDrawPos(x1,x2,0.6)-getDrawPos(x1,x2,0.55),getDrawPos(x1,x2,0.6)-getDrawPos(x1,x2,0.57));
        ctx2d.strokeRect(getDrawPos(x1,x2,0.54),getDrawPos(y1,y2,0.47),getDrawPos(x1,x2,0.61)-getDrawPos(x1,x2,0.54),getDrawPos(x1,x2,0.6)-getDrawPos(x1,x2,0.55));
        ctx2d.fillStyle="rgba(220,200,120," + trans + ")";
        ctx2d.fillRect(getDrawPos(x1,x2,0.55),getDrawPos(y1,y2,0.43),getDrawPos(x1,x2,0.6)-getDrawPos(x1,x2,0.55),getDrawPos(x1,x2,0.6)-getDrawPos(x1,x2,0.57));
        ctx2d.fillRect(getDrawPos(x1,x2,0.54),getDrawPos(y1,y2,0.47),getDrawPos(x1,x2,0.61)-getDrawPos(x1,x2,0.54),getDrawPos(x1,x2,0.6)-getDrawPos(x1,x2,0.55));        
    }else if(myAvator.item[2] == 6){ //正確性バッチ
        body2Grad=ctx2d.createLinearGradient(getDrawPos(x1,x2,0.515),getDrawPos(y1,y2,0.507),getDrawPos(x1,x2,0.6),getDrawPos(y1,y2,0.493));
        body2Grad.addColorStop(0,"rgba(210,100,210,"+trans+")");
        body2Grad.addColorStop(0.4,"rgba(140,0,120,"+trans+")");
        body2Grad.addColorStop(1,"rgba(210,0,210,"+trans+")");
        ctx2d.fillStyle=body2Grad;
        ctx2d.beginPath();
        ctx2d.arc(getDrawPos(x1,x2,0.575),getDrawPos(y1,y2,0.5),getDrawPos(x1,x2,0.6)-getDrawPos(x1,x2,0.53),0,Math.PI*2);
        ctx2d.fill();
        ctx2d.stroke();
        ctx2d.fillStyle="rgba(0,0,0," + trans ; ")";
        ctx2d.font=ctx2d.lineWidth * 8 + "pt " + MAIN_FONTNAME;
        ctx2d.fillText("A",getDrawPos(x1,x2,0.545),getDrawPos(y1,y2,0.53));
    }else if(myAvator.item[2] == 7){ //MSバッチ
        body2Grad=ctx2d.createLinearGradient(getDrawPos(x1,x2,0.515),getDrawPos(y1,y2,0.507),getDrawPos(x1,x2,0.6),getDrawPos(y1,y2,0.493));
        body2Grad.addColorStop(0,"rgba(100,210,210,"+trans+")");
        body2Grad.addColorStop(0.5,"rgba(0,120,120,"+trans+")");
        body2Grad.addColorStop(1,"rgba(0,210,210,"+trans+")");
        ctx2d.fillStyle=body2Grad;
        ctx2d.beginPath();
        ctx2d.arc(getDrawPos(x1,x2,0.575),getDrawPos(y1,y2,0.5),getDrawPos(x1,x2,0.6)-getDrawPos(x1,x2,0.53),0,Math.PI*2);
        ctx2d.fill();
        ctx2d.stroke();
        ctx2d.fillStyle="rgba(0,0,0," + trans ; ")";
        ctx2d.font=ctx2d.lineWidth * 8 + "pt " + MAIN_FONTNAME;
        ctx2d.fillText("M",getDrawPos(x1,x2,0.545),getDrawPos(y1,y2,0.53));        
    }else if(myAvator.item[2] == 8){ //完全勝利バッチ
        body2Grad=ctx2d.createLinearGradient(getDrawPos(x1,x2,0.515),getDrawPos(y1,y2,0.507),getDrawPos(x1,x2,0.6),getDrawPos(y1,y2,0.493));
        body2Grad.addColorStop(0,"rgba(210,212,230,"+trans+")");
        body2Grad.addColorStop(0.5,"rgba(210,210,210,"+trans+")");
        body2Grad.addColorStop(1,"rgba(210,210,235,"+trans+")");
        ctx2d.fillStyle=body2Grad;
        ctx2d.beginPath();
        ctx2d.arc(getDrawPos(x1,x2,0.575),getDrawPos(y1,y2,0.5),getDrawPos(x1,x2,0.6)-getDrawPos(x1,x2,0.53),0,Math.PI*2);
        ctx2d.fill();
        ctx2d.stroke();
        ctx2d.fillStyle="rgba(0,0,0," + trans ; ")";
        ctx2d.font=ctx2d.lineWidth * 8 + "pt " + MAIN_FONTNAME;
        ctx2d.fillText("C",getDrawPos(x1,x2,0.545),getDrawPos(y1,y2,0.53));
    }else if(myAvator.item[2] == 9){ //PFバッチ
        body2Grad=ctx2d.createLinearGradient(getDrawPos(x1,x2,0.515),getDrawPos(y1,y2,0.507),getDrawPos(x1,x2,0.6),getDrawPos(y1,y2,0.493));
        body2Grad.addColorStop(0,"rgba(255,200,200,"+trans+")");
        body2Grad.addColorStop(0.5,"rgba(200,200,255,"+trans+")");
        body2Grad.addColorStop(1,"rgba(255,255,200,"+trans+")");
        ctx2d.fillStyle=body2Grad;
        ctx2d.beginPath();
        ctx2d.arc(getDrawPos(x1,x2,0.575),getDrawPos(y1,y2,0.5),getDrawPos(x1,x2,0.6)-getDrawPos(x1,x2,0.53),0,Math.PI*2);
        ctx2d.fill();
        ctx2d.stroke();
        ctx2d.fillStyle="rgba(0,0,0," + trans ; ")";
        ctx2d.font=ctx2d.lineWidth * 8 + "pt " + MAIN_FONTNAME;
        ctx2d.fillText("P",getDrawPos(x1,x2,0.545),getDrawPos(y1,y2,0.53));
    }
}
function drawLimbs(myAvator,x1,y1,x2,y2,t,trans){ //手足を描画
    const LIMBS_COLSET=[
        [[56,35,18,1],[86,43,16,1],[56,25,18,1]],//土星
        [[200,20,10,1],[230,150,30,1],[180,13,16,1]],//太陽
        [[80,80,186,1],[80,186,86,1],[160,160,255,1]],//地球
        [[71,36,114,1],[0,0,30,1],[81,45,125,1]],//闇
        [[86,22,4,1,0],[146,70,24,1,0.4],[151,107,47,1,1]],//銅
        [[159,160,160,1,0],[185,195,201,1,0.4],[119,119,110,1,1]],//銀
        [[169,150,0,1,0],[160,122,22,1,0.4],[191,146,36,1,1]],//金
        [[0,0,0,0.3,0],[0,0,0,0.05,0.4],[0,0,0,0.2,0.3]],//透明
        [[210,210,240,1,0.2],[240,210,213,1,0.4],[244,244,244,1,1]]//幻
    ]
    if(myAvator==-1){
        ctx2d.fillStyle="rgba(30,30,30," + trans + ")";
        ctx2d.fillRect(getDrawPos(x1,x2,0.21),getDrawPos(y1,y2,0.44),getDrawPos(x1,x2,0.28)-getDrawPos(x1,x2,0.21),getDrawPos(y1,y2,0.61)-getDrawPos(y1,y2,0.43));
        ctx2d.fillRect(getDrawPos(x1,x2,0.72),getDrawPos(y1,y2,0.44),getDrawPos(x1,x2,0.79)-getDrawPos(x1,x2,0.72),getDrawPos(y1,y2,0.61)-getDrawPos(y1,y2,0.43));
        ctx2d.fillRect(getDrawPos(x1,x2,0.38),getDrawPos(y1,y2,0.745),getDrawPos(x1,x2,0.46)-getDrawPos(x1,x2,0.38),getDrawPos(y1,y2,0.9)-getDrawPos(y1,y2,0.74));
        ctx2d.fillRect(getDrawPos(x1,x2,0.54),getDrawPos(y1,y2,0.745),getDrawPos(x1,x2,0.62)-getDrawPos(x1,x2,0.54),getDrawPos(y1,y2,0.9)-getDrawPos(y1,y2,0.74));
        return 0;
    } 
    if(myAvator.item[3]==0 ||myAvator.item[3]==1 ||myAvator.item[3]==2 ||myAvator.item[3]==3 ||myAvator.item[3]==4){//ノーマルの手足
        ctx2d.fillStyle="rgba(140,60,0," + trans + ")";
        ctx2d.fillRect(getDrawPos(x1,x2,0.21),getDrawPos(y1,y2,0.44),getDrawPos(x1,x2,0.28)-getDrawPos(x1,x2,0.21),getDrawPos(y1,y2,0.61)-getDrawPos(y1,y2,0.43));
        ctx2d.fillRect(getDrawPos(x1,x2,0.72),getDrawPos(y1,y2,0.44),getDrawPos(x1,x2,0.79)-getDrawPos(x1,x2,0.72),getDrawPos(y1,y2,0.61)-getDrawPos(y1,y2,0.43));
        ctx2d.fillRect(getDrawPos(x1,x2,0.38),getDrawPos(y1,y2,0.745),getDrawPos(x1,x2,0.46)-getDrawPos(x1,x2,0.38),getDrawPos(y1,y2,0.9)-getDrawPos(y1,y2,0.74));
        ctx2d.fillRect(getDrawPos(x1,x2,0.54),getDrawPos(y1,y2,0.745),getDrawPos(x1,x2,0.62)-getDrawPos(x1,x2,0.54),getDrawPos(y1,y2,0.9)-getDrawPos(y1,y2,0.74));
    }
    if(myAvator.item[3] == 1 || myAvator.item[3] == 2 || myAvator.item[3] == 3 || myAvator.item[3] == 4){//靴類
        var limbsGradL = ctx2d.createLinearGradient(getDrawPos(x1,x2,0.38),getDrawPos(y1,y2,0.9),getDrawPos(x1,x2,0.46),getDrawPos(y1,y2,0.85));
        var limbsGradR = ctx2d.createLinearGradient(getDrawPos(x1,x2,0.54),getDrawPos(y1,y2,0.9),getDrawPos(x1,x2,0.62),getDrawPos(y1,y2,0.85));
        limbsGradL.addColorStop(0,"rgba("+LIMBS_COLSET[myAvator.item[3]-1][0][0]+","+LIMBS_COLSET[myAvator.item[3]-1][0][1]+","+LIMBS_COLSET[myAvator.item[3]-1][0][2]+","+LIMBS_COLSET[myAvator.item[3]-1][0][3]*trans+")")
        limbsGradL.addColorStop(0.4,"rgba("+LIMBS_COLSET[myAvator.item[3]-1][1][0]+","+LIMBS_COLSET[myAvator.item[3]-1][1][1]+","+LIMBS_COLSET[myAvator.item[3]-1][1][2]+","+LIMBS_COLSET[myAvator.item[3]-1][1][3]*trans+")")
        limbsGradL.addColorStop(1.0,"rgba("+LIMBS_COLSET[myAvator.item[3]-1][2][0]+","+LIMBS_COLSET[myAvator.item[3]-1][2][1]+","+LIMBS_COLSET[myAvator.item[3]-1][2][2]+","+LIMBS_COLSET[myAvator.item[3]-1][2][3]*trans+")")
        limbsGradR.addColorStop(0,"rgba("+LIMBS_COLSET[myAvator.item[3]-1][0][0]+","+LIMBS_COLSET[myAvator.item[3]-1][0][1]+","+LIMBS_COLSET[myAvator.item[3]-1][0][2]+","+LIMBS_COLSET[myAvator.item[3]-1][0][3]*trans+")")
        limbsGradR.addColorStop(0.4,"rgba("+LIMBS_COLSET[myAvator.item[3]-1][1][0]+","+LIMBS_COLSET[myAvator.item[3]-1][1][1]+","+LIMBS_COLSET[myAvator.item[3]-1][1][2]+","+LIMBS_COLSET[myAvator.item[3]-1][1][3]*trans+")")
        limbsGradR.addColorStop(1.0,"rgba("+LIMBS_COLSET[myAvator.item[3]-1][2][0]+","+LIMBS_COLSET[myAvator.item[3]-1][2][1]+","+LIMBS_COLSET[myAvator.item[3]-1][2][2]+","+LIMBS_COLSET[myAvator.item[3]-1][2][3]*trans+")")
        ctx2d.fillStyle=limbsGradL;
        ctx2d.fillRect(getDrawPos(x1,x2,0.38),getDrawPos(y1,y2,0.85),getDrawPos(x1,x2,0.46)-getDrawPos(x1,x2,0.38),getDrawPos(y1,y2,0.92)-getDrawPos(y1,y2,0.85));
        ctx2d.fillStyle=limbsGradR;
        ctx2d.fillRect(getDrawPos(x1,x2,0.54),getDrawPos(y1,y2,0.85),getDrawPos(x1,x2,0.62)-getDrawPos(x1,x2,0.54),getDrawPos(y1,y2,0.92)-getDrawPos(y1,y2,0.85));
    } else if(myAvator.item[3] >= 5 && myAvator.item[3] <= 9){
        var limbsGradL = ctx2d.createLinearGradient(getDrawPos(x1,x2,0.21),getDrawPos(y1,y2,0.61),getDrawPos(x1,x2,0.28),getDrawPos(y1,y2,0.43));    // 足
        var limbsGradR = ctx2d.createLinearGradient(getDrawPos(x1,x2,0.72),getDrawPos(y1,y2,0.61),getDrawPos(x1,x2,0.79),getDrawPos(y1,y2,0.43));
        limbsGradL.addColorStop(0,"rgba("+LIMBS_COLSET[myAvator.item[3]-1][0][0]+","+LIMBS_COLSET[myAvator.item[3]-1][0][1]+","+LIMBS_COLSET[myAvator.item[3]-1][0][2]+","+LIMBS_COLSET[myAvator.item[3]-1][0][3]*trans+")")
        limbsGradL.addColorStop(0.4,"rgba("+LIMBS_COLSET[myAvator.item[3]-1][1][0]+","+LIMBS_COLSET[myAvator.item[3]-1][1][1]+","+LIMBS_COLSET[myAvator.item[3]-1][1][2]+","+LIMBS_COLSET[myAvator.item[3]-1][1][3]*trans+")")
        limbsGradL.addColorStop(1.0,"rgba("+LIMBS_COLSET[myAvator.item[3]-1][2][0]+","+LIMBS_COLSET[myAvator.item[3]-1][2][1]+","+LIMBS_COLSET[myAvator.item[3]-1][2][2]+","+LIMBS_COLSET[myAvator.item[3]-1][2][3]*trans+")")
        limbsGradR.addColorStop(0,"rgba("+LIMBS_COLSET[myAvator.item[3]-1][0][0]+","+LIMBS_COLSET[myAvator.item[3]-1][0][1]+","+LIMBS_COLSET[myAvator.item[3]-1][0][2]+","+LIMBS_COLSET[myAvator.item[3]-1][0][3]*trans+")")
        limbsGradR.addColorStop(0.4,"rgba("+LIMBS_COLSET[myAvator.item[3]-1][1][0]+","+LIMBS_COLSET[myAvator.item[3]-1][1][1]+","+LIMBS_COLSET[myAvator.item[3]-1][1][2]+","+LIMBS_COLSET[myAvator.item[3]-1][1][3]*trans+")")
        limbsGradR.addColorStop(1.0,"rgba("+LIMBS_COLSET[myAvator.item[3]-1][2][0]+","+LIMBS_COLSET[myAvator.item[3]-1][2][1]+","+LIMBS_COLSET[myAvator.item[3]-1][2][2]+","+LIMBS_COLSET[myAvator.item[3]-1][2][3]*trans+")")
        ctx2d.fillStyle=limbsGradL;
        ctx2d.fillRect(getDrawPos(x1,x2,0.21),getDrawPos(y1,y2,0.44),getDrawPos(x1,x2,0.28)-getDrawPos(x1,x2,0.21),getDrawPos(y1,y2,0.61)-getDrawPos(y1,y2,0.43));
        ctx2d.fillStyle=limbsGradR;
        ctx2d.fillRect(getDrawPos(x1,x2,0.72),getDrawPos(y1,y2,0.44),getDrawPos(x1,x2,0.79)-getDrawPos(x1,x2,0.72),getDrawPos(y1,y2,0.61)-getDrawPos(y1,y2,0.43));

        limbsGradL = ctx2d.createLinearGradient(getDrawPos(x1,x2,0.38),getDrawPos(y1,y2,0.9),getDrawPos(x1,x2,0.46),getDrawPos(y1,y2,0.74));    // 手
        limbsGradR = ctx2d.createLinearGradient(getDrawPos(x1,x2,0.54),getDrawPos(y1,y2,0.9),getDrawPos(x1,x2,0.62),getDrawPos(y1,y2,0.74));
        limbsGradL.addColorStop(0,"rgba("+LIMBS_COLSET[myAvator.item[3]-1][0][0]+","+LIMBS_COLSET[myAvator.item[3]-1][0][1]+","+LIMBS_COLSET[myAvator.item[3]-1][0][2]+","+LIMBS_COLSET[myAvator.item[3]-1][0][3]*trans+")")
        limbsGradL.addColorStop(0.4,"rgba("+LIMBS_COLSET[myAvator.item[3]-1][1][0]+","+LIMBS_COLSET[myAvator.item[3]-1][1][1]+","+LIMBS_COLSET[myAvator.item[3]-1][1][2]+","+LIMBS_COLSET[myAvator.item[3]-1][1][3]*trans+")")
        limbsGradL.addColorStop(1.0,"rgba("+LIMBS_COLSET[myAvator.item[3]-1][2][0]+","+LIMBS_COLSET[myAvator.item[3]-1][2][1]+","+LIMBS_COLSET[myAvator.item[3]-1][2][2]+","+LIMBS_COLSET[myAvator.item[3]-1][2][3]*trans+")")
        limbsGradR.addColorStop(0,"rgba("+LIMBS_COLSET[myAvator.item[3]-1][0][0]+","+LIMBS_COLSET[myAvator.item[3]-1][0][1]+","+LIMBS_COLSET[myAvator.item[3]-1][0][2]+","+LIMBS_COLSET[myAvator.item[3]-1][0][3]*trans+")")
        limbsGradR.addColorStop(0.4,"rgba("+LIMBS_COLSET[myAvator.item[3]-1][1][0]+","+LIMBS_COLSET[myAvator.item[3]-1][1][1]+","+LIMBS_COLSET[myAvator.item[3]-1][1][2]+","+LIMBS_COLSET[myAvator.item[3]-1][1][3]*trans+")")
        limbsGradR.addColorStop(1.0,"rgba("+LIMBS_COLSET[myAvator.item[3]-1][2][0]+","+LIMBS_COLSET[myAvator.item[3]-1][2][1]+","+LIMBS_COLSET[myAvator.item[3]-1][2][2]+","+LIMBS_COLSET[myAvator.item[3]-1][2][3]*trans+")")
        ctx2d.fillStyle=limbsGradL;
        ctx2d.fillRect(getDrawPos(x1,x2,0.38),getDrawPos(y1,y2,0.745),getDrawPos(x1,x2,0.46)-getDrawPos(x1,x2,0.38),getDrawPos(y1,y2,0.9)-getDrawPos(y1,y2,0.74));
        ctx2d.fillStyle=limbsGradR;
        ctx2d.fillRect(getDrawPos(x1,x2,0.54),getDrawPos(y1,y2,0.745),getDrawPos(x1,x2,0.62)-getDrawPos(x1,x2,0.54),getDrawPos(y1,y2,0.9)-getDrawPos(y1,y2,0.74));
    }
}
function drawOthers(myAvator,x1,y1,x2,y2,t,trans){ //その他の装飾品を描画
    ctx2d.lineWidth=Math.ceil((x2-x1)/50)/2;
    if(myAvator.item[4] == 1){ //絢爛な首飾り
        ctx2d.strokeStyle="rgba(220,200,110," + trans + ")";
        ctx2d.beginPath();
        ctx2d.moveTo(getDrawPos(x1,x2,0.5),getDrawPos(y1,y2,0.41));
        ctx2d.lineTo(getDrawPos(x1,x2,0.55),getDrawPos(y1,y2,0.41));
        ctx2d.lineTo(getDrawPos(x1,x2,0.5),getDrawPos(y1,y2,0.45));
        ctx2d.lineTo(getDrawPos(x1,x2,0.45),getDrawPos(y1,y2,0.41));
        ctx2d.lineTo(getDrawPos(x1,x2,0.5),getDrawPos(y1,y2,0.41));
        ctx2d.stroke();
    } else if(myAvator.item[4] == 2){ //鞍替えの紋章
        ctx2d.strokeStyle="rgba(0,0,0," + trans + ")";
        ctx2d.strokeRect(getDrawPos(x1,x2,0.4),getDrawPos(y1,y2,0.4),getDrawPos(x1,x2,0.6)-getDrawPos(x1,x2,0.4),getDrawPos(y1,y2,0.6)-getDrawPos(y1,y2,0.4));
        ctx2d.strokeRect(getDrawPos(x1,x2,0.43),getDrawPos(y1,y2,0.43),getDrawPos(x1,x2,0.53)-getDrawPos(x1,x2,0.43),getDrawPos(y1,y2,0.53)-getDrawPos(y1,y2,0.43));
        ctx2d.strokeRect(getDrawPos(x1,x2,0.47),getDrawPos(y1,y2,0.47),getDrawPos(x1,x2,0.53)-getDrawPos(x1,x2,0.43),getDrawPos(y1,y2,0.53)-getDrawPos(y1,y2,0.43));
        ctx2d.strokeRect(getDrawPos(x1,x2,0.47),getDrawPos(y1,y2,0.43),getDrawPos(x1,x2,0.53)-getDrawPos(x1,x2,0.43),getDrawPos(y1,y2,0.53)-getDrawPos(y1,y2,0.43));
        ctx2d.strokeRect(getDrawPos(x1,x2,0.43),getDrawPos(y1,y2,0.47),getDrawPos(x1,x2,0.53)-getDrawPos(x1,x2,0.43),getDrawPos(y1,y2,0.53)-getDrawPos(y1,y2,0.43));
    } else if(myAvator.item[4]==3 || myAvator.item[4] == 4){//銀冠、金冠
        ctx2d.drawImage(otherPartsImg[myAvator.item[4]-3],getDrawPos(x1,x2,0.44),getDrawPos(y1,y2,0.0),getDrawPos(x1,x2,0.56)-getDrawPos(x1,x2,0.44),getDrawPos(y1,y2,0.11)-getDrawPos(y1,y2,0.00))
    } else if(myAvator.item[4] >= 5 && myAvator.item[4] <= 9){ //冠類
        ctx2d.drawImage(otherPartsImg[myAvator.item[4]-3],getDrawPos(x1,x2,0.12),getDrawPos(y1,y2,0.4),getDrawPos(x1,x2,0.27)-getDrawPos(x1,x2,0.12),getDrawPos(y1,y2,0.9)-getDrawPos(y1,y2,0.40))        
    }
}
function drawHead(myAvator,x1,y1,x2,y2,t,trans){//頭を描画
    const HEAD_COLSET_DEF=[
        [[220,180,180,1],[220,120,120,1],[230,180,180,1]],
        [[180,180,230,1],[120,120,220,1],[190,190,240,1]],
        [[240,240,220,1],[220,220,120,1],[240,240,220,1]]]
    const HEAD_GRAD_COLSET=[
        [],
        [[180,0,0,1,0],[120,0,0,1,0.4],[190,20,20,1,1]],//赤の服
        [[0,0,180,1,0],[0,0,120,1,0.4],[20,20,190,1,1]],//青の服
        [[210,210,0,1,0],[190,190,0,1,0.4],[210,210,0,1,1]],//黄色の服
        [[45,45,45,1,0],[5,5,5,1,0.4],[40,40,40,1,1]],//黒の服
        [[86,22,4,1,0],[146,70,24,1,0.4],[151,107,47,1,1]],//銅
        [[159,160,160,1,0],[185,195,201,1,0.4],[119,119,110,1,1]],//銀
        [[169,150,0,1,0],[160,122,22,1,0.4],[191,146,36,1,1]],//金
        [[0,0,0,0.3,0],[0,0,0,0.05,0.4],[0,0,0,0.2,1]],//透明
        [[210,210,240,1,0.2],[240,210,213,1,0.4],[244,244,244,1,1]]];//幻
    var headGrad = ctx2d.createLinearGradient(getDrawPos(x1,x2,0.35),getDrawPos(y1,y2,0.35),getDrawPos(x1,x2,0.65),getDrawPos(y1,y2,0.1));
    if(myAvator==-1) {
        ctx2d.fillStyle="rgba(30,30,30," + trans + ")";
        ctx2d.fillRect(getDrawPos(x1,x2,0.35),getDrawPos(y1,y2,0.16),getDrawPos(x1,x2,0.65)-getDrawPos(x1,x2,0.35),getDrawPos(y1,y2,0.35)-getDrawPos(y1,y2,0.1));
        return 0;    
    }
    for(var i = 0;i < HEAD_GRAD_COLSET[myAvator.item[0]].length;i++){
        headGrad.addColorStop(HEAD_GRAD_COLSET[myAvator.item[0]][i][4],"rgba(" + 
        HEAD_GRAD_COLSET[myAvator.item[0]][i][0]+","+
        HEAD_GRAD_COLSET[myAvator.item[0]][i][1]+","+
        HEAD_GRAD_COLSET[myAvator.item[0]][i][2]+","+
        HEAD_GRAD_COLSET[myAvator.item[0]][i][3]*Math.min(1,trans)+")")
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
    drawLimbs(myAvator,x1,y1,x2,y2,t,trans);
    drawBody1(myAvator,x1,y1,x2,y2,t,trans);
    drawOthers(myAvator,x1,y1,x2,y2,t,trans);//その他　鞍替えの紋章はbody1のあと、body2の前のため、この位置
    drawBody2(myAvator,x1,y1,x2,y2,t,trans);
}
function drawGhost(x1,y1,x2,y2,t,trans){//アバターの影を描画する関数
    drawHead(-1,x1,y1,x2,y2,t,trans);
    drawBody1(-1,x1,y1,x2,y2,t,trans);
    drawLimbs(-1,x1,y1,x2,y2,t,trans);
}
function drawStar(myAvator,x,y,size){
    var starNum=myAvator.star%5;
    var starKind=Math.floor(myAvator.star/5);
    for(let i = 0;i < 5;i++){
        if (i < starNum+1){
            ctx2d.drawImage(starImg[starKind],x+(i*size*1.1),y,size,size);
        } else{
            ctx2d.drawImage(starImg[6],x+(i*size*1.1),y,size,size);
        }
    }
}