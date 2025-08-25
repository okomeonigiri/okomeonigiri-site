function setup(){
    const main = document.querySelector("main");
    main.style.maxWidth = "100%";
    main.style.width = "100%";
    main.style.margin = "0";
    main.style.padding = "0";
    const iframe = document.querySelector("#youtube-iframe");
    iframe.src="https://www.youtube-nocookie.com/embed/VIDEO_ID";
}
setup();

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
        console.log('Found titles:', titles, titles.length);
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

window.addEventListener('load', addYoutubeSearchResultListeners);
addYoutubeSearchResultListeners();

