import fs from 'fs';
import execa from 'execa';
import logger from '../util/logger';

const path = require('path');

/**
 * Remove local file on server with filePath
 * @param filePath
 * @returns {boolean}
 */
export function removeFile(filePath) {
  if (!filePath) {
    return true;
  }
  try {
    execa.command(`rm ${filePath}`);
    return true;
  } catch (error) {
    logger.error('removeFile execa error:', error);
    logger.error('removeFile execa error, filePath:', filePath);
    throw error;
  }
}

/**
 * Remove local files on server with filePath
 * @param filesPath
 * @returns {boolean}
 */
export function removeFiles(filesPath) {
  if (!filesPath?.length) {
    return true;
  }
  try {
    filesPath = filesPath.join(' ');
    execa.command(`rm ${filesPath}`);
    return true;
  } catch (error) {
    logger.error('removeFiles execa error:', error);
    logger.error('removeFiles execa error, filesPath:', filesPath);
    throw error;
  }
}

/**
 * Create folder if not existed
 * @param path
 * @returns {boolean}
 */
export function mkDir(dirPath) {
  if (!dirPath) {
    return true;
  }
  try {
    const normalizedPath = path.normalize(dirPath);
    const parts = normalizedPath.split(path.sep);

    for (let i = 1; i <= parts.length; i++) {
      const currentPath = parts.slice(0, i).join(path.sep);
      if (currentPath && !fs.existsSync(currentPath)) {
        fs.mkdirSync(currentPath);
      }
    }
    return true;
  } catch (error) {
    logger.error('mkdir error:');
    logger.error(error);
    throw error;
  }
}

export function getFileName(path) {
  return path?.replace(/^.*[\\\/]/, '') || '';
}

export function getPathWithoutName(path) {
  return path?.substring(0, path.lastIndexOf('/')) || '';
}

export function getDimensions(dimensions, resize) {
  const result = {};
  result.width = resize;
  result.height = resize * dimensions.height / dimensions.width;
  return result;
}
