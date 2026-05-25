// 原有表單提交功能
document.getElementById('contactForm')?.addEventListener('submit', function(event) {
    event.preventDefault();

    const formStatus = document.getElementById('formStatus');
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    formStatus.style.color = '#00f2fe';
    formStatus.innerText = '正在傳送訊息，請稍候...';

    const formData = {
        name: name,
        email: email,
        message: message
    };

    const formspreeUrl = "https://formspree.io/f/xqejevkl";

    fetch(formspreeUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (response.ok) {
            formStatus.style.color = '#00ff88';
            formStatus.innerText = '感謝您的詢問！您的訊息已成功轉寄給工作人員。';
            document.getElementById('contactForm').reset();
        } else {
            formStatus.style.color = '#ff3366';
            formStatus.innerText = '發送失敗。請確保您的 Formspree 帳號已通過信箱驗證與啟用。';
        }
    })
    .catch(error => {
        formStatus.style.color = '#ff3366';
        formStatus.innerText = '系統錯誤，請檢查您的網路連線。';
        console.error('Error:', error);
    });
});

// ********** 新增功能：拖曳新增區塊 **********
document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('dropZone');
    const draggableItems = document.querySelectorAll('.draggable-item');

    // 初始化拖曳元素
    draggableItems.forEach(item => {
        item.setAttribute('draggable', true);
        
        // 拖曳開始
        item.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', this.dataset.type);
            setTimeout(() => {
                this.style.opacity = '0.5';
            }, 0);
        });

        // 拖曳結束
        item.addEventListener('dragend', function() {
            this.style.opacity = '1';
        });
    });

    // 放置區事件
    dropZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('highlight');
    });

    dropZone.addEventListener('dragleave', function() {
        this.classList.remove('highlight');
    });

    dropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('highlight');
        
        const blockType = e.dataTransfer.getData('text/plain');
        if (blockType) {
            createNewBlock(blockType, this);
        }
    });

    // 創建新區塊
    function createNewBlock(type, container) {
        const blockId = `block-${Date.now()}`;
        const block = document.createElement('div');
        block.className = 'added-block';
        block.id = blockId;

        // 根據類型創建不同區塊
        switch(type) {
            case 'feature':
                block.innerHTML = `
                    <h4>
                        自訂功能卡片
                        <button class="delete-btn" onclick="deleteBlock('${blockId}')"><i class="fa-solid fa-trash"></i></button>
                    </h4>
                    <div class="feature-card" style="padding: 20px; margin-top: 10px;">
                        <i class="fa-solid fa-microchip card-icon" style="font-size: 30px;"></i>
                        <h3 style="font-size: 18px;">自訂標題</h3>
                        <p style="font-size: 14px; color: var(--text-muted);">請編輯您的功能描述...</p>
                    </div>
                `;
                break;

            case 'image':
                block.innerHTML = `
                    <h4>
                        可調整大小圖片
                        <button class="delete-btn" onclick="deleteBlock('${blockId}')"><i class="fa-solid fa-trash"></i></button>
                    </h4>
                    <div class="resizable-image-container" id="image-${blockId}" style="width: 300px; height: 200px; margin-top: 10px;">
                        <img src="https://picsum.photos/800/600?random=${Date.now()}" alt="可調整大小圖片" class="resizable-image">
                        <div class="resize-handle se"></div>
                    </div>
                `;
                container.appendChild(block);
                // 初始化圖片調整大小功能
                initResizable(`image-${blockId}`);
                return; // 跳過預設的appendChild

            case 'text':
                block.innerHTML = `
                    <h4>
                        自訂文字區塊
                        <button class="delete-btn" onclick="deleteBlock('${blockId}')"><i class="fa-solid fa-trash"></i></button>
                    </h4>
                    <div class="text-block" style="margin-top: 10px;">
                        <textarea placeholder="請輸入您的文字內容...">這是一個可編輯的文字區塊，支援多行輸入。</textarea>
                    </div>
                `;
                break;
        }

        container.appendChild(block);
    }

    // ********** 新增功能：拖曳調整圖片大小 **********
    function initResizable(elementId) {
        const element = document.getElementById(elementId);
        if (!element || !window.interact) return;

        // 初始化interact.js調整大小
        interact(`#${elementId}`)
            .resizable({
                edges: { right: true, bottom: true, bottomright: true },
                modifiers: [
                    interact.modifiers.restrictSize({
                        min: { width: 150, height: 100 },
                        max: { width: 800, height: 600 }
                    })
                ],
                inertia: true
            })
            .on('resizemove', function (event) {
                const target = event.target;
                // 更新寬高
                target.style.width = `${event.rect.width}px`;
                target.style.height = `${event.rect.height}px`;
            });
    }

    // ********** 新增功能：Banner更換圖片 **********
    const editBannerBtn = document.getElementById('editBannerBtn');
    const banner = document.getElementById('banner');
    
    editBannerBtn?.addEventListener('click', function() {
        // 模擬圖片選擇（實際專案可替換為檔案上傳）
        const randomImgId = Math.floor(Math.random() * 100);
        const newImgUrl = `https://picsum.photos/1920/1080?random=${randomImgId}`;
        
        banner.style.backgroundImage = `url('${newImgUrl}')`;
        alert('Banner圖片已更換！');
    });

    // 全域刪除區塊函數
    window.deleteBlock = function(blockId) {
        const block = document.getElementById(blockId);
        if (block) {
            if (confirm('確定要刪除此區塊嗎？')) {
                block.remove();
            }
        }
    };
});