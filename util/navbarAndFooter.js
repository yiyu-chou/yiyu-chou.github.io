/**
     * 封裝全站共用導覽列與頁尾元件（模組化 JavaScript 動態注入）
     */

function initCommonComponents() {
  const isDarkMode = localStorage.getItem('theme') === 'dark' ||
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (isDarkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  // --- 導覽列組件結構 ---
  const navbarHTML = `
        <nav class="fixed top-0 left-0 right-0 z-50 bg-bg-light/80 dark:bg-bg-dark/80 backdrop-blur-md border-b border-gray-100 dark:border-zinc-900 transition-all duration-300">
          <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <!-- Logo -->
            <a href="/" class="text-lg font-bold tracking-tight hover:opacity-80 flex items-center gap-2">
              <span class="w-6 h-6 rounded-lg bg-appleBlue-light dark:bg-appleBlue-dark flex items-center justify-center text-white text-xs font-black">Yu</span>
              YiYu Chou
            </a>

            <!-- 桌面版選單 -->
            <div class="hidden md:flex items-center gap-8 text-sm font-medium">
              <a href="/" class="nav-link hover:text-appleBlue-light dark:hover:text-appleBlue-dark py-2 transition-colors">首頁</a>
              <a href="/about" class="nav-link hover:text-appleBlue-light dark:hover:text-appleBlue-dark py-2 transition-colors">關於我</a>
              <a href="/experience" class="nav-link hover:text-appleBlue-light dark:hover:text-appleBlue-dark py-2 transition-colors">活動經歷</a>
              <a href="/portfolio" class="nav-link hover:text-appleBlue-light dark:hover:text-appleBlue-dark py-2 transition-colors">探索成果</a>
              <a href="/article/list" class="nav-link hover:text-appleBlue-light dark:hover:text-appleBlue-dark py-2 transition-colors">文章列表</a>
            </div>

            <!-- 控制鈕區 (深色模式 + 手機選單開關) -->
            <div class="flex items-center gap-4">
              <!-- 深淺色切換按鈕 -->
              <button id="theme-toggle" class="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark focus:outline-none transition-colors" aria-label="Toggle Theme">
                <i data-lucide="sun" class="w-5 h-5 hidden dark:block"></i>
                <i data-lucide="moon" class="w-5 h-5 block dark:hidden"></i>
              </button>

              <!-- 行動裝置漢堡選單開關 -->
              <button id="mobile-menu-btn" class="md:hidden p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-muted-light dark:text-muted-dark hover:text-text-light dark:hover:text-text-dark focus:outline-none transition-colors">
                <i data-lucide="menu" class="w-5 h-5 block" id="menu-icon-open"></i>
                <i data-lucide="x" class="w-5 h-5 hidden" id="menu-icon-close"></i>
              </button>
            </div>
          </div>

          <!-- 行動版下拉式選單 -->
          <div id="mobile-menu" class="hidden md:hidden bg-bg-light/95 dark:bg-bg-dark/95 backdrop-blur-md border-b border-gray-100 dark:border-zinc-900">
            <div class="flex flex-col px-6 py-4 space-y-4 text-base font-semibold">
              <a href="/" class="mobile-nav-link py-2 border-b border-gray-100 dark:border-zinc-900">首頁</a>
              <a href="/about" class="mobile-nav-link py-2 border-b border-gray-100 dark:border-zinc-900">關於我</a>
              <a href="/experience" class="mobile-nav-link py-2 border-b border-gray-100 dark:border-zinc-900">活動經歷</a>
              <a href="/portfolio" class="mobile-nav-link py-2">探索成果</a>
              <a href="/article/list" class="mobile-nav-link py-2">文章列表</a>
            </div>
          </div>
        </nav>
      `;

  // --- 頁尾組件結構 ---
  const footerHTML = `
        <footer class="border-t border-gray-100 dark:border-zinc-900 bg-bg-light dark:bg-bg-dark py-12 px-6">
          <div class="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="text-center md:text-left space-y-2">
              <p class="font-bold text-text-light dark:text-text-dark flex items-center justify-center md:justify-start gap-2">
                <span class="w-5.5 h-5.5 rounded-md bg-appleBlue-light dark:bg-appleBlue-dark flex items-center justify-center text-white text-[10px] font-black">Yu</span>
                YiYu Chou
              </p>
              <p class="text-xs text-muted-light dark:text-muted-dark">追求細節與流暢互動的前端探索之旅</p>
            </div>
            
            <div class="flex flex-wrap justify-center gap-6 text-sm text-muted-light dark:text-muted-dark">
              <a href="/" class="hover:text-appleBlue-light dark:hover:text-appleBlue-dark transition-colors">回首頁</a>
              <a href="/about" class="hover:text-appleBlue-light dark:hover:text-appleBlue-dark transition-colors">關於我</a>
              <a href="/experience" class="hover:text-appleBlue-light dark:hover:text-appleBlue-dark transition-colors">活動經歷</a>
              <a href="/portfolio" class="hover:text-appleBlue-light dark:hover:text-appleBlue-dark transition-colors">探索成果</a>
              <a href="/article/list" class="hover:text-appleBlue-light dark:hover:text-appleBlue-dark transition-colors">文章列表</a>
            </div>

            <p class="text-xs text-muted-light dark:text-muted-dark">&copy; ${new Date().getFullYear()} YiYu Chou. All rights reserved.</p>
          </div>
        </footer>
      `;

  // 注入元件到 HTML
  document.getElementById('navbar-portal').innerHTML = navbarHTML;
  document.getElementById('footer-portal').innerHTML = footerHTML;

  // 重新生成注入的圖標
  lucide.createIcons();

  // 綁定深淺色主題切換邏輯
  const themeToggleBtn = document.getElementById('theme-toggle');
  themeToggleBtn.addEventListener('click', () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  });

  // 綁定行動版選單開關
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const openIcon = document.getElementById('menu-icon-open');
  const closeIcon = document.getElementById('menu-icon-close');

  mobileMenuBtn.addEventListener('click', () => {
    const isHidden = mobileMenu.classList.contains('hidden');
    if (isHidden) {
      mobileMenu.classList.remove('hidden');
      openIcon.classList.add('hidden');
      closeIcon.classList.remove('hidden');
    } else {
      mobileMenu.classList.add('hidden');
      openIcon.classList.remove('hidden');
      closeIcon.classList.add('hidden');
    }
  });

  // 點擊行動版連結後自動關閉選單
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      openIcon.classList.remove('hidden');
      closeIcon.classList.add('hidden');
    });
  });

  // 當前頁面高亮（Active Link Highlight）與 Intersection Observer 聯動
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  const navObserverOptions = {
    root: null,
    rootMargin: '-50% 0px -50% 0px', // 當區塊佔據視窗中心時觸發
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        updateActiveLink(id);
      }
    });
  }, navObserverOptions);

  sections.forEach(section => navObserver.observe(section));

  function updateActiveLink(activeId) {
    navLinks.forEach(link => {
      const href = link.getAttribute('href').substring(1);
      if (href === activeId) {
        link.classList.add('text-appleBlue-light', 'dark:text-appleBlue-dark', 'font-semibold');
        link.classList.remove('text-muted-light', 'dark:text-muted-dark');
      } else {
        link.classList.remove('text-appleBlue-light', 'dark:text-appleBlue-dark', 'font-semibold');
        link.classList.add('text-muted-light', 'dark:text-muted-dark');
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. 初始化導覽列與頁尾元件 (組件化處理)
  initCommonComponents();
});