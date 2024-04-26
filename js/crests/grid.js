'use strict';

import * as THREE from 'three';

export default class Grid {

  constructor() {

    // フレームサイズ
    this.size = 1600;

    // グリッド間隔
    this.interval = 100;

    // 色
    this.gridColor     = 0x333333;
    this.gridThinColor = 0x1a1a1a;

    // メッシュグループ
    this.group = new THREE.Group();
  }

  // フレームの作成
  createFrame = (size = this.size) => {
    const points = [];
    points.push(new THREE.Vector3(-size,  size, 0));
    points.push(new THREE.Vector3( size,  size, 0));
    points.push(new THREE.Vector3( size, -size, 0));
    points.push(new THREE.Vector3(-size, -size, 0));
    points.push(new THREE.Vector3(-size,  size, 0));

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: this.gridColor,
      side: THREE.DoubleSide,
      transparent: true
    });
    const line = new THREE.Line(geometry, material);
    this.group.add(line);
  }

  // センターラインの作成
  createCenterLine = (size = this.size) => {
    const points = [];
    points.push(new THREE.Vector3(    0,  size, 0));
    points.push(new THREE.Vector3(    0, -size, 0));
    points.push(new THREE.Vector3(    0,     0, 0));
    points.push(new THREE.Vector3( size,     0, 0));
    points.push(new THREE.Vector3(-size,     0, 0));

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: this.gridColor,
      side: THREE.DoubleSide,
      transparent: true
    });
    const line = new THREE.Line(geometry, material);
    this.group.add(line);
  }

  // グリッドの作成
  createGrid = (size = this.size, interval = this.interval) => {
    for (var i = 0;i <= 1;i ++) {
      var axis = -size + interval;
      const num = (size / interval * 2) - 3;
      for (var j = 0;j <= num;j ++) {
        axis += interval;
        if (axis == 0) continue;
        const points = [];
        if (i == 0) {
          points.push( new THREE.Vector3( axis,  size, 0));
          points.push( new THREE.Vector3( axis, -size, 0));
        } else {
          points.push( new THREE.Vector3( size,  axis, 0));
          points.push( new THREE.Vector3(-size,  axis, 0));
        }
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
          color: this.gridThinColor,
          side: THREE.DoubleSide,
          transparent: true
        });
        const line = new THREE.Line(geometry, material);
        this.group.add(line);
      }
    }
  }

  // 要素をグループ化して出力
  generate = (size, interval) => {
    this.createFrame(size);
    this.createCenterLine(size);
    this.createGrid(size, interval);
    return this.group;
  }

  // フェードアウト
  fadeOut = (progress) => {
    this.group.children.forEach((child) => {
      child.material.opacity = THREE.MathUtils.damp(1.0, 0.0, 2, progress);
      if (progress > 1.5) {
        child.visible = false;
      }
    });
  }
}
