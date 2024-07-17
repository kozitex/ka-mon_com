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

    // ガイドラインのアニメーションパラメータ
    this.guidelineParams = {
      inStart : 0.0,
      inEnd   : 0.0,
      outStart: 0.0,
      outEnd  : 0.0,
      gDelay  : 0.0,
      lDelay  : 0.0,
    }

    // アウトラインのアニメーションパラメータ
    this.outlineParams = {
      inStart : 0.0,
      inEnd   : 0.0,
      outStart: 0.0,
      outEnd  : 0.0,
    }

    // 図形のアニメーションパラメータ
    this.shapeParams = {
      inStart : 0.0,
      inEnd   : 0.0,
      outStart: 0.0,
      outEnd  : 0.0,
    }

    // オブジェクト格納用のグループ
    this.guidelines = new THREE.Group();
    // this.guidelineSubs = new THREE.Group();
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
    const p = this.guidelineParams;
    const inRatio  = THREE.MathUtils.smoothstep(progRatio, p.inStart, p.inEnd);
    const outRatio = THREE.MathUtils.smoothstep(progRatio, p.outStart, p.outEnd);
    const groupNum = this.guidelines.children.length;
    for (var i = 0;i <= groupNum - 1;i ++) {
      const group = this.guidelines.children[i]
      const lineNum = group.children.length;
      const maxDelay = p.gDelay * groupNum + p.lDelay * lineNum;
      for (var j = 0;j <= lineNum - 1;j ++) {
        const line = group.children[j];
        const delay = p.gDelay * i + p.lDelay * j;
        const inRatioD = THREE.MathUtils.inverseLerp(delay, 1.0 + delay - maxDelay, inRatio);
        if (inRatio >= 0.0 && outRatio == 0.0) {
          line.visible = true;
          line.geometry.setDrawRange(0, this.divCount * inRatioD);
          line.material.opacity = 1.0 - outRatio;
        } else if (outRatio > 0.0 && outRatio < 1.0) {
          line.visible = true;
          line.geometry.setDrawRange(0, this.divCount * inRatioD);
          line.material.opacity = 1.0 - outRatio;
        } else if (outRatio >= 1.0) {
          line.visible = false;
        }
      }
    }
  }

  // アウトラインの表示制御
  outlineDisplayControl = (progRatio) => {
    const p = this.outlineParams;
    const inRatio  = THREE.MathUtils.smoothstep(progRatio, p.inStart, p.inEnd);
    const outRatio = THREE.MathUtils.smoothstep(progRatio, p.outStart, p.outEnd);
    this.outlines.children.forEach((line) => {
      if (inRatio > 0.0 && inRatio <= 1.0 && outRatio == 0.0) {
        line.visible = true;
        line.geometry.setDrawRange(0, this.divCount * inRatio);
        line.material.opacity = 1.0 - outRatio;
      } else if (inRatio >= 1.0 && outRatio > 0.0 && outRatio < 1.0) {
        line.visible = true;
        line.geometry.setDrawRange(0, this.divCount * inRatio);
        line.material.opacity = 1.0 - outRatio;
      } else {
        line.visible = false;
      }
    });
    this.outlineEdges.children.forEach((mesh) => {
      mesh.material.opacity = inRatio - outRatio * 1.2;
    });
  }

  // 図形の表示制御
  shapeDisplayControl = (progRatio) => {
    const p = this.shapeParams;
    const inRatio  = THREE.MathUtils.smoothstep(progRatio, p.inStart, p.inEnd);
    const outRatio = THREE.MathUtils.smoothstep(progRatio, p.outStart, p.outEnd);
    const control = (mesh) => {
      if (inRatio > 0.0 && outRatio == 0.0) {
        mesh.visible = true;
        mesh.material.opacity = inRatio;
      } else if (outRatio > 0.0) {
        mesh.visible = true;
        mesh.material.opacity = 1.0 - outRatio;
      } else {
        mesh.visible = false;
      }
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
