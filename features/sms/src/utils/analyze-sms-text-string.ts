/* eslint-disable no-useless-escape */
import memoize from 'lodash/memoize';

const segmentLimits = {
  sevenBit: {
    singlSmsCharLimit: 160,
    overSingleSmsCharLimit: 153,
  },
  unicode: {
    singlSmsCharLimit: 70,
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

    let characterCount = 0;

    message.split('').forEach((character, i) => {
      if (isUnicode) {
        characterCount += message.charCodeAt(i) < 0x10000 ? 1 : 2;
      } else {
        characterCount += gsm2CountChars.includes(character) ? 2 : 1;
      }
    });
    const messageLimit =
      characterCount <= segmentLimitsForEncodingType.singlSmsCharLimit
        ? segmentLimitsForEncodingType.singlSmsCharLimit
        : segmentLimitsForEncodingType.overSingleSmsCharLimit;

    return {
      isUnicode,
      characterCount,
      messageLimit,
      numberOfMessages: Math.ceil(characterCount / messageLimit),
    };
  }
);
