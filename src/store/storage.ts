const state = {
  settings: {
    darkTheme: true,
    appDisabled: false,
    injectContent: false,
    navbarCollapsed: false
  },
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
          headTeacher: "Martina Filipović-Tretinjak",
          lastUpdated: 1628897171.764,
          cachedSubjects: [
            {
              url: "https://ocjene.skole.hr/grade/37245361120",
              name: "Hrvatski jezik",
              teachers: "Sanja Telebar Erceg",
              gradesByCategory: [
                {
                  name: "Književnost",
                  grades: [[], [4], [1, 2], [3], [], [2, 1], [], [], [3], []],
                },
                {
                  name: "Jezik",
                  grades: [[2], [], [4], [2], [], [], [5], [3], [], []],
                },
                {
                  name: "Usmeno izražavanje",
                  grades: [[], [4], [1], [], [], [], [], [], [4], []],
                },
                {
                  name: "Pisano izražavanje",
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
              lastUpdated: 1628897171.764,
            },
            {
              url: "https://ocjene.skole.hr/grade/37252423040",
              name: "Politika i gospodarstvo",
              teachers: "Ana Šutalo Barić",
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
              lastUpdated: 1628897171.764,
            },
            {
              url: "https://ocjene.skole.hr/grade/37273226010",
              name: "Fizika",
              teachers: "Ljiljana Prevendar",
              gradesByCategory: [
                {
                  name: "Usvojenost gradiva",
                  grades: [[], [5], [], [], [5], [], [5], [5], [], []],
                },
                {
                  name: "Primjena znanja",
                  grades: [[], [5], [], [], [5], [], [5], [5], [], []],
                },
                {
                  name: "Samostalni rad",
                  grades: [[], [], [], [], [], [], [], [], [], []],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note: "5",
                date: "19.5.2021.",
                grade: "",
              },
              lastUpdated: 1628897171.764,
            },
            {
              url: "https://ocjene.skole.hr/grade/37278230560",
              name: "Tehničko i poslovno komuniciranje",
              teachers: "Martina Filipović-Tretinjak",
              gradesByCategory: [
                {
                  name: "Usvojenost programskih sadržaja",
                  grades: [[], [], [], [5], [], [], [5], [4], [], []],
                },
                {
                  name: "Primjena znanja",
                  grades: [[], [], [5, 5], [], [], [5], [], [], [5], []],
                },
                {
                  name: "Sudjelovanje u nastavnom procesu",
                  grades: [[], [], [5], [], [], [], [5], [], [], []],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note: "prijedlog zaključne ocjene (5) odličan",
                date: "17.5.2021.",
                grade: "",
              },
              lastUpdated: 1628897171.764,
            },
            {
              url: "https://ocjene.skole.hr/grade/37279324390",
              name: "Sigurnost informacijskih sustava",
              teachers: "Romana Bogut",
              gradesByCategory: [
                {
                  name: "Usvojenost programskih sadržaja",
                  grades: [[], [5, 5], [5], [5], [], [5], [], [], [5], []],
                },
                {
                  name: "Primjena znanja",
                  grades: [[5], [], [5], [5], [], [5], [5], [], [5], []],
                },
                {
                  name: "Sudjelovanje u nastavnom procesu",
                  grades: [[], [], [], [], [], [], [5], [], [5], []],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note: "Sigurnosne politike",
                date: "14.5.2021.",
                grade: "5",
              },
              lastUpdated: 1628897171.764,
            },
            {
              url: "https://ocjene.skole.hr/grade/37281244400",
              name: "Ugradbeni računalni sustavi",
              teachers: "Mario Tretinjak",
              gradesByCategory: [
                {
                  name: "Usvojenost programskih sadržaja",
                  grades: [[], [5], [], [], [], [], [5], [], [], []],
                },
                {
                  name: "Sudjelovanje u nastavnom procesu",
                  grades: [[5], [], [], [], [], [], [], [], [5], []],
                },
                {
                  name: "Primjena znanja",
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
              lastUpdated: 1628897171.764,
            },
            {
              url: "https://ocjene.skole.hr/grade/37247144780",
              name: "Engleski jezik I",
              teachers: "Divna Ćurić",
              gradesByCategory: [
                {
                  name: "Usmeno izražavanje",
                  grades: [[], [], [5], [5], [], [], [], [], [5], []],
                },
                {
                  name: "Pisano izražavanje",
                  grades: [[], [5], [], [], [4], [], [], [], [5, 3], []],
                },
                {
                  name: "Jezične zakonitosti",
                  grades: [[], [], [], [], [], [], [5], [], [5], []],
                },
                {
                  name: "Slušanje i čitanje s razumijevanjem",
                  grades: [[], [], [], [], [], [], [4], [], [], []],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note: "English in Use",
                date: "25.5.2021.",
                grade: "5",
              },
              lastUpdated: 1628897171.764,
            },
            {
              url: "https://ocjene.skole.hr/grade/37254634940",
              name: "Tjelesna i zdravstvena kultura",
              teachers: "Josip Kaurin",
              gradesByCategory: [
                {
                  name: "Motorička znanja",
                  grades: [[], [], [], [], [], [], [4], [], [], []],
                },
                {
                  name: "Motorička postignuća",
                  grades: [[3], [], [], [], [], [], [4], [], [2], []],
                },
                {
                  name: "Kinantropološka postignuća",
                  grades: [[], [4], [], [4], [], [], [], [], [], []],
                },
                {
                  name: "Odgojni učinci rada",
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
              lastUpdated: 1628897171.764,
            },
            {
              url: "https://ocjene.skole.hr/grade/37306283310",
              name: "Napredno i objektno programiranje (izborni)",
              teachers: "Matea Biočić",
              gradesByCategory: [
                {
                  name: "Usvojenost programskih sadržaja",
                  grades: [[], [], [5], [5], [], [], [], [], [5], []],
                },
                {
                  name: "Primjena znanja",
                  grades: [[5], [], [5], [5, 5], [], [5], [], [], [3], []],
                },
                {
                  name: "Sudjelovanje u nastavnom procesu",
                  grades: [[], [], [], [5], [], [], [5, 5], [], [3, 1], []],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note: "Projektni zadatak Knjižnica",
                date: "24.5.2021.",
                grade: "3",
              },
              lastUpdated: 1628897171.764,
            },
            {
              url: "https://ocjene.skole.hr/grade/37312462490",
              name: "Multimedija (izborni)",
              teachers: "Danijel Eskeričić",
              gradesByCategory: [
                {
                  name: "Usvojenost programskih sadržaja",
                  grades: [[], [], [], [5], [], [], [5], [], [5], []],
                },
                {
                  name: "Primjena znanja",
                  grades: [[], [], [5], [], [], [], [], [], [5], []],
                },
                {
                  name: "Sudjelovanje u nastavnom procesu",
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
              lastUpdated: 1628897171.764,
            },
            {
              url: "https://ocjene.skole.hr/grade/37335797530",
              name: "Sat razrednika",
              teachers: "Martina Filipović-Tretinjak",
              gradesByCategory: [],
              lastUpdated: 1628897171.764,
            },
            {
              url: "https://ocjene.skole.hr/grade/43125138740",
              name: "Politika i gospodarstvo (dodatna nastava)",
              teachers: "Ana Šutalo Barić",
              gradesByCategory: [],
              lastUpdated: 1628897171.764,
            },
            {
              url: "https://ocjene.skole.hr/grade/37292884650",
              name: "Primijenjena  matematika (izborni)",
              teachers: "Biljana Kuhar",
              gradesByCategory: [
                {
                  name: "Usvojenost programskih sadržaja",
                  grades: [[5], [], [3], [], [], [], [], [5], [], []],
                },
                {
                  name: "Primjena znanja",
                  grades: [[], [], [3], [], [], [], [], [], [5, 5], []],
                },
                {
                  name: "Sudjelovanje u nastavnom procesu",
                  grades: [[], [], [], [5], [], [5], [], [], [5], []],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note: "Polarni sustav, krivulje (5)\nDesmos",
                date: "21.5.2021.",
                grade: "5",
              },
              lastUpdated: 1628897171.764,
            },
            {
              url: "https://ocjene.skole.hr/grade/43282560370",
              name: "Multimedija (dopunska nastava)",
              teachers: "Danijel Eskeričić",
              gradesByCategory: [],
              lastUpdated: 1628897171.764,
            },
            {
              url: "https://ocjene.skole.hr/grade/37278793130",
              name: "Konfiguriranje računalnih mreža i servisa",
              teachers: "Ljubomir Mitrović",
              gradesByCategory: [
                {
                  name: "Poznavanje i razumijevanje nastavnih sadržaja",
                  grades: [[], [4], [5], [], [], [5], [5], [], [5], []],
                },
                {
                  name:
                    "Praktična i kreativna primjena usvojenih nastavnih sadržaja",
                  grades: [[], [], [5], [], [5], [5], [3], [5], [5], []],
                },
                {
                  name: "Sudjelovanje u nastavi",
                  grades: [[], [], [], [], [], [5], [], [], [], []],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note: "IV pismena provjera",
                date: "14.5.2021.",
                grade: "5",
              },
              lastUpdated: 1628897171.764,
            },
            {
              url: "https://ocjene.skole.hr/grade/43432125210",
              name: "Sigurnost informacijskih sustava (dodatna nastava)",
              teachers: "Romana Bogut",
              gradesByCategory: [],
              lastUpdated: 1628897171.764,
            },
            {
              url: "https://ocjene.skole.hr/grade/37283505790",
              name: "Skriptni jezici i web programiranje",
              teachers: "Dunja Tomljenović",
              gradesByCategory: [
                {
                  name: "Usvojenost programskih sadržaja",
                  grades: [[], [], [5], [5], [], [], [5], [5], [], []],
                },
                {
                  name: "Primjena znanja",
                  grades: [[], [], [5], [5], [], [], [5], [5], [], []],
                },
                {
                  name: "Sudjelovanje u nastavnom procesu",
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
              lastUpdated: 1628897171.764,
            },
            {
              url: "https://ocjene.skole.hr/grade/43303819860",
              name: "Matematika (dodatna nastava)",
              teachers: "Biljana Kuhar",
              gradesByCategory: [],
              lastUpdated: 1628897171.764,
            },
            {
              url: "https://ocjene.skole.hr/grade/37262740190",
              name: "Vjeronauk (izborni)",
              teachers: "Ivan Banožić",
              gradesByCategory: [
                {
                  name: "Aktivnost - zalaganje",
                  grades: [[], [5], [], [4], [5], [5], [], [], [5], []],
                },
                {
                  name: "Znanje",
                  grades: [[], [], [], [], [], [], [], [], [4], []],
                },
                {
                  name: "Kultura komuniciranja",
                  grades: [[], [5], [], [], [5], [], [5], [], [5], []],
                },
                {
                  name: "Stvaralačko izražavanje",
                  grades: [[], [], [], [], [5], [], [], [], [5], []],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note: "Provjera znanja",
                date: "21.5.2021.",
                grade: "4",
              },
              lastUpdated: 1628897171.764,
            },
            {
              url: "https://ocjene.skole.hr/grade/37272652330",
              name: "Matematika",
              teachers: "Biljana Kuhar",
              gradesByCategory: [
                {
                  name: "Usvojenost nastavnih sadržaja",
                  grades: [[], [], [5, 5], [], [5], [], [4], [], [], []],
                },
                {
                  name: "Primjena znanja",
                  grades: [[], [], [4], [], [], [3], [3], [], [2], []],
                },
                {
                  name: "Ostali oblici praćenja",
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
              lastUpdated: 1628897171.764,
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
        },
        {
          url: "https://ocjene.skole.hr/class_action/2115037150/course",
          name: "2.C",
          year: "2018./2019.",
          school: "TEHNIČKA ŠKOLA",
          finalGrade: "4.71",
          headTeacher: "Božica  Rajković",
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
      lastLoadedClassUrl:
        "https://ocjene.skole.hr/class_action/4081787930/course",
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
