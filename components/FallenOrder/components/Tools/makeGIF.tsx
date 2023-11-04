// @ts-ignore
import gifshot from 'gifshot'

function createGifFromImages(imageUrls: string[], callback: (gifDataUrl: string | null) => void) {
  const options = {
    images: imageUrls,
    interval: 1,
    numFrames: imageUrls.length,
    gifWidth: 400,
    gifHeight: 400,
    frameDuration: 0.1,
    sampleInterval: 1,
  };

  gifshot.createGIF(options, (obj: gifshot.Result) => {
    if (!obj.error) {
      callback(obj.image)
    } else {
      callback(null)
    }
  })
}

export default createGifFromImages
