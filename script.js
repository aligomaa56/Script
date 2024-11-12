var $Time =
    {
        /* -- 30000 -- */
        tt_signal_operation_flag_interval_id : 10000,
        /* -- 5000 -- */
        alive_checker : 5000,
        /* -- 200 -- */
        tt_signal_checker:15000,
        /* -- 300000 -- */
        keep_session_alive : 100000,
        /* -- 5000 -- */
        waitForRecaptcha : 3000,
        /* -- 3888000000 -- */
        updateUidCookie : 3888000000,
        /* -- 600000 -- */
        operation_flag_interval_id : 600000,
    };

const centerInfo = {
    TlsFranceAnnaba_Case1: {
        code: "dzAAE2fr", country: "fr", aptType: "premiere_demande", issueCountry: "dz", prefix: "",
    }, TlsFranceAnnaba_Case2: {
        code: "dzAAE2fr", country: "fr", aptType: "Frequent", issueCountry: "dz", prefix: "",
    }, TlsFranceAnnaba_Case3: {
        code: "dzAAE2fr", country: "fr", aptType: "Circulation", issueCountry: "dz", prefix: "",
    }, TlsFranceOran_Case1: {
        code: "dzORN2fr", country: "fr", aptType: "premiere_demande", issueCountry: "dz", prefix: "",
    }, TlsFranceOran_Case2: {
        code: "dzORN2fr", country: "fr", aptType: "Frequent", issueCountry: "dz", prefix: "",
    }, TlsFranceOran_Case3: {
        code: "dzORN2fr", country: "fr", aptType: "Circulation", issueCountry: "dz", prefix: "",
    },TlsFranceFes_Case1: {
        code: "maFEZ2fr", country: "fr", aptType: "premiere_demande", issueCountry: "ma", prefix: "",
    },TlsFranceOujda_Case1: {
        code: "maOUD2fr", country: "fr", aptType: "premiere_demande", issueCountry: "ma", prefix: "",
    },TlsFranceCasablanca_Case1: {
        code: "maCAS2fr", country: "fr", aptType: "premiere_demande", issueCountry: "ma", prefix: "",
    },TlsFranceTanger_Case1: {
        code: "maTNG2fr", country: "fr", aptType: "premiere_demande", issueCountry: "ma", prefix: "",
    },TlsFranceAgadir_Case1: {
        code: "maAGA2fr", country: "fr", aptType: "premiere_demande", issueCountry: "ma", prefix: "",
    },TlsFranceMarrakech_Case1: {
        code: "maRAK2fr", country: "fr", aptType: "premiere_demande", issueCountry: "ma", prefix: "",
    },TlsFranceRabat_Case1: {
        code: "maRBA2fr", country: "fr", aptType: "premiere_demande", issueCountry: "ma", prefix: "",
    },
}

var timer_interval_id = undefined;
var is_booking_successful = false;
var is_operation_in_progress = false;
var is_tt_signal_operation_in_progress = false;
var operation_flag_interval_id = undefined;
var tt_signal_operation_flag_interval_id = undefined;

function sleep(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function alive_checker() {
    console.log("cheking.");
    var trigger = localStorage.getItem("falcHunterTrigger");
    if (trigger && trigger == "REFRESH") {
        localStorage.setItem("falcHunterTrigger", "NO_CMD");
        await keep_session_alive();
    }
}

async function tt_signal_checker() {
    var trigger = localStorage.getItem("falcHunterTrigger");
    if (trigger) {
        if (trigger.includes("TT-SIGNAL")) {
            console.log("falconCmd: ", trigger);
            var selectedCenter = localStorage.getItem("selectedCenter");
            if (selectedCenter && trigger.includes("TT-SIGNAL::" + selectedCenter) && !is_tt_signal_operation_in_progress) {
                is_tt_signal_operation_in_progress = true;
                if (tt_signal_operation_flag_interval_id) {
                    clearInterval(tt_signal_operation_flag_interval_id);
                }
                /*[29/08]$_@-ElQada-#_$[2024]*/
                tt_signal_operation_flag_interval_id = setInterval(reset_tt_signal_flag, $Time.tt_signal_operation_flag_interval_id);// 0x7530 in hexadecimal is 30000 in decimal
                await tt_signal_trigger();
            }
            localStorage.setItem("falcHunterTrigger", "NO_CMD");
        }
    }
}

function reset_operation_flag() {
    is_operation_in_progress = false;
}

function reset_tt_signal_flag() {
    is_tt_signal_operation_in_progress = false;
}

async function keep_session_alive() {
    console.log("script periodic check.");
    if (!is_booking_successful && !is_operation_in_progress) {
        var selectedCenter = localStorage.getItem("selectedCenter");
        if (selectedCenter) {
            await runExtension(true, "");
        }
    }
}

async function tt_signal_trigger() {
    console.log("Received a trigger from TT-Signal.");
    if (!is_booking_successful && !is_operation_in_progress) {
        await runExtension(true, "TT-SIGNAL");
    }
}

let hunter_form = document.getElementById("ttHunterForm");
if (hunter_form) {
    console.log("script already running.");
} else {
    let new_div = document.createElement("div");
    new_div.innerHTML = `
        <div style="background:#0a308f ; padding: 20px;">
            <div id="ttHunterDiv">
                <form id="ttHunterForm">
                    <select id="itemHunterList" name="centHunterList" style="display: none;">
                        <option value="TlsFranceAnnaba_Case1">TLS France à Annaba (1ère demande)/DZ</option>
                        <option value="TlsFranceAnnaba_Case2">TLS France à Annaba (renouvellement ordinaire)/DZ</option>
                        <option value="TlsFranceAnnaba_Case3">TLS France à Annaba (renouvellement circulation)/DZ</option>
                        <option value="TlsFranceOran_Case1">TLS France à Oran (1ère demande)/DZ</option>
                        <option value="TlsFranceOran_Case2">TLS France à Oran (renouvellement ordinaire)/DZ</option>
                        <option value="TlsFranceOran_Case3">TLS France à Oran (renouvellement circulation)/DZ</option>
                        <option value="TlsFranceFes_Case1">TLS France à Fes (1ère demande)/MA</option>
                        <option value="TlsFranceOujda_Case1">TLS France à Oujda (1ère demande)/MA</option>
                        <option value="TlsFranceCasablanca_Case1">TLS France à Casablanca (1ère demande)/MA</option>
                        <option value="TlsFranceTanger_Case1">TLS France à Tanger (1ère demande)/MA</option>
                        <option value="TlsFranceAgadir_Case1">TLS France à Agadir (1ère demande)/MA</option>
                        <option value="TlsFranceMarrakech_Case1">TLS France à Marrakech (1ère demande)/MA</option>
                      <option value="TlsFranceRabat_Case1">TLS France à Rabat (1ère demande)/MA</option>
                    </select>
                    <br>
                    <div id="buttonContainer" style="display: flex; justify-content: center; gap: 10px; align-items: center;">
                        <button id="selectHunterButton">Book Appointment</button>
                        <button id="testButton">Test reCAPTCHA</button>
                        <div id="searchTimeoutContainer">
                            <label for="refreshHunterTime">Search timeout(s):</label>
                            <input type="number" id="refreshHunterTime" name="refreshHunterTime" value="15" required="">
                        </div>
                    </div>
                    <br><br>
                    <div style="display: none;">
                        <label for="parallelConnections">Nombre des connexions simultanées :</label>
                        <input type="number" id="parallelConnections" name="parallelConnections" value="1" required=""></div>
    `;
    document.body.prepend(new_div);

    let styleElement = document.createElement("style");
    styleElement.innerHTML = `
        
        #buttonContainer button {
            background-color: #0682ff;
            color: #fff;
            padding: 8px 75px;
            font-size: 13px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            box-sizing: border-box;
            margin-top: 10px;
        }
        #searchTimeoutContainer {
          font-size: 20px;
           display: inline-flex;
            align-items: center; /* Vertically center the contents */
            background-color: #f0f0f0; /* Light gray background for the box */
            padding: 10px;
             border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2); /* Optional: adds a subtle shadow for depth */
        }

          #searchTimeoutContainer label {
          color: #000000;
          margin-right: 5px; /* Adds some space between the label and the input */
        }

        #searchTimeoutContainer input {
          font-size: 10px; /* Slightly smaller font size for the input */
          width: 80px; /* Fixed width for the input */
            padding: 5px;
           border: 1px solid #ccc; /* Light gray border for the input */
           border-radius: 5px;
         box-sizing: border-box; /* Include padding and border in the element's total width and height */
        } 
        #testButton {
           background-color: #0682ff;
           color: #fff;
           border: none;
           border-radius: 5px;
           cursor: pointer;
           box-sizing: border-box;
           font-size: 5px; /* Adjusted to match the 'Prendre un Rendez-Vous' button */
           padding: 10px 89px; /* Adjusted to match the 'Prendre un Rendez-Vous' button */
           margin-top: 10px; /* Ensure consistent spacing */
        }    
        #selectHunterButton:hover {
            background-color: #006666;
        }

        #testButton:hover {
            background-color: #006666;
        } 
        select {
            padding: 10px;
            font-size: 16px;
            border: none;
            background-color: #fff;
            border-radius: 5px;
            margin: 5px;
        }
           
        #ttHunterDiv {
            text-align: center;
        }
    `;
    document.head.appendChild(styleElement);
    document.head.prepend(styleElement);
    /*[29/08]$_@-ElQada-#_$[2024]*/
    setInterval(alive_checker, $Time.alive_checker);
    /*[29/08]$_@-ElQada-#_$[2024]*/
    setInterval(tt_signal_checker, $Time.tt_signal_checker);
    /*[29/08]$_@-ElQada-#_$[2024]*/
    timer_interval_id = setInterval(keep_session_alive, $Time.keep_session_alive);
    handleGUI();
}
async function parallel_booking_task(centerId, timeslot, date, grecaptchaKey, formGroupId, xsrfToken, startTime) {
    let aptType = centerInfo[centerId].aptType;
    let country = centerInfo[centerId].country;
    let prefix = centerInfo[centerId].prefix;
    let code = centerInfo[centerId].code;
    let issueCountry = centerInfo[centerId].issueCountry;
    let recaptchaToken = "";
    try {
        await grecaptcha
            .execute(grecaptchaKey, {
                action: "book",
            })
            .then(function (token) {
                recaptchaToken = token;
            });
    } catch (error) {
        return ("SLOT " + timeslot + "  " + date + ": " + "Erreur : grecaptcha error." + " |  " + getTimestamp());
    }
    let bookingUrl = "https://" + prefix + country + ".tlscontact.com/services/customerservice/api/tls/appointment/book?client=" + country + "&issuer=" + code + "&formGroupId=" + formGroupId + "&timeslot=" + timeslot + "%20" + date + "&appointmentType=" + aptType + "&lang=fr-fr";
    let headers = {
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
    let redirectUrl = "https://" + prefix + country + ".tlscontact.com/appointment/" + issueCountry + "/" + code + "/" + formGroupId;
    let response = await executePOST(bookingUrl, headers, redirectUrl);
    if (response) {
        if (response.status === 200) {
            var jsonResponse = await response.json();
            if (jsonResponse.status === "success") {
                is_booking_successful = true;
                const endTime = performance.now();
                const duration = (endTime - startTime) / 1000;
                return ("SLOT TAKEN " + timeslot + "  " + date + "  . (" + duration.toFixed(2) + "s.)" + " |  " + getTimestamp());
            } else {
                let errorMessage = jsonResponse.status;
                errorMessage = errorMessage.toString();
                return ("SLOT " + timeslot + "  " + date + " : " + "Erreur .:" + errorMessage + " |  " + getTimestamp());
            }
        } else {
            let errorStatus = response.status;
            errorStatus = errorStatus.toString();
            return ("SLOT " + timeslot + "  " + date + ": " + "Erreur .: " + errorStatus + " |  " + getTimestamp());
        }
    } else {
        return ("SLOT " + timeslot + "  " + date + ": " + "Erreur ." + " |  " + getTimestamp());
    }
}

function handleGUI() {
    var centerSelect = document.getElementById("itemHunterList");
    var selectedCenter = localStorage.getItem("selectedCenter");
    if (selectedCenter && centerSelect) {
        centerSelect.value = selectedCenter;
    }
    let bookButton = document.getElementById("selectHunterButton");
    if (bookButton) {
        bookButton.addEventListener("click", async function (event) {
            event.preventDefault();
            localStorage.setItem("selectedCenter", centerSelect.value);
            if (!is_operation_in_progress) {
                console.log("running..");
                await runExtension(true, "");
            }
        });
    }
    let testButton = document.getElementById("testButton");
    if (testButton) {
        testButton.addEventListener("click", async function (event) {
            event.preventDefault();
            console.log("Test operation started..");
            await runTest();
        });
    }
    let refreshTimeInput = document.getElementById("refreshHunterTime");
    if (refreshTimeInput) {
        refreshTimeInput.addEventListener("change", function () {
            let newRefreshTime = Number(refreshTimeInput.value);
            console.log("New refresh time (s): ", newRefreshTime);
            clearInterval(timer_interval_id);
            timer_interval_id = setInterval(keep_session_alive, newRefreshTime * 1000);
        });
    }
}

function padNumber(number) {
    return number < 10 ? "0" + number : number;
}

function getTimestamp() {
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    let timestamp = + padNumber(hours) + ":" + padNumber(minutes) + ":" + padNumber(seconds);
    return timestamp;
}

async function runExtension(isParallel, trigger) {
    is_operation_in_progress = true;
    if (operation_flag_interval_id) {
        clearInterval(operation_flag_interval_id);
    }
    operation_flag_interval_id = setInterval(reset_operation_flag, $Time.operation_flag_interval_id);
    const startTime = performance.now();
    if (trigger == "SIGNAL") {
        set_warning("Déclenchement Signal en cours..");
    } else {
        set_warning("running..");
    }
    let currentUrl = window.location.href; // Gets the current URL of the webpage
    let formGroupId = extractIdFromUrl(currentUrl);
    let isAppointmentPage = currentUrl.includes("tlscontact.com/appointment/");
    let parallelConnections = Number(document.getElementById("parallelConnections").value);
    if (!isAppointmentPage) {
        set_warning("GO to appoimtemet page.");
    } else {
        let xsrfToken = getCookie("XSRF-TOKEN");
        let captchaId = getCaptchaId();
        selectedCenter = localStorage.getItem("selectedCenter");
        let aptType = centerInfo[selectedCenter].aptType;
        let country = centerInfo[selectedCenter].country;
        let prefix = centerInfo[selectedCenter].prefix;
        let code = centerInfo[selectedCenter].code;
        let issueCountry = centerInfo[selectedCenter].issueCountry;
        let apiUrl = "https://" + prefix + country + ".tlscontact.com/services/customerservice/api/tls/appointment/" + issueCountry + "/" + code + "/table?client=" + country + "&formGroupId=" + formGroupId + "&appointmentType=" + aptType + "&appointmentStage=appointment";
        updateUidCookie(generateUUID());
        var response = await executeGET(apiUrl);
        if (response) {
            if (response.status === 200) {
                var jsonResponse = await response.json();
                console.log("calendarTable = ", jsonResponse);
                let validSlots = getTheValidSlots(jsonResponse);
                let validSlotsCount = validSlots.length;
                console.log("nbValidApts = ", validSlotsCount);
                if (isParallel) {
                    if (validSlotsCount > 0) {
                        let randomIndex = Math.floor(Math.random() * validSlotsCount);
                        let maxParallel = Math.max(1, Math.min(validSlotsCount, parallelConnections));
                        let bookingTasks = [];
                        for (let i = 1; i <= maxParallel; i++) {
                            let slotDate = validSlots[randomIndex].date;
                            let slotTime = validSlots[randomIndex].time;
                            console.log("trying to book slot : " + slotDate + " @ " + slotTime);
                            bookingTasks.push(parallel_booking_task(selectedCenter, slotDate, slotTime, captchaId, formGroupId, xsrfToken, startTime));
                            randomIndex = (randomIndex + 0x1) % validSlotsCount;
                        }
                        let bookingResults = "";
                        for (let task of bookingTasks) {
                            const result = await task;
                            bookingResults += result + "<br>";
                            console.log(result);
                        }
                        if (trigger != "") {
                            bookingResults += "Trigger: " + trigger + "<br>";
                        }
                        if (is_booking_successful) {
                            set_positive(bookingResults);
                        } else {
                            set_error(bookingResults);
                        }
                    } else {
                        const endTime = performance.now();
                        const duration = (endTime - startTime) / 1000;
                        set_info("𝟐𝟎𝟎 𝐨𝐤 |" + duration.toFixed(2) + "s| " + getTimestamp());
                    }
                } else {
                    const endTime = performance.now();
                    const duration = (endTime - startTime) / 1000;
                    set_info(validSlotsCount.toString() + " rendez-vous disponible(s). En: " + duration.toFixed(2) + "s | @ " + getTimestamp());
                }
            } else {
                let errorMessage = "";
                if (response.status === 400) {
                    errorMessage = "400";
                } else {
                    if (response.status === 401) {
                        errorMessage = "401";
                    } else {
                        if (response.status === 403) {
                            errorMessage = "Forbidden [403]";
                        } else {
                            if (response.status === 404) {
                                errorMessage = "404";
                            } else {
                                if (response.status === 429) {
                                    errorMessage = "429";
                                    try {
                                        let retryAfter = response.headers.get("Retry-After");
                                        retryAfter = retryAfter / 60;
                                        errorMessage += " | Durée de blocage: " + retryAfter.toFixed(2) + "min";
                                    } catch (error) {
                                    }
                                } else if (response.status === 500) {
                                    errorMessage = "500";
                                } else {
                                    errorMessage = response.status;
                                }
                            }
                        }
                    }
                }
                errorMessage = errorMessage.toString();
                console.log("Erreur GET:" + errorMessage);
                set_error("Erreur : " + errorMessage + " |  " + getTimestamp());
            }
        } else {
            console.log("Erreur GET");
            set_error("Erreur| " + getTimestamp());
        }
    }
    console.log("script finished.");
    is_operation_in_progress = false;
}

async function runTest() {
    set_warning("Test en cours..");

    /*[29/08]$_@-ElQada-#_$[2024]*/
    function waitForRecaptcha(timeout = $Time.waitForRecaptcha) {
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
        set_positive("reCAPTCHA OK.");
    } catch (error) {
        set_error("Erreur reCAPTCHA !");
    }
    console.log("Test operation ended.");
}

// Other parts of the script remain unchanged...

function updateMessageInHeading(message, color) {
    // Find the target <h1> element
    let targetHeading = document.querySelector('.tls-home-text-group .tls-heading-1');
    if (!targetHeading) {
        console.error('Target heading not found.');
        return;
    }

    // Update the message and style of the <h1> element
    targetHeading.textContent = message; // Replace the text content with the message
    targetHeading.style.color = color; // Set the text color based on the message type
    // Optional: Apply additional styles as needed
    targetHeading.style.fontFamily = '"Calibri", Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif';
    targetHeading.style.textAlign = 'center';
    targetHeading.style.margin = '0';
    targetHeading.style.lineHeight = '4rem';
    targetHeading.style.fontSize = '1.8rem';
}

// Example usage of the modified function with specific colors
function set_warning(message) {
    updateMessageInHeading(message, '#f5d200'); // Yellow color for warnings
}

function set_error(message) {
    updateMessageInHeading(message, '#da1c24'); // Red color for errors
}

function set_positive(message) {
    updateMessageInHeading(message, '#1dcd79'); // Green color for positive messages
}

function set_info(message) {
    updateMessageInHeading(message, '#fff'); // Blue color for informational messages
}
function isMatchingUrl(url) {
    return url.includes("tlscontact.com/appointment/") ;
}


function extractIdFromUrl(url) {
    let match = url.match(/\/(\d+)$/);
    return match && match [1] ? match [1] : null;
}

function getCookie(name) {
    /*[29/08]$_@-ElQada-#_$[2024]*/
    return (document.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith(name + "="))
        ?.["split"]("=")[1] || null);
}

function getCaptchaId() {
    let captchaElements = document.getElementsByClassName("grecaptcha-logo");
    if (captchaElements.length > 0) {
        let iframeSrc = captchaElements [0].getElementsByTagName("iframe")[0].src;
        let params = new URLSearchParams(iframeSrc);
        let captchaId = params.get("k");
        return captchaId;
    }
    return "";
}

function generateUUID() {
    const randomValues = crypto.getRandomValues(new Uint8Array(16));
    let uuid = "";
    for (let i = 0; i < randomValues.length; i++) {
        uuid += String.fromCharCode(randomValues[i]);
    }
    let base64Uuid = btoa(uuid);
    base64Uuid = base64Uuid.replace(/\+/g, "A").replace(/\//g, "B");
    return base64Uuid;
}

function updateUidCookie(uid) {
    const expirationDate = new Date();
    /*[29/08]$_@-ElQada-#_$[2024]*/
    expirationDate.setTime(expirationDate.getTime() + $Time.updateUidCookie); // 45 days in milliseconds
    let expires = "; expires=" + expirationDate.toUTCString();
    document.cookie = "uid=" + (uid || "") + expires + "; path=/; domain=" + ".tlscontact.com";
}

async function executeGET(url) {
    return new Promise((resolve) => {
        fetch(url)
            .then((response) => response)
            .then((response) => {
                resolve(response);
            })
            ["catch"]((error) => {
            console.log("Error making GET request:", error);
            resolve(undefined);
        });
    });
}

async function executePOST(url, headers, referrer) {
    return new Promise((resolve) => {
        fetch(url, {
            headers: headers,
            referrer: referrer,
            referrerPolicy: "strict-origin-when-cross-origin",
            body: null,
            method: "POST",
            mode: "cors",
            credentials: "include",
        })
            .then((response) => response)
            .then((response) => {
                resolve(response);
            })
            ["catch"]((error) => {
            console.log("Error making POST request:", error);
            resolve(undefined);
        });
    });
}

function getTheValidSlots(calendarData) {
    let validSlots = [];
    Object.keys(calendarData).forEach((date) => {
        Object.keys(calendarData[date]).forEach((time) => {
            if (calendarData[date][time] === 1) {
                validSlots.push({
                    date: date, time: time,
                });
            }
        });
    });
    return validSlots;
}
function selectCenterBasedOnUrlAndHideList() {
    const currentUrl = window.location.href; // Get the current URL
    let selectedCenterValue = null;

    // Check the URL pattern and map it to the corresponding center option value
    if (currentUrl.includes('/dz/dzAAE2fr/')) {
        selectedCenterValue = 'TlsFranceAnnaba_Case1'; // Value for Annaba center
    } else if (currentUrl.includes('/dz/dzORN2fr/')) {
        selectedCenterValue = 'TlsFranceOran_Case1'; // Value for Oran center
    } else if (currentUrl.includes('/ma//')) {
        selectedCenterValue = 'TlsFranceFes_Case1'; // Value for Fes center
    } else if (currentUrl.includes('/ma/maOUD2fr/')) {
        selectedCenterValue = 'TlsFranceOujda_Case1'; // Value for Oujda center
    } else if (currentUrl.includes('/ma/maCAS2fr/')) {
        selectedCenterValue = 'TlsFranceCasablanca_Case1'; // Value for Casablanca center
    } else if (currentUrl.includes('/ma/maTNG2fr/')) {
        selectedCenterValue = 'TlsFranceTanger_Case1'; // Value for Tanger center
    } else if (currentUrl.includes('/ma/maAGA2fr/')) {
        selectedCenterValue = 'TlsFranceAgadir_Case1'; // Value for Agadir center
    } else if (currentUrl.includes('/ma/maRAK2fr/')) {
        selectedCenterValue = 'TlsFranceMarrakech_Case1'; // Value for Marrakech center
    } else if (currentUrl.includes('/ma/maRBA2fr/')) {
        selectedCenterValue = 'TlsFranceRabat_Case1'; // Value for Rabat center
    }

    // Automatically select the center if a match is found
    if (selectedCenterValue) {
        const centerSelectElement = document.getElementById('itemHunterList');
        if (centerSelectElement) {
            centerSelectElement.value = selectedCenterValue;
            console.log(`Center automatically selected based on URL: ${selectedCenterValue}`);
            // Hide the center selection list
            centerSelectElement.style.display = 'none';
            // Optionally, trigger any change events associated with the selection
            centerSelectElement.dispatchEvent(new Event('change'));
        } else {
            console.error('Center selection element not found.');
        }
    } else {
        console.error('No matching center found for the current URL.');
    }
}
// Call the function to automatically select the center and hide the list when the script runs
selectCenterBasedOnUrlAndHideList();

