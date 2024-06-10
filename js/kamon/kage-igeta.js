'use strict';

import * as THREE from 'three';
import Kamon from '../kamon.js';

export default class KageIgeta extends Kamon {
  constructor() {

    super();

    // スクロールの所要時間
    this.scrollDur = 7000;

    this.angleFr = 90;
    this.angleTo = 450;

    // 頂点を格納する配列
    this.vertices = [];

    // ガイドラインの作成
    this.generateGuidelines();

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
    const divCount = 1000;
    const a = 0.8;
    const bs = [400, 500, 960, 1060, 1180, 1280];
    const theta = Math.atan(a);
    for (var i = 0;i <= 3;i ++) {
      const group = new THREE.Group();
      bs.forEach((b) => {
        const line = this.lineGen(a, 1, b, -this.edge, this.edge, divCount, this.guideColor);
        line.rotation.x = - THREE.MathUtils.degToRad(180) * Math.trunc(i / 2);
        line.rotation.y = - THREE.MathUtils.degToRad(180) * Math.trunc(i % 2);
        group.add(line);
      })
      this.guidelines.add(group);
    }
    this.scene.add(this.guidelines);
  }

  // アウトラインを作成
  generateOutlines = () => {
    const divCount = 1000;
    const a = 0.8;
    const bs = [400, 500, 960, 1060, 1180, 1280];

    for (var i = 0;i <= 3;i ++) {

      const point01 = this.straight2(a, 1, bs[0], undefined, 0);
      const line01 = this.outlineGen(a, 1, bs[0], point01.x, 0, divCount, this.frontColor);
      line01.rotation.x = - THREE.MathUtils.degToRad(180) * Math.trunc(i / 2);
      line01.rotation.y = - THREE.MathUtils.degToRad(180) * Math.trunc(i % 2);
      this.outlines.add(line01);

      const point11 = this.straight2(a, 1, bs[1], undefined, 0);
      const line11 = this.outlineGen(a, 1, bs[1], point11.x, 0, divCount, this.frontColor);
      line11.rotation.x = - THREE.MathUtils.degToRad(180) * Math.trunc(i / 2);
      line11.rotation.y = - THREE.MathUtils.degToRad(180) * Math.trunc(i % 2);
      this.outlines.add(line11);

      const point21 = this.straight2(- a, 1, - bs[2], undefined, 0);
      const point22 = this.getIntersect(a, bs[4], - a, - bs[2]);
      const line21  = this.outlineGen(- a, 1, - bs[2], point21.x, point22.x, divCount, this.frontColor);
      line21.rotation.x = - THREE.MathUtils.degToRad(180) * Math.trunc(i / 2);
      line21.rotation.y = - THREE.MathUtils.degToRad(180) * Math.trunc(i % 2);

      const point23 = this.getIntersect(a, bs[4], - a, - bs[1]);
      const line22  = this.outlineGen(a, 1, bs[4], point22.x, point23.x, divCount, this.frontColor);
      line22.rotation.x = - THREE.MathUtils.degToRad(180) * Math.trunc(i / 2);
      line22.rotation.y = - THREE.MathUtils.degToRad(180) * Math.trunc(i % 2);

      const point24 = this.getIntersect(- a, - bs[1], a, bs[2]);
      const line23  = this.outlineGen(- a, 1, - bs[1], point23.x, point24.x, divCount, this.frontColor);
      line23.rotation.x = - THREE.MathUtils.degToRad(180) * Math.trunc(i / 2);
      line23.rotation.y = - THREE.MathUtils.degToRad(180) * Math.trunc(i % 2);

      const point25 = this.getIntersect(a, bs[2], - a, bs[1]);
      const line24  = this.outlineGen(a, 1, bs[2], point24.x, point25.x, divCount, this.frontColor);
      line24.rotation.x = - THREE.MathUtils.degToRad(180) * Math.trunc(i / 2);
      line24.rotation.y = - THREE.MathUtils.degToRad(180) * Math.trunc(i % 2);

      const point26 = this.getIntersect(- a, bs[1], a, bs[4]);
      const line25  = this.outlineGen(- a, 1, bs[1], point25.x, point26.x, divCount, this.frontColor);
      line25.rotation.x = - THREE.MathUtils.degToRad(180) * Math.trunc(i / 2);
      line25.rotation.y = - THREE.MathUtils.degToRad(180) * Math.trunc(i % 2);

      const point27 = this.getIntersect(a, bs[4], - a, bs[2]);
      const line26  = this.outlineGen(a, 1, bs[4], point26.x, point27.x, divCount, this.frontColor);
      line26.rotation.x = - THREE.MathUtils.degToRad(180) * Math.trunc(i / 2);
      line26.rotation.y = - THREE.MathUtils.degToRad(180) * Math.trunc(i % 2);

      const point28 = this.getIntersect(- a, bs[2], a, bs[2]);
      const line27  = this.outlineGen(- a, 1, bs[2], point27.x, point28.x, divCount, this.frontColor);
      line27.rotation.x = - THREE.MathUtils.degToRad(180) * Math.trunc(i / 2);
      line27.rotation.y = - THREE.MathUtils.degToRad(180) * Math.trunc(i % 2);

      this.outlines.add(line21, line22, line23, line24, line25, line26, line27);

      const point31 = this.straight2(- a, 1, - bs[3], undefined, 0);
      const point32 = this.getIntersect(- a, - bs[3], a, bs[5]);
      const line31  = this.outlineGen(- a, 1, - bs[3], point31.x, point32.x, divCount, this.frontColor);
      line31.rotation.x = - THREE.MathUtils.degToRad(180) * Math.trunc(i / 2);
      line31.rotation.y = - THREE.MathUtils.degToRad(180) * Math.trunc(i % 2);

      const point33 = this.getIntersect(a, bs[5], - a, - bs[0]);
      const line32  = this.outlineGen(a, 1, bs[5], point32.x, point33.x, divCount, this.frontColor);
      line32.rotation.x = - THREE.MathUtils.degToRad(180) * Math.trunc(i / 2);
      line32.rotation.y = - THREE.MathUtils.degToRad(180) * Math.trunc(i % 2);

      const point34 = this.getIntersect(- a, - bs[0], a, bs[3]);
      const line33  = this.outlineGen(- a, 1, - bs[0], point33.x, point34.x, divCount, this.frontColor);
      line33.rotation.x = - THREE.MathUtils.degToRad(180) * Math.trunc(i / 2);
      line33.rotation.y = - THREE.MathUtils.degToRad(180) * Math.trunc(i % 2);

      const point35 = this.getIntersect(a, bs[3], - a, bs[0]);
      const line34  = this.outlineGen(a, 1, bs[3], point34.x, point35.x, divCount, this.frontColor);
      line34.rotation.x = - THREE.MathUtils.degToRad(180) * Math.trunc(i / 2);
      line34.rotation.y = - THREE.MathUtils.degToRad(180) * Math.trunc(i % 2);

      const point36 = this.getIntersect(- a, bs[0], a, bs[5]);
      const line35  = this.outlineGen(- a, 1, bs[0], point35.x, point36.x, divCount, this.frontColor);
      line35.rotation.x = - THREE.MathUtils.degToRad(180) * Math.trunc(i / 2);
      line35.rotation.y = - THREE.MathUtils.degToRad(180) * Math.trunc(i % 2);

      const point37 = this.getIntersect(a, bs[5], - a, bs[3]);
      const line36  = this.outlineGen(a, 1, bs[5], point36.x, point37.x, divCount, this.frontColor);
      line36.rotation.x = - THREE.MathUtils.degToRad(180) * Math.trunc(i / 2);
      line36.rotation.y = - THREE.MathUtils.degToRad(180) * Math.trunc(i % 2);

      const point38 = this.getIntersect(- a, bs[3], a, bs[3]);
      const line37  = this.outlineGen(- a, 1, bs[3], point37.x, point38.x, divCount, this.frontColor);
      line37.rotation.x = - THREE.MathUtils.degToRad(180) * Math.trunc(i / 2);
      line37.rotation.y = - THREE.MathUtils.degToRad(180) * Math.trunc(i % 2);

      this.outlines.add(line31, line32, line33, line34, line35, line36, line37);
    }
    this.scene.add(this.outlines);
  }

  // 図形を生成
  generateShapes = () => {
    const divCount = 1000;
    const a = 0.8;
    const bs = [400, 500, 960, 1060, 1180, 1280];

    for (var i = 0;i <= 3;i ++) {
      const group = new THREE.Group();

      const point01 = this.straight2(a, 1, bs[0], undefined, 0);
      const line01 = this.linePointGen(a, 1, bs[0], point01.x, 0, divCount);

      const point11 = this.straight2(a, 1, bs[1], undefined, 0);
      const line11 = this.linePointGen(a, 1, bs[1], 0, point11.x, divCount);

      const points = line01.concat(line11);

      const shape = new THREE.Shape(points);
      const geometry = new THREE.ShapeGeometry(shape);
      const material = new THREE.MeshBasicMaterial({
        color: this.frontColor,
        side: THREE.DoubleSide,
        transparent: true,
      });
      material.opacity = 0.0;
      const mesh = new THREE.Mesh(geometry, material);
      mesh.visible = false;
      group.add(mesh);
      group.rotation.x = - THREE.MathUtils.degToRad(180) * Math.trunc(i / 2);
      group.rotation.y = - THREE.MathUtils.degToRad(180) * Math.trunc(i % 2);
      this.shapes.add(group);
    }

    for (var i = 0;i <= 3;i ++) {
      const group = new THREE.Group();

      const point21 = this.straight2(- a, 1, - bs[2], undefined, 0);
      const point22 = this.getIntersect(a, bs[4], - a, - bs[2]);
      const line21  = this.linePointGen(- a, 1, - bs[2], point21.x, point22.x, divCount);

      const point23 = this.getIntersect(a, bs[4], - a, - bs[1]);
      const line22  = this.linePointGen(a, 1, bs[4], point22.x, point23.x, divCount);

      const point24 = this.getIntersect(- a, - bs[1], a, bs[2]);
      const line23  = this.linePointGen(- a, 1, - bs[1], point23.x, point24.x, divCount);

      const point25 = this.getIntersect(a, bs[2], - a, bs[1]);
      const line24  = this.linePointGen(a, 1, bs[2], point24.x, point25.x, divCount);

      const point26 = this.getIntersect(- a, bs[1], a, bs[4]);
      const line25  = this.linePointGen(- a, 1, bs[1], point25.x, point26.x, divCount);

      const point27 = this.getIntersect(a, bs[4], - a, bs[2]);
      const line26  = this.linePointGen(a, 1, bs[4], point26.x, point27.x, divCount);

      const point28 = this.getIntersect(- a, bs[2], a, bs[2]);
      const line27  = this.linePointGen(- a, 1, bs[2], point27.x, point28.x, divCount);

      const point31 = this.straight2(- a, 1, bs[3], 0, undefined);
      const point32 = this.getIntersect(- a, bs[3], a, bs[5]);
      const line31  = this.linePointGen(- a, 1, bs[3], point31.x, point32.x, divCount);

      const point33 = this.getIntersect(a, bs[5], - a, bs[0]);
      const line32  = this.linePointGen(a, 1, bs[5], point32.x, point33.x, divCount);

      const point34 = this.getIntersect(- a, bs[0], a, bs[3]);
      const line33  = this.linePointGen(- a, 1, bs[0], point33.x, point34.x, divCount);

      const point35 = this.getIntersect(a, bs[3], - a, - bs[0]);
      const line34  = this.linePointGen(a, 1, bs[3], point34.x, point35.x, divCount);

      const point36 = this.getIntersect(- a, - bs[0], a, bs[5]);
      const line35  = this.linePointGen(- a, 1, - bs[0], point35.x, point36.x, divCount);

      const point37 = this.getIntersect(a, bs[5], - a, - bs[3]);
      const line36  = this.linePointGen(a, 1, bs[5], point36.x, point37.x, divCount);

      const point38 = this.getIntersect(- a, - bs[3], a, bs[3]);
      const line37  = this.linePointGen(- a, 1, - bs[3], point37.x, point38.x, divCount);

      const points = line21.concat(line22, line23, line24, line25, line26, line27, line31, line32, line33, line34, line35, line36, line37);
      const mesh = this.shapeGen(points, this.frontColor);
      mesh.visible = false;
      group.add(mesh);
      group.rotation.x = - THREE.MathUtils.degToRad(180) * Math.trunc(i / 2);
      group.rotation.y = - THREE.MathUtils.degToRad(180) * Math.trunc(i % 2);
      this.shapes.add(group);
    }

    this.scene.add(this.shapes);
  }

  // 図形を回転させるアニメーション制御
  shapesRotationControl(start, end) {
    const ratio = THREE.MathUtils.smoothstep(this.progRatio, start, end);
    this.shapes.rotation.y = -360 * ratio * (Math.PI / 180);
  }

  render() {

    // ファウンダーの表示アニメーション制御
    this.foundersDisplayControl(0.0, 0.05, 0.0, 0.15);

    // グリッドの表示アニメーション制御
    this.grid.displayControl(this.gridExist, this.progRatio, 0.0, 0.05, 0.35, 0.5);

    // ガイドラインの表示アニメーション制御
    this.guidelinesDisplayControl(0.05, 0.35, 0.5, 0.6, 1000, 0.1, 0.07);

    // アウトラインの表示アニメーション制御
    this.outlinesDisplayControl(0.35, 0.5, 0.65, 0.7, 1000);

    // 図形の表示アニメーション制御
    this.shapesDisplayControl(0.65, 0.75, 1.0, 1.0);

    // 図形を回転
    this.shapesRotationControl(0.8, 1.0);

    // descのアニメーションを制御
    this.descDisplayControl(0.8, 0.95, 1.0, 1.0);

    super.render();
  }
}
