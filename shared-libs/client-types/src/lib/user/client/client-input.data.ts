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
export type ClientChangePasswordInput = ChangePasswordBaseInput;
export type ClientUpdateProfileInput = UpdateProfileBaseInput;
export type ClientDeleteAccountInput = DeleteAccountBaseInput;
