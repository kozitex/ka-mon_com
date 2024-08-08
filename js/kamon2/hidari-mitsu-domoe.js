'use strict';

import * as THREE from 'three';
import Kamon from '../kamon2.js';

export default class HidariMitsuDomoe extends Kamon {

  constructor() {

    super();

    // infoのテキスト
    this.jpNameText = '左三つ巴';
    this.jpDescText = '巴紋は鞆（とも）という弓の道具を図案化した説、勾玉を図案化した説など、由来には諸説あります。水が渦を巻く様子にも見えることから、平安時代には火除けの印として瓦の紋様にも取り入れられました。家紋だけでなく、神社の神紋などにも多く使用されています。';
    this.enNameText = 'Hidari-Mitsu-Domoe';
    this.enDescText = 'There are various theories about the origin of the Tomoe crest, including one theory that it is a design of a bow tool called a tomo, and another theory that it is a design of a magatama. Because it looks like water swirling, it was incorporated into the pattern of roof tiles during the Heian period as a symbol to protect against fire. It is often used not only for family crests but also for shrine emblems.';

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

    // 円
    const center2 = this.rotateCoordinate({x: 0, y: 600}, 60);

    this.circle0 = {a: 0, b:    0, r: 1600};
    this.circle1 = {a: 0, b:  900, r:  700};
    this.circle2 = {a: center2.x, b: center2.y, r: 1000};

    // 補助線の頂点
    this.apex1 = this.circumPoint(this.circle0, 90);

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
    var b = -2 * h + 2 * m * (n - k);
    var c = Math.pow(h, 2) + Math.pow((n - k), 2) - Math.pow(r, 2);
    var D = Math.pow(b, 2) - 4 * a * c;

    var kouten = [];
    if (D >= 0) {
      var x1 = (-b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
      var x2 = (-b - Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
      if (D == 0) {
        kouten.push(new THREE.Vector3(x1, m * x1 + n, 0));
      } else {
        kouten.push(new THREE.Vector3(x1, m * x1 + n, 0));
        kouten.push(new THREE.Vector3(x2, m * x2 + n, 0));
      }
    }
    return kouten;
  }

  // // ２円の交点を求める
  // inter2Circles = (circle1, circle2) => {
  //   const a1 = circle1.a, b1 = circle1.b, r1 = circle1.r;
  //   const a2 = circle2.a, b2 = circle2.b, r2 = circle2.r;
  //   const form = {
  //     a: - (2 * (a2 - a1)) / (2 * (b2 - b1)),
  //     b: 1,
  //     c: - ((a1 + a2) * (a1 - a2) + (b1 + b2) * (b1 - b2) + (r2 + r1) * (r2 - r1)) / (2 * (b2 - b1))
  //   };
  //   return this.interLineCircle(circle1, form);
  // }

  // ガイドラインを作成
  generateGuideline = () => {

    // 中心円
    const points = this.circleLocusGen(this.circle0, [90, 450], this.divCount);
    const mesh = this.guidelineGen(points);
    this.guidelines.add(mesh);

    // 補助線
    [this.apex1].forEach((apex) => {
      const group = new THREE.Group();
      const points = this.lineLocusGen(apex, {x: 0, y: 0}, 0, this.divCount);
      for (var i = 0;i <= 2;i ++) {
        const mesh = this.sublineGen(points);
        mesh.rotation.z = THREE.MathUtils.degToRad(120 * i);
        group.add(mesh);
      }
      this.guidelines.add(group);
    })

    // 外周円
    const circles = [this.circle1, this.circle2];
    circles.forEach((circle) => {
      const points = this.circleLocusGen(circle, [90, 450], this.divCount);
      const group = new THREE.Group();
      for (var i = 0;i <= 2;i ++) {
        const mesh = this.guidelineGen(points);
        mesh.rotation.z = THREE.MathUtils.degToRad(120 * i);
        group.add(mesh);
      }
      this.guidelines.add(group);
    })

    this.group.add(this.guidelines);
  }

  // アウトラインを作成
  generateOutline = () => {

    const w = 4;

    // 中心円
    [this.circle0].forEach((circle) => {
      const geo = this.curveOutlineGeoGen(circle, [0, 360], false);
      const mesh = new THREE.Mesh(geo, this.outlineMat);
      this.outlines.add(mesh);
    })

    // 円弧
    const inter0 = new THREE.Vector3(0, 1600, 0);
    const inter1 = this.inter2Circles(this.circle1, this.circle2)[1];
    const inter2 = this.circumPoint(this.circle2, 210);

    const circles = [this.circle1, this.circle2, this.circle0];
    const inters = [
      [inter0, inter1], [inter1, inter2], [inter2, inter0],
    ];
    const clockwises = [true, false, true];

    for (var i = 0;i <= circles.length - 1;i ++) {
      const circle = circles[i];
      const inter = inters[i];
      const clockwise = clockwises[i];
      const angles = [
        this.circumAngle(circle, inter[0]),
        this.circumAngle(circle, inter[1]),
      ];
      const geo = this.curveOutlineGeoGen(circle, angles, clockwise);
      for (var j = 0;j <= 2;j ++) {
        const mesh = new THREE.Mesh(geo, this.outlineMat);
        mesh.rotation.z = THREE.MathUtils.degToRad(120 * j);
        this.outlines.add(mesh);
      }
    }

    this.group.add(this.outlines);
  }

  // 塗りつぶし図形を生成
  generateShape = () => {

    const w = 4;

    const circle0 = {a: this.circle0.a, b: this.circle0.b, r: this.circle0.r - w};
    const circle1 = {a: this.circle1.a, b: this.circle1.b, r: this.circle1.r - w};
    const circle2 = {a: this.circle2.a, b: this.circle2.b, r: this.circle2.r + w};

    const inter0 = this.circumPoint(circle0, 90);
    const inter1 = this.inter2Circles(circle1, circle2)[1];
    const inter2 = this.circumPoint(circle2, 200);

    const circles = [circle1, circle2, circle0];
    const inters = [
      [inter0, inter1], [inter1, inter2], [inter2, inter0],
    ];
    const clockwises = [true, false, true];

    var points = [];
    for (var i = 0;i <= circles.length - 1;i ++) {
      const circle = circles[i];
      const inter = inters[i];
      const clockwise = clockwises[i];
      const angles = [
        this.circumAngle(circle, inter[0]),
        this.circumAngle(circle, inter[1]),
      ];
      const point = this.curvePointGen(circle, angles, clockwise);
      points = points.concat(point);
    }
    const geo = this.shapeGeoGen(points);

    for (var j = 0;j <= 2;j ++) {
      const mesh = new THREE.Mesh(geo, this.shapeMat);
      mesh.rotation.z = THREE.MathUtils.degToRad(120 * j);
      this.shapes.add(mesh);
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
    const drawDelayFactor = 0.1;
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
