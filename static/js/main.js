document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const talkCards = document.querySelectorAll('.talk-card');

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();

        talkCards.forEach(card => {
            const title = card.getAttribute('data-title');
            const category = card.getAttribute('data-category');
            const speakers = card.getAttribute('data-speakers');

            if (title.includes(searchTerm) || 
                category.includes(searchTerm) || 
                speakers.includes(searchTerm)) {
                card.style.display = 'flex';
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            } else {
                card.style.display = 'none';
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
            }
        });
    });

    // Add some entry animations
    talkCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `all 0.4s ease ${index * 0.1}s`;
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100);
    });
});
