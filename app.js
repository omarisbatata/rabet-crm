// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONFIG  ← Replace these two lines with your Supabase project values
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const SUPABASE_URL = 'https://uirdvnhafmuqtcsobyhr.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpcmR2bmhhZm11cXRjc29ieWhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1OTkzNjUsImV4cCI6MjA5ODE3NTM2NX0.HJnj1Z_Gwx22yUNQbPLmL5igUv6kkLKZjyOTp_QNwXw'

// ── Constants ─────────────────────────────────────────────────────────────────
const TEAM = ['Omar', 'Taim Kiwan', 'Taim Al Saadi']
const TEAM_CLR  = { 'Omar': '#9D8FFA', 'Taim Kiwan': '#F59E0B', 'Taim Al Saadi': '#38BDF8' }
const TEAM_INIT = { 'Omar': 'O',       'Taim Kiwan': 'TK',      'Taim Al Saadi': 'TA' }
const TEAM_BG   = { 'Omar': 'rgba(157,143,250,.15)', 'Taim Kiwan': 'rgba(245,158,11,.12)', 'Taim Al Saadi': 'rgba(56,189,248,.12)' }

const STATUS_EN = {
  0: { clr: '#58607A', label: '● Not Contacted', cls: 's0-badge' },
  1: { clr: '#F59E0B', label: '● Contacted',     cls: 's1-badge' },
  2: { clr: '#38BDF8', label: '● Meeting Set',   cls: 's2-badge' },
  3: { clr: '#34D399', label: '● Closed ✓',      cls: 's3-badge' },
  4: { clr: '#F43F5E', label: '● Dead ✗',        cls: 's4-badge' },
}
const STATUS_AR = {
  0: { clr: '#58607A', label: '● لم يُتواصل',    cls: 's0-badge' },
  1: { clr: '#F59E0B', label: '● تم التواصل',   cls: 's1-badge' },
  2: { clr: '#38BDF8', label: '● اجتماع محدد',  cls: 's2-badge' },
  3: { clr: '#34D399', label: '● مُغلق ✓',       cls: 's3-badge' },
  4: { clr: '#F43F5E', label: '● ميت ✗',         cls: 's4-badge' },
}

const INDUSTRIES = [
  'Restaurant / Food','Retail / Shop','Real Estate','Medical / Pharmacy',
  'Education','Tech / IT','Fashion / Clothing','Construction','Logistics',
  'Media / Marketing','Services','Manufacturing','Other',
]

const SERVICES_EN = [
  'Website Design & Dev','Social Media Mgmt','Digital Advertising',
  'Brand Identity','Content Creation & Photography','SEO & Optimisation','Multiple / TBD',
]
const SERVICES_AR = [
  'تصميم مواقع','إدارة سوشال ميديا','إعلانات رقمية',
  'هوية بصرية','تصوير ومحتوى','تحسين محركات البحث','متعدد / غير محدد',
]

const T = {
en: {
  login_who: 'Who are you?',
  login_next: 'Continue →',
  login_enter_key: 'Enter your key to continue.',
  login_wrong_key: 'Wrong key. Try again.',
  login_enter: 'Enter',
  login_back: '← Back',
  login_set_title: 'Set your key',
  login_set_sub: "You're new here. Set a private key — you'll use it to log in on any device.",
  login_new_key: 'New key',
  login_confirm_key: 'Confirm key',
  login_set_btn: 'Set Key & Enter',
  keys_no_match: "Keys don't match.",
  keys_too_short: 'Key must be at least 4 characters.',
  team_label: 'Team',
  pipeline_label: 'Pipeline',
  add: '+ Add Company',
  edit: 'Edit',
  delete: 'Delete',
  save: 'Save',
  cancel: 'Cancel',
  logout: 'Log Out',
  settings: 'Settings',
  export: 'Export CSV',
  search: 'Search companies…',
  filter_all: 'All Statuses',
  all_industries: 'All Industries',
  all_team: 'All',
  total_suffix: 'companies',
  no_results: 'No companies match your filters.',
  confirm_delete: 'Delete this company? This cannot be undone.',
  no_selection: 'Select a company first.',
  status_0: 'Not Contacted', status_1: 'Contacted',
  status_2: 'Meeting Set',   status_3: 'Closed ✓', status_4: 'Dead ✗',
  col_name: 'Company', col_industry: 'Industry', col_contact: 'Contact',
  col_service: 'Service', col_status: 'Status', col_followup: 'Follow-up',
  col_by: 'By', col_updated: 'Updated', col_notes: 'Notes',
  f_name: 'Company Name', f_industry: 'Industry',
  f_contact_type: 'Contact Type', f_contact_val: 'Contact Value',
  f_service: 'Service', f_status: 'Status', f_owner: 'Assigned To',
  f_followup: 'Next Follow-up', f_followup_hint: 'YYYY-MM-DD  (leave blank if none)',
  f_notes: 'Notes',
  phone: '📞  Phone', email: '✉  Email', social: '⚡  Social',
  ctx_status: 'Set Status', ctx_wa: 'Open WhatsApp',
  upcoming: 'upcoming', overdue: 'overdue',
  drive_on: 'Connected to Supabase ✓', drive_off: 'Supabase unreachable',
  refreshed: 'Updated by team',
  settings_change_key: 'Change Your Key',
  settings_key_hint: 'Enter your current key to set a new one.',
  settings_current: 'Current key', settings_new: 'New key', settings_confirm: 'Confirm new key',
  saved: 'Saved.',
  add_title: 'Add Company', edit_title: 'Edit Company',
  lang_switch: 'العربية',
},
ar: {
  login_who: 'من أنت؟',
  login_next: 'متابعة →',
  login_enter_key: 'أدخل مفتاحك للمتابعة.',
  login_wrong_key: 'المفتاح خاطئ. حاول مرة أخرى.',
  login_enter: 'دخول',
  login_back: '→ رجوع',
  login_set_title: 'اضبط مفتاحك',
  login_set_sub: 'أول مرة تدخل. اختر مفتاحاً خاصاً ستستخدمه لتسجيل الدخول.',
  login_new_key: 'مفتاح جديد',
  login_confirm_key: 'تأكيد المفتاح',
  login_set_btn: 'حفظ المفتاح والدخول',
  keys_no_match: 'المفتاحان غير متطابقان.',
  keys_too_short: 'المفتاح يجب أن يكون 4 أحرف على الأقل.',
  team_label: 'الفريق',
  pipeline_label: 'المسار',
  add: '+ إضافة شركة',
  edit: 'تعديل',
  delete: 'حذف',
  save: 'حفظ',
  cancel: 'إلغاء',
  logout: 'تسجيل الخروج',
  settings: 'الإعدادات',
  export: 'تصدير CSV',
  search: 'بحث في الشركات…',
  filter_all: 'كل الحالات',
  all_industries: 'كل القطاعات',
  all_team: 'الكل',
  total_suffix: 'شركة',
  no_results: 'لا توجد شركات تطابق الفلتر.',
  confirm_delete: 'حذف هذه الشركة؟ لا يمكن التراجع.',
  no_selection: 'اختر شركة أولاً.',
  status_0: 'لم يُتواصل', status_1: 'تم التواصل',
  status_2: 'اجتماع محدد', status_3: 'مُغلق ✓', status_4: 'ميت ✗',
  col_name: 'الشركة', col_industry: 'القطاع', col_contact: 'التواصل',
  col_service: 'الخدمة', col_status: 'الحالة', col_followup: 'موعد متابعة',
  col_by: 'بواسطة', col_updated: 'آخر تحديث', col_notes: 'ملاحظات',
  f_name: 'اسم الشركة', f_industry: 'القطاع',
  f_contact_type: 'نوع التواصل', f_contact_val: 'بيانات التواصل',
  f_service: 'الخدمة', f_status: 'الحالة', f_owner: 'المسؤول',
  f_followup: 'موعد المتابعة التالي', f_followup_hint: 'YYYY-MM-DD',
  f_notes: 'ملاحظات',
  phone: '📞  هاتف', email: '✉  بريد', social: '⚡  سوشال',
  ctx_status: 'تغيير الحالة', ctx_wa: 'فتح واتساب',
  upcoming: 'قادمة', overdue: 'متأخرة',
  drive_on: 'متصل بـ Supabase ✓', drive_off: 'Supabase غير متاح',
  refreshed: 'تحديث من الفريق',
  settings_change_key: 'تغيير مفتاحك',
  settings_key_hint: 'أدخل مفتاحك الحالي لضبط مفتاح جديد.',
  settings_current: 'المفتاح الحالي', settings_new: 'مفتاح جديد', settings_confirm: 'تأكيد المفتاح',
  saved: 'تم الحفظ.',
  add_title: 'إضافة شركة', edit_title: 'تعديل شركة',
  lang_switch: 'English',
},
}

// ── State ─────────────────────────────────────────────────────────────────────
let sb
let state = {
  user:      null,    // { name }
  companies: [],
  lang:      localStorage.getItem('crm_lang') || 'en',
  selected:  null,    // selected company id
  filters:   { status: -1, industry: '', owner: '', query: '' },
  sort:      { col: null, rev: false },
  editingId: null,    // company being edited in modal
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const t   = key => T[state.lang][key] || key
const qs  = sel => document.querySelector(sel)
const qsa = sel => document.querySelectorAll(sel)
const el  = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e }
const today = () => new Date().toISOString().slice(0,10)
const now   = () => new Date().toISOString().slice(0,16).replace('T',' ')

async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('')
}

function sbar(msg, ms = 4000) {
  const el = qs('#sbar-msg')
  el.textContent = msg
  if (ms) setTimeout(() => { if (el.textContent === msg) el.textContent = '' }, ms)
}

function showToast(msg) {
  const toast = qs('#toast')
  toast.textContent = msg
  toast.classList.remove('hidden')
  clearTimeout(showToast._t)
  showToast._t = setTimeout(() => toast.classList.add('hidden'), 3500)
}

// ── Init ──────────────────────────────────────────────────────────────────────
async function init() {
  sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
  applyLang()
  await checkAuth()
}

// ── Auth ──────────────────────────────────────────────────────────────────────
async function checkAuth() {
  const stored = localStorage.getItem('crm_session')
  if (stored) {
    try {
      state.user = JSON.parse(stored)
      await bootApp()
      return
    } catch { localStorage.removeItem('crm_session') }
  }
  showLoginScreen()
}

function showLoginScreen() {
  qs('#login-screen').classList.remove('hidden')
  qs('#app').classList.add('hidden')
  buildLoginStep1()
}

function buildLoginStep1() {
  showStep('step-name')
  const pills = qs('#name-pills')
  pills.innerHTML = ''
  let selected = null

  TEAM.forEach(name => {
    const b = el('button', 'name-pill', name)
    b.addEventListener('click', () => {
      qsa('.name-pill').forEach(p => p.classList.remove('active'))
      b.classList.add('active')
      selected = name
    })
    pills.appendChild(b)
  })

  qs('#btn-next').onclick = async () => {
    if (!selected) return
    await loginStep2(selected)
  }
}

async function loginStep2(name) {
  const { data } = await sb.from('users').select('key_hash').eq('name', name).maybeSingle()

  if (data) {
    // Returning user
    showStep('step-key')
    qs('#greeting-name').textContent = name
    qs('#key-error').classList.add('hidden')
    qs('#input-key').value = ''
    qs('#input-key').focus()

    qs('#btn-login').onclick = async () => {
      const key = qs('#input-key').value
      const hash = await sha256(key)
      if (hash === data.key_hash) {
        state.user = { name }
        localStorage.setItem('crm_session', JSON.stringify(state.user))
        qs('#login-screen').classList.add('hidden')
        await bootApp()
      } else {
        qs('#key-error').classList.remove('hidden')
        qs('#input-key').value = ''
        qs('#input-key').focus()
      }
    }
    qs('#input-key').onkeydown = e => { if (e.key === 'Enter') qs('#btn-login').click() }
    qs('#btn-back-key').onclick = buildLoginStep1

  } else {
    // New user — set key
    showStep('step-set')
    qs('#set-error').classList.add('hidden')
    qs('#input-new-key').value = ''
    qs('#input-confirm-key').value = ''
    qs('#input-new-key').focus()

    qs('#btn-set').onclick = async () => {
      const k1 = qs('#input-new-key').value
      const k2 = qs('#input-confirm-key').value
      const errEl = qs('#set-error')
      if (k1.length < 4) { errEl.textContent = t('keys_too_short'); errEl.classList.remove('hidden'); return }
      if (k1 !== k2)      { errEl.textContent = t('keys_no_match');  errEl.classList.remove('hidden'); return }
      errEl.classList.add('hidden')
      const hash = await sha256(k1)
      const { error } = await sb.from('users').insert({ name, key_hash: hash })
      if (error) { errEl.textContent = error.message; errEl.classList.remove('hidden'); return }
      state.user = { name }
      localStorage.setItem('crm_session', JSON.stringify(state.user))
      qs('#login-screen').classList.add('hidden')
      await bootApp()
    }
    qs('#btn-back-set').onclick = buildLoginStep1
  }
}

function showStep(id) {
  ;['step-name','step-key','step-set'].forEach(s => {
    qs('#'+s).classList[s === id ? 'remove' : 'add']('hidden')
  })
}

function logout() {
  localStorage.removeItem('crm_session')
  state.user = null
  state.companies = []
  showLoginScreen()
}

// ── Boot ──────────────────────────────────────────────────────────────────────
async function bootApp() {
  qs('#app').classList.remove('hidden')
  buildSidebar()
  buildTopbar()
  buildTableHead()
  applyLang()
  setupKeyboard()
  await loadCompanies()
  subscribeRealtime()
  setInterval(updateDriveBadge, 20000)
  updateDriveBadge()
}

// ── Data ──────────────────────────────────────────────────────────────────────
async function loadCompanies() {
  const { data, error } = await sb.from('companies').select('*').order('updated_at', { ascending: false })
  if (!error) state.companies = data || []
  render()
}

async function saveCompany(payload, id = null) {
  const { id: _rid, ...data } = payload   // never send id in the update body
  data.modified_by = state.user.name
  data.updated_at  = new Date().toISOString()
  if (!id) data.created_at = new Date().toISOString()

  if (id) {
    const { error } = await sb.from('companies').update(data).eq('id', id)
    if (error) { sbar('Error: ' + error.message); return false }
  } else {
    const { error } = await sb.from('companies').insert(data)
    if (error) { sbar('Error: ' + error.message); return false }
  }
  await loadCompanies()
  return true
}

async function removeCompany(id) {
  const { error } = await sb.from('companies').delete().eq('id', id)
  if (!error) await loadCompanies()
}

// ── Real-time ─────────────────────────────────────────────────────────────────
function subscribeRealtime() {
  sb.channel('crm').on('postgres_changes', { event: '*', schema: 'public', table: 'companies' },
    async payload => {
      // Skip if we triggered this change ourselves (updated_at within 2s)
      const changedBy = payload.new?.modified_by || payload.old?.modified_by
      if (changedBy && changedBy !== state.user?.name) {
        await loadCompanies()
        showToast(`↺  ${t('refreshed')} — ${changedBy}`)
      }
    }
  ).subscribe()
}

async function updateDriveBadge() {
  try {
    const { error } = await sb.from('users').select('name').limit(1)
    const badge = qs('#drive-badge')
    badge.textContent = error ? t('drive_off') : t('drive_on')
    badge.className = 'drive-badge ' + (error ? 'drive-off' : 'drive-on')
  } catch {
    qs('#drive-badge').className = 'drive-badge drive-off'
    qs('#drive-badge').textContent = t('drive_off')
  }
}

// ── Render ────────────────────────────────────────────────────────────────────
function render() {
  renderTable()
  renderStats()
  renderFollowup()
}

function filteredCompanies() {
  const { status, industry, owner, query } = state.filters
  return state.companies.filter(c => {
    if (status >= 0  && c.status !== status) return false
    if (industry     && c.industry !== industry) return false
    if (owner        && c.assigned !== owner && c.modified_by !== owner) return false
    if (query) {
      const q = query.toLowerCase()
      const fields = [c.name, c.industry, c.contact_value, c.service, c.notes, c.assigned, c.modified_by]
      if (!fields.some(f => f && f.toLowerCase().includes(q))) return false
    }
    return true
  })
}

function renderTable() {
  const data   = filteredCompanies()
  const tbody  = qs('#tbl-body')
  const empty  = qs('#empty-state')
  const scfg   = state.lang === 'ar' ? STATUS_AR : STATUS_EN
  const tod    = today()
  tbody.innerHTML = ''

  if (!data.length) { empty.classList.remove('hidden'); qs('#total-count').textContent = ''; return }
  empty.classList.add('hidden')
  qs('#total-count').textContent = `${data.length} ${t('total_suffix')}`

  data.forEach(c => {
    const isOverdue = c.followup && c.followup < tod && c.status < 3
    const s = scfg[c.status] || scfg[0]
    const byClr  = TEAM_CLR[c.modified_by]  || '#58607A'
    const byBg   = TEAM_BG[c.modified_by]   || 'rgba(88,96,122,.12)'
    const byInit = TEAM_INIT[c.modified_by] || (c.modified_by||'?').slice(0,2).toUpperCase()
    const fuDisp = isOverdue
      ? `<span class="overdue-date">⚠ ${c.followup}</span>`
      : (c.followup || '')
    const contact = [c.contact_type, c.contact_value].filter(Boolean).join('  ')

    const tr = el('tr')
    if (isOverdue) tr.classList.add('overdue')
    if (state.selected === c.id) tr.classList.add('selected')

    tr.innerHTML = `
      <td title="${esc(c.name)}">${esc(c.name)}</td>
      <td>${esc(c.industry)}</td>
      <td title="${esc(contact)}">${esc(contact)}</td>
      <td title="${esc(c.service)}">${esc(c.service)}</td>
      <td class="col-status"><span class="status-badge ${s.cls}">${s.label}</span></td>
      <td>${fuDisp}</td>
      <td><span class="by-init" style="color:${byClr};background:${byBg}" title="${esc(c.modified_by)}">${byInit}</span></td>
      <td>${(c.updated_at||'').slice(0,16).replace('T',' ')}</td>
      <td title="${esc(c.notes)}">${esc(c.notes)}</td>
    `
    tr.addEventListener('click', () => selectRow(c.id))
    tr.addEventListener('dblclick', () => { selectRow(c.id); showModal(c) })
    tr.addEventListener('contextmenu', e => { e.preventDefault(); selectRow(c.id); showCtxMenu(e, c) })
    tbody.appendChild(tr)
  })
}

function esc(str) {
  if (!str && str !== 0) return ''
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}

function selectRow(id) {
  state.selected = id
  qsa('tbody tr').forEach(tr => tr.classList.remove('selected'))
  const rows = qsa('tbody tr')
  const data = filteredCompanies()
  const idx  = data.findIndex(c => c.id === id)
  if (idx >= 0 && rows[idx]) rows[idx].classList.add('selected')
}

function renderStats() {
  const scfg  = state.lang === 'ar' ? STATUS_AR : STATUS_EN
  const stats = qs('#pipeline-stats')
  stats.innerHTML = ''
  for (let i = 0; i < 5; i++) {
    const s     = scfg[i]
    const count = state.companies.filter(c => c.status === i).length
    const row = el('div', 'stat-row')
    row.innerHTML = `<div class="stat-left"><span class="stat-dot" style="color:${s.clr}">●</span><span class="stat-name">${t('status_'+i)}</span></div><span class="stat-count" style="color:${s.clr}">${count}</span>`
    row.addEventListener('click', () => {
      state.filters.status = state.filters.status === i ? -1 : i
      qs('#filter-status').value = state.filters.status >= 0 ? String(i) : '-1'
      renderTable()
    })
    stats.appendChild(row)
  }
}

function renderFollowup() {
  const tod     = today()
  const active  = state.companies.filter(c => c.status < 3)
  const upcoming= active.filter(c => c.followup && c.followup >= tod).length
  const overdue = active.filter(c => c.followup && c.followup < tod).length
  const wrap = qs('#sb-followup')
  wrap.innerHTML = ''
  if (upcoming) {
    const d = el('div','followup-line')
    d.style.color = '#9D8FFA'
    d.textContent = `● ${upcoming} ${t('upcoming')}`
    wrap.appendChild(d)
  }
  if (overdue) {
    const d = el('div','followup-line')
    d.style.color = '#F43F5E'
    d.textContent = `⚠ ${overdue} ${t('overdue')}`
    wrap.appendChild(d)
  }
}

// ── Build static UI ───────────────────────────────────────────────────────────
function buildSidebar() {
  const grid = qs('#team-grid')
  grid.innerHTML = ''

  const allBtn = el('button', `team-btn all${state.filters.owner === '' ? ' active' : ''}`, t('all_team'))
  allBtn.style.setProperty('--tc', '#7C6AF7')
  if (!state.filters.owner) { allBtn.style.background = 'rgba(124,106,247,.15)'; allBtn.style.color = '#9D8FFA'; allBtn.style.borderColor = '#7C6AF7' }
  allBtn.addEventListener('click', () => setOwnerFilter(''))
  grid.appendChild(allBtn)

  TEAM.forEach(name => {
    const clr = TEAM_CLR[name]
    const init = TEAM_INIT[name]
    const b = el('button', `team-btn${state.filters.owner === name ? ' active' : ''}`)
    b.textContent = init
    b.title = name
    b.style.color = clr
    if (state.filters.owner === name) { b.style.background = TEAM_BG[name]; b.style.borderColor = clr; b.style.color = 'white' }
    b.addEventListener('click', () => setOwnerFilter(name))
    grid.appendChild(b)
  })

  qs('#sb-user').textContent = state.user?.name || ''
  qs('#btn-add').onclick      = () => showModal(null)
  qs('#btn-export').onclick   = exportCSV
  qs('#btn-settings').onclick = showSettings
  qs('#btn-lang').textContent = t('lang_switch')
  qs('#btn-lang').onclick     = toggleLang
}

function buildTopbar() {
  // Rebuild selects (called on init + lang toggle — use onchange to avoid stacking listeners)
  const statusSel = qs('#filter-status')
  statusSel.innerHTML = `<option value="-1">${t('filter_all')}</option>`
  for (let i = 0; i < 5; i++) statusSel.innerHTML += `<option value="${i}">${t('status_'+i)}</option>`
  statusSel.value   = String(state.filters.status)
  statusSel.onchange = e => { state.filters.status = parseInt(e.target.value); renderTable() }

  const indSel = qs('#filter-industry')
  indSel.innerHTML = `<option value="">${t('all_industries')}</option>`
  INDUSTRIES.forEach(ind => { indSel.innerHTML += `<option value="${esc(ind)}">${esc(ind)}</option>` })
  indSel.value   = state.filters.industry
  indSel.onchange = e => { state.filters.industry = e.target.value; renderTable() }

  qs('#search-input').placeholder = t('search')
  qs('#search-input').oninput     = e => { state.filters.query = e.target.value.trim(); renderTable() }

  qs('#btn-edit').onclick   = () => {
    const c = state.companies.find(x => x.id === state.selected)
    if (!c) { sbar(t('no_selection')); return }
    showModal(c)
  }
  qs('#btn-delete').onclick = handleDelete
}

function setupKeyboard() {
  document.addEventListener('keydown', e => {
    const tag = document.activeElement.tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
    if (!qs('#modal-overlay').classList.contains('hidden') ||
        !qs('#settings-overlay').classList.contains('hidden')) return
    if (e.key === 'n' || e.key === 'N') showModal(null)
    if (e.key === 'e' || e.key === 'E') {
      const c = state.companies.find(x => x.id === state.selected)
      if (c) showModal(c)
    }
    if (e.key === 'Delete') handleDelete()
    if (e.ctrlKey && e.key === 'f') { e.preventDefault(); qs('#search-input').focus() }
    if (e.key === 'Escape') { qs('#search-input').value = ''; state.filters.query = ''; renderTable() }
  })
}

function buildTableHead() {
  const cols = ['col_name','col_industry','col_contact','col_service',
                'col_status','col_followup','col_by','col_updated','col_notes']
  const sortKeys = { col_name:'name', col_industry:'industry', col_service:'service',
                     col_status:'status', col_followup:'followup', col_updated:'updated_at' }
  const head = qs('#tbl-head')
  head.innerHTML = ''
  const tr = el('tr')
  cols.forEach(c => {
    const th = el('th', '', t(c))
    const key = sortKeys[c]
    if (key) {
      th.addEventListener('click', () => setSort(key))
      if (state.sort.col === key) th.classList.add('sorted')
    }
    tr.appendChild(th)
  })
  head.appendChild(tr)
}

function setOwnerFilter(owner) {
  state.filters.owner = owner
  buildSidebar()
  renderTable()
}

function setSort(col) {
  if (state.sort.col === col) state.sort.rev = !state.sort.rev
  else { state.sort.col = col; state.sort.rev = false }
  state.companies.sort((a, b) => {
    let av = a[col] ?? '', bv = b[col] ?? ''
    if (col === 'status') { av = +av; bv = +bv }
    if (col === 'followup') { av = av || '9999-99-99'; bv = bv || '9999-99-99' }
    const res = av < bv ? -1 : av > bv ? 1 : 0
    return state.sort.rev ? -res : res
  })
  buildTableHead()
  renderTable()
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function showModal(company) {
  state.editingId = company?.id || null
  const overlay   = qs('#modal-overlay')
  const body      = qs('#modal-body')
  const scfg      = state.lang === 'ar' ? STATUS_AR : STATUS_EN
  const services  = state.lang === 'ar' ? SERVICES_AR : SERVICES_EN
  const ctypes    = [t('phone'), t('email'), t('social')]

  qs('#modal-title').textContent = company ? t('edit_title') : t('add_title')

  const ctype = company?.contact_type || ctypes[0]
  const cstatus = company?.status ?? 0

  body.innerHTML = `
    <div class="field-group">
      <label class="field-label">${t('f_name')}</label>
      <input class="field-input" id="f-name" value="${esc(company?.name||'')}" />
    </div>
    <div class="field-group">
      <label class="field-label">${t('f_industry')}</label>
      <select class="field-select" id="f-industry">
        <option value=""></option>
        ${INDUSTRIES.map(i => `<option value="${esc(i)}"${company?.industry===i?' selected':''}>${esc(i)}</option>`).join('')}
      </select>
    </div>
    <div class="field-group">
      <label class="field-label">${t('f_contact_type')}</label>
      <div class="pill-group" id="ctype-pills">
        ${ctypes.map(ct => `<button class="pill-btn${ct===ctype?' active':''}" data-ct="${esc(ct)}">${ct}</button>`).join('')}
      </div>
    </div>
    <div class="field-group">
      <label class="field-label">${t('f_contact_val')}</label>
      <input class="field-input" id="f-cval" value="${esc(company?.contact_value||'')}" />
    </div>
    <div class="field-group">
      <label class="field-label">${t('f_service')}</label>
      <select class="field-select" id="f-service">
        <option value=""></option>
        ${services.map(s => `<option value="${esc(s)}"${company?.service===s?' selected':''}>${esc(s)}</option>`).join('')}
      </select>
    </div>
    <div class="field-group">
      <label class="field-label">${t('f_status')}</label>
      <div class="status-pills">
        ${Object.entries(scfg).map(([i,s]) => `<button class="status-pill${+i===cstatus?' active':''}" data-si="${i}" style="color:${s.clr};background:rgba(0,0,0,.15)">${s.label}</button>`).join('')}
      </div>
    </div>
    <div class="field-group">
      <label class="field-label">${t('f_owner')}</label>
      <select class="field-select" id="f-owner">
        ${TEAM.map(n => `<option value="${esc(n)}"${(company?.assigned||state.user.name)===n?' selected':''}>${esc(n)}</option>`).join('')}
      </select>
    </div>
    <div class="field-group">
      <label class="field-label">${t('f_followup')}</label>
      <p class="field-hint">${t('f_followup_hint')}</p>
      <input class="field-input" id="f-followup" placeholder="YYYY-MM-DD" value="${esc(company?.followup||'')}" />
    </div>
    <div class="field-group">
      <label class="field-label">${t('f_notes')}</label>
      <textarea class="field-textarea" id="f-notes">${esc(company?.notes||'')}</textarea>
    </div>
    <div class="modal-footer">
      <button class="btn-primary" id="btn-modal-save">${t('save')}</button>
      <button class="btn-ghost"   id="btn-modal-cancel">${t('cancel')}</button>
    </div>
  `

  // Contact type pills
  let selectedCtype = ctype
  qs('#ctype-pills').addEventListener('click', e => {
    const b = e.target.closest('.pill-btn')
    if (!b) return
    selectedCtype = b.dataset.ct
    qsa('#ctype-pills .pill-btn').forEach(x => x.classList.remove('active'))
    b.classList.add('active')
  })

  // Status pills
  let selectedStatus = cstatus
  qs('.status-pills').addEventListener('click', e => {
    const b = e.target.closest('.status-pill')
    if (!b) return
    selectedStatus = parseInt(b.dataset.si)
    qsa('.status-pill').forEach(x => x.classList.remove('active'))
    b.classList.add('active')
  })

  qs('#btn-modal-save').addEventListener('click', async () => {
    const name = qs('#f-name').value.trim()
    if (!name) { qs('#f-name').focus(); return }
    const fu = qs('#f-followup').value.trim()
    if (fu && !/^\d{4}-\d{2}-\d{2}$/.test(fu)) {
      qs('#f-followup').focus(); return
    }
    const ok = await saveCompany({
      name, status: selectedStatus,
      industry:      qs('#f-industry').value,
      contact_type:  selectedCtype,
      contact_value: qs('#f-cval').value.trim(),
      service:       qs('#f-service').value,
      assigned:      qs('#f-owner').value,
      followup:      fu,
      notes:         qs('#f-notes').value.trim(),
    }, state.editingId)
    if (ok) hideModal()
  })

  qs('#btn-modal-cancel').addEventListener('click', hideModal)
  overlay.classList.remove('hidden')
  qs('#f-name').focus()
}

function hideModal() {
  qs('#modal-overlay').classList.add('hidden')
  state.editingId = null
}

qs('#modal-close').addEventListener('click', hideModal)
qs('#modal-overlay').addEventListener('click', e => { if (e.target === qs('#modal-overlay')) hideModal() })

// ── Delete ────────────────────────────────────────────────────────────────────
async function handleDelete() {
  if (!state.selected) { sbar(t('no_selection')); return }
  if (!confirm(t('confirm_delete'))) return
  await removeCompany(state.selected)
  state.selected = null
}

// ── Context Menu ──────────────────────────────────────────────────────────────
function showCtxMenu(e, company) {
  const menu  = qs('#ctx-menu')
  const scfg  = state.lang === 'ar' ? STATUS_AR : STATUS_EN
  menu.innerHTML = ''

  const subLabel = el('div','ctx-sub-label', t('ctx_status'))
  menu.appendChild(subLabel)
  Object.entries(scfg).forEach(([i,s]) => {
    const item = el('div','ctx-item')
    item.style.color = s.clr
    item.textContent = s.label
    item.addEventListener('click', () => { quickStatus(company, +i); hideCtxMenu() })
    menu.appendChild(item)
  })

  if (company.contact_type && company.contact_type.includes('📞')) {
    menu.appendChild(el('div','ctx-divider'))
    const wa = el('div','ctx-item', `📱 ${t('ctx_wa')}`)
    wa.addEventListener('click', () => { openWhatsApp(company.contact_value); hideCtxMenu() })
    menu.appendChild(wa)
  }

  menu.appendChild(el('div','ctx-divider'))
  const editItem = el('div','ctx-item', `✏ ${t('edit')}`)
  editItem.addEventListener('click', () => { showModal(company); hideCtxMenu() })
  menu.appendChild(editItem)
  const delItem = el('div','ctx-item danger', `✕ ${t('delete')}`)
  delItem.addEventListener('click', () => { hideCtxMenu(); handleDelete() })
  menu.appendChild(delItem)

  // Position
  const x = Math.min(e.clientX, window.innerWidth  - 200)
  const y = Math.min(e.clientY, window.innerHeight - menu.offsetHeight - 20)
  menu.style.left = x + 'px'
  menu.style.top  = y + 'px'
  menu.classList.remove('hidden')
}

function hideCtxMenu() { qs('#ctx-menu').classList.add('hidden') }
document.addEventListener('click',     () => hideCtxMenu())
document.addEventListener('keydown',   e => { if (e.key === 'Escape') hideCtxMenu() })

async function quickStatus(company, status) {
  await saveCompany({ ...company, status }, company.id)
}

function openWhatsApp(phone) {
  const digits = phone.replace(/\D/g,'')
  const num = digits.startsWith('0') ? '963' + digits.slice(1) : digits
  if (num) window.open(`https://wa.me/${num}`)
}

// ── Settings ──────────────────────────────────────────────────────────────────
function showSettings() {
  qs('#settings-overlay').classList.remove('hidden')
  qs('#s-current-key').value = ''
  qs('#s-new-key').value     = ''
  qs('#s-confirm-key').value = ''
  qs('#settings-error').classList.add('hidden')
}

qs('#settings-close').addEventListener('click', () => qs('#settings-overlay').classList.add('hidden'))
qs('#settings-overlay').addEventListener('click', e => {
  if (e.target === qs('#settings-overlay')) qs('#settings-overlay').classList.add('hidden')
})

qs('#btn-save-key').addEventListener('click', async () => {
  const cur = qs('#s-current-key').value
  const k1  = qs('#s-new-key').value
  const k2  = qs('#s-confirm-key').value
  const errEl = qs('#settings-error')

  const { data } = await sb.from('users').select('key_hash').eq('name', state.user.name).single()
  const curHash = await sha256(cur)
  if (!data || data.key_hash !== curHash) {
    errEl.textContent = t('login_wrong_key'); errEl.classList.remove('hidden'); return
  }
  if (k1.length < 4) { errEl.textContent = t('keys_too_short'); errEl.classList.remove('hidden'); return }
  if (k1 !== k2)     { errEl.textContent = t('keys_no_match');  errEl.classList.remove('hidden'); return }

  const newHash = await sha256(k1)
  await sb.from('users').update({ key_hash: newHash }).eq('name', state.user.name)
  errEl.classList.add('hidden')
  qs('#settings-overlay').classList.add('hidden')
  sbar(t('saved'))
})

qs('#btn-logout').addEventListener('click', () => {
  qs('#settings-overlay').classList.add('hidden')
  logout()
})

// ── Lang ──────────────────────────────────────────────────────────────────────
function toggleLang() {
  state.lang = state.lang === 'en' ? 'ar' : 'en'
  localStorage.setItem('crm_lang', state.lang)
  applyLang()
  buildSidebar()
  buildTopbar()
  buildTableHead()
  render()
}

function applyLang() {
  const isAr = state.lang === 'ar'
  document.documentElement.lang = state.lang
  document.documentElement.dir  = isAr ? 'rtl' : 'ltr'

  qsa('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n
    if (T[state.lang][key]) el.textContent = T[state.lang][key]
  })
  qsa('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder
    if (T[state.lang][key]) el.placeholder = T[state.lang][key]
  })
  const ltBtn = qs('#lang-toggle-login')
  if (ltBtn) ltBtn.textContent = t('lang_switch')
  const lBtn = qs('#btn-lang')
  if (lBtn) lBtn.textContent = t('lang_switch')
}

qs('#lang-toggle-login').addEventListener('click', () => {
  state.lang = state.lang === 'en' ? 'ar' : 'en'
  localStorage.setItem('crm_lang', state.lang)
  applyLang()
})

// ── Export CSV ────────────────────────────────────────────────────────────────
function exportCSV() {
  const rows = [
    ['ID','Name','Industry','Contact Type','Contact Value','Service','Status',
     'Assigned','Follow-up','Notes','Modified By','Created','Updated'],
    ...state.companies.map(c => [
      c.id, c.name, c.industry, c.contact_type, c.contact_value, c.service,
      c.status, c.assigned, c.followup, c.notes, c.modified_by,
      c.created_at, c.updated_at,
    ])
  ]
  const csv = rows.map(r => r.map(v => `"${String(v||'').replace(/"/g,'""')}"`).join(',')).join('\n')
  const a = document.createElement('a')
  a.href = 'data:text/csv;charset=utf-8,﻿' + encodeURIComponent(csv)
  a.download = 'rabet_companies.csv'
  a.click()
}

// ── Start ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init)
