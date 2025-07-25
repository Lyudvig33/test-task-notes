import { AUTH_ERROR_MESSAGES } from './auth';
import { NOTE_ERROR_MESSAGES } from './note';
import { SHARED_LINK_ERROR_MESSAGES } from './shared-link';
import { USER_ERROR_MESSAGES } from './user';

export const ERROR_MESSAGES = {
  ...AUTH_ERROR_MESSAGES,
  ...NOTE_ERROR_MESSAGES,
  ...USER_ERROR_MESSAGES,
  ...SHARED_LINK_ERROR_MESSAGES,
};
