'use strict';

import * as THREE from 'three';
import Kamon from '../kamon.js';

export default class HidariFutatsuDomoe extends Kamon {

  constructor() {

    super();

    this.angleFr = 90;
    this.angleTo = 450;

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
    const divCount = 1000;
    const circle0 = this.circleGen(0, 0, 1600, this.angleFr, this.angleTo, divCount, this.guideColor);
    const group = new THREE.Group();
    group.add(circle0);
    const params = [
      {a:    0, b:  825, r:  750},
      {a: -110, b:  490, r: 1100},
    ];
    for (var i = 0;i <= 1;i ++) {
      params.forEach((param) => {
        const circle = this.circleGen(param.a, param.b, param.r, this.angleFr, this.angleTo, divCount, this.guideColor);
        const rad = THREE.MathUtils.degToRad(180);
        if (i == 1) circle.rotation.z = rad;
        group.add(circle);
      })
    }
    this.guidelines.add(group);
    this.scene.add(this.guidelines);
  }

  // アウトラインを作成
  generateOutlines = () => {
    const divCount = 1000;
    const params = [
      {a:    0, b:    0, r: 1600, f: 107, t: 290  },
      {a:    0, b:  825, r:  750, f: 421, t: 218  },
      {a: -110, b:  490, r: 1100, f: 110, t:  64  },
      {a:  110, b: -490, r: 1100, f: 290, t: 129.5},
    ];
    for (var i = 0;i <= 1;i ++) {
      params.forEach((param) => {
        const circle = this.outlineCircleGen(param.a, param.b, param.r, param.f, param.t, divCount, this.frontColor);
        const rad = THREE.MathUtils.degToRad(180);
        if (i == 1) circle.rotation.z = rad;
        this.outlines.add(circle);
      })
      this.scene.add(this.outlines);
    }
  }

  // 塗りつぶし図形を生成
  generateShapes = () => {
    const divCount = 2000;
    const params = [
      {a:    0, b:  825, r:  750, f:  217, t:  420, g: -6},
      {a: -110, b:  490, r: 1100, f:   70, t:  110, g: -6},
      {a:    0, b:    0, r: 1600, f:  110, t:  270, g: -6},
      {a:  110, b: -490, r: 1100, f:  -95, t: -231, g:  6},
    ];

    const group = new THREE.Group();
    for (var i = 0;i <= 1;i ++) {
      var points = [];
      params.forEach((param) => {
        const arc = this.circlePointGen(param.a, param.b, param.r + param.g, param.f, param.t, divCount);
        points = points.concat(arc);
      })
      const mesh = this.shapeGen(points, this.frontColor);
      const rad = THREE.MathUtils.degToRad(180);
      if (i == 1) mesh.rotation.z = rad;
      mesh.visible = false;
      group.add(mesh);
    }
    this.shapes.add(group);
    this.scene.add(this.shapes);
  }

  // 図形を回転させるアニメーション制御
  shapesRotationControl(start, end) {
    const ratio = THREE.MathUtils.smoothstep(this.progRatio, start, end);
    this.shapes.children.forEach((group) => {
      for (var i = 0;i <= group.children.length - 1;i ++) {
        const shape = group.children[i];
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
    })
  }

  render() {

    // ファウンダーの表示アニメーション制御
    this.foundersDisplayControl(0.0, 0.05, 0.0, 0.6);

    // グリッドの表示アニメーション制御
    this.grid.displayControl(this.gridExist, this.progRatio, 0.0, 0.05, 0.35, 0.5);

    // ガイドラインの表示アニメーション制御
    this.guidelinesDisplayControl(0.05, 0.35, 0.4, 0.5, 1000, 0.1, 0.1);

    // アウトラインの表示アニメーション制御
    this.outlinesDisplayControl(0.3, 0.5, 0.55, 0.6, 1000);

    // 図形の表示アニメーション制御
    this.shapesDisplayControl(0.55, 0.65, 1.0, 1.0);

    // 図形を回転
    this.shapesRotationControl(0.7, 1.0);

    // descのアニメーションを制御
    this.descDisplayControl(0.8, 0.95, 1.0, 1.0);

    super.render();
  }
}
