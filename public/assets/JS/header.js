async function importHeader() {
  const res = await fetch('../components/header.html');//res(response)にheader.htmlの内容を取得
  const html = await res.text();//htmlにheader.htmlの内容をテキスト(html)として格納
  document.getElementById('header').innerHTML = html;//IDがheaderの要素の中にhtmlを挿入
}
importHeader();//関数を実行

// この関数を呼び出すことで、header.htmlの内容がページに挿入されます。
// 注意: <div id="header"></div> がHTML内に存在する必要があります。