// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const navItems = document.querySelectorAll('.nav-item');
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const pageContents = document.querySelectorAll('.page-content');

// Handle navigation clicks
navItems.forEach(item => {
    item.addEventListener('click', function() {
        const targetPage = this.getAttribute('data-page');

        // Load data for the clicked page
        if (targetPage === 'bookings') {
            loadBookingsPage();
        }
        if (targetPage === 'dashboard') {
            loadDashboardData();
        }
        if (targetPage === 'guests') {
            loadGuestsPage();
        }
        if (targetPage === 'completed') {
            loadCompletedPage();
        }
        if (targetPage === 'rooms') {
            loadRoomsPage();  // ← This will load with real-time status
        }
        
        // Update active nav item
        navItems.forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
        
        // Show target page content
        pageContents.forEach(page => {
            page.classList.remove('active');
            if (page.id === targetPage + '-page') {
                page.classList.add('active');
            }
        });
    });
});

        // Handle menu toggle
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
        });

        // Function to fetch data from your PHP backend
        // Replace these URLs with your actual API endpoints
        function fetchDashboardData() {
            // Example API calls to your PHP scripts
            /*
            fetch('/api/get-stats.php')
                .then(response => response.json())
                .then(data => {
                    document.getElementById('totalRooms').textContent = data.totalRooms;
                    document.getElementById('occupiedRooms').textContent = data.occupiedRooms;
                    document.getElementById('availableRooms').textContent = data.availableRooms;
                    document.getElementById('totalBookings').textContent = data.totalBookings;
                    document.getElementById('upcomingCheckins').textContent = data.upcomingCheckins;
                    document.getElementById('revenue').textContent = '$' + data.revenue.toLocaleString();
                })
                .catch(error => console.error('Error fetching stats:', error));

            fetch('/api/get-bookings.php')
                .then(response => response.json())
                .then(bookings => {
                    const tbody = document.getElementById('bookingsTableBody');
                    tbody.innerHTML = '';
                    bookings.forEach(booking => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${booking.guest_name}</td>
                            <td>${booking.room_number}</td>
                            <td>${booking.check_in}</td>
                            <td>${booking.check_out}</td>
                            <td><span class="status-badge status-${booking.status}">${booking.status}</span></td>
                            <td>$${booking.amount}</td>
                        `;
                        tbody.appendChild(row);
                    });
                })
                .catch(error => console.error('Error fetching bookings:', error));

            fetch('/api/get-booking-trends.php')
                .then(response => response.json())
                .then(data => {
                    const barChart = document.getElementById('barChart');
                    barChart.innerHTML = '';
                    const maxVal = Math.max(...data.map(d => d.value));
                    data.forEach(item => {
                        const bar = document.createElement('div');
                        bar.className = 'bar';
                        bar.style.height = ((item.value / maxVal) * 100) + '%';
                        bar.innerHTML = `
                            <div class="bar-value">${item.value}</div>
                            <div class="bar-label">${item.day}</div>
                        `;
                        barChart.appendChild(bar);
                    });
                })
                .catch(error => console.error('Error fetching booking trends:', error));

            fetch('/api/get-room-status.php')
                .then(response => response.json())
                .then(data => {
                    const donutChart = document.getElementById('donutChart');
                    const legend = document.getElementById('legend');
                    donutChart.innerHTML = '';
                    legend.innerHTML = '';
                    
                    const total = data.reduce((sum, item) => sum + item.value, 0);
                    let startAngle = 0;
                    
                    data.forEach(item => {
                        const percentage = (item.value / total) * 100;
                        const angle = (percentage / 100) * 360;
                        const endAngle = startAngle + angle;
                        
                        const start = polarToCartesian(100, 100, 80, endAngle);
                        const end = polarToCartesian(100, 100, 80, startAngle);
                        const largeArcFlag = angle > 180 ? 1 : 0;
                        
                        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                        path.setAttribute('d', `M ${start.x} ${start.y} A 80 80 0 ${largeArcFlag} 0 ${end.x} ${end.y} L 100 100 Z`);
                        path.setAttribute('fill', item.color);
                        donutChart.appendChild(path);
                        
                        const legendItem = document.createElement('div');
                        legendItem.className = 'legend-item';
                        legendItem.innerHTML = `
                            <div class="legend-label">
                                <div class="legend-color" style="background-color: ${item.color}"></div>
                                <span>${item.label}</span>
                            </div>
                            <div class="legend-value">${item.value}</div>
                        `;
                        legend.appendChild(legendItem);
                        
                        startAngle = endAngle;
                    });
                })
                .catch(error => console.error('Error fetching room status:', error));
            */
        }

        // Helper function for donut chart
        function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
            const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
            return {
                x: centerX + (radius * Math.cos(angleInRadians)),
                y: centerY + (radius * Math.sin(angleInRadians))
            };
        }

        // Initialize dashboard data on page load
        loadDashboardData();

        // Add event listeners for responsive behavior
        window.addEventListener('resize', function() {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('collapsed');
            }
        });
    });

// === LOAD GUESTS PAGE DATA (defensive: shows server response on error) ===
function loadGuestsPage() {
    const tbody = document.getElementById('guestsTableBody');
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;">Loading current guests...</td></tr>`;

    fetch('get_guests.php', { cache: 'no-store' })
        .then(async res => {
            const text = await res.text();
            // Try parse JSON
            try {
                const data = JSON.parse(text);
                // If debug wrapper (ok/error) was returned, allow both shapes:
                if (data && typeof data === 'object' && data.ok !== undefined) {
                    if (!data.ok) throw new Error('Server error: ' + (data.error || 'unknown'));
                    return data.guests || [];
                }
                // otherwise assume data is array of guests
                if (Array.isArray(data)) return data;
                throw new Error('Unexpected JSON structure');
            } catch (parseErr) {
                // Not JSON or bad structure — surface server raw output for debugging
                console.error('Failed to parse JSON from get_guests.php:', parseErr);
                console.log('Server response (first 2000 chars):\n', text.slice(0, 2000));
                // Show a helpful UI row including trimmed server response
                const safeText = text.replace(/</g, '&lt;').replace(/>/g, '&gt;').slice(0, 1500);
                tbody.innerHTML = `
                    <tr>
                        <td colspan="7" style="text-align:left; color:#b91c1c;">
                            <strong>Server did not return valid JSON.</strong>
                            <pre style="white-space:pre-wrap; max-height:240px; overflow:auto; background:#fff3f3; padding:10px; border-radius:6px;">${safeText}</pre>
                            <div style="font-size:12px; color:#475569;">Check browser Console (F12 → Network → get_guests.php) for the full response.</div>
                        </td>
                    </tr>
                `;
                throw parseErr; // rethrow so the outer catch runs if present
            }
        })
        .then(guests => {
            // Render guests (array)
            tbody.innerHTML = '';
            if (!Array.isArray(guests) || guests.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="7" class="empty-state">
                            <div>No current guests</div>
                            <p>Guests who are currently checked-in will appear here</p>
                        </td>
                    </tr>`;
                return;
            }

            guests.forEach(g => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${escapeHtml(g.firstName)} ${escapeHtml(g.lastName)}</td>
                    <td>${escapeHtml(g.roomType || '')}</td>
                    <td>${escapeHtml(g.checkin || '')}</td>
                    <td>${escapeHtml(g.checkout || '')}</td>
                    <td><span class="status-badge ${g.status === 'checked_in_walkin' ? 'status-walkin' : 'status-confirmed'}">${g.status === 'checked_in_walkin' ? 'Check-in/Walk-in' : 'Checked-in'}</span></td>
                    <td>${escapeHtml(g.phone || '')}<br><small>${escapeHtml(g.email || '')}</small></td>
                    <td>
                        <button onclick="checkoutGuest(${g.id})" 
                            style="padding:6px 10px;border:none;background:#10b981;
                            color:white;border-radius:6px;cursor:pointer;font-size:12px;">
                            🏁 Check-out
                        </button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(err => {
            // If we hit here, error already surfaced in UI above; also log stack
            console.error('loadGuestsPage error:', err);
        });
}


function loadBookingsPage() {
    const tbody = document.getElementById('bookingsPageTableBody');
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;">Loading...</td></tr>`;

    fetch('get_bookings.php')
        .then(res => res.json())
        .then(data => {
            console.log('📊 Bookings data received:', data);
            tbody.innerHTML = '';
            
            if (!Array.isArray(data) || data.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="7" class="empty-state">
                            <div>No bookings found</div>
                            <p>Bookings from your MySQL database will appear here</p>
                        </td>
                    </tr>`;
                return;
            }

            data.forEach(b => {
                const row = document.createElement('tr');
                
                let statusClass = '';
                let statusText = b.status || 'Unknown';
                let actionButtons = '';

                const status = (b.status || '').toLowerCase();
                
                if (status === 'checked_in_walkin') {
                    // Walk-in bookings that haven't been checked in yet
                    statusClass = 'status-walkin';
                    statusText = 'Walk-in';
                    actionButtons = `
                        <button onclick="checkInGuest(${b.id})" 
                            style="padding:6px 10px;border:none;background:#10b981;color:white;border-radius:6px;cursor:pointer;font-size:12px;margin-right:5px;">
                            ✅ Check-in
                        </button>
                        <button onclick="cancelBooking(${b.id})" 
                            style="padding:6px 10px;border:none;background:#ef4444;color:white;border-radius:6px;cursor:pointer;font-size:12px;">
                            ❌ Cancel
                        </button>
                    `;
                } else if (status === 'booked') {
                    // Regular online bookings
                    statusClass = 'status-pending';
                    statusText = 'Booked';
                    actionButtons = `
                        <button onclick="checkInGuest(${b.id})" 
                            style="padding:6px 10px;border:none;background:#10b981;color:white;border-radius:6px;cursor:pointer;font-size:12px;margin-right:5px;">
                            ✅ Check-in
                        </button>
                        <button onclick="cancelBooking(${b.id})" 
                            style="padding:6px 10px;border:none;background:#ef4444;color:white;border-radius:6px;cursor:pointer;font-size:12px;">
                            ❌ Cancel
                        </button>
                    `;
                } else if (status === 'checked_in') {
                    // Already checked-in guests (shouldn't appear in bookings tab)
                    statusClass = 'status-confirmed';
                    statusText = 'Checked-in';
                    actionButtons = '-';
                } else {
                    statusClass = 'status-pending';
                    actionButtons = '-';
                    console.warn('Unknown booking status:', b.status);
                }

                row.innerHTML = `
                    <td>${escapeHtml(b.firstName)} ${escapeHtml(b.lastName)}</td>
                    <td>${escapeHtml(b.roomType)} • Room ${escapeHtml(b.room_number)}</td>
                    <td>${escapeHtml(b.checkin)}</td>
                    <td>${escapeHtml(b.checkout)}</td>
                    <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                    <td>₱${escapeHtml(b.totalAmount)}</td>
                    <td>${actionButtons}</td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(err => {
            console.error('Error loading bookings:', err);
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:#dc2626;">⚠️ Error loading bookings: ${err.message}</td></tr>`;
        });
}

// === MANUAL CHECK-IN ===
function checkInGuest(id) {
    if (!confirm("Confirm check-in for this guest?")) return;

    fetch('checkin_guest.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'id=' + encodeURIComponent(id)
    })
    .then(res => res.json())
    .then(data => {
        if (data.ok) {
            showToast('✅ Guest checked in successfully!');
            loadBookingsPage();
            loadGuestsPage();
            loadDashboardData();
            // Also refresh Rooms tab if it's active
            if (document.getElementById('rooms-page').classList.contains('active')) {
                loadRoomsPage();
            }
        } else {
            showToast('⚠️ ' + (data.error || 'Failed to check in'), 'error');
        }
    })
    .catch(err => {
        console.error('checkInGuest error:', err);
        showToast('❌ Network error: ' + err, 'error');
    });
}

function updateBookingStatus(bookingId, newStatus) {
    if (!confirm('Are you sure you want to update this booking status to "' + newStatus + '"?')) {
        return;
    }

    fetch('update_booking_status.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `booking_id=${bookingId}&new_status=${newStatus}`
    })
    .then(response => response.text())
    .then(result => {
        if (result === 'success') {
            alert('Booking status updated successfully!');
            
            // Refresh ALL pages in the main admin window
            if (window.opener && !window.opener.closed) {
                window.opener.loadRoomsPage();
                window.opener.loadBookingsPage();
                window.opener.loadGuestsPage();
                window.opener.loadDashboardData();
            }
            
            // Refresh current page
            setTimeout(() => {
                location.reload();
            }, 500);
            
        } else {
            alert('Error: ' + result);
        }
    })
    .catch(error => {
        alert('Error: ' + error);
    });
}




// simple HTML escape helper
function escapeHtml(s) {
    if (!s && s !== 0) return '';
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}


// Modern confirmation modal returning a Promise
function showConfirmModal(message = 'Are you sure?') {
    return new Promise(resolve => {
        const modal = document.getElementById('confirmModal');
        const textEl = modal.querySelector('p');
        const yesBtn = modal.querySelector('#confirmYes');
        const noBtn = modal.querySelector('#confirmNo');

        textEl.textContent = message;
        modal.style.display = 'flex';

        const cleanup = () => {
            modal.style.display = 'none';
            yesBtn.removeEventListener('click', onYes);
            noBtn.removeEventListener('click', onNo);
        };

        const onYes = () => { cleanup(); resolve(true); };
        const onNo  = () => { cleanup(); resolve(false); };

        yesBtn.addEventListener('click', onYes);
        noBtn.addEventListener('click', onNo);
    });
}



async function checkoutGuest(id) {
    const confirmed = await showConfirmModal('Mark this guest as checked out?');
    if (!confirmed) return;

    fetch('checkout_guest.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'id=' + encodeURIComponent(id)
    })
    .then(async res => {
        const text = await res.text();
        try {
            const data = JSON.parse(text);
            if (!data.ok) throw new Error(data.error || 'Unknown server error');

            // ✅ SUCCESS toast instead of alert
            showToast('✅ Guest checked out successfully!', 'success');

            loadGuestsPage();
            loadCompletedPage();
            loadDashboardData();
        } catch (e) {
            console.error('checkout_guest response:', text.slice(0, 2000));
            showToast('⚠️ Server error during checkout. See console for details.', 'error');
        }
    })
    .catch(err => {
        console.error('checkoutGuest fetch error:', err);
        showToast('❌ Network error: ' + err, 'error');
    });
}




function loadDashboardData() {
    // Load stats
    fetch('get_summary.php')
        .then(res => res.json())
        .then(data => {
            document.getElementById('totalRooms').textContent = data.totalRooms;
            document.getElementById('occupiedRooms').textContent = data.occupiedRooms;
            document.getElementById('reservedRooms').textContent = data.reservedRooms;
            document.getElementById('availableRooms').textContent = data.availableRooms;
            loadRoomStatusChart(data);
        })
        .catch(err => console.error('Error loading dashboard summary:', err));

    // Load today's activities
    loadTodaysActivities();
    
    // Load other dashboard data
    loadBookingTrends();
    loadRecentBookings();
}

function loadBookingTrends() {
  fetch('get_booking_trends.php')
    .then(res => res.text())
    .then(text => {
      console.log('Booking trends response:', text);
      const data = JSON.parse(text);
      const ctx = document.createElement('canvas');
      const container = document.querySelector('.chart-container');
      container.innerHTML = ''; // Clear previous chart
      container.appendChild(ctx);

      new Chart(ctx, {
        type: 'bar', // 🔄 changed from 'line' to 'bar'
        data: {
          labels: Object.keys(data),
          datasets: [{
            label: 'Bookings',
            data: Object.values(data),
            backgroundColor: 'rgba(99, 102, 241, 0.8)',
            borderRadius: 6
          }]
        },
        options: {
          plugins: {
            legend: { display: false },
            title: { display: false }
          },
          scales: {
            x: {
              title: { display: true, text: 'Date' },
              grid: { display: false }
            },
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Bookings' },
              ticks: { precision: 0 }
            }
          }
        }
      });
    })
    .catch(err => console.error('Error loading booking trends:', err));
}

function loadRoomStatusChart(data) {
  const ctx = document.createElement('canvas');
  const chartDiv = document.getElementById('donutChart');
  chartDiv.replaceWith(ctx);

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Occupied', 'Reserved', 'Available'],
      datasets: [{
        data: [data.occupiedRooms, data.reservedRooms, data.availableRooms],
        backgroundColor: ['#ef4444', '#f59e0b', '#10b981']
      }]
    },
    options: { plugins: { legend: { position: 'bottom' } } }
  });
}

function loadRecentBookings() {
  fetch('get_recent_bookings.php')
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById('bookingsTableBody');
      tbody.innerHTML = '';
      data.forEach(b => {
        tbody.innerHTML += `
          <tr>
            <td>${b.firstName} ${b.lastName}</td>
            <td>${b.roomType}</td>
            <td>${b.checkin}</td>
            <td>${b.checkout}</td>
            <td><span class="status-badge status-confirmed">${b.status}</span></td>
            <td>₱${b.totalAmount}</td>
          </tr>
        `;
      });
    });
}


function showToast(message, type = 'success') {
    // Remove any existing toast first
    const old = document.querySelector('.custom-toast');
    if (old) old.remove();

    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.textContent = message;
    toast.dataset.type = type;

    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => toast.classList.add('show'), 10);

    // Auto remove after 3s
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}


// === LOAD COMPLETED PAGE DATA ===
function loadCompletedPage() {
    const tbody = document.getElementById('completedTableBody');
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Loading completed bookings...</td></tr>`;

    fetch('get_completed.php')
        .then(res => res.json())
        .then(data => {
            tbody.innerHTML = '';
            if (!Array.isArray(data) || data.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="6" class="empty-state">
                            <div>No completed stays found</div>
                            <p>Guests who have checked out will appear here</p>
                        </td>
                    </tr>`;
                return;
            }

            data.forEach(g => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${g.firstName} ${g.lastName}</td>
                    <td>${g.roomType}</td>
                    <td>${g.checkin}</td>
                    <td>${g.checkout}</td>
                    <td><span class="status-badge">${g.status}</span></td>
                    <td>${g.phone || ''}<br><small>${g.email || ''}</small></td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(err => {
            console.error('Error loading completed bookings:', err);
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:#dc2626;">⚠️ Error loading completed data</td></tr>`;
        });
}

// === LOAD ROOMS PAGE DATA WITH REAL-TIME STATUS ===
function loadRoomsPage() {
    const tbody = document.getElementById('roomsTableBody');
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;"><div class="loading-spinner"></div><p>Loading room data...</p></td></tr>';

    // Get selected date from filter
    const dateFilter = document.getElementById('roomDateFilter');
    let selectedDate = dateFilter.value;
    
    // If no date selected, use today
    if (!selectedDate) {
        selectedDate = new Date().toISOString().split('T')[0];
        dateFilter.value = selectedDate;
    }

    console.log('🔄 Loading rooms for date:', selectedDate);

    fetch(`get_rooms.php?date=${selectedDate}`)
        .then(res => {
            if (!res.ok) throw new Error('Network response was not ok');
            return res.json();
        })
        .then(rooms => {
            displayRoomsData(rooms, selectedDate);
        })
        .catch(err => {
            console.error('Error loading rooms:', err);
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:red;">Error loading rooms</td></tr>';
        });
}

// Date Utility Functions
function setDateToToday() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('roomDateFilter').value = today;
    loadRoomsPage();
}

function setQuickDate(daysFromToday) {
    const date = new Date();
    date.setDate(date.getDate() + daysFromToday);
    const dateString = date.toISOString().split('T')[0];
    document.getElementById('roomDateFilter').value = dateString;
    loadRoomsPage();
}

function clearRoomDateFilter() {
    document.getElementById('roomDateFilter').value = '';
    loadRoomsPage();
}

function displayRoomsData(rooms, selectedDate) {
    const tbody = document.getElementById('roomsTableBody');
    tbody.innerHTML = '';
    
    if (!Array.isArray(rooms) || rooms.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    <div>No rooms found</div>
                    <p>Room data will appear here</p>
                </td>
            </tr>`;
        updateFilterStats(0, 0, 0);
        return;
    }

    // Count room statuses
    let availableCount = 0;
    let occupiedCount = 0;
    let reservedCount = 0;

    rooms.forEach(room => {
        const row = document.createElement('tr');
        
        let statusClass, statusText, guestInfo;
        
        // Determine status and count
switch(room.roomStatus) {
    case 'occupied':
        statusClass = 'status-occupied'; // 🔴 RED
        statusText = 'Occupied';
        occupiedCount++;
        guestInfo = room.currentGuest && room.currentGuest !== '-' ? 
            room.currentGuest : 'Guest checked-in';
        break;
    case 'reserved':
        statusClass = 'status-reserved'; // 🟠 ORANGE
        statusText = 'Reserved';
        reservedCount++;
        guestInfo = room.currentGuest && room.currentGuest !== '-' ? 
            room.currentGuest : 'Future booking';
        break;
    default: // available
        statusClass = 'status-available'; // 🟢 GREEN
        statusText = 'Available';
        availableCount++;
        guestInfo = '-';
}

        const roomNumber = room.room_number || 'N/A';
        const roomType = room.room_type || 'N/A';
        const price = room.price_per_night ? `₱${parseInt(room.price_per_night).toLocaleString()}/night` : '₱0/night';
        const capacity = room.capacity ? `${room.capacity} guests` : '0 guests';

        row.innerHTML = `
    <td>
        <div class="room-number">${roomNumber}</div>
    </td>
    <td>${roomType}</td>
    <td>${price}</td>
    <td>${capacity}</td>
    <td><span class="status-badge ${statusClass}">${statusText}</span></td>
    <td>${guestInfo}</td>
`;
        tbody.appendChild(row);
    });

    // Update statistics
    updateFilterStats(availableCount, occupiedCount, reservedCount);

    console.log(`✅ Loaded ${rooms.length} rooms for ${new Date(selectedDate).toDateString()}`);
}

function updateFilterStats(available, occupied, reserved) {
    document.getElementById('availableCount').textContent = available;
    document.getElementById('occupiedCount').textContent = occupied;
    document.getElementById('reservedCount').textContent = reserved;
}

// Auto-refresh when date filter changes
document.addEventListener('DOMContentLoaded', function() {
    const dateFilter = document.getElementById('roomDateFilter');
    if (dateFilter) {
        dateFilter.addEventListener('change', function() {
            console.log('📅 Date filter changed to:', this.value);
            loadRoomsPage();
        });
    }
    
    // Load rooms when page loads
    setTimeout(loadRoomsPage, 100);
});

// === VIEW ROOM BOOKING CALENDAR ===
function viewRoomCalendar(roomType) {
    fetch(`get_room_bookings.php?roomType=${roomType}`)
        .then(res => res.json())
        .then(bookings => {
            let calendarHTML = `
                <h3>📅 ${roomType} Rooms - Booking Calendar</h3>
                <p>Showing bookings for all ${roomType} rooms</p>
                <div style="max-height: 400px; overflow-y: auto;">
            `;
            
            if (bookings.length === 0) {
                calendarHTML += '<p>No future bookings for this room type</p>';
            } else {
                bookings.forEach(booking => {
                    const statusClass = booking.status === 'checked_in' ? 'status-confirmed' : 
                                      booking.status === 'booked' ? 'status-warning' : 'status-pending';
                    
                    calendarHTML += `
                        <div style="border: 1px solid #ddd; padding: 10px; margin: 5px 0; border-radius: 5px;">
                            <strong>${booking.firstName} ${booking.lastName}</strong><br>
                            <span class="status-badge ${statusClass}">${booking.status}</span><br>
                            📅 ${booking.checkin} to ${booking.checkout}
                        </div>
                    `;
                });
            }
            
            calendarHTML += '</div>';
            
            Swal.fire({
                title: `${roomType} Rooms Bookings`,
                html: calendarHTML,
                width: 600,
                confirmButtonText: 'Close'
            });
        })
        .catch(err => {
            Swal.fire('Error', 'Could not load booking calendar', 'error');
        });
}


// === SIMPLE AUTO-REFRESH ===
function startAutoRefresh() {
    console.log('🔄 Auto-refresh started (every 10 seconds)');
    
    setInterval(function() {
        if (document.getElementById('dashboard-page').classList.contains('active')) {
            console.log('🔄 Auto-refreshing dashboard...');
            loadDashboardData();
        }
        if (document.getElementById('bookings-page').classList.contains('active')) {
            console.log('🔄 Auto-refreshing bookings...');
            loadBookingsPage();
        }
        if (document.getElementById('guests-page').classList.contains('active')) {
            console.log('🔄 Auto-refreshing guests...');
            loadGuestsPage();
        }
        if (document.getElementById('completed-page').classList.contains('active')) {
            console.log('🔄 Auto-refreshing completed...');
            loadCompletedPage();
        }
        if (document.getElementById('rooms-page').classList.contains('active')) {
        loadRoomsPage();
        }
    }, 100000); // Refresh every 10 seconds
}

// Start auto-refresh when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(startAutoRefresh, 2000);
});


// Load Dashboard Data
function loadDashboardData() {
    console.log('Loading dashboard data...');
    
    fetch('get_live_activities.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                updateDashboard(data);
            } else {
                console.error('Error loading dashboard:', data.error);
                showToast('Error loading dashboard data', 'error');
            }
        })
        .catch(error => {
            console.error('Network error:', error);
            showToast('Network error loading dashboard', 'error');
        });
}

// Update Dashboard with Real Data
function updateDashboard(data) {
    console.log('Updating dashboard with:', data);
    
    // Update room stats
    if (data.rooms) {
        document.getElementById('totalRooms').textContent = data.rooms.total || 10;
        document.getElementById('availableRooms').textContent = data.rooms.available || 0;
        document.getElementById('occupiedRooms').textContent = data.rooms.occupied || 0;
        document.getElementById('reservedRooms').textContent = data.rooms.reserved || 0;
    }
    
    // Update arrivals list
    updateActivityList('arrivals', data.arrivals, 'arriving');
    
    // Update departures list
    updateActivityList('departures', data.departures, 'departing');
    
    // Update in-house list
    updateActivityList('inHouse', data.inHouse, 'current');
}

// Update activity lists
function updateActivityList(type, items, className) {
    const listElement = document.getElementById(type + 'List');
    
    if (!items || items.length === 0) {
        listElement.innerHTML = `<div class="empty-activity">No ${type} today</div>`;
        return;
    }
    
    listElement.innerHTML = items.map(item => `
        <div class="activity-item ${className}">
            <strong>${item.firstName} ${item.lastName}</strong>
            <div class="activity-details">
                ${item.roomType} • Room ${item.room_number || 'TBA'}
            </div>
            <div class="activity-details">
                ${type === 'arrivals' ? 'Check-in: ' + item.checkin : 
                  type === 'departures' ? 'Check-out: ' + item.checkout :
                  'Until: ' + item.checkout}
            </div>
            ${type === 'arrivals' ? 
                `<button class="btn-small" onclick="checkInGuest(${item.id})" style="margin-top: 5px; padding: 4px 8px; background: #10b981; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">Check In</button>` : 
              type === 'departures' ?
                `<button class="btn-small" onclick="checkoutGuest(${item.id})" style="margin-top: 5px; padding: 4px 8px; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">Check Out</button>` :
                ''
            }
        </div>
    `).join('');
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Load dashboard data immediately
    loadDashboardData();
    
    // Auto-refresh every 2 minutes
    setInterval(() => {
        if (document.getElementById('dashboard-page').classList.contains('active')) {
            loadDashboardData();
        }
    }, 120000);
});


// === LOAD TODAY'S ACTIVITIES ===
function loadTodaysActivities() {
    const timestamp = new Date().getTime();
    fetch('get_todays_activities.php?t=' + timestamp)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                updateActivitiesUI(data);
            } else {
                console.error('Error loading activities:', data.error);
            }
        })
        .catch(err => {
            console.error('Error fetching activities:', err);
        });
}

function updateActivitiesUI(data) {
    if (!data.success) {
        console.error('Error in activities data:', data.error);
        return;
    }

    // Update counts
    const arrivalsCount = document.getElementById('arrivalsCount');
    const toursCount = document.getElementById('toursCount');
    const mealsCount = document.getElementById('mealsCount');
    
    if (arrivalsCount) arrivalsCount.textContent = data.stats.arrivalsCount;
    if (toursCount) toursCount.textContent = data.stats.toursCount;
    if (mealsCount) mealsCount.textContent = data.stats.mealsCount;

    // Update arrivals list - NEW ALIGNMENT FORMAT
    const arrivalsList = document.getElementById('arrivalsList');
    if (arrivalsList) {
        arrivalsList.innerHTML = '';

        if (data.arrivals.length === 0) {
            arrivalsList.innerHTML = '<div class="empty-activity">No arrivals today</div>';
        } else {
            data.arrivals.forEach(arrival => {
                const arrivalItem = document.createElement('div');
                arrivalItem.className = 'activity-item arriving';
                
                arrivalItem.innerHTML = `
                    <div class="guest-name">
                        <span>${arrival.firstName} ${arrival.lastName}</span>
                        <span class="time-label">Time</span>
                    </div>
                    <div class="room-info">${arrival.roomInfo} • ${arrival.checkinTime}</div>
                    <div class="pickup-row">
                        <span class="pickup-label">${arrival.hasPickup ? 'Airport pick up' : 'No pickup'}</span>
                        <span class="pickup-time">${arrival.pickupTime || ''}</span>
                    </div>
                `;
                arrivalsList.appendChild(arrivalItem);
            });
        }
    }

    // Update tours list
    const toursList = document.getElementById('toursList');
    if (toursList) {
        toursList.innerHTML = '';

        if (data.tours.length === 0) {
            toursList.innerHTML = '<div class="empty-activity">No tours scheduled</div>';
        } else {
            data.tours.forEach(tour => {
                const tourItem = document.createElement('div');
                tourItem.className = 'activity-item tour';
                
                tourItem.innerHTML = `
                    <div class="guest-name">
                        <span>${tour.guestName}</span>
                        <span class="tour-badge">${tour.tourType}</span>
                    </div>
                    <div class="room-info">Room ${tour.roomNumber}</div>
                    <div class="service-details">
                        <div class="service-row">
                            <span class="service-label">Status:</span>
                            <span class="service-value">${tour.status}</span>
                        </div>
                    </div>
                `;
                toursList.appendChild(tourItem);
            });
        }
    }

    // Update meals list
    const mealsList = document.getElementById('mealsList');
    if (mealsList) {
        mealsList.innerHTML = '';

        if (data.meals.length === 0) {
            mealsList.innerHTML = '<div class="empty-activity">No meal services</div>';
        } else {
            data.meals.forEach(meal => {
                const mealItem = document.createElement('div');
                mealItem.className = 'activity-item meal';
                
                mealItem.innerHTML = `
                    <div class="guest-name">
                        <span>${meal.guestName}</span>
                        <span class="meal-badge">${meal.mealPlan}</span>
                    </div>
                    <div class="room-info">Room ${meal.roomNumber} • ${meal.duration}</div>
                    <div class="service-details">
                        <div class="service-row">
                            <span class="service-label">Status:</span>
                            <span class="service-value">${meal.status}</span>
                        </div>
                    </div>
                `;
                mealsList.appendChild(mealItem);
            });
        }
    }
}

// === LOAD DASHBOARD DATA (SIMPLIFIED) ===
function loadDashboardData() {
    console.log('Loading dashboard data...');
    
    // Load summary stats
    fetch('get_summary.php')
        .then(res => res.json())
        .then(data => {
            console.log('Updating dashboard with:', data);
            
            // Update stats cards
            const totalRooms = document.getElementById('totalRooms');
            const occupiedRooms = document.getElementById('occupiedRooms');
            const availableRooms = document.getElementById('availableRooms');
            const reservedRooms = document.getElementById('reservedRooms');
            const totalBookings = document.getElementById('totalBookings');
            const upcomingCheckins = document.getElementById('upcomingCheckins');
            const revenue = document.getElementById('revenue');
            
            if (totalRooms) totalRooms.textContent = data.totalRooms || 0;
            if (occupiedRooms) occupiedRooms.textContent = data.occupiedRooms || 0;
            if (availableRooms) availableRooms.textContent = data.availableRooms || 0;
            if (reservedRooms) reservedRooms.textContent = data.reservedRooms || 0;
            if (totalBookings) totalBookings.textContent = data.totalBookings || 0;
            if (upcomingCheckins) upcomingCheckins.textContent = data.upcomingCheckins || 0;
            if (revenue) revenue.textContent = '₱' + (data.revenue || 0).toLocaleString();
        })
        .catch(err => {
            console.error('Network error:', err);
        });
    
    // Load today's activities
    loadTodaysActivities();
}

// === START AUTO-REFRESH ===
function startAutoRefresh() {
    console.log('🔄 Auto-refresh started (every 30 seconds)');
    
    setInterval(function() {
        if (document.getElementById('dashboard-page').classList.contains('active')) {
            console.log('🔄 Auto-refreshing dashboard...');
            loadDashboardData();
        }
    }, 30000); // Refresh every 30 seconds
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadDashboardData();
    setTimeout(startAutoRefresh, 2000);
});

// Add CSS for pickup display
const style = document.createElement('style');
style.textContent = `
    .pickup-display {
        font-size: 13px;
        color: var(--text-primary);
        margin: 8px 0;
        font-weight: 600;
        padding: 4px 8px;
        border-radius: 6px;
        background: var(--bg-main);
        display: inline-block;
    }
`;
document.head.appendChild(style);

// === NEW BOOKING MODAL FUNCTIONS ===
let availableRooms = [];
let roomTypes = [];

function openNewBookingModal() {
    const modal = document.getElementById('newBookingModal');
    modal.style.display = 'flex';
    
    // ADD THIS: Form submission listener
    const walkinForm = document.getElementById('walkinBookingForm');
    if (walkinForm) {
        walkinForm.onsubmit = function(e) {
            console.log('✅ Form submitted!');
            e.preventDefault();
            createWalkinBooking();
            return false;
        };
    }
    
    // Set today's date as check-in (minimum date)
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('walkinCheckin').value = today;
    document.getElementById('walkinCheckin').min = today;
    
    // Set tomorrow as check-out (minimum date)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('walkinCheckout').value = tomorrow.toISOString().split('T')[0];
    document.getElementById('walkinCheckout').min = tomorrow.toISOString().split('T')[0];
    
    // Reset form
    document.getElementById('walkinBookingForm').reset();
    
    // Reset displays
    document.getElementById('walkinNights').value = '0 night(s)';
    document.getElementById('nightsDisplay').textContent = '0';
    document.getElementById('mealsNightsDisplay').textContent = '0';
    document.getElementById('roomPriceDisplay').textContent = '₱0';
    document.getElementById('mealsPriceDisplay').textContent = '₱0';
    document.getElementById('toursPriceDisplay').textContent = '₱0';
    document.getElementById('totalAmountDisplay').textContent = '₱0';
    document.getElementById('walkinAmount').value = '0';
    
    // Load room types from your database
    loadRoomTypes();
    
    // Add event listeners
    addCalculationEventListeners();
    
    // Initial calculation
    calculateNights();
    loadAvailableRooms(); // Load available rooms based on initial dates
}

function closeNewBookingModal() {
    document.getElementById('newBookingModal').style.display = 'none';
    removeCalculationEventListeners();
}

function addCalculationEventListeners() {
    // Only add listeners if elements exist
    const checkin = document.getElementById('walkinCheckin');
    const checkout = document.getElementById('walkinCheckout');
    const roomType = document.getElementById('walkinRoomType');
    const roomNumber = document.getElementById('walkinRoomNumber');
    const guests = document.getElementById('walkinGuests');
    const meals = document.getElementById('walkinMeals');
    const tours = document.getElementById('walkinTours');
    
    if (checkin) checkin.addEventListener('change', handleDateChange);
    if (checkout) checkout.addEventListener('change', handleDateChange);
    if (roomType) roomType.addEventListener('change', handleRoomTypeChange);
    if (roomNumber) roomNumber.addEventListener('change', handleRoomNumberChange);
    if (guests) guests.addEventListener('change', calculateTotal);
    if (meals) meals.addEventListener('change', calculateTotal);
    if (tours) tours.addEventListener('change', calculateTotal);
}

function removeCalculationEventListeners() {
    const checkin = document.getElementById('walkinCheckin');
    const checkout = document.getElementById('walkinCheckout');
    const roomType = document.getElementById('walkinRoomType');
    const roomNumber = document.getElementById('walkinRoomNumber');
    const guests = document.getElementById('walkinGuests');
    const meals = document.getElementById('walkinMeals');
    const tours = document.getElementById('walkinTours');
    
    if (checkin) checkin.removeEventListener('change', handleDateChange);
    if (checkout) checkout.removeEventListener('change', handleDateChange);
    if (roomType) roomType.removeEventListener('change', handleRoomTypeChange);
    if (roomNumber) roomNumber.removeEventListener('change', handleRoomNumberChange);
    if (guests) guests.removeEventListener('change', calculateTotal);
    if (meals) meals.removeEventListener('change', calculateTotal);
    if (tours) tours.removeEventListener('change', calculateTotal);
}

function loadRoomTypes() {
    fetch('get_room_types.php')
        .then(res => res.json())
        .then(types => {
            roomTypes = types;
        })
        .catch(err => {
            console.error('Error loading room types:', err);
        });
}

function loadAvailableRooms() {
    const checkin = document.getElementById('walkinCheckin').value;
    const checkout = document.getElementById('walkinCheckout').value;
    
    if (!checkin || !checkout) {
        document.getElementById('walkinRoomType').innerHTML = '<option value="">Select Dates First</option>';
        document.getElementById('walkinRoomNumber').innerHTML = '<option value="">Select Room Type First</option>';
        return;
    }
    
    fetch(`get_available_rooms.php?checkin=${checkin}&checkout=${checkout}`)
        .then(res => res.json())
        .then(rooms => {
            availableRooms = rooms;
            updateRoomTypeOptions();
        })
        .catch(err => {
            console.error('Error loading available rooms:', err);
        });
}

function updateRoomTypeOptions() {
    const roomTypeSelect = document.getElementById('walkinRoomType');
    roomTypeSelect.innerHTML = '<option value="">Select Room Type</option>';
    
    // Get unique room types from available rooms
    const uniqueTypes = {};
    availableRooms.forEach(room => {
        if (!uniqueTypes[room.room_type]) {
            uniqueTypes[room.room_type] = {
                room_type: room.room_type,
                price_per_night: room.price_per_night,
                capacity: room.capacity
            };
        }
    });
    
    // Populate room type dropdown
    Object.values(uniqueTypes).forEach(type => {
        const option = document.createElement('option');
        option.value = type.room_type;
        option.textContent = `${type.room_type.charAt(0).toUpperCase() + type.room_type.slice(1)} (₱${type.price_per_night.toLocaleString()}/night)`;
        option.setAttribute('data-price', type.price_per_night);
        option.setAttribute('data-capacity', type.capacity);
        roomTypeSelect.appendChild(option);
    });
    
    if (availableRooms.length === 0) {
        roomTypeSelect.innerHTML = '<option value="">No rooms available for selected dates</option>';
    }
}

function updateRoomNumberOptions() {
    const roomType = document.getElementById('walkinRoomType').value;
    const roomNumberSelect = document.getElementById('walkinRoomNumber');
    roomNumberSelect.innerHTML = '<option value="">Select Room</option>';
    
    if (roomType) {
        const filteredRooms = availableRooms.filter(room => room.room_type === roomType);
        
        filteredRooms.forEach(room => {
            const option = document.createElement('option');
            option.value = room.room_number;
            option.textContent = `Room ${room.room_number}`;
            option.setAttribute('data-price', room.price_per_night);
            option.setAttribute('data-capacity', room.capacity);
            roomNumberSelect.appendChild(option);
        });
        
        if (filteredRooms.length === 0) {
            roomNumberSelect.innerHTML = '<option value="">No available rooms of this type</option>';
        }
    }
}

function handleDateChange() {
    calculateNights();
    loadAvailableRooms(); // Reload available rooms based on new dates
    calculateTotal();
}

function handleRoomTypeChange() {
    updateRoomNumberOptions();
    updateRoomDetails();
    calculateTotal();
}

function handleRoomNumberChange() {
    updateRoomDetails();
    calculateTotal();
}

function updateRoomDetails() {
    const roomNumberSelect = document.getElementById('walkinRoomNumber');
    const selectedOption = roomNumberSelect.options[roomNumberSelect.selectedIndex];
    const roomDetails = document.getElementById('roomDetails');
    
    if (selectedOption && selectedOption.value) {
        const price = selectedOption.getAttribute('data-price');
        const capacity = selectedOption.getAttribute('data-capacity');
        
        document.getElementById('roomPricePerNight').textContent = `₱${parseInt(price).toLocaleString()}`;
        document.getElementById('roomCapacity').textContent = `${capacity} guests`;
        document.getElementById('roomAvailability').textContent = 'Yes';
        
        roomDetails.style.display = 'block';
    } else {
        roomDetails.style.display = 'none';
    }
}

function calculateNights() {
    const checkin = new Date(document.getElementById('walkinCheckin').value);
    const checkout = new Date(document.getElementById('walkinCheckout').value);
    
    if (checkin && checkout && checkout > checkin) {
        const timeDiff = checkout.getTime() - checkin.getTime();
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
        document.getElementById('walkinNights').value = `${nights} night(s)`;
        return nights;
    } else {
        document.getElementById('walkinNights').value = '0 night(s)';
        return 0;
    }
}

function calculateTotal() {
    const nights = calculateNights();
    const roomNumberSelect = document.getElementById('walkinRoomNumber');
    const selectedRoomOption = roomNumberSelect ? roomNumberSelect.options[roomNumberSelect.selectedIndex] : null;
    const mealsSelect = document.getElementById('walkinMeals');
    const toursSelect = document.getElementById('walkinTours');
    
    // Get prices
    const roomPricePerNight = selectedRoomOption && selectedRoomOption.value ? 
        parseInt(selectedRoomOption.getAttribute('data-price')) : 0;
    const mealsPricePerDay = mealsSelect ? 
        parseInt(mealsSelect.options[mealsSelect.selectedIndex].getAttribute('data-price')) || 0 : 0;
    const toursPrice = toursSelect ? 
        parseInt(toursSelect.options[toursSelect.selectedIndex].getAttribute('data-price')) || 0 : 0;
    
    // Calculate totals
    const totalRoomPrice = roomPricePerNight * nights;
    const totalMealsPrice = mealsPricePerDay * nights;
    const totalAmount = totalRoomPrice + totalMealsPrice + toursPrice;
    
    // Update displays
    document.getElementById('nightsDisplay').textContent = nights;
    document.getElementById('mealsNightsDisplay').textContent = nights;
    document.getElementById('roomPriceDisplay').textContent = `₱${totalRoomPrice.toLocaleString()}`;
    document.getElementById('mealsPriceDisplay').textContent = `₱${totalMealsPrice.toLocaleString()}`;
    document.getElementById('toursPriceDisplay').textContent = `₱${toursPrice.toLocaleString()}`;
    document.getElementById('totalAmountDisplay').textContent = `₱${totalAmount.toLocaleString()}`;
    
    // Update the hidden total amount field
    const walkinAmount = document.getElementById('walkinAmount');
    if (walkinAmount) {
        walkinAmount.value = totalAmount;
    }
    
    // Validate guest capacity
    validateGuestCapacity();
}

function validateGuestCapacity() {
    const roomNumberSelect = document.getElementById('walkinRoomNumber');
    const selectedOption = roomNumberSelect ? roomNumberSelect.options[roomNumberSelect.selectedIndex] : null;
    const guests = parseInt(document.getElementById('walkinGuests').value);
    
    if (selectedOption && selectedOption.value) {
        const capacity = parseInt(selectedOption.getAttribute('data-capacity'));
        const confirmBtn = document.getElementById('confirmBookingBtn');
        
        if (guests > capacity) {
            confirmBtn.disabled = true;
            confirmBtn.style.opacity = '0.6';
            confirmBtn.title = `Room capacity exceeded. Maximum: ${capacity} guests`;
            showToast(`⚠️ Room capacity exceeded. Maximum: ${capacity} guests`, 'error');
        } else {
            confirmBtn.disabled = false;
            confirmBtn.style.opacity = '1';
            confirmBtn.title = '';
        }
    }
}

// REPLACE the existing form submission code with this:
document.getElementById('confirmBookingBtn').addEventListener('click', function(e) {
    e.preventDefault();
    console.log('✅ Confirm button clicked directly');
    createWalkinBooking();
});

// Add button click listener as backup
document.getElementById('confirmBookingBtn').addEventListener('click', function(e) {
    console.log('🎯 Confirm button clicked');
    e.preventDefault();
    e.stopPropagation();
    // Trigger the form submission handler
    document.getElementById('walkinBookingForm').dispatchEvent(new Event('submit'));
});

function createWalkinBooking() {
    console.log('=== 🚨 REAL FORM SUBMISSION DEBUG START ===');
    
    // Get ALL form values with detailed logging
    const formElements = {
        firstName: document.getElementById('walkinFirstName'),
        lastName: document.getElementById('walkinLastName'),
        email: document.getElementById('walkinEmail'),
        phone: document.getElementById('walkinPhone'),
        roomType: document.getElementById('walkinRoomType'),
        roomNumber: document.getElementById('walkinRoomNumber'),
        checkin: document.getElementById('walkinCheckin'),
        checkout: document.getElementById('walkinCheckout'),
        guests: document.getElementById('walkinGuests'),
        totalAmount: document.getElementById('walkinAmount'),
        meals: document.getElementById('walkinMeals'),
        tours: document.getElementById('walkinTours')
    };

    // Log each field value in detail
    console.log('🔍 FORM FIELD VALUES:');
    let hasEmptyFields = false;
    Object.keys(formElements).forEach(key => {
        const element = formElements[key];
        if (element) {
            const value = element.value;
            const isEmpty = !value || value === '' || value === 'Select Room' || value === 'Select Room Type';
            console.log(`  ${key}:`, {
                value: value,
                isEmpty: isEmpty,
                elementExists: true,
                elementId: element.id
            });
            if (isEmpty && ['roomType', 'roomNumber', 'firstName', 'lastName', 'phone'].includes(key)) {
                hasEmptyFields = true;
                console.error(`❌ EMPTY REQUIRED FIELD: ${key}`);
            }
        } else {
            console.error(`❌ MISSING ELEMENT: ${key}`);
            hasEmptyFields = true;
        }
    });

    if (hasEmptyFields) {
        console.error('❌ FORM HAS EMPTY REQUIRED FIELDS - STOPPING SUBMISSION');
        showToast('❌ Please fill in all required fields', 'error');
        return;
    }

    // Build form data
    const formData = {
        firstName: formElements.firstName.value.trim(),
        lastName: formElements.lastName.value.trim(),
        email: formElements.email.value.trim(),
        phone: formElements.phone.value.trim(),
        roomType: formElements.roomType.value,
        roomNumber: formElements.roomNumber.value,
        checkin: formElements.checkin.value,
        checkout: formElements.checkout.value,
        guests: parseInt(formElements.guests.value),
        totalAmount: parseFloat(formElements.totalAmount.value),
        meals: formElements.meals.value,
        tours: formElements.tours.value
    };

    console.log('📦 FINAL FORM DATA BEING SENT:', formData);

    // Enhanced validation
    const validationErrors = [];
    
    if (!formData.roomNumber || formData.roomNumber === 'Select Room') {
        validationErrors.push('Please select a room');
    }
    
    if (!formData.roomType || formData.roomType === 'Select Room Type') {
        validationErrors.push('Please select a room type');
    }
    
    if (!formData.firstName || formData.firstName.trim() === '') {
        validationErrors.push('First name is required');
    }
    
    if (!formData.lastName || formData.lastName.trim() === '') {
        validationErrors.push('Last name is required');
    }
    
    if (!formData.phone || formData.phone.trim() === '') {
        validationErrors.push('Phone number is required');
    }
    
    if (formData.guests < 1 || isNaN(formData.guests)) {
        validationErrors.push('Valid number of guests is required');
    }
    
    if (formData.totalAmount <= 0 || isNaN(formData.totalAmount)) {
        validationErrors.push('Valid total amount is required');
    }

    if (validationErrors.length > 0) {
        console.error('❌ VALIDATION ERRORS:', validationErrors);
        showToast('❌ ' + validationErrors[0], 'error');
        return;
    }

    console.log('✅ ALL VALIDATIONS PASSED - SENDING TO SERVER');

    // Show loading state
    const confirmBtn = document.getElementById('confirmBookingBtn');
    const originalText = confirmBtn.innerHTML;
    confirmBtn.disabled = true;
    confirmBtn.innerHTML = 'Creating...';
    confirmBtn.style.opacity = '0.7';

    // Add timestamp to avoid caching
    const timestamp = new Date().getTime();
    const url = `create_walkin_booking.php?t=${timestamp}`;

    console.log('📤 Sending POST request to:', url);
    console.log('📦 Request payload:', JSON.stringify(formData, null, 2));

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(async response => {
        console.log('📥 Response received - Status:', response.status, response.statusText);
        
        const responseText = await response.text();
        console.log('📄 Raw response text:', responseText);
        
        // Check if response is HTML error page
        if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
            console.error('❌ Server returned HTML instead of JSON - likely PHP error');
            const errorMatch = responseText.match(/<b>([^<]+)<\/b>/);
            const errorMessage = errorMatch ? errorMatch[1] : 'Server returned HTML error page';
            throw new Error('PHP Error: ' + errorMessage);
        }
        
        try {
            const data = JSON.parse(responseText);
            console.log('✅ Successfully parsed JSON response:', data);
            return data;
        } catch (parseError) {
            console.error('❌ Failed to parse JSON response:', parseError);
            console.log('📄 Response that failed to parse:', responseText.substring(0, 500));
            throw new Error('Invalid JSON response from server');
        }
    })
    .then(data => {
        console.log('📨 Final response data:', data);
        
        if (data.success) {
            console.log('🎉 SUCCESS: Booking created with ID:', data.booking_id);
            showToast('✅ Walk-in booking created successfully!');
            closeNewBookingModal();
            
            // Refresh all pages
            console.log('🔄 Refreshing all pages...');
            setTimeout(() => {
                loadBookingsPage();
                loadGuestsPage();
                loadRoomsPage();
                loadDashboardData();
            }, 1000);
        } else {
            console.error('❌ SERVER ERROR:', data.error);
            showToast('❌ Server Error: ' + data.error, 'error');
        }
    })
    .catch(error => {
        console.error('🌐 NETWORK/FETCH ERROR:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        showToast('❌ Network Error: ' + error.message, 'error');
    })
    .finally(() => {
        console.log('=== 🚨 REAL FORM SUBMISSION DEBUG END ===');
        // Reset button state
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = originalText;
        confirmBtn.style.opacity = '1';
    });
}

// Add this function to quickly test the current form state
function debugFormState() {
    console.log('=== QUICK FORM STATE CHECK ===');
    const roomType = document.getElementById('walkinRoomType')?.value;
    const roomNumber = document.getElementById('walkinRoomNumber')?.value;
    const totalAmount = document.getElementById('walkinAmount')?.value;
    
    console.log('Room Type:', roomType);
    console.log('Room Number:', roomNumber);
    console.log('Total Amount:', totalAmount);
    console.log('Form ready for submission:', roomType && roomNumber && totalAmount && totalAmount > 0);
}

// Make it available globally
window.debugFormState = debugFormState;

function testDatabaseConnection() {
    console.log('=== Testing Database Connection ===');
    fetch('get_bookings.php')
        .then(res => res.json())
        .then(data => {
            console.log('Current bookings in system:', data);
            if (Array.isArray(data)) {
                console.log(`Total bookings: ${data.length}`);
                data.forEach((booking, index) => {
                    console.log(`Booking ${index + 1}:`, {
                        id: booking.id,
                        name: `${booking.firstName} ${booking.lastName}`,
                        status: booking.status,
                        room: `${booking.roomType} • Room ${booking.room_number}`,
                        dates: `${booking.checkin} to ${booking.checkout}`,
                        amount: booking.totalAmount
                    });
                });
            }
        })
        .catch(err => console.error('Database test failed:', err));
}

// Call this in browser console to check current state
window.testDatabaseConnection = testDatabaseConnection;

function debugCheckBookings() {
    console.log('=== DEBUG: Checking current bookings ===');
    fetch('get_bookings.php')
        .then(res => res.json())
        .then(data => {
            console.log('Current bookings in database:', data);
            console.log('Total bookings:', data.length);
            data.forEach((booking, index) => {
                console.log(`Booking ${index + 1}:`, booking.firstName, booking.lastName, '- Status:', booking.status);
            });
        })
        .catch(err => console.error('Debug error:', err));
}

function cancelBooking(id) {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    fetch('cancel_guest.php', {  // Use your existing cancel file
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'id=' + encodeURIComponent(id)
    })
    .then(res => res.json())
    .then(data => {
        if (data.ok) {
            showToast('✅ Booking cancelled successfully!');
            loadBookingsPage();
            loadRoomsPage();
            loadDashboardData();
        } else {
            showToast('⚠️ ' + (data.error || 'Failed to cancel booking'), 'error');
        }
    })
    .catch(err => {
        console.error('cancelBooking error:', err);
        showToast('❌ Network error: ' + err, 'error');
    });
}