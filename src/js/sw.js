'use strict';

var CACHE_VERSION = '__CACHE_VERSION__';
var CURRENT_CACHES = {
    prefetch: 'prefetch-cache-v' + CACHE_VERSION
};

self.addEventListener('install', function ( event ) {

    var urlsToPrefetch = [
        '/',
        '/index.html',
        '/js/TweenMax.min.js',
        '/js/modernizr-custom.js',
        '/js/audio.js',
        '/js/animate.js',
        '/js/script.js',
        '/audio/music.mp3'
    ];

    event.waitUntil(
            caches.open(CURRENT_CACHES.prefetch).then(function (cache) {
                return cache.addAll(urlsToPrefetch.map(function (urlToPrefetch) {
                    return new Request(urlToPrefetch, { mode: 'no-cors' });
                }));
            }).catch(function (error) {
                console.error('Pre-fetching failed:');
                console.log(error);
            })
            );
});

self.addEventListener('activate', function (event) {
    var expectedCacheNames = Object.keys(CURRENT_CACHES).map(function (key) {
        return CURRENT_CACHES[key];
    });

    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (expectedCacheNames.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});


self.addEventListener('fetch', function (event) {

    event.respondWith(
        caches.match(event.request).then(function (response) {
            if (response) {
                return response;
            }

            return fetch(event.request).then(function (refretchResponse) {
                return refretchResponse;
            }).catch(function (error) {
                console.error('Fetching failed:', error);

                throw error;
            });
        })
    );
});

