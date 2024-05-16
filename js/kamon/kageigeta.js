'use strict';

import * as THREE from 'three';
import Kamon from '../kamon.js';

export default class Kageigeta extends Kamon {
  constructor() {

    super();

    // スクロールの所要時間
    this.scrollDur = 7000;

    // 頂点を格納する配列
    this.vertices = [];

    // ガイドラインの作成
    this.generateGuidelines();

    // 図形の頂点を取得
    this.getVertices();

    // アウトラインの作成
    this.generateOutlines();

    // 塗りつぶし図形の描画
    this.generateShapes();

    // infoの準備
    this.jpName.textContent = '陰井桁';
    this.jpDesc.innerHTML = '井戸を真上から見た形状をモチーフにした家紋です。実際の井戸は、地上の木組み部分を「井桁」、地下の円筒状の部分を「井筒」と呼びますが、家紋においては、正方形のものが「井筒」、菱形のものが「井桁」と呼ばれています。苗字に「井」のつく家の家紋として使われることが多いです。';
    this.enName.textContent = 'Kage-Igeta';
    this.enDesc.innerHTML = 'This family crest is based on the shape of a well seen from directly above.<br>In actual wells, the wood-framed part above ground is called "Igeta", and the cylindrical part underground is called "Izutsu", but in the family crest, the square one is called "Izutsu", and the diamond-shaped one is called "Igeta".<br>It is often used as a family crest for families with an "I" in their last name.';
  }

  // ガイドラインを作成
  generateGuidelines = () => {
    const a = 0.8;
    const bs = [400, 500, 960, 1060, 1180, 1280];
    const divCount = 1000;
    bs.forEach((b) => {
      for (var q = 0;q <= 3;q ++) {
        var points = [];

        var startX, endX, a1, b1, g1, g2;
        if (q == 0) {
          a1 = a, b1 = b, g1 = -this.edge, g2 = this.edge;
          startX = g1;
          endX   = (g2 - b1) / a1;
        } else if (q == 1) {
          a1 = -a, b1 = b, g1 = this.edge, g2 = this.edge;
          startX = (g1 - b1) / a1;
          endX   = g2;
        } else if (q == 2) {
          a1 = a, b1 = -b, g1 = this.edge, g2 = -this.edge;
          startX = g1;
          endX   = (g2 - b1) / a1;
        } else if (q == 3) {
          a1 = -a, b1 = -b, g1 = -this.edge, g2 = -this.edge;
          startX = (g1 - b1) / a1;
          endX   = g2;
        }

        for (var d = 0;d <= divCount - 1;d ++) {
          const midX = THREE.MathUtils.damp(startX, endX, 10, d / divCount);
          const mid = new THREE.Vector3(midX, a1 * midX + b1, 0);
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
      }
    })
    this.scene.add(this.guidelines);
  }

  // アウトラインを作成
  generateOutlines = () => {
    const divCount = 1000;
    this.vertices.forEach((figure) => {
      figure.forEach((vers) => {
        for (var i = 0;i <= vers.length - 2;i ++) {
          const gs = [0, 1, -1, 2, -2, 3, -3];
          gs.forEach((g) => {
            const startX = vers[i].x + g;
            const startY = vers[i].y;
            const endX   = vers[i + 1].x + g;
            const endY   = vers[i + 1].y;
            const a1 = (startY - endY) / (startX - endX);
            const b1 = (startX * endY - endX * startY) / (startX - endX);
            const points = [];
            if (startX == endX && startY == endY) return;
            for (var d = 0;d <= divCount - 1;d ++) {
              const midX = THREE.MathUtils.lerp(startX, endX, d / divCount);
              const mid = {x: midX, y: a1 * midX + b1};
              points.push(new THREE.Vector3(mid.x, mid.y, 1));
            }
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            geometry.setDrawRange(0, 0);
            const material = new THREE.LineBasicMaterial({
              color: this.frontColor,
              side: THREE.DoubleSide,
              transparent: true
            });
            const line = new THREE.Line(geometry, material);
            this.outlines.add(line);
          })
        }
      })
    })
    this.scene.add(this.outlines);
  }

  // 図形を生成
  generateShapes = () => {
    this.vertices.forEach((figure) => {
      const shape = new THREE.Shape();
      const path = new THREE.Path();
      for (var i = 0;i <= figure.length - 1;i ++) {
        const vers = figure[i];
        if (i == 1) {
          for (var j = 0;j <= vers.length - 1;j ++) {
            const ver = vers[j];
            if (j == 0) {
              shape.moveTo(ver.x, ver.y);
            } else {
              shape.lineTo(ver.x, ver.y);
            }
          }
        } else {
          for (var j = 0;j <= vers.length - 1;j ++) {
            const ver = vers[j];
            if (j == 0) {
              path.moveTo(ver.x, ver.y);
            } else {
              path.lineTo(ver.x, ver.y);
            }
          }
        }
      }
      shape.holes.push(path);

      const material = new THREE.MeshBasicMaterial({
        color: this.frontColor,
        side: THREE.DoubleSide,
        opacity: 0.0,
        transparent: true
      });
      const geometry = new THREE.ShapeGeometry(shape);
      const mesh = new THREE.Mesh(geometry, material);
      this.shapes.add(mesh);
      // this.scene.add(mesh);
    })
    this.scene.add(this.shapes);
  }

  // 図形の頂点を取得
  getVertices = () => {
    var vs = [];
    for (var i = 0;i <= 1;i ++) {
      const arr = [];
      var b;
      if (i == 0) {
        b = 400;
      } else {
        b = 500;
      }
      arr.push(this.getIntersect( 0.8,  b, -0.8, -b));
      arr.push(this.getIntersect( 0.8,  b, -0.8,  b));
      arr.push(this.getIntersect(-0.8,  b,  0.8, -b));
      arr.push(this.getIntersect( 0.8, -b, -0.8, -b));
      arr.push(this.getIntersect(-0.8, -b,  0.8,  b));
      vs.push(arr);
    }
    this.vertices.push(vs);

    vs = [];
    const arr1 = [];
    arr1.push(this.getIntersect(-0.8,  -960,  0.8,   960));
    arr1.push(this.getIntersect(-0.8,  -960,  0.8,  1180));
    arr1.push(this.getIntersect( 0.8,  1180, -0.8,  -500));
    arr1.push(this.getIntersect(-0.8,  -500,  0.8,   960));
    arr1.push(this.getIntersect( 0.8,   960, -0.8,   500));
    arr1.push(this.getIntersect(-0.8,   500,  0.8,  1180));
    arr1.push(this.getIntersect( 0.8,  1180, -0.8,   960));
    arr1.push(this.getIntersect(-0.8,   960,  0.8,   960));

    arr1.push(this.getIntersect( 0.8,   960, -0.8,   960));
    arr1.push(this.getIntersect( 0.8,   960, -0.8,  1180));
    arr1.push(this.getIntersect(-0.8,  1180,  0.8,   500));
    arr1.push(this.getIntersect( 0.8,   500, -0.8,   960));
    arr1.push(this.getIntersect(-0.8,   960,  0.8,  -500));
    arr1.push(this.getIntersect( 0.8,  -500, -0.8,  1180));
    arr1.push(this.getIntersect(-0.8,  1180,  0.8,  -960));
    arr1.push(this.getIntersect( 0.8,  -960, -0.8,   960));

    arr1.push(this.getIntersect(-0.8,   960,  0.8,  -960));
    arr1.push(this.getIntersect(-0.8,   960,  0.8, -1180));
    arr1.push(this.getIntersect( 0.8, -1180, -0.8,   500));
    arr1.push(this.getIntersect(-0.8,   500,  0.8,  -960));
    arr1.push(this.getIntersect( 0.8,  -960, -0.8,  -500));
    arr1.push(this.getIntersect(-0.8,  -500,  0.8, -1180));
    arr1.push(this.getIntersect( 0.8, -1180, -0.8,  -960));
    arr1.push(this.getIntersect(-0.8,  -960,  0.8,  -960));

    arr1.push(this.getIntersect( 0.8,  -960, -0.8,  -960));
    arr1.push(this.getIntersect( 0.8,  -960, -0.8, -1180));
    arr1.push(this.getIntersect(-0.8, -1180,  0.8,  -500));
    arr1.push(this.getIntersect( 0.8,  -500, -0.8,  -960));
    arr1.push(this.getIntersect(-0.8,  -960,  0.8,   500));
    arr1.push(this.getIntersect( 0.8,   500, -0.8, -1180));
    arr1.push(this.getIntersect(-0.8, -1180,  0.8,   960));
    arr1.push(this.getIntersect( 0.8,   960, -0.8,  -960));

    vs.push(arr1);

    const arr2 = [];
    arr2.push(this.getIntersect(-0.8, -1060,  0.8,  1060));
    arr2.push(this.getIntersect(-0.8, -1060,  0.8,  1280));
    arr2.push(this.getIntersect( 0.8,  1280, -0.8,  -400));
    arr2.push(this.getIntersect(-0.8,  -400,  0.8,  1060));
    arr2.push(this.getIntersect( 0.8,  1060, -0.8,   400));
    arr2.push(this.getIntersect(-0.8,   400,  0.8,  1280));
    arr2.push(this.getIntersect( 0.8,  1280, -0.8,  1060));
    arr2.push(this.getIntersect(-0.8,  1060,  0.8,  1060));

    arr2.push(this.getIntersect( 0.8,  1060, -0.8,  1060));
    arr2.push(this.getIntersect( 0.8,  1060, -0.8,  1280));
    arr2.push(this.getIntersect(-0.8,  1280,  0.8,   400));
    arr2.push(this.getIntersect( 0.8,   400, -0.8,  1060));
    arr2.push(this.getIntersect(-0.8,  1060,  0.8,  -400));
    arr2.push(this.getIntersect( 0.8,  -400, -0.8,  1280));
    arr2.push(this.getIntersect(-0.8,  1280,  0.8, -1060));
    arr2.push(this.getIntersect( 0.8, -1060, -0.8,  1060));

    arr2.push(this.getIntersect(-0.8,  1060,  0.8, -1060));
    arr2.push(this.getIntersect(-0.8,  1060,  0.8, -1280));
    arr2.push(this.getIntersect( 0.8, -1280, -0.8,   400));
    arr2.push(this.getIntersect(-0.8,   400,  0.8, -1060));
    arr2.push(this.getIntersect( 0.8, -1060, -0.8,  -400));
    arr2.push(this.getIntersect(-0.8,  -400,  0.8, -1280));
    arr2.push(this.getIntersect( 0.8, -1280, -0.8, -1060));
    arr2.push(this.getIntersect(-0.8, -1060,  0.8, -1060));

    arr2.push(this.getIntersect( 0.8, -1060, -0.8, -1060));
    arr2.push(this.getIntersect( 0.8, -1060, -0.8, -1280));
    arr2.push(this.getIntersect(-0.8, -1280,  0.8,  -400));
    arr2.push(this.getIntersect( 0.8,  -400, -0.8, -1060));
    arr2.push(this.getIntersect(-0.8, -1060,  0.8,   400));
    arr2.push(this.getIntersect( 0.8,   400, -0.8, -1280));
    arr2.push(this.getIntersect(-0.8, -1280,  0.8,  1060));
    arr2.push(this.getIntersect( 0.8,  1060, -0.8, -1060));

    vs.push(arr2);
    this.vertices.push(vs);
  }

  // 図形を回転させるアニメーション制御
  shapesRotationControl(start, end) {
    const ratio = THREE.MathUtils.smoothstep(this.progRatio, start, end);
    this.shapes.rotation.y = -360 * ratio * (Math.PI / 180);
  }

  render() {

    // ガイドラインの表示アニメーション制御
    this.guidelinesDrawControl(0.05, 0.35, 1000, 0.03);

    // グリッドをフェードアウト
    this.grid.fadeOut(this.progRatio, 0.35, 0.5);

    // アウトラインの表示アニメーション制御
    this.outlinesDrawControl(0.35, 0.5, 1000);

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
