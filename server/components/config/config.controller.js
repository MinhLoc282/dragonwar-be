import * as ConfigService from './config.service';


export async function getConfigs(req, res, next) {
  try {
    const data = await ConfigService.getConfigs();
    return res.json({
      success: true,
      payload: data,
    });
  } catch (error) {
    return next(error);
  }
}


export async function editConfigs(req, res, next) {
  try {
    const { body } = req;
    await ConfigService.editConfigs(body);
    return res.json({
      success: true
    });
  } catch (error) {
    return next(error);
  }
}
