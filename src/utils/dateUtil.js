// date-fns utility wrapper — paket mavjud bo'lmasa, native JS ishlatiladi
// Vite import analysis ni chlab o'tish uchun runtime dynamic import ishlatiladi

import dynamicImport from './dynamicImport';

let dateFns = null;
let dateFnsLocaleUz = null;

async function loadDateFns() {
  if (dateFns !== null) return dateFns;
  try {
    const mod = await dynamicImport('date-fns');
    dateFns = mod;
    try {
      const loc = await dynamicImport('date-fns/locale');
      dateFnsLocaleUz = loc.uz;
    } catch {
      dateFnsLocaleUz = null;
    }
  } catch {
    dateFns = false;
  }
  return dateFns;
}

const MONTHS_UZ = [
  'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
  'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr',
];

const MONTHS_SHORT_UZ = [
  'yan', 'fev', 'mar', 'apr', 'may', 'iyn',
  'iyl', 'avg', 'sen', 'okt', 'noy', 'dek',
];

function pad2(n) { return String(n).padStart(2, '0'); }

// Native fallback formatter (locale: uz)
function nativeFormat(date, pattern) {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  const Y = d.getFullYear();
  const M = d.getMonth();
  const D = d.getDate();
  const h = d.getHours();
  const m = d.getMinutes();

  switch (pattern) {
    case 'dd MMM yyyy':
      return `${pad2(D)} ${MONTHS_SHORT_UZ[M]} ${Y}`;
    case 'dd MMM':
      return `${pad2(D)} ${MONTHS_SHORT_UZ[M]}`;
    case 'dd MMMM yyyy':
      return `${pad2(D)} ${MONTHS_UZ[M]} ${Y}`;
    case 'dd MMMM yyyy, HH:mm':
      return `${pad2(D)} ${MONTHS_UZ[M]} ${Y}, ${pad2(h)}:${pad2(m)}`;
    case 'dd MMM HH:mm':
      return `${pad2(D)} ${MONTHS_SHORT_UZ[M]} ${pad2(h)}:${pad2(m)}`;
    case 'dd.MM.yyyy HH:mm':
      return `${pad2(D)}.${pad2(M + 1)}.${Y} ${pad2(h)}:${pad2(m)}`;
    case 'yyyy-MM-dd':
      return `${Y}-${pad2(M + 1)}-${pad2(D)}`;
    default:
      return d.toLocaleDateString('uz-UZ');
  }
}

// Sync — date-fns topilmasa, locale'siz ishlaydi
export function formatDateSync(date, pattern = 'dd MMM yyyy') {
  return nativeFormat(date, pattern);
}

// Async — date-fns ishlatadi yoki native fallback
export async function formatDate(date, pattern = 'dd MMM yyyy') {
  const lib = await loadDateFns();
  if (lib && typeof lib.format === 'function') {
    try {
      return lib.format(new Date(date), pattern, { locale: dateFnsLocaleUz || undefined });
    } catch {
      try {
        return lib.format(new Date(date), pattern);
      } catch {
        return nativeFormat(date, pattern);
      }
    }
  }
  return nativeFormat(date, pattern);
}

// Sync date-fns replacement functions
export function subDaysSync(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() - days);
  return d;
}

export function eachDayOfIntervalSync({ start, end }) {
  const days = [];
  const cur = new Date(start);
  cur.setHours(0, 0, 0, 0);
  const last = new Date(end);
  last.setHours(0, 0, 0, 0);
  while (cur <= last) {
    days.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return days;
}

export function startOfDaySync(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Async originals
export async function subDays(date, days) {
  const lib = await loadDateFns();
  if (lib && typeof lib.subDays === 'function') return lib.subDays(new Date(date), days);
  return subDaysSync(date, days);
}

export async function eachDayOfInterval({ start, end }) {
  const lib = await loadDateFns();
  if (lib && typeof lib.eachDayOfInterval === 'function') return lib.eachDayOfInterval({ start: new Date(start), end: new Date(end) });
  return eachDayOfIntervalSync({ start, end });
}

export async function startOfDay(date) {
  const lib = await loadDateFns();
  if (lib && typeof lib.startOfDay === 'function') return lib.startOfDay(new Date(date));
  return startOfDaySync(date);
}

export async function getUzLocale() {
  await loadDateFns();
  return dateFnsLocaleUz;
}