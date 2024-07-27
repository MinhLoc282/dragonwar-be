import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const Report = new Schema({
  dragons: { type: Number, default: 0, index: true },
  breeding: { type: Number, default: 0, index: true },
  adventure: { type: Number, default: 0, index: true },
  boots: { type: Number, default: 0, index: true },
  dragonsSale: { type: Number, default: 0, index: true },
  kaiSale: { type: Number, default: 0, index: true },
  dragonsSire: { type: Number, default: 0 },
  kaiSire: { type: Number, default: 0 },
  totalItems: {
    equipment: { type: Number, default: 0, index: true },
    skill_card: { type: Number, default: 0, index: true },
    exp_card: { type: Number, default: 0, index: true },
  },
  burnedItems: {
    equipment: { type: Number, default: 0, index: true },
    skill_card: { type: Number, default: 0, index: true },
    exp_card: { type: Number, default: 0, index: true },
  },
  itemsSale: {
    equipment: { type: Number, default: 0, index: true },
    skill_card: { type: Number, default: 0, index: true },
    exp_card: { type: Number, default: 0, index: true },
  },
  kaiSaleItems: {
    equipment: { type: Number, default: 0, index: true },
    skill_card: { type: Number, default: 0, index: true },
    exp_card: { type: Number, default: 0, index: true },
  },
  feeSaleItems: {
    equipment: { type: Number, default: 0, index: true },
    skill_card: { type: Number, default: 0, index: true },
    exp_card: { type: Number, default: 0, index: true },
  },
  date: { type: Date, default: new Date(new Date().setHours(0,0,0,0)) }
});

export default mongoose.model('report', Report);
