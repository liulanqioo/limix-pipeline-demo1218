export function cn(...args) {
  return args.filter(Boolean).join(" ");
}

export function formatNum(n) {
  if (typeof n !== "number") return String(n);
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return String(n);
}

export function clamp01(x) {
  return Math.max(0, Math.min(1, x));
}

export function nowTimeStr() {
  const d = new Date();
  const pad = (x) => String(x).padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}
