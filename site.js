// =========================================================
// Starlit Lab HP / 共通JS
// ---------------------------------------------------------
// ヘッダー・フッターはここで一括生成します。
// メニュー名やURLを変える場合は NAV_ITEMS を編集してください。
// =========================================================

const NAV_ITEMS = [
  { label: "TOP", href: "./index.html", page: "top" },
  { label: "ABOUT", href: "./about.html", page: "about" },
  { label: "LINK", href: "./link.html", page: "link" },
  { label: "TOOL", href: "./tool.html", page: "tool" }
];

function renderHeader() {
  const mount = document.getElementById("site-header");
  if (!mount) return;

  const currentPage = document.body.dataset.page || "top";
  const navHtml = NAV_ITEMS.map((item) => {
    const activeClass = item.page === currentPage ? " is-active" : "";
    return `<a class="${activeClass}" href="${item.href}">${item.label}</a>`;
  }).join("");

  mount.innerHTML = `
    <header class="site-header">
      <div class="site-header__inner">
        
        <button class="menu-button" type="button" aria-label="メニューを開閉" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
        <nav class="global-nav" aria-label="グローバルメニュー">
          ${navHtml}
        </nav>
      </div>
    </header>
  `;

  const button = mount.querySelector(".menu-button");
  const nav = mount.querySelector(".global-nav");

  button.addEventListener("click", () => {
    const opened = nav.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(opened));
  });
}

function renderFooter() {
  const mount = document.getElementById("site-footer");
  if (!mount) return;

  const navHtml = NAV_ITEMS.map((item) => {
    return `<a href="${item.href}">${item.label}</a>`;
  }).join("");

  mount.innerHTML = `
    <footer class="site-footer">
      <img class="footer-logo" src="./logo.png" alt="スターリット研究所 ロゴ">
      <nav class="footer-nav" aria-label="フッターメニュー">
        ${navHtml}
      </nav>
      <p class="copyright">© Ambrose Starlit / Starlit Lab. All Rights Reserved.</p>
    </footer>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
});
