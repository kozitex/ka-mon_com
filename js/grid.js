'use strict';

import * as THREE from 'three';
import Founder from './founder.js';

export default class Grid extends Founder {

  constructor (
    edge = 1600,
    interval = 100,
  ) {

    super();

    // // 頂点の座標
    // this.points = [];

    // メッシュグループ
    this.group = new THREE.Group();

    // 通常グリッド用マテリアル
    this.gridMat = new THREE.LineBasicMaterial({
      color: 0x1a1a1a,
      side: THREE.DoubleSide,
      transparent: true
    });

    // 目印グリッド用マテリアル
    this.markMat = new THREE.LineBasicMaterial({
      color: 0x333333,
      side: THREE.DoubleSide,
      transparent: true
    });

    // グリッドの描画
    const points = [
      new THREE.Vector3(- edge,   edge, 0),
      new THREE.Vector3(- edge, - edge, 0),
    ]
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const num = edge / interval * 2;
    for (var i = 0;i <= 1;i ++) {
      for (var j = 0;j <= num;j ++) {
        const material = j == 0 || j == num / 2 || j == num ? this.markMat : this.gridMat;
        const line = new THREE.Line(geometry, material);
        line.material.opacity = 0.0;
        line.rotation.set(0, 0, THREE.MathUtils.degToRad(90 * i));
        line.position.set(interval * (1 - i) * j, interval * i * j, 0);
        this.group.add(line);
      }
    }
  }

  // グリッドを生成
  generate = () => {
    return this.group;
  }

  // 色を変更
  changeTheme = (color, thinColor) => {
    this.markMat.color = new THREE.Color(color);
    this.gridMat.color = new THREE.Color(thinColor);
  }

  // 表示制御
  displayControl = (progRatio, inStart, inEnd, outStart, outEnd) => {
    const inRatio  = THREE.MathUtils.smoothstep(progRatio, inStart, inEnd);
    const outRatio = THREE.MathUtils.smoothstep(progRatio, outStart, outEnd);
    this.group.children.forEach((line) => {
      // if (exist) {
      if (inRatio > 0.0 && outRatio == 0.0) {
        line.visible = true;
        line.material.opacity = inRatio;
      } else if (outRatio > 0.0 && outRatio < 1.0) {
        line.material.opacity = 1.0 - outRatio;
      } else if (outRatio >= 1.0) {
        line.visible = false;
      }
      // } else {
      //   line.visible = false;
      // }
    });
  }

  // // フェードアウト
  // fadeOut = (tick, start, end) => {
  //   const ratio = THREE.MathUtils.smoothstep(tick, start, end);
  //   this.group.children.forEach((line) => {
  //     line.visible = true;
  //     if (ratio >= 1) line.visible = false;
  //     line.material.opacity = 1.0 - ratio;
  //   });
  // }

}
