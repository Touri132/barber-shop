/* ===========================================================
   Salon Mohammed — app logic
   No build step, no framework: plain DOM updates driven by
   the `data` object below. Appointments and staff are saved
   to the browser's localStorage, so they persist between
   visits on the same device/browser.
   =========================================================== */

const MANAGER_PASSWORD = "shop2026"; // change this to whatever you like
const STORAGE_KEY = "barbershop-data";
const THEME_KEY = "barbershop-theme";
const LANG_KEY = "barbershop-lang";

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30"
];

function seedData() {
  return {
    employees: [
      {
        id: "emp-1", name: "Mohammed", nameAr: "محمد",
        nationality: "Moroccan", nationalityAr: "مغربي", flag: "🇲🇦",
        experience: 10,
        bio: "Ten years behind the chair, trained in classic fades and traditional straight-razor finishes.",
        bioAr: "عشر سنوات خلف الكرسي، متخصص في التدرجات الكلاسيكية والحلاقة بالموس التقليدي.",
        photoUrl: ""
      },
      {
        id: "emp-2", name: "Karim", nameAr: "كريم",
        nationality: "Egyptian", nationalityAr: "مصري", flag: "🇪🇬",
        experience: 6,
        bio: "Specializes in modern skin fades and beard sculpting, with a sharp eye for symmetry.",
        bioAr: "متخصص في التدرجات العصرية وتصفيف اللحية بدقة عالية في التناظر.",
        photoUrl: ""
      },
      {
        id: "emp-3", name: "Bilal", nameAr: "بلال",
        nationality: "Pakistani", nationalityAr: "باكستاني", flag: "🇵🇰",
        experience: 8,
        bio: "Known for classic scissor cuts and hot-towel shaves, calm hands and a steady pace.",
        bioAr: "معروف بقصات المقص الكلاسيكية والحلاقة بالمنشفة الساخنة، بأيادٍ هادئة وإيقاع ثابت.",
        photoUrl: ""
      },
      {
        id: "emp-4", name: "Anas", nameAr: "أنس",
        nationality: "Sudanese", nationalityAr: "سوداني", flag: "🇸🇩",
        experience: 4,
        bio: "The go-to for kids' cuts and quick, clean trims between appointments.",
        bioAr: "الخيار الأول لقصات الأطفال والتشذيب السريع والنظيف بين المواعيد.",
        photoUrl: ""
      }
    ],
    appointments: []
  };
}

/* ---------- translations ---------- */

const T = {
  en: {
    brand: "Salon Mohammed",
    nav_home: "Home", nav_book: "Book", nav_team: "Barbers", nav_manager: "Manager",
    home_eyebrow: "Est. for precision cuts, since day one",
    home_headline1: "A steady hand,", home_headline2: "a sharp line.",
    home_lead: (name, years, nat) => `${name} brings ${years} years of chair time and a ${nat} eye for detail to every cut.`,
    home_lead_fallback: "Book your next cut in a couple of taps.",
    cta_book: "Book an appointment", cta_meet: "Meet the barbers",
    stat_years: "years combined experience",
    stat_barber_one: "barber on the chair", stat_barber_many: "barbers on the floor",
    stat_appts: "appointments booked",
    today_chair: "Today's chair", no_barbers: "No barbers listed yet.",
    years_experience: "years experience",
    book_title: "Reserve your chair", book_subtitle: "Pick a barber and a time that works.",
    label_barber: "Barber", label_name: "Your name", label_phone: "Phone",
    label_date: "Date", label_time: "Time", label_notes: "Notes (optional)",
    placeholder_name: "Full name", placeholder_phone: "05XXXXXXXX",
    placeholder_notes: "Anything the barber should know",
    err_booking: "Please fill in every field (notes are optional).",
    btn_confirm: "Confirm booking", btn_booking: "Booking…",
    booked_title: "You're booked", booked_sub: "We'll see you at the shop. The barber will confirm your slot.",
    btn_book_another: "Book another appointment",
    remind_whatsapp: "Send WhatsApp reminder", remind_sms: "Send SMS reminder",
    remind_note: "These open your own WhatsApp or Messages app with the reminder pre-filled — just tap send.",
    reminder_msg: (name, barber, date, time) => `Hi ${name}, this is a reminder for your haircut appointment with ${barber} on ${date} at ${time} at Salon Mohammed. See you then!`,
    team_title: "The barbers", team_sub: "Every chair, and who's behind it.",
    yrs: "yrs",
    manager_title_login: "Manager access", staff_only: "Staff only.",
    password_placeholder: "Password", wrong_password: "Wrong password — try again.",
    btn_enter: "Enter",
    editor_barbers: "Barbers", add_barber: "Add barber",
    field_name_en: "Name (English)", field_name_ar: "Name (Arabic)",
    field_nat_en: "Nationality (English)", field_nat_ar: "Nationality (Arabic)",
    field_flag: "Flag emoji", field_years: "Years of experience",
    field_photo: "Photo URL (leave blank for placeholder)",
    field_bio_en: "Short bio (English)", field_bio_ar: "Short bio (Arabic)",
    save_changes: "Save changes", cancel: "Cancel",
    manager_dashboard: "Manager dashboard", manager_sub: "Appointments and staff, all in one place.",
    logout: "Log out", appointments: "Appointments", all_barbers: "All barbers",
    no_appointments: "No appointments yet.", appt_with: "Appointment with",
    footer_note: "Manager access is password-protected · staff only",
    lang_toggle: "العربية"
  },
  ar: {
    brand: "صالون محمد",
    nav_home: "الرئيسية", nav_book: "احجز", nav_team: "الحلاقون", nav_manager: "المدير",
    home_eyebrow: "لقصّات دقيقة، منذ اليوم الأول",
    home_headline1: "يد ثابتة،", home_headline2: "وخط حاد.",
    home_lead: (name, years, nat) => `يتمتع ${name} بخبرة ${years} سنة وأسلوب ${nat} دقيق في كل قصة.`,
    home_lead_fallback: "احجز قصتك القادمة خلال ثوانٍ.",
    cta_book: "احجز موعدك", cta_meet: "تعرف على الحلاقين",
    stat_years: "سنوات خبرة مجمعة",
    stat_barber_one: "حلاق على الكرسي", stat_barber_many: "حلاقين في الصالون",
    stat_appts: "مواعيد محجوزة",
    today_chair: "حلاق اليوم", no_barbers: "لا يوجد حلاقون مدرجون حالياً.",
    years_experience: "سنوات خبرة",
    book_title: "احجز كرسيك", book_subtitle: "اختر حلاقاً وموعداً يناسبك.",
    label_barber: "الحلاق", label_name: "اسمك", label_phone: "رقم الجوال",
    label_date: "التاريخ", label_time: "الوقت", label_notes: "ملاحظات (اختياري)",
    placeholder_name: "الاسم الكامل", placeholder_phone: "05XXXXXXXX",
    placeholder_notes: "أي شيء يجب أن يعرفه الحلاق",
    err_booking: "الرجاء تعبئة جميع الحقول (الملاحظات اختيارية).",
    btn_confirm: "تأكيد الحجز", btn_booking: "جارٍ الحجز…",
    booked_title: "تم الحجز", booked_sub: "نراك في الصالون. سيؤكد الحلاق موعدك.",
    btn_book_another: "احجز موعداً آخر",
    remind_whatsapp: "إرسال تذكير واتساب", remind_sms: "إرسال تذكير رسالة نصية",
    remind_note: "الضغط يفتح واتساب أو الرسائل في جوالك مع تعبئة التذكير مسبقاً — فقط اضغط إرسال.",
    reminder_msg: (name, barber, date, time) => `مرحباً ${name}، هذا تذكير بموعد قص شعرك مع ${barber} يوم ${date} الساعة ${time} في صالون محمد. نراك حينها!`,
    team_title: "الحلاقون", team_sub: "كل كرسي، ومن يقف خلفه.",
    yrs: "سنة",
    manager_title_login: "دخول المدير", staff_only: "للموظفين فقط.",
    password_placeholder: "كلمة المرور", wrong_password: "كلمة مرور خاطئة — حاول مرة أخرى.",
    btn_enter: "دخول",
    editor_barbers: "الحلاقون", add_barber: "إضافة حلاق",
    field_name_en: "الاسم (إنجليزي)", field_name_ar: "الاسم (عربي)",
    field_nat_en: "الجنسية (إنجليزي)", field_nat_ar: "الجنسية (عربي)",
    field_flag: "رمز العلم", field_years: "سنوات الخبرة",
    field_photo: "رابط الصورة (اتركه فارغاً لعرض الشكل الافتراضي)",
    field_bio_en: "نبذة قصيرة (إنجليزي)", field_bio_ar: "نبذة قصيرة (عربي)",
    save_changes: "حفظ التغييرات", cancel: "إلغاء",
    manager_dashboard: "لوحة تحكم المدير", manager_sub: "المواعيد والموظفون في مكان واحد.",
    logout: "تسجيل خروج", appointments: "المواعيد", all_barbers: "جميع الحلاقين",
    no_appointments: "لا توجد مواعيد بعد.", appt_with: "موعد مع",
    footer_note: "الدخول للمدير محمي بكلمة مرور · للموظفين فقط",
    lang_toggle: "English"
  }
};

/* ---------- helpers ---------- */

function uid(prefix) { return prefix + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function todayISO() { return new Date().toISOString().slice(0, 10); }
function t(key) { return T[state.lang][key]; }
function pick(obj, field) {
  if (!obj) return "";
  const key = field + (state.lang === "ar" ? "Ar" : "");
  return obj[key] || obj[field] || "";
}
function waLink(phone, message) {
  const digits = (phone || "").replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
function smsLink(phone, message) {
  return `sms:${phone}?body=${encodeURIComponent(message)}`;
}
function escapeHtml(str) {
  return String(str == null ? "" : str)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function avatarHTML(photoUrl, name, size) {
  if (photoUrl) {
    return `<img class="avatar" style="width:${size}px;height:${size}px" src="${escapeHtml(photoUrl)}" alt="${escapeHtml(name)}">`;
  }
  const initial = (name || "?").trim().charAt(0).toUpperCase();
  const fs = Math.round(size * 0.36);
  return `<div class="avatar-placeholder" style="width:${size}px;height:${size}px;font-size:${fs}px">${escapeHtml(initial)}</div>`;
}
function $(id) { return document.getElementById(id); }

/* ---------- state ---------- */

const state = {
  lang: "ar",
  theme: "light",
  page: "home",
  managerAuthed: false,
  data: seedData(),
  selectedBarberId: null,
  lastBooking: null,
  bookingSaving: false,
  showPassword: false,
  apptFilter: "all",
  editor: { mode: "list", isNew: false, draft: null }
};

/* ---------- persistence ---------- */

function loadAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    state.data = raw ? JSON.parse(raw) : seedData();
  } catch { state.data = seedData(); }
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === "light" || savedTheme === "dark") state.theme = savedTheme;
  const savedLang = localStorage.getItem(LANG_KEY);
  if (savedLang === "ar" || savedLang === "en") state.lang = savedLang;
  state.selectedBarberId = state.data.employees[0] ? state.data.employees[0].id : null;
}
function saveData() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data)); } catch {}
}
function saveTheme() { try { localStorage.setItem(THEME_KEY, state.theme); } catch {} }
function saveLang() { try { localStorage.setItem(LANG_KEY, state.lang); } catch {} }

/* ---------- theme / lang / nav ---------- */

function applyTheme() {
  document.documentElement.setAttribute("data-theme", state.theme);
  $("theme-toggle").textContent = state.theme === "dark" ? "☀️" : "🌙";
}
function applyLangAttrs() {
  document.documentElement.setAttribute("lang", state.lang);
  document.documentElement.setAttribute("dir", state.lang === "ar" ? "rtl" : "ltr");
  $("lang-toggle-label").textContent = state.lang === "ar" ? "EN" : "AR";
}
function renderStaticText() {
  const map = {
    "brand-text": "brand", "nav-home": "nav_home", "nav-book": "nav_book", "nav-team": "nav_team",
    "nav-manager-label": "nav_manager",
    "home-eyebrow": "home_eyebrow", "home-headline-1": "home_headline1", "home-headline-2": "home_headline2",
    "home-cta-book": "cta_book", "home-cta-meet": "cta_meet",
    "stat-years-label": "stat_years", "stat-appts-label": "stat_appts",
    "today-title": "today_chair",
    "book-title": "book_title", "book-subtitle": "book_subtitle",
    "label-barber": "label_barber", "label-name": "label_name", "label-phone": "label_phone",
    "label-date": "label_date", "label-time": "label_time", "label-notes": "label_notes",
    "success-title": "booked_title", "success-sub": "booked_sub", "book-again": "btn_book_another",
    "team-title": "team_title", "team-subtitle": "team_sub",
    "login-title": "manager_title_login", "login-sub": "staff_only", "login-submit": "btn_enter",
    "dash-title": "manager_dashboard", "dash-sub": "manager_sub", "logout-btn": "logout",
    "footer-brand": "brand", "footer-note": "footer_note"
  };
  Object.entries(map).forEach(([id, key]) => { const el = $(id); if (el) el.textContent = t(key); });

  $("input-name").placeholder = t("placeholder_name");
  $("input-phone").placeholder = t("placeholder_phone");
  $("input-notes").placeholder = t("placeholder_notes");
  $("input-password").placeholder = t("password_placeholder");
  $("book-submit").textContent = state.bookingSaving ? t("btn_booking") : t("btn_confirm");

  document.querySelectorAll(".nav-link").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.page === state.page);
  });
}

function switchPage(page) {
  state.page = page;
  document.querySelectorAll(".page").forEach((sec) => sec.classList.add("hidden"));
  $("page-" + page).classList.remove("hidden");
  renderStaticText();
  renderPage(page);
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
}

function renderPage(page) {
  if (page === "home") renderHome();
  else if (page === "book") renderBookPage();
  else if (page === "team") renderTeam();
  else if (page === "manager") {
    if (state.managerAuthed) {
      $("manager-login").classList.add("hidden");
      $("manager-dashboard").classList.remove("hidden");
      renderManagerDashboard();
    } else {
      $("manager-login").classList.remove("hidden");
      $("manager-dashboard").classList.add("hidden");
    }
  }
}

/* ---------- home ---------- */

function renderHome() {
  const emps = state.data.employees;
  const lead = emps[0];
  const totalYears = emps.reduce((s, e) => s + Number(e.experience || 0), 0);

  $("home-lead").textContent = lead
    ? t("home_lead")(pick(lead, "name"), lead.experience, pick(lead, "nationality"))
    : t("home_lead_fallback");

  $("home-avatar-wrap").innerHTML = `
    <div style="position:relative">
      <div style="position:absolute;inset:-12px;border-radius:999px;border:1px solid var(--accent);opacity:.4"></div>
      ${avatarHTML(lead ? lead.photoUrl : "", lead ? pick(lead, "name") : "?", 220)}
    </div>`;

  $("stat-years-num").textContent = totalYears;
  $("stat-barbers-num").textContent = emps.length;
  $("stat-barbers-label").textContent = emps.length === 1 ? t("stat_barber_one") : t("stat_barber_many");
  $("stat-appts-num").textContent = state.data.appointments.length;

  const todayCard = $("today-card");
  if (lead) {
    todayCard.innerHTML = `
      <div class="today-card">
        ${avatarHTML(lead.photoUrl, pick(lead, "name"), 88)}
        <div>
          <p class="name">${escapeHtml(pick(lead, "name"))}</p>
          <p class="meta">${lead.flag} ${escapeHtml(pick(lead, "nationality"))} · ${lead.experience} ${escapeHtml(t("years_experience"))}</p>
          <p class="bio">${escapeHtml(pick(lead, "bio"))}</p>
        </div>
      </div>`;
  } else {
    todayCard.innerHTML = `<p class="sub" style="margin:0">${escapeHtml(t("no_barbers"))}</p>`;
  }
}

/* ---------- book ---------- */

function renderBookPage() {
  const emps = state.data.employees;

  if (!state.selectedBarberId && emps[0]) state.selectedBarberId = emps[0].id;

  const picker = $("barber-picker");
  picker.innerHTML = emps.map((emp) => `
    <button type="button" class="barber-option ${emp.id === state.selectedBarberId ? "active" : ""}" data-id="${emp.id}">
      ${avatarHTML(emp.photoUrl, pick(emp, "name"), 32)}
      <span class="opt-name">${emp.flag} ${escapeHtml(pick(emp, "name"))}</span>
    </button>`).join("");

  const timeSelect = $("input-time");
  timeSelect.innerHTML = TIME_SLOTS.map((s) => `<option value="${s}">${s}</option>`).join("");

  $("input-date").min = todayISO();
  if (!$("input-date").value) $("input-date").value = todayISO();

  $("book-error").classList.add("hidden");

  if (state.lastBooking) {
    $("booking-form").classList.add("hidden");
    $("book-success").classList.remove("hidden");
    const barber = emps.find((e) => e.id === state.lastBooking.employeeId);
    const barberName = barber ? pick(barber, "name") : "";
    const msg = t("reminder_msg")(state.lastBooking.customerName, barberName, state.lastBooking.date, state.lastBooking.time);
    $("reminder-buttons").innerHTML = state.lastBooking.phone ? `
      <div class="reminder-wrap">
        <div class="reminder-actions">
          <a class="btn btn-primary" target="_blank" rel="noopener noreferrer" href="${waLink(state.lastBooking.phone, msg)}">💬 ${escapeHtml(t("remind_whatsapp"))}</a>
          <a class="btn btn-outline" href="${smsLink(state.lastBooking.phone, msg)}">📩 ${escapeHtml(t("remind_sms"))}</a>
        </div>
        <p class="reminder-note">${escapeHtml(t("remind_note"))}</p>
      </div>` : "";
  } else {
    $("booking-form").classList.remove("hidden");
    $("book-success").classList.add("hidden");
  }
}

function handleBookingSubmit(e) {
  e.preventDefault();
  const name = $("input-name").value.trim();
  const phone = $("input-phone").value.trim();
  const date = $("input-date").value;
  const time = $("input-time").value;
  const notes = $("input-notes").value.trim();

  if (!name || !phone || !date || !time || !state.selectedBarberId) {
    $("book-error").textContent = t("err_booking");
    $("book-error").classList.remove("hidden");
    return;
  }

  const appt = { id: uid("appt"), employeeId: state.selectedBarberId, customerName: name, phone, date, time, notes };
  state.data.appointments.push(appt);
  saveData();
  state.lastBooking = appt;

  $("input-name").value = "";
  $("input-phone").value = "";
  $("input-notes").value = "";

  renderBookPage();
}

function handleBookAgain() {
  state.lastBooking = null;
  renderBookPage();
}

/* ---------- team ---------- */

function renderTeam() {
  const emps = state.data.employees;
  const grid = $("team-grid");
  if (emps.length === 0) {
    grid.innerHTML = `<p class="sub" style="margin:0">${escapeHtml(t("no_barbers"))}</p>`;
    return;
  }
  grid.innerHTML = emps.map((emp) => `
    <div class="team-card">
      ${avatarHTML(emp.photoUrl, pick(emp, "name"), 64)}
      <div>
        <p class="name">${escapeHtml(pick(emp, "name"))}</p>
        <p class="meta"><span>${emp.flag}</span> ${escapeHtml(pick(emp, "nationality"))} · ${emp.experience} ${escapeHtml(t("yrs"))}</p>
        <p class="bio">${escapeHtml(pick(emp, "bio"))}</p>
      </div>
    </div>`).join("");
}

/* ---------- manager: login ---------- */

function handleLoginSubmit(e) {
  e.preventDefault();
  const pw = $("input-password").value;
  if (pw === MANAGER_PASSWORD) {
    state.managerAuthed = true;
    $("login-error").classList.add("hidden");
    $("input-password").value = "";
    renderPage("manager");
  } else {
    $("login-error").textContent = t("wrong_password");
    $("login-error").classList.remove("hidden");
  }
}
function handleLogout() {
  state.managerAuthed = false;
  renderPage("manager");
}
function togglePasswordVisibility() {
  state.showPassword = !state.showPassword;
  $("input-password").type = state.showPassword ? "text" : "password";
  $("toggle-password").textContent = state.showPassword ? "🙈" : "👁️";
}

/* ---------- manager: dashboard ---------- */

function renderManagerDashboard() {
  renderApptFilterOptions();
  renderApptList();
  renderEmployeeEditor();
}

function renderApptFilterOptions() {
  const sel = $("appt-filter");
  const current = sel.value || state.apptFilter;
  sel.innerHTML = `<option value="all">${escapeHtml(t("all_barbers"))}</option>` +
    state.data.employees.map((e) => `<option value="${e.id}">${escapeHtml(pick(e, "name"))}</option>`).join("");
  sel.value = state.data.employees.some((e) => e.id === current) ? current : "all";
  state.apptFilter = sel.value;
}

function renderApptList() {
  const emps = state.data.employees;
  const nameFor = (id) => { const e = emps.find((x) => x.id === id); return e ? pick(e, "name") : "—"; };

  let list = state.data.appointments.filter((a) => state.apptFilter === "all" || a.employeeId === state.apptFilter);
  list = list.slice().sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  $("appts-title").innerHTML = `${escapeHtml(t("appointments"))} <span class="count-badge">(${list.length})</span>`;

  const wrap = $("appt-list");
  if (list.length === 0) {
    wrap.innerHTML = `<div class="appt-empty">${escapeHtml(t("no_appointments"))}</div>`;
    return;
  }

  wrap.innerHTML = `<div class="appt-list">` + list.map((a) => {
    const barberName = nameFor(a.employeeId);
    const msg = t("reminder_msg")(a.customerName, barberName, a.date, a.time);
    return `
      <div class="appt-card">
        <div class="appt-card-top">
          <div style="min-width:0">
            <p class="cust-name">👤 ${escapeHtml(a.customerName)}</p>
            <p class="with-line">${escapeHtml(t("appt_with"))} <strong>${escapeHtml(barberName)}</strong></p>
            <p class="meta-line">
              <span>📅 ${escapeHtml(a.date)}</span>
              <span>⏰ ${escapeHtml(a.time)}</span>
              ${a.phone ? `<span>📞 ${escapeHtml(a.phone)}</span>` : ""}
            </p>
            ${a.notes ? `<p class="notes">"${escapeHtml(a.notes)}"</p>` : ""}
          </div>
          <button class="icon-btn icon-btn-danger" data-action="delete-appt" data-id="${a.id}" aria-label="Delete">🗑️</button>
        </div>
        ${a.phone ? `
        <div class="reminder-actions">
          <a class="chip-btn" target="_blank" rel="noopener noreferrer" href="${waLink(a.phone, msg)}">💬 ${escapeHtml(t("remind_whatsapp"))}</a>
          <a class="chip-btn" href="${smsLink(a.phone, msg)}">📩 ${escapeHtml(t("remind_sms"))}</a>
        </div>` : ""}
      </div>`;
  }).join("") + `</div>`;
}

/* ---------- manager: employee editor ---------- */

function renderEmployeeEditor() {
  const box = $("employee-editor");
  const emps = state.data.employees;

  if (state.editor.mode === "form") {
    box.innerHTML = employeeFormHTML(state.editor.draft, state.editor.isNew);
    bindEmployeeFormEvents();
    return;
  }

  box.innerHTML = `
    <div class="editor-header">
      <h3>${escapeHtml(t("editor_barbers"))}</h3>
      <button class="btn btn-outline" id="btn-add-barber" style="padding:6px 14px;font-size:0.85rem">➕ ${escapeHtml(t("add_barber"))}</button>
    </div>
    <div id="emp-rows">
      ${emps.map((emp) => `
        <div class="emp-row">
          <div class="emp-row-view">
            ${avatarHTML(emp.photoUrl, emp.name, 44)}
            <div class="info">
              <p class="n">${emp.flag} ${escapeHtml(emp.name)}${emp.nameAr ? " · " + escapeHtml(emp.nameAr) : ""}</p>
              <p class="m">${escapeHtml(emp.nationality)} · ${emp.experience} ${escapeHtml(t("yrs"))}</p>
            </div>
            <button class="icon-btn" data-action="edit-emp" data-id="${emp.id}" aria-label="Edit">✏️</button>
            <button class="icon-btn icon-btn-danger" data-action="remove-emp" data-id="${emp.id}" aria-label="Remove">🗑️</button>
          </div>
        </div>`).join("")}
    </div>`;

  $("btn-add-barber").addEventListener("click", startAddEmployee);
  box.querySelectorAll('[data-action="edit-emp"]').forEach((btn) =>
    btn.addEventListener("click", () => startEditEmployee(btn.dataset.id)));
  box.querySelectorAll('[data-action="remove-emp"]').forEach((btn) =>
    btn.addEventListener("click", () => removeEmployee(btn.dataset.id)));
}

function employeeFormHTML(d, isNew) {
  return `
    <div class="emp-row ${isNew ? "emp-adding" : ""}">
      <div class="emp-form">
        <div class="field-row">
          <div class="field"><label>${escapeHtml(t("field_name_en"))}</label><input id="ee-name" dir="ltr" value="${escapeHtml(d.name)}"></div>
          <div class="field"><label>${escapeHtml(t("field_name_ar"))}</label><input id="ee-nameAr" dir="rtl" value="${escapeHtml(d.nameAr)}"></div>
        </div>
        <div class="field-row">
          <div class="field"><label>${escapeHtml(t("field_nat_en"))}</label><input id="ee-nationality" dir="ltr" value="${escapeHtml(d.nationality)}"></div>
          <div class="field"><label>${escapeHtml(t("field_nat_ar"))}</label><input id="ee-nationalityAr" dir="rtl" value="${escapeHtml(d.nationalityAr)}"></div>
        </div>
        <div class="field-row">
          <div class="field"><label>${escapeHtml(t("field_flag"))}</label><input id="ee-flag" value="${escapeHtml(d.flag)}" placeholder="🇸🇦"></div>
          <div class="field"><label>${escapeHtml(t("field_years"))}</label><input id="ee-experience" type="number" min="0" value="${escapeHtml(d.experience)}"></div>
        </div>
        <div class="field"><label>${escapeHtml(t("field_photo"))}</label><input id="ee-photoUrl" dir="ltr" value="${escapeHtml(d.photoUrl)}" placeholder="https://…"></div>
        <div class="field"><label>${escapeHtml(t("field_bio_en"))}</label><textarea id="ee-bio" dir="ltr" rows="2">${escapeHtml(d.bio)}</textarea></div>
        <div class="field"><label>${escapeHtml(t("field_bio_ar"))}</label><textarea id="ee-bioAr" dir="rtl" rows="2">${escapeHtml(d.bioAr)}</textarea></div>
        <div class="emp-form-actions">
          <button class="btn btn-primary" id="ee-save">✅ ${escapeHtml(isNew ? t("add_barber") : t("save_changes"))}</button>
          <button class="btn" id="ee-cancel" style="background:none;color:var(--text-muted)">✖ ${escapeHtml(t("cancel"))}</button>
        </div>
      </div>
    </div>`;
}

function bindEmployeeFormEvents() {
  const d = state.editor.draft;
  const fields = ["name", "nameAr", "nationality", "nationalityAr", "flag", "photoUrl", "bio", "bioAr"];
  fields.forEach((f) => {
    const el = $("ee-" + f);
    if (el) el.addEventListener("input", () => { d[f] = el.value; });
  });
  const exp = $("ee-experience");
  if (exp) exp.addEventListener("input", () => { d.experience = exp.value; });

  $("ee-save").addEventListener("click", saveEmployeeForm);
  $("ee-cancel").addEventListener("click", () => { state.editor = { mode: "list", isNew: false, draft: null }; renderEmployeeEditor(); });
}

function startAddEmployee() {
  state.editor = {
    mode: "form", isNew: true,
    draft: { id: uid("emp"), name: "", nameAr: "", nationality: "", nationalityAr: "", flag: "", experience: "", bio: "", bioAr: "", photoUrl: "" }
  };
  renderEmployeeEditor();
}
function startEditEmployee(id) {
  const emp = state.data.employees.find((e) => e.id === id);
  if (!emp) return;
  state.editor = { mode: "form", isNew: false, draft: { ...emp } };
  renderEmployeeEditor();
}
function saveEmployeeForm() {
  const d = state.editor.draft;
  if (!d.name || !d.name.trim()) return;
  if (state.editor.isNew) {
    state.data.employees.push(d);
  } else {
    state.data.employees = state.data.employees.map((e) => (e.id === d.id ? d : e));
  }
  saveData();
  state.editor = { mode: "list", isNew: false, draft: null };
  onEmployeesChanged();
}
function removeEmployee(id) {
  state.data.employees = state.data.employees.filter((e) => e.id !== id);
  saveData();
  if (state.selectedBarberId === id) state.selectedBarberId = state.data.employees[0] ? state.data.employees[0].id : null;
  onEmployeesChanged();
}
function onEmployeesChanged() {
  // staff changed — refresh whatever is currently visible so names/flags/bios stay in sync
  renderManagerDashboard();
}

/* ---------- delegated events that live outside the editor ---------- */

document.addEventListener("click", (e) => {
  const delBtn = e.target.closest('[data-action="delete-appt"]');
  if (delBtn) {
    state.data.appointments = state.data.appointments.filter((a) => a.id !== delBtn.dataset.id);
    saveData();
    renderApptList();
    renderHome_ifNeeded();
    return;
  }
  const barberBtn = e.target.closest(".barber-option");
  if (barberBtn) {
    state.selectedBarberId = barberBtn.dataset.id;
    renderBookPage();
  }
});
function renderHome_ifNeeded() { if (state.page === "home") renderHome(); }

/* ---------- init ---------- */

function init() {
  loadAll();
  applyTheme();
  applyLangAttrs();

  $("brand-btn").addEventListener("click", () => switchPage("home"));
  document.querySelectorAll(".nav-link").forEach((btn) =>
    btn.addEventListener("click", () => switchPage(btn.dataset.page)));

  $("lang-toggle").addEventListener("click", () => {
    state.lang = state.lang === "ar" ? "en" : "ar";
    saveLang();
    applyLangAttrs();
    renderStaticText();
    renderPage(state.page);
  });
  $("theme-toggle").addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    saveTheme();
    applyTheme();
  });

  $("booking-form").addEventListener("submit", handleBookingSubmit);
  $("book-again").addEventListener("click", handleBookAgain);

  $("login-form").addEventListener("submit", handleLoginSubmit);
  $("logout-btn").addEventListener("click", handleLogout);
  $("toggle-password").addEventListener("click", togglePasswordVisibility);

  $("appt-filter").addEventListener("change", (e) => { state.apptFilter = e.target.value; renderApptList(); });

  renderStaticText();
  switchPage("home");
}

document.addEventListener("DOMContentLoaded", init);
