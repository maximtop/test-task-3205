export const instagramSrcDownloader = () => {
  const imageArea = (img) => {
    return img.width * img.height;
  };

  const selectRelevantImages = (images) => {
    const minImageSizePx = 100 * 100;
    const imageSizes = images.map(img => imageArea(img));

    const averageSizeValue = imageSizes.reduce((acc, size) => {
      return acc + size;
    }, 0) / imageSizes.length;

    return images
      .filter(image => {
        return imageArea(image) >= averageSizeValue && imageArea(image) >= minImageSizePx;
      })
      .filter(image => {
        const parent = image.parentNode;
        return !parent.querySelector('video');
      });
  };

  const getSrcElements = () => {
    const header = document.querySelector('article header');

    if (!header) {
      return;
    }

    const article = header.parentNode;

    const imageSources = selectRelevantImages([...article.querySelectorAll('img')]);
    const videoSources = [...article.querySelectorAll('video')];

    return [...videoSources, ...imageSources]
  };

  const downloadImage = (src) => {
    chrome.runtime.sendMessage({
      type: 'download',
      src,
    })
  };

  const appendDownloadButton = (srcElements) => {
    if (!srcElements) {
      return;
    }

    srcElements.forEach(sourceElement => {
      const sourceElementParent = sourceElement.parentNode;
      // check if button has been already appended
      if (sourceElementParent.querySelector('.download_icon_3205')) {
        return;
      }

      sourceElementParent.insertAdjacentHTML('afterbegin', `<div class="download_icon_3205"></div>`);
      const downloadButton = sourceElementParent.querySelector('.download_icon_3205');
      downloadButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        downloadImage(sourceElement.src);
      });
    });
  };

  const main = () => {
    const observer = new MutationObserver(() => {
      appendDownloadButton(getSrcElements());
    });

    observer.observe(document, {
      childList: true,
      subtree: true,
    })
  };

  if (document.readyState === 'complete') {
    main();
  } else {
    document.onreadystatechange = function () {
      if (document.readyState === 'complete') {
        main();
      }
    };
  }
};
