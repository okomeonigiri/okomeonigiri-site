
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // スムーズにスクロール
    });
}

let isShowed = false; // 一回でも表示されたか
let isSTB = 0; // スイッチの表示状態を管理

function showScrollTopBtn(){
    isSTB = 1; // スイッチが表示されている状態にする
    const scrollTopBtn = document.querySelector('.scroll-top-btn');
    if (scrollTopBtn) {
        if(!isShowed){
        isShowed = 1;
        scrollTopBtn.classList.remove('scroll-top-btn-hide-first');
        }
        else {
        scrollTopBtn.classList.remove('scroll-top-btn-hide');
    }
        scrollTopBtn.classList.add('scroll-top-btn-visible');
    }
}

function showSTBswitch(){
    const switchSTB = document.querySelector('.switch-STB');
    if (switchSTB) {
        if(!isShowed){
        isShowed = 1;
        switchSTB.classList.add('switch-STB-180');
        switchSTB.classList.remove('switch-STB-hide-first');
        }
        else {
        switchSTB.classList.remove('switch-STB-hide');
    }
        if(!switchSTB.classList.contains('switch-STB-transition')){
            switchSTB.classList.add('switch-STB-transition');
        }
        switchSTB.classList.add('switch-STB-show');
    }
}


function hideScrollTopBtn(){
    isSTB = 0; // スイッチが非表示の状態にする
    const scrollTopBtn = document.querySelector('.scroll-top-btn');
    if (scrollTopBtn) {
        scrollTopBtn.classList.remove('scroll-top-btn-visible');
        scrollTopBtn.classList.add('scroll-top-btn-hide');
    }
}
function hideSTBswitch(){
    const switchSTB = document.querySelector('.switch-STB');
    if (switchSTB) {
        if(!switchSTB.classList.contains('switch-STB-transition')){
            switchSTB.classList.add('switch-STB-transition');
        }
        switchSTB.classList.remove('switch-STB-show');
        switchSTB.classList.add('switch-STB-hide');
        if(switchSTB.classList.contains('switch-STB-180')) {
            switchSTB.classList.remove('switch-STB-180');
            switchSTB.classList.add('switch-STB-0');
        }
    }
}

function switchScrollTopBtn() {
    const scrollTopBtn = document.querySelector('.scroll-top-btn');
    const switchSTB = document.querySelector('.switch-STB');
    // スイッチ時はtransitionクラスを外して即座に回転
    switchSTB.classList.remove('switch-STB-transition');

    if (isSTB) {
        hideScrollTopBtn();
        switchSTB180();
    } else {
        showScrollTopBtn();
        switchSTB0();
    }

    // 表示・非表示時はtransitionクラスを付与してスムーズに回転
    setTimeout(() => {
        switchSTB.classList.add('switch-STB-transition');
    }, 10);
}

function switchSTB180() {
    const switchSTB = document.querySelector('.switch-STB');
    if (switchSTB) {
        if(switchSTB.classList.contains('switch-STB-0')) {
            switchSTB.classList.remove('switch-STB-0');
        }
        switchSTB.classList.add('switch-STB-180');
    }
}
function switchSTB0() {
    const switchSTB = document.querySelector('.switch-STB');
    if (switchSTB) {
        if(switchSTB.classList.contains('switch-STB-180')) {
            switchSTB.classList.remove('switch-STB-180');
        }
        switchSTB.classList.add('switch-STB-0');
    }
}

let hasShownInSession = false;

window.addEventListener('scroll', function() {
    if (window.scrollY > 100) {
        if (!hasShownInSession) {
            showScrollTopBtn();
            showSTBswitch();
            hasShownInSession = true;
        }
    } else {
        hideScrollTopBtn();
        hideSTBswitch();
        hasShownInSession = false;
    }
});