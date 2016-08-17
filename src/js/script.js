if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
}
else if ('applicationCache' in window) {
    var iframe = document.createElement('iframe');
    iframe.src = './appcache.html';
    iframe.style.height = '1px';
    iframe.style.width = '1px';

    document.body.appendChild(iframe);
}
else if (navigator.userAgent.indexOf('MSIE') !== -1) {
    var downloadBox = document.createElement('div');
    downloadBox.id = 'downloadBox';
    downloadBox.innerHTML = 'Pst... Want Hush Lil Baby offline? Click <a title="Download the Hush Lil Baby PWA to use offline" href="./HushLilBaby.zip">here!</a>';
    downloadBox.innerHTML += '<button onclick="this.parentNode.remove()" title="Close Popup">X</button';

    document.body.appendChild(downloadBox);
}
