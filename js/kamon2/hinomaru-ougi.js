'use strict';

import * as THREE from 'three';
import Kamon from '../kamon2.js';

export default class HinomaruOugi extends Kamon {

  constructor() {

    super();

    // infoのテキスト
    this.jpNameText = '日の丸扇';
    this.jpDescText = '扇紋は扇を図案化した家紋です。扇はあおいで風を起こすという主要な用途の他に、芸能などにおける小道具や呪具、遊び道具など多様な用途で親しまれています。';
    this.enNameText = 'Hinomaru-ougi';
    this.enDescText = 'The fan crest is a family crest that depicts a fan. In addition to its main use of fanning to create wind, fans are also used for a variety of other purposes, including as props for performing arts, magical tools, and playthings.';

    // ガイドラインの表示アニメーションパラメータ
    this.guidelineParams = {
      drawIn   : [0.10, 0.40],
      drawOut  : [0.55, 0.80],
      fadeIn1  : [0.00, 0.00],
      fadeOut1 : [0.35, 0.40],
      fadeIn2  : [0.625, 0.675],
      fadeOut2 : [0.80, 0.85],
      scaleIn  : [0.00, 0.00],
      scaleOut : [0.70, 0.90],
    }

    // アウトラインの表示アニメーションパラメータ
    this.outlineParams = {
      fadeIn1  : [0.30, 0.35],
      fadeOut1 : [0.35 ,0.40],
      fadeIn2  : [0.60, 0.65],
      fadeOut2 : [0.65, 0.70],
      scaleIn  : [0.00, 0.00],
      scaleOut : [1.00, 1.00],
    }

    // 図形の表示アニメーションパラメータ
    this.shapeParams = {
      fadeIn   : [0.35, 0.40],
      fadeOut  : [0.60, 0.65],
    }

    // 説明欄の表示アニメーションパラメータ
    this.descParams = {
      fadeIn   : [0.35, 0.40],
      fadeOut  : [0.60, 0.65],
    }




    const w = 4;

    // 円
    this.circles = [
      {a: 0, b: 0, r: 1600}, // 中骨用の補助円
      {a: 0, b: 0, r:  240}, // 要部分の補助円
      {a: 0, b: - 128, r:  900}, // 扇の地
      {a: 0, b:   192, r: 1760}, // 扇の天
      {a: 0, b:     0, r:   30}, // 要
      {a: 0, b:  1360, r:  515}, // 扇面の日の丸
    ];

    // 中骨の直線の式
    this.forms = [];
    for (var i = 0;i <= 2;i ++) {
      const group1 = [];
      for (var j = 0;j <= 4;j ++) {
        const fromAngle = - 30 * (j + 1);
        const group2 = [];
        for (var k = 0;k <= 2;k ++) {
          var circle;
          if (k == 0) {
            circle = this.circles[0];
          } else {
            const theta = THREE.MathUtils.degToRad(fromAngle + 270);
            const hypo = 36 + w * (i - 1);
            const sign = (3 - k * 2);
            const a = hypo * Math.cos(theta) * sign;
            const b = hypo * Math.sin(theta) * sign;
            circle = {a: a, b: b, r: this.circles[0].r};
          }
          const lineFrom = this.circumPoint(circle, fromAngle);
          const lineTo   = this.circumPoint(circle, fromAngle + 180);
          const form = this.from2Points(lineFrom, lineTo);
          group2.push(form);
        }
        group1.push(group2);
      }
      this.forms.push(group1);
    }

    // 天の孤の角度
    const topInter1 = this.interLineCircle(this.circles[3], this.forms[1][0][1]);
    const topInter2 = this.interLineCircle(this.circles[3], this.forms[1][4][2]);
    const topInter3 = this.interLineCircle(this.circles[3], this.forms[1][4][1]);
    this.topArc1 = [
      this.circumAngle(this.circles[3], topInter1[1]),
      this.circumAngle(this.circles[3], topInter2[0]),
    ];
    this.topArc2 = [
      this.circumAngle(this.circles[3], topInter1[1]),
      this.circumAngle(this.circles[3], topInter3[0]),
    ];
    this.topArc3 = [
      this.circumAngle(this.circles[3], topInter2[0]),
      this.circumAngle(this.circles[3], topInter3[0]),
    ];

    // 地の孤の角度
    const botInter = [
      this.interLineCircle(this.circles[2], this.forms[1][0][1]),
      this.interLineCircle(this.circles[2], this.forms[1][4][1]),
    ];
    this.botArc = [
      this.circumAngle(this.circles[2], botInter[0][1]),
      this.circumAngle(this.circles[2], botInter[1][0]),
    ];

  }

  // オブジェクトを生成
  init = () => {

    // ガイドラインの作成
    this.generateGuideline();

    // アウトラインの作成
    this.generateOutline();

    // 塗りつぶし図形の描画
    this.generateShape();

  }

  // 直線と円の交点を求める（r: 半径, h: 中心X座標, k: 中心Y座標, m: 直線式の傾き, n: 直線式の切片）
  interLineCircle = (circle, form) => {
    const h = circle.a;
    const k = circle.b;
    const r = circle.r;
    const m = form.a;
    const n = form.c;

    var a = 1 + Math.pow(m, 2);
    var b = - 2 * h + 2 * m * (n - k);
    var c = Math.pow(h, 2) + Math.pow((n - k), 2) - Math.pow(r, 2);
    var D = Math.pow(b, 2) - 4 * a * c;

    var kouten = [];
    if (D >= 0) {
      if (form.b == 0) {
        var x1 = n;
        var x2 = n;
      } else {
        var x1 = (- b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
        var x2 = (- b - Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
      }
      if (D == 0) {
        kouten.push(new THREE.Vector3(x1, m * x1 + n, 0));
      } else {
        if (form.b == 0) {
          kouten.push(new THREE.Vector3(n, - r + k, 0));
          kouten.push(new THREE.Vector3(n, r + k, 0));
        } else {
          kouten.push(new THREE.Vector3(x1, m * x1 + n, 0));
          kouten.push(new THREE.Vector3(x2, m * x2 + n, 0));
        }
      }
    }
    return kouten;
  }

  // ２直線の交点を求める式（form1,2: 直線の式）
  getIntersect(form1, form2) {
    const a1 = form1.a;
    const b1 = form1.b;
    const c1 = form1.c;
    const a2 = form2.a;
    const b2 = form2.b;
    const c2 = form2.c;
    var x, y;
    if (b1 == 0) {
      x = c1;
      y = (a2 * c1 + c2) / b2;
    } else if (b2 == 0) {
      x = c2;
      y = (a1 * c2 + c1) / b1;
    } else {
      x = (c2 - c1) / (a1 - a2);
      y = ((a1 * c2) - (a2 * c1)) / (a1 - a2);
    }
    return new THREE.Vector3(x, y, 0);
  }

  // ガイドラインを作成
  generateGuideline = () => {

    // 中骨の補助円１
    const circles1 = [this.circles[0]];
    circles1.forEach((circle) => {
      const points = this.circleLocusGen(circle, [90, 450], this.divCount);
      const mesh = this.sublineGen(points);
      mesh.geometry.translate(0, - 832, 0);
      this.guidelines.add(mesh);
    })

    // 天の円
    const circles2 = [this.circles[3]];
    circles2.forEach((circle) => {
      const points = this.circleLocusGen(circle, [90, 450], this.divCount);
      const mesh = this.guidelineGen(points);
      mesh.geometry.translate(0, - 832, 0);
      this.guidelines.add(mesh);
    })

    // 中骨の補助線
    for (var i = 0;i <= 4;i ++) {
      const form = this.forms[1][i][0];
      const inter = this.interLineCircle(this.circles[3], form);
      const pointFrom = inter[i <= 2 ? 0 : 1];
      const pointTo = inter[i <= 2 ? 1 : 0];
      const line = this.lineLocusGen(pointFrom, pointTo, 0, this.divCount);
      const mesh = this.sublineGen(line);
      mesh.geometry.translate(0, - 832, 0);
      this.guidelines.add(mesh);
    }

    // 中骨
    for (var i = 0;i <= 4;i ++) {
      const group = new THREE.Group();
      for (var j = 1;j <= 2;j ++) {
        const form = this.forms[1][i][j];
        const inter = this.interLineCircle(this.circles[3], form);
        const pointFrom = inter[i <= 2 ? 0 : 1];
        const pointTo = inter[i <= 2 ? 1 : 0];
        const line = this.lineLocusGen(pointFrom, pointTo, 0, this.divCount);
        const mesh = this.guidelineGen(line);
        mesh.geometry.translate(0, - 832, 0);
        group.add(mesh);
      }
      this.guidelines.add(group);
    }

    // 地の円
    const circles3 = [this.circles[2]];
    circles3.forEach((circle) => {
      const points = this.circleLocusGen(circle, [90, 450], this.divCount);
      const mesh = this.guidelineGen(points);
      mesh.geometry.translate(0, - 832, 0);
      this.guidelines.add(mesh);
    })

    // 中骨の補助円２
    const circles4 = [this.circles[1]];
    circles4.forEach((circle) => {
      const points = this.circleLocusGen(circle, [90, 450], this.divCount);
      const mesh = this.sublineGen(points);
      mesh.geometry.translate(0, - 832, 0);
      this.guidelines.add(mesh);
    })

    // 要の先端
    const circles5 = [this.circles[1]];
    circles5.forEach((circle) => {
      for (var i = 0;i <= 4;i ++) {
        const center = this.circumPoint(circle, 210 + (30 * i));
        const dCircle = {a: center.x, b: center.y, r: 38};
        const points = this.circleLocusGen(dCircle, [90, 450], this.divCount);
        const mesh = this.guidelineGen(points);
        mesh.geometry.translate(0, - 832, 0);
        this.guidelines.add(mesh);
      }
    })

    // 要と日の丸
    const circles6 = [this.circles[4], this.circles[5]];
    circles6.forEach((circle) => {
      const points = this.circleLocusGen(circle, [90, 450], this.divCount);
      const mesh = this.guidelineGen(points);
      mesh.geometry.translate(0, - 832, 0);
      this.guidelines.add(mesh);
    })

    this.group.add(this.guidelines);
  }

  // アウトラインを作成
  generateOutline = () => {

    // 扇
    const circles = [this.circles[2], this.circles[3], this.circles[4], this.circles[5]];
    const angles = [this.botArc, this.topArc1, [0, 360], [0, 360]];
    const clockwises = [true, true, false, false];
    for (var i = 0;i <= circles.length - 1;i ++) {
      const circle = circles[i];
      const angle = angles[i];
      const clockwise = clockwises[i];
      const geo = this.curveOutlineGeoGen(circle, angle, clockwise);
      const mesh = new THREE.Mesh(geo, this.outlineMat);
      mesh.geometry.translate(0, - 832, 0);
      this.outlines.add(mesh);
    }

    // 中骨
    for (var i = 0;i <= 4;i ++) {

      // 半円
      const center = this.circumPoint(this.circles[1], 210 + (30 * i));
      const circle = {a: center.x, b: center.y, r: 38};
      const angles = [120 + 30 * i, 300 + 30 * i];
      const geo = this.curveOutlineGeoGen(circle, angles, false);
      const mesh = new THREE.Mesh(geo, this.outlineMat);
      mesh.geometry.translate(0, - 832, 0);
      this.outlines.add(mesh);

      // 直線
      if (i == 0) {
        for (var j = 0;j <= 1;j ++) {
          const angle = angles[j];
          const pointFrom = this.circumPoint(circle, angle);
          const pointTo = this.interLineCircle(
            this.circles[3], 
            this.forms[1][4][j + 1])[0];
          const geo = this.outlineGeoGen(pointFrom, pointTo);
          const mesh = new THREE.Mesh(geo, this.outlineMat);
          mesh.geometry.translate(0, - 832, 0);
          this.outlines.add(mesh);
        }
      } else {
        for (var j = 0;j <= 1;j ++) {
          const angle = angles[j];
          for (var k = 0;k <= 1;k ++) {
            var pointFrom, pointTo;
            if (k == 0) {
              pointFrom = this.circumPoint(circle, angle);
              pointTo = this.getIntersect(
                this.forms[1][4 - i][j + 1],
                this.forms[1][j == 0 ? 5 - i : 4][2]);
            } else {
              pointFrom = this.getIntersect(
                this.forms[1][4 - i][j + 1],
                this.forms[1][j == 0 ? 4 : 5 - i][1]);
              pointTo = this.interLineCircle(
                this.circles[i == 4 && j == 0 ? 3 : 2],
                this.forms[1][4 - i][j + 1])[i == 1 ? 0 : 1];
            }
            const geo = this.outlineGeoGen(pointFrom, pointTo);
            const mesh = new THREE.Mesh(geo, this.outlineMat);
            mesh.geometry.translate(0, - 832, 0);
            this.outlines.add(mesh);
          }
        }
      }
    }

    this.group.add(this.outlines);
  }

  // 塗りつぶし図形を生成
  generateShape = () => {

    const w = 4;

    // 扇
    const c3 = this.circles[3];
    const topCircle = {a: c3.a, b: c3.b, r: c3.r - w};
    const topTheta = THREE.MathUtils.radToDeg(Math.asin(4 / (c3.r - w)));
    const topAngles = [
      this.topArc2[0] - topTheta,
      this.topArc2[1] + topTheta,
    ];
    const topCurve = this.curvePointGen(topCircle, topAngles, true);

    const c2 = this.circles[2];
    const botCircle = {a: c2.a, b: c2.b, r: c2.r + w};
    const botTheta = THREE.MathUtils.radToDeg(Math.asin(4 / (c2.r - w)));
    const botAngles = [
      this.botArc[1] + botTheta,
      this.botArc[0] - botTheta,
    ];
    const botCurve = this.curvePointGen(botCircle, botAngles, false);

    const shapes = topCurve.concat(botCurve);
    const c5 = this.circles[5];
    const sunCircle = {a: c5.a, b: c5.b, r: c5.r - w};
    const pathes = this.curvePointGen(sunCircle, [0, 360], true);
    const geo = this.shapeGeoGen(shapes, pathes);
    const mesh = new THREE.Mesh(geo, this.shapeMat);
    mesh.geometry.translate(0, - 832, 0);
    this.shapes.add(mesh);

    // 中骨
    for (var i = 0;i <= 4;i ++) {
      const center = this.circumPoint(this.circles[1], 210 + (30 * i));
      const circle = {a: center.x, b: center.y, r: 38 - w};
      const angle = [120 + 30 * i, 300 + 30 * i];

      if (i == 0) {
        const curve1 = this.curvePointGen(circle, angle, false);
        const curve2 = this.curvePointGen(topCircle, [this.topArc3[0] + topTheta, this.topArc3[1] - topTheta], false);
        const shapes = curve1.concat(curve2);
        const c4 = this.circles[4];
        const pivot = {a: c4.a, b: c4.b, r: c4.r - w};
        const pathes = this.curvePointGen(pivot, [0, 360], true);
        const geo = this.shapeGeoGen(shapes, pathes);
        const mesh = new THREE.Mesh(geo, this.shapeMat);
        mesh.geometry.translate(0, - 832, 0);
        this.shapes.add(mesh);
      } else {
        for (var j = 0;j <= 1;j ++) {
          var points;
          if (j == 0) {
            const curve = this.curvePointGen(circle, angle, false);
            var apices = [
              this.getIntersect(this.forms[0][4 - i][2], this.forms[2][4][2]),
              this.getIntersect(this.forms[2][5 - i][2], this.forms[2][4][2]),
              this.getIntersect(this.forms[0][4 - i][1], this.forms[2][5 - i][2]),
            ];
            if (i == 1) apices.splice(1, 1);
            points = curve.concat(apices);
          } else {
            var apices = [
              this.getIntersect(this.forms[0][4 - i][1], this.forms[2][4][1]),
              this.getIntersect(this.forms[2][5 - i][1], this.forms[2][4][1]),
              this.getIntersect(this.forms[0][4 - i][2], this.forms[2][5 - i][1]),
            ];
            if (i == 1) apices.splice(1, 1);
            const botInCircle = {a: c2.a, b: c2.b, r: c2.r - w};
            const interFrom = this.interLineCircle(botInCircle, this.forms[0][4 - i][2])[i < 2 ? 0 : 1];
            const interTo = this.interLineCircle(botInCircle, this.forms[0][4 - i][1])[i < 2 ? 0 : 1];
            const angles = [
              this.circumAngle(botInCircle, interFrom),
              this.circumAngle(botInCircle, interTo)
            ];
            const curve = this.curvePointGen(botInCircle, angles, false);
            points = curve.concat(apices);
          }
          const geo = this.shapeGeoGen(points);
          const mesh = new THREE.Mesh(geo, this.shapeMat);
          mesh.geometry.translate(0, - 832, 0);
          this.shapes.add(mesh);
        }
      }
    }

    this.group.add(this.shapes);
  }

  // ガイドラインの表示制御
  guidelineDisplayControl = (progRatio) => {
    const param = this.guidelineParams;
    const drawInRatio   = THREE.MathUtils.smoothstep(progRatio, param.drawIn[0]  , param.drawIn[1]  );
    const drawOutRatio  = THREE.MathUtils.smoothstep(progRatio, param.drawOut[0] , param.drawOut[1] );
    const fadeInRatio1  = THREE.MathUtils.smoothstep(progRatio, param.fadeIn1[0] , param.fadeIn1[1] );
    const fadeOutRatio1 = THREE.MathUtils.smoothstep(progRatio, param.fadeOut1[0], param.fadeOut1[1]);
    const fadeInRatio2  = THREE.MathUtils.smoothstep(progRatio, param.fadeIn2[0] , param.fadeIn2[1] );
    const fadeOutRatio2 = THREE.MathUtils.smoothstep(progRatio, param.fadeOut2[0], param.fadeOut2[1]);
    const scaleInRatio  = THREE.MathUtils.smoothstep(progRatio, param.scaleIn[0] , param.scaleIn[1] );
    const scaleOutRatio = THREE.MathUtils.smoothstep(progRatio, param.scaleOut[0], param.scaleOut[1]);

    // 描画アニメーションの進捗
    const drawDelayFactor = 0.03;
    const maxDrawDelay = drawDelayFactor * this.guidelines.children.length;
    const drawRatio = drawInRatio - drawOutRatio;

    // スケールアニメーションの進捗
    const scaleDelayFactor = 0.04;
    const maxScaleDelay = scaleDelayFactor * this.guidelines.children.length;
    const scaleRatio = scaleInRatio - scaleOutRatio;

    // フェードアニメーションの進捗
    const fadeRatio = (fadeInRatio1 - fadeOutRatio1) + (fadeInRatio2 - fadeOutRatio2);

    for (var i = 0;i <= this.guidelines.children.length - 1;i ++) {
      const drawDelay = drawDelayFactor * i;
      const drawRatioD = THREE.MathUtils.inverseLerp(drawDelay, 1.0 + drawDelay - maxDrawDelay, drawRatio);

      const scaleDelay = scaleDelayFactor * (this.guidelines.children.length - i);
      const scaleRatioD = THREE.MathUtils.smootherstep(scaleRatio, scaleDelay, 1.0 + scaleDelay - maxScaleDelay);

      const control = (mesh) => {
        mesh.geometry.setDrawRange(0, this.divCount * drawRatioD);
        mesh.material.opacity = fadeRatio;
        mesh.scale.set(scaleRatioD, scaleRatioD);
      }

      const child = this.guidelines.children[i];
      if (child.isGroup) {
        child.children.forEach((mesh) => control(mesh));
      } else {
        control(child);
      }
    }
  }

}
