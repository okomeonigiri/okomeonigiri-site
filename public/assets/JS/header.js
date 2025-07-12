async function importHeader() {
  let html = '';
  let res = await fetch('../components/header.html');
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
importHeader();

// この関数を呼び出すことで、header.htmlの内容がページに挿入されます。
// 注意: <div id="header"></div> がHTML内に存在する必要があります。