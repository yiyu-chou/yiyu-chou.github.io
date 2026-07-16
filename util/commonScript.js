/**
 * 滑動觸發動態（Scroll Reveal）
 */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    const revealObserverOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px', // 稍低於視窗邊緣時就觸發
        threshold: 0.05
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // 觸發後即停止監聽，達到單次優雅加載的效果
                observer.unobserve(entry.target);
            }
        });
    }, revealObserverOptions);

    reveals.forEach(el => revealObserver.observe(el));
}
document.addEventListener('DOMContentLoaded', () => {
    // 1. 啟動滾動顯現 (Scroll Reveal)
    initScrollReveal();

    // 2. 初始化 Lucide 圖標
    lucide.createIcons();
});