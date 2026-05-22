/**
 * Hype Tiers - Main JavaScript
 * Handles navigation, auth state, and shared functionality
 */

(function () {
    'use strict';

    // ===== Mobile Nav Toggle =====
    var navToggle = document.getElementById('navToggle');
    var navbar = document.querySelector('.navbar');

    if (navToggle) {
        navToggle.addEventListener('click', function () {
            navbar.classList.toggle('open');
        });

        document.addEventListener('click', function (e) {
            if (!navbar.contains(e.target)) {
                navbar.classList.remove('open');
            }
        });
    }

    // ===== Auth State Management =====
    function getUsers() {
        try {
            return JSON.parse(localStorage.getItem('hypetiers_users') || '[]');
        } catch (e) {
            return [];
        }
    }

    function getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem('hypetiers_current_user'));
        } catch (e) {
            return null;
        }
    }

    function setCurrentUser(user) {
        localStorage.setItem('hypetiers_current_user', JSON.stringify(user));
    }

    function clearCurrentUser() {
        localStorage.removeItem('hypetiers_current_user');
    }

    function updateNavAuth() {
        var navAuth = document.getElementById('navAuth');
        var navUser = document.getElementById('navUser');
        var userName = document.getElementById('userName');
        var user = getCurrentUser();

        if (user && navAuth && navUser && userName) {
            navAuth.style.display = 'none';
            navUser.style.display = 'flex';
            userName.textContent = user.username;
        } else if (navAuth && navUser) {
            navAuth.style.display = 'flex';
            navUser.style.display = 'none';
        }
    }

    // Logout handler
    var logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            clearCurrentUser();
            window.location.href = 'index.html';
        });
    }

    // Update nav on page load
    updateNavAuth();

    // ===== Update Player Count =====
    function updatePlayerCount() {
        var statEl = document.querySelector('#statPlayers .stat-number');
        if (statEl) {
            var users = getUsers();
            statEl.textContent = users.length;
            statEl.setAttribute('data-count', users.length);
        }
    }

    updatePlayerCount();

    // ===== Expose utilities globally =====
    window.HypeTiers = {
        getUsers: getUsers,
        getCurrentUser: getCurrentUser,
        setCurrentUser: setCurrentUser,
        clearCurrentUser: clearCurrentUser,
        updateNavAuth: updateNavAuth
    };
})();
