const togglePopup = () => {
    const popupEl = document.getElementById("popup");
    const overlayEl = document.getElementById("overlay");
    
    popupEl.classList.toggle("active");
    overlayEl.classList.toggle("active");
};

document.getElementById("overlay").addEventListener("click", togglePopup);