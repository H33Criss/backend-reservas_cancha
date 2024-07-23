export const getStartAndEndOfWeek = (
  date: Date,
): { start: string; end: string } => {
  // Copia la fecha para no modificar la original
  const start = new Date(date);
  const end = new Date(date);

  // Ajusta al inicio de la semana (lunes)
  const day = date.getUTCDay();
  const diff = (day <= 0 ? -6 : 1) - day; // 1 = lunes, 0 = domingo, -6 = sábado
  start.setUTCDate(start.getUTCDate() + diff);
  start.setUTCHours(0, 0, 0, 0);

  // Ajusta al final de la semana (viernes)
  end.setUTCDate(start.getUTCDate() + 6);
  end.setUTCHours(23, 59, 59, 999);

  // Formatea las fechas como cadenas en formato YYYY-MM-DD
  const startStr = start.toISOString().split('T')[0];
  const endStr = end.toISOString().split('T')[0];

  return { start: startStr, end: endStr };
};
