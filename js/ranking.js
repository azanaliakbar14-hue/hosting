/**
 * Hype Tiers - Ranking Page
 * Displays leaderboard from localStorage (real players only)
 */

(function () {
    'use strict';

    var gamemodeIcons = {
        roleplay: '<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="14" height="14"><circle cx="32" cy="20" r="10" stroke="currentColor" stroke-width="3"/><path d="M12 52c0-11 9-20 20-20s20 9 20 20" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
        racing: '<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="14" height="14"><rect x="10" y="28" width="44" height="16" rx="4" stroke="currentColor" stroke-width="3"/><circle cx="20" cy="48" r="5" stroke="currentColor" stroke-width="3"/><circle cx="44" cy="48" r="5" stroke="currentColor" stroke-width="3"/><path d="M18 28l4-12h20l4 12" stroke="currentColor" stroke-width="3"/></svg>',
        drift: '<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="14" height="14"><path d="M12 44c8-16 16-8 24-24s16-8 16 4" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><circle cx="46" cy="24" r="4" stroke="currentColor" stroke-width="3"/></svg>',
        deathmatch: '<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="14" height="14"><path d="M32 8v48M8 32h48" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><circle cx="32" cy="32" r="8" stroke="currentColor" stroke-width="3"/></svg>',
        survival: '<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="14" height="14"><path d="M32 10l4 12h12l-10 7 4 12-10-7-10 7 4-12-10-7h12z" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/></svg>',
        heist: '<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="14" height="14"><rect x="14" y="24" width="36" height="28" rx="3" stroke="currentColor" stroke-width="3"/><path d="M24 24V18a8 8 0 1116 0v6" stroke="currentColor" stroke-width="3"/><circle cx="32" cy="38" r="5" stroke="currentColor" stroke-width="3"/></svg>'
    };

    var tierOrder = ['champion', 'diamond', 'platinum', 'gold', 'silver', 'bronze'];

    function getUsers() {
        try {
            return JSON.parse(localStorage.getItem('hypetiers_users') || '[]');
        } catch (e) {
            return [];
        }
    }

    function getRankBadgeClass(rank) {
        if (rank === 1) return 'rank-1';
        if (rank === 2) return 'rank-2';
        if (rank === 3) return 'rank-3';
        return 'rank-default';
    }

    function renderTable(filter) {
        var tbody = document.getElementById('rankingBody');
        var emptyState = document.getElementById('emptyState');
        var table = document.querySelector('.ranking-table');

        if (!tbody) return;

        var users = getUsers();

        // Filter by gamemode
        if (filter && filter !== 'all') {
            users = users.filter(function (u) { return u.gamemode === filter; });
        }

        // Sort by score descending, then by wins
        users.sort(function (a, b) {
            if (b.score !== a.score) return b.score - a.score;
            return b.wins - a.wins;
        });

        tbody.innerHTML = '';

        if (users.length === 0) {
            if (table) table.style.display = 'none';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        if (table) table.style.display = 'table';
        if (emptyState) emptyState.style.display = 'none';

        users.forEach(function (user, index) {
            var rank = index + 1;
            var initials = user.username.substring(0, 2).toUpperCase();
            var icon = gamemodeIcons[user.gamemode] || '';

            var tr = document.createElement('tr');
            tr.innerHTML =
                '<td><span class="rank-badge ' + getRankBadgeClass(rank) + '">' + rank + '</span></td>' +
                '<td><div class="player-info"><div class="player-avatar">' + initials + '</div><span>' + escapeHtml(user.username) + '</span></div></td>' +
                '<td><span class="gamemode-badge">' + icon + ' ' + escapeHtml(user.gamemode) + '</span></td>' +
                '<td><span class="tier-badge tier-' + user.tier + '">' + user.tier + '</span></td>' +
                '<td>' + (user.score || 0) + '</td>' +
                '<td>' + (user.wins || 0) + '</td>' +
                '<td>' + (user.matches || 0) + '</td>';
            tbody.appendChild(tr);
        });
    }

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // ===== Filter Tabs =====
    var filterTabs = document.querySelectorAll('.filter-tab');
    var activeFilter = 'all';

    filterTabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            filterTabs.forEach(function (t) { t.classList.remove('active'); });
            this.classList.add('active');
            activeFilter = this.getAttribute('data-mode');
            renderTable(activeFilter);
        });
    });

    // Initial render
    renderTable('all');
})();
