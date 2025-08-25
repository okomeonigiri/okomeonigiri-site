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
