export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace('Rp', 'Rp ');
}

export function formatNumberOnly(amount: number): string {
  return new Intl.NumberFormat('id-ID').format(amount);
}

export function maskNik(nik: string): string {
  if (!nik || nik.length < 8) return nik;
  return `${nik.slice(0, 4)}********${nik.slice(-4)}`;
}

export function maskPhone(phone: string): string {
  if (!phone || phone.length < 7) return phone;
  return `${phone.slice(0, 4)}****${phone.slice(-3)}`;
}

export function maskBalance(amount: number, isMasked: boolean): string {
  if (isMasked) return 'Rp ••••••••';
  return formatRupiah(amount);
}

export function getCurrentDateIndo(): string {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());
}

export function getTimeIndo(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}
