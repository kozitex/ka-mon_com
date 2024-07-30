'use strict';

import * as THREE from 'three';
import Founder from './founder2.js';

export default class Kamon extends Founder {

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

    // ガイドラインの表示アニメーションパラメータ
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

  // ２点を結ぶ直線のアウトラインジオメトリを生成（v1, v2: 直線の始点終点）
  outlineGeoGen = (v1, v2) => {
    const w = 4;
    const form = this.from2Points(v1, v2);
    var theta;
    if (form.b == 0) {
      theta = THREE.MathUtils.degToRad(0);
    } else if (form.a == 0) {
      theta = THREE.MathUtils.degToRad(90);
    } else {
      theta = Math.atan(- 1 / form.a);
    }
    const p = w * Math.cos(theta);
    const q = w * Math.sin(theta);
    const point1 = new THREE.Vector3(v1.x + p, v1.y + q, 0);
    const point2 = new THREE.Vector3(v1.x - p, v1.y - q, 0);
    const point3 = new THREE.Vector3(v2.x - p, v2.y - q, 0);
    const point4 = new THREE.Vector3(v2.x + p, v2.y + q, 0);
    const points = [point1, point2, point3, point4];
    return this.shapeGeoGen(points);
  }

  // 直線の描画軌跡の座標を生成（v1, v2: 直線を表す２点の座標, s: 直線前後に余分に引く線の長さ, d: 軌跡の座標数）
  lineLocusGen = (v1, v2, s, d) => {
    const form = this.from2Points(v1, v2);
    const a = form.a, b = form.b, c = form.c;
    var f, t;
    if (b == 0) {
      f = v1.y > v2.y ? v1.y + s : v1.y - s;
      t = v1.y > v2.y ? v2.y - s : v2.y + s;
    } else {
      f = v1.x > v2.x ? v1.x + s : v1.x - s;
      t = v1.x > v2.x ? v2.x - s : v2.x + s;
    }

    const points = [];
    for (var i = 0;i <= d - 1;i ++) {
      const p = THREE.MathUtils.damp(f, t, 10, i / (d - 1));
      if (b == 0) {
        points.push(new THREE.Vector3(c, p, 0));
      } else {
        points.push(this.straight(a, b, c, p, undefined));
      }
    }
    return points;
  }

  // 円弧の描画軌跡の座標を生成（circle: {a: 円の中心X,b: 円の中心Y,r: 円の半径}, angle: 弧の角度[0: 始点, 1:終点], d: 軌跡の座標数）
  circleLocusGen = (circle, angle, d) => {
    const points = [];
    const a = circle.a, b = circle.b, r = circle.r;
    const f = angle[0], t = angle[1];
    for (var i = 0;i <= d - 1;i ++) {
      const p = THREE.MathUtils.damp(f, t, 10, i / (d - 1));
      const point = this.circumPoint({a: a, b: b, r: r}, p);
      points.push(point);
    }
    return points;
  }

  // 円弧の図形用座標を生成（circle: {a: 円の中心X,b: 円の中心Y,r: 円の半径}, angle: 弧の角度[0: 始点, 1:終点], clockwise: 時計回りか否かtrue/false）
  curvePointGen = (circle, angle, clockwise) => {
    const a = circle.a, b = circle.b, r = circle.r;
    const f = THREE.MathUtils.degToRad(angle[0]),
          t = THREE.MathUtils.degToRad(angle[1]);
    const curve = new THREE.EllipseCurve(a, b, r, r, f, t, clockwise, 0);
    return curve.getPoints(100);
  }

  // 円弧のアウトラインジオメトリを生成（circle: {a: 円の中心X,b: 円の中心Y,r: 円の半径}, angle: 弧の角度[0: 始点, 1:終点], clockwise: 時計回りか否かtrue/false）
  curveOutlineGeoGen = (circle, angle, clockwise) => {
    const w = 4;
    const arc1 = {a: circle.a, b: circle.b, r: circle.r + w};
    const arc2 = {a: circle.a, b: circle.b, r: circle.r - w};
    const point1 = this.curvePointGen(arc1, [angle[0], angle[1]], clockwise);
    const point2 = this.curvePointGen(arc2, [angle[1], angle[0]], !clockwise);
    const points = point2.concat(point1);
    const geo = this.shapeGeoGen(points);
    return geo;
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
