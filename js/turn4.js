/* turn.js 4.1.1 | Copyright (c) 2012 Emmanuel Garcia - 2019 Raffaele Morganti | turnjs.com | turnjs.com/license.txt */
/* marginLeft aangepast van 2 naar 4 */

;(function (g) {
  function G(a, b, c) {
    if (c[0] && 'object' != typeof c[0]) {
      if (b[c[0]]) return b[c[0]].apply(a, Array.prototype.slice.call(c, 1))
      throw t(c[0] + ' is not a method or property')
    }
    return b.init.apply(a, c)
  }
  function q(a, b, c, d) {
    return {
      css: {
        position: 'absolute',
        top: a,
        left: b,
        overflow: d || 'hidden',
        zIndex: c || 'auto',
      },
    }
  }
  function L(a, b, c, d, e) {
    var k = 1 - e,
      U = k * k * k,
      f = e * e * e
    return l(
      Math.round(U * a.x + 3 * e * k * k * b.x + 3 * e * e * k * c.x + f * d.x),
      Math.round(U * a.y + 3 * e * k * k * b.y + 3 * e * e * k * c.y + f * d.y)
    )
  }
  function l(a, b) {
    return { x: a, y: b }
  }
  function H(a, b, c) {
    return c
      ? ' translate3d(' + a + 'px,' + b + 'px, 0px) '
      : ' translate(' + a + 'px, ' + b + 'px) '
  }
  function I(a) {
    return ' rotate(' + a + 'deg) '
  }
  function m(a, b) {
    return Object.prototype.hasOwnProperty.call(b, a)
  }
  function R(a, b, c, d, e) {
    var k = []
    b = { x: (b.x / 100) * a.width(), y: (b.y / 100) * a.height() }
    c = { x: (c.x / 100) * a.width(), y: (c.y / 100) * a.height() }
    var f = c.x - b.x,
      h = c.y - b.y,
      g = Math.atan2(h, f),
      r = g - Math.PI / 2
    r = Math.abs(a.width() * Math.sin(r)) + Math.abs(a.height() * Math.cos(r))
    f = Math.sqrt(h * h + f * f)
    c = l(c.x < b.x ? a.width() : 0, c.y < b.y ? a.height() : 0)
    var n = Math.tan(g)
    h = -1 / n
    n = (h * c.x - c.y - n * b.x + b.y) / (h - n)
    c = Math.sqrt(
      Math.pow(n - b.x, 2) + Math.pow(h * n - h * c.x + c.y - b.y, 2)
    )
    for (b = 0; b < e; b++)
      k.push(' ' + d[b][1] + ' ' + (100 * (c + f * d[b][0])) / r + '%')
    a.css({
      'background-image':
        '-webkit-linear-gradient(' + -g + 'rad,' + k.join(',') + ')',
    })
  }
  function v(a, b, c) {
    a = g.Event(a)
    b.trigger(a, c)
    return a.isDefaultPrevented()
      ? 'prevented'
      : a.isPropagationStopped()
      ? 'stopped'
      : ''
  }
  function t(a) {
    function b(a) {
      this.name = 'TurnJsError'
      this.message = a
    }
    b.prototype = Error()
    b.prototype.constructor = b
    return new b(a)
  }
  function B(a) {
    var b = { top: 0, left: 0 }
    do (b.left += a.offsetLeft), (b.top += a.offsetTop)
    while ((a = a.offsetParent))
    return b
  }
  var M = Math.PI,
    N = M / 2,
    x = 'ontouchstart' in window,
    w = x
      ? {
          down: 'touchstart',
          move: 'touchmove',
          up: 'touchend',
          over: 'touchstart',
          out: 'touchend',
        }
      : {
          down: 'mousedown',
          move: 'mousemove',
          up: 'mouseup',
          over: 'mouseover',
          out: 'mouseout',
        },
    u = {
      backward: ['bl', 'tl'],
      forward: ['br', 'tr'],
      all: 'tl bl tr br l r'.split(' '),
    },
    W = ['single', 'double'],
    X = ['ltr', 'rtl'],
    Y = {
      acceleration: !0,
      display: 'double',
      duration: 600,
      page: 1,
      gradients: !0,
      turnCorners: 'bl,br',
      when: null,
    },
    Z = { cornerSize: 100 },
    f = {
      init: function (a) {
        var b,
          c = 0,
          d = this.data(),
          e = this.children()
        a = g.extend(
          {
            width: this.width(),
            height: this.height(),
            direction: this.attr('dir') || this.css('direction') || 'ltr',
          },
          Y,
          a
        )
        d.opts = a
        d.pageObjs = {}
        d.pages = {}
        d.pageWrap = {}
        d.pageZoom = {}
        d.pagePlace = {}
        d.pageMv = []
        d.zoom = 1
        d.totalPages = a.pages || 0
        d.eventHandlers = {
          touchStart: f._touchStart.bind(this),
          touchMove: f._touchMove.bind(this),
          touchEnd: f._touchEnd.bind(this),
          start: f._eventStart.bind(this),
        }
        if (a.when) for (b in a.when) if (m(b, a.when)) this.on(b, a.when[b])
        this.css({ position: 'relative', width: a.width, height: a.height })
        this.turn('display', a.display)
        '' !== a.direction && this.turn('direction', a.direction)
        !x && a.acceleration && this.transform(H(0, 0, !0))
        for (b = 0; b < e.length; b++)
          '1' != g(e[b]).attr('ignore') && this.turn('addPage', e[b], ++c)
        g(this)
          .on(w.down, d.eventHandlers.touchStart)
          .on('end', f._eventEnd)
          .on('pressed', f._eventPressed)
          .on('released', f._eventReleased)
          .on('flip', f._flip)
        g(this).parent().on('start', d.eventHandlers.start)
        g(document)
          .on(w.move, d.eventHandlers.touchMove)
          .on(w.up, d.eventHandlers.touchEnd)
        this.turn('page', a.page)
        d.done = !0
        return this
      },
      addPage: function (a, b) {
        var c,
          d = !1,
          e = this.data(),
          k = e.totalPages + 1
        if (e.destroying) return !1
        if ((c = /\bp([0-9]+)\b/.exec(g(a).attr('class'))))
          b = parseInt(c[1], 10)
        if (b)
          if (b == k) d = !0
          else {
            if (b > k) throw t('Page "' + b + '" cannot be inserted')
          }
        else (b = k), (d = !0)
        1 <= b &&
          b <= k &&
          ((c = 'double' == e.display ? (b % 2 ? ' odd' : ' even') : ''),
          e.done && this.turn('stop'),
          b in e.pageObjs && f._movePages.call(this, b, 1),
          d && (e.totalPages = k),
          (e.pageObjs[b] = g(a)
            .css({ float: 'left' })
            .addClass('page p' + b + c)),
          f._addPage.call(this, b),
          f._removeFromDOM.call(this))
        return this
      },
      _addPage: function (a) {
        var b = this.data(),
          c = b.pageObjs[a]
        if (c)
          if (f._necessPage.call(this, a)) {
            if (!b.pageWrap[a]) {
              b.pageWrap[a] = g('<div/>', {
                class: 'page-wrapper',
                page: a,
                css: { position: 'absolute', overflow: 'hidden' },
              })
              this.append(b.pageWrap[a])
              b.pagePlace[a] ||
                ((b.pagePlace[a] = a), b.pageObjs[a].appendTo(b.pageWrap[a]))
              var d = f._pageSize.call(this, a, !0)
              c.css({ width: d.width, height: d.height })
              b.pageWrap[a].css(d)
            }
            b.pagePlace[a] == a && f._makeFlip.call(this, a)
          } else (b.pagePlace[a] = 0), b.pageObjs[a] && b.pageObjs[a].remove()
      },
      hasPage: function (a) {
        return m(a, this.data().pageObjs)
      },
      center: function (a) {
        var b = this.data(),
          c = g(this).turn('size'),
          d = 0
        b.noCenter ||
          ('double' == b.display &&
            ((a = this.turn('view', a || b.tpage || b.page)),
            'ltr' == b.direction
              ? a[0]
                ? a[1] || (d += c.width / 4)
                : (d -= c.width / 4)
              : a[0]
              ? a[1] || (d -= c.width / 4)
              : (d += c.width / 4)),
          g(this).css({ marginLeft: d }))
        return this
      },
      destroy: function () {
        var a = this,
          b = this.data()
        if ('prevented' != v('destroying', this)) {
          b.destroying = !0
          g.each(
            'end first flip last pressed released start turning turned zooming missing'.split(
              ' '
            ),
            function (b, d) {
              a.off(d)
            }
          )
          this.parent().off('start', b.eventHandlers.start)
          for (
            g(document)
              .off(w.move, b.eventHandlers.touchMove)
              .off(w.up, b.eventHandlers.touchEnd);
            0 !== b.totalPages;

          )
            this.turn('removePage', b.totalPages)
          b.fparent && b.fparent.remove()
          b.shadow && b.shadow.remove()
          this.removeData()
          b = null
          return this
        }
      },
      is: function () {
        return 'object' == typeof this.data().pages
      },
      zoom: function (a) {
        var b = this.data()
        if ('number' == typeof a) {
          if (0.001 > a || 100 < a) throw t(a + ' is not a value for zoom')
          if ('prevented' == v('zooming', this, [a, b.zoom])) return this
          var c = this.turn('size'),
            d = this.turn('view'),
            e = 1 / b.zoom,
            k = Math.round(c.width * e * a)
          c = Math.round(c.height * e * a)
          b.zoom = a
          g(this).turn('stop').turn('size', k, c)
          b.opts.autoCenter && this.turn('center')
          f._updateShadow.call(this)
          for (a = 0; a < d.length; a++)
            d[a] &&
              b.pageZoom[d[a]] != b.zoom &&
              (this.trigger('zoomed', [d[a], d, b.pageZoom[d[a]], b.zoom]),
              (b.pageZoom[d[a]] = b.zoom))
          return this
        }
        return b.zoom
      },
      _pageSize: function (a, b) {
        var c = this.data(),
          d = {}
        if ('single' == c.display)
          (d.width = this.width()),
            (d.height = this.height()),
            b && ((d.top = 0), (d.left = 0), (d.right = 'auto'))
        else {
          var e = this.width() / 2,
            k = this.height()
          c.pageObjs[a].hasClass('own-size')
            ? ((d.width = c.pageObjs[a].width()),
              (d.height = c.pageObjs[a].height()))
            : ((d.width = e), (d.height = k))
          b &&
            ((a %= 2),
            (d.top = (k - d.height) / 2),
            'ltr' == c.direction
              ? ((d[a ? 'right' : 'left'] = e - d.width),
                (d[a ? 'left' : 'right'] = 'auto'))
              : ((d[a ? 'left' : 'right'] = e - d.width),
                (d[a ? 'right' : 'left'] = 'auto')))
        }
        return d
      },
      _makeFlip: function (a) {
        var b = this.data()
        if (!b.pages[a] && b.pagePlace[a] == a) {
          var c = 'single' == b.display,
            d = a % 2
          b.pages[a] = b.pageObjs[a]
            .css(f._pageSize.call(this, a))
            .flip({ page: a, next: d || c ? a + 1 : a - 1, turn: this })
            .flip('disable', b.disabled)
          f._setPageLoc.call(this, a)
          b.pageZoom[a] = b.zoom
        }
        return b.pages[a]
      },
      _makeRange: function () {
        var a
        if (!(1 > this.data().totalPages)) {
          var b = this.turn('range')
          for (a = b[0]; a <= b[1]; a++) f._addPage.call(this, a)
        }
      },
      range: function (a) {
        var b = this.data()
        a = a || b.tpage || b.page || 1
        var c = f._view.call(this, a)
        if (1 > a || a > b.totalPages)
          throw t('"' + a + '" is not a valid page')
        c[1] = c[1] || c[0]
        if (1 <= c[0] && c[1] <= b.totalPages)
          if (b.totalPages - c[1] > c[0]) {
            a = Math.min(c[0] - 1, 2)
            var d = 4 - a
          } else (d = Math.min(b.totalPages - c[1], 2)), (a = 4 - d)
        else d = a = 5
        return [Math.max(1, c[0] - a), Math.min(b.totalPages, c[1] + d)]
      },
      _necessPage: function (a) {
        if (0 === a) return !0
        var b = this.turn('range')
        return (
          this.data().pageObjs[a].hasClass('fixed') || (a >= b[0] && a <= b[1])
        )
      },
      _removeFromDOM: function () {
        var a,
          b = this.data()
        for (a in b.pageWrap)
          m(a, b.pageWrap) &&
            !f._necessPage.call(this, a) &&
            f._removePageFromDOM.call(this, a)
      },
      _removePageFromDOM: function (a) {
        var b = this.data()
        if (b.pages[a]) {
          var c = b.pages[a].data()
          h._moveFoldingPage.call(b.pages[a], !1)
          c.f && c.f.fwrapper && c.f.fwrapper.remove()
          b.pages[a].removeData()
          b.pages[a].remove()
          delete b.pages[a]
        }
        b.pageObjs[a] && b.pageObjs[a].remove()
        b.pageWrap[a] && (b.pageWrap[a].remove(), delete b.pageWrap[a])
        f._removeMv.call(this, a)
        delete b.pagePlace[a]
        delete b.pageZoom[a]
      },
      removePage: function (a) {
        var b = this.data()
        if ('*' == a)
          for (; 0 !== b.totalPages; ) this.turn('removePage', b.totalPages)
        else {
          if (1 > a || a > b.totalPages)
            throw t('The page ' + a + " doesn't exist")
          b.pageObjs[a] &&
            (this.turn('stop'),
            f._removePageFromDOM.call(this, a),
            delete b.pageObjs[a])
          f._movePages.call(this, a, -1)
          --b.totalPages
          b.page > b.totalPages
            ? ((b.page = null), f._fitPage.call(this, b.totalPages))
            : (f._makeRange.call(this), this.turn('update'))
        }
        return this
      },
      _movePages: function (a, b) {
        var c,
          d = this,
          e = this.data(),
          k = 'single' == e.display,
          h = function (a) {
            var c = a + b,
              h = c % 2,
              g = h ? ' odd ' : ' even '
            e.pageObjs[a] &&
              (e.pageObjs[c] = e.pageObjs[a]
                .removeClass('p' + a + ' odd even')
                .addClass('p' + c + g))
            e.pagePlace[a] &&
              e.pageWrap[a] &&
              ((e.pagePlace[c] = c),
              e.pageObjs[c].hasClass('fixed')
                ? (e.pageWrap[c] = e.pageWrap[a].attr('page', c))
                : (e.pageWrap[c] = e.pageWrap[a]
                    .css(f._pageSize.call(d, c, !0))
                    .attr('page', c)),
              e.pages[a] &&
                (e.pages[c] = e.pages[a].flip('options', {
                  page: c,
                  next: k || h ? c + 1 : c - 1,
                })),
              b &&
                (delete e.pages[a],
                delete e.pagePlace[a],
                delete e.pageZoom[a],
                delete e.pageObjs[a],
                delete e.pageWrap[a]))
          }
        if (0 < b) for (c = e.totalPages; c >= a; c--) h(c)
        else for (c = a; c <= e.totalPages; c++) h(c)
      },
      display: function (a) {
        var b = this.data(),
          c = b.display
        if (void 0 === a) return c
        if (-1 == W.indexOf(a))
          throw t('"' + a + '" is not a value for display')
        switch (a) {
          case 'single':
            b.pageObjs[0] ||
              (this.turn('stop').css({ overflow: 'hidden' }),
              (b.pageObjs[0] = g('<div />', { class: 'page p-temporal' })
                .css({ width: this.width(), height: this.height() })
                .appendTo(this)))
            this.addClass('shadow')
            break
          case 'double':
            b.pageObjs[0] &&
              (this.turn('stop').css({ overflow: '' }),
              b.pageObjs[0].remove(),
              delete b.pageObjs[0]),
              this.removeClass('shadow')
        }
        b.display = a
        c &&
          ((a = this.turn('size')),
          f._movePages.call(this, 1, 0),
          this.turn('size', a.width, a.height).turn('update'))
        return this
      },
      direction: function (a) {
        var b = this.data()
        if (void 0 === a) return b.direction
        a = a.toLowerCase()
        if (-1 == X.indexOf(a))
          throw t('"' + a + '" is not a value for direction')
        'rtl' == a && g(this).attr('dir', 'ltr').css({ direction: 'ltr' })
        b.direction = a
        b.done && this.turn('size', g(this).width(), g(this).height())
        return this
      },
      animating: function () {
        return 0 < this.data().pageMv.length
      },
      corner: function () {
        var a,
          b,
          c = this.data()
        for (b in c.pages)
          if (m(b, c.pages) && (a = c.pages[b].flip('corner'))) return a
        return !1
      },
      data: function () {
        return this.data()
      },
      disable: function (a) {
        var b,
          c = this.data(),
          d = this.turn('view')
        c.disabled = void 0 === a || !0 === a
        for (b in c.pages)
          m(b, c.pages) &&
            c.pages[b].flip(
              'disable',
              c.disabled ? !0 : -1 == d.indexOf(parseInt(b, 10))
            )
        return this
      },
      disabled: function (a) {
        return void 0 === a
          ? !0 === this.data().disabled
          : this.turn('disable', a)
      },
      size: function (a, b) {
        if (void 0 === a || void 0 === b)
          return { width: this.width(), height: this.height() }
        this.turn('stop')
        var c,
          d = this.data(),
          e = 'double' == d.display ? a / 2 : a
        this.css({ width: a, height: b })
        d.pageObjs[0] && d.pageObjs[0].css({ width: e, height: b })
        for (c in d.pageWrap)
          m(c, d.pageWrap) &&
            ((a = f._pageSize.call(this, c, !0)),
            d.pageObjs[c].css({ width: a.width, height: a.height }),
            d.pageWrap[c].css(a),
            d.pages[c] && d.pages[c].css({ width: a.width, height: a.height }))
        this.turn('resize')
        return this
      },
      resize: function () {
        var a,
          b = this.data()
        b.pages[0] &&
          (b.pageWrap[0].css({ left: -this.width() }),
          b.pages[0].flip('resize', !0))
        for (a = 1; a <= b.totalPages; a++)
          b.pages[a] && b.pages[a].flip('resize', !0)
        f._updateShadow.call(this)
        b.opts.autoCenter && this.turn('center')
      },
      _removeMv: function (a) {
        var b,
          c = this.data()
        for (b = 0; b < c.pageMv.length; b++)
          if (c.pageMv[b] == a) return c.pageMv.splice(b, 1), !0
        return !1
      },
      _addMv: function (a) {
        var b = this.data()
        f._removeMv.call(this, a)
        b.pageMv.push(a)
      },
      _view: function (a) {
        var b = this.data()
        a = a || b.page
        return 'double' == b.display ? (a % 2 ? [a - 1, a] : [a, a + 1]) : [a]
      },
      view: function (a) {
        var b = this.data()
        a = f._view.call(this, a)
        return 'double' == b.display
          ? [0 < a[0] ? a[0] : 0, a[1] <= b.totalPages ? a[1] : 0]
          : [0 < a[0] && a[0] <= b.totalPages ? a[0] : 0]
      },
      stop: function (a, b) {
        if (this.turn('animating')) {
          var c,
            d = this.data()
          d.tpage && ((d.page = d.tpage), delete d.tpage)
          for (c = 0; c < d.pageMv.length; c++)
            if (d.pageMv[c] && d.pageMv[c] !== a) {
              var e = d.pages[d.pageMv[c]]
              var k = e.data().f.opts
              e.flip('hideFoldedPage', b)
              b || h._moveFoldingPage.call(e, !1)
              k.force &&
                ((k.next = 0 === k.page % 2 ? k.page - 1 : k.page + 1),
                delete k.force)
            }
        }
        this.turn('update')
        return this
      },
      pages: function (a) {
        var b = this.data()
        if (a) {
          if (a < b.totalPages)
            for (var c = b.totalPages; c > a; c--) this.turn('removePage', c)
          b.totalPages = a
          f._fitPage.call(this, b.page)
          return this
        }
        return b.totalPages
      },
      _missing: function (a) {
        var b = this.data()
        if (!(1 > b.totalPages)) {
          var c = this.turn('range', a),
            d = []
          for (a = c[0]; a <= c[1]; a++) b.pageObjs[a] || d.push(a)
          0 < d.length && this.trigger('missing', [d])
        }
      },
      _fitPage: function (a) {
        var b = this.data(),
          c = this.turn('view', a)
        f._missing.call(this, a)
        if (b.pageObjs[a]) {
          b.page = a
          this.turn('stop')
          for (var d = 0; d < c.length; d++)
            c[d] &&
              b.pageZoom[c[d]] != b.zoom &&
              (this.trigger('zoomed', [c[d], c, b.pageZoom[c[d]], b.zoom]),
              (b.pageZoom[c[d]] = b.zoom))
          f._removeFromDOM.call(this)
          f._makeRange.call(this)
          f._updateShadow.call(this)
          this.trigger('turned', [a, c])
          this.turn('update')
          b.opts.autoCenter && this.turn('center')
        }
      },
      _turnPage: function (a) {
        var b = this.data(),
          c = b.pagePlace[a],
          d = this.turn('view'),
          e = this.turn('view', a)
        if (b.page != a) {
          var k = b.page
          if ('prevented' == v('turning', this, [a, e])) {
            k == b.page &&
              -1 != b.pageMv.indexOf(c) &&
              b.pages[c].flip('hideFoldedPage', !0)
            return
          }
          ;-1 != e.indexOf(1) && this.trigger('first')
          ;-1 != e.indexOf(b.totalPages) && this.trigger('last')
        }
        if ('single' == b.display) {
          var h = d[0]
          var g = e[0]
        } else
          d[1] && a > d[1]
            ? ((h = d[1]), (g = e[0]))
            : d[0] && a < d[0] && ((h = d[0]), (g = e[1]))
        c = b.opts.turnCorners.split(',')
        d = b.pages[h].data().f
        e = d.opts
        k = d.point
        f._missing.call(this, a)
        b.pageObjs[a] &&
          (this.turn('stop'),
          (b.page = a),
          f._makeRange.call(this),
          (b.tpage = g),
          e.next != g && ((e.next = g), (e.force = !0)),
          this.turn('update'),
          (d.point = k),
          'hard' == d.effect
            ? 'ltr' == b.direction
              ? b.pages[h].flip('turnPage', a > h ? 'r' : 'l')
              : b.pages[h].flip('turnPage', a > h ? 'l' : 'r')
            : 'ltr' == b.direction
            ? b.pages[h].flip('turnPage', c[a > h ? 1 : 0])
            : b.pages[h].flip('turnPage', c[a > h ? 0 : 1]))
      },
      page: function (a) {
        var b = this.data()
        if (void 0 === a) return b.page
        if (!b.disabled && !b.destroying) {
          a = parseInt(a, 10)
          if (0 < a && a <= b.totalPages)
            return (
              a != b.page &&
                (b.done && -1 == this.turn('view').indexOf(a)
                  ? f._turnPage.call(this, a)
                  : f._fitPage.call(this, a)),
              this
            )
          throw t('The page ' + a + ' does not exist')
        }
      },
      next: function () {
        return this.turn(
          'page',
          Math.min(
            this.data().totalPages,
            f._view.call(this, this.data().page).pop() + 1
          )
        )
      },
      previous: function () {
        return this.turn(
          'page',
          Math.max(1, f._view.call(this, this.data().page).shift() - 1)
        )
      },
      peel: function (a, b) {
        var c = this.data(),
          d = this.turn('view')
        b = void 0 === b ? !0 : !0 === b
        !1 === a
          ? this.turn('stop', null, b)
          : 'single' == c.display
          ? c.pages[c.page].flip('peel', a, b)
          : ((d =
              'ltr' == c.direction
                ? -1 != a.indexOf('l')
                  ? d[0]
                  : d[1]
                : -1 != a.indexOf('l')
                ? d[1]
                : d[0]),
            c.pages[d] && c.pages[d].flip('peel', a, b))
        return this
      },
      _addMotionPage: function () {
        var a = g(this).data().f.opts,
          b = a.turn
        b.data()
        f._addMv.call(b, a.page)
      },
      _eventStart: function (a, b, c) {
        var d = b.turn.data(),
          e = d.pageZoom[b.page]
        a.isDefaultPrevented() ||
          (e &&
            e != d.zoom &&
            (b.turn.trigger('zoomed', [
              b.page,
              b.turn.turn('view', b.page),
              e,
              d.zoom,
            ]),
            (d.pageZoom[b.page] = d.zoom)),
          'single' == d.display &&
            c &&
            (('l' == c.charAt(1) && 'ltr' == d.direction) ||
            ('r' == c.charAt(1) && 'rtl' == d.direction)
              ? ((b.next = b.next < b.page ? b.next : b.page - 1),
                (b.force = !0))
              : (b.next = b.next > b.page ? b.next : b.page + 1)),
          f._addMotionPage.call(a.target))
        f._updateShadow.call(b.turn)
      },
      _eventEnd: function (a, b, c) {
        g(a.target).data()
        a = b.turn
        var d = a.data()
        if (c) {
          if (((c = d.tpage || d.page), c == b.next || c == b.page))
            delete d.tpage, f._fitPage.call(a, c || b.next, !0)
        } else
          f._removeMv.call(a, b.page), f._updateShadow.call(a), a.turn('update')
      },
      _eventPressed: function (a) {
        a = g(a.target).data().f
        var b = a.opts.turn
        b.data().mouseAction = !0
        b.turn('update')
        return (a.time = new Date().getTime())
      },
      _eventReleased: function (a, b) {
        var c = g(a.target),
          d = c.data().f,
          e = d.opts.turn,
          k = e.data()
        b =
          'single' == k.display
            ? 'br' == b.corner || 'tr' == b.corner
              ? b.x < c.width() / 2
              : b.x > c.width() / 2
            : 0 > b.x || b.x > c.width()
        if (200 > new Date().getTime() - d.time || b)
          a.preventDefault(), f._turnPage.call(e, d.opts.next)
        k.mouseAction = !1
      },
      _flip: function (a) {
        a.stopPropagation()
        a = g(a.target).data().f.opts
        a.turn.trigger('turn', [a.next])
        a.turn.data().opts.autoCenter && a.turn.turn('center', a.next)
      },
      _touchStart: function () {
        var a = this.data(),
          b
        for (b in a.pages)
          if (
            m(b, a.pages) &&
            !1 === h._eventStart.apply(a.pages[b], arguments)
          )
            return !1
      },
      _touchMove: function () {
        var a = this.data(),
          b
        for (b in a.pages)
          m(b, a.pages) && h._eventMove.apply(a.pages[b], arguments)
      },
      _touchEnd: function () {
        var a = this.data(),
          b
        for (b in a.pages)
          m(b, a.pages) && h._eventEnd.apply(a.pages[b], arguments)
      },
      calculateZ: function (a) {
        var b = this,
          c = this.data()
        var d = this.turn('view')
        var e = d[0] || d[1],
          k = a.length - 1,
          h = { pageZ: {}, partZ: {}, pageV: {} },
          f = function (a) {
            a = b.turn('view', a)
            a[0] && (h.pageV[a[0]] = !0)
            a[1] && (h.pageV[a[1]] = !0)
          }
        for (d = 0; d <= k; d++) {
          var g = a[d]
          var l = c.pages[g].data().f.opts.next
          var n = c.pagePlace[g]
          f(g)
          f(l)
          g = c.pagePlace[l] == l ? l : g
          h.pageZ[g] = c.totalPages - Math.abs(e - g)
          h.partZ[n] = 2 * c.totalPages - k + d
        }
        return h
      },
      update: function () {
        var a,
          b = this.data()
        if (this.turn('animating') && 0 !== b.pageMv[0]) {
          var c = this.turn('calculateZ', b.pageMv),
            d = this.turn('corner'),
            e = this.turn('view'),
            h = this.turn('view', b.tpage)
          for (a in b.pageWrap)
            if (m(a, b.pageWrap)) {
              var g = b.pageObjs[a].hasClass('fixed')
              b.pageWrap[a].css({
                display: c.pageV[a] || g ? '' : 'none',
                zIndex:
                  (b.pageObjs[a].hasClass('hard') ? c.partZ[a] : c.pageZ[a]) ||
                  (g ? -1 : 0),
              })
              if ((g = b.pages[a]))
                g.flip('z', c.partZ[a] || null),
                  c.pageV[a] && g.flip('resize'),
                  b.tpage
                    ? g
                        .flip('hover', !1)
                        .flip(
                          'disable',
                          -1 == b.pageMv.indexOf(parseInt(a, 10)) &&
                            a != h[0] &&
                            a != h[1]
                        )
                    : g
                        .flip('hover', !1 === d)
                        .flip('disable', a != e[0] && a != e[1])
            }
        } else
          for (a in b.pageWrap)
            m(a, b.pageWrap) &&
              ((c = f._setPageLoc.call(this, a)),
              b.pages[a] &&
                b.pages[a]
                  .flip('disable', b.disabled || 1 != c)
                  .flip('hover', !0)
                  .flip('z', null))
        return this
      },
      _updateShadow: function () {
        var a = this.data(),
          b = this.width(),
          c = this.height(),
          d = 'single' == a.display ? b : b / 2
        var e = this.turn('view')
        a.shadow ||
          (a.shadow = g('<div />', {
            class: 'shadow',
            css: q(0, 0, 0).css,
          }).appendTo(this))
        for (var h = 0; h < a.pageMv.length && e[0] && e[1]; h++) {
          e = this.turn('view', a.pages[a.pageMv[h]].data().f.opts.next)
          var f = this.turn('view', a.pageMv[h])
          e[0] = e[0] && f[0]
          e[1] = e[1] && f[1]
        }
        switch (
          e[0]
            ? e[1]
              ? 3
              : 'ltr' == a.direction
              ? 2
              : 1
            : 'ltr' == a.direction
            ? 1
            : 2
        ) {
          case 1:
            a.shadow.css({ width: d, height: c, top: 0, left: d })
            break
          case 2:
            a.shadow.css({ width: d, height: c, top: 0, left: 0 })
            break
          case 3:
            a.shadow.css({ width: b, height: c, top: 0, left: 0 })
        }
      },
      _setPageLoc: function (a) {
        var b = this.data(),
          c = this.turn('view'),
          d = 0
        if (a == c[0] || a == c[1]) d = 1
        else if (
          ('single' == b.display && a == c[0] + 1) ||
          ('double' == b.display && a == c[0] - 2) ||
          a == c[1] + 2
        )
          d = 2
        if (!this.turn('animating'))
          switch (d) {
            case 1:
              b.pageWrap[a].css({ zIndex: b.totalPages, display: '' })
              break
            case 2:
              b.pageWrap[a].css({ zIndex: b.totalPages - 1, display: '' })
              break
            case 0:
              b.pageWrap[a].css({
                zIndex: 0,
                display: b.pageObjs[a].hasClass('fixed') ? '' : 'none',
              })
          }
        return d
      },
      options: function (a) {
        if (void 0 === a) return this.data().opts
        var b = this.data()
        g.extend(b.opts, a)
        a.pages && this.turn('pages', a.pages)
        a.page && this.turn('page', a.page)
        a.display && this.turn('display', a.display)
        a.direction && this.turn('direction', a.direction)
        a.width && a.height && this.turn('size', a.width, a.height)
        if (a.when)
          for (var c in a.when) if (m(c, a.when)) this.off(c).on(c, a.when[c])
        return this
      },
      version: function () {
        return '4.1.1'
      },
    },
    h = {
      init: function (a) {
        this.data({
          f: {
            disabled: !1,
            hover: !1,
            effect: this.hasClass('hard') ? 'hard' : 'sheet',
          },
        })
        this.flip('options', a)
        h._addPageWrapper.call(this)
        return this
      },
      setData: function (a) {
        var b = this.data()
        b.f = g.extend(b.f, a)
        return this
      },
      options: function (a) {
        var b = this.data().f
        return a
          ? (h.setData.call(this, { opts: g.extend({}, b.opts || Z, a) }), this)
          : b.opts
      },
      z: function (a) {
        var b = this.data().f
        b.opts['z-index'] = a
        b.fwrapper &&
          b.fwrapper.css({
            zIndex: a || parseInt(b.parent.css('z-index'), 10) || 0,
          })
        return this
      },
      _cAllowed: function () {
        var a = this.data().f,
          b = a.opts.page,
          c = a.opts.turn.data(),
          d = b % 2
        return 'hard' == a.effect
          ? 'ltr' == c.direction
            ? [d ? 'r' : 'l']
            : [d ? 'l' : 'r']
          : 'single' == c.display
          ? 1 == b
            ? 'ltr' == c.direction
              ? u.forward
              : u.backward
            : b == c.totalPages
            ? 'ltr' == c.direction
              ? u.backward
              : u.forward
            : u.all
          : 'ltr' == c.direction
          ? u[d ? 'forward' : 'backward']
          : u[d ? 'backward' : 'forward']
      },
      _cornerActivated: function (a) {
        var b = this.data().f,
          c = this.width(),
          d = this.height()
        a = { x: a.x, y: a.y, corner: '' }
        var e = b.opts.cornerSize
        if (0 >= a.x || 0 >= a.y || a.x >= c || a.y >= d) return !1
        var g = h._cAllowed.call(this)
        switch (b.effect) {
          case 'hard':
            if (a.x > c - e) a.corner = 'r'
            else if (a.x < e) a.corner = 'l'
            else return !1
            break
          case 'sheet':
            if (a.y < e) a.corner += 't'
            else if (a.y >= d - e) a.corner += 'b'
            else return !1
            if (a.x <= e) a.corner += 'l'
            else if (a.x >= c - e) a.corner += 'r'
            else return !1
        }
        return a.corner && -1 != g.indexOf(a.corner) ? a : !1
      },
      _isIArea: function (a) {
        var b = this.data().f.parent.offset()
        a = x && a.originalEvent ? a.originalEvent.touches[0] : a
        return h._cornerActivated.call(this, {
          x: a.pageX - b.left,
          y: a.pageY - b.top,
        })
      },
      _c: function (a, b) {
        b = b || 0
        switch (a) {
          case 'tl':
            return l(b, b)
          case 'tr':
            return l(this.width() - b, b)
          case 'bl':
            return l(b, this.height() - b)
          case 'br':
            return l(this.width() - b, this.height() - b)
          case 'l':
            return l(b, 0)
          case 'r':
            return l(this.width() - b, 0)
        }
      },
      _c2: function (a) {
        switch (a) {
          case 'tl':
            return l(2 * this.width(), 0)
          case 'tr':
            return l(-this.width(), 0)
          case 'bl':
            return l(2 * this.width(), this.height())
          case 'br':
            return l(-this.width(), this.height())
          case 'l':
            return l(2 * this.width(), 0)
          case 'r':
            return l(-this.width(), 0)
        }
      },
      _foldingPage: function () {
        var a = this.data().f
        if (a) {
          var b = a.opts
          if (b.turn)
            return (
              (a = b.turn.data()),
              'single' == a.display
                ? 1 < b.next || 1 < b.page
                  ? a.pageObjs[0]
                  : null
                : a.pageObjs[b.next]
            )
        }
      },
      _backGradient: function () {
        var a = this.data().f,
          b = a.opts.turn.data()
        ;(b =
          b.opts.gradients &&
          ('single' == b.display ||
            (2 != a.opts.page && a.opts.page != b.totalPages - 1))) &&
          !a.bshadow &&
          (a.bshadow = g('<div/>', q(0, 0, 1))
            .css({ position: '', width: this.width(), height: this.height() })
            .appendTo(a.parent))
        return b
      },
      type: function () {
        return this.data().f.effect
      },
      resize: function (a) {
        var b = this.data().f,
          c = b.opts.turn.data(),
          d = this.width(),
          e = this.height()
        switch (b.effect) {
          case 'hard':
            a &&
              (b.wrapper.css({ width: d, height: e }),
              b.fpage.css({ width: d, height: e }),
              c.opts.gradients &&
                (b.ashadow.css({ width: d, height: e }),
                b.bshadow.css({ width: d, height: e })))
            break
          case 'sheet':
            a &&
              ((a = Math.round(Math.sqrt(Math.pow(d, 2) + Math.pow(e, 2)))),
              b.wrapper.css({ width: a, height: a }),
              b.fwrapper
                .css({ width: a, height: a })
                .children(':first-child')
                .css({ width: d, height: e }),
              b.fpage.css({ width: d, height: e }),
              c.opts.gradients && b.ashadow.css({ width: d, height: e }),
              h._backGradient.call(this) &&
                b.bshadow.css({ width: d, height: e })),
              b.parent.is(':visible') &&
                ((c = B(b.parent[0])),
                b.fwrapper.css({ top: c.top, left: c.left }),
                (c = B(b.opts.turn[0])),
                b.fparent.css({ top: -c.top, left: -c.left })),
              this.flip('z', b.opts['z-index'])
        }
      },
      _addPageWrapper: function () {
        var a = this.data().f,
          b = a.opts.turn.data(),
          c = this.parent()
        a.parent = c
        if (!a.wrapper)
          switch (a.effect) {
            case 'hard':
              var d = {
                'transform-style': 'preserve-3d',
                'backface-visibility': 'hidden',
              }
              a.wrapper = g('<div/>', q(0, 0, 2))
                .css(d)
                .appendTo(c)
                .prepend(this)
              a.fpage = g('<div/>', q(0, 0, 1)).css(d).appendTo(c)
              b.opts.gradients &&
                ((a.ashadow = g('<div/>', q(0, 0, 0)).hide().appendTo(c)),
                (a.bshadow = g('<div/>', q(0, 0, 0))))
              break
            case 'sheet':
              this.width(),
                this.height(),
                (a.fparent = a.opts.turn.data().fparent),
                a.fparent ||
                  ((d = g('<div/>', {
                    css: { 'pointer-events': 'none' },
                  }).hide()),
                  (d.data().flips = 0),
                  d.css(q(0, 0, 'auto', 'visible').css).appendTo(a.opts.turn),
                  (a.opts.turn.data().fparent = d),
                  (a.fparent = d)),
                this.css({
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 'auto',
                  right: 'auto',
                }),
                (a.wrapper = g('<div/>', q(0, 0, this.css('z-index')))
                  .appendTo(c)
                  .prepend(this)),
                (a.fwrapper = g('<div/>', q(c.offset().top, c.offset().left))
                  .hide()
                  .appendTo(a.fparent)),
                (a.fpage = g('<div/>', q(0, 0, 0, 'visible'))
                  .css({ cursor: 'default' })
                  .appendTo(a.fwrapper)),
                b.opts.gradients &&
                  (a.ashadow = g('<div/>', q(0, 0, 1)).appendTo(a.fpage)),
                h.setData.call(this, a)
          }
        h.resize.call(this, !0)
      },
      _fold: function (a) {
        var b = this.data().f,
          c = b.opts.turn.data(),
          d = h._c.call(this, a.corner),
          e = this.width(),
          g = this.height()
        switch (b.effect) {
          case 'hard':
            a.x =
              'l' == a.corner
                ? Math.min(Math.max(a.x, 0), 2 * e)
                : Math.max(Math.min(a.x, e), -e)
            var f = c.totalPages,
              m = b.opts['z-index'] || f,
              V = { overflow: 'visible' },
              r = d.x ? (d.x - a.x) / e : a.x / e,
              n = 90 * r,
              q = 90 > n
            switch (a.corner) {
              case 'l':
                var t = '0% 50%'
                var u = '100% 50%'
                if (q) {
                  var y = 0
                  var w = 0 < b.opts.next - 1
                  var v = 1
                } else (y = '100%'), (w = b.opts.page + 1 < f), (v = 0)
                break
              case 'r':
                ;(t = '100% 50%'),
                  (u = '0% 50%'),
                  (n = -n),
                  (e = -e),
                  q
                    ? ((y = 0), (w = b.opts.next + 1 < f), (v = 0))
                    : ((y = '-100%'), (w = 1 != b.opts.page), (v = 1))
            }
            V['perspective-origin'] = u
            b.wrapper.transform(
              'rotateY(' +
                n +
                'deg)translate3d(0px, 0px, ' +
                (this.attr('depth') || 0) +
                'px)',
              u
            )
            b.fpage.transform(
              'translateX(' + e + 'px) rotateY(' + (180 + n) + 'deg)',
              t
            )
            b.parent.css(V)
            q
              ? ((r = -r + 1),
                b.wrapper.css({ zIndex: m + 1 }),
                b.fpage.css({ zIndex: m }))
              : (--r,
                b.wrapper.css({ zIndex: m }),
                b.fpage.css({ zIndex: m + 1 }))
            c.opts.gradients &&
              (w
                ? b.ashadow
                    .css({
                      display: '',
                      left: y,
                      backgroundColor: 'rgba(0,0,0,' + 0.5 * r + ')',
                    })
                    .transform('rotateY(0deg)')
                : b.ashadow.hide(),
              b.bshadow.css({ opacity: -r + 1 }),
              q
                ? b.bshadow.parent()[0] != b.wrapper[0] &&
                  b.bshadow.appendTo(b.wrapper)
                : b.bshadow.parent()[0] != b.fpage[0] &&
                  b.bshadow.appendTo(b.fpage),
              R(
                b.bshadow,
                l(100 * v, 0),
                l(100 * (-v + 1), 0),
                [
                  [0, 'rgba(0,0,0,0.3)'],
                  [1, 'rgba(0,0,0,0)'],
                ],
                2
              ))
            break
          case 'sheet':
            var x = this,
              J = 0,
              B,
              C,
              D,
              O,
              A,
              P,
              G,
              z = l(0, 0),
              S = l(0, 0),
              p = l(0, 0),
              L = h._foldingPage.call(this),
              Q = c.opts.acceleration,
              T = b.wrapper.height(),
              F = 't' == a.corner.substr(0, 1),
              E = 'l' == a.corner.substr(1, 1),
              K = function () {
                var b = l(0, 0),
                  f = l(0, 0)
                b.x = d.x ? d.x - a.x : a.x
                b.y = d.y ? d.y - a.y : a.y
                f.x = E ? e - b.x / 2 : a.x + b.x / 2
                f.y = b.y / 2
                var k = N - Math.atan2(b.y, b.x),
                  n = Math.max(
                    0,
                    Math.sin(k - Math.atan2(f.y, f.x)) *
                      Math.sqrt(Math.pow(f.x, 2) + Math.pow(f.y, 2))
                  )
                J = (k / M) * 180
                p = l(n * Math.sin(k), n * Math.cos(k))
                if (
                  k > N &&
                  ((p.x += Math.abs((p.y * b.y) / b.x)),
                  (p.y = 0),
                  Math.round(p.x * Math.tan(M - k)) < g)
                )
                  return (
                    (a.y = Math.sqrt(Math.pow(g, 2) + 2 * f.x * b.x)),
                    F && (a.y = g - a.y),
                    K()
                  )
                k > N &&
                  ((b = M - k),
                  (f = T - g / Math.sin(b)),
                  (z = l(
                    Math.round(f * Math.cos(b)),
                    Math.round(f * Math.sin(b))
                  )),
                  E && (z.x = -z.x),
                  F && (z.y = -z.y))
                B = Math.round(p.y / Math.tan(k) + p.x)
                b = e - B
                f = b * Math.cos(2 * k)
                n = b * Math.sin(2 * k)
                S = l(Math.round(E ? b - f : B + f), Math.round(F ? n : g - n))
                c.opts.gradients &&
                  ((A = b * Math.sin(k)),
                  (b = h._c2.call(x, a.corner)),
                  (b =
                    Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2)) /
                    e),
                  (G = Math.sin(N * (1 < b ? 2 - b : b))),
                  (P = Math.min(b, 1)),
                  (O = 100 < A ? (A - 100) / A : 0),
                  (C = l(
                    ((A * Math.sin(k)) / e) * 100,
                    ((A * Math.cos(k)) / g) * 100
                  )),
                  h._backGradient.call(x) &&
                    ((D = l(
                      ((1.2 * A * Math.sin(k)) / e) * 100,
                      ((1.2 * A * Math.cos(k)) / g) * 100
                    )),
                    E || (D.x = 100 - D.x),
                    F || (D.y = 100 - D.y)))
                p.x = Math.round(p.x)
                p.y = Math.round(p.y)
                return !0
              }
            y = function (a, d, f, k) {
              var n = ['0', 'auto'],
                p = ((e - T) * f[0]) / 100,
                m = ((g - T) * f[1]) / 100
              d = {
                left: n[d[0]],
                top: n[d[1]],
                right: n[d[2]],
                bottom: n[d[3]],
              }
              n = {}
              var q = 90 != k && -90 != k ? (E ? -1 : 1) : 0,
                r = f[0] + '% ' + f[1] + '%'
              x.css(d).transform(I(k) + H(a.x + q, a.y, Q), r)
              b.fpage
                .css(d)
                .transform(
                  I(k) +
                    H(
                      a.x + S.x - z.x - (e * f[0]) / 100,
                      a.y + S.y - z.y - (g * f[1]) / 100,
                      Q
                    ) +
                    I((180 / k - 2) * k),
                  r
                )
              b.wrapper.transform(H(-a.x + p - q, -a.y + m, Q) + I(-k), r)
              b.fwrapper.transform(
                H(-a.x + z.x + p, -a.y + z.y + m, Q) + I(-k),
                r
              )
              c.opts.gradients &&
                (f[0] && (C.x = 100 - C.x),
                f[1] && (C.y = 100 - C.y),
                (n['box-shadow'] = '0 0 20px rgba(0,0,0,' + 0.5 * G + ')'),
                L.css(n),
                R(
                  b.ashadow,
                  l(E ? 100 : 0, F ? 0 : 100),
                  l(C.x, C.y),
                  [
                    [O, 'rgba(0,0,0,0)'],
                    [0.8 * (1 - O) + O, 'rgba(0,0,0,' + 0.2 * P + ')'],
                    [1, 'rgba(255,255,255,' + 0.2 * P + ')'],
                  ],
                  3,
                  0
                ),
                h._backGradient.call(x) &&
                  R(
                    b.bshadow,
                    l(E ? 0 : 100, F ? 0 : 100),
                    l(D.x, D.y),
                    [
                      [0.6, 'rgba(0,0,0,0)'],
                      [0.8, 'rgba(0,0,0,' + 0.3 * P + ')'],
                      [1, 'rgba(0,0,0,0)'],
                    ],
                    3
                  ))
            }
            switch (a.corner) {
              case 'tl':
                a.x = Math.max(a.x, 1)
                K()
                y(p, [1, 0, 0, 1], [100, 0], J)
                break
              case 'tr':
                a.x = Math.min(a.x, e - 1)
                K()
                y(l(-p.x, p.y), [0, 0, 0, 1], [0, 0], -J)
                break
              case 'bl':
                a.x = Math.max(a.x, 1)
                K()
                y(l(p.x, -p.y), [1, 1, 0, 0], [100, 100], -J)
                break
              case 'br':
                ;(a.x = Math.min(a.x, e - 1)),
                  K(),
                  y(l(-p.x, -p.y), [0, 1, 1, 0], [0, 100], J)
            }
        }
        b.point = a
      },
      _moveFoldingPage: function (a) {
        var b = this.data().f
        if (b) {
          var c = b.opts.turn,
            d = c.data(),
            e = d.pagePlace
          a
            ? ((d = b.opts.next),
              e[d] != b.opts.page &&
                (b.folding && h._moveFoldingPage.call(this, !1),
                h._foldingPage.call(this).appendTo(b.fpage),
                (e[d] = b.opts.page),
                (b.folding = d)),
              c.turn('update'))
            : b.folding &&
              (d.pages[b.folding]
                ? ((c = d.pages[b.folding].data().f),
                  d.pageObjs[b.folding].appendTo(c.wrapper))
                : d.pageWrap[b.folding] &&
                  d.pageObjs[b.folding].appendTo(d.pageWrap[b.folding]),
              b.folding in e && (e[b.folding] = b.folding),
              delete b.folding)
        }
      },
      _showFoldedPage: function (a, b) {
        var c = h._foldingPage.call(this),
          d = this.data(),
          e = d.f,
          f = e.visible
        if (c) {
          if (!f || !e.point || e.point.corner != a.corner)
            if (
              ((c =
                'hover' == e.status ||
                'peel' == e.status ||
                e.opts.turn.data().mouseAction
                  ? a.corner
                  : null),
              (f = !1),
              'prevented' == v('start', this, [e.opts, c]))
            )
              return !1
          if (b) {
            var g = this
            b =
              e.point && e.point.corner == a.corner
                ? e.point
                : h._c.call(this, a.corner, 1)
            this.animatef({
              from: [b.x, b.y],
              to: [a.x, a.y],
              duration: 500,
              frame: function (b) {
                a.x = Math.round(b[0])
                a.y = Math.round(b[1])
                h._fold.call(g, a)
              },
            })
          } else
            h._fold.call(this, a),
              d.effect && !d.effect.turning && this.animatef(!1)
          if (!f)
            switch (e.effect) {
              case 'hard':
                e.visible = !0
                h._moveFoldingPage.call(this, !0)
                e.fpage.show()
                e.opts.shadows && e.bshadow.show()
                break
              case 'sheet':
                ;(e.visible = !0),
                  e.fparent.show().data().flips++,
                  h._moveFoldingPage.call(this, !0),
                  e.fwrapper.show(),
                  e.bshadow && e.bshadow.show()
            }
          return !0
        }
        return !1
      },
      hide: function () {
        var a = this.data().f,
          b = a.opts.turn.data(),
          c = h._foldingPage.call(this)
        switch (a.effect) {
          case 'hard':
            b.opts.gradients &&
              ((a.bshadowLoc = 0), a.bshadow.remove(), a.ashadow.hide())
            a.wrapper.transform('')
            a.fpage.hide()
            break
          case 'sheet':
            0 === --a.fparent.data().flips && a.fparent.hide(),
              this.css({
                left: 0,
                top: 0,
                right: 'auto',
                bottom: 'auto',
              }).transform(''),
              a.wrapper.transform(''),
              a.fwrapper.hide(),
              a.bshadow && a.bshadow.hide(),
              c.transform('')
        }
        a.visible = !1
        return this
      },
      hideFoldedPage: function (a) {
        var b = this.data().f
        if (b.point) {
          var c = this,
            d = b.point,
            e = function () {
              b.point = null
              b.status = ''
              c.flip('hide')
              c.trigger('end', [b.opts, !1])
            }
          if (a) {
            var f = h._c.call(this, d.corner)
            a =
              't' == d.corner.substr(0, 1)
                ? Math.min(0, d.y - f.y) / 2
                : Math.max(0, d.y - f.y) / 2
            var g = l(d.x, d.y + a),
              m = l(f.x, f.y - a)
            this.animatef({
              from: 0,
              to: 1,
              frame: function (a) {
                a = L(d, g, m, f, a)
                d.x = a.x
                d.y = a.y
                h._fold.call(c, d)
              },
              complete: e,
              duration: 800,
              hiding: !0,
            })
          } else this.animatef(!1), e()
        }
      },
      turnPage: function (a) {
        var b = this,
          c = this.data().f,
          d = c.opts.turn.data()
        a = {
          corner: c.corner ? c.corner.corner : a || h._cAllowed.call(this)[0],
        }
        var e =
            c.point ||
            h._c.call(this, a.corner, c.opts.turn ? d.opts.elevation : 0),
          f = h._c2.call(this, a.corner)
        this.trigger('flip').animatef({
          from: 0,
          to: 1,
          frame: function (c) {
            c = L(e, e, f, f, c)
            a.x = c.x
            a.y = c.y
            h._showFoldedPage.call(b, a)
          },
          complete: function () {
            b.trigger('end', [c.opts, !0])
          },
          duration: d.opts.duration,
          turning: !0,
        })
        c.corner = null
      },
      moving: function () {
        return 'effect' in this.data()
      },
      isTurning: function () {
        return this.flip('moving') && this.data().effect.turning
      },
      corner: function () {
        return this.data().f.corner
      },
      _eventStart: function (a) {
        var b = this.data().f,
          c = b.opts.turn
        if (
          !b.corner &&
          !b.disabled &&
          !this.flip('isTurning') &&
          b.opts.page == c.data().pagePlace[b.opts.page]
        ) {
          b.corner = h._isIArea.call(this, a)
          if (b.corner && h._foldingPage.call(this))
            return (
              this.trigger('pressed', [b.point]),
              h._showFoldedPage.call(this, b.corner),
              !1
            )
          b.corner = null
        }
      },
      _eventMove: function (a) {
        var b = this.data().f
        if (!b.disabled)
          if (((a = x ? a.originalEvent.touches : [a]), b.corner)) {
            var c = b.parent.offset()
            b.corner.x = a[0].pageX - c.left
            b.corner.y = a[0].pageY - c.top
            h._showFoldedPage.call(this, b.corner)
          } else if (b.hover && !this.data().effect && this.is(':visible'))
            if ((a = h._isIArea.call(this, a[0]))) {
              if (
                ('sheet' == b.effect && 2 == a.corner.length) ||
                'hard' == b.effect
              )
                (b.status = 'hover'),
                  (b = h._c.call(this, a.corner, b.opts.cornerSize / 2)),
                  (a.x = b.x),
                  (a.y = b.y),
                  h._showFoldedPage.call(this, a, !0)
            } else
              'hover' == b.status &&
                ((b.status = ''), h.hideFoldedPage.call(this, !0))
      },
      _eventEnd: function () {
        var a = this.data().f,
          b = a.corner
        !a.disabled &&
          b &&
          'prevented' != v('released', this, [a.point || b]) &&
          h.hideFoldedPage.call(this, !0)
        a.corner = null
      },
      disable: function (a) {
        h.setData.call(this, { disabled: a })
        return this
      },
      hover: function (a) {
        h.setData.call(this, { hover: a })
        return this
      },
      peel: function (a, b) {
        var c = this.data().f
        if (a) {
          if (-1 == u.all.indexOf(a))
            throw t('Corner ' + a + ' is not permitted')
          if (-1 != h._cAllowed.call(this).indexOf(a)) {
            var d = h._c.call(this, a, c.opts.cornerSize / 2)
            c.status = 'peel'
            h._showFoldedPage.call(this, { corner: a, x: d.x, y: d.y }, b)
          }
        } else (c.status = ''), h.hideFoldedPage.call(this, b)
        return this
      },
    }
  g.extend(g.fn, {
    flip: function () {
      return G(g(this[0]), h, arguments)
    },
    turn: function () {
      return G(g(this[0]), f, arguments)
    },
    transform: function (a, b) {
      var c = {}
      b && (c['transform-origin'] = b)
      c.transform = a
      return this.css(c)
    },
    animatef: function (a) {
      var b = this.data()
      b.effect && b.effect.stop()
      if (a) {
        a.to.length || (a.to = [a.to])
        a.from.length || (a.from = [a.from])
        for (
          var c = [],
            d = a.to.length,
            e = !0,
            f = this,
            h = new Date().getTime(),
            l = function () {
              if (b.effect && e) {
                for (
                  var g = [],
                    k = Math.min(a.duration, new Date().getTime() - h),
                    m = 0;
                  m < d;
                  m++
                )
                  g.push(b.effect.easing(1, k, a.from[m], c[m], a.duration))
                a.frame(1 == d ? g[0] : g)
                k == a.duration
                  ? (delete b.effect, f.data(b), a.complete && a.complete())
                  : window.requestAnimationFrame(l)
              }
            },
            m = 0;
          m < d;
          m++
        )
          c.push(a.to[m] - a.from[m])
        b.effect = g.extend(
          {
            stop: function () {
              e = !1
            },
            easing: function (a, b, c, d, e) {
              return d * Math.sqrt(1 - (b = b / e - 1) * b) + c
            },
          },
          a
        )
        this.data(b)
        l()
      } else delete b.effect
    },
  })
  g.isTouch = x
  g.mouseEvents = w
  g.findPos = B
})(jQuery)
