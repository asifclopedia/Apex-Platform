/* ==========================================================================
   APEX BACKEND SERVER (server.js)
   This server hosts your static files and handles backend API requests.
   ========================================================================== */

const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware to parse incoming JSON data from your frontend forms
app.use(express.json());

// Serve your frontend files (index.html, design.css, core.js) from this folder
app.use(express.static(path.join(__dirname)));

// ==================== MOCK API ENDPOINTS (To be linked to database next) ====================

// Login API Route
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    console.log(`Login attempt received for: ${email}`);
    
    // Send back a success response to the frontend
    res.json({ 
        success: true, 
        message: "Login successful!", 
        user: { name: "Alex Johnson", email: email } 
    });
});

// Signup API Route
app.post('/api/signup', (req, res) => {
    const { name, email, password } = req.body;
    console.log(`New user registration for: ${name} (${email})`);
    
    res.json({ 
        success: true, 
        message: "Account registered successfully!", 
        user: { name: name, email: email } 
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Apex Server is running live at http://localhost:${PORT}`);
});
