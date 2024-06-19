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
  straight = (a, b, x, y) => {
    if (x == undefined) {
      return new THREE.Vector3((y - b) / a, y, 0);
    } else if (y == undefined) {
      return new THREE.Vector3(x, a * x + b, 0);
    }
  }

  straight2 = (a, b, c, x, y) => {
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
    this.founders = new THREE.Group();
    for (var i = 0;i <= 9;i ++) {
      const points = this.pointGen('circle', 0, 0, 1600, 90, 450, 1000);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      geometry.setDrawRange(0, 0);
      const founder = new THREE.Line(geometry, this.founderMat);
      this.founders.add(founder);
    }
    this.scene.add(this.founders);
  }

  // ガイドラインを生成
  guidelineGen = (k, a, b, r, f, t, d) => {
    var points;
    if (k == 'line') {
      points = this.pointGen('line', a, b, r, f, t, d);
    } else if (k == 'circle') {
      points = this.pointGen('circle', a, b, r, f, t, d);
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    geometry.setDrawRange(0, 0);
    return new THREE.Line(geometry, this.guideMat);
  }

  // アウトラインを生成
  outlineGen = (k, a, b, r, f, t, d) => {
    const group = new THREE.Group();
    const w = 6;
    if (k == 'line') {
      for (var i = 0;i <= w - 1;i ++) {
        for (var j = 0;j <= 1;j ++) {
          const g = i;
          const theta = Math.abs(Math.atan(a));
          const rad = (90 * Math.PI / 180) - theta;
          const pSign = a > 0 ? j == 0 ? - 1 :   1 : j == 0 ? 1 : - 1;
          const qSign = a > 0 ? j == 0 ?   1 : - 1 : j == 0 ? 1 : - 1;
          const p = pSign * g * Math.cos(rad);
          const q = qSign * g * Math.sin(rad);
          const points = this.pointGen('line', a, b, - a * p + r + q, f + p, t + p, d);
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          geometry.setDrawRange(0, 0);
          const circle = new THREE.Line(geometry, this.outlineMat);
          group.add(circle);
        }
      }
      // // 両端を丸く処理
      // const edgeF = this.straight2(a, b, r, b == 0 ? undefined : f, b == 0 ? f : undefined);
      // const edgeT = this.straight2(a, b, r, b == 0 ? undefined : t, b == 0 ? t : undefined);
      // // console.log(edgeF, edgeT)
      // const edges = [edgeF, edgeT];
      // edges.forEach((edge) => {
      //   // var points = [];
      //   // for (var g = 0;g <= w;g ++) {
      //   const points = this.shapePointGen('circle', edge.x, edge.y, w, 0, 0, 360, false);
      //   // points = points.concat(point);
      //     // const geometry = new THREE.BufferGeometry().setFromPoints(points);
      //     // geometry.setDrawRange(0, 0);
      //     // const circle = new THREE.Line(geometry, this.outlineMat);
      //     // group.add(circle);
      //   // }
      //   // const geometry = new THREE.BufferGeometry().setFromPoints(points);
      //   // geometry.setDrawRange(0, 0);
      //   const circle = this.shapeGen(points);
      //   group.add(circle);
      //   // this.outlineEdges.add(circle);
      // })


      // edges.forEach((edge) => {
      //   var points = [];
      //   for (var g = 0;g <= w;g ++) {
      //     const point = this.pointGen('circle', edge.x, edge.y, g, 90, 450, 100);
      //     points = points.concat(point);
      //     // const geometry = new THREE.BufferGeometry().setFromPoints(points);
      //     // geometry.setDrawRange(0, 0);
      //     // const circle = new THREE.Line(geometry, this.outlineMat);
      //     // group.add(circle);
      //   }
      //   const geometry = new THREE.BufferGeometry().setFromPoints(points);
      //   geometry.setDrawRange(0, 0);
      //   const circle = new THREE.Line(geometry, this.outlineMat);
      //   group.add(circle);
      // })

      // const geometry = new THREE.BufferGeometry().setFromPoints(points);
      // geometry.setDrawRange(0, 0);
      // const edgeCircleF = new THREE.Line(geometry, this.outlineMat);
      // const edgeCircleT = new THREE.Line(geometry, this.outlineMat);
      // const edgeCircleF = this.pointGen('circle', edgeF.x, edgeF.y, w, 0, 360, d);
      // const edgeCircleT = this.pointGen('circle', edgeT.x, edgeT.y, w, 0, 360, d);
      // const edgeCircleF = this.circleShapeGen(edgeF.x, edgeF.y, w, 0, 360, 500);
      // const edgeCircleT = this.circleShapeGen(edgeT.x, edgeT.y, w, 0, 360, 500);
      // edgeCircleF.geometry.setDrawRange(0, 0);
      // edgeCircleT.geometry.setDrawRange(0, 0);
      // group.add(edgeCircleF, edgeCircleT);

    } else if (k == 'circle') {
      for (var g = - w;g <= w;g ++) {
        const points = this.pointGen('circle', a, b, r + g, f, t, d);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        geometry.setDrawRange(0, 0);
        const circle = new THREE.Line(geometry, this.outlineMat);
        group.add(circle);
      }

    }
    return group;
  }

  // アウトラインの両端を丸く処理
  outlineEdgeGen = (a, b, r, f, t) => {
    const group = new THREE.Group();
    const w = 6;
    const edgeF = this.straight2(a, b, r, b == 0 ? undefined : f, b == 0 ? f : undefined);
    const edgeT = this.straight2(a, b, r, b == 0 ? undefined : t, b == 0 ? t : undefined);
    const edges = [edgeF, edgeT];
    edges.forEach((edge) => {
      const points = this.shapePointGen('circle', edge.x, edge.y, w, 0, 0, 360, false);
      // const circle = this.shapeGen(points);
      const shape = new THREE.Shape(points);
      const geometry = new THREE.ShapeGeometry(shape);
      const mesh = new THREE.Mesh(geometry, this.edgeMat);
      group.add(mesh);
    })
    return group;
  }


  // // 円弧を生成
  // circleGen(a, b, r, f, t, d) {
  //   const points = [];
  //   for (var i = 0;i <= d - 1;i ++) {
  //     const p = THREE.MathUtils.damp(f, t, 10, i / (d - 1));
  //     const point = this.circle(a, b, r, p);
  //     points.push(point);
  //   }
  //   const geometry = new THREE.BufferGeometry().setFromPoints(points);
  //   geometry.setDrawRange(0, 0);
  //   const material = this.lineMat.clone();
  //   return new THREE.Line(geometry, material);
  // }

  // // アウトライン用の円弧を生成
  // outlineCircleGen(a, b, r, f, t, d) {
  //   const w = 6;
  //   const group = new THREE.Group();
  //   for (var g = - w;g <= w;g ++) {
  //     const circle = this.circleGen(a, b, r + g, f, t, d);
  //     group.add(circle);
  //   }
  //   return group;
  // }

  // // 直線を生成
  // lineGen(a, b, r, f, t, d) {
  //   const points = [];
  //   for (var i = 0;i <= d - 1;i ++) {
  //     const p = THREE.MathUtils.damp(f, t, 10, i / (d - 1));
  //     var point;
  //     if (b == 0) {
  //       point = this.straight2(a, b, r, undefined, p);
  //     } else {
  //       point = this.straight2(a, b, r, p, undefined);
  //     }
  //     points.push(point);
  //   }
  //   const geometry = new THREE.BufferGeometry().setFromPoints(points);
  //   geometry.setDrawRange(0, 0);
  //   const material = this.lineMat.clone();
  //   // const material = new THREE.LineBasicMaterial({
  //   //   // color: c,
  //   //   transparent: true
  //   // });
  //   return new THREE.Line(geometry, material);
  // }

  // // アウトライン用の直線を生成
  // outlineGen(a, b, r, f, t, d) {
  //   const w = 6;
  //   const group = new THREE.Group();
  //   for (var i = 0;i <= w - 1;i ++) {
  //     for (var j = 0;j <= 1;j ++) {
  //       const g = i;
  //       const theta = Math.abs(Math.atan(a));
  //       const rad = (90 * Math.PI / 180) - theta;
  //       const pSign = a > 0 ? j == 0 ? - 1 :   1 : j == 0 ? 1 : - 1;
  //       const qSign = a > 0 ? j == 0 ?   1 : - 1 : j == 0 ? 1 : - 1;
  //       const p = pSign * g * Math.cos(rad);
  //       const q = qSign * g * Math.sin(rad);
  //       const line = this.lineGen(a, b, - a * p + r + q, f + p, t + p, d);
  //       group.add(line);
  //     }
  //   }
  //   // 両端を丸く処理
  //   const edgeF = this.straight2(a, b, r, b == 0 ? undefined : f, b == 0 ? f : undefined);
  //   const edgeCircleF = this.circleShapeGen(edgeF.x, edgeF.y, w, 0, 360, 100);
  //   edgeCircleF.geometry.setDrawRange(0, 0);
  //   const edgeT = this.straight2(a, b, r, b == 0 ? undefined : t, b == 0 ? t : undefined);
  //   const edgeCircleT = this.circleShapeGen(edgeT.x, edgeT.y, w, 0, 360, 100);
  //   edgeCircleT.geometry.setDrawRange(0, 0);
  //   group.add(edgeCircleF, edgeCircleT);

  //   return group;
  // }

  // 円弧の図形を生成
  circleShapeGen(a, b, r, f, t, d) {
    const points = [];
    for (var i = 0;i <= d - 1;i ++) {
      const p = THREE.MathUtils.damp(f, t, 10, i / (d - 1));
      const point = this.circle(a, b, r, p);
      points.push(point);
    }
    const shape = new THREE.Shape(points);
    const geometry = new THREE.ShapeGeometry(shape);
    // const material = this.meshMat.clone();
    // const material = new THREE.MeshBasicMaterial({
    //   // color: c,
    //   side: THREE.DoubleSide,
    //   transparent: true,
    // });
    // material.opacity = 0.0;
    return new THREE.Mesh(geometry, this.shapeMat);
    // return new THREE.Mesh(geometry, material);
  }

  // 図形の座標を生成
  pointGen = (k, a, b, r, f, t, d) => {
    const points = [];
    for (var i = 0;i <= d - 1;i ++) {
      const p = THREE.MathUtils.damp(f, t, 10, i / (d - 1));
      var point;
      if (k == 'line') {
        if (b == 0) {
          point = this.straight2(a, b, r, undefined, p);
        } else {
          point = this.straight2(a, b, r, p, undefined);
        }
      } else if (k == 'circle') {
        point = this.circle(a, b, r, p);
      }
      points.push(point);
    }
    return points;
  }

  // shape用の図形の座標を生成
  shapePointGen = (k, a, b, r, g, f, t, c) => {
    var points;
    if (k == 'line') {
    } else if (k == 'circle') {
      const curve = new THREE.EllipseCurve(
        a, b, r + g, r + g,
        THREE.MathUtils.degToRad(f), THREE.MathUtils.degToRad(t),
        c, 0
      );
      points = curve.getPoints(100);
    }
    return points;
  }

  // // 円弧の頂点を生成
  // circlePointGen(a, b, r, f, t, d) {
  //   const points = [];
  //   for (var i = 0;i <= d - 1;i ++) {
  //     const p = THREE.MathUtils.damp(f, t, 10, i / (d - 1));
  //     const point = this.circle(a, b, r, p);
  //     points.push(point);
  //   }
  //   return points;
  // }

  // // 円弧の頂点を生成
  // circlePointGen2(a, b, r, f, t, d, w) {
  //   const points = [];
  //   for (var i = 0;i <= d - 1;i ++) {
  //     const p = THREE.MathUtils.damp(f, t, 10, i / (d - 1));
  //     for (var j = - w;j <= w;j ++) {
  //       const point = this.circle(a, b, r + j, p);
  //       points.push(point);  
  //     }
  //   }
  //   return points;
  // }

  // // 直線を生成
  // linePointGen(a, b, r, f, t, d) {
  //   const points = [];
  //   for (var i = 0;i <= d - 1;i ++) {
  //     const p = THREE.MathUtils.damp(f, t, 10, i / (d - 1));
  //     var point;
  //     if (b == 0) {
  //       point = this.straight2(a, b, r, undefined, p);
  //     } else {
  //       point = this.straight2(a, b, r, p, undefined);
  //     }
  //     points.push(point);
  //   }
  //   return points;
  // }

  // ポイントからシェイプを生成
  shapeGen = (points) => {
    const shape = new THREE.Shape(points);
    const geometry = new THREE.ShapeGeometry(shape);
    // const material = this.meshMat.clone();
    // const material = new THREE.MeshBasicMaterial({
    //   // color: color,
    //   side: THREE.DoubleSide,
    //   transparent: true,
    // });
    const mesh = new THREE.Mesh(geometry, this.shapeMat);
    return mesh;
  }

  // ポイントからシェイプを生成
  clipShapeGen = (shapePoints, pathPoints) => {
    const shape = new THREE.Shape(shapePoints);
    const path  = new THREE.Path(pathPoints);
    shape.holes.push(path);
    const geometry = new THREE.ShapeGeometry(shape);
    // const material = this.meshMat.clone();
    // const material = new THREE.MeshBasicMaterial({
    //   // color: color,
    //   side: THREE.DoubleSide,
    //   transparent: true,
    // });
    const mesh = new THREE.Mesh(geometry, this.shapeMat);
    return mesh;
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
        // console.log(Math.abs(dist * 1) - outRatio + reInRatio)
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
    // if (inRatio <= 0.0 || outRatio >= 1.0) return;
    const groupNum = this.guidelines.children.length;
    for (var i = 0;i <= groupNum - 1;i ++) {
      const group = this.guidelines.children[i]
    // this.guidelines.children.forEach((group) => {
      const lineNum = group.children.length;
      // const maxDelay = gDelay * lineNum;
      const maxDelay = gDelay * groupNum + lDelay * lineNum;
      for (var j = 0;j <= lineNum - 1;j ++) {
        const line = group.children[j];
        // line.visible = true;
        const delay = gDelay * i + lDelay * j;
        // const inRatioD = THREE.MathUtils.clamp(inRatio, delay, 1.0 + delay - maxDelay);
        const inRatioD = THREE.MathUtils.inverseLerp(delay, 1.0 + delay - maxDelay, inRatio);
        // const inRatioD = THREE.MathUtils.smoothstep(inRatio, delay, 1.0 + delay - maxDelay);
        // console.log(maxDelay, delay, inRatioD)
        // console.log(inRatio, inRatioD, outRatio)
        if (inRatio >= 0.0 && outRatio == 0.0) {
          line.visible = true;
          line.geometry.setDrawRange(0, divCount * inRatioD);
          line.material.opacity = 1.0 - outRatio;
        } else if (outRatio > 0.0 && outRatio < 1.0) {
          line.visible = true;
          line.geometry.setDrawRange(0, divCount * inRatioD);
          line.material.opacity = 1.0 - outRatio;
        } else if (outRatio >= 1.0) {
          // console.log('hidden')
          line.visible = false;
        }
      }
    // })
    }
  }

  // アウトラインの表示制御
  // outlinesDisplayControl = (inStart, inEnd, outStart, outEnd, divCount) => {
  //   const inRatio  = THREE.MathUtils.smoothstep(this.progRatio, inStart, inEnd);
  //   const outRatio = THREE.MathUtils.smoothstep(this.progRatio, outStart, outEnd);
  //   // if (inRatio <= 0.0 || outRatio >= 1.0) return;
  //   // console.log(this.outlines)
  //   this.outlines.children.forEach((line) => {
  //     // group.children.forEach((line) => {
  //       // console.log(line)
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
  //     // })
  //   });
  // }
  outlinesDisplayControl = (inStart, inEnd, outStart, outEnd, divCount) => {
    const inRatio  = THREE.MathUtils.smoothstep(this.progRatio, inStart, inEnd);
    const outRatio = THREE.MathUtils.smoothstep(this.progRatio, outStart, outEnd);
    // if (inRatio <= 0.0 || outRatio >= 1.0) return;
    this.outlines.children.forEach((group) => {
      group.children.forEach((line) => {
        // console.log(line)
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
      })
    });
    this.outlineEdges.children.forEach((group) => {
      group.children.forEach((edge) => {
        // edge.visible = true;
      // edge.material.opacity = 1.0;
        edge.material.opacity = inRatio - outRatio * 1.2;
        // console.log(edge)
        // if (inRatio >= 0.5 && outRatio <= 0.5) {
        //   console.log('visible')
        //   edge.visible = true;
        //   // edge.material.opacity = inRatio;
        // } else if (outRatio > 0.5) {
        //   console.log('invisible')
        //   edge.visible = false;
        //   // edge.material.opacity = 1.0 - outRatio * 2;
        //   // edge.visible = false;
        // } else {
        //   console.log('invisible')
        //   edge.visible = false;

        // }
      })
    });
  }

  // 図形の表示制御
  shapesDisplayControl = (inStart, inEnd, outStart, outEnd) => {
    const inRatio  = THREE.MathUtils.smoothstep(this.progRatio, inStart, inEnd);
    const outRatio = THREE.MathUtils.smoothstep(this.progRatio, outStart, outEnd);
    // if (inRatio <= 0.0 || outRatio >= 1.0) return;
    this.shapes.children.forEach((group) => {
      group.children.forEach((shape) => {
        // console.log(shape)
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
    })
  }

  // descの表示制御
  descDisplayControl = (inStart, inEnd, outStart, outEnd) => {
    const inRatio  = THREE.MathUtils.smoothstep(this.progRatio, inStart, inEnd);
    const outRatio = THREE.MathUtils.smoothstep(this.progRatio, outStart, outEnd);
    // if (inRatio <= 0.0 || outRatio >= 1.0) return;
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

    // ファウンダーの表示アニメーション制御
    // this.foundersDisplayControl();

    // 画面に表示
    this.renderer.render(this.scene, this.camera);

    // 次のフレームを要求
    requestAnimationFrame(() => this.render());
  }
}
