'use strict';
import Canvas from './canvas.js';

window.addEventListener('DOMContentLoaded', () => {
  init();
});

const init = () => {

  // キャンバスを展開
  const canvas = new Canvas();

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

  // コントロールの表示・非表示を切り替え
  const toggleControlHide = () => {
    const control = document.getElementById('control');
    if (toggleHide.checked) {
      control.classList.add('hidden');
    } else {
      control.classList.remove('hidden');
    }
  }

  // テーマカラーを適用
  const changeTheme = (theme) => {
    myTheme = theme;
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
    canvas.changeTheme(theme);
    localStorage.setItem('theme', theme);
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
      const scrollDur = canvas.scrollDur;
      nowPlaying = true;
      playBtn.classList.add('running');
      pauseBtn.classList.remove('disabled');
      forwardBtn.classList.add('disabled');
      backBtn.classList.add('disabled');
      autoScroll(terminus, scrollDur);
    }
    document.body.classList.remove('loading');
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
      canvas.draw('back');
      window.scrollTo(0, terminus);
    } else {
      window.scrollTo(0, 0);
      canvas.scrolled(window.scrollY);
    }
  }

  // アニメーションを先頭まで戻す
  const forward = () => {
    if (window.scrollY == terminus) {
      canvas.draw('forward');
      window.scrollTo(0, 0);
    } else {
      window.scrollTo(0, terminus);
      canvas.scrolled(window.scrollY);
    }
  }





  let resizeTimeout = 0;  // ウィンドウサイズ変更用タイマー
  let promptTimeout = 0;  // ガイドプロンプト表示用タイマー
  let nowPlaying = false; // オートプレイフラグ

  // ローディングを非表示
  document.body.classList.remove('loading');

  var terminus; // スクロールの最大値
  var isControlHide = localStorage.getItem('isControlHide'); // ローカルストレージからコントロールの表示・非表示フラグを取得
  var myTheme = localStorage.getItem('theme'); // ローカルストレージからテーマ名を取得

  // HTMLの各要素を取得
  const roll = document.getElementById('roll');
  const playBtn = document.getElementById('playBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const backBtn = document.getElementById('backBtn');
  const forwardBtn = document.getElementById('forwardBtn');
  const toggleHide = document.getElementById('toggleHide');
  const themeChangers = document.getElementsByName('themeChanger');
  const prompt = document.getElementById('prompt');
  const copyright = document.getElementById('copyright');

  // コントロールの表示・非表示が保存されていたら適用
  if (isControlHide) {
    toggleHide.checked = isControlHide == 1 ? true : false;
  } else {
    toggleHide.checked = false;
  }
  toggleControlHide();

  // テーマ名が保存されていたら適用
  if (myTheme) {
    changeTheme(myTheme);
    const target = document.getElementById(myTheme);
    target.checked = true;
  } else {
    changeTheme('dark');
  }

  // コピーライトのテキストを表示
  var today = new Date();
  var year = today.getFullYear();
  copyright.innerHTML = `©︎ ${year} grassrunners.net`;

  // スクロール位置をリセット
  terminus = roll.scrollHeight - window.innerHeight;
  window.scrollTo(0, 0);
  canvas.scrolled(window.scrollY);

  // アニメーションを再生
  play();





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
    canvas.scrolled(window.scrollY);

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
          canvas.draw('forward');
          window.scrollTo(0, 0);
          play();
        }, 1);
      }
    }
  });

  // 画面リサイズ時の処理
  window.addEventListener('resize', () => {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(canvas.windowResize, 200);
    terminus = roll.scrollHeight - window.innerHeight;
    // console.log(window.innerWidth, isControlHide)
    if (window.innerWidth < 1024 && isControlHide == null) {
      toggleHide.checked = true;
      toggleControlHide();
    }
  });

  // 読み込み後に動きがなければガイドを表示
  promptTimeout = setTimeout(() => {
    if (window.scrollY <= 0) {
      prompt.classList.remove('hide');
    }
  }, 10000);

  // チェックボックスクリックで表示・非表示を切り替え
  toggleHide.addEventListener('change', () => {
    soundPlay();
    toggleControlHide();
    localStorage.setItem('isControlHide', toggleHide.checked ? 1 : 0);
  });

  // ラジオボタンクリックでテーマ変更
  themeChangers.forEach((themeChanger) => {
    themeChanger.addEventListener('change', () => {
      soundPlay();
      changeTheme(themeChanger.value);
    });
  })

  // プレイボタンをクリック
  playBtn.addEventListener('click', () => {
    soundPlay();
    play();
  });

  // ポーズボタンをクリック
  pauseBtn.addEventListener('click', () => {
    soundPlay();
    pause();
  });

  // 戻るボタンをクリック
  backBtn.addEventListener('click', () => {
    soundPlay();
    back();
  });

  // 進むボタンをクリック
  forwardBtn.addEventListener('click', () => {
    soundPlay();
    forward();
  });
}
