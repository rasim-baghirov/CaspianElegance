// ─── CSRF ─────────────────────────────────────────────────────
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.substring(0, name.length + 1) === name + '=') {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// ─── MAIN PAGE ───────────────────────────────────────────────
function toggleFav(clickedIcon) {
    if (!clickedIcon.dataset.url) {
        showPopup();
        return;
    }

    const targetUrl = clickedIcon.dataset.url;
    const isFilled = clickedIcon.classList.contains('bi-heart-fill');

    document.querySelectorAll(`[data-url="${targetUrl}"]`).forEach(icon => {
        if (isFilled) {
            icon.classList.replace('bi-heart-fill', 'bi-heart');
            icon.style.color = 'white';
        } else {
            icon.classList.replace('bi-heart', 'bi-heart-fill');
            icon.style.color = '#ed311c';
        }
    });

    const formData = new FormData();
    formData.append('on_fav_page', 'false');

    fetch(targetUrl, {
        method: 'POST',
        headers: { 'X-CSRFToken': getCookie('csrftoken') },
        body: formData
    })
    .then(res => {
        if (!res.ok) throw new Error('Server error');
        return res.json();
    })
    .then(data => {
        document.querySelectorAll(`[data-url="${targetUrl}"]`).forEach(icon => {
            if (data.status === 'added') {
                icon.classList.replace('bi-heart', 'bi-heart-fill');
                icon.style.color = '#ed311c';
            } else {
                icon.classList.replace('bi-heart-fill', 'bi-heart');
                icon.style.color = 'white';
            }
        });
    })
    .catch(() => {
        document.querySelectorAll(`[data-url="${targetUrl}"]`).forEach(icon => {
            if (isFilled) {
                icon.classList.replace('bi-heart', 'bi-heart-fill');
                icon.style.color = '#ed311c';
            } else {
                icon.classList.replace('bi-heart-fill', 'bi-heart');
                icon.style.color = 'white';
            }
        });
    });
}

// ─── FAVORITES PAGE ─────────────────────────────────────────
function toggleFavOnFavPage(heartIcon) {
    const card = heartIcon.closest('.fav-item');
    const url = heartIcon.dataset.url;
    const isFilled = heartIcon.classList.contains('bi-heart-fill');

    heartIcon.style.pointerEvents = 'none';

    if (isFilled) {
        card.style.opacity = '0.8';
        card.style.transition = 'opacity 0.3s';
        heartIcon.classList.replace('bi-heart-fill', 'bi-heart');
        heartIcon.style.color = '#aaa';
    } else {
        card.style.opacity = '1';
        heartIcon.classList.replace('bi-heart', 'bi-heart-fill');
        heartIcon.style.color = '#e74c3c';
    }

    const formData = new FormData();
    formData.append('on_fav_page', 'true');

    fetch(url, {
        method: 'POST',
        headers: { 'X-CSRFToken': getCookie('csrftoken') },
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'removed') {
            card.style.opacity = '0.8';
            heartIcon.classList.replace('bi-heart-fill', 'bi-heart');
            heartIcon.style.color = '#aaa';
        } else if (data.status === 'added') {
            card.style.opacity = '1';
            heartIcon.classList.replace('bi-heart', 'bi-heart-fill');
            heartIcon.style.color = '#e74c3c';
        }
    })
    .catch(() => {
        if (isFilled) {
            card.style.opacity = '1';
            heartIcon.classList.replace('bi-heart', 'bi-heart-fill');
            heartIcon.style.color = '#e74c3c';
        } else {
            card.style.opacity = '0.8';
            heartIcon.classList.replace('bi-heart-fill', 'bi-heart');
            heartIcon.style.color = '#aaa';
        }
    })
    .finally(() => {
        heartIcon.style.pointerEvents = 'auto';
    });
}

// ─── POPUP FOR UNAUTHENTICATED USERS ─────────────────────────────────────
function showPopup() {
    document.getElementById('fav-popup').style.display = 'block';
    document.getElementById('fav-overlay').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closePopup() {
    document.getElementById('fav-popup').style.display = 'none';
    document.getElementById('fav-overlay').style.display = 'none';
    document.body.style.overflow = '';
}

window.addEventListener('beforeunload', function () {
    navigator.sendBeacon('/favourites/clear-positions/');
});