'use strict';

import * as THREE from 'three';
import Kamon from '../kamon.js';

export default class GenjiGuruma extends Kamon {

  constructor() {

    super();

    this.pathW = 35;
    this.verNum = 8;

    // infoのテキスト
    this.jpNameText = '源氏車';
    this.jpDescText = '車紋（くるまもん）の一種で、平安時代の貴族の乗り物であった牛車の車輪の形をモチーフにした家紋です。牛車は別名で源氏車とも呼ばれていました。また、車紋は佐藤姓の家紋に用いられたことでも知られています。佐藤氏の祖先が伊勢神宮の神事に携わっていた際、使用していた牛車が豪奢で有名だったことが由来で家紋に用いることになったと言われています。';
    this.enNameText = 'Genji-Guruma';
    this.enDescText = 'It is a type of Kurumamon (car crest), and is a family crest with a motif of the wheels of an ox cart, which was a vehicle used by aristocrats during the Heian period. The ox-cart was also called the Genji-guruma. The car crest is also known to have been used as the family crest of the Sato family name. It is said that the Sato clan&#39;s ancestors used it as their family crest because the bullock carts they used were famous for their luxury when they were involved in the rituals at Ise Grand Shrine.';

    // ガイドラインの表示アニメーションパラメータ
    this.guidelineParams = {
      inStart : 0.05,
      inEnd   : 0.3,
      outStart: 0.3,
      outEnd  : 0.4,
      gDelay  : 0.05,
      lDelay  : 0.02,
    }

    // アウトラインの表示アニメーションパラメータ
    this.outlineParams = {
      inStart : 0.3,
      inEnd   : 0.4,
      outStart: 0.45,
      outEnd  : 0.5,
    }

    // 図形の表示アニメーションパラメータ
    this.shapeParams = {
      inStart : 0.45,
      inEnd   : 0.6,
      outStart: 0.95,
      outEnd  : 1.0,
    }

    // 図形の回転アニメーションパラメータ
    this.shapeRotParams = {
      start : 0.6,
      end   : 0.8,
    }

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
    this.group.add(this.guidelines);
  }

  // アウトラインを作成
  generateOutline = () => {

    // 中央の円
    const centerCircleGeo = this.outlineCircleGeoGen(0, 0, 225, 90, 450, this.divCount);
    const w = 6;
    for (var g = - w;g <= w;g ++) {
      const centerCircle = this.outlineCircleMeshGen(centerCircleGeo, 0, 0, 225, g, 0, 0, 0);
      this.outlines.add(centerCircle);
    }

    // スポーク

    const sArcGeo1 = this.outlineCircleGeoGen(0, 0, 260, 101.25, 78.75, this.divCount);
    const lArcGeo1 = this.outlineCircleGeoGen(0, 0, 935, 78.75, 101.25, this.divCount);

    const sArcF1 = this.circle(0, 0, 260, 101.25);
    const sArcT1 = this.circle(0, 0, 260,  78.75);
    const lArcF1 = this.circle(0, 0, 935, 101.25);
    const lArcT1 = this.circle(0, 0, 935,  78.75);

    const lLineParam1 = this.from2Points(lArcF1.x, lArcF1.y, sArcF1.x, sArcF1.y);
    const rLineParam1 = this.from2Points(sArcT1.x, sArcT1.y, lArcT1.x, lArcT1.y);

    const lLineGeo1 = this.outlineLineGeoGen(lLineParam1.a, 1, lLineParam1.b, lArcF1.x, sArcF1.x, this.divCount);
    const rLineGeo1 = this.outlineLineGeoGen(rLineParam1.a, 1, rLineParam1.b, sArcT1.x, lArcT1.x, this.divCount);

    const lEdgeGeoArr1 = this.outlineEdgeGeoGen(lLineParam1.a, 1, lLineParam1.b, lArcF1.x, sArcF1.x);
    const rEdgeGeoArr1 = this.outlineEdgeGeoGen(rLineParam1.a, 1, rLineParam1.b, sArcT1.x, lArcT1.x);

    for (var v = 0;v <= this.verNum - 1;v ++) {

      const copyAngle = THREE.MathUtils.degToRad(- 360 / this.verNum * v);
      const w = 6;
      for (var g = - w;g <= w;g ++) {
        const sArc  = this.outlineCircleMeshGen(sArcGeo1, 0, 0, 260, g, 0, 0, copyAngle);
        const lArc  = this.outlineCircleMeshGen(lArcGeo1, 0, 0, 935, g, 0, 0, copyAngle);
        const lLine = this.outlineLineMeshGen(lLineGeo1, lLineParam1.a, lLineParam1.b, g, 0, 0, copyAngle);
        const rLine = this.outlineLineMeshGen(rLineGeo1, rLineParam1.a, rLineParam1.b, g, 0, 0, copyAngle);
        this.outlines.add(sArc, lArc, lLine, rLine);
      }
      const lEdgeF = this.outlineEdgeMeshGen(lEdgeGeoArr1[0], 0, 0, copyAngle);
      const lEdgeT = this.outlineEdgeMeshGen(lEdgeGeoArr1[1], 0, 0, copyAngle);
      const rEdgeF = this.outlineEdgeMeshGen(rEdgeGeoArr1[0], 0, 0, copyAngle);
      const rEdgeT = this.outlineEdgeMeshGen(rEdgeGeoArr1[1], 0, 0, copyAngle);
      this.outlineEdges.add(lEdgeF, lEdgeT, rEdgeF, rEdgeT);
    }

    // 内側の継ぎ目
    const iArcAngle2 = 16.875 - THREE.MathUtils.radToDeg(Math.atan(this.pathW / 2 /  970));
    const oArcAngle2 = 16.875 - THREE.MathUtils.radToDeg(Math.atan(this.pathW / 2 / 1265));

    const iArcGeo2 = this.outlineCircleGeoGen(0, 0,  970, 90 + iArcAngle2, 90 - iArcAngle2, this.divCount);
    const oArcGeo2 = this.outlineCircleGeoGen(0, 0, 1265, 90 - oArcAngle2, 90 + oArcAngle2, this.divCount);

    const iArcF2 = this.circle(0, 0,  970, 90 + iArcAngle2);
    const iArcT2 = this.circle(0, 0,  970, 90 - iArcAngle2);
    const oArcF2 = this.circle(0, 0, 1265, 90 + oArcAngle2);
    const oArcT2 = this.circle(0, 0, 1265, 90 - oArcAngle2);

    const lLineParam2 = this.from2Points(oArcF2.x, oArcF2.y, iArcF2.x, iArcF2.y);
    const rLineParam2 = this.from2Points(iArcT2.x, iArcT2.y, oArcT2.x, oArcT2.y);

    const lLineGeo2 = this.outlineLineGeoGen(lLineParam2.a, 1, lLineParam2.b, oArcF2.x, iArcF2.x, this.divCount);
    const rLineGeo2 = this.outlineLineGeoGen(rLineParam2.a, 1, rLineParam2.b, iArcT2.x, oArcT2.x, this.divCount);

    const lEdgeGeoArr2 = this.outlineEdgeGeoGen(lLineParam2.a, 1, lLineParam2.b, oArcF2.x, iArcF2.x);
    const rEdgeGeoArr2 = this.outlineEdgeGeoGen(rLineParam2.a, 1, rLineParam2.b, iArcT2.x, oArcT2.x);

    for (var v = 0;v <= this.verNum - 1;v ++) {

      const copyAngle = THREE.MathUtils.degToRad(- 360 / this.verNum * v);
      const w = 6;
      for (var g = - w;g <= w;g ++) {
        const iArc  = this.outlineCircleMeshGen(iArcGeo2, 0, 0,  970, g, 0, 0, copyAngle);
        const oArc  = this.outlineCircleMeshGen(oArcGeo2, 0, 0, 1265, g, 0, 0, copyAngle);
        const lLine = this.outlineLineMeshGen(lLineGeo2, lLineParam2.a, lLineParam2.b, g, 0, 0, copyAngle);
        const rLine = this.outlineLineMeshGen(rLineGeo2, rLineParam2.a, rLineParam2.b, g, 0, 0, copyAngle);
        this.outlines.add(iArc, oArc, lLine, rLine);
      }
      const lEdgeF = this.outlineEdgeMeshGen(lEdgeGeoArr2[0], 0, 0, copyAngle);
      const lEdgeT = this.outlineEdgeMeshGen(lEdgeGeoArr2[1], 0, 0, copyAngle);
      const rEdgeF = this.outlineEdgeMeshGen(rEdgeGeoArr2[0], 0, 0, copyAngle);
      const rEdgeT = this.outlineEdgeMeshGen(rEdgeGeoArr2[1], 0, 0, copyAngle);
      this.outlineEdges.add(lEdgeF, lEdgeT, rEdgeF, rEdgeT);

    }

    // 外側の継ぎ目の円弧
    const iArcAngle3 = 16.875 + THREE.MathUtils.radToDeg(Math.atan(this.pathW / 2 / 970));
    const oArcAngle3 = THREE.MathUtils.radToDeg(Math.atan(this.pathW / 2 / 1600));
    const lArcAngleF3 = THREE.MathUtils.radToDeg(Math.atan(this.pathW / 2 / 1300));
    const lArcAngleT3 = 16.875 + THREE.MathUtils.radToDeg(Math.atan(this.pathW / 2 / 1300));

    const iArcGeo3 = this.outlineCircleGeoGen(0, 0,  970, 90 - iArcAngle3, 90 + iArcAngle3 - 45, this.divCount);
    const oArcGeo3 = this.outlineCircleGeoGen(0, 0, 1600, 90 + oArcAngle3 - 45, 90 - oArcAngle3, this.divCount);
    const lArcGeo3 = this.outlineCircleGeoGen(0, 0, 1300, 90 - lArcAngleF3, 90 - lArcAngleT3, this.divCount);
    const rArcGeo3 = this.outlineCircleGeoGen(0, 0, 1300, 90 + lArcAngleT3 - 45, 90 + lArcAngleF3 - 45, this.divCount);

    const iArcF3 = this.circle(0, 0,  970, 90 - iArcAngle3);
    const iArcT3 = this.circle(0, 0,  970, 90 + iArcAngle3  - 45);
    const rArcF3 = this.circle(0, 0, 1300, 90 + lArcAngleT3 - 45);
    const rArcT3 = this.circle(0, 0, 1300, 90 + lArcAngleF3 - 45);
    const oArcF3 = this.circle(0, 0, 1600, 90 - oArcAngle3);
    const oArcT3 = this.circle(0, 0, 1600, 90 + oArcAngle3  - 45);
    const lArcF3 = this.circle(0, 0, 1300, 90 - lArcAngleF3);
    const lArcT3 = this.circle(0, 0, 1300, 90 - lArcAngleT3);

    const ilLineParam3 = this.from2Points(lArcT3.x, lArcT3.y, iArcF3.x, iArcF3.y);
    const irLineParam3 = this.from2Points(iArcT3.x, iArcT3.y, rArcF3.x, rArcF3.y);
    const olLineParam3 = this.from2Points(oArcF3.x, oArcF3.y, lArcF3.x, lArcF3.y);
    const orLineParam3 = this.from2Points(rArcT3.x, rArcT3.y, oArcT3.x, oArcT3.y);

    const ilLineGeo3 = this.outlineLineGeoGen(ilLineParam3.a, 1, ilLineParam3.b, lArcT3.x, iArcF3.x, this.divCount);
    const irLineGeo3 = this.outlineLineGeoGen(irLineParam3.a, 1, irLineParam3.b, iArcT3.x, rArcF3.x, this.divCount);
    const olLineGeo3 = this.outlineLineGeoGen(olLineParam3.a, 1, olLineParam3.b, oArcF3.x, lArcF3.x, this.divCount);
    const orLineGeo3 = this.outlineLineGeoGen(orLineParam3.a, 1, orLineParam3.b, rArcT3.x, oArcT3.x, this.divCount);

    const ilEdgeGeoArr3 = this.outlineEdgeGeoGen(ilLineParam3.a, 1, ilLineParam3.b, lArcT3.x, iArcF3.x);
    const irEdgeGeoArr3 = this.outlineEdgeGeoGen(irLineParam3.a, 1, irLineParam3.b, iArcT3.x, rArcF3.x);
    const olEdgeGeoArr3 = this.outlineEdgeGeoGen(olLineParam3.a, 1, olLineParam3.b, oArcF3.x, lArcF3.x);
    const orEdgeGeoArr3 = this.outlineEdgeGeoGen(orLineParam3.a, 1, orLineParam3.b, rArcT3.x, oArcT3.x);

    for (var v = 0;v <= this.verNum - 1;v ++) {

      const copyAngle = THREE.MathUtils.degToRad(- 360 / this.verNum * v);
      const w = 6;
      for (var g = - w;g <= w;g ++) {
        const iArc  = this.outlineCircleMeshGen(iArcGeo3, 0, 0,  970, g, 0, 0, copyAngle);
        const oArc  = this.outlineCircleMeshGen(oArcGeo3, 0, 0, 1600, g, 0, 0, copyAngle);
        const lArc  = this.outlineCircleMeshGen(lArcGeo3, 0, 0, 1300, g, 0, 0, copyAngle);
        const rArc  = this.outlineCircleMeshGen(rArcGeo3, 0, 0, 1300, g, 0, 0, copyAngle);
        const ilLine = this.outlineLineMeshGen(ilLineGeo3, ilLineParam3.a, ilLineParam3.b, g, 0, 0, copyAngle);
        const irLine = this.outlineLineMeshGen(irLineGeo3, irLineParam3.a, irLineParam3.b, g, 0, 0, copyAngle);
        const olLine = this.outlineLineMeshGen(olLineGeo3, olLineParam3.a, olLineParam3.b, g, 0, 0, copyAngle);
        const orLine = this.outlineLineMeshGen(orLineGeo3, orLineParam3.a, orLineParam3.b, g, 0, 0, copyAngle);
        this.outlines.add(iArc, oArc, lArc, rArc, ilLine, irLine, olLine, orLine);
      }
      const ilEdgeF = this.outlineEdgeMeshGen(ilEdgeGeoArr3[0], 0, 0, copyAngle);
      const ilEdgeT = this.outlineEdgeMeshGen(ilEdgeGeoArr3[1], 0, 0, copyAngle);
      const irEdgeF = this.outlineEdgeMeshGen(irEdgeGeoArr3[0], 0, 0, copyAngle);
      const irEdgeT = this.outlineEdgeMeshGen(irEdgeGeoArr3[1], 0, 0, copyAngle);
      const olEdgeF = this.outlineEdgeMeshGen(olEdgeGeoArr3[0], 0, 0, copyAngle);
      const olEdgeT = this.outlineEdgeMeshGen(olEdgeGeoArr3[1], 0, 0, copyAngle);
      const orEdgeF = this.outlineEdgeMeshGen(orEdgeGeoArr3[0], 0, 0, copyAngle);
      const orEdgeT = this.outlineEdgeMeshGen(orEdgeGeoArr3[1], 0, 0, copyAngle);
      this.outlineEdges.add(ilEdgeF, ilEdgeT, irEdgeF, irEdgeT, olEdgeF, olEdgeT, orEdgeF, orEdgeT);

    }
    this.group.add(this.outlines, this.outlineEdges);
  }

  // 塗りつぶし図形を生成
  generateShape = () => {

    // 中央の円
    const points0 = this.curvePointGen(0, 0, 225, 0, 360, false);
    const circleGeo = this.shapeGeoGen(points0);
    const circleMesh = new THREE.Mesh(circleGeo, this.shapeMat);
    this.shapes.add(circleMesh);

    // スポーク
    const sArc1 = this.curvePointGen(0, 0, 260, 101.25, 78.75, true);
    const lArc1 = this.curvePointGen(0, 0, 935, 78.75, 101.25, false);
  
    const sArcF1 = this.circle(0, 0, 260, 101.25);
    const sArcT1 = this.circle(0, 0, 260,  78.75);
    const lArcF1 = this.circle(0, 0, 935, 101.25);
    const lArcT1 = this.circle(0, 0, 935,  78.75);

    const lLine1 = [lArcF1, sArcF1];
    const rLine1 = [sArcT1, lArcT1];

    const points1 = sArc1.concat(rLine1, lArc1, lLine1);
    const spokeGeo = this.shapeGeoGen(points1);

    for (var v = 0;v <= this.verNum - 1;v ++) {
      const copyAngle = THREE.MathUtils.degToRad(- 360 / this.verNum * v);
      const spokeMesh = new THREE.Mesh(spokeGeo, this.shapeMat);
      spokeMesh.rotation.z = copyAngle;
      this.shapes.add(spokeMesh);
    }

    // 内側の継ぎ目
    const iArcAngle2 = 16.875 - THREE.MathUtils.radToDeg(Math.atan(this.pathW / 2 /  970));
    const oArcAngle2 = 16.875 - THREE.MathUtils.radToDeg(Math.atan(this.pathW / 2 / 1265));

    const iArc2 = this.curvePointGen(0, 0,  970, 90 + iArcAngle2, 90 - iArcAngle2, true);
    const oArc2 = this.curvePointGen(0, 0, 1265, 90 - oArcAngle2, 90 + oArcAngle2, false);

    const iArcF2 = this.circle(0, 0,  970, 90 + iArcAngle2);
    const iArcT2 = this.circle(0, 0,  970, 90 - iArcAngle2);
    const oArcF2 = this.circle(0, 0, 1265, 90 + oArcAngle2);
    const oArcT2 = this.circle(0, 0, 1265, 90 - oArcAngle2);

    const lLine2 = [oArcF2, iArcF2];
    const rLine2 = [iArcT2, oArcT2];

    const points2 = iArc2.concat(rLine2, oArc2, lLine2);
    const inSeamGeo = this.shapeGeoGen(points2);

    for (var v = 0;v <= this.verNum - 1;v ++) {
      const copyAngle = THREE.MathUtils.degToRad(- 360 / this.verNum * v);
      const inSeamMesh = new THREE.Mesh(inSeamGeo, this.shapeMat);
      inSeamMesh.rotation.z = copyAngle;
      this.shapes.add(inSeamMesh);
    }

    // 外側の継ぎ目の円弧
    const iArcAngle3  = 16.875 + THREE.MathUtils.radToDeg(Math.atan(this.pathW / 2 /  970));
    const oArcAngle3  = THREE.MathUtils.radToDeg(Math.atan(this.pathW / 2 / 1600));
    const lArcAngleF3 = THREE.MathUtils.radToDeg(Math.atan(this.pathW / 2 / 1300));
    const lArcAngleT3 = 16.875 + THREE.MathUtils.radToDeg(Math.atan(this.pathW / 2 / 1300));

    const iArc3 = this.curvePointGen(0, 0,  970, 90 - iArcAngle3, 90 + iArcAngle3 - 45, true);
    const oArc3 = this.curvePointGen(0, 0, 1600, 90 + oArcAngle3 - 45, 90 - oArcAngle3, false);
    const lArc3 = this.curvePointGen(0, 0, 1300, 90 - lArcAngleF3, 90 - lArcAngleT3, true);
    const rArc3 = this.curvePointGen(0, 0, 1300, 90 + lArcAngleT3 - 45, 90 + lArcAngleF3 - 45, true);

    const iArcF3 = this.circle(0, 0,  970, 90 - iArcAngle3);
    const iArcT3 = this.circle(0, 0,  970, 90 + iArcAngle3 - 45);
    const rArcF3 = this.circle(0, 0, 1300, 90 + lArcAngleT3 - 45);
    const rArcT3 = this.circle(0, 0, 1300, 90 + lArcAngleF3 - 45);
    const oArcF3 = this.circle(0, 0, 1600, 90 - oArcAngle3);
    const oArcT3 = this.circle(0, 0, 1600, 90 + oArcAngle3 - 45);
    const lArcF3 = this.circle(0, 0, 1300, 90 - lArcAngleF3);
    const lArcT3 = this.circle(0, 0, 1300, 90 - lArcAngleT3);

    const ilLine3  = [lArcT3, iArcF3];
    const irLine3  = [iArcT3, rArcF3];
    const olLine3  = [oArcF3, lArcF3];
    const orLine3  = [rArcT3, oArcT3];

    const points3 = iArc3.concat(irLine3, rArc3, orLine3, oArc3, olLine3, lArc3, ilLine3);
    const outSeamGeo = this.shapeGeoGen(points3);

    for (var v = 0;v <= this.verNum - 1;v ++) {
      const copyAngle = THREE.MathUtils.degToRad(- 360 / this.verNum * v);
      const outSeamMesh = new THREE.Mesh(outSeamGeo, this.shapeMat);
      outSeamMesh.rotation.z = copyAngle;
      this.shapes.add(outSeamMesh);
    }

    this.group.add(this.shapes);
  }

  // 図形のアニメーション制御
  shapeRotationControl(progRatio) {
    const p = this.shapeRotParams;
    var ratio = THREE.MathUtils.smootherstep(progRatio, p.start, p.end);
    if (ratio <= 0.0) return;
    for (var i = 0;i <= this.shapes.children.length - 1;i ++) {
      const shape = this.shapes.children[i];
      const j = i - 1;
      const num = Math.trunc(j / 2);
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
