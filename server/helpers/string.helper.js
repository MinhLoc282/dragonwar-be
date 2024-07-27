import mongoose from 'mongoose';
import crypto from 'crypto';
import {
  web3
} from '../web3/kai/index';

export function convertdecToHex(number) {
  return web3.utils.toHex(number).substring(2);
}
export function convertDragonAttribute(number) {
  return {
    STATS: number.slice(0, 10),
    CLASS: number.slice(10, 14),
    HORNS: number.slice(14, 18),
    MIDDLEHORNS: number.slice(18, 22),
    CHEST: number.slice(22, 26),
    TAIL: number.slice(26, 30),
    WINGS: number.slice(30, 34),
    BACKCALES: number.slice(34, 38),
    HEAD: number.slice(38, 42),
    BODYCOLOR: number.slice(42, 46),
    WINGSCOLOR: number.slice(46, 50),
    TAILCOLOR: number.slice(50, 54),
    EYES: number.slice(54, 58),
    POTENTIAL: number.slice(58, 62),
    RESERVED: number.substr(62)
  };
}

export function generateRandom6Digits() {
  return Math.floor(100000 + Math.random() * 100000);
}

export function generateRandom8Digits() {
  return Math.floor(10000000 + Math.random() * 10000000);
}

export function isObjectId(string) {
  return mongoose.Types.ObjectId.isValid(string);
}

export function getObjectId(objectId) {
  try {
    if (typeof objectId === 'string') {
      return mongoose.Types.ObjectId(objectId);
    }
    return objectId;
  } catch (error) {
    throw error;
  }
}

export function getObjectIds(objectIds) {
  try {
    return objectIds.map(objectId => getObjectId(objectId));
  } catch (error) {
    throw error;
  }
}

/**
 * Get current date by format dd-mm-yyyy
 * @returns {string}
 */
export function getCurrentDateString() {
  const currentDate = new Date();
  return `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
}

/**
 * Return sha1 string
 * @param {String} data
 * @returns {string}
 */
export function getSha1(data) {
  return crypto.createHash('sha1')
  .update(data)
  .digest('hex');
}

export function makeId(length) {
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz1234567890';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

/**
 * Valid text string for search
 * @param text
 * @returns {null|RegExp}
 */
export function validSearchString(text) {
  if (typeof text === 'string') {
    text = text.replace(/\\/g, String.raw`\\`).replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");

    return new RegExp(text, 'i');
  }
  return null;
}
