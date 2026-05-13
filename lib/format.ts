const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatCurrency(value: number): string {
  return USD.format(value);
}

export function formatCurrencySigned(value: number): string {
  const sign = value < 0 ? "−" : "+";
  return sign + USD.format(Math.abs(value));
}

export function formatDate(iso: string): string {
  const d = new Date(iso + (iso.length === 7 ? "-01" : ""));
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
