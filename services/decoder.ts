import { DecodedResult, EncodingType } from '../types';

const getBrowserLabel = (encoding: EncodingType): string => {
  switch (encoding) {
    case EncodingType.UTF8: return 'utf-8';
    case EncodingType.UTF16LE: return 'utf-16le';
    case EncodingType.UTF16BE: return 'utf-16be';
    // Most browsers map 'euc-kr' to the Encoding Standard's 'euc-kr' which includes CP949 extensions.
    case EncodingType.CP949: return 'euc-kr'; 
    case EncodingType.EUCKR: return 'euc-kr';
    default: return 'utf-8';
  }
};

export const decodeBytes = (bytes: Uint8Array, encoding: EncodingType): DecodedResult => {
  try {
    const label = getBrowserLabel(encoding);
    const decoder = new TextDecoder(label, { fatal: false });
    const text = decoder.decode(bytes);
    
    // Check for replacement character U+FFFD which indicates decoding issues
    const hasReplacementChars = text.includes('\uFFFD');

    return {
      encoding,
      text,
      isError: false,
      hasReplacementChars,
    };
  } catch (error) {
    let errorMessage = "알 수 없는 디코딩 오류";
    if (error instanceof RangeError) {
      errorMessage = `'${encoding}' 인코딩은 이 브라우저에서 지원되지 않습니다.`;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      encoding,
      text: '',
      isError: true,
      errorMessage,
      hasReplacementChars: false,
    };
  }
};