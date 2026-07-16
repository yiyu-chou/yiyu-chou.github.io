/**
     * 打字機動態特效（Typewriter Effect）
     */
function initTypewriter() {
    const TYPEWRITER_ROLES = ["數理邏輯探索者", "業餘程式愛好者", "生活物理觀察家", "自主學習實踐者"];
    const words = TYPEWRITER_ROLES;
    const typewriterElement = document.getElementById('typewriter');
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 40; // 刪除時速度加快
        } else {
            typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 120; // 輸入時速度稍微緩慢沉穩
        }

        // 打字完成後，停頓並開始刪除
        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeSpeed = 2000; // 在句末停頓
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500; // 切換新詞前稍微停頓
        }

        setTimeout(type, typeSpeed);
    }

    // 啟動打字機制
    setTimeout(type, 1000);
}




document.addEventListener('DOMContentLoaded', () => {
    // 1. 啟動打字機效果
    initTypewriter();
});