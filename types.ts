export enum EncodingType {
  UTF8 = 'UTF-8',
  CP949 = 'CP949',
  EUCKR = 'EUC-KR',
  UTF16LE = 'UTF-16LE',
  UTF16BE = 'UTF-16BE',
}

export interface DecodedResult {
  encoding: EncodingType;
  text: string;
  isError: boolean;
  errorMessage?: string;
  hasReplacementChars: boolean; // For warning state ()
}

export interface HexValidationResult {
  isValid: boolean;
  normalizedHex: string;
  error?: string;
  bytes?: Uint8Array;
}
