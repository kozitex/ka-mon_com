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
        const sArc  = this.outlineCircleMeshGen(sArcGeo1, 260, g, copyAngle);
        const lArc  = this.outlineCircleMeshGen(lArcGeo1, 935, g, copyAngle);
        const lLine = this.outlineLineMeshGen(lLineGeo1, lLineParam1.a, g, copyAngle);
        const rLine = this.outlineLineMeshGen(rLineGeo1, rLineParam1.a, g, copyAngle);
        this.outlines.add(sArc, lArc, lLine, rLine);
      }
      const lEdgeF = this.outlineEdgeMeshGen(lEdgeGeoArr1[0], copyAngle);
      const lEdgeT = this.outlineEdgeMeshGen(lEdgeGeoArr1[1], copyAngle);
      const rEdgeF = this.outlineEdgeMeshGen(rEdgeGeoArr1[0], copyAngle);
      const rEdgeT = this.outlineEdgeMeshGen(rEdgeGeoArr1[1], copyAngle);
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
        const iArc  = this.outlineCircleMeshGen(iArcGeo2,  970, g, copyAngle);
        const oArc  = this.outlineCircleMeshGen(oArcGeo2, 1265, g, copyAngle);
        const lLine = this.outlineLineMeshGen(lLineGeo2, lLineParam2.a, g, copyAngle);
        const rLine = this.outlineLineMeshGen(rLineGeo2, rLineParam2.a, g, copyAngle);
        this.outlines.add(iArc, oArc, lLine, rLine);
      }
      const lEdgeF = this.outlineEdgeMeshGen(lEdgeGeoArr2[0], copyAngle);
      const lEdgeT = this.outlineEdgeMeshGen(lEdgeGeoArr2[1], copyAngle);
      const rEdgeF = this.outlineEdgeMeshGen(rEdgeGeoArr2[0], copyAngle);
      const rEdgeT = this.outlineEdgeMeshGen(rEdgeGeoArr2[1], copyAngle);
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
        const iArc  = this.outlineCircleMeshGen(iArcGeo3,  970, g, copyAngle);
        const oArc  = this.outlineCircleMeshGen(oArcGeo3, 1600, g, copyAngle);
        const lArc  = this.outlineCircleMeshGen(lArcGeo3, 1300, g, copyAngle);
        const rArc  = this.outlineCircleMeshGen(rArcGeo3, 1300, g, copyAngle);
        const ilLine = this.outlineLineMeshGen(ilLineGeo3, ilLineParam3.a, g, copyAngle);
        const irLine = this.outlineLineMeshGen(irLineGeo3, irLineParam3.a, g, copyAngle);
        const olLine = this.outlineLineMeshGen(olLineGeo3, olLineParam3.a, g, copyAngle);
        const orLine = this.outlineLineMeshGen(orLineGeo3, orLineParam3.a, g, copyAngle);
        this.outlines.add(iArc, oArc, lArc, rArc, ilLine, irLine, olLine, orLine);
      }
      const ilEdgeF = this.outlineEdgeMeshGen(ilEdgeGeoArr3[0], copyAngle);
      const ilEdgeT = this.outlineEdgeMeshGen(ilEdgeGeoArr3[1], copyAngle);
      const irEdgeF = this.outlineEdgeMeshGen(irEdgeGeoArr3[0], copyAngle);
      const irEdgeT = this.outlineEdgeMeshGen(irEdgeGeoArr3[1], copyAngle);
      const olEdgeF = this.outlineEdgeMeshGen(olEdgeGeoArr3[0], copyAngle);
      const olEdgeT = this.outlineEdgeMeshGen(olEdgeGeoArr3[1], copyAngle);
      const orEdgeF = this.outlineEdgeMeshGen(orEdgeGeoArr3[0], copyAngle);
      const orEdgeT = this.outlineEdgeMeshGen(orEdgeGeoArr3[1], copyAngle);
      this.outlineEdges.add(ilEdgeF, ilEdgeT, irEdgeF, irEdgeT, olEdgeF, olEdgeT, orEdgeF, orEdgeT);

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
