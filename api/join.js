const { google } = require('googleapis');

const SHEET_RANGE = 'Sheet1!A:E';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PATHWAYS = ['attend', 'create', 'partner', 'follow'];

function isValidBody(body) {
  return (
    body &&
    typeof body.name === 'string' &&
    body.name.trim().length > 0 &&
    typeof body.email === 'string' &&
    EMAIL_PATTERN.test(body.email.trim()) &&
    Array.isArray(body.pathways) &&
    body.pathways.length > 0 &&
    body.pathways.every((pathway) => PATHWAYS.includes(pathway))
  );
}

async function appendRow({ name, email, pathways, consent }) {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const sheets = google.sheets({ version: 'v4', auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: SHEET_RANGE,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[
        new Date().toISOString(),
        name.trim(),
        email.trim(),
        [...new Set(pathways)].join(', '),
        consent === true ? 'yes' : 'no',
      ]],
    },
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  if (!isValidBody(req.body)) {
    res.status(400).json({ ok: false, error: 'Invalid submission' });
    return;
  }

  try {
    await appendRow(req.body);
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Failed to append join-form row', err);
    res.status(500).json({ ok: false, error: 'Could not save submission' });
  }
};
