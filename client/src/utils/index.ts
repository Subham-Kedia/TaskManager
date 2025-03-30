import { enqueueSnackbar, OptionsObject, SnackbarKey } from "notistack";

type MessageVariant = "default" | "error" | "success" | "warning" | "info";

export const notifyUser = (
  message: string,
  variant: MessageVariant = "success",
  options: Partial<OptionsObject> = {}
): SnackbarKey => enqueueSnackbar(message, { variant, ...options });
