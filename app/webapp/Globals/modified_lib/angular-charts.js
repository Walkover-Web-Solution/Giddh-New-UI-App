!(function(t) {
  "use strict";
  "object" == typeof exports
    ? (module.exports = t(
        "undefined" != typeof angular ? angular : window.angular,
        "undefined" != typeof Chart ? Chart : window.Chart
      ))
    : "function" == typeof define && define.amd
      ? define(["angular", "chart"], t)
      : t(angular, Chart);
})(function(t, e) {
  "use strict";
  function n() {
    var n = {},
      r = {
        Chart: e,
        getOptions: function(e) {
          var r = (e && n[e]) || {};
          return t.extend({}, n, r);
        }
      };
    (this.setOptions = function(e, r) {
      return r
        ? void (n[e] = t.extend(n[e] || {}, r))
        : ((r = e), void (n = t.extend(n, r)));
    }), (this.$get = function() {
      return r;
    });
  }
  function r(n, r) {
    function o(t, e) {
      return t && e && t.length && e.length
        ? Array.isArray(t[0])
          ? t.length === e.length &&
              t.every(function(t, n) {
                return t.length === e[n].length;
              })
          : e.reduce(i, 0) > 0 ? t.length === e.length : !1
        : !1;
    }
    function i(t, e) {
      return t + e;
    }
    function c(e, n, r, a) {
      var o = null;
      return function(i) {
        var c = n.getPointsAtEvent || n.getBarsAtEvent || n.getSegmentsAtEvent;
        if (c) {
          var l = c.call(n, i);
          setTimeout(function () {
            a.$apply(function() {
              a.ngclipboardError({ e: b });
            });
          });
        }
      };
    }
    function l(r, a) {
      for (
        var o = t.copy(
          a.colours || n.getOptions(r).colours || e.defaults.global.colours
        );
        o.length < a.data.length;

      )
        o.push(a.getColour());
      return o.map(u);
    }
    function u(t) {
      return "object" == typeof t && null !== t
        ? t
        : "string" == typeof t && "#" === t[0] ? f(g(t.substr(1))) : s();
    }
    function s() {
      var t = [h(0, 255), h(0, 255), h(0, 255)];
      return f(t);
    }
    function f(t) {
      return {
        fillColor: d(t, 0.2),
        strokeColor: d(t, 1),
        pointColor: d(t, 1),
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: d(t, 0.8)
      };
    }
    function h(t, e) {
      return Math.floor(Math.random() * (e - t + 1)) + t;
    }
    function d(t, e) {
      return a
        ? "rgb(" + t.join(",") + ")"
        : "rgba(" + t.concat(e).join(",") + ")";
    }
    function g(t) {
      var e = parseInt(t, 16),
        n = (e >> 16) & 255,
        r = (e >> 8) & 255,
        a = 255 & e;
      return [n, r, a];
    }
    function p(e, n, r, a) {
      return {
        labels: e,
        datasets: n.map(function(e, n) {
          return t.extend({}, a[n], { label: r[n], data: e });
        })
      };
    }
    function v(e, n, r) {
      return e.map(function(e, a) {
        return t.extend({}, r[a], {
          label: e,
          value: n[a],
          color: r[a].strokeColor,
          highlight: r[a].pointHighlightStroke
        });
      });
    }
    function y(t, e) {
      var n = t.parent(),
        r = n.find("chart-legend"),
        a = "<chart-legend>" + e.generateLegend() + "</chart-legend>";
      r.length ? r.replaceWith(a) : n.append(a);
    }
    function C(t, e, n, r) {
      Array.isArray(n.data[0])
        ? t.datasets.forEach(function(t, n) {
            (t.points || t.bars).forEach(function(t, r) {
              t.value = e[n][r];
            });
          })
        : t.segments.forEach(function(t, n) {
            t.value = e[n];
          }), t.update(), n.$emit("update", t), n.legend && "false" !== n.legend && y(r, t);
    }
    function b(t) {
      return (
        !t ||
        (Array.isArray(t) && !t.length) ||
        ("object" == typeof t && !Object.keys(t).length)
      );
    }
    function m(r, a) {
      var o = t.extend({}, e.defaults.global, n.getOptions(r), a.options);
      return o.responsive;
    }
    return function(e) {
      return {
        restrict: "CA",
        scope: {
          data: "=?",
          labels: "=?",
          options: "=?",
          series: "=?",
          colours: "=?",
          getColour: "=?",
          chartType: "=",
          legend: "@",
          click: "=?",
          hover: "=?",
          chartData: "=?",
          chartLabels: "=?",
          chartOptions: "=?",
          chartSeries: "=?",
          chartColours: "=?",
          chartLegend: "@",
          chartClick: "=?",
          chartHover: "=?"
        },
        link: function(i, u) {
          function f(t, e) {
            i.$watch(t, function(t) {
              "undefined" != typeof t && (i[e] = t);
            });
          }
          function h(n, r) {
            if (!b(n) && !t.equals(n, r)) {
              var a = e || i.chartType;
              a && (w && w.destroy(), d(a));
            }
          }
          function d(e) {
            if (m(e, i) && 0 === u[0].clientHeight && 0 === A.clientHeight)
              return r(
                function() {
                  d(e);
                },
                50,
                !1
              );
            if (i.data && i.data.length) {
              (i.getColour = "function" == typeof i.getColour
                ? i.getColour
                : s), (i.colours = l(e, i));
              var a = u[0],
                o = a.getContext("2d"),
                f = Array.isArray(i.data[0])
                  ? p(i.labels, i.data, i.series || [], i.colours)
                  : v(i.labels, i.data, i.colours),
                h = t.extend({}, n.getOptions(e), i.options);
              void 0 != w && null != w && w.destroy(), (w = new n.Chart(o)[e](
                f,
                h
              )), i.$emit("create", w), (a.onclick = i.click
                ? c(i, w, "click", !1)
                : t.noop), (a.onmousemove = i.hover
                ? c(i, w, "hover", !0)
                : t.noop), i.legend && "false" !== i.legend && y(u, w);
            }
          }
          function g(t) {
            if (
              "undefined" != typeof console &&
              "test" !== n.getOptions().env
            ) {
              var e = "function" == typeof console.warn
                ? console.warn
                : console.log;
              i[t] &&
                e.call(
                  console,
                  '"%s" is deprecated and will be removed in a future version. Please use "chart-%s" instead.',
                  t,
                  t
                );
            }
          }
          var w,
            A = document.createElement("div");
          (A.className = "chart-container"), u.replaceWith(A), A.appendChild(
            u[0]
          ), a && window.G_vmlCanvasManager.initElement(u[0]), [
            "data",
            "labels",
            "options",
            "series",
            "colours",
            "legend",
            "click",
            "hover"
          ].forEach(g), f("chartData", "data"), f("chartLabels", "labels"), f(
            "chartOptions",
            "options"
          ), f("chartSeries", "series"), f("chartColours", "colours"), f(
            "chartLegend",
            "legend"
          ), f("chartClick", "click"), f("chartHover", "hover"), i.$watch(
            "data",
            function(t, n) {
              if (t && t.length && (!Array.isArray(t[0]) || t[0].length)) {
                var r = e || i.chartType;
                if (r) {
                  if (w) {
                    if (o(t, n)) return C(w, t, i, u);
                    w.destroy();
                  }
                  d(r);
                }
              }
            },
            !0
          ), i.$watch("series", h, !0), i.$watch("labels", h, !0), i.$watch(
            "options",
            h,
            !0
          ), i.$watch("colours", h, !0), i.$watch("chartType", function(e, n) {
            b(e) || t.equals(e, n) || (w && w.destroy(), d(e));
          }), i.$on("$destroy", function() {
            w && w.destroy();
          });
        }
      };
    };
  }
  (e.defaults.global.responsive = !0), (e.defaults.global.multiTooltipTemplate = "<%if (datasetLabel){%><%=datasetLabel%>: <%}%><%= value %>"), (e.defaults.global.colours = ["#97BBCD", "#DCDCDC", "#F7464A", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360"]);
  var a =
    "object" == typeof window.G_vmlCanvasManager &&
    null !== window.G_vmlCanvasManager &&
    "function" == typeof window.G_vmlCanvasManager.initElement;
  return a && (e.defaults.global.animation = !1), t
    .module("chart.js", [])
    .provider("ChartJs", n)
    .factory("ChartJsFactory", ["ChartJs", "$timeout", r])
    .directive("chartBase", [
      "ChartJsFactory",
      function(t) {
        return new t();
      }
    ])
    .directive("chartLine", [
      "ChartJsFactory",
      function(t) {
        return new t("Line");
      }
    ])
    .directive("chartBar", [
      "ChartJsFactory",
      function(t) {
        return new t("Bar");
      }
    ])
    .directive("chartRadar", [
      "ChartJsFactory",
      function(t) {
        return new t("Radar");
      }
    ])
    .directive("chartDoughnut", [
      "ChartJsFactory",
      function(t) {
        return new t("Doughnut");
      }
    ])
    .directive("chartPie", [
      "ChartJsFactory",
      function(t) {
        return new t("Pie");
      }
    ])
    .directive("chartPolarArea", [
      "ChartJsFactory",
      function(t) {
        return new t("PolarArea");
      }
    ]);
});

// perfect-scrollbar.Mousewheel.min.js
/*! perfect-scrollbar - v0.4.10
* http://noraesae.github.com/perfect-scrollbar/
* Copyright (c) 2014 Hyeonje Alex Jun; Licensed MIT */
(function(e) {
  "use strict";
  "function" == typeof define && define.amd
    ? define(["jquery"], e)
    : "object" == typeof exports ? e(require("jquery")) : e(jQuery);
})(function(e) {
  "use strict";
  var t = {
    wheelSpeed: 10,
    wheelPropagation: !1,
    minScrollbarLength: null,
    useBothWheelAxes: !1,
    useKeyboard: !0,
    suppressScrollX: !1,
    suppressScrollY: !1,
    scrollXMarginOffset: 0,
    scrollYMarginOffset: 0,
    includePadding: !1
  },
    o = (function() {
      var e = 0;
      return function() {
        var t = e;
        return (e += 1), ".perfect-scrollbar-" + t;
      };
    })();
  e.fn.perfectScrollbar = function(n, r) {
    return this.each(function() {
      var l = e.extend(!0, {}, t),
        s = e(this);
      if (("object" == typeof n ? e.extend(!0, l, n) : (r = n), "update" === r))
        return s.data("perfect-scrollbar-update") &&
          s.data("perfect-scrollbar-update")(), s;
      if ("destroy" === r)
        return s.data("perfect-scrollbar-destroy") &&
          s.data("perfect-scrollbar-destroy")(), s;
      if (s.data("perfect-scrollbar")) return s.data("perfect-scrollbar");
      s.addClass("ps-container");
      var a,
        i,
        c,
        u,
        d,
        p,
        f,
        h,
        v,
        g,
        b = e("<div class='ps-scrollbar-x-rail'></div>").appendTo(s),
        m = e("<div class='ps-scrollbar-y-rail'></div>").appendTo(s),
        w = e("<div class='ps-scrollbar-x'></div>").appendTo(b),
        T = e("<div class='ps-scrollbar-y'></div>").appendTo(m),
        L = parseInt(b.css("bottom"), 10),
        y = L === L,
        S = y ? null : parseInt(b.css("top"), 10),
        I = parseInt(m.css("right"), 10),
        x = I === I,
        M = x ? null : parseInt(m.css("left"), 10),
        P = "rtl" === s.css("direction"),
        X = o(),
        D = function(e, t) {
          var o = e + t,
            n = u - v;
          g = 0 > o ? 0 : o > n ? n : o;
          var r = parseInt(g * (p - u) / (u - v), 10);
          s.scrollTop(r), y ? b.css({ bottom: L - r }) : b.css({ top: S + r });
        },
        Y = function(e, t) {
          var o = e + t,
            n = c - f;
          h = 0 > o ? 0 : o > n ? n : o;
          var r = parseInt(h * (d - c) / (c - f), 10);
          s.scrollLeft(r), x ? m.css({ right: I - r }) : m.css({ left: M + r });
        },
        k = function(e) {
          return l.minScrollbarLength &&
            (e = Math.max(e, l.minScrollbarLength)), e;
        },
        C = function() {
          var e = { width: c, display: a ? "inherit" : "none" };
          (e.left = P ? s.scrollLeft() + c - d : s.scrollLeft()), y
            ? (e.bottom = L - s.scrollTop())
            : (e.top = S + s.scrollTop()), b.css(e);
          var t = {
            top: s.scrollTop(),
            height: u,
            display: i ? "inherit" : "none"
          };
          x
            ? (t.right = P
                ? d - s.scrollLeft() - I - T.outerWidth()
                : I - s.scrollLeft())
            : (t.left = P
                ? s.scrollLeft() + 2 * c - d - M - T.outerWidth()
                : M + s.scrollLeft()), m.css(t), w.css({
            left: h,
            width: f
          }), T.css({ top: g, height: v });
        },
        j = function() {
          (c = l.includePadding
            ? s.innerWidth()
            : s.width()), (u = l.includePadding
            ? s.innerHeight()
            : s.height()), (d = s.prop("scrollWidth")), (p = s.prop(
            "scrollHeight"
          )), !l.suppressScrollX && d > c + l.scrollXMarginOffset
            ? (
                (a = !0),
                (f = k(parseInt(c * c / d, 10))),
                (h = parseInt(s.scrollLeft() * (c - f) / (d - c), 10))
              )
            : (
                (a = !1),
                (f = 0),
                (h = 0),
                s.scrollLeft(0)
              ), !l.suppressScrollY && p > u + l.scrollYMarginOffset
            ? (
                (i = !0),
                (v = k(parseInt(u * u / p, 10))),
                (g = parseInt(s.scrollTop() * (u - v) / (p - u), 10))
              )
            : ((i = !1), (v = 0), (g = 0), s.scrollTop(0)), g >= u - v &&
            (g = u - v), h >= c - f && (h = c - f), C();
        },
        O = function() {
          var t, o;
          w.bind("mousedown" + X, function(e) {
            (o =
              e.pageX), (t = w.position().left), b.addClass("in-scrolling"), e.stopPropagation(), e.preventDefault();
          }), e(document).bind("mousemove" + X, function(e) {
            b.hasClass("in-scrolling") &&
              (Y(t, e.pageX - o), e.stopPropagation(), e.preventDefault());
          }), e(document).bind("mouseup" + X, function() {
            b.hasClass("in-scrolling") && b.removeClass("in-scrolling");
          }), (t = o = null);
        },
        W = function() {
          var t, o;
          T.bind("mousedown" + X, function(e) {
            (o =
              e.pageY), (t = T.position().top), m.addClass("in-scrolling"), e.stopPropagation(), e.preventDefault();
          }), e(document).bind("mousemove" + X, function(e) {
            m.hasClass("in-scrolling") &&
              (D(t, e.pageY - o), e.stopPropagation(), e.preventDefault());
          }), e(document).bind("mouseup" + X, function() {
            m.hasClass("in-scrolling") && m.removeClass("in-scrolling");
          }), (t = o = null);
        },
        E = function(e, t) {
          var o = s.scrollTop();
          if (0 === e) {
            if (!i) return !1;
            if ((0 === o && t > 0) || (o >= p - u && 0 > t))
              return !l.wheelPropagation;
          }
          var n = s.scrollLeft();
          if (0 === t) {
            if (!a) return !1;
            if ((0 === n && 0 > e) || (n >= d - c && e > 0))
              return !l.wheelPropagation;
          }
          return !0;
        },
        H = function() {
          l.wheelSpeed /= 10;
          var e = !1;
          s.bind("mousewheel" + X, function(t, o, n, r) {
            var c = t.deltaX * t.deltaFactor || n,
              u = t.deltaY * t.deltaFactor || r;
            (e = !1), l.useBothWheelAxes ? (i && !a ? (u ? s.scrollTop(s.scrollTop() - u * l.wheelSpeed) : s.scrollTop(s.scrollTop() + c * l.wheelSpeed), (e = !0)) : a && !i && (c ? s.scrollLeft(s.scrollLeft() + c * l.wheelSpeed) : s.scrollLeft(s.scrollLeft() - u * l.wheelSpeed), (e = !0))) : (s.scrollTop(s.scrollTop() - u * l.wheelSpeed), s.scrollLeft(s.scrollLeft() + c * l.wheelSpeed)), j(), (e = e || E(c, u)), e && (t.stopPropagation(), t.preventDefault());
          }), s.bind("MozMousePixelScroll" + X, function(t) {
            e && t.preventDefault();
          });
        },
        A = function() {
          var t = !1;
          s.bind("mouseenter" + X, function() {
            t = !0;
          }), s.bind("mouseleave" + X, function() {
            t = !1;
          });
          var o = !1;
          e(document).bind("keydown" + X, function(n) {
            if (
              t &&
              !e(document.activeElement).is(":input,[contenteditable]")
            ) {
              var r = 0,
                l = 0;
              switch (n.which) {
                case 37:
                  r = -30;
                  break;
                case 38:
                  l = 30;
                  break;
                case 39:
                  r = 30;
                  break;
                case 40:
                  l = -30;
                  break;
                case 33:
                  l = 90;
                  break;
                case 32:
                case 34:
                  l = -90;
                  break;
                case 35:
                  l = -u;
                  break;
                case 36:
                  l = u;
                  break;
                default:
                  return;
              }
              s.scrollTop(s.scrollTop() - l), s.scrollLeft(
                s.scrollLeft() + r
              ), (o = E(r, l)), o && n.preventDefault();
            }
          });
        },
        q = function() {
          var e = function(e) {
            e.stopPropagation();
          };
          T.bind("click" + X, e), m.bind("click" + X, function(e) {
            var t = parseInt(v / 2, 10),
              o = e.pageY - m.offset().top - t,
              n = u - v,
              r = o / n;
            0 > r ? (r = 0) : r > 1 && (r = 1), s.scrollTop((p - u) * r);
          }), w.bind("click" + X, e), b.bind("click" + X, function(e) {
            var t = parseInt(f / 2, 10),
              o = e.pageX - b.offset().left - t,
              n = c - f,
              r = o / n;
            0 > r ? (r = 0) : r > 1 && (r = 1), s.scrollLeft((d - c) * r);
          });
        },
        F = function() {
          var t = function(e, t) {
            s.scrollTop(s.scrollTop() - t), s.scrollLeft(
              s.scrollLeft() - e
            ), j();
          },
            o = {},
            n = 0,
            r = {},
            l = null,
            a = !1;
          e(window).bind("touchstart" + X, function() {
            a = !0;
          }), e(window).bind("touchend" + X, function() {
            a = !1;
          }), s.bind("touchstart" + X, function(e) {
            var t = e.originalEvent.targetTouches[0];
            (o.pageX =
              t.pageX), (o.pageY = t.pageY), (n = new Date().getTime()), null !== l && clearInterval(l), e.stopPropagation();
          }), s.bind("touchmove" + X, function(e) {
            if (!a && 1 === e.originalEvent.targetTouches.length) {
              var l = e.originalEvent.targetTouches[0],
                s = {};
              (s.pageX = l.pageX), (s.pageY = l.pageY);
              var i = s.pageX - o.pageX,
                c = s.pageY - o.pageY;
              t(i, c), (o = s);
              var u = new Date().getTime(),
                d = u - n;
              d > 0 &&
                ((r.x = i / d), (r.y = c / d), (n = u)), e.preventDefault();
            }
          }), s.bind("touchend" + X, function() {
            clearInterval(l), (l = setInterval(function() {
              return 0.01 > Math.abs(r.x) && 0.01 > Math.abs(r.y)
                ? (clearInterval(l), void 0)
                : (t(30 * r.x, 30 * r.y), (r.x *= 0.8), (r.y *= 0.8), void 0);
            }, 10));
          });
        },
        z = function() {
          s.bind("scroll" + X, function() {
            j();
          });
        },
        B = function() {
          s.unbind(X), e(window).unbind(X), e(document).unbind(X), s.data(
            "perfect-scrollbar",
            null
          ), s.data("perfect-scrollbar-update", null), s.data(
            "perfect-scrollbar-destroy",
            null
          ), w.remove(), T.remove(), b.remove(), m.remove(), (b = m = w = T = a = i = c = u = d = p = f = h = L = y = S = v = g = I = x = M = P = X = null);
        },
        K = function(t) {
          s.addClass("ie").addClass("ie" + t);
          var o = function() {
            var t = function() {
              e(this).addClass("hover");
            },
              o = function() {
                e(this).removeClass("hover");
              };
            s.bind("mouseenter" + X, t).bind("mouseleave" + X, o), b
              .bind("mouseenter" + X, t)
              .bind("mouseleave" + X, o), m
              .bind("mouseenter" + X, t)
              .bind("mouseleave" + X, o), w
              .bind("mouseenter" + X, t)
              .bind("mouseleave" + X, o), T.bind("mouseenter" + X, t).bind(
              "mouseleave" + X,
              o
            );
          },
            n = function() {
              C = function() {
                var e = { left: h + s.scrollLeft(), width: f };
                y ? (e.bottom = L) : (e.top = S), w.css(e);
                var t = { top: g + s.scrollTop(), height: v };
                x ? (t.right = I) : (t.left = M), T.css(
                  t
                ), w.hide().show(), T.hide().show();
              };
            };
          6 === t && (o(), n());
        },
        Q =
          "ontouchstart" in window ||
          (window.DocumentTouch && document instanceof window.DocumentTouch),
        N = function() {
          var e = navigator.userAgent.toLowerCase().match(/(msie) ([\w.]+)/);
          e &&
            "msie" === e[1] &&
            K(parseInt(e[2], 10)), j(), z(), O(), W(), q(), Q &&
            F(), s.mousewheel && H(), l.useKeyboard && A(), s.data(
            "perfect-scrollbar",
            s
          ), s.data("perfect-scrollbar-update", j), s.data(
            "perfect-scrollbar-destroy",
            B
          );
        };
      return N(), s;
    });
  };
}), (function(e) {
  "function" == typeof define && define.amd
    ? define(["jquery"], e)
    : "object" == typeof exports ? (module.exports = e) : e(jQuery);
})(function(e) {
  function t(t) {
    var s = t || window.event,
      a = i.call(arguments, 1),
      c = 0,
      u = 0,
      d = 0,
      p = 0;
    if (
      (
        (t = e.event.fix(s)),
        (t.type = "mousewheel"),
        "detail" in s && (d = -1 * s.detail),
        "wheelDelta" in s && (d = s.wheelDelta),
        "wheelDeltaY" in s && (d = s.wheelDeltaY),
        "wheelDeltaX" in s && (u = -1 * s.wheelDeltaX),
        "axis" in s && s.axis === s.HORIZONTAL_AXIS && ((u = -1 * d), (d = 0)),
        (c = 0 === d ? u : d),
        "deltaY" in s && ((d = -1 * s.deltaY), (c = d)),
        "deltaX" in s && ((u = s.deltaX), 0 === d && (c = -1 * u)),
        0 !== d || 0 !== u
      )
    ) {
      if (1 === s.deltaMode) {
        var f = e.data(this, "mousewheel-line-height");
        (c *= f), (d *= f), (u *= f);
      } else if (2 === s.deltaMode) {
        var h = e.data(this, "mousewheel-page-height");
        (c *= h), (d *= h), (u *= h);
      }
      return (p = Math.max(Math.abs(d), Math.abs(u))), (!l || l > p) &&
        ((l = p), n(s, p) && (l /= 40)), n(s, p) &&
        ((c /= 40), (u /= 40), (d /= 40)), (c = Math[c >= 1 ? "floor" : "ceil"](
        c / l
      )), (u = Math[u >= 1 ? "floor" : "ceil"](u / l)), (d = Math[
        d >= 1 ? "floor" : "ceil"
      ](
        d / l
      )), (t.deltaX = u), (t.deltaY = d), (t.deltaFactor = l), (t.deltaMode = 0), a.unshift(
        t,
        c,
        u,
        d
      ), r && clearTimeout(r), (r = setTimeout(o, 200)), (e.event.dispatch ||
        e.event.handle)
        .apply(this, a);
    }
  }
  function o() {
    l = null;
  }
  function n(e, t) {
    return (
      u.settings.adjustOldDeltas && "mousewheel" === e.type && 0 === t % 120
    );
  }
  var r,
    l,
    s = ["wheel", "mousewheel", "DOMMouseScroll", "MozMousePixelScroll"],
    a = "onwheel" in document || document.documentMode >= 9
      ? ["wheel"]
      : ["mousewheel", "DomMouseScroll", "MozMousePixelScroll"],
    i = Array.prototype.slice;
  if (e.event.fixHooks)
    for (var c = s.length; c; ) e.event.fixHooks[s[--c]] = e.event.mouseHooks;
  var u = (e.event.special.mousewheel = {
    version: "3.1.9",
    setup: function() {
      if (this.addEventListener)
        for (var o = a.length; o; ) this.addEventListener(a[--o], t, !1);
      else this.onmousewheel = t;
      e.data(this, "mousewheel-line-height", u.getLineHeight(this)), e.data(
        this,
        "mousewheel-page-height",
        u.getPageHeight(this)
      );
    },
    teardown: function() {
      if (this.removeEventListener)
        for (var e = a.length; e; ) this.removeEventListener(a[--e], t, !1);
      else this.onmousewheel = null;
    },
    getLineHeight: function(t) {
      return parseInt(
        e(t)
          ["offsetParent" in e.fn ? "offsetParent" : "parent"]()
          .css("fontSize"),
        10
      );
    },
    getPageHeight: function(t) {
      return e(t).height();
    },
    settings: { adjustOldDeltas: !0 }
  });
  e.fn.extend({
    mousewheel: function(e) {
      return e ? this.bind("mousewheel", e) : this.trigger("mousewheel");
    },
    unmousewheel: function(e) {
      return this.unbind("mousewheel", e);
    }
  });
});

/*!
 * clipboard.js v1.5.10
 * https://zenorocha.github.io/clipboard.js
 *
 * Licensed MIT © Zeno Rocha
 */
!(function(t) {
  if ("object" == typeof exports && "undefined" != typeof module)
    module.exports = t();
  else if ("function" == typeof define && define.amd) define([], t);
  else {
    var e;
    (e = "undefined" != typeof window
      ? window
      : "undefined" != typeof global
        ? global
        : "undefined" != typeof self ? self : this), (e.Clipboard = t());
  }
})(function() {
  var t, e, n;
  return (function t(e, n, o) {
    function i(c, a) {
      if (!n[c]) {
        if (!e[c]) {
          var s = "function" == typeof require && require;
          if (!a && s) return s(c, !0);
          if (r) return r(c, !0);
          var l = new Error("Cannot find module '" + c + "'");
          throw ((l.code = "MODULE_NOT_FOUND"), l);
        }
        var u = (n[c] = { exports: {} });
        e[c][0].call(
          u.exports,
          function(t) {
            var n = e[c][1][t];
            return i(n ? n : t);
          },
          u,
          u.exports,
          t,
          e,
          n,
          o
        );
      }
      return n[c].exports;
    }
    for (
      var r = "function" == typeof require && require, c = 0;
      c < o.length;
      c++
    )
      i(o[c]);
    return i;
  })(
    {
      1: [
        function(t, e, n) {
          var o = t("matches-selector");
          e.exports = function(t, e, n) {
            for (var i = n ? t : t.parentNode; i && i !== document; ) {
              if (o(i, e)) return i;
              i = i.parentNode;
            }
          };
        },
        { "matches-selector": 5 }
      ],
      2: [
        function(t, e, n) {
          function o(t, e, n, o, r) {
            var c = i.apply(this, arguments);
            return t.addEventListener(n, c, r), {
              destroy: function() {
                t.removeEventListener(n, c, r);
              }
            };
          }
          function i(t, e, n, o) {
            return function(n) {
              (n.delegateTarget = r(n.target, e, !0)), n.delegateTarget &&
                o.call(t, n);
            };
          }
          var r = t("closest");
          e.exports = o;
        },
        { closest: 1 }
      ],
      3: [
        function(t, e, n) {
          (n.node = function(t) {
            return void 0 !== t && t instanceof HTMLElement && 1 === t.nodeType;
          }), (n.nodeList = function(t) {
            var e = Object.prototype.toString.call(t);
            return (
              void 0 !== t &&
              ("[object NodeList]" === e || "[object HTMLCollection]" === e) &&
              "length" in t &&
              (0 === t.length || n.node(t[0]))
            );
          }), (n.string = function(t) {
            return "string" == typeof t || t instanceof String;
          }), (n.fn = function(t) {
            var e = Object.prototype.toString.call(t);
            return "[object Function]" === e;
          });
        },
        {}
      ],
      4: [
        function(t, e, n) {
          function o(t, e, n) {
            if (!t && !e && !n) throw new Error("Missing required arguments");
            if (!a.string(e))
              throw new TypeError("Second argument must be a String");
            if (!a.fn(n))
              throw new TypeError("Third argument must be a Function");
            if (a.node(t)) return i(t, e, n);
            if (a.nodeList(t)) return r(t, e, n);
            if (a.string(t)) return c(t, e, n);
            throw new TypeError(
              "First argument must be a String, HTMLElement, HTMLCollection, or NodeList"
            );
          }
          function i(t, e, n) {
            return t.addEventListener(e, n), {
              destroy: function() {
                t.removeEventListener(e, n);
              }
            };
          }
          function r(t, e, n) {
            return Array.prototype.forEach.call(t, function(t) {
              t.addEventListener(e, n);
            }), {
              destroy: function() {
                Array.prototype.forEach.call(t, function(t) {
                  t.removeEventListener(e, n);
                });
              }
            };
          }
          function c(t, e, n) {
            return s(document.body, t, e, n);
          }
          var a = t("./is"),
            s = t("delegate");
          e.exports = o;
        },
        { "./is": 3, delegate: 2 }
      ],
      5: [
        function(t, e, n) {
          function o(t, e) {
            if (r) return r.call(t, e);
            for (
              var n = t.parentNode.querySelectorAll(e), o = 0;
              o < n.length;
              ++o
            )
              if (n[o] == t) return !0;
            return !1;
          }
          var i = Element.prototype,
            r =
              i.matchesSelector ||
              i.webkitMatchesSelector ||
              i.mozMatchesSelector ||
              i.msMatchesSelector ||
              i.oMatchesSelector;
          e.exports = o;
        },
        {}
      ],
      6: [
        function(t, e, n) {
          function o(t) {
            var e;
            if ("INPUT" === t.nodeName || "TEXTAREA" === t.nodeName)
              t.focus(), t.setSelectionRange(0, t.value.length), (e = t.value);
            else {
              t.hasAttribute("contenteditable") && t.focus();
              var n = window.getSelection(),
                o = document.createRange();
              o.selectNodeContents(t), n.removeAllRanges(), n.addRange(
                o
              ), (e = n.toString());
            }
            return e;
          }
          e.exports = o;
        },
        {}
      ],
      7: [
        function(t, e, n) {
          function o() {}
          (o.prototype = {
            on: function(t, e, n) {
              var o = this.e || (this.e = {});
              return (o[t] || (o[t] = [])).push({ fn: e, ctx: n }), this;
            },
            once: function(t, e, n) {
              function o() {
                i.off(t, o), e.apply(n, arguments);
              }
              var i = this;
              return (o._ = e), this.on(t, o, n);
            },
            emit: function(t) {
              var e = [].slice.call(arguments, 1),
                n = ((this.e || (this.e = {}))[t] || []).slice(),
                o = 0,
                i = n.length;
              for (o; i > o; o++) n[o].fn.apply(n[o].ctx, e);
              return this;
            },
            off: function(t, e) {
              var n = this.e || (this.e = {}),
                o = n[t],
                i = [];
              if (o && e)
                for (var r = 0, c = o.length; c > r; r++)
                  o[r].fn !== e && o[r].fn._ !== e && i.push(o[r]);
              return i.length ? (n[t] = i) : delete n[t], this;
            }
          }), (e.exports = o);
        },
        {}
      ],
      8: [
        function(e, n, o) {
          !(function(i, r) {
            if ("function" == typeof t && t.amd) t(["module", "select"], r);
            else if ("undefined" != typeof o) r(n, e("select"));
            else {
              var c = { exports: {} };
              r(c, i.select), (i.clipboardAction = c.exports);
            }
          })(this, function(t, e) {
            "use strict";
            function n(t) {
              return t && t.__esModule ? t : { default: t };
            }
            function o(t, e) {
              if (!(t instanceof e))
                throw new TypeError("Cannot call a class as a function");
            }
            var i = n(e),
              r = "function" == typeof Symbol &&
                "symbol" == typeof Symbol.iterator
                ? function(t) {
                    return typeof t;
                  }
                : function(t) {
                    return t &&
                      "function" == typeof Symbol &&
                      t.constructor === Symbol
                      ? "symbol"
                      : typeof t;
                  },
              c = (function() {
                function t(t, e) {
                  for (var n = 0; n < e.length; n++) {
                    var o = e[n];
                    (o.enumerable =
                      o.enumerable || !1), (o.configurable = !0), "value" in
                      o && (o.writable = !0), Object.defineProperty(
                      t,
                      o.key,
                      o
                    );
                  }
                }
                return function(e, n, o) {
                  return n && t(e.prototype, n), o && t(e, o), e;
                };
              })(),
              a = (function() {
                function t(e) {
                  o(this, t), this.resolveOptions(e), this.initSelection();
                }
                return (t.prototype.resolveOptions = function t() {
                  var e = arguments.length <= 0 || void 0 === arguments[0]
                    ? {}
                    : arguments[0];
                  (this.action = e.action), (this.emitter =
                    e.emitter), (this.target = e.target), (this.text =
                    e.text), (this.trigger = e.trigger), (this.selectedText =
                    "");
                }), (t.prototype.initSelection = function t() {
                  this.text
                    ? this.selectFake()
                    : this.target && this.selectTarget();
                }), (t.prototype.selectFake = function t() {
                  var e = this,
                    n = "rtl" == document.documentElement.getAttribute("dir");
                  this.removeFake(), (this.fakeHandler = document.body.addEventListener(
                    "click",
                    function() {
                      return e.removeFake();
                    }
                  )), (this.fakeElem = document.createElement(
                    "textarea"
                  )), (this.fakeElem.style.fontSize =
                    "12pt"), (this.fakeElem.style.border =
                    "0"), (this.fakeElem.style.padding =
                    "0"), (this.fakeElem.style.margin =
                    "0"), (this.fakeElem.style.position =
                    "fixed"), (this.fakeElem.style[n ? "right" : "left"] =
                    "-9999px"), (this.fakeElem.style.top =
                    (window.pageYOffset || document.documentElement.scrollTop) +
                    "px"), this.fakeElem.setAttribute(
                    "readonly",
                    ""
                  ), (this.fakeElem.value = this.text), document.body.appendChild(
                    this.fakeElem
                  ), (this.selectedText = (0, i.default)(
                    this.fakeElem
                  )), this.copyText();
                }), (t.prototype.removeFake = function t() {
                  this.fakeHandler &&
                    (
                      document.body.removeEventListener("click"),
                      (this.fakeHandler = null)
                    ), this.fakeElem &&
                    (
                      document.body.removeChild(this.fakeElem),
                      (this.fakeElem = null)
                    );
                }), (t.prototype.selectTarget = function t() {
                  (this.selectedText = (0, i.default)(
                    this.target
                  )), this.copyText();
                }), (t.prototype.copyText = function t() {
                  var e = void 0;
                  try {
                    e = document.execCommand(this.action);
                  } catch (n) {
                    e = !1;
                  }
                  this.handleResult(e);
                }), (t.prototype.handleResult = function t(e) {
                  e
                    ? this.emitter.emit("success", {
                        action: this.action,
                        text: this.selectedText,
                        trigger: this.trigger,
                        clearSelection: this.clearSelection.bind(this)
                      })
                    : this.emitter.emit("error", {
                        action: this.action,
                        trigger: this.trigger,
                        clearSelection: this.clearSelection.bind(this)
                      });
                }), (t.prototype.clearSelection = function t() {
                  this.target &&
                    this.target.blur(), window.getSelection().removeAllRanges();
                }), (t.prototype.destroy = function t() {
                  this.removeFake();
                }), c(t, [
                  {
                    key: "action",
                    set: function t() {
                      var e = arguments.length <= 0 || void 0 === arguments[0]
                        ? "copy"
                        : arguments[0];
                      if (
                        (
                          (this._action = e),
                          "copy" !== this._action && "cut" !== this._action
                        )
                      )
                        throw new Error(
                          'Invalid "action" value, use either "copy" or "cut"'
                        );
                    },
                    get: function t() {
                      return this._action;
                    }
                  },
                  {
                    key: "target",
                    set: function t(e) {
                      if (void 0 !== e) {
                        if (
                          !e ||
                          "object" !==
                            ("undefined" == typeof e ? "undefined" : r(e)) ||
                          1 !== e.nodeType
                        )
                          throw new Error(
                            'Invalid "target" value, use a valid Element'
                          );
                        if (
                          "copy" === this.action &&
                          e.hasAttribute("disabled")
                        )
                          throw new Error(
                            'Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute'
                          );
                        if (
                          "cut" === this.action &&
                          (e.hasAttribute("readonly") ||
                            e.hasAttribute("disabled"))
                        )
                          throw new Error(
                            'Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes'
                          );
                        this._target = e;
                      }
                    },
                    get: function t() {
                      return this._target;
                    }
                  }
                ]), t;
              })();
            t.exports = a;
          });
        },
        { select: 6 }
      ],
      9: [
        function(e, n, o) {
          !(function(i, r) {
            if ("function" == typeof t && t.amd)
              t(
                [
                  "module",
                  "./clipboard-action",
                  "tiny-emitter",
                  "good-listener"
                ],
                r
              );
            else if ("undefined" != typeof o)
              r(
                n,
                e("./clipboard-action"),
                e("tiny-emitter"),
                e("good-listener")
              );
            else {
              var c = { exports: {} };
              r(
                c,
                i.clipboardAction,
                i.tinyEmitter,
                i.goodListener
              ), (i.clipboard = c.exports);
            }
          })(this, function(t, e, n, o) {
            "use strict";
            function i(t) {
              return t && t.__esModule ? t : { default: t };
            }
            function r(t, e) {
              if (!(t instanceof e))
                throw new TypeError("Cannot call a class as a function");
            }
            function c(t, e) {
              if (!t)
                throw new ReferenceError(
                  "this hasn't been initialised - super() hasn't been called"
                );
              return !e || ("object" != typeof e && "function" != typeof e)
                ? t
                : e;
            }
            function a(t, e) {
              if ("function" != typeof e && null !== e)
                throw new TypeError(
                  "Super expression must either be null or a function, not " +
                    typeof e
                );
              (t.prototype = Object.create(e && e.prototype, {
                constructor: {
                  value: t,
                  enumerable: !1,
                  writable: !0,
                  configurable: !0
                }
              })), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : (t.__proto__ = e));
            }
            function s(t, e) {
              var n = "data-clipboard-" + t;
              if (e.hasAttribute(n)) return e.getAttribute(n);
            }
            var l = i(e),
              u = i(n),
              f = i(o),
              d = (function(t) {
                function e(n, o) {
                  r(this, e);
                  var i = c(this, t.call(this));
                  return i.resolveOptions(o), i.listenClick(n), i;
                }
                return a(e, t), (e.prototype.resolveOptions = function t() {
                  var e = arguments.length <= 0 || void 0 === arguments[0]
                    ? {}
                    : arguments[0];
                  (this.action = "function" == typeof e.action
                    ? e.action
                    : this.defaultAction), (this.target = "function" ==
                    typeof e.target
                    ? e.target
                    : this.defaultTarget), (this.text = "function" ==
                    typeof e.text
                    ? e.text
                    : this.defaultText);
                }), (e.prototype.listenClick = function t(e) {
                  var n = this;
                  this.listener = (0, f.default)(e, "click", function(t) {
                    return n.onClick(t);
                  });
                }), (e.prototype.onClick = function t(e) {
                  var n = e.delegateTarget || e.currentTarget;
                  this.clipboardAction &&
                    (this.clipboardAction = null), (this.clipboardAction = new l.default(
                    {
                      action: this.action(n),
                      target: this.target(n),
                      text: this.text(n),
                      trigger: n,
                      emitter: this
                    }
                  ));
                }), (e.prototype.defaultAction = function t(e) {
                  return s("action", e);
                }), (e.prototype.defaultTarget = function t(e) {
                  var n = s("target", e);
                  return n ? document.querySelector(n) : void 0;
                }), (e.prototype.defaultText = function t(e) {
                  return s("text", e);
                }), (e.prototype.destroy = function t() {
                  this.listener.destroy(), this.clipboardAction &&
                    (
                      this.clipboardAction.destroy(),
                      (this.clipboardAction = null)
                    );
                }), e;
              })(u.default);
            t.exports = d;
          });
        },
        { "./clipboard-action": 8, "good-listener": 4, "tiny-emitter": 7 }
      ]
    },
    {},
    [9]
  )(9);
});

/*! ngclipboard - v1.1.1 - 2016-02-26
* https://github.com/sachinchoolur/ngclipboard
* Copyright (c) 2016 Sachin; Licensed MIT */
!(function() {
  "use strict";
  var a,
    b,
    c = "ngclipboard";
  "object" == typeof module && module.exports
    ? (
        (a = window.angular),
        (b = window.Clipboard),
        (module.exports = c)
      )
    : ((a = window.angular), (b = window.Clipboard)), a
    .module(c, [])
    .directive("ngclipboard", ['$timeout', function($timeout) {
      return {
        restrict: "A",
        scope: { ngclipboardSuccess: "&", ngclipboardError: "&" },
        link: function(a, c) {
          var d = new b(c[0]);
          d.on("success", function(b) {
            $timeout(function () {
                a.$apply(function() {
                    a.ngclipboardSuccess({ e: b });
                });
            });
          }), d.on("error", function(b) {
            $timeout(function () {
                a.$apply(function() {
                    a.ngclipboardError({ e: b });
                });
            });
          });
        }
      };
    }]);
})();
