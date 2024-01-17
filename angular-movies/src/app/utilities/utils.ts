import { HttpErrorResponse } from '@angular/common/http';

export function toBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export function parseWebApiErrors(response: HttpErrorResponse): string[] {
  if (response.error) {
    if (typeof response.error === 'string') {
      return [response.error];
    } else if (Array.isArray(response.error)) {
      return response.error.map((err) => err.description);
    } else {
      const result: string[] = [];
      Object.entries(response.error.errors).forEach((arr: any[]) => {
        arr[1].forEach((errMsg: string) => {
          result.push(`${arr[0]}: ${errMsg}`);
        });
      });
      return result;
    }
  }
  return [];
}

export function formatDateFormData(date: Date) {
  date = new Date(date);
  const format = new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const [{ value: month }, , { value: day }, , { value: year }] =
    format.formatToParts(date);
  return `${year}-${month}-${day}`;
}
