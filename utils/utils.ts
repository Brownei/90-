export function formatString(str: string) {
  const lowercaseStr = str.toLowerCase();

  if (lowercaseStr.includes(' ')) {
    return lowercaseStr.replace(/ /g, '-');
  }

  return lowercaseStr;
}

export function reverseFormatString(formattedStr: string) {
  let changedString: string;
  if (formattedStr.includes('-')) {
    const spacedStr = formattedStr.replace(/-/g, ' ');

    changedString = spacedStr.replace(/\b\w/g, char => char.toUpperCase())
    return changedString;
  }

  changedString = formattedStr.charAt(0).toUpperCase() + formattedStr.slice(1)
  if (changedString === 'Ucl') {
    return changedString.toUpperCase()
  } else {
    return changedString;

  }
}
