/**
 * Hype Tiers - Authentication
 * Handles sign in and sign up with localStorage
 */

(function () {
    'use strict';

    // ===== Password Toggle =====
    var toggleBtns = document.querySelectorAll('.toggle-password');
    toggleBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var input = this.previousElementSibling;
            if (input.type === 'password') {
                input.type = 'text';
                this.textContent = '\uD83D\uDE48';
            } else {
                input.type = 'password';
                this.textContent = '\uD83D\uDC41';
            }
        });
    });

    // ===== Helpers =====
    function showError(msg) {
        var errEl = document.getElementById('formError');
        if (errEl) {
            errEl.textContent = msg;
        }
    }

    function clearError() {
        showError('');
    }

    function setLoading(isLoading) {
        var submitBtn = document.getElementById('submitBtn');
        if (!submitBtn) return;
        var btnText = submitBtn.querySelector('.btn-text');
        var btnLoader = submitBtn.querySelector('.btn-loader');

        if (isLoading) {
            submitBtn.disabled = true;
            if (btnText) btnText.style.display = 'none';
            if (btnLoader) btnLoader.style.display = 'inline-block';
        } else {
            submitBtn.disabled = false;
            if (btnText) btnText.style.display = 'inline';
            if (btnLoader) btnLoader.style.display = 'none';
        }
    }

    function getUsers() {
        try {
            return JSON.parse(localStorage.getItem('hypetiers_users') || '[]');
        } catch (e) {
            return [];
        }
    }

    function saveUsers(users) {
        localStorage.setItem('hypetiers_users', JSON.stringify(users));
    }

    // ===== Sign Up =====
    var signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            e.preventDefault();
            clearError();

            var username = document.getElementById('username').value.trim();
            var email = document.getElementById('email').value.trim();
            var password = document.getElementById('password').value;
            var confirmPassword = document.getElementById('confirmPassword').value;
            var gamemode = document.getElementById('gamemode').value;

            // Validation
            if (!username || !email || !password || !confirmPassword || !gamemode) {
                showError('Please fill in all fields');
                return;
            }

            if (username.length < 3) {
                showError('Username must be at least 3 characters');
                return;
            }

            if (password.length < 6) {
                showError('Password must be at least 6 characters');
                return;
            }

            if (password !== confirmPassword) {
                showError('Passwords do not match');
                return;
            }

            var users = getUsers();

            // Check duplicates
            var emailExists = users.some(function (u) { return u.email === email; });
            if (emailExists) {
                showError('An account with this email already exists');
                return;
            }

            var usernameExists = users.some(function (u) { return u.username.toLowerCase() === username.toLowerCase(); });
            if (usernameExists) {
                showError('This username is already taken');
                return;
            }

            // Show loading briefly for UX
            setLoading(true);

            setTimeout(function () {
                var newUser = {
                    id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
                    username: username,
                    email: email,
                    password: password,
                    gamemode: gamemode,
                    score: 0,
                    wins: 0,
                    matches: 0,
                    tier: 'bronze',
                    joinedAt: new Date().toISOString()
                };

                users.push(newUser);
                saveUsers(users);

                // Log in the user
                var userSession = {
                    id: newUser.id,
                    username: newUser.username,
                    email: newUser.email,
                    gamemode: newUser.gamemode
                };
                window.HypeTiers.setCurrentUser(userSession);

                // Redirect to home
                window.location.href = 'index.html';
            }, 600);
        });
    }

    // ===== Sign In =====
    var signinForm = document.getElementById('signinForm');
    if (signinForm) {
        signinForm.addEventListener('submit', function (e) {
            e.preventDefault();
            clearError();

            var email = document.getElementById('email').value.trim();
            var password = document.getElementById('password').value;

            if (!email || !password) {
                showError('Please fill in all fields');
                return;
            }

            setLoading(true);

            setTimeout(function () {
                var users = getUsers();
                var user = users.find(function (u) {
                    return u.email === email && u.password === password;
                });

                if (!user) {
                    setLoading(false);
                    showError('Invalid email or password');
                    return;
                }

                // Log in
                var userSession = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    gamemode: user.gamemode
                };
                window.HypeTiers.setCurrentUser(userSession);

                // Redirect to home
                window.location.href = 'index.html';
            }, 600);
        });
    }

    // ===== Redirect if already logged in =====
    var currentUser = window.HypeTiers.getCurrentUser();
    if (currentUser && (signupForm || signinForm)) {
        window.location.href = 'index.html';
    }
})();
