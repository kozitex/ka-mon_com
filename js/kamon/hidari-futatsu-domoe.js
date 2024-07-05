'use strict';

import * as THREE from 'three';
import Kamon from '../kamon.js';

export default class HidariFutatsuDomoe extends Kamon {

  constructor() {

    super();

    // infoのテキスト
    this.jpNameText = '左二つ巴';
    this.jpDescText = '巴紋は鞆（とも）という弓の道具を図案化した説、勾玉を図案化した説など、由来には諸説あります。水が渦を巻く様子にも見えることから、平安時代には火除けの印として瓦の紋様にも取り入れられました。家紋だけでなく、神社の神紋などにも多く使用されています。';
    this.enNameText = 'Hidari-Futatsu-Domoe';
    this.enDescText = 'There are various theories about the origin of the Tomoe crest, including one theory that it is a design of a bow tool called a tomo, and another theory that it is a design of a magatama. Because it looks like water swirling, it was incorporated into the pattern of roof tiles during the Heian period as a symbol to protect against fire. It is often used not only for family crests but also for shrine emblems.';

    // ガイドラインの表示アニメーションパラメータ
    this.guidelineParams = {
      inStart : 0.05,
      inEnd   : 0.3,
      outStart: 0.3,
      outEnd  : 0.4,
      gDelay  : 0.1,
      lDelay  : 0.1,
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

    // // ガイドラインの作成
    // this.generateGuideline();

    // // アウトラインの作成
    // this.generateOutline();

    // // 塗りつぶし図形の描画
    // this.generateShape();
  }

  // オブジェクトを生成
  init = () => {

    // ガイドラインの作成
    this.generateGuideline();

    // アウトラインの作成
    this.generateOutline();

    // 塗りつぶし図形の描画
    this.generateShape();

    // super.generate();
  }

  // ガイドラインを作成
  generateGuideline = () => {

    const group = new THREE.Group();
    const points0 = this.circlePointGen(0, 0, 1600, 90, 450, this.divCount);
    const circle0 = this.guidelineGen(points0);
    group.add(circle0);

    const params = [
      {a:     0, b:  825, r:  750},
      {a: - 110, b:  490, r: 1100},
    ];
    for (var i = 0;i <= 1;i ++) {
      params.forEach((param) => {
        const points = this.circlePointGen(param.a, param.b, param.r, 90, 450, this.divCount);
        const circle = this.guidelineGen(points);
        circle.rotation.z = THREE.MathUtils.degToRad(180) * i;
        group.add(circle);
      })
    }
    this.guidelines.add(group);
    this.group.add(this.guidelines);
  }

  // アウトラインを作成
  generateOutline = () => {

    const params = [
      {a:     0, b:     0, r: 1600, f: 107, t: 290  },
      {a:     0, b:   825, r:  750, f: 421, t: 218  },
      {a: - 110, b:   490, r: 1100, f: 110, t:  64  },
      {a:   110, b: - 490, r: 1100, f: 290, t: 129.5},
    ];

    params.forEach((param) => {
      const geometry = this.outlineCircleGeoGen(param.a, param.b, param.r, param.f, param.t, this.divCount);
      for (var i = 0;i <= 1;i ++) {
        const w = 6;
        for (var g = - w;g <= w;g ++) {
          const rotZ = THREE.MathUtils.degToRad(180) * i;
          const mesh = this.outlineCircleMeshGen(geometry, param.a, param.b, param.r, g, 0, 0, rotZ);
          this.outlines.add(mesh);
        }
      }
    })
    this.group.add(this.outlines);
  }

  // 塗りつぶし図形を生成
  generateShape = () => {

    const params = [
      {a:     0, b:   825, r:  750, f:  217, t:   420, g: - 6, c: false},
      {a: - 110, b:   490, r: 1100, f:   70, t:   110, g: - 6, c: false},
      {a:     0, b:     0, r: 1600, f:  110, t:   270, g: - 6, c: false},
      {a:   110, b: - 490, r: 1100, f: - 95, t: - 231, g:   6, c: true },
    ];

    var points = [];
    params.forEach((param) => {
      const curve = this.curvePointGen(param.a, param.b, param.r + param.g, param.f, param.t, param.c);
      points = points.concat(curve);
    })
    const geometry = this.shapeGeoGen(points);

    for (var i = 0;i <= 1;i ++) {
      const mesh = new THREE.Mesh(geometry, this.shapeMat);
      mesh.rotation.z = THREE.MathUtils.degToRad(180) * i;
      this.shapes.add(mesh);
    }
    this.group.add(this.shapes);
  }

  // 図形を回転させるアニメーション制御
  shapeRotationControl(progRatio) {
    const p = this.shapeRotParams;
    const ratio = THREE.MathUtils.smoothstep(progRatio, p.start, p.end);
    for (var i = 0;i <= this.shapes.children.length - 1;i ++) {
      const shape = this.shapes.children[i];
      const posRatio = - 4 * ratio ** 2 + 4 * ratio;
      const pos = 1500 * posRatio;
      shape.position.set(i == 0 ? - pos : pos, 0, 0);
    }
    this.shapes.rotation.x = THREE.MathUtils.degToRad(- 360 * ratio);
    this.shapes.rotation.z = THREE.MathUtils.degToRad(- 360 * ratio);
  }

}
