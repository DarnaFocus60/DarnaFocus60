$(document).ready(function () {
  const $flipbook = $('#flipbook')
  let isTurnJsActive = false
  let originalContent = $flipbook.html() // Save original content

  const toggleButton = $('.toggle-button')
  const dropoutMenu = $('.dropout-menu')
  const menuIcon = $('#menu-icon')
  const xIcon = $('#x-icon')
  const section1 = $('#section-1')
  const $section2 = $('#section-2')
  const section3 = $('#section-3')

  let sectionOffsets = []

  function updateScrollPositions() {
    sectionOffsets = $('.page')
      // .not('.white-img')
      .map(function () {
        return $(this).offset().top
      })
      .get()
  }

  function smoothScroll(target) {
    let targetOffset = $(target).offset().top + $section2.scrollTop() - 73.5
    $section2.animate({ scrollTop: targetOffset }, 600)
  }

  function closeMenu() {
    dropoutMenu.addClass('hidden')
    section3.removeClass('flex')
    section3.addClass('hidden') // Hides section-3 when menu closes
    section1.removeClass('full-height')

    // Always toggle icons when menu closes
    menuIcon.removeClass('hidden')
    xIcon.addClass('hidden')
  }

  function toggleMenu() {
    dropoutMenu.toggleClass('hidden')
    section3.toggleClass('hidden flex') // Show section-3 when menu opens
    menuIcon.toggleClass('hidden')
    xIcon.toggleClass('hidden')
  }

  // function initializeFlipbook() {
  //   const userPreferredLanguage = localStorage.getItem('language') || 'nl' // Default to Dutch
  //   const isArabic = userPreferredLanguage === 'ar'

  //   if ($(window).width() >= 992) {
  //     // Enable turn.js mode
  //     if (!isTurnJsActive) {
  //       $flipbook.html(originalContent) // Restore original content if needed
  //       $flipbook.turn({
  //         autoCenter: true,
  //         pages: 114,
  //         acceleration: true,
  //         direction: isArabic ? 'rtl' : 'ltr', // RTL if Arabic
  //       })
  //       isTurnJsActive = true

  //       $(window).on('resize', function () {
  //         if (isTurnJsActive) {
  //           $flipbook.css({ width: '', height: '' })
  //           $flipbook.turn(
  //             'size',
  //             $flipbook[0].clientWidth,
  //             $flipbook[0].clientHeight
  //           )
  //         }
  //       })

  //       $('.page-link').on('click', function (e) {
  //         e.preventDefault()
  //         const pageId = $(this).attr('id')
  //         const pageNumber = parseInt(pageId.replace('page-', ''))
  //         $flipbook.turn('page', pageNumber)
  //       })
  //     }

  //     // Ensure menu is reset when switching to turn.js mode
  //     closeMenu()
  //   } else {
  //     // Enable scroll mode
  //     if (isTurnJsActive) {
  //       $flipbook.turn('destroy')
  //       isTurnJsActive = false
  //     }
  //     $flipbook.html(originalContent) // Restore original content for scroll mode
  //     $flipbook.css({
  //       transform: 'none',
  //       margin: '0 auto',
  //       width: '100%',
  //       height: 'auto',
  //     })
  //     $('.page-link').off('click')

  //     // Dynamically assign IDs to pages in scroll mode
  //     let pageIndex = 1
  //     $flipbook.children('.page').each(function () {
  //       $(this).attr('id', `p${pageIndex}`)
  //       pageIndex++
  //     })

  //     updateScrollPositions() // Update positions

  //     // Add smooth scrolling behavior inside #section-2
  //     $('.page-link').on('click', function (e) {
  //       e.preventDefault()
  //       const pageId = $(this).attr('id')
  //       const pageSelector = `#p${pageId.replace('page-', '')}`
  //       const $targetPage = $(pageSelector)

  //       if ($targetPage.length && $section2.length) {
  //         updateScrollPositions() // Ensure fresh positions before scrolling
  //         smoothScroll($targetPage)
  //       }

  //       // Close menu only if NOT inside an accordion OR if #page-2
  //       if (!$(this).closest('.accordion').length || pageId === 'page-2') {
  //         closeMenu()
  //       }
  //     })

  //     // Menu toggle (only in scroll mode)
  //     toggleButton.off('click').on('click', toggleMenu)
  //   }
  // }

  function initializeFlipbook() {
    const userPreferredLanguage = localStorage.getItem('language') || 'nl'
    const isArabic = userPreferredLanguage === 'ar'

    // Step 1: Store existing image sources before destroying flipbook
    let imgData = {}
    $('.flipbook .page img').each(function () {
      const key = $(this).attr('data-i18n-img')
      if (key) {
        imgData[key] = $(this).attr('src')
      }
    })

    if ($(window).width() >= 992) {
      if (!isTurnJsActive) {
        $flipbook.html(originalContent)
        $flipbook.turn({
          autoCenter: true,
          pages: 114,
          acceleration: true,
          direction: isArabic ? 'rtl' : 'ltr',
        })
        isTurnJsActive = true

        $(window).on('resize', function () {
          if (isTurnJsActive) {
            $flipbook.css({ width: '', height: '' })
            $flipbook.turn(
              'size',
              $flipbook[0].clientWidth,
              $flipbook[0].clientHeight
            )
          }
        })

        $('.page-link').on('click', function (e) {
          e.preventDefault()
          const pageId = $(this).attr('id')
          const pageNumber = parseInt(pageId.replace('page-', ''))
          $flipbook.turn('page', pageNumber)
        })
      }
      closeMenu()
    } else {
      if (isTurnJsActive) {
        $flipbook.turn('destroy')
        isTurnJsActive = false
      }
      $flipbook.html(originalContent)
      $flipbook.css({
        transform: 'none',
        margin: '0 auto',
        width: '100%',
        height: 'auto',
      })
      $('.page-link').off('click')

      let pageIndex = 1
      $flipbook.children('.page').each(function () {
        $(this).attr('id', `p${pageIndex}`)
        pageIndex++
      })

      updateScrollPositions()
      $('.page-link').on('click', function (e) {
        e.preventDefault()
        const pageId = $(this).attr('id')
        const pageSelector = `#p${pageId.replace('page-', '')}`
        const $targetPage = $(pageSelector)

        if ($targetPage.length && $section2.length) {
          updateScrollPositions()
          smoothScroll($targetPage)
        }
        if (!$(this).closest('.accordion').length || pageId === 'page-2') {
          closeMenu()
        }
      })

      toggleButton.off('click').on('click', toggleMenu)
    }

    // Step 2: Restore image sources after flipbook is reinitialized
    setTimeout(async () => {
      const langData = await fetchLanguageData(userPreferredLanguage)
      $('.flipbook .page img').each(function () {
        const key = $(this).attr('data-i18n-img')
        if (key) {
          $(this).attr('src', imgData[key] || langData[key] || '')
        }
      })
    }, 500)
  }

  // Handle resize event and update positions
  let resizeTimeout
  $(window).on('resize', function () {
    clearTimeout(resizeTimeout)

    // Temporarily disable smooth scrolling
    $('html').css('scroll-behavior', 'auto')

    resizeTimeout = setTimeout(function () {
      $('html').css('scroll-behavior', 'smooth')
      updateScrollPositions()
    }, 100)
  })

  $(window).on('resize', initializeFlipbook)
  initializeFlipbook() // Run on load
})
