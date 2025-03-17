$(document).ready(function () {
  const $flipbook = $('#flipbook')
  let isTurnJsActive = false
  let originalContent = $flipbook.html() // Save original content

  function initializeFlipbook() {
    if ($(window).width() >= 992) {
      if (!isTurnJsActive) {
        $flipbook.html(originalContent) // Restore original content if needed
        $flipbook.turn({
          autoCenter: true,
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
    } else {
      if (isTurnJsActive) {
        $flipbook.turn('destroy')
        isTurnJsActive = false
      }
      $flipbook.html(originalContent) // Restore original content for scroll mode
      $flipbook.css({
        transform: 'none',
        margin: '0 auto',
        width: '100%',
        height: 'auto',
      })
      $('.page-link').off('click') // Remove click event in scroll mode
    }
  }

  $(window).on('resize', initializeFlipbook)
  initializeFlipbook() // Run on load
})
