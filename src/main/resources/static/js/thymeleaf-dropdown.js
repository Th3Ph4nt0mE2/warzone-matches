document.addEventListener('DOMContentLoaded', () => {
    const dropdownMenu = document.getElementById('main-dropdown-menu');
    const menuToggle = document.getElementById('menu-toggle');

    if (menuToggle) {
        menuToggle.addEventListener('click', (event) => {
            event.stopPropagation();
            dropdownMenu.classList.toggle('show');
        });
    }

    window.addEventListener('click', () => {
        if (dropdownMenu && dropdownMenu.classList.contains('show')) {
            dropdownMenu.classList.remove('show');
        }
    });
});
