/***********************************************
 * VARIABLE DECLARATIONS
 ***********************************************/

/** 
 * --- PRICING VARIABLES ---
 */

let selectedPanel = "";

// Base Prices
let basePrice = 0; //Currently selected base price
const baseIllustrationPrices = {
    'Full Body': 20,    // Full-body illustration price
    'Knee Up': 16,     // Knee Up illustration price
    'Bust': 13,          // Bust illustration price
    'Headshot': 10       // Headshot illustration price
};
const baseEmotePrice = 30; //Emote Price

const pricingData = {
    // Quality Prices
    sketch: {
        type: 'percentage',           // 'percentage' or 'fixed'
        value: 0,                   // 0.7 for 70% of base price, or a fixed price like 10
        appliedAfter: 'base',      // The price it depends on ('base', 'quality', 'extras', etc.)
        panel: 'illustration',  // This item belongs to the illustration panel
        inputElement: document.getElementById("lineStyleSketch"),
        labelElement: document.querySelector('label[for="lineStyleSketch"]'),
    },
    lineart: {
        type: 'percentage',           // 'percentage' or 'fixed'
        value: 0.7,                   // 0.7 for 70% of base price, or a fixed price like 10
        appliedAfter: 'base',      // The price it depends on ('base', 'quality', 'extras', etc.)
        panel: 'illustration',  // This item belongs to the illustration panel
        inputElement: document.getElementById("lineStyleLineart"),
        labelElement: document.querySelector('label[for="lineStyleLineart"]'),
    },
    color: {
        type: 'percentage',           // 'percentage' or 'fixed'
        value: 0.6,                   // 0.7 for 70% of base price, or a fixed price like 10
        appliedAfter: 'base',      // The price it depends on ('base', 'quality', 'extras', etc.)
        panel: 'illustration',  // This item belongs to the illustration panel
        inputElement: document.getElementById("colorCheck"),
        labelElement: document.querySelector('label[for="colorCheck"]'),
    },
    shading: {
        type: 'parent', // Special case for parent checkboxes with labels that reflect the min/max price of their children
        panel: 'illustration',  // This item belongs to the illustration panel
        labelElement: document.querySelector("label[for='shadingCheck']"),
        children: ['cellShading', 'softShading']
    },
    cellShading: {
        type: 'percentage',           // 'percentage' or 'fixed'
        value: 0.9,                   // 0.7 for 70% of base price, or a fixed price like 10
        appliedAfter: 'base',      // The price it depends on ('base', 'quality', 'extras', etc.)
        panel: 'illustration',  // This item belongs to the illustration panel
        inputElement: document.getElementById("shadingStyleCell"),
        labelElement: document.querySelector("label[for='shadingStyleCell']")
    },
    softShading: {
        type: 'percentage',           // 'percentage' or 'fixed'
        value: 0.95,                   // 0.7 for 70% of base price, or a fixed price like 10
        appliedAfter: 'base',      // The price it depends on ('base', 'quality', 'extras', etc.)
        panel: 'illustration',  // This item belongs to the illustration panel
        inputElement: document.getElementById("shadingStyleSoft"),
        labelElement: document.querySelector("label[for='shadingStyleSoft']")
    },
    customCharacters: {
        type: 'percentage',           // 'percentage' or 'fixed'
        value: 0.5,                   // 0.7 for 70% of base price, or a fixed price like 10
        appliedAfter: 'quality',      // The price it depends on ('base', 'quality', 'extras', etc.)
        panel: 'illustration',  // This item belongs to the illustration panel
        inputElement: document.getElementById("customCharsAmt"),
        labelElement: document.querySelector("label[for='customCharsAmt']")
    },
    silhouettes: {
        type: 'percentage',           // 'percentage' or 'fixed'
        value: 0.25,                   // 0.7 for 70% of base price, or a fixed price like 10
        appliedAfter: 'quality',      // The price it depends on ('base', 'quality', 'extras', etc.)
        panel: 'illustration',  // This item belongs to the illustration panel
        inputElement: document.getElementById("silhouetteAmt"),
        labelElement: document.querySelector("label[for='silhouetteAmt']")
    },
    background: {
        type: 'parent', // Special case for parent checkboxes with labels that reflect the min/max price of their children
        panel: 'illustration',  // This item belongs to the illustration panel
        labelElement: document.querySelector("label[for='backgroundCheck']"),
        children: ['simpleBackground', 'detailedBackground']
    },
    simpleBackground: {
        type: 'fixed',           // 'percentage' or 'fixed'
        value: 15,                   // 0.7 for 70% of base price, or a fixed price like 10
        appliedAfter: 'quality',      // The price it depends on ('base', 'quality', 'extras', etc.)
        panel: 'illustration',  // This item belongs to the illustration panel
        inputElement: document.getElementById("backgroundComplexitySimple"),
        labelElement: document.querySelector("label[for='backgroundComplexitySimple']")
    },
    detailedBackground: {
        type: 'fixed',           // 'percentage' or 'fixed'
        value: 50,                   // 0.7 for 70% of base price, or a fixed price like 10
        appliedAfter: 'quality',      // The price it depends on ('base', 'quality', 'extras', etc.)
        panel: 'illustration',  // This item belongs to the illustration panel
        inputElement: document.getElementById("backgroundComplexityDetailed"),
        labelElement: document.querySelector("label[for='backgroundComplexityDetailed']")
    },
    additionalPanels: {
        type: 'percentage',           // 'percentage' or 'fixed'
        value: 0.75,                   // 0.7 for 70% of base price, or a fixed price like 10
        appliedAfter: 'extras',      // The price it depends on ('base', 'quality', 'extras', etc.)
        panel: 'illustration',  // This item belongs to the illustration panel
        inputElement: document.getElementById("panelAmt"),
        labelElement: document.querySelector("label[for='panelAmt']")
    },
    animated: {
        type: 'parent', // Special case for parent checkboxes with labels that reflect the min/max price of their children
        panel: 'emote',  // This item belongs to the illustration panel
        labelElement: document.querySelector("label[for='animatedCheck']"),
        children: ['simpleAnimation', 'complexAnimation']
    },
    simpleAnimation: {
        type: 'fixed',           // 'percentage' or 'fixed'
        value: 15,                   // 0.7 for 70% of base price, or a fixed price like 10
        appliedAfter: 'extras',      // The price it depends on ('base', 'quality', 'extras', etc.)
        panel: 'emote',  // This item belongs to the illustration panel
        inputElement: document.getElementById("animationComplexitySimple"),
        labelElement: document.querySelector("label[for='animationComplexitySimple']")
    },
    complexAnimation: {
        type: 'fixed',           // 'percentage' or 'fixed'
        value: 25,                   // 0.7 for 70% of base price, or a fixed price like 10
        appliedAfter: 'extras',      // The price it depends on ('base', 'quality', 'extras', etc.)
        panel: 'emote',  // This item belongs to the illustration panel
        inputElement: document.getElementById("animationComplexityComplex"),
        labelElement: document.querySelector("label[for='animationComplexityComplex']")
    },
}


/** 
 * --- ELEMENT VARIABLES ---
 */

const sketchImg = document.getElementById("sketchImg");
const lineartImg = document.getElementById("lineartImg");
const colorCheck = document.getElementById("colorCheck");
const colorImg = document.getElementById("colorImg");
const shadingCheck = document.getElementById("shadingCheck");
const shadingDiv = document.getElementById("shadingDiv");
const shadingImagesDiv = document.getElementById("shadingImages");

const addCharsCheck = document.getElementById("addCharsCheck");
const charDiv = document.getElementById("charDiv");

const backgroundCheck = document.getElementById("backgroundCheck");
const backgroundDiv = document.getElementById("backgroundDiv");

const staticEmotesImagesDiv = document.getElementById("static-emotes");
const simpleEmotesImagesDiv = document.getElementById("animated-emotes-simple");
const complexEmotesImagesDiv = document.getElementById("animated-emotes-complex");

const panelCheck = document.getElementById("panelCheck");
const panelDiv = document.getElementById("panelDiv");


const priceElement = document.getElementById("price");

/***********************************************
 * FUNCTION DECLARATIONS
 ***********************************************/

function SetBaseIllustrationPrice(option) {
    if (baseIllustrationPrices.hasOwnProperty(option))
        SetBasePrice(baseIllustrationPrices[option]);
    else
        console.error(`Error: The option "${option}" does not exist in basePrices.`);
}

function SetBasePrice(value) {
    basePrice = value;
    //calculatePrice();
}

//label.textContent= 'Test';
  
// Function to calculate price
function calculatePrice() {
    /*let basePrice = parseFloat(
    document.getElementById("basePrice").value
    ) || 0;
    
    let qualityMultiplier = 1; // default is sketch (1.0)
    if (document.getElementById("lineStyle").value === "lineart") {
    qualityMultiplier = 1.7; // 70% increase for lineart
    }

    if (colorCheck.checked) {
    qualityMultiplier += 0.6; // 60% increase for color
    }

    if (shadingCheck.checked) {
    const shadingType = document.querySelector(
        'input[name="shadingStyle"]:checked'
    ).value;
    qualityMultiplier += shadingType === "soft" ? 0.95 : 0.9;
    }

    // Add extra charges
    let additionalCost = 0;

    if (addCharsCheck.checked) {
    const customCharsAmt = parseInt(
        document.getElementById("customCharsAmt").value
    ) || 0;
    additionalCost += customCharsAmt * 0.5 * basePrice * qualityMultiplier;
    }

    // More extra cost logic for clover, mysa, etc. here...

    // Final calculation
    const totalPrice = basePrice * qualityMultiplier + additionalCost;*/
    let totalPrice = basePrice;
    totalPrice += parseFloat(CalculatePriceStep(basePrice, 'base'));
    totalPrice += parseFloat(CalculatePriceStep(totalPrice, 'quality'));
    totalPrice += parseFloat(CalculatePriceStep(totalPrice, 'extras'));

    if (selectedPanel === 'emote') {
        if (document.getElementById("additionalEmoteCheck").checked) {
            var addStaticEmotes = parseInt(document.getElementById("additionalStaticEmoteAmt").value);
            var addSimpleEmotes = parseInt(document.getElementById("additionalSimpleEmoteAmt").value);
            var addComplexEmotes = parseInt(document.getElementById("additionalComplexEmoteAmt").value);
            var additionalEmotes = addStaticEmotes + addSimpleEmotes + addComplexEmotes;
            var discount = Math.floor((additionalEmotes + 1) / 5) * 5;
            var additionalEmotePrice = (addStaticEmotes * baseEmotePrice) + (addSimpleEmotes * (baseEmotePrice + pricingData['simpleAnimation'].value)) + (addComplexEmotes * (baseEmotePrice + pricingData['complexAnimation'].value)) - discount;

            //console.log(additionalEmotePrice);
            totalPrice += additionalEmotePrice;
        }
    }

    priceElement.innerHTML = `Price: $${totalPrice.toFixed(2)}`;
}

function CalculatePriceStep(startingValue, appliedAfter) {
    const appliedItems = [];

    // Iterate over all pricing data
    for (const key in pricingData) {
        const item = pricingData[key];

        // Check if the item belongs to the active panel
        if (item.panel !== selectedPanel || item.appliedAfter !== appliedAfter) {
            continue;  // Skip items that don't belong to the active panel or if 'appliedAfter' doesn't match
        }

        // Check if the item applies after the given type and is visible
        const inputElement = item.inputElement;

        // Determine the input type (checkbox, input number, or radio button)
        if (inputElement && inputElement.offsetParent !== null) {  // If the element is visible
            let isChecked = false;

            // If it's a checkbox, check if it's checked
            if (inputElement.type === 'checkbox' && inputElement.checked) {
                isChecked = true;
            }
            
            // If it's an input number, check if the value is greater than 0
            else if (inputElement.type === 'number' && parseInt(inputElement.value) > 0) {
                isChecked = true;  // Treat the number as checked
            }

            // If it's a radio button, check if it is the selected one in its group
            else if (inputElement.type === 'radio' && inputElement.checked) {
                isChecked = true;
            }

            // If the item is checked (either checkbox, number input, or radio button), add it to appliedItems
            if (isChecked) {
                // For input number and radio buttons, use the value as the multiplier
                const multiplier = (inputElement.type === 'number') ? parseInt(inputElement.value) : 1;
                
                appliedItems.push({
                    ...item,
                    multiplier: multiplier,  // No longer needed here, as we're directly using multiplier below
                });
            }
        }
    }

    // Split the filtered items by type (percentage or fixed)
    const percentageItems = appliedItems.filter(item => item.type === 'percentage');
    const fixedItems = appliedItems.filter(item => item.type === 'fixed');

    let itemPercentage = 0;
    for (const item of percentageItems) {
        const multiplier = (item.inputElement && item.inputElement.type === 'number') ? parseInt(item.inputElement.value) : 1;
        itemPercentage += item.value * multiplier;  // Apply the multiplier to percentage items
    }

    let fixedItemAmount = 0;
    for (const item of fixedItems) {
        const multiplier = (item.inputElement && item.inputElement.type === 'number') ? parseInt(item.inputElement.value) : 1;
        fixedItemAmount += item.value * multiplier;  // Apply the multiplier to fixed items
    }

    let newValue = startingValue * itemPercentage;  // Apply percentage-based value
    newValue += fixedItemAmount;  // Add fixed values
    return newValue.toFixed(2);
}



/***********************************************
 * EVENT LISTENERS
 ***********************************************/

document.addEventListener("DOMContentLoaded", () => {
    // Toggle visibility of shading options
    shadingCheck.addEventListener("change", () => {
        shadingDiv.classList.toggle("hidden", !shadingCheck.checked);
        shadingImagesDiv.classList.toggle("hidden", !shadingCheck.checked);
        //parentVisibilityByRadio("shadingStyle");
    });
  
    // Toggle visibility of character options
    addCharsCheck.addEventListener("change", () => {
      charDiv.classList.toggle("hidden", !addCharsCheck.checked);
    });
  
    // Toggle visibility of background options
    backgroundCheck.addEventListener("change", () => {
      backgroundDiv.classList.toggle("hidden", !backgroundCheck.checked);
    });
  
    // Toggle visibility of panel options
    panelCheck.addEventListener("change", () => {
      panelDiv.classList.toggle("hidden", !panelCheck.checked);
    });
  
    // Toggle visibility of panel options
    animatedCheck.addEventListener("change", () => {
        animatedDiv.classList.toggle("hidden", !animatedCheck.checked);
        if (!animatedCheck.checked) {
            staticEmotesImagesDiv.classList.toggle("hidden", false);
            simpleEmotesImagesDiv.classList.toggle("hidden", true);
            complexEmotesImagesDiv.classList.toggle("hidden", true);
        }
        else {
            staticEmotesImagesDiv.classList.toggle("hidden", true);
            const selectedValue = document.querySelector('input[name="animationComplexity"]:checked')?.value;
            if (selectedValue === 'simple') {
                simpleEmotesImagesDiv.classList.toggle("hidden", false);
                complexEmotesImagesDiv.classList.toggle("hidden", true);
            }
            else if (selectedValue === 'complex') {
                simpleEmotesImagesDiv.classList.toggle("hidden", true);
                complexEmotesImagesDiv.classList.toggle("hidden", false);
            }
        }
    });

    const radioButtons = document.getElementsByName("animationComplexity");
    radioButtons.forEach((radio) => {
        radio.addEventListener("change", (event) => {
            if (animatedCheck.checked) {
                staticEmotesImagesDiv.classList.toggle("hidden", true);
                if (event.target.value === 'simple') {
                    simpleEmotesImagesDiv.classList.toggle("hidden", false);
                    complexEmotesImagesDiv.classList.toggle("hidden", true);
                }
                else if (event.target.value === 'complex') {
                    simpleEmotesImagesDiv.classList.toggle("hidden", true);
                    complexEmotesImagesDiv.classList.toggle("hidden", false);
                }
            }
        });
    });

  
    // Toggle visibility of panel options
    additionalEmoteCheck.addEventListener("change", () => {
        additionalEmoteDiv.classList.toggle("hidden", !additionalEmoteCheck.checked);
    });
  
    // Event listeners for price calculation
    document.querySelectorAll("input, select").forEach((input) => {
      input.addEventListener("change", calculatePrice);
    });

    /*function parentVisibilityByRadio(dataGroup) {
        // Get the selected radio button value
        const selectedShading = document.querySelector(`input[name='${dataGroup}']:checked`);
        
        // Get all images for shadingStyle group
        const images = document.querySelectorAll(`img[data-group="${dataGroup}"]`);

        // Hide all images initially
        images.forEach((img) => {
            img.hidden = true;
        });

        // If the checkbox is checked, show the image that corresponds to the selected radio button
        if (shadingCheck.checked && selectedShading) {
            const selectedImage = document.querySelector(`img[data-group="${dataGroup}"][data-value="${selectedShading.value}"]`);
            if (selectedImage) {
                selectedImage.hidden = false;
            }
        }
    }*/

    function toggleVisibilityByCheckbox(checkboxId, imgId) {
        const checkbox = document.getElementById(checkboxId);
        const image = document.getElementById(imgId);
    
        if (checkbox && image) {
            checkbox.addEventListener("change", () => {
                image.hidden = !checkbox.checked; // Show image if checked, hide if unchecked
            });
        }
    }

    function toggleVisibilityByRadio(radioGroupName) {
        const radios = document.getElementsByName(radioGroupName);
    
        radios.forEach((radio) => {
            radio.addEventListener("change", () => {
                // Find all images with the matching data-group attribute
                const images = document.querySelectorAll(`img[data-group="${radioGroupName}"]`);
    
                images.forEach((img) => {
                    // Show the image with matching data-value, hide others
                    img.hidden = img.getAttribute("data-value") !== radio.value;
                });
            });
        });
    }
    
    // Initialize for each checkbox and its corresponding image
    toggleVisibilityByCheckbox("colorCheck", "colorImg");
    
    
    // Initialize for the lineStyle group
    toggleVisibilityByRadio("lineStyle");
    toggleVisibilityByRadio("shadingStyle");
    toggleVisibilityByRadio()
  });
  