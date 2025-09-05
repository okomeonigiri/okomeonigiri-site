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

// function onYouTubeIframeAPIReady() {
//   // ここではまだ何もしない（動画選択時に作る）
// }

// function updateIframe(videoId) {
//     console.log("updating");
//   if (player) {
//     console.log("aleady player");
//     player.loadVideoById(videoId); // すでにあるプレイヤーで読み込み
//     player.playVideo()
//   } else {
//     console.log("making");
//     player = new YT.Player('youtube-iframe', {
//       videoId: videoId,
//       host: 'https://www.youtube-nocookie.com', // nocookie 対応
//       events: {
//         'onReady': (event) => {
//           console.log('準備完了');
//         },
//         'onStateChange': (event) => {
//           if (event.data === YT.PlayerState.ENDED) {
//             console.log('動画終了');
//           }
//         }
//       }
//     });
//     console.log("maked",player);
//   }
// }

function updateIframe(videoId) {
    const iframe = document.querySelector("#youtube-iframe");
    if (iframe) {
        iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}`;
    }
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
    }

    // 最初にも実行
    attachListeners();

    // 検索結果が変化したときにも実行
    const observer = new MutationObserver(attachListeners);
    observer.observe(targetNode, { childList: true, subtree: true });
}


YTV_setup();
addYoutubeSearchResultListeners();

window.addEventListener('load', addYoutubeSearchResultListeners);
window.onload = function() {
    setInterval(function() {
        addYoutubeSearchResultListeners();
    }, 100);
};
// function checkVolume() {
//   if (player && typeof player.getVolume === 'function') {
//     console.log('音量:', player.getVolume());
//   } else {
//     console.log('player未作成またはgetVolume非対応');
//   }
// }

// setInterval(checkVolume, 2000); // 2秒ごとに確認