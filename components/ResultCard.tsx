import React, { useState } from 'react';
import { DecodedResult } from '../types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Copy, Check, AlertCircle, AlertTriangle } from 'lucide-react';

interface ResultCardProps {
  result: DecodedResult;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine Badge Status
  let statusBadge;
  if (result.isError) {
    statusBadge = <Badge variant="destructive">오류</Badge>;
  } else if (result.hasReplacementChars) {
    statusBadge = <Badge variant="warning">부분 손실</Badge>;
  } else {
    statusBadge = <Badge variant="success">성공</Badge>;
  }

  return (
    <Card className="flex flex-col h-full hover:border-primary/50 transition-colors duration-200">
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-medium">
          {result.encoding}
        </CardTitle>
        {statusBadge}
      </CardHeader>
      
      <CardContent className="flex-1 min-h-[120px]">
        {result.isError ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 bg-destructive/10 rounded-md border border-destructive/20">
             <AlertCircle className="h-6 w-6 text-destructive mb-2" />
             <p className="text-sm text-destructive font-medium">{result.errorMessage}</p>
          </div>
        ) : (
          <div className="relative h-full group">
            {result.text.length === 0 ? (
               <div className="h-full flex items-center justify-center text-muted-foreground text-sm italic">
                 (결과 없음)
               </div>
            ) : (
              <div className="h-full max-h-[200px] overflow-y-auto whitespace-pre-wrap break-all rounded-md bg-muted/50 p-3 text-sm font-mono text-foreground border border-border">
                {result.text}
              </div>
            )}
            
            {result.hasReplacementChars && (
              <div className="mt-2 flex items-center gap-2 text-xs text-amber-600 dark:text-amber-500">
                <AlertTriangle className="h-3 w-3" />
                <span>대체 문자(\uFFFD) 포함됨 (깨짐 발생)</span>
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleCopy} 
          disabled={result.isError || !result.text}
          className="gap-2"
        >
          {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
          {copied ? '복사됨' : '복사'}
        </Button>
      </CardFooter>
    </Card>
  );
};