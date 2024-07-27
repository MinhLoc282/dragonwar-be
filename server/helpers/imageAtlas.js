import { DRAGON_CLASS, DRAGON_TYPE, WORKER_NAME } from '../constants';
import { IMAGE_CONFIG_WOOD } from '../../resource/images/dragon-part/WOOD/config';
import { IMAGE_CONFIG_METAL } from '../../resource/images/dragon-part/METAL/config';
import { IMAGE_CONFIG_WATER } from '../../resource/images/dragon-part/WATER/config';
import { IMAGE_CONFIG_EARTH } from '../../resource/images/dragon-part/EARTH/config';
import { IMAGE_CONFIG_FIRE } from '../../resource/images/dragon-part/FIRE/config';
import { IMAGE_CONFIG_A } from '../../resource/images/dragon-part/a/config';
import { IMAGE_CONFIG_B } from '../../resource/images/dragon-part/b/config';
import { IMAGE_CONFIG_C } from '../../resource/images/dragon-part/c/config';
import { IMAGE_CONFIG_D } from '../../resource/images/dragon-part/d/config';
import { IMAGE_CONFIG_E } from '../../resource/images/dragon-part/e/config';
import { IMAGE_CONFIG_LEGEND } from '../../resource/images/dragon-part/LEGEND/config';

import { packageImage } from './packageImage';
import { packAtlas } from './atlas-packer';
import AMPQ from '../../rabbitmq/ampq';

const path = require('path');


export async function generateSpineDragon(id, classDragon, attributes, randomBody = '') {
  try {
    const pathImagesA = path.join(__dirname, '../../resource/images/dragon-part/a');
    const pathImagesB = path.join(__dirname, '../../resource/images/dragon-part/b');
    const pathImagesC = path.join(__dirname, '../../resource/images/dragon-part/c');
    const pathImagesD = path.join(__dirname, '../../resource/images/dragon-part/d');
    const pathImagesE = path.join(__dirname, '../../resource/images/dragon-part/e');
    const CONFIGS = [IMAGE_CONFIG_WOOD, IMAGE_CONFIG_METAL, IMAGE_CONFIG_WATER, IMAGE_CONFIG_EARTH, IMAGE_CONFIG_FIRE];
    const CONFIGIMAGES = [IMAGE_CONFIG_A, IMAGE_CONFIG_B, IMAGE_CONFIG_C, IMAGE_CONFIG_D, IMAGE_CONFIG_E];
    const CONFIGIMAGEPATHS = [pathImagesA, pathImagesB, pathImagesC, pathImagesD, pathImagesE];
    const CONFIGCLASS = ['WOOD', 'METAL', 'WATER', 'EARTH', 'FIRE'];
    const CONFIGMUTATION = ['a', 'b', 'c', 'd', 'e'];
    let CONFIG = {};
    let CLASS = classDragon;
    let body = '';
    let CONFIGIMAGE;
    let CONFIGIMAGEPATH;
    switch (classDragon) {
      case DRAGON_CLASS.WOOD:
        CONFIG = IMAGE_CONFIG_WOOD;
        if (randomBody === '') {
          await packageImageDragonSpine(id, classDragon, Object.assign({}, attributes));
        }
        break;
      case DRAGON_CLASS.METAL:
        CONFIG = IMAGE_CONFIG_METAL;
        if (randomBody === '') {
          await packageImageDragonSpine(id, classDragon, Object.assign({}, attributes));
        }
        break;
      case DRAGON_CLASS.WATER:
        CONFIG = IMAGE_CONFIG_WATER;
        if (randomBody === '') {
          await packageImageDragonSpine(id, classDragon, Object.assign({}, attributes));
        }
        break;
      case DRAGON_CLASS.EARTH:
        CONFIG = IMAGE_CONFIG_EARTH;
        if (randomBody === '') {
          await packageImageDragonSpine(id, classDragon, Object.assign({}, attributes));
        }
        break;
      case DRAGON_CLASS.FIRE:
        CONFIG = IMAGE_CONFIG_FIRE;
        if (randomBody === '') {
          await packageImageDragonSpine(id, classDragon, Object.assign({}, attributes));
        }
        break;
      case DRAGON_CLASS.YINYANG:
        const random = randomBody === '' ? Math.floor(Math.random() * CONFIGS.length) : randomBody;
        CONFIG = CONFIGS[random];
        CLASS = CONFIGCLASS[random];
        body = CONFIGMUTATION[random];
        CONFIGIMAGE = CONFIGIMAGES[random];
        CONFIGIMAGEPATH = CONFIGIMAGEPATHS[random];
        if (randomBody === '') {
          await packageImageDragonSpine(id, classDragon, Object.assign({}, attributes), random);
        }
        break;
      case DRAGON_CLASS.LEGEND:
        CONFIG = IMAGE_CONFIG_LEGEND;
        break;
      default:
        break;
    }
  } catch (error) {
    console.log('Error in generateSpineDragon', error);
  }
}

export async function packageImageDragon(id, classDragon, attributes, randomBody = '') {
  try {
    const pathImagesA = path.join(__dirname, '../../resource/images/dragon-part/a');
    const pathImagesB = path.join(__dirname, '../../resource/images/dragon-part/b');
    const pathImagesC = path.join(__dirname, '../../resource/images/dragon-part/c');
    const pathImagesD = path.join(__dirname, '../../resource/images/dragon-part/d');
    const pathImagesE = path.join(__dirname, '../../resource/images/dragon-part/e');
    const CONFIGS = [IMAGE_CONFIG_WOOD, IMAGE_CONFIG_METAL, IMAGE_CONFIG_WATER, IMAGE_CONFIG_EARTH, IMAGE_CONFIG_FIRE];
    const CONFIGIMAGES = [IMAGE_CONFIG_A, IMAGE_CONFIG_B, IMAGE_CONFIG_C, IMAGE_CONFIG_D, IMAGE_CONFIG_E];
    const CONFIGIMAGEPATHS = [pathImagesA, pathImagesB, pathImagesC, pathImagesD, pathImagesE];
    const CONFIGCLASS = ['WOOD', 'METAL', 'WATER', 'EARTH', 'FIRE'];
    const CONFIGMUTATION = ['a', 'b', 'c', 'd', 'e'];
    let CONFIG = {};
    let CLASS = classDragon;
    let body = '';
    let CONFIGIMAGE;
    let CONFIGIMAGEPATH;
    switch (classDragon) {
      case DRAGON_CLASS.WOOD:
        CONFIG = IMAGE_CONFIG_WOOD;
        if (randomBody === '') {
          await packageImageDragonSpine(id, classDragon, Object.assign({}, attributes));
        }
        break;
      case DRAGON_CLASS.METAL:
        CONFIG = IMAGE_CONFIG_METAL;
        if (randomBody === '') {
          await packageImageDragonSpine(id, classDragon, Object.assign({}, attributes));
        }
        break;
      case DRAGON_CLASS.WATER:
        CONFIG = IMAGE_CONFIG_WATER;
        if (randomBody === '') {
          await packageImageDragonSpine(id, classDragon, Object.assign({}, attributes));
        }
        break;
      case DRAGON_CLASS.EARTH:
        CONFIG = IMAGE_CONFIG_EARTH;
        if (randomBody === '') {
          await packageImageDragonSpine(id, classDragon, Object.assign({}, attributes));
        }
        break;
      case DRAGON_CLASS.FIRE:
        CONFIG = IMAGE_CONFIG_FIRE;
        if (randomBody === '') {
          await packageImageDragonSpine(id, classDragon, Object.assign({}, attributes));
        }
        break;
      case DRAGON_CLASS.YINYANG:
        const random = randomBody === '' ? Math.floor(Math.random() * CONFIGS.length) : randomBody;
        CONFIG = CONFIGS[random];
        CLASS = CONFIGCLASS[random];
        body = CONFIGMUTATION[random];
        CONFIGIMAGE = CONFIGIMAGES[random];
        CONFIGIMAGEPATH = CONFIGIMAGEPATHS[random];
        if (randomBody === '') {
          await packageImageDragonSpine(id, classDragon, Object.assign({}, attributes), random);
        }
        break;
      case DRAGON_CLASS.LEGEND:
        CONFIG = IMAGE_CONFIG_LEGEND;
        break;
      default:
        break;
    }
    if (JSON.stringify(CONFIG) === '{}') {
      return {};
    }
    if (classDragon !== DRAGON_CLASS.LEGEND) {
      const pathImages = path.join(__dirname, `../../resource/images/dragon-part/${CLASS}`);
      let bodyColor; let wingsColor; let tailColor;
      switch (parseInt(attributes.bodyColor, 0)) {
        case 0:
        case 5:
        case 'a':
          bodyColor = 0;
          break;
        case 1:
        case 6:
        case 'b':
          bodyColor = 1;
          break;
        case 2:
        case 7:
        case 'c':
          bodyColor = 2;
          break;
        case 3:
        case 8:
        case 'd':
          bodyColor = 3;
          break;
        case 4:
        case 9:
        case 'e':
          bodyColor = 4;
          break;
        default:
          bodyColor = 0;
          break;
      }
      delete attributes.bodyColor;
      switch (parseInt(attributes.wingsColor, 0)) {
        case 0:
        case 5:
        case 'a':
          wingsColor = 0;
          break;
        case 1:
        case 6:
        case 'b':
          wingsColor = 1;
          break;
        case 2:
        case 7:
        case 'c':
          wingsColor = 2;
          break;
        case 3:
        case 8:
        case 'd':
          wingsColor = 3;
          break;
        case 4:
        case 9:
        case 'e':
          wingsColor = 4;
          break;
        default:
          wingsColor = 0;
          break;
      }
      delete attributes.wingsColor;
      switch (parseInt(attributes.tailColor, 0)) {
        case 0:
        case 5:
        case 'a':
          tailColor = 0;
          break;
        case 1:
        case 6:
        case 'b':
          tailColor = 1;
          break;
        case 2:
        case 7:
        case 'c':
          tailColor = 2;
          break;
        case 3:
        case 8:
        case 'd':
          tailColor = 3;
          break;
        case 4:
        case 9:
        case 'e':
          tailColor = 4;
          break;
        default:
          tailColor = 0;
          break;
      }
      delete attributes.tailColor;
      if (classDragon !== DRAGON_CLASS.YINYANG) {
        CONFIG.PARTS.BODY = { ...CONFIG.PARTS.BODY, ...CONFIG.BODY[bodyColor] };
        CONFIG.PARTS.BODY.src = `${pathImages}/body/${bodyColor}/body.png`;
        CONFIG.PARTS.FRONT_LEFT_FOOT = { ...CONFIG.PARTS.FRONT_LEFT_FOOT, ...CONFIG.FRONT_LEFT_FOOT[bodyColor] };
        CONFIG.PARTS.FRONT_LEFT_FOOT.src = `${pathImages}/body/${bodyColor}/left_front_leg.png`;
        CONFIG.PARTS.FRONT_RIGHT_FOOT = { ...CONFIG.PARTS.FRONT_RIGHT_FOOT, ...CONFIG.FRONT_RIGHT_FOOT[bodyColor] };
        CONFIG.PARTS.FRONT_RIGHT_FOOT.src = `${pathImages}/body/${bodyColor}/right_front_leg.png`;
        CONFIG.PARTS.BEHIND_LEFT_FOOT = { ...CONFIG.PARTS.BEHIND_LEFT_FOOT, ...CONFIG.BEHIND_LEFT_FOOT[bodyColor] };
        CONFIG.PARTS.BEHIND_LEFT_FOOT.src = `${pathImages}/body/${bodyColor}/left_back_leg.png`;
        CONFIG.PARTS.BEHIND_RIGHT_FOOT = { ...CONFIG.PARTS.BEHIND_RIGHT_FOOT, ...CONFIG.BEHIND_RIGHT_FOOT[bodyColor] };
        CONFIG.PARTS.BEHIND_RIGHT_FOOT.src = `${pathImages}/body/${bodyColor}/right_back_leg.png`;
      } else {
        CONFIG.PARTS.BODY = { ...CONFIGIMAGE.PARTS.BODY, ...CONFIGIMAGE.BODY[body] };
        CONFIG.PARTS.BODY.src = `${CONFIGIMAGEPATH}/body/body.png`;
        CONFIG.PARTS.FRONT_LEFT_FOOT = { ...CONFIGIMAGE.PARTS.FRONT_LEFT_FOOT, ...CONFIGIMAGE.FRONT_LEFT_FOOT[body] };
        CONFIG.PARTS.FRONT_LEFT_FOOT.src = `${CONFIGIMAGEPATH}/body/left_front_leg.png`;
        CONFIG.PARTS.FRONT_RIGHT_FOOT = { ...CONFIGIMAGE.PARTS.FRONT_RIGHT_FOOT, ...CONFIGIMAGE.FRONT_RIGHT_FOOT[body] };
        CONFIG.PARTS.FRONT_RIGHT_FOOT.src = `${CONFIGIMAGEPATH}/body/right_front_leg.png`;
        CONFIG.PARTS.BEHIND_LEFT_FOOT = { ...CONFIGIMAGE.PARTS.BEHIND_LEFT_FOOT, ...CONFIGIMAGE.BEHIND_LEFT_FOOT[body] };
        CONFIG.PARTS.BEHIND_LEFT_FOOT.src = `${CONFIGIMAGEPATH}/body/left_back_leg.png`;
        CONFIG.PARTS.BEHIND_RIGHT_FOOT = { ...CONFIGIMAGE.PARTS.BEHIND_RIGHT_FOOT, ...CONFIGIMAGE.BEHIND_RIGHT_FOOT[body] };
        CONFIG.PARTS.BEHIND_RIGHT_FOOT.src = `${CONFIGIMAGEPATH}/body/right_back_leg.png`;
      }
      for (const [key, value] of Object.entries(attributes)) {
        switch (key) {
          case 'horns':
            if (value != 0) {
              switch (value) {
                case 'a':
                  CONFIG.PARTS.RIGHT_HORN = { ...IMAGE_CONFIG_A.PARTS.RIGHT_HORN, ...IMAGE_CONFIG_A.RIGHT_HORN[value] };
                  CONFIG.PARTS.RIGHT_HORN.src = `${pathImagesA}/${key}/${bodyColor}/right.png`;
                  CONFIG.PARTS.LEFT_HORN = { ...IMAGE_CONFIG_A.PARTS.LEFT_HORN, ...IMAGE_CONFIG_A.LEFT_HORN[value] };
                  CONFIG.PARTS.LEFT_HORN.src = `${pathImagesA}/${key}/${bodyColor}/left.png`;
                  break;
                case 'b':
                  CONFIG.PARTS.RIGHT_HORN = { ...IMAGE_CONFIG_B.PARTS.RIGHT_HORN, ...IMAGE_CONFIG_B.RIGHT_HORN[value] };
                  CONFIG.PARTS.RIGHT_HORN.src = `${pathImagesB}/${key}/${bodyColor}/right.png`;
                  CONFIG.PARTS.LEFT_HORN = { ...IMAGE_CONFIG_B.PARTS.LEFT_HORN, ...IMAGE_CONFIG_B.LEFT_HORN[value] };
                  CONFIG.PARTS.LEFT_HORN.src = `${pathImagesB}/${key}/${bodyColor}/left.png`;
                  break;
                case 'c':
                  CONFIG.PARTS.RIGHT_HORN = { ...IMAGE_CONFIG_C.PARTS.RIGHT_HORN, ...IMAGE_CONFIG_C.RIGHT_HORN[value] };
                  CONFIG.PARTS.RIGHT_HORN.src = `${pathImagesC}/${key}/${bodyColor}/right.png`;
                  CONFIG.PARTS.LEFT_HORN = { ...IMAGE_CONFIG_C.PARTS.LEFT_HORN, ...IMAGE_CONFIG_C.LEFT_HORN[value] };
                  CONFIG.PARTS.LEFT_HORN.src = `${pathImagesC}/${key}/${bodyColor}/left.png`;
                  break;
                case 'd':
                  CONFIG.PARTS.RIGHT_HORN = { ...IMAGE_CONFIG_D.PARTS.RIGHT_HORN, ...IMAGE_CONFIG_D.RIGHT_HORN[value] };
                  CONFIG.PARTS.RIGHT_HORN.src = `${pathImagesD}/${key}/${bodyColor}/right.png`;
                  CONFIG.PARTS.LEFT_HORN = { ...IMAGE_CONFIG_D.PARTS.LEFT_HORN, ...IMAGE_CONFIG_D.LEFT_HORN[value] };
                  CONFIG.PARTS.LEFT_HORN.src = `${pathImagesD}/${key}/${bodyColor}/left.png`;
                  break;
                case 'e':
                  CONFIG.PARTS.RIGHT_HORN = { ...IMAGE_CONFIG_E.PARTS.RIGHT_HORN, ...IMAGE_CONFIG_E.RIGHT_HORN[value] };
                  CONFIG.PARTS.RIGHT_HORN.src = `${pathImagesE}/${key}/${bodyColor}/right.png`;
                  CONFIG.PARTS.LEFT_HORN = { ...IMAGE_CONFIG_E.PARTS.LEFT_HORN, ...IMAGE_CONFIG_E.LEFT_HORN[value] };
                  CONFIG.PARTS.LEFT_HORN.src = `${pathImagesE}/${key}/${bodyColor}/left.png`;
                  break;
                default:
                  CONFIG.PARTS.RIGHT_HORN = { ...CONFIG.PARTS.RIGHT_HORN, ...CONFIG.RIGHT_HORN[value] };
                  CONFIG.PARTS.RIGHT_HORN.src = `${pathImages}/${key}/${value}/${bodyColor}/right.png`;
                  CONFIG.PARTS.LEFT_HORN = { ...CONFIG.PARTS.LEFT_HORN, ...CONFIG.LEFT_HORN[value] };
                  CONFIG.PARTS.LEFT_HORN.src = `${pathImages}/${key}/${value}/${bodyColor}/left.png`;
                  break;
              }
            } else {
              delete CONFIG.PARTS.RIGHT_HORN.src;
              delete CONFIG.PARTS.LEFT_HORN.src;
            }
            break;
          case 'middlehorns':
            if (value != 0) {
              switch (value) {
                case 'a':
                  CONFIG.PARTS.MIDDLE_HORN = { ...IMAGE_CONFIG_A.PARTS.MIDDLE_HORN, ...IMAGE_CONFIG_A.MIDDLE_HORN[value] };
                  CONFIG.PARTS.MIDDLE_HORN.src = `${pathImagesA}/${key}/${bodyColor}.png`;
                  break;
                case 'b':
                  CONFIG.PARTS.MIDDLE_HORN = { ...IMAGE_CONFIG_B.PARTS.MIDDLE_HORN, ...IMAGE_CONFIG_B.MIDDLE_HORN[value] };
                  CONFIG.PARTS.MIDDLE_HORN.src = `${pathImagesB}/${key}/${bodyColor}.png`;
                  break;
                case 'c':
                  CONFIG.PARTS.MIDDLE_HORN = { ...IMAGE_CONFIG_C.PARTS.MIDDLE_HORN, ...IMAGE_CONFIG_C.MIDDLE_HORN[value] };
                  CONFIG.PARTS.MIDDLE_HORN.src = `${pathImagesC}/${key}/${bodyColor}.png`;
                  break;
                case 'd':
                  CONFIG.PARTS.MIDDLE_HORN = { ...IMAGE_CONFIG_D.PARTS.MIDDLE_HORN, ...IMAGE_CONFIG_D.MIDDLE_HORN[value] };
                  CONFIG.PARTS.MIDDLE_HORN.src = `${pathImagesD}/${key}/${bodyColor}.png`;
                  break;
                case 'e':
                  CONFIG.PARTS.MIDDLE_HORN = { ...IMAGE_CONFIG_E.PARTS.MIDDLE_HORN, ...IMAGE_CONFIG_E.MIDDLE_HORN[value] };
                  CONFIG.PARTS.MIDDLE_HORN.src = `${pathImagesE}/${key}/${bodyColor}.png`;
                  break;
                default:
                  CONFIG.PARTS.MIDDLE_HORN = { ...CONFIG.PARTS.MIDDLE_HORN, ...CONFIG.MIDDLE_HORN[value] };
                  CONFIG.PARTS.MIDDLE_HORN.src = `${pathImages}/${key}/${value}/${bodyColor}.png`;
                  break;
              }
            } else {
              delete CONFIG.PARTS.MIDDLE_HORN.src;
            }
            break;
          case 'backcales':
            switch (value) {
              case 'a':
                CONFIG.PARTS.BACK_SCALE = { ...IMAGE_CONFIG_A.PARTS.BACK_SCALE, ...IMAGE_CONFIG_A.BACK_SCALE[value] };
                CONFIG.PARTS.BACK_SCALE.src = `${pathImagesA}/backscales/${bodyColor}.png`;
                break;
              case 'b':
                CONFIG.PARTS.BACK_SCALE = { ...IMAGE_CONFIG_B.PARTS.BACK_SCALE, ...IMAGE_CONFIG_B.BACK_SCALE[value] };
                CONFIG.PARTS.BACK_SCALE.src = `${pathImagesB}/backscales/${bodyColor}.png`;
                break;
              case 'c':
                CONFIG.PARTS.BACK_SCALE = { ...IMAGE_CONFIG_C.PARTS.BACK_SCALE, ...IMAGE_CONFIG_C.BACK_SCALE[value] };
                CONFIG.PARTS.BACK_SCALE.src = `${pathImagesC}/backscales/${bodyColor}.png`;
                break;
              case 'd':
                CONFIG.PARTS.BACK_SCALE = { ...IMAGE_CONFIG_D.PARTS.BACK_SCALE, ...IMAGE_CONFIG_D.BACK_SCALE[value] };
                CONFIG.PARTS.BACK_SCALE.src = `${pathImagesD}/backscales/${bodyColor}.png`;
                break;
              case 'e':
                CONFIG.PARTS.BACK_SCALE = { ...IMAGE_CONFIG_E.PARTS.BACK_SCALE, ...IMAGE_CONFIG_E.BACK_SCALE[value] };
                CONFIG.PARTS.BACK_SCALE.src = `${pathImagesE}/backscales/${bodyColor}.png`;
                break;
              default:
                CONFIG.PARTS.BACK_SCALE = { ...CONFIG.PARTS.BACK_SCALE, ...CONFIG.BACK_SCALE[value] };
                CONFIG.PARTS.BACK_SCALE.src = `${pathImages}/backscales/${value}/${bodyColor}.png`;
                break;
            }
            break;
          case 'tail':
            switch (value) {
              case 'a':
                CONFIG.PARTS.TAIL = { ...IMAGE_CONFIG_A.PARTS.TAIL, ...IMAGE_CONFIG_A.TAIL[value] };
                CONFIG.PARTS.TAIL.src = `${pathImagesA}/${key}/${bodyColor}.png`;
                break;
              case 'b':
                CONFIG.PARTS.TAIL = { ...IMAGE_CONFIG_B.PARTS.TAIL, ...IMAGE_CONFIG_B.TAIL[value] };
                CONFIG.PARTS.TAIL.src = `${pathImagesB}/${key}/${bodyColor}.png`;
                break;
              case 'c':
                CONFIG.PARTS.TAIL = { ...IMAGE_CONFIG_C.PARTS.TAIL, ...IMAGE_CONFIG_C.TAIL[value] };
                CONFIG.PARTS.TAIL.src = `${pathImagesC}/${key}/${bodyColor}.png`;
                break;
              case 'd':
                CONFIG.PARTS.TAIL = { ...IMAGE_CONFIG_D.PARTS.TAIL, ...IMAGE_CONFIG_D.TAIL[value] };
                CONFIG.PARTS.TAIL.src = `${pathImagesD}/${key}/${bodyColor}.png`;
                break;
              case 'e':
                CONFIG.PARTS.TAIL = { ...IMAGE_CONFIG_E.PARTS.TAIL, ...IMAGE_CONFIG_E.TAIL[value] };
                CONFIG.PARTS.TAIL.src = `${pathImagesE}/${key}/${bodyColor}.png`;
                break;
              default:
                CONFIG.PARTS.TAIL = { ...CONFIG.PARTS.TAIL, ...CONFIG.TAIL[value] };
                CONFIG.PARTS.TAIL.src = `${pathImages}/${key}/${value}/${bodyColor}.png`;
                break;
            }
            break;
          case 'head':
            switch (value) {
              case 'a':
                CONFIG.PARTS.HEAD = { ...IMAGE_CONFIG_A.PARTS.HEAD, ...IMAGE_CONFIG_A.HEAD[value] };
                CONFIG.PARTS.HEAD.src = `${pathImagesA}/${key}/${bodyColor}.png`;
                break;
              case 'b':
                CONFIG.PARTS.HEAD = { ...IMAGE_CONFIG_B.PARTS.HEAD, ...IMAGE_CONFIG_B.HEAD[value] };
                CONFIG.PARTS.HEAD.src = `${pathImagesB}/${key}/${bodyColor}.png`;
                break;
              case 'c':
                CONFIG.PARTS.HEAD = { ...IMAGE_CONFIG_C.PARTS.HEAD, ...IMAGE_CONFIG_C.HEAD[value] };
                CONFIG.PARTS.HEAD.src = `${pathImagesC}/${key}/${bodyColor}.png`;
                break;
              case 'd':
                CONFIG.PARTS.HEAD = { ...IMAGE_CONFIG_D.PARTS.HEAD, ...IMAGE_CONFIG_D.HEAD[value] };
                CONFIG.PARTS.HEAD.src = `${pathImagesD}/${key}/${bodyColor}.png`;
                break;
              case 'e':
                CONFIG.PARTS.HEAD = { ...IMAGE_CONFIG_E.PARTS.HEAD, ...IMAGE_CONFIG_E.HEAD[value] };
                CONFIG.PARTS.HEAD.src = `${pathImagesE}/${key}/${bodyColor}.png`;
                break;
              default:
                CONFIG.PARTS.HEAD = { ...CONFIG.PARTS.HEAD, ...CONFIG.HEAD[value] };
                CONFIG.PARTS.HEAD.src = `${pathImages}/${key}/${value}/${bodyColor}.png`;
                break;
            }
            break;
          case 'eyes':
            switch (value) {
              case 'a':
                CONFIG.PARTS.EYES = { ...IMAGE_CONFIG_A.PARTS.EYES, ...IMAGE_CONFIG_A.EYES[value][attributes.head] };
                CONFIG.PARTS.EYES.src = `${pathImagesA}/${key}/${bodyColor}.png`;
                break;
              case 'b':
                CONFIG.PARTS.EYES = { ...IMAGE_CONFIG_B.PARTS.EYES, ...IMAGE_CONFIG_B.EYES[value][attributes.head] };
                CONFIG.PARTS.EYES.src = `${pathImagesB}/${key}/${bodyColor}.png`;
                break;
              case 'c':
                CONFIG.PARTS.EYES = { ...IMAGE_CONFIG_C.PARTS.EYES, ...IMAGE_CONFIG_C.EYES[value][attributes.head] };
                CONFIG.PARTS.EYES.src = `${pathImagesC}/${key}/${bodyColor}.png`;
                break;
              case 'd':
                CONFIG.PARTS.EYES = { ...IMAGE_CONFIG_D.PARTS.EYES, ...IMAGE_CONFIG_D.EYES[value][attributes.head] };
                CONFIG.PARTS.EYES.src = `${pathImagesD}/${key}/${bodyColor}.png`;
                break;
              case 'e':
                CONFIG.PARTS.EYES = { ...IMAGE_CONFIG_E.PARTS.EYES, ...IMAGE_CONFIG_E.EYES[value][attributes.head] };
                CONFIG.PARTS.EYES.src = `${pathImagesE}/${key}/${bodyColor}.png`;
                break;
              default:
                CONFIG.PARTS.EYES = { ...CONFIG.PARTS.EYES, ...CONFIG.EYES[value][attributes.head] };
                CONFIG.PARTS.EYES.src = `${pathImages}/${key}/${value}/${bodyColor}.png`;
                break;
            }
            break;
          case 'chest':
            switch (value) {
              case 'a':
                CONFIG.PARTS.CHEST = { ...IMAGE_CONFIG_A.PARTS.CHEST, ...IMAGE_CONFIG_A.CHEST[value] };
                CONFIG.PARTS.CHEST.src = `${pathImagesA}/${key}/${tailColor}.png`;
                break;
              case 'b':
                CONFIG.PARTS.CHEST = { ...IMAGE_CONFIG_B.PARTS.CHEST, ...IMAGE_CONFIG_B.CHEST[value] };
                CONFIG.PARTS.CHEST.src = `${pathImagesB}/${key}/${tailColor}.png`;
                break;
              case 'c':
                CONFIG.PARTS.CHEST = { ...IMAGE_CONFIG_C.PARTS.CHEST, ...IMAGE_CONFIG_C.CHEST[value] };
                CONFIG.PARTS.CHEST.src = `${pathImagesC}/${key}/${tailColor}.png`;
                break;
              case 'd':
                CONFIG.PARTS.CHEST = { ...IMAGE_CONFIG_D.PARTS.CHEST, ...IMAGE_CONFIG_D.CHEST[value] };
                CONFIG.PARTS.CHEST.src = `${pathImagesD}/${key}/${tailColor}.png`;
                break;
              case 'e':
                CONFIG.PARTS.CHEST = { ...IMAGE_CONFIG_E.PARTS.CHEST, ...IMAGE_CONFIG_E.CHEST[value] };
                CONFIG.PARTS.CHEST.src = `${pathImagesE}/${key}/${tailColor}.png`;
                break;
              default:
                CONFIG.PARTS.CHEST = { ...CONFIG.PARTS.CHEST, ...CONFIG.CHEST[value] };
                CONFIG.PARTS.CHEST.src = `${pathImages}/${key}/${value}/${tailColor}.png`;
                break;
            }
            break;
          case 'wings':
            switch (value) {
              case 'a':
                CONFIG.PARTS.WING_LEFT = { ...IMAGE_CONFIG_A.PARTS.WING_LEFT, ...IMAGE_CONFIG_A.WING_LEFT[value] };
                CONFIG.PARTS.CHEST.src = `${pathImagesA}/${key}/${wingsColor}/left.png`;
                CONFIG.PARTS.WING_RIGHT = { ...IMAGE_CONFIG_A.PARTS.WING_RIGHT, ...IMAGE_CONFIG_A.WING_RIGHT[value] };
                CONFIG.PARTS.WING_RIGHT.src = `${pathImagesA}/${key}/${wingsColor}/right.png`;
                break;
              case 'b':
                CONFIG.PARTS.WING_LEFT = { ...IMAGE_CONFIG_B.PARTS.WING_LEFT, ...IMAGE_CONFIG_B.WING_LEFT[value] };
                CONFIG.PARTS.CHEST.src = `${pathImagesB}/${key}/${wingsColor}/left.png`;
                CONFIG.PARTS.WING_RIGHT = { ...IMAGE_CONFIG_B.PARTS.WING_RIGHT, ...IMAGE_CONFIG_B.WING_RIGHT[value] };
                CONFIG.PARTS.WING_RIGHT.src = `${pathImagesB}/${key}/${wingsColor}/right.png`;
                break;
              case 'c':
                CONFIG.PARTS.WING_LEFT = { ...IMAGE_CONFIG_C.PARTS.WING_LEFT, ...IMAGE_CONFIG_C.WING_LEFT[value] };
                CONFIG.PARTS.CHEST.src = `${pathImagesC}/${key}/${wingsColor}/left.png`;
                CONFIG.PARTS.WING_RIGHT = { ...IMAGE_CONFIG_C.PARTS.WING_RIGHT, ...IMAGE_CONFIG_C.WING_RIGHT[value] };
                CONFIG.PARTS.WING_RIGHT.src = `${pathImagesC}/${key}/${wingsColor}/right.png`;
                break;
              case 'd':
                CONFIG.PARTS.WING_LEFT = { ...IMAGE_CONFIG_D.PARTS.WING_LEFT, ...IMAGE_CONFIG_D.WING_LEFT[value] };
                CONFIG.PARTS.CHEST.src = `${pathImagesD}/${key}/${wingsColor}/left.png`;
                CONFIG.PARTS.WING_RIGHT = { ...IMAGE_CONFIG_D.PARTS.WING_RIGHT, ...IMAGE_CONFIG_D.WING_RIGHT[value] };
                CONFIG.PARTS.WING_RIGHT.src = `${pathImagesD}/${key}/${wingsColor}/right.png`;
                break;
              case 'e':
                CONFIG.PARTS.WING_LEFT = { ...IMAGE_CONFIG_E.PARTS.WING_LEFT, ...IMAGE_CONFIG_E.WING_LEFT[value] };
                CONFIG.PARTS.CHEST.src = `${pathImagesE}/${key}/${wingsColor}/left.png`;
                CONFIG.PARTS.WING_RIGHT = { ...IMAGE_CONFIG_E.PARTS.WING_RIGHT, ...IMAGE_CONFIG_E.WING_RIGHT[value] };
                CONFIG.PARTS.WING_RIGHT.src = `${pathImagesE}/${key}/${wingsColor}/right.png`;
                break;
              default:
                CONFIG.PARTS.WING_LEFT = { ...CONFIG.PARTS.WING_LEFT, ...CONFIG.WING_LEFT[value] };
                CONFIG.PARTS.WING_LEFT.src = `${pathImages}/${key}/${value}/${wingsColor}/left.png`;
                CONFIG.PARTS.WING_RIGHT = { ...CONFIG.PARTS.WING_RIGHT, ...CONFIG.WING_RIGHT[value] };
                CONFIG.PARTS.WING_RIGHT.src = `${pathImages}/${key}/${value}/${wingsColor}/right.png`;
                break;
            }
            break;
          default:
            break;
        }
      }
    }
    const data = await packageImage(id, {
      PARTS: CONFIG.PARTS,
      imageInfo: CONFIG.imageInfo
    });
    AMPQ.sendDataToQueue(WORKER_NAME.RESIZE_IMAGE, data);
    return data;
  } catch (error) {
    console.error('Error packageImageDragon: ', error);
  }
}

export async function packageImageDragonSpine(id, classDragon, attributes, randomClass = '') {
  try {
    if (classDragon === DRAGON_CLASS.LEGEND) return;
    const dragonConfig = {
      dragonType: classDragon,
      parts: {}
    };
    const CONFIGMUTATION = ['a', 'b', 'c', 'd', 'e'];
    const CONFIGSCLASS = ['WOOD', 'METAL', 'WATER', 'EARTH', 'FIRE'];
    let classDr = '';
    const random = randomClass !== '' ? randomClass : Math.floor(Math.random() * CONFIGMUTATION.length);
    if (classDragon === DRAGON_CLASS.YINYANG) {
      dragonConfig.dragonType = CONFIGSCLASS[random];
      classDr = CONFIGMUTATION[random];
      if (randomClass === '') {
        await packageImageDragon(id, classDragon, Object.assign({}, attributes), random);
      }
    }
    let bodyColor; let wingsColor; let tailColor;
    switch (parseInt(attributes.bodyColor, 0)) {
      case 0:
      case 5:
      case 'a':
        bodyColor = 0;
        break;
      case 1:
      case 6:
      case 'b':
        bodyColor = 1;
        break;
      case 2:
      case 7:
      case 'c':
        bodyColor = 2;
        break;
      case 3:
      case 8:
      case 'd':
        bodyColor = 3;
        break;
      case 4:
      case 9:
      case 'e':
        bodyColor = 4;
        break;
      default:
        bodyColor = 0;
        break;
    }
    delete attributes.bodyColor;
    switch (parseInt(attributes.wingsColor, 0)) {
      case 0:
      case 5:
      case 'a':
        wingsColor = 0;
        break;
      case 1:
      case 6:
      case 'b':
        wingsColor = 1;
        break;
      case 2:
      case 7:
      case 'c':
        wingsColor = 2;
        break;
      case 3:
      case 8:
      case 'd':
        wingsColor = 3;
        break;
      case 4:
      case 9:
      case 'e':
        wingsColor = 4;
        break;
      default:
        wingsColor = 0;
        break;
    }
    delete attributes.wingsColor;
    switch (parseInt(attributes.tailColor, 0)) {
      case 0:
      case 5:
      case 'a':
        tailColor = 0;
        break;
      case 1:
      case 6:
      case 'b':
        tailColor = 1;
        break;
      case 2:
      case 7:
      case 'c':
        tailColor = 2;
        break;
      case 3:
      case 8:
      case 'd':
        tailColor = 3;
        break;
      case 4:
      case 9:
      case 'e':
        tailColor = 4;
        break;
      default:
        tailColor = 0;
        break;
    }
    if (CONFIGMUTATION.indexOf(classDr) !== -1) {
      dragonConfig.parts.BODY = {
        index: CONFIGMUTATION[random]
      };
      dragonConfig.parts.FRONT_RIGHT_FOOT = {
        index: CONFIGMUTATION[random]
      };
      dragonConfig.parts.FRONT_LEFT_FOOT = {
        index: CONFIGMUTATION[random]
      };
      dragonConfig.parts.BEHIND_RIGHT_FOOT = {
        index: CONFIGMUTATION[random]
      };
      dragonConfig.parts.BEHIND_LEFT_FOOT = {
        index: CONFIGMUTATION[random]
      };
    } else {
      dragonConfig.parts.BODY = {
        index: bodyColor,
        color: bodyColor,
      };
      dragonConfig.parts.FRONT_RIGHT_FOOT = {
        index: bodyColor,
        color: bodyColor,
      };
      dragonConfig.parts.FRONT_LEFT_FOOT = {
        index: bodyColor,
        color: bodyColor,
      };
      dragonConfig.parts.BEHIND_RIGHT_FOOT = {
        index: bodyColor,
        color: bodyColor,
      };
      dragonConfig.parts.BEHIND_LEFT_FOOT = {
        index: bodyColor,
        color: bodyColor,
      };
    }
    delete attributes.tailColor;
    for (const [key, value] of Object.entries(attributes)) {
      switch (key) {
        case 'horns':
          if (value != 0) {
            dragonConfig.parts.RIGHT_HORN = {
              index: Number(value) >= 0 ? parseInt(value, 0) : value,
              color: bodyColor,
            };
          }
          break;
        case 'middlehorns':
          if (value != 0) {
            dragonConfig.parts.MIDDLE_HORN = {
              index: Number(value) >= 0 ? parseInt(value, 0) : value,
              color: bodyColor,
            };
          }
          break;
        case 'backcales':
          dragonConfig.parts.BACK_SCALE = {
            index: Number(value) >= 0 ? parseInt(value, 0) : value,
            color: bodyColor,
          };
          break;
        case 'tail':
          dragonConfig.parts.TAIL = {
            index: Number(value) >= 0 ? parseInt(value, 0) : value,
            color: bodyColor,
          };
          break;
        case 'head':
          dragonConfig.parts.HEAD = {
            index: Number(value) >= 0 ? parseInt(value, 0) : value,
            color: bodyColor,
          };
          break;
        case 'chest':
          dragonConfig.parts.CHEST = {
            index: Number(value) >= 0 ? parseInt(value, 0) : value,
            color: tailColor,
          };
          break;
        case 'wings':
          dragonConfig.parts.WING_RIGHT = {
            index: Number(value) >= 0 ? parseInt(value, 0) : value,
            color: wingsColor,
          };
          break;
        default:
          break;
      }
    }
    await packAtlas(dragonConfig, id);
  } catch (error) {
    console.error('Error packageImageDragon: ', error);
  }
}
