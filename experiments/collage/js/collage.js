// collage.js - WebDocTools experiment
//
// Author: Wes Modes
// Created: 2024-02-07

//
// CONSTANTS
//
const imgDir = 'img/';

//
// SECTION TRANSITIONS
//

function showSection(sectionId, transitionEffect) {
  // 1. Find the ID of the currently displayed major section
  var currentSection = $('.major-section').filter(function() {
    return $(this).css('display') !== 'none';
  }).first();
  // 2. Set the z-index of the currently displayed major section to 90
  if(currentSection.length) {
    currentSection.css('z-index', '90');
  }
  // 3. Set the z-index of the new section to 100
  var newSection = $('#' + sectionId);
  newSection.css('z-index', '100');
  // 4. Perform the indicated transition on the new section
  switch (transitionEffect) {
    case 'fadeIn':
      newSection.fadeIn('slow', function() {
        // Callback after fadeIn completes
        postTransitionCleanup(newSection);
      });
      break;
    case 'slideDown':
      // Prepare the section by positioning it above the viewport without displaying it
      newSection.css({
        top: '-100vh' // Start the section off-screen above the viewport
      });
      newSection.show();
      // Animate the section to slide down into view
      newSection.animate({
        top: '0' // Animate the top property to move the section into view
      }, 'slow', function() {
        // This callback function runs after the animation completes
        postTransitionCleanup(newSection);
        // Optional: Reset any additional styles if necessary
      });
      break;
    case 'slideUp':
      // Position the section below the viewport without displaying it
      newSection.css({
        top: '100vh' // Start the section off-screen below the viewport
      });
      newSection.show(); // Ensure the section is visible before animating
      // Animate the section to slide up into view
      newSection.animate({
        top: '0' // Animate the top property to move the section into view
      }, 'slow', function() {
        // Callback function after the animation completes
        postTransitionCleanup(newSection);
      });
      break;
    case 'slideLeft':
      // Position the section to the right of the viewport without displaying it
      newSection.css({
        left: '100vw' // Start the section off-screen to the right
      });
      newSection.show(); // Ensure the section is visible before animating
      // Animate the section to slide left into view
      newSection.animate({
        left: '0' // Animate the left property to move the section into view
      }, 'slow', function() {
        // Callback function after the animation completes
        postTransitionCleanup(newSection);
      });
      break;
    case 'slideRight':
      // Position the section to the left of the viewport without displaying it
      newSection.css({
        left: '-100vw' // Start the section off-screen to the left
      });
      newSection.show(); // Ensure the section is visible before animating
      // Animate the section to slide right into view
      newSection.animate({
        left: '0' // Animate the left property to move the section into view
      }, 'slow', function() {
        // Callback function after the animation completes
        postTransitionCleanup(newSection);
      });
      break;  
    default:
      // If no transition effect is specified, just show the section immediately
      newSection.show();
      postTransitionCleanup(newSection);
  }  
  // 5. Hide all of the major-sections except the new one
  // 6. Reset the z-index of all the major sections to 100
  // These steps are performed in the postTransitionCleanup function to ensure they run after the transition
  function postTransitionCleanup(exceptSection) {
    $('.major-section').not(exceptSection).hide();
    $('.major-section').css('z-index', '100'); // Reset z-index for all sections
  }
}

showSection('section-splash');

$('#splash-button').click(function() {
  console.log("Begin Button Clicked");
  showSection('section-desert1', 'slideLeft');
  showCollage("desert1", PAGE_ELEMENTS["desert1"])
})

//
// ELEMENT TRANSITIONS  
//

async function showCollage(targetElement, elementsObj) {
  // Sort the elements by pageOrder
  elementsObj.sort((a, b) => a.pageOrder - b.pageOrder);
  // Loop through the collage elements
  for (let elementObj of elementsObj) {
    // // Transition the elements onto the page
    // if (elementObj.timing === 'async') {
    //   showElement(targetElement, elementObj);
    // } else {
      await showElement(targetElement, elementObj);
    // }
    // console.log("showCollage: " + elementObj.filename);
  }
  // Load the collage data

  // Load any Audio, Video, or other media

  // Transition the elements onto the page
}

function showElement(targetElement, elementObj) {
  return new Promise((resolve, reject) => {
    console.log(`showElement(${targetElement}, ${elementObj.filename})`);
    // make element name from filename
    elementName = elementObj.filename.split('.').slice(0, -1).join('.');
    var $img = null;
    // If the element does not exist, create it
    if ($("#"+elementName).length === 0) {
      // construct css for new element
      const css = { 
        position: 'absolute',
        display: 'none',
        width: elementObj.width,
        height: elementObj.height
      };
      if (elementObj.top) css.top = elementObj.top;
      if (elementObj.left) css.left = elementObj.left;
      if (elementObj.bottom) css.bottom = elementObj.bottom;
      if (elementObj.right) css.right = elementObj.right;
      // Create a new image element off-stage
      $img = $('<img>', {
        id: elementName,
        src: `${imgDir}${elementObj.filename}`,
        alt: elementObj.description,
        width: elementObj.width,
        height: elementObj.height,
        css: css
      });
      // Append the image to the specific container
      const targetSelector = `#section-${targetElement} .collage`;
      console.log(`targetSelector: ${targetSelector}`);
      $(targetSelector).append($img);
    } else {
      $img = $("#"+elementName);
    }
    // Transition the element onto the page
    switch (elementObj.transition) {
      case 'slideDown':
        if (elementObj.top) {
          $img.css('top', '-100vh').show().animate({ top: elementObj.top }, elementObj.speed, resolve);
        } else if (elementObj.bottom) {
          $img.css('bottom', '100vh').show().animate({ bottom: elementObj.bottom }, elementObj.speed, resolve);
        }
        break;
      case 'slideUp':
        if (elementObj.top) {
          $img.css('top', '100vh').show().animate({ top: elementObj.top }, elementObj.speed, resolve);
        } else if (elementObj.bottom) {
          $img.css('bottom', '-100vh').show().animate({ bottom: elementObj.bottom }, elementObj.speed,resolve);
        }
        break;
      case 'slideRight':
        if (elementObj.left) {
          $img.css('left', '-100vw').show().animate({ left: elementObj.left }, elementObj.speed, resolve);
        } else if (elementObj.right) {
          $img.css('right', '-100vw').show().animate({ right: elementObj.right }, elementObj.speed, resolve);
        }
        break;
      case 'slideLeft':
        if (elementObj.left) {
          $img.css('left', '100vw').show().animate({ left: elementObj.left }, elementObj.speed, resolve);
        } else if (elementObj.right) {
          $img.css('right', '100vw').show().animate({ right: elementObj.right }, elementObj.speed, resolve);
        }
        break;
      case 'fadeIn':
        $img.css({display: 'block'}).fadeIn(elementObj.speed, resolve);
        break;
    }
  });
}
