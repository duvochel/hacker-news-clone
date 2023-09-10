export function timeDifferenceForDate(timestamp) {
  const now = new Date().getTime();
  const date = new Date(timestamp);
  const differenceHours = Math.floor(Math.abs(now - date) / (1000 * 3600));

  const differenceDays = Math.floor(differenceHours / 24);

  let timeDifference = differenceHours;
  let unit = 'hour';
  
  if (differenceHours > 48) {
    timeDifference = differenceDays;
    unit = 'days';
  } else if (differenceHours > 23) {
    timeDifference = differenceDays;
    unit = 'day';
  } else if (differenceHours > 1) {
    unit = 'hours';
  }

  return `${timeDifference} ${unit} ago`;
}
