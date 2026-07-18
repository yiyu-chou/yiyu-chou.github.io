document.addEventListener('DOMContentLoaded', () => {
    // 異步 Fetch 讀取並渲染 Markdown
    loadAndRenderMarkdown('article.md');
});

/**
 * 讀取並渲染 Markdown 檔案
 */
async function loadAndRenderMarkdown(filePath) {
    const contentContainer = document.getElementById('markdown-content');

    try {
        // 取得文章id
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const articleID = urlParams.get('id');
        // 發送異步請求獲取 Markdown 本文
        const response = await fetch("https://raw.githubusercontent.com/yiyu-chou/my-article/refs/heads/main/list/" + articleID + ".md");
        if (!response.ok) {
            throw new Error(`無法讀取 Markdown 檔案：${response.status}`);
        }
        const markdownRawText = await response.text();

        // 1. 解析 YAML Front Matter
        let title_main = "";
        let title_gradient = "";
        let description = "";
        let category = "";
        let tags = [];
        let date = [];
        let author = "";
        // 用正規表達式去匹配最上方的 --- ... ---
        const frontMatterMatch = markdownRawText.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
        let markdownBodyText = "";

        if (frontMatterMatch) {
            const yamlText = frontMatterMatch[1];
            // 把前導資料切開並讀取
            yamlText.split('\n').forEach(line => {
                const [key, ...valueParts] = line.split(':');
                if (!key) return;
                const value = valueParts.join(':').trim();

                if (key.trim() === 'title_main') title_main = value.replace(/^['"]|['"]$/g, '');
                if (key.trim() === 'title_gradient') title_gradient = value.replace(/^['"]|['"]$/g, '');
                if (key.trim() === 'description') description = value.replace(/^['"]|['"]$/g, '');
                if (key.trim() === 'category') category = value.replace(/^['"]|['"]$/g, '');
                if (key.trim() === 'tags') {
                    // 清除括號，並用逗號切開標籤
                    tags = value.replace(/[\[\]]/g, '').split(',').map(t => t.trim());
                }
                if (key.trim() === 'date') date = value.replace(/^['"]|['"]$/g, '').split("-");
                if (key.trim() === 'author') author = value.replace(/^['"]|['"]$/g, '');
            });
            // 移除掉已被解析的 YAML 部分，剩下純 Markdown
            markdownBodyText = markdownRawText.replace(frontMatterMatch[0], '');
        }
        // 2. 動態在文章最上方插入精美的標頭、副標題與黑白簡約膠囊標籤與網頁標題
        if (title_main) {
            document.querySelector("#article-main-title").childNodes[0].textContent = title_main;
        }
        if (title_gradient) {
            document.querySelector("#article-gradient-title").textContent = title_gradient;
        }
        if (description) {
            document.querySelector("#article-description").textContent = description;
        }
        if (category) {
            document.querySelector("#article-category").textContent = category;
        }
        if (date) {
            document.querySelector("#article-date-year").textContent = date[0];
            document.querySelector("#article-date-month").textContent = date[1];
            document.querySelector("#article-date-day").textContent = date[2];
        }
        if (author) {
            document.querySelector("#article-author").textContent = author;
        }
        document.title = title_main + title_gradient + " | 文章閱讀"

        // 3. 配置 Marked 並渲染
        marked.setOptions({ gfm: true, breaks: true, mangle: false, headerIds: false });
        const htmlContent = marked.parse(markdownBodyText);

        // 將標頭與文章內容一起塞入
        contentContainer.innerHTML = htmlContent;

        // 4. 後續其他初始化元件
        enhanceImagesWithCaptions()
        enhanceCodeBlocks();
        generateDynamicTOC();
        initTOCScrollHighlight();
        initScrollReveal();
        lucide.createIcons();

    } catch (error) {
        console.error(error);
        document.querySelector("#main-body").innerHTML = `
        <div class="p-8 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-800 dark:text-red-200">
          <h4 class="font-bold text-lg mb-2 flex items-center gap-2"><i data-lucide="alert-circle" class="w-5 h-5"></i> 載入 Markdown 失敗</h4>
          <p class="text-sm">請確認 <strong>${filePath}</strong> 檔案是否存在於您的 GitHub Pages 或伺服器相同路徑中。</p>
          <p class="text-xs text-muted-light/70 mt-2">錯誤資訊：${error.message}</p>
        </div>
      `;
        lucide.createIcons();
    }
}
/**
 * 自動偵測 Markdown 圖片並將 alt 轉換為 figcaption 的核心引擎
 */
function enhanceImagesWithCaptions() {
    const images = document.querySelectorAll('#markdown-content img');
    images.forEach(img => {
        const altText = img.getAttribute('alt');
        // 如果有填寫 Alt 文字，自動進行封裝轉換
        if (altText && altText.trim() !== '') {
            // 確保未被雙重封裝
            if (img.parentElement.tagName.toLowerCase() !== 'figure') {
                const figure = document.createElement('figure');

                const figcaption = document.createElement('figcaption');
                figcaption.textContent = altText;

                // 替換原本的結構
                img.parentNode.insertBefore(figure, img);
                figure.appendChild(img);
                figure.appendChild(figcaption);
            }
        }
    });
}
/**
 * 增強 Marked.js 輸出的 pre code 結構，包覆高質感控制列與一鍵複製按鈕
 */
function enhanceCodeBlocks() {
    const preElements = document.querySelectorAll('#markdown-content pre');

    preElements.forEach((pre, index) => {
        // 建立外層包裝容器
        const wrapper = document.createElement('div');
        wrapper.className = 'relative group rounded-2xl overflow-hidden border border-gray-200 dark:border-zinc-800 bg-zinc-900 text-zinc-100 text-sm font-mono my-6';

        // 取得程式碼語言
        const codeElem = pre.querySelector('code');
        let language = 'code';
        if (codeElem) {
            const classList = Array.from(codeElem.classList);
            const langClass = classList.find(cls => cls.startsWith('language-'));
            if (langClass) {
                language = langClass.replace('language-', '');
            }
        }

        // 建立自訂控制列
        const header = document.createElement('div');
        header.className = 'bg-zinc-950 px-5 py-3 flex justify-between items-center text-xs text-zinc-400 select-none';
        header.innerHTML = `
        <span>source_code.${language}</span>
        <button class="copy-btn hover:text-zinc-100 transition-colors flex items-center gap-1">
          <i data-lucide="copy" class="w-3.5 h-3.5"></i> <span>複製代碼</span>
        </button>
      `;

        // 設定複製事件
        const copyBtn = header.querySelector('.copy-btn');
        copyBtn.addEventListener('click', () => {
            const text = codeElem ? codeElem.textContent : '';
            copyToClipboard(text, copyBtn);
        });

        // 重新組裝 DOM
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(header);
        wrapper.appendChild(pre);

        // 移除 pre 預設的外距以便良好貼合容器
        pre.style.margin = '0';
        pre.className = 'p-5 overflow-x-auto';
    });
}

/**
 * 動態獲取文章內的所有 H2 標題，於左側組裝 TOC 目錄
 */
function generateDynamicTOC() {
    const markdownContainer = document.getElementById('markdown-content');
    const headings = markdownContainer.querySelectorAll('h2');
    const tocContainer = document.getElementById('dynamic-toc');

    if (headings.length === 0) {
        tocContainer.innerHTML = `<span class="text-xs text-muted-light/60 pl-3">本篇無章節標題</span>`;
        return;
    }

    tocContainer.innerHTML = ''; // 清空加載中文字

    headings.forEach((heading, index) => {
        // 為標題元素賦予唯一的 ID
        const headingId = `section-${index + 1}`;
        heading.setAttribute('id', headingId);

        // 建立 TOC 錨點
        const link = document.createElement('a');
        link.setAttribute('href', `#${headingId}`);
        link.className = 'toc-link py-1.5 px-3 border-l-2 border-transparent hover:text-text-light dark:hover:text-text-dark transition-all block text-xs md:text-sm';
        link.textContent = heading.textContent;

        tocContainer.appendChild(link);
    });
}

/**
 * 複製到剪貼簿功能（兼容 iframe 沙盒機制）
 */
function copyToClipboard(text, button) {
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = text;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    try {
        document.execCommand('copy');
        const textSpan = button.querySelector('span');
        textSpan.textContent = "已複製！";
        button.classList.add('text-green-400');
        setTimeout(() => {
            textSpan.textContent = "複製代碼";
            button.classList.remove('text-green-400');
        }, 2000);
    } catch (err) {
        console.error('無法複製代碼', err);
    }
    document.body.removeChild(tempTextArea);
}

/**
 * 目錄滾動高亮聯動功能
 */
function initTOCScrollHighlight() {
    const sections = document.querySelectorAll('#markdown-content h2');
    const tocLinks = document.querySelectorAll('.toc-link');

    const observerOptions = {
        root: null,
        rootMargin: '-10% 0px -70% 0px', // 鎖定視窗前側閱讀範圍
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                tocLinks.forEach(link => {
                    const href = link.getAttribute('href').substring(1);
                    if (href === activeId) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}