import React, { useState, useEffect, useCallback, useRef } from 'react';
import { validateAndParseHex, formatBytePreview } from './utils/hex';
import { decodeBytes } from './services/decoder';
import { EncodingType, DecodedResult, HexValidationResult } from './types';
import { Card } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { ResultCard } from './components/ResultCard';
import { Zap, Trash2, RefreshCw, AlertOctagon, Terminal, Moon, Sun } from 'lucide-react';

const SUPPORTED_ENCODINGS = [
  EncodingType.UTF8,
  EncodingType.CP949,
  EncodingType.EUCKR,
  EncodingType.UTF16LE,
  EncodingType.UTF16BE,
];

export default function App() {
  const [inputHex, setInputHex] = useState('');
  const [isInstant, setIsInstant] = useState(false);
  const [validation, setValidation] = useState<HexValidationResult | null>(null);
  const [results, setResults] = useState<DecodedResult[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize Dark Mode based on system preference or storage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Debounce logic for Instant Mode
  const [debouncedHex, setDebouncedHex] = useState('');
  useEffect(() => {
    if (!isInstant) return;
    const timer = setTimeout(() => {
      setDebouncedHex(inputHex);
    }, 300);
    return () => clearTimeout(timer);
  }, [inputHex, isInstant]);

  const performConversion = useCallback((hexInput: string) => {
    const valResult = validateAndParseHex(hexInput);
    setValidation(valResult);

    if (valResult.isValid && valResult.bytes && valResult.bytes.length > 0) {
      const newResults = SUPPORTED_ENCODINGS.map(enc => 
        decodeBytes(valResult.bytes!, enc)
      );
      setResults(newResults);
    } else {
      setResults([]);
    }
  }, []);

  // Effect to trigger conversion on debounce
  useEffect(() => {
    if (isInstant) {
      performConversion(debouncedHex);
    }
  }, [debouncedHex, isInstant, performConversion]);

  const handleManualConvert = () => {
    performConversion(inputHex);
  };

  const handleReset = () => {
    setInputHex('');
    setResults([]);
    setValidation(null);
    if (textareaRef.current) textareaRef.current.focus();
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <span className="p-2 bg-primary rounded-lg text-primary-foreground">
                <Terminal className="h-6 w-6" />
              </span>
              HexDecoder
            </h1>
            <p className="mt-2 text-muted-foreground">
              HEX 값을 다양한 텍스트 형식으로 즉시 변환하세요.
            </p>
          </div>
          <div className="flex items-center gap-3">
             <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsInstant(!isInstant)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                isInstant 
                  ? 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800' 
                  : 'bg-muted text-muted-foreground border-transparent hover:bg-muted/80'
              }`}
            >
              <Zap className={`h-4 w-4 ${isInstant ? 'fill-current' : ''}`} />
              즉시 변환 모드: {isInstant ? '켜짐' : '꺼짐'}
            </button>
          </div>
        </div>

        {/* Input Section */}
        <Card className="p-1 shadow-md bg-card ring-1 ring-border">
          <div className="p-4 md:p-6 space-y-4">
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="hex-input" className="block text-sm font-medium text-foreground">
                HEX 입력
              </label>
              <span className="text-xs text-muted-foreground">
                '0x' 접두사, 공백, 줄바꿈 허용
              </span>
            </div>
            
            <textarea
              id="hex-input"
              ref={textareaRef}
              value={inputHex}
              onChange={(e) => setInputHex(e.target.value)}
              placeholder="예: 48 65 6c 6c 6f 20 57 6f 72 6c 64"
              className="block w-full rounded-lg border-input bg-muted/30 p-4 text-foreground font-mono text-sm shadow-inner focus:border-primary focus:ring-primary min-h-[140px] resize-y placeholder:text-muted-foreground/50"
              spellCheck={false}
            />

            {/* Validation & Byte Preview */}
            <div className="min-h-[24px]">
               {validation && !validation.isValid && (
                 <div className="flex items-center gap-2 text-destructive text-sm animate-in fade-in slide-in-from-top-1 duration-200">
                   <AlertOctagon className="h-4 w-4" />
                   {validation.error}
                 </div>
               )}
               {validation && validation.isValid && validation.bytes && validation.bytes.length > 0 && (
                 <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground font-mono">
                   <span className="bg-muted px-2 py-0.5 rounded text-foreground font-bold">
                     길이: {validation.bytes.length} 바이트
                   </span>
                   <span className="truncate max-w-full">
                     미리보기: {formatBytePreview(validation.bytes, 24)}
                   </span>
                 </div>
               )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button 
                onClick={handleManualConvert} 
                disabled={!inputHex || (isInstant && !!validation?.isValid)}
                className="flex-1 shadow-md"
                size="lg"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isInstant ? 'hidden' : ''}`} />
                {isInstant ? '변환 중...' : '변환하기'}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleReset}
                className="sm:w-32"
                size="lg"
              >
                <Trash2 className="mr-2 h-4 w-4 text-muted-foreground" />
                초기화
              </Button>
            </div>
          </div>
        </Card>

        {/* Results Grid */}
        {results.length > 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-lg font-semibold text-foreground">디코딩 결과</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {results.map((result) => (
                <ResultCard key={result.encoding} result={result} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State / Hint */}
        {results.length === 0 && !validation?.error && (
          <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
            <p className="text-muted-foreground text-sm">
              위 입력창에 유효한 HEX 코드를 입력하면 여러 인코딩 결과를 동시에 확인할 수 있습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}