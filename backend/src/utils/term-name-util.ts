import { Term } from '@prisma/client';

export function getTermDisplayString(term: Term): string {
  switch (term) {
    case Term.SESSION_1:
      return 'Session 1';
    case Term.SESSION_2:
      return 'Session 2';
    case Term.SESSION_3:
      return 'Session 3';
    case Term.ALL_YEAR:
      return 'All Year';
    default:
      return 'Unknown Session';
  }
}
