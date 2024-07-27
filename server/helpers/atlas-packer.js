import { packAtlasImages, packImages, packImagesAsync } from './pack-image-spine';
import fs from 'fs'
import { DRAGON_RES_DIR, DRAGON_TYPE, BODY_PART_DIR, DragonSkeletons, ROOT_PATH } from '../constants'
import { mkDir } from './file.helper';

const getDragonPartSrc = (dragonType, partID, index, color) => {
  let rootURL = DRAGON_RES_DIR[dragonType]
  switch (partID) {
    case 'HEAD':
      return [
        {
          index: index,
          key: 'HEAD',
          src: `${rootURL}${BODY_PART_DIR[partID]}/${index}/${color}_1.png`
        },
        {
          index: index,
          key: 'HEAD2',
          src: `${rootURL}${BODY_PART_DIR[partID]}/${index}/${color}_2.png`
        },
        {
          index: index,
          key: 'TONGUE',
          src: `${rootURL}${BODY_PART_DIR[partID]}/TONGUE.png`
        }
      ]
    case 'TAIL':
    case 'EYES':
    case 'CHEST':
    case 'BACK_SCALE':
      return [{
        index: index,
        key: partID,
        src: `${rootURL}${BODY_PART_DIR[partID]}/${index}/${color}.png`
      }
      ]
    case 'BODY': {
      return [{
        index: index,
        key: partID,
        src: `${rootURL}${BODY_PART_DIR[partID]}/${index}/body.png`
      }]
    }
    case 'RIGHT_HORN': {
      return [{
        index: index,
        key: partID,
        src: `${rootURL}${BODY_PART_DIR[partID]}/${index}/${color}/right.png`
      }]
    }
    case 'LEFT_HORN': {
      // return `${rootURL}${BODY_PART_DIR[partID]}/${index + 1}/${color}/left.png`
      return [];
    }
    case 'MIDDLE_HORN': {
      return [{
        key: partID,
        index: index,
        src: `${rootURL}${BODY_PART_DIR[partID]}/${index}/${color}.png`
      }]
    }
    case 'WING_LEFT': {
      // return `${rootURL}${BODY_PART_DIR[partID]}/${index}/${color}/left.png`
      return [];
    }
    case 'WING_RIGHT': {
      if (index == 5 || index == 7) {
        return [{
          index: index,
          key: partID,
          src: `${rootURL}${BODY_PART_DIR[partID]}/${index}/${color}/right_1.png`
        }, {
          index: index,
          key: 'wing-effect',
          src: `${rootURL}${BODY_PART_DIR[partID]}/${index}/wing-effect.png`
        }]
      }
      return [{
        index: index,
        key: partID,
        src: `${rootURL}${BODY_PART_DIR[partID]}/${index}/${color}/right.png`
      }]
    }
    case 'FRONT_LEFT_FOOT': {
      return [{
        index: index,
        key: partID,
        src: `${rootURL}${BODY_PART_DIR[partID]}/${index}/left_front_leg.png`
      }]
    }
    case 'BEHIND_LEFT_FOOT': {
      return [{
        index: index,
        key: partID,
        src: `${rootURL}${BODY_PART_DIR[partID]}/${index}/left_back_leg.png`
      }]
    }
    case 'FRONT_RIGHT_FOOT': {
      return [{
        index: index,
        key: 'FRONT_RIGHT_FOOT',
        src: `${rootURL}${BODY_PART_DIR[partID]}/${color}/right_front_leg_1.png`
      }, {
        index: index,
        key: 'FRONT_RIGHT_FOOT2',
        src: `${rootURL}${BODY_PART_DIR[partID]}/${color}/right_front_leg_2.png`
      }]
      // return `${rootURL}${BODY_PART_DIR[partID]}/${index}/right_front_leg.png`
    }
    case 'BEHIND_RIGHT_FOOT': {
      return [{
        index: index,
        key: partID,
        src: `${rootURL}${BODY_PART_DIR[partID]}/${index}/right_back_leg.png`
      }]
    }
    default: break;
  }
}

const getSpecialImgPartSrc = (type, partID, index, color) => {
  let rootURL = DRAGON_RES_DIR[index]
  switch (partID) {
    case 'HEAD':
      return [
        {
          index,
          key: 'HEAD',
          src: `${rootURL}${BODY_PART_DIR[partID]}/${color}_1.png`
        },
        {
          index,
          key: 'HEAD2',
          src: `${rootURL}${BODY_PART_DIR[partID]}/${color}_2.png`
        },
        {
          index,
          key: 'TONGUE',
          src: `${rootURL}${BODY_PART_DIR[partID]}/TONGUE.png`
        }
      ]
    case 'TAIL':
    case 'EYES':
    case 'CHEST':
    case 'BACK_SCALE': {
      return [{
        index,
        key: partID,
        src: `${rootURL}${BODY_PART_DIR[partID]}/${color}.png`
      }]
    }
    case 'BODY': {
      return [{
        index,
        key: partID,
        src: `${rootURL}${BODY_PART_DIR[partID]}/body.png`
      }]
    }
    case 'RIGHT_HORN': {
      if (index === 'c' || index === 'a') {
        return [{
          index,
          key: partID,
          src: `${rootURL}${BODY_PART_DIR[partID]}/${color}/right_1.png`
        },
        {
          index,
          key: 'horn-effect',
          src: `${rootURL}${BODY_PART_DIR[partID]}/${color}/horn-effect.png`
        }]
      }
      return [{
        index,
        key: partID,
        src: `${rootURL}${BODY_PART_DIR[partID]}/${color}/right.png`
      }]
    }
    case 'LEFT_HORN': {
      return [{
        index,
        key: partID,
        src: `${rootURL}${BODY_PART_DIR[partID]}/${color}/right_1.png`
      }]
    }
    case 'MIDDLE_HORN': {
      return [{
        index,
        key: partID,
        src: `${rootURL}${BODY_PART_DIR[partID]}/${color}.png`
      }]
    }
    case 'WING_LEFT': {
      // return [{
      //   key: partID,
      //   src: `${rootURL}${BODY_PART_DIR[partID]}/${color}/left.png`
      // }]
      return []
    }
    case 'WING_RIGHT': {
      if (index == 'c') {
        return [{
          index,
          key: partID,
          src: `${rootURL}${BODY_PART_DIR[partID]}/${color}/right_1.png`
        },
        {
          index,
          key: 'wing-effect',
          src: `${rootURL}${BODY_PART_DIR[partID]}/wing-effect.png`
        }]
      }

      return [{
        index,
        key: partID,
        src: `${rootURL}${BODY_PART_DIR[partID]}/${color}/right.png`
      }]
    }
    case 'FRONT_LEFT_FOOT': {
      return [{
        index,
        key: partID,
        src: `${rootURL}${BODY_PART_DIR[partID]}/left_front_leg.png`
      }]
    }
    case 'BEHIND_LEFT_FOOT': {
      return [{
        index,
        key: partID,
        src: `${rootURL}${BODY_PART_DIR[partID]}/left_back_leg.png`
      }]
    }
    case 'FRONT_RIGHT_FOOT': {
      // return [{
      //   index,
      //   key: partID,
      //   src: `${rootURL}${BODY_PART_DIR[partID]}/right_front_leg.png`
      // }]
      return [{
        index: index,
        key: 'FRONT_RIGHT_FOOT',
        src: `${rootURL}${BODY_PART_DIR[partID]}/right_front_leg_1.png`
      }, {
        index: index,
        key: 'FRONT_RIGHT_FOOT2',
        src: `${rootURL}${BODY_PART_DIR[partID]}/right_front_leg_2.png`
      }]
    }
    case 'BEHIND_RIGHT_FOOT': {
      return [{
        index,
        key: partID,
        src: `${rootURL}${BODY_PART_DIR[partID]}/right_back_leg.png`
      }]
    }
    default: break;
  }
}
const getDragonResourceUrl = (dragonConfig) => {
  const { parts, dragonType } = dragonConfig
  let res = []
  Object.keys(parts).map(key => {
    const { index, color } = parts[key];
    if (!isNaN(index)) {
      const partRes = getDragonPartSrc(dragonType, key, index, color)
      if (partRes.length > 0) {
        res = res.concat(partRes)

      }
    } else {
      const partRes = getSpecialImgPartSrc(dragonType, key, index, color)
      if (partRes.length > 0) {
        res = res.concat(partRes)
      }
    }
  })
  const config = { PARTS: {} };
  res.forEach(it => {
    config.PARTS[it.key] = {
      index: it.index,
      src: it.src
    }
  })
  return config;
}
const createAnimationFile = (dragonConfig) => {
  const skeleton = { ...DragonSkeletons[0].skeleton, images: "./" }
  const baseSekeleton = { ...DragonSkeletons[0], skeleton: { ...skeleton } };
  const specialIndex = {
    a: 10,
    b: 11,
    c: 12,
    d: 13,
    e: 14
  }
  Object.keys(dragonConfig.PARTS).forEach(part => {
    const { index } = dragonConfig.PARTS[part];
    switch (part) {
      case 'BACK_SCALE': {
        if (!isNaN(index)) {
          const partDetail = DragonSkeletons[index].skins[0].attachments[part];
          baseSekeleton.skins[0].attachments[part] = { ...partDetail }
        } else {
          const partDetail = DragonSkeletons[specialIndex[index]].skins[0].attachments[part];
          baseSekeleton.skins[0].attachments[part] = { ...partDetail }
        }
        break;
      }
      case 'CHEST': {
        if (!isNaN(index)) {
          const partDetail = DragonSkeletons[index].skins[0].attachments[part];
          baseSekeleton.skins[0].attachments[part] = { ...partDetail }
        } else {
          const partDetail = DragonSkeletons[specialIndex[index]].skins[0].attachments[part];
          baseSekeleton.skins[0].attachments[part] = { ...partDetail }
        }
        break;
      }
      case 'EYES': {
        break;
      }
      case 'HEAD': {
        if (!isNaN(index)) {
          const partDetail = DragonSkeletons[index].skins[0].attachments[part]
          baseSekeleton.skins[0].attachments[part] = { ...partDetail }
        } else {
          const partDetail = DragonSkeletons[specialIndex[index]].skins[0].attachments[part];
          baseSekeleton.skins[0].attachments[part] = { ...partDetail }
        }

        if (!isNaN(index)) {
          const head2 = DragonSkeletons[index].skins[0].attachments['HEAD2']
          baseSekeleton.skins[0].attachments['HEAD2'] = { ...head2 }
        } else {
          const head2 = DragonSkeletons[specialIndex[index]].skins[0].attachments['HEAD2'];
          baseSekeleton.skins[0].attachments['HEAD2'] = { ...head2 }
        }
        break;
      }
      case 'MIDDLE_HORN':
      case 'LEFT_HORN':
      case 'RIGHT_HORN': {
        if (!isNaN(index)) {
          const partDetail = DragonSkeletons[index].skins[0].attachments[part]
          baseSekeleton.skins[0].attachments[part] = { ...partDetail }

          const horn_effect2 = DragonSkeletons[index].skins[0].attachments['horn_effect2']
          baseSekeleton.skins[0].attachments['horn_effect2'] = { ...horn_effect2 }

          const horn_effect_left1 = DragonSkeletons[index].skins[0].attachments['horn_effect_left1']
          baseSekeleton.skins[0].attachments['horn_effect_left1'] = { ...horn_effect_left1 }

        } else {
          const partDetail = DragonSkeletons[specialIndex[index]].skins[0].attachments[part];
          baseSekeleton.skins[0].attachments[part] = { ...partDetail }
          if ((index === 'a' || index == 'c') && part === 'RIGHT_HORN') {
            const slotLeftIndex = baseSekeleton.slots.findIndex(it => it.name === 'horn_effect_left1');
            if (slotLeftIndex != -1) {
              const slotLeft = { ...baseSekeleton.slots[slotLeftIndex] };
              slotLeft.attachment = 'horn-effect'
              baseSekeleton.slots[slotLeftIndex] = { ...slotLeft }
            }

            const slotRightIndex = baseSekeleton.slots.findIndex(it => it.name === 'horn_effect2');
            if (slotRightIndex != -1) {
              const slotRight = { ...baseSekeleton.slots[slotRightIndex] };
              slotRight.attachment = 'horn-effect'
              baseSekeleton.slots[slotRightIndex] = { ...slotRight }
            }

            const animations = { ...baseSekeleton.animations };
            Object.keys(animations).forEach(key => {
              const slots = { ...animations[key].slots };
              if (DragonSkeletons[specialIndex[index]].animations[key].slots && DragonSkeletons[specialIndex[index]].animations[key].slots['horn_effect2']) {
                slots['horn_effect2'] = { ...DragonSkeletons[specialIndex[index]].animations[key].slots['horn_effect2'] };
              }
              if (DragonSkeletons[specialIndex[index]].animations[key].slots && DragonSkeletons[specialIndex[index]].animations[key].slots['horn_effect_left1']) {
                slots['horn_effect_left1'] = { ...DragonSkeletons[specialIndex[index]].animations[key].slots['horn_effect_left1'] };
              }

              animations[key].slots = { ...slots }
            })
            baseSekeleton.animations = { ...animations }
          }
        }
        break;
      }


      case 'TAIL': {
        let mergeDragonIndex = !isNaN(index) ? index : specialIndex[index]
        const tailNewBone = DragonSkeletons[mergeDragonIndex].bones.findIndex(it => it.name === 'tail')
        const tailBaseBone = baseSekeleton.bones.findIndex(it => it.name === 'tail')
        if (tailNewBone != -1 && tailBaseBone != -1) {
          baseSekeleton.bones[tailBaseBone].x = DragonSkeletons[mergeDragonIndex].bones[tailNewBone].x;
          baseSekeleton.bones[tailBaseBone].y = DragonSkeletons[mergeDragonIndex].bones[tailNewBone].y;
        }
        if (!isNaN(index)) {
          const partDetail = DragonSkeletons[index].skins[0].attachments[part]
          baseSekeleton.skins[0].attachments[part] = { ...partDetail }
        } else {
          const partDetail = DragonSkeletons[specialIndex[index]].skins[0].attachments[part];
          baseSekeleton.skins[0].attachments[part] = { ...partDetail }
        }
        break;
      }
      case 'WING_RIGHT': {
        if (!isNaN(index)) {
          const wingleft = DragonSkeletons[index].skins[0].attachments['WING_RIGHT2']
          baseSekeleton.skins[0].attachments['WING_RIGHT2'] = { ...wingleft }
        } else {
          const wingleft = DragonSkeletons[specialIndex[index]].skins[0].attachments['WING_RIGHT2'];
          baseSekeleton.skins[0].attachments['WING_RIGHT2'] = { ...wingleft }
        }
        let mergeDragonIndex = !isNaN(index) ? index : specialIndex[index]
        const wingRightNewBone = DragonSkeletons[mergeDragonIndex].bones.findIndex(it => it.name === 'wr2')
        const wingRightBaseBone = baseSekeleton.bones.findIndex(it => it.name === 'wr2')
        if (wingRightNewBone != -1 && wingRightBaseBone != -1) {
          baseSekeleton.bones[wingRightBaseBone].rotation = DragonSkeletons[mergeDragonIndex].bones[wingRightNewBone].rotation;
          baseSekeleton.bones[wingRightBaseBone].x = DragonSkeletons[mergeDragonIndex].bones[wingRightNewBone].x;
          baseSekeleton.bones[wingRightBaseBone].y = DragonSkeletons[mergeDragonIndex].bones[wingRightNewBone].y;
        }

        const partDetail = DragonSkeletons[mergeDragonIndex].skins[0].attachments[part]
        baseSekeleton.skins[0].attachments[part] = { ...partDetail }
        if (index === 5 || index == 7 || index === 'c') {
          const slotWingEffectIndex = baseSekeleton.slots.findIndex(it => it.name === 'wing-effect');
          if (slotWingEffectIndex != -1) {
            const slotWing = { ...baseSekeleton.slots[slotWingEffectIndex] };
            slotWing.attachment = 'wing-effect'
            baseSekeleton.slots[slotWingEffectIndex] = { ...slotWing }
          }
          const animations = { ...baseSekeleton.animations };
          Object.keys(animations).forEach(key => {
            const slots = { ...animations[key].slots };
            if (DragonSkeletons[mergeDragonIndex].animations[key].slots && DragonSkeletons[mergeDragonIndex].animations[key].slots['wing-effect']) {
              slots['wing-effect'] = { ...DragonSkeletons[mergeDragonIndex].animations[key].slots['wing-effect'] };
            }

            animations[key].slots = { ...slots }
          })
          baseSekeleton.animations = { ...animations }
        }
        break;
      }
      case 'FRONT_LEFT_FOOT':
      case 'BEHIND_LEFT_FOOT':
      case 'BEHIND_RIGHT_FOOT': {
        if (!isNaN(index)) {
          const partDetail = DragonSkeletons[index].skins[0].attachments[part]
          baseSekeleton.skins[0].attachments[part] = { ...partDetail }
        } else {
          const partDetail = DragonSkeletons[specialIndex[index]].skins[0].attachments[part];
          baseSekeleton.skins[0].attachments[part] = { ...partDetail }
        }
        break;
      }
      case 'FRONT_RIGHT_FOOT': {
        if (!isNaN(index)) {
          const partDetail = DragonSkeletons[index].skins[0].attachments[part]
          baseSekeleton.skins[0].attachments[part] = { ...partDetail }
        } else {
          const partDetail = DragonSkeletons[specialIndex[index]].skins[0].attachments[part];
          baseSekeleton.skins[0].attachments[part] = { ...partDetail }
        }
        if (!isNaN(index)) {
          const partDetail = DragonSkeletons[index].skins[0].attachments['a-l2']
          baseSekeleton.skins[0].attachments['a-l2'] = { ...partDetail }
        } else {
          const partDetail = DragonSkeletons[specialIndex[index]].skins[0].attachments['a-l2'];
          baseSekeleton.skins[0].attachments['a-l2'] = { ...partDetail }
        }
        break;
      }
      case 'TONGUE': {
        if (!isNaN(index)) {
          const partDetail = DragonSkeletons[index].skins[0].attachments[part]
          baseSekeleton.skins[0].attachments[part] = { ...partDetail }
        } else {
          const partDetail = DragonSkeletons[specialIndex[index]].skins[0].attachments[part];
          baseSekeleton.skins[0].attachments[part] = { ...partDetail }
        }
        break;
      }
    }
  })
  return { ...baseSekeleton }
}

export async function packAtlas(dragonConfig, id) {
  const imageConfig = getDragonResourceUrl(dragonConfig);
  const skeleton = createAnimationFile(imageConfig)
  const dest = `${ROOT_PATH}/resource/spine/${id}/`;
  mkDir(dest);
  fs.writeFile(`${dest}/${id}.json`, JSON.stringify(skeleton), err => { });
  packAtlasImages(imageConfig, dest, id)
}

