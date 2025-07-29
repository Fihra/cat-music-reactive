console.log('index');

const volumeSlider = document.getElementById("volume");
const panSlider = document.getElementById("panning");

function updateSliderBackground(slider) {
    const min = slider.min;
    const max = slider.max;
    const value = slider.value;
    const percent = ((value - min) / (max - min)) * 100;

    slider.style.background = `linear-gradient(to right, #2196f3, ${percent}%, #ddd ${percent}%)`;
}

volumeSlider.addEventListener("input", () => updateSliderBackground(volumeSlider));

panSlider.addEventListener("input", () => updateSliderBackground(panSlider));
