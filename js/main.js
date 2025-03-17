// Accordion Menu
var acc = document.getElementsByClassName('accordion')
var i

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener('click', function () {
    var panel = this.nextElementSibling
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null
      this.classList.remove('active')
    } else {
      for (var it of acc) {
        it.classList.remove('active')
        it.nextElementSibling.style.maxHeight = null
      }
      panel.style.maxHeight = panel.scrollHeight + 'px'
      this.classList.add('active')
    }
  })
}

// // Language nav

// // Function to update content based on selected language
// function updateContent(langData) {
//   document.querySelectorAll('[data-i18n]').forEach((element) => {
//     const key = element.getAttribute('data-i18n')
//     element.innerHTML = langData[key]
//   })
//   document.querySelectorAll('[data-i18n-img]').forEach((img) => {
//     const key = img.getAttribute('data-i18n-img')
//     if (langData[key]) {
//       img.src = langData[key] // Set new image source
//     }
//   })
// }

// // Function to set the language preference
// function setLanguagePreference(lang) {
//   localStorage.setItem('language', lang)
//   location.reload()
// }

// // Function to fetch language data
// async function fetchLanguageData(lang) {
//   const response = await fetch(`languages/${lang}.json`)
//   return response.json()
// }

// // Function to change language
// async function changeLanguage(lang) {
//   await setLanguagePreference(lang)

//   const langData = await fetchLanguageData(lang)
//   updateContent(langData)
//   // toggleArabicStylesheet(lang)
// }

// // Function to toggle Arabic stylesheet based on language selection
// function toggleArabicStylesheet(lang) {
//   const head = document.querySelector('head')
//   const link = document.querySelector('#styles-link')

//   if (link) {
//     head.removeChild(link) // Remove the old stylesheet link
//   } else if (lang === 'ar') {
//     const newLink = document.createElement('link')
//     newLink.id = 'styles-link'
//     newLink.rel = 'stylesheet'
//     newLink.href = '/css/style-ar.css' // Path to Arabic stylesheet
//     head.appendChild(newLink)
//   }
// }

// // Call updateContent() on page load
// window.addEventListener('DOMContentLoaded', async () => {
//   const userPreferredLanguage = localStorage.getItem('language') || 'nl'
//   const langData = await fetchLanguageData(userPreferredLanguage)
//   updateContent(langData)
//   toggleArabicStylesheet(userPreferredLanguage)

//   // Set the active class based on stored language
//   document.querySelectorAll('.lang-link a').forEach((link) => {
//     link.classList.remove('active')
//     if (link.getAttribute('onclick').includes(userPreferredLanguage)) {
//       link.classList.add('active')
//     }
//   })
// })

// Language Navigation

// Function to update text & images based on selected language
async function updateContent(langData) {
  // Update text content
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.getAttribute('data-i18n')
    element.innerHTML = langData[key]
  })

  // Update images
  document.querySelectorAll('[data-i18n-img]').forEach((img) => {
    const key = img.getAttribute('data-i18n-img')
    if (langData[key] && !img.src) {
      img.src = langData[key] // Set new image source only if not already set
    }
  })
}

// Function to set the language preference
function setLanguagePreference(lang) {
  localStorage.setItem('language', lang)
  location.reload()
}

// Function to fetch language data
async function fetchLanguageData(lang) {
  const response = await fetch(`languages/${lang}.json`)
  return response.json()
}

// Function to change language
async function changeLanguage(lang) {
  await setLanguagePreference(lang)
  const langData = await fetchLanguageData(lang)
  updateContent(langData)
}

// Function to toggle Arabic stylesheet
function toggleArabicStylesheet(lang) {
  const head = document.querySelector('head')
  const link = document.querySelector('#styles-link')

  if (link) {
    head.removeChild(link)
  } else if (lang === 'ar') {
    const newLink = document.createElement('link')
    newLink.id = 'styles-link'
    newLink.rel = 'stylesheet'
    newLink.href = '/css/style-ar.css'
    head.appendChild(newLink)
  }
}

// Update content on page load
window.addEventListener('DOMContentLoaded', async () => {
  const userPreferredLanguage = localStorage.getItem('language') || 'nl'
  const langData = await fetchLanguageData(userPreferredLanguage)
  updateContent(langData)
  toggleArabicStylesheet(userPreferredLanguage)

  // Set the active class on the selected language
  document.querySelectorAll('.lang-link a').forEach((link) => {
    link.classList.remove('active')
    if (link.getAttribute('onclick').includes(userPreferredLanguage)) {
      link.classList.add('active')
    }
  })

  // ✅ Ensure all images update dynamically when pages are turned
  $('#flipbook').bind('turned', async function () {
    const langData = await fetchLanguageData(userPreferredLanguage)

    $('.flipbook .page img').each(function () {
      const key = $(this).attr('data-i18n-img')
      if (key && langData[key] && !$(this).attr('src')) {
        $(this).attr('src', langData[key]) // Only set if not already set
      }
    })
  })
})
