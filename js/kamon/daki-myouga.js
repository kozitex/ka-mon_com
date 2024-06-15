'use strict';

import * as THREE from 'three';
import Kamon from '../kamon.js';

export default class DakiMyouga extends Kamon {

  constructor() {

    super();

    // this.rollHeight = 4000;

    this.angleFr = 90;
    this.angleTo = 450;

    this.gridExist = true;


    // // infoの準備
    // this.jpName.innerHTML = '抱き茗荷';
    // this.jpDesc.innerHTML = '鷹の羽紋は、鷹の羽根を図案化した家紋です。鷹は獲物を狩る際の勇猛さや高い知性がイメージされることや、鷹の羽根が矢羽根の材料に用いられたことから武士に好まれ、武家の家紋として多く採用されてきました。普及する中で派生した図案も60種類以上と多く、広く使用されている五大紋の一つに数えられています。';
    // this.enName.innerHTML = 'Daki-Myouga';
    // this.enDesc.innerHTML = 'The hawk feather crest is a family crest that is a stylized version of a hawk&#39;s feathers. Hawks were popular among samurai warriors because they were associated with bravery and high intelligence when hunting prey, and hawk feathers were used to make arrow feathers, and were often used as family emblems of samurai families. Over 60 different designs have been derived from it as it has become popular, and it is counted as one of the five widely used crests.';
  }

  init = () => {

    super.init()

    // ガイドラインの作成
    this.generateGuidelines();

    // アウトラインの作成
    this.generateOutlines();

    // 塗りつぶし図形の描画
    this.generateShapes();

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

    for (var i = 0;i <= 1;i ++) {

      const params1 = [
        {a:      0  , b:      0, r: 1600, f: 262   , t:  187  },
        {a: -  200  , b: - 1412, r:  173, f:  158  , t: - 98  },
        {a:      0.5, b: -  880, r:  586, f:  232  , t:  186.5},
        {a: - 1415  , b: - 1020, r:  837, f:    5  , t:  102  },
        {a:     10  , b: -   22, r: 1512, f:  189.8, t:  240  },
        {a:    270  , b:     90, r: 1750, f:  194.7, t:  234  },
        {a: - 2155  , b: - 1477, r: 1377, f:   57.5, t:   20  },
        {a: - 2230  , b: - 1620, r: 1500, f:   57.5, t:   24  },
        {a: - 1480  , b: - 1045, r:  760, f:   90  , t:   10  },
        {a: - 1555  , b: - 1165, r:  865, f:   80.5, t:   17  },
      ];
      params1.forEach((param) => {
        const line = this.outlineCircleGen(param.a, param.b, param.r, param.f, param.t, divCount, this.frontColor);
        line.rotation.y = THREE.MathUtils.degToRad(180 * i);
        this.outlines.add(line);
      });

      const params2 = [
        {a: -  200, b: - 1410, r:  208, f:  102.6, t: 145.8},
        {a:      0, b: -  880, r:  550, f:  228  , t: 185  },
        {a: - 1415, b: - 1020, r:  872, f:    6  , t:  27.5},
        {a: - 1415, b: - 1020, r:  872, f:   31  , t:  51  },
        {a: -  300, b: -  840, r:  750, f:  139  , t:  70.5},
        {a:    670, b: -  820, r: 1000, f:  203  , t: 136.5},

        {a: -  330, b: -  665, r:  510, f:   75.5, t: 145  },
        {a: -  310, b: -  850, r:  650, f:   97  , t: 135  },
        {a:     33, b: -  828, r:  750, f:  124  , t: 160  },
        {a: -   15, b: -  790, r:  650, f:  116  , t: 165  },
        {a:    450, b: -  785, r:  900, f:  137  , t: 188  },
        {a:    278, b: -  690, r:  750, f:  140  , t: 197  },
      ];
      params2.forEach((param) => {
        const line = this.outlineCircleGen(param.a, param.b, param.r, param.f, param.t, divCount, this.frontColor);
        line.rotation.y = THREE.MathUtils.degToRad(180 * i);
        this.outlines.add(line);
      });

      const params3 = [
        {a:      0, b:      0, r: 1600, f: 186,   t: 159.4},
        {a: -  300, b: -  840, r:  785, f: 139.3, t: 121.5},
        {a: - 1415, b: - 1020, r:  872, f:   53 , t: 102  },
        {a: - 1800, b: -  550, r: 1150, f:  18.9, t:  75  },

        {a: -   90, b:     75, r: 1400, f: 163.8, t: 186  },
        {a:    917, b: -  175, r: 2400, f: 166.2, t: 177.5},
        {a: - 2565, b: -  505, r: 1500, f:  38  , t:  14  },
        {a: - 4030, b: - 1450, r: 3200, f:  35.2, t:  24  },
        {a: - 1610, b: -  270, r:  750, f:  77  , t:  11  },
        {a: - 1725, b: -  415, r:  900, f:  67.2, t:  20  },
      ];
      params3.forEach((param) => {
        const line = this.outlineCircleGen(param.a, param.b, param.r, param.f, param.t, divCount, this.guideColor);
        line.rotation.y = THREE.MathUtils.degToRad(180 * i);
        this.outlines.add(line);
      });

      const params4 = [
        {a: - 1800, b: - 550, r: 1185, f:   19.4, t:   38.3},
        {a: -  300, b: - 840, r:  785, f:  119.5, t:   77.5},
        {a: -   70, b: - 650, r: 1150, f:  133.8, t:   87.4},
        {a: - 2470, b:   670, r: 2450, f: - 17.7, t: -  4  },

        {a: -  115, b: - 440, r:  850, f:   90  , t:  138  },
        {a: -   10, b: - 815, r: 1200, f:  100.4, t:  128  },
        {a:    515, b: - 580, r: 1200, f:  128  , t:  152  },
        {a:    760, b: - 945, r: 1600, f:  125.2, t:  145  },
        {a: - 1020, b:   480, r:  900, f: -  4.0, t: - 34.5},
        {a: - 1355, b:   500, r: 1200, f: -  6.5, t: - 26  },
      ];
      params4.forEach((param) => {
        const line = this.outlineCircleGen(param.a, param.b, param.r, param.f, param.t, divCount, this.guideColor);
        line.rotation.y = THREE.MathUtils.degToRad(180 * i);
        this.outlines.add(line);
      });

      const params5 = [
        {a:      0, b:     0, r: 1600, f: 158.4, t: 135.2},
        {a: - 1800, b: - 550, r: 1185, f:  39.6, t:  75  },
        {a: -   70, b: - 650, r: 1185, f: 134  , t: 119.6},
        {a: - 1700, b:   240, r: 1050, f:   7.4, t:  57.8},

        {a: - 1710, b:   235, r:  910, f:  45  , t:  13  },
        {a: - 1525, b:   400, r:  700, f:  54.4, t:   3.8},
        {a: - 1910, b:   570, r:  900, f:  20  , t: - 7.8},
        {a: - 2610, b:   330, r: 1600, f:  21  , t:   4.6},
        {a: -  435, b:   375, r:  900, f: 138.6, t: 164  },
        {a:    115, b: - 120, r: 1600, f: 140.1, t: 152  },
      ];
      params5.forEach((param) => {
        const line = this.outlineCircleGen(param.a, param.b, param.r, param.f, param.t, divCount, this.guideColor);
        line.rotation.y = THREE.MathUtils.degToRad(180 * i);
        this.outlines.add(line);
      });

      const params6 = [
        {a: -   70, b: - 650, r: 1185, f: 118.2 , t:   91.1},
        {a: - 1700, b:   240, r: 1085, f:    8.0, t:   29.7},
        {a: -   60, b:    55, r: 1000, f:  134.2, t:   87.4},
        {a: - 2470, b:  1150, r: 2450, f: - 14.7, t: -  2.1},

        {a: -   70, b:   115, r:  850, f:   91.4, t:  135  },
        {a:     30, b: - 260, r: 1200, f:  102.4, t:  126  },
        {a:    595, b:    40, r: 1200, f:  133.2, t:  156.5},
        {a:    835, b: - 350, r: 1600, f:  127.2, t:  146.8},
        {a: -  995, b:  1030, r:  900, f: -  4  , t: - 32  },
        {a: - 1330, b:  1040, r: 1200, f: -  5.4, t: - 24  },
      ];
      params6.forEach((param) => {
        const line = this.outlineCircleGen(param.a, param.b, param.r, param.f, param.t, divCount, this.guideColor);
        line.rotation.y = THREE.MathUtils.degToRad(180 * i);
        this.outlines.add(line);
      });

      const params7 = [
        {a:      0, b:    0, r: 1600, f:  134  , t:  112.4},
        {a: - 1700, b:  240, r: 1085, f:   31.1, t:   57.4},
        {a: -   60, b:   55, r: 1035, f:  133.8, t:  119.2},
        {a: - 1655, b: 1130, r: 1100, f: -  9.3, t:   18.7},

        {a: -  510, b:  885, r:  500, f:  105.5, t:  152  },
        {a: -  395, b:  615, r:  750, f:  114  , t:  138.2},
        {a: -   75, b:  880, r:  750, f:  145.8, t:  175  },
        {a:    335, b:  625, r: 1200, f:  146.6, t:  164.8},
        {a: - 1215, b: 1165, r:  600, f:   20  , t: - 19.8},
        {a: - 1845, b: 1055, r: 1200, f:   11.2, t: -  4.6},
      ];
      params7.forEach((param) => {
        const line = this.outlineCircleGen(param.a, param.b, param.r, param.f, param.t, divCount, this.guideColor);
        line.rotation.y = THREE.MathUtils.degToRad(180 * i);
        this.outlines.add(line);
      });

      const params8 = [
        {a: -   60, b:    55, r: 1035, f:  117.2, t:  109.5},
        {a: -   60, b:    55, r: 1035, f:  108.2, t:   91.2},

        {a: - 1655, b:  1130, r: 1135, f: -  8.0, t: -  1.6},
        {a: - 1655, b:  1130, r: 1135, f: -  0.3, t:   16  },

        {a: -  490, b:  1020, r:   80, f:     3  , t: 112  },
        {a: -  490, b:  1020, r:  115, f:     8  , t:  25  },
        {a: -  490, b:  1020, r:  115, f:    33  , t:  44  },
        {a: -  490, b:  1020, r:  115, f:    53  , t:  72  },
        {a: -  490, b:  1020, r:  115, f:    80  , t: 108  },

        {a: -  509, b:  1458, r:   56, f:  200  , t:   18  },
        {a: -   85, b:  1146, r:   55, f:  270  , t:  440  },

        {a: -  390, b:  1484, r:   65, f:  185  , t: - 45  },
        {a: -   80, b:  1255, r:   55, f:  275  , t:  510  },

        {a: -  215, b:  1360, r:  150, f:  148.5, t:  190  },
        {a: -  250, b:  1370, r:  150, f:  324.2, t:  286  },

        {a: -  330, b:  1340, r:   33, f:  190  , t:  360  },
        {a: -  225, b:  1255, r:   33, f:  300  , t:  118  },

        {a: -  595, b:  1455, r:  320, f:  338.8, t:  370  },
        {a: -   40, b:  1035, r:  320, f:  128.8, t:   98  },

        {a: -  205, b:  1508, r:   75, f:  179  , t:   38  },
        {a: -  100, b:  1425, r:   75, f:  282  , t:  412  },
        {a: -   90, b:  1532, r:   65, f:  160  , t: - 58  },

        {a: - 1350, b:  1350, r:  900, f: - 14.3, t:    3.9},
        {a: - 1325, b:  1330, r:  900, f: - 13.4, t:    5.1},
        {a: -  441, b:  1410, r:   12, f:  180  , t: -  0  },

        {a: -   42, b:   603, r:  600, f: 126.6, t:    98.8},
        {a:    105, b:   310, r:  900, f: 123.2, t:   105.2},
        {a: -  132, b:  1186, r:    9, f: 100  , t: -  80  },

        {a:   1597, b: - 177, r: 2400, f: 147.6, t:   135.2},
        {a:   1658, b: - 128, r: 2400, f: 149.4, t:   137.1},
        {a: -  105, b:  1509, r:    5, f: 135  , t: -  45  },
      ];
      params8.forEach((param) => {
        const line = this.outlineCircleGen(param.a, param.b, param.r, param.f, param.t, divCount, this.guideColor);
        line.rotation.y = THREE.MathUtils.degToRad(180 * i);
        this.outlines.add(line);
      });
    }

    this.scene.add(this.outlines);
  }

  // 塗りつぶし図形を生成
  generateShapes = () => {

    const divCount = 1000;

    for (var i = 0;i <= 1;i ++) {

      const group1 = new THREE.Group();
      const shapeParams1 = [
        {a: -  200  , b: - 1412, r:  173, f:  158  , t: - 98  },
        {a:      0  , b:      0, r: 1600, f:  262  , t:  188  },
        {a: - 1415  , b: - 1020, r:  837, f:  101.8  , t:    5  },
        {a:      0.5, b: -  880, r:  586, f:  186.5, t:  232  },
      ];
      const pathParams1 = [
        {a:     10  , b: -   22, r: 1512, f:  189.8, t:  240  },
        {a:    270  , b:     90, r: 1750, f:  234  , t:  194.8},

        {a: - 2230  , b: - 1620, r: 1500, f:   57.4, t:   24  },
        {a: - 2155  , b: - 1477, r: 1377, f:   20  , t:   51.6},

        {a: - 1555  , b: - 1165, r:  865, f:   80.6, t:   17  },
        {a: - 1480  , b: - 1045, r:  760, f:   10  , t:   90  },
      ];
      var shapePoints1 = [];
      shapeParams1.forEach((param) => {
        const arc = this.circlePointGen(param.a, param.b, param.r, param.f, param.t, divCount);
        shapePoints1 = shapePoints1.concat(arc);
      });
      var pathPoints1 = [];
      pathParams1.forEach((param) => {
        const arc = this.circlePointGen(param.a, param.b, param.r, param.f, param.t, divCount);
        pathPoints1 = pathPoints1.concat(arc);
      });
      const shape1 = this.clipShapeGen(shapePoints1, pathPoints1, this.frontColor);
      group1.add(shape1);
      group1.rotation.y = THREE.MathUtils.degToRad(180 * i);
      this.shapes.add(group1);

      const group2 = new THREE.Group();
      const shapeParams2 = [
        {a: -  200, b: - 1410, r:  208, f:  104.6, t: 144  },
        {a:      0, b: -  880, r:  550, f:  228  , t: 185  },
        {a: - 1415, b: - 1020, r:  872, f:    6  , t:  27.5},

        {a: -   15, b: -  790, r:  650, f:  165  , t: 116  },
        {a:    278, b: -  690, r:  750, f:  140  , t: 197  },
        {a:    450, b: -  785, r:  900, f:  188  , t: 137  },
        {a: -  330, b: -  665, r:  510, f:   75.5, t: 145  },
        {a: -  310, b: -  850, r:  650, f:  130  , t:  97  },
        {a:     33, b: -  828, r:  750, f:  124  , t: 159  },

        {a: - 1415, b: - 1020, r:  872, f:   31  , t:  50.7},
        {a: -  300, b: -  840, r:  750, f:  138  , t:  70.5},
        {a:    670, b: -  820, r: 1000, f:  136.5, t: 202  },
      ];
      var shapePoints2 = [];
      shapeParams2.forEach((param) => {
        const arc = this.circlePointGen(param.a, param.b, param.r, param.f, param.t, divCount);
        shapePoints2 = shapePoints2.concat(arc);
      });
      const shape2 = this.shapeGen(shapePoints2, this.frontColor);
      group2.add(shape2);
      group2.rotation.y = THREE.MathUtils.degToRad(180 * i);
      this.shapes.add(group2);

      const group3 = new THREE.Group();
      const shapeParams3 = [
        {a: -  300, b: -  840, r:  785, f: 121.5, t: 138.9},
        {a: - 1415, b: - 1020, r:  872, f:  53  , t: 101.6  },
        {a:      0, b:      0, r: 1600, f: 186  , t: 159.6},
        {a: - 1800, b: -  550, r: 1150, f:  74.8  , t:  18.9},
      ];
      const pathParams3 = [
        {a: -   90, b:     75, r: 1400, f: 163.8, t: 186  },
        {a:    917, b: -  175, r: 2400, f: 177.5, t: 167.0},

        {a: - 4030, b: - 1450, r: 3200, f:  35.2, t:  24  },
        {a: - 2565, b: -  505, r: 1500, f:  14  , t:  38  },

        {a: - 1725, b: -  415, r:  900, f:  67.2, t:  20  },
        {a: - 1610, b: -  270, r:  750, f:  11  , t:  77  },
      ];
      var shapePoints3 = [];
      shapeParams3.forEach((param) => {
        const arc = this.circlePointGen(param.a, param.b, param.r, param.f, param.t, divCount);
        shapePoints3 = shapePoints3.concat(arc);
      });
      var pathPoints3 = [];
      pathParams3.forEach((param) => {
        const arc = this.circlePointGen(param.a, param.b, param.r, param.f, param.t, divCount);
        pathPoints3 = pathPoints3.concat(arc);
      });
      const shape3 = this.clipShapeGen(shapePoints3, pathPoints3, this.frontColor);
      group3.add(shape3);
      group3.rotation.y = THREE.MathUtils.degToRad(180 * i);
      this.shapes.add(group3);

      const group4 = new THREE.Group();
      const shapeParams4 = [
        {a: -  300, b: - 840, r:  785, f:   78.6, t:  119.5},
        {a: - 1800, b: - 550, r: 1185, f:   19.4, t:   38.3},
        {a: -   70, b: - 650, r: 1150, f:  133.8, t:   87.4},
        {a: - 2470, b:   670, r: 2450, f: -  4  , t: - 17.7},
      ];
      const pathParams4 = [
        {a: -  115, b: - 440, r:  850, f:   90  , t:  138  },
        {a: -   10, b: - 815, r: 1200, f:  128  , t:  100.4},

        {a:    515, b: - 580, r: 1200, f:  128  , t:  152  },
        {a:    760, b: - 945, r: 1600, f:  145  , t:  125.3},

        {a: - 1355, b:   500, r: 1200, f: -  6.5, t: - 26  },
        {a: - 1020, b:   480, r:  900, f: - 34.5, t: -  4.0},
      ];
      var shapePoints4 = [];
      shapeParams4.forEach((param) => {
        const arc = this.circlePointGen(param.a, param.b, param.r, param.f, param.t, divCount);
        shapePoints4 = shapePoints4.concat(arc);
      });
      var pathPoints4 = [];
      pathParams4.forEach((param) => {
        const arc = this.circlePointGen(param.a, param.b, param.r, param.f, param.t, divCount);
        pathPoints4 = pathPoints4.concat(arc);
      });
      const shape4 = this.clipShapeGen(shapePoints4, pathPoints4, this.frontColor);
      group4.add(shape4);
      group4.rotation.y = THREE.MathUtils.degToRad(180 * i);
      this.shapes.add(group4);

      const group5 = new THREE.Group();
      const shapeParams5 = [
        {a: -   70, b: - 650, r: 1185, f: 119.6, t: 133  },
        {a: - 1800, b: - 550, r: 1185, f:  39.8, t:  74  },
        {a:      0, b:     0, r: 1600, f: 158.2, t: 135.4},
        {a: - 1700, b:   240, r: 1050, f:   57.4, t:  7.4},
      ];
      const pathParams5 = [
        {a: - 1525, b:   400, r:  700, f:  54.4, t:   3.8},
        {a: - 1710, b:   235, r:  910, f:  13  , t:  44  },

        {a: - 1910, b:   570, r:  900, f:  20  , t: - 7.8},
        {a: - 2610, b:   330, r: 1600, f:   4.6, t:  21.0},

        {a:    115, b: - 120, r: 1600, f: 141.1, t: 152  },
        {a: -  435, b:   375, r:  900, f: 164  , t: 138.6},
      ];
      var shapePoints5 = [];
      shapeParams5.forEach((param) => {
        const arc = this.circlePointGen(param.a, param.b, param.r, param.f, param.t, divCount);
        shapePoints5 = shapePoints5.concat(arc);
      });
      var pathPoints5 = [];
      pathParams5.forEach((param) => {
        const arc = this.circlePointGen(param.a, param.b, param.r, param.f, param.t, divCount);
        pathPoints5 = pathPoints5.concat(arc);
      });
      const shape5 = this.clipShapeGen(shapePoints5, pathPoints5, this.frontColor);
      group5.add(shape5);
      group5.rotation.y = THREE.MathUtils.degToRad(180 * i);
      this.shapes.add(group5);

      const group6 = new THREE.Group();
      const shapeParams6 = [
        {a: - 1700, b:   240, r: 1085, f:    8.2, t:   29.5},
        {a: -   60, b:    55, r: 1000, f:  134.0, t:   87.8},
        {a: - 2470, b:  1150, r: 2450, f: -  2.4, t: - 14.7},
        {a: -   70, b: - 650, r: 1185, f:   91.4, t:  118.0},
      ];
      const pathParams6 = [
        {a: -   70, b:   115, r:  850, f:   91.4, t:  135  },
        {a:     30, b: - 260, r: 1200, f:  126  , t:  102.4},

        {a:    595, b:    40, r: 1200, f:  133.2, t:  156.5},
        {a:    835, b: - 350, r: 1600, f:  146.8, t:  127.4},

        {a: - 1330, b:  1040, r: 1200, f: -  5.4, t: - 24  },
        {a: -  995, b:  1030, r:  900, f: - 32  , t: -  4  },
      ];
      var shapePoints6 = [];
      shapeParams6.forEach((param) => {
        const arc = this.circlePointGen(param.a, param.b, param.r, param.f, param.t, divCount);
        shapePoints6 = shapePoints6.concat(arc);
      });
      var pathPoints6 = [];
      pathParams6.forEach((param) => {
        const arc = this.circlePointGen(param.a, param.b, param.r, param.f, param.t, divCount);
        pathPoints6 = pathPoints6.concat(arc);
      });
      const shape6 = this.clipShapeGen(shapePoints6, pathPoints6, this.frontColor);
      group6.add(shape6);
      group6.rotation.y = THREE.MathUtils.degToRad(180 * i);
      this.shapes.add(group6);


      const group7 = new THREE.Group();
      const shapeParams7 = [
        {a: -   60, b:   55, r: 1035, f:  119.3, t:  133.6},
        {a: - 1700, b:  240, r: 1085, f:   32.2, t:   57.0},
        {a:      0, b:    0, r: 1600, f:  134  , t:  112.4},
        {a: - 1655, b: 1130, r: 1100, f:   18.4, t: -  9.0},
      ];
      const pathParams7 = [
        {a: -  510, b:  885, r:  500, f:  105.5, t:  152  },
        {a: -  395, b:  615, r:  750, f:  138.2, t:  114  },

        {a: -   75, b:  880, r:  750, f:  145.8, t:  175  },
        {a:    335, b:  625, r: 1200, f:  164.8, t:  146.6},

        {a: - 1845, b: 1055, r: 1200, f:   11.2, t: -  4.6},
        {a: - 1215, b: 1165, r:  600, f: - 19.8, t:   20  },
      ];
      var shapePoints7 = [];
      shapeParams7.forEach((param) => {
        const arc = this.circlePointGen(param.a, param.b, param.r, param.f, param.t, divCount);
        shapePoints7 = shapePoints7.concat(arc);
      });
      var pathPoints7 = [];
      pathParams7.forEach((param) => {
        const arc = this.circlePointGen(param.a, param.b, param.r, param.f, param.t, divCount);
        pathPoints7 = pathPoints7.concat(arc);
      });
      const shape7 = this.clipShapeGen(shapePoints7, pathPoints7, this.frontColor);
      group7.add(shape7);
      group7.rotation.y = THREE.MathUtils.degToRad(180 * i);
      this.shapes.add(group7);

      const group8 = new THREE.Group();
      const shapeParams8 = [
        {a: - 1655, b:  1130, r: 1135, f: -  7.8, t: -  1.8},
        {a: -  490, b:  1020, r:   80, f:   112  , t:   6.4},
        {a: -   60, b:    55, r: 1035, f:  110.0, t:  117.0},
      ];
      var shapePoints8 = [];
      shapeParams8.forEach((param) => {
        const arc = this.circlePointGen(param.a, param.b, param.r, param.f, param.t, divCount);
        shapePoints8 = shapePoints8.concat(arc);
      });
      const shape8 = this.shapeGen(shapePoints8, this.frontColor);
      group8.add(shape8);
      group8.rotation.y = THREE.MathUtils.degToRad(180 * i);
      this.shapes.add(group8);

      const group9 = new THREE.Group();
      const shapeParams9 = [
        {a: - 1655, b:  1130, r: 1135, f:   0.1, t:   15  },
        {a: -  509, b:  1458, r:   56, f:  198  , t:   18  },
        {a: -  390, b:  1484, r:   65, f:  185  , t: - 45  },
        {a: -  215, b:  1360, r:  150, f:  148.5, t:  190  },
        {a: -  330, b:  1340, r:   33, f:  190  , t:  360  },
        {a: -  595, b:  1455, r:  320, f:  338.8, t:  370  },

        {a: -  205, b:  1508, r:   75, f:  179  , t:   42  },
        {a: -   90, b:  1532, r:   65, f:  156  , t: - 54  },
        {a: -  100, b:  1425, r:   75, f:  408  , t:  282  },

        {a: -   40, b:  1035, r:  320, f:   98  , t:  128.8},
        {a: -  225, b:  1255, r:   33, f:  118  , t:  300  },
        {a: -  250, b:  1370, r:  150, f:  286  , t:  324.2},
        {a: -   80, b:  1255, r:   55, f:  514  , t:  275  },
        {a: -   85, b:  1146, r:   55, f:  440  , t:  270  },
        {a: -   60, b:    55, r: 1035, f:   91.2, t:  107.8},

        {a: -  490, b:  1020, r:  115, f:   10.0, t:   23  },
        {a:    105, b:   310, r:  900, f:  123.0, t:  105.0},
        {a: -  132, b:  1187, r:    8, f: - 80  , t:  100  },
        {a: -   42, b:   603, r:  600, f:   99.0, t:  120.0},

        {a: -  490, b:  1020, r:  115, f:   36  , t:   44  },
        {a:   1658, b: - 128, r: 2400, f:  148.0, t:  138.0},
        {a: -  105, b:  1509, r:    5, f: - 45  , t:  135  },
        {a:   1597, b: - 177, r: 2400, f:  135.2, t:  147.4},

        {a: -  490, b:  1020, r:  115, f:   56  , t:   68  },
        {a: - 1325, b:  1330, r:  900, f: - 13.0, t:    5.1},
        {a: -  441, b:  1410, r:   11, f:    0  , t:  180  },
        {a: - 1350, b:  1350, r:  900, f:    3.9, t: - 13.7},

        {a: -  490, b:  1020, r:  115, f:   83.2, t:  105  },

      ];
      var shapePoints9 = [];
      shapeParams9.forEach((param) => {
        const arc = this.circlePointGen(param.a, param.b, param.r, param.f, param.t, divCount);
        shapePoints9 = shapePoints9.concat(arc);
      });
      const shape9 = this.shapeGen(shapePoints9, this.frontColor);
      group9.add(shape9);
      group9.rotation.y = THREE.MathUtils.degToRad(180 * i);
      this.shapes.add(group9);

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
      // this.blackBoard.scale.set(ratioSx, ratioSy)
      shape.scale.set(ratioSx, ratioSy)
    }
    // if (this.blackBoard) this.blackBoard.rotation.z = - 1440 * ratio * (Math.PI / 180);
    this.shapes.rotation.z = - 1440 * ratio * (Math.PI / 180);
  }

  render() {

    // ファウンダーの表示アニメーション制御
    this.foundersDisplayControl(0.0, 0.05, 0.0, 0.6, 0.95, 1.0);

    // グリッドの表示アニメーション制御
    this.grid.displayControl(this.gridExist, this.progRatio, 0.0, 0.05, 0.35, 0.45);

    // ガイドラインの表示アニメーション制御
    this.guidelinesDisplayControl(0.05, 0.45, 0.5, 0.6, 1000, 0.02, 0.02);

    // アウトラインの表示アニメーション制御
    this.outlinesDisplayControl(0.4, 0.6, 0.65, 0.75, 1000);

    // 図形の表示アニメーション制御
    this.shapesDisplayControl(0.65, 0.75, 0.95, 1.0);

    // 図形を回転
    this.shapesRotationControl(0.75, 0.95);

    // descの表示アニメーションを制御
    this.descDisplayControl(0.8, 0.95, 0.95, 1.0);

    super.render();
  }
}
