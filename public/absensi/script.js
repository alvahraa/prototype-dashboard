/**
 * Form Absensi - Script
 * Matches Dashboard Theme
 */

const API_CONFIG = {
    // Vercel /api proxy
    baseUrl: '/api',
    useMockData: false // Set to true for testing without backend
};

const ROOM_NAMES = {
    'audiovisual': 'Audiovisual',
    'referensi': 'Ruang Referensi',
    'sirkulasi_l1': 'Sirkulasi - Lantai 1',
    'sirkulasi_l2': 'Sirkulasi - Lantai 2',
    'sirkulasi_l3': 'Sirkulasi - Lantai 3',
    'karel': 'Ruang Karel',
    'smartlab': 'SmartLab',
    'bicorner': 'BI Corner'
};

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomFromQR = urlParams.get('room');

    if (roomFromQR && ROOM_NAMES[roomFromQR]) {
        // Handle QR pre-selection: check the matching checkbox
        setTimeout(() => {
            // Uncheck all first
            document.querySelectorAll('input[name="ruangan[]"]').forEach(cb => cb.checked = false);

            // Check the target room
            const targetCheckbox = document.querySelector(`input[name="ruangan[]"][value="${roomFromQR}"]`);
            if (targetCheckbox) {
                targetCheckbox.checked = true;
            }
        }, 100);
    }

    document.getElementById('absensiForm').addEventListener('submit', handleSubmit);
    setupValidation();
});

// No global selectRoom needed anymore, we use checkbox native behavior

function toggleLockerInput() {
    const hiddenInput = document.getElementById('useLocker');
    const container = document.getElementById('lockerInputContainer');
    const lockerNum = document.getElementById('locker_number');
    const toggleIcon = document.getElementById('lockerToggleIcon');
    const btn = document.getElementById('lockerToggleBtn');

    const isActive = hiddenInput.value === 'true';

    if (!isActive) {
        // Turn ON
        hiddenInput.value = 'true';
        container.classList.remove('hidden');
        lockerNum.required = true;
        toggleIcon.textContent = 'Ya';
        toggleIcon.className = 'text-xs px-2 py-0.5 bg-amber-600 rounded-md text-white';
        btn.classList.add('border-amber-500/40');
        lockerNum.focus();
    } else {
        // Turn OFF
        hiddenInput.value = 'false';
        container.classList.add('hidden');
        lockerNum.required = false;
        lockerNum.value = '';
        toggleIcon.textContent = 'Tidak';
        toggleIcon.className = 'text-xs px-2 py-0.5 bg-slate-700 rounded-md';
        btn.classList.remove('border-amber-500/40');
    }
}


async function handleSubmit(event) {
    event.preventDefault();

    const form = event.target;
    // Collect all checked rooms
    const checkedRooms = Array.from(document.querySelectorAll('input[name="ruangan[]"]:checked'))
        .map(cb => cb.value);

    if (checkedRooms.length === 0) {
        alert('Mohon pilih minimal satu ruangan.');
        return;
    }

    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const btnLoader = document.getElementById('btnLoader');

    submitBtn.disabled = true;
    btnText.textContent = 'Mengirim...';
    btnLoader.classList.remove('hidden');

    // Map form fields to API fields
    const formData = {
        ruangan: checkedRooms, // Now an array
        nim: form.nim.value,
        nama: form.nama.value,
        prodi: form.jurusan.value,
        gender: form.gender.value,
        umur: form.umur.value,
        locker_number: document.getElementById('useLocker').value === 'true' ? document.getElementById('locker_number').value : null,
        visitTime: new Date().toISOString()
    };

    try {
        await submitAbsensi(formData);
        showSuccess(formData);
    } catch (error) {
        console.error('Error:', error);
        alert('Gagal mengirim. Silakan coba lagi.');
    } finally {
        submitBtn.disabled = false;
        btnText.textContent = 'Kirim Absensi';
        btnLoader.classList.add('hidden');
    }
}

async function submitAbsensi(data) {
    if (API_CONFIG.useMockData) {
        // ... handled in backend logic usually
        return data;
    } else {
        const response = await fetch(`${API_CONFIG.baseUrl}/visits`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed');
        }
        return response.json();
    }
}

function generateId() {
    return 'V' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 6).toUpperCase();
}

function showSuccess(data) {
    const formCard = document.getElementById('formCard');
    const successCard = document.getElementById('successCard');
    const successDetail = document.getElementById('successDetail');

    const roomNames = data.ruangan.map(id => ROOM_NAMES[id] || id).join(', ');
    const lockerInfo = data.locker_number ? `<span class="block mt-1 text-emerald-400 font-medium">Loker No. ${data.locker_number}</span>` : '';

    const time = new Date(data.visitTime).toLocaleString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    successDetail.innerHTML = `
        <p class="font-medium text-slate-100 mb-1">${data.nama}</p>
        <p class="text-slate-400">${roomNames}</p>
        ${lockerInfo}
        <p class="text-slate-500 text-xs mt-2">${time}</p>
    `;

    formCard.classList.add('hidden');
    successCard.classList.remove('hidden');
}

function resetForm() {
    const formCard = document.getElementById('formCard');
    const successCard = document.getElementById('successCard');

    document.getElementById('absensiForm').reset();
    successCard.classList.add('hidden');
    formCard.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Debug
function exportVisits() { return JSON.parse(localStorage.getItem('libraryVisits') || '[]'); }
function clearVisits() { localStorage.removeItem('libraryVisits'); console.log('Cleared'); }

// Tab Switcher
function switchTab(tab) {
    const tabAbsensi = document.getElementById('tabAbsensi');
    const tabReturn = document.getElementById('tabReturn');
    const formCard = document.getElementById('formCard');
    const successCard = document.getElementById('successCard');
    const returnCard = document.getElementById('returnCard');

    // Reset all
    tabAbsensi.className = 'flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 text-slate-400 hover:text-slate-300';
    tabReturn.className = 'flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 text-slate-400 hover:text-slate-300';
    formCard.classList.add('hidden');
    successCard.classList.add('hidden');
    returnCard.classList.add('hidden');

    if (tab === 'absensi') {
        tabAbsensi.className = 'flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 bg-indigo-600 text-white';
        formCard.classList.remove('hidden');
    } else {
        tabReturn.className = 'flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 bg-amber-600 text-white';
        returnCard.classList.remove('hidden');
        // Reset return form state
        document.getElementById('returnLockerNumber').value = '';
        document.getElementById('returnResult').classList.add('hidden');
        document.getElementById('returnError').classList.add('hidden');
    }
}

// Return Locker Handler
async function handleReturnLocker() {
    const lockerInput = document.getElementById('returnLockerNumber');
    const lockerNumber = lockerInput.value.trim();

    if (!lockerNumber) {
        alert('Masukkan nomor loker');
        lockerInput.focus();
        return;
    }

    const btn = document.getElementById('returnBtn');
    const btnText = document.getElementById('returnBtnText');
    const btnLoader = document.getElementById('returnBtnLoader');
    const resultDiv = document.getElementById('returnResult');
    const resultDetail = document.getElementById('returnResultDetail');
    const errorDiv = document.getElementById('returnError');
    const errorText = document.getElementById('returnErrorText');

    // Reset
    resultDiv.classList.add('hidden');
    errorDiv.classList.add('hidden');

    // Loading state
    btn.disabled = true;
    btnText.textContent = 'Memproses...';
    btnLoader.classList.remove('hidden');

    try {
        const response = await fetch(`${API_CONFIG.baseUrl}/visits/return-locker-by-number`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ locker_number: lockerNumber })
        });

        const data = await response.json();

        if (!response.ok) {
            errorText.textContent = data.error || 'Gagal mengembalikan kunci';
            errorDiv.classList.remove('hidden');
            return;
        }

        // Success — show borrower metadata
        const visitInfo = data.data;
        const time = new Date(visitInfo.visit_time).toLocaleString('id-ID', {
            hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'long', year: 'numeric'
        });

        resultDetail.innerHTML = `
            <p class="font-medium text-slate-100">Loker #${visitInfo.locker_number}</p>
            <p class="text-slate-400 mt-1">${visitInfo.nama} — ${visitInfo.nim}</p>
            <p class="text-slate-500 text-xs mt-1">${visitInfo.prodi} • Dipinjam ${time}</p>
        `;
        resultDiv.classList.remove('hidden');
        lockerInput.value = '';

    } catch (err) {
        errorText.textContent = 'Gagal terhubung ke server';
        errorDiv.classList.remove('hidden');
    } finally {
        btn.disabled = false;
        btnText.textContent = 'Kembalikan Kunci';
        btnLoader.classList.add('hidden');
    }
}

