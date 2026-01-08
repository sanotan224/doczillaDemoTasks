const API_URL = 'http://localhost:3000/api';

let currentUser = null;
let authToken = null;

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const userInfo = document.getElementById('user-info');
const uploadSection = document.getElementById('upload-section');
const statsSection = document.getElementById('stats-section');

function showLogin() {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
}

function showRegister() {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
}

function showUserInfo() {
    loginForm.classList.add('hidden');
    registerForm.classList.add('hidden');
    statsSection.classList.add('hidden');

    userInfo.classList.remove('hidden');
    uploadSection.classList.remove('hidden');
}

function showUpload() {
    uploadSection.classList.remove('hidden');
    statsSection.classList.add('hidden');
}

function showStats() {
    uploadSection.classList.add('hidden');
    statsSection.classList.remove('hidden');
    loadStats();
}

async function register() {
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('user', JSON.stringify(currentUser));
            document.getElementById('user-username').textContent = currentUser.username;
            showUserInfo();
        } else {
            alert(data.error || 'Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('Connection error');
    }
}

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('user', JSON.stringify(currentUser));
            document.getElementById('user-username').textContent = currentUser.username;
            showUserInfo();
        } else {
            alert(data.error || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Connection error');
    }
}

function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    loginForm.classList.remove('hidden');
    userInfo.classList.add('hidden');
    uploadSection.classList.add('hidden');
    statsSection.classList.add('hidden');
}

function checkAuth() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');

    if (token && user) {
        authToken = token;
        currentUser = JSON.parse(user);
        document.getElementById('user-username').textContent = currentUser.username;
        showUserInfo();
    } else {
        showLogin();
    }
}

checkAuth();