import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import BalanceFluctuation from './balanceFLuctuation.model';
import {
BALANCE_FLUCTUATION_STATUS, UPLOADS_DESTINATION, USER_ROLE, USER_STATUS
} from '../../constants';
import { UPLOAD_GET_HOST, USER_JWT_DEFAULT_EXPIRE_DURATION, USER_JWT_SECRET_KEY } from '../../config';


const UserSchema = new mongoose.Schema({
  userName: { type: String, index: true },
  fullName: { type: String },
  address: { type: String, required: true, index: true },
  password: { type: String },
  avatar: { type: String },
  balance: {
    base: {
      unlock: { type: Number, default: 0 }
    }
  },
  status: {
   type: String, default: USER_STATUS.ACTIVE, enum: USER_STATUS
  },
  checkinTime: { type: Date },
  role: { type: String, enum: Object.values(USER_ROLE), default: USER_ROLE.USER }
}, {
  timestamps: true,
});

UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};


UserSchema.methods.signJWT = function (session) {
  return jwt.sign({
    _id: this._id,
    session,
  }, USER_JWT_SECRET_KEY, {
    expiresIn: USER_JWT_DEFAULT_EXPIRE_DURATION,
  });
};


UserSchema.set('toJSON', {
  transform(doc, ret, options) { // eslint-disable-line no-unused-vars
    if (ret.avatar) {
      ret.avatar = `${UPLOAD_GET_HOST}/${UPLOADS_DESTINATION}/avatar/${ret.avatar}`;
    }
    delete ret.__v;
    delete ret.updatedAt;
    delete ret.password;
  }
});

UserSchema.statics.getMetaData = async function (users) {
  try {
    const isArray = Array.isArray(users);
    if (!isArray) {
      users = [users];
    }
    const promise = users.map(async (user) => {
      user = user.toJSON();
      const lockedReward = await BalanceFluctuation.aggregate(
        [
          {
            $match: {
              user: user._id,
              status: BALANCE_FLUCTUATION_STATUS.LOCKED,
            }
          },
          {
            $group: { _id: null, sum: { $sum: '$amount' } }
          }
        ]
      );
      user.balance.base.lock = lockedReward?.[0]?.sum || 0;
      return user;
    });

    const data = await Promise.all(promise);

    return isArray ? data : data[0];
  } catch (error) {
    console.log('Error in UserSchema getMetaData');
  }
};


export default mongoose.model('User', UserSchema);
