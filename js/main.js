'use strict';
import KageIgeta from './kamon/kage-igeta.js';
import HidariFutatsuDomoe from './kamon/hidari-futatsu-domoe.js';
import Kikyou from './kamon/kikyou.js';
import GenjiGuruma from './kamon/genji-guruma.js';
import ChigaiTakanoha from './kamon/chigai-takanoha.js';
import DakiMyouga from './kamon/daki-myouga.js';

window.addEventListener('DOMContentLoaded', () => {
  init();
});

const init = async () => {
  let resizeTimeout = 0;
  let promptTimeout = 0;
  // let playTimeout = 0;
  let nowPlaying = false;
  let nowIndex = 0;
  // let autoScrolling = false;

  // const kamon = new KageIgeta();
  // const kamon = new HidariFutatsuDomoe();
  // const kamon = Kikyou();
  // const kamon = new GenjiGuruma();
  // const kamon = new ChigaiTakanoha();
  // const kamon = new DakiMyouga();

  document.body.classList.remove('loading');
  // window.scrollTo(0, 0);

  const roll = document.getElementById('roll');
  const playBtn = document.getElementById('playBtn');
  const backBtn = document.getElementById('backBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  var terminus;
  const myTheme = localStorage.getItem('theme');
  // var terminus = roll.scrollHeight - window.innerHeight;

  var kamons = [
    new HidariFutatsuDomoe(),
    // new Kikyou(),
    // new GenjiGuruma(),
    // new ChigaiTakanoha(),
    // new DakiMyouga(),
  ];
  // var kamons = [];
  var kamon;
  // kamons = shuffle(kamons);

  // アニメーションスクロール関数の定義
  const autoScroll = (target, duration = 10000) => {
    const initialPosition = window.scrollY;
    const targetPosition = target;
    const animationStart = performance.now();
    const adjustDur = Math.abs(initialPosition - targetPosition) / terminus * duration;

    const performAnimation = (currentTime) => {
      const elapsedTime = currentTime - animationStart;
      const progress = elapsedTime / adjustDur;
      // console.log(progress)
      if (progress < 1) {
        const easedProgress = progress;
        const currentPosition = initialPosition +
          ((targetPosition - initialPosition) * easedProgress);
      // console.log(nowPlaying, currentPosition)
        window.scrollTo(0, currentPosition);
        if (nowPlaying) requestAnimationFrame(performAnimation);
      } else {
        window.scrollTo(0, targetPosition);
      }
    };
    requestAnimationFrame(performAnimation);
  };

  // テーマカラーを適用
  const changeTheme = (theme) => {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
    kamons.forEach((kamon) => {
      kamon.changeTheme(theme);
    })
    localStorage.setItem('theme', theme);
  }

  // 配列の並びをシャッフル
  const shuffle = (array) => {
    const clone = [...array];
    const result = clone.reduce((_, cur, idx) => {
      let rand = Math.floor(Math.random() * (idx + 1));
      clone[idx] = clone[rand];
      clone[rand] = cur;
      return clone;
    })
    return result;
  }

  // アニメーションを再生
  const play = () => {
    if (window.scrollY < terminus) {
      const scrollDur = kamon.scrollDur;
      nowPlaying = true;
      playBtn.classList.add('running');
      pauseBtn.classList.remove('disabled');
      backBtn.classList.add('disabled');
      autoScroll(terminus, scrollDur);
    }
  }

  // アニメーションを一時停止
  const pause = () => {
    nowPlaying = false;
    playBtn.classList.remove('running');
    pauseBtn.classList.add('disabled');
    backBtn.classList.remove('disabled');
  }

  // アニメーションを先頭まで戻す
  const back = () => {
    backBtn.classList.add('disabled');
    window.scrollTo(0, 0);
    kamon.scrolled(window.scrollY);
  }

  // 次の家紋アニメーションを抽選する
  const draw = () => {
    // await new Promise((resolve) => {
      // document.body.classList.add('loading');

    window.scrollTo(0, 0);
    const kamonElm = document.getElementById('kamon');
    kamonElm.innerHTML = '';
    if (kamon) {
      kamon.dispose();
    } else {
      // kamons = shuffle(kamons);
    }
    // const randomIndex = Math.floor(Math.random() * kamons.length);
    if (nowIndex == kamons.length - 1) {
      nowIndex = 0;
      kamons = [
        new HidariFutatsuDomoe(),
        // new Kikyou(),
        // new GenjiGuruma(),
        // new ChigaiTakanoha(),
        // new DakiMyouga(),
      ];
      // kamons = shuffle(kamons);
    } else {
      nowIndex ++;
    }
    kamon = kamons[nowIndex];

    // console.log('start')
    kamon.init();
    // console.log('end')

    terminus = roll.scrollHeight - window.innerHeight;
    if (myTheme) {
      changeTheme(myTheme);
      const target = document.getElementById(myTheme);
      target.checked = true;
    }
      // kamon.render();
      // setTimeout(() => resolve(), 500);
    // })
    document.body.classList.remove('loading');
  }

  // const draw = () => {
  //   window.scrollTo(0, 0);
  //   const kamonElm = document.getElementById('kamon');
  //   kamonElm.innerHTML = '';
  //   const randomIndex = Math.floor(Math.random() * kamons.length);
  //   kamon = kamons[randomIndex];
  //   kamon.init();
  //   kamon.render();
  // }

  draw();
  play();
  // const randomIndex = Math.floor(Math.random() * kamons.length);
  // const kamon = kamons[randomIndex];
  // kamon.init();
  // kamon.render();


  // 読み込み後に動きがなければガイドを表示
  const prompt = document.getElementById('prompt');
  promptTimeout = setTimeout(() => {
    if (window.scrollY <= 0) {
      prompt.classList.remove('hide');
    }
  }, 10000);

  // スクロール量をキャンバスに渡す
  kamon.scrolled(window.scrollY);

  // 画面スクロール時の処理
  window.addEventListener('scroll', async () => {
    // ガイド表示タイマーをクリア・リセット
    if (promptTimeout) clearTimeout(promptTimeout);
    promptTimeout = setTimeout(() => {
      if (window.scrollY <= 0) {
        prompt.classList.remove('hide');
      }
    }, 10000);
  
    // スクロール量をキャンバスに渡す
    kamon.scrolled(window.scrollY);

    // ガイドを非表示
    if (window.scrollY > 0) prompt.classList.add('hide');

    // 画面の端に着いたらオートプレイボタンを初期化
    if (window.scrollY == 0) {
      if (!nowPlaying) {
        playBtn.classList.remove('disabled', 'running');
        backBtn.classList.add('disabled');
      }
    } else if (window.scrollY > 0 && window.scrollY < terminus) {
      playBtn.classList.remove('disabled');
      if (!nowPlaying) backBtn.classList.remove('disabled');
    } else if (window.scrollY == terminus) {
      // nowPlaying = false;
      playBtn.classList.add('disabled');
      playBtn.classList.remove('running');
      pauseBtn.classList.add('disabled');
      backBtn.classList.remove('disabled');
      if (nowPlaying) {
        document.body.classList.add('loading');
        setTimeout(() => {
          draw();
          play();
        }, 1);
      }
    }

  });

  // 画面リサイズ時の処理
  window.addEventListener('resize', () => {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    // resizeTimeout = setTimeout(kamon.windowResize, 200);
    resizeTimeout = setTimeout(() => {
      kamons.forEach((kamon) => {kamon.windowResize();});
    }, 200);
    terminus = roll.scrollHeight - window.innerHeight;
  });

  // テーマ名が保存されていたら適用
  // const myTheme = localStorage.getItem('theme');
  // if (myTheme) {
  //   changeTheme(myTheme);
  //   const target = document.getElementById(myTheme);
  //   target.checked = true;
  // }

  // ラジオボタンクリックでテーマ変更
  const themeChangers = document.getElementsByName('themeChanger');
  themeChangers.forEach((themeChanger) => {
    themeChanger.addEventListener('change', () => changeTheme(themeChanger.value));
  })



  // const backward = document.getElementById('backward');
  // backward.addEventListener('click', () => {
  //   if (window.scrollY > 0) {
  //     autoScrolling = true;
  //     forward.classList.add('disabled');
  //     backward.classList.add('running');
  //     autoScroll(0, scrollDur);
  //   }
  // });

  playBtn.addEventListener('click', play);
  pauseBtn.addEventListener('click', pause);
  backBtn.addEventListener('click', back);

}
