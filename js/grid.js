'use strict';

import * as THREE from 'three';

export default class Grid {

  constructor (
    edge = 1600,
    interval = 100,
    color = 0x333333,
    thinColor = 0x1a1a1a
  ) {

    // 色
    this.color     = color;
    this.thinColor = thinColor;

    // Z軸の座標
    this.z = 0;

    // 頂点の座標
    this.points = [];

    // メッシュグループ
    this.group = new THREE.Group();

    const frames = [
      [
        new THREE.Vector3(- edge,   edge, this.z),
        new THREE.Vector3(  edge,   edge, this.z),
        new THREE.Vector3(  edge, - edge, this.z),
        new THREE.Vector3(- edge, - edge, this.z),
        new THREE.Vector3(- edge,   edge, this.z)
      ],
      [
        new THREE.Vector3(     0,   edge, this.z),
        new THREE.Vector3(     0, - edge, this.z)
      ],
      [
        new THREE.Vector3(  edge,      0, this.z),
        new THREE.Vector3(- edge,      0, this.z)
      ]
    ];
    this.points.push(frames);

    const grids = [];
    for (var i = 0;i <= 1;i ++) {
      var axis = - edge;
      const num = (edge / interval * 2) - 2;
      var line = [];
      for (var j = 0;j <= num;j ++) {
        axis += interval;
        if (axis == 0) continue;
        if (i == 0) {
          line = [
            new THREE.Vector3(  axis,   edge, this.z),
            new THREE.Vector3(  axis, - edge, this.z)
          ]
        } else {
          line = [
            new THREE.Vector3(  edge,   axis, this.z),
            new THREE.Vector3(- edge,   axis, this.z)
          ];
        }
        grids.push(line);
      }
    }
    this.points.push(grids);
  }

  // 線を描画
  draw = () => {
    var index = 0;
    this.points.forEach((groups) => {
      const color = index == 0 ? this.color : this.thinColor;
      groups.forEach((group) => {
        const geometry = new THREE.BufferGeometry().setFromPoints(group);
        const material = new THREE.LineBasicMaterial({
          color: color,
          side: THREE.DoubleSide,
          transparent: true
        });
        const line = new THREE.Line(geometry, material);
        this.group.add(line);
      })
      index ++;
    });
    return this.group;
  }

  // 色を変更
  changeTheme = (color, thinColor) => {
    var index = 0;
    this.group.children.forEach((line) => {
      if (index <= 2) {
        line.material.color = new THREE.Color(color);
      } else {
        line.material.color = new THREE.Color(thinColor);
      }
      index ++;
    });
  }

  // 表示制御
  displayControl = (exist, progRatio, inStart, inEnd, outStart, outEnd) => {
    const inRatio  = THREE.MathUtils.smoothstep(progRatio, inStart, inEnd);
    const outRatio = THREE.MathUtils.smoothstep(progRatio, outStart, outEnd);
    this.group.children.forEach((line) => {
      if (exist) {
        if (inRatio > 0.0 && outRatio == 0.0) {
          line.visible = true;
          line.material.opacity = inRatio;
        } else if (outRatio > 0.0 && outRatio < 1.0) {
          line.material.opacity = 1.0 - outRatio;
        } else if (outRatio >= 1.0) {
          line.visible = false;
        }
      } else {
        line.visible = false;
      }
    });
  }

  // フェードアウト
  fadeOut = (tick, start, end) => {
    const ratio = THREE.MathUtils.smoothstep(tick, start, end);
    this.group.children.forEach((line) => {
      line.visible = true;
      if (ratio >= 1) line.visible = false;
      line.material.opacity = 1.0 - ratio;
    });
  }

}
