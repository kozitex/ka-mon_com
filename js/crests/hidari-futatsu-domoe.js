'use strict';

import * as THREE from 'three';
import Grid from './grid.js';

export default class HidariFutatsuDomoe {
  constructor() {

    // 基本カラー
    this.frontColor    = 0xffffff;
    this.backColor     = 0x111111;
    this.guideColor    = 0x999999;

    // ウィンドウサイズ
    this.w = window.innerWidth;
    this.h = window.innerHeight

    // カメラのZ位置
    this.camZ = 4000;

    // スクローラーの高さ
    const scrollerHeight = 3000;
    this.scroller = document.getElementById('scroller');
    this.scroller.style = 'height: ' + scrollerHeight + 'vh;'
    this.scrollerH = this.scroller.scrollHeight - this.h;

    // スクロール量
    this.scrollY = 0;

    // フレームのサイズ
    this.size = 3200;

    // カメラの回転量
    this.rot = 0;

    // レンダラー
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    this.renderer.setSize(this.w, this.h);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  
    // DOMにレンダラーのcanvasを追加
    document.body.appendChild(this.renderer.domElement);

    // カメラ
    this.camera = new THREE.PerspectiveCamera(45, this.w / this.h, 1, 10000);
    this.camera.position.set(0, 0, this.camZ);

    // ロガーのDOMを取得
    this.logger = document.getElementById('logger');

    // シーン
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.backColor);

    this.progressArr = [
      'overall', 'guidelines', 'outlines', 'shapes', 'rotation', 'description'
    ];

    this.progressArr.forEach((id) => {
      const progressDiv = document.createElement('div');
      const labelDiv = document.createElement('div');
      const barWrapDiv = document.createElement('div');
      const barDiv = document.createElement('div');
      const rateDiv = document.createElement('div');

      progressDiv.id = id;
      progressDiv.classList.add('progress');
      labelDiv.classList.add('label');
      labelDiv.textContent = id;
      barWrapDiv.classList.add('barWrap');
      barDiv.classList.add('bar');
      rateDiv.classList.add('rate');
      rateDiv.textContent = '0.0%';

      progressDiv.appendChild(labelDiv);
      barWrapDiv.appendChild(barDiv);
      progressDiv.appendChild(barWrapDiv);
      progressDiv.appendChild(rateDiv);

      const progress = document.querySelector('#progress .content');
      progress.appendChild(progressDiv);
    })

    this.guidelines = [];
    this.mainVers = [];
    this.outlines = [];
    this.shapes = [];
    this.count = 0;
    this.shapeGroup = new THREE.Group();

    // ログ記述用のフラグ
    this.gdStarted = true;
    this.gdEnded = true;
    this.odStarted = true;
    this.odEnded = true;
    this.sdStarted = true;
    this.sdEnded = true;
    this.gfStarted = true;
    this.gfEnded = true;
    this.ofStarted = true;
    this.ofEnded = true;
    this.rtStarted = true;
    this.rtEnded = true;
    this.daStarted = true;
    this.daEnded = true;

    // フレーム・グリッドの描画
    this.grid = new Grid();
    this.gridGroup = this.grid.generate();
    this.scene.add(this.gridGroup);

    // ガイドラインの作成
    this.generateGuideline();

    // 図形の頂点を取得
    // this.getVertices();

    // アウトラインの作成
    this.generateOutLine();

    // 塗りつぶし図形の描画
    this.generateShape();

    // infoの準備
    this.jpName = document.getElementById('jpName');
    this.jpDesc = document.getElementById('jpDesc');
    this.enName = document.getElementById('enName');
    this.enDesc = document.getElementById('enDesc');

    this.jpName.textContent = '左二つ巴';
    this.jpDesc.textContent = '井筒・井桁紋とは、井戸をモチーフとした家紋。井戸の地上部分を囲むように囲まれた井の字型の木組を「井桁」、また円形のものを「井筒」というが、紋章では正方形のものを井筒、菱形のものを井桁と呼ぶ。';
    this.enName.textContent = 'Hidari-Futatsu-Domoe';
    this.enDesc.textContent = 'The Izutsu/Igeta crest is a family crest with a well motif. The well-shaped wooden structure surrounding the above-ground part of the well is called "Igeta", and the circular one is called "Izutsu", but in the coat of arms, the square one is called "Izutsu", and the diamond-shaped one is called "Igeta".';

    // 描画ループ開始
    this.render();
  }

  // 画面のスクロール量を取得
  scrolled(y) {
    this.scrollY = y;
  }

  // 円の方程式
  circle = (a, b, r, s) => {
    return {x: a + r * Math.cos(s), y: b + r * Math.sin(s)};
  }

  // ガイドラインを作成
  generateGuideline = () => {
    const circles = [
      {a:    0, b:    0, r: 1600},
      {a:    0, b:  825, r:  750},
      {a:    0, b: -825, r:  750},
      {a: -110, b:  490, r: 1100},
      {a:  110, b: -490, r: 1100},
    ];
    const divCount = 1000;
    circles.forEach((circle) => {
      const points = [];
      const a = circle.a;
      const b = circle.b;
      const r = circle.r;
      for (var i = 0;i <= divCount - 1;i ++) {
        const deg = THREE.MathUtils.damp(90, 450, 10, i / (divCount - 1));
        const s = deg * (Math.PI / 180);
        const mid = this.circle(a, b, r, s);
        points.push(new THREE.Vector3(mid.x, mid.y, 0));
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      geometry.setDrawRange(0, 0);
      const material = new THREE.LineBasicMaterial({
        color: this.guideColor,
        transparent: true
      });
      const line = new THREE.Line(geometry, material);
      this.guidelines.push(line);
      this.scene.add(line);
    })

    this.logRecord('- the guidelines have been generated.');
  }

  // // ３点の座標から角度を求める
  // getRadian = (a, b, c, d, e, f) => {
  //   return Math.acos((c - a) * (e - a) + (d - b) * (f - b) / Math.sqrt((c - a) ** 2 + (d - b) ** 2) * Math.sqrt((e - a) ** 2 + (f - b) ** 2));
  // }

  // アウトラインを作成
  generateOutLine = () => {
    const circles = [
      {a:    0, b:    0, r: 1600, f: -72, t: 110},
      {a:    0, b:    0, r: 1600, f: 108, t: 290},
      {a:    0, b:  825, r:  750, f: 421, t: 218},
      {a:    0, b: -825, r:  750, f: 240, t:  38},
      {a: -110, b:  490, r: 1100, f: 470, t: 309},
      {a:  110, b: -490, r: 1100, f: 290, t: 129},

      // {a:    0, b:    0, r: 1600, f: 110, t: -72},
      // {a:    0, b:    0, r: 1600, f: 290, t: 108},
      // {a:    0, b:  825, r:  750, f: 218, t: 421},
      // {a:    0, b: -825, r:  750, f:  38, t: 240},
      // {a: -110, b:  490, r: 1100, f: 309, t: 470},
      // {a:  110, b: -490, r: 1100, f: 129, t: 290},
    ];
    const divCount = 1000;
    circles.forEach((circle) => {

      const gs = [0, 1, -1, 2, -2, 3, -3];
      gs.forEach((g) => {
        const points = [];
        const a = circle.a;
        const b = circle.b;
        const r = circle.r + g;
        const f = circle.f;
        const t = circle.t;
        for (var i = 0;i <= divCount - 1;i ++) {
          const deg = THREE.MathUtils.damp(f, t, 10, i / (divCount - 1));
          const s = deg * (Math.PI / 180);
          const mid = this.circle(a, b, r, s);
          points.push(new THREE.Vector3(mid.x, mid.y, 0));
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        geometry.setDrawRange(0, 0);
        const material = new THREE.LineBasicMaterial({
          color: this.frontColor,
          transparent: true
        });
        const line = new THREE.Line(geometry, material);
        this.outlines.push(line);
        this.scene.add(line);
      })
    })

  }

  // アウトラインを作成
  // generateOutLine2 = () => {
  //   const divCount = 200;
  //   var group = [];
  //   const vers = this.mainVers;
  //   vers.forEach((figure) => {
  //     figure.forEach((vers) => {
  //       for (var i = 0;i <= vers.length - 2;i ++) {
  //         const gs = [0, 1, -1, 2, -2, 3, -3];
  //         gs.forEach((g) => {
  //           const startX = vers[i].x + g;
  //           const startY = vers[i].y;
  //           const endX   = vers[i + 1].x + g;
  //           const endY   = vers[i + 1].y;
  //           const a1 = (startY - endY) / (startX - endX);
  //           const b1 = (startX * endY - endX * startY) / (startX - endX);
  //           const points = [];
  //           if (startX == endX && startY == endY) return;
  //           for (var d = 0;d <= divCount - 1;d ++) {
  //             const midX = THREE.MathUtils.lerp(startX, endX, d / divCount);
  //             const mid = {x: midX, y: a1 * midX + b1};
  //             points.push(new THREE.Vector3(mid.x, mid.y, 1));
  //           }
  //           const geometry = new THREE.BufferGeometry().setFromPoints(points);
  //           geometry.setDrawRange(0, 0);
  //           const material = new THREE.LineBasicMaterial({
  //             color: this.frontColor,
  //             side: THREE.DoubleSide,
  //           });
  //           const line = new THREE.Line(geometry, material);
  //           group.push(line);
  //           this.scene.add(line);
  //           this.outlines.push(group);
  //         })
  //       }
  //     })
  //   })
  //   this.logRecord('- the outlines have been generated.');
  // }

  // 塗りつぶし図形を生成
  generateShape = () => {
    const figures = [
      [
        {a:    0, b:  825, r:  750, f:  218, t:  420, g: -6},
        {a: -110, b:  490, r: 1100, f:   70, t:  110, g: -6},
        {a:    0, b:    0, r: 1600, f:  110, t:  270, g: -6},
        {a:  110, b: -490, r: 1100, f:  -95, t: -228, g:  6},
      ],
      [
        {a:    0, b: -825, r:  750, f:   38, t:  240, g: -6},
        {a:  110, b: -490, r: 1100, f:  250, t:  290, g: -6},
        {a:    0, b:    0, r: 1600, f:  280, t:  450, g: -6},
        {a: -110, b:  490, r: 1100, f:   85, t:  -48, g:  6},
      ]
    ];
    const divCount = 2000;
    figures.forEach((figure) => {
      const points = [];
      figure.forEach((arc) => {
        const a  = arc.a;
        const b  = arc.b;
        const r  = arc.r + arc.g;
        const f  = arc.f;
        const t  = arc.t;
        for (var i = 0;i <= divCount - 1;i ++) {
          const deg = THREE.MathUtils.damp(f, t, 10, i / (divCount - 1));
          const s = deg * (Math.PI / 180);
          const mid = this.circle(a, b, r, s);
          points.push(new THREE.Vector2(mid.x, mid.y));
        }
      })
      const shape = new THREE.Shape(points);

      const material = new THREE.MeshBasicMaterial({
        color: this.frontColor,
        side: THREE.DoubleSide,
        opacity: 0.0,
        transparent: true
      });
      const geometry = new THREE.ShapeGeometry(shape);
      const mesh = new THREE.Mesh(geometry, material);
      this.shapes.push(mesh);
      this.shapeGroup.add(mesh);
      // this.scene.add(mesh);
  
    })
    this.scene.add(this.shapeGroup);
    this.logRecord('- the shapes have been generated.');
  }

  // generateShape2 = () => {
  //   this.mainVers.forEach((figure) => {
  //     const shape = new THREE.Shape();
  //     const path = new THREE.Path();
  //     for (var i = 0;i <= figure.length - 1;i ++) {
  //       const vers = figure[i];
  //       if (i == 1) {
  //         for (var j = 0;j <= vers.length - 1;j ++) {
  //           const ver = vers[j];
  //           if (j == 0) {
  //             shape.moveTo(ver.x, ver.y);
  //           } else {
  //             shape.lineTo(ver.x, ver.y);
  //           }
  //         }
  //       } else {
  //         for (var j = 0;j <= vers.length - 1;j ++) {
  //           const ver = vers[j];
  //           if (j == 0) {
  //             path.moveTo(ver.x, ver.y);
  //           } else {
  //             path.lineTo(ver.x, ver.y);
  //           }
  //         }
  //       }
  //     }
  //     shape.holes.push(path);

  //     const material = new THREE.MeshBasicMaterial({
  //       color: this.frontColor,
  //       side: THREE.DoubleSide,
  //       opacity: 0.0,
  //       transparent: true
  //     });
  //     const geometry = new THREE.ShapeGeometry(shape);
  //     const mesh = new THREE.Mesh(geometry, material);
  //     this.shapes.push(mesh);
  //     this.scene.add(mesh);
  //   });
  //   this.logRecord('- the shapes have been generated.');
  // }

  // // ２直線の交点を求める式
  // getIntersect = (a1, b1, a2, b2) => {
  //   const interX = (b2 - b1) / (a1 - a2);
  //   const interY = ((a1 * b2) - (a2 * b1)) / (a1 - a2);
  //   return {x: interX, y: interY};
  // }

  // // 図形の頂点を取得
  // getVertices = () => {
  //   var vs = [];
  //   for (var i = 0;i <= 1;i ++) {
  //     const arr = [];
  //     var b;
  //     if (i == 0) {
  //       b = 400;
  //     } else {
  //       b = 500;
  //     }
  //     arr.push(this.getIntersect( 0.8,  b, -0.8, -b));
  //     arr.push(this.getIntersect( 0.8,  b, -0.8,  b));
  //     arr.push(this.getIntersect(-0.8,  b,  0.8, -b));
  //     arr.push(this.getIntersect( 0.8, -b, -0.8, -b));
  //     arr.push(this.getIntersect(-0.8, -b,  0.8,  b));
  //     vs.push(arr);
  //   }
  //   this.mainVers.push(vs);

  //   vs = [];
  //   const arr1 = [];
  //   arr1.push(this.getIntersect(-0.8,  -960,  0.8,   960));
  //   arr1.push(this.getIntersect(-0.8,  -960,  0.8,  1180));
  //   arr1.push(this.getIntersect( 0.8,  1180, -0.8,  -500));
  //   arr1.push(this.getIntersect(-0.8,  -500,  0.8,   960));
  //   arr1.push(this.getIntersect( 0.8,   960, -0.8,   500));
  //   arr1.push(this.getIntersect(-0.8,   500,  0.8,  1180));
  //   arr1.push(this.getIntersect( 0.8,  1180, -0.8,   960));
  //   arr1.push(this.getIntersect(-0.8,   960,  0.8,   960));

  //   arr1.push(this.getIntersect( 0.8,   960, -0.8,   960));
  //   arr1.push(this.getIntersect( 0.8,   960, -0.8,  1180));
  //   arr1.push(this.getIntersect(-0.8,  1180,  0.8,   500));
  //   arr1.push(this.getIntersect( 0.8,   500, -0.8,   960));
  //   arr1.push(this.getIntersect(-0.8,   960,  0.8,  -500));
  //   arr1.push(this.getIntersect( 0.8,  -500, -0.8,  1180));
  //   arr1.push(this.getIntersect(-0.8,  1180,  0.8,  -960));
  //   arr1.push(this.getIntersect( 0.8,  -960, -0.8,   960));

  //   arr1.push(this.getIntersect(-0.8,   960,  0.8,  -960));
  //   arr1.push(this.getIntersect(-0.8,   960,  0.8, -1180));
  //   arr1.push(this.getIntersect( 0.8, -1180, -0.8,   500));
  //   arr1.push(this.getIntersect(-0.8,   500,  0.8,  -960));
  //   arr1.push(this.getIntersect( 0.8,  -960, -0.8,  -500));
  //   arr1.push(this.getIntersect(-0.8,  -500,  0.8, -1180));
  //   arr1.push(this.getIntersect( 0.8, -1180, -0.8,  -960));
  //   arr1.push(this.getIntersect(-0.8,  -960,  0.8,  -960));

  //   arr1.push(this.getIntersect( 0.8,  -960, -0.8,  -960));
  //   arr1.push(this.getIntersect( 0.8,  -960, -0.8, -1180));
  //   arr1.push(this.getIntersect(-0.8, -1180,  0.8,  -500));
  //   arr1.push(this.getIntersect( 0.8,  -500, -0.8,  -960));
  //   arr1.push(this.getIntersect(-0.8,  -960,  0.8,   500));
  //   arr1.push(this.getIntersect( 0.8,   500, -0.8, -1180));
  //   arr1.push(this.getIntersect(-0.8, -1180,  0.8,   960));
  //   arr1.push(this.getIntersect( 0.8,   960, -0.8,  -960));

  //   vs.push(arr1);

  //   const arr2 = [];
  //   arr2.push(this.getIntersect(-0.8, -1060,  0.8,  1060));
  //   arr2.push(this.getIntersect(-0.8, -1060,  0.8,  1280));
  //   arr2.push(this.getIntersect( 0.8,  1280, -0.8,  -400));
  //   arr2.push(this.getIntersect(-0.8,  -400,  0.8,  1060));
  //   arr2.push(this.getIntersect( 0.8,  1060, -0.8,   400));
  //   arr2.push(this.getIntersect(-0.8,   400,  0.8,  1280));
  //   arr2.push(this.getIntersect( 0.8,  1280, -0.8,  1060));
  //   arr2.push(this.getIntersect(-0.8,  1060,  0.8,  1060));

  //   arr2.push(this.getIntersect( 0.8,  1060, -0.8,  1060));
  //   arr2.push(this.getIntersect( 0.8,  1060, -0.8,  1280));
  //   arr2.push(this.getIntersect(-0.8,  1280,  0.8,   400));
  //   arr2.push(this.getIntersect( 0.8,   400, -0.8,  1060));
  //   arr2.push(this.getIntersect(-0.8,  1060,  0.8,  -400));
  //   arr2.push(this.getIntersect( 0.8,  -400, -0.8,  1280));
  //   arr2.push(this.getIntersect(-0.8,  1280,  0.8, -1060));
  //   arr2.push(this.getIntersect( 0.8, -1060, -0.8,  1060));

  //   arr2.push(this.getIntersect(-0.8,  1060,  0.8, -1060));
  //   arr2.push(this.getIntersect(-0.8,  1060,  0.8, -1280));
  //   arr2.push(this.getIntersect( 0.8, -1280, -0.8,   400));
  //   arr2.push(this.getIntersect(-0.8,   400,  0.8, -1060));
  //   arr2.push(this.getIntersect( 0.8, -1060, -0.8,  -400));
  //   arr2.push(this.getIntersect(-0.8,  -400,  0.8, -1280));
  //   arr2.push(this.getIntersect( 0.8, -1280, -0.8, -1060));
  //   arr2.push(this.getIntersect(-0.8, -1060,  0.8, -1060));

  //   arr2.push(this.getIntersect( 0.8, -1060, -0.8, -1060));
  //   arr2.push(this.getIntersect( 0.8, -1060, -0.8, -1280));
  //   arr2.push(this.getIntersect(-0.8, -1280,  0.8,  -400));
  //   arr2.push(this.getIntersect( 0.8,  -400, -0.8, -1060));
  //   arr2.push(this.getIntersect(-0.8, -1060,  0.8,   400));
  //   arr2.push(this.getIntersect( 0.8,   400, -0.8, -1280));
  //   arr2.push(this.getIntersect(-0.8, -1280,  0.8,  1060));
  //   arr2.push(this.getIntersect( 0.8,  1060, -0.8, -1060));

  //   vs.push(arr2);
  //   this.mainVers.push(vs);

  //   this.logRecord('- the vertices have been calculated.');
  // }

  // ウィンドウサイズ変更
  windowResize = () => {
    this.w = window.innerWidth;
    this.h = window.innerHeight

    this.camera.aspect = this.w / this.h;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.w, this.h);

    this.scrollerH = this.scroller.scrollHeight - this.h;

    this.logRecord('- window has been resized.');

    this.render();
  }

  // テーマカラー変更
  changeTheme = (theme) => {
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
    var index = 0;
    this.gridGroup.children.forEach((line) => {
      if (index <= 1) {
        line.material.color = new THREE.Color(this.gridColor);
      } else {
        line.material.color = new THREE.Color(this.gridThinColor);
      }
      index ++;
    })

    // ガイドラインの色を変更
    this.guidelines.forEach((line) => {
      line.material.color = new THREE.Color(this.guideColor);
    })

    // アウトラインの色を変更
    this.outlines.forEach((line) => {
      line.material.color = new THREE.Color(this.frontColor);
    })

    // 図形の色を変更
    this.shapes.forEach((figure) => {
      figure.material.color = new THREE.Color(this.frontColor);
    })

    this.logRecord('- theme color is set to ' + theme + '.');
  }

  // プログレスバーのアニメーション制御
  progressBarControl = (id, tick) => {
    const bar = document.querySelector('#' + id + ' .bar');
    const rate = document.querySelector('#' + id + ' .rate');
    const ratio = tick * 100;
    rate.textContent = ratio.toFixed(1) + '%';
    bar.style = 'transform: translateX(-' + (100 - ratio) + '%);';
  }

  // ガイドラインの描画アニメーション制御
  guidelineDrawAnimeControl = (tick) => {
    const start = 0.05;
    const end   = 0.35;
    const divCount = 1000;
    for (var i = 0;i <= this.guidelines.length - 1;i ++) {
      const line = this.guidelines[i];
      const waiting = i * 0.05;
      var count = 0;
      if (tick <= start) {
        count = 0;
      } else if (tick > start && tick <= end) {
        const adjust = waiting;
        const ratio = (tick - (start + adjust)) / (end - (start + adjust));
        count = THREE.MathUtils.lerp(0, divCount, ratio);
      } else if (tick > end) {
        count = divCount;
      }
      line.geometry.setDrawRange(0, count);
    }
    if (tick <= start) {
      this.gdStarted = true;
      this.progressBarControl('guidelines', 0);
    } else if (tick > start && tick <= end) {
      if (this.gdStarted) {
        this.logRecord('- drawing of the guidelines has started.');
        this.gdStarted = false;
      }
      this.gdEnded = true;
      const ratio = (tick - start) / (end - start + 0.1);
      this.progressBarControl('guidelines', ratio);
    } else if (tick > end) {
      if (this.gdEnded) {
        this.logRecord('- drawing of the guidelines has ended.');
        this.gdEnded = false;
      }
      this.progressBarControl('guidelines', 0.75);
    }
  }

  // アウトラインの表示アニメーション制御
  outlineAnimeControl = (tick) => {
    const start = 0.35;
    const end   = 0.5;
    const divCount = 1000;
    const ratio = (tick - start) / (end - start);
    for (var i = 0;i <= this.outlines.length - 1;i ++) {
      const line = this.outlines[i];
      var count = 0;
      if (tick <= start) {
        count = 0;
      } else if (tick > start && tick <= end) {
        count = THREE.MathUtils.lerp(0, divCount, ratio);
      } else if (tick > end) {
        count = divCount;
      }
      line.geometry.setDrawRange(0, count);
    }
    if (tick <= start) {
      this.odStarted = true;
      this.progressBarControl('outlines', 0);
    } else if (tick > start && tick <= end) {
      if (this.odStarted) {
        this.logRecord('- drawing of the outlines has started.');
        this.odStarted = false;
      }
      this.odEnded = true;
      const ratio = (tick - start) / (end - start + 0.05);
      this.progressBarControl('outlines', ratio);
    } else if (tick > end) {
      if (this.odEnded) {
        this.logRecord('- drawing of the outlines has ended.');
        this.odEnded = false;
      }
      this.progressBarControl('outlines', 0.75);
    }
  }

  // 塗りつぶし図形のアニメーション制御
  shapeAnimeControl = (tick) => {
    const start = 0.5;
    const end   = 0.6;
    for (var i = 0;i <= this.shapes.length - 1;i ++) {
      var ratio;
      const material = this.shapes[i].material;
      if (tick <= start) {
        ratio = 0.0;
      } else if (tick > start && tick <= end) {
        ratio = (tick - start) / (end - start);
      } else if (tick > end) {
        ratio = 1.0;
      }
      material.opacity = THREE.MathUtils.lerp(0.0, 1.0, ratio);
    }
    if (tick <= start) {
      this.sdStarted = true;
      this.progressBarControl('shapes', 0);
    } else if (tick > start && tick <= end) {
      if (this.sdStarted) {
        this.logRecord('- drawing of the shapes has started.');
        this.sdStarted = false;
      }
      this.sdEnded = true;
      const ratio = (tick - start) / (end - start);
      this.progressBarControl('shapes', ratio);
    } else if (tick > end) {
      if (this.sdEnded) {
        this.logRecord('- drawing of the shapes has ended.');
        this.sdEnded = false;
      }
      this.progressBarControl('shapes', 1);
    }
  }

  // ガイドラインのフェードアウトアニメーション制御
  guidelineFadeOutAnimeControl = (tick) => {
    const start = 0.45;
    const end   = 0.55;
    this.guidelines.forEach((line) => {
      const material = line.material;
      var ratio;
      if (tick <= start) {
        ratio = 0.0;
        line.visible = true;
      } else if (tick > start && tick <= end) {
        line.visible = true;
        ratio = (tick - start) / (end - start);
      } else if (tick > end) {
        ratio = 1.0;
        line.visible = false;
      }
      material.opacity = THREE.MathUtils.lerp(1.0, 0.0, ratio);
    });
    if (tick <= start) {
      this.gfStarted = true;
    } else if (tick > start && tick <= end) {
      if (this.gfStarted) {
        this.logRecord('- the guidelines have begun to fade out.');
        this.gfStarted = false;
      }
      this.gfEnded = true;
      const ratio = (tick - start) / (end - start) / 4;
      this.progressBarControl('guidelines', 0.75 + ratio);
    } else if (tick > end) {
      if (this.gfEnded) {
        this.logRecord('- the guidelines have finished fading out.');
        this.gfEnded = false;
      }
      this.progressBarControl('guidelines', 1);
    }
  }

  // アウトラインのフェードアウトアニメーション制御
  outlineFadeOutAnimeControl = (tick) => {
    const start = 0.5;
    const end   = 0.6;
    this.outlines.forEach((line) => {
      const material = line.material;
      var ratio;
      if (tick <= start) {
        ratio = 0.0;
        line.visible = true;
      } else if (tick > start && tick <= end) {
        line.visible = true;
        ratio = (tick - start) / (end - start);
      } else if (tick > end) {
        ratio = 1.0;
        line.visible = false;
      }
      material.opacity = THREE.MathUtils.lerp(1.0, 0.0, ratio);
    });
    if (tick <= start) {
      this.ofStarted = true;
    } else if (tick > start && tick <= end) {
      if (this.ofStarted) {
        this.logRecord('- the outlines have begun to fade out.');
        this.ofStarted = false;
      }
      this.ofEnded = true;
      const ratio = (tick - start) / (end - start) / 4;
      this.progressBarControl('outlines', 0.75 + ratio);
    } else if (tick > end) {
      if (this.ofEnded) {
        this.logRecord('- the outlines have finished fading out.');
        this.ofEnded = false;
      }
      this.progressBarControl('outlines', 1);
    }
  }

  // 図形を回転させるアニメーション制御
  shapeRotateAnimeControl = (tick) => {
    const start = 0.6;
    const end   = 1.0;
    // var x, y, z;
    // const group = new THREE.Group();
    
    for (var i = 0;i <= this.shapes.length - 1;i ++) {
      const shape = this.shapes[i];
    // this.shapes.forEach((shape) => {
      // const material = line.material;
      var ratio;
      if (tick <= start) {
        ratio = 0.0;
        // line.visible = true;
      } else if (tick > start && tick <= end) {
        // line.visible = true;
        ratio = (tick - start) / (end - start);
      } else if (tick > end) {
        ratio = 1.0;
        // line.visible = false;
      }
      // const total = -360;
      const rotX = THREE.MathUtils.damp(0, -360, 5, ratio);
      // const rotY = THREE.MathUtils.damp(0, 0, 5, ratio);
      const rotZ = THREE.MathUtils.damp(0, -720, 5, ratio);

      // console.log(rotZ);

      var pos = 0;
      // if (ratio < 0.5) {
      //   // pos = 1000 * ratio * 2;
      //   // pos = THREE.MathUtils.damp(0, 1000, 5, ratio);
      //   const posRatio = ratio * 2;
      //   pos = THREE.MathUtils.lerp(0, 2000, posRatio);
      // } else {
      //   // pos = THREE.MathUtils.damp(0, 1000, 5, (1 - ratio));
      //   // pos = 1000 * (1.0 - ratio) * 2;
      //   const posRatio = (1 - ratio) * 2;
      //   pos = THREE.MathUtils.lerp(0, 2000, posRatio);
      // }
      if (ratio < 0.35) {
        // pos = 1000 * ratio * 2;
        // pos = THREE.MathUtils.damp(0, 1000, 5, ratio);
        const posRatio = ratio / 0.35;
        pos = THREE.MathUtils.damp(0, 1500, 5, posRatio);
      } else if (ratio <= 0.7) {
        // pos = THREE.MathUtils.damp(0, 1000, 5, (1 - ratio));
        // pos = 1000 * (1.0 - ratio) * 2;
        const posRatio = (0.7 - ratio) / 0.35;
        pos = THREE.MathUtils.damp(0, 1500, 10, posRatio);
      } else {

      }


      console.log(tick, ratio, pos);

      if (i == 0) {
        shape.position.set(-pos, 0, 0);

      } else {
        shape.position.set(pos, 0, 0);
      }


      // shape.rotation.x = rotX * (Math.PI / 180);
      // shape.rotation.y = rotY * (Math.PI / 180);
      // shape.rotation.z = rotZ * (Math.PI / 180);
      this.shapeGroup.rotation.x = rotX * (Math.PI / 180);
      this.shapeGroup.rotation.z = rotZ * (Math.PI / 180);

      // material.opacity = THREE.MathUtils.lerp(1.0, 0.0, ratio);
    // });
    }

    // if (tick > start && tick <= end) {
    //   const total = 360;
    //   const ratio = (tick - start) / (end - start);
    //   this.rot = THREE.MathUtils.damp(0, total, 5, ratio);
    //   const radian = (this.rot * Math.PI) / 180;
    //   x = this.camZ * Math.sin(radian);
    //   z = this.camZ * Math.cos(radian);
    // } else {
    //   x = 0;
    //   z = this.camZ;
    // }
    // this.camera.position.set(x, 0, z);
    // this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    if (tick <= start) {
      this.rtStarted = true;
      this.progressBarControl('rotation', 0);
    } else if (tick > start && tick <= end) {
      if (this.rtStarted) {
        this.logRecord('- the camera started rotating.');
        this.rtStarted = false;
      }
      this.rtEnded = true;
      const ratio = (tick - start) / (end - start);
      this.progressBarControl('rotation', ratio);
    } else if (tick >= end) {
      if (this.rtEnded) {
        this.logRecord('- the camera rotation has finished.');
        this.rtEnded = false;
      }
      this.progressBarControl('rotation', 1);
    }
  }

  // カメラを回転するアニメーション制御
  cameraRotateAnimeControl = (tick) => {
    const start = 0.6;
    const end   = 1.0;
    var x, y, z;
    if (tick > start && tick <= end) {
      const total = 360;
      const ratio = (tick - start) / (end - start);
      this.rot = THREE.MathUtils.damp(0, total, 5, ratio);
      const radian = (this.rot * Math.PI) / 180;
      x = this.camZ * Math.sin(radian);
      z = this.camZ * Math.cos(radian);
    } else {
      x = 0;
      z = this.camZ;
    }
    this.camera.position.set(x, 0, z);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    if (tick <= start) {
      this.rtStarted = true;
      this.progressBarControl('rotation', 0);
    } else if (tick > start && tick <= end) {
      if (this.rtStarted) {
        this.logRecord('- the camera started rotating.');
        this.rtStarted = false;
      }
      this.rtEnded = true;
      const ratio = (tick - start) / (end - start);
      this.progressBarControl('rotation', ratio);
    } else if (tick >= end) {
      if (this.rtEnded) {
        this.logRecord('- the camera rotation has finished.');
        this.rtEnded = false;
      }
      this.progressBarControl('rotation', 1);
    }
  }

  // descのアニメーション制御
  descAnimeControl = (tick) => {
    const start =  0.8;
    const end   = 0.9;
    const percent = (tick - start) * 10;
    var opaPer;
    var traPer;
    if (tick < start) {
      opaPer = 0.0;
      traPer = 100;
      this.daStarted = true;
      this.progressBarControl('description', 0);
    } else if (tick >= start && tick < end) {
      opaPer = THREE.MathUtils.damp(0.0, 1.0, 5, percent);
      traPer = THREE.MathUtils.damp(100,   0, 5, percent);
      if (this.daStarted) {
        this.logRecord('- the description display animation has started.');
        this.daStarted = false;
      }
      this.daEnded = true;
      const ratio = (tick - start) / (end - start);
      this.progressBarControl('description', ratio);
    } else if (tick >= end) {
      opaPer = 1.0;
      traPer = 0;
      if (this.daEnded) {
        this.logRecord('- the description display animation has ended.');
        this.daEnded = false;
      }
      this.progressBarControl('description', 1);
    }
    this.jpName.style = "opacity: " + opaPer + ";transform: translateX(-" + traPer +"%);"
    this.jpDesc.style = "opacity: " + opaPer + ";transform: translateY( " + traPer +"%);"
    this.enName.style = "opacity: " + opaPer + ";transform: translateX( " + traPer +"%);"
    this.enDesc.style = "opacity: " + opaPer + ";transform: translateY( " + traPer +"%);"
  }

  //ログを記録する
  logRecord = (text) => {
    const arrText = text.split('');
    const divElm = document.createElement('div');
    this.logger.appendChild(divElm);
    for (var i = 0;i <= arrText.length - 1;i ++) {
      setTimeout((i) => {
        divElm.innerHTML += arrText[i];
        var bottom = this.logger.scrollHeight - this.logger.clientHeight;
        this.logger.scroll(0, bottom);
      }, i * 20, i);
    }
  }

  render = () => {
    // const sec = performance.now();

    const tick = this.scrollY / this.scrollerH;

    // プログレスバーのアニメーション制御
    this.progressBarControl('overall', tick);

    // ガイドラインの表示アニメーション制御
    this.guidelineDrawAnimeControl(tick);

    // アウトラインの表示アニメーション制御
    this.outlineAnimeControl(tick);

    // 塗りつぶし図形をフェードイン
    this.shapeAnimeControl(tick);

    // ガイドラインをフェードアウト
    this.guidelineFadeOutAnimeControl(tick);

    // アウトラインをフェードアウト
    this.outlineFadeOutAnimeControl(tick);

    // グリッドをフェードアウト
    this.grid.fadeOut(tick, 0.35, 0.5);

    // 図形を回転
    this.shapeRotateAnimeControl(tick);

    // 図形の周りを一回転
    // this.cameraRotateAnimeControl(tick);

    // descのアニメーションを制御
    this.descAnimeControl(tick);

    // 画面に表示
    this.renderer.render(this.scene, this.camera);

    // 次のフレームを要求
    requestAnimationFrame(this.render);
  }
}
