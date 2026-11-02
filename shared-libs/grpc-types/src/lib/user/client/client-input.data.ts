import { Protected } from '../../utils/protected.js';

import type {
  ChangePasswordBaseInput,
  DeleteAccountBaseInput,
  LoginBaseInput,
  RefreshBaseInput,
  RegisterBaseInput,
  UpdateProfileBaseInput,
} from '@org/base-types';

export type ClientRegisterInput = RegisterBaseInput;
export type ClientLoginInput = LoginBaseInput;
export type ClientRefreshInput = RefreshBaseInput;
export type ClientChangePasswordInput = Protected<ChangePasswordBaseInput>;
export type ClientUpdateProfileInput = Protected<UpdateProfileBaseInput>;
export type ClientDeleteAccountInput = Protected<DeleteAccountBaseInput>;
