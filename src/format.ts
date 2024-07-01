const formater = Intl.NumberFormat('us', {
  maximumFractionDigits: 2
});

export function dataFormater(number: number) {
  if (number > 1000000000) {
    return formater.format(number / 1000000000) + 'B';
  } else if (number > 1000000) {
    return formater.format(number / 1000000) + 'M';
  } else if (number > 1000) {
    return formater.format(number / 1000) + 'K';
  } else {
    return formater.format(number);
  }
}
