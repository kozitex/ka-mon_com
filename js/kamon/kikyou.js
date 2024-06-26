'use strict';

import * as THREE from 'three';
import Kamon from '../kamon.js';

export default class Kikyou extends Kamon {

  constructor() {

    super();

    this.pathW = 27;
    this.verNum = 5;
    this.vertices = [];
    this.sides = [];

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
    this.jpName.innerHTML = '桔梗';
    this.jpDesc.innerHTML = '桔梗の花を図案化した家紋です。桔梗の漢字のつくりから「更に吉（さらによし）」という語呂が縁起が良いとされ、多くの家の家紋として使用されていました。この内、陰桔梗は戦国武将、明智光秀の家紋としても知られていますが、本能寺の変をきっかけに裏切り者の家紋として使用を憚られた時期があったと言われています。';
    this.enName.innerHTML = 'Kikyou<br>(Bellflower)';
    this.enDesc.innerHTML = 'This is a family crest with a design of a bellflower. Due to the kanji character for bellflower, the word "Moreyoshi" is said to bring good luck, and it was used as the family emblem of many families. Of these, Kagekikyo is also known as the family emblem of Sengoku warlord Akechi Mitsuhide, but it is said that there was a time when its use was discouraged as a traitor&#39;s family emblem in the wake of the Honnoji Incident.';
  }

  // ガイドラインを作成
  generateGuidelines = () => {

    // ４つの中心円
    const circles = new THREE.Group();
    const rs = [191, 245, 520, 1600];
    rs.forEach((r) => {
      const points = this.circlePointGen(0, 0, r, 90, 450, this.divCount);
      const circle = this.guidelineGen(points);
      circles.add(circle);
    });
    this.guidelines.add(circles);

    // 五角形の辺
    for (var i = 0;i <= this.verNum - 1;i ++) {
      const pentagon = new THREE.Group();
      const r1 = 90 - ((360 / this.verNum) * i);
      const r2 = 90 - ((360 / this.verNum) * (i + 1));
      const v1 = this.circle(0, 0, 1600, r1);
      const v2 = this.circle(0, 0, 1600, r2);
      const coef = this.from2Points(v1.x, v1.y, v2.x, v2.y);
      this.sides.push(coef);
      const points = this.linePointGen(coef.a, 1, coef.b, v1.x, v2.x, this.divCount);
      const line = this.guidelineGen(points);
      pentagon.add(line);
      this.vertices.push(v1);
      this.guidelines.add(pentagon);
    }

    // 5回分繰り返す
    for (var v = 0;v <= this.verNum - 1;v ++) {
      const pieces = new THREE.Group();

      for (var i = 0;i <= 1;i ++) {

        // 対角線
        const c = i == 0 ? - this.pathW : this.pathW;
        const linePoints = this.linePointGen(1, 0, c, - 1600, 1600, this.divCount);
        const line = this.guidelineGen(linePoints);
        pieces.add(line);

        // 大きな円
        const r = 361;
        const side = this.sides[2];
        const origin = this.straight(side.a, 1, side.b, c, undefined);
        const base = r / Math.tan(45 * Math.PI / 180);
        const center = new THREE.Vector3(origin.x + (i == 0 ? - r : r), origin.y + base);
        const circlePoints = this.circlePointGen(center.x, center.y, r, 90, 450, this.divCount);
        const circleL = this.guidelineGen(circlePoints);
        pieces.add(circleL);
      }

      // 小さな円
      const points = this.circlePointGen(0, 520 - this.pathW, this.pathW, 90, 450, this.divCount);
      const circleS = this.guidelineGen(points);
      pieces.add(circleS);

      pieces.rotation.z = (- (360 / this.verNum) * v) * Math.PI / 180;
      this.guidelines.add(pieces);
    }

    this.scene.add(this.guidelines);
  }

  // アウトラインを作成
  generateOutlines = () => {

    const circleGeo0 = this.outlineCircleGeoGen(0, 0, 191, 90, 450, this.divCount);
    const w = 6;
    for (var g = - w;g <= w;g ++) {
      const mesh = this.outlineCircleMeshGen(circleGeo0, 0, 0, 191, g, 0, 0, 0);
      this.outlines.add(mesh);
    }

    // 小さい円の弧
    const circleGeo1 = this.outlineCircleGeoGen(0, 520 - this.pathW, this.pathW, 90, 180, this.divCount);
    for (var i = 0;i <= this.verNum - 1;i ++) {
      for (var j = 0;j <= 1;j ++) {
        const w = 6;
        for (var g = - w;g <= w;g ++) {
          const rotY = THREE.MathUtils.degToRad(- 180 * j);
          const rotZ = THREE.MathUtils.degToRad(- (360 / this.verNum) * i);
          const mesh  = this.outlineCircleMeshGen(circleGeo1, 0, 520 - this.pathW, this.pathW, g, 0, rotY, rotZ);
          this.outlines.add(mesh);
        }
      }
    }

    // 対角線
    const theta2 = Math.asin(this.pathW / 245);
    const lineGeo1 = this.outlineLineGeoGen(1, 0, - this.pathW, 520 - this.pathW, 245 * Math.cos(theta2), this.divCount);
    const edgeGeoArr1 = this.outlineEdgeGeoGen(1, 0, - this.pathW, 520 - this.pathW, 245 * Math.cos(theta2));
    for (var i = 0;i <= this.verNum - 1;i ++) {
      for (var j = 0;j <= 1;j ++) {
        const w = 6;
        const rotY = THREE.MathUtils.degToRad(- 180 * j);
        const rotZ = THREE.MathUtils.degToRad(- (360 / this.verNum) * i);
        for (var g = - w;g <= w;g ++) {
          const mesh = this.outlineLineMeshGen(lineGeo1, 1, 0, g, 0, rotY, rotZ);
          this.outlines.add(mesh);
        }
        const edge0 = this.outlineEdgeMeshGen(edgeGeoArr1[0], 0, rotY, rotZ);
        const edge1 = this.outlineEdgeMeshGen(edgeGeoArr1[1], 0, rotY, rotZ);
        this.outlineEdges.add(edge0, edge1);
      }
    }

    // 中心円の弧
    const circleGeo2 = this.outlineCircleGeoGen(0, 0, 245, 90 + THREE.MathUtils.radToDeg(theta2), 90 + 36 - THREE.MathUtils.radToDeg(theta2), this.divCount);
    for (var i = 0;i <= this.verNum - 1;i ++) {
      for (var j = 0;j <= 1;j ++) {
        const w = 6;
        for (var g = - w;g <= w;g ++) {
          const rotY = THREE.MathUtils.degToRad(- 180 * j);
          const rotZ = THREE.MathUtils.degToRad(- (360 / this.verNum) * i);
          const mesh  = this.outlineCircleMeshGen(circleGeo2, 0, 0, 245, g, 0, rotY, rotZ);
          this.outlines.add(mesh);
        }
      }
    }

    // 対角線
    const r = 361;
    const line2Start = this.circle(0, 0, 245, 90 + 36 - THREE.MathUtils.radToDeg(theta2));
    const theta3 = Math.asin(this.pathW / 1600);
    const point1 = this.circle(0, 0, 1600, 126 - THREE.MathUtils.radToDeg(theta3));
    const point2 = new THREE.Vector3(this.pathW * Math.cos(THREE.MathUtils.degToRad(45)), this.pathW * Math.sin(THREE.MathUtils.degToRad(45)), 0);
    const straight1 = this.from2Points(point1.x, point1.y, point2.x, point2.y);
    const straight = this.from2Points(this.vertices[4].x, this.vertices[4].y, this.vertices[0].x, this.vertices[0].y);
    const line2Basis = this.getIntersect(straight1.a, straight1.b, straight.a, straight.b);
    const line2End = new THREE.Vector3(line2Basis.x + r * Math.cos(THREE.MathUtils.degToRad(90 - 36)), line2Basis.y - r * Math.sin(THREE.MathUtils.degToRad(90 - 36)), 0);
    const straight3 =this.from2Points(line2Start.x, line2Start.y, line2End.x, line2End.y);

    const lineGeo2 = this.outlineLineGeoGen(straight3.a, 1, straight3.b, line2Start.x, line2End.x, this.divCount);
    const edgeGeoArr2 = this.outlineEdgeGeoGen(straight3.a, 1, straight3.b, line2Start.x, line2End.x);
    for (var i = 0;i <= this.verNum - 1;i ++) {
      for (var j = 0;j <= 1;j ++) {
        const w = 6;
        const rotY = THREE.MathUtils.degToRad(- 180 * j);
        const rotZ = THREE.MathUtils.degToRad(- (360 / this.verNum) * i);
        for (var g = - w;g <= w;g ++) {
          const mesh = this.outlineLineMeshGen(lineGeo2, straight3.a, 1, g, 0, rotY, rotZ);
          this.outlines.add(mesh);
        }
        const edge0 = this.outlineEdgeMeshGen(edgeGeoArr2[0], 0, rotY, rotZ);
        const edge1 = this.outlineEdgeMeshGen(edgeGeoArr2[1], 0, rotY, rotZ);
        this.outlineEdges.add(edge0, edge1);
      }
    }

    // 大きい円の弧
    const center = new THREE.Vector3(line2End.x + r * Math.cos(THREE.MathUtils.degToRad(36)), line2End.y + r * Math.sin(THREE.MathUtils.degToRad(36)), 0);
    const circleGeo3 = this.outlineCircleGeoGen(center.x, center.y, r, -144, -234, this.divCount);
    for (var i = 0;i <= this.verNum - 1;i ++) {
      for (var j = 0;j <= 1;j ++) {
        const w = 6;
        for (var g = - w;g <= w;g ++) {
          const rotY = THREE.MathUtils.degToRad(- 180 * j);
          const rotZ = THREE.MathUtils.degToRad(- (360 / this.verNum) * i);
          const mesh  = this.outlineCircleMeshGen(circleGeo3, center.x, center.y, r, g, 0, rotY, rotZ);
          this.outlines.add(mesh);
        }
      }
    }

    // 頂点までの直線
    const point3 = new THREE.Vector3(center.x - r * Math.cos(THREE.MathUtils.degToRad(90 - 36)), center.y + r * Math.sin(THREE.MathUtils.degToRad(90 - 36)), 0);
    const lineGeo3 = this.outlineLineGeoGen(straight.a, 1, straight.b, point3.x, this.vertices[0].x, this.divCount);
    const edgeGeoArr3 = this.outlineEdgeGeoGen(straight.a, 1, straight.b, point3.x, this.vertices[0].x);
    for (var i = 0;i <= this.verNum - 1;i ++) {
      for (var j = 0;j <= 1;j ++) {
        const w = 6;
        const rotY = THREE.MathUtils.degToRad(- 180 * j);
        const rotZ = THREE.MathUtils.degToRad(- (360 / this.verNum) * i);
        for (var g = - w;g <= w;g ++) {
          const mesh = this.outlineLineMeshGen(lineGeo3, straight.a, 1, g, 0, rotY, rotZ);
          this.outlines.add(mesh);
        }
        const edge0 = this.outlineEdgeMeshGen(edgeGeoArr3[0], 0, rotY, rotZ);
        const edge1 = this.outlineEdgeMeshGen(edgeGeoArr3[1], 0, rotY, rotZ);
        this.outlineEdges.add(edge0, edge1);
      }
    }

    this.scene.add(this.outlines, this.outlineEdges);
  }

  // 塗りつぶし図形を生成
  generateShapes = () => {

    const points0 = this.curvePointGen(0, 0, 191, 0, 360, false);
    const geometry0 = this.shapeGeoGen(points0);
    const mesh0 = new THREE.Mesh(geometry0, this.shapeMat);
    this.shapes.add(mesh0);

    // 小さい円の弧
    const arc1 = this.curvePointGen(0, 520 - this.pathW, this.pathW + 6, 90, 180, false);

    // 対角線
    const theta2 = Math.asin(this.pathW / 245);
    const line1 = [
      new THREE.Vector3(- this.pathW - 6, 520 - this.pathW, 0),
      new THREE.Vector3(- this.pathW - 6, 245 * Math.cos(theta2), 0)
    ];

    // 中心円の弧
    const arc2 = this.curvePointGen(0, 0, 245 + 6, 90 + THREE.MathUtils.radToDeg(theta2), 90 + 34 + THREE.MathUtils.radToDeg(theta2), false);

    // 対角線
    const r = 361;
    const line2Start = this.circle(0, 0, 245, 90 + 36 - THREE.MathUtils.radToDeg(theta2));
    const theta3 = Math.asin(this.pathW / 1600);
    const point1 = this.circle(0, 0, 1600, 126 - THREE.MathUtils.radToDeg(theta3));
    const point2 = new THREE.Vector3(
      this.pathW * Math.cos(THREE.MathUtils.degToRad(45)),
      this.pathW * Math.sin(THREE.MathUtils.degToRad(45)), 0
    );
    const straight1 = this.from2Points(point1.x, point1.y, point2.x, point2.y);
    const straight = this.from2Points(this.vertices[4].x, this.vertices[4].y, this.vertices[0].x, this.vertices[0].y);
    const line2Basis = this.getIntersect(straight1.a, straight1.b, straight.a, straight.b);
    const line2End = new THREE.Vector3(
      line2Basis.x + r * Math.cos(THREE.MathUtils.degToRad(90 - 36)),
      line2Basis.y - r * Math.sin(THREE.MathUtils.degToRad(90 - 36)), 0
    );
    const gX1 = 6 * Math.cos(THREE.MathUtils.degToRad(90 - theta3));
    const gY1 = 6 * Math.sin(THREE.MathUtils.degToRad(90 - theta3));
    const line2 = [
      new THREE.Vector3(line2Start.x + gX1, line2Start.y + gY1, line2Start.z),
      new THREE.Vector3(line2End.x + gX1, line2End.y + gY1, line2End.z)
    ];

    // 大きい円の弧
    const center = new THREE.Vector3(
      line2End.x + r * Math.cos(THREE.MathUtils.degToRad(36)),
      line2End.y + r * Math.sin(THREE.MathUtils.degToRad(36)), 0
    );
    const arc3 = this.curvePointGen(center.x, center.y, r - 4, - 144, - 234, true);

    // 頂点までの直線
    const point3 = new THREE.Vector3(
      center.x - r * Math.cos(THREE.MathUtils.degToRad(90 - 36)),
      center.y + r * Math.sin(THREE.MathUtils.degToRad(90 - 36)), 0
    );
    const theta4 = Math.atan(straight.a);
    const gX2 = 6 * Math.cos(THREE.MathUtils.degToRad(theta4));
    const gY2 = 6 * Math.sin(THREE.MathUtils.degToRad(theta4));
    const line3 = [
      new THREE.Vector3(point3.x + gX2, point3.y - gY2, point3.z),
      new THREE.Vector3(this.vertices[0].x, this.vertices[0].y - gY2, this.vertices[0].z)
    ];

    const points = arc1.concat(line1, arc2, line2, arc3, line3);
    const geometry = this.shapeGeoGen(points);

    for (var i = 0;i <= this.verNum - 1;i ++) {

      const group = new THREE.Group();

      for (var j = 0;j <= 1;j ++) {

        const mesh = new THREE.Mesh(geometry, this.shapeMat);
        mesh.rotation.y = THREE.MathUtils.degToRad(180 * j);
        mesh.visible = false;
        group.add(mesh);

      }

      group.rotation.z = THREE.MathUtils.degToRad(- (360 / this.verNum) * i);
      this.shapes.add(group);
    }

    this.scene.add(this.shapes);
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

    // ファウンダーの表示アニメーション制御
    this.foundersDisplayControl(0.0, 0.05, 0.0, 0.6, 0.95, 1.0);

    // グリッドの表示アニメーション制御
    this.grid.displayControl(this.gridExist, this.progRatio, 0.0, 0.05, 0.3, 0.45);

    // ガイドラインの表示アニメーション制御
    this.guidelinesDisplayControl(0.05, 0.3, 0.35, 0.45, this.divCount, 0.03, 0.06);

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
