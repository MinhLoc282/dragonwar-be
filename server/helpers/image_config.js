const IMG_PART_ANCHOR = {
  TOP_LEFT: 1, // 'TOP_LEFT',
  TOP_RIGHT: 2, //'TOP_RIGHT',
  BOTTOM_LEFT: 3, //'BOTTOM_LEFT',
  BOTTOM_RIGHT: 4, // 'BOTTOM_RIGHT',
  CENTER: 5 //'CENTER',
}
module.exports.IMAGE_ANCHOR = IMG_PART_ANCHOR
module.exports = {
  imageInfo: {
    exportTexture: 'DRAGON',
    cover: {
      width: 1024,
      height: 978
    }
  },
  parts: {
    BEHIND_LEFT_FOOT: {
      src: "../../resource/DRAGON_PART/BEHIND_LEFT_FOOT.png",
      zIndex: 0,
      x: 547,
      y: 727,
      anchor: IMG_PART_ANCHOR.TOP_LEFT
    },
    FRONT_LEFT_FOOT: {
      src: "../../resource/DRAGON_PART/FRONT_LEFT_FOOT.png",
      zIndex: 0,
      x: 806,
      y: 705,
      anchor: IMG_PART_ANCHOR.TOP_LEFT
    },
    WING_LEFT: {
      src: "../../resource/DRAGON_PART/WING_LEFT.png",
      zIndex: 0,
      x: 847,
      y: 609,
      anchor: IMG_PART_ANCHOR.BOTTOM_RIGHT
    },
    BODY: {
      src: "../../resource/DRAGON_PART/BODY.png",
      zIndex: 1,
      x: 508,
      y: 450,
      anchor: IMG_PART_ANCHOR.TOP_LEFT
    },

    CHEST: {
      src: "./DRAGON_PART/CHEST.png",
      zIndex: 2,
      x: 835,
      y: 642,
      anchor: IMG_PART_ANCHOR.CENTER
    },
    BACK_SCALE: {
      src: "./DRAGON_PART/BACK_SCALE.png",
      zIndex: 3,
      x: 719,
      y: 420,
      anchor: IMG_PART_ANCHOR.CENTER
    },
    HEAD: {
      src: "./DRAGON_PART/HEAD.png",
      zIndex: 4,
      x: 803,
      y: 379,
      anchor: IMG_PART_ANCHOR.CENTER
    },

    LEFT_HORN: {
      src: "./DRAGON_PART/LEFT_HORN.png",
      zIndex: 5,
      x: 895,
      y: 383,
      anchor: IMG_PART_ANCHOR.BOTTOM_RIGHT
    },
    MIDDLE_HORN: {
      src: "./DRAGON_PART/MIDDLE_HORN.png",
      zIndex: 6,
      x: 913,
      y: 447,
      anchor: IMG_PART_ANCHOR.BOTTOM_RIGHT
    },

    RIGHT_HORN: {
      src: "./DRAGON_PART/RIGHT_HORN.png",
      zIndex: 6,
      x: 832,
      y: 407,
      anchor: IMG_PART_ANCHOR.BOTTOM_RIGHT
    },
    EYES: {
      src: "./DRAGON_PART/EYES.png",
      zIndex: 7,
      x: 813,
      y: 398,
      anchor: IMG_PART_ANCHOR.TOP_LEFT
    },
    WING_RIGHT: {
      src: "./DRAGON_PART/WING_RIGHT.png",
      zIndex: 7,
      x: 700,
      y: 612,
      anchor: IMG_PART_ANCHOR.BOTTOM_RIGHT
    },
    TAIL: {
      src: "./DRAGON_PART/TAIL.png",
      zIndex: 7,
      x: 459,
      y: 641,
      anchor: IMG_PART_ANCHOR.TOP_RIGHT
    },

    BEHIND_RIGHT_FOOT: {
      src: "./DRAGON_PART/BEHIND_RIGHT_FOOT.png",
      zIndex: 8,
      x: 562,
      y: 591,
      anchor: IMG_PART_ANCHOR.TOP_RIGHT
    },
    FRONT_RIGHT_FOOT: {
      src: "./DRAGON_PART/FRONT_RIGHT_FOOT.png",
      zIndex: 8,
      x: 668,
      y: 643,
      anchor: IMG_PART_ANCHOR.TOP_LEFT
    }
  }
}
