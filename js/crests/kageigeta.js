'use strict';

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Grid from './grid.js';

export default class Kageigeta {
  constructor() {
    this.rot = 0;
    this.frontColor    = 0xffffff;
    this.backColor     = 0x111111;
    this.guideColor    = 0x666666;

    // ウィンドウサイズ
    this.w = window.innerWidth;
    this.h = window.innerHeight

    // フレームのサイズ
    this.size = 1600;

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
    // this.camera.position.set(0, 0, 8000);

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

    const controls = new OrbitControls( this.camera, this.renderer.domElement);
    controls.target.set( 0, 0, 0 );
    controls.enableDamping = true;
    controls.dampingFactor = 0.2;
    controls.update();

    window.addEventListener( 'resize', this.onWindowResize );

    // 描画ループ開始
    this.render();
  }

  // ガイドラインを作成
  generateGuideline = () => {
    const a = 0.8;
    const bs = [400, 500, 960, 1060, 1180, 1280];
    const divCount = 200;
    this.guidelineGroup = [];
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
      this.guidelineGroup.push(group);
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
          const startX = vers[i].x;
          const startY = vers[i].y;
          const endX   = vers[i + 1].x;
          const endY   = vers[i + 1].y;
          const a1 = (startY - endY) / (startX - endX);
          const b1 = (startX * endY - endX * startY) / (startX - endX);
          const points = [];
          if (startX == endX && startY == endY) continue;
          for (var d = 0;d <= divCount - 1;d ++) {
            const midX = THREE.MathUtils.damp(startX, endX, 10, d / divCount);
            const mid = {x: midX, y: a1 * midX + b1};
            points.push(new THREE.Vector3(mid.x, mid.y, 1));
          }
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          geometry.setDrawRange(0, 0);
          const material = new THREE.LineBasicMaterial({
            color: this.frontColor,
            // side: THREE.DoubleSide,
            // transparent: true,
            // opacity: 0.0,
          });
          const line = new THREE.Line(geometry, material);
          group.push(line);
          this.scene.add(line);
          this.mainlines.push(group);
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
        // side: THREE.DoubleSide,
        opacity: 0.0,
        transparent: true
      });
      const geometry = new THREE.ShapeGeometry(shape);
      const mesh = new THREE.Mesh(geometry, material);
      // mesh.position.z = 2;
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
      this.guideColor    = 0x666666;
      this.gridColor     = 0x333333;
      this.gridThinColor = 0x1a1a1a;
    } else {
      this.frontColor    = 0x111111;
      this.backColor     = 0xffffff;
      this.guideColor    = 0x999999;
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

  render = () => {
    // 次のフレームを要求
    requestAnimationFrame(() => this.render());

    const sec = performance.now();

    // ガイドラインの表示アニメーション
    for (var i = 0;i <= this.guidelineGroup.length - 1;i ++) {
      const lines = this.guidelineGroup[i];
      const linesLen = lines.length;
      for(var j = 0;j <= linesLen - 1;j ++) {
        const line = lines[j];
        const start = 2000;
        const speed = 20;
        const delay = THREE.MathUtils.lerp(0, 30, j / linesLen);
        const count = (sec - (start + i * 300)) / speed;
        line.geometry.setDrawRange(0, count - delay);
      }
    }

    // 本線の表示アニメーション
    for (var i = 0;i <= this.mainlines.length - 1;i ++) {
      const lines = this.mainlines[i];
      const linesLen = lines.length;
      for(var j = 0;j <= linesLen - 1;j ++) {
        const line = lines[j];
        // const count = (sec - 6500) / 15;
        // line.material.opacity = THREE.MathUtils.damp(0.0, 1.0, 3, count);
        line.geometry.setDrawRange(0, (sec - 6500) / 15);
      }
    }

    // 塗りつぶし図形をフェードイン
    for (var i = 0;i <= this.mainfills.length - 1;i ++) {
      const material = this.mainfills[i].material;
      const count = (sec - 8000) / 2000;
      if (sec > 8000) this.mainfills[i].position.z = 1;
      material.opacity = THREE.MathUtils.damp(0.0, 1.0, 3, count);
    }

    // ガイドラインをフェードアウト
    this.guidelineGroup.forEach((lines) => {
      const num = lines.length - 1;
      for (var i = 0;i <= num;i ++) {
        const material = lines[i].material;
        const count = (sec - 8000) / 1000;
        material.opacity = THREE.MathUtils.damp(1.0, 0.0, 2, count);
        if (sec > 9500) lines[i].visible = false;
      }
    });

    // グリッドをフェードアウト
    this.grid.fadeOut((sec - 8000) / 1000);

    if (this.rot <= 379) {
      // this.rot += 1.2;
      this.rot = THREE.MathUtils.damp(0, 380, 5, sec / 8000);
      // ラジアンに変換する
      const radian = (this.rot * Math.PI) / 180;

      const dist = THREE.MathUtils.damp(0, 3000, 5, this.rot / 380);
      // 角度に応じてカメラの位置を設定
      this.camera.position.x = dist * Math.sin(radian);
      this.camera.position.z = dist * Math.cos(radian);
      console.log(this.rot);
      // 原点方向を見つめる
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    }


    // 画面に表示
    this.renderer.render(this.scene, this.camera);
  }
}
