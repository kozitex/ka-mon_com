'use strict';

import * as THREE from 'three';
import Grid from './grid.js';

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

    // スクローラーの高さ
    this.rollHeight = 2000;
    this.roll = document.getElementById('roll');
    this.roll.style = 'height: ' + this.rollHeight + 'vh;'
    this.rollLength = this.roll.scrollHeight - this.h;

    // スクロールの所要時間
    this.scrollDur = 10000;

    // スクロールの進捗率
    this.progRatio = 0;

    // レンダラー
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    this.renderer.setSize(this.w, this.h);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // DOMにレンダラーのcanvasを追加
    this.kamon = document.getElementById('kamon');
    this.kamon.appendChild(this.renderer.domElement);

    // カメラ
    this.camZ = 4000;
    this.camera = new THREE.PerspectiveCamera(45, this.w / this.h, 1, 10000);
    this.camera.position.set(0, 0, this.camZ);

    // シーン
    this.scene = new THREE.Scene();

    // オブジェクト格納用のグループ
    this.guidelines = new THREE.Group();
    this.outlines = new THREE.Group();
    this.shapes = new THREE.Group();

    // フレーム・グリッドの描画
    this.grid = new Grid();
    this.grids = this.grid.draw();
    this.scene.add(this.grids);

    // infoの準備
    this.jpName = document.getElementById('jpName');
    this.jpDesc = document.getElementById('jpDesc');
    this.enName = document.getElementById('enName');
    this.enDesc = document.getElementById('enDesc');

    // 描画ループ開始
    this.render();
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
    this.grid.changeTheme(this.gridColor, this.gridThinColor);

    // ガイドラインの色を変更
    this.guidelines.children.forEach((line) => {
      line.material.color = new THREE.Color(this.guideColor);
    })

    // アウトラインの色を変更
    this.outlines.children.forEach((line) => {
      line.material.color = new THREE.Color(this.frontColor);
    })

    // 図形の色を変更
    this.shapes.children.forEach((figure) => {
      figure.material.color = new THREE.Color(this.frontColor);
    })
  }

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
    return new THREE.Vector3(a + r * Math.cos(s), b + r * Math.sin(s), 0);
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
    // return {x: interX, y: interY};
    return new THREE.Vector3(interX, interY, 0);
  }

  // プログレスバーのアニメーション制御
  progressBarControl() {
    const bar = document.querySelector('#progress .bar');
    const rate = document.querySelector('#progress .rate');
    const ratio = this.progRatio * 100;
    rate.textContent = ratio.toFixed(1) + '%';
    bar.style.strokeDashoffset = 283 * (1 - this.progRatio);
  }

  // ガイドラインの描画アニメーション制御
  guidelinesDrawControl = (start, end, divCount, delayFactor) => {
    const ratio = THREE.MathUtils.smoothstep(this.progRatio, start, end);
    for (var i = 0;i <= this.guidelines.children.length - 1;i ++) {
      const line = this.guidelines.children[i];
      var delay = i * delayFactor;
      line.geometry.setDrawRange(0, divCount * (ratio - delay));
    }
  }

  // アウトラインの表示アニメーション制御
  outlinesDrawControl = (start, end, divCount) => {
    const ratio = THREE.MathUtils.smoothstep(this.progRatio, start, end);
    this.outlines.children.forEach((outline) => {
      outline.geometry.setDrawRange(0, divCount * ratio);
    });
  }

  // 塗りつぶし図形のアニメーション制御
  shapesDrawControl = (start, end) => {
    const ratio = THREE.MathUtils.smoothstep(this.progRatio, start, end);
    this.shapes.children.forEach((shape) => {
      shape.material.opacity = ratio;
    });
  }

  // ガイドラインのフェードアウトアニメーション制御
  guidelinesFadeoutControl = (start, end) => {
    const ratio = THREE.MathUtils.smoothstep(this.progRatio, start, end);
    this.guidelines.children.forEach((line) => {
      line.visible = true;
      if (ratio >= 1) line.visible = false;
      line.material.opacity = 1.0 - ratio;
    });
  }

  // アウトラインのフェードアウトアニメーション制御
  outlinesFadeoutControl = (start, end) => {
    const ratio = THREE.MathUtils.smoothstep(this.progRatio, start, end);
    this.outlines.children.forEach((line) => {
      // console.log(line)
      line.visible = true;
      if (ratio >= 1) line.visible = false;
      line.material.opacity = 1.0 - ratio;
    });
  }

  // descのアニメーション制御
  descSlideinControl = (start, end) => {
    const ratio = THREE.MathUtils.smoothstep(this.progRatio, start, end);
    const trRatio = (1 - ratio) * 100;
    this.jpName.style = "opacity: " + ratio + ";transform: translateX(-" + trRatio +"%);"
    this.jpDesc.style = "opacity: " + ratio + ";transform: translateY( " + trRatio +"%);"
    this.enName.style = "opacity: " + ratio + ";transform: translateX( " + trRatio +"%);"
    this.enDesc.style = "opacity: " + ratio + ";transform: translateY( " + trRatio +"%);"
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
