'use strict';

import * as THREE from 'three';
import Founder from './founder.js';

export default class Kamon2 extends Founder {

  constructor() {

    super();

    // メッシュグループ
    this.group = new THREE.Group();

    // 描画アニメーションの分割数
    this.divCount = 1000;

    // スクローラーの高さを指定
    this.rollHeight = 2000;

    // 家紋１つ当たりのスクロールの所要時間
    this.scrollDur = 7500;

    // infoのテキスト
    this.jpNameText = '';
    this.jpDescText = '';
    this.enNameText = '';
    this.enDescText = '';

    this.guidelineParams = {
      drawIn   : [0.10, 0.40],
      drawOut  : [0.55, 0.80],
      fadeIn1  : [0.00, 0.00],
      fadeOut1 : [0.35, 0.40],
      fadeIn2  : [0.625, 0.675],
      fadeOut2 : [0.80, 0.85],
      scaleIn  : [0.00, 0.00],
      scaleOut : [0.70, 0.90],
    }

    // アウトラインの表示アニメーションパラメータ
    this.outlineParams = {
      fadeIn1  : [0.30, 0.35],
      fadeOut1 : [0.35 ,0.40],
      fadeIn2  : [0.60, 0.65],
      fadeOut2 : [0.65, 0.70],
      scaleIn  : [0.00, 0.00],
      scaleOut : [0.70, 0.90],
    }

    // 図形の表示アニメーションパラメータ
    this.shapeParams = {
      fadeIn   : [0.35, 0.40],
      fadeOut  : [0.60, 0.65],
    }

    // 説明欄の表示アニメーションパラメータ
    this.descParams = {
      fadeIn   : [0.35, 0.40],
      fadeOut  : [0.60, 0.65],
    }

    // オブジェクト格納用のグループ
    this.guidelines = new THREE.Group();
    this.outlines = new THREE.Group();
    this.outlineEdges = new THREE.Group();
    this.shapes = new THREE.Group();

    // 共有マテリアル
    this.guideMat = new THREE.LineBasicMaterial({
      transparent: true
    });

    this.subMat = new THREE.LineBasicMaterial({
      transparent: true
    });

    this.outlineMat = new THREE.LineBasicMaterial({
      side: THREE.DoubleSide,
      transparent: true
    });

    this.edgeMat = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      transparent: true,
    });

    this.shapeMat = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      transparent: true,
    });

  }

  // オブジェクトを生成
  generate = () => {
    return this.group;
  }

  // テーマカラー変更
  changeTheme(frontColor, backColor, guideColor, subColor) {

    // ガイドラインの色を変更
    this.guideMat.color = new THREE.Color(guideColor);
    this.subMat.color = new THREE.Color(subColor);

    // アウトラインの色を変更
    this.outlineMat.color = new THREE.Color(frontColor);
    this.edgeMat.color = new THREE.Color(frontColor);

    // 図形の色を変更
    this.shapeMat.color = new THREE.Color(frontColor);
  }

  // ガイドラインのメッシュを生成
  guidelineGen = (points) => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    geometry.setDrawRange(0, 0);
    return new THREE.Line(geometry, this.guideMat);
  }

  // サブガイドラインのメッシュを生成
  sublineGen = (points) => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    geometry.setDrawRange(0, 0);
    return new THREE.Line(geometry, this.subMat);
  }

  // アウトラインの円弧のジオメトリを生成
  outlineCircleGeoGen = (a, b, r, f, t, d) => {
    const points = this.circlePointGen(a, b, r , f, t, d);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }

  // アウトラインの円弧のメッシュを生成
  outlineCircleMeshGen = (geometry, a, b, r, g, rotX, rotY, rotZ) => {
    const mesh = new THREE.Line(geometry, this.outlineMat);
    const scale = (r + g) / r;
    var bTheta, oblique;
    if (a == 0 && b == 0) {
      bTheta = 0;
      oblique = 0;
    } else if (a == 0 && b != 0) {
      bTheta = THREE.MathUtils.degToRad(90);
      oblique = b;
    } else if (a != 0 && b == 0) {
      bTheta = THREE.MathUtils.degToRad(0);
      oblique = a;
    } else {
      bTheta = Math.atan(b / a);
      oblique = a / Math.cos(bTheta);
    }
    const d = oblique - oblique * scale;
    const power = Math.abs(rotY) / Math.PI;
    const sign = power % 2 == 0 ? 1 : -1;
    const theta = bTheta + rotZ;
    const posX = d * Math.cos(theta) * sign;
    const posY = d * Math.sin(theta);
    mesh.scale.set(scale, scale, 0);
    mesh.position.set(posX, posY, 0);
    mesh.rotation.set(rotX, rotY, rotZ);
    return mesh;
  }

  // アウトラインの直線のジオメトリを生成
  outlineLineGeoGen = (a, b, r, f, t, d) => {
    const points = this.linePointGen(a, b, r, f, t, d);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }

  outlineGeoGen = (v1, v2) => {
    const w = 4;
    const form = this.from2Points2(v1, v2);
    const theta = Math.atan(- 1 / form.a);
    const p = w * Math.cos(theta);
    const q = w * Math.sin(theta);
    const point1 = new THREE.Vector3(v1.x + p, v1.y + q, 0);
    const point2 = new THREE.Vector3(v1.x - p, v1.y - q, 0);
    const point3 = new THREE.Vector3(v2.x - p, v2.y - q, 0);
    const point4 = new THREE.Vector3(v2.x + p, v2.y + q, 0);
    const points = [point1, point2, point3, point4];
    return this.shapeGeoGen(points);
  }

  lineShift = (v1, v2, w) => {
    const form = this.from2Points2(v1, v2);
    const theta = Math.atan(- 1 / form.a);
    const p = w * Math.cos(theta);
    const q = w * Math.sin(theta);
    const point1 = new THREE.Vector3(v1.x + p, v1.y + q, 0);
    const point2 = new THREE.Vector3(v2.x + p, v2.y + q, 0);
    return this.from2Points2(point1, point2); 
    // return [point1, point2];
  }

  // アウトラインの直線のメッシュを生成
  outlineLineMeshGen = (geometry, a, b, g, rotX, rotY, rotZ) => {
    const mesh = new THREE.Line(geometry, this.outlineMat);
    var bTheta;
    if (b == 0) {
      bTheta = THREE.MathUtils.degToRad(90);
    } else if (a == 0) {
      bTheta = THREE.MathUtils.degToRad(0);
    } else {
      bTheta = Math.atan(a);
    }
    const power = Math.abs(rotY) / Math.PI;
    const sign = power % 2 == 0 ? 1 : -1;
    const theta = (bTheta + rotZ) * sign;
    const rad = theta + THREE.MathUtils.degToRad(90);
    const x = g * Math.cos(rad);
    const y = g * Math.sin(rad);
    mesh.position.set(x, y, 0);
    mesh.rotation.set(rotX, rotY, rotZ);
    return mesh;
  }

  // アウトラインの直線エッジのジオメトリを生成
  outlineEdgeGeoGen = (a, b, r, f, t) => {
    var geometries = [];
    const w = 6;
    const edgeF = this.straight(a, b, r, b == 0 ? undefined : f, b == 0 ? f : undefined);
    const edgeT = this.straight(a, b, r, b == 0 ? undefined : t, b == 0 ? t : undefined);
    const edges = [edgeF, edgeT];
    edges.forEach((edge) => {
      const points = this.curvePointGen(edge.x, edge.y, w, 0, 360, false);
      const shape = new THREE.Shape(points);
      const geometry = new THREE.ShapeGeometry(shape);
      geometries.push(geometry);
    })
    return geometries;
  }

  // アウトラインの直線エッジのメッシュを生成
  outlineEdgeMeshGen = (geometry, rotX, rotY, rotZ) => {
    const mesh = new THREE.Mesh(geometry, this.edgeMat);
    mesh.rotation.set(rotX, rotY, rotZ);
    return mesh;
  }

  // 直線の描画座標を生成
  linePointGen = (a, b, r, f, t, d) => {
    const points = [];
    for (var i = 0;i <= d - 1;i ++) {
      const p = THREE.MathUtils.damp(f, t, 10, i / (d - 1));
      var point;
      if (b == 0) {
        point = this.straight(a, b, r, undefined, p);
      } else {
        point = this.straight(a, b, r, p, undefined);
      }
      points.push(point);
    }
    return points;
  }

  // 直線の描画座標を生成
  linePointGen2 = (v1, v2, s, d) => {
    const form = this.from2Points2(v1, v2);
    const f = v1.x > v2.x ? v1.x + s : v1.x - s;
    const t = v1.x > v2.x ? v2.x - s : v2.x + s;
    return this.linePointGen(form.a, 1, form.b, f, t, d);
  }

  // 円弧の描画座標を生成
  circlePointGen = (a, b, r, f, t, d) => {
    const points = [];
    for (var i = 0;i <= d - 1;i ++) {
      const p = THREE.MathUtils.damp(f, t, 10, i / (d - 1));
      const point = this.circle(a, b, r, p);
      points.push(point);
    }
    return points;
  }

  // 円弧の描画座標を生成
  circlePointGen2 = (circle, angle, d) => {
    return this.circlePointGen(circle.a, circle.b, circle.r, angle[0], angle[1], d);
    // const points = [];
    // for (var i = 0;i <= d - 1;i ++) {
    //   const p = THREE.MathUtils.damp(f, t, 10, i / (d - 1));
    //   const point = this.circle(a, b, r, p);
    //   points.push(point);
    // }
    // return points;
  }

  // 円弧の図形用座標を生成
  curvePointGen = (a, b, r, f, t, c) => {
    const curve = new THREE.EllipseCurve(
      a, b,
      r, r,
      THREE.MathUtils.degToRad(f), THREE.MathUtils.degToRad(t),
      c, 0
    );
    return curve.getPoints(100);
  }

  // 円弧の図形用座標を生成
  curvePointGen2 = (arc, angle) => {
    return this.curvePointGen(
      arc.a, arc.b, arc.r, 
      angle[0], angle[1], angle[0] > angle[1] ? true : false);
  }

  // ポイントからシェイプを生成
  shapeGeoGen = (shapes, pathes) => {
    const shape = new THREE.Shape(shapes);
    if (pathes) {
      const path = new THREE.Path(pathes);
      shape.holes.push(path);
    }
    const geometry = new THREE.ShapeGeometry(shape);
    return geometry;
  }

  // 円弧の座標を求める式（a: 中心X座標, b: 中心Y座標, r: 半径, t:角度）
  circlePoint(circle, theta) {
    return this.circle(circle.a, circle.b, circle.r, theta);
  }

  // 円弧の角度を求める式（v1: 円情報(a, b, r), v2: 円周座標(vector3)）
  arcAngle(v1, v2) {
    return this.arc(v1.a, v1.b, v2.x, v2.y);
  }

  // ガイドラインの表示制御
  guidelineDisplayControl = (progRatio) => {
    const param = this.guidelineParams;
    const drawInRatio   = THREE.MathUtils.smoothstep(progRatio, param.drawIn[0]  , param.drawIn[1]  );
    const drawOutRatio  = THREE.MathUtils.smoothstep(progRatio, param.drawOut[0] , param.drawOut[1] );
    const fadeInRatio1  = THREE.MathUtils.smoothstep(progRatio, param.fadeIn1[0] , param.fadeIn1[1] );
    const fadeOutRatio1 = THREE.MathUtils.smoothstep(progRatio, param.fadeOut1[0], param.fadeOut1[1]);
    const fadeInRatio2  = THREE.MathUtils.smoothstep(progRatio, param.fadeIn2[0] , param.fadeIn2[1] );
    const fadeOutRatio2 = THREE.MathUtils.smoothstep(progRatio, param.fadeOut2[0], param.fadeOut2[1]);
    const scaleInRatio  = THREE.MathUtils.smoothstep(progRatio, param.scaleIn[0] , param.scaleIn[1] );
    const scaleOutRatio = THREE.MathUtils.smoothstep(progRatio, param.scaleOut[0], param.scaleOut[1]);

    // 描画アニメーションの進捗
    const drawDelayFactor = 0.03;
    const maxDrawDelay = drawDelayFactor * this.guidelines.children.length;
    const drawRatio = drawInRatio - drawOutRatio;

    // スケールアニメーションの進捗
    const scaleDelayFactor = 0.04;
    const maxScaleDelay = scaleDelayFactor * this.guidelines.children.length;
    const scaleRatio = scaleInRatio - scaleOutRatio;

    // フェードアニメーションの進捗
    const fadeRatio = (fadeInRatio1 - fadeOutRatio1) + (fadeInRatio2 - fadeOutRatio2);

    for (var i = 0;i <= this.guidelines.children.length - 1;i ++) {
      const drawDelay = drawDelayFactor * i;
      const drawRatioD = THREE.MathUtils.inverseLerp(drawDelay, 1.0 + drawDelay - maxDrawDelay, drawRatio);

      const scaleDelay = scaleDelayFactor * (this.guidelines.children.length - i);
      const scaleRatioD = THREE.MathUtils.smootherstep(scaleRatio, scaleDelay, 1.0 + scaleDelay - maxScaleDelay);

      const control = (mesh) => {
        mesh.geometry.setDrawRange(0, this.divCount * drawRatioD);
        mesh.material.opacity = fadeRatio;
        mesh.scale.set(scaleRatioD, scaleRatioD);
      }

      const child = this.guidelines.children[i];
      if (child.isGroup) {
        child.children.forEach((mesh) => control(mesh));
      } else {
        control(child);
      }
    }
  }

  // アウトラインの表示制御
  outlineDisplayControl = (progRatio) => {
    const param = this.outlineParams;
    const fadeInRatio1  = THREE.MathUtils.smoothstep(progRatio, param.fadeIn1[0] , param.fadeIn1[1] );
    const fadeOutRatio1 = THREE.MathUtils.smoothstep(progRatio, param.fadeOut1[0], param.fadeOut1[1]);
    const fadeInRatio2  = THREE.MathUtils.smoothstep(progRatio, param.fadeIn2[0] , param.fadeIn2[1] );
    const fadeOutRatio2 = THREE.MathUtils.smoothstep(progRatio, param.fadeOut2[0], param.fadeOut2[1]);
    const scaleInRatio  = THREE.MathUtils.smoothstep(progRatio, param.scaleIn[0] , param.scaleIn[1] );
    const scaleOutRatio = THREE.MathUtils.smoothstep(progRatio, param.scaleOut[0], param.scaleOut[1]);

    // スケールアニメーションの進捗
    const scaleDelayFactor = 0.0;
    const maxScaleDelay = scaleDelayFactor * this.outlines.children.length;
    const scaleRatio = scaleInRatio - scaleOutRatio;

    // フェードアニメーションの進捗
    const fadeRatio = (fadeInRatio1 - fadeOutRatio1) + (fadeInRatio2 - fadeOutRatio2);

    for (var i = 0;i <= this.outlines.children.length - 1;i ++) {

      const scaleDelay = scaleDelayFactor * i;
      const scaleRatioD = THREE.MathUtils.smootherstep(scaleRatio, scaleDelay, 1.0 + scaleDelay - maxScaleDelay);

      const control = (mesh) => {
        mesh.material.opacity = fadeRatio;
        mesh.scale.set(scaleRatioD, scaleRatioD);
      }

      const child = this.outlines.children[i];
      if (child.isGroup) {
        child.children.forEach((mesh) => control(mesh));
      } else {
        control(child);
      }
    }

    for (var i = 0;i <= this.outlineEdges.children.length - 1;i ++) {
      const scaleDelay = scaleDelayFactor * i;
      const scaleRatioD = THREE.MathUtils.smootherstep(scaleRatio, scaleDelay, 1.0 + scaleDelay - maxScaleDelay);

      mesh.material.opacity = fadeRatio * 1.8;
      mesh.scale.set(scaleRatioD, scaleRatioD);
    }
  }

  // 図形の表示制御
  shapeDisplayControl = (progRatio) => {
    const param = this.shapeParams;
    const fadeInRatio  = THREE.MathUtils.smoothstep(progRatio, param.fadeIn[0] , param.fadeIn[1] );
    const fadeOutRatio = THREE.MathUtils.smoothstep(progRatio, param.fadeOut[0], param.fadeOut[1]);

    const fadeRatio = fadeInRatio - fadeOutRatio;

    const control = (mesh) => {
      mesh.material.opacity = fadeRatio;
    }

    this.shapes.children.forEach((child) => {
      if (child.isGroup) {
        child.children.forEach((mesh) => control(mesh));
      } else {
        control(child);
      }
    })
  }


}
