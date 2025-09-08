let isHeader = 1;
let header = document.getElementById('header');

async function importHeader() {
    let headerHTML = '';
    let res = await fetch('/components/header.html');
    if (!res.ok) {
        res = await fetch('/public/components/header.html');
        if (!res.ok) {
            headerHTML = '<p style="color:red;">ヘッダーの読み込みに失敗しました。</p>';
            header.innerHTML = headerHTML;
            return;
        }
    }
    headerHTML = await res.text();
    header.innerHTML = headerHTML;
    header.style.display = 'block';
    importScrollTopBtn();
    const wasHidden =localStorage.getItem('header_hide?');
    if(wasHidden === 'true'){
      hideHeader();
    } else if(wasHidden =='null'){
      wasHidden = 'false';
    }
    
}

async function importScrollTopBtn() {
    let btnHTML = '';
    let res = await fetch('/components/scrollTopBtn.html');
    if (!res.ok) {
        res = await fetch('/public/components/scrollTopBtn.html');
        if (!res.ok) {
            btnHTML = '<!-- ボタンの読み込みに失敗しました -->';
            document.body.insertAdjacentHTML('beforeend', btnHTML);
            return;
        }
    }
    btnHTML = await res.text();

    const headerContainer = document.getElementById('header');
    if (headerContainer) {
        headerContainer.insertAdjacentHTML('beforeend', btnHTML);
        const script = document.createElement('script');
        script.src = '/assets/JS/scrollTopBtn.js';
        document.head.appendChild(script);
    } else {
        document.body.insertAdjacentHTML('beforeend', btnHTML);
        const script = document.createElement('script');
        script.src = '/assets/JS/scrollTopBtn.js';
        document.head.appendChild(script);
    }
}



const fileName = location.pathname.split('/').pop();
if (fileName !== 'header.html') {
  importHeader();
}

function switchHeader(){
  if(isHeader){
    hideHeader();
  }else{
    showHeader();
  }
}

function hidenav(){
  const headernav = document.querySelector('nav');
  if (headernav) {
    headernav.classList.add('hide');
  }
}

function hideHeader(){
  localStorage.setItem('header_hide?', 'true');
  const hideBTN = document.querySelector('.header-switch');
  const headerDiv = document.querySelector('.header');
  const headerSwitchButton = document.querySelector('.header-switch');
  const headerTag = document.querySelector('header');
  headerDiv.classList.add('hide');
    headerSwitchButton.textContent = 'ヘッダーを表示';
    if(headerTag){
      headerTag.classList.remove('visible-header');
      headerTag.classList.add('hide-header');
    }
    document.body.style.paddingTop = '0px';
    hideBTN.style.paddingTop  = '10px';
    isHeader = 0;
}

function showHeader(){
  localStorage.setItem('header_hide?', 'false');
  const headerDiv = document.querySelector('.header');
  const hideBTN = document.querySelector('.header-switch');
  const headerSwitchButton = document.querySelector('.header-switch');
  const headerTag = document.querySelector('header');
  headerDiv.classList.remove('hide');
    headerSwitchButton.textContent = 'ヘッダーを非表示';
    if(headerTag){
      headerTag.classList.remove('hide-header');
      headerTag.classList.add('visible-header');
    }
    document.body.style.paddingTop = '120px';
    hideBTN.style.paddingTop  = '30px';
    isHeader = 1;
}