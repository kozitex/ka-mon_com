'use strict';

import * as THREE from 'three';
import Grid from './grid.js';
import Mist from './mist.js';
import KageIgeta from './kamon/kage-igeta.js';
import HidariFutatsuDomoe from './kamon/hidari-futatsu-domoe.js';
import Kikyou from './kamon/kikyou.js';
import GenjiGuruma from './kamon/genji-guruma.js';
import MaruNiChigaiTakanoha from './kamon/maru-ni-chigai-takanoha.js';
import DakiMyouga from './kamon/daki-myouga.js';
import MaruNiUmebachi from './kamon/maru-ni-umebachi.js';
import MaruNiFutatsuKarigane from './kamon/maru-ni-futatsu-karigane.js';

export default class Canvas {

  constructor() {

    // 基本カラー
    this.frontColor    = 0xffffff;
    this.backColor     = 0x111111;
    this.guideColor    = 0x999999;

    // ウィンドウサイズを取得
    this.w = window.innerWidth;
    this.h = window.innerHeight

    // グリッド・フレームの最大サイズ
    this.edge = 3200;

    // スクローラーの高さを指定
    const rollHeight = 4000;
    this.roll = document.getElementById('roll');
    this.roll.style = 'height: ' + rollHeight + 'vh;'
    this.rollLength = this.roll.scrollHeight - this.h;

    // 家紋１つ当たりのスクロールの所要時間
    this.scrollDur = 15000;

    // スクロールの進捗割合
    this.progRatio = 0;

    // レンダラー
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    this.renderer.setSize(this.w, this.h);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // HTMLにレンダラーのcanvasを追加
    const kamonElm = document.getElementById('kamon');
    kamonElm.appendChild(this.renderer.domElement);

    // カメラ
    const camZ = 4000;
    this.camera = new THREE.PerspectiveCamera(45, this.w / this.h, 1, 10000);
    this.camera.position.set(0, 0, camZ);

    // シーン
    this.scene = new THREE.Scene();

    // 共有マテリアル
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

    // フレーム・グリッドを生成
    this.grid = new Grid();
    const grids = this.grid.generate();
    this.scene.add(grids);

    // ミストを生成
    this.mist = new Mist();
    const mists = this.mist.generate();
    this.scene.add(mists);

    // infoの準備
    this.jpName = document.getElementById('jpName');
    this.jpDesc = document.getElementById('jpDesc');
    this.enName = document.getElementById('enName');
    this.enDesc = document.getElementById('enDesc');

    // 家紋リストから５つ抽選して初期化
    this.nowIndex = 0
    const kamonList = [
      new HidariFutatsuDomoe(),
      new Kikyou(),
      new GenjiGuruma(),
      new MaruNiChigaiTakanoha(),
      new DakiMyouga(),
      new MaruNiUmebachi,
      new MaruNiFutatsuKarigane
    ];
    const maxNum = 7;
    const kamonNum = kamonList.length > maxNum ? maxNum : kamonList.length;
    this.kamons = this.lottery(kamonList, kamonNum);
    this.kamons.forEach((kamon) => kamon.init());

    // キャンバスに家紋をセット
    this.reset();

    // 描画ループ開始
    this.render();
  }

  // 配列から抽選
  lottery = (arr, num) => {
    const result = [], check = [];
    const min = 0, max = arr.length - 1;

    const intRandom = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    for(var i = min; i <= num - 1; i++){
      while(true){
        const chosen = intRandom(min, max);
        if(!check.includes(chosen)) {
          check.push(chosen);
          result.push(arr[chosen]);
          break;
        }
      }
    }
    return result;
  }

  // キャンバスに家紋のオブジェクトや情報をセット
  reset() {
    this.kamon = this.kamons[this.nowIndex];
    this.group = this.kamon.generate();
    this.scene.add(this.group);

    var myTheme = localStorage.getItem('theme');
    this.changeTheme(myTheme);

    this.jpName.innerHTML = this.kamon.jpNameText;
    this.jpDesc.innerHTML = this.kamon.jpDescText;
    this.enName.innerHTML = this.kamon.enNameText;
    this.enDesc.innerHTML = this.kamon.enDescText;
  }

  // 画面のスクロール量を取得
  scrolled = (y) => {
    this.progRatio = y / this.rollLength;
  }

  // ウィンドウサイズ変更
  windowResize = () => {
    this.w = window.innerWidth;
    this.h = window.innerHeight
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.w, this.h);
    this.camera.aspect = this.w / this.h;
    this.camera.updateProjectionMatrix();
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

    // グリッドの色を変更
    this.grid.changeTheme(this.gridColor, this.gridThinColor);

    // ミストの色を変更
    this.mist.changeTheme(this.guideColor);

    // 家紋のテーマカラーを変更
    this.kamon.changeTheme(this.frontColor, this.backColor, this.guideColor);
  }

  // 次の家紋に切り替える
  draw = (direction) => {
    if (direction == 'forward' && this.nowIndex == this.kamons.length - 1) {
      this.nowIndex = 0;
    } else if (direction == 'back' && this.nowIndex == 0) {
      this.nowIndex = this.kamons.length - 1;
    } else {
      direction == 'forward' ? this.nowIndex ++ : this.nowIndex --;
    }

    this.dispose();

    this.reset();
  }

  // オブジェクトやシーンをすべてクリア
  dispose = () => {

    const disposeMesh = (mesh) => {
      mesh.material.dispose();
      mesh.geometry.dispose();
      this.scene.remove(mesh);
    }

    this.group.children.forEach((child) => {
      if (child.isGroup) {
        child.children.forEach((child) => {
          if (child.isGroup) {
            child.children.forEach((child) => {
              if (child.isGroup) {
                child.children.forEach((child) => {
                  if (child.isGroup) {
                    child.children.forEach((child) => disposeMesh(child));
                  } else {
                    disposeMesh(child);
                  }
                })
              } else {
                disposeMesh(child);
              }
            })
          } else {
            disposeMesh(child);
          }
        })
      } else {
        disposeMesh(child);
      }
    })
    this.scene.remove(this.group);
  }

  // プログレスバーのアニメーション制御
  progressBarControl() {
    const bar = document.querySelector('#progress .bar');
    const rate = document.querySelector('#progress .rate');
    const ratio = this.progRatio * 100;
    rate.textContent = ratio.toFixed(1) + '%';
    bar.style.strokeDashoffset = 283 * (1 - this.progRatio);
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

    // グリッドの表示アニメーション制御
    this.grid.displayControl(this.progRatio, 0.0, 0.05, 0.3, 0.45);

    // ミストの表示アニメーション制御
    this.mist.displayControl(this.progRatio, 0.0, 0.05, 0.0, 0.1, 0.95, 1.0);

    // 家紋の各アニメーション制御
    this.kamon.guidelineDisplayControl(this.progRatio);
    this.kamon.outlineDisplayControl(this.progRatio);
    this.kamon.shapeDisplayControl(this.progRatio);
    this.kamon.shapeRotationControl(this.progRatio);

    // descのアニメーションを制御
    this.descDisplayControl(0.7, 0.8, 0.95, 1.0);

    // 画面に表示
    this.renderer.render(this.scene, this.camera);

    // 次のフレームを要求
    requestAnimationFrame(() => this.render());
  }
}
