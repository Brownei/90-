import axios, { AxiosError, AxiosRequestConfig, } from "axios";
import crypto from "crypto";

export type APIResponse = {
  success: boolean;
  data?: LiveGame | any;
  error?: string;
};

export type LiveGame = {
  status: string;
  response: {
    live: any[]
  }
}

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

export async function externalFootballApi(endpoint: string): Promise<APIResponse> {
  const apiKey = process.env.NEXT_PUBLIC_LIVE_FOOTBALL_KEY;
  const apiHost = process.env.NEXT_PUBLIC_LIVE_FOOTBALL_HOST;

  if (!apiKey || !apiHost) {
    return {
      success: false,
      error: 'Missing API credentials in environment variables.'
    };
  }

  const options: AxiosRequestConfig = {
    method: 'GET',
    url: `https://free-api-live-football-data.p.rapidapi.com/${endpoint}`,
    headers: {
      'x-rapidapi-key': apiKey,
      'x-rapidapi-host': apiHost
    }
  };

  try {
    const { data, status } = await axios.request(options);

    return {
      success: status === 200,
      data
    };
  } catch (err) {
    if (err instanceof AxiosError) {
      console.error('Axios error:', err.message);
      return {
        success: false,
        error: err.message
      };
    }

    console.error('Unknown error:', err);
    return {
      success: false,
      error: 'An unexpected error occurred.'
    };
  }
}

const ALGORITHM = "aes-256-cbc";
const SECRET = crypto.createHash('sha256').update(process.env.NEXT_PUBLIC_COOKIE_SECRET!).digest();
const IV = crypto.randomBytes(16); // Store or transmit this with encrypted data

export function encryptData(text: string): string {
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET, IV);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return IV.toString('hex') + ':' + encrypted.toString('hex');
}

export function decryptData(encryptedText: string): string {
  const [ivHex, dataHex] = encryptedText.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(dataHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, SECRET, iv);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString();
}


export function formatDateToBritish(rawDate: string): {date: string, time: string} {
const date = new Date(rawDate);

// Format: "10 May 2025"
const formattedDate = date.toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

// Format: "14:00"
const formattedTime = date.toLocaleTimeString("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

  return {
    date: formattedDate,
    time: formattedTime
  }
}
