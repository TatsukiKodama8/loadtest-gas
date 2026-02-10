/**
 * 列のアルファベット表記を数値に変換する
 * "A"->1, "Z"->26, "AA"->27...
 */
export function col_(a1: string): number {
  let n = 0;
  for (const ch of a1.toUpperCase()) {
    n = n * 26 + (ch.charCodeAt(0) - 64);
  }
  return n;
}
