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
  let nowPlaying = false;
  let nowIndex = 0;

  document.body.classList.remove('loading');

  const roll = document.getElementById('roll');
  const playBtn = document.getElementById('playBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const backBtn = document.getElementById('backBtn');
  const forwardBtn = document.getElementById('forwardBtn');
  var terminus;
  var myTheme = localStorage.getItem('theme');

  var kamons = [
    // new HidariFutatsuDomoe(),
    // new Kikyou(),
    new GenjiGuruma(),
    // new ChigaiTakanoha(),
    // new DakiMyouga(),
  ];
  var kamon;

  // アニメーションスクロール関数の定義
  const autoScroll = (target, duration = 10000) => {
    const initialPosition = window.scrollY;
    const targetPosition = target;
    const animationStart = performance.now();
    const adjustDur = Math.abs(initialPosition - targetPosition) / terminus * duration;

    const performAnimation = (currentTime) => {
      const elapsedTime = currentTime - animationStart;
      const progress = elapsedTime / adjustDur;
      if (progress < 1) {
        const easedProgress = progress;
        const currentPosition = initialPosition +
          ((targetPosition - initialPosition) * easedProgress);
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
    myTheme = theme;
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
    kamon.changeTheme(theme);
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

  // クリック音を再生
  const soundPlay = () => {
    const sound = document.getElementById('sound');
    sound.currentTime = 0;
    sound.play();
  }

  // アニメーションを再生
  const play = () => {
    if (window.scrollY < terminus) {
      const scrollDur = kamon.scrollDur;
      nowPlaying = true;
      playBtn.classList.add('running');
      pauseBtn.classList.remove('disabled');
      forwardBtn.classList.add('disabled');
      backBtn.classList.add('disabled');
      autoScroll(terminus, scrollDur);
    }
  }

  // アニメーションを一時停止
  const pause = () => {
    nowPlaying = false;
    playBtn.classList.remove('running');
    pauseBtn.classList.add('disabled');
    forwardBtn.classList.remove('disabled');
    backBtn.classList.remove('disabled');
  }

  // アニメーションを先頭まで戻す
  const back = () => {
    if (window.scrollY == 0) {
      draw('back');
    } else {
      window.scrollTo(0, 0);
      kamon.scrolled(window.scrollY);
    }
  }

  // アニメーションを先頭まで戻す
  const forward = () => {
    if (window.scrollY == terminus) {
      draw('forward');
    } else {
      window.scrollTo(0, terminus);
      kamon.scrolled(window.scrollY);
    }
  }

  // 次の家紋アニメーションを抽選する
  const draw = (direction) => {

    window.scrollTo(0, 0);
    const kamonElm = document.getElementById('kamon');
    kamonElm.innerHTML = '';

    if (direction == 'forward' && nowIndex == kamons.length - 1) {
      nowIndex = 0;
    } else if (direction == 'back' && nowIndex == 0) {
      nowIndex = kamons.length - 1;
    } else {
      direction == 'forward' ? nowIndex ++ : nowIndex --;
    }

    kamon = kamons[nowIndex];
    kamon.init();
    kamon.changeTheme(myTheme);
    kamon.windowResize();
    terminus = roll.scrollHeight - window.innerHeight;
    document.body.classList.remove('loading');
  }

  if (kamons.length > 1) kamons = shuffle(kamons);
  kamon = kamons[nowIndex];
  kamon.init();
  window.scrollTo(0, 0);
  terminus = roll.scrollHeight - window.innerHeight;
  play();

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
      }
    } else if (window.scrollY > 0 && window.scrollY < terminus) {
      playBtn.classList.remove('disabled');
      if (!nowPlaying) {
        forwardBtn.classList.remove('disabled');
        backBtn.classList.remove('disabled');
      }
    } else if (window.scrollY == terminus) {
      playBtn.classList.remove('running');
      pauseBtn.classList.add('disabled');
      forwardBtn.classList.remove('disabled');
      backBtn.classList.remove('disabled');
      if (nowPlaying) {
        document.body.classList.add('loading');
        setTimeout(() => {
          draw('forward');
          play();
        }, 1);
      }
    }

  });

  // 画面リサイズ時の処理
  window.addEventListener('resize', () => {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(kamon.windowResize, 200);
    terminus = roll.scrollHeight - window.innerHeight;
  });

  // テーマ名が保存されていたら適用
  if (myTheme) {
    changeTheme(myTheme);
    const target = document.getElementById(myTheme);
    target.checked = true;
  }

  // ラジオボタンクリックでテーマ変更
  const themeChangers = document.getElementsByName('themeChanger');
  themeChangers.forEach((themeChanger) => {
    themeChanger.addEventListener('change', () => {
      soundPlay();
      changeTheme(themeChanger.value);
    });
  })

  playBtn.addEventListener('click', () => {
    soundPlay();
    play();
  });

  pauseBtn.addEventListener('click', () => {
    soundPlay();
    pause();
  });

  backBtn.addEventListener('click', () => {
    soundPlay();
    back();
  });

  forwardBtn.addEventListener('click', () => {
    soundPlay();
    forward();
  });
}
