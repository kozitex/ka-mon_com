'use strict';

import * as THREE from 'three';
import Grid from './grid.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

export default class Kamon {

  constructor() {

    // 基本カラー
    this.frontColor    = 0xffffff;
    this.backColor     = 0x111111;
    this.guideColor    = 0x999999;

    // ウィンドウサイズ
    this.w = window.innerWidth;
    this.h = window.innerHeight

    // フレームのサイズ
    this.edge = 3200;

    // グリッドの有無
    this.gridExist = true;

    // スクローラーの高さ
    this.rollHeight = 4000;
    this.roll = document.getElementById('roll');

    // スクロールの所要時間
    this.scrollDur = 15000;

    // スクロールの進捗率
    this.progRatio = 0;

    // レンダラー
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    this.renderer.setSize(this.w, this.h);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // // DOMにレンダラーのcanvasを追加
    this.kamon = document.getElementById('kamon');

    // カメラ
    this.camZ = 4000;
    this.camera = new THREE.PerspectiveCamera(45, this.w / this.h, 1, 10000);
    this.camera.position.set(0, 0, this.camZ);

    // シーン
    this.scene = new THREE.Scene();

    // オブジェクト格納用のグループ
    this.founders = new THREE.Group();
    this.guidelines = new THREE.Group();
    this.outlines = new THREE.Group();
    this.outlineEdges = new THREE.Group();
    this.shapes = new THREE.Group();

    // 共有マテリアル
    this.founderMat = new THREE.LineBasicMaterial({
      transparent: true
    });
    this.guideMat = new THREE.LineBasicMaterial({
      transparent: true
    });
    this.outlineMat = new THREE.LineBasicMaterial({
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

    // フレーム・グリッドの描画
    this.grid = new Grid();
    this.grids = this.grid.draw();
    this.scene.add(this.grids);

    // infoの準備
    this.jpName = document.getElementById('jpName');
    this.jpDesc = document.getElementById('jpDesc');
    this.enName = document.getElementById('enName');
    this.enDesc = document.getElementById('enDesc');

    // ファウンダーを生成
    this.foundersGen();

    // 描画ループ開始
    this.render();
  }

  init() {

    // DOMにレンダラーのcanvasを追加
    this.kamon.appendChild(this.renderer.domElement);

    this.roll.style = 'height: ' + this.rollHeight + 'vh;'
    this.rollLength = this.roll.scrollHeight - this.h;
  }

  // 画面のスクロール量を取得
  scrolled = (y) => {
    this.progRatio = y / this.rollLength;
  }

  // ウィンドウサイズ変更
  windowResize = () => {
    this.w = window.innerWidth;
    this.h = window.innerHeight
    this.camera.aspect = this.w / this.h;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.w, this.h);
    this.rollLength = this.roll.scrollHeight - this.h;
    this.render();
  }

  // テーマカラー変更
  changeTheme(theme) {
    if (theme == 'dark') {
      this.frontColor    = 0xffffff;
      this.backColor     = 0x111111;
      this.guideColor    = 0x999999;
      this.gridColor     = 0x333333;
      this.gridThinColor = 0x1a1a1a;
    } else {
      this.frontColor    = 0x111111;
      this.backColor     = 0xffffff;
      this.guideColor    = 0x333333;
      this.gridColor     = 0xcccccc;
      this.gridThinColor = 0xe6e6e6;
    }

    // 背景色を変更
    this.scene.background = new THREE.Color(this.backColor);

    // グリッド色を変更
    this.grid.changeTheme(this.gridColor, this.gridThinColor);

    // ファウンダーの色を変更
    this.founderMat.color = new THREE.Color(this.guideColor);

    // ガイドラインの色を変更
    this.guideMat.color = new THREE.Color(this.guideColor);

    // アウトラインの色を変更
    this.outlineMat.color = new THREE.Color(this.frontColor);
    this.edgeMat.color = new THREE.Color(this.frontColor);

    // 図形の色を変更
    this.shapeMat.color = new THREE.Color(this.frontColor);
  }

  // // オブジェクトやシーンをすべてクリア
  // dispose = () => {
  //   const objects = [
  //     this.founders, this.grids, this.guidelines, this.outlines, this.shapes,
  //   ];
  //   objects.forEach((object) => {
  //     if (object.isGroup) {
  //       object.children.forEach((child) => {
  //         if (child.isGroup) {
  //           child.children.forEach((line) => {
  //             line.material.dispose();
  //             line.geometry.dispose();
  //             this.scene.remove(line);
  //           })
  //         } else {
  //           child.material.dispose();
  //           child.geometry.dispose();
  //           this.scene.remove(child);
  //         }
  //       })
  //       this.scene.remove(object);
  //     } else {
  //       object.material.dispose();
  //       object.geometry.dispose();
  //       this.scene.remove(object);
  //     }
  //   })

  // }


  // 直線の方程式
  straight = (a, b, c, x, y) => {
    if (x == undefined) {
      return new THREE.Vector3((b * y - c) / a, y, 0);
    } else if (y == undefined) {
      return new THREE.Vector3(x, (a * x + c) / b, 0);
    }
  }

  // 円弧の座標を求める式（a: 中心X座標, b: 中心Y座標, 半径, 角度）
  circle(a, b, r, s) {
    const sr = s * Math.PI / 180;
    return new THREE.Vector3(a + r * Math.cos(sr), b + r * Math.sin(sr), 0);
  }

  // 直線と円の交点を求める
  interLineCircle = (r, h, k, m, n) => {
    var a = 1 + Math.pow(m, 2);
    var b = -2 * h + 2 * m * (n - k);
    var c = Math.pow(h, 2) + Math.pow((n - k), 2) - Math.pow(r, 2);
    var D = Math.pow(b, 2) - 4 * a * c;

    var kouten = [];
    if (D >= 0) {
      var x1 = (-b + Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
      var x2 = (-b - Math.sqrt(Math.pow(b, 2) - 4 * a * c)) / (2 * a);
      if (D == 0) {
        kouten.push(new THREE.Vector3(x1, m * x1 + n, 0));
      } else {
        kouten.push(new THREE.Vector3(x1, m * x1 + n, 0));
        kouten.push(new THREE.Vector3(x2, m * x2 + n, 0));
      }
    }
    return kouten;
  }

  // ２点の座標から方程式のa,bを取得
  from2Points = (x1, y1, x2, y2) => {
    const a = (y2 - y1) / (x2 - x1);
    const b = (x2 * y1 - x1 * y2) / (x2 - x1);
    return {a: a, b: b};
  }

  // ２直線の交点を求める式
  getIntersect(a1, b1, a2, b2) {
    const interX = (b2 - b1) / (a1 - a2);
    const interY = ((a1 * b2) - (a2 * b1)) / (a1 - a2);
    return new THREE.Vector3(interX, interY, 0);
  }

  // ファウンダーの生成
  foundersGen = () => {
    for (var i = 0;i <= 9;i ++) {
      const points = this.circlePointGen(0, 0, 1600, 90, 450, 1000);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      geometry.setDrawRange(0, 0);
      const founder = new THREE.Line(geometry, this.founderMat);
      this.founders.add(founder);
    }
    this.scene.add(this.founders);
  }

  // ガイドラインのメッシュを生成
  guidelineGen = (points) => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    geometry.setDrawRange(0, 0);
    return new THREE.Line(geometry, this.guideMat);
  }

  // ガイドラインの円弧のジオメトリを生成
  guidelineCircleGeoGen = (points) => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    geometry.setDrawRange(0, 0);
    return geometry;
  }

  // ガイドラインの円弧のメッシュを生成
  guidelineCircleMeshGen = (geometry, r, br, rotZ) => {
    const mesh = new THREE.Line(geometry, this.guideMat);
    const scale = r / br;
    mesh.scale.set(scale, scale);
    mesh.rotation.set(0, 0, rotZ);
    return mesh;
  }

  // outlineMeshGroupGen = (geometry) => {
  //   // geometry.setDrawRange(0, 0);
  //   const mesh = new THREE.Line(geometry, this.outlineMat);
  //   const group = new THREE.Group();
  //   group.add(mesh);
  //   return group;
  // }

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
    var posX = 0, posY = 0;
    if (a != 0 || b != 0) {
      if (rotY == Math.PI && rotZ == 0 || rotY == Math.PI * 2) {
        posX = a > 0 ? g : - g;
        posY = b > 0 ? - g : g;
      } else {
        posX = a > 0 ? - g : g;
        posY = b > 0 ? - g : g;
      }
    }
    mesh.position.set(posX, posY, 0);
    mesh.scale.set(scale, scale, 0);
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
    // const group = new THREE.Group();
    const mesh = new THREE.Line(geometry, this.outlineMat);
    const theta = (Math.atan(b == 0 ? 90 : a) + rotZ) * (rotY == Math.PI ? - 1 : 1);
    // const theta = b == 0 ? THREE.MathUtils.degToRad(90) : (Math.atan(a) + rotZ) * (rotY == Math.PI ? - 1 : 1);
    // const theta = (Math.atan(a) + rotZ) * (rotY == 0 ? 1 : rotY / Math.PI * 2);
    // console.log((rotY / Math.PI * 2))
    const rad = theta + THREE.MathUtils.degToRad(90);
    // const x = b == 0 ? g : g * Math.cos(rad);
    // const y = b == 0 ? 0 : g * Math.sin(rad);
    const x = g * Math.cos(rad);
    const y = g * Math.sin(rad);
    mesh.position.set(x, y, 0);
    mesh.rotation.set(rotX, rotY, rotZ);
    return mesh;
    // group.add(mesh);
    // return group;
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
    // const group = new THREE.Group();
    const mesh = new THREE.Mesh(geometry, this.edgeMat);
    mesh.rotation.set(rotX, rotY, rotZ);
    return mesh;
    // group.add(mesh);
    // return group;
  }


  // アウトラインのメッシュを生成
  outlineGen = (points) => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    geometry.setDrawRange(0, 0);
    return new THREE.Line(geometry, this.outlineMat);
  }

  // 直線のアウトラインを生成
  outlineLineGen = (a, b, r, f, t, d) => {
    const group = new THREE.Group();
    const w = 6;
    for (var i = 0;i <= w - 1;i ++) {
      for (var j = 0;j <= 1;j ++) {
        const theta = Math.abs(Math.atan(a));
        const rad = THREE.MathUtils.degToRad(90) - theta;
        const pSign = a > 0 ? j == 0 ? - 1 :   1 : j == 0 ? 1 : - 1;
        const qSign = a > 0 ? j == 0 ?   1 : - 1 : j == 0 ? 1 : - 1;
        const p = pSign * i * Math.cos(rad);
        const q = qSign * i * Math.sin(rad);
        const points = this.linePointGen(a, b, - a * p + r + q, f + p, t + p, d);
        const mesh = this.outlineGen(points);
        group.add(mesh);
      }
    }
    return group;
  }
  // outlineLineGeoGen = (a, b, r, f, t, d) => {
  //   var points = [];
  //   const w = 6;
  //   for (var i = 0;i <= w - 1;i ++) {
  //     for (var j = 0;j <= 1;j ++) {
  //       const theta = Math.abs(Math.atan(a));
  //       const rad = THREE.MathUtils.degToRad(90) - theta;
  //       const pSign = a > 0 ? j == 0 ? - 1 :   1 : j == 0 ? 1 : - 1;
  //       const qSign = a > 0 ? j == 0 ?   1 : - 1 : j == 0 ? 1 : - 1;
  //       const p = pSign * i * Math.cos(rad);
  //       const q = qSign * i * Math.sin(rad);
  //       const point = this.linePointGen(a, b, - a * p + r + q, f + p, t + p, d);
  //       points = points.concat(point);
  //     }
  //   }
  //   const geometry = new THREE.BufferGeometry().setFromPoints(points);
  //   // geometry.setDrawRange(0, 0);
  //   return geometry;
  // }

  // 円弧のアウトラインを生成
  outlineCircleGen = (a, b, r, f, t, d) => {
    const group = new THREE.Group();
    const points = this.circlePointGen(a, b, r, f, t, d);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const w = 6;
    for (var g = - w;g <= w;g ++) {
      const mesh = new THREE.Line(geometry, this.outlineMat);
      const scale = (r + g) / r;
      mesh.scale.set(scale, scale);
      group.add(mesh);
    }
    return group;
  }
  // outlineCircleGen = (a, b, r, f, t, d) => {
  //   const group = new THREE.Group();
  //   const w = 6;
  //   for (var g = - w;g <= w;g ++) {
  //     const points = this.circlePointGen(a, b, r + g, f, t, d);
  //     const mesh = this.outlineGen(points);
  //     group.add(mesh);
  //   }
  //   return group;
  // }
  // outlineCircleGeoGen = (a, b, r, f, t, d) => {
  //   var points = [];
  //   const w = 0;
  //   for (var g = - w;g <= w;g ++) {
  //     const point = this.circlePointGen(a, b, r + g, f, t, d);
  //     points = points.concat(point);
  //     // points.push(point);
  //   }
  //   const geometry = new THREE.BufferGeometry().setFromPoints(points);
  //   // geometry.setDrawRange(0, 0);
  //   return geometry;
  // }


  // アウトラインの両端を丸く処理
  outlineEdgeGen = (a, b, r, f, t) => {
    const group = new THREE.Group();
    const w = 6;
    const edgeF = this.straight(a, b, r, b == 0 ? undefined : f, b == 0 ? f : undefined);
    const edgeT = this.straight(a, b, r, b == 0 ? undefined : t, b == 0 ? t : undefined);
    const edges = [edgeF, edgeT];
    edges.forEach((edge) => {
      const points = this.curvePointGen(edge.x, edge.y, w, 0, 360, false);
      const shape = new THREE.Shape(points);
      const geometry = new THREE.ShapeGeometry(shape);
      const mesh = new THREE.Mesh(geometry, this.edgeMat);

      group.add(mesh);
    })
    return group;
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
  // circleGeoGen = (a, b, r, f, t, d) => {
  //   const points = [];
  //   for (var i = 0;i <= d - 1;i ++) {
  //     const p = THREE.MathUtils.damp(f, t, 10, i / (d - 1));
  //     const point = this.circle(a, b, r, p);
  //     points.push(point);
  //   }
  //   const geometry = new THREE.BufferGeometry().setFromPoints(points);
  //   geometry.setDrawRange(0, 0);
  //   return geometry;
  // }

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
  shapeGen = (shapes, pathes) => {
    const shape = new THREE.Shape(shapes);
    if (pathes) {
      const path  = new THREE.Path(pathes);
      shape.holes.push(path);
    }
    const geometry = new THREE.ShapeGeometry(shape);
    const mesh = new THREE.Mesh(geometry, this.shapeMat);
    return mesh;
  }

  // ポイントからシェイプを生成
  shapeGeoGen = (shapes, pathes) => {
    const shape = new THREE.Shape(shapes);
    if (pathes) {
      const path  = new THREE.Path(pathes);
      shape.holes.push(path);
    }
    const geometry = new THREE.ShapeGeometry(shape);
    return geometry;
    // const mesh = new THREE.Mesh(geometry, this.shapeMat);
    // return mesh;
  }


  // プログレスバーのアニメーション制御
  progressBarControl() {
    const bar = document.querySelector('#progress .bar');
    const rate = document.querySelector('#progress .rate');
    const ratio = this.progRatio * 100;
    rate.textContent = ratio.toFixed(1) + '%';
    bar.style.strokeDashoffset = 283 * (1 - this.progRatio);
  }

  // ファウンダーの表示アニメーション制御
  foundersDisplayControl = (inStart, inEnd, outStart, outEnd , reInStart, reInEnd) => {
    const inRatio  = THREE.MathUtils.smoothstep(this.progRatio, inStart, inEnd);
    const outRatio = THREE.MathUtils.smoothstep(this.progRatio, outStart, outEnd);
    const reInRatio  = THREE.MathUtils.smoothstep(this.progRatio, reInStart, reInEnd);
    const dAmpOrigin = 0.87;
    const dInt = 0.2;
    const scrFill = THREE.MathUtils.mapLinear(inRatio - reInRatio, 0.0, 1.0, 0.0, 1.0 - dAmpOrigin);
    const sizeAmt = THREE.MathUtils.mapLinear(inRatio - reInRatio, 0.0, 1.0, 1800, 1600);
    const dAmp = dAmpOrigin + scrFill;
    const time = performance.now() * 0.00025;
    for (var i = 0;i <= this.founders.children.length - 1;i ++) {
      const founder = this.founders.children[i];
      founder.geometry.setDrawRange(0, 1000);
      const positions = founder.geometry.attributes.position.array;
      for(let j = 0; j <= 1000; j++){
        const angle = THREE.MathUtils.mapLinear(j, 0, 1000, 89.6, 450) * Math.PI / 180;
        const dist = noise.perlin2(
          Math.cos(angle) * i * dInt + time, 
          Math.sin(angle) * i * dInt + time
        );
        const dVal = THREE.MathUtils.mapLinear(dist, 0.0, 1.0, dAmp, 1.0);
        positions[j * 3] = Math.cos(angle) * sizeAmt * dVal;
        positions[j * 3 + 1] = Math.sin(angle) * sizeAmt * dVal;
        founder.material.opacity = Math.abs(dist * 1) - outRatio + reInRatio;
      }
      if (outRatio >= 1.0 && reInRatio <= 0.0) {
        founder.visible = false;
      } else {
        founder.visible = true;
      }
      founder.geometry.attributes.position.needsUpdate = true;
    }
  }

  // ガイドラインの表示制御
  guidelinesDisplayControl = (inStart, inEnd, outStart, outEnd, divCount, gDelay, lDelay) => {
    const inRatio  = THREE.MathUtils.smoothstep(this.progRatio, inStart, inEnd);
    const outRatio = THREE.MathUtils.smoothstep(this.progRatio, outStart, outEnd);
    const groupNum = this.guidelines.children.length;
    for (var i = 0;i <= groupNum - 1;i ++) {
      const group = this.guidelines.children[i]
      const lineNum = group.children.length;
      const maxDelay = gDelay * groupNum + lDelay * lineNum;
      for (var j = 0;j <= lineNum - 1;j ++) {
        const line = group.children[j];
        const delay = gDelay * i + lDelay * j;
        const inRatioD = THREE.MathUtils.inverseLerp(delay, 1.0 + delay - maxDelay, inRatio);
        if (inRatio >= 0.0 && outRatio == 0.0) {
          line.visible = true;
          line.geometry.setDrawRange(0, divCount * inRatioD);
          line.material.opacity = 1.0 - outRatio;
        } else if (outRatio > 0.0 && outRatio < 1.0) {
          line.visible = true;
          line.geometry.setDrawRange(0, divCount * inRatioD);
          line.material.opacity = 1.0 - outRatio;
        } else if (outRatio >= 1.0) {
          line.visible = false;
        }
      }
    }
  }

  // アウトラインの表示制御
  outlinesDisplayControl = (inStart, inEnd, outStart, outEnd, divCount) => {
    const inRatio  = THREE.MathUtils.smoothstep(this.progRatio, inStart, inEnd);
    const outRatio = THREE.MathUtils.smoothstep(this.progRatio, outStart, outEnd);
    this.outlines.children.forEach((line) => {
      // group.children.forEach((line) => {
      if (inRatio > 0.0 && inRatio <= 1.0 && outRatio == 0.0) {
        line.visible = true;
        line.geometry.setDrawRange(0, divCount * inRatio);
        line.material.opacity = 1.0 - outRatio;
      } else if (inRatio >= 1.0 && outRatio > 0.0 && outRatio < 1.0) {
        line.visible = true;
        line.geometry.setDrawRange(0, divCount * inRatio);
        line.material.opacity = 1.0 - outRatio;
      } else {
        line.visible = false;
      }
      // })
    });
    // this.outlines.children.forEach((group) => {
    //   group.children.forEach((line) => {
    //     if (inRatio > 0.0 && inRatio <= 1.0 && outRatio == 0.0) {
    //       line.visible = true;
    //       line.geometry.setDrawRange(0, divCount * inRatio);
    //       line.material.opacity = 1.0 - outRatio;
    //     } else if (inRatio >= 1.0 && outRatio > 0.0 && outRatio < 1.0) {
    //       line.visible = true;
    //       line.geometry.setDrawRange(0, divCount * inRatio);
    //       line.material.opacity = 1.0 - outRatio;
    //     } else {
    //       line.visible = false;
    //     }
    //   })
    // });
    this.outlineEdges.children.forEach((edge) => {
      // group.children.forEach((edge) => {
      edge.material.opacity = inRatio - outRatio * 1.2;
      // })
    });
    // this.outlineEdges.children.forEach((group) => {
    //   group.children.forEach((edge) => {
    //     edge.material.opacity = inRatio - outRatio * 1.2;
    //   })
    // });
  }

  // 図形の表示制御
  shapesDisplayControl = (inStart, inEnd, outStart, outEnd) => {
    const inRatio  = THREE.MathUtils.smoothstep(this.progRatio, inStart, inEnd);
    const outRatio = THREE.MathUtils.smoothstep(this.progRatio, outStart, outEnd);
    this.shapes.children.forEach((group) => {
      if (group.isGroup) {
        group.children.forEach((shape) => {
          if (inRatio > 0.0 && outRatio == 0.0) {
            shape.visible = true;
            shape.material.opacity = inRatio;
          } else if (outRatio > 0.0) {
            shape.visible = true;
            shape.material.opacity = 1.0 - outRatio;
          } else {
            shape.visible = false;
          }
        })
      } else {
        if (inRatio > 0.0 && outRatio == 0.0) {
          group.visible = true;
          group.material.opacity = inRatio;
        } else if (outRatio > 0.0) {
          group.visible = true;
          group.material.opacity = 1.0 - outRatio;
        } else {
          group.visible = false;
        }
      }
    })
  }

  // descの表示制御
  descDisplayControl = (inStart, inEnd, outStart, outEnd) => {
    const inRatio  = THREE.MathUtils.smoothstep(this.progRatio, inStart, inEnd);
    const outRatio = THREE.MathUtils.smoothstep(this.progRatio, outStart, outEnd);
    var opaRaio, traRatio;
    if (inRatio > 0.0 && outRatio == 0.0) {
      opaRaio = inRatio;
      traRatio = (1.0 - inRatio) * 100;
    } else if (outRatio > 0.0) {
      opaRaio = 1.0 - outRatio;
      traRatio = 0;
    } else if (outRatio >= 1.0) {
      opaRaio = 0.0;
      traRatio = 0;
    } else {
      opaRaio = 0.0;
      traRatio = 100;
    }
    this.jpName.style = "opacity: " + opaRaio + ";transform: translateX(-" + traRatio +"%);"
    this.jpDesc.style = "opacity: " + opaRaio + ";transform: translateY( " + traRatio +"%);"
    this.enName.style = "opacity: " + opaRaio + ";transform: translateX( " + traRatio +"%);"
    this.enDesc.style = "opacity: " + opaRaio + ";transform: translateY( " + traRatio +"%);"
  }

  render() {

    // プログレスバーのアニメーション制御
    this.progressBarControl();

    // 画面に表示
    this.renderer.render(this.scene, this.camera);

    // 次のフレームを要求
    requestAnimationFrame(() => this.render());
  }
}
