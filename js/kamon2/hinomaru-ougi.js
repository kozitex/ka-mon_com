'use strict';

import * as THREE from 'three';
import Kamon from '../kamon2.js';

export default class HinomaruOugi extends Kamon {

  constructor() {

    super();

    // infoのテキスト
    this.jpNameText = '日の丸扇';
    this.jpDescText = '菊花紋はキク科キク属の植物であるキクを図案化した菊紋のうち、特に花の部分を中心に図案化した家紋のことを指します。中でも十六葉八重表菊は皇室の紋章としても知られ、日本の事実上の国章としても使われています。';
    this.enNameText = 'Hinomaru-ougi';
    this.enDescText = 'A chrysanthemum crest is a family crest that is a pattern of a chrysanthemum, a plant belonging to the Asteraceae family, Asteraceae, with a focus on the flower part. Among them, the 16-leaf double chrysanthemum is also known as the emblem of the imperial family, and is also used as the de facto national emblem of Japan.';

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






    // 円
    this.circles = [
      {a: 0, b: 0, r: 1600}, // 中骨用の補助円
      {a: 0, b: 0, r:  240}, // 要部分の補助円
      {a: 0, b: - 128, r:  900}, // 扇の地
      {a: 0, b:   192, r: 1760}, // 扇の天
      {a: 0, b:     0, r:   30}, // 要
      {a: 0, b:  1360, r:  515}, // 扇面の日の丸
      // {a: 0, b: - 832, r: 1600}, // 放射線用の補助円
      // {a: 0, b: - 832, r:  240}, // 中央の補助円
      // {a: 0, b: - 960, r:  900}, // 扇の地
      // {a: 0, b: - 640, r: 1760}, // 扇の天
      // {a: 0, b: - 832, r:   30}, // 要
      // {a: 0, b:   528, r:  515}, // 扇面の日の丸
    ];

    // const circle6 = {a: 0, b: 0, r: 38};

    // 放射線






    // 中心円
    this.center1 = {a: 0, b: 0, r: 1600};
    this.center2 = {a: 0, b: 0, r: 200};

    this.theta = 360 / 16;

    // 外周円１
    const thetaR = THREE.MathUtils.degToRad(this.theta / 2);
    const r = (1600 * Math.sin(thetaR)) / (1 + Math.sin(thetaR));
    this.outer1 = {a: 0, b: 1600 - r, r: r}
    this.outerAngle1 = [- this.theta / 2, 180 + this.theta / 2];

    // 放射線
    const c = r / Math.tan(thetaR);
    this.rad1 = [
      this.circumPoint(this.center1, 90 - this.theta / 2),
      new THREE.Vector3(0, 0, 0),
    ];
    this.rad2 = [
      new THREE.Vector3(c * Math.sin(thetaR), c * Math.cos(thetaR), 0),
      this.circumPoint(this.center2, 90 - this.theta / 2),
    ];

    // 外周円２
    const point1 = this.circumPoint(this.center1, 90 - (this.theta / 4));
    const point2 = new THREE.Vector3(0, 0, 0);
    const form = this.from2Points(point1, point2);
    const inter = this.interLineCircle(this.outer1, form);
    const angle = this.circumAngle(this.outer1, inter[0]);
    this.outerAngle2 = [angle, 180 - angle];

    this.center3 = {a: 0, b: 0, r: 1600 - r}
    const v1 = this.circumPoint(this.center3, 90 + this.theta / 2);
    this.outer3 = {a:   v1.x, b: v1.y, r: r + 4}
    this.outer4 = {a: - v1.x, b: v1.y, r: r + 4}

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
        var x1 = 0;
        var x2 = 0;
      } else {
        var x1 = (- b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
        var x2 = (- b - Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
      }
      if (D == 0) {
        kouten.push(new THREE.Vector3(x1, m * x1 + n, 0));
      } else {
        if (form.b == 0) {
          kouten.push(new THREE.Vector3(x1, - r, 0));
          kouten.push(new THREE.Vector3(x2, r, 0));
        } else {
          kouten.push(new THREE.Vector3(x1, m * x1 + n, 0));
          kouten.push(new THREE.Vector3(x2, m * x2 + n, 0));
        }
      }
    }
    return kouten;
  }

  // ガイドラインを作成
  generateGuideline = () => {

    // 中骨の補助円
    const circles1 = [this.circles[0], this.circles[1]];
    circles1.forEach((circle) => {
      const points = this.circleLocusGen(circle, [90, 450], this.divCount);
      const mesh = this.sublineGen(points);
      this.guidelines.add(mesh);
    })

    // 中骨の補助円
    const circles2 = [this.circles[2], this.circles[3]];
    circles2.forEach((circle) => {
      const points = this.circleLocusGen(circle, [90, 450], this.divCount);
      const mesh = this.guidelineGen(points);
      this.guidelines.add(mesh);
    })

    // 中骨の補助線
    for (var i = 0;i <= 4;i ++) {
      const fromAngle = - 30 * (i + 1);
      const lineFrom = this.circumPoint(this.circles[0], fromAngle);
      const lineTo   = this.circumPoint(this.circles[0], fromAngle + 180);
      const form = this.from2Points(lineFrom, lineTo);
      const inter = this.interLineCircle(this.circles[3], form);
      console.log(form, inter)
      const line = this.lineLocusGen(inter[0], inter[1], 0, this.divCount);
    // for (var i = 0;i <= 4;i ++) {
      const mesh = this.sublineGen(line);
      // mesh.rotation.z = THREE.MathUtils.degToRad(- 30 * i);
      this.guidelines.add(mesh);
    }

    // 中骨
    for (var i = 0;i <= 4;i ++) {
      const group = new THREE.Group();
      for (var j = 0;j <= 1;j ++) {
        const fromAngle = - 30 * (i + 1);

        const theta = THREE.MathUtils.degToRad(fromAngle + 270);
        // const sign = (1 - j * 2);
        const a = 36 * Math.cos(theta) * 1;
        const b = 36 * Math.sin(theta) * 1;
        const circle = {a: a, b: b, r: this.circles[0].r};
        // const lineFrom = this.circumPoint(circle, - 30);
        // const lineTo   = this.circumPoint(circle,  150);
        // const line = this.lineLocusGen(lineFrom, lineTo, 0, this.divCount);

        const lineFrom = this.circumPoint(circle, fromAngle);
        const lineTo   = this.circumPoint(circle, fromAngle + 180);
        const form = this.from2Points(lineFrom, lineTo);
        const inter = this.interLineCircle(this.circles[3], form);
        const line = this.lineLocusGen(inter[0], inter[1], 0, this.divCount);
  
        const mesh = this.guidelineGen(line);
        // mesh.rotation.z = THREE.MathUtils.degToRad(- 30 * i);
        group.add(mesh);
      }
      this.guidelines.add(group);
    }

    // 要の先端
    const circles4 = [this.circles[1]];
    circles4.forEach((circle) => {
      for (var i = 0;i <= 4;i ++) {
        const center = this.circumPoint(circle, 210 + (30 * i));
        const dCircle = {a: center.x, b: center.y, r: 38};
        const points = this.circleLocusGen(dCircle, [90, 450], this.divCount);
        const mesh = this.guidelineGen(points);
        this.guidelines.add(mesh);
      }
    })

    const circles3 = [this.circles[4], this.circles[5]];
    circles3.forEach((circle) => {
      const points = this.circleLocusGen(circle, [90, 450], this.divCount);
      const mesh = this.guidelineGen(points);
      this.guidelines.add(mesh);
    })



    // this.guidelines.position.y = - 832;


    // // 中心円１
    // [this.center1].forEach((circle) => {
    //   const points = this.circleLocusGen(circle, [90, 450], this.divCount);
    //   const mesh = this.sublineGen(points);
    //   this.guidelines.add(mesh);
    // })

    // const pointArr = [];

    // // 放射線
    // const line = this.lineLocusGen(this.rad1[0], this.rad1[1], 0, this.divCount)
    // pointArr.push(line);

    // // 外周円
    // for (var i = 0;i <= 1;i ++) {
    //   const outer = this.circleLocusGen(this.outer1, [90, 450], this.divCount)
    //   pointArr.push(outer);
    // }

    // // メッシュの生成を16回繰り返す
    // for (var i = 0;i <= pointArr.length - 1;i ++) {
    //   const group = new THREE.Group();
    //   const points = pointArr[i];
    //   for (var j = 0;j <= 15;j ++) {
    //     const mesh = i == 2 ? this.sublineGen(points) : this.guidelineGen(points);
    //     const angle = i == 2 ? this.theta * (j - 0.5) : this.theta * j
    //     mesh.rotation.z = THREE.MathUtils.degToRad(angle);
    //     group.add(mesh);
    //   }
    //   this.guidelines.add(group);
    // }

    // // 中心円２
    // [this.center2].forEach((circle) => {
    //   const points = this.circleLocusGen(circle, [90, 450], this.divCount);
    //   const mesh = this.guidelineGen(points);
    //   this.guidelines.add(mesh);
    // })

    this.group.add(this.guidelines);
  }

  // アウトラインを作成
  generateOutline = () => {

    // // 中心円
    // const geo = this.curveOutlineGeoGen(this.center2, [0, 360], false);
    // const mesh = new THREE.Mesh(geo, this.outlineMat);
    // this.outlines.add(mesh);

    // const geos = [];

    // // 放射線
    // const line = this.outlineGeoGen(this.rad2[0], this.rad2[1])
    // geos.push(line);

    // // 外周円の弧
    // const arc1 = this.curveOutlineGeoGen(this.outer1, this.outerAngle1, false);
    // const arc2 = this.curveOutlineGeoGen(this.outer1, this.outerAngle2, false);
    // geos.push(arc1)
    // geos.push(arc2)

    // // メッシュの生成を16回繰り返す
    // for (var i = 0;i <= geos.length - 1;i ++) {
    //   const geo = geos[i];
    //   for (var j = 0;j <= 15;j ++) {
    //     const mesh = new THREE.Mesh(geo, this.outlineMat);
    //     const angle = i == 2 ? this.theta * (j - 0.5) : this.theta * j
    //     mesh.rotation.z = THREE.MathUtils.degToRad(angle);
    //     this.outlines.add(mesh);
    //   }
    // }

    this.group.add(this.outlines);
  }

  // 塗りつぶし図形を生成
  generateShape = () => {

    // const w = 4;

    // // 中心円
    // [this.center2].forEach((circle) => {
    //   const param = {a: circle.a, b: circle.b, r: circle.r - w};
    //   const shape = this.curvePointGen(param, [0, 360], true);
    //   const geo = this.shapeGeoGen(shape);
    //   const mesh = new THREE.Mesh(geo, this.shapeMat);
    //   this.shapes.add(mesh);
    // });

    // const geos = [];

    // // 手前の花弁
    // const outer2 = {a: this.outer1.a, b: this.outer1.b, r: this.outer1.r - w};
    // const points1 = this.curvePointGen(outer2, this.outerAngle1, false);

    // const center2 = {a: this.center2.a, b: this.center2.b, r: this.center2.r + w};
    // const diff = THREE.MathUtils.radToDeg(Math.asin(w / center2.r));
    // const angles = [90 + this.theta / 2 - diff, 90 - this.theta / 2 + diff]
    // const points2 = this.curvePointGen(center2, angles, true);

    // const points3 = points1.concat(points2);
    // const geo1 = this.shapeGeoGen(points3);
    // geos.push(geo1);

    // // 奥の花弁
    // const angles2 = [this.outerAngle2[0] + diff, this.outerAngle2[1] - diff];
    // const points4 = this.curvePointGen(outer2, angles2, false);

    // const angles3 = [
    //   this.outerAngle2[0] + this.theta / 2 - diff - 1,
    //   this.outerAngle1[0] + this.theta / 2 + diff,
    // ];
    // const points5 = this.curvePointGen(this.outer3, angles3, true);

    // const angles4 = [
    //   this.outerAngle1[1] - this.theta / 2 - diff,
    //   this.outerAngle2[1] - this.theta / 2 + diff + 1,
    // ];
    // const points6 = this.curvePointGen(this.outer4, angles4, true);

    // const points7 = points4.concat(points5, points6);
    // const geo2 = this.shapeGeoGen(points7);
    // geos.push(geo2);

    // // メッシュの生成を16回繰り返す
    // for (var i = 0;i <= geos.length - 1;i ++) {
    //   const geo = geos[i];
    //   for (var j = 0;j <= 15;j ++) {
    //     const mesh = new THREE.Mesh(geo, this.shapeMat);
    //     const angle = i == 1 ? this.theta * (j - 0.5) : this.theta * j
    //     mesh.rotation.z = THREE.MathUtils.degToRad(angle);
    //     this.shapes.add(mesh);
    //   }
    // }

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
    const drawDelayFactor = 0.04;
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
