export function showToast(message: string) {
  window.dispatchEvent(new CustomEvent("gba:toast", { detail: message }));
}
