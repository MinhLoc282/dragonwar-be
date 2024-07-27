const { default: axios } = require("axios");
let texturePacker = require("free-tex-packer-core");
let fs = require('fs');
const Jimp = require('jimp')
// const ImageAnchor = require('./image_config').IMAGE_ANCHOR
const IMG_PART_ANCHOR = {
  TOP_LEFT: 1, // 'TOP_LEFT',
  TOP_RIGHT: 2, //'TOP_RIGHT',
  BOTTOM_LEFT: 3, //'BOTTOM_LEFT',
  BOTTOM_RIGHT: 4, // 'BOTTOM_RIGHT',
  CENTER: 5 //'CENTER',
}


/**
 * Images:
 *
 * [{
  images.push({ path: "body.png", contents: fs.readFileSync("./DRAGON_PART/body.png") });
}]
**/
// let options = {
//   textureName: "SKELETON_MOC",
//   width: 1024,
//   height: 1024,
//   fixedSize: false,
//   padding: 2,
//   allowRotation: false,
//   detectIdentical: true,
//   allowTrim: true,
//   exporter: "Pixi",
//   removeFileExtension: true,
//   prependFolderName: true
// };




function convertJSON2Atlas(buffJSONAtlas) {
  if (!buffJSONAtlas) {
    throw Error("JSON atlas is not valid");
  }
  const info = JSON.parse(buffJSONAtlas.toString());
  const frames = info.frames;
  const strtring = [''];
  const metadata = info.meta;
  const size = metadata.size;
  strtring.push(metadata.image)
  strtring.push(`size: ${size.w},${size.h}`)
  strtring.push(`format: ${metadata.format}`)
  strtring.push('filter: Linear,Linear')
  strtring.push('repeat: none')

  Object.keys(frames).forEach(key => {
    const a = frames[key];
    strtring.push(key)
    strtring.push(`  rotate: ${a.rotated ? true : false}`)
    strtring.push(`  xy: ${a.frame.x}, ${a.frame.y}`)
    strtring.push(`  size: ${a.frame.w}, ${a.frame.h}`)
    strtring.push(`  orig: ${a.frame.w}, ${a.frame.h}`)
    strtring.push(`  offset: 0, 0`)
    strtring.push(`  index: -1`)
  })
  const atlas = strtring.join('\n');
  return atlas
}

const packImages = (images, options, filePath, cb) => {
  if (!images || !options) {
    throw new Error("Images sources and options config is requied")
  }
  texturePacker(images, options, (files, error) => {
    if (error) {
      console.error('Packaging failed', error);
    } else {
      const promiseFiles = files.map(file => {
        return new Promise((resolve, reject) => {
          if (file.name.indexOf('.json') != -1) {
            const atlas = convertJSON2Atlas(file.buffer);
            fs.writeFile(filePath + options.textureName + '.atlas', atlas, err => {
              if (!err) {
                resolve(filePath + options.textureName + '.atlas')
              } else {
                reject(err);
              }
            });
          } else {
            fs.writeFile(filePath + file.name, file.buffer, err => {
              if (!err) {
                resolve(filePath + file.name)
              } else {
                reject(err);
              }
            })
          }
        })
      })
      Promise.all(promiseFiles).then(files => {
        if (cb) {
          cb(files)
        }
      }).catch(ex => {
        cb(null)
      })
    }
  });
}

const packImagesAsync = (images, options, savePath) => {
  return new Promise((resolve, reject) => {
    packImages(images, options, savePath, files => {
      if (files != null) {
        resolve(files)
      } else {
        reject('Error write files')
      }
    })
  })
}

const createEmptyImage = (width, height) => {
  return new Promise((resolve, reject) => {
    new Jimp(width, height, 0x0, function (err, image) {
      if (err) {
        return reject(err)
      }
      resolve(image)
    });
  })
}
async function loadImagesToBuffer(imageSrc) {
  const imageWithBuffers = [];
  for (const imgPart in imageSrc) {

    const { src: imgURL } = imageSrc[imgPart]
    try {

      const x = imageSrc[imgPart].x
      const y = imageSrc[imgPart].y
      if (imgURL.indexOf('http://') != -1 || imgURL.indexOf('https://') != -1) {
        //load from host
        const { data } = await axios.get(imgURL, { responseType: 'arraybuffer' })
        imageWithBuffers.push(
          { path: imgPart + '.png', contents: data, ...imageSrc[imgPart], x }
        )
      } else {
        const imgContent = fs.readFileSync(imgURL)
        imageWithBuffers.push({ path: imgPart + '.png', contents: imgContent, ...imageSrc[imgPart], x, y });
      }
    } catch (ex) {
      console.error("ERROR LOAD IMAGE:", ex)
    }
  }
  return imageWithBuffers;
}

const packgeImageSample = async (imageConfig, outputName) => {
  let options = {
    textureName: "DRAGON",
    width: 2048,
    height: 1024,
    fixedSize: false,
    padding: 2,
    allowRotation: false,
    detectIdentical: true,
    allowTrim: true,
    exporter: "Pixi",
    removeFileExtension: true,
    prependFolderName: true
  };


  const imgs = await loadImagesToBuffer(imageConfig.PARTS)
  const imgPack = imgs.map(it => {
    return {
      path: it.path,
      contents: it.contents
    }
  })
  imgs.sort((a, b) => {
    return a.zIndex - b.zIndex
  })
  // packImages(imgPack, options, './', files => {
  //   console.log("Files:", files)
  // })
  const imageWidth = imageConfig.imageInfo.cover.width
  const imageHeight = imageConfig.imageInfo.cover.height
  buildDragonCover(imgs, imageWidth, imageHeight, outputName)
}

const packAtlasImages = async (imageParts, outputDir, fileName) => {
  let options = {
    textureName: "DRAGON",
    width: 2048,
    height: 2048,
    fixedSize: false,
    padding: 2,
    allowRotation: false,
    detectIdentical: true,
    allowTrim: true,
    exporter: "Pixi",
    removeFileExtension: true,
    prependFolderName: true,
    scale: 0.5,
    powerOfTwo: true,
    allowRotation: false,
  };``
  const imgs = await loadImagesToBuffer(imageParts.PARTS)
  const imgPack = imgs.map(it => {
    return {
      path: it.path,
      contents: it.contents
    }
  })
  imgs.sort((a, b) => {
    return a.zIndex - b.zIndex
  })
  options.textureName = fileName ? fileName : 'DRAGON';
  const outDir = outputDir ? outputDir : "./";
  packImages(imgPack, options, outDir, files => {})
}

const getPositionFromAnchor = (x, y, width, height, anchor) => {
  switch (anchor) {
    case IMG_PART_ANCHOR.BOTTOM_LEFT: {
      return {
        x: x,
        y: y - height
      }
    }
    case IMG_PART_ANCHOR.BOTTOM_RIGHT: {
      return {
        x: x - width,
        y: y - height,
      }
    }
    case IMG_PART_ANCHOR.CENTER: {
      return {
        x: x - width / 2,
        y: y - height / 2,
      }
    }
    case IMG_PART_ANCHOR.TOP_LEFT: {
      return {
        x: x,
        y: y,
      }
    }
    case IMG_PART_ANCHOR.TOP_RIGHT: {
      return {
        x: x - width,
        y: y,
      }
    }
  }
}

async function buildDragonCover(imageParts, width, height, outputNames) {
  const imgLoad = imageParts.map(it => {
    return new Promise((resolve, reject) => {
      Jimp.read(it.contents).then(img => {
        resolve({ ...it, image: img })
      }).catch(err => {
        reject(err)
      })
    })
  })
  const emptyImg = await createEmptyImage(width, height)
  const imgLoaded = await Promise.all(imgLoad)
  const writeImg = imgLoaded.map(it => {
    return new Promise((resolve, reject) => {
      const { x, y } = it //getPositionFromAnchor(it.x, it.y, it.image.bitmap.width, it.image.bitmap.height, it.anchor)
      emptyImg.composite(it.image, x, y, (err, img) => {
        if (!err) {
          resolve(it.path);
        } else {
          reject(err)
        }
      })
    })
  })

  const img = await Promise.all(writeImg);
  // emptyImg.autocrop(false).write("packged_dragon.png")
  emptyImg.write(outputNames || "packged_dragon.png")

}


// packAsyncExample();

// export { packImages, packImagesAsync, packgeImageSample }

module.exports = packImages;
module.exports.packImageAsync = packImagesAsync;
module.exports.buildFullDragon = packgeImageSample;
module.exports.packAtlasImages = packAtlasImages;

console.log("MY OUT ");
