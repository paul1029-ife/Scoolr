import { SchoolLevel, SchoolType, Stream, TermName } from "@/lib/generated/prisma/enums";

export { SchoolLevel, SchoolType, Stream, TermName };

/** The 36 states plus the Federal Capital Territory. */
export const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "Federal Capital Territory", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano",
  "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun",
  "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe",
  "Zamfara",
] as const;

export const schoolTypeLabel: Record<SchoolType, string> = {
  [SchoolType.PUBLIC]: "Public / Government",
  [SchoolType.PRIVATE]: "Private",
  [SchoolType.MISSION]: "Mission / Faith-based",
  [SchoolType.COMMUNITY]: "Community",
};

export const termLabel: Record<TermName, string> = {
  [TermName.FIRST]: "First Term",
  [TermName.SECOND]: "Second Term",
  [TermName.THIRD]: "Third Term",
};

export const streamLabel: Record<Stream, string> = {
  [Stream.SCIENCE]: "Science",
  [Stream.ARTS]: "Arts",
  [Stream.COMMERCIAL]: "Commercial",
};

/** The six secondary classes under the 6-3-3-4 system. */
export const DEFAULT_CLASSES = [
  { name: "JSS 1", level: SchoolLevel.JUNIOR },
  { name: "JSS 2", level: SchoolLevel.JUNIOR },
  { name: "JSS 3", level: SchoolLevel.JUNIOR },
  { name: "SSS 1", level: SchoolLevel.SENIOR },
  { name: "SSS 2", level: SchoolLevel.SENIOR },
  { name: "SSS 3", level: SchoolLevel.SENIOR },
] as const;

/**
 * WAEC grade bands, used by most Nigerian secondary schools for internal
 * reporting so results line up with WASSCE. C4-C6 are the "credit" grades that
 * matter for university admission.
 */
export const WAEC_GRADE_BANDS = [
  { code: "A1", label: "Excellent", minScore: 75, maxScore: 100, isPass: true },
  { code: "B2", label: "Very Good", minScore: 70, maxScore: 74, isPass: true },
  { code: "B3", label: "Good", minScore: 65, maxScore: 69, isPass: true },
  { code: "C4", label: "Credit", minScore: 60, maxScore: 64, isPass: true },
  { code: "C5", label: "Credit", minScore: 55, maxScore: 59, isPass: true },
  { code: "C6", label: "Credit", minScore: 50, maxScore: 54, isPass: true },
  { code: "D7", label: "Pass", minScore: 45, maxScore: 49, isPass: true },
  { code: "E8", label: "Pass", minScore: 40, maxScore: 44, isPass: true },
  { code: "F9", label: "Fail", minScore: 0, maxScore: 39, isPass: false },
] as const;

/**
 * Typical term dates. Nigerian sessions run roughly September to July, split
 * into three terms; states publish harmonised calendars that vary by a week or
 * two, so these are only a starting point the school can edit.
 */
export function defaultSessionDates(startYear: number) {
  return {
    name: `${startYear}/${startYear + 1}`,
    startDate: `${startYear}-09-15`,
    endDate: `${startYear + 1}-07-25`,
    terms: [
      {
        name: TermName.FIRST,
        startDate: `${startYear}-09-15`,
        endDate: `${startYear}-12-15`,
      },
      {
        name: TermName.SECOND,
        startDate: `${startYear + 1}-01-08`,
        endDate: `${startYear + 1}-04-05`,
      },
      {
        name: TermName.THIRD,
        startDate: `${startYear + 1}-04-22`,
        endDate: `${startYear + 1}-07-25`,
      },
    ],
  };
}

/** The session a school is most likely setting up, based on today's date. */
export function currentSessionStartYear(today = new Date()): number {
  // A session beginning in September belongs to that calendar year; before
  // September the school is still finishing the previous session.
  return today.getMonth() >= 8 // 8 = September
    ? today.getFullYear()
    : today.getFullYear() - 1;
}

/**
 * Common subject offerings. JSS follows a broad core; SSS narrows to a stream
 * plus compulsory subjects. Schools pick from these during setup and can add
 * their own afterwards.
 */
export const SUGGESTED_SUBJECTS = {
  junior: [
    "English Language", "Mathematics", "Basic Science", "Basic Technology",
    "Social Studies", "Civic Education", "Business Studies",
    "Agricultural Science", "Home Economics", "Computer Studies",
    "Christian Religious Studies", "Islamic Religious Studies",
    "Physical and Health Education", "Cultural and Creative Arts",
    "French", "Yoruba", "Igbo", "Hausa",
  ],
  senior: [
    "English Language", "Mathematics", "Civic Education",
    "Physics", "Chemistry", "Biology", "Further Mathematics",
    "Agricultural Science", "Geography", "Economics", "Government",
    "Literature-in-English", "Christian Religious Studies",
    "Islamic Religious Studies", "History", "Financial Accounting",
    "Commerce", "Computer Science", "Technical Drawing", "Fine Arts",
  ],
} as const;
