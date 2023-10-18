/* eslint-disable no-useless-escape */
import memoize from 'lodash/memoize';

const segmentLimits = {
  sevenBit: {
    singleSmsCharLimit: 160,
    overSingleSmsCharLimit: 153,
  },
  unicode: {
    singleSmsCharLimit: 70,
    overSingleSmsCharLimit: 67,
  },
} as const;

const gsm2CountChars = '^{}~][|€';

export const analyzeSmsTextString = memoize(
  (message: string | undefined = '') => {
    const nonGSMRegex =
      /[^@£$¥èéùìòÇ\fØø\n\rÅå_ÆæßÉ !"#$%&'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà^{}~[\]|€]/g;
    const isUnicode = nonGSMRegex.test(message);
    const segmentLimitsForEncodingType = isUnicode
      ? segmentLimits.unicode
      : segmentLimits.sevenBit;

    const characterCount = message.split('').reduce((acc, character, i) => {
      if (isUnicode) {
        return acc + (message.charCodeAt(i) < 0x10000 ? 1 : 2); // Checks for larger unicode characters like emojis
      }

      return acc + (gsm2CountChars.includes(character) ? 2 : 1);
    }, 0);
    const messageLimit =
      characterCount <= segmentLimitsForEncodingType.singleSmsCharLimit
        ? segmentLimitsForEncodingType.singleSmsCharLimit
        : segmentLimitsForEncodingType.overSingleSmsCharLimit;

    return {
      isUnicode,
      characterCount,
      messageLimit,
      numberOfMessages: Math.ceil(characterCount / messageLimit),
    };
  }
);
