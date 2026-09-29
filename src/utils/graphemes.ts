// Split text into grapheme clusters (for complex scripts like Bangla)
export const splitGraphemes = (text: string): string[] => {
  if (typeof Intl !== 'undefined' && (Intl as any).Segmenter) {
    const segmenter = new (Intl as any).Segmenter('en', { granularity: 'grapheme' });
    return Array.from(segmenter.segment(text), (seg: any) => seg.segment);
  }
  return text.split('');
};
