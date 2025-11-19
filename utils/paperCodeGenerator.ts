export function randomThreeDigitCode() {
  const n = Math.floor(Math.random() * 1000); // 0..999
  return String(n).padStart(3, '0');
}