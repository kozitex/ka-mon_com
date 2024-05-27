'use strict';

import * as THREE from 'three';
import Kamon from '../kamon.js';

export default class GenjiGuruma extends Kamon {

  constructor() {

    super();

    this.rollHeight = 4000;

    this.pathW = 35;
    this.verNum = 8;
    this.angleFr = 90;
    this.angleTo = 450;
    this.circlesD = [];   // ベースの4つの中心円

    // ガイドラインの作成
    this.generateGuidelines();

    // アウトラインの作成
    this.generateOutlines();

    // 塗りつぶし図形の描画
    this.generateShapes();

    // infoの準備
    this.jpName.innerHTML = '源氏車';
    this.jpDesc.innerHTML = '車紋（くるまもん）の一種で、平安時代の貴族の乗り物であった牛車の車輪の形をモチーフにした家紋です。牛車は別名で源氏車とも呼ばれていました。また、車紋は佐藤姓の家紋に用いられたことでも知られています。佐藤氏の祖先が伊勢神宮の神事に携わっていた際、使用していた牛車が豪奢で有名だったことが由来で家紋に用いることになったと言われています。';
    this.enName.innerHTML = 'Genji-Guruma';
    this.enDesc.innerHTML = 'It is a type of Kurumamon (car crest), and is a family crest with a motif of the wheels of an ox cart, which was a vehicle used by aristocrats during the Heian period. The ox-cart was also called the Genji-guruma. The car crest is also known to have been used as the family crest of the Sato family name. It is said that the Sato clan&#39;s ancestors used it as their family crest because the bullock carts they used were famous for their luxury when they were involved in the rituals at Ise Grand Shrine.';
  }

  // ガイドラインを作成
  generateGuidelines = () => {

    const divCount = 1000;

    // 円
    const circles = new THREE.Group();
    const rs = [1600, 1300, 1265, 970, 935, 260, 225];
    rs.forEach((r) => {
      const circle = this.circleGen(0, 0, r, this.angleFr, this.angleTo, divCount, this.guideColor);
      circles.add(circle);
    });
    this.guidelines.add(circles);

    // 直線
    for (var v = 0;v <= this.verNum / 2 - 1;v ++) {

      // 車輪のスポーク部分
      const spokes = new THREE.Group();
      for (var i = 0;i <= 1;i ++) {
        const line = this.lineGen(1, 0, 0, 1600, - 1600, divCount, this.guideColor);
        const piece = 22.5;
        const rotA1 = i == 0 ? piece / 2 : - piece / 2;
        const rotA2 = 360 / this.verNum * v;
        line.rotation.z = (rotA1 - rotA2) * Math.PI / 180;
        spokes.add(line);
      }
      this.guidelines.add(spokes);

      // 内側の継ぎ目
      const inSeam = new THREE.Group();
      for (var i = 0;i <= 3;i ++) {
        const intercept = i == 0 || i == 2 ? - this.pathW / 2 : this.pathW / 2;
        const line = this.lineGen(1, 0, intercept, - 1600, 1600, divCount, this.guideColor);
        const piece = 16.875
        const rotA1 = (i <= 1 ? piece : - piece) * Math.PI / 180;
        const rotA2 = 360 / this.verNum * v * Math.PI / 180;
        line.rotation.z = rotA1 - rotA2;
        inSeam.add(line);
      }
      this.guidelines.add(inSeam);

      // 外側の継ぎ目
      const outSeam = new THREE.Group();
      for (var i = 0;i <= 1;i ++) {
        const intercept = i == 0 ? - this.pathW / 2 : this.pathW / 2;
        const line = this.lineGen(1, 0, intercept, 1600, - 1600, divCount, this.guideColor);
        const rotA = - 360 / this.verNum * v * Math.PI / 180;
        line.rotation.z = rotA;
        outSeam.add(line);
      }
      this.guidelines.add(outSeam);
    }
    this.scene.add(this.guidelines);
  }

  // アウトラインを作成
  generateOutlines = () => {
    const divCount = 1000;

    // 中央の円
    const centerCircle = this.outlineCircleGen(0, 0, 225, 90, 450, divCount, this.frontColor);
    this.outlines.add(centerCircle);

    // スポーク
    for (var v = 0;v <= this.verNum - 1;v ++) {
      const copyAngle = - 360 / this.verNum * v * Math.PI / 180;
      const sArc = this.outlineCircleGen(0, 0, 260, 101.25, 78.75, divCount, this.frontColor);
      const lArc = this.outlineCircleGen(0, 0, 935, 78.75, 101.25, divCount, this.frontColor);

      const sArcF = this.circle(0, 0, 260, 101.25);
      const sArcT = this.circle(0, 0, 260,  78.75);
      const lArcF = this.circle(0, 0, 935, 101.25);
      const lArcT = this.circle(0, 0, 935,  78.75);

      const lLineParam = this.from2Points(lArcF.x, lArcF.y, sArcF.x, sArcF.y);
      const rLineParam = this.from2Points(sArcT.x, sArcT.y, lArcT.x, lArcT.y);

      const lLine = this.outlineGen(lLineParam.a, 1, lLineParam.b, lArcF.x, sArcF.x, divCount, this.frontColor);
      const rLine = this.outlineGen(rLineParam.a, 1, rLineParam.b, sArcT.x, lArcT.x, divCount, this.frontColor);
      sArc.rotation.z = copyAngle;
      lArc.rotation.z = copyAngle;
      lLine.rotation.z = copyAngle;
      rLine.rotation.z = copyAngle;
      this.outlines.add(sArc, lArc, lLine, rLine);
    }

    // 内側の継ぎ目
    for (var v = 0;v <= this.verNum - 1;v ++) {
      const copyAngle = - 360 / this.verNum * v * Math.PI / 180;
      const iArcAngle = 16.875 - Math.atan(this.pathW / 2 /  970) * 180 / Math.PI
      const oArcAngle = 16.875 - Math.atan(this.pathW / 2 / 1265) * 180 / Math.PI
      const iArc = this.outlineCircleGen(0, 0,  970, 90 + iArcAngle, 90 - iArcAngle, divCount, this.frontColor);
      const oArc = this.outlineCircleGen(0, 0, 1265, 90 - oArcAngle, 90 + oArcAngle, divCount, this.frontColor);

      const iArcF = this.circle(0, 0,  970, 90 + iArcAngle);
      const iArcT = this.circle(0, 0,  970, 90 - iArcAngle);
      const oArcF = this.circle(0, 0, 1265, 90 + oArcAngle);
      const oArcT = this.circle(0, 0, 1265, 90 - oArcAngle);

      const lLineParam = this.from2Points(oArcF.x, oArcF.y, iArcF.x, iArcF.y);
      const rLineParam = this.from2Points(iArcT.x, iArcT.y, oArcT.x, oArcT.y);

      const lLine  = this.outlineGen(lLineParam.a, 1, lLineParam.b, oArcF.x, iArcF.x, divCount, this.frontColor);
      const rLine  = this.outlineGen(rLineParam.a, 1, rLineParam.b, iArcT.x, oArcT.x, divCount, this.frontColor);
      iArc.rotation.z = copyAngle;
      oArc.rotation.z = copyAngle;
      lLine.rotation.z = copyAngle;
      rLine.rotation.z = copyAngle;
      this.outlines.add(iArc, oArc, lLine, rLine);
    }

    // 外側の継ぎ目の円弧
    for (var v = 0;v <= this.verNum - 1;v ++) {
      const copyAngle = - 360 / this.verNum * v * Math.PI / 180;
      const iArcAngle = 16.875 + Math.atan(this.pathW / 2 / 970) * 180 / Math.PI;
      const oArcAngle = Math.atan(this.pathW / 2 / 1600) * 180 / Math.PI;
      const lArcAngleF = Math.atan(this.pathW / 2 / 1300) * 180 / Math.PI;
      const lArcAngleT = 16.875 + Math.atan(this.pathW / 2 / 1300) * 180 / Math.PI
      const iArc = this.outlineCircleGen(0, 0,  970, 90 - iArcAngle, 90 + iArcAngle - 45, divCount, this.frontColor);
      const oArc = this.outlineCircleGen(0, 0, 1600, 90 + oArcAngle - 45, 90 - oArcAngle, divCount, this.frontColor);
      const lArc = this.outlineCircleGen(0, 0, 1300, 90 - lArcAngleF, 90 - lArcAngleT, divCount, this.frontColor);
      const rArc = this.outlineCircleGen(0, 0, 1300, 90 + lArcAngleT - 45, 90 + lArcAngleF - 45, divCount, this.frontColor);

      const iArcF = this.circle(0, 0,  970, 90 - iArcAngle);
      const iArcT = this.circle(0, 0,  970, 90 + iArcAngle  - 45);
      const rArcF = this.circle(0, 0, 1300, 90 + lArcAngleT - 45);
      const rArcT = this.circle(0, 0, 1300, 90 + lArcAngleF - 45);
      const oArcF = this.circle(0, 0, 1600, 90 - oArcAngle);
      const oArcT = this.circle(0, 0, 1600, 90 + oArcAngle  - 45);
      const lArcF = this.circle(0, 0, 1300, 90 - lArcAngleF);
      const lArcT = this.circle(0, 0, 1300, 90 - lArcAngleT);

      const ilLineParam = this.from2Points(lArcT.x, lArcT.y, iArcF.x, iArcF.y);
      const irLineParam = this.from2Points(iArcT.x, iArcT.y, rArcF.x, rArcF.y);
      const olLineParam = this.from2Points(oArcF.x, oArcF.y, lArcF.x, lArcF.y);
      const orLineParam = this.from2Points(rArcT.x, rArcT.y, oArcT.x, oArcT.y);

      const ilLine  = this.outlineGen(ilLineParam.a, 1, ilLineParam.b, lArcT.x, iArcF.x, divCount, this.frontColor);
      const irLine  = this.outlineGen(irLineParam.a, 1, irLineParam.b, iArcT.x, rArcF.x, divCount, this.frontColor);
      const olLine  = this.outlineGen(olLineParam.a, 1, olLineParam.b, oArcF.x, lArcF.x, divCount, this.frontColor);
      const orLine  = this.outlineGen(orLineParam.a, 1, orLineParam.b, rArcT.x, oArcT.x, divCount, this.frontColor);

      iArc.rotation.z = copyAngle;
      oArc.rotation.z = copyAngle;
      lArc.rotation.z = copyAngle;
      rArc.rotation.z = copyAngle;
      ilLine.rotation.z = copyAngle;
      irLine.rotation.z = copyAngle;
      olLine.rotation.z = copyAngle;
      orLine.rotation.z = copyAngle;

      this.outlines.add(iArc, oArc, lArc, rArc);
      this.outlines.add(ilLine, irLine, olLine, orLine);
    }
    this.scene.add(this.outlines);
  }

  // 塗りつぶし図形を生成
  generateShapes = () => {

    const divCount = 1000;

    // 中央の円
    const centerCircle = this.circleShapeGen(0, 0, 225, 90, 450, divCount, this.frontColor);
    this.shapes.add(centerCircle);

    // スポーク
    for (var v = 0;v <= this.verNum - 1;v ++) {

      const sArc = this.circlePointGen(0, 0, 260, 101.25, 78.75, divCount, this.frontColor);
      const lArc = this.circlePointGen(0, 0, 935, 78.75, 101.25, divCount, this.frontColor);

      const sArcF = this.circle(0, 0, 260, 101.25);
      const sArcT = this.circle(0, 0, 260,  78.75);
      const lArcF = this.circle(0, 0, 935, 101.25);
      const lArcT = this.circle(0, 0, 935,  78.75);

      const lLineParam = this.from2Points(lArcF.x, lArcF.y, sArcF.x, sArcF.y);
      const rLineParam = this.from2Points(sArcT.x, sArcT.y, lArcT.x, lArcT.y);

      const lLine = this.linePointGen(lLineParam.a, 1, lLineParam.b, lArcF.x, sArcF.x, divCount, this.frontColor);
      const rLine = this.linePointGen(rLineParam.a, 1, rLineParam.b, sArcT.x, lArcT.x, divCount, this.frontColor);

      const points = sArc.concat(rLine, lArc, lLine);

      const shape = new THREE.Shape(points);
      const geometry = new THREE.ShapeGeometry(shape);
      const material = new THREE.MeshBasicMaterial({
        color: this.frontColor,
        side: THREE.DoubleSide,
        transparent: true,
      });
      const mesh = new THREE.Mesh(geometry, material);
      this.shapes.add(mesh);

      const copyAngle = - 360 / this.verNum * v * Math.PI / 180;
      mesh.rotation.z = copyAngle;
    }

    // 内側の継ぎ目
    for (var v = 0;v <= this.verNum - 1;v ++) {
      const iArcAngle = 16.875 - Math.atan(this.pathW / 2 /  970) * 180 / Math.PI
      const oArcAngle = 16.875 - Math.atan(this.pathW / 2 / 1265) * 180 / Math.PI
      const iArc = this.circlePointGen(0, 0,  970, 90 + iArcAngle, 90 - iArcAngle, divCount, this.frontColor);
      const oArc = this.circlePointGen(0, 0, 1265, 90 - oArcAngle, 90 + oArcAngle, divCount, this.frontColor);

      const iArcF = this.circle(0, 0,  970, 90 + iArcAngle);
      const iArcT = this.circle(0, 0,  970, 90 - iArcAngle);
      const oArcF = this.circle(0, 0, 1265, 90 + oArcAngle);
      const oArcT = this.circle(0, 0, 1265, 90 - oArcAngle);

      const lLineParam = this.from2Points(oArcF.x, oArcF.y, iArcF.x, iArcF.y);
      const rLineParam = this.from2Points(iArcT.x, iArcT.y, oArcT.x, oArcT.y);

      const lLine  = this.linePointGen(lLineParam.a, 1, lLineParam.b, oArcF.x, iArcF.x, divCount, this.frontColor);
      const rLine  = this.linePointGen(rLineParam.a, 1, rLineParam.b, iArcT.x, oArcT.x, divCount, this.frontColor);

      const points = iArc.concat(rLine, oArc, lLine);

      const shape = new THREE.Shape(points);
      const geometry = new THREE.ShapeGeometry(shape);
      const material = new THREE.MeshBasicMaterial({
        color: this.frontColor,
        side: THREE.DoubleSide,
        transparent: true,
      });
      const mesh = new THREE.Mesh(geometry, material);
      this.shapes.add(mesh);

      const copyAngle = - 360 / this.verNum * v * Math.PI / 180;
      mesh.rotation.z = copyAngle;
    }

    // 外側の継ぎ目の円弧
    for (var v = 0;v <= this.verNum - 1;v ++) {
      const iArcAngle = 16.875 + Math.atan(this.pathW / 2 /  970) * 180 / Math.PI;
      const oArcAngle = Math.atan(this.pathW / 2 / 1600) * 180 / Math.PI;
      const lArcAngleF = Math.atan(this.pathW / 2 / 1300) * 180 / Math.PI;
      const lArcAngleT = 16.875 + Math.atan(this.pathW / 2 / 1300) * 180 / Math.PI
      const iArc = this.circlePointGen(0, 0,  970, 90 - iArcAngle, 90 + iArcAngle - 45, divCount, this.frontColor);
      const oArc = this.circlePointGen(0, 0, 1600, 90 + oArcAngle - 45, 90 - oArcAngle, divCount, this.frontColor);
      const lArc = this.circlePointGen(0, 0, 1300, 90 - lArcAngleF, 90 - lArcAngleT, divCount, this.frontColor);
      const rArc = this.circlePointGen(0, 0, 1300, 90 + lArcAngleT - 45, 90 + lArcAngleF - 45, divCount, this.frontColor);

      const iArcF = this.circle(0, 0,  970, 90 - iArcAngle);
      const iArcT = this.circle(0, 0,  970, 90 + iArcAngle - 45);
      const rArcF = this.circle(0, 0, 1300, 90 + lArcAngleT - 45);
      const rArcT = this.circle(0, 0, 1300, 90 + lArcAngleF - 45);
      const oArcF = this.circle(0, 0, 1600, 90 - oArcAngle);
      const oArcT = this.circle(0, 0, 1600, 90 + oArcAngle - 45);
      const lArcF = this.circle(0, 0, 1300, 90 - lArcAngleF);
      const lArcT = this.circle(0, 0, 1300, 90 - lArcAngleT);

      const ilLineParam = this.from2Points(lArcT.x, lArcT.y, iArcF.x, iArcF.y);
      const irLineParam = this.from2Points(iArcT.x, iArcT.y, rArcF.x, rArcF.y);
      const olLineParam = this.from2Points(oArcF.x, oArcF.y, lArcF.x, lArcF.y);
      const orLineParam = this.from2Points(rArcT.x, rArcT.y, oArcT.x, oArcT.y);

      const ilLine  = this.linePointGen(ilLineParam.a, 1, ilLineParam.b, lArcT.x, iArcF.x, divCount, this.frontColor);
      const irLine  = this.linePointGen(irLineParam.a, 1, irLineParam.b, iArcT.x, rArcF.x, divCount, this.frontColor);
      const olLine  = this.linePointGen(olLineParam.a, 1, olLineParam.b, oArcF.x, lArcF.x, divCount, this.frontColor);
      const orLine  = this.linePointGen(orLineParam.a, 1, orLineParam.b, rArcT.x, oArcT.x, divCount, this.frontColor);

      const points = iArc.concat(irLine, rArc, orLine, oArc, olLine, lArc, ilLine);

      const shape = new THREE.Shape(points);
      const geometry = new THREE.ShapeGeometry(shape);
      const material = new THREE.MeshBasicMaterial({
        color: this.frontColor,
        side: THREE.DoubleSide,
        transparent: true,
      });
      const mesh = new THREE.Mesh(geometry, material);
      this.shapes.add(mesh);

      const copyAngle = - 360 / this.verNum * v * Math.PI / 180;
      mesh.rotation.z = copyAngle;
    }
    this.scene.add(this.shapes);
  }

  // ガイドラインの描画アニメーション制御
  guidelinesDrawControl = (start, end, divCount, delayFactor) => {
    const adjust = 1;
    const ratio = THREE.MathUtils.smoothstep(this.progRatio, start, end);
    this.guidelines.children.forEach((group) => {
      const num = group.children.length / adjust;
      const maxDelay = delayFactor * num;
      for (var i = 0;i <= group.children.length - 1;i ++) {
        const line = group.children[i];
        const delay = delayFactor * i / adjust;
        const ratioD = THREE.MathUtils.smoothstep(ratio, 0.0 + delay, 1.0 - maxDelay + delay);
        line.geometry.setDrawRange(0, divCount * ratioD);
      }
    })
  }

  // アウトラインの表示アニメーション制御
  outlinesDrawControl = (start, end, divCount) => {
    const ratio = THREE.MathUtils.smoothstep(this.progRatio, start, end);
    this.outlines.children.forEach((group) => {
      group.children.forEach((outline) => {
        outline.geometry.setDrawRange(0, divCount * ratio);
      });
    });
  }

  // 図形のアニメーション制御
  shapesRotationControl(start, end) {
    var ratio = THREE.MathUtils.smootherstep(this.progRatio, start, end);
    for (var i = 0;i <= this.shapes.children.length - 1;i ++) {
      const shape = this.shapes.children[i];
      const j = i - 1;
      const num = Math.trunc(j / 2);
      if (i > 0) {
        const adjust1 = 80;
        const adjust2 = 20;
        var ratioSx, ratioSy;
        if (ratio < 0.1 + num / adjust1) {
          ratioSx = THREE.MathUtils.mapLinear(ratio, 0.0, 0.1 + num / adjust1, 1.0, 0.3);
          ratioSy = THREE.MathUtils.mapLinear(ratio, 0.0, 0.1 + num / adjust1, 1.0, 0.2);
        } else if (ratio < 0.4 + num / adjust2) {
          ratioSx = 0.3;
          ratioSy = 0.2;
        } else {
          ratioSx = THREE.MathUtils.mapLinear(ratio, 0.4 + num / adjust2, 1.0, 0.3, 1.0);
          ratioSy = THREE.MathUtils.mapLinear(ratio, 0.4 + num / adjust2, 1.0, 0.2, 1.0);
        }
        shape.scale.set(ratioSx, ratioSy)
        this.shapes.rotation.z = - 720 * ratio * (Math.PI / 180);
      }
    }
  }

  render() {

    // ガイドラインの表示アニメーション制御
    this.guidelinesDrawControl(0.05, 0.45, 1000, 0.1);

    // グリッドをフェードアウト
    this.grid.fadeOut(this.progRatio, 0.35, 0.45);

    // アウトラインの表示アニメーション制御
    this.outlinesDrawControl(0.4, 0.6, 1000);

    // ガイドラインをフェードアウト
    this.guidelinesFadeoutControl(0.5, 0.6);

    // 塗りつぶし図形をフェードイン
    this.shapesDrawControl(0.6, 0.7);

    // アウトラインをフェードアウト
    this.outlinesFadeoutControl(0.6, 0.7);

    // 図形を回転
    this.shapesRotationControl(0.7, 1.0);

    // descのアニメーションを制御
    this.descSlideinControl(0.8, 0.95);

    super.render();
  }
}
