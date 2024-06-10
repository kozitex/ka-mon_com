'use strict';

import * as THREE from 'three';
import Kamon from '../kamon.js';

export default class DakiMyouga extends Kamon {

  constructor() {

    super();

    this.rollHeight = 4000;

    this.angleFr = 90;
    this.angleTo = 450;

    this.gridExist = true;

    // ガイドラインの作成
    this.generateGuidelines();

    // アウトラインの作成
    // this.generateOutlines();

    // 塗りつぶし図形の描画
    // this.generateShapes();

    // infoの準備
    this.jpName.innerHTML = '抱き茗荷';
    this.jpDesc.innerHTML = '鷹の羽紋は、鷹の羽根を図案化した家紋です。鷹は獲物を狩る際の勇猛さや高い知性がイメージされることや、鷹の羽根が矢羽根の材料に用いられたことから武士に好まれ、武家の家紋として多く採用されてきました。普及する中で派生した図案も60種類以上と多く、広く使用されている五大紋の一つに数えられています。';
    this.enName.innerHTML = 'Daki-Myouga';
    this.enDesc.innerHTML = 'The hawk feather crest is a family crest that is a stylized version of a hawk&#39;s feathers. Hawks were popular among samurai warriors because they were associated with bravery and high intelligence when hunting prey, and hawk feathers were used to make arrow feathers, and were often used as family emblems of samurai families. Over 60 different designs have been derived from it as it has become popular, and it is counted as one of the five widely used crests.';
  }

  // // テーマカラー変更
  // changeTheme = (theme) => {
  //   super.changeTheme(theme);

  //   this.blackBoard.children.forEach((shape) => {
  //     shape.material.color = new THREE.Color(this.backColor);
  //   })
  // }

  // ガイドラインを作成
  generateGuidelines = () => {

    const divCount = 1000;

    // 外円
    const outCircles = new THREE.Group();
    const rs = [1600];
    rs.forEach((r) => {
      const circle = this.circleGen(0, 0, r, this.angleFr, this.angleTo, divCount, this.guideColor);
      outCircles.add(circle);
    });
    this.guidelines.add(outCircles);

    // 
    for (var i = 0;i <= 1;i ++) {

      // 
      const group1 = new THREE.Group();
      const params1 = [
        {a: -  200, b: - 1410, r:  173, f:   90, t: 450},
        {a:      0, b: -  880, r:  586, f:  240, t: 160},
        {a: - 1415, b: - 1020, r:  837, f: - 20, t: 110},
        {a:     10, b: -   22, r: 1512, f:  187, t: 240},
        {a:    270, b:     90, r: 1750, f:  190, t: 235},
        {a: - 2155, b: - 1477, r: 1377, f:   63, t:  20},
        {a: - 2230, b: - 1620, r: 1500, f:   63, t:  22},
        {a: - 1480, b: - 1045, r:  760, f:   95, t:  10},
        {a: - 1555, b: - 1165, r:  865, f:   90, t:  15},
      ];
      params1.forEach((param) => {
        const line = this.circleGen(param.a, param.b, param.r, param.f, param.t, divCount, this.guideColor);
        line.rotation.y = THREE.MathUtils.degToRad(180 * i);
        group1.add(line);
      });

      const group2 = new THREE.Group();
      const params2 = [
        {a: -  200, b: - 1410, r:  208, f:   90, t: 180},
        {a:      0, b: -  880, r:  551, f:  240, t: 160},
        {a: - 1415, b: - 1020, r:  872, f: - 20, t: 110},
        {a: -  300, b: -  840, r:  750, f:  150, t:  65},
        {a:    670, b: -  820, r: 1000, f:  210, t: 135},
        {a: -  330, b: -  665, r:  510, f:   75, t: 145},
        {a: -  310, b: -  850, r:  650, f:   80, t: 135},
        {a:     33, b: -  828, r:  750, f:  113, t: 162},
        {a: -   15, b: -  790, r:  650, f:  105, t: 167},
        {a:    450, b: -  785, r:  900, f:  135, t: 192},
        {a:    278, b: -  690, r:  750, f:  135, t: 200},
      ];
      params2.forEach((param) => {
        const line = this.circleGen(param.a, param.b, param.r, param.f, param.t, divCount, this.guideColor);
        line.rotation.y = THREE.MathUtils.degToRad(180 * i);
        group2.add(line);
      });

      const group3 = new THREE.Group();
      const params3 = [
        {a: -  300, b: -  840, r:  785, f: 150, t:  75},
        {a: - 1800, b: -  550, r: 1150, f:  15, t:  80},
        {a: -   90, b:     75, r: 1400, f: 163, t: 186},
        {a:    917, b: -  175, r: 2400, f: 164, t: 179},
        {a: - 2565, b: -  505, r: 1500, f:  42, t:  14},
        {a: - 4030, b: - 1450, r: 3200, f:  37, t:  24},
        {a: - 1610, b: -  270, r:  750, f:  80, t:  10},
        {a: - 1725, b: -  415, r:  900, f:  75, t:  20},
      ];
      params3.forEach((param) => {
        const line = this.circleGen(param.a, param.b, param.r, param.f, param.t, divCount, this.guideColor);
        line.rotation.y = THREE.MathUtils.degToRad(180 * i);
        group3.add(line);
      });

      const group4 = new THREE.Group();
      const params4 = [
        {a: - 1800, b: - 550, r: 1185, f:   15, t:   80},
        {a: -   70, b: - 650, r: 1150, f:  140, t:   86},
        {a: - 2470, b:   670, r: 2450, f: - 20, t: -  3},
        {a: -  115, b: - 440, r:  850, f:   90, t:  138},
        {a: -   10, b: - 815, r: 1200, f:   95, t:  128},
        {a:    515, b: - 580, r: 1200, f:  124, t:  152},
        {a:    760, b: - 945, r: 1600, f:  123, t:  145},
        {a: - 1020, b:   480, r:  900, f: -  3, t: - 35},
        {a: - 1355, b:   500, r: 1200, f: -  3, t: - 26},
      ];
      params4.forEach((param) => {
        const line = this.circleGen(param.a, param.b, param.r, param.f, param.t, divCount, this.guideColor);
        line.rotation.y = THREE.MathUtils.degToRad(180 * i);
        group4.add(line);
      });

      const group5 = new THREE.Group();
      const params5 = [
        {a: -   70, b: - 650, r: 1185, f: 140, t:  89},
        {a: - 1700, b:   240, r: 1050, f:   3, t:  65},
        {a: - 1710, b:   235, r:  910, f:  50, t:  13},
        {a: - 1525, b:   400, r:  700, f:  55, t:   3},
        {a: - 1910, b:   570, r:  900, f:  30, t: - 8},
        {a: - 2610, b:   330, r: 1600, f:  25, t:   4},
        {a: -  435, b:   375, r:  900, f: 137, t: 165},
        {a:    115, b: - 120, r: 1600, f: 137, t: 153},
      ];
      params5.forEach((param) => {
        const line = this.circleGen(param.a, param.b, param.r, param.f, param.t, divCount, this.guideColor);
        line.rotation.y = THREE.MathUtils.degToRad(180 * i);
        group5.add(line);
      });

      const group6 = new THREE.Group();
      const params6 = [
        {a: - 1700, b:   240, r: 1085, f:    3, t:   65},
        {a: -   60, b:    55, r: 1000, f:  140, t:   84},
        {a: - 2470, b:  1150, r: 2450, f: - 16, t:    0},
        {a: -   70, b:   115, r:  850, f:   90, t:  135},
        {a:     30, b: - 260, r: 1200, f:   95, t:  126},
        {a:    595, b:    40, r: 1200, f:  128, t:  157},
        {a:    835, b: - 350, r: 1600, f:  123, t:  147},
        {a: -  995, b:  1030, r:  900, f: -  3, t: - 32},
        {a: - 1330, b:  1040, r: 1200, f: -  3, t: - 24},
      ];
      params6.forEach((param) => {
        const line = this.circleGen(param.a, param.b, param.r, param.f, param.t, divCount, this.guideColor);
        line.rotation.y = THREE.MathUtils.degToRad(180 * i);
        group6.add(line);
      });

      const group7 = new THREE.Group();
      const params7 = [
        {a: -   60, b:   55, r: 1035, f:  140, t:   84},
        {a: - 1655, b: 1130, r: 1100, f: - 15, t:   22},
        {a: -  510, b:  885, r:  500, f:  105, t:  152},
        {a: -  395, b:  615, r:  750, f:  110, t:  139},
        {a: -   75, b:  880, r:  750, f:  138, t:  175},
        {a:    335, b:  625, r: 1200, f:  143, t:  165},
        {a: - 1215, b: 1165, r:  600, f:   21, t: - 20},
        {a: - 1845, b: 1055, r: 1200, f:   15, t: -  5},

      ];
      params7.forEach((param) => {
        const line = this.circleGen(param.a, param.b, param.r, param.f, param.t, divCount, this.guideColor);
        line.rotation.y = THREE.MathUtils.degToRad(180 * i);
        group7.add(line);
      });

      const group8 = new THREE.Group();
      const params8 = [
        {a: - 1655, b:  1130, r: 1135, f: - 12, t:   22},
        {a: -  490, b:  1020, r:   80, f: -  5, t:  125},
        {a: -  490, b:  1020, r:  115, f: -  1, t:  115},
        {a: -  510, b:  1458, r:   55, f:  240, t: - 20},
        {a: -   85, b:  1146, r:   55, f:  220, t:  480},
        {a: -  390, b:  1484, r:   65, f:  220, t: - 70},
        {a: -   80, b:  1255, r:   55, f:  240, t:  530},
        {a: -  215, b:  1360, r:  150, f:  130, t:  210},
        {a: -  250, b:  1370, r:  150, f:  345, t:  260},
        {a: -  330, b:  1340, r:   33, f:  150, t:  380},
        {a: -  225, b:  1255, r:   33, f:  320, t:   80},
        {a: -  595, b:  1455, r:  320, f:  320, t:  380},
        {a: -   40, b:  1034, r:  320, f:  150, t:   90},
        {a: -  205, b:  1508, r:   75, f:  220, t:   30},
        {a: -  100, b:  1425, r:   75, f:  250, t:  440},
        {a: -   90, b:  1532, r:   65, f:  180, t: - 90},

        {a: - 1350, b:  1350, r:  900, f: - 15, t:    4},
        {a: - 1325, b:  1330, r:  900, f: - 14, t:    6},
        {a: -  441, b:  1410, r:   12, f:  220, t: - 40},

        {a: -   42, b:   603, r:  600, f: 127, t:    98},
        {a:    105, b:   310, r:  900, f: 124, t:   104},
        {a: -  132, b:  1186, r:    9, f: 130, t: - 130},

        {a:   1597, b: - 177, r: 2400, f: 148, t:   135},
        {a:   1658, b: - 128, r: 2400, f: 150, t:   137},
        {a: -  105, b:  1510, r:    5, f: 175, t: -  85},
      ];
      params8.forEach((param) => {
        const line = this.circleGen(param.a, param.b, param.r, param.f, param.t, divCount, this.guideColor);
        line.rotation.y = THREE.MathUtils.degToRad(180 * i);
        group8.add(line);
      });

      this.guidelines.add(group1);
      this.guidelines.add(group2);
      this.guidelines.add(group3);
      this.guidelines.add(group4);
      this.guidelines.add(group5);
      this.guidelines.add(group6);
      this.guidelines.add(group7);
      this.guidelines.add(group8);
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
      const circle1 = this.circlePointGen(0, 0, 1300, 90, 180, divCount);
      const circle2 = this.circlePointGen(0, 0, 1600, 180, 90, divCount);
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
      {p: - 516 * Math.cos(theta), q: - 516 * Math.sin(theta)},
      {p: -  71 * Math.cos(theta), q: -  71 * Math.sin(theta)},
      {p: -  35 * Math.cos(theta), q: -  35 * Math.sin(theta)},
      {p: - 552 * Math.cos(theta), q: - 552 * Math.sin(theta)},
    ];

    // 羽の模様線のパラメータ
    const stripes = [94, 130, 194, 230, 294, 330, - 646, - 610, - 546, - 510, - 446, - 410];

    // 黒い板
    this.blackBoard = new THREE.Group();
    const line26 = this.linePointGen(  1, 1, - (sens[3].p + sens[3].q),   500, - 1300, divCount);
    const line28 = this.linePointGen(  1, 1,   (sens[3].p + sens[3].q), - 500,   1300, divCount);
    const points10 = line26.concat(line28);
    this.blackBoard.add(this.shapeGen(points10, this.backColor));
    this.blackBoard.position.z = - 1;
    this.scene.add(this.blackBoard);

    // 羽
    for (var i = 0;i <= 3;i ++) {

      // 中心の棒
      const stick = new THREE.Group();
      const arc0 = this.circlePointGen(ens[0].a, ens[0].b, ens[0].r, 45, 45 + THREE.MathUtils.radToDeg(Math.asin(35 / ens[0].r)), divCount);
      const arc1 = this.circlePointGen(ens[3].a, ens[3].b, ens[3].r, 225 - THREE.MathUtils.radToDeg(Math.asin(35 / ens[3].r)), 225, divCount);
      const line0 = this.linePointGen(1, 1, - (sens[2].p + sens[2].q), this.circle(ens[0].a, ens[0].b, ens[0].r, 45 + THREE.MathUtils.radToDeg(Math.asin(35 / ens[0].r))).x, this.circle(ens[3].a, ens[3].b, ens[3].r, 225 - THREE.MathUtils.radToDeg(Math.asin(35 / ens[3].r))).x, divCount);
      const points0 = arc0.concat(line0, arc1);
      stick.add(this.shapeGen(points0, this.frontColor));
      stick.rotation.set(0, THREE.MathUtils.degToRad(180 * Math.ceil(i / 2)), THREE.MathUtils.degToRad(90 * Math.trunc(i % 2)));
      stick.position.z = i <= 1 ? 0 : - 2;
      this.shapes.add(stick);

      // 羽の部品0
      const feather0 = new THREE.Group();
      const arc2 = this.circlePointGen(ens[0].a, ens[0].b, ens[0].r, 45 + THREE.MathUtils.radToDeg(Math.asin(71 / ens[0].r)), 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - 330) / ens[0].r)), divCount);
      const line1 = this.linePointGen(1, 0, - stripes[5], this.circle(ens[0].a, ens[0].b, ens[0].r, 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - stripes[5]) / ens[0].r))).y, this.straight2(1, 1, - (sens[1].p + sens[1].q), stripes[5], undefined).y, divCount);
      const line2 = this.linePointGen(1, 1, - (sens[1].p + sens[1].q), - stripes[5], this.circle(ens[0].a, ens[0].b, ens[0].r, 45 + THREE.MathUtils.radToDeg(Math.asin(71 / ens[0].r))).x, divCount);
      const points1 = arc2.concat(line1, line2);
      feather0.add(this.shapeGen(points1, this.frontColor));
      feather0.rotation.set(0, THREE.MathUtils.degToRad(180 * Math.ceil(i / 2)), THREE.MathUtils.degToRad(90 * Math.trunc(i % 2)));
      feather0.position.z = i <= 1 ? 0 : - 2;
      this.shapes.add(feather0);

      // 羽の部品1
      const feather1 = new THREE.Group();
      const arc3 = this.circlePointGen(ens[0].a, ens[0].b, ens[0].r, 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - stripes[4]) / ens[0].r)), 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - stripes[3]) / ens[0].r)), divCount);
      const line3 = this.linePointGen(1, 0, - stripes[3], this.circle(ens[0].a, ens[0].b, ens[0].r, 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - stripes[3]) / ens[0].r))).y, this.straight2(1, 1, - (sens[1].p + sens[1].q), stripes[3], undefined).y, divCount);
      const line4 = this.linePointGen(1, 1, - (sens[1].p + sens[1].q), stripes[3],  stripes[4], divCount);
      const line5 = this.linePointGen(1, 0, - stripes[4], this.straight2(1, 1, - (sens[1].p + sens[1].q), stripes[3], undefined).y, this.circle(ens[0].a, ens[0].b, ens[0].r, 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - stripes[3]) / ens[0].r))).y, divCount);
      const points2 = arc3.concat(line3, line4, line5);
      feather1.add(this.shapeGen(points2, this.frontColor));
      feather1.rotation.set(0, THREE.MathUtils.degToRad(180 * Math.ceil(i / 2)), THREE.MathUtils.degToRad(90 * Math.trunc(i % 2)));
      feather1.position.z = i <= 1 ? 0 : - 2;
      this.shapes.add(feather1);

      // 羽の部品2
      const feather2 = new THREE.Group();
      const arc4 = this.circlePointGen(ens[0].a, ens[0].b, ens[0].r, 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - stripes[2]) / ens[0].r)), 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - stripes[1]) / ens[0].r)), divCount);
      const line6 = this.linePointGen(1, 0, - stripes[1], this.circle(ens[0].a, ens[0].b, ens[0].r, 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - stripes[2]) / ens[0].r))).y, this.straight2(1, 1, - (sens[1].p + sens[1].q), stripes[1], undefined).y, divCount);
      const line7 = this.linePointGen(1, 1, - (sens[1].p + sens[1].q), stripes[1],  stripes[2], divCount);
      const line8 = this.linePointGen(1, 0, - stripes[2], this.straight2(1, 1, - (sens[1].p + sens[1].q), stripes[1], undefined).y, this.circle(ens[0].a, ens[0].b, ens[0].r, 90 + THREE.MathUtils.radToDeg(Math.asin((ens[0].a - stripes[1]) / ens[0].r))).y, divCount);
      const points3 = arc4.concat(line6, line7, line8);
      feather2.add(this.shapeGen(points3, this.frontColor));
      feather2.rotation.set(0, THREE.MathUtils.degToRad(180 * Math.ceil(i / 2)), THREE.MathUtils.degToRad(90 * Math.trunc(i % 2)));
      feather2.position.z = i <= 1 ? 0 : - 2;
      this.shapes.add(feather2);

      // 羽の部品3
      const feather3 = new THREE.Group();
      const line9  = this.linePointGen(1, 1, - (sens[0].p + sens[0].q), stripes[0], stripes[11], divCount);
      const line10 = this.linePointGen(1, 0, - stripes[11], this.straight2(1, 1, - (sens[0].p + sens[0].q), stripes[11], undefined).y, this.straight2(1, 1, - (sens[1].p + sens[1].q), stripes[11], undefined).y, divCount);
      const line11 = this.linePointGen(1, 1, - (sens[1].p + sens[1].q), stripes[11], stripes[0], divCount);
      const line12 = this.linePointGen(1, 0, - stripes[0], this.straight2(1, 1, - (sens[1].p + sens[1].q), stripes[0], undefined).y, this.straight2(1, 1, - (sens[0].p + sens[0].q), stripes[0], undefined).y, divCount);
      const points4 = line9.concat(line10, line11, line12);
      feather3.add(this.shapeGen(points4, this.frontColor));
      feather3.rotation.set(0, THREE.MathUtils.degToRad(180 * Math.ceil(i / 2)), THREE.MathUtils.degToRad(90 * Math.trunc(i % 2)));
      feather3.position.z = i <= 1 ? 0 : - 2;
      this.shapes.add(feather3);

      // 羽の部品4
      const feather4 = new THREE.Group();
      const line13 = this.linePointGen(1, 1, - (sens[0].p + sens[0].q), stripes[10],  stripes[9], divCount);
      const line14 = this.linePointGen(1, 0, - stripes[10], this.straight2(1, 1, - (sens[0].p + sens[0].q), stripes[10], undefined).y, this.straight2(1, 1, - (sens[1].p + sens[1].q), stripes[10], undefined).y, divCount);
      const line15 = this.linePointGen(1, 1, - (sens[1].p + sens[1].q), stripes[9],  stripes[10], divCount);
      const line16 = this.linePointGen(1, 0, - stripes[9], this.straight2(1, 1, - (sens[1].p + sens[1].q), stripes[9], undefined).y, this.straight2(1, 1, - (sens[0].p + sens[0].q), stripes[9], undefined).y, divCount);
      const points5 = line13.concat(line14, line15, line16);
      feather4.add(this.shapeGen(points5, this.frontColor));
      feather4.rotation.set(0, THREE.MathUtils.degToRad(180 * Math.ceil(i / 2)), THREE.MathUtils.degToRad(90 * Math.trunc(i % 2)));
      feather4.position.z = i <= 1 ? 0 : - 2;
      this.shapes.add(feather4);

      // 羽の部品5
      const feather5 = new THREE.Group();
      const line17 = this.linePointGen(1, 1, - (sens[0].p + sens[0].q), stripes[8], stripes[7], divCount);
      const line18 = this.linePointGen(1, 0, - stripes[8], this.straight2(1, 1, - (sens[0].p + sens[0].q), stripes[8], undefined).y, this.straight2(1, 1, - (sens[1].p + sens[1].q), stripes[8], undefined).y, divCount);
      const line19 = this.linePointGen(1, 1, - (sens[1].p + sens[1].q), stripes[7], stripes[8], divCount);
      const line20 = this.linePointGen(1, 0, - stripes[7], this.straight2(1, 1, - (sens[1].p + sens[1].q), stripes[7], undefined).y, this.straight2(1, 1, - (sens[0].p + sens[0].q), stripes[7], undefined).y, divCount);
      const points6 = line17.concat(line18, line19, line20);
      feather5.add(this.shapeGen(points6, this.frontColor));
      feather5.rotation.set(0, THREE.MathUtils.degToRad(180 * Math.ceil(i / 2)), THREE.MathUtils.degToRad(90 * Math.trunc(i % 2)));
      feather5.position.z = i <= 1 ? 0 : - 2;
      this.shapes.add(feather5);

      // 羽の部品6
      const feather6 = new THREE.Group();
      const line21 = this.linePointGen(1, 1, - (sens[0].p + sens[0].q), stripes[6], this.circle(ens[1].a, ens[1].b, ens[1].r, 135).x, divCount);
      const arc5 = this.circlePointGen(ens[1].a, ens[1].b, ens[1].r, 135, 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[1].r)), divCount);
      const line22 = this.linePointGen(1, 1, - (sens[1].p + sens[1].q), this.circle(ens[1].a, ens[1].b, ens[1].r, 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[1].r))).x, stripes[6], divCount);
      const line23 = this.linePointGen(1, 0, - stripes[6], this.straight2(1, 1, - (sens[1].p + sens[1].q), stripes[6], undefined).y, this.straight2(1, 1, - (sens[0].p + sens[0].q), stripes[6], undefined).y, divCount);
      const points7 = line21.concat(arc5, line22, line23);
      feather6.add(this.shapeGen(points7, this.frontColor));
      feather6.rotation.set(0, THREE.MathUtils.degToRad(180 * Math.ceil(i / 2)), THREE.MathUtils.degToRad(90 * Math.trunc(i % 2)));
      feather6.position.z = i <= 1 ? 0 : - 2;
      this.shapes.add(feather6);

      // 羽の部品7
      const feather7 = new THREE.Group();
      const arc6 = this.circlePointGen(ens[2].a, ens[2].b, ens[2].r, 155, 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[2].r)), divCount);
      const line24 = this.linePointGen(1, 1, - (sens[1].p + sens[1].q), this.circle(ens[2].a, ens[2].b, ens[2].r, 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[2].r))).x, this.circle(ens[4].a, ens[4].b, ens[4].r, 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[4].r))).x, divCount);
      const arc7 = this.circlePointGen(ens[4].a, ens[4].b, ens[4].r, 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[4].r)), 166, divCount);
      const points8 = arc6.concat(line24, arc7);
      feather7.add(this.shapeGen(points8, this.frontColor));
      feather7.rotation.set(0, THREE.MathUtils.degToRad(180 * Math.ceil(i / 2)), THREE.MathUtils.degToRad(90 * Math.trunc(i % 2)));
      feather7.position.z = i <= 1 ? 0 : - 2;
      this.shapes.add(feather7);

      // 羽の部品8
      const feather8 = new THREE.Group();
      const arc8 = this.circlePointGen(ens[3].a, ens[3].b, ens[3].r, 155, 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[3].r)), divCount);
      const line25 = this.linePointGen(1, 1, - (sens[1].p + sens[1].q), this.circle(ens[3].a, ens[3].b, ens[3].r, 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[3].r))).x, this.circle(ens[5].a, ens[5].b, ens[5].r, 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[5].r))).x, divCount);
      const arc9 = this.circlePointGen(ens[5].a, ens[5].b, ens[5].r, 225 - THREE.MathUtils.radToDeg(Math.asin(71 / ens[5].r)), 166, divCount);
      const points9 = arc8.concat(line25, arc9);
      feather8.add(this.shapeGen(points9, this.frontColor));
      feather8.rotation.set(0, THREE.MathUtils.degToRad(180 * Math.ceil(i / 2)), THREE.MathUtils.degToRad(90 * Math.trunc(i % 2)));
      feather8.position.z = i <= 1 ? 0 : - 2;
      this.shapes.add(feather8);
    }

    this.scene.add(this.shapes);
  }

  // 図形のアニメーション制御
  shapesRotationControl(start, end) {
    var ratio = THREE.MathUtils.smootherstep(this.progRatio, start, end);
    for (var i = 0;i <= this.shapes.children.length - 1;i ++) {
      const shape = this.shapes.children[i];
      const j = i - 1;
      const num = Math.trunc(j / 4);
      const adjust1 = 80;
      const adjust2 = 20;
      var ratioSx, ratioSy;
      if (ratio < 0.1 + num / adjust1) {
        ratioSx = THREE.MathUtils.mapLinear(ratio, 0.0, 0.1 + num / adjust1, 1.0, 0.3);
        ratioSy = THREE.MathUtils.mapLinear(ratio, 0.0, 0.1 + num / adjust1, 1.0, 0.3);
      } else if (ratio < 0.4 + num / adjust2) {
        ratioSx = 0.3;
        ratioSy = 0.3;
      } else {
        ratioSx = THREE.MathUtils.mapLinear(ratio, 0.4 + num / adjust2, 1.0, 0.3, 1.0);
        ratioSy = THREE.MathUtils.mapLinear(ratio, 0.4 + num / adjust2, 1.0, 0.3, 1.0);
      }
      this.blackBoard.scale.set(ratioSx, ratioSy)
      shape.scale.set(ratioSx, ratioSy)
    }
    if (this.blackBoard) this.blackBoard.rotation.z = - 1440 * ratio * (Math.PI / 180);
    this.shapes.rotation.z = - 1440 * ratio * (Math.PI / 180);
  }

  render() {

    // ファウンダーの表示アニメーション制御
    this.foundersDisplayControl(0.0, 0.05, 0.0, 0.6);

    // グリッドの表示アニメーション制御
    this.grid.displayControl(this.gridExist, this.progRatio, 0.0, 0.05, 0.35, 0.45);

    // ガイドラインの表示アニメーション制御
    this.guidelinesDisplayControl(0.05, 0.45, 0.5, 0.6, 1000, 0.02, 0.02);

    // アウトラインの表示アニメーション制御
    this.outlinesDisplayControl(0.4, 0.6, 0.65, 0.75, 1000);

    // 図形の表示アニメーション制御
    this.shapesDisplayControl(0.65, 0.75, 1.0, 1.0);

    // 図形を回転
    this.shapesRotationControl(0.75, 1.0);

    // descの表示アニメーションを制御
    this.descDisplayControl(0.8, 0.95, 1.0, 1.0);

    super.render();
  }
}
