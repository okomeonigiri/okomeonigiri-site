async function importHeader() {
  let html = '';
  let res = await fetch('/components/header.html');
  if (!res.ok) {
    res = await fetch('/public/components/header.html');
    if (!res.ok) {
      html = '<p style="color:red;">ヘッダーの読み込みに失敗しました。</p>';
      document.getElementById('header').innerHTML = html;
      return;
    }
  }
  html = await res.text();
  document.getElementById('header').innerHTML = html;
}

const fileName = location.pathname.split('/').pop();
if (fileName !== 'header.html') {
  importHeader();
}

let isHeader = 1;

function switchHeader(){
  if(isHeader){
    hideHeader();
  }else{
    showHeader();
  }
}

function hideHeader(){
  document.getElementById('header').style.display='none';
  document.querySelector('.header-switch').style.display='block';
  const btn = document.querySelector('.header-switch');
  btn.classList.remove('header-visible');
  btn.classList.add('header-hidden');
  isHeader = 0;
}

function showHeader(){
  document.getElementById('header').style.display='block';
  document.querySelector('.header-switch').style.display='block';
  const btn = document.querySelector('.header-switch');
  btn.classList.remove('header-hidden');
  btn.classList.add('header-visible');
  isHeader = 1;
}
// この関数を呼び出すことで、header.htmlの内容がページに挿入されます。
// 注意: <div id="header"></div> がHTML内に存在する必要があります。