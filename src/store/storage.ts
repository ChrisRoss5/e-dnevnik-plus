const state = {
  settings: {},
  users: [
    {
      email: "kristijan.rosandicq@skole.hr",
      password: "grandayyy",
      fullName: "Kristijan Rosandić",
      classesList: [
        {
          url: "https://ocjene.skole.hr/class_action/4081787930/course",
          name: "4.C",
          year: "2020./2021.",
          school: "Elektrotehnička škola",
          finalGrade: "4.80",
          lastUpdated: 1628622415.042,
          cachedSubjects: [
            {
              url: "https://ocjene.skole.hr/grade/37245361120",
              name: "Hrvatski jezik",
              teachers: "Sanja Telebar Erceg",
              lastUpdated: 1628262145.836,
              grades: [
                {
                  name: "književnost",
                  grades: [[], [4], [1, 2], [3], [], [2, 1], [], [], [3], []],
                },
                {
                  name: "jezik",
                  grades: [[2], [], [4], [2], [], [], [5], [3], [], []],
                },
                {
                  name: "usmeno izražavanje",
                  grades: [[], [4], [1], [], [], [], [], [], [4], []],
                },
                {
                  name: "pisano izražavanje",
                  grades: [[], [], [], [4], [], [4], [3], [3], [2], []],
                },
              ],
              finalGrade: 3,
              lastNote: {
                note:
                  "Usmeni ispravak provjere pročitanosti lektirnoga djela (Krleža: Gospoda Glembajevi): ocjena dovoljan",
                date: "21.5.2021.",
                grade: "",
              },
            },
            {
              url: "https://ocjene.skole.hr/grade/37252423040",
              name: "Politika i gospodarstvo",
              teachers: "Ana Šutalo Barić",
              lastUpdated: 1628262145.836,
              grades: [
                {
                  name:
                    "001. usvojenost temeljnih koncepata političke i ekonomske pismenosti",
                  grades: [[], [], [4], [], [], [5], [5], [], [4], []],
                },
                {
                  name: "002. vještina primjene naučenih koncepata",
                  grades: [[], [5], [], [5], [], [], [], [5], [], []],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note:
                  "2. Pisana provjera znanja - Gospodarstvo\nBodovi:  26/30",
                date: "4.5.2021.",
                grade: "4",
              },
            },
            {
              url: "https://ocjene.skole.hr/grade/37254634940",
              name: "Tjelesna i zdravstvena kultura",
              teachers: "Josip Kaurin",
              lastUpdated: 1628262145.836,
              grades: [
                {
                  name: "motorička znanja",
                  grades: [[], [], [], [], [], [], [4], [], [], []],
                },
                {
                  name: "motorička postignuća",
                  grades: [[3], [], [], [], [], [], [4], [], [2], []],
                },
                {
                  name: "kinantropološka postignuća",
                  grades: [[], [4], [], [4], [], [], [], [], [], []],
                },
                {
                  name: "odgojni učinci rada",
                  grades: [[], [5], [], [5], [], [5], [], [], [5], []],
                },
              ],
              finalGrade: 4,
              lastNote: {
                note:
                  "dolasci na nastavu, oprema, aktivnost na satu, ponašanje (3, 4 i 5 mj.)",
                date: "17.5.2021.",
                grade: "5",
              },
            },
            {
              url: "https://ocjene.skole.hr/grade/37247144780",
              name: "Engleski jezik I",
              teachers: "Divna Ćurić",
              lastUpdated: 1628262145.836,
              grades: [
                {
                  name: "usmeno izražavanje",
                  grades: [[], [], [5], [5], [], [], [], [], [5], []],
                },
                {
                  name: "pisano izražavanje",
                  grades: [[], [5], [], [], [4], [], [], [], [5, 3], []],
                },
                {
                  name: "jezične zakonitosti",
                  grades: [[], [], [], [], [], [], [5], [], [5], []],
                },
                {
                  name: "slušanje i čitanje s razumijevanjem",
                  grades: [[], [], [], [], [], [], [4], [], [], []],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note: "English in Use",
                date: "25.5.2021.",
                grade: "5",
              },
            },
            {
              url: "https://ocjene.skole.hr/grade/37262740190",
              name: "Vjeronauk (izborni)",
              teachers: "Ivan Banožić",
              lastUpdated: 1628262145.836,
              grades: [
                {
                  name: "aktivnost - zalaganje",
                  grades: [[], [5], [], [4], [5], [5], [], [], [5], []],
                },
                {
                  name: "znanje",
                  grades: [[], [], [], [], [], [], [], [], [4], []],
                },
                {
                  name: "kultura komuniciranja",
                  grades: [[], [5], [], [], [5], [], [5], [], [5], []],
                },
                {
                  name: "stvaralačko izražavanje",
                  grades: [[], [], [], [], [5], [], [], [], [5], []],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note: "Provjera znanja",
                date: "21.5.2021.",
                grade: "4",
              },
            },
            {
              url: "https://ocjene.skole.hr/grade/37278230560",
              name: "Tehničko i poslovno komuniciranje",
              teachers: "Martina Filipović-Tretinjak",
              lastUpdated: 1628262145.836,
              grades: [
                {
                  name: "usvojenost programskih sadržaja",
                  grades: [[], [], [], [5], [], [], [5], [4], [], []],
                },
                {
                  name: "primjena znanja",
                  grades: [[], [], [5, 5], [], [], [5], [], [], [5], []],
                },
                {
                  name: "sudjelovanje u nastavnom procesu",
                  grades: [[], [], [5], [], [], [], [5], [], [], []],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note: "prijedlog zaključne ocjene (5) odličan",
                date: "17.5.2021.",
                grade: "",
              },
            },
            {
              url: "https://ocjene.skole.hr/grade/37278793130",
              name: "Konfiguriranje računalnih mreža i servisa",
              teachers: "Ljubomir Mitrović",
              lastUpdated: 1628262145.836,
              grades: [
                {
                  name: "poznavanje i razumijevanje nastavnih sadržaja",
                  grades: [[], [4], [5], [], [], [5], [5], [], [5], []],
                },
                {
                  name:
                    "praktična i kreativna primjena usvojenih nastavnih sadržaja",
                  grades: [[], [], [5], [], [5], [5], [3], [5], [5], []],
                },
                {
                  name: "sudjelovanje u nastavi",
                  grades: [[], [], [], [], [], [5], [], [], [], []],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note: "IV pismena provjera",
                date: "14.5.2021.",
                grade: "5",
              },
            },
            {
              url: "https://ocjene.skole.hr/grade/37279324390",
              name: "Sigurnost informacijskih sustava",
              teachers: "Romana Bogut",
              lastUpdated: 1628262145.836,
              grades: [
                {
                  name: "usvojenost programskih sadržaja",
                  grades: [[], [5, 5], [5], [5], [], [5], [], [], [5], []],
                },
                {
                  name: "primjena znanja",
                  grades: [[5], [], [5], [5], [], [5], [5], [], [5], []],
                },
                {
                  name: "sudjelovanje u nastavnom procesu",
                  grades: [[], [], [], [], [], [], [5], [], [5], []],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note: "Sigurnosne politike",
                date: "14.5.2021.",
                grade: "5",
              },
            },
            {
              url: "https://ocjene.skole.hr/grade/37281244400",
              name: "Ugradbeni računalni sustavi",
              teachers: "Mario Tretinjak",
              lastUpdated: 1628262145.836,
              grades: [
                {
                  name: "usvojenost programskih sadržaja",
                  grades: [[], [5], [], [], [], [], [5], [], [], []],
                },
                {
                  name: "sudjelovanje u nastavnom procesu",
                  grades: [[5], [], [], [], [], [], [], [], [5], []],
                },
                {
                  name: "primjena znanja",
                  grades: [[], [5], [], [], [], [], [], [], [5], []],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note:
                  "Spajanje i programiranje zadataka tijekom nastavne godine",
                date: "18.5.2021.",
                grade: "5",
              },
            },
            {
              url: "https://ocjene.skole.hr/grade/37283505790",
              name: "Skriptni jezici i web programiranje",
              teachers: "Dunja Tomljenović",
              lastUpdated: 1628262145.836,
              grades: [
                {
                  name: "usvojenost programskih sadržaja",
                  grades: [[], [], [5], [5], [], [], [5], [5], [], []],
                },
                {
                  name: "primjena znanja",
                  grades: [[], [], [5], [5], [], [], [5], [5], [], []],
                },
                {
                  name: "sudjelovanje u nastavnom procesu",
                  grades: [
                    [5, 5],
                    [],
                    [5, 5, 5],
                    [5],
                    [],
                    [5, 5],
                    [],
                    [],
                    [],
                    [],
                  ],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note: "Projektni zadatak: JS Browser BOM",
                date: "21.4.2021.",
                grade: "5",
              },
            },
            {
              url: "https://ocjene.skole.hr/grade/37312462490",
              name: "Multimedija (izborni)",
              teachers: "Danijel Eskeričić",
              lastUpdated: 1628262145.836,
              grades: [
                {
                  name: "usvojenost programskih sadržaja",
                  grades: [[], [], [], [5], [], [], [5], [], [5], []],
                },
                {
                  name: "primjena znanja",
                  grades: [[], [], [5], [], [], [], [], [], [5], []],
                },
                {
                  name: "sudjelovanje u nastavnom procesu",
                  grades: [[], [], [], [5, 5], [], [], [], [], [5], []],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note:
                  "Završni projekt - priprema i obrada video zapisa u programu za obradu video zapisa",
                date: "17.5.2021.",
                grade: "5",
              },
            },
            {
              url: "https://ocjene.skole.hr/grade/37306283310",
              name: "Napredno i objektno programiranje (izborni)",
              teachers: "Matea Biočić",
              lastUpdated: 1628262145.836,
              grades: [
                {
                  name: "usvojenost programskih sadržaja",
                  grades: [[], [], [5], [5], [], [], [], [], [5], []],
                },
                {
                  name: "primjena znanja",
                  grades: [[5], [], [5], [5, 5], [], [5], [], [], [3], []],
                },
                {
                  name: "sudjelovanje u nastavnom procesu",
                  grades: [[], [], [], [5], [], [], [5, 5], [], [3, 1], []],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note: "Projektni zadatak Knjižnica",
                date: "24.5.2021.",
                grade: "3",
              },
            },
            {
              url: "https://ocjene.skole.hr/grade/43125138740",
              name: "Politika i gospodarstvo (dodatna nastava)",
              teachers: "Ana Šutalo Barić",
              lastUpdated: 1628262145.836,
              grades: [],
            },
            {
              url: "https://ocjene.skole.hr/grade/37335797530",
              name: "Sat razrednika",
              teachers: "Martina Filipović-Tretinjak",
              lastUpdated: 1628262145.836,
              grades: [],
            },
            {
              url: "https://ocjene.skole.hr/grade/37272652330",
              name: "Matematika",
              teachers: "Biljana Kuhar",
              lastUpdated: 1628262145.836,
              grades: [
                {
                  name: "usvojenost nastavnih sadržaja",
                  grades: [[], [], [5, 5], [], [5], [], [4], [], [], []],
                },
                {
                  name: "primjena znanja",
                  grades: [[], [], [4], [], [], [3], [3], [], [2], []],
                },
                {
                  name: "ostali oblici praćenja",
                  grades: [[], [], [], [5], [], [], [], [], [5], []],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note:
                  "Učeniku je zaključena ocjena odličan zbog cjelogodišnjeg rada na nastavi i izvan nastave.",
                date: "24.5.2021.",
                grade: "",
              },
            },
            {
              url: "https://ocjene.skole.hr/grade/43282560370",
              name: "Multimedija (dopunska nastava)",
              teachers: "Danijel Eskeričić",
              lastUpdated: 1628262145.836,
              grades: [],
            },
            {
              url: "https://ocjene.skole.hr/grade/43303819860",
              name: "Matematika (dodatna nastava)",
              teachers: "Biljana Kuhar",
              lastUpdated: 1628262145.836,
              grades: [],
            },
            {
              url: "https://ocjene.skole.hr/grade/43432125210",
              name: "Sigurnost informacijskih sustava (dodatna nastava)",
              teachers: "Romana Bogut",
              lastUpdated: 1628262145.836,
              grades: [],
            },
            {
              url: "https://ocjene.skole.hr/grade/37292884650",
              name: "Primijenjena  matematika (izborni)",
              teachers: "Biljana Kuhar",
              lastUpdated: 1628262145.836,
              grades: [
                {
                  name: "usvojenost programskih sadržaja",
                  grades: [[5], [], [3], [], [], [], [], [5], [], []],
                },
                {
                  name: "primjena znanja",
                  grades: [[], [], [3], [], [], [], [], [], [5, 5], []],
                },
                {
                  name: "sudjelovanje u nastavnom procesu",
                  grades: [[], [], [], [5], [], [5], [], [], [5], []],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note: "Polarni sustav, krivulje (5)\nDesmos",
                date: "21.5.2021.",
                grade: "5",
              },
            },
            {
              url: "https://ocjene.skole.hr/grade/37273226010",
              name: "Fizika",
              teachers: "Ljiljana Prevendar",
              lastUpdated: 1628262145.836,
              grades: [
                {
                  name: "usvojenost gradiva",
                  grades: [[], [5], [], [], [5], [], [5], [5], [], []],
                },
                {
                  name: "primjena znanja",
                  grades: [[], [5], [], [], [5], [], [5], [5], [], []],
                },
                {
                  name: "samostalni rad",
                  grades: [[], [], [], [], [], [], [], [], [], []],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note: "5",
                date: "19.5.2021.",
                grade: "",
              },
            },
          ],
        },
        {
          url: "https://ocjene.skole.hr/class_action/3149535710/course",
          name: "3.C",
          year: "2019./2020.",
          school: "Elektrotehnička škola",
          finalGrade: "4.87",
        },
        {
          url: "https://ocjene.skole.hr/class_action/2115037150/course",
          name: "2.C",
          year: "2018./2019.",
          school: "TEHNIČKA ŠKOLA",
          finalGrade: "4.71",
        },
        {
          url: "https://ocjene.skole.hr/class_action/940995980/course",
          name: "8.b",
          year: "2016./2017.",
          school: 'Osnovna škola "Antun Mihanović" Slavonski Brod',
          finalGrade: "4.50",
        },
      ],
      signedIn: false,
      settings: {},
    },
    {
      email: "kristijan.rosandic@skole.hr",
      password: "grandayyy",
      fullName: "Kristijan Rosandić",
      classesList: [
        {
          url: "https://ocjene.skole.hr/class_action/4081787930/course",
          name: "4.C",
          year: "2020./2021.",
          school: "Elektrotehnička škola",
          finalGrade: "4.80",
          headTeacher: "Martina Filipović-Tretinjak",
          lastUpdated: 1628622499.216,
          cachedSubjects: [
            {
              url: "https://ocjene.skole.hr/grade/37245361120",
              name: "Hrvatski jezik",
              teachers: "Sanja Telebar Erceg",
              lastUpdated: 1628622499.216,
              gradesByCategory: [
                {
                  name: "književnost",
                  grades: [[], [4], [1, 2], [3], [], [2, 1], [], [], [3], []],
                },
                {
                  name: "jezik",
                  grades: [[2], [], [4], [2], [], [], [5], [3], [], []],
                },
                {
                  name: "usmeno izražavanje",
                  grades: [[], [4], [1], [], [], [], [], [], [4], []],
                },
                {
                  name: "pisano izražavanje",
                  grades: [[], [], [], [4], [], [4], [3], [3], [2], []],
                },
              ],
              finalGrade: 3,
              lastNote: {
                note:
                  "Usmeni ispravak provjere pročitanosti lektirnoga djela (Krleža: Gospoda Glembajevi): ocjena dovoljan",
                date: "21.5.2021.",
                grade: "",
              },
            },
            {
              url: "https://ocjene.skole.hr/grade/37247144780",
              name: "Engleski jezik I",
              teachers: "Divna Ćurić",
              lastUpdated: 1628622499.216,
              gradesByCategory: [
                {
                  name: "usmeno izražavanje",
                  grades: [[], [], [5], [5], [], [], [], [], [5], []],
                },
                {
                  name: "pisano izražavanje",
                  grades: [[], [5], [], [], [4], [], [], [], [5, 3], []],
                },
                {
                  name: "jezične zakonitosti",
                  grades: [[], [], [], [], [], [], [5], [], [5], []],
                },
                {
                  name: "slušanje i čitanje s razumijevanjem",
                  grades: [[], [], [], [], [], [], [4], [], [], []],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note: "English in Use",
                date: "25.5.2021.",
                grade: "5",
              },
            },
            {
              url: "https://ocjene.skole.hr/grade/37252423040",
              name: "Politika i gospodarstvo",
              teachers: "Ana Šutalo Barić",
              lastUpdated: 1628622499.216,
              gradesByCategory: [
                {
                  name:
                    "001. usvojenost temeljnih koncepata političke i ekonomske pismenosti",
                  grades: [[], [], [4], [], [], [5], [5], [], [4], []],
                },
                {
                  name: "002. vještina primjene naučenih koncepata",
                  grades: [[], [5], [], [5], [], [], [], [5], [], []],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note:
                  "2. Pisana provjera znanja - Gospodarstvo\nBodovi:  26/30",
                date: "4.5.2021.",
                grade: "4",
              },
            },
          ],
        },
        {
          url: "https://ocjene.skole.hr/class_action/3149535710/course",
          name: "3.C",
          year: "2019./2020.",
          school: "Elektrotehnička škola",
          finalGrade: "4.87",
          headTeacher: "Martina Filipović-Tretinjak",
          lastUpdated: 1628622804.63,
          cachedSubjects: [
            {
              url: "https://ocjene.skole.hr/grade/31391268810",
              name: "Hrvatski jezik",
              teachers: "Sanja Telebar Erceg",
              lastUpdated: 1628622804.63,
              gradesByCategory: [
                {
                  name: "književnost",
                  grades: [[], [], [], [3], [], [1], [], [], [2], [2]],
                },
                {
                  name: "jezik",
                  grades: [[], [], [], [5], [5], [], [], [], [4], []],
                },
                {
                  name: "usmeno izražavanje",
                  grades: [[5], [], [], [], [3], [3], [], [], [], []],
                },
                {
                  name: "pisano izražavanje",
                  grades: [[], [5], [], [5], [], [4], [], [], [5], []],
                },
              ],
              finalGrade: 4,
              lastNote: {
                note:
                  "Referat (A. Kovačić: U registraturi): sadržaj, organizacija i povezanost teksta, rječnik, jezična i pravopisna točnost, razvidnost kompozicije, sastavnice referata:\nUčenik je argumentirao tražene smjernice i time ostvario zadanu temu. Uglavnom je poštivao gramatička i pravopisna pravila, kao i razvidnost kompozicije. Međutim, treba pripaziti na sastavnice referata te na popis literature.\nOcjena: odličan",
                date: "17.6.2020.",
                grade: "",
              },
            },
            {
              url: "https://ocjene.skole.hr/grade/31391267800",
              name: "Engleski jezik I",
              teachers: "Divna Ćurić",
              lastUpdated: 1628622804.63,
              gradesByCategory: [
                {
                  name: "usmeno izražavanje",
                  grades: [[], [], [], [], [], [5], [], [], [], [5]],
                },
                {
                  name: "pisano izražavanje",
                  grades: [[], [5], [], [], [], [4], [], [4], [], [4]],
                },
                {
                  name: "jezične zakonitosti",
                  grades: [[], [], [5], [], [], [], [], [], [], [5]],
                },
                {
                  name: "slušanje i čitanje s razumijevanjem",
                  grades: [[], [], [], [3], [], [5], [], [], [], []],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note: "Inspirational teenagers",
                date: "17.6.2020.",
                grade: "5",
              },
            },
            {
              url: "https://ocjene.skole.hr/grade/31391266790",
              name: "Tjelesna i zdravstvena kultura",
              teachers: "Josip Kaurin",
              lastUpdated: 1628622804.63,
              gradesByCategory: [
                {
                  name: "motorička znanja",
                  grades: [[], [], [], [], [], [], [], [], [4], []],
                },
                {
                  name: "motorička postignuća",
                  grades: [[], [], [4], [], [], [], [], [], [5, 4], []],
                },
                {
                  name: "kinantropološka postignuća",
                  grades: [[], [], [4], [], [], [], [], [], [5], []],
                },
                {
                  name: "odgojni učinci rada",
                  grades: [[], [], [5], [5], [], [], [], [], [5], [5]],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note: "",
                date: "18.6.2020.",
                grade: "5",
              },
            },
          ],
        },
        {
          url: "https://ocjene.skole.hr/class_action/2115037150/course",
          name: "2.C",
          year: "2018./2019.",
          school: "TEHNIČKA ŠKOLA",
          finalGrade: "4.71",
          headTeacher: "Božica  Rajković",
          lastUpdated: 1628622811.011,
          cachedSubjects: [
            {
              url: "https://ocjene.skole.hr/grade/22709623930",
              name: "Engleski jezik I",
              teachers: "Mihaela Majetić Stefanović",
              lastUpdated: 1628622811.011,
              gradesByCategory: [
                {
                  name: "govor i razumijevanje",
                  grades: [[], [], [], [5], [], [3, 5], [5], [], [], []],
                },
                {
                  name: "pismeno izražavanje",
                  grades: [[], [5, 5], [], [], [], [], [4], [5], [4], []],
                },
                {
                  name: "jezične zakonitosti",
                  grades: [[], [4], [], [5], [], [4], [5], [], [], []],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note:
                  "Discoursive essay: Teachers and students should be friends on social networks",
                date: "29.5.2019.",
                grade: "4",
              },
            },
            {
              url: "https://ocjene.skole.hr/grade/22700607660",
              name: "Fizika",
              teachers: "Slavica Bernatović",
              lastUpdated: 1628622811.011,
              gradesByCategory: [
                {
                  name:
                    "usvojenost nastavnih sadržaja - usvojenost i razumijevanje nastavnih sadržaja i fizikalnih zakonitosti, praćenjem i vrednovanjem učenikovih aktivnosti, znanja i spoznaja.",
                  grades: [[5], [5, 4], [], [], [5], [], [4, 5], [], [5], []],
                },
                {
                  name:
                    "primjena fizikalnih zakonitosti - primjena i razumijevanje fizikalnih zakonitosti, preko pisanih uradaka i eksperimentalnih istraživanja.",
                  grades: [[], [4], [], [3], [], [4], [4], [4], [4], []],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note:
                  "16.5. Učenik je danas odsutan.\nPriprava za pisanu provjeru.",
                date: "16.5.2019.",
                grade: "",
              },
            },
            {
              url: "https://ocjene.skole.hr/grade/22702812490",
              name: "Matematika",
              teachers: "Marija Lopac",
              lastUpdated: 1628622811.011,
              gradesByCategory: [
                {
                  name: "011. usvojenost nastavnih sadržaja",
                  grades: [
                    [],
                    [5, 5],
                    [5],
                    [5],
                    [],
                    [5, 5],
                    [],
                    [5],
                    [5, 5, 5],
                    [5],
                  ],
                },
                {
                  name: "011 primjena znanja",
                  grades: [[], [5], [], [5], [], [5], [], [5], [], [5]],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note: "poliedri",
                date: "6.6.2019.",
                grade: "5",
              },
            },
          ],
        },
        {
          url: "https://ocjene.skole.hr/class_action/940995980/course",
          name: "8.b",
          year: "2016./2017.",
          school: 'Osnovna škola "Antun Mihanović" Slavonski Brod',
          finalGrade: "4.50",
          headTeacher: "Jelena Kovre",
        },
      ],
      signedIn: true,
      settings: {},
    },
  ],
} as State;

import { State } from "./state";

export default function chromeLocalStorage(data?: State) {
  return new Promise((resolve) => {
    resolve(state);
    //(chrome.storage.local[data ? "set" : "get"] as any)(data || null, resolve);
  });
}

// TODO: chrome.storage.sync
