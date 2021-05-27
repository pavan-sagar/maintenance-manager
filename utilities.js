export const getMonthName = (monthNumber, characters = 0) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return characters <= 0
    ? monthNames[monthNumber]
    : monthNames[monthNumber].substr(0, characters);
};
