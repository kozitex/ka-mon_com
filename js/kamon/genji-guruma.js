'use strict';

import * as THREE from 'three';
import Kamon from '../kamon.js';

export default class GenjiGuruma extends Kamon {

  constructor() {

    super();

    this.pathW = 35;
    this.verNum = 8;

    this.divCount = 1000;

    // ガイドラインの作成
    this.generateGuidelines();

    // アウトラインの作成
    this.generateOutlines();

    // 塗りつぶし図形の描画
    this.generateShapes();

  }

  init = () => {

    super.init()

    // infoの準備
    this.jpName.innerHTML = '源氏車';
    this.jpDesc.innerHTML = '車紋（くるまもん）の一種で、平安時代の貴族の乗り物であった牛車の車輪の形をモチーフにした家紋です。牛車は別名で源氏車とも呼ばれていました。また、車紋は佐藤姓の家紋に用いられたことでも知られています。佐藤氏の祖先が伊勢神宮の神事に携わっていた際、使用していた牛車が豪奢で有名だったことが由来で家紋に用いることになったと言われています。';
    this.enName.innerHTML = 'Genji-Guruma';
    this.enDesc.innerHTML = 'It is a type of Kurumamon (car crest), and is a family crest with a motif of the wheels of an ox cart, which was a vehicle used by aristocrats during the Heian period. The ox-cart was also called the Genji-guruma. The car crest is also known to have been used as the family crest of the Sato family name. It is said that the Sato clan&#39;s ancestors used it as their family crest because the bullock carts they used were famous for their luxury when they were involved in the rituals at Ise Grand Shrine.';
  }

  // ガイドラインを作成
  generateGuidelines = () => {

    // 円
    const circles = new THREE.Group();
    const rs = [1600, 1300, 1265, 970, 935, 260, 225];
    rs.forEach((r) => {
      const points = this.circlePointGen(0, 0, r, 90, 450, this.divCount);
      const circle = this.guidelineGen(points);
      circles.add(circle);
    });
    this.guidelines.add(circles);

    // 直線
    for (var v = 0;v <= this.verNum / 2 - 1;v ++) {

      // 車輪のスポーク部分
      const spokes = new THREE.Group();
      for (var i = 0;i <= 1;i ++) {
        const points = this.linePointGen(1, 0, 0, 1600, - 1600, this.divCount);
        const line = this.guidelineGen(points);
        const rot = ((- 2 * i + 1) * 22.5 / 2) - (360 / this.verNum * v);
        line.rotation.z = THREE.MathUtils.degToRad(rot);
        spokes.add(line);
      }
      this.guidelines.add(spokes);

      // 内側の継ぎ目
      const inSeam = new THREE.Group();
      for (var i = 0;i <= 3;i ++) {
        const intercept = (- 2 * (i % 2) + 1) * this.pathW / 2;
        const points = this.linePointGen(1, 0, intercept, - 1600, 1600, this.divCount);
        const line = this.guidelineGen(points);
        const rot = ((i <= 1 ? 1 : - 1) * 16.875) - (360 / this.verNum * v);
        line.rotation.z = THREE.MathUtils.degToRad(rot);
        inSeam.add(line);
      }
      this.guidelines.add(inSeam);

      // 外側の継ぎ目
      const outSeam = new THREE.Group();
      for (var i = 0;i <= 1;i ++) {
        const intercept = (2 * i - 1) * this.pathW / 2;
        const points = this.linePointGen(1, 0, intercept, 1600, - 1600, this.divCount);
        const line = this.guidelineGen(points);
        const rot = - 360 / this.verNum * v;
        line.rotation.z = THREE.MathUtils.degToRad(rot);
        outSeam.add(line);
      }
      this.guidelines.add(outSeam);
    }
    this.scene.add(this.guidelines);
  }

  // アウトラインを作成
  generateOutlines = () => {

    // 中央の円
    const centerCircle = this.outlineCircleGen(0, 0, 225, 90, 450, this.divCount);
    this.outlines.add(centerCircle);

    // スポーク
    for (var v = 0;v <= this.verNum - 1;v ++) {

      const sArc = this.outlineCircleGen(0, 0, 260, 101.25, 78.75, this.divCount);
      const lArc = this.outlineCircleGen(0, 0, 935, 78.75, 101.25, this.divCount);

      const sArcF = this.circle(0, 0, 260, 101.25);
      const sArcT = this.circle(0, 0, 260,  78.75);
      const lArcF = this.circle(0, 0, 935, 101.25);
      const lArcT = this.circle(0, 0, 935,  78.75);

      const lLineParam = this.from2Points(lArcF.x, lArcF.y, sArcF.x, sArcF.y);
      const rLineParam = this.from2Points(sArcT.x, sArcT.y, lArcT.x, lArcT.y);

      const lLine = this.outlineLineGen(lLineParam.a, 1, lLineParam.b, lArcF.x, sArcF.x, this.divCount);
      const rLine = this.outlineLineGen(rLineParam.a, 1, rLineParam.b, sArcT.x, lArcT.x, this.divCount);

      const lEdge = this.outlineEdgeGen(lLineParam.a, 1, lLineParam.b, lArcF.x, sArcF.x);
      const rEdge = this.outlineEdgeGen(rLineParam.a, 1, rLineParam.b, sArcT.x, lArcT.x);

      const copyAngle = THREE.MathUtils.degToRad(- 360 / this.verNum * v);
      sArc.rotation.z = copyAngle;
      lArc.rotation.z = copyAngle;
      lLine.rotation.z = copyAngle;
      rLine.rotation.z = copyAngle;
      lEdge.rotation.z = copyAngle;
      rEdge.rotation.z = copyAngle;

      this.outlines.add(sArc, lArc, lLine, rLine);
      this.outlineEdges.add(lEdge, rEdge);
    }

    // 内側の継ぎ目
    for (var v = 0;v <= this.verNum - 1;v ++) {

      const iArcAngle = 16.875 - THREE.MathUtils.radToDeg(Math.atan(this.pathW / 2 /  970));
      const oArcAngle = 16.875 - THREE.MathUtils.radToDeg(Math.atan(this.pathW / 2 / 1265));

      const iArc = this.outlineCircleGen(0, 0,  970, 90 + iArcAngle, 90 - iArcAngle, this.divCount);
      const oArc = this.outlineCircleGen(0, 0, 1265, 90 - oArcAngle, 90 + oArcAngle, this.divCount);

      const iArcF = this.circle(0, 0,  970, 90 + iArcAngle);
      const iArcT = this.circle(0, 0,  970, 90 - iArcAngle);
      const oArcF = this.circle(0, 0, 1265, 90 + oArcAngle);
      const oArcT = this.circle(0, 0, 1265, 90 - oArcAngle);

      const lLineParam = this.from2Points(oArcF.x, oArcF.y, iArcF.x, iArcF.y);
      const rLineParam = this.from2Points(iArcT.x, iArcT.y, oArcT.x, oArcT.y);

      const lLine = this.outlineLineGen(lLineParam.a, 1, lLineParam.b, oArcF.x, iArcF.x, this.divCount);
      const rLine = this.outlineLineGen(rLineParam.a, 1, rLineParam.b, iArcT.x, oArcT.x, this.divCount);

      const lEdge = this.outlineEdgeGen(lLineParam.a, 1, lLineParam.b, oArcF.x, iArcF.x);
      const rEdge = this.outlineEdgeGen(rLineParam.a, 1, rLineParam.b, iArcT.x, oArcT.x);

      const copyAngle = THREE.MathUtils.degToRad(- 360 / this.verNum * v);
      iArc.rotation.z = copyAngle;
      oArc.rotation.z = copyAngle;
      lLine.rotation.z = copyAngle;
      rLine.rotation.z = copyAngle;
      lEdge.rotation.z = copyAngle;
      rEdge.rotation.z = copyAngle;

      this.outlines.add(iArc, oArc, lLine, rLine);
      this.outlineEdges.add(lEdge, rEdge);
    }

    // 外側の継ぎ目の円弧
    for (var v = 0;v <= this.verNum - 1;v ++) {

      const iArcAngle = 16.875 + THREE.MathUtils.radToDeg(Math.atan(this.pathW / 2 / 970));
      const oArcAngle = THREE.MathUtils.radToDeg(Math.atan(this.pathW / 2 / 1600));
      const lArcAngleF = THREE.MathUtils.radToDeg(Math.atan(this.pathW / 2 / 1300));
      const lArcAngleT = 16.875 + THREE.MathUtils.radToDeg(Math.atan(this.pathW / 2 / 1300));

      const iArc = this.outlineCircleGen(0, 0,  970, 90 - iArcAngle, 90 + iArcAngle - 45, this.divCount);
      const oArc = this.outlineCircleGen(0, 0, 1600, 90 + oArcAngle - 45, 90 - oArcAngle, this.divCount);
      const lArc = this.outlineCircleGen(0, 0, 1300, 90 - lArcAngleF, 90 - lArcAngleT, this.divCount);
      const rArc = this.outlineCircleGen(0, 0, 1300, 90 + lArcAngleT - 45, 90 + lArcAngleF - 45, this.divCount);

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

      const ilLine = this.outlineLineGen(ilLineParam.a, 1, ilLineParam.b, lArcT.x, iArcF.x, this.divCount);
      const irLine = this.outlineLineGen(irLineParam.a, 1, irLineParam.b, iArcT.x, rArcF.x, this.divCount);
      const olLine = this.outlineLineGen(olLineParam.a, 1, olLineParam.b, oArcF.x, lArcF.x, this.divCount);
      const orLine = this.outlineLineGen(orLineParam.a, 1, orLineParam.b, rArcT.x, oArcT.x, this.divCount);

      const ilEdge = this.outlineEdgeGen(ilLineParam.a, 1, ilLineParam.b, lArcT.x, iArcF.x);
      const irEdge = this.outlineEdgeGen(irLineParam.a, 1, irLineParam.b, iArcT.x, rArcF.x);
      const olEdge = this.outlineEdgeGen(olLineParam.a, 1, olLineParam.b, oArcF.x, lArcF.x);
      const orEdge = this.outlineEdgeGen(orLineParam.a, 1, orLineParam.b, rArcT.x, oArcT.x);

      const copyAngle = THREE.MathUtils.degToRad(- 360 / this.verNum * v);
      iArc.rotation.z = copyAngle;
      oArc.rotation.z = copyAngle;
      lArc.rotation.z = copyAngle;
      rArc.rotation.z = copyAngle;
      ilLine.rotation.z = copyAngle;
      irLine.rotation.z = copyAngle;
      olLine.rotation.z = copyAngle;
      orLine.rotation.z = copyAngle;
      ilEdge.rotation.z = copyAngle;
      irEdge.rotation.z = copyAngle;
      olEdge.rotation.z = copyAngle;
      orEdge.rotation.z = copyAngle;

      this.outlines.add(iArc, oArc, lArc, rArc);
      this.outlines.add(ilLine, irLine, olLine, orLine);
      this.outlineEdges.add(ilEdge, irEdge, olEdge, orEdge);
    }
    this.scene.add(this.outlines, this.outlineEdges);
  }

  // 塗りつぶし図形を生成
  generateShapes = () => {

    // 中央の円
    const group = new THREE.Group();
    const points0 = this.curvePointGen(0, 0, 225, 0, 360, false);
    const circle0 = this.shapeGen(points0);
    group.add(circle0);
    this.shapes.add(group);

    // スポーク
    for (var v = 0;v <= this.verNum - 1;v ++) {
      const group = new THREE.Group();

      const sArc = this.curvePointGen(0, 0, 260, 101.25, 78.75, true);
      const lArc = this.curvePointGen(0, 0, 935, 78.75, 101.25, false);
    
      const sArcF = this.circle(0, 0, 260, 101.25);
      const sArcT = this.circle(0, 0, 260,  78.75);
      const lArcF = this.circle(0, 0, 935, 101.25);
      const lArcT = this.circle(0, 0, 935,  78.75);

      const lLine = [lArcF, sArcF];
      const rLine = [sArcT, lArcT];

      const points = sArc.concat(rLine, lArc, lLine);
      const mesh = this.shapeGen(points);
      group.add(mesh);
      this.shapes.add(group);

      const copyAngle = THREE.MathUtils.degToRad(- 360 / this.verNum * v);
      mesh.rotation.z = copyAngle;
    }

    // 内側の継ぎ目
    for (var v = 0;v <= this.verNum - 1;v ++) {
      const group = new THREE.Group();

      const iArcAngle = 16.875 - THREE.MathUtils.radToDeg(Math.atan(this.pathW / 2 /  970));
      const oArcAngle = 16.875 - THREE.MathUtils.radToDeg(Math.atan(this.pathW / 2 / 1265));

      const iArc = this.curvePointGen(0, 0,  970, 90 + iArcAngle, 90 - iArcAngle, true);
      const oArc = this.curvePointGen(0, 0, 1265, 90 - oArcAngle, 90 + oArcAngle, false);

      const iArcF = this.circle(0, 0,  970, 90 + iArcAngle);
      const iArcT = this.circle(0, 0,  970, 90 - iArcAngle);
      const oArcF = this.circle(0, 0, 1265, 90 + oArcAngle);
      const oArcT = this.circle(0, 0, 1265, 90 - oArcAngle);

      const lLine = [oArcF, iArcF];
      const rLine = [iArcT, oArcT];

      const points = iArc.concat(rLine, oArc, lLine);
      const mesh = this.shapeGen(points);
      group.add(mesh);
      this.shapes.add(group);

      const copyAngle = THREE.MathUtils.degToRad(- 360 / this.verNum * v);
      mesh.rotation.z = copyAngle;
    }

    // 外側の継ぎ目の円弧
    for (var v = 0;v <= this.verNum - 1;v ++) {
      const group = new THREE.Group();

      const iArcAngle = 16.875 + THREE.MathUtils.radToDeg(Math.atan(this.pathW / 2 /  970));
      const oArcAngle = THREE.MathUtils.radToDeg(Math.atan(this.pathW / 2 / 1600));
      const lArcAngleF = THREE.MathUtils.radToDeg(Math.atan(this.pathW / 2 / 1300));
      const lArcAngleT = 16.875 + THREE.MathUtils.radToDeg(Math.atan(this.pathW / 2 / 1300));

      const iArc = this.curvePointGen(0, 0,  970, 90 - iArcAngle, 90 + iArcAngle - 45, true);
      const oArc = this.curvePointGen(0, 0, 1600, 90 + oArcAngle - 45, 90 - oArcAngle, false);
      const lArc = this.curvePointGen(0, 0, 1300, 90 - lArcAngleF, 90 - lArcAngleT, true);
      const rArc = this.curvePointGen(0, 0, 1300, 90 + lArcAngleT - 45, 90 + lArcAngleF - 45, true);

      const iArcF = this.circle(0, 0,  970, 90 - iArcAngle);
      const iArcT = this.circle(0, 0,  970, 90 + iArcAngle - 45);
      const rArcF = this.circle(0, 0, 1300, 90 + lArcAngleT - 45);
      const rArcT = this.circle(0, 0, 1300, 90 + lArcAngleF - 45);
      const oArcF = this.circle(0, 0, 1600, 90 - oArcAngle);
      const oArcT = this.circle(0, 0, 1600, 90 + oArcAngle - 45);
      const lArcF = this.circle(0, 0, 1300, 90 - lArcAngleF);
      const lArcT = this.circle(0, 0, 1300, 90 - lArcAngleT);

      const ilLine  = [lArcT, iArcF];
      const irLine  = [iArcT, rArcF];
      const olLine  = [oArcF, lArcF];
      const orLine  = [rArcT, oArcT];

      const points = iArc.concat(irLine, rArc, orLine, oArc, olLine, lArc, ilLine);
      const mesh = this.shapeGen(points);
      group.add(mesh);
      this.shapes.add(group);

      const copyAngle = THREE.MathUtils.degToRad(- 360 / this.verNum * v);
      mesh.rotation.z = copyAngle;
    }
    this.scene.add(this.shapes);
  }

  // 図形のアニメーション制御
  shapesRotationControl(start, end) {
    var ratio = THREE.MathUtils.smootherstep(this.progRatio, start, end);
    if (ratio <= 0.0) return;
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
          ratioSy = THREE.MathUtils.mapLinear(ratio, 0.0, 0.1 + num / adjust1, 1.0, 0.3);
        } else if (ratio < 0.4 + num / adjust2) {
          ratioSx = 0.3;
          ratioSy = 0.3;
        } else {
          ratioSx = THREE.MathUtils.mapLinear(ratio, 0.4 + num / adjust2, 1.0, 0.3, 1.0);
          ratioSy = THREE.MathUtils.mapLinear(ratio, 0.4 + num / adjust2, 1.0, 0.3, 1.0);
        }
        shape.scale.set(ratioSx, ratioSy)
        this.shapes.rotation.z = - 720 * ratio * (Math.PI / 180);
      }
    }
  }

  render() {

    // ファウンダーの表示アニメーション制御
    this.foundersDisplayControl(0.0, 0.05, 0.0, 0.6, 0.95, 1.0);

    // グリッドの表示アニメーション制御
    this.grid.displayControl(this.gridExist, this.progRatio, 0.0, 0.05, 0.35, 0.45);

    // ガイドラインの表示アニメーション制御
    this.guidelinesDisplayControl(0.05, 0.3, 0.3, 0.4, this.divCount, 0.05, 0.02);

    // アウトラインの表示アニメーション制御
    this.outlinesDisplayControl(0.3, 0.4, 0.45, 0.5, this.divCount);

    // 図形の表示アニメーション制御
    this.shapesDisplayControl(0.45, 0.6, 0.95, 1.0);

    // 図形を回転
    this.shapesRotationControl(0.6, 0.8);

    // descの表示アニメーションを制御
    this.descDisplayControl(0.7, 0.8, 0.95, 1.0);

    super.render();
  }
}
