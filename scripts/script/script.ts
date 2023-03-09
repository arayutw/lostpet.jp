import { Win } from "./window"
import { features } from "./factory"
import { SSRDocumentData } from "./document"

declare global {
  var a: ServerOptions | undefined
  var win: Win
}

export type ServerOptions = {
  document: SSRDocumentData
  version: number
}

Object.setPrototypeOf(Win.prototype, features);

const win = new Win(self.a!);

self.a = undefined;

if ("dev2.lostpet.jp" === location.hostname) {
  self.win = win;
}

/**
 * localStorageに無駄なデータを残さない (Recaptchaなど)
 */
for (let i = 0, len = localStorage.length; i < len; ++i) {
  const keyName = localStorage.key(i);
  if (keyName && keyName.length > 1) localStorage.removeItem(keyName);
}

/**
 * preload用のlink要素を削除する
 */
for (let i = 0, a = document.querySelectorAll("[rel='preload']"); a.length > i; i++) {
  a[i].remove();
}

/**
 * script要素を削除する
 */
(document.currentScript as HTMLOrSVGScriptElement).remove();
