import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import * as path from 'path';
import { stripHtml } from "string-strip-html";

import winkNLP from 'wink-nlp';
import model from 'wink-eng-lite-web-model';
import natural from 'natural';

export const asyncForEach = async <T = any>(
  array: T[],
  callback: (item: T, index: number, self: T[]) => void,
): Promise<void> => {
  if (!Array.isArray(array)) {
    throw Error('Expected an array');
  }
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

export const identifyIdentifier = (
  identifier: string,
): { key: 'email' | 'phoneNumber' | 'username'; value: string } => {
  const phoneNumberRegex = /^[\d\s().-]+$/;
  const usernameRegex = /^[a-z0-9]{3,16}$/; // Only lowercase letters and numbers (no underscores)
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (phoneNumberRegex.test(identifier)) {
    return { key: 'phoneNumber', value: identifier };
  } else if (usernameRegex.test(identifier)) {
    return { key: 'username', value: identifier };
  } else if (emailRegex.test(identifier)) {
    return { key: 'email', value: identifier };
  } else {
    throw new BadRequestException('Invalid Identifier!!');
  }
};

export const getPaginationData = (payload: any): { skip: number; limit: number; page: number } => {
  let { page, limit } = payload;
  page = Number(page || 1);
  limit = Number(limit || 10);
  const skip = (page - 1) * limit;
  return { skip, limit, page };
};

export const sleep = (milliseconds: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export const isNumberArrayEqual = (array1: number[], array2: number[]): boolean => {
  array1 = array1.sort((x: number, y: number) => x - y);
  array2 = array2.sort((x: number, y: number) => x - y);

  return (
    Array.isArray(array1) &&
    Array.isArray(array2) &&
    array1.length === array2.length &&
    array1.every((val, index) => val === array2[index])
  );
};

export const unifyCombinationArray = (
  array: { combinations: number[]; goTo: number; id?: number }[],
): { combinations: number[]; goTo: number; id?: number }[] => {
  const uniqueArr = array.filter((item, index, self) => {
    const combination = item.combinations.slice().sort().join(',');
    return (
      index === self.findIndex((obj) => obj.combinations.slice().sort().join(',') === combination)
    );
  });
  return uniqueArr;
};

export function isArrayHasSameObject<T>(arr: T[], propertyKey: keyof T): boolean {
  const unique = [...new Set(arr.map((a) => a[propertyKey]))];
  if (unique.length === arr.length) {
    return false;
  }

  return true;
}
export const gen6digitOTP = (): number => {
  return Math.floor(100000 + Math.random() * 900000);
};

export const generateFilename = (file): string => {
  return `${Date.now()}${path.extname(file.originalname)}`;
};

export const storageImageOptions = diskStorage({
  destination: './uploads/temp',
  filename: (_req, file, callback) => {
    callback(null, generateFilename(file));
  },
});

export const storageExcelOptions = diskStorage({
  destination: './uploads/temp',
  filename: (_req, file, callback) => {
    callback(null, generateFilename(file));
  },
});

export const getMatchedLogic = (logics: any[], providedCombination: number[]): [] => {
  let matchedLogic = null;
  try {
    logics.map((logic) => {
      const combinations = logic.combinations.map((c) => c.answerId);
      if (isNumberArrayEqual(combinations, providedCombination)) {
        matchedLogic = logic;
      }
    });
  } catch (error) {
    console.error('🚀 ~ getMatchedLogic ~ error:', error);
    matchedLogic = null;
  }

  return matchedLogic;
};

export function generateCode(prefix = ''): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const date = String(now.getDate()).padStart(2, '0');
  const msec = String(now.getMilliseconds()).padStart(3, '0');
  return `${prefix}${year}${month}${date}${msec}`;
}

export const pick = (obj: object, keys: string[]): Record<string, any> => {
  return keys.reduce<{ [key: string]: unknown }>((finalObj, key) => {
    if (obj && Object.hasOwnProperty.call(obj, key)) {
      finalObj[key] = obj[key as keyof typeof obj];
    }
    return finalObj;
  }, {});
};
function isBangla(text: string): boolean {
  return /[\u0980-\u09FF]/.test(text);
}
export function cleanHtml(html: string): string {
  return stripHtml(html).result
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
export function extractTags(text: string): string[] {
  const cleanText = cleanHtml(text);

  // split rough language zones
  const banglaParts = cleanText.match(/[\u0980-\u09FF\s]+/g)?.join(" ") || "";
  const englishParts = cleanText.replace(/[\u0980-\u09FF]/g, "");

  // Bangla extraction
  const bnKeywords = extractBanglaTags(banglaParts);
  const bnNames = extractBanglaNames(banglaParts);

  // English extraction
  const enTags = extractEnglishTags(englishParts);

  // merge everything
  const merged = [
    ...bnNames,     // highest priority
    ...bnKeywords,
    ...enTags
  ];

  return [...new Set(
    merged.map(t => t.trim())
  )].slice(0, 20);
}
function extractEnglishTags(text: string): string[] {
  const nlp = winkNLP(model);
  const its = nlp.its;

  const doc = nlp.readDoc(text);

  const entities = doc.entities().out(its.value);

  const nouns = doc.tokens()
    .filter(t => t.out(its.pos) === 'NOUN')
    .out(its.value);

  const tfidf = new natural.TfIdf();
  tfidf.addDocument(text);

  const keywords = tfidf.listTerms(0)
    .slice(0, 10)
    .map(t => t.term);

  return [...entities, ...nouns, ...keywords];
}
function extractBanglaNames(text: string): string[] {
  const words = text.split(/\s+/).filter(w => isBangla(w));

  const names: string[] = [];

  for (let i = 0; i < words.length - 1; i++) {
    const fullName = `${words[i]} ${words[i + 1]}`;

    if (
      words[i].length > 2 &&
      words[i + 1].length > 2
    ) {
      names.push(fullName);
    }
  }

  return names;
}
function normalizeBanglaWord(word: string): string {
  return word
    .replace(/(ে|তে|য়ে|টি|টা|গুলো|দের|কে|তে)$/u, '')
    .trim();
}
function tokenizeBangla(text: string): string[] {
  return text
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // remove zero-width chars
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')     // remove punctuation (unicode safe)
    .split(/\s+/)
    .map(w => w.trim())
    .filter(Boolean);
}
function extractBanglaTags(text: string): string[] {
  const BN_STOPWORDS = new Set([
    "এবং", "এই", "যে", "তার", "করে", "জন্য", "হয়", "সঙ্গে",
    "থেকে", "করা", "ছিল", "হয়ে", "দিকে", "তাদের", "একটি",
    "দুই", "আরও", "কিন্তু", "যখন", "তখন"
  ]);

  const words = tokenizeBangla(text);

  const freq: Record<string, number> = {};

  for (let word of words) {
    if (!isBangla(word)) continue;

    word = normalizeBanglaWord(word);

    if (
      word.length > 2 &&
      !BN_STOPWORDS.has(word)
    ) {
      freq[word] = (freq[word] || 0) + 1;
    }
  }

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([word]) => word);
}