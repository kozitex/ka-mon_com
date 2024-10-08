'use strict';

import * as THREE from 'three';
import Founder from './founder.js';

export default class Mist extends Founder {

  constructor () {

    super();

    // メッシュグループ
    this.group = new THREE.Group();
    this.mists = new THREE.Group();
    this.logo  = new THREE.Group();

    // ミスト用マテリアル
    this.mistMat = new THREE.LineBasicMaterial({
      transparent: true
    });

    // ロゴ用マテリアル
    const loader = new THREE.TextureLoader();
    const texture = loader.load('../img/logo.png');
    this.logoMat = new THREE.MeshBasicMaterial({
      map: texture,
      opacity: 0.3,
      transparent: true,
    });

    // ミストの描画
    const points = this.circlePointGen(0, 0, 1600, 90, 450, 1000);
    for (var i = 0;i <= 9;i ++) {
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      geometry.setDrawRange(0, 0);
      const material = this.mistMat.clone();
      const line = new THREE.Line(geometry, material);
      this.mists.add(line);
    }
    this.group.add(this.mists);

    // ロゴの描画
    const logoGeo = new THREE.BoxGeometry(480, 480, 1);
    const logoMesh  = new THREE.Mesh(logoGeo, this.logoMat);
    this.logo.add(logoMesh);
    this.group.add(this.logo);
    // const logo = new THREE.Group();
    // logo.add(logoMesh);

  }

  // メッシュを生成
  generate = () => {
    return this.group;
  }

  // 色を変更
  changeTheme = (color) => {
    this.mists.children.forEach((line) => {
      if (!line.isGroup) line.material.color = new THREE.Color(color);
    })
  }

  // 表示アニメーション制御
  displayControl = (progRatio) => {
    const tightenRatio = THREE.MathUtils.smoothstep(progRatio, 0.0,  0.05);
    const fadeOutRatio = THREE.MathUtils.smoothstep(progRatio, 0.0,  0.2);
    const loosenRatio  = THREE.MathUtils.smoothstep(progRatio, 0.8,  0.9);
    const fadeInRatio  = THREE.MathUtils.smoothstep(progRatio, 0.75, 0.85);
    const logoInRatio  = THREE.MathUtils.smoothstep(progRatio, 0.8,  0.85);
    const logoOutRatio = THREE.MathUtils.smoothstep(progRatio, 0.0,  0.05);
    const dAmpOrigin = 0.87;
    const dInt = 0.2;
    const scrFill = THREE.MathUtils.mapLinear(tightenRatio - loosenRatio, 0.0, 1.0, 0.0, 1.0 - dAmpOrigin);
    const sizeAmt = THREE.MathUtils.mapLinear(tightenRatio - loosenRatio, 0.0, 1.0, 280, 320);
    const dAmp = dAmpOrigin + scrFill;
    const time = performance.now() * 0.00025;
    for (var i = 0;i <= this.mists.children.length - 1;i ++) {
      const mist = this.mists.children[i];
      mist.geometry.setDrawRange(0, 1000);
      const positions = mist.geometry.attributes.position.array;
      for(let j = 0; j <= 1000; j++){
        const angle = THREE.MathUtils.mapLinear(j, 0, 1000, 89.6, 450) * Math.PI / 180;
        const dist = noise.perlin2(
          Math.cos(angle) * i * dInt + time, 
          Math.sin(angle) * i * dInt + time
        );
        const dVal = THREE.MathUtils.mapLinear(dist, 0.0, 1.0, dAmp, 1.0);
        positions[j * 3] = Math.cos(angle) * sizeAmt * dVal;
        positions[j * 3 + 1] = Math.sin(angle) * sizeAmt * dVal;
        mist.material.opacity = Math.abs(dist * 1.0) - fadeOutRatio + fadeInRatio;
      }
      if (fadeOutRatio >= 1.0 && fadeInRatio <= 0.0) {
        mist.visible = false;
      } else {
        mist.visible = true;
      }
      mist.geometry.attributes.position.needsUpdate = true;
    }
    const logoOpaRatio = (1.0 - logoOutRatio + logoInRatio) * 0.3;
    const logoScaRatio = 1.0 + (logoInRatio - logoOutRatio) * 0.2;
    // console.log(logoOpaRatio, logoScaRatio)
    this.logoMat.opacity = logoOpaRatio;
    this.logo.scale.set(logoScaRatio, logoScaRatio, 1);
  }


  // // 表示アニメーション制御
  // displayControl = (progRatio, inStart, inEnd, outStart, outEnd , reInStart, reInEnd) => {
  //   const inRatio  = THREE.MathUtils.smoothstep(progRatio, inStart, inEnd);
  //   const outRatio = THREE.MathUtils.smoothstep(progRatio, outStart, outEnd);
  //   const reInRatio  = THREE.MathUtils.smoothstep(progRatio, reInStart, reInEnd);
  //   const dAmpOrigin = 0.87;
  //   const dInt = 0.2;
  //   const scrFill = THREE.MathUtils.mapLinear(inRatio - reInRatio, 0.0, 1.0, 0.0, 1.0 - dAmpOrigin);
  //   const sizeAmt = THREE.MathUtils.mapLinear(inRatio - reInRatio, 0.0, 1.0, 400, 360);
  //   const dAmp = dAmpOrigin + scrFill;
  //   const time = performance.now() * 0.00025;
  //   for (var i = 0;i <= this.group.children.length - 1;i ++) {
  //     const mist = this.group.children[i];
  //     // console.log(mist)
  //     if (mist.isGroup) break;
  //     mist.geometry.setDrawRange(0, 1000);
  //     const positions = mist.geometry.attributes.position.array;
  //     for(let j = 0; j <= 1000; j++){
  //       const angle = THREE.MathUtils.mapLinear(j, 0, 1000, 89.6, 450) * Math.PI / 180;
  //       const dist = noise.perlin2(
  //         Math.cos(angle) * i * dInt + time, 
  //         Math.sin(angle) * i * dInt + time
  //       );
  //       const dVal = THREE.MathUtils.mapLinear(dist, 0.0, 1.0, dAmp, 1.0);
  //       positions[j * 3] = Math.cos(angle) * sizeAmt * dVal;
  //       positions[j * 3 + 1] = Math.sin(angle) * sizeAmt * dVal;
  //       mist.material.opacity = Math.abs(dist * 1.0) - outRatio + reInRatio;
  //     }
  //     if (outRatio >= 1.0 && reInRatio <= 0.0) {
  //       mist.visible = false;
  //     } else {
  //       mist.visible = true;
  //     }
  //     mist.geometry.attributes.position.needsUpdate = true;
  //   }
  // }

}
