import { HexValidationResult } from '../types';

export const normalizeHex = (input: string): string => {
  // Remove whitespace, newlines, and '0x' prefix
  return input.replace(/[\s\n\r]/g, '').replace(/^0x/i, '');
};

export const validateAndParseHex = (input: string): HexValidationResult => {
  const normalized = normalizeHex(input);

  if (!normalized) {
    return { isValid: true, normalizedHex: '', bytes: new Uint8Array(0) };
  }

  // Check for non-hex characters
  if (!/^[0-9a-fA-F]*$/.test(normalized)) {
    return {
      isValid: false,
      normalizedHex: normalized,
      error: '유효하지 않은 16진수 문자(0-9, A-F)가 포함되어 있습니다.',
    };
  }

  // Check for even length
  if (normalized.length % 2 !== 0) {
    return {
      isValid: false,
      normalizedHex: normalized,
      error: 'HEX 문자열 길이가 홀수입니다. 각 바이트는 2글자여야 합니다.',
    };
  }

  try {
    const bytes = new Uint8Array(normalized.length / 2);
    for (let i = 0; i < normalized.length; i += 2) {
      bytes[i / 2] = parseInt(normalized.substring(i, i + 2), 16);
    }
    return { isValid: true, normalizedHex: normalized, bytes };
  } catch (e) {
    return {
      isValid: false,
      normalizedHex: normalized,
      error: '바이트 배열 변환에 실패했습니다.',
    };
  }
};

export const formatBytePreview = (bytes: Uint8Array, limit = 16): string => {
  if (bytes.length === 0) return '';
  const subset = Array.from(bytes.slice(0, limit));
  const hexStr = subset.map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ');
  return bytes.length > limit ? `${hexStr} ...` : hexStr;
};