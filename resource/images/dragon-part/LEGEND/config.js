const path = require('path');

export const IMAGE_CONFIG_LEGEND = {
  imageInfo: {
    exportTexture: 'DRAGON',
    cover: {
      width: 1800,
      height: 1400
    }
  },
  PARTS: {
    BEHIND_LEFT_FOOT: {
      zIndex: 0,
      anchor: 1,
      src: path.join(__dirname, 'body/left_back_leg.png'),
      x: 1217,
      y: 849
  },
    FRONT_LEFT_FOOT: {
      zIndex: 0,
      anchor: 1,
      src: path.join(__dirname, 'body/left_front_leg.png'),
      x: 1460,
      y: 818
    },
    WING_LEFT: {
      zIndex: 0,
      anchor: 1,
      src: path.join(__dirname, 'wings/left.png'),
      x: 319,
      y: 73
    },
    BODY: {
      zIndex: 1,
      anchor: 1,
      src: path.join(__dirname, 'body/body.png'),
      x: 1078,
      y: 379
    },
    CHEST: {
      zIndex: 2,
      anchor: 1,
      src: path.join(__dirname, 'chest/chest.png'),
      x: 1324,
      y: 433
    },
    BACK_SCALE: {
      zIndex: 3,
      anchor: 1,
      src: path.join(__dirname, 'backscales/backscales.png'),
      x: 1168,
      y: 206
    },
    HEAD: {
      zIndex: 4,
      anchor: 1,
      src: path.join(__dirname, 'head/head.png'),
      x: 1367,
      y: 330
    },
    LEFT_HORN: {
      zIndex: 0,
      anchor: 1,
      src: path.join(__dirname, 'horns/left.png'),
      x: 1360,
      y: 229
    },
    MIDDLE_HORN: {
      zIndex: 6,
      anchor: 1,
      src: path.join(__dirname, 'middlehorns/middlehorns.png'),
      x: 1521,
      y: 158
    },
    RIGHT_HORN: {
      zIndex: 6,
      anchor: 1,
      src: path.join(__dirname, 'horns/right.png'),
      x: 1320,
      y: 236
    },
    EYES: {
      zIndex: 7,
      anchor: 1,
      src: path.join(__dirname, 'eyes/eyes.png'),
      x: 1501,
      y: 336
    },
    WING_RIGHT: {
      zIndex: 10,
      anchor: 1,
      src: path.join(__dirname, 'wings/right.png'),
      x: 88,
      y: 65
    },
    TAIL: {
      zIndex: 9,
      anchor: 1,
      src: path.join(__dirname, 'tail/tail.png'),
      x: 919,
      y: 890
    },
    BEHIND_RIGHT_FOOT: {
      zIndex: 8,
      anchor: 1,
      src: path.join(__dirname, 'body/right_back_leg.png'),
      x: 1082,
      y: 886
    },
    FRONT_RIGHT_FOOT: {
      zIndex: 8,
      anchor: 1,
      src: path.join(__dirname, 'body/right_front_leg.png'),
      x: 1316,
      y: 785
    }
  }
};
