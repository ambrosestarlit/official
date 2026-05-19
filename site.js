// =========================================================
// Starlit Lab HP / 共通JS
// ---------------------------------------------------------
// ヘッダー・フッターはここで一括生成します。
// メニュー名やURLを変える場合は NAV_ITEMS を編集してください。
// =========================================================

const NAV_ITEMS = [
  { label: "TOP", href: "./index.html", page: "top" },
  { label: "ABOUT", href: "./about.html", page: "about" },
  { label: "CONTENTS", href: "./contents.html", page: "contents" },
    { label: "GALLERY", href: "./gallery.html", page: "gallery" },
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


// =========================================================
// GALLERY：画像ポップアップ
// =========================================================

function setupGalleryModal() {
  const modal = document.getElementById("galleryModal");
  const modalImage = document.getElementById("galleryModalImage");
  const modalTitle = document.getElementById("galleryModalTitle");
  const popupButtons = document.querySelectorAll(".js-gallery-popup");
  const closeButtons = document.querySelectorAll(".js-gallery-close");

  if (!modal || !modalImage || !modalTitle || popupButtons.length === 0) return;

  const openModal = (imageSrc, titleText) => {
    modalImage.src = imageSrc;
    modalImage.alt = titleText;
    modalTitle.textContent = titleText;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-modal-open");
  };

  const closeModal = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-modal-open");
    modalImage.src = "";
    modalImage.alt = "";
    modalTitle.textContent = "";
  };

  popupButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const imageSrc = button.dataset.image;
      const titleText = button.dataset.title || "";
      if (!imageSrc) return;
      openModal(imageSrc, titleText);
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
}

// =========================================================
// 画像保存抑制
// =========================================================

function setupImageProtect() {
  document.addEventListener("contextmenu", (event) => {
    if (event.target.closest(".image-protect") || event.target.closest(".gallery-modal")) {
      event.preventDefault();
    }
  });

  document.addEventListener("dragstart", (event) => {
    if (event.target.tagName === "IMG") {
      event.preventDefault();
    }
  });

  document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    const ctrlOrCmd = event.ctrlKey || event.metaKey;

    if (ctrlOrCmd && ["s", "p", "u"].includes(key)) {
      event.preventDefault();
    }

    if (ctrlOrCmd && event.shiftKey && ["i", "j", "c"].includes(key)) {
      event.preventDefault();
    }

    if (key === "f12") {
      event.preventDefault();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupGalleryModal();
  setupImageProtect();
});
