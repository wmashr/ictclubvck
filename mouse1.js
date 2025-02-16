// Create the custom cursor element
const cursor = document.createElement('div');
const tail = document.createElement('div');

// Styling the cursor
cursor.style.position = 'absolute';
cursor.style.width = '40px'; // Larger size for the outer circle
cursor.style.height = '40px';
cursor.style.border = '5px solid white'; // White border
cursor.style.backgroundColor = 'transparent'; // Transparent center
cursor.style.borderRadius = '50%';
cursor.style.pointerEvents = 'none';
cursor.style.transition = 'width 0.2s, height 0.2s, background-color 0.3s, transform 0.1s ease-in-out';
cursor.style.zIndex = '9999';
cursor.style.boxShadow = '0 0 25px 10px rgba(255, 255, 255, 0.8)'; // Glowing white effect
cursor.style.transformOrigin = 'center';
document.body.appendChild(cursor);

// Styling the tail
tail.style.position = 'absolute';
tail.style.width = '10px';  // Smaller size for the tail
tail.style.height = '10px';
tail.style.backgroundColor = 'white'; // White color for the tail
tail.style.borderRadius = '50%';
tail.style.pointerEvents = 'none';
tail.style.zIndex = '9998';
tail.style.opacity = '0.7';
tail.style.transition = 'opacity 0.4s ease-out, transform 0.5s ease-out, box-shadow 0.4s ease-out';
document.body.appendChild(tail);

// Track mouse position and update cursor and tail position
let tailDelay = 0;
if (window.matchMedia("(pointer: fine)").matches) { // Only enable on devices with a pointer (like desktops)
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = `${e.pageX - cursor.offsetWidth / 2}px`;
    cursor.style.top = `${e.pageY - cursor.offsetHeight / 2}px`;

    // Update the tail's position and make it follow the cursor smoothly
    tail.style.left = `${e.pageX - 5}px`; // Slight offset for smooth trailing
    tail.style.top = `${e.pageY - 5}px`;  // Slight offset for smooth trailing
    
    // Add a trailing effect for the tail with a glowing "fantasy" stretch
    setTimeout(() => {
      tail.style.opacity = '0.3';  // Tail fades as it moves away
      tail.style.transform = `scale(1.7) translate(-50%, -50%)`; // Tail grows and stretches
      tail.style.boxShadow = '0 0 30px 15px rgba(255, 255, 255, 0.9)'; // Glowing effect for the tail
    }, tailDelay);

    // Reset tail opacity, transform, and box shadow after a delay to create a fantasy flicker effect
    setTimeout(() => {
      tail.style.opacity = '0.7';  // Tail becomes more visible
      tail.style.transform = `scale(1) translate(-50%, -50%)`; // Reset scale
      tail.style.boxShadow = '0 0 25px 10px rgba(255, 255, 255, 0.8)'; // Reset glow effect
    }, tailDelay + 200);

    // Gradually increase the delay to make the tail longer and more fluid
    tailDelay = Math.min(tailDelay + 5, 150); // Gradually increase delay to create longer tail effect
  });
}

// Left click effect
document.addEventListener('mousedown', (e) => {
  if (e.button === 0) { // Left click
    cursor.style.transform = 'scale(1.6)';
    cursor.style.border = '5px solid white'; // White border on click
    cursor.style.boxShadow = '0 0 50px 30px rgba(255, 255, 255, 5)';
  }
});

// Right click effect
document.addEventListener('mousedown', (e) => {
  if (e.button === 2) { // Right click
    cursor.style.transform = 'scale(1.6)';
    cursor.style.border = '5px solid white'; // White border on right click
    cursor.style.boxShadow = '0 0 50px 30px rgba(255, 255, 255, 5)';
  }
});

// Reset cursor after click
document.addEventListener('mouseup', () => {
  cursor.style.transform = 'scale(1)';
  cursor.style.boxShadow = '0 0 25px 10px rgba(255, 255, 255, 0.5)'; // Reset box-shadow
  cursor.style.border = '5px solid white'; // Reset to white border
});

// Scroll effect
document.addEventListener('wheel', () => {
  cursor.style.transform = 'scale(1.2)';
  cursor.style.border = '5px solid white'; // White border on scroll
  cursor.style.boxShadow = '0 0 30px 15px rgba(255, 255, 255, 0.5)'; // Glowing effect on scroll

  setTimeout(() => {
    cursor.style.transform = 'scale(1)'; // Reset scale
    cursor.style.boxShadow = '0 0 25px 10px rgba(255, 255, 255, 0.5)'; // Reset box-shadow
  }, 300); // Reset after a small delay
});

// Add hover effect (expand cursor on hover)
document.querySelectorAll('body *').forEach(element => {
  element.addEventListener('mouseenter', () => {
    cursor.style.width = '12px';
    cursor.style.height = '12px';
    cursor.style.backgroundColor = 'transparent'; // Keep transparent background
    cursor.style.border = '5px solid white'; // White border
    cursor.style.boxShadow = '0 0 40px 20px rgba(255, 255, 255, 0.5)';
    cursor.style.transform = 'scale(1.4)'; // Slight scale-up effect for interaction
  });
  element.addEventListener('mouseleave', () => {
    cursor.style.width = '40px'; // Reset to larger size
    cursor.style.height = '40px'; // Reset to larger size
    cursor.style.backgroundColor = 'transparent'; // Reset to transparent background
    cursor.style.border = '5px solid white'; // White border
    cursor.style.boxShadow = '0 0 25px 10px rgba(255, 255, 255, 0.5)';
    cursor.style.transform = 'scale(1)';  // Reset scale
  });
});

// Disable cursor for mobile (touch) devices
if (window.matchMedia("(pointer: coarse)").matches) {
  cursor.style.display = 'none';  // Hide the custom cursor for mobile
  tail.style.display = 'none';  // Hide the tail as well for mobile
}
