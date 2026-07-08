// Rabet CRM — outbound email send (SMTP) for the CRM's reply/compose UI.
//
// Deploy: Supabase Dashboard -> Edge Functions -> New Function -> paste this
// file -> Deploy. Then add the GMAIL_APP_PASSWORD secret under that
// function's Secrets tab. SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are
// injected automatically by Supabase - do not set those yourself.
//
// Security model matches schema-emails.sql: the browser never holds the
// Gmail app password. app.js calls this function with { p_name, p_key_hash,
// ... } - the same credentials it already sends to every crm_* RPC. This
// function verifies them via crm_verify() before sending anything, using the
// service_role key (a server-side secret, never shipped to app.js).

// @ts-ignore - remote import, resolved by the Supabase Edge Runtime at deploy time
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const GMAIL_USER = 'shalakomar9@gmail.com'
const GMAIL_APP_PASSWORD = Deno.env.get('GMAIL_APP_PASSWORD')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  })
}

// ── Minimal SMTP client (STARTTLS, AUTH LOGIN) ──────────────────────────────
// Sending is a much simpler protocol than IMAP - a short fixed command
// sequence with no MIME parsing on the way in - so this is hand-rolled
// rather than pulling in a dependency.

async function readSmtpResponse(conn: Deno.Conn): Promise<string> {
  const decoder = new TextDecoder()
  let buf = ''
  const chunk = new Uint8Array(4096)
  while (true) {
    const n = await conn.read(chunk)
    if (n === null) break
    buf += decoder.decode(chunk.subarray(0, n))
    const lines = buf.split('\r\n').filter(Boolean)
    const last = lines[lines.length - 1]
    // Multi-line SMTP responses end on a line with a space after the code
    // (e.g. "250-PIPELINING" continues, "250 OK" is the last line).
    if (last && /^\d{3} /.test(last)) break
  }
  return buf
}

async function sendSmtpCommand(conn: Deno.Conn, command: string): Promise<string> {
  await conn.write(new TextEncoder().encode(command + '\r\n'))
  return readSmtpResponse(conn)
}

function assertOk(response: string, context: string) {
  const code = parseInt(response.slice(0, 3), 10)
  if (code < 200 || code >= 400) {
    throw new Error(`SMTP error at ${context}: ${response.trim()}`)
  }
}

function b64(text: string): string {
  return btoa(unescape(encodeURIComponent(text)))
}

function encodeSubject(subject: string): string {
  // RFC 2047 encoded-word - needed for non-ASCII (Arabic) subjects.
  return /^[\x00-\x7F]*$/.test(subject) ? subject : `=?UTF-8?B?${b64(subject)}?=`
}

function buildMessage(opts: {
  from: string; to: string; subject: string; bodyText: string; bodyHtml: string; messageId: string
}): string {
  const { from, to, subject, bodyText, bodyHtml, messageId } = opts
  const headers = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${encodeSubject(subject)}`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: ${messageId}`,
    'MIME-Version: 1.0',
  ]

  if (bodyHtml) {
    const boundary = `----rabet-${crypto.randomUUID()}`
    headers.push(`Content-Type: multipart/alternative; boundary="${boundary}"`)
    const parts = [
      `--${boundary}`,
      'Content-Type: text/plain; charset="UTF-8"',
      'Content-Transfer-Encoding: base64',
      '',
      b64(bodyText || ''),
      `--${boundary}`,
      'Content-Type: text/html; charset="UTF-8"',
      'Content-Transfer-Encoding: base64',
      '',
      b64(bodyHtml),
      `--${boundary}--`,
    ]
    return headers.join('\r\n') + '\r\n\r\n' + parts.join('\r\n')
  }

  headers.push('Content-Type: text/plain; charset="UTF-8"')
  headers.push('Content-Transfer-Encoding: base64')
  return headers.join('\r\n') + '\r\n\r\n' + b64(bodyText || '')
}

async function sendViaSmtp(
  to: string, subject: string, bodyText: string, bodyHtml: string, messageId: string,
) {
  let conn: Deno.Conn = await Deno.connect({ hostname: 'smtp.gmail.com', port: 587 })
  try {
    assertOk(await readSmtpResponse(conn), 'greeting')
    assertOk(await sendSmtpCommand(conn, 'EHLO rabet-crm'), 'EHLO')
    assertOk(await sendSmtpCommand(conn, 'STARTTLS'), 'STARTTLS')

    conn = await Deno.startTls(conn, { hostname: 'smtp.gmail.com' })

    assertOk(await sendSmtpCommand(conn, 'EHLO rabet-crm'), 'EHLO (TLS)')
    assertOk(await sendSmtpCommand(conn, 'AUTH LOGIN'), 'AUTH LOGIN')
    assertOk(await sendSmtpCommand(conn, btoa(GMAIL_USER)), 'AUTH username')
    assertOk(await sendSmtpCommand(conn, btoa(GMAIL_APP_PASSWORD)), 'AUTH password')

    assertOk(await sendSmtpCommand(conn, `MAIL FROM:<${GMAIL_USER}>`), 'MAIL FROM')
    for (const addr of to.split(',').map((a) => a.trim()).filter(Boolean)) {
      assertOk(await sendSmtpCommand(conn, `RCPT TO:<${addr}>`), 'RCPT TO')
    }
    assertOk(await sendSmtpCommand(conn, 'DATA'), 'DATA')

    const message = buildMessage({ from: GMAIL_USER, to, subject, bodyText, bodyHtml, messageId })
    // Dot-stuff per RFC 5321: a line consisting of (or starting with) "."
    // must be escaped, since a lone "." on a line ends the DATA block.
    const stuffed = message.replace(/\r\n\./g, '\r\n..')
    assertOk(await sendSmtpCommand(conn, stuffed + '\r\n.'), 'message body')

    await sendSmtpCommand(conn, 'QUIT')
  } finally {
    try { conn.close() } catch { /* already closed by QUIT */ }
  }
}

// ── Handler ──────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS })
  if (req.method !== 'POST') return jsonResponse({ error: 'method not allowed' }, 405)

  let payload: Record<string, unknown>
  try {
    payload = await req.json()
  } catch {
    return jsonResponse({ error: 'invalid JSON' }, 400)
  }

  const { p_name, p_key_hash, to_addresses, subject, body_text, body_html, thread_id } = payload as {
    p_name?: string; p_key_hash?: string; to_addresses?: string
    subject?: string; body_text?: string; body_html?: string; thread_id?: string
  }
  if (!p_name || !p_key_hash || !to_addresses) {
    return jsonResponse({ error: 'missing required fields' }, 400)
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  const { data: verified, error: verifyError } = await supabase.rpc('crm_verify', { p_name, p_key_hash })
  if (verifyError || !verified) {
    return jsonResponse({ error: 'not authorized' }, 401)
  }

  const messageId = `<${crypto.randomUUID()}@gmail.com>`

  try {
    await sendViaSmtp(to_addresses, subject || '', body_text || '', body_html || '', messageId)
  } catch (err) {
    return jsonResponse({ error: `send failed: ${(err as Error).message}` }, 502)
  }

  const { data: newId, error: insertError } = await supabase.rpc('crm_insert_outbound_email', {
    p_name, p_key_hash,
    p_data: {
      gmail_message_id: messageId,
      thread_id: thread_id || null,
      from_address: GMAIL_USER,
      to_addresses,
      subject: subject || '',
      body_text: body_text || '',
      body_html: body_html || '',
    },
  })

  if (insertError) {
    // The email actually sent, but the CRM record failed to write - surface
    // this distinctly so the UI can warn instead of silently losing it.
    return jsonResponse({ sent: true, recorded: false, error: insertError.message }, 207)
  }

  return jsonResponse({ sent: true, recorded: true, id: newId })
})
