// Time-related Constants
const TIME_INTERVALS = {
  SIGNAL_OPERATION_FLAG_INTERVAL: 30000,
  ALIVE_CHECKER_INTERVAL: 5000,
  TT_SIGNAL_CHECKER_INTERVAL: 15000,
  KEEP_SESSION_ALIVE_INTERVAL: 100000,
  WAIT_FOR_RECAPTCHA_TIMEOUT: 3000,
  UPDATE_UID_COOKIE_INTERVAL: 3888000000,
  OPERATION_FLAG_INTERVAL: 600000
};

// Encapsulate Flags and Interval IDs
class BookingState {
  constructor() {
    this.timerIntervalId = undefined;
    this.isBookingSuccessful = false;
    this.isOperationInProgress = false;
    this.isTtSignalOperationInProgress = false;
    this.operationFlagIntervalId = undefined;
    this.ttSignalOperationFlagIntervalId = undefined;
  }
}

const bookingState = new BookingState()

// GUI Handling
import { handleGUI } from './guiHandler';

// Booking and Retrieval Functionality
import { runExtension } from './bookingManager';

// Center Selection
import { selectCenterBasedOnUrlAndHideList } from './centerSelector';

// Main Entry Point
function main() {
  // Initialize the application
  handleGUI();
  selectCenterBasedOnUrlAndHideList();

  // Set up interval handlers
  setInterval(async () => {
    await alive_checker();
  }, TIME_INTERVALS.ALIVE_CHECKER_INTERVAL);

  setInterval(async () => {
    await tt_signal_checker();
  }, TIME_INTERVALS.TT_SIGNAL_CHECKER_INTERVAL);

  bookingState.timerIntervalId = setInterval(async () => {
    await keep_session_alive();
  }, TIME_INTERVALS.KEEP_SESSION_ALIVE_INTERVAL);
}

main();

// Interval Handling
async function alive_checker() {
  console.log("Checking for keep-alive trigger...");
  const trigger = localStorage.getItem("falcHunterTrigger");
  if (trigger && trigger === "REFRESH") {
    localStorage.setItem("falcHunterTrigger", "NO_CMD");
    await keep_session_alive();
  }
}

async function tt_signal_checker() {
  const trigger = localStorage.getItem("falcHunterTrigger");
  if (trigger) {
    if (trigger.includes("TT-SIGNAL")) {
      console.log("Received TT-SIGNAL trigger:", trigger);
      const selectedCenter = localStorage.getItem("selectedCenter");
      if (selectedCenter && trigger.includes(`TT-SIGNAL::${selectedCenter}`) && !bookingState.isTtSignalOperationInProgress) {
        bookingState.isTtSignalOperationInProgress = true;
        if (bookingState.ttSignalOperationFlagIntervalId) {
          clearInterval(bookingState.ttSignalOperationFlagIntervalId);
        }
        bookingState.ttSignalOperationFlagIntervalId = setInterval(reset_tt_signal_flag, TIME_INTERVALS.SIGNAL_OPERATION_FLAG_INTERVAL);
        await tt_signal_trigger();
      }
      localStorage.setItem("falcHunterTrigger", "NO_CMD");
    }
  }
}

function reset_tt_signal_flag() {
  bookingState.isTtSignalOperationInProgress = false;
}

async function keep_session_alive() {
  console.log("Checking for session keep-alive...");
  if (!bookingState.isBookingSuccessful && !bookingState.isOperationInProgress) {
    const selectedCenter = localStorage.getItem("selectedCenter");
    if (selectedCenter) {
      await runExtension(true, "");
    }
  }
}

async function tt_signal_trigger() {
  console.log("Received a trigger from TT-Signal.");
  if (!bookingState.isBookingSuccessful && !bookingState.isOperationInProgress) {
    await runExtension(true, "SIGNAL");
  }
}
