import { TIME_INTERVALS } from "./main"

export function sleep(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export function padNumber(number) {
    return number < 10 ? "0" + number : number;
}

export function getTimestamp() {
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

export function isMatchingUrl(url) {
    return url.includes("tlscontact.com/appointment/") ;
}

export function extractIdFromUrl(url) {
    let match = url.match(/\/(\d+)$/);
    return match && match [1] ? match [1] : null;
}

export function getCookie(name) {
    /*[29/08]$_@-ElQada-#_$[2024]*/
    return (document.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith(name + "="))
        ?.["split"]("=")[1] || null);
}

export function getCaptchaId() {
    let captchaElements = document.getElementsByClassName("grecaptcha-logo");
    if (captchaElements.length > 0) {
        let iframeSrc = captchaElements [0].getElementsByTagName("iframe")[0].src;
        let params = new URLSearchParams(iframeSrc);
        let captchaId = params.get("k");
        return captchaId;
    }
    return "";
}

export function generateUUID() {
    const randomValues = crypto.getRandomValues(new Uint8Array(16));
    let uuid = "";
    for (let i = 0; i < randomValues.length; i++) {
        uuid += String.fromCharCode(randomValues[i]);
    }
    let base64Uuid = btoa(uuid);
    base64Uuid = base64Uuid.replace(/\+/g, "A").replace(/\//g, "B");
    return base64Uuid;
}

export function updateUidCookie(uid) {
    const expirationDate = new Date();
    /*[29/08]$_@-ElQada-#_$[2024]*/
    expirationDate.setTime(expirationDate.getTime() + TIME_INTERVALS.UPDATE_UID_COOKIE_INTERVAL);
    let expires = "; expires=" + expirationDate.toUTCString();
    document.cookie = "uid=" + (uid || "") + expires + "; path=/; domain=" + ".tlscontact.com";
}

export async function executeGET(url) {
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

export async function executePOST(url, headers, referrer) {
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

export function getTheValidSlots(calendarData) {
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
