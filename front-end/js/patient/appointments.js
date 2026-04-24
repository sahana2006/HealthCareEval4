/* MEDBITS - appointments.js */

const APPOINTMENTS_API_BASE_URL = 'http://localhost:3000';

let allDoctors = [];
let doctors = [];
let userAppointments = [];
let selectedDoctor = null;
let selectedSlot = null;

function useTemplate(id) {
  return document.getElementById(id).content.cloneNode(true);
}

async function initializeAppointmentsPage() {
  await Promise.all([loadAllDoctors(), loadUserAppointments()]);
  doctors = allDoctors;
  renderAppointments();
}

async function loadAllDoctors() {
  const response = await fetch(`${APPOINTMENTS_API_BASE_URL}/doctors`, {
    headers: {
      role: 'patient',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to load doctors');
  }

  allDoctors = await response.json();
}

async function loadDoctorsBySpecialization(specialization) {
  const response = await fetch(
    `${APPOINTMENTS_API_BASE_URL}/doctors?specialization=${encodeURIComponent(specialization)}`,
    {
      headers: {
        role: 'patient',
      },
    },
  );

  if (!response.ok) {
    throw new Error('Failed to load doctors');
  }

  doctors = await response.json();
}

async function loadUserAppointments() {
  const session = requireRole('patient');
  if (!session) return;

  const response = await fetch(
    `${APPOINTMENTS_API_BASE_URL}/appointments/user/${encodeURIComponent(session.id)}`,
    {
      headers: {
        role: 'patient',
      },
    },
  );

  if (!response.ok) {
    throw new Error('Failed to load appointments');
  }

  userAppointments = await response.json();
}

function renderAppointments() {
  selectedDoctor = null;
  selectedSlot = null;
  renderSpecializationOptions();
  refreshApptLists();
  document.getElementById('doctorSection').style.display = 'none';
}

function renderSpecializationOptions() {
  const sel = document.getElementById('specSelect');
  const specializations = [...new Set(allDoctors.map((doctor) => doctor.specialization))];

  sel.innerHTML = '';
  const blank = document.createElement('option');
  blank.value = '';
  blank.textContent = 'Choose a specialty...';
  sel.appendChild(blank);

  specializations.forEach((specialization) => {
    const opt = document.createElement('option');
    opt.value = specialization;
    opt.textContent = specialization;
    sel.appendChild(opt);
  });
}

function refreshApptLists() {
  const upcoming = userAppointments.filter((item) => item.status === 'upcoming');
  const past = userAppointments.filter((item) => item.status === 'completed');
  fillApptList('upcomingList', upcoming, false);
  fillApptList('pastList', past, true);
}

function fillApptList(containerId, appointments, isPast) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = '';

  if (!appointments.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    const icon = document.createElement('div');
    icon.className = 'empty-icon';
    icon.textContent = isPast ? '✓' : '...';
    const msg = document.createElement('p');
    msg.textContent = isPast ? 'No past appointments' : 'No upcoming appointments';
    empty.appendChild(icon);
    empty.appendChild(msg);
    el.appendChild(empty);
    return;
  }

  appointments.forEach((appointment) => {
    const frag = useTemplate(isPast ? 'tpl-appt-past' : 'tpl-appt-upcoming');
    const card = frag.querySelector('.list-item');
    card.querySelector('.appt-doctor').textContent = appointment.doctor.name;
    card.querySelector('.appt-info').textContent =
      `${appointment.doctor.specialization} | ${formatDate(appointment.date)} at ${appointment.slot}`;
    el.appendChild(frag);
  });
}

async function filterDoctors() {
  const specialization = document.getElementById('specSelect').value;
  const section = document.getElementById('doctorSection');

  if (!specialization) {
    section.style.display = 'none';
    return;
  }

  await loadDoctorsBySpecialization(specialization);
  document.getElementById('docSearchWrap').style.display = 'block';
  document.getElementById('docSearchLabel').textContent = `Search ${specialization}s`;
  fillDoctorList(doctors);
  resetSchedulePanel();
  section.style.display = 'block';
}

function resetSchedulePanel() {
  const panel = document.getElementById('schedulePanel');
  panel.innerHTML = '';
  const h = document.createElement('h3');
  h.textContent = 'Schedule Appointment';
  const p = document.createElement('p');
  p.className = 'text-muted';
  p.textContent = 'Click a doctor to see available slots.';
  panel.appendChild(h);
  panel.appendChild(p);
}

function searchDoctors(q) {
  const query = q.trim().toLowerCase();
  const matches = query
    ? doctors.filter((doctor) => doctor.name.toLowerCase().includes(query))
    : doctors;
  fillDoctorList(matches);
}

function fillDoctorList(docs) {
  const list = document.getElementById('docList');
  list.innerHTML = '';

  if (!docs.length) {
    const msg = document.createElement('p');
    msg.className = 'text-muted';
    msg.style.padding = '16px';
    msg.textContent = 'No doctors found.';
    list.appendChild(msg);
    return;
  }

  docs.forEach((doctor) => {
    const frag = useTemplate('tpl-doc-card');
    const card = frag.querySelector('.doc-card');

    card.id = `dcard-${doctor.id}`;
    card.querySelector('.doc-icon').innerHTML = '<i class="fa-solid fa-user-doctor"></i>';
    card.querySelector('.doc-name').textContent = doctor.name;
    card.querySelector('.doc-exp-qual').textContent = doctor.specialization;
    card.querySelector('.doc-hospital').textContent = `${doctor.slots.length} slots available`;
    card.querySelector('.doc-fee').innerHTML = '<i class="fa-regular fa-calendar"></i>';
    card.onclick = function () {
      void selectDoctor(doctor.id);
    };
    card.querySelector('.btn').onclick = function (event) {
      event.stopPropagation();
      void selectDoctor(doctor.id);
    };

    list.appendChild(frag);
  });
}

function selectSpeciality(specialization) {
  document.getElementById('specSelect').value = specialization;
  document.querySelectorAll('.cat-card').forEach((card) => card.classList.remove('active-cat'));
  const chip = document.querySelector(`.cat-card[data-spec="${specialization}"]`);
  if (chip) chip.classList.add('active-cat');
  void filterDoctors();
  document.getElementById('doctorSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function selectDoctor(id) {
  selectedDoctor = doctors.find((doctor) => doctor.id === id) || null;
  if (!selectedDoctor) return;

  selectedSlot = null;
  document.querySelectorAll('.doc-card').forEach((card) => card.classList.remove('selected'));
  const card = document.getElementById(`dcard-${id}`);
  if (card) card.classList.add('selected');

  const frag = useTemplate('tpl-schedule-panel');
  const panel = document.getElementById('schedulePanel');
  panel.innerHTML = '';

  frag.querySelector('.sched-icon').innerHTML = '<i class="fa-solid fa-user-doctor"></i>';
  frag.querySelector('.sched-name').textContent = selectedDoctor.name;
  frag.querySelector('.sched-spec').textContent = selectedDoctor.specialization;

  const dateInput = frag.querySelector('#schedDate');
  dateInput.min = today();
  const preferredDate = val('apptDateSearch');
  dateInput.value = preferredDate || today();
  dateInput.addEventListener('change', function () {
    void loadSlotsForSelectedDoctor(this.value);
  });

  panel.appendChild(frag);
  await loadSlotsForSelectedDoctor(dateInput.value);
}

async function loadSlotsForSelectedDoctor(date) {
  if (!selectedDoctor || !date) return;

  selectedSlot = null;
  const response = await fetch(
    `${APPOINTMENTS_API_BASE_URL}/doctors/${encodeURIComponent(selectedDoctor.id)}/slots?date=${encodeURIComponent(date)}`,
    {
      headers: {
        role: 'patient',
      },
    },
  );

  if (!response.ok) {
    showToast('Unable to load slots', 'error');
    return;
  }

  const slots = await response.json();
  fillSlots(document.getElementById('allSlots'), slots);
}

function fillSlots(container, slots) {
  if (!container) return;
  container.innerHTML = '';

  if (!slots.length) {
    const msg = document.createElement('p');
    msg.className = 'text-muted';
    msg.textContent = 'No available slots for this date.';
    container.appendChild(msg);
    return;
  }

  slots.forEach((slot) => {
    const frag = useTemplate('tpl-slot-btn');
    const btn = frag.querySelector('.slot-btn');
    btn.textContent = slot;
    btn.onclick = function () {
      selectSlot(btn, slot);
    };
    container.appendChild(frag);
  });
}

function selectSlot(btn, slot) {
  document.querySelectorAll('#schedulePanel .slot-btn').forEach((item) => item.classList.remove('selected'));
  btn.classList.add('selected');
  selectedSlot = slot;
}

async function confirmAppointment() {
  const session = requireRole('patient');
  const date = val('schedDate');

  if (!session) return;
  if (!selectedDoctor) {
    showToast('Please select a doctor', 'error');
    return;
  }
  if (!date) {
    showToast('Please select a date', 'error');
    return;
  }
  if (!selectedSlot) {
    showToast('Please pick a time slot', 'error');
    return;
  }

  const response = await fetch(`${APPOINTMENTS_API_BASE_URL}/appointments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      role: 'patient',
    },
    body: JSON.stringify({
      userId: session.id,
      doctorId: selectedDoctor.id,
      date,
      slot: selectedSlot,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    showToast(errorBody?.message || 'Unable to book appointment', 'error');
    return;
  }

  await loadUserAppointments();
  refreshApptLists();
  showToast('Appointment booked!', 'success');
  await loadSlotsForSelectedDoctor(date);
}
