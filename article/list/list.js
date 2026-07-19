// 實體 API 網址
const API_URL = 'https://raw.githubusercontent.com/yiyu-chou/my-article/refs/heads/main/api/articles.json';

// 全域儲存拉取到的文章資料
let articlesData = [];

// 大分類對應的精美色系 Token
const CATEGORY_STYLES = {
    "主題研究": {
        bg: "bg-emerald-500/10 dark:bg-emerald-400/10",
        text: "text-emerald-600 dark:text-emerald-400",
        border: "group-hover:border-emerald-500/30",
        pill: "bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
    },
    "自主學習": {
        bg: "bg-appleBlue-light/10 dark:bg-appleBlue-dark/10",
        text: "text-appleBlue-light dark:text-appleBlue-dark",
        border: "group-hover:border-appleBlue-light/30",
        pill: "bg-appleBlue-light/5 text-appleBlue-light dark:text-appleBlue-dark"
    },
    "活動參與": {
        bg: "bg-purple-500/10 dark:bg-purple-400/10",
        text: "text-purple-600 dark:text-purple-400",
        border: "group-hover:border-purple-500/30",
        pill: "bg-purple-500/5 text-purple-600 dark:text-purple-400"
    },
    "經驗分享": {
        bg: "bg-amber-500/10 dark:bg-amber-400/10",
        text: "text-amber-600 dark:text-amber-400",
        border: "group-hover:border-amber-500/30",
        pill: "bg-amber-500/5 text-amber-600 dark:text-amber-400"
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. 從實體 API 獲取並渲染文章
    fetchAndLoadArticles();

    // 2. 渲染初始文章
    renderArticles('all');

    // 3. 啟動分類篩選點擊事件
    initCategoryFilter();
});

/**
     * 從真實 API 中抓取文章資料
     */
async function fetchAndLoadArticles() {
    const postsGrid = document.getElementById('posts-grid');

    // 顯示優雅的骨架屏 (Skeleton Loading) 提示
    postsGrid.innerHTML = `
      <div class="col-span-full py-20 text-center text-muted-light dark:text-muted-dark animate-pulse">
        <i data-lucide="loader-2" class="w-10 h-10 mx-auto stroke-[1.5] animate-spin mb-4 text-appleBlue-light dark:text-appleBlue-dark"></i>
        <p class="text-sm font-medium">正在為您加載最新學術日誌與成果...</p>
      </div>
    `;
    lucide.createIcons();

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('無法取得網路資料，回應狀態異常。');
        }
        articlesData = await response.json();

        // 成功取得資料後渲染全部文章
        renderArticles('all');
    } catch (error) {
        console.error('API 獲取失敗:', error);

        // 渲染錯誤提示與重試按鈕
        postsGrid.innerHTML = `
        <div class="col-span-full py-16 text-center text-muted-light dark:text-muted-dark">
          <i data-lucide="cloud-off" class="w-12 h-12 mx-auto stroke-[1.5] text-red-500 opacity-80 mb-4 animate-bounce"></i>
          <p class="text-base font-bold mb-2">無法載入最新文章</p>
          <p class="text-xs opacity-75 mb-6">請確認您的網路連線狀態或稍後重試</p>
          <button onclick="fetchAndLoadArticles()" class="px-5 py-2 rounded-full text-xs font-semibold bg-appleBlue-light dark:bg-appleBlue-dark text-white dark:text-black hover:opacity-90 active:scale-95 transition-all">
            重新嘗試
          </button>
        </div>
      `;
        lucide.createIcons();
    }
}

/**
     * 依照篩選器渲染文章列表
     */
function renderArticles(filterCategory) {
    const postsGrid = document.getElementById('posts-grid');
    postsGrid.innerHTML = ''; // 清空原本結構

    // 篩選符合大分類（ category 中 "/" 前面文字 ）的資料
    const filteredData = articlesData.filter(item => {
        const mainCat = item.category.split('/')[0].trim();
        return filterCategory === 'all' || mainCat === filterCategory;
    });

    if (filteredData.length === 0) {
        postsGrid.innerHTML = `
        <div class="col-span-full py-16 text-center text-muted-light dark:text-muted-dark">
          <i data-lucide="folder-open" class="w-12 h-12 mx-auto stroke-[1.5] opacity-50 mb-4"></i>
          <p class="text-sm">尚無此分類之文章紀錄</p>
        </div>
      `;
        lucide.createIcons();
        return;
    }

    // 生成文章卡片 HTML
    filteredData.forEach(item => {
        const mainCat = item.category.split('/')[0].trim();
        // 取得顏色風格
        const style = CATEGORY_STYLES[mainCat] || {
            bg: "bg-gray-100 dark:bg-zinc-800",
            text: "text-muted-light dark:text-muted-dark",
            border: "group-hover:border-gray-300",
            pill: "bg-gray-100 text-muted-light"
        };
        const cardHTML = `
        <article class="group p-6 rounded-3xl bg-card-light dark:bg-card-dark border border-gray-100 dark:border-zinc-900 ${style.border} hover:shadow-xl transition-all flex flex-col justify-between reveal active">
          <div class="space-y-4">
            <!-- 分類標籤與作者 -->
            <div class="flex justify-between items-center text-xs">
              <span class="font-bold px-2.5 py-0.5 rounded-md ${style.bg} ${style.text}">${item.category}</span>
              <span class="text-muted-light dark:text-muted-dark flex items-center gap-1">
                <i data-lucide="user" class="w-3.5 h-3.5"></i> ${item.author.split(' ')[0]}
              </span>
            </div>
            
            <!-- 標題：採用雙欄大標 + 漸層延伸標 (移除 group-hover:text 變色) -->
            <h3 class="text-xl font-bold leading-snug transition-colors text-text-light dark:text-text-dark">
              <a href="../?id=${item.filepath.split("/")[1].split(".")[0]}">
                ${item.title_main}<br><span class="gradient-text">${item.title_gradient}</span>
              </a>
            </h3>
            
            <!-- 描述 -->
            <p class="text-sm text-muted-light dark:text-muted-dark leading-relaxed line-clamp-3">
              ${item.description}
            </p>
          </div>

          <!-- 底部標籤組與閱讀按鈕 -->
          <div class="pt-6 mt-6 border-t border-gray-100 dark:border-zinc-800/50 space-y-4">
            <!-- Tags 列 -->
            <div class="flex flex-wrap gap-1.5">
              ${item.tags.map(tag => `<span class="text-[11px] font-medium px-2 py-0.5 rounded-md bg-gray-100 dark:bg-zinc-800 text-muted-light dark:text-muted-dark">#${tag}</span>`).join('')}
            </div>

            <!-- 時間與連結 (閱讀字樣與圖標固定為 Apple 藍色) -->
            <div class="flex items-center justify-between text-xs text-muted-light dark:text-muted-dark pt-1">
              <span class="flex items-center gap-1"><i data-lucide="calendar" class="w-3.5 h-3.5"></i> ${item.date}</span>
              <a href="../?id=${item.filepath.split("/")[1].split(".")[0]}" class="text-appleBlue-light dark:text-appleBlue-dark font-bold hover:opacity-80 flex items-center gap-1 text-sm">
                閱讀 <i data-lucide="arrow-up-right" class="w-4 h-4"></i>
              </a>
            </div>
          </div>
        </article>
      `;
        postsGrid.insertAdjacentHTML('beforeend', cardHTML);
    });

    // 重新生成注入的圖標
    lucide.createIcons();
}

/**
 * 分類篩選按鈕點擊切換
 */
function initCategoryFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterValue = btn.getAttribute('data-filter');

            // 重設所有按鈕樣式
            filterButtons.forEach(b => {
                b.classList.remove('bg-appleBlue-light', 'text-white', 'dark:bg-appleBlue-dark', 'dark:text-black');
                b.classList.add('bg-gray-100', 'dark:bg-zinc-800', 'text-muted-light', 'dark:text-muted-dark', 'hover:bg-gray-200', 'dark:hover:bg-zinc-700', 'hover:text-text-light', 'dark:hover:text-text-dark');
            });

            // 賦予當前選取按鈕 Apple 高亮樣式
            btn.classList.add('bg-appleBlue-light', 'text-white', 'dark:bg-appleBlue-dark', 'dark:text-black');
            btn.classList.remove('bg-gray-100', 'dark:bg-zinc-800', 'text-muted-light', 'dark:text-muted-dark', 'hover:bg-gray-200', 'dark:hover:bg-zinc-700', 'hover:text-text-light', 'dark:hover:text-text-dark');

            // 動態重繪文章
            renderArticles(filterValue);
        });
    });
}