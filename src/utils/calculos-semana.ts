export const getStartAndEndOfWeek = (
  date: Date,
): { start: string; end: string } => {

  // Copia la fecha para no modificar la original
  const start = new Date(date);


  // Ajusta al inicio de la semana (lunes)
  const day = date.getUTCDay();
  const diffToMonday = (day === 0 ? -6 : 1) - day; // 1 = lunes, 0 = domingo, -6 = sábado
  start.setDate(date.getDate() + diffToMonday);

  // Crear una nueva fecha para el final de la semana (domingo)
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  // Formatea las fechas como cadenas en formato YYYY-MM-DD
  const startStr = start.toISOString().split('T')[0];
  const endStr = end.toISOString().split('T')[0];

  return { start: startStr, end: endStr };
};
