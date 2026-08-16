/**
 * Fair Pay Ireland — Gemini proxy (Google Apps Script web app).
 *
 * This is the ONLY place the Gemini API key lives. It is stored in the
 * Apps Script project's Script Properties (see SETUP below) and NEVER
 * committed to the repository.
 *
 * SETUP
 *  1. Create a new Apps Script project: https://script.google.com/home
 *  2. Paste this file as Code.gs.
 *  3. Run  `setKey('YOUR_GEMINI_API_KEY')`  once in the editor
 *     (free key from https://aistudio.google.com/apikey).
 *  4. Deploy > New deployment > Web app:
 *       - Execute as: Me
 *       - Who has access: Anyone
 *     Copy the /exec URL into the project's config.js as APPS_SCRIPT_URL.
 *
 * CORS: Apps Script web apps respond to simple requests; the client
 * sends a plain POST (Content-Type: text/plain) to avoid preflight.
 */

var MODEL = 'gemini-1.5-flash';
var KEY_PROP = 'GEMINI_API_KEY';
var HELPTEXT = 'Fair Pay Ireland proxy. POST {"system": "...", "prompt": "..."} and get back {"text": "..."}';

function setKey(key) {
  PropertiesService.getScriptProperties().setProperty(KEY_PROP, key);
}

/**
 * Easiest way to store your key (works in every Apps Script UI version):
 *  1. Replace PASTE_YOUR_GEMINI_API_KEY_HERE with your real key below.
 *  2. In the toolbar at the top of the Editor, make sure the function
 *     dropdown says "configure", then press the Run ▶ button.
 *  3. Authorise when asked, then delete the key from this line again
 *     (it is now stored safely in Script Properties).
 */
function configure() {
  setKey('PASTE_YOUR_GEMINI_API_KEY_HERE');
}

function doGet() {
  return json_({ help: HELPTEXT, keySet: !!PropertiesService.getScriptProperties().getProperty(KEY_PROP) });
}

function doPost(e) {
  var key = PropertiesService.getScriptProperties().getProperty(KEY_PROP);
  if (!key) return json_({ error: 'GEMINI_API_KEY not set in Script Properties.' }, 500);

  var body = {};
  try { body = JSON.parse(e.postData.contents || '{}'); } catch (err) {}

  var system = String(body.system || '').slice(0, 4000);
  var prompt = String(body.prompt || '').slice(0, 8000);
  var model  = String(body.model || MODEL);

  var payload = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    systemInstruction: system ? { parts: [{ text: system }] } : undefined,
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 4096
    }
  };

  try {
    var resp = UrlFetchApp.fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent?key=' + key,
      {
        method: 'post',
        contentType: 'application/json',
        payload: JSON.stringify(payload),
        muteHttpExceptions: true
      }
    );
    var out = JSON.parse(resp.getContentText());
    var text = (out.candidates && out.candidates[0] && out.candidates[0].content &&
                out.candidates[0].content.parts && out.candidates[0].content.parts[0].text) || '';
    if (!text) {
      var msg = out.error && out.error.message ? out.error.message : 'No text in Gemini response';
      return json_({ error: msg, status: resp.getResponseCode() }, resp.getResponseCode());
    }
    return json_({ text: text, model: model });
  } catch (err) {
    return json_({ error: String(err) }, 500);
  }
}

function json_(obj, code) {
  var out = ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
  var resp = code ? ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON) : out;
  if (code) resp = out;
  return resp;
}
