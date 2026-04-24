const DASHBOARD_API_BASE_URL = 'http://localhost:3000';

let dashboardUpcomingAppointments = [];
let dashboardBookedLabTests = [];
let dashboardPendingLabTests = [];
let dashboardEditingAppointment = null;
let dashboardSelectedSlot = null;

async function initializeDashboard() {
  updateTopbarUser();

  const session = requireRole('patient');
  if (!session) return;

  setText('welcomeName', session.firstName || session.name || 'there');

  await Promise.all([
    loadUpcomingAppointments(session.id),
    loadBookedLabTests(session.id),
    loadPendingLabTests(session.id),
  ]);

  renderDashboard();
}

async function loadUpcomingAppointments(userId) {
  const response = await fetch(
    `${DASHBOARD_API_BASE_URL}/appointments/user/${encodeURIComponent(userId)}?status=upcoming`,
    {
      headers: {
        role: 'patient',
      },
    },
  );

  if (!response.ok) {
    throw new Error('Failed to load upcoming appointments');
  }

  dashboardUpcomingAppointments = await response.json();
}

async function loadBookedLabTests(userId) {
  const response = await fetch(
    `${DASHBOARD_API_BASE_URL}/labtests/history/${encodeURIComponent(userId)}`,
    {
      headers: {
        role: 'patient',
      },
    },
  );

  if (!response.ok) {
    throw new Error('Failed to load booked lab tests');
  }

  dashboardBookedLabTests = await response.json();
}

async function loadPendingLabTests(userId) {
  const response = await fetch(
    `${DASHBOARD_API_BASE_URL}/labtests/cart/${encodeURIComponent(userId)}`,
    {
      headers: {
        role: 'patient',
      },
    },
  );

  if (!response.ok) {
    throw new Error('Failed to load pending lab tests');
  }

  dashboardPendingLabTests = await response.json();
}

function renderDashboard() {
  setText('upcomingCount', dashboardUpcomingAppointments.length);
  setText('labCount', dashboardBookedLabTests.length + dashboardPendingLabTests.length);
  setText('recordCount', '0');

  renderUpcomingAppointments();
  renderLabOrders();
}

function renderUpcomingAppointments() {
  const container = document.getElementById('upcomingList');
  if (!container) return;
  container.innerHTML = '';

  if (!dashboardUpcomingAppointments.length) {
    container.appendChild(createEmptyDashItem('No upcoming appointments'));
    return;
  }

  dashboardUpcomingAppointments.forEach((appointment) => {
    container.appendChild(
      createDashItem({
        title: appointment.doctor.name,
        sub: `${appointment.doctor.specialization} | ${formatDate(appointment.date)} at ${appointment.slot} | ${appointment.status}`,
        badge: 'Upcoming',
        colour: 'badge-blue',
        actionLabel: 'Edit',
        onAction: () => {
          void openAppointmentEditModal(appointment.id);
        },
      }),
    );
  });
}

function renderLabOrders() {
  const container = document.getElementById('labOrdersList');
  if (!container) return;
  container.innerHTML = '';

  const rows = [
    ...dashboardPendingLabTests.map((booking) => ({
      title: booking.labTest.name,
      sub: `${booking.labTest.category} | Pending in cart`,
      badge: 'Pending',
      colour: 'badge-orange',
    })),
    ...dashboardBookedLabTests.map((booking) => ({
      title: booking.labTest.name,
      sub: `${booking.labTest.category} | Booked`,
      badge: 'Booked',
      colour: 'badge-green',
    })),
  ];

  if (!rows.length) {
    container.appendChild(createEmptyDashItem('No lab orders yet'));
    return;
  }

  rows.forEach((row) => {
    container.appendChild(createDashItem(row));
  });
}

function createDashItem(row) {
  const frag = document.getElementById('tpl-dash-item').content.cloneNode(true);
  const item = frag.querySelector('.dash-item');
  item.querySelector('.dash-item-title').textContent = row.title;
  item.querySelector('.dash-item-sub').textContent = row.sub;

  const meta = item.querySelector('.dash-item-meta');
  if (row.badge) {
    const badge = document.createElement('span');
    badge.className = `badge ${row.colour || 'badge-blue'}`;
    badge.textContent = row.badge;
    meta.appendChild(badge);
  }

  if (row.actionLabel && typeof row.onAction === 'function') {
    const button = document.createElement('button');
    button.className = 'btn btn-outline btn-sm dash-action-btn';
    button.textContent = row.actionLabel;
    button.onclick = row.onAction;
    meta.appendChild(button);
  }

  return frag;
}

function createEmptyDashItem(message) {
  return createDashItem({
    title: '',
    sub: message,
  });
}

async function openAppointmentEditModal(appointmentId) {
  dashboardEditingAppointment = dashboardUpcomingAppointments.find(
    (appointment) => appointment.id === appointmentId,
  );
  if (!dashboardEditingAppointment) {
    showToast('Appointment not found', 'error');
    return;
  }

  currentEditId = appointmentId;
  dashboardSelectedSlot = dashboardEditingAppointment.slot;
  openModal(`
    <div class="modal-title">Edit Appointment</div>
    <div class="form-group mb-16">
      <label>Doctor</label>
      <input id="editAppointmentDoctor" value="${dashboardEditingAppointment.doctor.name}" disabled>
    </div>
    <div class="form-group mb-16">
      <label>Date</label>
      <input type="date" id="editAppointmentDate" min="${today()}" value="${dashboardEditingAppointment.date}">
    </div>
    <div class="form-group mb-16">
      <label>Available Slots</label>
      <div id="editAppointmentSlots" class="dash-slot-grid"></div>
    </div>
    <button class="btn btn-primary btn-full" onclick="saveAppointmentEdit()">Save Changes</button>
  `);

  const dateInput = document.getElementById('editAppointmentDate');
  dateInput.addEventListener('change', function () {
    dashboardSelectedSlot = null;
    void loadEditSlots(this.value);
  });

  await loadEditSlots(dashboardEditingAppointment.date);
}

async function loadEditSlots(date) {
  if (!dashboardEditingAppointment || !date) return;

  const response = await fetch(
    `${DASHBOARD_API_BASE_URL}/doctors/${encodeURIComponent(dashboardEditingAppointment.doctorId)}/slots?date=${encodeURIComponent(date)}`,
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
  const displaySlots = new Set(slots);
  if (date === dashboardEditingAppointment.date) {
    displaySlots.add(dashboardEditingAppointment.slot);
  }

  if (!displaySlots.has(dashboardSelectedSlot)) {
    dashboardSelectedSlot = date === dashboardEditingAppointment.date
      ? dashboardEditingAppointment.slot
      : null;
  }

  renderEditSlots(Array.from(displaySlots));
}

function renderEditSlots(slots) {
  const container = document.getElementById('editAppointmentSlots');
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
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'slot-btn';
    button.textContent = slot;
    if (slot === dashboardSelectedSlot) {
      button.classList.add('selected');
    }
    button.onclick = function () {
      dashboardSelectedSlot = slot;
      renderEditSlots(slots);
    };
    container.appendChild(button);
  });
}

async function saveAppointmentEdit() {
  if (!dashboardEditingAppointment || !currentEditId) {
    showToast('No appointment selected', 'error');
    return;
  }

  const session = requireRole('patient');
  const date = val('editAppointmentDate');
  if (!session) return;

  if (!date) {
    showToast('Please choose a date', 'error');
    return;
  }

  if (!dashboardSelectedSlot) {
    showToast('Please choose a slot', 'error');
    return;
  }

  const response = await fetch(
    `${DASHBOARD_API_BASE_URL}/appointments/${encodeURIComponent(currentEditId)}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        role: 'patient',
      },
      body: JSON.stringify({
        date,
        slot: dashboardSelectedSlot,
      }),
    },
  );

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    showToast(errorBody?.message || 'Unable to update appointment', 'error');
    return;
  }

  await Promise.all([
    loadUpcomingAppointments(session.id),
    loadBookedLabTests(session.id),
    loadPendingLabTests(session.id),
  ]);
  renderDashboard();
  dashboardEditingAppointment = null;
  dashboardSelectedSlot = null;
  closeModal();
  showToast('Appointment updated', 'success');
}
