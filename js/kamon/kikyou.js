'use strict';

import * as THREE from 'three';
import Kamon from '../kamon.js';

export default class Kikyou extends Kamon {

  constructor() {

    super();

    // ガイドラインの作成
    this.generateGuidelines();

    // アウトラインの作成
    // this.generateOutlines();

    // 塗りつぶし図形の描画
    this.generateShapes();

    // infoの準備
    this.jpName.textContent = '桔梗';
    this.jpDesc.textContent = '巴紋は鞆（とも）という弓の道具を図案化した説、勾玉を図案化した説など、由来には諸説あります。水が渦を巻く様子にも見えることから、平安時代には火除けの印として瓦の紋様にも取り入れられました。家紋だけでなく、神社の神紋などにも多く使用されています。';
    this.enName.textContent = 'Kikyou(Bellflower)';
    this.enDesc.textContent = 'There are various theories about the origin of the Tomoe crest, including one theory that it is a design of a bow tool called a tomo, and another theory that it is a design of a magatama. Because it looks like water swirling, it was incorporated into the pattern of roof tiles during the Heian period as a symbol to protect against fire. It is often used not only for family crests but also for shrine emblems.';
  }

  // ガイドラインを作成
  generateGuidelines = () => {
    const divCount = 1000;
    // 初期円
    const objects = [];
    // this.circles1 = [
    //   {k: 'circle'  , a:    0, b:    0, r:  191, f: 90, t: 450},
    //   {k: 'circle'  , a:    0, b:    0, r:  245, f: 90, t: 450},
    //   {k: 'circle'  , a:    0, b:    0, r:  520, f: 90, t: 450},
    //   {k: 'circle'  , a:    0, b:    0, r: 1600, f: 90, t: 450},
    // ];
    // this.circles1.forEach((circle) => objects.push(circle));
    this.circles2 = [];
    this.circles3 = [];
    this.diagonals1 = [];
    this.diagonals2 = [];
    this.pathW = 27;
    this.vertices = [];
    this.sides = [];
    this.verNum = 5;
    const startAngle = 90;
    const coefs = [];
    // for (var i = 0;i <= this.verNum - 1;i ++) {
    //   // 五角形の辺
    //   const r1 = startAngle - ((360 / this.verNum) * i);
    //   const r2 = startAngle - ((360 / this.verNum) * (i + 1));
    //   const t1 = r1 * Math.PI / 180;
    //   const t2 = r2 * Math.PI / 180;
    //   const v1 = this.circle(0, 0, 1600, t1);
    //   const v2 = this.circle(0, 0, 1600, t2);
    //   const coef = this.from2Points(v1.x, v1.y, v2.x, v2.y);
    //   this.vertices.push(v1);
    //   coefs.push(coef);
    //   const side = {k: 'straight', a: coef.a, b: 1, r: coef.b, f: v1.x, t: v2.x};
    //   this.sides.push(side);
    //   objects.push(side);

    //   // 五角形の対角線上の小円
    //   // const center = this.circle(0, 0, 493, t1);
    //   // const circle = {k: 'circle', a: center.x, b: center.y, r: this.pathW, f: 90, t: 450};
    //   // this.circles2.push(circle);
    //   // objects.push(circle);
    // }

    this.generateCommonGuidelines(divCount);

    // 5回分繰り返す
    for (var v = 0;v <= this.verNum - 1;v ++) {
      // 対角線
      const beforeP = this.straight2(this.sides[4].a, 1, this.sides[4].r, - this.pathW, undefined);
      const afterP  = this.straight2(this.sides[0].a, 1, this.sides[0].r,   this.pathW, undefined);
      const inter  = this.getIntersect(1, 0, this.sides[2].a, this.sides[2].r);
      const before = {k: 'straight', a: 1, b: 0, r:   this.pathW, f: beforeP.y, t: inter.y};
      const after  = {k: 'straight', a: 1, b: 0, r: - this.pathW, f: afterP.y,  t: inter.y};
      objects.push(before);
      objects.push(after);

      // 小さな円
      const center = this.circle(0, 0, 493, 90 * Math.PI / 180);
      const circle = {k: 'circle', a: center.x, b: center.y, r: this.pathW, f: 90, t: 450};
      objects.push(circle);

      // 大きな円
      const circle1 = {k: 'circle', a: - 240, b: 982, r: 360, f: 90, t: 450};
      const circle2 = {k: 'circle', a:   240, b: 982, r: 360, f: 90, t: 450};
      objects.push(circle1);
      objects.push(circle2);

      objects.forEach((object) => {
        const points = [];
        const k = object.k, a = object.a, b = object.b, r = object.r, f = object.f, t = object.t;
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
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        geometry.setDrawRange(0, 0);
        const material = new THREE.LineBasicMaterial({
          color: this.guideColor,
          transparent: true
        });
        const line = new THREE.Line(geometry, material);
        line.rotation.z = (-72 * v) * Math.PI / 180;
        this.guidelines.add(line);
      })
      this.scene.add(this.guidelines);
  
    }

    // // 対角線の左右に少しずつズレた線
    // for (var i = 0;i <= this.verNum - 1;i ++) {
    //   if (i == 0) {
    //     const beforeP = this.straight2(coefs[4].a, 1, coefs[4].b, - this.pathW, undefined);
    //     const afterP  = this.straight2(coefs[0].a, 1, coefs[0].b,   this.pathW, undefined);
    //     const inter  = this.getIntersect(1, 0, coefs[2].a, coefs[2].b);
    //     const before = {k: 'straight', a: 1, b: 0, r:   this.pathW, f: beforeP.y, t: inter.y};
    //     const after  = {k: 'straight', a: 1, b: 0, r: - this.pathW, f: afterP.y,  t: inter.y};
    //     this.diagonals1.push({k: 'straight', a: 1, b: 0, r: 0, f: this.vertices[i].y, t: inter.y});
    //     this.diagonals2.push(before);
    //     this.diagonals2.push(after);
    //     objects.push(before);
    //     objects.push(after);
    //   } else {
    //     const r1 = startAngle - ((360 / verNum) * i);
    //     const diagCoef = this.from2Points(this.vertices[i].x, this.vertices[i].y, 0, 0);
    //     const p = this.pathW * Math.cos((90 - r1) * Math.PI / 180);
    //     const q = this.pathW * Math.sin((90 - r1) * Math.PI / 180);
    //     const beforeCoefB = - diagCoef.a * - p + diagCoef.b + q;
    //     const afterCoefB  = - diagCoef.a *   p + diagCoef.b - q;
    //     const diagonal = i > 2 ? i - 3 :i + 2;
    //     const interBeforeFrom = this.getIntersect(diagCoef.a, beforeCoefB, coefs[i - 1].a, coefs[i - 1].b);
    //     const interBeforeTo   = this.getIntersect(diagCoef.a, beforeCoefB, coefs[diagonal].a, coefs[diagonal].b);
    //     const interAfterFrom  = this.getIntersect(diagCoef.a, afterCoefB,  coefs[i].a, coefs[i].b);
    //     const interAfterTo    = this.getIntersect(diagCoef.a, afterCoefB,  coefs[diagonal].a, coefs[diagonal].b);

    //     const before = {k: 'straight', a: diagCoef.a, b: 1, r: beforeCoefB, f: interBeforeFrom.x, t: interBeforeTo.x};
    //     const after  = {k: 'straight', a: diagCoef.a, b: 1, r: afterCoefB,  f: interAfterFrom.x, t: interAfterTo.x};
    //     this.diagonals1.push({k: 'straight', a: diagCoef.a, b: 1, r: diagCoef.b, f: this.vertices[i].x, t: this.getIntersect(diagCoef.a, diagCoef.b, coefs[diagonal].a, coefs[diagonal].b).x});
    //     this.diagonals2.push(before);
    //     this.diagonals2.push(after);
    //     objects.push(before);
    //     objects.push(after);
    //   }
    // }

    // // 各花びらの丸み
    // const baseA = 240;
    // const baseB = 982;
    // const c = Math.sqrt(baseA ** 2 + baseB ** 2);
    // const th = Math.atan(baseB / baseA) * 180 / Math.PI;
    // for (var i = 0;i <= verNum - 1;i ++) {
    //   if (i == 0) {
    //     const circle1 = {k: 'circle', a: - baseA, b: baseB, r: 360, f: 90, t: 450};
    //     const circle2 = {k: 'circle', a:   baseA, b: baseB, r: 360, f: 90, t: 450};
    //     this.circles3.push(circle1);
    //     this.circles3.push(circle2);
    //     objects.push(circle1);
    //     objects.push(circle2);
    //   } else {
    //     const each1A = c * Math.cos((th - 72 * i) * Math.PI / 180);
    //     const each1B = c * Math.sin((th - 72 * i) * Math.PI / 180);
    //     const each2A = c * Math.cos((180 - th - 72 * i) * Math.PI / 180);
    //     const each2B = c * Math.sin((180 - th - 72 * i) * Math.PI / 180);
    //     const circle1 = {k: 'circle', a: each2A, b: each2B, r: 360, f: 90, t: 450};
    //     const circle2 = {k: 'circle', a: each1A, b: each1B, r: 360, f: 90, t: 450};
    //     this.circles3.push(circle1);
    //     this.circles3.push(circle2);
    //     objects.push(circle1);
    //     objects.push(circle2);
    //   }
    // }

    // 
    // objects.forEach((object) => {
    //   const points = [];
    //   const k = object.k, a = object.a, b = object.b, r = object.r, f = object.f, t = object.t;
    //   for (var i = 0;i <= divCount - 1;i ++) {
    //     var point;
    //     const d = THREE.MathUtils.damp(f, t, 10, i / (divCount - 1));
    //     if (k == 'straight') {
    //       if (b == 0) {
    //         point = this.straight2(a, b, r, undefined, d);
    //       } else {
    //         point = this.straight2(a, b, r, d, undefined);
    //       }
    //     } else if (k == 'circle') {
    //       const s = d * Math.PI / 180;
    //       point = this.circle(a, b, r, s);
    //     }
    //     points.push(point);
    //   }
    //   const geometry = new THREE.BufferGeometry().setFromPoints(points);
    //   geometry.setDrawRange(0, 0);
    //   const material = new THREE.LineBasicMaterial({
    //     color: this.guideColor,
    //     transparent: true
    //   });
    //   const line = new THREE.Line(geometry, material);
    //   this.guidelines.add(line);
    // })
    // this.scene.add(this.guidelines);
  }

  // 共通パーツを生成
  generateCommonGuidelines = (divCount) => {
    const startAngle = 90;
    const objects = [];
    this.circles1 = [
      {k: 'circle'  , a:    0, b:    0, r:  191, f: 90, t: 450},
      {k: 'circle'  , a:    0, b:    0, r:  245, f: 90, t: 450},
      {k: 'circle'  , a:    0, b:    0, r:  520, f: 90, t: 450},
      {k: 'circle'  , a:    0, b:    0, r: 1600, f: 90, t: 450},
    ];
    this.circles1.forEach((circle) => objects.push(circle));

    // 五角形の辺
    const coefs = [];
    for (var i = 0;i <= this.verNum - 1;i ++) {
      const r1 = startAngle - ((360 / this.verNum) * i);
      const r2 = startAngle - ((360 / this.verNum) * (i + 1));
      const t1 = r1 * Math.PI / 180;
      const t2 = r2 * Math.PI / 180;
      const v1 = this.circle(0, 0, 1600, t1);
      const v2 = this.circle(0, 0, 1600, t2);
      const coef = this.from2Points(v1.x, v1.y, v2.x, v2.y);
      this.vertices.push(v1);
      coefs.push(coef);
      const side = {k: 'straight', a: coef.a, b: 1, r: coef.b, f: v1.x, t: v2.x};
      this.sides.push(side);
      objects.push(side);
    }

    objects.forEach((object) => {
      const points = [];
      const k = object.k, a = object.a, b = object.b, r = object.r, f = object.f, t = object.t;
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
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      geometry.setDrawRange(0, 0);
      const material = new THREE.LineBasicMaterial({
        color: this.guideColor,
        transparent: true
      });
      const line = new THREE.Line(geometry, material);
      this.guidelines.add(line);
    })
    this.scene.add(this.guidelines);
  }

  // アウトラインを作成
  generateOutlines = () => {
    const objects = [];
    objects.push(this.circles1[0]);

    const p1 = new THREE.Vector3(- this.pathW, Math.sqrt(this.circles1[1].r ** 2 - (- this.pathW) ** 2), 0);
    const p2 = this.interLineCircle(this.circles1[1].r, 0, 0, this.diagonals2[4].a, this.diagonals2[4].r)[1];
    this.shapeVs = [];
    this.shapeVs.push(p1, p2);
    const f1 = 180 - (Math.atan(Math.abs(p1.y) / Math.abs(p1.x)) * 180 / Math.PI);
    const t1 = 180 - (Math.atan(Math.abs(p2.y) / Math.abs(p2.x)) * 180 / Math.PI);
    objects.push({k:'circle', a: 0, b: 0, r: this.circles1[1].r, f: f1, t: t1});

    const p3 = this.interLineCircle(this.circles3[0].r, this.circles3[0].a, this.circles3[0].b, this.diagonals2[4].a, this.diagonals2[4].r)[1];
    // console.log(p3)
    this.shapeVs.push(p3);
    objects.push({k: 'straight', a: this.diagonals2[4].a, b: 1, r: this.diagonals2[4].r, f: p2.x, t: p3.x});

    const p4 = this.interLineCircle(this.circles3[0].r, this.circles3[0].a, this.circles3[0].b, this.sides[4].a, this.sides[4].r)[1];
    const f2 = - (180 - (Math.atan(Math.abs(p3.y - this.circles3[0].b) / Math.abs(p3.x - this.circles3[0].a)) * 180 / Math.PI));
    const t2 = - (180 + (Math.atan(Math.abs(p4.y - this.circles3[0].b) / Math.abs(p4.x - this.circles3[0].a)) * 180 / Math.PI));
    this.shapeVs.push(p4);
    objects.push({k:'circle', a: this.circles3[0].a, b: this.circles3[0].b, r: this.circles3[0].r, f: f2, t: t2});

    objects.push({k: 'straight', a: this.sides[4].a, b: 1, r: this.sides[4].r, f: p4.x, t: this.vertices[0].x});


    const p5 = new THREE.Vector3(this.pathW, Math.sqrt(this.circles1[1].r ** 2 - (this.pathW) ** 2), 0);
    // console.log(this.diagonals2[6], this.diagonals2[7])
    const p6 = this.interLineCircle(this.circles1[1].r, 0, 0, this.diagonals2[7].a, this.diagonals2[7].r)[0];
    this.shapeVs.push(p5, p6);
    const f3 = Math.atan(Math.abs(p5.y) / Math.abs(p5.x)) * 180 / Math.PI;
    const t3 = Math.atan(Math.abs(p6.y) / Math.abs(p6.x)) * 180 / Math.PI;
    objects.push({k:'circle', a: 0, b: 0, r: this.circles1[1].r, f: f3, t: t3});

    const p7 = this.interLineCircle(this.circles3[1].r, this.circles3[1].a, this.circles3[1].b, this.diagonals2[7].a, this.diagonals2[7].r)[0];
    this.shapeVs.push(p7);
    objects.push({k: 'straight', a: this.diagonals2[7].a, b: 1, r: this.diagonals2[7].r, f: p6.x, t: p7.x});

    const p8 = this.interLineCircle(this.circles3[1].r, this.circles3[1].a, this.circles3[1].b, this.sides[0].a, this.sides[0].r)[1];
    const f4 = - ((Math.atan(Math.abs(p7.y - this.circles3[1].b) / Math.abs(p7.x - this.circles3[1].a)) * 180 / Math.PI));
    const t4 = ((Math.atan(Math.abs(p8.y - this.circles3[1].b) / Math.abs(p8.x - this.circles3[1].a)) * 180 / Math.PI));
    this.shapeVs.push(p8);
    objects.push({k:'circle', a: this.circles3[1].a, b: this.circles3[1].b, r: this.circles3[1].r, f: f4, t: t4});

    objects.push({k: 'straight', a: this.sides[0].a, b: 1, r: this.sides[0].r, f: p8.x, t: this.vertices[0].x});

    objects.push({k: 'straight', a: 1, b: 0, r: - this.pathW, f: p5.y, t: this.circles2[0].b});
    objects.push({k: 'straight', a: 1, b: 0, r: this.pathW, f: p5.y, t: this.circles2[0].b});

    objects.push({k:'circle', a: this.circles2[0].a, b: this.circles2[0].b, r: this.circles2[0].r, f: 180, t: 0});


    const divCount = 1000;
    for (var v = 0;v <= 4;v ++) {
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
          }
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          // geometry.setDrawRange(0, 0);
          const material = new THREE.LineBasicMaterial({
            color: this.frontColor,
            transparent: true
          });
          const line = new THREE.Line(geometry, material);
          line.rotation.z = (72 * v) * Math.PI / 180;
          this.outlines.add(line);
        })
      })
    }

    this.scene.add(this.outlines);
  }

  // 塗りつぶし図形を生成
  generateShapes = () => {
    const figures = [
      [
        {a:    0, b:  0, r:  191, f:  90, t:  450, g: -6},
        // {a: -110, b:  490, r: 1100, f:   70, t:  110, g: -6},
        // {a:    0, b:    0, r: 1600, f:  110, t:  270, g: -6},
        // {a:  110, b: -490, r: 1100, f:  -95, t: -231, g:  6},
      ],
      // [
      //   {a:    0, b: -825, r:  750, f:   37, t:  240, g: -6},
      //   {a:  110, b: -490, r: 1100, f:  250, t:  290, g: -6},
      //   {a:    0, b:    0, r: 1600, f:  280, t:  450, g: -6},
      //   {a: -110, b:  490, r: 1100, f:   85, t:  -51, g:  6},
      // ]
    ];
    const divCount = 2000;
    figures.forEach((figure) => {
      const points = [];
      figure.forEach((arc) => {
        const a  = arc.a;
        const b  = arc.b;
        const r  = arc.r + arc.g;
        const f  = arc.f;
        const t  = arc.t;
        for (var i = 0;i <= divCount - 1;i ++) {
          const deg = THREE.MathUtils.damp(f, t, 10, i / (divCount - 1));
          const s = deg * (Math.PI / 180);
          const mid = this.circle(a, b, r, s);
          points.push(mid);
        }
      })
      const shape = new THREE.Shape(points);
      const material = new THREE.MeshBasicMaterial({
        color: this.frontColor,
        side: THREE.DoubleSide,
        opacity: 0.0,
        transparent: true,
      });
      const geometry = new THREE.ShapeGeometry(shape);
      const mesh = new THREE.Mesh(geometry, material);
      this.shapes.add(mesh);
    })
    this.scene.add(this.shapes);
  }

  // 図形を回転させるアニメーション制御
  shapesRotationControl(start, end) {
    // const ratio = THREE.MathUtils.smoothstep(this.progRatio, start, end);
    // for (var i = 0;i <= this.shapes.children.length - 1;i ++) {
    //   const shape = this.shapes.children[i];
    //   const posRatio = - 4 * ratio ** 2 + 4 * ratio;
    //   const pos = 1500 * posRatio;
    //   if (i == 0) {
    //     shape.position.set(-pos, 0, 0);
    //   } else {
    //     shape.position.set(pos, 0, 0);
    //   }
    // }
    // this.shapes.rotation.x = -360 * ratio * (Math.PI / 180);
    // this.shapes.rotation.z = -360 * ratio * (Math.PI / 180);
  }

  render() {

    // ガイドラインの表示アニメーション制御
    this.guidelinesDrawControl(0.05, 0.55, 5000, 0.01);

    // アウトラインの表示アニメーション制御
    this.outlinesDrawControl(0.3, 0.5, 1000);

    // グリッドをフェードアウト
    this.grid.fadeOut(this.progRatio, 0.35, 0.5);

    // ガイドラインをフェードアウト
    this.guidelinesFadeoutControl(0.4, 0.5);

    // 塗りつぶし図形をフェードイン
    this.shapesDrawControl(0.55, 0.65);

    // アウトラインをフェードアウト
    this.outlinesFadeoutControl(0.55, 0.6);

    // 図形を回転
    this.shapesRotationControl(0.7, 1.0);

    // descのアニメーションを制御
    this.descSlideinControl(0.8, 0.95);

    super.render();
  }
}
