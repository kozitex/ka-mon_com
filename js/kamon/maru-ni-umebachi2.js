'use strict';

import * as THREE from 'three';
import Kamon2 from '../kamon2.js';

export default class MaruNiUmebachi2 extends Kamon2 {

  constructor() {

    super();

    this.scrollDur = 7000;

    // infoのテキスト
    this.jpNameText = '丸に梅鉢';
    this.jpDescText = '梅鉢紋とは梅の花を図案化した家紋の一種で、中心から放射状に伸びた花弁の図案が太鼓のバチに似ていることに由来すると言われています。学問の神として知られ、梅をこよなく愛した菅原道真を祀る天満宮が神紋として梅鉢紋を用いたことから、天神信仰と共に日本各地に広がったとされています。';
    this.enNameText = 'Maru-ni-umebachi';
    this.enDescText = 'The Umebachi crest is a type of family crest that depicts a plum blossom, and is said to derive from the fact that the pattern of petals radiating from the center resembles the drumsticks of a drum. Tenmangu Shrine, which is dedicated to Michizane Sugawara, who was known as the god of learning and loved plums, used the plum bowl crest as a divine crest, and it is said that it spread throughout Japan along with Tenjin worship.';

    // ガイドラインの表示アニメーションパラメータ
    this.guidelineParams = {
      drawIn   : [0.10, 0.45],
      drawOut  : [0.55, 0.80],
      fadeIn1  : [0.00, 0.00],
      fadeOut1 : [0.35, 0.40],
      fadeIn2  : [0.55, 0.60],
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

    // 拡大・縮小アニメーションパラメータ
    this.scaleParams = {
      inStart : 0.1,
      inEnd   : 0.4,
      outStart: 0.75,
      outEnd  : 0.8,
    }

    // 図形の回転アニメーションパラメータ
    this.shapeRotParams = {
      start : 0.0,
      end   : 0.0,
    }

    // 円
    this.circle1 = {a:    0, b:    0, r: 1600};
    this.circle2 = {a:    0, b:    0, r: 1310};
    this.circle3 = {a:    0, b:    0, r:  827};
    this.circle4 = {a:    0, b:    0, r:  435};
    this.circle5 = {a:    0, b:    0, r:  200};
    this.circle6 = {a:    0, b: this.circle3.r, r:  470};

    // 五角形の頂点
    this.pentaApices = [];
    for (var i = 0;i <= 4;i ++) {
      const circle = this.circle4;
      const angle = 54 + (72 * i);
      const apex = this.circle(circle.a, circle.b, circle.r, angle);
      this.pentaApices.push(apex);
    }

    // 五角形の辺の式
    this.pentaForms = [];
    for (var i = 0;i <= 4;i ++) {
      const apex1 = this.pentaApices[i];
      const apex2 = this.pentaApices[i == 4 ? 0 : i + 1];
      const form = this.from2Points(apex1.x, apex1.y, apex2.x, apex2.y);
      this.pentaForms.push(form);
    }

    // 五角形とX軸の交点
    const form1 = this.pentaForms[1];
    const inter1 = this.straight(form1.a, 1, form1.b, undefined, 0);
    const form2 = this.pentaForms[4];
    const inter2 = this.straight(form2.a, 1, form2.b, undefined, 0);
    this.pentaInters = [inter1, inter2];

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

    // 中心円１
    this.circles1 = new THREE.Group();
    const circles1 = [this.circle1, this.circle2];
    circles1.forEach((circle) => {
      const points = this.circlePointGen(circle.a, circle.b, circle.r, 90, 450, this.divCount);
      const circleMesh = this.guidelineGen(points);
      this.circles1.add(circleMesh);
    });
    this.guidelines.add(this.circles1);

    // 中心円２
    this.circles2 = new THREE.Group();
    const circles2 = [this.circle3];
    circles2.forEach((circle) => {
      const points = this.circlePointGen(circle.a, circle.b, circle.r, 90, 450, this.divCount);
      const circleMesh = this.sublineGen(points);
      this.circles2.add(circleMesh);
    });
    this.guidelines.add(this.circles2);

    // 放射線１
    this.radiation1 = new THREE.Group();
    const dist = this.circle3.r;
    const linePoints1 = this.linePointGen(1, 0, 0, dist, - dist, this.divCount);
    for (var v = 0;v <= 4;v ++) {
      const line = this.sublineGen(linePoints1);
      line.rotation.z = THREE.MathUtils.degToRad(72 * v);
      this.radiation1.add(line);
    }
    this.guidelines.add(this.radiation1);

    // 周回円
    this.fiveCircles = new THREE.Group();
    const c = this.circle6;
    for (var v = 0;v <= 4;v ++) {
      const circlePoints = this.circlePointGen(c.a, c.b, c.r, 90, 450, this.divCount);
      const circle = this.guidelineGen(circlePoints);
      circle.rotation.z = THREE.MathUtils.degToRad(72 * v);
      this.fiveCircles.add(circle);
    }
    this.guidelines.add(this.fiveCircles);

    // 中心円３
    this.circles3 = new THREE.Group();
    const circles3 = [this.circle4];
    circles3.forEach((circle) => {
      const points = this.circlePointGen(circle.a, circle.b, circle.r, 90, 450, this.divCount);
      const circleMesh = this.sublineGen(points);
      this.circles3.add(circleMesh);
    });
    this.guidelines.add(this.circles3);

    // 中心円４
    this.circles4 = new THREE.Group();
    const circles4 = [this.circle5];
    circles4.forEach((circle) => {
      const points = this.circlePointGen(circle.a, circle.b, circle.r, 90, 450, this.divCount);
      const circleMesh = this.guidelineGen(points);
      this.circles4.add(circleMesh);
    });
    this.guidelines.add(this.circles4);

    // 五角形
    this.pentagon = new THREE.Group();
    for (var i = 0;i <= 4;i ++) {
      const apex1 = this.pentaApices[i];
      const apex2 = this.pentaApices[i == 4 ? 0 : i + 1];
      const form = this.pentaForms[i];
      const points = this.linePointGen(form.a, 1, form.b, apex1.x, apex2.x, this.divCount);
      const line = this.guidelineGen(points);
      this.pentagon.add(line);
    }
    this.guidelines.add(this.pentagon);

    // 放射線２
    this.radiation2 = new THREE.Group();
    const inter1 = this.pentaInters[0];
    const inter2 = this.pentaInters[1];
    const linePoints2 = this.linePointGen(0, 1, 0, inter1.x, inter2.x, this.divCount);
    for (var v = 0;v <= 4;v ++) {
      const line = this.guidelineGen(linePoints2);
      line.rotation.z = THREE.MathUtils.degToRad(72 * v);
      this.radiation2.add(line);
    }
    this.guidelines.add(this.radiation2);

    this.group.add(this.guidelines);
  }

  // アウトラインを作成
  generateOutline = () => {

    // アウトラインの幅
    const w = 4;

    // 中心円
    const circles3 = [this.circle1, this.circle2, this.circle5];
    circles3.forEach((circle) => {
      const point0 = this.curvePointGen(circle.a, circle.b, circle.r + w, 0, 360, false);
      const point1 = this.curvePointGen(circle.a, circle.b, circle.r - w, 0, 360, false);
      const geo = this.shapeGeoGen(point0, point1);
      const mesh = new THREE.Mesh(geo, this.outlineMat);
      this.outlines.add(mesh);
    })

    // ５つの周回円
    const circles4 = [this.circle6];
    circles4.forEach((circle) => {
      const point0 = this.curvePointGen(circle.a, circle.b, circle.r + w, 0, 360, false);
      const point1 = this.curvePointGen(circle.a, circle.b, circle.r - w, 0, 360, false);
      const geo = this.shapeGeoGen(point0, point1);
      for (var v = 0;v <= 4;v ++) {
        const mesh = new THREE.Mesh(geo, this.outlineMat);
        mesh.rotation.z = THREE.MathUtils.degToRad(72 * v);
        this.outlines.add(mesh);
      }
    })

    // 五角形
    const pentaShapes = [], pentaPathes = [];
    const xw = w + 1;
    for (var i = 0;i <= 4;i ++) {
      const circle = this.circle4;
      const angle = 54 + (72 * i);
      const apex1 = this.circle(circle.a, circle.b, circle.r + xw, angle);
      const apex2 = this.circle(circle.a, circle.b, circle.r - xw, angle);
      pentaShapes.push(apex1);
      pentaPathes.push(apex2);
    }
    const pentaGeo = this.shapeGeoGen(pentaShapes, pentaPathes);
    const pentaMesh = new THREE.Mesh(pentaGeo, this.outlineMat);
    this.outlines.add(pentaMesh);

    // 放射線
    const form = {a: 1, b: 0, c: 0};
    const apex1 = this.pentaInters[0];
    const apex2 = new THREE.Vector3(- 200 , 0, 0);
    const theta = THREE.MathUtils.degToRad(90);
    const p = w * Math.cos(theta);
    const q = w * Math.sin(theta);
    const apexD1 = new THREE.Vector3(apex1.x + p, apex1.y + q, 0);
    const apexD2 = new THREE.Vector3(apex1.x - p, apex1.y - q, 0);
    const apexD3 = new THREE.Vector3(apex2.x - p, apex2.y - q, 0);
    const apexD4 = new THREE.Vector3(apex2.x + p, apex2.y + q, 0);
    const points = [apexD1, apexD2, apexD3, apexD4];
    const geo = this.shapeGeoGen(points);
    for (var v = 0;v <= 9;v ++) {
      const mesh = new THREE.Mesh(geo, this.outlineMat);
      mesh.rotation.z = THREE.MathUtils.degToRad(36 * v);
      this.outlines.add(mesh);
    }

    this.group.add(this.outlines, this.outlineEdges);
  }

  // 塗りつぶし図形を生成
  generateShape = () => {

    // 外周円
    const c1 = this.circle1;
    const c2 = this.circle2;
    const outerCircleShape = this.curvePointGen(c1.a, c1.b, c1.r, 0, 360, false);
    const outerCirclePath  = this.curvePointGen(c2.a, c2.b, c2.r, 0, 360, false);
    const outerCircleGeo   = this.shapeGeoGen(outerCircleShape, outerCirclePath);
    const outerCircleMesh  = new THREE.Mesh(outerCircleGeo, this.shapeMat);
    this.shapes.add(outerCircleMesh);

    // 中心円
    const c5 = this.circle5;
    const innerCircleshape = this.curvePointGen(c5.a, c5.b, c5.r - 4, 0, 360, false);
    const innerCircleGeo = this.shapeGeoGen(innerCircleshape);
    const innerCircleMesh = new THREE.Mesh(innerCircleGeo, this.shapeMat);
    this.shapes.add(innerCircleMesh);

    // ５つの周回円
    const c6 = this.circle6;
    const fiveCircleShape = this.curvePointGen(c6.a, c6.b, c6.r, 0, 360, false);
    const fiveCircleGeo = this.shapeGeoGen(fiveCircleShape);
    for (var i = 0;i <= 4;i ++) {
      const fiveCircleMesh = new THREE.Mesh(fiveCircleGeo, this.shapeMat);
      fiveCircleMesh.rotation.z = THREE.MathUtils.degToRad(- 72) * i;
      this.shapes.add(fiveCircleMesh);
    }

    // 中心の五角形

    // 弧の部分
    const point1 = this.circle(c5.a, c5.b, c5.r + 4, - 72);
    const r1 = THREE.MathUtils.degToRad(18);
    const p1 = 4 * Math.cos(r1);
    const q1 = 4 * Math.sin(r1);
    const point1d = new THREE.Vector3(point1.x - p1, point1.y - q1, 0);
    const theta1 = 18 - THREE.MathUtils.radToDeg(Math.asin(point1d.x / 204));
    const arc1 = this.curvePointGen(c5.a, c5.b, c5.r + 4, - 72 - theta1, - 108 + theta1, true);
    const arc2 = this.curvePointGen(c5.a, c5.b, c5.r + 4,   72 + theta1,   108 - theta1, false);

    // 五角形
    const r4 = THREE.MathUtils.degToRad(72);
    const f2 = this.pentaForms[2];
    const point2 = this.getIntersect(Math.tan(r4), 0, f2.a, f2.b);
    const r2 = THREE.MathUtils.degToRad(18);
    const p2 = 4 * Math.cos(r2);
    const q2 = 4 * Math.sin(r2);
    const point2d = new THREE.Vector3(point2.x + p2, point2.y + q2, 0);
    const point3 = new THREE.Vector3(- point2d.x, point2d.y, 0);
    const apex3 = this.pentaApices[3];
    const point4 = new THREE.Vector3(apex3.x, apex3.y + 4, 0);

    // 台形
    const point5d = new THREE.Vector3(- point2d.x - 1.5, - point2d.y - 1.5, 0);
    const point6 = new THREE.Vector3(- point5d.x, point5d.y, 0);

    const points1 = [point2d, point4, point3].concat(arc1);
    const points2 = [point6, point5d].concat(arc2);
    const lineGeo1 = this.shapeGeoGen(points1);
    const lineGeo2 = this.shapeGeoGen(points2);
    for (var i = 0;i <= 4;i ++) {
      const line1  = new THREE.Mesh(lineGeo1, this.shapeMat);
      const line2  = new THREE.Mesh(lineGeo2, this.shapeMat);
      line1.rotation.z = THREE.MathUtils.degToRad(- 72 * i);
      line2.rotation.z = THREE.MathUtils.degToRad(- 72 * i);
      this.shapes.add(line1, line2);
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

  // アウトラインの表示制御
  outlineDisplayControl = (progRatio) => {
    const param = this.outlineParams;
    const fadeInRatio1  = THREE.MathUtils.smoothstep(progRatio, param.fadeIn1[0] , param.fadeIn1[1] );
    const fadeOutRatio1 = THREE.MathUtils.smoothstep(progRatio, param.fadeOut1[0], param.fadeOut1[1]);
    const fadeInRatio2  = THREE.MathUtils.smoothstep(progRatio, param.fadeIn2[0] , param.fadeIn2[1] );
    const fadeOutRatio2 = THREE.MathUtils.smoothstep(progRatio, param.fadeOut2[0], param.fadeOut2[1]);
    const scaleInRatio  = THREE.MathUtils.smoothstep(progRatio, param.scaleIn[0] , param.scaleIn[1] );
    const scaleOutRatio = THREE.MathUtils.smoothstep(progRatio, param.scaleOut[0], param.scaleOut[1]);

    // スケールアニメーションの進捗
    const scaleDelayFactor = 0.0;
    const maxScaleDelay = scaleDelayFactor * this.guidelines.children.length;
    const scaleRatio = scaleInRatio - scaleOutRatio;

    // フェードアニメーションの進捗
    const fadeRatio = (fadeInRatio1 - fadeOutRatio1) + (fadeInRatio2 - fadeOutRatio2);

    for (var i = 0;i <= this.outlines.children.length - 1;i ++) {

      const scaleDelay = scaleDelayFactor * i;
      const scaleRatioD = THREE.MathUtils.smootherstep(scaleRatio, scaleDelay, 1.0 + scaleDelay - maxScaleDelay);

      const control = (mesh) => {
        mesh.material.opacity = fadeRatio;
        mesh.scale.set(scaleRatioD, scaleRatioD);
      }

      const child = this.outlines.children[i];
      if (child.isGroup) {
        child.children.forEach((mesh) => control(mesh));
      } else {
        control(child);
      }
    }

    for (var i = 0;i <= this.outlineEdges.children.length - 1;i ++) {
      const scaleDelay = scaleDelayFactor * i;
      const scaleRatioD = THREE.MathUtils.smootherstep(scaleRatio, scaleDelay, 1.0 + scaleDelay - maxScaleDelay);

      mesh.material.opacity = fadeRatio * 1.8;
      mesh.scale.set(scaleRatioD, scaleRatioD);
    }
  }

  // 図形の表示制御
  shapeDisplayControl = (progRatio) => {
    const param = this.shapeParams;
    const fadeInRatio  = THREE.MathUtils.smoothstep(progRatio, param.fadeIn[0] , param.fadeIn[1] );
    const fadeOutRatio = THREE.MathUtils.smoothstep(progRatio, param.fadeOut[0], param.fadeOut[1]);

    const fadeRatio = fadeInRatio - fadeOutRatio;

    for (var i = 0;i <= this.shapes.children.length - 1;i ++) {

      const control = (mesh) => {
        mesh.material.opacity = fadeRatio;
      }

      const child = this.shapes.children[i];
      if (child.isGroup) {
        child.children.forEach((mesh) => control(mesh));
      } else {
        control(child);
      }
    }
  }


  // // 拡大縮小の表示制御
  // scaleDisplayControl = (progRatio) => {
  //   const p = this.scaleParams;
  //   const inRatio  = THREE.MathUtils.smootherstep(progRatio, p.inStart, p.inEnd);
  //   const outRatio = THREE.MathUtils.smoothstep(progRatio, p.outStart, p.outEnd);
  //   const control = (mesh) => {
  //     const scaleRatio = inRatio - outRatio;
  //     mesh.scale.set(scaleRatio, scaleRatio);
  //   }

  //   var index = 0;
  //   this.guidelines.children.forEach((child) => {
  //     const maxDelay = 0.04 * this.guidelines.children.length;
  //     const delay = 0.04 * index;
  //     // const inRatioD = THREE.MathUtils.inverseLerp(delay, 1.0 + delay - maxDelay, inRatio);
  //     const inRatioD = THREE.MathUtils.smootherstep(inRatio, delay, 1.0 + delay - maxDelay);
  //     // console.log(inRatioD)
  //     const scaleRatio = inRatioD - outRatio;
  //     child.scale.set(scaleRatio, scaleRatio);
  //     index ++;

  //     // if (child.isGroup) {
  //     //   child.children.forEach((mesh) => control(mesh));
  //     // } else {
  //     //   control(child);
  //     // }
  //   });
  //   this.outlines.children.forEach((child) => {
  //     if (child.isGroup) {
  //       child.children.forEach((mesh) => control(mesh));
  //     } else {
  //       control(child);
  //     }
  //   });
  //   this.shapes.children.forEach((mesh) => {
  //     control(mesh);
  //   });
  // }


  // 図形のアニメーション制御
  shapeRotationControl(progRatio) {
  }

}
