(function () {
  "use strict";
  var a = {
      3631: function (a, e, i) {
        var t = i(9963),
          n = i(6252);
        function o(a, e, i, t, o, r) {
          const s = (0, n.up)("Wrapper"),
            l = (0, n.up)("Previews");
          return (
            (0, n.wg)(),
            (0, n.iD)(
              n.HY,
              null,
              [
                (0, n.Wm)(s),
                "/" == a.$route.path
                  ? ((0, n.wg)(), (0, n.j4)(l, { key: 0 }))
                  : (0, n.kq)("", !0),
              ],
              64,
            )
          );
        }
        var r = i(3577);
        const s = { id: "wrapper" },
          l = { id: "important" },
          d = { key: 0 },
          p = ["innerHTML"],
          c = (0, n.Uk)("  "),
          u = { id: "urls" },
          v = (0, n.Uk)("Verzije"),
          k = (0, n.Uk)("Autor"),
          m = { id: "background" },
          g = { id: "heading" },
          h = (0, n._)("div", { id: "ed", class: "ed" }, "e-Dnevnik", -1),
          A = (0, n._)("div", { id: "plus", class: "plus" }, "Plus", -1),
          j = (0, n._)(
            "div",
            { id: "subtitle" },
            "Proširenje za školski e-Dnevnik",
            -1,
          ),
          b = (0, n._)(
            "div",
            { style: { color: "gray" } },
            " Ovo proširenje nije službena CARNET-ova aplikacija. ",
            -1,
          ),
          f = (0, n._)(
            "a",
            {
              class: "plus",
              href: "mailto:kristijan.ros@gmail.com?subject=e-Dnevnik Plus — Kontakt",
            },
            " kristijan.ros@gmail.com",
            -1,
          ),
          w = (0, n.Uk)(" | "),
          C = (0, n._)(
            "a",
            { class: "plus", href: "https://k1k1.dev/", target: "_blank" },
            "k1k1.dev",
            -1,
          ),
          z = (0, n.Uk)(" | "),
          B = (0, n.Uk)(" politika privatnosti");
        function y(a, e, i, o, y, P) {
          const D = (0, n.up)("router-link"),
            S = (0, n.up)("router-view");
          return (
            (0, n.wg)(),
            (0, n.iD)("div", s, [
              (0, n._)("div", l, [
                a.$inApp
                  ? ((0, n.wg)(),
                    (0, n.iD)(
                      "strong",
                      d,
                      " Tvoja trenutno instalirana verzija proširenja: " +
                        (0, r.zw)(a.$lastVersion),
                      1,
                    ))
                  : ((0, n.wg)(),
                    (0, n.iD)(
                      n.HY,
                      { key: 1 },
                      [
                        (0, n.Wm)(
                          t.uT,
                          { name: "opacity" },
                          {
                            default: (0, n.w5)(() => [
                              a.message
                                ? ((0, n.wg)(),
                                  (0, n.iD)(
                                    "span",
                                    { key: 0, innerHTML: a.message },
                                    null,
                                    8,
                                    p,
                                  ))
                                : (0, n.kq)("", !0),
                            ]),
                            _: 1,
                          },
                        ),
                        c,
                      ],
                      64,
                    )),
                (0, n._)("div", u, [
                  (0, n.Wm)(
                    D,
                    { to: "/povijest" },
                    { default: (0, n.w5)(() => [v]), _: 1 },
                  ),
                  (0, n.Wm)(
                    D,
                    { to: "/autor" },
                    { default: (0, n.w5)(() => [k]), _: 1 },
                  ),
                ]),
              ]),
              (0, n._)("div", m, [
                ((0, n.wg)(!0),
                (0, n.iD)(
                  n.HY,
                  null,
                  (0, n.Ko)(
                    a.rectangles,
                    (a, e) => (
                      (0, n.wg)(),
                      (0, n.iD)(
                        "div",
                        { key: e, class: "rect", style: (0, r.j5)(a) },
                        null,
                        4,
                      )
                    ),
                  ),
                  128,
                )),
              ]),
              (0, n._)("div", g, [
                (0, n.Wm)(
                  D,
                  { to: "/", id: "title" },
                  { default: (0, n.w5)(() => [h, A]), _: 1 },
                ),
                j,
              ]),
              (0, n.Wm)(S, { class: "router-view" }),
              (0, n.Wm)(
                t.uT,
                { name: "opacity" },
                {
                  default: (0, n.w5)(() => [
                    (0, n.wy)(
                      (0, n._)(
                        "div",
                        {
                          id: "footer",
                          class: (0, r.C_)({ default: "/" != a.$route.path }),
                        },
                        [
                          b,
                          (0, n.Uk)(
                            " 2019.-" +
                              (0, r.zw)(new Date().getFullYear()) +
                              ". | ",
                            1,
                          ),
                          f,
                          w,
                          C,
                          z,
                          (0, n.Wm)(
                            D,
                            { to: "politika-privatnosti", class: "plus" },
                            { default: (0, n.w5)(() => [B]), _: 1 },
                          ),
                        ],
                        2,
                      ),
                      [
                        [
                          t.F8,
                          "/" != a.$route.path ||
                            0 == a.scrollTop ||
                            a.$isMobile,
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
        var P = (0, n.aZ)({
            name: "Wrapper",
            data() {
              return { rectangles: [], speed: 2e4, scrollTop: 0, message: "" };
            },
            mounted() {
              for (let a = 0; a < 10; a++) this.updateRect(a, !0);
              document.body.addEventListener(
                "scroll",
                () => (this.scrollTop = document.body.scrollTop),
              ),
                fetch("https://ednevnik.plus/users.html")
                  .then((a) => a.text())
                  .then((a) => (this.message = a));
            },
            methods: {
              updateRect(a, e) {
                const i = this.rand(30, 150),
                  t = this.rand(0, 100),
                  n = e ? t + "%" : -i + "px",
                  o =
                    this.rand(this.speed, 2 * this.speed) *
                    (e ? 1 - t / 100 : 1);
                (this.rectangles[a] = { bottom: n, opacity: "1" }),
                  setTimeout(() => {
                    (this.rectangles[a] = {
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
                      setTimeout(() => this.updateRect(a), o);
                  }, 100);
              },
              rand(a, e) {
                return Math.floor(Math.random() * (e - a + 1) + a);
              },
            },
          }),
          D = i(3744);
        const S = (0, D.Z)(P, [["render", y]]);
        var U = S,
          E = i.p + "media/light-tour.2b6a80ea.mp4",
          x = i.p + "media/dark-tour.0403e220.mp4";
        const O = (a) => (
            (0, n.dD)("data-v-05876fa5"), (a = a()), (0, n.Cn)(), a
          ),
          I = { id: "previews" },
          L = { id: "tour", class: "flex-center" },
          W = O(() =>
            (0, n._)(
              "div",
              { class: "ed" },
              [
                (0, n.Uk)(" e-Dnevnik "),
                (0, n._)("span", { class: "plus" }, "Plus App"),
                (0, n.Uk)(" — Obilazak "),
              ],
              -1,
            ),
          ),
          T = { id: "types" };
        function K(a, e, i, o, s, l) {
          return (
            (0, n.wg)(),
            (0, n.iD)("div", I, [
              (0, n._)("div", L, [
                W,
                (0, n._)("div", T, [
                  (0, n._)(
                    "a",
                    {
                      class: (0, r.C_)(["card", { plus: "light" == a.mode }]),
                      onClick: e[0] || (e[0] = (e) => (a.mode = "light")),
                    },
                    "Svijetli prikaz",
                    2,
                  ),
                  (0, n._)(
                    "a",
                    {
                      class: (0, r.C_)(["card", { plus: "dark" == a.mode }]),
                      onClick: e[1] || (e[1] = (e) => (a.mode = "dark")),
                    },
                    "Tamni prikaz",
                    2,
                  ),
                  (0, n._)(
                    "a",
                    {
                      class: (0, r.C_)(["card", { plus: "double" == a.mode }]),
                      onClick: e[2] || (e[2] = (e) => (a.mode = "double")),
                    },
                    "Dupli prikaz",
                    2,
                  ),
                  (0, n._)(
                    "a",
                    {
                      class: (0, r.C_)(["card", { plus: a.fast }]),
                      onClick:
                        e[3] ||
                        (e[3] = (...e) => a.changeSpeed && a.changeSpeed(...e)),
                    },
                    "Brzina " + (0, r.zw)(a.fast ? "x2" : "x1"),
                    3,
                  ),
                ]),
              ]),
              (0, n._)(
                "div",
                {
                  id: "videos",
                  class: (0, r.C_)([
                    "flex-center",
                    { double: "double" == a.mode },
                  ]),
                },
                [
                  (0, n.Wm)(
                    t.W3,
                    { name: "opacity" },
                    {
                      default: (0, n.w5)(() => [
                        (0, n.wy)(
                          (0, n._)(
                            "video",
                            {
                              ref: "light",
                              src: E,
                              muted: "",
                              autoplay: "",
                              controls: "",
                              loop: "",
                              onTimeupdate:
                                e[4] ||
                                (e[4] = (...e) =>
                                  a.timeUpdated && a.timeUpdated(...e)),
                              onPlay:
                                e[5] ||
                                (e[5] = (...e) =>
                                  a.timeUpdated && a.timeUpdated(...e)),
                              onPause:
                                e[6] ||
                                (e[6] = (...e) =>
                                  a.timeUpdated && a.timeUpdated(...e)),
                              key: "1",
                            },
                            null,
                            544,
                          ),
                          [[t.F8, "light" == a.mode || "double" == a.mode]],
                        ),
                        (0, n.wy)(
                          (0, n._)(
                            "video",
                            {
                              ref: "dark",
                              src: x,
                              muted: "",
                              autoplay: "",
                              controls: "",
                              loop: "",
                              onTimeupdate:
                                e[7] ||
                                (e[7] = (...e) =>
                                  a.timeUpdated && a.timeUpdated(...e)),
                              onPlay:
                                e[8] ||
                                (e[8] = (...e) =>
                                  a.timeUpdated && a.timeUpdated(...e)),
                              onPause:
                                e[9] ||
                                (e[9] = (...e) =>
                                  a.timeUpdated && a.timeUpdated(...e)),
                              key: "2",
                            },
                            null,
                            544,
                          ),
                          [[t.F8, "dark" == a.mode || "double" == a.mode]],
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
        var R = (0, n.aZ)({
          name: "Previews",
          data() {
            return { mode: "light", fast: !1, lightVid: null, darkVid: null };
          },
          mounted() {
            (this.lightVid = this.$refs.light),
              (this.darkVid = this.$refs.dark);
          },
          methods: {
            timeUpdated(a) {
              const e = a.target,
                i = e == this.lightVid ? this.darkVid : this.lightVid;
              if ("pause" == a.type) i.pause();
              else if ("play" == a.type) i.play();
              else {
                const t = e.currentTime - i.currentTime;
                "timeupdate" == a.type &&
                  Math.abs(t) > 0.5 &&
                  (i.currentTime = e.currentTime);
              }
            },
            changeSpeed() {
              (this.fast = !this.fast),
                (this.lightVid.playbackRate = this.darkVid.playbackRate =
                  this.fast ? 2 : 1);
            },
          },
        });
        const Q = (0, D.Z)(R, [
          ["render", K],
          ["__scopeId", "data-v-05876fa5"],
        ]);
        var q = Q,
          F = (0, n.aZ)({
            name: "App",
            components: { Wrapper: U, Previews: q },
            data() {
              return { scrolling: !1 };
            },
            mounted() {
              const a = localStorage.getItem("path");
              a && (localStorage.removeItem("path"), this.$router.replace(a));
            },
            methods: {
              scroll(a, e) {
                var i = document.body.scrollTop,
                  t = i + a,
                  n = 0.5 * (i + t),
                  o = i - n,
                  r = performance.now();
                this.scrolling = !0;
                const s = () => (this.scrolling = !1);
                function l() {
                  var a = (performance.now() - r) / e;
                  a > 1 && (a = 1),
                    document.body.scrollTo(0, n + o * Math.cos(a * Math.PI)),
                    a < 1 ? window.requestAnimationFrame(l) : s();
                }
                window.requestAnimationFrame(l);
              },
            },
          });
        const Z = (0, D.Z)(F, [["render", o]]);
        var M = Z,
          J = i(2119),
          V = i.p + "img/popup.62f5d213.png";
        const X = (a) => (
            (0, n.dD)("data-v-be6aa032"), (a = a()), (0, n.Cn)(), a
          ),
          H = { class: "card content-card" },
          N = (0, n.Uk)(" Povijest ažuriranja "),
          G = { id: "app-types", class: "card" },
          Y = X(() => (0, n._)("span", null, "(2.3.2023.)", -1)),
          _ = (0, n.uE)(
            '<ul data-v-be6aa032><li data-v-be6aa032>e-Dnevnik Plus <span class="plus" data-v-be6aa032>App</span>:</li><ul data-v-be6aa032><li data-v-be6aa032>Dodana opcija &quot;Ispis potvrda&quot; klikom na korisnika</li><li data-v-be6aa032> Ažuriran kalkulator za upis u srednje škole <ul data-v-be6aa032><li data-v-be6aa032>Ažurirani dodatni bodovi</li><li data-v-be6aa032>Ažurirani bodovi potrebni za upis</li></ul></li></ul></ul><h3 data-v-be6aa032>Verzija 5.0.1<span data-v-be6aa032>(22.11.2021.)</span></h3><ul data-v-be6aa032><li data-v-be6aa032>e-Dnevnik Plus <span class="plus" data-v-be6aa032>App</span>:</li><ul data-v-be6aa032><li data-v-be6aa032> Opcija &quot;Prikaži boje ocjena&quot; podjeljena je na dvije nove opcije: <ul data-v-be6aa032><li data-v-be6aa032>Prikaži boje ocjena po ukupnom broju</li><li data-v-be6aa032>Prikaži boje ocjena po mjesecima</li></ul></li><li data-v-be6aa032>Smanjen zum cijele aplikacije za 10%.</li><li data-v-be6aa032>Dodana opcija prikaza lozinke kod prijave.</li></ul><li data-v-be6aa032>e-Dnevnik Plus <span class="plus" data-v-be6aa032>Classic</span>:</li><ul data-v-be6aa032><li data-v-be6aa032> Dodana opcija automatske prijave (kvačica na /login stranici). </li></ul></ul><h3 data-v-be6aa032>Verzija 5.0<span data-v-be6aa032>(11.11.2021.)</span></h3><ul data-v-be6aa032><li data-v-be6aa032>Uklonjene sve funkcionalnosti prethodne verzije proširenja.</li><li data-v-be6aa032> Novi prozor proširenja omogućuje odabir verzije e-Dnevnika: <span class="plus" data-v-be6aa032>App</span> ili <span class="plus" data-v-be6aa032>Classic</span><br data-v-be6aa032> Odabrana verzija postaje zadana te se svaki put otvara navigacijom na <a href="ocjene.skole.hr" class="plus" data-v-be6aa032>ocjene.skole.hr</a><img class="card" src="' +
              V +
              '" data-v-be6aa032></li><li data-v-be6aa032><span class="plus" data-v-be6aa032>App</span> verzija je nova aplikacija za napredan pregled sadržaja s e-Dnevnika: <ul data-v-be6aa032><li data-v-be6aa032> Osnovne lokacije su: Razred, Kalendar, Statistika ocjena i Kalkulator bodova. </li><li data-v-be6aa032> Sve promjene ostaju automatski spremljene za prijavljenog korisnika. </li></ul></li><li data-v-be6aa032><span class="plus" data-v-be6aa032>Classic</span> verzija dodaje prosjeke na stranici e-Dnevnika: <ul data-v-be6aa032><li data-v-be6aa032> Na stranici odabira predmeta, za svaki predmet i završni prosjek. </li><li data-v-be6aa032>Na stranici predmeta.</li></ul></li></ul><h3 data-v-be6aa032>Verzija &lt;= 4.8<span data-v-be6aa032>(21.3.2019.)</span></h3><a class="plus" href="https://chrisross5.github.io/e-dnevnik-plus-homepage-old/" data-v-be6aa032>https://chrisross5.github.io/e-dnevnik-plus-homepage-old/</a>',
            7,
          ),
          $ = (0, n.Uk)("Nema novosti.");
        function aa(a, e, i, t, o, s) {
          return (
            (0, n.wg)(),
            (0, n.iD)("div", H, [
              (0, n._)("h2", null, [
                N,
                (0, n._)("div", G, [
                  (0, n._)(
                    "div",
                    {
                      class: (0, r.C_)({ "selected-app": !a.selectedApp }),
                      onClick: e[0] || (e[0] = (e) => (a.selectedApp = 0)),
                    },
                    " za učenike i roditelje ",
                    2,
                  ),
                  (0, n._)(
                    "div",
                    {
                      class: (0, r.C_)({ "selected-app": a.selectedApp }),
                      onClick: e[1] || (e[1] = (e) => (a.selectedApp = 1)),
                    },
                    " za nastavnike ",
                    2,
                  ),
                ]),
              ]),
              a.selectedApp
                ? ((0, n.wg)(), (0, n.iD)(n.HY, { key: 1 }, [$], 64))
                : ((0, n.wg)(),
                  (0, n.iD)(
                    n.HY,
                    { key: 0 },
                    [
                      (0, n._)("h3", null, [
                        (0, n.Uk)("Verzija " + (0, r.zw)(a.$lastVersion), 1),
                        Y,
                      ]),
                      _,
                    ],
                    64,
                  )),
            ])
          );
        }
        var ea = (0, n.aZ)({
          name: "Changelog",
          data() {
            return { selectedApp: 0 };
          },
        });
        const ia = (0, D.Z)(ea, [
          ["render", aa],
          ["__scopeId", "data-v-be6aa032"],
        ]);
        var ta = ia,
          na = i.p + "img/python2.e09cf982.png",
          oa = i.p + "img/v1.32af317d.png",
          ra = i.p + "img/v2.a7c7f435.png",
          sa = i.p + "img/v3.2ba4d694.png";
        const la = { class: "card content-card" },
          da = (0, n.uE)(
            '<h2 data-v-13419404>Povijest razvoja</h2> Ovako je e-Dnevnik Plus izgledao krajem 2018. godine: <img src="' +
              na +
              '" data-v-13419404>300 linija Python koda (ispušta i zvukove :P). Zapravo, tada aplikacija još nije niti imala naziv. Bilo je moguće navigirati razredima, predmetima, uređivati ocjene i pregledavati razrednu statistiku ocjena. Naziv sam osmislio nakon što sam završio prvu verziju proširenja za Chrome Web Trgovinu. To mi je prva web aplikacija, sa 16 godina u 2. razredu srednje škole TŠSB.<br data-v-13419404><br data-v-13419404>Ovako je e-Dnevnik Plus izgledao početkom 2019. godine: <img src="' +
              oa +
              '" data-v-13419404> Nakon podjele na Redditu i prvih 500 korisnika, Srednja.hr objavljuje <a class="plus" href="https://www.srednja.hr/zbornica/srednjoskolac-iz-broda-osmislio-program-e-dnevnik-plus-predvida-prosjek-ocjena/" target="_blank" data-v-13419404> članak</a>, a potom i nekoliko drugih portala. Proširenje dostiže 2500 tjedno aktivnih korisnika pred kraj školske godine. Prelazim u ETŠ Zagreb i nastavljam nadograđivati proširenje s mnoštvom novih funkcionalnosti. Od školske godine 2019./2020. e-Dnevnik više ne prikazuje prosjek ocjena i naglo se povećava potražnja za proširenjem. Početkom 2020. godine objavio sam e-Dnevnik Plus za nastavnike i <a class="plus" href="https://chrisross5.github.io/e-dnevnik-plus-homepage-old/skole/" target="_blank" data-v-13419404>e-Dnevnik Plus za škole</a> (verzija za info-stupove).<br data-v-13419404><br data-v-13419404> Ovako je e-Dnevnik Plus izgledao školske godine 2019./2020.: <img src="' +
              ra +
              '" data-v-13419404> Pred početak školske godine 2020./2021., e-Dnevnik je redizajniran s novim funkcionalnostima. To znači da sam trebao izraditi gotovo sve ispočetka. <a class="plus" href="https://www.youtube.com/watch?v=t_lQPHSU8T4&amp;list=PLzgE2RyhiYODJlMcdx7AzpmclEBe0Dbeo&amp;ab_channel=KristijanRoss" target="_blank" data-v-13419404> Playlista na Youtubeu</a> sadrži obilaske kroz 4 najbitnije stare verzije proširenja. Stara naslovna stranica (s verzijama &lt; 5.0) nalazi se <a class="plus" href="https://chrisross5.github.io/e-dnevnik-plus-homepage-old/" target="_blank" data-v-13419404> ovdje</a>.<br data-v-13419404><br data-v-13419404> Ovako je e-Dnevnik Plus izgledao školske godine 2020./2021.: <img src="' +
              sa +
              '" data-v-13419404> e-Dnevnik Plus pobjeđuje na <a class="plus" href="https://informatika.azoo.hr/natjecanje/dogadjaj/614/rezultati" target="_blank" data-v-13419404> državnom natjecanju iz informatike </a> te je izabran kao najbolji rad na izložbi <a class="plus" href="https://inova-croatia.com/en/product-detail/e-dnevnik-plus-2/" target="_blank" data-v-13419404> INOVA</a>. Ipak, godinu dana kasnije (ljeto 2021. nakon mature) odlučujem opet izbrisati sve i započeti iznova, ali ovaj put s boljim tehnologijama. Stoga, danas postoji moja moderna verzija e-Dnevnika - Plus App, ali i jednostavna Classic verzija koja se ugrađuje u e-Dnevnik kao što je bilo i prije. <br data-v-13419404><br data-v-13419404><hr data-v-13419404><br data-v-13419404> e-Dnevnik Plus 5.0 je Open Source, izrađen u Vue Frameworku s Typescriptom. Za donacije, klikni <a class="plus" href="https://ednevnik.plus/donacije" target="_blank" data-v-13419404> ovdje</a>. Za pregled drugih aplikacija i proširenja, vidi moj Developer Portfolio na <a class="plus" href="https://k1k1.dev/" target="_blank" data-v-13419404> k1k1.dev</a>. <br data-v-13419404><br data-v-13419404><br data-v-13419404><br data-v-13419404><div style="color:gray;font-style:italic;text-align:right;" data-v-13419404> — Kristijan Rosandić </div>',
            45,
          ),
          pa = [da];
        function ca(a, e, i, t, o, r) {
          return (0, n.wg)(), (0, n.iD)("div", la, pa);
        }
        var ua = (0, n.aZ)({ name: "Author" });
        const va = (0, D.Z)(ua, [
          ["render", ca],
          ["__scopeId", "data-v-13419404"],
        ]);
        var ka = va,
          ma =
            "data:image/png;base64,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",
          ga = i.p + "img/review-icon.ea73cd0d.png",
          ha = i.p + "img/code-icon.d99150da.png",
          Aa = i.p + "img/chrome-icon.0ad747b0.png",
          ja = i.p + "img/edge-icon.03dc3cb9.png",
          ba = i.p + "img/browser.74f7a635.png";
        const fa = (a) => (
            (0, n.dD)("data-v-7b854728"), (a = a()), (0, n.Cn)(), a
          ),
          wa = { id: "content" },
          Ca = { key: 0, id: "main", class: "main-message" },
          za = { key: 1, id: "main", class: "main-message" },
          Ba = { key: 2, id: "main" },
          ya = fa(() =>
            (0, n._)(
              "div",
              { id: "downloads" },
              [
                (0, n._)("div", { class: "download-item" }, [
                  (0, n._)(
                    "a",
                    {
                      href: "https://chrome.google.com/webstore/detail/e-dnevnik-plus/bcnccmamhmcabokipgjechdeealcmdbe",
                      target: "_blank",
                      class: "card",
                    },
                    [
                      (0, n._)("img", { src: ma }),
                      (0, n.Uk)(" Preuzmi "),
                      (0, n._)("em", null, "proširenje"),
                      (0, n.Uk)(" za učenike i roditelje "),
                    ],
                  ),
                  (0, n._)(
                    "a",
                    {
                      href: "https://chrome.google.com/webstore/detail/e-dnevnik-plus/bcnccmamhmcabokipgjechdeealcmdbe/reviews",
                      target: "_blank",
                      class: "card",
                    },
                    [(0, n._)("img", { src: ga })],
                  ),
                  (0, n._)(
                    "a",
                    {
                      href: "https://github.com/ChrisRoss5/e-Dnevnik-Plus",
                      target: "_blank",
                      class: "card",
                    },
                    [(0, n._)("img", { src: ha })],
                  ),
                ]),
                (0, n._)("div", { class: "download-item" }, [
                  (0, n._)(
                    "a",
                    {
                      href: "https://chrome.google.com/webstore/detail/e-dnevnik-plus-za-nastavn/jefappmpehdgllijkjpekdmkbmbigbnl",
                      target: "_blank",
                      class: "card",
                    },
                    [
                      (0, n._)("img", { src: ma }),
                      (0, n.Uk)(" Preuzmi "),
                      (0, n._)("em", null, "proširenje"),
                      (0, n.Uk)(" za nastavnike "),
                    ],
                  ),
                  (0, n._)(
                    "a",
                    {
                      href: "https://chrome.google.com/webstore/detail/e-dnevnik-plus-za-nastavn/jefappmpehdgllijkjpekdmkbmbigbnl/reviews",
                      target: "_blank",
                      class: "card",
                    },
                    [(0, n._)("img", { src: ga })],
                  ),
                  (0, n._)(
                    "a",
                    {
                      href: "https://github.com/ChrisRoss5/e-Dnevnik-Plus-za-nastavnike",
                      target: "_blank",
                      class: "card",
                    },
                    [(0, n._)("img", { src: ha })],
                  ),
                ]),
              ],
              -1,
            ),
          ),
          Pa = fa(() =>
            (0, n._)(
              "div",
              { id: "browsers", class: "card" },
              [
                (0, n._)(
                  "div",
                  { style: { "padding-bottom": "10px" } },
                  "Kompatibilni preglednici:",
                ),
                (0, n._)("div", { id: "browser-icons" }, [
                  (0, n._)("div", { class: "flex-center" }, [
                    (0, n._)("img", { src: Aa }),
                    (0, n.Uk)(" Chrome "),
                  ]),
                  (0, n._)("div", { class: "flex-center" }, [
                    (0, n._)("img", { src: ja }),
                    (0, n.Uk)(" Edge "),
                  ]),
                ]),
              ],
              -1,
            ),
          ),
          Da = [ya, Pa],
          Sa = fa(() =>
            (0, n._)(
              "div",
              { id: "browser" },
              [(0, n._)("img", { src: ba })],
              -1,
            ),
          );
        function Ua(a, e, i, o, s, l) {
          return (
            (0, n.wg)(),
            (0, n.iD)("div", wa, [
              (0, n.Wm)(
                t.uT,
                { name: "opacity", mode: "out-in" },
                {
                  default: (0, n.w5)(() => [
                    "#instaliran" == a.$route.hash
                      ? ((0, n.wg)(),
                        (0, n.iD)(
                          "div",
                          Ca,
                          " Proširenje je uspješno instalirano! ",
                        ))
                      : "#azuriran" == a.$route.hash
                      ? ((0, n.wg)(),
                        (0, n.iD)(
                          "div",
                          za,
                          " Proširenje je ažurirano na najnoviju verziju " +
                            (0, r.zw)(a.$lastVersion) +
                            "! ",
                          1,
                        ))
                      : ((0, n.wg)(), (0, n.iD)("div", Ba, Da)),
                  ]),
                  _: 1,
                },
              ),
              Sa,
            ])
          );
        }
        var Ea = (0, n.aZ)({
          name: "Home",
          mounted() {
            this.$route.hash &&
              setTimeout(
                () => this.$router.replace({ hash: "#jupiiiii" }),
                6e3,
              );
          },
        });
        const xa = (0, D.Z)(Ea, [
          ["render", Ua],
          ["__scopeId", "data-v-7b854728"],
        ]);
        var Oa = xa;
        const Ia = { class: "card content-card" },
          La = (0, n.Uk)(" Politika Privatnosti "),
          Wa = { id: "app-types", class: "card" },
          Ta = (0, n.uE)(
            " Ovaj dokument objašnjava kako proširenje e-Dnevnik Plus koristi i čuva vaše osobne podatke, prikupljene prilikom njena korištenja. Dokument se može promijeniti u bilo koje vrijeme o čemu ćete biti pravovremeno obaviješteni prilikom ažuriranja proširenja. <h3 data-v-80b15274>Koje osobne podatke proširenje prikuplja</h3> Prikupljeni osobni podaci su vaše korisničko ime i lozinka HUSO AAI računa. <h3 data-v-80b15274>Zašto proširenje prikuplja osobne podatke</h3> Podaci se koriste u svrhu automatske prijave ili odjave iz e-Dnevnika te za spremanje korisnikovih podataka poput bilješki i postavki u kalendaru. <h3 data-v-80b15274>Gdje se nalaze prikupljeni osobni podaci</h3> Svi prikupljeni podaci (ne samo osobni) ostaju spremljeni lokalno na vašem uređaju te podacima ne može pristupiti <strong data-v-80b15274>nitko osim vas</strong>. Prilikom deinstalacije svi podaci se trajno brišu. <h3 data-v-80b15274>Google Analytics</h3> U svrhu pružanja bolje usluge i razumijevanja potreba korisnika koristim se alatom Google Analytics. Iako Google bilježi veliki broj informacija poput geografskih i demografskih pokazatelja, vaši osobni podaci su zaštićeni te ne postoji način identifikacije korisnika. <h3 data-v-80b15274>Kontakt</h3> Upite vezane uz ovaj dokument možete tražiti putem email-a: <em data-v-80b15274>kristijan.ros@gmail.com</em>",
            14,
          ),
          Ka = (0, n.Uk)(
            "Proširenje ne prikuplja podatke niti me izvještava o prometu na web mjestima e-Dnevnika.",
          );
        function Ra(a, e, i, t, o, s) {
          return (
            (0, n.wg)(),
            (0, n.iD)("div", Ia, [
              (0, n._)("h2", null, [
                La,
                (0, n._)("div", Wa, [
                  (0, n._)(
                    "div",
                    {
                      class: (0, r.C_)({ "selected-app": !a.selectedApp }),
                      onClick: e[0] || (e[0] = (e) => (a.selectedApp = 0)),
                    },
                    " za učenike i roditelje ",
                    2,
                  ),
                  (0, n._)(
                    "div",
                    {
                      class: (0, r.C_)({ "selected-app": a.selectedApp }),
                      onClick: e[1] || (e[1] = (e) => (a.selectedApp = 1)),
                    },
                    " za nastavnike ",
                    2,
                  ),
                ]),
              ]),
              a.selectedApp
                ? ((0, n.wg)(), (0, n.iD)(n.HY, { key: 1 }, [Ka], 64))
                : ((0, n.wg)(), (0, n.iD)(n.HY, { key: 0 }, [Ta], 64)),
            ])
          );
        }
        var Qa = (0, n.aZ)({
          name: "PrivacyPolicy",
          data() {
            return { selectedApp: 0 };
          },
        });
        const qa = (0, D.Z)(Qa, [
          ["render", Ra],
          ["__scopeId", "data-v-80b15274"],
        ]);
        var Fa = qa;
        const Za = [
            { path: "/", component: Oa },
            { path: "/politika-privatnosti", component: Fa },
            { path: "/povijest", component: ta },
            { path: "/autor", component: ka },
            {
              path: "/deinstalacija",
              component: () => i.e(80).then(i.bind(i, 9080)),
            },
            {
              path: "/donacije",
              component: () => i.e(639).then(i.bind(i, 2639)),
            },
            { path: "/:pathMatch(.*)", redirect: "/" },
          ],
          Ma = (0, J.p7)({ history: (0, J.PO)(""), routes: Za });
        var Ja = Ma;
        const Va = (0, t.ri)(M);
        function Xa() {
          try {
            return window.self !== window.top;
          } catch (a) {
            return !0;
          }
        }
        (Va.config.globalProperties.$lastVersion = "5.0.1"),
          (Va.config.globalProperties.$isMobile =
            window.matchMedia("(max-width: 768px)").matches),
          (Va.config.globalProperties.$inApp = Xa()),
          Va.use(Ja).mount("#app");
      },
    },
    e = {};
  function i(t) {
    var n = e[t];
    if (void 0 !== n) return n.exports;
    var o = (e[t] = { exports: {} });
    return a[t](o, o.exports, i), o.exports;
  }
  (i.m = a),
    (function () {
      var a = [];
      i.O = function (e, t, n, o) {
        if (!t) {
          var r = 1 / 0;
          for (p = 0; p < a.length; p++) {
            (t = a[p][0]), (n = a[p][1]), (o = a[p][2]);
            for (var s = !0, l = 0; l < t.length; l++)
              (!1 & o || r >= o) &&
              Object.keys(i.O).every(function (a) {
                return i.O[a](t[l]);
              })
                ? t.splice(l--, 1)
                : ((s = !1), o < r && (r = o));
            if (s) {
              a.splice(p--, 1);
              var d = n();
              void 0 !== d && (e = d);
            }
          }
          return e;
        }
        o = o || 0;
        for (var p = a.length; p > 0 && a[p - 1][2] > o; p--) a[p] = a[p - 1];
        a[p] = [t, n, o];
      };
    })(),
    (function () {
      i.d = function (a, e) {
        for (var t in e)
          i.o(e, t) &&
            !i.o(a, t) &&
            Object.defineProperty(a, t, { enumerable: !0, get: e[t] });
      };
    })(),
    (function () {
      (i.f = {}),
        (i.e = function (a) {
          return Promise.all(
            Object.keys(i.f).reduce(function (e, t) {
              return i.f[t](a, e), e;
            }, []),
          );
        });
    })(),
    (function () {
      i.u = function (a) {
        return "js/" + a + "." + { 80: "a8b4d72a", 639: "0dd7dead" }[a] + ".js";
      };
    })(),
    (function () {
      i.miniCssF = function (a) {
        return (
          "css/" + a + "." + { 80: "91e578e1", 639: "5935fe1c" }[a] + ".css"
        );
      };
    })(),
    (function () {
      i.g = (function () {
        if ("object" === typeof globalThis) return globalThis;
        try {
          return this || new Function("return this")();
        } catch (a) {
          if ("object" === typeof window) return window;
        }
      })();
    })(),
    (function () {
      i.o = function (a, e) {
        return Object.prototype.hasOwnProperty.call(a, e);
      };
    })(),
    (function () {
      var a = {},
        e = "ednevnik.plus:";
      i.l = function (t, n, o, r) {
        if (a[t]) a[t].push(n);
        else {
          var s, l;
          if (void 0 !== o)
            for (
              var d = document.getElementsByTagName("script"), p = 0;
              p < d.length;
              p++
            ) {
              var c = d[p];
              if (
                c.getAttribute("src") == t ||
                c.getAttribute("data-webpack") == e + o
              ) {
                s = c;
                break;
              }
            }
          s ||
            ((l = !0),
            (s = document.createElement("script")),
            (s.charset = "utf-8"),
            (s.timeout = 120),
            i.nc && s.setAttribute("nonce", i.nc),
            s.setAttribute("data-webpack", e + o),
            (s.src = t)),
            (a[t] = [n]);
          var u = function (e, i) {
              (s.onerror = s.onload = null), clearTimeout(v);
              var n = a[t];
              if (
                (delete a[t],
                s.parentNode && s.parentNode.removeChild(s),
                n &&
                  n.forEach(function (a) {
                    return a(i);
                  }),
                e)
              )
                return e(i);
            },
            v = setTimeout(
              u.bind(null, void 0, { type: "timeout", target: s }),
              12e4,
            );
          (s.onerror = u.bind(null, s.onerror)),
            (s.onload = u.bind(null, s.onload)),
            l && document.head.appendChild(s);
        }
      };
    })(),
    (function () {
      i.r = function (a) {
        "undefined" !== typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(a, Symbol.toStringTag, { value: "Module" }),
          Object.defineProperty(a, "__esModule", { value: !0 });
      };
    })(),
    (function () {
      i.p = "";
    })(),
    (function () {
      var a = function (a, e, i, t) {
          var n = document.createElement("link");
          (n.rel = "stylesheet"), (n.type = "text/css");
          var o = function (o) {
            if (((n.onerror = n.onload = null), "load" === o.type)) i();
            else {
              var r = o && ("load" === o.type ? "missing" : o.type),
                s = (o && o.target && o.target.href) || e,
                l = new Error(
                  "Loading CSS chunk " + a + " failed.\n(" + s + ")",
                );
              (l.code = "CSS_CHUNK_LOAD_FAILED"),
                (l.type = r),
                (l.request = s),
                n.parentNode.removeChild(n),
                t(l);
            }
          };
          return (
            (n.onerror = n.onload = o),
            (n.href = e),
            document.head.appendChild(n),
            n
          );
        },
        e = function (a, e) {
          for (
            var i = document.getElementsByTagName("link"), t = 0;
            t < i.length;
            t++
          ) {
            var n = i[t],
              o = n.getAttribute("data-href") || n.getAttribute("href");
            if ("stylesheet" === n.rel && (o === a || o === e)) return n;
          }
          var r = document.getElementsByTagName("style");
          for (t = 0; t < r.length; t++) {
            (n = r[t]), (o = n.getAttribute("data-href"));
            if (o === a || o === e) return n;
          }
        },
        t = function (t) {
          return new Promise(function (n, o) {
            var r = i.miniCssF(t),
              s = i.p + r;
            if (e(r, s)) return n();
            a(t, s, n, o);
          });
        },
        n = { 143: 0 };
      i.f.miniCss = function (a, e) {
        var i = { 80: 1, 639: 1 };
        n[a]
          ? e.push(n[a])
          : 0 !== n[a] &&
            i[a] &&
            e.push(
              (n[a] = t(a).then(
                function () {
                  n[a] = 0;
                },
                function (e) {
                  throw (delete n[a], e);
                },
              )),
            );
      };
    })(),
    (function () {
      var a = { 143: 0 };
      (i.f.j = function (e, t) {
        var n = i.o(a, e) ? a[e] : void 0;
        if (0 !== n)
          if (n) t.push(n[2]);
          else {
            var o = new Promise(function (i, t) {
              n = a[e] = [i, t];
            });
            t.push((n[2] = o));
            var r = i.p + i.u(e),
              s = new Error(),
              l = function (t) {
                if (i.o(a, e) && ((n = a[e]), 0 !== n && (a[e] = void 0), n)) {
                  var o = t && ("load" === t.type ? "missing" : t.type),
                    r = t && t.target && t.target.src;
                  (s.message =
                    "Loading chunk " + e + " failed.\n(" + o + ": " + r + ")"),
                    (s.name = "ChunkLoadError"),
                    (s.type = o),
                    (s.request = r),
                    n[1](s);
                }
              };
            i.l(r, l, "chunk-" + e, e);
          }
      }),
        (i.O.j = function (e) {
          return 0 === a[e];
        });
      var e = function (e, t) {
          var n,
            o,
            r = t[0],
            s = t[1],
            l = t[2],
            d = 0;
          if (
            r.some(function (e) {
              return 0 !== a[e];
            })
          ) {
            for (n in s) i.o(s, n) && (i.m[n] = s[n]);
            if (l) var p = l(i);
          }
          for (e && e(t); d < r.length; d++)
            (o = r[d]), i.o(a, o) && a[o] && a[o][0](), (a[o] = 0);
          return i.O(p);
        },
        t = (self["webpackChunkednevnik_plus"] =
          self["webpackChunkednevnik_plus"] || []);
      t.forEach(e.bind(null, 0)), (t.push = e.bind(null, t.push.bind(t)));
    })();
  var t = i.O(void 0, [998], function () {
    return i(3631);
  });
  t = i.O(t);
})();
//# sourceMappingURL=app.1f807ce3.js.map
