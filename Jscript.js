document.addEventListener('DOMContentLoaded', () => {
    setupAudioProcessing();

    // Set up the sphere rotation based on audio data
    setInterval(() => {
        const rotationSpeed = getRotationSpeed();
        rotateSphere(rotationSpeed);
    }, 100);
});

function rotateSphere(speed) {
    const sphere = generateRotatingSphere();
    document.getElementById('rotating-sphere').textContent = sphere;
    // Your rotation logic here
    // Use the 'speed' parameter to influence the rotation
    console.log('Rotation Speed:', speed);
}

function generateRotatingSphere() {
    const chars = [' ', '.', ':', 'o', '8', 'M', '@', '#', '%', 'W', '*', 'w', 'B', 'E', '$', 'a', 'k', 'h', 'p', 'd', 'q', 'X', '0', 'Q', 'L', 'C', 'J', 'Y', 'z', 'x', 'n', 'm', 'u', 'v', 'r', 'j', 'f', 't', '/', '\\', '|', '(', ')', '1', '{', '}', '[', ']', '?', '-', '_', '+', '~', '<', '>', 'i', '!', 'l', 'I', ';', ':', ',', '"', '^', '`', "'", '.'];

    const width = 80; // Adjust the width of the sphere
    const height = 25; // Adjust the height of the sphere

    const t = Date.now() / 1000; // Adjust the speed of rotation

    let sphere = '';

    for (let y = -height / 2; y < height / 2; y++) {
        for (let x = -width / 2; x < width / 2; x++) {
            const u = x / (width / 2);
            const v = y / (height / 2);

            const theta = u * 2 * Math.PI;
            const phi = v * Math.PI;

            const a = Math.sin(theta) * Math.sin(phi);
            const b = Math.cos(phi);
            const c = Math.cos(theta) * Math.sin(phi);

            const x0 = Math.sin(t);
            const y0 = Math.cos(t);

            const S = a * x0 + b * y0 + 0.5 * c;

            const index = Math.floor(S * (chars.length - 1));
            sphere += chars[Math.abs(index)];
        }

        sphere += '\n';
    }

    return sphere;
}

function setupAudioProcessing() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function (stream) {
            // Handle microphone stream
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const microphone = audioContext.createMediaStreamSource(stream);

            microphone.connect(analyser);
            analyser.connect(audioContext.destination);

            // Set up the sphere rotation based on audio data
            rotateSphereBasedOnAudio(analyser);
        })
        .catch(function (err) {
            console.error('Error accessing microphone:', err);
        });
}

function rotateSphereBasedOnAudio(analyser) {
    setInterval(() => {
        const frequencyData = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(frequencyData);

        const averageVolume = getAverageVolume(frequencyData);
        const rotationSpeed = mapRange(averageVolume, 0, 255, 0, 0.1);

        rotateSphere(rotationSpeed);
    }, 100);
}

function getAverageVolume(array) {
    let sum = 0;
    array.forEach(value => sum += value);
    return sum / array.length;
}

function mapRange(value, inMin, inMax, outMin, outMax) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}
