const {default: axios} = require('axios');
const texturePacker = require('free-tex-packer-core');
const fs = require('fs');
const Jimp = require('jimp');
import { mkDir } from './file.helper';

import { ROOT_PATH } from '../constants';
const IMG_PART_ANCHOR = {
  TOP_LEFT: 1, // 'TOP_LEFT',
  TOP_RIGHT: 2, // 'TOP_RIGHT',
  BOTTOM_LEFT: 3, // 'BOTTOM_LEFT',
  BOTTOM_RIGHT: 4, // 'BOTTOM_RIGHT',
  CENTER: 5 // 'CENTER',
};

function convertJSON2Atlas(buffJSONAtlas) {
  if (!buffJSONAtlas) {
    throw Error('JSON atlas is not valid');
  }
  const info = JSON.parse(buffJSONAtlas.toString());
  const frames = info.frames;
  const strtring = [''];
  const metadata = info.meta;
  const size = metadata.size;
  strtring.push(metadata.image);
  strtring.push(`size: ${size.w},${size.h}`);
  strtring.push(`format: ${metadata.format}`);
  strtring.push('filter: Linear,Linear');
  strtring.push('repeat: none');

  Object.keys(frames).forEach((key) => {
    const a = frames[key];
    strtring.push(key);
    strtring.push('  rotate: false');
    strtring.push(`  xy: ${a.frame.x}, ${a.frame.y}`);
    strtring.push(`  size: ${a.frame.w}, ${a.frame.h}`);
    strtring.push(`  orig: ${a.frame.w}, ${a.frame.h}`);
    strtring.push('  offset: 0, 0');
    strtring.push('  index: -1');
  });
  const atlas = strtring.join('\n');
  return atlas;
}

function packImages(images, options, filePath, cb) {
  if (!images || !options) {
    throw new Error('Images sources and options config is requied');
  }
  texturePacker(images, options, (files, error) => {
    if (error) {
      console.error('Packaging failed', error);
    } else {
      const promiseFiles = files.map(file => new Promise((resolve, reject) => {
        if (file.name.indexOf('.json') !== -1) {
          const atlas = convertJSON2Atlas(file.buffer);
          fs.writeFile(`${filePath + options.textureName}.atlas`, atlas, (err) => {
            if (!err) {
              resolve(`${filePath + options.textureName}.atlas`);
            } else {
              reject(err);
            }
          });
        } else {
          fs.writeFile(filePath + file.name, file.buffer, (err) => {
            if (!err) {
              resolve(filePath + file.name);
            } else {
              reject(err);
            }
          });
        }
      }));
      Promise.all(promiseFiles).then((files) => {
        if (cb) {
          cb(files);
        }
      }).catch((ex) => {
        cb(null);
      });
    }
  });
}

function packImagesAsync(images, options, savePath) {
  return new Promise((resolve, reject) => {
    packImages(images, options, savePath, (files) => {
      if (files != null) {
        resolve(files);
      } else {
        reject('Error write files');
      }
    });
  });
}

const createEmptyImage = (width, height) => new Promise((resolve, reject) => {
  // eslint-disable-next-line no-new
  new Jimp(width, height, 0x0, (err, image) => {
    if (err) {
      return reject(err);
    }
    resolve(image);
  });
});

async function loadImagesToBuffer(imageSrc) {
  const imageWithBuffers = [];
  // eslint-disable-next-line guard-for-in
  for (const imgPart in imageSrc) {
    const { src: imgURL } = imageSrc[imgPart];
    try {
      if (imgURL) {
        if (imgURL.indexOf('https://') !== -1 || imgURL.indexOf('https://') !== -1) {
          // load from host
          // eslint-disable-next-line no-await-in-loop
          const { data } = await axios.get(imgURL, { responseType: 'arraybuffer' });
          imageWithBuffers.push(
            { path: `${imgPart}.png`, contents: data, ...imageSrc[imgPart] }
          );
        } else {
          const imgContent = fs.readFileSync(imgURL);
          imageWithBuffers.push({ path: `${imgPart}.png`, contents: imgContent, ...imageSrc[imgPart] });
        }
      }
    } catch (ex) {
      console.error('ERROR LOAD IMAGE:', ex);
    }
  }
  return imageWithBuffers;
}

export async function packageImage(id, imageConfig) {
  const images = await loadImagesToBuffer(imageConfig.PARTS);
  images.sort((a, b) => a.zIndex - b.zIndex);
  // const dest = `${ROOT_PATH}/resource/dragons/`;
  const dest = `${ROOT_PATH}/resource/dragons/${id}/`;
  mkDir(dest);
  const imageWidth = imageConfig.imageInfo.cover.width;
  const imageHeight = imageConfig.imageInfo.cover.height;
  const image = await buildDragonCover(images, imageWidth, imageHeight, `${dest}${id}.png`);
  return image.replace(`${ROOT_PATH}/`, '');
}

const getPositionFromAnchor = (x, y, width, height, anchor) => {
  // eslint-disable-next-line default-case
  switch (anchor) {
    case IMG_PART_ANCHOR.BOTTOM_LEFT: {
      return {
        x: x,
        y: y - height
      };
    }
    case IMG_PART_ANCHOR.BOTTOM_RIGHT: {
      return {
        x: x - width,
        y: y - height,
      };
    }
    case IMG_PART_ANCHOR.CENTER: {
      return {
        x: x - width / 2,
        y: y - height / 2,
      };
    }
    case IMG_PART_ANCHOR.TOP_LEFT: {
      return {
        x: x,
        y: y,
      };
    }
    case IMG_PART_ANCHOR.TOP_RIGHT: {
      return {
        x: x - width,
        y: y,
      };
    }
  }
};

async function buildDragonCover(imageParts, width, height, dest) {
  const imgLoad = imageParts.map(it => new Promise((resolve, reject) => {
    Jimp.read(it.contents).then((img) => {
      resolve({...it, image: img});
    }).catch((err) => {
      reject(err);
    });
  }));
  const emptyImg = await createEmptyImage(width, height);
  const imgLoaded = await Promise.all(imgLoad);
  const writeImg = imgLoaded.map(it => new Promise((resolve, reject) => {
    const {x, y} = getPositionFromAnchor(it.x, it.y, it.image.bitmap.width, it.image.bitmap.height, it.anchor);
    emptyImg.composite(it.image, x, y, (err, img) => {
      if (!err) {
        resolve(it.path);
      } else {
        reject(err);
      }
    });
  }));
  // await Promise.all(writeImg);
  emptyImg.autocrop(false, {
    tolerance: 0.0002,
    leaveBorder: 30
  }).resize(900, Jimp.AUTO).write(dest);
  // emptyImg.write(dest);
  return dest;
}
