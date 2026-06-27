// Runtime dynamic import — Vite/Rolldown statik tahlil qilmaydi
// Paket o'rnatilmagan bo'lsa, xato qaytaradi (try/catch da ushlanadi)

const runtimeImport = new Function('m', 'return import(m)');

export default function dynamicImport(moduleName) {
  return runtimeImport(moduleName);
}