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

window.addEventListener('load', function(){
    const targetNode = document.querySelector('.gcse-searchresults');

    const observer = new MutationObserver(function(mutationsList,observer){
        const links = document.querySelectorAll('.gs-title');

        links.forEach(function(link){
            link.addEventListener('click',function(event){
                console.log('Link clicked:', link);
                event.preventDefault();

                const url= link.getAttribute('data-ctorig')||link.href;

                console.log( 'Clicked link:', url);
            })
        })
    })

    const config ={childList: true, subtree: true};
    if(targetNode){
        observer.observe(targetNode,config)
    }
});

