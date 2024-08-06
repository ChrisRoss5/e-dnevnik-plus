(function () {
  "use strict";
  var e = {
      8563: function (e, a, i) {
        var n = i(9963),
          t = i(6252),
          o = i(3577);
        const r = { id: "background" };
        function s(e, a, i, n, s, l) {
          const d = (0, t.up)("Wrapper"),
            p = (0, t.up)("Previews");
          return (
            (0, t.wg)(),
            (0, t.iD)(
              t.HY,
              null,
              [
                (0, t.Wm)(d),
                "/" == e.$route.path
                  ? ((0, t.wg)(), (0, t.j4)(p, { key: 0 }))
                  : (0, t.kq)("", !0),
                (0, t._)("div", r, [
                  ((0, t.wg)(!0),
                  (0, t.iD)(
                    t.HY,
                    null,
                    (0, t.Ko)(
                      e.rectangles,
                      (e, a) => (
                        (0, t.wg)(),
                        (0, t.iD)(
                          "div",
                          { key: a, class: "rect", style: (0, o.j5)(e) },
                          null,
                          4,
                        )
                      ),
                    ),
                    128,
                  )),
                ]),
              ],
              64,
            )
          );
        }
        const l = { id: "wrapper" },
          d = { key: 0, id: "important", class: "very-important" },
          p = ["innerHTML"],
          u = { id: "important" },
          c = { key: 0 },
          v = ["innerHTML"],
          k = { id: "urls" },
          m = { id: "heading" },
          g = (0, t._)("div", { id: "ed", class: "ed" }, "e-Dnevnik", -1),
          j = (0, t._)("div", { id: "plus", class: "plus" }, "Plus", -1),
          b = (0, t._)(
            "div",
            { id: "subtitle" },
            "Proširenje za školski e-Dnevnik",
            -1,
          ),
          A = (0, t._)(
            "div",
            { style: { color: "gray" } },
            " Ovo proširenje nije službena CARNET-ova aplikacija. ",
            -1,
          ),
          h = (0, t._)(
            "a",
            {
              class: "plus",
              href: "mailto:kristijan.ros@gmail.com?subject=e-Dnevnik Plus — Kontakt",
            },
            " kristijan.ros@gmail.com",
            -1,
          ),
          f = (0, t._)(
            "a",
            { class: "plus", href: "https://k1k1.dev/", target: "_blank" },
            "k1k1.dev",
            -1,
          );
        function w(e, a, i, r, s, w) {
          const C = (0, t.up)("router-link"),
            z = (0, t.up)("router-view");
          return (
            (0, t.wg)(),
            (0, t.iD)("div", l, [
              e.importantMessage
                ? ((0, t.wg)(),
                  (0, t.iD)("div", d, [
                    (0, t._)(
                      "span",
                      { innerHTML: e.importantMessage },
                      null,
                      8,
                      p,
                    ),
                  ]))
                : (0, t.kq)("", !0),
              (0, t._)("div", u, [
                e.$inApp
                  ? ((0, t.wg)(),
                    (0, t.iD)(
                      "strong",
                      c,
                      " Tvoja trenutno instalirana verzija proširenja: " +
                        (0, o.zw)(e.$lastVersion),
                      1,
                    ))
                  : ((0, t.wg)(),
                    (0, t.iD)(
                      t.HY,
                      { key: 1 },
                      [
                        (0, t.Wm)(
                          n.uT,
                          { name: "opacity" },
                          {
                            default: (0, t.w5)(() => [
                              e.message
                                ? ((0, t.wg)(),
                                  (0, t.iD)(
                                    "span",
                                    { key: 0, innerHTML: e.message },
                                    null,
                                    8,
                                    v,
                                  ))
                                : (0, t.kq)("", !0),
                            ]),
                            _: 1,
                          },
                        ),
                        (0, t.Uk)("  "),
                      ],
                      64,
                    )),
                (0, t._)("div", k, [
                  (0, t.Wm)(
                    C,
                    { to: "/povijest" },
                    { default: (0, t.w5)(() => [(0, t.Uk)("Verzije")]), _: 1 },
                  ),
                  (0, t.Wm)(
                    C,
                    { to: "/autor" },
                    { default: (0, t.w5)(() => [(0, t.Uk)("Autor")]), _: 1 },
                  ),
                ]),
              ]),
              (0, t._)("div", m, [
                (0, t.Wm)(
                  C,
                  { to: "/", id: "title" },
                  { default: (0, t.w5)(() => [g, j]), _: 1 },
                ),
                b,
              ]),
              (0, t.Wm)(z, { class: "router-view" }),
              (0, t.Wm)(
                n.uT,
                { name: "opacity" },
                {
                  default: (0, t.w5)(() => [
                    (0, t.wy)(
                      (0, t._)(
                        "div",
                        {
                          id: "footer",
                          class: (0, o.C_)({ default: "/" != e.$route.path }),
                        },
                        [
                          A,
                          (0, t.Uk)(
                            " 2019.-" +
                              (0, o.zw)(new Date().getFullYear()) +
                              ". | ",
                            1,
                          ),
                          h,
                          (0, t.Uk)(" | "),
                          f,
                          (0, t.Uk)(" | "),
                          (0, t.Wm)(
                            C,
                            { to: "politika-privatnosti", class: "plus" },
                            {
                              default: (0, t.w5)(() => [
                                (0, t.Uk)(" politika privatnosti"),
                              ]),
                              _: 1,
                            },
                          ),
                        ],
                        2,
                      ),
                      [
                        [
                          n.F8,
                          "/" != e.$route.path ||
                            0 == e.scrollTop ||
                            e.$isMobile,
                        ],
                      ],
                    ),
                  ]),
                  _: 1,
                },
              ),
            ])
          );
        }
        var C = (0, t.aZ)({
            name: "Wrapper",
            data() {
              return { scrollTop: 0, message: "", importantMessage: "" };
            },
            mounted() {
              document.body.addEventListener(
                "scroll",
                () => (this.scrollTop = document.body.scrollTop),
              ),
                fetch("https://ednevnik.plus/users.html")
                  .then((e) => e.text())
                  .then((e) => (this.message = e)),
                fetch("https://ednevnik.plus/important.html")
                  .then((e) => e.text())
                  .then((e) => {
                    e.startsWith("<script>") || (this.importantMessage = e);
                  });
            },
          }),
          z = i(3744);
        const U = (0, z.Z)(C, [["render", w]]);
        var B = U,
          y = i.p + "media/light-tour.2b6a80ea.mp4",
          P = i.p + "media/dark-tour.0403e220.mp4";
        const D = (e) => (
            (0, t.dD)("data-v-05876fa5"), (e = e()), (0, t.Cn)(), e
          ),
          S = { id: "previews" },
          x = { id: "tour", class: "flex-center" },
          E = D(() =>
            (0, t._)(
              "div",
              { class: "ed" },
              [
                (0, t.Uk)(" e-Dnevnik "),
                (0, t._)("span", { class: "plus" }, "Plus App"),
                (0, t.Uk)(" — Obilazak "),
              ],
              -1,
            ),
          ),
          O = { id: "types" };
        function L(e, a, i, r, s, l) {
          return (
            (0, t.wg)(),
            (0, t.iD)("div", S, [
              (0, t._)("div", x, [
                E,
                (0, t._)("div", O, [
                  (0, t._)(
                    "a",
                    {
                      class: (0, o.C_)(["card", { plus: "light" == e.mode }]),
                      onClick: a[0] || (a[0] = (a) => (e.mode = "light")),
                    },
                    "Svijetli prikaz",
                    2,
                  ),
                  (0, t._)(
                    "a",
                    {
                      class: (0, o.C_)(["card", { plus: "dark" == e.mode }]),
                      onClick: a[1] || (a[1] = (a) => (e.mode = "dark")),
                    },
                    "Tamni prikaz",
                    2,
                  ),
                  (0, t._)(
                    "a",
                    {
                      class: (0, o.C_)(["card", { plus: "double" == e.mode }]),
                      onClick: a[2] || (a[2] = (a) => (e.mode = "double")),
                    },
                    "Dupli prikaz",
                    2,
                  ),
                  (0, t._)(
                    "a",
                    {
                      class: (0, o.C_)(["card", { plus: e.fast }]),
                      onClick:
                        a[3] ||
                        (a[3] = (...a) => e.changeSpeed && e.changeSpeed(...a)),
                    },
                    "Brzina " + (0, o.zw)(e.fast ? "x2" : "x1"),
                    3,
                  ),
                ]),
              ]),
              (0, t._)(
                "div",
                {
                  id: "videos",
                  class: (0, o.C_)([
                    "flex-center",
                    { double: "double" == e.mode },
                  ]),
                },
                [
                  (0, t.Wm)(
                    n.W3,
                    { name: "opacity" },
                    {
                      default: (0, t.w5)(() => [
                        (0, t.wy)(
                          (0, t._)(
                            "video",
                            {
                              ref: "light",
                              src: y,
                              muted: "",
                              autoplay: "",
                              controls: "",
                              loop: "",
                              onTimeupdate:
                                a[4] ||
                                (a[4] = (...a) =>
                                  e.timeUpdated && e.timeUpdated(...a)),
                              onPlay:
                                a[5] ||
                                (a[5] = (...a) =>
                                  e.timeUpdated && e.timeUpdated(...a)),
                              onPause:
                                a[6] ||
                                (a[6] = (...a) =>
                                  e.timeUpdated && e.timeUpdated(...a)),
                              key: "1",
                            },
                            null,
                            544,
                          ),
                          [[n.F8, "light" == e.mode || "double" == e.mode]],
                        ),
                        (0, t.wy)(
                          (0, t._)(
                            "video",
                            {
                              ref: "dark",
                              src: P,
                              muted: "",
                              autoplay: "",
                              controls: "",
                              loop: "",
                              onTimeupdate:
                                a[7] ||
                                (a[7] = (...a) =>
                                  e.timeUpdated && e.timeUpdated(...a)),
                              onPlay:
                                a[8] ||
                                (a[8] = (...a) =>
                                  e.timeUpdated && e.timeUpdated(...a)),
                              onPause:
                                a[9] ||
                                (a[9] = (...a) =>
                                  e.timeUpdated && e.timeUpdated(...a)),
                              key: "2",
                            },
                            null,
                            544,
                          ),
                          [[n.F8, "dark" == e.mode || "double" == e.mode]],
                        ),
                      ]),
                      _: 1,
                    },
                  ),
                ],
                2,
              ),
            ])
          );
        }
        var I = (0, t.aZ)({
          name: "Previews",
          data() {
            return { mode: "light", fast: !1, lightVid: null, darkVid: null };
          },
          mounted() {
            (this.lightVid = this.$refs.light),
              (this.darkVid = this.$refs.dark);
          },
          methods: {
            timeUpdated(e) {
              const a = e.target,
                i = a == this.lightVid ? this.darkVid : this.lightVid;
              if ("pause" == e.type) i.pause();
              else if ("play" == e.type) i.play();
              else {
                const n = a.currentTime - i.currentTime;
                "timeupdate" == e.type &&
                  Math.abs(n) > 0.5 &&
                  (i.currentTime = a.currentTime);
              }
            },
            changeSpeed() {
              (this.fast = !this.fast),
                (this.lightVid.playbackRate = this.darkVid.playbackRate =
                  this.fast ? 2 : 1);
            },
          },
        });
        const W = (0, z.Z)(I, [
          ["render", L],
          ["__scopeId", "data-v-05876fa5"],
        ]);
        var K = W,
          R = (0, t.aZ)({
            name: "App",
            components: { Wrapper: B, Previews: K },
            data() {
              return { scrolling: !1, rectangles: [], speed: 2e4 };
            },
            mounted() {
              for (let a = 0; a < 10; a++) this.updateRect(a, !0);
              const e = localStorage.getItem("path");
              e && (localStorage.removeItem("path"), this.$router.replace(e));
            },
            methods: {
              updateRect(e, a) {
                const i = this.rand(30, 150),
                  n = this.rand(0, 100),
                  t = a ? n + "%" : -i + "px",
                  o =
                    this.rand(this.speed, 2 * this.speed) *
                    (a ? 1 - n / 100 : 1);
                (this.rectangles[e] = { bottom: t, opacity: "1" }),
                  setTimeout(() => {
                    (this.rectangles[e] = {
                      bottom: "100%",
                      opacity: "0",
                      left: this.rand(-10, 100) + "%",
                      width: i + "px",
                      height: i + "px",
                      borderRadius: this.rand(i / 10, i / 3) + "px",
                      animation: "rotate " + 100 * i + "ms linear infinite",
                      transition: `bottom ${o}ms ease-out, opacity ${
                        0.2 * o
                      }ms ${0.5 * o}ms`,
                    }),
                      setTimeout(() => this.updateRect(e), o);
                  }, 100);
              },
              rand(e, a) {
                return Math.floor(Math.random() * (a - e + 1) + e);
              },
            },
          });
        const T = (0, z.Z)(R, [["render", s]]);
        var Q = T,
          q = i(2201),
          Z = i.p + "img/popup.62f5d213.png";
        const F = (e) => (
            (0, t.dD)("data-v-e4b0927a"), (e = e()), (0, t.Cn)(), e
          ),
          M = { class: "card content-card" },
          J = { id: "app-types", class: "card" },
          V = (0, t.uE)(
            '<h3 data-v-e4b0927a>Verzija 5.1<span data-v-e4b0927a>(7.1.2024.)</span></h3><ul data-v-e4b0927a><li data-v-e4b0927a> Proširenje je prilagođeno novoj verziji e-Dnevnika. Nakon 5 godina, vraćeni su prosjeci. </li><li data-v-e4b0927a>e-Dnevnik Plus <span class="plus" data-v-e4b0927a>Classic</span>:</li><ul data-v-e4b0927a><li data-v-e4b0927a>Nakon instalacije, ovo je zadana verzija proširenja.</li><li data-v-e4b0927a> Na stranici odabira predmeta, prosjek svakog predmeta moguće je mijenjati. <ul data-v-e4b0927a><li data-v-e4b0927a> Skrolanjem iznad predmetnog prosjeka povećava se ili smanjuje vrijednost. </li><li data-v-e4b0927a>Desnim klikom na predmetni prosjek poništava se izmjena.</li><li data-v-e4b0927a>Klikom na završni prosjek poništavaju se sve izmjene.</li></ul></li><li data-v-e4b0927a> Na stranici predmeta moguće je ručno unositi ocjene. <ul data-v-e4b0927a><li data-v-e4b0927a>Klikom na prosjek poništavaju se sve izmjene.</li></ul></li></ul><li data-v-e4b0927a>e-Dnevnik Plus <span class="plus" data-v-e4b0927a>App</span>:</li><ul data-v-e4b0927a><li data-v-e4b0927a>Riješeni problemi kompatibilnosti s novim e-Dnevnikom.</li><li data-v-e4b0927a>Ažurirani bodovi u kalkulatoru za upis u srednje škole.</li></ul></ul>',
            2,
          ),
          H = F(() => (0, t._)("span", null, "(2.3.2023.)", -1)),
          X = (0, t.uE)(
            '<ul data-v-e4b0927a><li data-v-e4b0927a>e-Dnevnik Plus <span class="plus" data-v-e4b0927a>App</span>:</li><ul data-v-e4b0927a><li data-v-e4b0927a>Dodana opcija &quot;Ispis potvrda&quot; klikom na korisnika.</li><li data-v-e4b0927a> Ažuriran kalkulator za upis u srednje škole. <ul data-v-e4b0927a><li data-v-e4b0927a>Ažurirani dodatni bodovi.</li><li data-v-e4b0927a>Ažurirani bodovi potrebni za upis.</li></ul></li></ul></ul><h3 data-v-e4b0927a>Verzija 5.0.1<span data-v-e4b0927a>(22.11.2021.)</span></h3><ul data-v-e4b0927a><li data-v-e4b0927a>e-Dnevnik Plus <span class="plus" data-v-e4b0927a>App</span>:</li><ul data-v-e4b0927a><li data-v-e4b0927a> Opcija &quot;Prikaži boje ocjena&quot; podjeljena je na dvije nove opcije: <ul data-v-e4b0927a><li data-v-e4b0927a>Prikaži boje ocjena po ukupnom broju</li><li data-v-e4b0927a>Prikaži boje ocjena po mjesecima</li></ul></li><li data-v-e4b0927a>Smanjen zum cijele aplikacije za 10%.</li><li data-v-e4b0927a>Dodana opcija prikaza lozinke kod prijave.</li></ul><li data-v-e4b0927a>e-Dnevnik Plus <span class="plus" data-v-e4b0927a>Classic</span>:</li><ul data-v-e4b0927a><li data-v-e4b0927a> Dodana opcija automatske prijave (kvačica na /login stranici). </li></ul></ul><h3 data-v-e4b0927a>Verzija 5.0<span data-v-e4b0927a>(11.11.2021.)</span></h3><ul data-v-e4b0927a><li data-v-e4b0927a>Uklonjene sve funkcionalnosti prethodne verzije proširenja.</li><li data-v-e4b0927a> Novi prozor proširenja omogućuje odabir verzije e-Dnevnika: <span class="plus" data-v-e4b0927a>App</span> ili <span class="plus" data-v-e4b0927a>Classic</span><br data-v-e4b0927a> Odabrana verzija postaje zadana te se svaki put otvara navigacijom na <a href="ocjene.skole.hr" class="plus" data-v-e4b0927a>ocjene.skole.hr</a><img class="card" src="' +
              Z +
              '" data-v-e4b0927a></li><li data-v-e4b0927a><span class="plus" data-v-e4b0927a>App</span> verzija je nova aplikacija za napredan pregled sadržaja s e-Dnevnika: <ul data-v-e4b0927a><li data-v-e4b0927a> Osnovne lokacije su: Razred, Kalendar, Statistika ocjena i Kalkulator bodova. </li><li data-v-e4b0927a> Sve promjene ostaju automatski spremljene za prijavljenog korisnika. </li></ul></li><li data-v-e4b0927a><span class="plus" data-v-e4b0927a>Classic</span> verzija dodaje prosjeke na stranici e-Dnevnika: <ul data-v-e4b0927a><li data-v-e4b0927a> Na stranici odabira predmeta, za svaki predmet i završni prosjek. </li><li data-v-e4b0927a>Na stranici predmeta.</li></ul></li></ul><h3 data-v-e4b0927a>Verzija &lt;= 4.8<span data-v-e4b0927a>(21.3.2019.)</span></h3><a class="plus" href="https://chrisross5.github.io/e-dnevnik-plus-homepage-old/" data-v-e4b0927a>https://chrisross5.github.io/e-dnevnik-plus-homepage-old/</a>',
            7,
          );
        function N(e, a, i, n, r, s) {
          return (
            (0, t.wg)(),
            (0, t.iD)("div", M, [
              (0, t._)("h2", null, [
                (0, t.Uk)(" Povijest ažuriranja "),
                (0, t._)("div", J, [
                  (0, t._)(
                    "div",
                    {
                      class: (0, o.C_)({ "selected-app": !e.selectedApp }),
                      onClick: a[0] || (a[0] = (a) => (e.selectedApp = 0)),
                    },
                    " za učenike i roditelje ",
                    2,
                  ),
                  (0, t._)(
                    "div",
                    {
                      class: (0, o.C_)({ "selected-app": e.selectedApp }),
                      onClick: a[1] || (a[1] = (a) => (e.selectedApp = 1)),
                    },
                    " za nastavnike ",
                    2,
                  ),
                ]),
              ]),
              e.selectedApp
                ? ((0, t.wg)(),
                  (0, t.iD)(t.HY, { key: 1 }, [(0, t.Uk)("Nema novosti.")], 64))
                : ((0, t.wg)(),
                  (0, t.iD)(
                    t.HY,
                    { key: 0 },
                    [
                      V,
                      (0, t._)("h3", null, [
                        (0, t.Uk)("Verzija " + (0, o.zw)(e.$lastVersion), 1),
                        H,
                      ]),
                      X,
                    ],
                    64,
                  )),
            ])
          );
        }
        var G = (0, t.aZ)({
          name: "Changelog",
          data() {
            return { selectedApp: 0 };
          },
        });
        const _ = (0, z.Z)(G, [
          ["render", N],
          ["__scopeId", "data-v-e4b0927a"],
        ]);
        var Y = _,
          $ = i.p + "img/python2.e09cf982.png",
          ee = i.p + "img/v1.32af317d.png",
          ae = i.p + "img/v2.a7c7f435.png",
          ie = i.p + "img/v3.2ba4d694.png";
        const ne = (e) => (
            (0, t.dD)("data-v-13419404"), (e = e()), (0, t.Cn)(), e
          ),
          te = { class: "card content-card" },
          oe = ne(() => (0, t._)("h2", null, "Povijest razvoja", -1)),
          re = ne(() => (0, t._)("img", { src: $ }, null, -1)),
          se = ne(() => (0, t._)("br", null, null, -1)),
          le = ne(() => (0, t._)("br", null, null, -1)),
          de = ne(() => (0, t._)("img", { src: ee }, null, -1)),
          pe = ne(() =>
            (0, t._)(
              "a",
              {
                class: "plus",
                href: "https://www.srednja.hr/zbornica/srednjoskolac-iz-broda-osmislio-program-e-dnevnik-plus-predvida-prosjek-ocjena/",
                target: "_blank",
              },
              " članak",
              -1,
            ),
          ),
          ue = ne(() =>
            (0, t._)(
              "a",
              {
                class: "plus",
                href: "https://chrisross5.github.io/e-dnevnik-plus-homepage-old/skole/",
                target: "_blank",
              },
              "e-Dnevnik Plus za škole",
              -1,
            ),
          ),
          ce = ne(() => (0, t._)("br", null, null, -1)),
          ve = ne(() => (0, t._)("br", null, null, -1)),
          ke = ne(() => (0, t._)("img", { src: ae }, null, -1)),
          me = ne(() =>
            (0, t._)(
              "a",
              {
                class: "plus",
                href: "https://www.youtube.com/watch?v=t_lQPHSU8T4&list=PLzgE2RyhiYODJlMcdx7AzpmclEBe0Dbeo&ab_channel=KristijanRoss",
                target: "_blank",
              },
              " Playlista na Youtubeu",
              -1,
            ),
          ),
          ge = ne(() =>
            (0, t._)(
              "a",
              {
                class: "plus",
                href: "https://chrisross5.github.io/e-dnevnik-plus-homepage-old/",
                target: "_blank",
              },
              " ovdje",
              -1,
            ),
          ),
          je = ne(() => (0, t._)("br", null, null, -1)),
          be = ne(() => (0, t._)("br", null, null, -1)),
          Ae = ne(() => (0, t._)("img", { src: ie }, null, -1)),
          he = ne(() =>
            (0, t._)(
              "a",
              {
                class: "plus",
                href: "https://informatika.azoo.hr/natjecanje/dogadjaj/614/rezultati",
                target: "_blank",
              },
              " državnom natjecanju iz informatike ",
              -1,
            ),
          ),
          fe = ne(() =>
            (0, t._)(
              "a",
              {
                class: "plus",
                href: "https://inova-croatia.com/en/product-detail/e-dnevnik-plus-2/",
                target: "_blank",
              },
              " INOVA",
              -1,
            ),
          ),
          we = ne(() => (0, t._)("br", null, null, -1)),
          Ce = ne(() => (0, t._)("br", null, null, -1)),
          ze = ne(() => (0, t._)("hr", null, null, -1)),
          Ue = ne(() => (0, t._)("br", null, null, -1)),
          Be = ne(() =>
            (0, t._)(
              "a",
              {
                class: "plus",
                href: "https://ednevnik.plus/donacije",
                target: "_blank",
              },
              " ovdje",
              -1,
            ),
          ),
          ye = ne(() =>
            (0, t._)(
              "a",
              { class: "plus", href: "https://k1k1.dev/", target: "_blank" },
              " k1k1.dev",
              -1,
            ),
          ),
          Pe = ne(() => (0, t._)("br", null, null, -1)),
          De = ne(() => (0, t._)("br", null, null, -1)),
          Se = ne(() => (0, t._)("br", null, null, -1)),
          xe = ne(() => (0, t._)("br", null, null, -1)),
          Ee = ne(() =>
            (0, t._)(
              "div",
              {
                style: {
                  color: "gray",
                  "font-style": "italic",
                  "text-align": "right",
                },
              },
              " — Kristijan Rosandić ",
              -1,
            ),
          );
        function Oe(e, a, i, n, o, r) {
          return (
            (0, t.wg)(),
            (0, t.iD)("div", te, [
              oe,
              (0, t.Uk)(
                " Ovako je e-Dnevnik Plus izgledao krajem 2018. godine: ",
              ),
              re,
              (0, t.Uk)(
                "300 linija Python koda (ispušta i zvukove :P). Zapravo, tada aplikacija još nije niti imala naziv. Bilo je moguće navigirati razredima, predmetima, uređivati ocjene i pregledavati razrednu statistiku ocjena. Naziv sam osmislio nakon što sam završio prvu verziju proširenja za Chrome Web Trgovinu. To mi je prva web aplikacija, sa 16 godina u 2. razredu srednje škole TŠSB.",
              ),
              se,
              le,
              (0, t.Uk)(
                "Ovako je e-Dnevnik Plus izgledao početkom 2019. godine: ",
              ),
              de,
              (0, t.Uk)(
                " Nakon podjele na Redditu i prvih 500 korisnika, Srednja.hr objavljuje ",
              ),
              pe,
              (0, t.Uk)(
                ", a potom i nekoliko drugih portala. Proširenje dostiže 2500 tjedno aktivnih korisnika pred kraj školske godine. Prelazim u ETŠ Zagreb i nastavljam nadograđivati proširenje s mnoštvom novih funkcionalnosti. Od školske godine 2019./2020. e-Dnevnik više ne prikazuje prosjek ocjena i naglo se povećava potražnja za proširenjem. Početkom 2020. godine objavio sam e-Dnevnik Plus za nastavnike i ",
              ),
              ue,
              (0, t.Uk)(" (verzija za info-stupove)."),
              ce,
              ve,
              (0, t.Uk)(
                " Ovako je e-Dnevnik Plus izgledao školske godine 2019./2020.: ",
              ),
              ke,
              (0, t.Uk)(
                " Pred početak školske godine 2020./2021., e-Dnevnik je redizajniran s novim funkcionalnostima. To znači da sam trebao izraditi gotovo sve ispočetka. ",
              ),
              me,
              (0, t.Uk)(
                " sadrži obilaske kroz 4 najbitnije stare verzije proširenja. Stara naslovna stranica (s verzijama < 5.0) nalazi se ",
              ),
              ge,
              (0, t.Uk)("."),
              je,
              be,
              (0, t.Uk)(
                " Ovako je e-Dnevnik Plus izgledao školske godine 2020./2021.: ",
              ),
              Ae,
              (0, t.Uk)(" e-Dnevnik Plus pobjeđuje na "),
              he,
              (0, t.Uk)(" te je izabran kao najbolji rad na izložbi "),
              fe,
              (0, t.Uk)(
                ". Ipak, godinu dana kasnije (ljeto 2021. nakon mature) odlučujem opet izbrisati sve i započeti iznova, ali ovaj put s boljim tehnologijama. Stoga, danas postoji moja moderna verzija e-Dnevnika - Plus App, ali i jednostavna Classic verzija koja se ugrađuje u e-Dnevnik kao što je bilo i prije. ",
              ),
              we,
              Ce,
              ze,
              Ue,
              (0, t.Uk)(
                " e-Dnevnik Plus 5.0 je Open Source, izrađen u Vue Frameworku s Typescriptom. Za donacije, klikni ",
              ),
              Be,
              (0, t.Uk)(
                ". Za pregled drugih aplikacija i proširenja, vidi moj Developer Portfolio na ",
              ),
              ye,
              (0, t.Uk)(". "),
              Pe,
              De,
              Se,
              xe,
              Ee,
            ])
          );
        }
        var Le = (0, t.aZ)({ name: "Author" });
        const Ie = (0, z.Z)(Le, [
          ["render", Oe],
          ["__scopeId", "data-v-13419404"],
        ]);
        var We = Ie,
          Ke =
            "data:image/png;base64,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",
          Re = i.p + "img/review-icon.ea73cd0d.png",
          Te = i.p + "img/code-icon.d99150da.png",
          Qe = i.p + "img/chrome-icon.0ad747b0.png",
          qe = i.p + "img/edge-icon.03dc3cb9.png",
          Ze = i.p + "img/browser.74f7a635.png";
        const Fe = (e) => (
            (0, t.dD)("data-v-7b854728"), (e = e()), (0, t.Cn)(), e
          ),
          Me = { id: "content" },
          Je = { key: 0, id: "main", class: "main-message" },
          Ve = { key: 1, id: "main", class: "main-message" },
          He = { key: 2, id: "main" },
          Xe = Fe(() =>
            (0, t._)(
              "div",
              { id: "downloads" },
              [
                (0, t._)("div", { class: "download-item" }, [
                  (0, t._)(
                    "a",
                    {
                      href: "https://chrome.google.com/webstore/detail/e-dnevnik-plus/bcnccmamhmcabokipgjechdeealcmdbe",
                      target: "_blank",
                      class: "card",
                    },
                    [
                      (0, t._)("img", { src: Ke }),
                      (0, t.Uk)(" Preuzmi "),
                      (0, t._)("em", null, "proširenje"),
                      (0, t.Uk)(" za učenike i roditelje "),
                    ],
                  ),
                  (0, t._)(
                    "a",
                    {
                      href: "https://chrome.google.com/webstore/detail/e-dnevnik-plus/bcnccmamhmcabokipgjechdeealcmdbe/reviews",
                      target: "_blank",
                      class: "card",
                    },
                    [(0, t._)("img", { src: Re })],
                  ),
                  (0, t._)(
                    "a",
                    {
                      href: "https://github.com/ChrisRoss5/e-Dnevnik-Plus",
                      target: "_blank",
                      class: "card",
                    },
                    [(0, t._)("img", { src: Te })],
                  ),
                ]),
                (0, t._)("div", { class: "download-item" }, [
                  (0, t._)(
                    "a",
                    {
                      href: "https://chrome.google.com/webstore/detail/e-dnevnik-plus-za-nastavn/jefappmpehdgllijkjpekdmkbmbigbnl",
                      target: "_blank",
                      class: "card",
                    },
                    [
                      (0, t._)("img", { src: Ke }),
                      (0, t.Uk)(" Preuzmi "),
                      (0, t._)("em", null, "proširenje"),
                      (0, t.Uk)(" za nastavnike "),
                    ],
                  ),
                  (0, t._)(
                    "a",
                    {
                      href: "https://chrome.google.com/webstore/detail/e-dnevnik-plus-za-nastavn/jefappmpehdgllijkjpekdmkbmbigbnl/reviews",
                      target: "_blank",
                      class: "card",
                    },
                    [(0, t._)("img", { src: Re })],
                  ),
                  (0, t._)(
                    "a",
                    {
                      href: "https://github.com/ChrisRoss5/e-Dnevnik-Plus-za-nastavnike",
                      target: "_blank",
                      class: "card",
                    },
                    [(0, t._)("img", { src: Te })],
                  ),
                ]),
              ],
              -1,
            ),
          ),
          Ne = Fe(() =>
            (0, t._)(
              "div",
              { id: "browsers", class: "card" },
              [
                (0, t._)(
                  "div",
                  { style: { "padding-bottom": "10px" } },
                  "Kompatibilni preglednici:",
                ),
                (0, t._)("div", { id: "browser-icons" }, [
                  (0, t._)("div", { class: "flex-center" }, [
                    (0, t._)("img", { src: Qe }),
                    (0, t.Uk)(" Chrome "),
                  ]),
                  (0, t._)("div", { class: "flex-center" }, [
                    (0, t._)("img", { src: qe }),
                    (0, t.Uk)(" Edge "),
                  ]),
                ]),
              ],
              -1,
            ),
          ),
          Ge = [Xe, Ne],
          _e = Fe(() =>
            (0, t._)(
              "div",
              { id: "browser" },
              [(0, t._)("img", { src: Ze })],
              -1,
            ),
          );
        function Ye(e, a, i, r, s, l) {
          return (
            (0, t.wg)(),
            (0, t.iD)("div", Me, [
              (0, t.Wm)(
                n.uT,
                { name: "opacity", mode: "out-in" },
                {
                  default: (0, t.w5)(() => [
                    "#instaliran" == e.$route.hash
                      ? ((0, t.wg)(),
                        (0, t.iD)(
                          "div",
                          Je,
                          " Proširenje je uspješno instalirano! ",
                        ))
                      : "#azuriran" == e.$route.hash
                      ? ((0, t.wg)(),
                        (0, t.iD)(
                          "div",
                          Ve,
                          " Proširenje je ažurirano na najnoviju verziju " +
                            (0, o.zw)(e.$lastVersion) +
                            "! ",
                          1,
                        ))
                      : ((0, t.wg)(), (0, t.iD)("div", He, Ge)),
                  ]),
                  _: 1,
                },
              ),
              _e,
            ])
          );
        }
        var $e = (0, t.aZ)({
          name: "Home",
          mounted() {
            this.$route.hash &&
              setTimeout(
                () => this.$router.replace({ hash: "#jupiiiii" }),
                6e3,
              );
          },
        });
        const ea = (0, z.Z)($e, [
          ["render", Ye],
          ["__scopeId", "data-v-7b854728"],
        ]);
        var aa = ea;
        const ia = (e) => (
            (0, t.dD)("data-v-80b15274"), (e = e()), (0, t.Cn)(), e
          ),
          na = { class: "card content-card" },
          ta = { id: "app-types", class: "card" },
          oa = ia(() =>
            (0, t._)(
              "h3",
              null,
              "Koje osobne podatke proširenje prikuplja",
              -1,
            ),
          ),
          ra = ia(() =>
            (0, t._)(
              "h3",
              null,
              "Zašto proširenje prikuplja osobne podatke",
              -1,
            ),
          ),
          sa = ia(() =>
            (0, t._)(
              "h3",
              null,
              "Gdje se nalaze prikupljeni osobni podaci",
              -1,
            ),
          ),
          la = ia(() => (0, t._)("strong", null, "nitko osim vas", -1)),
          da = ia(() => (0, t._)("h3", null, "Google Analytics", -1)),
          pa = ia(() => (0, t._)("h3", null, "Kontakt", -1)),
          ua = ia(() => (0, t._)("em", null, "kristijan.ros@gmail.com", -1));
        function ca(e, a, i, n, r, s) {
          return (
            (0, t.wg)(),
            (0, t.iD)("div", na, [
              (0, t._)("h2", null, [
                (0, t.Uk)(" Politika Privatnosti "),
                (0, t._)("div", ta, [
                  (0, t._)(
                    "div",
                    {
                      class: (0, o.C_)({ "selected-app": !e.selectedApp }),
                      onClick: a[0] || (a[0] = (a) => (e.selectedApp = 0)),
                    },
                    " za učenike i roditelje ",
                    2,
                  ),
                  (0, t._)(
                    "div",
                    {
                      class: (0, o.C_)({ "selected-app": e.selectedApp }),
                      onClick: a[1] || (a[1] = (a) => (e.selectedApp = 1)),
                    },
                    " za nastavnike ",
                    2,
                  ),
                ]),
              ]),
              e.selectedApp
                ? ((0, t.wg)(),
                  (0, t.iD)(
                    t.HY,
                    { key: 1 },
                    [
                      (0, t.Uk)(
                        "Proširenje ne prikuplja podatke niti me izvještava o prometu na web mjestima e-Dnevnika.",
                      ),
                    ],
                    64,
                  ))
                : ((0, t.wg)(),
                  (0, t.iD)(
                    t.HY,
                    { key: 0 },
                    [
                      (0, t.Uk)(
                        " Ovaj dokument objašnjava kako proširenje e-Dnevnik Plus koristi i čuva vaše osobne podatke, prikupljene prilikom njena korištenja. Dokument se može promijeniti u bilo koje vrijeme o čemu ćete biti pravovremeno obaviješteni prilikom ažuriranja proširenja. ",
                      ),
                      oa,
                      (0, t.Uk)(
                        " Prikupljeni osobni podaci su vaše korisničko ime i lozinka HUSO AAI računa. ",
                      ),
                      ra,
                      (0, t.Uk)(
                        " Podaci se koriste u svrhu automatske prijave ili odjave iz e-Dnevnika te za spremanje korisnikovih podataka poput bilješki i postavki u kalendaru. ",
                      ),
                      sa,
                      (0, t.Uk)(
                        " Svi prikupljeni podaci (ne samo osobni) ostaju spremljeni lokalno na vašem uređaju te podacima ne može pristupiti ",
                      ),
                      la,
                      (0, t.Uk)(
                        ". Prilikom deinstalacije svi podaci se trajno brišu. ",
                      ),
                      da,
                      (0, t.Uk)(
                        " U svrhu pružanja bolje usluge i razumijevanja potreba korisnika koristim se alatom Google Analytics. Iako Google bilježi veliki broj informacija poput geografskih i demografskih pokazatelja, vaši osobni podaci su zaštićeni te ne postoji način identifikacije korisnika. ",
                      ),
                      pa,
                      (0, t.Uk)(
                        " Upite vezane uz ovaj dokument možete tražiti putem email-a: ",
                      ),
                      ua,
                    ],
                    64,
                  )),
            ])
          );
        }
        var va = (0, t.aZ)({
          name: "PrivacyPolicy",
          data() {
            return { selectedApp: 0 };
          },
        });
        const ka = (0, z.Z)(va, [
          ["render", ca],
          ["__scopeId", "data-v-80b15274"],
        ]);
        var ma = ka;
        const ga = [
            { path: "/", component: aa },
            { path: "/politika-privatnosti", component: ma },
            { path: "/povijest", component: Y },
            { path: "/autor", component: We },
            {
              path: "/deinstalacija",
              component: () => i.e(279).then(i.bind(i, 9279)),
            },
            {
              path: "/donacije",
              component: () => i.e(347).then(i.bind(i, 9347)),
            },
            { path: "/:pathMatch(.*)", redirect: "/" },
          ],
          ja = (0, q.p7)({ history: (0, q.PO)(""), routes: ga });
        var ba = ja;
        const Aa = (0, n.ri)(Q);
        function ha() {
          try {
            return window.self !== window.top;
          } catch (e) {
            return !0;
          }
        }
        (Aa.config.globalProperties.$lastVersion = "5.0.2"),
          (Aa.config.globalProperties.$isMobile =
            window.matchMedia("(max-width: 768px)").matches),
          (Aa.config.globalProperties.$inApp = ha()),
          Aa.use(ba).mount("#app");
      },
    },
    a = {};
  function i(n) {
    var t = a[n];
    if (void 0 !== t) return t.exports;
    var o = (a[n] = { exports: {} });
    return e[n].call(o.exports, o, o.exports, i), o.exports;
  }
  (i.m = e),
    (function () {
      var e = [];
      i.O = function (a, n, t, o) {
        if (!n) {
          var r = 1 / 0;
          for (p = 0; p < e.length; p++) {
            (n = e[p][0]), (t = e[p][1]), (o = e[p][2]);
            for (var s = !0, l = 0; l < n.length; l++)
              (!1 & o || r >= o) &&
              Object.keys(i.O).every(function (e) {
                return i.O[e](n[l]);
              })
                ? n.splice(l--, 1)
                : ((s = !1), o < r && (r = o));
            if (s) {
              e.splice(p--, 1);
              var d = t();
              void 0 !== d && (a = d);
            }
          }
          return a;
        }
        o = o || 0;
        for (var p = e.length; p > 0 && e[p - 1][2] > o; p--) e[p] = e[p - 1];
        e[p] = [n, t, o];
      };
    })(),
    (function () {
      i.d = function (e, a) {
        for (var n in a)
          i.o(a, n) &&
            !i.o(e, n) &&
            Object.defineProperty(e, n, { enumerable: !0, get: a[n] });
      };
    })(),
    (function () {
      (i.f = {}),
        (i.e = function (e) {
          return Promise.all(
            Object.keys(i.f).reduce(function (a, n) {
              return i.f[n](e, a), a;
            }, []),
          );
        });
    })(),
    (function () {
      i.u = function (e) {
        return (
          "js/" + e + "." + { 279: "68f0e1a1", 347: "ddbcac7f" }[e] + ".js"
        );
      };
    })(),
    (function () {
      i.miniCssF = function (e) {
        return (
          "css/" + e + "." + { 279: "91e578e1", 347: "7e296b17" }[e] + ".css"
        );
      };
    })(),
    (function () {
      i.g = (function () {
        if ("object" === typeof globalThis) return globalThis;
        try {
          return this || new Function("return this")();
        } catch (e) {
          if ("object" === typeof window) return window;
        }
      })();
    })(),
    (function () {
      i.o = function (e, a) {
        return Object.prototype.hasOwnProperty.call(e, a);
      };
    })(),
    (function () {
      var e = {},
        a = "ednevnik.plus:";
      i.l = function (n, t, o, r) {
        if (e[n]) e[n].push(t);
        else {
          var s, l;
          if (void 0 !== o)
            for (
              var d = document.getElementsByTagName("script"), p = 0;
              p < d.length;
              p++
            ) {
              var u = d[p];
              if (
                u.getAttribute("src") == n ||
                u.getAttribute("data-webpack") == a + o
              ) {
                s = u;
                break;
              }
            }
          s ||
            ((l = !0),
            (s = document.createElement("script")),
            (s.charset = "utf-8"),
            (s.timeout = 120),
            i.nc && s.setAttribute("nonce", i.nc),
            s.setAttribute("data-webpack", a + o),
            (s.src = n)),
            (e[n] = [t]);
          var c = function (a, i) {
              (s.onerror = s.onload = null), clearTimeout(v);
              var t = e[n];
              if (
                (delete e[n],
                s.parentNode && s.parentNode.removeChild(s),
                t &&
                  t.forEach(function (e) {
                    return e(i);
                  }),
                a)
              )
                return a(i);
            },
            v = setTimeout(
              c.bind(null, void 0, { type: "timeout", target: s }),
              12e4,
            );
          (s.onerror = c.bind(null, s.onerror)),
            (s.onload = c.bind(null, s.onload)),
            l && document.head.appendChild(s);
        }
      };
    })(),
    (function () {
      i.r = function (e) {
        "undefined" !== typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
          Object.defineProperty(e, "__esModule", { value: !0 });
      };
    })(),
    (function () {
      i.p = "";
    })(),
    (function () {
      if ("undefined" !== typeof document) {
        var e = function (e, a, i, n, t) {
            var o = document.createElement("link");
            (o.rel = "stylesheet"), (o.type = "text/css");
            var r = function (i) {
              if (((o.onerror = o.onload = null), "load" === i.type)) n();
              else {
                var r = i && ("load" === i.type ? "missing" : i.type),
                  s = (i && i.target && i.target.href) || a,
                  l = new Error(
                    "Loading CSS chunk " + e + " failed.\n(" + s + ")",
                  );
                (l.code = "CSS_CHUNK_LOAD_FAILED"),
                  (l.type = r),
                  (l.request = s),
                  o.parentNode && o.parentNode.removeChild(o),
                  t(l);
              }
            };
            return (
              (o.onerror = o.onload = r),
              (o.href = a),
              i
                ? i.parentNode.insertBefore(o, i.nextSibling)
                : document.head.appendChild(o),
              o
            );
          },
          a = function (e, a) {
            for (
              var i = document.getElementsByTagName("link"), n = 0;
              n < i.length;
              n++
            ) {
              var t = i[n],
                o = t.getAttribute("data-href") || t.getAttribute("href");
              if ("stylesheet" === t.rel && (o === e || o === a)) return t;
            }
            var r = document.getElementsByTagName("style");
            for (n = 0; n < r.length; n++) {
              (t = r[n]), (o = t.getAttribute("data-href"));
              if (o === e || o === a) return t;
            }
          },
          n = function (n) {
            return new Promise(function (t, o) {
              var r = i.miniCssF(n),
                s = i.p + r;
              if (a(r, s)) return t();
              e(n, s, null, t, o);
            });
          },
          t = { 143: 0 };
        i.f.miniCss = function (e, a) {
          var i = { 279: 1, 347: 1 };
          t[e]
            ? a.push(t[e])
            : 0 !== t[e] &&
              i[e] &&
              a.push(
                (t[e] = n(e).then(
                  function () {
                    t[e] = 0;
                  },
                  function (a) {
                    throw (delete t[e], a);
                  },
                )),
              );
        };
      }
    })(),
    (function () {
      var e = { 143: 0 };
      (i.f.j = function (a, n) {
        var t = i.o(e, a) ? e[a] : void 0;
        if (0 !== t)
          if (t) n.push(t[2]);
          else {
            var o = new Promise(function (i, n) {
              t = e[a] = [i, n];
            });
            n.push((t[2] = o));
            var r = i.p + i.u(a),
              s = new Error(),
              l = function (n) {
                if (i.o(e, a) && ((t = e[a]), 0 !== t && (e[a] = void 0), t)) {
                  var o = n && ("load" === n.type ? "missing" : n.type),
                    r = n && n.target && n.target.src;
                  (s.message =
                    "Loading chunk " + a + " failed.\n(" + o + ": " + r + ")"),
                    (s.name = "ChunkLoadError"),
                    (s.type = o),
                    (s.request = r),
                    t[1](s);
                }
              };
            i.l(r, l, "chunk-" + a, a);
          }
      }),
        (i.O.j = function (a) {
          return 0 === e[a];
        });
      var a = function (a, n) {
          var t,
            o,
            r = n[0],
            s = n[1],
            l = n[2],
            d = 0;
          if (
            r.some(function (a) {
              return 0 !== e[a];
            })
          ) {
            for (t in s) i.o(s, t) && (i.m[t] = s[t]);
            if (l) var p = l(i);
          }
          for (a && a(n); d < r.length; d++)
            (o = r[d]), i.o(e, o) && e[o] && e[o][0](), (e[o] = 0);
          return i.O(p);
        },
        n = (self["webpackChunkednevnik_plus"] =
          self["webpackChunkednevnik_plus"] || []);
      n.forEach(a.bind(null, 0)), (n.push = a.bind(null, n.push.bind(n)));
    })();
  var n = i.O(void 0, [998], function () {
    return i(8563);
  });
  n = i.O(n);
})();
//# sourceMappingURL=app.053687a5.js.map
