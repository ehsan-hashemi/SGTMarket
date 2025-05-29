if ('Notification' in window) {
    const lastNotificationTime = localStorage.getItem('lastNotificationTime');
    const now = Date.now();
    const notificationInterval = 24 * 60 * 60 * 1000; // هر ۲۴ ساعت

    if (!lastNotificationTime || now - lastNotificationTime > notificationInterval) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                navigator.serviceWorker.ready.then(registration => {
                    registration.showNotification('اپلیکیشن SGT Market', {
                        body: 'نسخه جدید اپلیکیشن SGT Market رسید. حتما نصبش کن...',
                        icon: 'icon.png',
                        badge: 'badge.png',
                        vibrate: [200, 100, 200], 
                        tag: 'notif-tag',
                        actions: [
                            { action: 'open', title: 'دانلود', },
                            { action: 'close', title: 'بستن', }
                        ]
                    });
                    localStorage.setItem('lastNotificationTime', now); // ذخیره زمان ارسال
                });
            }
        });
    }
}
