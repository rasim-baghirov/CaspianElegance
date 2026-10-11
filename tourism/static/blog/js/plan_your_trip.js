document.addEventListener('DOMContentLoaded', function () {
    const scrollPos = sessionStorage.getItem('filterScroll');
    const tourContainer = document.querySelector('.container-fluid');

    if (scrollPos) {
        tourContainer.style.visibility = 'hidden';

        window.addEventListener('load', function () {
            window.scrollTo(0, parseInt(scrollPos));
            sessionStorage.removeItem('filterScroll');
            requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                    tourContainer.style.visibility = 'visible';
                });
            });
        });
    }

    const form = document.getElementById('filter-form');

    form.addEventListener('submit', function () {
        sessionStorage.setItem('filterScroll', window.scrollY);
    });

    document.querySelector('select[name="sort"]').addEventListener('change', function () {
        sessionStorage.setItem('filterScroll', window.scrollY);
        form.submit();
    });

    document.querySelector('.reset-filters').addEventListener('click', function () {
        sessionStorage.setItem('filterScroll', window.scrollY);
    });
});
