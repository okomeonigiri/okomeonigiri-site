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