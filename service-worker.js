// service-worker.js - نسخه ساده
const CACHE_NAME = 'inspection-merger-simple-v1';

// فایل‌های ضروری برای کش شدن
const urlsToCache = [
  './',
  './index.html',
  './exceljs.min.js'
];

// نصب Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker ساده در حال نصب...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('کش کردن فایل‌های ضروری');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker با موفقیت نصب شد');
        return self.skipWaiting();
      })
  );
});

// فعال‌سازی Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker فعال شد');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('حذف کش قدیمی:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker آماده استفاده است');
      return self.clients.claim();
    })
  );
});

// مدیریت درخواست‌ها - استراتژی Network First
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // اگر درخواست موفق بود، پاسخ را برگردان
        return response;
      })
      .catch(error => {
        console.log('خطا در دریافت از شبکه، استفاده از کش:', error);
        // اگر شبکه در دسترس نبود، از کش استفاده کن
        return caches.match(event.request);
      })
  );
});