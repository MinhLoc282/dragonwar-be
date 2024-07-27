import {DEFAULT_LIMIT_QUERY, MAX_PAGE_LIMIT} from "../../constants";
import * as GiftSevice from './gift.service';

export async function getGifts(req, res, next) {
  try {
    const { auth } = req;
    const data = await GiftSevice.getGifts(auth);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function getGiftsForWeb(req, res, next) {
  try {
    const { wallet } = req;
    const data = await GiftSevice.getGiftsForWeb(wallet);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}


export async function openGift(req, res, next) {
  try {
    const { params: { type }, auth } = req;
    const data = await GiftSevice.openGift(type, auth);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}

export async function openGiftForWeb(req, res, next) {
  try {
    const { params: { type }, wallet } = req;
    const data = await GiftSevice.openGiftForWeb(type, wallet);
    return res.json({
      success: true,
      payload: data
    });
  } catch (error) {
    return next(error);
  }
}
