let isHeader = 1;

async function importHeader() {
    let headerHTML = '';
    let res = await fetch('/components/header.html');
    if (!res.ok) {
        res = await fetch('/public/components/header.html');
        if (!res.ok) {
            headerHTML = '<p style="color:red;">ヘッダーの読み込みに失敗しました。</p>';
            document.getElementById('header').innerHTML = headerHTML;
            return;
        }
    }
    headerHTML = await res.text();
    document.getElementById('header').innerHTML = headerHTML;
    document.getElementById('header').style.display = 'block';
    importScrollTopBtn();
}
// トップへ戻るボタンのインポート仮関数
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
  const headerDiv = document.querySelector('.header');
  const headerSwitchButton = document.querySelector('.header-switch');
  const headerTag = document.querySelector('header');
  if(isHeader){
    headerDiv.classList.add('hide');
    headerSwitchButton.textContent = 'ヘッダーを表示';
    if(headerTag){
      headerTag.classList.remove('visible-header');
      headerTag.classList.add('hide-header');
    }
    document.body.style.paddingTop = '0px';
    isHeader = 0;
  }else{
    headerDiv.classList.remove('hide');
    headerSwitchButton.textContent = 'ヘッダーを非表示';
    if(headerTag){
      headerTag.classList.remove('hide-header');
      headerTag.classList.add('visible-header');
    }
    document.body.style.paddingTop = '200px';
    isHeader = 1;
  }
}
// style.displayでヘッダー表示/非表示を切り替える形式