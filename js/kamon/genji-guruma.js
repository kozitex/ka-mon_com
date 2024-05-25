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
    // this.vertices = [];   // 五角形の頂点
    // this.sides = [];      // 五角形の辺
    // this.circlesS = [];   // 花びらの小さな円
    // this.circlesL = [];   // 花びらの大きな円
    this.circlesD = [];   // ベースの4つの中心円
    // this.diagonals = [];  // 対角線
    // this.points = [];

    // ガイドラインの作成
    this.generateGuidelines();

    // アウトラインの作成
    // this.generateOutlines();

    // 塗りつぶし図形の描画
    // this.generateShapes();

    // infoの準備
    this.jpName.innerHTML = '源氏車';
    this.jpDesc.innerHTML = '桔梗の花を図案化した家紋です。桔梗の漢字のつくりから「更に吉（さらによし）」という語呂が縁起が良いとされ、多くの家の家紋として使用されていました。この内、陰桔梗は戦国武将、明智光秀の家紋としても知られていますが、本能寺の変をきっかけに裏切り者の家紋として使用を憚られた時期があったと言われています。';
    this.enName.innerHTML = 'Genji-Guruma';
    this.enDesc.innerHTML = 'This is a family crest with a design of a bellflower. Due to the kanji character for bellflower, the word "Moreyoshi" is said to bring good luck, and it was used as the family emblem of many families. Of these, Kagekikyo is also known as the family emblem of Sengoku warlord Akechi Mitsuhide, but it is said that there was a time when its use was discouraged as a traitor&#39;s family emblem in the wake of the Honnoji Incident.';
  }

  // ガイドラインを作成
  generateGuidelines = () => {

    const divCount = 1000;
    const objects = [];

    // 円
    const rs = [225, 260, 935, 970, 1265, 1300, 1600];
    // rs.forEach((r) => {
    //   const param = {k: 'circle', a: 0, b: 0, r: r, f: this.angleFr, t: this.angleTo};
    //   this.circlesD.push(param);
    //   objects.push(param);
    // });
    rs.forEach((r) => {
      const circle = this.circleGen(0, 0, r, this.angleFr, this.angleTo, divCount, this.guideColor);
      this.guidelines.add(circle);
    });


    // 直線
    for (var v = 0;v <= this.verNum / 2 - 1;v ++) {

      // 車輪のスポーク部分
      for (var i = 0;i <= 1;i ++) {
        const line = this.lineGen(1, 0, 0, - 1600, 1600, divCount, this.guideColor);
        const piece = 22.5;
        const rotA1 = i == 0 ? piece / 2 : - piece / 2;
        const rotA2 = 360 / this.verNum * v;
        line.rotation.z = (rotA1 - rotA2) * Math.PI / 180;
        this.guidelines.add(line);
      }

      // 内側の継ぎ目
      for (var i = 0;i <= 3;i ++) {
        const line = this.lineGen(1, 0, 0, - 1600, 1600, divCount, this.guideColor);
        // if (i == 1 || i == 3) line.material.color = new THREE.Color(0xff3333)
        const piece = 16.875
        const rotA1 = (i <= 1 ? piece : - piece) * Math.PI / 180;
        const rotA2 = 360 / this.verNum * v * Math.PI / 180;
        var moveX, moveY;
        if (v == 0) {
          moveX = (i == 0 || i == 2 ? - 1 : 1) * (this.pathW / 2) * Math.cos(rotA1);
          moveY = (i == 0 || i == 2 ? - 1 : 1) * (this.pathW / 2) * Math.sin(rotA1);
        } else if (v == 1) {
          const angle = i <= 1 ? rotA1 : (90 * Math.PI / 180) - rotA1;
          moveX = (i == 0 || i == 3 ? - 1 : 1) * (this.pathW / 2) * Math.cos(angle);
          moveY = (i == 0 || i == 2 ? 1 : - 1) * (this.pathW / 2) * Math.sin(angle);
        } else if (v == 2) {
          const angle = (90 * Math.PI / 180) - rotA1;
          moveX = (i == 0 || i == 2 ? - 1 : 1) * (this.pathW / 2) * Math.cos(angle);
          moveY = (i == 0 || i == 2 ? 1 : - 1) * (this.pathW / 2) * Math.sin(angle);
        } else if (v == 3) {
          const angle = i >= 2 ? rotA1 : (90 * Math.PI / 180) - rotA1;
          moveX = (i == 0 || i == 2 ? 1 : - 1) * (this.pathW / 2) * Math.cos(angle);
          moveY = (i == 0 || i == 3 ? 1 : - 1) * (this.pathW / 2) * Math.sin(angle);
        }
        // console.log(v, i, moveX, moveY)
        line.position.x = moveX;
        line.position.y = moveY;
        line.rotation.z = rotA1 - rotA2;
        this.guidelines.add(line);
      }

      // 外側の継ぎ目
      for (var i = 0;i <= 1;i ++) {
        const line = this.lineGen(1, 0, 0, - 1600, 1600, divCount, this.guideColor);
        const rotA = - 360 / this.verNum * v * Math.PI / 180;
        const moveX = (i == 0 ? - 1 : 1) * (this.pathW / 2) * Math.cos(rotA);
        const moveY = (i == 0 ? - 1 : 1) * (this.pathW / 2) * Math.sin(rotA);
        line.position.x = moveX;
        line.position.y = moveY;
        line.rotation.z = rotA;
        this.guidelines.add(line);
      }

      // const outSeam1 = {k: 'straight', a: 1, b: 0, r: - this.pathW / 2, f: 0, t: this.circle(0, 0, 1600, Math.acos((- this.pathW / 2) / 1600)).y};
      // const outSeam2 = {k: 'straight', a: 1, b: 0, r:   this.pathW / 2, f: 0, t: this.circle(0, 0, 1600, Math.acos((  this.pathW / 2) / 1600)).y};
      // objects.push(outSeam1, outSeam2);


    //   // // 対角線
    //   // const beforeP = this.straight2(this.sides[4].a, 1, this.sides[4].r, - this.pathW, undefined);
    //   // const afterP  = this.straight2(this.sides[0].a, 1, this.sides[0].r,   this.pathW, undefined);
    //   // const inter  = this.getIntersect(1, 0, this.sides[2].a, this.sides[2].r);
    //   // const before = {k: 'straight', a: 1, b: 0, r:   this.pathW, f: beforeP.y, t: inter.y};
    //   // const after  = {k: 'straight', a: 1, b: 0, r: - this.pathW, f: afterP.y,  t: inter.y};
    //   // objects.push(before, after);

    //   // // 小さな円
    //   // const center = this.circle(0, 0, 493, this.angleFr * Math.PI / 180);
    //   // const circle = {k: 'circle', a: center.x, b: center.y, r: this.pathW, f: this.angleFr, t: this.angleTo};
    //   // this.circlesS.push(circle);
    //   // objects.push(circle);

    //   // // 大きな円
    //   // const circle1 = {k: 'circle', a: centers[0].x, b: centers[0].y, r: r, f: this.angleFr, t: this.angleTo};
    //   // const circle2 = {k: 'circle', a: centers[1].x, b: centers[1].y, r: r, f: this.angleFr, t: this.angleTo};
    //   // this.circlesL.push(circle1, circle2);
    //   // objects.push(circle1, circle2);

    //   var index = 0;
    //   objects.forEach((object) => {
    //     const points = [];
    //     const k = object.k, a = object.a, b = object.b, r = object.r, f = object.f, t = object.t;
    //     for (var i = 0;i <= divCount - 1;i ++) {
    //       var point;
    //       const d = THREE.MathUtils.damp(f, t, 10, i / (divCount - 1));
    //       if (k == 'straight') {
    //         if (b == 0) {
    //           point = this.straight2(a, b, r, undefined, d);
    //         } else {
    //           point = this.straight2(a, b, r, d, undefined);
    //         }
    //       } else if (k == 'circle') {
    //         const s = d * Math.PI / 180;
    //         point = this.circle(a, b, r, s);
    //       }
    //       points.push(point);
    //     }
    //     const geometry = new THREE.BufferGeometry().setFromPoints(points);
    //     geometry.setDrawRange(0, 0);
    //     const material = new THREE.LineBasicMaterial({
    //       color: this.guideColor,
    //       transparent: true
    //     });
    //     const line = new THREE.Line(geometry, material);
    //     // if (index > 9) {
    //       line.rotation.z = (- (360 / this.verNum) * v) * Math.PI / 180;
    //     // }
    //     this.guidelines.add(line);
    //     index ++;
    //   })
    //   this.scene.add(this.guidelines);
    }
    this.scene.add(this.guidelines);
  }

  // アウトラインを作成
  generateOutlines = () => {
    const objects = [];

    // 中央の円
    objects.push(this.circlesD[0]);

    // 花びらの輪郭を描画
    const cirD = this.circlesD[1];
    const cirS = this.circlesS[0];

    const i = 0;
    const pathW = i == 0 ? - this.pathW : this.pathW;
    const diagonal = i == 0 ? this.diagonals[0] : this.diagonals[1];
    const cirL = i == 0 ? this.circlesL[0] : this.circlesL[1];
    const side = i == 0 ? this.sides[4] : this.sides[0];

    const p1y = Math.sqrt(cirD.r ** 2 - pathW ** 2);
    const p1 = new THREE.Vector3(pathW, p1y, 0);
    const p2 = this.interLineCircle(cirD.r, 0, 0, diagonal.a, diagonal.r)[i == 0 ? 1 : 0];

    objects.push({k: 'circle', a: cirS.a, b: cirS.b, r: cirS.r, f: 90, t: i == 0 ? 180 : 0});
    objects.push({k: 'straight', a: 1, b: 0, r: pathW, f: cirS.b, t: p1.y});

    const theta1 = Math.atan(Math.abs(p1.y) / Math.abs(p1.x)) * 180 / Math.PI;
    const theta2 = Math.atan(Math.abs(p2.y) / Math.abs(p2.x)) * 180 / Math.PI;
    const f1 = i == 0 ? 180 - theta1 : theta1;
    const t1 = i == 0 ? 180 - theta2 : theta2;

    const p3 = this.interLineCircle(cirL.r, cirL.a, cirL.b, diagonal.a, diagonal.r)[0];
    const p4 = this.interLineCircle(cirL.r, cirL.a, cirL.b, side.a, side.r)[0];
    const theta3 = Math.atan(Math.abs(p3.y - cirL.b) / Math.abs(p3.x - cirL.a)) * 180 / Math.PI;
    const theta4 = Math.atan(Math.abs(p4.y - cirL.b) / Math.abs(p4.x - cirL.a)) * 180 / Math.PI;
    const f2 = i == 0 ? - (180 - theta3) : - theta3;
    const t2 = i == 0 ? - (180 + theta4) :   theta4;

    objects.push({k: 'circle', a: 0, b: 0, r: cirD.r, f: f1, t: t1});
    objects.push({k: 'straight', a: diagonal.a, b: 1, r: diagonal.r, f: p2.x, t: p3.x});
    objects.push({k: 'circle', a: cirL.a, b: cirL.b, r: cirL.r, f: f2, t: t2});
    objects.push({k: 'straight', a: side.a, b: 1, r: side.r, f: p4.x, t: this.vertices[0].x});

    const divCount = 1000;
    var index = 0;
    objects.forEach((object) => {
      const gs = [0, 1, -1, 2, -2, 3, -3];
      gs.forEach((g) => {
        const points = [];
        const k = object.k, a = object.a, b = object.b, r = object.r + g, f = object.f, t = object.t;
        for (var i = 0;i <= divCount - 1;i ++) {
          var point;
          const d = THREE.MathUtils.damp(f, t, 10, i / (divCount - 1));
          if (k == 'straight') {
            if (b == 0) {
              point = this.straight2(a, b, r, undefined, d);
            } else {
              point = this.straight2(a, b, r, d, undefined);
            }
          } else if (k == 'circle') {
            const s = d * Math.PI / 180;
            point = this.circle(a, b, r, s);
          }
          points.push(point);
          if (g == 0 && index == 1 && this.points.length == 1) this.points.push([]);
          if (g == 0 && index >= 1) this.points[1].push(point);
        }
        if (g == 0 && index == 0) this.points.push(points);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        // geometry.setDrawRange(0, 0);
        const material = new THREE.LineBasicMaterial({
          color: this.frontColor,
          transparent: true
        });
        for (var v = 0;v <= 9;v ++) {
          const line = new THREE.Line(geometry, material);
          line.rotation.z = (- (360 / this.verNum) * v) * Math.PI / 180;
          if (v % 2 == 0) line.rotation.y = 180 * Math.PI / 180;
          this.outlines.add(line);
        }
      })
      index ++;
    })
    this.scene.add(this.outlines);
  }

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

    // ガイドラインの表示アニメーション制御
    this.guidelinesDrawControl(0.05, 0.45, 1000, 0.005);

    // グリッドをフェードアウト
    this.grid.fadeOut(this.progRatio, 0.4, 0.5);

    // アウトラインの表示アニメーション制御
    this.outlinesDrawControl(0.4, 0.6, 1000);

    // ガイドラインをフェードアウト
    this.guidelinesFadeoutControl(0.55, 0.65);

    // 塗りつぶし図形をフェードイン
    this.shapesDrawControl(0.65, 0.75);

    // アウトラインをフェードアウト
    this.outlinesFadeoutControl(0.6, 0.7);

    // 図形を回転
    this.shapesRotationControl(0.7, 1.0);

    // descのアニメーションを制御
    this.descSlideinControl(0.8, 0.95);

    super.render();
  }
}
