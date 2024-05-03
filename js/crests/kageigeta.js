'use strict';

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Grid from './grid.js';

export default class Kageigeta {
  constructor() {

    // 基本カラー
    this.frontColor    = 0xffffff;
    this.backColor     = 0x111111;
    this.guideColor    = 0x999999;
    // this.guideColor    = 0x666666;

    // ウィンドウサイズ
    this.w = window.innerWidth;
    this.h = window.innerHeight

    // カメラのZ位置
    this.camZ = 3000;

    // スクローラーの高さ
    this.scroller = document.getElementById('scroller');
    this.scrollerH = this.scroller.scrollHeight - this.h;
    // console.log(this.scroller.scrollHeight - this.h);

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

    // シーン
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(this.backColor);

    this.guidelines = [];
    this.mainVers = [];
    this.mainlines = [];
    this.mainfills = [];
    this.count = 0;

    // フレーム・グリッドの描画
    this.grid = new Grid();
    this.gridGroup = this.grid.generate();
    this.scene.add(this.gridGroup);

    // ガイドラインの作成
    this.generateGuideline();

    // 図形の頂点を取得
    this.getVertices();

    // 本線の作成
    this.generateMainLine();

    // 塗りつぶし図形の描画
    this.generateMainFill();

    // const controls = new OrbitControls( this.camera, this.renderer.domElement);
    // controls.target.set( 0, 0, 0 );
    // controls.enableDamping = true;
    // controls.dampingFactor = 0.2;
    // controls.update();

    window.addEventListener( 'resize', this.onWindowResize );

    // infoの準備
    this.jpName = document.getElementById('jpName');
    this.jpDesc = document.getElementById('jpDesc');
    this.enName = document.getElementById('enName');
    this.enDesc = document.getElementById('enDesc');

    this.jpName.textContent = '陰井桁';
    this.jpDesc.textContent = '井筒・井桁紋とは、井戸をモチーフとした家紋。井戸の地上部分を囲むように囲まれた井の字型の木組を「井桁」、また円形のものを「井筒」というが、紋章では正方形のものを井筒、菱形のものを井桁と呼ぶ。';
    this.enName.textContent = 'Kage-Igeta';
    this.enDesc.textContent = 'The Izutsu/Igeta crest is a family crest with a well motif. The well-shaped wooden structure surrounding the above-ground part of the well is called "Igeta", and the circular one is called "Izutsu", but in the coat of arms, the square one is called "Izutsu", and the diamond-shaped one is called "Igeta".';

    // 描画ループ開始
    this.render();
  }

  // 画面のスクロール量を取得a
  scrolled(y) {
    // console.log(y);
    this.scrollY = y;
  }

  // ガイドラインを作成
  generateGuideline = () => {
    const a = 0.8;
    const bs = [400, 500, 960, 1060, 1180, 1280];
    const divCount = 200;
    // this.guidelines = [];
    bs.forEach((b) => {
      const group = [];
      for (var q = 0;q <= 3;q ++) {
        var points = [];

        var startX, endX, a1, b1, g1, g2;
        if (q == 0) {
          a1 = a, b1 = b, g1 = -this.size, g2 = this.size;
          startX = g1;
          endX   = (g2 - b1) / a1;
        } else if (q == 1) {
          a1 = -a, b1 = b, g1 = this.size, g2 = this.size;
          startX = (g1 - b1) / a1;
          endX   = g2;
        } else if (q == 2) {
          a1 = a, b1 = -b, g1 = this.size, g2 = -this.size;
          startX = g1;
          endX   = (g2 - b1) / a1;
        } else if (q == 3) {
          a1 = -a, b1 = -b, g1 = -this.size, g2 = -this.size;
          startX = (g1 - b1) / a1;
          endX   = g2;
        }

        for (var d = 0;d <= divCount - 1;d ++) {
          const midX = THREE.MathUtils.damp(startX, endX, 10, d / divCount);
          const mid = {x: midX, y: a1 * midX + b1};
          points.push(new THREE.Vector3(mid.x, mid.y, 0));
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        geometry.setDrawRange(0, 0);
        const material = new THREE.LineBasicMaterial({
          color: this.guideColor,
          // side: THREE.DoubleSide,
          transparent: true
        });
        const line = new THREE.Line(geometry, material);
        group.push(line);
        this.scene.add(line);
      }
      this.guidelines.push(group);
    })
  }

  // 本線を作成
  generateMainLine = () => {
    const divCount = 200;
    var group = [];
    const vers = this.mainVers;
    vers.forEach((figure) => {
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
              const midX = THREE.MathUtils.damp(startX, endX, 10, d / divCount);
              const mid = {x: midX, y: a1 * midX + b1};
              points.push(new THREE.Vector3(mid.x, mid.y, 1));
            }
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            geometry.setDrawRange(0, 0);
            const material = new THREE.LineBasicMaterial({
              color: this.frontColor,
              side: THREE.DoubleSide,
              // transparent: true,
              // opacity: 0.0,
            });
            const line = new THREE.Line(geometry, material);
            group.push(line);
            this.scene.add(line);
            this.mainlines.push(group);
          })
        }
      })
    })
  }

  // 塗りつぶし図形を生成
  generateMainFill = () => {
    this.mainVers.forEach((figure) => {
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
      this.mainfills.push(mesh);
      this.scene.add(mesh);
    });
  }

  // ２直線の交点を求める式
  getIntersect = (a1, b1, a2, b2) => {
    const interX = (b2 - b1) / (a1 - a2);
    const interY = ((a1 * b2) - (a2 * b1)) / (a1 - a2);
    return {x: interX, y: interY};
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
    this.mainVers.push(vs);

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
    this.mainVers.push(vs);
  }

  // ウィンドウサイズ変更
  onWindowResize = () => {
    this.w = window.innerWidth;
    this.h = window.innerHeight

    this.camera.aspect = this.w / this.h;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.w, this.h);

    this.render();
  }

  // テーマカラー変更
  onChangeTheme = (theme) => {
    if (theme == 'dark') {
      this.frontColor    = 0xffffff;
      this.backColor     = 0x111111;
      this.guideColor    = 0x999999;
      // this.guideColor    = 0x666666;
      this.gridColor     = 0x333333;
      this.gridThinColor = 0x1a1a1a;
    } else {
      this.frontColor    = 0x111111;
      this.backColor     = 0xffffff;
      this.guideColor    = 0x333333;
      // this.guideColor    = 0x999999;
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
    this.guidelines.forEach((group) => {
      group.forEach((line) => {
        line.material.color = new THREE.Color(this.guideColor);
      })
    })

    // 本線の色を変更
    this.mainlines.forEach((group) => {
      group.forEach((line) => {
        line.material.color = new THREE.Color(this.frontColor);
      })
    })

    // 図形の色を変更
    this.mainfills.forEach((figure) => {
      figure.material.color = new THREE.Color(this.frontColor);
    })
  }

  // プログレスバーのアニメーション制御
  progressBarControl = (tick) => {
    const bar = document.getElementById('bar');
    const rate = document.getElementById('rate');
    const ratio = tick * 100;
    rate.textContent = ratio.toFixed(1) + '%';
    bar.style = 'transform: translateX(-' + (100 - ratio) + '%);';
  }

  // ガイドラインの描画アニメーション制御
  guidelineDrawAnimeControl = (tick) => {
    for (var i = 0;i <= this.guidelines.length - 1;i ++) {
      const lines = this.guidelines[i];
      const linesLen = lines.length;
      for(var j = 0;j <= linesLen - 1;j ++) {
        const line = lines[j];
        const start = 0.0;
        const end   = 0.4;
        const delay = 0;
        var count = 0;
        if (tick <= start) {
          count = 0;
        } else if (tick > start && tick <= end) {
          const ratio = (tick - (start + i * 0.05)) / end;
          count = THREE.MathUtils.lerp(0, 200, ratio) - delay;
        } else if (tick > end) {
          count = 200;
        }
        line.geometry.setDrawRange(0, count);
      }
    }
  }

  // 本線の表示アニメーション制御
  mainlineAnimeControl = (tick) => {
    const start = 0.4;
    const end   = 0.5;
    for (var i = 0;i <= this.mainlines.length - 1;i ++) {
      const lines = this.mainlines[i];
      const linesLen = lines.length;
      for(var j = 0;j <= linesLen - 1;j ++) {
        var count = 0;
        const line = lines[j];
        if (tick <= start) {
          count = 0;
        } else if (tick > start && tick <= end) {
          const ratio = (tick - start) / (end - start);
          count = THREE.MathUtils.lerp(0, 200, ratio);
        } else if (tick > end) {
          count = 200;
        }
        line.geometry.setDrawRange(0, count);
      }
    }
  }

  // 塗りつぶし図形のアニメーション制御
  mainfillAnimeControl = (tick) => {
    const start = 0.5;
    const end   = 0.7;
    for (var i = 0;i <= this.mainfills.length - 1;i ++) {
      var ratio;
      const material = this.mainfills[i].material;
      if (tick <= start) {
        ratio = 0.0;
      } else if (tick > start && tick <= end) {
        ratio = (tick - start) / (end - start);
        // count = THREE.MathUtils.lerp(0, 1, ratio);
      } else if (tick > end) {
        ratio = 1.0;
      }
      material.opacity = THREE.MathUtils.damp(0.0, 1.0, 3, ratio);
    }
  }

  // ガイドラインのフェードアウトアニメーション制御
  guidelineFadeOutAnimeControl = (tick) => {
    const start = 0.45;
    const end   = 0.55;
    this.guidelines.forEach((lines) => {
      const num = lines.length - 1;
      for (var i = 0;i <= num;i ++) {
        const material = lines[i].material;
        var ratio;
        if (tick <= start) {
          ratio = 0.0;
          lines[i].visible = true;
        } else if (tick > start && tick <= end) {
          ratio = (tick - start) / (end - start);
          // count = THREE.MathUtils.lerp(0, 1, ratio);
        } else if (tick > end) {
          ratio = 1.0;
          lines[i].visible = false;
        }
        material.opacity = THREE.MathUtils.damp(1.0, 0.0, 2, ratio);
      }
    });
  }

  // カメラを回転するアニメーション制御
  cameraRotateAnimeControl = (tick) => {
    const start = 0.6;
    const end   = 1.0;
    var x, z;
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
    } else if (tick >= start && tick < end) {
      opaPer = THREE.MathUtils.damp(0.0, 1.0, 5, percent);
      traPer = THREE.MathUtils.damp(100,   0, 5, percent);
    } else if (tick >= end) {
      opaPer = 1.0;
      traPer = 0;
    }
    this.jpName.style = "opacity: " + opaPer + ";transform: translateX(-" + traPer +"%);"
    this.jpDesc.style = "opacity: " + opaPer + ";transform: translateY( " + traPer +"%);"
    this.enName.style = "opacity: " + opaPer + ";transform: translateX( " + traPer +"%);"
    this.enDesc.style = "opacity: " + opaPer + ";transform: translateY( " + traPer +"%);"
  }

  render = () => {
    // 次のフレームを要求
    requestAnimationFrame(() => this.render());

    // const sec = performance.now();

    const tick = this.scrollY / this.scrollerH;
    // console.log(tick);

    // プログレスバーのアニメーション制御
    this.progressBarControl(tick);

    // ガイドラインの表示アニメーション制御
    this.guidelineDrawAnimeControl(tick);

    // 本線の表示アニメーション制御
    this.mainlineAnimeControl(tick);

    // 塗りつぶし図形をフェードイン
    this.mainfillAnimeControl(tick);

    // ガイドラインをフェードアウト
    this.guidelineFadeOutAnimeControl(tick);

    // グリッドをフェードアウト
    this.grid.fadeOut(tick, 0.35, 0.5);

    // 図形の周りを一回転
    this.cameraRotateAnimeControl(tick);

    // descのアニメーションを制御
    this.descAnimeControl(tick);

    // 画面に表示
    this.renderer.render(this.scene, this.camera);
  }
}
