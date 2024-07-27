import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import {
  INCREASE_ITEM_BY_LEVEL, INCREASE_SKILL_BY_LEVEL,
  ITEM_STATUS,
  ITEM_TYPES,
  REPLACE_RARITY
} from '../../constants';
import { MONGO_URI } from '../../config';
import { getImageLink } from '../../helpers/images';

const connection = mongoose.createConnection(MONGO_URI);


const Item = new mongoose.Schema({
  uid: { type: Number },
  level: { type: Number, default: 0 },
  rarityLevel: { type: String },
  nftId: { type: Number },
  nftIdString: { type: String },
  listingId: { type: Number },
  type: { type: String, required: true, enum: Object.values(ITEM_TYPES) },
  // Skill Card
  skill: { type: mongoose.Schema.Types.ObjectId, ref: 'skill' },
  // Equipment
  equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' },
  // EXP
  exp: { type: Number },
  owner: { type: String },
  dragon: { type: Number },
  status: { type: String, enum: Object.values(ITEM_STATUS), default: ITEM_STATUS.ACTIVE },
  price: { type: Number }
}, {
  timestamps: true,
});

autoIncrement.initialize(connection);

Item.plugin(autoIncrement.plugin, { model: 'Item', field: 'uid', startAt: 1 });


Item.set('toJSON', {
  transform(doc, ret, options) { // eslint-disable-line no-unused-vars
    delete ret.__v;
    delete ret.updatedAt;
    if (ret.type === ITEM_TYPES.EQUIPMENT && ret.equipment?._id) {
      ret.equipment.defaultPoint = ret.equipment.point;
      ret.equipment.stats = {
        point: {
          defaultValue: ret.equipment.point,
          increase: INCREASE_ITEM_BY_LEVEL[REPLACE_RARITY[ret.equipment.rarity]]?.[ret.level || 0] || 0
        }
      };
      ret.equipment.point += INCREASE_ITEM_BY_LEVEL[REPLACE_RARITY[ret.equipment.rarity]]?.[ret.level || 0] || 0;
    }
    if (ret.type === ITEM_TYPES.SKILL_CARD && ret.skill?._id) {
      ret.skill.stats = {
        attack: {
          defaultValue: ret.skill.attack,
          increase: INCREASE_SKILL_BY_LEVEL[ret.skill.rarity?.toUpperCase()]?.[ret.level || 0] || 0
        },
        defend: {
          defaultValue: ret.skill.defend,
          increase: INCREASE_SKILL_BY_LEVEL[ret.skill.rarity?.toUpperCase()]?.[ret.level || 0] || 0
        },
      };
      ret.skill.attack += INCREASE_SKILL_BY_LEVEL[ret.skill.rarity?.toUpperCase()]?.[ret.level || 0] || 0;
      ret.skill.defend += INCREASE_SKILL_BY_LEVEL[ret.skill.rarity?.toUpperCase()]?.[ret.level || 0] || 0;
      ret.skill.image = getImageLink(`resource/skillcards/${ret.skill.id}.jpg`);
    }
  }
});


export default mongoose.model('Item', Item);
