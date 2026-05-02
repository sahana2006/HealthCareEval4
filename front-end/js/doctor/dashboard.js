/* ── dashboard.js ── */
const DOCTOR_API_BASE = 'http://localhost:3000';

(async () => {
  await loadComponents('dashboard', 'Dashboard');

  // Update welcome banner with saved name
  const profile = getDoctorProfile();
  const bannerTitle = document.querySelector('.banner-title');
  if (bannerTitle) bannerTitle.textContent = `Welcome back, ${profile.name}!`;

  // Resolve logged-in doctor ID from session (falls back to DOC003 for demo)
  let doctorId = 'DOC003';
  try {
    const session = JSON.parse(localStorage.getItem('user') || '{}');
    if (session && (session.doctorId || session.id)) doctorId = session.doctorId || session.id;
  } catch (_) {}

  await loadDashboardAppointments(doctorId);
})();

async function loadDashboardAppointments(doctorId) {
  const appointmentsContainer = document.getElementById('appointmentsList');
  const statToday = document.getElementById('statToday');

  try {
    const response = await fetch(
      `${DOCTOR_API_BASE}/doctors/${encodeURIComponent(doctorId)}/appointments`,
      {
        headers: {
          role: 'doctor',
        },
      }
    );

    if (!response.ok) throw new Error('Failed to load appointments');

    const appointments = await response.json();
    const upcoming = appointments.filter((a) => a.status === 'upcoming');
    const completed = appointments.filter((a) => a.status === 'completed');

    // Update stat cards dynamically
    if (statToday) statToday.textContent = upcoming.length;
    const statCompleted = document.getElementById('statCompleted');
    if (statCompleted) statCompleted.textContent = completed.length;
    const bannerSub = document.querySelector('.banner-sub');
    if (bannerSub) {
      bannerSub.innerHTML = `You have <strong>${upcoming.length} upcoming appointment${upcoming.length !== 1 ? 's' : ''}</strong> and ${completed.length} completed.`;
    }

    if (!appointmentsContainer) return;

    if (appointments.length === 0) {
      appointmentsContainer.innerHTML =
        '<p style="color:var(--text-muted);font-size:.875rem;padding:16px 0;">No appointments found.</p>';
      return;
    }

    appointmentsContainer.innerHTML = '';
    // Show at most 5 on dashboard
    appointments.slice(0, 5).forEach((appt) => {
      const patientName = appt.patient?.name || appt.userId || 'Patient';
      const initials = getInitials(patientName);
      const statusClass = appt.status === 'upcoming' ? 'badge-confirm-outline' : 'badge-completed';
      const statusLabel = appt.status === 'upcoming' ? 'Upcoming' : 'Completed';

      const row = document.createElement('div');
      row.className = 'patient-row';
      row.innerHTML = `
        <div class="patient-left">
          <div class="avatar">${initials}</div>
          <div>
            <div class="patient-name">${patientName}</div>
            <div class="patient-meta">${appt.date} &middot; ${appt.slot}</div>
          </div>
        </div>
        <div class="patient-right">
          <span class="badge ${statusClass}">${statusLabel}</span>
          <span class="appt-time">${appt.slot}</span>
        </div>`;
      appointmentsContainer.appendChild(row);
    });
  } catch (err) {
    if (appointmentsContainer) {
      appointmentsContainer.innerHTML =
        '<p style="color:var(--text-muted);font-size:.875rem;padding:16px 0;">Could not load appointments — make sure the backend is running.</p>';
    }
  }
}

function getInitials(str) {
  return str
    .split(/[\s-]+/)
    .map((w) => w[0]?.toUpperCase() || '')
    .slice(0, 2)
    .join('');
}
