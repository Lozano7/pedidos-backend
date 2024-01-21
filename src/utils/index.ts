import { format } from 'date-fns';

export function formatDate(date: Date, formatString: string = 'MM/dd/yyyy') {
  return format(date, formatString);
}
