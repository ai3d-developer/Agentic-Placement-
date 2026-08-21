import * as pdfjsLib from 'pdfjs-dist';

// Use web worker CDN matching pdfjs-dist version with unpkg fallback
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version || '3.11.174'}/build/pdf.worker.min.js`;
} catch (e) {
  console.warn('Worker options setup note:', e);
}

/**
 * Extract clean readable text from uploaded PDF, TXT, or DOC file
 */
export async function extractTextFromPdfFile(file: File): Promise<string> {
  if (file.name.toLowerCase().endsWith('.txt') || file.type === 'text/plain') {
    return await file.text();
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true,
      isEvalSupported: false
    });
    const pdf = await loadingTask.promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageStrings = textContent.items
        .map((item: any) => (item.str || ''))
        .filter((str: string) => str.trim().length > 0);
      fullText += pageStrings.join(' ') + '\n';
    }

    if (fullText.trim().length > 20) {
      return fullText.trim();
    }
  } catch (err) {
    console.warn('PDF.js extraction note, trying fallback stream decoder:', err);
  }

  // Stream decoder fallback (Latin1 and text token pattern extraction)
  try {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const rawString = new TextDecoder('latin1').decode(bytes);

    const textSegments: string[] = [];
    const parens = rawString.match(/\(([^()]{2,120})\)/g);
    if (parens) {
      parens.forEach(p => {
        const str = p.slice(1, -1).trim();
        if (str.length > 2 && /[a-zA-Z]/.test(str) && !str.includes('Font') && !str.includes('Obj')) {
          textSegments.push(str);
        }
      });
    }
    let extracted = textSegments.join(' ');
    if (extracted.length > 20) return extracted;

    // Direct ASCII word token regex search fallback
    const words = rawString.match(/[A-Za-z0-9#+.\-]{3,50}/g);
    if (words && words.length > 10) {
      extracted = words.join(' ');
      if (extracted.length > 20) return extracted;
    }
  } catch (e) {
    console.warn('Stream decoder note:', e);
  }

  return await file.text();
}

