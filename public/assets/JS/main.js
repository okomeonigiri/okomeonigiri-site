// // JSファイルを動的に読み込む
// let loadHTML = '';

// async function importLoad() {
//     let res = await fetch('/components/load.html');
//     if (!res.ok) {
//         res = await fetch('/public/components/load.html');
//         if (!res.ok) {
//             loadHTML = '<p style="color:red;">ローディングの読み込みに失敗しました。</p>';
//             console.error(loadHTML);
//             return;
//         }
//     }
//     loadHTML = await res.text();
//     console.log(loadHTML);
//     const load=document.createElement('div');
//     load.innerHTML=loadHTML;
//     // headとbodyの間（body直前）に挿入
//     document.head.insertAdjacentElement('afterend', load);
// }
document.querySelector('body').style.display="none";
function loadScript(src) {
  const script = document.createElement('script');
  script.src = src;
  script.defer = true; // 必要なら
  document.head.appendChild(script);
  console.log(`Loaded script: ${src}`);
}

// CSSファイルを動的に読み込む
function loadCSS(href) {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
  console.log(`Loaded CSS: ${href}`);
}

loadCSS('/assets/css/footer.css');
loadCSS('/assets/css/useful.css');
loadCSS('/assets/css/okomeonigiri-main.css');
loadScript('/assets/JS/data.js');
loadScript('/assets/JS/header.js');
document.querySelector('body').style.display="block";