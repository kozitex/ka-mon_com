'use strict';
import Kageigeta from './crests/kageigeta.js';
import HidariFutatsuDomoe from './crests/hidari-futatsu-domoe.js';

window.addEventListener('DOMContentLoaded', () => {
  init();
});

const init = () => {
  let resizeTimeout = 0;
  let guideTimeout = 0;
  let autoScrolling = false;

  // const kamon = new Kageigeta();
  const kamon = new HidariFutatsuDomoe();

  // 表示言語を適用
  // const changeLang = (language) => {
  //   document.body.classList.remove('jp', 'en');
  //   document.body.classList.add(language);
  //   localStorage.setItem('theme', language);
  // }

  // テーマカラーを適用
  const changeTheme = (theme) => {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
    kamon.changeTheme(theme);
    localStorage.setItem('theme', theme);
  }

  // 読み込み後に動きがなければガイドを表示
  const guide = document.getElementById('guide');
  guideTimeout = setTimeout(() => {
    if (window.scrollY <= 0) {
      guide.classList.remove('hide');
    }
  }, 10000);

  // スクロール量をキャンバスに渡す
  kamon.scrolled(window.scrollY);

  // 画面スクロール時の処理
  window.addEventListener('scroll', () => {
    // ガイド表示タイマーをクリア・リセット
    if (guideTimeout) clearTimeout(guideTimeout);
    guideTimeout = setTimeout(() => {
      if (window.scrollY <= 0) {
        guide.classList.remove('hide');
      }
    }, 10000);
  
    // スクロール量をキャンバスに渡す
    kamon.scrolled(window.scrollY);

    // ガイドを非表示
    if (window.scrollY > 0) {
      guide.classList.add('hide');
    }

    // 画面の端に着いたらオートプレイボタンを初期化
    if (window.scrollY == 0) {
      autoScrolling = false;
      forward.classList.remove('disabled');
      backward.classList.add('disabled');
      backward.classList.remove('running');
    } else if (window.scrollY == terminus) {
      autoScrolling = false;
      backward.classList.remove('disabled');
      forward.classList.add('disabled');
      forward.classList.remove('running');
    } else if (!autoScrolling) {
      forward.classList.remove('disabled');
      backward.classList.remove('disabled');
    }

  });

  // // マウスを動かした時
  // window.addEventListener('mousemove', e => {
  //   kamon.mouseMoved(e.clientX, e.clientY);
  // });

  // マウスをクリックした時
  window.addEventListener('pointerdown', (e) => {
    const canvas = document.getElementsByTagName('canvas')[0];
    // console.log(e.target);
    if (e.target != canvas) return;
    const intervalId = setInterval(kamon.pointerLongPress, 50);

    document.addEventListener('pointerup', () => {
      clearInterval(intervalId);
      kamon.gentleFlow();

    //   const sec = performance.now() / 1000;
    //   const angle = kamon.increment;
    //   // console.log(inc, inc / 360);
    //   // console.log(angle);
    //   // console.log(Math.ceil(angle / 360));
    //   const terminus = Math.floor(angle / 360) * 720;
    //   // console.log(terminus);

    //   const ratio = THREE.MathUtils.smoothstep(sec, 0, 3);

    //   // while(- (kamon.increment ** 1.5) > terminus) {
    //   //   console.log(- (kamon.increment ** 1.5));
    //   //   setTimeout(() => {
        
    //   //   // kamon.gentleFlow(kamon.pressIncrement);
    //   //   kamon.increment ++;
    //   //   }, 1);
    //   // }
    //   // kamon.increment = 0;


    //   var timer = setInterval(function(){
    //     //do something
    //     // console.log("do something");
    //   if(kamon.increment <= terminus){
    //     console.log(sec);
    //         clearInterval(timer);
    //         kamon.increment = -1;
    //       }
    //       kamon.increment = kamon.increment - ((terminus - angle) * ratio);
    //       // kamon.increment = kamon.increment - 10;
    // },50);

    

      // console.log(kamon.pressIncrement);
      // while(kamon.pressIncrement > 0) {
      //   console.log(kamon.pressIncrement);
      //   setInterval(() => {
      //     kamon.pressIncrement = kamon.pressIncrement ;
      //   }, 500);
      // }
      // for (var i = 0;i <= 10;i ++) {
      //   console.log(kamon.pressIncrement);
      //   setTimeout(() => {
      //     kamon.pressIncrement --;
      //   }, 50);
      // }
    }, { once: true })
  });

  // 画面リサイズ時の処理
  window.addEventListener('resize', () => {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(kamon.windowResize, 200);
    terminus = scroller.scrollHeight - window.innerHeight;
  });

  // // 表示言語が保存されていたら適用
  // const myLanguage = localStorage.getItem('language');
  // if (myLanguage) {
  //   changeTheme(myLanguage);
  //   const target = document.getElementById(myLanguage);
  //   target.checked = true;
  // }

  // テーマ名が保存されていたら適用
  const myTheme = localStorage.getItem('theme');
  if (myTheme) {
    changeTheme(myTheme);
    const target = document.getElementById(myTheme);
    target.checked = true;
  }

  // // ラジオボタンクリックで表示言語変更
  // const langChangers = document.getElementsByName('langChanger');
  // langChangers.forEach((langChanger) => {
  //   langChanger.addEventListener('change', () => changeLang(langChanger.value));
  // })

  // ラジオボタンクリックでテーマ変更
  const themeChangers = document.getElementsByName('themeChanger');
  themeChangers.forEach((themeChanger) => {
    themeChanger.addEventListener('change', () => changeTheme(themeChanger.value));
  })

  // イージング関数を定義
  // const easingFunction = (t) => (
  //   t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
  // );

  // アニメーションスクロール関数の定義
  const autoScroll = (target, duration = 10000) => {
    const initialPosition = window.scrollY;
    const targetPosition = target;
    const animationStart = performance.now();
    const adjustDur = Math.abs(initialPosition - targetPosition) / terminus * duration;
    // console.log(initialPosition, targetPosition, terminus, adjustDur);

    const performAnimation = (currentTime) => {
      const elapsedTime = currentTime - animationStart;
      const progress = elapsedTime / adjustDur;

      if (progress < 1) {
        // const easedProgress = easingFunction(progress);
        const easedProgress = progress;
        const currentPosition = initialPosition +
          ((targetPosition - initialPosition) * easedProgress);
        window.scrollTo(0, currentPosition);
        requestAnimationFrame(performAnimation);
      } else {
        window.scrollTo(0, targetPosition);
      }
    };
    requestAnimationFrame(performAnimation);
  };

  // forward、backwardボタンの制御
  const scroller = document.getElementById('scroller');
  var terminus = scroller.scrollHeight - window.innerHeight;
  const scrollDur = kamon.scrollDur;

  const forward = document.getElementById('forward');
  forward.addEventListener('click', () => {
    if (window.scrollY < terminus) {
      autoScrolling = true;
      forward.classList.add('running');
      backward.classList.add('disabled');
      autoScroll(terminus, scrollDur);
      // kamon.logRecord('- the animation has started playing.');
    }
  });

  const backward = document.getElementById('backward');
  backward.addEventListener('click', () => {
    if (window.scrollY > 0) {
      autoScrolling = true;
      forward.classList.add('disabled');
      backward.classList.add('running');
      autoScroll(0, scrollDur);
      // kamon.logRecord('- started playing the animation in reverse.');
    }
  });

}