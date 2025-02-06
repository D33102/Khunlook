export const convertThaiDatetoStd = (date) => {
  const [year, month, day] = date.split("-");
  const gregorianYear = parseInt(year, 10) - 543;
  return `${gregorianYear}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

export const ageDayBetween = (startDate, endDate)=> {
  const diffTime = new Date(endDate) - new Date(startDate);
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export const calculateCorrectedAge =(personBirth, nuGa, nuDserv) =>{
  if (!nuGa) nuGa = 37; // Assume full term if GA is null
  if (nuGa < 37) {
    const missingDays = (40 - nuGa) * 7; // Days to full term
    const correctedBirth = new Date(new Date(personBirth).getTime() + missingDays * 24 * 60 * 60 * 1000);
    
    if (new Date(nuDserv) < correctedBirth) return 0;
    
    return ageDayBetween(correctedBirth, nuDserv);
  }
  return ageDayBetween(personBirth, nuDserv);
}
