'use strict';

import * as THREE from 'three';
import Kamon from '../kamon2.js';

export default class Kikyou2 extends Kamon {

  constructor() {

    super();

    // infoのテキスト
    this.jpNameText = '桔梗';
    this.jpDescText = '桔梗の花を図案化した家紋です。桔梗の漢字のつくりから「更に吉（さらによし）」という語呂が縁起が良いとされ、多くの家の家紋として使用されていました。この内、陰桔梗は戦国武将、明智光秀の家紋としても知られていますが、本能寺の変をきっかけに裏切り者の家紋として使用を憚られた時期があったと言われています。';
    this.enNameText = 'Kikyou<br>(Bellflower)';
    this.enDescText = 'This is a family crest with a design of a bellflower. Due to the kanji character for bellflower, the word "Moreyoshi" is said to bring good luck, and it was used as the family emblem of many families. Of these, Kagekikyo is also known as the family emblem of Sengoku warlord Akechi Mitsuhide, but it is said that there was a time when its use was discouraged as a traitor&#39;s family emblem in the wake of the Honnoji Incident.';

    // ガイドラインの表示アニメーションパラメータ
    this.guidelineParams = {
      drawIn   : [0.10, 0.40],
      drawOut  : [0.65, 0.80],
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
      scaleOut : [0.70, 0.80],
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
    this.circle2 = {a: 0, b: 0, r: 1000};
    this.circle3 = {a: 0, b: 0, r:  520};
    this.circle4 = {a: 0, b: 0, r:  220};

    // 五角形の頂点
    this.pentaApices = [];
    for (var i = 0;i <= 5;i ++) {
      const theta = 90 + (72 * i);
      const apex = this.circle(this.circle1, theta);
      this.pentaApices.push(apex);
    }

    // 五角形の対角線の頂点
    this.pentaDiagApices = [];
    for (var i = 0;i <= 4;i ++) {
      const theta1 = 90 + (72 * i);
      const theta2 = theta1 + 180;
      const apex1 = this.circle(this.circle1, theta1);
      const apex2 = this.circle(this.circle1, theta2);
      this.pentaDiagApices.push([apex1, apex2]);
    }

    // 外周円のパラメータ
    this.outerParams = [];
    var radius;
    const theta0 = 21;
    for (var i = 0;i <= 4;i ++) {
      const theta1 = (270 - theta0) + (72 * i);
      const theta2 = (270 + theta0) + (72 * i);
      const apex1 = this.circle(this.circle2, theta1);
      const apex2 = this.circle(this.circle2, theta2);
      if (i == 0) radius = Math.abs(apex1.x);
      this.outerParams.push(
        {a: apex1.x, b: apex1.y, r: radius},
        {a: apex2.x, b: apex2.y, r: radius},
      );
    }

    // 外周円の中心を通る放射線
    this.outerDiags = [];
    for (var i = 0;i <= 4;i ++) {
      const theta1 = (270 - theta0) + (72 * i);
      const theta2 = (270 + theta0) + (72 * i);
      const apex0 = new THREE.Vector3(0, 0, 0);
      const apex1 = this.circle(this.circle1, theta1);
      const apex2 = this.circle(this.circle1, theta2);
      this.outerDiags.push([apex0, apex1], [apex0, apex2]);
    }

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
    const centers1 = [this.circle1, this.circle2, this.circle3];
    for (var i = 0;i <= 2;i ++) {
      const circle = centers1[i];
      const points = this.circleLocusGen(circle,[90, 450], this.divCount);
      const mesh = this.sublineGen(points);
      this.guidelines.add(mesh);
    }

    // 対角線１
    this.radiation1 = new THREE.Group();
    for (var i = 0;i <= 9;i ++) {
      const apices = this.outerDiags[i];
      const points = this.lineLocusGen(apices[0], apices[1], 0, this.divCount);
      const mesh = this.sublineGen(points);
      this.radiation1.add(mesh);
    }
    this.guidelines.add(this.radiation1);

    // 対角線２
    this.radiation2 = new THREE.Group();
    for (var i = 0;i <= 4;i ++) {
      const apices = this.pentaDiagApices[i];
      const points = this.lineLocusGen(apices[0], apices[1], 0, this.divCount);
      const mesh = this.guidelineGen(points);
      this.radiation2.add(mesh);
    }
    this.guidelines.add(this.radiation2);

    // 外周円
    for (var i = 0;i <= 9;i ++) {
      const outer = this.outerParams[i];
      const points = this.circleLocusGen(outer,[90, 450], this.divCount);
      const mesh = this.guidelineGen(points);
      mesh.rotation.z = THREE.MathUtils.degToRad(216);
      this.guidelines.add(mesh);
    }

    // 五角形の辺
    this.pentagon = new THREE.Group();
    for (var i = 0;i <= 4;i ++) {
      const apex1 = this.pentaApices[i];
      const apex2 = this.pentaApices[i + 1];
      const points = this.lineLocusGen(apex1, apex2, 0, this.divCount);
      const mesh = this.guidelineGen(points);
      this.pentagon.add(mesh);
    }
    this.guidelines.add(this.pentagon);

    // 中心円３
    const centers3 = [this.circle4];
    for (var i = 0;i <= 0;i ++) {
      const circle = centers3[i];
      const points = this.circleLocusGen(circle,[90, 450], this.divCount);
      const mesh = this.guidelineGen(points);
      this.guidelines.add(mesh);
    }

    this.group.add(this.guidelines);
  }

  // アウトラインを作成
  generateOutline = () => {

    const w = 4;

    // 中心円
    const centers = [this.circle4];
    centers.forEach((center) => {
      const center1 = {a: center.a, b: center.b, r: center.r + w};
      const center2 = {a: center.a, b: center.b, r: center.r - w};
      const shape = this.curvePointGen(center1, [0, 360], true);
      const path  = this.curvePointGen(center2, [0, 360], true);
      const geo = this.shapeGeoGen(shape, path);
      const mesh = new THREE.Mesh(geo, this.outlineMat);
      this.outlines.add(mesh);
    });

    // 円弧
    const outer = this.outerParams[0];
    const angle = [270, 360];
    const arc1 = {a: outer.a, b: outer.b, r: outer.r + w};
    const arc2 = {a: outer.a, b: outer.b, r: outer.r - w};
    const point1 = this.curvePointGen(arc1, [angle[0], angle[1]], false);
    const point2 = this.curvePointGen(arc2, [angle[1], angle[0]], true);
    const points = point2.concat(point1);
    const outerGeo = this.shapeGeoGen(points);

    // 花弁１
    const apex1 = this.pentaApices[2];
    const apex2 = new THREE.Vector3(outer.a, outer.b - outer.r, 0);
    const petalGeo1 = this.outlineGeoGen(apex1, apex2);

    // 花弁２
    const apex3 = new THREE.Vector3(0, - this.circle4.r, 0);
    const apex4 = new THREE.Vector3(0, outer.b, 0);
    const petalGeo2 = this.outlineGeoGen(apex3, apex4);

    // 花弁３
    const c3 = this.circle3;
    const c4 = this.circle4;
    const theta = THREE.MathUtils.degToRad(36);
    const x1 = c4.r * Math.sin(theta);
    const y1 = c4.r * Math.cos(theta);
    const x2 = c3.r * Math.sin(theta);
    const y2 = c3.r * Math.cos(theta);
    const apex5 = new THREE.Vector3(- x1, - y1, 0);
    const apex6 = new THREE.Vector3(- x2, - y2, 0);
    const petalGeo3 = this.outlineGeoGen(apex5, apex6);

    const geos = [outerGeo, petalGeo1, petalGeo2, petalGeo3];

    for (var i = 0;i <= 1;i ++) {
      for (var j = 0;j <= 4;j ++) {
        geos.forEach((geo) => {
          const mesh = new THREE.Mesh(geo, this.outlineMat);
          mesh.rotation.y = THREE.MathUtils.degToRad(180 * i);
          mesh.rotation.z = THREE.MathUtils.degToRad(72 * j);
          this.outlines.add(mesh);
        })
      }
    }

    this.group.add(this.outlines);
  }

  // 塗りつぶし図形を生成
  generateShape = () => {

    const w = 4;

    // 中心円
    const centers = [this.circle4];
    centers.forEach((center) => {
      const param = {a: center.a, b: center.b, r: center.r - w};
      const shape = this.curvePointGen(param, [0, 360], true);
      const geo = this.shapeGeoGen(shape);
      const mesh = new THREE.Mesh(geo, this.shapeMat);
      this.shapes.add(mesh);
    });

    // 花弁中央の頂点
    const apex1 = this.circle(this.circle3, 234);

    // 花弁中央の先端
    const theta = THREE.MathUtils.degToRad(36);
    const paraX1 = w * Math.cos(theta);
    const paraY1 = w * Math.sin(theta);
    const apex2 = new THREE.Vector3(apex1.x + paraX1, apex1.y - paraY1, 0);

    const c4 = this.circle4;
    const center = {a: c4.a, b: c4.b, r: c4.r + w};

    // 中央円弧の前後
    const apex3d = this.circle(center, 234);
    const apex3 = new THREE.Vector3(apex3d.x + paraX1, apex3d.y - paraY1, 0);
    const apex4d = this.circle(center, 270);
    const apex4 = new THREE.Vector3(apex4d.x - w, apex4d.y, 0);

    // 中央の円弧
    const angle1 = this.arc(center, apex3);
    const angle2 = this.arc(center, apex4);
    const arc1 = this.curvePointGen(center, [angle1, angle2], false);

    // 外周円弧の前後
    const outerParam = this.outerParams[0];
    const outer = {a: outerParam.a, b: outerParam.b, r: outerParam.r - w};
    const apex5 = new THREE.Vector3(outer.a + outer.r, outer.b, 0);
    const apex6 = new THREE.Vector3(outer.a, outer.b - outer.r, 0);

    // 外周の円弧
    const angle3 = this.arc(outer, apex5);
    const angle4 = this.arc(outer, apex6);
    const arc2 = this.curvePointGen(outer, [angle3, angle4], true);

    // 花弁の頂点
    const paraX2 = w * Math.tan(theta);
    const apex7d = this.pentaApices[2];
    const apex7 = new THREE.Vector3(apex7d.x + paraX2, apex7d.y + w, 0);

    const points = [apex1].concat([apex2, apex3], arc1, [apex4, apex5], arc2, [apex6, apex7]);
    const geo = this.shapeGeoGen(points);

    for (var i = 0;i <= 1;i ++) {
      for (var j = 0;j <= 4;j ++) {
        const mesh = new THREE.Mesh(geo, this.shapeMat);
        mesh.rotation.y = THREE.MathUtils.degToRad(180 * i);
        mesh.rotation.z = THREE.MathUtils.degToRad(72 * j);
        this.shapes.add(mesh);
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
