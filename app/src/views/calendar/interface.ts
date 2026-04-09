export interface CalendarYear {
  startingDate: string;
  endingDate: string;
  edgeDays: Record<string, string>;
  holidays: Record<string, string>;
  vacationRanges: CalendarRange[];
}

interface CalendarRange {
  start: string;
  end: string;
  label: string;
}

export interface CalendarExam {
  subject: string;
  note: string;
  date: string;
}