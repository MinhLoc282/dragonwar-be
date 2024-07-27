import mongoose from 'mongoose';
import { DRAGON_TYPE, DRAGON_CLASS, AUCTION_TYPE, ROOT_PATH } from '../../constants';
import { getImageLink } from '../../helpers/images';
import { getImageSize } from '../../helpers/resize';
import { getParts } from './dragon.service';
import fs from 'fs';
import { packageImageDragon, packageImageDragonSpine } from '../../helpers/imageAtlas';
import { updateItemOwnerTransferDragon } from '../item/item.service';
const Schema = mongoose.Schema;

const Dragons = new Schema({
  id: { type: Number, required: true, index: true },
  idString: { type: String, required: true, index: true },
  name: { type: String, required: true, index: true },
  description: { type: String },
  image: { type: String },
  figure: { type: Object },
  parts: { type: Object },
  generation: { type: Number },
  stats: {
    mana: { type: Number, default: 0 },
    health: { type: Number, default: 0 },
    attack: { type: Number, default: 0 },
    defend: { type: Number, default: 0 },
    speed: { type: Number, default: 0 },
    morale: { type: Number, default: 0 },
  },
  skills: { type: Array },
  birth: { type: Number, default: Date.now() },
  hatched: { type: Number, default: Date.now() },
  genes: { type: String, default: 0 },
  owner: { type: String, required: true, index: true },
  level: { type: Number },
  xp: { type: Number },
  potential: { type: Number },
  type: { type: String, enum: Object.values(DRAGON_TYPE), index: true },
  class: { type: String, enum: Object.values(DRAGON_CLASS), index: true },
  isGestating: { type: Boolean, default: false },
  isReady: { type: Boolean, default: true },
  cooldownIndex: { type: Number, default: 0 },
  nextActionAt: { type: Number, default: 0 },
  siringWithId: { type: Number, default: 0 },
  matronId: { type: Number, default: 0, index: true },
  sireId: { type: Number, default: 0, index: true },
  upgradeIndex: { type: Number, default: 0 },
  unicornation: { type: Number, default: 0 },
  sale: { type: String },
  price: { type: Number },
  startLock: { type: Number },
  unlockTimestamp: { type: Number },
  mutant: { type: Boolean, default: false },
  dateListed: { type: Date },
  totalStats: {
    mana: { type: Number, default: 0 },
    health: { type: Number, default: 0 },
    attack: { type: Number, default: 0 },
    defend: { type: Number, default: 0 },
    speed: { type: Number, default: 0 },
    morale: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
  lockReward: { type: Number, default: 0 }
}, {
  timestamps: true
});

Dragons.pre('updateOne', async function (next) {
  const updateFields = this?._update?.$set;
  const docToUpdate = await this.model.findOne(this.getQuery());
  if (docToUpdate && updateFields.owner && updateFields?.owner !== docToUpdate.owner) {
    await updateItemOwnerTransferDragon(docToUpdate.id, updateFields.owner);
  }
  return next();
});

Dragons.set('toJSON', {
  transform(doc, ret, options) { // eslint-disable-line no-unused-vars
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
    if (ret.type === DRAGON_TYPE.DRAGON) {
      ret.partsName = { ...ret.parts };
      if (!fs.existsSync(`${ROOT_PATH}/resource/dragons/${ret.id}/${ret.id}.png`)) {
        packageImageDragon(ret.id, ret.class, ret.parts);
        ret.image = getImageSize(`resource/dragons/${ret.id}/${ret.id}.png`)
      } else {
        ret.image = getImageSize(`resource/dragons/${ret.id}/${ret.id}.png`)
      }

      if (fs.existsSync(`${ROOT_PATH}/resource/spine/${ret.id}/${ret.id}.json`)) {
        if (ret.class === DRAGON_CLASS.LEGEND) {
          ret.figure = {
            atlas: getImageLink('resource/images/json-spine/16/16.atlas'),
            dragon: getImageLink('resource/images/json-spine/16/16.png'),
            skeleton: getImageLink('resource/images/json-spine/16/16.json')
          };
        } else {
          ret.figure = {
            atlas: getImageLink(`resource/spine/${ret.id}/${ret.id}.atlas`),
            dragon: getImageLink(`resource/spine/${ret.id}/${ret.id}.png`),
            skeleton: getImageLink(`resource/spine/${ret.id}/${ret.id}.json`)
          };
        }

      } else {
        packageImageDragonSpine(ret.id, ret.class, ret.parts)
        if (ret.class === DRAGON_CLASS.LEGEND) {
          ret.figure = {
            atlas: getImageLink('resource/images/json-spine/16/16.atlas'),
            dragon: getImageLink('resource/images/json-spine/16/16.png'),
            skeleton: getImageLink('resource/images/json-spine/16/16.json')
          };
        } else {
          ret.figure = {
            atlas: getImageLink(`resource/spine/${ret.id}/${ret.id}.atlas`),
            dragon: getImageLink(`resource/spine/${ret.id}/${ret.id}.png`),
            skeleton: getImageLink(`resource/spine/${ret.id}/${ret.id}.json`)
          };
        }
      }
    }
    if (ret.type === DRAGON_TYPE.DRAGON) {
      // get parts detail
      ret.parts = getParts(ret.partsName);
    }
  }
});
export default mongoose.model('dragons', Dragons);
