import React, { useState } from "react";

export const INITIAL_FORM_DATA = {
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
};

import {
  validateForm,
  handleAuthError,
  useForm,
  useLoading,
} from "./authUtils";

export function useAccountForm() {}
