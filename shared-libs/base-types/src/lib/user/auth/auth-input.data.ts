export interface RegisterBaseInput {
  email: string;
  password: string;
  confirmationPassword: string;
}

export interface LoginBaseInput {
  email: string;
  password: string;
}

export interface RefreshBaseInput {
  refreshToken: string;
}

export interface ChangePasswordBaseInput {
  oldPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
}

export interface UpdateProfileBaseInput {
  name?: string;
  surname?: string;
  fatherName?: string;
  phoneNumber?: string;
  isResident?: boolean;
  identifCode?: string;
  numPass?: string;
  codeWord?: string;
  address?: string;
}

export interface DeleteAccountBaseInput {
  password: string;
}
