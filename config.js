/**
 * Fair Pay Ireland — app configuration.
 *
 * NO SECRETS IN THIS FILE. The Gemini API key lives only in the Apps
 * Script proxy's Script Properties (see appsscript/Code.gs).
 *
 * APPS_SCRIPT_URL: paste the /exec URL from your Apps Script web-app
 * deployment. If left empty, the app runs in fully keyless mode and
 * writes every agent deliverable deterministically from live CSO data.
 */
var CONFIG = {
  APPS_SCRIPT_URL: "",
  MODEL: "gemini-1.5-flash",
  SITE: "https://axelvibe.github.io/fair-pay-ireland/"
};
