/* ==========================================================================
   EXPLANATORY COMMENTS FOR SETUP:
   This file manages page rendering, user states, and side drawer controls.
   ========================================================================== */

// Store active global state in a simple object
const state = {
  isLoggedIn: false,
  user: {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    isPremium: false
  }
};

/* ==================== 1. PAGE NAVIGATION LOGIC ==================== */
/**
 * Switches the displayed page view without reloading the web page.
 * @param {string} pageId - Name of page section to display ('home', 'courses', etc.)
 */
function switchPage(pageId) {
  // Hide all section elements on the page
  const sections = document.querySelectorAll('.page-section');
  sections.forEach(section => section.classList.remove('active'));

  // Highlight active navigation tab link
  const navLinks = document.querySelectorAll('.nav-item');
  navLinks.forEach(link => link.classList.remove('active'));

  // Show selected section
  const targetSection = document.getElementById(`page-${pageId}`);
  if (targetSection) {
    targetSection.classList.add('active');
  }

  // Set active style on top navbar link corresponding to clicked tab
  event.target.classList.add('active');
}


/* ==================== 2. PROFILE SIDE DRAWER TOGGLE ==================== */
/**
 * Opens or closes the right slide-out profile panel when clicking avatar icon.
 */
function toggleProfileDrawer() {
  const drawer = document.getElementById('profile-drawer');
  const overlay = document.getElementById('drawer-overlay');

  const isOpen = drawer.classList.contains('open');

  if (isOpen) {
    drawer.classList.remove('open');
    overlay.classList.remove('active');
  } else {
    drawer.classList.add('open');
    overlay.classList.add('active');
  }
}


/* ==================== 3. MODAL POPUP DIALOGS ==================== */
/**
 * Opens modal dialog window (Login / Signup)
 */
function openModal(modalId) {
  document.getElementById(modalId).classList.add('active');
  document.getElementById('modal-overlay').classList.add('active');
}

/**
 * Closes modal window
 */
function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
  document.getElementById('modal-overlay').classList.remove('active');
}

/**
 * Hides all active modals and background overlays
 */
function closeAllModals() {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => modal.classList.remove('active'));
  document.getElementById('modal-overlay').classList.remove('active');
  
  // Also close drawer if active
  const drawer = document.getElementById('profile-drawer');
  if (drawer.classList.contains('open')) {
    toggleProfileDrawer();
  }
}


/* ==================== 4. DEMO AUTHENTICATION WORKFLOW ==================== */
/**
 * Handles mock login form submission
 */
function handleLogin(event) {
  event.preventDefault(); // Stop standard page reload submit behavior
  
  const emailInput = document.getElementById('login-email').value;
  state.isLoggedIn = true;
  state.user.email = emailInput;

  updateUIForAuthState();
  closeModal('login-modal');
  alert(`Welcome back, ${state.user.name}!`);
}

/**
 * Handles mock registration form submission
 */
/* ==================== 4. REAL BACKEND AUTHENTICATION WORKFLOW ==================== */
/**
 * Handles real login form submission against Node.js backend
 */
async function handleLogin(event) {
  event.preventDefault(); // Stop standard page reload submit behavior
  
  const email = document.getElementById('login-email').value;
  // Note: make sure you have an input with id 'login-password' in your login modal
  const password = document.getElementById('login-password').value;

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.success) {
      state.isLoggedIn = true;
      state.user.name = data.user.name;
      state.user.email = data.user.email;

      updateUIForAuthState();
      closeModal('login-modal');
      alert(`Welcome back, ${data.user.name}!`);
    } else {
      alert(data.message); // Shows "Invalid email or password!"
    }
  } catch (err) {
    console.error('Login error:', err);
    alert('Failed to connect to the server.');
  }
}

/**
 * Handles real registration form submission against Node.js backend
 */
async function handleSignup(event) {
  event.preventDefault();
  
  const name = document.getElementById('signup-name').value;
  const email = document.getElementById('signup-email').value;
  // Note: make sure you have an input with id 'signup-password' in your signup modal
  const password = document.getElementById('signup-password').value;

  try {
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();

    if (data.success) {
      state.isLoggedIn = true;
      state.user.name = data.user.name;
      state.user.email = data.user.email;

      updateUIForAuthState();
      closeModal('signup-modal');
      alert(`Account created successfully! Welcome ${data.user.name}.`);
    } else {
      alert(data.message); // Shows e.g., "Email is already registered!"
    }
  } catch (err) {
    console.error('Signup error:', err);
    alert('Failed to connect to the server.');
  }
}

/**
 * Logs out user state and returns UI elements to anonymous state
 */
function handleLogout() {
  state.isLoggedIn = false;
  updateUIForAuthState();
  toggleProfileDrawer();
  alert("Logged out successfully.");
}

/**
 * Synchronizes UI components when login/logout events trigger
 */
function updateUIForAuthState() {
  const authButtons = document.getElementById('auth-buttons');
  const profileTrigger = document.getElementById('user-profile-trigger');
  
  // Profile elements in drawer
  const profileName = document.getElementById('profile-name');
  const profileEmail = document.getElementById('profile-email');

  if (state.isLoggedIn) {
    authButtons.classList.add('hidden');
    profileTrigger.classList.remove('hidden');
    
    // Set profile info
    profileName.innerText = state.user.name;
    profileEmail.innerText = state.user.email;
  } else {
    authButtons.classList.remove('hidden');
    profileTrigger.classList.add('hidden');
  }
}

/* ==================== 5. DEMO INTERACTION FEATURE HANDLERS ==================== */
/**
 * Filters visible items on the Courses page section
 */
function filterCourses(category) {
  // Update active state on buttons
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  // Filter course cards by attribute dataset
  const cards = document.querySelectorAll('.course-card');
  cards.forEach(card => {
    if (category === 'all' || card.dataset.category === category) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

function enrollDemo(courseName) {
  if (!state.isLoggedIn) {
    openModal('login-modal');
    return;
  }
  alert(`Enrolled in "${courseName}"! Check your profile dashboard.`);
}

function applyDemo(jobTitle) {
  if (!state.isLoggedIn) {
    openModal('login-modal');
    return;
  }
  alert(`Application submitted for: ${jobTitle}`);
}

function checkoutDemo(planName) {
  if (!state.isLoggedIn) {
    openModal('login-modal');
    return;
  }
  
  // Simulating upgrade
  state.user.isPremium = true;
  const badge = document.getElementById('profile-badge');
  badge.innerText = "Pro Plan";
  badge.className = "badge badge-pro-user";

  alert(`Congratulations! You are now subscribed to the ${planName}.`);
}
