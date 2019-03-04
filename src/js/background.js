import '../img/icon-128.png'
import '../img/icon-34.png'

const downloadImage = (src) => {
  chrome.downloads.download({
    url: src,
  })
};

chrome.runtime.onMessage.addListener((message) => {
  const { type } = message;
  switch (type) {
    case 'download':
      const { src } = message;
      downloadImage(src);
  }
});
