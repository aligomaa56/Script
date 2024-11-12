
import { setWarning, setError, setInfo, setPositive } from "./uiUpdater";
import { centerInfo } from "./constants";
import { executeGET, executePOST, getCookie, generateUUID, updateUidCookie, extractIdFromUrl, getCaptchaId, getTheValidSlots, getTimestamp } from "./utils";
import { bookingState } from "./main";
import { TIME_INTERVALS } from "./main";

export async function parallel_booking_task(centerId, timeslot, date, grecaptchaKey, formGroupId, xsrfToken, startTime) {
  const { aptType, country, prefix, code, issueCountry } = centerInfo[centerId];

  let recaptchaToken = await fetchRecaptchaToken(grecaptchaKey);

  const bookingUrl = `https://${prefix}${country}.tlscontact.com/services/customerservice/api/tls/appointment/book?client=${country}&issuer=${code}&formGroupId=${formGroupId}&timeslot=${timeslot} ${date}&appointmentType=${aptType}&lang=fr-fr`;
  const headers = {
    accept: "application/json, text/plain, */*",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/x-www-form-urlencoded",
    "recaptcha-token": recaptchaToken,
    "sec-ch-ua": '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-xsrf-token": xsrfToken,
  };
  const redirectUrl = `https://${prefix}${country}.tlscontact.com/appointment/${issueCountry}/${code}/${formGroupId}`;

  const response = await executePOST(bookingUrl, headers, redirectUrl);
  return processBookingResponse(response, startTime);
}

async function fetchRecaptchaToken(grecaptchaKey) {
  try {
    return await grecaptcha.execute(grecaptchaKey, { action: "book" });
  } catch (error) {
    throw new Error("Recaptcha error");
  }
}

async function processBookingResponse(response, startTime) {
  if (response) {
    if (response.status === 200) {
      const jsonResponse = await response.json();
      if (jsonResponse.status === "success") {
        bookingState.isBookingSuccessful = true;
        const endTime = performance.now();
        const duration = (endTime - startTime) / 1000;
        return `SLOT TAKEN ${timeslot} ${date}. (${duration.toFixed(2)}s.) | ${getTimestamp()}`;
      } else {
        const errorMessage = jsonResponse.status.toString();
        return `SLOT ${timeslot} ${date}: Error: ${errorMessage} | ${getTimestamp()}`;
      }
    } else {
      const errorStatus = response.status.toString();
      return `SLOT ${timeslot} ${date}: Error: ${errorStatus} | ${getTimestamp()}`;
    }
  } else {
    return `SLOT ${timeslot} ${date}: Error. | ${getTimestamp()}`;
  }
}

function reset_operation_flag() {
  bookingState.isOperationInProgress = false;
}

export async function runExtension(isParallel, trigger) {
  bookingState.isOperationInProgress = true;
  if (bookingState.operationFlagIntervalId) {
    clearInterval(bookingState.operationFlagIntervalId);
  }
  bookingState.operationFlagIntervalId = setInterval(reset_operation_flag, TIME_INTERVALS.OPERATION_FLAG_INTERVAL);

  const startTime = performance.now();
  if (trigger === "SIGNAL") {
    setWarning("Déclenchement Signal en cours...");
  } else {
    setWarning("Running...");
  }

  const currentUrl = window.location.href;
  const formGroupId = extractIdFromUrl(currentUrl);
  const isAppointmentPage = currentUrl.includes("tlscontact.com/appointment/");

  if (!isAppointmentPage) {
    setInfo("Go to appointment page.");
    return;
  }

  const xsrfToken = getCookie("XSRF-TOKEN");
  const captchaId = getCaptchaId();
  const selectedCenter = localStorage.getItem("selectedCenter");
  const { aptType, country, prefix, code, issueCountry } = centerInfo[selectedCenter];

  const apiUrl = `https://${prefix}${country}.tlscontact.com/services/customerservice/api/tls/appointment/${issueCountry}/${code}/table?client=${country}&formGroupId=${formGroupId}&appointmentType=${aptType}&appointmentStage=appointment`;
  updateUidCookie(generateUUID());

  const response = await executeGET(apiUrl);
  if (response) {
    if (response.status === 200) {
      const jsonResponse = await response.json();
      const validSlots = getTheValidSlots(jsonResponse);
      const validSlotsCount = validSlots.length;

      if (isParallel) {
        if (validSlotsCount > 0) {
          const bookingTasks = await Promise.all(
            [...new Array(Math.max(1, Math.min(validSlotsCount, parallelConnections)))].map(async () => {
              const randomIndex = Math.floor(Math.random() * validSlotsCount);
              const { date, time } = validSlots[randomIndex];
              console.log(`Trying to book slot: ${date} @ ${time}`);
              return parallel_booking_task(selectedCenter, date, time, captchaId, formGroupId, xsrfToken, startTime);
            })
          );

          const bookingResults = bookingTasks.join("<br>");
          if (trigger !== "") {
            bookingResults += `<br>Trigger: ${trigger}`;
          }
          if (bookingState.isBookingSuccessful) {
            setPositive(bookingResults);
          } else {
            setError(bookingResults);
          }
        } else {
          const endTime = performance.now();
          const duration = (endTime - startTime) / 1000;
          setInfo(`200 OK |${duration.toFixed(2)}s| ${getTimestamp()}`);
        }
      } else {
        const endTime = performance.now();
        const duration = (endTime - startTime) / 1000;
        setInfo(`${validSlotsCount} available appointment(s). In: ${duration.toFixed(2)}s | @ ${getTimestamp()}`);
      }
    } else {
      let errorMessage = "";
      switch (response.status) {
        case 400:
          errorMessage = "400";
          break;
        case 401:
          errorMessage = "401";
          break;
        case 403:
          errorMessage = "Forbidden [403]";
          break;
        case 404:
          errorMessage = "404";
          break;
        case 429:
          errorMessage = "429";
          try {
            const retryAfter = response.headers.get("Retry-After");
            errorMessage += ` | Retry in: ${(retryAfter / 60).toFixed(2)}min`;
          } catch (error) {
            // Ignore error
          }
          break;
        case 500:
          errorMessage = "500";
          break;
        default:
          errorMessage = response.status.toString();
          break;
      }
      console.log("GET Error:", errorMessage);
      setError(`Error: ${errorMessage} | ${getTimestamp()}`);
    }
  } else {
    console.log("GET Error");
    setError(`Error | ${getTimestamp()}`);
  }

  console.log("Script finished.");
  bookingState.isOperationInProgress = false;
}

export async function runTest() {
  setWarning("Test in progress...");

  async function waitForRecaptcha(timeout = TIME_INTERVALS.WAIT_FOR_RECAPTCHA_TIMEOUT) {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error("reCAPTCHA ready timeout"));
      }, timeout);

      grecaptcha.ready(() => {
        clearTimeout(timeoutId);
        resolve();
      });
    });
  }

  try {
    await waitForRecaptcha();
    setPositive("reCAPTCHA OK.");
  } catch (error) {
    setError("reCAPTCHA error!");
  }

  console.log("Test operation ended.");
}