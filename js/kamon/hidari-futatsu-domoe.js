'use strict';

import * as THREE from 'three';
import Kamon from '../kamon.js';

export default class HidariFutatsuDomoe extends Kamon {

  constructor() {

    super();

    // ガイドラインの作成
    this.generateGuidelines();

    // アウトラインの作成
    this.generateOutlines();

    // 塗りつぶし図形の描画
    this.generateShapes();

    // infoの準備
    this.jpName.textContent = '左二つ巴';
    this.jpDesc.textContent = '巴紋は鞆（とも）という弓の道具を図案化した説、勾玉を図案化した説など、由来には諸説あります。水が渦を巻く様子にも見えることから、平安時代には火除けの印として瓦の紋様にも取り入れられました。家紋だけでなく、神社の神紋などにも多く使用されています。';
    this.enName.textContent = 'Hidari-Futatsu-Domoe';
    this.enDesc.textContent = 'There are various theories about the origin of the Tomoe crest, including one theory that it is a design of a bow tool called a tomo, and another theory that it is a design of a magatama. Because it looks like water swirling, it was incorporated into the pattern of roof tiles during the Heian period as a symbol to protect against fire. It is often used not only for family crests but also for shrine emblems.';
  }

  // ガイドラインを作成
  generateGuidelines = () => {
    const circles = [
      {a:    0, b:    0, r: 1600},
      {a:    0, b:  825, r:  750},
      {a:    0, b: -825, r:  750},
      {a: -110, b:  490, r: 1100},
      {a:  110, b: -490, r: 1100},
    ];
    const divCount = 1000;
    circles.forEach((circle) => {
      const points = [];
      const a = circle.a;
      const b = circle.b;
      const r = circle.r;
      for (var i = 0;i <= divCount - 1;i ++) {
        const deg = THREE.MathUtils.damp(90, 450, 10, i / (divCount - 1));
        // const s = deg * (Math.PI / 180);
        const mid = this.circle(a, b, r, deg);
        points.push(mid);
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
      {a:    0, b:    0, r: 1600, f: -73, t: 110},
      {a:    0, b:    0, r: 1600, f: 107, t: 290},
      {a:    0, b:  825, r:  750, f: 421, t: 218},
      {a:    0, b: -825, r:  750, f: 240, t:  38},
      {a: -110, b:  490, r: 1100, f: 470, t: 309.5},
      {a:  110, b: -490, r: 1100, f: 290, t: 129.5},
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
          // const s = deg * (Math.PI / 180);
          const mid = this.circle(a, b, r, deg);
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
        {a:    0, b:  825, r:  750, f:  217, t:  420, g: -6},
        {a: -110, b:  490, r: 1100, f:   70, t:  110, g: -6},
        {a:    0, b:    0, r: 1600, f:  110, t:  270, g: -6},
        {a:  110, b: -490, r: 1100, f:  -95, t: -231, g:  6},
      ],
      [
        {a:    0, b: -825, r:  750, f:   37, t:  240, g: -6},
        {a:  110, b: -490, r: 1100, f:  250, t:  290, g: -6},
        {a:    0, b:    0, r: 1600, f:  280, t:  450, g: -6},
        {a: -110, b:  490, r: 1100, f:   85, t:  -51, g:  6},
      ]
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
          // const s = deg * (Math.PI / 180);
          const mid = this.circle(a, b, r, deg);
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
    const ratio = THREE.MathUtils.smoothstep(this.progRatio, start, end);
    for (var i = 0;i <= this.shapes.children.length - 1;i ++) {
      const shape = this.shapes.children[i];
      const posRatio = - 4 * ratio ** 2 + 4 * ratio;
      const pos = 1500 * posRatio;
      if (i == 0) {
        shape.position.set(-pos, 0, 0);
      } else {
        shape.position.set(pos, 0, 0);
      }
    }
    this.shapes.rotation.x = -360 * ratio * (Math.PI / 180);
    this.shapes.rotation.z = -360 * ratio * (Math.PI / 180);
  }

  render() {

    // ガイドラインの表示アニメーション制御
    this.guidelinesDrawControl(0.05, 0.35, 1333, 0.05);

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
