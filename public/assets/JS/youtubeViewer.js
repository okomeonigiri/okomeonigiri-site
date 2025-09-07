function YTV_setup(){
    // const main = document.querySelector("main");
    // main.style.maxWidth = "100%";
    // main.style.width = "100%";
    // main.style.margin = "0";
    // main.style.padding = "0";
    // const iframe = document.querySelector("#youtube-iframe");
    // iframe.src="";
}

let player;
let videoId = null;
let viewHistory = null;
function getNowString() {
    const d = new Date();
    const pad = n => n.toString().padStart(2, '0');
    return `${d.getFullYear()}/${pad(d.getMonth()+1)}/${pad(d.getDate())}/${pad(d.getHours())}/${pad(d.getMinutes())}/${pad(d.getSeconds())}`;
}

function updateIframe(videoId) {
//     console.log(Array.isArray(viewHistory)); // true なら配列
// console.log(viewHistory); // 配列の中身を確認
    console.log("updating to", videoId);
    addViewHistory(videoId, getNowString());
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
                        player.pauseVideo();   // 停止
                    }
                }
            }
        });
        console.log("Created player:", player);
    }
}

function loadViewHistory(){
    // try {
    //     const data = localStorage.getItem('yt_history');
    //     viewHistory = data ? JSON.parse(data) : [];
    // } catch {
    //     viewHistory= [];
    // }
}
function saveViewHistory(){
    // localStorage.setItem('yt_history', JSON.stringify(viewHistory));
}
function addViewHistory(id, date){
    // viewHistory.unshift([id, date]);
    // // 必要なら最大件数制限（例：9000件）
    // if (viewHistory.length > 9000) viewHistory = viewHistory.slice(0, 15000);
    // saveViewHistory();
}

function addYoutubeSearchResultListeners() {
    const targetNode = document.querySelector('.gsc-resultsbox-visible');
    if (!targetNode) return;

    function attachListeners() {
        const titles = document.querySelectorAll('.gsc-webResult.gsc-result');
        //console.log('Found titles:', titles, titles.length);
        titles.forEach(function(title) {
            const link = title.querySelector('.gs-title a');
            if (link && !link.dataset.listenerAdded) {
                link.dataset.listenerAdded = 'true';
                link.addEventListener('click', function(event) {
                    event.preventDefault();
                    const url = link.href;
                    const decodedUrl = decodeURIComponent(url);
                    console.log('Clicked link:', decodedUrl.match(/v=([^&]+)/));
                    const match = decodedUrl.match(/v=([^&]+)/);
                    if (match) {
                        updateIframe(match[1]);
                    }
                });
            }
        });
        const images = document.querySelectorAll('.gsc-table-result');
        //console.log('Found titles:', titles, titles.length);
        images.forEach(function(image) {
            const link = image.querySelector('a');
            if (link && !link.dataset.listenerAdded) {
                link.dataset.listenerAdded = 'true';
                link.addEventListener('click', function(event) {
                    event.preventDefault();
                    const url = link.href;
                    const decodedUrl = decodeURIComponent(url);
                    console.log('Clicked link:', decodedUrl.match(/v=([^&]+)/));
                    const match = decodedUrl.match(/v=([^&]+)/);
                    if (match) {
                        videoId = match[1];
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


YTV_setup();
addYoutubeSearchResultListeners();
loadViewHistory();
window.onload = function() {
    setInterval(function() {
        addYoutubeSearchResultListeners();
    }, 100);
};