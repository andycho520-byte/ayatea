document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); // 阻止網頁發送後的預設跳轉重新整理

    const formStatus = document.getElementById('formStatus');
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // 顯示發送中狀態（螢光藍）
    formStatus.style.color = '#00f2fe';
    formStatus.innerText = '正在傳送訊息，請稍候...';

    // 封裝成 JSON 格式數據
    const formData = {
        name: name,
        email: email,
        message: message
    };

    // 已成功更換為您的專屬 Formspree 網址
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
            // 成功狀態（螢光綠）
            formStatus.style.color = '#00ff88';
            formStatus.innerText = '感謝您的詢問！您的訊息已成功轉寄給工作人員。';
            document.getElementById('contactForm').reset(); // 成功後自動清空表單輸入
        } else {
            // 失敗狀態（科技紅）
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