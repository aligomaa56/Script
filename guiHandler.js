import { runExtension, runTest } from ".bookingManager";
import { keep_session_alive, bookingState } from "./main";

export function handleGUI() {
  const centerSelect = document.getElementById("itemHunterList");
  const selectedCenter = localStorage.getItem("selectedCenter");

  if (selectedCenter && centerSelect) {
    centerSelect.value = selectedCenter;
  }

  document.getElementById("selectHunterButton")?.addEventListener("click", async (event) => {
    event.preventDefault();
    localStorage.setItem("selectedCenter", centerSelect?.value);
    if (!bookingState.isOperationInProgress) {
      console.log("running..");
      await runExtension(true, "");
    }
  });

  document.getElementById("testButton")?.addEventListener("click", async (event) => {
    event.preventDefault();
    console.log("Test operation started..");
    await runTest();
  });

  const refreshTimeInput = document.getElementById("refreshHunterTime");
  if (refreshTimeInput) {
    refreshTimeInput.addEventListener("change", () => {
      const newRefreshTime = Number(refreshTimeInput.value);
      console.log("New refresh time (s): ", newRefreshTime);
      clearInterval(bookingState.timerIntervalId);
      bookingState.timerIntervalId = setInterval(keep_session_alive, newRefreshTime * 1000);
    });
  }
}
