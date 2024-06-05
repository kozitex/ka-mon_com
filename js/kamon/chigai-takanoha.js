'use strict';

import * as THREE from 'three';
import Kamon from '../kamon.js';

export default class ChigaiTakanoha extends Kamon {

  constructor() {

    super();

    this.rollHeight = 4000;

    this.pathW = 35;
    this.verNum = 8;
    this.angleFr = 90;
    this.angleTo = 450;
    this.circlesD = [];   // ベースの4つの中心円

    this.gridExist = true;

    // ガイドラインの作成
    this.generateGuidelines();

    // アウトラインの作成
    this.generateOutlines();

    // 塗りつぶし図形の描画
    this.generateShapes();

    // infoの準備
    this.jpName.innerHTML = '丸に違い鷹の羽';
    this.jpDesc.innerHTML = '車紋（くるまもん）の一種で、平安時代の貴族の乗り物であった牛車の車輪の形をモチーフにした家紋です。牛車は別名で源氏車とも呼ばれていました。また、車紋は佐藤姓の家紋に用いられたことでも知られています。佐藤氏の祖先が伊勢神宮の神事に携わっていた際、使用していた牛車が豪奢で有名だったことが由来で家紋に用いることになったと言われています。';
    this.enName.innerHTML = 'Maruni-Chigai-Takanoha';
    this.enDesc.innerHTML = 'It is a type of Kurumamon (car crest), and is a family crest with a motif of the wheels of an ox cart, which was a vehicle used by aristocrats during the Heian period. The ox-cart was also called the Genji-guruma. The car crest is also known to have been used as the family crest of the Sato family name. It is said that the Sato clan&#39;s ancestors used it as their family crest because the bullock carts they used were famous for their luxury when they were involved in the rituals at Ise Grand Shrine.';
  }

  // ガイドラインを作成
  generateGuidelines = () => {

    const divCount = 1000;

    // 外円
    const outCircles = new THREE.Group();
    const rs = [1600, 1300];
    rs.forEach((r) => {
      const circle = this.circleGen(0, 0, r, this.angleFr, this.angleTo, divCount, this.guideColor);
      outCircles.add(circle);
    });
    this.guidelines.add(outCircles);

    // 羽
    for (var i = 0;i <= 1;i ++) {

      // 羽の輪郭円
      const group1 = new THREE.Group();
      const params1 = [
        {a:   516, b:   516, r: 516},
        {a: - 416, b: - 416, r: 516},
        {a: - 466, b: - 466, r: 516},
        {a: - 516, b: - 516, r: 516},
        {a: - 416, b: - 416, r: 550},
        {a: - 466, b: - 466, r: 550},
      ];
      params1.forEach((param) => {
        const line = this.circleGen(param.a, param.b, param.r, 90, 450, divCount, this.guideColor);
        if (i == 1) line.rotation.z = THREE.MathUtils.degToRad(90);
        group1.add(line);
      });

      // 羽の輪郭線
      const group2 = new THREE.Group();
      const theta = THREE.MathUtils.degToRad(45);
      const params2 = [
        {p:   516 * Math.cos(theta), q:   516 * Math.cos(theta), f: 700, t: - 700},
        {p:   552 * Math.cos(theta), q:   552 * Math.cos(theta), f: 700, t: - 700},
        {p:    35 * Math.cos(theta), q:    35 * Math.cos(theta), f: 950, t: - 950},
        {p:    71 * Math.cos(theta), q:    71 * Math.cos(theta), f: 950, t: - 950},
      ];
      params2.forEach((param) => {
        for (var j = 0;j <= 1;j ++) {
          const line = this.lineGen(1, 1, - (param.p + param.q), param.f + param.p, param.t + param.p, divCount, this.guideColor);
          line.rotation.z = THREE.MathUtils.degToRad(90 * i + 180 * j);
          group2.add(line);
        }
      });

      // 羽の模様（タテ）
      const group3 = new THREE.Group();
      const params3 = [94, 130, 194, 230, 294, 330, - 646, - 610, - 546, - 510, - 446, - 410];
      params3.forEach((param) => {
        const line = this.lineGen(1, 0, - param, 1100, - 1100, divCount, this.guideColor);
        line.rotation.z = THREE.MathUtils.degToRad(90 * i);
        group3.add(line);
      });

      // 羽の模様（ヨコ）
      const group4 = new THREE.Group();
      const params4 = [- 94, - 130, - 194, - 230, - 294, - 330, 646, 610, 546, 510, 446, 410];
      params4.forEach((param) => {
        const line = this.lineGen(0, 1, - param, 1100, - 1100, divCount, this.guideColor);
        line.rotation.z = THREE.MathUtils.degToRad(90 * i);
        group4.add(line);
      });

      this.guidelines.add(group1, group2, group3, group4);
    }

    this.scene.add(this.guidelines);
  }

  // アウトラインを作成
  generateOutlines = () => {

    const divCount = 1000;

    // 外円
    const rs = [1600, 1300];
    rs.forEach((r) => {
      const circle = this.outlineCircleGen(0, 0, r, this.angleFr, this.angleTo, divCount, this.guideColor);
      this.outlines.add(circle);
    });

    // 羽
    for (var i = 0;i <= 1;i ++) {

      // 円のパラメータ
      const ens = [
        {a:   516, b:   516, r: 516},
        {a: - 416, b: - 416, r: 516},
        {a: - 466, b: - 466, r: 516},
        {a: - 516, b: - 516, r: 516},
        {a: - 416, b: - 416, r: 550},
        {a: - 466, b: - 466, r: 550},
      ];

      // 輪郭＆中心の線のパラメータ
      const theta = THREE.MathUtils.degToRad(45);
      const sens = [
        {p: - 516 * Math.cos(theta), q: - 516 * Math.cos(theta)},
        {p: -  71 * Math.cos(theta), q: -  71 * Math.cos(theta)},
        {p: -  35 * Math.cos(theta), q: -  35 * Math.cos(theta)},
      ];

      // 羽の模様線のパラメータ
      const stripes = [94, 130, 194, 230, 294, 330, - 646, - 610, - 546, - 510, - 446, - 410];


      // 輪郭＆中心線の描画
      const sen0Params = [
        {f:    94, t: - 410},
        {f: - 446, t: - 510},
        {f: - 546, t: - 610},
        {f: - 646, t: - 416 - 516 * Math.cos(theta)},
      ];
      sen0Params.forEach((param) => {
        const line = this.outlineGen(1, 1, - (sens[0].p + sens[0].q), param.f , param.t , divCount, this.guideColor);
        line.rotation.set(0, THREE.MathUtils.degToRad(180 * i), THREE.MathUtils.degToRad(90 * i));
        this.outlines.add(line);
      });

      const sen1Params = [
        {f: this.circle(ens[0].a, ens[0].b, ens[0].r, 45 + THREE.MathUtils.radToDeg(Math.asin(71 / ens[0].r))).x, t: 330},
        {f:   294, t:   230},
        {f:   194, t:   130},
        {f:    94, t: - 410},
        {f: - 446, t: - 510},
        {f: - 546, t: - 610},
        {f: - 646, t: this.circle(ens[1].a, ens[1].b, ens[1].r, 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[1].r))).x},
        {f: this.circle(ens[4].a, ens[4].b, ens[4].r, 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[4].r))).x, t: this.circle(ens[2].a, ens[2].b, ens[2].r, 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[2].r))).x},
        {f: this.circle(ens[5].a, ens[5].b, ens[5].r, 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[5].r))).x, t: this.circle(ens[3].a, ens[3].b, ens[3].r, 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[3].r))).x},
      ];
      sen1Params.forEach((param) => {
        const line = this.outlineGen(1, 1, - (sens[1].p + sens[1].q), param.f , param.t , divCount, this.guideColor);
        line.rotation.set(0, THREE.MathUtils.degToRad(180 * i), THREE.MathUtils.degToRad(90 * i));
        this.outlines.add(line);
      });

      const sen2Params = [
        {f: this.circle(ens[0].a, ens[0].b, ens[0].r, 45 + THREE.MathUtils.radToDeg(Math.asin(35 / ens[0].r))).x, t: this.circle(ens[3].a, ens[3].b, ens[3].r, 225 - THREE.MathUtils.radToDeg(Math.asin(35 / ens[3].r))).x},
      ];
      sen2Params.forEach((param) => {
        const line = this.outlineGen(1, 1, - (sens[2].p + sens[2].q), param.f , param.t , divCount, this.guideColor);
        line.rotation.set(0, THREE.MathUtils.degToRad(180 * i), THREE.MathUtils.degToRad(90 * i));
        this.outlines.add(line);
      });

      // 輪郭円の描画
      const en0Params = [
        {f: 45, t: 45 + THREE.MathUtils.radToDeg(Math.asin(35 / ens[0].r))},
        {f: 45 + THREE.MathUtils.radToDeg(Math.asin(71 / ens[0].r)), t: 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - stripes[5]) / ens[0].r))},
        {f: 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - stripes[4]) / ens[0].r)), t: 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - stripes[3]) / ens[0].r))},
        {f: 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - stripes[2]) / ens[0].r)), t: 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - stripes[1]) / ens[0].r))},
      ];
      en0Params.forEach((param) => {
        const line = this.outlineCircleGen(ens[0].a, ens[0].b, ens[0].r, param.f, param.t, divCount, this.guideColor);
        line.rotation.set(0, THREE.MathUtils.degToRad(180 * i), THREE.MathUtils.degToRad(90 * i));
        this.outlines.add(line);
      });

      const en1Params = [
        {f: 135, t: 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[1].r))},
      ];
      en1Params.forEach((param) => {
        const line = this.outlineCircleGen(ens[1].a, ens[1].b, ens[1].r, param.f, param.t, divCount, this.guideColor);
        line.rotation.set(0, THREE.MathUtils.degToRad(180 * i), THREE.MathUtils.degToRad(90 * i));
        this.outlines.add(line);
      });

      const en2Params = [
        {f: 150, t: 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[2].r))},
      ];
      en2Params.forEach((param) => {
        const line = this.outlineCircleGen(ens[2].a, ens[2].b, ens[2].r, param.f, param.t, divCount, this.guideColor);
        line.rotation.set(0, THREE.MathUtils.degToRad(180 * i), THREE.MathUtils.degToRad(90 * i));
        this.outlines.add(line);
      });

      const en3Params = [
        {f: 225 - THREE.MathUtils.radToDeg(Math.asin(35 / ens[3].r)), t: 225},
        {f: 150, t: 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[3].r))},
      ];
      en3Params.forEach((param) => {
        const line = this.outlineCircleGen(ens[3].a, ens[3].b, ens[3].r, param.f, param.t, divCount, this.guideColor);
        line.rotation.set(0, THREE.MathUtils.degToRad(180 * i), THREE.MathUtils.degToRad(90 * i));
        this.outlines.add(line);
      });

      const en4Params = [
        {f: 166, t: 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[4].r))},
      ];
      en4Params.forEach((param) => {
        const line = this.outlineCircleGen(ens[4].a, ens[4].b, ens[4].r, param.f, param.t, divCount, this.guideColor);
        line.rotation.set(0, THREE.MathUtils.degToRad(180 * i), THREE.MathUtils.degToRad(90 * i));
        this.outlines.add(line);
      });

      const en5Params = [
        {f: 166, t: 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[5].r))},
      ];
      en5Params.forEach((param) => {
        const line = this.outlineCircleGen(ens[5].a, ens[5].b, ens[5].r, param.f, param.t, divCount, this.guideColor);
        line.rotation.set(0, THREE.MathUtils.degToRad(180 * i), THREE.MathUtils.degToRad(90 * i));
        this.outlines.add(line);
      });


      // 羽の模様線の描画
      var index = 0;
      stripes.forEach((sen) => {
        const f = this.straight2(1, 1, - (sens[1].p + sens[1].q), sen, undefined).y;
        var t;
        if (index > 1 && index <= 5) {
          t = this.circle(ens[0].a, ens[0].b, ens[0].r, 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - sen) / ens[0].r))).y;
        } else {
          t = this.straight2(1, 1, - (sens[0].p + sens[0].q), sen, undefined).y;
        }
        const line = this.outlineGen(1, 0, - sen, f, t, divCount, this.guideColor);
        line.rotation.set(0, THREE.MathUtils.degToRad(180 * i), THREE.MathUtils.degToRad(90 * i));
        this.outlines.add(line);
        index ++;
      });

    }

    // 反転した羽
    for (var i = 0;i <= 1;i ++) {

      // 円のパラメータ
      const ens = [
        {a:   516, b:   516, r: 516},
        {a: - 416, b: - 416, r: 516},
        {a: - 466, b: - 466, r: 516},
        {a: - 516, b: - 516, r: 516},
        {a: - 416, b: - 416, r: 550},
        {a: - 466, b: - 466, r: 550},
      ];

      // 輪郭＆中心の線のパラメータ
      const theta = THREE.MathUtils.degToRad(45);
      const sens = [
        {p: - 516 * Math.cos(theta), q: - 516 * Math.cos(theta)},
        {p: -  71 * Math.cos(theta), q: -  71 * Math.cos(theta)},
        {p: -  35 * Math.cos(theta), q: -  35 * Math.cos(theta)},
        {p: - 552 * Math.cos(theta), q: - 552 * Math.cos(theta)},
        {p:   552 * Math.cos(theta), q:   552 * Math.cos(theta)},
      ];

      // 羽の模様線のパラメータ
      const stripes = [94, 130, 194, 230, 294, 330, - 646, - 610, - 546, - 510, - 446];


      // 輪郭＆中心線の描画
      const crossX0 = this.getIntersect(1, sens[0].p + sens[0].q, - 1,   (sens[3].p + sens[3].q)).x;
      const crossX1 = this.getIntersect(1, sens[0].p + sens[0].q, - 1, - (sens[3].p + sens[3].q)).x;
      const sen0Params = [
        {f:    94, t: - crossX0},
        {f: - crossX1, t: - 416 - 516 * Math.cos(theta)},
      ];
      sen0Params.forEach((param) => {
        const line = this.outlineGen(1, 1, - (sens[0].p + sens[0].q), param.f , param.t , divCount, this.guideColor);
        line.rotation.set(0, THREE.MathUtils.degToRad(180 * (i + 1)), THREE.MathUtils.degToRad(90 * i));
        this.outlines.add(line);
      });

      const crossX2 = this.getIntersect(1, sens[1].p + sens[1].q, - 1,   (sens[3].p + sens[3].q)).x;
      const crossX3 = this.getIntersect(1, sens[1].p + sens[1].q, - 1, - (sens[3].p + sens[3].q)).x;
      const sen1Params = [
        {f: this.circle(ens[0].a, ens[0].b, ens[0].r, 45 + THREE.MathUtils.radToDeg(Math.asin(71 / ens[0].r))).x, t: - crossX2},
        {f: - crossX3, t: - 510},
        {f: - 546, t: - 610},
        {f: - 646, t: this.circle(ens[1].a, ens[1].b, ens[1].r, 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[1].r))).x},
        {f: this.circle(ens[4].a, ens[4].b, ens[4].r, 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[4].r))).x, t: this.circle(ens[2].a, ens[2].b, ens[2].r, 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[2].r))).x},
        {f: this.circle(ens[5].a, ens[5].b, ens[5].r, 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[5].r))).x, t: this.circle(ens[3].a, ens[3].b, ens[3].r, 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[3].r))).x},
      ];
      sen1Params.forEach((param) => {
        const line = this.outlineGen(1, 1, - (sens[1].p + sens[1].q), param.f , param.t , divCount, this.guideColor);
        line.rotation.set(0, THREE.MathUtils.degToRad(180 * (i + 1)), THREE.MathUtils.degToRad(90 * i));
        this.outlines.add(line);
      });

      const crossX4 = this.getIntersect(1, sens[2].p + sens[2].q, - 1,   (sens[3].p + sens[3].q)).x;
      const crossX5 = this.getIntersect(1, sens[2].p + sens[2].q, - 1, - (sens[3].p + sens[3].q)).x;
      const sen2Params = [
        {f: this.circle(ens[0].a, ens[0].b, ens[0].r, 45 + THREE.MathUtils.radToDeg(Math.asin(35 / ens[0].r))).x, t: - crossX4},
        {f: - crossX5, t: this.circle(ens[3].a, ens[3].b, ens[3].r, 225 - THREE.MathUtils.radToDeg(Math.asin(35 / ens[3].r))).x},
      ];
      sen2Params.forEach((param) => {
        const line = this.outlineGen(1, 1, - (sens[2].p + sens[2].q), param.f , param.t , divCount, this.guideColor);
        line.rotation.set(0, THREE.MathUtils.degToRad(180 * (i + 1)), THREE.MathUtils.degToRad(90 * i));
        this.outlines.add(line);
      });

      const crossX6 = this.getIntersect(1, sens[1].p + sens[1].q, - 1, (sens[3].p + sens[3].q)).x;
      const crossX7 = this.getIntersect(1, sens[2].p + sens[2].q, - 1, (sens[3].p + sens[3].q)).x;
      const sen3Params = [
        {f: - crossX0, t: 94},
        {f: 130, t: 194},
        {f: 230, t: 294},
        {f: 330, t: - crossX6},
        {f: - crossX7, t: - sens[3].p},
      ];
      sen3Params.forEach((param) => {
        const line = this.outlineGen(- 1, 1, - (sens[3].p + sens[3].q), param.f , param.t , divCount, this.guideColor);
        line.rotation.set(0, THREE.MathUtils.degToRad(180 * (i + 1)), THREE.MathUtils.degToRad(90 * i));
        this.outlines.add(line);
      });

      const sen4Params = [
        {f: - crossX1, t: - 646},
        {f: - 610, t: - 546},
        {f: - 510, t: - 446},
        {f: - 410, t: sens[3].p},
      ];
      sen4Params.forEach((param) => {
        const line = this.outlineGen(- 1, 1, - (sens[4].p + sens[4].q), param.f , param.t , divCount, this.guideColor);
        line.rotation.set(0, THREE.MathUtils.degToRad(180 * (i + 1)), THREE.MathUtils.degToRad(90 * i));
        this.outlines.add(line);
      });

      // 輪郭円の描画
      const en0Params = [
        {f: 45, t: 45 + THREE.MathUtils.radToDeg(Math.asin(35 / ens[0].r))},
        {f: 45 + THREE.MathUtils.radToDeg(Math.asin(71 / ens[0].r)), t: 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - 330) / ens[0].r))},
        {f: 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - 294) / ens[0].r)), t: 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - 230) / ens[0].r))},
        {f: 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - 194) / ens[0].r)), t: 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - 130) / ens[0].r))},
      ];
      en0Params.forEach((param) => {
        const line = this.outlineCircleGen(ens[0].a, ens[0].b, ens[0].r, param.f, param.t, divCount, this.guideColor);
        line.rotation.set(0, THREE.MathUtils.degToRad(180 * (i + 1)), THREE.MathUtils.degToRad(90 * i));
        this.outlines.add(line);
      });

      const en1Params = [
        {f: 135, t: 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[1].r))},
      ];
      en1Params.forEach((param) => {
        const line = this.outlineCircleGen(ens[1].a, ens[1].b, ens[1].r, param.f, param.t, divCount, this.guideColor);
        line.rotation.set(0, THREE.MathUtils.degToRad(180 * (i + 1)), THREE.MathUtils.degToRad(90 * i));
        this.outlines.add(line);
      });

      const en2Params = [
        {f: 150, t: 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[2].r))},
      ];
      en2Params.forEach((param) => {
        const line = this.outlineCircleGen(ens[2].a, ens[2].b, ens[2].r, param.f, param.t, divCount, this.guideColor);
        line.rotation.set(0, THREE.MathUtils.degToRad(180 * (i + 1)), THREE.MathUtils.degToRad(90 * i));
        this.outlines.add(line);
      });

      const en3Params = [
        {f: 225 - THREE.MathUtils.radToDeg(Math.asin(35 / ens[3].r)), t: 225},
        {f: 150, t: 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[3].r))},
      ];
      en3Params.forEach((param) => {
        const line = this.outlineCircleGen(ens[3].a, ens[3].b, ens[3].r, param.f, param.t, divCount, this.guideColor);
        line.rotation.set(0, THREE.MathUtils.degToRad(180 * (i + 1)), THREE.MathUtils.degToRad(90 * i));
        this.outlines.add(line);
      });

      const en4Params = [
        {f: 166, t: 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[4].r))},
      ];
      en4Params.forEach((param) => {
        const line = this.outlineCircleGen(ens[4].a, ens[4].b, ens[4].r, param.f, param.t, divCount, this.guideColor);
        line.rotation.set(0, THREE.MathUtils.degToRad(180 * (i + 1)), THREE.MathUtils.degToRad(90 * i));
        this.outlines.add(line);
      });

      const en5Params = [
        {f: 166, t: 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[5].r))},
      ];
      en5Params.forEach((param) => {
        const line = this.outlineCircleGen(ens[5].a, ens[5].b, ens[5].r, param.f, param.t, divCount, this.guideColor);
        line.rotation.set(0, THREE.MathUtils.degToRad(180 * (i + 1)), THREE.MathUtils.degToRad(90 * i));
        this.outlines.add(line);
      });

      // 羽の模様線の描画
      var index = 0;
      stripes.forEach((sen) => {
        var f;
        if (index <= 5) {
          f = this.straight2(- 1, 1, - (sens[3].p + sens[3].q), sen, undefined).y;
        } else {
          f = this.straight2(1, 1, - (sens[1].p + sens[1].q), sen, undefined).y;
        }
        var t;
        if (index <= 1) {
          t = this.straight2( 1, 1, - (sens[0].p + sens[0].q), sen, undefined).y;
        } else if (index > 1 && index <= 5) {
          t = this.circle(ens[0].a, ens[0].b, ens[0].r, 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - sen) / ens[0].r))).y;
        } else {
          t = this.straight2(- 1, 1,   (sens[3].p + sens[3].q), sen, undefined).y;
        }
        const line = this.outlineGen(1, 0, - sen, f, t, divCount, this.guideColor);
        line.rotation.set(0, THREE.MathUtils.degToRad(180 * (i + 1)), THREE.MathUtils.degToRad(90 * i));
        this.outlines.add(line);
        index ++;
      });
    }

    this.scene.add(this.outlines);
  }

  // 塗りつぶし図形を生成
  generateShapes = () => {

    const divCount = 1000;

    // 外円
    for (var i = 0;i <= 3;i ++) {
      var points = [];
      const circle1 = this.circlePointGen(0, 0, 1300, 90, 180, divCount, this.guideColor);
      const circle2 = this.circlePointGen(0, 0, 1600, 180, 90, divCount, this.guideColor);
      points = circle1.concat(circle2);
      const shape = new THREE.Shape(points);
      const geometry = new THREE.ShapeGeometry(shape);
      const material = new THREE.MeshBasicMaterial({
        color: this.frontColor,
        side: THREE.DoubleSide,
        transparent: true,
      });
      const outer = new THREE.Group();
      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.z = THREE.MathUtils.degToRad(90 * i);
      outer.add(mesh);
      this.shapes.add(outer);
    }

    // 羽
    for (var i = 0;i <= 1;i ++) {

      // 円のパラメータ
      const ens = [
        {a:   516, b:   516, r: 516},
        {a: - 416, b: - 416, r: 516},
        {a: - 466, b: - 466, r: 516},
        {a: - 516, b: - 516, r: 516},
        {a: - 416, b: - 416, r: 550},
        {a: - 466, b: - 466, r: 550},
      ];

      // 輪郭＆中心の線のパラメータ
      const theta = THREE.MathUtils.degToRad(45);
      const sens = [
        {p: - 516 * Math.cos(theta), q: - 516 * Math.cos(theta)},
        {p: -  71 * Math.cos(theta), q: -  71 * Math.cos(theta)},
        {p: -  35 * Math.cos(theta), q: -  35 * Math.cos(theta)},
        {p: - 552 * Math.cos(theta), q: - 552 * Math.cos(theta)},
      ];

      // 羽の模様線のパラメータ
      const stripes = [94, 130, 194, 230, 294, 330, - 646, - 610, - 546, - 510, - 446, - 410];

      // 中心の棒
      const stick = new THREE.Group();
      const arc0 = this.circlePointGen(ens[0].a, ens[0].b, ens[0].r, 45, 45 + THREE.MathUtils.radToDeg(Math.asin(35 / ens[0].r)), divCount, this.frontColor);
      const arc1 = this.circlePointGen(ens[3].a, ens[3].b, ens[3].r, 225 - THREE.MathUtils.radToDeg(Math.asin(35 / ens[3].r)), 225, divCount, this.frontColor);
      const line0 = this.linePointGen(1, 1, - (sens[2].p + sens[2].q), this.circle(ens[0].a, ens[0].b, ens[0].r, 45 + THREE.MathUtils.radToDeg(Math.asin(35 / ens[0].r))).x, this.circle(ens[3].a, ens[3].b, ens[3].r, 225 - THREE.MathUtils.radToDeg(Math.asin(35 / ens[3].r))).x, divCount, this.frontColor);
      const points0 = arc0.concat(line0, arc1);
      stick.add(this.shapeGen(points0));
      this.shapes.add(stick);

      // 羽の部品0
      const feather0 = new THREE.Group();
      const arc2 = this.circlePointGen(ens[0].a, ens[0].b, ens[0].r, 45 + THREE.MathUtils.radToDeg(Math.asin(71 / ens[0].r)), 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - 330) / ens[0].r)), divCount, this.frontColor);
      const line1 = this.linePointGen(1, 0, - stripes[5], this.circle(ens[0].a, ens[0].b, ens[0].r, 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - stripes[5]) / ens[0].r))).y, this.straight2(1, 1, - (sens[1].p + sens[1].q), stripes[5], undefined).y, divCount, this.frontColor);
      const line2 = this.linePointGen(1, 1, - (sens[1].p + sens[1].q), - stripes[5], this.circle(ens[0].a, ens[0].b, ens[0].r, 45 + THREE.MathUtils.radToDeg(Math.asin(71 / ens[0].r))).x, divCount, this.frontColor);
      const points1 = arc2.concat(line1, line2);
      feather0.add(this.shapeGen(points1));
      this.shapes.add(feather0);

      // 羽の部品1
      const feather1 = new THREE.Group();
      const arc3 = this.circlePointGen(ens[0].a, ens[0].b, ens[0].r, 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - stripes[4]) / ens[0].r)), 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - stripes[3]) / ens[0].r)), divCount, this.frontColor);
      const line3 = this.linePointGen(1, 0, - stripes[3], this.circle(ens[0].a, ens[0].b, ens[0].r, 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - stripes[3]) / ens[0].r))).y, this.straight2(1, 1, - (sens[1].p + sens[1].q), stripes[3], undefined).y, divCount, this.frontColor);
      const line4 = this.linePointGen(1, 1, - (sens[1].p + sens[1].q), stripes[3],  stripes[4], divCount, this.frontColor);
      const line5 = this.linePointGen(1, 0, - stripes[4], this.straight2(1, 1, - (sens[1].p + sens[1].q), stripes[3], undefined).y, this.circle(ens[0].a, ens[0].b, ens[0].r, 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - stripes[3]) / ens[0].r))).y, divCount, this.frontColor);
      const points2 = arc3.concat(line3, line4, line5);
      feather1.add(this.shapeGen(points2));
      this.shapes.add(feather1);

      // 羽の部品2
      const feather2 = new THREE.Group();
      const arc4 = this.circlePointGen(ens[0].a, ens[0].b, ens[0].r, 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - stripes[2]) / ens[0].r)), 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - stripes[1]) / ens[0].r)), divCount, this.frontColor);
      const line6 = this.linePointGen(1, 0, - stripes[1], this.circle(ens[0].a, ens[0].b, ens[0].r, 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - stripes[2]) / ens[0].r))).y, this.straight2(1, 1, - (sens[1].p + sens[1].q), stripes[1], undefined).y, divCount, this.frontColor);
      const line7 = this.linePointGen(1, 1, - (sens[1].p + sens[1].q), stripes[1],  stripes[2], divCount, this.frontColor);
      const line8 = this.linePointGen(1, 0, - stripes[2], this.straight2(1, 1, - (sens[1].p + sens[1].q), stripes[1], undefined).y, this.circle(ens[0].a, ens[0].b, ens[0].r, 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - stripes[1]) / ens[0].r))).y, divCount, this.frontColor);
      const points3 = arc4.concat(line6, line7, line8);
      feather2.add(this.shapeGen(points3));
      this.shapes.add(feather2);

      // 羽の部品3
      const feather3 = new THREE.Group();
      const line9  = this.linePointGen(1, 1, - (sens[0].p + sens[0].q), stripes[0], stripes[11], divCount, this.frontColor);
      const line10 = this.linePointGen(1, 0, - stripes[11], this.straight2(1, 1, - (sens[0].p + sens[0].q), stripes[11], undefined).y, this.straight2(1, 1, - (sens[1].p + sens[1].q), stripes[11], undefined).y, divCount, this.frontColor);
      const line11 = this.linePointGen(1, 1, - (sens[1].p + sens[1].q), stripes[11], stripes[0], divCount, this.frontColor);
      const line12 = this.linePointGen(1, 0, - stripes[0], this.straight2(1, 1, - (sens[1].p + sens[1].q), stripes[0], undefined).y, this.straight2(1, 1, - (sens[0].p + sens[0].q), stripes[0], undefined).y, divCount, this.frontColor);
      const points4 = line9.concat(line10, line11, line12);
      feather3.add(this.shapeGen(points4));
      this.shapes.add(feather3);

    }

    this.scene.add(this.shapes);
  }

  // 図形のアニメーション制御
  shapesRotationControl(start, end) {
    // var ratio = THREE.MathUtils.smootherstep(this.progRatio, start, end);
    // if (ratio <= 0.0) return;
    // for (var i = 0;i <= this.shapes.children.length - 1;i ++) {
    //   const shape = this.shapes.children[i];
    //   const j = i - 1;
    //   const num = Math.trunc(j / 2);
    //   if (i > 0) {
    //     const adjust1 = 80;
    //     const adjust2 = 20;
    //     var ratioSx, ratioSy;
    //     if (ratio < 0.1 + num / adjust1) {
    //       ratioSx = THREE.MathUtils.mapLinear(ratio, 0.0, 0.1 + num / adjust1, 1.0, 0.3);
    //       ratioSy = THREE.MathUtils.mapLinear(ratio, 0.0, 0.1 + num / adjust1, 1.0, 0.3);
    //     } else if (ratio < 0.4 + num / adjust2) {
    //       ratioSx = 0.3;
    //       ratioSy = 0.3;
    //     } else {
    //       ratioSx = THREE.MathUtils.mapLinear(ratio, 0.4 + num / adjust2, 1.0, 0.3, 1.0);
    //       ratioSy = THREE.MathUtils.mapLinear(ratio, 0.4 + num / adjust2, 1.0, 0.3, 1.0);
    //     }
    //     shape.scale.set(ratioSx, ratioSy)
    //     this.shapes.rotation.z = - 720 * ratio * (Math.PI / 180);
    //   }
    // }
  }

  render() {

    // ファウンダーの表示アニメーション制御
    this.foundersDisplayControl(0.0, 0.05, 0.0, 0.6);

    // グリッドの表示アニメーション制御
    this.grid.displayControl(this.gridExist, this.progRatio, 0.0, 0.05, 0.35, 0.45);

    // ガイドラインの表示アニメーション制御
    this.guidelinesDisplayControl(0.05, 0.45, 0.5, 0.6, 1000, 0.07, 0.02);

    // アウトラインの表示アニメーション制御
    this.outlinesDisplayControl(0.4, 0.6, 0.65, 0.75, 1000);

    // 図形の表示アニメーション制御
    this.shapesDisplayControl(0.6, 0.7, 1.0, 1.0);

    // 図形を回転
    this.shapesRotationControl(0.7, 1.0);

    // descの表示アニメーションを制御
    this.descDisplayControl(0.8, 0.95, 1.0, 1.0);

    super.render();
  }
}
