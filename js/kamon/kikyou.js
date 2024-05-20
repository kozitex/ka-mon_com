'use strict';

import * as THREE from 'three';
import Kamon from '../kamon.js';

export default class Kikyou extends Kamon {

  constructor() {

    super();

    // ガイドラインの作成
    this.generateGuidelines();

    // アウトラインの作成
    this.generateOutlines();

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
    const params = [
      {k: 'circle'  , a:    0, b:    0, r:  191, f: 90, t: 450},
      {k: 'circle'  , a:    0, b:    0, r:  245, f: 90, t: 450},
      {k: 'circle'  , a:    0, b:    0, r:  520, f: 90, t: 450},
      {k: 'circle'  , a:    0, b:    0, r: 1600, f: 90, t: 450},
    ];
    const o = 27;
    const verNum = 5;
    const startAngle = 90;
    const vertices = [];
    const coefs = [];
    for (var i = 0;i <= verNum - 1;i ++) {
      // 五角形の辺
      const r1 = startAngle - ((360 / verNum) * i);
      const r2 = startAngle - ((360 / verNum) * (i + 1));
      const t1 = r1 * Math.PI / 180;
      const t2 = r2 * Math.PI / 180;
      const v1 = this.circle(0, 0, 1600, t1);
      const v2 = this.circle(0, 0, 1600, t2);
      const coef = this.from2Points(v1.x, v1.y, v2.x, v2.y);
      vertices.push(v1);
      coefs.push(coef);
      params.push({k: 'straight', a: coef.a, b: 1, r: coef.b, f: v1.x, t: v2.x});

      // 五角形の対角線上の小円
      const center = this.circle(0, 0, 493, t1);
      params.push({k: 'circle', a: center.x, b: center.y, r: o, f: 90, t: 450});
    }

    // 対角線の左右に少しずつズレた線
    for (var i = 0;i <= verNum - 1;i ++) {
      if (i == 0) {
        const before = this.straight2(coefs[4].a, 1, coefs[4].b, - o, undefined);
        const after  = this.straight2(coefs[0].a, 1, coefs[0].b,   o, undefined);
        const inter  = this.getIntersect(1, 0, coefs[2].a, coefs[2].b);
        params.push({k: 'straight', a: 1, b: 0, r:   o, f: before.y, t: inter.y});
        params.push({k: 'straight', a: 1, b: 0, r: - o, f: after.y,  t: inter.y});
      } else {
        const r1 = startAngle - ((360 / verNum) * i);
        const diagCoef = this.from2Points(vertices[i].x, vertices[i].y, 0, 0);
        const p = o * Math.cos((90 - r1) * Math.PI / 180);
        const q = o * Math.sin((90 - r1) * Math.PI / 180);
        const beforeCoefB = - diagCoef.a * - p + diagCoef.b + q;
        const afterCoefB  = - diagCoef.a *   p + diagCoef.b - q;
        const diagonal = i > 2 ? i - 3 :i + 2;
        const interBeforeFrom = this.getIntersect(diagCoef.a, beforeCoefB, coefs[i - 1].a, coefs[i - 1].b);
        const interBeforeTo   = this.getIntersect(diagCoef.a, beforeCoefB, coefs[diagonal].a, coefs[diagonal].b);
        const interAfterFrom  = this.getIntersect(diagCoef.a, afterCoefB,  coefs[i].a, coefs[i].b);
        const interAfterTo    = this.getIntersect(diagCoef.a, afterCoefB,  coefs[diagonal].a, coefs[diagonal].b);
        params.push({k: 'straight', a: diagCoef.a, b: 1, r: beforeCoefB, f: interBeforeFrom.x, t: interBeforeTo.x});
        params.push({k: 'straight', a: diagCoef.a, b: 1, r: afterCoefB,  f: interAfterFrom.x, t: interAfterTo.x});  
      }
    }

    // 各花びらの丸み
    const baseA = 240;
    const baseB = 982;
    const c = Math.sqrt(baseA ** 2 + baseB ** 2);
    const th = Math.atan(baseB / baseA);
    console.log(th)
    for (var i = 0;i <= verNum - 1;i ++) {
      if (i == 0) {
        params.push({k: 'circle', a:   baseA, b: baseB, r: 360, f: 90, t: 450});
        params.push({k: 'circle', a: - baseA, b: baseB, r: 360, f: 90, t: 450});
      } else {
        const eachA = c * Math.cos(th + (72 * i) * Math.PI / 180);
        const eachB = c * Math.sin(th + (72 * i) * Math.PI / 180);
        params.push({k: 'circle', a:   eachA, b: eachB, r: 360, f: 90, t: 450});
        params.push({k: 'circle', a: - eachA, b: eachB, r: 360, f: 90, t: 450});
      }

    }
    // params.push({k: 'circle', a:   240, b: 982, r: 360, f: 90, t: 450});
    // params.push({k: 'circle', a: - 240, b: 982, r: 360, f: 90, t: 450});



    // 
    params.forEach((param) => {
      const points = [];
      const k = param.k, a = param.a, b = param.b, r = param.r, f = param.f, t = param.t;
      for (var i = 0;i <= divCount - 1;i ++) {
        var point;
        const d = THREE.MathUtils.damp(f, t, 10, i / (divCount - 1));
        if (k == 'straight') {
          // point = this.straight(a, b, d, undefined);
          if (b == 0) {
            point = this.straight2(a, b, r, undefined, d);
            // console.log(point)
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
    const circles = [
      {a:    0, b:    0, r: 191, f:  90, t: 450},
      // {a:    0, b:    0, r: 1600, f: 107, t: 290},
      // {a:    0, b:  825, r:  750, f: 421, t: 218},
      // {a:    0, b: -825, r:  750, f: 240, t:  38},
      // {a: -110, b:  490, r: 1100, f: 470, t: 309.5},
      // {a:  110, b: -490, r: 1100, f: 290, t: 129.5},
    ];
    const divCount = 1000;
    circles.forEach((circle) => {

      const gs = [0, 1, -1, 2, -2, 3, -3];
      gs.forEach((g) => {
        const points = [];
        const a = circle.a;
        const b = circle.b;
        const r = circle.r + g;
        const f = circle.f;
        const t = circle.t;
        for (var i = 0;i <= divCount - 1;i ++) {
          const deg = THREE.MathUtils.damp(f, t, 10, i / (divCount - 1));
          const s = deg * (Math.PI / 180);
          const mid = this.circle(a, b, r, s);
          points.push(mid);
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        geometry.setDrawRange(0, 0);
        const material = new THREE.LineBasicMaterial({
          color: this.frontColor,
          transparent: true
        });
        const line = new THREE.Line(geometry, material);
        this.outlines.add(line);
      })
    })
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
