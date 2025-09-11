function YTV_setup() {
    addYoutubeSearchResultListeners();
    loaddata();
}

let player;// YT.Player オブジェクト
let videoId = null;// 現在の動画ID
let viewHistory = null;// 視聴履歴 [[videoId, date], ...]
let favorite = null;
let loopEnabled = false;// ループ再生の有無
let CSEloaded =false;

// YouTube IFrame Player APIの読み込み

/**
 * 指定したセレクタの要素がDOMに現れたらresolveするPromiseを返す
 * @param {string} selector - 監視するCSSセレクタ
 * @param {number} timeout - タイムアウト(ms)。省略時は5000ms
 * @returns {Promise<Element|null>} - 見つかった要素、またはnull（タイムアウト時）
 */
async function waitForD(selector, timeout = 5000) {
    // すでに存在する場合は即return
    let el = document.querySelector(selector);
    if (el) return el;

    return new Promise((resolve) => {
        const timer = setTimeout(() => {
            observer.disconnect();
            resolve(null);
        }, timeout);

        const observer = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (el) {
                clearTimeout(timer);
                observer.disconnect();
                resolve(el);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    });
}

/**
 * 指定ミリ秒だけ待つdelay関数
 * @param {number} ms - 待つ時間（ミリ秒）
 * @returns {Promise<void>}
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getNowString() {
    const d = new Date();
    const pad = n => n.toString().padStart(2, '0');
    return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${pad(d.getHours())}/${pad(d.getMinutes())}/${pad(d.getSeconds())}`;
}

async function loadImgByCSE(VID){
    // const cont=document.querySelector('.search-container');
    // const ex=document.querySelector('.ex-SC');//空白
    // if (cont) cont.style.display = "none";
    // if (ex) ex.style.display = "block";
    // const textbox = document.querySelector('.gsc-input-box input');
    // const last = textbox.value;
    // textbox.value = VID;
    // const search_btn = document.querySelector('.gsc-search-button button');
    // search_btn.click();
    // await waitForD('.gsc-resultsbox-visible');
    // await delay(500);
    // await waitForD('.gsc-resultsbox-visible');
    // const all = document.querySelectorAll('.gsc-webResult .gsc-result');
    // const first = all[0];
    // if(!first) return;
    // const img = first.querySelector('.gs-image').cloneNode(true);
    // const area = document.querySelector('.imggg');
    // if (area) {
    //     area.innerHTML = ''; // 既存画像を消す場合
    //     area.appendChild(img);
    // }
    // textbox.value = last;
    // textbox.click();
    // if (cont) cont.style.display = "";
    // if (ex) ex.style.display = "none";
    // return img;
}

function loaddata() {
    loadViewHistory();
    loadFavorite();
}

function loadViewHistory() {
    try {
        const data = localStorage.getItem('yt_history');
        viewHistory = data ? JSON.parse(data) : [];
    } catch {
        viewHistory = [];
    }
}
function saveViewHistory() {
    localStorage.setItem('yt_history', JSON.stringify(viewHistory));
}

function addViewHistory(id, date) {
    viewHistory.unshift([id, date]);
    // 必要なら最大件数制限（例：9000件）
    if (viewHistory.length > 9000) viewHistory = viewHistory.slice(0, 9000);
    saveViewHistory();
}

function loadFavorite(){
    try {
        const data = localStorage.getItem('yt_favorite');
        favorite = data ? JSON.parse(data) : [];
    } catch {
        favorite = [];
    }
}

function addFavorite(id,name){
    console.log("Adding to favorite:", id);
    favorite.unshift([id,name]);
    if(favorite.length>1000) favorite = favorite.slice(0,1000);
    saveFavorite();
    
}

function addb(){
    const nameInput = document.querySelector("#youtubeViewer > div > div.youtube-left > div.select > span > input");
    const nameValue = nameInput ? nameInput.value : "";
    if(nameValue == "") {
        alert("名前を入力してください");
        return;
    }
    if(videoId == null) {
        alert("動画が選択されていません");
        return;
    }
    if(favorite.includes(nameValue)) {
        alert("既に同じ名前のお気に入りが存在します");
        return;
    }
    const idx = favorite.findIndex(item => item[0] === videoId);
    if(idx !== -1) {
        alert("既にお気に入りに登録されています\n名前：" + favorite[idx][1]);
        return;
    }
    addFavorite(videoId, nameValue);
}

function saveFavorite(){
    genelateFavorite();
    localStorage.setItem('yt_favorite',JSON.stringify(favorite));
}

function deleteFavorite(id){
    if (!confirm("本当に削除しますか？")) {
        return; // キャンセルされた場合は何もしない
    }
    console.log("Deleting from favorite:", id);
    const index = favorite.findIndex(item => item[0] === id);
    if (index !== -1) {
        favorite.splice(index, 1);
        saveFavorite();
    }
}

function editFavorite(id){
    const index = favorite.findIndex(item => item[0] === id);
    if (index === -1) {
        alert("お気に入りが見つかりません");
        return;
    }
    const newName = prompt("新しい名前を入力してください", favorite[index][1]);
    if (newName && newName.trim() !== "") {
        favorite[index][1] = newName.trim();
        saveFavorite();
    } else {
        alert("無効な名前です");
    }
}

function genelateFavorite() {
    const favView = document.querySelector('.content');
    if (!favView) return;
    favView.innerHTML = favorite.map(item =>
        `<div class="favorite-item">
            <span class="favorite-id"><button onclick="updateIframe('${item[0]}')">${item[1]}</button><br><button onclick="deleteFavorite('${item[0]}')">🗑️</button><button onclick="editFavorite('${item[0]}')">✏️</button></span>
        </div>`
    ).join('');
}



function updateIframe(VideoId) {
    loadImgByCSE(VideoId);
    console.log(Array.isArray(viewHistory)); // true なら配列
    console.log(viewHistory); // 配列の中身を確認
    console.log("updating to", videoId);
    addViewHistory(videoId, getNowString());
    videoId = VideoId;
    if (player) {
        player.loadVideoById(videoId);
        player.playVideo();
    } else {
        console.log("Creating new player for videoId:", videoId);
        player = new YT.Player('youtube-iframe', {
            videoId: videoId,
            host: 'https://www.youtube-nocookie.com',
            events: {
                'onReady': (event) => {
                    console.log('準備完了');
                    // 必要なら自動再生
                    event.target.playVideo();
                },
                'onStateChange': (event) => {
                    if (event.data === YT.PlayerState.ENDED) {
                        console.log('動画終了');
                        player.seekTo(0);      // 最初に戻す
                        
                        if (loopEnabled) {
                            console.log("Looping video");
                            player.playVideo(); // ループが有効なら再生
                        } else {
                            console.log("Not looping video");
                            player.pauseVideo();   // 停止
                        }
                    }
                }
            }
        });
        console.log("Created player:", player);
    }
}

function addYoutubeSearchResultListeners() {
    const targetNode = document.querySelector('.gsc-resultsbox-visible');
    if (!targetNode) return;

    function attachListeners() {
        const titles = document.querySelectorAll('.gsc-webResult.gsc-result');
        titles.forEach(function (title) {
            const link = title.querySelector('.gs-title a');
            if (link && !link.dataset.listenerAdded) {
                link.dataset.listenerAdded = 'true';
                link.addEventListener('click', function (event) {
                    event.preventDefault();
                    const Title = title.querySelector('.gs-title').innerText;
                    console.log("Title:", Title);
                    
                    const url = link.href;
                    const decodedUrl = decodeURIComponent(url);
                    console.log('Clicked link:', decodedUrl);
                    let videoId = null;
                    if (decodedUrl.includes('/shorts/')) {
                        // Shorts URL対応
                        console.log("Shorts URL detected:", decodedUrl);
                        const match = decodedUrl.match(/\/shorts\/([a-zA-Z0-9_-]+)/);
                        if (match) videoId = match[1];
                    } else {
                        console.log("Non-Shorts URL detected:", decodedUrl);
                        // 通常のURL対応
                        const match = decodedUrl.match(/v=([^&]+)/);
                        if (match) videoId = match[1];
                    }
                    if (videoId) {
                        document.querySelector("#youtubeViewer > div > div.youtube-left > div.select > span > input").value = Title;
                        updateIframe(videoId);
                    }
                });
            }
        });
        const images = document.querySelectorAll('.gsc-table-result');
        images.forEach(function (image) {
            const link = image.querySelector('a');
            if (link && !link.dataset.listenerAdded) {
                link.dataset.listenerAdded = 'true';
                link.addEventListener('click', function (event) {
                    event.preventDefault();
                    const url = link.href;
                    const decodedUrl = decodeURIComponent(url);
                    let videoId = null;
                    if (decodedUrl.includes('/shorts/')) {
                        // Shorts URL対応
                        console.log("Shorts URL detected:", decodedUrl);
                        const match = decodedUrl.match(/\/shorts\/([a-zA-Z0-9_-]+)/);
                        if (match) videoId = match[1];
                    } else {
                        console.log("Non-Shorts URL detected:", decodedUrl);
                        // 通常のURL対応
                        const match = decodedUrl.match(/v=([^&]+)/);
                        if (match) videoId = match[1];
                    }
                    if (videoId) {
                        updateIframe(videoId);
                    }
                });
            }
        });
    }

    // 最初にも実行
    attachListeners();

    // 検索結果が変化したときにも実行
    const observer = new MutationObserver(attachListeners);
    observer.observe(targetNode, { childList: true, subtree: true });
}

function updateHistoryView() {
    const historyView = document.getElementById('history-view');
    if (!historyView) return;
    historyView.innerHTML = viewHistory.map(item =>
        `<div id="ViewHistoryContent">${item[0]} <span style="color:#888;">${item[1]}</span></div>`
    ).join('');
}

function toggleLoop() {
    if (player) {
        const loopCheckbox = document.getElementById('loop');
        loopEnabled = loopCheckbox.checked;
    }
}

function toggleMute() {
    if (player) {
        const muteCheckbox = document.getElementById('mute');
        if (muteCheckbox.checked) {
            player.mute();
        } else {
            player.unMute();
        }
    }
}

function ManualLinkUpdate() {
    // ...existing code...
}

YTV_setup();
window.onload = function () {
    setInterval(function () {
        addYoutubeSearchResultListeners();
        updateHistoryView();
        
    }, 100);
};

if(localStorage.getItem('infoBoxHidden') === 'true'){
    document.querySelector('.info-box').style.display='none';
}

genelateFavorite();