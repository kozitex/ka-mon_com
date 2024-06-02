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
    this.vertices = [];
    this.sides = [];

    // ガイドラインの作成
    this.generateGuidelines();

    // アウトラインの作成
    this.generateOutlines();

    // 塗りつぶし図形の描画
    this.generateShapes();

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
      this.sides.push(coef);
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
        const side = this.sides[2];
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
        const circle1 = this.outlineCircleGen(0, 520 - this.pathW, this.pathW, 90, 180, divCount, this.frontColor);
        if (j == 1) circle1.rotation.y = THREE.MathUtils.degToRad(- 180);
        circle1.rotation.z = THREE.MathUtils.degToRad(- (360 / this.verNum) * i);
        this.outlines.add(circle1);

        // 対角線
        const theta2 = Math.asin(this.pathW / 245);
        const line1 = this.outlineGen(1, 0, - this.pathW, 520 - this.pathW, 245 * Math.cos(theta2), divCount, this.frontColor);
        if (j == 1) line1.rotation.y = THREE.MathUtils.degToRad(- 180);
        line1.rotation.z = THREE.MathUtils.degToRad(- (360 / this.verNum) * i);
        this.outlines.add(line1);

        // 中心円の弧
        const circle2 = this.outlineCircleGen(0, 0, 245, 90 + THREE.MathUtils.radToDeg(theta2), 90 + 36 - THREE.MathUtils.radToDeg(theta2), divCount, this.frontColor);
        if (j == 1) circle2.rotation.y = THREE.MathUtils.degToRad(- 180);
        circle2.rotation.z = THREE.MathUtils.degToRad(- (360 / this.verNum) * i);
        this.outlines.add(circle2);

        // 対角線
        const r = 361;
        const line2Start = this.circle(0, 0, 245, 90 + 36 - THREE.MathUtils.radToDeg(theta2));
        const theta3 = Math.asin(this.pathW / 1600);
        const point1 = this.circle(0, 0, 1600, 126 - THREE.MathUtils.radToDeg(theta3));
        const point2 = new THREE.Vector3(this.pathW * Math.cos(THREE.MathUtils.degToRad(45)), this.pathW * Math.sin(THREE.MathUtils.degToRad(45)), 0);
        const straight1 = this.from2Points(point1.x, point1.y, point2.x, point2.y);
        const straight2 = this.from2Points(this.vertices[4].x, this.vertices[4].y, this.vertices[0].x, this.vertices[0].y);
        const line2Basis = this.getIntersect(straight1.a, straight1.b, straight2.a, straight2.b);
        const line2End = new THREE.Vector3(line2Basis.x + r * Math.cos(THREE.MathUtils.degToRad(90 - 36)), line2Basis.y - r * Math.sin(THREE.MathUtils.degToRad(90 - 36)), 0);
        const straight3 =this.from2Points(line2Start.x, line2Start.y, line2End.x, line2End.y);
        const line2 = this.outlineGen(straight3.a, 1, straight3.b, line2Start.x, line2End.x, divCount, this.frontColor);
        if (j == 1) line2.rotation.y = THREE.MathUtils.degToRad(-180);
        line2.rotation.z = THREE.MathUtils.degToRad(- (360 / this.verNum) * i);
        this.outlines.add(line2);

        // 大きい円の弧
        const center = new THREE.Vector3(line2End.x + r * Math.cos(THREE.MathUtils.degToRad(36)), line2End.y + r * Math.sin(THREE.MathUtils.degToRad(36)), 0);
        const circle3 = this.outlineCircleGen(center.x, center.y, r, -144, -234, divCount, this.frontColor);
        if (j == 1) circle3.rotation.y = THREE.MathUtils.degToRad(-180);
        circle3.rotation.z = THREE.MathUtils.degToRad(- (360 / this.verNum) * i);
        this.outlines.add(circle3);

        // 頂点までの直線
        const point3 = new THREE.Vector3(center.x - r * Math.cos(THREE.MathUtils.degToRad(90 - 36)), center.y + r * Math.sin(THREE.MathUtils.degToRad(90 - 36)), 0);
        const line3 = this.outlineGen(straight2.a, 1, straight2.b, point3.x, this.vertices[0].x, divCount, this.frontColor);
        if (j == 1) line3.rotation.y = THREE.MathUtils.degToRad(- 180);
        line3.rotation.z = THREE.MathUtils.degToRad(- (360 / this.verNum) * i);
        this.outlines.add(line3);

      }
    }
    this.scene.add(this.outlines);
  }

  // 塗りつぶし図形を生成
  generateShapes = () => {

    const divCount = 1000;

    const group = new THREE.Group();
    const circle0 = this.circleShapeGen(0, 0, 191, this.angleFr, this.angleTo, divCount, this.frontColor);
    group.add(circle0);
    this.shapes.add(group);

    for (var i = 0;i <= this.verNum - 1;i ++) {
      const group1 = new THREE.Group();
      for (var j = 0;j <= 1;j ++) {

        // 小さい円の弧
        const circle1 = this.circlePointGen(0, 520 - this.pathW, this.pathW, 90, 180, divCount, this.frontColor);

        // 対角線
        const theta2 = Math.asin(this.pathW / 245);
        const line1 = this.linePointGen(1, 0, this.pathW, 520 - this.pathW, 245 * Math.cos(theta2), divCount, this.frontColor);

        // 中心円の弧
        const circle2 = this.circlePointGen(0, 0, 245, 90 + THREE.MathUtils.radToDeg(theta2), 90 + 36 - THREE.MathUtils.radToDeg(theta2), divCount, this.frontColor);

        // 対角線
        const r = 361;
        const line2Start = this.circle(0, 0, 245, 90 + 36 - THREE.MathUtils.radToDeg(theta2));
        const theta3 = Math.asin(this.pathW / 1600);
        const point1 = this.circle(0, 0, 1600, 126 - THREE.MathUtils.radToDeg(theta3));
        const point2 = new THREE.Vector3(this.pathW * Math.cos(THREE.MathUtils.degToRad(45)), this.pathW * Math.sin(THREE.MathUtils.degToRad(45)), 0);
        const straight1 = this.from2Points(point1.x, point1.y, point2.x, point2.y);
        const straight2 = this.from2Points(this.vertices[4].x, this.vertices[4].y, this.vertices[0].x, this.vertices[0].y);
        const line2Basis = this.getIntersect(straight1.a, straight1.b, straight2.a, straight2.b);
        const line2End = new THREE.Vector3(line2Basis.x + r * Math.cos(THREE.MathUtils.degToRad(90 - 36)), line2Basis.y - r * Math.sin(THREE.MathUtils.degToRad(90 - 36)), 0);
        const straight3 =this.from2Points(line2Start.x, line2Start.y, line2End.x, line2End.y);
        const line2 = this.linePointGen(straight3.a, 1, straight3.b, line2Start.x, line2End.x, divCount, this.frontColor);

        // 大きい円の弧
        const center = new THREE.Vector3(line2End.x + r * Math.cos(THREE.MathUtils.degToRad(36)), line2End.y + r * Math.sin(THREE.MathUtils.degToRad(36)), 0);
        const circle3 = this.circlePointGen(center.x, center.y, r, -144, -234, divCount, this.frontColor);

        // 頂点までの直線
        const point3 = new THREE.Vector3(center.x - r * Math.cos(THREE.MathUtils.degToRad(90 - 36)), center.y + r * Math.sin(THREE.MathUtils.degToRad(90 - 36)), 0);
        const line3 = this.linePointGen(straight2.a, 1, straight2.b, point3.x, this.vertices[0].x, divCount, this.frontColor);

        const points = circle1.concat(line1, circle2, line2, circle3, line3);

        const shape = new THREE.Shape(points);
        const geometry = new THREE.ShapeGeometry(shape);
        const material = new THREE.MeshBasicMaterial({
          color: this.frontColor,
          side: THREE.DoubleSide,
          transparent: true,
        });
        material.opacity = 0.0;
        const mesh = new THREE.Mesh(geometry, material);
        if (j == 1) mesh.rotation.y = THREE.MathUtils.degToRad(180);
        mesh.visible = false;
        group1.add(mesh);
      }
      group1.rotation.z = THREE.MathUtils.degToRad(- (360 / this.verNum) * i);
      this.shapes.add(group1);
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
    this.foundersDisplayControl(0.0, 0.05, 0.0, 0.6);

    // グリッドの表示アニメーション制御
    this.grid.displayControl(this.gridExist, this.progRatio, 0.0, 0.05, 0.4, 0.5);

    // ガイドラインの表示アニメーション制御
    this.guidelinesDisplayControl(0.05, 0.45, 0.55, 0.65, 1000, 0.1);

    // アウトラインの表示アニメーション制御
    this.outlinesDisplayControl(0.4, 0.6, 0.6, 0.7, 1000);

    // 図形の表示アニメーション制御
    this.shapesDisplayControl(0.65, 0.75, 1.0, 1.0);

    // 図形を回転
    this.shapesRotationControl(0.8, 1.0);

    // descの表示アニメーションを制御
    this.descDisplayControl(0.8, 0.95, 1.0, 1.0);

    super.render();
  }
}
