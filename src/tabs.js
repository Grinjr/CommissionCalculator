const mainPanel = document.getElementById("main-panel");
const emotePanel = document.getElementById("emote-panel");
const beginPanel = document.getElementById("beginning-panel");
const price = document.getElementById("price");
const illustrationExample = document.getElementById("illustration-example");
const emoteExample = document.getElementById("emote-example");
const baseTab = document.getElementById("base-tab");
const emoteTab = document.querySelector(".tabs .tab:nth-child(2)"); // Target the Emote tab


// Toggle the dropdown menu visibility
function toggleDropdown() {
    document.querySelector(".dropdown").classList.toggle("active");
}

function populateTabs() {
    baseTab.innerHTML = `Illustration ($${Math.min(...Object.values(baseIllustrationPrices))}-$${Math.max(...Object.values(baseIllustrationPrices))} + extras) <span class="dropdown-icon">▼</span>`; // Reset label to "Base" with arrow
    emoteTab.innerHTML = `Emote ($${baseEmotePrice} + extras)`;

    const dropdownMenu = document.getElementById("dropdown-menu");
    dropdownMenu.innerHTML = ""; // Clear any existing items

    // RELIES ON CALC.JS LOADING FIRST!!!
    for (const [option, price] of Object.entries(baseIllustrationPrices)) {
        // Create a new div element for each item
        const item = document.createElement("div");
        item.className = "dropdown-item";
        item.onclick = () => selectBaseIllustrationOption(option); // Set the click event
        item.innerHTML = `${option} ($${price})`; // Set the item label

        dropdownMenu.appendChild(item); // Add the item to the dropdown menu
    }
}

// Update the "Base" tab label with the selected option and close the dropdown
function selectBaseIllustrationOption(option) {
    const baseTab = document.getElementById("base-tab");
    // Set selected option with arrow icon
    baseTab.innerHTML = `${option} ($${baseIllustrationPrices[option]} + extras) <span class="dropdown-icon">▼</span>`;
    document.querySelector(".dropdown").classList.remove("active");
    SetBaseIllustrationPrice(option);
    showPanel("illustration"); // Show the main panel when selecting an option
}

function selectEmoteTab() {
    SetBasePrice(baseEmotePrice);
    showPanel("emote");
}

function showPanel(panel) {
    if (panel === "emote") {
        // Show only the Emote panel
        beginPanel.classList.remove("active");
        price.classList.remove("hidden");
        mainPanel.classList.remove("active");
        emotePanel.classList.add("active");
        emoteExample.classList.remove("hidden");
        illustrationExample.classList.add("hidden");
        //baseTab.innerHTML = `Illustration ($${Math.min(...Object.values(baseIllustrationPrices))}-$${Math.max(...Object.values(baseIllustrationPrices))} + extras) <span class="dropdown-icon">▼</span>`; // Reset label to "Base" with arrow

        // Update active tab styling
        baseTab.classList.remove("active");
        emoteTab.classList.add("active");
    } else if (panel === "illustration") {
        // Show only the Main panel
        beginPanel.classList.remove("active");
        price.classList.remove("hidden");
        mainPanel.classList.add("active");
        emotePanel.classList.remove("active");
        emoteExample.classList.add("hidden");
        illustrationExample.classList.remove("hidden");

        // Update active tab styling
        baseTab.classList.add("active");
        emoteTab.classList.remove("active");
    }
    selectedPanel = panel;
    calculatePrice();
}

// Helper function to format camelCase to a human-readable string
function formatCamelCase(str) {
    return str
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')  // Adds a space between camelCase parts
        .replace(/^./, str[0].toUpperCase());    // Capitalizes the first letter
}

// Function to update labels dynamically
function updateLabels() {
    for (const [key, option] of Object.entries(pricingData)) {
        if (option.labelElement) {
            // Format the key (e.g., 'cellShading' -> 'Cell Shading')
            let labelText = formatCamelCase(key) + ' ';

            // Check if the option has children for a range label
            if (option.children) {
                const childValues = option.children.map(childKey => pricingData[childKey]);
                const percentageChildren = childValues.filter(child => child.type === 'percentage');
                const fixedChildren = childValues.filter(child => child.type === 'fixed');

                labelText += `(`;

                // Handle percentage-based children for a range
                if (percentageChildren.length > 0) {
                    const minPercentage = Math.min(...percentageChildren.map(child => child.value)) * 100;
                    const maxPercentage = Math.max(...percentageChildren.map(child => child.value)) * 100;
                    labelText += `+${minPercentage}-${maxPercentage}%`;

                    if (fixedChildren.length > 0) labelText += `, `;
                    else labelText += `)`;
                }

                // Handle fixed-price children for a range
                if (fixedChildren.length > 0) {
                    const minFixed = Math.min(...fixedChildren.map(child => child.value));
                    const maxFixed = Math.max(...fixedChildren.map(child => child.value));
                    labelText += `+$${minFixed}-${maxFixed})`;
                }

                option.labelElement.textContent = labelText;
            } else {
                // Handle individual option labels
                if (option.value === 0) {
                    // Show only appliedAfter text, capitalized
                    labelText += `(${option.appliedAfter.charAt(0).toUpperCase() + option.appliedAfter.slice(1)})`;
                } else {
                    // Standard label for non-zero values
                    if (option.type === 'percentage') {
                        if (option.appliedAfter === 'extras') {
                            // Format as "% after extras" if applied after extras
                            labelText += `(+${option.value * 100}% after extras)`;
                        } else {
                            // Normal percentage label
                            labelText += `(+${option.value * 100}% of ${option.appliedAfter.charAt(0).toUpperCase() + option.appliedAfter.slice(1)})`;
                        }
                    } else {
                        // For fixed prices, show as $amount
                        labelText += `(+$${option.value})`;
                    }
                }

                option.labelElement.textContent = labelText;
            }
        }
    }
}


// Call populateDropdown when the page loads
document.addEventListener('DOMContentLoaded', populateTabs);
document.addEventListener('DOMContentLoaded', updateLabels);

window.addEventListener("load", function () {
    const bgImg = document.getElementById("bgImg");
    const container = bgImg.closest(".right-container");

    // Function to check if either of the containers is visible
    const isContainerVisible = () => {
        // Check if either the illustrationExample or emoteExample is visible
        return (
            (!illustrationExample.classList.contains('hidden') && illustrationExample.offsetWidth > 0 && illustrationExample.offsetHeight > 0) ||
            (!emoteExample.classList.contains('hidden') && emoteExample.offsetWidth > 0 && emoteExample.offsetHeight > 0)
        );
    };

    const setContainerHeightAndWidth = () => {
        if (!isContainerVisible()) {
            // If container is not yet visible, we retry
            setTimeout(setContainerHeightAndWidth, 100);
            return;
        }

        // Get the computed border width
        const computedStyle = window.getComputedStyle(container);
        const borderTopWidth = parseInt(computedStyle.borderTopWidth) || 0;
        const borderBottomWidth = parseInt(computedStyle.borderBottomWidth) || 0;

        // Determine base width of 400px at or above 720px
        let baseWidth = 400;
        if (window.innerWidth < 720) {
            // Scale width down based on screen width
            baseWidth = (window.innerWidth / 720) * 400; // Scale width down based on screen width
        }

        // Set the calculated baseWidth to the container's width
        illustrationExample.style.width = baseWidth + "px";
        emoteExample.style.width = baseWidth + "px";

        // Get the natural height of the background image
        const naturalHeight = bgImg.naturalHeight;
        const naturalWidth = bgImg.naturalWidth;

        // Calculate the scaled height based on the container's width (or base width for smaller screens)
        const scaledHeight = (baseWidth * naturalHeight) / naturalWidth;

        // Add the border widths to the scaled height
        const totalHeight = scaledHeight + borderTopWidth + borderBottomWidth;
        illustrationExample.style.height = totalHeight + "px";
        //emoteExample.style.height = totalHeight + "px";
    };

    // When the background image loads, set the container height and width
    bgImg.onload = setContainerHeightAndWidth;

    // In case the image is already loaded
    if (bgImg.complete) {
        setContainerHeightAndWidth();
    }

    // Recalculate on window resize to keep it dynamic
    window.addEventListener("resize", setContainerHeightAndWidth);
});

