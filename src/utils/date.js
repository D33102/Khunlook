export const convertThaiDatetoStd = (date) => {
  const [year, month, day] = date.split("-");
  const gregorianYear = parseInt(year, 10) - 543;
  return `${gregorianYear}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};
