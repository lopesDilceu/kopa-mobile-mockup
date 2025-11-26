document.addEventListener('DOMContentLoaded', () => {
    const appContent = document.getElementById('app-content');

    const places = {
        1: { title: "Trattoria del Ponte", img: "images/place1.jpg", rate: "4.7", dist: "2.2 km" },
        2: { title: "The Electric Shaker", img: "images/place2.jpg", rate: "4.7", dist: "1.5 km" },
        3: { title: "Espresso Corner", img: "images/place3.jpg", rate: "4.9", dist: "0.8 km" },
        4: { title: "Taco Fiesita", img: "images/place4.jpg", rate: "4.7", dist: "3.1 km" },
        5: { title: "Izakaya Bento", img: "images/place5.jpg", rate: "5.0", dist: "4.2 km" },
        6: { title: "Sushi Master", img: "images/place6.jpg", rate: "4.8", dist: "1.1 km" },
        7: { title: "Ramen House", img: "images/place7.jpg", rate: "4.9", dist: "2.5 km" },
        8: { title: "Gyoza Bar", img: "images/place8.jpg", rate: "4.7", dist: "3.0 km" },
        9: { title: "Tempura Place", img: "images/place9.jpg", rate: "4.6", dist: "3.5 km" },
        10: { title: "Udon World", img: "images/place10.jpg", rate: "4.8", dist: "4.0 km" },
        11: { title: "Sake Corner", img: "images/place11.jpg", rate: "4.9", dist: "4.5 km" }
    };

    Promise.all([
        fetch('views/home.html').then(response => response.text()),
        fetch('views/details.html').then(response => response.text()),
        fetch('views/rating.html').then(response => response.text())
    ]).then(data => {
        appContent.insertAdjacentHTML('beforeend', data[0]); 
        appContent.insertAdjacentHTML('beforeend', data[1]); 
        appContent.insertAdjacentHTML('beforeend', data[2]);

        document.getElementById('detail-view').style.display = 'none';
        document.getElementById('rating-view').style.display = 'none';
        
        showView('home-view');
    });

    let currentPlaceId = null; 

    function showView(viewId, callback = () => {}) {
        const views = ['home-view', 'detail-view', 'rating-view'];
        views.forEach(id => {
            const viewElement = document.getElementById(id);
            if (viewElement) {
                if (id === viewId) {
                    viewElement.style.display = 'flex'; 
                    setTimeout(() => viewElement.classList.add('active'), 10);
                } else {
                    viewElement.classList.remove('active');
                    setTimeout(() => viewElement.style.display = 'none', 300); 
                }
            }
        });
        setTimeout(callback, 300); 
    }

 
    function openPlace(id) {
        currentPlaceId = id;
        const data = places[id];
        
   
        document.getElementById('detail-view').querySelector('#detail-title').innerText = data.title;
        document.getElementById('detail-view').querySelector('#detail-img').src = data.img;
        document.getElementById('detail-view').querySelector('#detail-rate').innerText = data.rate;
        document.getElementById('detail-view').querySelector('#detail-dist').innerText = data.dist;

        showView('detail-view');
    }

    function closePlace() {
        showView('home-view');
    }

    function openRating(id) {
        currentPlaceId = id;
        const data = places[id];
        
        document.getElementById('rating-view').querySelector('#rating-place-title').innerText = `Avaliar ${data.title}`;
        document.getElementById('rating-view').querySelector('#rating-place-img').src = data.img;
        
        showView('rating-view');
    }

    function closeRating() {
        showView('detail-view');
    }

    document.body.addEventListener('click', function(event) {
        const placeCard = event.target.closest('.place-card');
        if (placeCard) {
            const placeId = placeCard.dataset.id;
            openPlace(placeId);
            return;
        }

        const closeButton = event.target.closest('[data-action="close"]');
        if (closeButton) {
            closePlace();
            return;
        }

        const writeReviewButton = event.target.closest('.action-buttons .btn-large'); 
        if (writeReviewButton) {
            if (currentPlaceId) {
                openRating(currentPlaceId);
            }
            return;
        }

        const closeRatingButton = event.target.closest('[data-action="close-rating"]');
        if (closeRatingButton) {
            closeRating();
            return;
        }

        const favoriteButton = event.target.closest('.btn-secondary');
        if (favoriteButton && favoriteButton.innerText === 'Adicionar aos Favoritos') {
            console.log(`Place ${currentPlaceId} added to favorites!`);
            return;
        }

        const navItem = event.target.closest('.nav-item');
        if (navItem) {
            document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
            navItem.classList.add('active');
            
            const view = navItem.dataset.view;
            if (view === 'home') {
                showView('home-view');
            } else {
                console.log(`Navigating to ${view} view (not implemented yet)`);
            }
            return;
        }

        const star = event.target.closest('.rating-stars .material-icons-round');
        if (star) {
            const stars = Array.from(star.parentNode.children);
            const starIndex = stars.indexOf(star);
            stars.forEach((s, index) => {
                if (index <= starIndex) {
                    s.classList.add('active');
                    s.innerText = 'star';
                } else {
                    s.classList.remove('active');
                    s.innerText = 'star_border';
                }
            });
            return;
        }
    });
});