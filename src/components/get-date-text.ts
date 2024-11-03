export function getDateText(date: Date | string) {
  if (typeof date === 'string') {
    date = new Date(date);
  }

  const diff = (Date.now() - date.getTime()) / 1000;

  if (diff < 60) {
    return `a few seconds ago`;
  }

  if (diff < 3_600) {
    const minutes = Math.floor(diff / 60);
    return `${minutes} minutes ago`;
  }

  if (diff < 86_400) {
    const hours = Math.floor(diff / 3_600);
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  }

  if (Math.floor(diff / 86_400) === 1) {
    return `yesterday`;
  }

  if (diff < 604_800) {
    const days = Math.floor(diff / 86_400);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  }

  if (
    date.getFullYear() === new Date().getFullYear() &&
    date.getMonth() === new Date().getMonth()
  ) {
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short'
    });
  }

  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}
