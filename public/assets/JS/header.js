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
}

const fileName = location.pathname.split('/').pop();
if (fileName !== 'header.html') {
  importHeader();
}

function switchHeader(){
  const headerDiv = document.querySelector('.header');
  const headerSwitchButton = document.querySelector('.header-switch');
  if(isHeader){
    headerDiv.style.display = 'none';
    headerSwitchButton.style.display = 'block';
    document.body.style.paddingTop = '0';
    isHeader = 0;
    headerSwitchButton.textContent = 'ヘッダーを表示';
  }else{
    headerDiv.style.display = 'block';
    document.body.style.paddingTop = '200px';
    isHeader = 1;
    headerSwitchButton.textContent = 'ヘッダーを非表示'; 
  }
}
// style.displayでヘッダー表示/非表示を切り替える形式