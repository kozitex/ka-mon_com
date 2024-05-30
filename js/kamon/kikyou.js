'use strict';

import * as THREE from 'three';
import Kamon from '../kamon.js';

export default class Kikyou extends Kamon {

  constructor() {

    super();

    this.rollHeight = 4000;

    this.pathW = 27;
    this.verNum = 5;
    this.angleFr = 90;
    this.angleTo = 450;
    this.vertices = [];   // 五角形の頂点
    this.sides = [];      // 五角形の辺
    this.circlesS = [];   // 花びらの小さな円
    this.circlesL = [];   // 花びらの大きな円
    this.circlesD = [];   // ベースの4つの中心円
    this.diagonals = [];  // 対角線
    this.points = [];
    this.pentagonSide = [];

    // ガイドラインの作成
    this.generateGuidelines();

    // アウトラインの作成
    this.generateOutlines();

    // 塗りつぶし図形の描画
    // this.generateShapes();

    // infoの準備
    this.jpName.innerHTML = '桔梗';
    this.jpDesc.innerHTML = '桔梗の花を図案化した家紋です。桔梗の漢字のつくりから「更に吉（さらによし）」という語呂が縁起が良いとされ、多くの家の家紋として使用されていました。この内、陰桔梗は戦国武将、明智光秀の家紋としても知られていますが、本能寺の変をきっかけに裏切り者の家紋として使用を憚られた時期があったと言われています。';
    this.enName.innerHTML = 'Kikyou<br>(Bellflower)';
    this.enDesc.innerHTML = 'This is a family crest with a design of a bellflower. Due to the kanji character for bellflower, the word "Moreyoshi" is said to bring good luck, and it was used as the family emblem of many families. Of these, Kagekikyo is also known as the family emblem of Sengoku warlord Akechi Mitsuhide, but it is said that there was a time when its use was discouraged as a traitor&#39;s family emblem in the wake of the Honnoji Incident.';
  }

  // ガイドラインを作成
  generateGuidelines = () => {

    const divCount = 1000;

    // ４つの中心円
    const rs = [191, 245, 520, 1600];
    rs.forEach((r) => {
      const circles = new THREE.Group();
      const circle = this.circleGen(0, 0, r, this.angleFr, this.angleTo, divCount, this.guideColor);
      circles.add(circle);
      this.guidelines.add(circles);
    });

    // 五角形の辺
    for (var i = 0;i <= this.verNum - 1;i ++) {
      const pentagon = new THREE.Group();
      const r1 = this.angleFr - ((360 / this.verNum) * i);
      const r2 = this.angleFr - ((360 / this.verNum) * (i + 1));
      const v1 = this.circle(0, 0, 1600, r1);
      const v2 = this.circle(0, 0, 1600, r2);
      const coef = this.from2Points(v1.x, v1.y, v2.x, v2.y);
      this.pentagonSide.push(coef);
      const line = this.lineGen(coef.a, 1, coef.b, v1.x, v2.x, divCount, this.guideColor);
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
        const line = this.lineGen(1, 0, c, -1600, 1600, divCount, this.guideColor);
        pieces.add(line);

        // 大きな円
        const r = 361;
        const side = this.pentagonSide[2];
        const origin = this.straight2(side.a, 1, side.b, c, undefined);
        const base = r / Math.tan(45 * Math.PI / 180);
        const center = new THREE.Vector3(origin.x + (i == 0 ? - r : r), origin.y + base);
        const circleL = this.circleGen(center.x, center.y, r, this.angleFr, this.angleTo, divCount, this.guideColor);
        pieces.add(circleL);
      }

      // 小さな円
      const circleS = this.circleGen(0, 520 - this.pathW, this.pathW, this.angleFr, this.angleTo, divCount, this.guideColor);
      pieces.add(circleS);

      pieces.rotation.z = (- (360 / this.verNum) * v) * Math.PI / 180;
      this.guidelines.add(pieces);
    }

    this.scene.add(this.guidelines);
  }

  // アウトラインを作成
  generateOutlines = () => {

    const divCount = 1000;

    const circle0 = this.outlineCircleGen(0, 0, 191, this.angleFr, this.angleTo, divCount, this.frontColor);
    this.outlines.add(circle0);

    for (var i = 0;i <= this.verNum - 1;i ++) {
      for (var j = 0;j <= 1;j ++) {

        // 小さい円の弧
        const center1x = - (520 - this.pathW) * Math.sin(THREE.MathUtils.degToRad(36));
        const center1y = - (520 - this.pathW) * Math.cos(THREE.MathUtils.degToRad(36));
        const circle1 = this.outlineCircleGen(center1x, center1y, this.pathW, 270 - 36, 270 - 36 + 90, divCount, this.frontColor);
        if (j == 1) circle1.rotation.y = THREE.MathUtils.degToRad(- 180);
        circle1.rotation.z = THREE.MathUtils.degToRad(- (360 / this.verNum) * i);
        this.outlines.add(circle1);

        // 対角線
        const a = Math.tan(THREE.MathUtils.degToRad(90 - 36));
        const b = - this.pathW / Math.sin(THREE.MathUtils.degToRad(36));
        const startX = center1x + this.pathW * Math.cos(THREE.MathUtils.degToRad(36));
        const theta = THREE.MathUtils.radToDeg(Math.asin(this.pathW / 245));
        const endX = - 245 * Math.sin(THREE.MathUtils.degToRad(36 - theta));
        const line1 = this.outlineGen(a, 1, b, startX, endX, divCount, this.frontColor);
        if (j == 1) line1.rotation.y = THREE.MathUtils.degToRad(-180);
        line1.rotation.z = THREE.MathUtils.degToRad(- (360 / this.verNum) * i);
        this.outlines.add(line1);

        // 中心円の弧
        const circle2 = this.outlineCircleGen(0, 0, 245, 270 - (36 - theta), 270 - theta, divCount, this.frontColor);
        if (j == 1) circle2.rotation.y = THREE.MathUtils.degToRad(-180);
        circle2.rotation.z = THREE.MathUtils.degToRad(- (360 / this.verNum) * i);
        this.outlines.add(circle2);

        // 対角線
        const line2Start = this.circle(0, 0, 245, 270 - theta);
        const r = 361;
        const c = - this.pathW;
        const side = this.pentagonSide[2];
        const origin = this.straight2(side.a, 1, side.b, c, undefined);
        const base = r / Math.tan(45 * Math.PI / 180);
        const center = new THREE.Vector3(origin.x - r, origin.y + base);
        const line2 = this.outlineGen(1, 0, - this.pathW, line2Start.y, center.y, divCount, this.frontColor);
        if (j == 1) line2.rotation.y = THREE.MathUtils.degToRad(-180);
        line2.rotation.z = THREE.MathUtils.degToRad(- (360 / this.verNum) * i);
        this.outlines.add(line2);

        // 大きい円の弧
        const circle3 = this.outlineCircleGen(center.x, center.y, r, 0, -90, divCount, this.frontColor);
        if (j == 1) circle3.rotation.y = THREE.MathUtils.degToRad(-180);
        circle3.rotation.z = THREE.MathUtils.degToRad(- (360 / this.verNum) * i);
        this.outlines.add(circle3);

        // 頂点までの直線
        const line3 = this.outlineGen(0, 1, center.y - r, center.x, this.vertices[3].x, divCount, this.frontColor);
        if (j == 1) line3.rotation.y = THREE.MathUtils.degToRad(-180);
        line3.rotation.z = THREE.MathUtils.degToRad(- (360 / this.verNum) * i);
        this.outlines.add(line3);

      }
    }
    this.scene.add(this.outlines);
  }
  // generateOutlines = () => {
  //   const objects = [];

  //   // 中央の円
  //   objects.push(this.circlesD[0]);

  //   // 花びらの輪郭を描画
  //   const cirD = this.circlesD[1];
  //   const cirS = this.circlesS[0];

  //   const i = 0;
  //   const pathW = i == 0 ? - this.pathW : this.pathW;
  //   const diagonal = i == 0 ? this.diagonals[0] : this.diagonals[1];
  //   const cirL = i == 0 ? this.circlesL[0] : this.circlesL[1];
  //   const side = i == 0 ? this.sides[4] : this.sides[0];

  //   const p1y = Math.sqrt(cirD.r ** 2 - pathW ** 2);
  //   const p1 = new THREE.Vector3(pathW, p1y, 0);
  //   const p2 = this.interLineCircle(cirD.r, 0, 0, diagonal.a, diagonal.r)[i == 0 ? 1 : 0];

  //   objects.push({k: 'circle', a: cirS.a, b: cirS.b, r: cirS.r, f: 90, t: i == 0 ? 180 : 0});
  //   objects.push({k: 'straight', a: 1, b: 0, r: pathW, f: cirS.b, t: p1.y});

  //   const theta1 = Math.atan(Math.abs(p1.y) / Math.abs(p1.x)) * 180 / Math.PI;
  //   const theta2 = Math.atan(Math.abs(p2.y) / Math.abs(p2.x)) * 180 / Math.PI;
  //   const f1 = i == 0 ? 180 - theta1 : theta1;
  //   const t1 = i == 0 ? 180 - theta2 : theta2;

  //   const p3 = this.interLineCircle(cirL.r, cirL.a, cirL.b, diagonal.a, diagonal.r)[0];
  //   const p4 = this.interLineCircle(cirL.r, cirL.a, cirL.b, side.a, side.r)[0];
  //   const theta3 = Math.atan(Math.abs(p3.y - cirL.b) / Math.abs(p3.x - cirL.a)) * 180 / Math.PI;
  //   const theta4 = Math.atan(Math.abs(p4.y - cirL.b) / Math.abs(p4.x - cirL.a)) * 180 / Math.PI;
  //   const f2 = i == 0 ? - (180 - theta3) : - theta3;
  //   const t2 = i == 0 ? - (180 + theta4) :   theta4;

  //   objects.push({k: 'circle', a: 0, b: 0, r: cirD.r, f: f1, t: t1});
  //   objects.push({k: 'straight', a: diagonal.a, b: 1, r: diagonal.r, f: p2.x, t: p3.x});
  //   objects.push({k: 'circle', a: cirL.a, b: cirL.b, r: cirL.r, f: f2, t: t2});
  //   objects.push({k: 'straight', a: side.a, b: 1, r: side.r, f: p4.x, t: this.vertices[0].x});

  //   const divCount = 1000;
  //   var index = 0;
  //   const group = new THREE.Group();
  //   objects.forEach((object) => {
  //     const gs = [0, 1, -1, 2, -2, 3, -3];
  //     gs.forEach((g) => {
  //       const points = [];
  //       const k = object.k, a = object.a, b = object.b, r = object.r + g, f = object.f, t = object.t;
  //       for (var i = 0;i <= divCount - 1;i ++) {
  //         var point;
  //         const d = THREE.MathUtils.damp(f, t, 10, i / (divCount - 1));
  //         if (k == 'straight') {
  //           if (b == 0) {
  //             point = this.straight2(a, b, r, undefined, d);
  //           } else {
  //             point = this.straight2(a, b, r, d, undefined);
  //           }
  //         } else if (k == 'circle') {
  //           // const s = d;
  //           point = this.circle(a, b, r, d);
  //         }
  //         points.push(point);
  //         if (g == 0 && index == 1 && this.points.length == 1) this.points.push([]);
  //         if (g == 0 && index >= 1) this.points[1].push(point);
  //       }
  //       if (g == 0 && index == 0) this.points.push(points);
  //       const geometry = new THREE.BufferGeometry().setFromPoints(points);
  //       // geometry.setDrawRange(0, 0);
  //       const material = new THREE.LineBasicMaterial({
  //         color: this.frontColor,
  //         transparent: true
  //       });
  //       for (var v = 0;v <= 9;v ++) {
  //         const line = new THREE.Line(geometry, material);
  //         line.rotation.z = (- (360 / this.verNum) * v) * Math.PI / 180;
  //         if (v % 2 == 0) line.rotation.y = 180 * Math.PI / 180;
  //         group.add(line);
  //         // this.outlines.add(line);
  //       }
  //     })
  //     index ++;
  //   })
  //   this.outlines.add(group);
  //   this.scene.add(this.outlines);
  // }

  // 塗りつぶし図形を生成
  generateShapes = () => {
    var index = 0;
    this.points.forEach((points) => {
      const shape = new THREE.Shape(points);
      const material = new THREE.MeshBasicMaterial({
        color: this.frontColor,
        side: THREE.DoubleSide,
        transparent: true,
      });
      const geometry = new THREE.ShapeGeometry(shape);
      if (index == 0) {
        const mesh = new THREE.Mesh(geometry, material);
        this.shapes.add(mesh);
      } else {
        for (var v = 0;v <= 9;v ++) {
          const materialC = material.clone();
          const mesh = new THREE.Mesh(geometry, materialC);
          const num = Math.trunc(v / 2);
          if (v % 2 != 0) {
            mesh.rotation.y = 180 * Math.PI / 180;
            mesh.rotation.z = ( (360 / this.verNum) * num) * Math.PI / 180;
          } else {
            mesh.rotation.z = (- (360 / this.verNum) * num) * Math.PI / 180;
          }
          this.shapes.add(mesh);
        }
      }
      this.scene.add(this.shapes);
      index ++;
    })
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

    // グリッドの表示アニメーション制御
    this.grid.displayControl(this.gridExist, this.progRatio, 0.0, 0.05, 0.4, 0.5);
    // グリッドをフェードアウト
    // this.grid.fadeOut(this.progRatio, 0.4, 0.5);

    // ガイドラインの表示アニメーション制御
    this.guidelinesDisplayControl(0.05, 0.45, 0.55, 0.65, 1000, 0.1);
    // this.guidelinesDrawControl(0.05, 0.45, 1000, 0.001);
    // this.guidelinesFadeoutControl(0.55, 0.65);

    // アウトラインの表示アニメーション制御
    this.outlinesDisplayControl(0.4, 0.6, 0.6, 0.7, 1000);
    // this.outlinesDrawControl(0.4, 0.6, 1000);
    // this.outlinesFadeoutControl(0.6, 0.7);

    // 図形の表示アニメーション制御
    this.shapesDisplayControl(0.65, 0.75, 1.0, 1.0);
    // this.shapesDrawControl(0.65, 0.75);

    // 図形を回転
    this.shapesRotationControl(0.7, 1.0);

    // descの表示アニメーションを制御
    this.descDisplayControl(0.8, 0.95, 1.0, 1.0);
    // this.descSlideinControl(0.8, 0.95);

    super.render();
  }
}
