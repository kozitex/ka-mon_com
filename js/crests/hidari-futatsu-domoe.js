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

    // スクローラーの高さ
    const scrollerHeight = 3000;
    this.scroller = document.getElementById('scroller');
    this.scroller.style = 'height: ' + scrollerHeight + 'vh;'
    this.scrollerH = this.scroller.scrollHeight - this.h;

    // スクロールの所要時間
    this.scrollDur = 7000;

    // スクロール量
    this.scrollY = 0;

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
    this.camZ = 4000;
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

    // this.progressArr.forEach((id) => {
    //   const progressDiv = document.createElement('div');
    //   const labelDiv = document.createElement('div');
    //   const barWrapDiv = document.createElement('div');
    //   const barDiv = document.createElement('div');
    //   const rateDiv = document.createElement('div');

    //   progressDiv.id = id;
    //   progressDiv.classList.add('progress');
    //   labelDiv.classList.add('label');
    //   labelDiv.textContent = id;
    //   barWrapDiv.classList.add('barWrap');
    //   barDiv.classList.add('bar');
    //   rateDiv.classList.add('rate');
    //   rateDiv.textContent = '0.0%';

    //   progressDiv.appendChild(labelDiv);
    //   barWrapDiv.appendChild(barDiv);
    //   progressDiv.appendChild(barWrapDiv);
    //   progressDiv.appendChild(rateDiv);

    //   const progress = document.querySelector('#progress .content');
    //   progress.appendChild(progressDiv);
    // })

    this.guidelines = [];
    this.mainVers = [];
    this.outlines = [];
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
    this.gridGroup = this.grid.draw();
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

    // this.logRecord('- the guidelines have been generated.');
  }

  // アウトラインを作成
  generateOutLine = () => {
    const circles = [
      {a:    0, b:    0, r: 1600, f: -73, t: 110},
      {a:    0, b:    0, r: 1600, f: 107, t: 290},
      {a:    0, b:  825, r:  750, f: 421, t: 218},
      {a:    0, b: -825, r:  750, f: 240, t:  38},
      {a: -110, b:  490, r: 1100, f: 470, t: 309},
      {a:  110, b: -490, r: 1100, f: 290, t: 129},
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
      this.shapeGroup.add(mesh);
      // this.scene.add(mesh);
  
    })
    this.scene.add(this.shapeGroup);
    // this.logRecord('- the shapes have been generated.');
  }

  // ウィンドウサイズ変更
  windowResize = () => {
    this.w = window.innerWidth;
    this.h = window.innerHeight

    this.camera.aspect = this.w / this.h;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.w, this.h);

    this.scrollerH = this.scroller.scrollHeight - this.h;

    // this.logRecord('- window has been resized.');

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
    this.guidelines.forEach((line) => {
      line.material.color = new THREE.Color(this.guideColor);
    })

    // アウトラインの色を変更
    this.outlines.forEach((line) => {
      line.material.color = new THREE.Color(this.frontColor);
    })

    // 図形の色を変更
    this.shapeGroup.children.forEach((figure) => {
      figure.material.color = new THREE.Color(this.frontColor);
    })

    // this.logRecord('- theme color is set to ' + theme + '.');
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
    const divCount = 1333;
    const start = 0.05;
    const end   = 0.35;
    const ratio = THREE.MathUtils.smoothstep(tick, start, end);

    for (var i = 0;i <= this.guidelines.length - 1;i ++) {
      const line = this.guidelines[i];
      var delay = i * 0.05;
      line.geometry.setDrawRange(0, divCount * (ratio - delay));
    }

    // if (ratio <= 0) {
    //   this.gdStarted = true;
    // } else if (ratio >= 1) {
    //   if (this.gdEnded) {
    //     this.logRecord('- drawing of the guidelines has ended.');
    //     this.gdEnded = false;
    //   }
    // } else {
    //   if (this.gdStarted) {
    //     this.logRecord('- drawing of the guidelines has started.');
    //     this.gdStarted = false;
    //   }
    //   this.gdEnded = true;
    // }
    // // console.log(ratio);
    // this.progressBarControl('guidelines', ratio * 0.75);
  }

  // アウトラインの表示アニメーション制御
  outlineDrawAnimeControl = (tick) => {
    const divCount = 1000;
    const start = 0.35;
    const end   = 0.5;
    const ratio = THREE.MathUtils.smoothstep(tick, start, end);

    this.outlines.forEach((outline) => {
      outline.geometry.setDrawRange(0, divCount * ratio);
    });

    // if (ratio <= 0) {
    //   this.odStarted = true;
    //   // this.progressBarControl('outlines', 0);
    // } else if (ratio >= 1) {
    //   if (this.odEnded) {
    //     this.logRecord('- drawing of the outlines has ended.');
    //     this.odEnded = false;
    //   }
    // } else {
    //   if (this.odStarted) {
    //     this.logRecord('- drawing of the outlines has started.');
    //     this.odStarted = false;
    //   }
    //   this.odEnded = true;
    // }

    // this.progressBarControl('outlines', ratio * 0.75);
  }

  // 塗りつぶし図形のアニメーション制御
  shapeAnimeControl = (tick) => {
    const start = 0.5;
    const end   = 0.6;
    const ratio = THREE.MathUtils.smoothstep(tick, start, end);

    this.shapeGroup.children.forEach((shape) => {
      shape.material.opacity = ratio;
    });

    // if (ratio <= 0) {
    //   this.sdStarted = true;
    // } else if (ratio >= 1) {
    //   if (this.sdEnded) {
    //     this.logRecord('- drawing of the shapes has ended.');
    //     this.sdEnded = false;
    //   }
    // } else {
    //   if (this.sdStarted) {
    //     this.logRecord('- drawing of the shapes has started.');
    //     this.sdStarted = false;
    //   }
    //   this.sdEnded = true;
    // }

    // this.progressBarControl('shapes', ratio);
  }

  // ガイドラインのフェードアウトアニメーション制御
  guidelineFadeOutAnimeControl = (tick) => {
    const start = 0.45;
    const end   = 0.55;
    const ratio = THREE.MathUtils.smoothstep(tick, start, end);

    this.guidelines.forEach((line) => {
      line.visible = true;
      if (ratio >= 1) line.visible = false;
      line.material.opacity = 1.0 - ratio;
    });

    // if (ratio <= 0) {
    //   this.gfStarted = true;
    // } else if (ratio >= 1) {
    //   if (this.gfEnded) {
    //     this.logRecord('- the guidelines have finished fading out.');
    //     this.gfEnded = false;
    //   }
    // } else {
    //   if (this.gfStarted) {
    //     this.logRecord('- the guidelines have begun to fade out.');
    //     this.gfStarted = false;
    //   }
    //   this.gfEnded = true;
    // }

    // if (ratio > 0) {
    //   this.progressBarControl('guidelines', 0.75 + ratio / 4);
    // }
  }

  // アウトラインのフェードアウトアニメーション制御
  outlineFadeOutAnimeControl = (tick) => {
    const start = 0.5;
    const end   = 0.6;
    const ratio = THREE.MathUtils.smoothstep(tick, start, end);

    this.outlines.forEach((line) => {
      line.visible = true;
      if (ratio >= 1) line.visible = false;
      line.material.opacity = 1.0 - ratio;
    });

    // if (ratio <= 0) {
    //   this.ofStarted = true;
    // } else if (ratio >= 1) {
    //   if (this.ofEnded) {
    //     this.logRecord('- the outlines have finished fading out.');
    //     this.ofEnded = false;
    //   }
    // } else {
    //   if (this.ofStarted) {
    //     this.logRecord('- the outlines have begun to fade out.');
    //     this.ofStarted = false;
    //   }
    //   this.ofEnded = true;
    // }

    // if (ratio > 0) {
    //   this.progressBarControl('outlines', 0.75 + ratio / 4);
    // }
  }

  // 図形を回転させるアニメーション制御
  shapeRotateAnimeControl = (tick) => {
    const start = 0.6;
    const end   = 1.0;
    const ratio = THREE.MathUtils.smoothstep(tick, start, end);

    for (var i = 0;i <= this.shapeGroup.children.length - 1;i ++) {
      const shape = this.shapeGroup.children[i];
      const posRatio = - 4 * ratio ** 2 + 4 * ratio;
      const pos = 1500 * posRatio;
      if (i == 0) {
        shape.position.set(-pos, 0, 0);
      } else {
        shape.position.set(pos, 0, 0);
      }
    }

    this.shapeGroup.rotation.x = -360 * ratio * (Math.PI / 180);
    this.shapeGroup.rotation.z = -360 * ratio * (Math.PI / 180);

    // if (ratio <= 0) {
    //   this.rtStarted = true;
    // } else if (ratio >= 1) {
    //   if (this.rtEnded) {
    //     this.logRecord('- the shapes rotation has finished.');
    //     this.rtEnded = false;
    //   }
    // } else {
    //   if (this.rtStarted) {
    //     this.logRecord('- the shapes started rotating.');
    //     this.rtStarted = false;
    //   }
    //   this.rtEnded = true;
    // }

    // this.progressBarControl('rotation', ratio);
  }

  // descのアニメーション制御
  descAnimeControl = (tick) => {
    const start = 0.8;
    const end   = 0.9;
    const ratio = THREE.MathUtils.smoothstep(tick, start, end);
    const trRatio = (1 - ratio) * 100;

    this.jpName.style = "opacity: " + ratio + ";transform: translateX(-" + trRatio +"%);"
    this.jpDesc.style = "opacity: " + ratio + ";transform: translateY( " + trRatio +"%);"
    this.enName.style = "opacity: " + ratio + ";transform: translateX( " + trRatio +"%);"
    this.enDesc.style = "opacity: " + ratio + ";transform: translateY( " + trRatio +"%);"

    // if (tick < start) {
    //   this.daStarted = true;
    // } else if (tick >= start && tick < end) {
    //   if (this.daStarted) {
    //     this.logRecord('- the description display animation has started.');
    //     this.daStarted = false;
    //   }
    //   this.daEnded = true;
    // } else if (tick >= end) {
    //   if (this.daEnded) {
    //     this.logRecord('- the description display animation has ended.');
    //     this.daEnded = false;
    //   }
    // }

    // this.progressBarControl('description', ratio);
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
    this.progressBarControl('progress', tick);

    // ガイドラインの表示アニメーション制御
    this.guidelineDrawAnimeControl(tick);

    // アウトラインの表示アニメーション制御
    this.outlineDrawAnimeControl(tick);

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

    // descのアニメーションを制御
    this.descAnimeControl(tick);

    // 画面に表示
    this.renderer.render(this.scene, this.camera);

    // 次のフレームを要求
    requestAnimationFrame(this.render);
  }
}
