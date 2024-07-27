import mongoose from 'mongoose';
import BalanceFluctuation from '../user/balanceFLuctuation.model';
import { BATTLE_TYPES } from '../../constants';
import Adventure from '../adventure/adventure.model';
import {getImageSize} from "../../helpers/resize";
import {getImageLink} from "../../helpers/images";

const Schema = mongoose.Schema;

const BattleHistorySchema = new Schema({
  uid: { type: Number },
  roomId: { type: String, required: true, index: true },
  players: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  sessions: { type: Object },
  boss: { type: Object },
  dragons: { type: Object },
  teams: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Team'
    }
  ],
  adventure: { type: Object },
  type: { type: String, required: true },
  roundHistory: { type: Array, default: [] },
  result: {
    isWin: { type: Boolean },
    winner: { type: String },
    dragons: { type: Object },
    boss: { type: Object },
    type: { type: String },
    lockRewardDragons: { type: Array },
    point: { type: Number }
  },
  endAt: { type: Number },
  attackOrder: { type: Object }
}, {
  timestamps: true
});

BattleHistorySchema.set('toJSON', {
  transform(doc, ret, options) { // eslint-disable-line no-unused-vars
    delete ret.__v;
  }
});


BattleHistorySchema.statics.getMetaData = async function (histories) {
  try {
    const isArray = Array.isArray(histories);
    if (!isArray) {
      histories = [histories];
    }
    const promise = histories.map(async (history) => {
      history = history.toJSON();
      const rewardLog = await BalanceFluctuation.findOne({ battleHistory: history._id });
      if (rewardLog) {
        history.reward = {
          [rewardLog.user]: rewardLog.amount
        };
      }
      Object.keys(history.dragons)?.map((key) => {
        history.dragons[key].image = getImageSize(`resource/dragons/${history.dragons[key].id}/${history.dragons[key].id}.png`)
      })
      if (history.type === BATTLE_TYPES.ADVENTURE) {
        Object.keys(history.boss)?.map((key) => {
          history.boss[key].image = {
            root: getImageLink(`resource/monsters/${history.boss[key].id}/images/${history.boss[key].id}.png`)
          };
        })
        const adventure = await Adventure.findOne({ id: history.adventure?.id }).lean();
        history.adventure = {
          ...adventure,
          ...history.adventure
        };
      }
      return history;
    });
    const data = await Promise.all(promise);
    return isArray ? data : data[0];
  } catch (error) {
    console.log('Error in getMetaData battle history => ', error);
  }
};

export default mongoose.model('BattleHistory', BattleHistorySchema);
