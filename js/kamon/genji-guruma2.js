'use strict';

import * as THREE from 'three';
import Kamon2 from '../kamon2.js';

export default class GenjiGuruma2 extends Kamon2 {

  constructor() {

    super();

    this.scrollDur = 8000;

    this.verNum = 8;

    // infoのテキスト
    this.jpNameText = '源氏車';
    this.jpDescText = '車紋（くるまもん）の一種で、平安時代の貴族の乗り物であった牛車の車輪の形をモチーフにした家紋です。牛車は別名で源氏車とも呼ばれていました。また、車紋は佐藤姓の家紋に用いられたことでも知られています。佐藤氏の祖先が伊勢神宮の神事に携わっていた際、使用していた牛車が豪奢で有名だったことが由来で家紋に用いることになったと言われています。';
    this.enNameText = 'Genji-Guruma';
    this.enDescText = 'It is a type of Kurumamon (car crest), and is a family crest with a motif of the wheels of an ox cart, which was a vehicle used by aristocrats during the Heian period. The ox-cart was also called the Genji-guruma. The car crest is also known to have been used as the family crest of the Sato family name. It is said that the Sato clan&#39;s ancestors used it as their family crest because the bullock carts they used were famous for their luxury when they were involved in the rituals at Ise Grand Shrine.';

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
      scaleOut : [0.70, 0.90],
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

    // 中心円
    this.circle1 = {a: 0, b: 0, r: 1600};
    this.circle2 = {a: 0, b: 0, r: 1300};
    this.circle3 = {a: 0, b: 0, r:  970};
    this.circle4 = {a: 0, b: 0, r:  260};

    const w = 4;
    const c1 = this.circle1;
    const c2 = this.circle2;
    const c3 = this.circle3;
    const c4 = this.circle4;

    // 部品１
    const angle1 = THREE.MathUtils.radToDeg(Math.asin(w / (c1.r - w)));
    const angle2 = THREE.MathUtils.radToDeg(Math.asin(w / (c2.r + w)));
    const angle3 = THREE.MathUtils.radToDeg(Math.asin(w / (c3.r + w)));
    const arc1 = this.curvePointGen(c1.a, c1.b, c1.r - w, 90 - angle1, 45 + angle1, true);
    const arc2 = this.curvePointGen(c2.a, c2.b, c2.r + w, 45 + angle2, 65 + angle2, false);
    const arc3 = this.curvePointGen(c3.a, c3.b, c3.r + w, 65 + angle3, 70 - angle3, false);
    const arc4 = this.curvePointGen(c2.a, c2.b, c2.r + w, 70 - angle2, 90 - angle2, false);
    this.arcPoints1 = arc1.concat(arc2, arc3, arc4);

    // 部品２
    const angle5 = THREE.MathUtils.radToDeg(Math.asin(w / (c2.r - w)));
    const arc5 = this.curvePointGen(c2.a, c2.b, c2.r - w, 110 - angle5, 70 + angle5, true);
    const arc6 = this.curvePointGen(c3.a, c3.b, c3.r + w, 70 + angle3, 110 - angle3, false);
    this.arcPoints2 = arc5.concat(arc6);

    // 部品３
    this.angle7 = THREE.MathUtils.radToDeg(Math.asin(w / (c3.r - w)));
    this.angle8 = THREE.MathUtils.radToDeg(Math.asin(w / (c4.r + w)));
    const arc7 = this.curvePointGen(c3.a, c3.b, c3.r - w, 100 - this.angle7, 80 + this.angle7, true);
    const arc8 = this.curvePointGen(c4.a, c4.b, c4.r + w, 80 + this.angle8, 100 - this.angle8, false);
    this.arcPoints3 = arc7.concat(arc8);

    // 中央の円
    this.circlePoints = this.curvePointGen(c4.a, c4.b, c4.r - w, 0, 360, false);
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

  // ガイドラインを作成
  generateGuideline = () => {

    // 円
    const cs = [this.circle1, this.circle2, this.circle3, this.circle4];
    cs.forEach((c) => {
      const points = this.circlePointGen(c.a, c.b, c.r, 90, 450, this.divCount);
      const circle = this.guidelineGen(points);
      this.guidelines.add(circle);
    });

    // 一番外側の直線
    const points1 = this.linePointGen(1, 0, 0, this.circle1.r, - this.circle1.r, this.divCount);
    for (var i = 0;i <= 3;i ++) {
      const line1 = this.guidelineGen(points1);
      line1.rotation.z = THREE.MathUtils.degToRad(45 * i);
      this.guidelines.add(line1);
    }

    // 真ん中の直線
    const angle2 = THREE.MathUtils.degToRad(70);
    const angle3 = THREE.MathUtils.degToRad(110);
    const form2 = {a: Math.tan(angle2), b: 1, c: 0};
    const form3 = {a: Math.tan(angle3), b: 1, c: 0};
    const x1 = this.circle1.r * Math.cos(angle2);
    const points2 = this.linePointGen(form2.a, 1, form2.b, x1, - x1, this.divCount);
    const points3 = this.linePointGen(form3.a, 1, form3.b, - x1, x1, this.divCount);
    for (var i = 0;i <= 3;i ++) {
      const line2 = this.guidelineGen(points2);
      const line3 = this.guidelineGen(points3);
      line2.rotation.z = THREE.MathUtils.degToRad(45 * i);
      line3.rotation.z = THREE.MathUtils.degToRad(45 * i);
      this.guidelines.add(line2, line3);
    }

    // 一番内側の直線
    const angle4 = THREE.MathUtils.degToRad(80);
    const angle5 = THREE.MathUtils.degToRad(100);
    const straight4 = {a: Math.tan(angle4), b: 1, c: 0};
    const straight5 = {a: Math.tan(angle5), b: 1, c: 0};
    const x2 = this.circle1.r * Math.cos(angle5);
    const points4 = this.linePointGen(straight4.a, 1, straight4.b, x2, - x2, this.divCount);
    const points5 = this.linePointGen(straight5.a, 1, straight5.b, - x2, x2, this.divCount);
    for (var i = 0;i <= 3;i ++) {
      const line4 = this.guidelineGen(points4);
      const line5 = this.guidelineGen(points5);
      line4.rotation.z = THREE.MathUtils.degToRad(45 * i);
      line5.rotation.z = THREE.MathUtils.degToRad(45 * i);
      this.guidelines.add(line4, line5);
    }

    this.group.add(this.guidelines);
  }

  // アウトラインを作成
  generateOutline = () => {

    const w = 4;
    const c1 = this.circle1;
    const c2 = this.circle2;
    const c3 = this.circle3;
    const c4 = this.circle4;

    // 部品１
    const arc1 = this.curvePointGen(c1.a, c1.b, c1.r + w, 90, 45, true);
    const arc2 = this.curvePointGen(c2.a, c2.b, c2.r - w, 45, 65, false);
    const arc3 = this.curvePointGen(c3.a, c3.b, c3.r - w, 65, 70, false);
    const arc4 = this.curvePointGen(c2.a, c2.b, c2.r - w, 70, 90, false);
    const points1 = arc1.concat(arc2, arc3, arc4);
    const partsGeo1 = this.shapeGeoGen(points1, this.arcPoints1);

    // 部品２
    const arc5 = this.curvePointGen(c2.a, c2.b, c2.r - 3, 110, 70, true);
    const arc6 = this.curvePointGen(c3.a, c3.b, c3.r - w, 70, 110, false);
    const points2 = arc5.concat(arc6);
    const partsGeo2 = this.shapeGeoGen(points2, this.arcPoints2);

    // 部品３
    const arc7 = this.curvePointGen(c3.a, c3.b, c3.r - 3, 100 + this.angle7, 80 - this.angle7, true);
    const arc8 = this.curvePointGen(c4.a, c4.b, c4.r + w, 80 - this.angle8, 100 + this.angle8, false);
    const points3 = arc7.concat(arc8);
    const partsGeo3 = this.shapeGeoGen(points3, this.arcPoints3);

    for (var i = 0;i <= this.verNum - 1;i ++) {
      const rotAngle = THREE.MathUtils.degToRad(- 360 / this.verNum * i);
      const parts1 = new THREE.Mesh(partsGeo1, this.outlineMat);
      const parts2 = new THREE.Mesh(partsGeo2, this.outlineMat);
      const parts3 = new THREE.Mesh(partsGeo3, this.outlineMat);
      parts1.rotation.z = rotAngle;
      parts2.rotation.z = rotAngle;
      parts3.rotation.z = rotAngle;
      this.outlines.add(parts1, parts2, parts3);
    }

    // 中央の円
    const point7 = this.curvePointGen(c4.a, c4.b, c4.r + w, 0, 360, false);
    const circleGeo = this.shapeGeoGen(point7, this.circlePoints);
    const circle = new THREE.Mesh(circleGeo, this.outlineMat);
    this.outlines.add(circle);

    this.group.add(this.outlines, this.outlineEdges);
  }

  // 塗りつぶし図形を生成
  generateShape = () => {

    // 部品１
    const partsGeo1 = this.shapeGeoGen(this.arcPoints1);

    // 部品２
    const partsGeo2 = this.shapeGeoGen(this.arcPoints2);

    // 部品３
    const partsGeo3 = this.shapeGeoGen(this.arcPoints3);

    for (var v = 0;v <= this.verNum - 1;v ++) {
      const rotAngle = THREE.MathUtils.degToRad(- 360 / this.verNum * v);
      const parts1 = new THREE.Mesh(partsGeo1, this.shapeMat);
      const parts2 = new THREE.Mesh(partsGeo2, this.shapeMat);
      const parts3 = new THREE.Mesh(partsGeo3, this.shapeMat);
      parts1.rotation.z = rotAngle;
      parts2.rotation.z = rotAngle;
      parts3.rotation.z = rotAngle;
      this.shapes.add(parts1, parts2, parts3);
    }

    // 中央の円
    const circelGeo = this.shapeGeoGen(this.circlePoints);
    const circle = new THREE.Mesh(circelGeo, this.shapeMat);
    this.shapes.add(circle);

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
    const scaleDelayFactor = 0.03;
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
