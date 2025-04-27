import axios, { AxiosError, AxiosResponse } from "axios";

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

// Parse the formatted text output into structured data
export async function externalApiForMatches(url: string): Promise<AxiosResponse<any, any> | AxiosError<any, any> | unknown> {
  try {
    const res = await axios.get(url, {
      headers: {
        'X-Auth-Token': process.env.FOOTBALL_DATA_API, // Replace with your actual token
      }
    })

    if (res.status === 200) {
      return res.data;
    }

    return new AxiosError(
      "Error in getting this request",
      '409',
    )
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error)
      return error;
    }

    console.log(error)
    return error;
  }
}

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getTomorrowDate = (): string => {
  const today = new Date();
  today.setDate(today.getDate() + 1); // move one day forward
  return today.toISOString().split('T')[0];
};

export function formatNumberInThousands(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return num.toString();
};
