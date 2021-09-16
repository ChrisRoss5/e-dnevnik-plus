/* https://developer.chrome.com/docs/extensions/reference/storage/ */
import { State } from "./state";
import { jsonClone } from "@/scripts/utils";

const defaultState: State = {
  settings: {
    darkTheme: false,
    appDisabled: false,
    injectContent: false,
    navbarCollapsed: false,
  },
  users: [],
};

function chromeLocalStorage(): Promise<State>;
function chromeLocalStorage(data: State): Promise<void>;
function chromeLocalStorage(data?: State): Promise<State | void> {
  return new Promise((resolve) => {
    if (window.devTestMode) return resolve(testState);
    (chrome.storage.local[data ? "set" : "get"] as any)(
      data ? jsonClone(data) : null,
      (savedState: any) => {
        if (data) resolve();
        else resolve((savedState.users ? savedState : defaultState) as State);
      },
    );
  });
}

export default chromeLocalStorage;

// TODO: chrome.storage.sync

/* Paste testing State Object here */

const testState: State = {
  settings: {
    darkTheme: true,
    appDisabled: false,
    injectContent: false,
    navbarCollapsed: false,
  },
  users: [
    {
      email: "kristijan.rosandic@skole.hr",
      password: "grandayyy",
      fullName: "Kristijan Rosandić",
      classesList: [
        {
          url: "https://ocjene.skole.hr/class_action/4081787930/course",
          name: "4.C",
          year: "2020./2021.",
          isYearCompleted: true,
          school: "Elektrotehnička škola",
          finalGrade: "4.80",
          headTeacher: "Martina Filipović-Tretinjak",
          lastUpdated: 1630678926.704,
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
              lastUpdated: 1630678926.704,
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
                note: "Have you ever wondered?\nThe Vikings",
                date: "25.5.2021.",
                grade: "5",
              },
              lastUpdated: 1630678926.704,
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
              lastUpdated: 1630678926.704,
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
              lastUpdated: 1630678926.704,
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
              lastUpdated: 1630678926.704,
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
                note: "Dokumentacija projektnoga zadatka za Inovu",
                date: "18.5.2021.",
                grade: "5",
              },
              lastUpdated: 1630678926.704,
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
              lastUpdated: 1630678926.704,
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
              lastUpdated: 1630678926.704,
            },
            {
              url: "https://ocjene.skole.hr/grade/37306283310",
              name: "Napredno i objektno programiranje (izborni)",
              teachers: "Matea Mužek",
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
                grade: "5",
              },
              lastUpdated: 1630678926.704,
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
                  "Završni projekt - 06:34 min; montaža vlastitog video zapisa, Filmora",
                date: "17.5.2021.",
                grade: "5",
              },
              lastUpdated: 1630678926.704,
            },
            {
              url: "https://ocjene.skole.hr/grade/37335797530",
              name: "Sat razrednika",
              teachers: "Martina Filipović-Tretinjak",
              gradesByCategory: [],
              lastUpdated: 1630678926.704,
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
                note: "Komunikacija",
                date: "21.5.2021.",
                grade: "5",
              },
              lastUpdated: 1630678926.704,
            },
            {
              url: "https://ocjene.skole.hr/grade/43282560370",
              name: "Multimedija (dopunska nastava)",
              teachers: "Danijel Eskeričić",
              gradesByCategory: [],
              lastUpdated: 1630678926.704,
            },
            {
              url: "https://ocjene.skole.hr/grade/43303819860",
              name: "Matematika (dodatna nastava)",
              teachers: "Biljana Kuhar",
              gradesByCategory: [],
              lastUpdated: 1630678926.704,
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
              lastUpdated: 1630678926.704,
            },
            {
              url: "https://ocjene.skole.hr/grade/43432125210",
              name: "Sigurnost informacijskih sustava (dodatna nastava)",
              teachers: "Romana Bogut",
              gradesByCategory: [],
              lastUpdated: 1630678926.704,
            },
            {
              url: "https://ocjene.skole.hr/grade/43125138740",
              name: "Politika i gospodarstvo (dodatna nastava)",
              teachers: "Ana Šutalo Barić",
              gradesByCategory: [],
              lastUpdated: 1630678926.704,
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
              lastUpdated: 1630678926.704,
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
              lastUpdated: 1630678926.704,
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
              lastUpdated: 1630678926.704,
            },
          ],
        },
        {
          url: "https://ocjene.skole.hr/class_action/3149535710/course",
          name: "3.C",
          year: "2019./2020.",
          isYearCompleted: true,
          school: "Elektrotehnička škola",
          finalGrade: "4.87",
          headTeacher: "Martina Filipović-Tretinjak",
          lastUpdated: 1630679056.658,
          cachedSubjects: [
            {
              url: "https://ocjene.skole.hr/grade/10116440950",
              name: "Hrvatski jezik",
              teachers: "Marija Čalušić",
              gradesByCategory: [
                {
                  name: "Hrvatski jezik",
                  grades: [[], [5], [], [1], [], [3], [], [3], [5], []],
                },
                {
                  name: "Književnost",
                  grades: [[], [], [4], [4], [], [], [], [4], [], [4]],
                },
                {
                  name: "Lektira",
                  grades: [[], [4], [2], [], [4], [3], [1], [3], [], []],
                },
                {
                  name: "Jezično izražavanje i stvaranje - usmeno",
                  grades: [[], [], [4], [4], [], [5], [3], [], [], []],
                },
                {
                  name: "Jezično izražavanje i stvaranje - pisano",
                  grades: [[], [3], [4, 4], [], [3], [], [5, 5], [], [], []],
                },
                {
                  name: "Medijska kultura",
                  grades: [[], [], [3], [3], [], [], [4], [3], [], []],
                },
              ],
              finalGrade: 4,
              lastNote: {
                note: "Književnoteorijski pojmovi",
                date: "1.6.2017.",
                grade: "4",
              },
              lastUpdated: 1630679056.658,
            },
            {
              url: "https://ocjene.skole.hr/grade/10116439940",
              name: "Likovna kultura",
              teachers: "Jelena Kovre",
              gradesByCategory: [
                {
                  name: "Izražavanje crtežom",
                  grades: [[], [5], [], [], [], [], [], [], [], []],
                },
                {
                  name: "Kolorističko i tonsko izražavanje",
                  grades: [[], [5], [5], [5], [], [5], [5], [], [], []],
                },
                {
                  name: "Trodimenzionalno oblikovanje",
                  grades: [[], [], [], [], [], [], [], [], [5], []],
                },
                {
                  name: "Grafičko izražavanje",
                  grades: [[], [], [], [5], [], [], [], [], [5], []],
                },
                {
                  name:
                    "Razumijevanje i vrednovanje osnovnih odnosa u umjetničkom djelu",
                  grades: [[], [5], [5], [], [], [5, 5], [5], [], [], []],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note: "Kompozicija linearnih tekstura",
                date: "8.5.2017.",
                grade: "5",
              },
              lastUpdated: 1630679056.658,
            },
            {
              url: "https://ocjene.skole.hr/grade/10116435900",
              name: "Kemija",
              teachers: "Velimir Kljajić",
              gradesByCategory: [
                {
                  name:
                    "Usvojenost, razumijevanje i primjena programskih sadržaja - usmeno",
                  grades: [[], [3], [], [2], [], [], [2], [], [3], []],
                },
                {
                  name:
                    "Usvojenost, razumijevanje i primjena programskih sadržaja - pisano",
                  grades: [[], [], [2], [4], [], [], [4], [1], [], []],
                },
                {
                  name: "Praktični radovi",
                  grades: [[], [4], [3], [4], [], [3], [], [], [4], []],
                },
                {
                  name: "Rješavanje problema",
                  grades: [[], [], [2], [2], [], [], [2], [1], [], []],
                },
              ],
              finalGrade: 3,
              lastNote: {
                note: "Biološki važni spojevi",
                date: "31.5.2017.",
                grade: "3",
              },
              lastUpdated: 1630679056.658,
            },
            {
              url: "https://ocjene.skole.hr/grade/10116434890",
              name: "Fizika",
              teachers: "Željka Kačar",
              gradesByCategory: [
                {
                  name: "Usvojenost programskih sadržaja",
                  grades: [[], [5], [], [5], [5], [], [5, 4], [5], [5], [5]],
                },
                {
                  name: "Praktični radovi",
                  grades: [[], [], [], [], [], [], [], [], [], []],
                },
                {
                  name: "Primjena znanja i vještine",
                  grades: [[], [5], [], [5], [], [], [2], [5], [], []],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note: "Svjetlost - pokazuje razumijevanje usvojenoga gradiva.",
                date: "2.6.2017.",
                grade: "5",
              },
              lastUpdated: 1630679056.658,
            },
            {
              url: "https://ocjene.skole.hr/grade/10116433880",
              name: "Povijest",
              teachers: "Marija Penić",
              gradesByCategory: [
                {
                  name: "Usvojenost osnovnih podataka",
                  grades: [[], [3], [2], [], [3], [4], [3], [], [4], []],
                },
                {
                  name: "Uočavanje uzročno-posljedičnih veza",
                  grades: [[], [], [], [], [5], [4], [], [], [], []],
                },
                {
                  name: "Snalaženje u vremenu i prostoru",
                  grades: [[], [], [], [], [5], [], [5], [], [1], []],
                },
              ],
              finalGrade: 4,
              lastNote: {
                note: "Dekolonizacija i hladni rat",
                date: "9.5.2017.",
                grade: "1",
              },
              lastUpdated: 1630679056.658,
            },
            {
              url: "https://ocjene.skole.hr/grade/10116432870",
              name: "Geografija",
              teachers: "Marija Penić",
              gradesByCategory: [
                {
                  name: "Usvojenost znanja",
                  grades: [[], [4], [4], [3], [], [], [4], [4], [4], []],
                },
                {
                  name: "Uočavanje pojava i procesa",
                  grades: [[], [], [5], [], [], [], [4], [], [4], []],
                },
                {
                  name: "Uporaba zemljovida",
                  grades: [[], [5], [], [2], [], [], [3], [4], [], []],
                },
              ],
              finalGrade: 4,
              lastNote: {
                note: "Naučio s razumijevanjem",
                date: "9.5.2017.",
                grade: "4",
              },
              lastUpdated: 1630679056.658,
            },
            {
              url: "https://ocjene.skole.hr/grade/10116431860",
              name: "Tehnička kultura",
              teachers:
                "Goran Pintarić,       \n\t\t\t\t   \t\t\t    \t\n\t\t\t\t   \t\t\t   \t \tDinko Nadih",
              gradesByCategory: [
                {
                  name: "Usvojenost sadržaja",
                  grades: [[], [], [5], [], [], [], [], [4], [5], []],
                },
                {
                  name: "Radne navike i vještine",
                  grades: [[4], [], [5], [5], [], [4], [4], [5], [5], []],
                },
                {
                  name: "Aktivnost i odnos prema radu",
                  grades: [[], [], [], [5], [], [], [], [5], [], []],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note: "Princip rada elektromotora",
                date: "29.5.2017.",
                grade: "5",
              },
              lastUpdated: 1630679056.658,
            },
            {
              url: "https://ocjene.skole.hr/grade/10116430850",
              name: "Tjelesna i zdravstvena kultura",
              teachers: "Marin Ratković",
              gradesByCategory: [
                {
                  name: "Motorička znanja",
                  grades: [[], [5], [4], [5], [], [5], [5], [2], [5], [5]],
                },
                {
                  name: "Motorička dostignuća",
                  grades: [[], [], [5], [5], [], [], [], [], [5], []],
                },
                {
                  name: "Motoričke sposobnosti",
                  grades: [[], [], [], [], [], [], [], [], [], []],
                },
                {
                  name: "Funkcionalne sposobnosti",
                  grades: [[], [], [], [], [], [], [], [], [], []],
                },
                {
                  name: "Odgojni učinci rada",
                  grades: [[], [], [], [], [], [], [], [], [], []],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note: "",
                date: "1.6.2017.",
                grade: "5",
              },
              lastUpdated: 1630679056.658,
            },
            {
              url: "https://ocjene.skole.hr/grade/11473189100",
              name: "Vjeronauk (izborni)",
              teachers: "Ljiljana Jelavić",
              gradesByCategory: [
                {
                  name: "0.1. usvojenost nastavnih sadržaja / znanje",
                  grades: [[], [], [4], [], [], [], [4], [], [3], []],
                },
                {
                  name: "0.1. stvaralačko izražavanje",
                  grades: [[], [5], [], [5], [], [], [4], [], [], []],
                },
                {
                  name: "0.1 aktivnosti i zalaganje",
                  grades: [[], [2], [], [4], [], [4], [], [4], [], []],
                },
                {
                  name: "0.1 kultura međuosobne komunikacije",
                  grades: [[], [], [4], [], [], [4], [], [], [], [4]],
                },
              ],
              finalGrade: 4,
              lastNote: {
                note: "Pristojan u ponašanju i odnosu prema drugima.",
                date: "7.6.2017.",
                grade: "4",
              },
              lastUpdated: 1630679056.658,
            },
            {
              url: "https://ocjene.skole.hr/grade/11481364040",
              name: "Informatika (izborni)",
              teachers: "Jadranka Horvat",
              gradesByCategory: [
                {
                  name: "Usvojenost sadržaja",
                  grades: [[], [], [5], [5], [], [], [4], [], [5], []],
                },
                {
                  name: "Primjena znanja",
                  grades: [[], [5], [], [], [], [5], [], [5], [], []],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note: "Matrica, hiperveze - zadatak",
                date: "30.5.2017.",
                grade: "5",
              },
              lastUpdated: 1630679056.658,
            },
            {
              url: "https://ocjene.skole.hr/grade/11488477470",
              name: "Sat razrednika",
              teachers: "Jelena Kovre",
              gradesByCategory: [],
              lastUpdated: 1630679056.658,
            },
            {
              url: "https://ocjene.skole.hr/grade/11481361010",
              name: "Engleski jezik I",
              teachers: "Jelena Martinović",
              gradesByCategory: [
                {
                  name: "Razumijevanje",
                  grades: [[], [5], [4], [4], [], [3], [4], [], [5], [5]],
                },
                {
                  name: "Govorne sposobnosti",
                  grades: [[], [5], [4], [], [], [5], [], [5], [], [5]],
                },
                {
                  name: "Sposobnost pisanog izražavanja",
                  grades: [[], [], [], [4], [], [], [5, 5], [], [], []],
                },
                {
                  name: "Jezične zakonitosti",
                  grades: [[], [5], [], [3], [], [3], [3], [], [5], [5]],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note: "Test - tenses, reported speech, passive voice",
                date: "12.6.2017.",
                grade: "5",
              },
              lastUpdated: 1630679056.658,
            },
            {
              url: "https://ocjene.skole.hr/grade/10116438930",
              name: "Glazbena kultura",
              teachers: "Nikola Novosel",
              gradesByCategory: [
                {
                  name: "Pjevanje i sviranje",
                  grades: [[], [], [], [], [], [5], [5], [], [5], []],
                },
                {
                  name: "Intonacija, ritam i glazbeno pismo",
                  grades: [[], [], [], [], [], [], [], [], [], []],
                },
                {
                  name: "Osnove glazbene umjetnosti",
                  grades: [[], [], [], [3], [], [], [5], [], [1], [2]],
                },
              ],
              finalGrade: 4,
              lastNote: {
                note:
                  "Glazbeni stilovi.\nNije učio.Ne poznaje gradivo.Tek tu i tamo neki pojam i to otprilike.",
                date: "12.6.2017.",
                grade: "2",
              },
              lastUpdated: 1630679056.658,
            },
            {
              url: "https://ocjene.skole.hr/grade/10116437920",
              name: "Matematika",
              teachers: "Ivana Šporčić",
              gradesByCategory: [
                {
                  name:
                    "Usvojenost, razumijevanje i primjena programskih sadržaja - usmeno",
                  grades: [[], [], [4], [], [], [5], [], [], [], [5]],
                },
                {
                  name:
                    "Usvojenost, razumijevanje i primjena programskih sadržaja - pisano",
                  grades: [[], [], [4], [5], [], [5, 4], [5], [], [4], [5]],
                },
                {
                  name:
                    "Usvojenost, razumijevanje i primjena programskih sadržaja - domaći uradak",
                  grades: [[], [], [], [], [5], [], [5], [], [5], []],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note: "Analiza 6. ispita znanja - Preslikavanja ravnine",
                date: "12.6.2017.",
                grade: "5",
              },
              lastUpdated: 1630679056.658,
            },
            {
              url: "https://ocjene.skole.hr/grade/10116436910",
              name: "Biologija",
              teachers: "Velimir Kljajić",
              gradesByCategory: [
                {
                  name:
                    "Usvojenost, razumijevanje i primjena programskih sadržaja - usmeno",
                  grades: [[5], [], [], [5], [], [5], [5], [], [5], []],
                },
                {
                  name:
                    "Usvojenost, razumijevanje i primjena programskih sadržaja - pisano",
                  grades: [[], [], [4], [4], [], [3], [], [], [], [4]],
                },
                {
                  name: "Praktični radovi",
                  grades: [[], [3], [], [5], [], [5], [], [], [5], [5]],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note: "Radna bilježnica",
                date: "8.6.2017.",
                grade: "5",
              },
              lastUpdated: 1630679056.658,
            },
          ],
        },
        {
          url: "https://ocjene.skole.hr/class_action/2115037150/course",
          name: "2.C",
          year: "2018./2019.",
          isYearCompleted: true,
          school: "TEHNIČKA ŠKOLA",
          finalGrade: "4.71",
          headTeacher: "Božica  Rajković",
          lastUpdated: 1630679106.563,
          cachedSubjects: [
            {
              url: "https://ocjene.skole.hr/grade/22700607660",
              name: "Fizika",
              teachers: "Slavica Bernatović",
              gradesByCategory: [
                {
                  name:
                    "Usvojenost nastavnih sadržaja - usvojenost i razumijevanje nastavnih sadržaja i fizikalnih zakonitosti, praćenjem i vrednovanjem učenikovih aktivnosti, znanja i spoznaja.",
                  grades: [[5], [5, 4], [], [], [5], [], [4, 5], [], [5], []],
                },
                {
                  name:
                    "Primjena fizikalnih zakonitosti - primjena i razumijevanje fizikalnih zakonitosti, preko pisanih uradaka i eksperimentalnih istraživanja.",
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
              lastUpdated: 1630679106.563,
            },
            {
              url: "https://ocjene.skole.hr/grade/22709623930",
              name: "Engleski jezik I",
              teachers: "Mihaela Majetić Stefanović",
              gradesByCategory: [
                {
                  name: "Govor i razumijevanje",
                  grades: [[], [], [], [5], [], [3, 5], [5], [], [], []],
                },
                {
                  name: "Pismeno izražavanje",
                  grades: [[], [5, 5], [], [], [], [], [4], [5], [4], []],
                },
                {
                  name: "Jezične zakonitosti",
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
              lastUpdated: 1630679106.563,
            },
            {
              url: "https://ocjene.skole.hr/grade/22722467090",
              name: "Povijest",
              teachers: "Manda Degmečić",
              gradesByCategory: [
                {
                  name: "Usvojenost sadržaja",
                  grades: [
                    [],
                    [4],
                    [1],
                    [],
                    [],
                    [1],
                    [],
                    [1],
                    [3, 1, 4],
                    [2, 5],
                  ],
                },
                {
                  name: "011 samostalni rad",
                  grades: [[], [], [], [5], [], [5], [4], [], [], []],
                },
              ],
              finalGrade: 3,
              lastNote: {
                note: "Usmeni odgovor",
                date: "2.10.2018.",
                grade: "4",
              },
              lastUpdated: 1630679106.563,
            },
            {
              url: "https://ocjene.skole.hr/grade/22702812490",
              name: "Matematika",
              teachers: "Marija Lopac",
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
              lastUpdated: 1630679106.563,
            },
            {
              url: "https://ocjene.skole.hr/grade/22725836450",
              name: "Tehnička mehanika",
              teachers: "Božica  Rajković",
              gradesByCategory: [
                {
                  name: "01  usvojenost programskih sadržaja",
                  grades: [
                    [],
                    [2, 5],
                    [],
                    [4],
                    [3],
                    [],
                    [3, 5],
                    [],
                    [2, 5],
                    [],
                  ],
                },
                {
                  name: "Primjena sadržaja",
                  grades: [[], [], [], [], [], [2], [], [], [], []],
                },
                {
                  name: "Suradnja u nastavnom procesu",
                  grades: [[], [], [], [], [1], [], [], [], [5], []],
                },
              ],
              finalGrade: 4,
              lastNote: {
                note:
                  "4. pisana provjera znanja : Naprezanje na savijanje, naprezanje na uvijanje, naprezanje pri izvijanju 11/22",
                date: "10.5.2019.",
                grade: "2",
              },
              lastUpdated: 1630679106.563,
            },
            {
              url: "https://ocjene.skole.hr/grade/22729179550",
              name: "Tehnički materijali",
              teachers: "Mato Galović",
              gradesByCategory: [
                {
                  name: "001 usvojenost programskih sadržaja",
                  grades: [[], [], [], [5], [], [], [5], [], [5], [5]],
                },
                {
                  name: "001 primjena sadržaja",
                  grades: [[], [], [4], [], [], [], [], [5], [5], []],
                },
                {
                  name: "003 suradnja u nastavnom procesu",
                  grades: [[], [], [], [5], [], [5], [], [], [], []],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note: "Usmena provjera znanja - ispitivanje tvrdoće",
                date: "11.6.2019.",
                grade: "5",
              },
              lastUpdated: 1630679106.563,
            },
            {
              url: "https://ocjene.skole.hr/grade/22731134910",
              name: "Tehničko crtanje",
              teachers: "Tatjana Šoronda",
              gradesByCategory: [
                {
                  name: "Usvojenost sadržaja",
                  grades: [[], [], [], [5], [], [], [], [5], [], [5]],
                },
                {
                  name: "Primjena sadržaja",
                  grades: [[5], [5], [], [], [5, 5], [], [5, 5], [], [3], [5]],
                },
                {
                  name: "Suradnja u nastavnom procesu",
                  grades: [[], [], [], [4], [], [], [], [], [4], []],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note: "Crtanje dijelova sklopa ventila",
                date: "4.6.2019.",
                grade: "5",
              },
              lastUpdated: 1630679106.563,
            },
            {
              url: "https://ocjene.skole.hr/grade/22732302470",
              name: "Strojarske tehnologije",
              teachers: "Marko Starčević",
              gradesByCategory: [
                {
                  name: "011. razumijevanje/usvojenost sadržaj",
                  grades: [[], [], [5], [], [], [], [5], [], [], []],
                },
                {
                  name: "011. primjena nastavnih sadržaja",
                  grades: [[], [5], [], [], [], [], [], [5], [], []],
                },
                {
                  name: "02. suradnja u nastavnom procesu",
                  grades: [[], [], [5], [], [5], [], [5], [], [5], [5]],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note: "Predmet V2",
                date: "13.6.2019.",
                grade: "5",
              },
              lastUpdated: 1630679106.563,
            },
            {
              url: "https://ocjene.skole.hr/grade/22743985140",
              name: "Računalstvo",
              teachers: "Zvjezdana Došlić",
              gradesByCategory: [
                {
                  name: "Usvojenost i razumijevanje sadržaja i aktivnost",
                  grades: [[], [3], [5], [], [4], [4], [], [5], [], [5]],
                },
                {
                  name: "001 primjena znanja",
                  grades: [[], [5], [5], [5], [5], [5], [], [], [4], []],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note: "Struktura prezentacije i prezentiranje",
                date: "3.6.2019.",
                grade: "5",
              },
              lastUpdated: 1630679106.563,
            },
            {
              url: "https://ocjene.skole.hr/grade/23833004510",
              name: "Sat razrednika",
              teachers: "Božica  Rajković",
              gradesByCategory: [],
              lastNote: {
                note:
                  "4. Roditeljski sastanak 13.05.2019. (ponedjeljak) u 16.40 h u Strojarskom praktikumu",
                date: "7.5.2019.",
                grade: "",
              },
              lastUpdated: 1630679106.563,
            },
            {
              url: "https://ocjene.skole.hr/grade/22714727460",
              name: "Hrvatski jezik",
              teachers: "Božica Sedlić",
              gradesByCategory: [
                {
                  name: "01 književnost",
                  grades: [
                    [4],
                    [],
                    [5],
                    [],
                    [],
                    [4, 5],
                    [4],
                    [2, 3],
                    [4, 5, 5],
                    [5],
                  ],
                },
                {
                  name: "Jezik",
                  grades: [[], [], [5], [], [], [4], [5], [], [], []],
                },
                {
                  name: "001. jezično izražavanje",
                  grades: [[5], [4], [], [4], [], [], [4], [], [], []],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note: "Književnost romantizma",
                date: "12.6.2019.",
                grade: "5",
              },
              lastUpdated: 1630679106.563,
            },
            {
              url: "https://ocjene.skole.hr/grade/22720479410",
              name: "Geografija",
              teachers: "Hrvoje Ivaniš",
              gradesByCategory: [
                {
                  name: "Usvojenost znanja",
                  grades: [[], [5], [], [], [], [3], [], [], [3], []],
                },
                {
                  name: "Geografske vještine",
                  grades: [[], [5], [], [], [], [], [5], [], [], []],
                },
                {
                  name: "Uporaba zemljovida",
                  grades: [[], [4], [], [], [], [3], [], [], [], []],
                },
              ],
              finalGrade: 4,
              lastNote: {
                note: "Naselja i oblici naseljenosti, prirodno kretanje stan.",
                date: "29.5.2019.",
                grade: "3",
              },
              lastUpdated: 1630679106.563,
            },
            {
              url: "https://ocjene.skole.hr/grade/22724423460",
              name: "Elementi strojeva",
              teachers: "Goran Žikić",
              gradesByCategory: [
                {
                  name: "011 razumijevanje / usvojenost sadržaja",
                  grades: [[], [], [5], [], [], [], [5], [], [5], []],
                },
                {
                  name: "011. primjena nastavnih sadržaja",
                  grades: [[], [5], [], [5], [], [5], [5], [5], [5], [4, 5]],
                },
                {
                  name: "02 suradnja u nastavnom procesu",
                  grades: [[], [5], [], [], [], [], [], [], [], []],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note:
                  "Umna mapa- Finomehanički elementi strojeva- izrada i prezentiranje",
                date: "7.6.2019.",
                grade: "4",
              },
              lastUpdated: 1630679106.563,
            },
            {
              url: "https://ocjene.skole.hr/grade/22716611110",
              name: "Tjelesna i zdravstvena kultura",
              teachers: "Ivan Bilić",
              gradesByCategory: [
                {
                  name: "Motorička znanja",
                  grades: [[], [], [], [5, 5], [], [], [], [], [4], []],
                },
                {
                  name: "Motorička postignuća",
                  grades: [[], [], [], [5], [], [5], [], [], [], []],
                },
                {
                  name: "Kinantropološka postignuća",
                  grades: [[3], [5], [], [], [], [], [], [], [], [3]],
                },
                {
                  name: "Odgojni učinci",
                  grades: [[], [5], [5], [], [], [5], [], [5], [], [5]],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note: "Odgojni učinci ( 5. i 6. mjesec)",
                date: "12.6.2019.",
                grade: "5",
              },
              lastUpdated: 1630679106.563,
            },
            {
              url: "https://ocjene.skole.hr/grade/22718042280",
              name: "Vjeronauk",
              teachers: "Andrea Rašić",
              gradesByCategory: [
                {
                  name: "Znanje",
                  grades: [[], [], [], [4], [], [], [], [5], [], []],
                },
                {
                  name: "Zlaganje",
                  grades: [[], [], [], [5], [], [], [], [], [5], [5]],
                },
                {
                  name: "Kultura međusobne komunikacije",
                  grades: [[], [], [5], [], [], [], [], [], [5], []],
                },
                {
                  name: "Stvaralačko izražavanje",
                  grades: [[], [4], [], [], [], [4], [], [], [], []],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note: "Bilježnica+",
                date: "4.6.2019.",
                grade: "5",
              },
              lastUpdated: 1630679106.563,
            },
          ],
        },
        {
          url: "https://ocjene.skole.hr/class_action/940995980/course",
          name: "8.b",
          year: "2016./2017.",
          isYearCompleted: true,
          school: 'Osnovna škola "Antun Mihanović" Slavonski Brod',
          finalGrade: "4.50",
          headTeacher: "Jelena Kovre",
          lastUpdated: 1630679056.659,
          cachedSubjects: [
            {
              url: "https://ocjene.skole.hr/grade/10116440950",
              name: "Hrvatski jezik",
              teachers: "Marija Čalušić",
              gradesByCategory: [
                {
                  name: "Hrvatski jezik",
                  grades: [[], [5], [], [1], [], [3], [], [3], [5], []],
                },
                {
                  name: "Književnost",
                  grades: [[], [], [4], [4], [], [], [], [4], [], [4]],
                },
                {
                  name: "Lektira",
                  grades: [[], [4], [2], [], [4], [3], [1], [3], [], []],
                },
                {
                  name: "Jezično izražavanje i stvaranje - usmeno",
                  grades: [[], [], [4], [4], [], [5], [3], [], [], []],
                },
                {
                  name: "Jezično izražavanje i stvaranje - pisano",
                  grades: [[], [3], [4, 4], [], [3], [], [5, 5], [], [], []],
                },
                {
                  name: "Medijska kultura",
                  grades: [[], [], [3], [3], [], [], [4], [3], [], []],
                },
              ],
              finalGrade: 4,
              lastNote: {
                note: "Književnoteorijski pojmovi",
                date: "1.6.2017.",
                grade: "4",
              },
              lastUpdated: 1630679056.659,
            },
            {
              url: "https://ocjene.skole.hr/grade/10116439940",
              name: "Likovna kultura",
              teachers: "Jelena Kovre",
              gradesByCategory: [
                {
                  name: "Izražavanje crtežom",
                  grades: [[], [5], [], [], [], [], [], [], [], []],
                },
                {
                  name: "Kolorističko i tonsko izražavanje",
                  grades: [[], [5], [5], [5], [], [5], [5], [], [], []],
                },
                {
                  name: "Trodimenzionalno oblikovanje",
                  grades: [[], [], [], [], [], [], [], [], [5], []],
                },
                {
                  name: "Grafičko izražavanje",
                  grades: [[], [], [], [5], [], [], [], [], [5], []],
                },
                {
                  name:
                    "Razumijevanje i vrednovanje osnovnih odnosa u umjetničkom djelu",
                  grades: [[], [5], [5], [], [], [5, 5], [5], [], [], []],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note: "Kompozicija linearnih tekstura",
                date: "8.5.2017.",
                grade: "5",
              },
              lastUpdated: 1630679056.659,
            },
            {
              url: "https://ocjene.skole.hr/grade/10116434890",
              name: "Fizika",
              teachers: "Željka Kačar",
              gradesByCategory: [
                {
                  name: "Usvojenost programskih sadržaja",
                  grades: [[], [5], [], [5], [5], [], [5, 4], [5], [5], [5]],
                },
                {
                  name: "Praktični radovi",
                  grades: [[], [], [], [], [], [], [], [], [], []],
                },
                {
                  name: "Primjena znanja i vještine",
                  grades: [[], [5], [], [5], [], [], [2], [5], [], []],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note: "Svjetlost - pokazuje razumijevanje usvojenoga gradiva.",
                date: "2.6.2017.",
                grade: "5",
              },
              lastUpdated: 1630679056.659,
            },
            {
              url: "https://ocjene.skole.hr/grade/10116433880",
              name: "Povijest",
              teachers: "Marija Penić",
              gradesByCategory: [
                {
                  name: "Usvojenost osnovnih podataka",
                  grades: [[], [3], [2], [], [3], [4], [3], [], [4], []],
                },
                {
                  name: "Uočavanje uzročno-posljedičnih veza",
                  grades: [[], [], [], [], [5], [4], [], [], [], []],
                },
                {
                  name: "Snalaženje u vremenu i prostoru",
                  grades: [[], [], [], [], [5], [], [5], [], [1], []],
                },
              ],
              finalGrade: 4,
              lastNote: {
                note: "Dekolonizacija i hladni rat",
                date: "9.5.2017.",
                grade: "1",
              },
              lastUpdated: 1630679056.659,
            },
            {
              url: "https://ocjene.skole.hr/grade/10116432870",
              name: "Geografija",
              teachers: "Marija Penić",
              gradesByCategory: [
                {
                  name: "Usvojenost znanja",
                  grades: [[], [4], [4], [3], [], [], [4], [4], [4], []],
                },
                {
                  name: "Uočavanje pojava i procesa",
                  grades: [[], [], [5], [], [], [], [4], [], [4], []],
                },
                {
                  name: "Uporaba zemljovida",
                  grades: [[], [5], [], [2], [], [], [3], [4], [], []],
                },
              ],
              finalGrade: 4,
              lastNote: {
                note: "Naučio s razumijevanjem",
                date: "9.5.2017.",
                grade: "4",
              },
              lastUpdated: 1630679056.659,
            },
            {
              url: "https://ocjene.skole.hr/grade/10116431860",
              name: "Tehnička kultura",
              teachers: "Dinko Nadih",
              gradesByCategory: [
                {
                  name: "Usvojenost sadržaja",
                  grades: [[], [], [5], [], [], [], [], [4], [5], []],
                },
                {
                  name: "Radne navike i vještine",
                  grades: [[4], [], [5], [5], [], [4], [4], [5], [5], []],
                },
                {
                  name: "Aktivnost i odnos prema radu",
                  grades: [[], [], [], [5], [], [], [], [5], [], []],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note: "Princip rada elektromotora",
                date: "29.5.2017.",
                grade: "5",
              },
              lastUpdated: 1630679056.659,
            },
            {
              url: "https://ocjene.skole.hr/grade/10116430850",
              name: "Tjelesna i zdravstvena kultura",
              teachers: "Marin Ratković",
              gradesByCategory: [
                {
                  name: "Motorička znanja",
                  grades: [[], [5], [4], [5], [], [5], [5], [2], [5], [5]],
                },
                {
                  name: "Motorička dostignuća",
                  grades: [[], [], [5], [5], [], [], [], [], [5], []],
                },
                {
                  name: "Motoričke sposobnosti",
                  grades: [[], [], [], [], [], [], [], [], [], []],
                },
                {
                  name: "Funkcionalne sposobnosti",
                  grades: [[], [], [], [], [], [], [], [], [], []],
                },
                {
                  name: "Odgojni učinci rada",
                  grades: [[], [], [], [], [], [], [], [], [], []],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note: "",
                date: "1.6.2017.",
                grade: "5",
              },
              lastUpdated: 1630679056.659,
            },
            {
              url: "https://ocjene.skole.hr/grade/11473189100",
              name: "Vjeronauk (izborni)",
              teachers: "Ljiljana Jelavić",
              gradesByCategory: [
                {
                  name: "0.1. usvojenost nastavnih sadržaja / znanje",
                  grades: [[], [], [4], [], [], [], [4], [], [3], []],
                },
                {
                  name: "0.1. stvaralačko izražavanje",
                  grades: [[], [5], [], [5], [], [], [4], [], [], []],
                },
                {
                  name: "0.1 aktivnosti i zalaganje",
                  grades: [[], [2], [], [4], [], [4], [], [4], [], []],
                },
                {
                  name: "0.1 kultura međuosobne komunikacije",
                  grades: [[], [], [4], [], [], [4], [], [], [], [4]],
                },
              ],
              finalGrade: 4,
              lastNote: {
                note: "Pristojan u ponašanju i odnosu prema drugima.",
                date: "7.6.2017.",
                grade: "4",
              },
              lastUpdated: 1630679056.659,
            },
            {
              url: "https://ocjene.skole.hr/grade/11481364040",
              name: "Informatika (izborni)",
              teachers: "Jadranka Horvat",
              gradesByCategory: [
                {
                  name: "Usvojenost sadržaja",
                  grades: [[], [], [5], [5], [], [], [4], [], [5], []],
                },
                {
                  name: "Primjena znanja",
                  grades: [[], [5], [], [], [], [5], [], [5], [], []],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note: "Matrica, hiperveze - zadatak",
                date: "30.5.2017.",
                grade: "5",
              },
              lastUpdated: 1630679056.659,
            },
            {
              url: "https://ocjene.skole.hr/grade/11488477470",
              name: "Sat razrednika",
              teachers: "Jelena Kovre",
              gradesByCategory: [],
              lastUpdated: 1630679056.659,
            },
            {
              url: "https://ocjene.skole.hr/grade/10116435900",
              name: "Kemija",
              teachers: "Velimir Kljajić",
              gradesByCategory: [
                {
                  name:
                    "Usvojenost, razumijevanje i primjena programskih sadržaja - usmeno",
                  grades: [[], [3], [], [2], [], [], [2], [], [3], []],
                },
                {
                  name:
                    "Usvojenost, razumijevanje i primjena programskih sadržaja - pisano",
                  grades: [[], [], [2], [4], [], [], [4], [1], [], []],
                },
                {
                  name: "Praktični radovi",
                  grades: [[], [4], [3], [4], [], [3], [], [], [4], []],
                },
                {
                  name: "Rješavanje problema",
                  grades: [[], [], [2], [2], [], [], [2], [1], [], []],
                },
              ],
              finalGrade: 3,
              lastNote: {
                note: "Biološki važni spojevi",
                date: "31.5.2017.",
                grade: "3",
              },
              lastUpdated: 1630679056.659,
            },
            {
              url: "https://ocjene.skole.hr/grade/11481361010",
              name: "Engleski jezik I",
              teachers: "Jelena Martinović",
              gradesByCategory: [
                {
                  name: "Razumijevanje",
                  grades: [[], [5], [4], [4], [], [3], [4], [], [5], [5]],
                },
                {
                  name: "Govorne sposobnosti",
                  grades: [[], [5], [4], [], [], [5], [], [5], [], [5]],
                },
                {
                  name: "Sposobnost pisanog izražavanja",
                  grades: [[], [], [], [4], [], [], [5, 5], [], [], []],
                },
                {
                  name: "Jezične zakonitosti",
                  grades: [[], [5], [], [3], [], [3], [3], [], [5], [5]],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note: "Test - tenses, reported speech, passive voice",
                date: "12.6.2017.",
                grade: "5",
              },
              lastUpdated: 1630679056.659,
            },
            {
              url: "https://ocjene.skole.hr/grade/10116438930",
              name: "Glazbena kultura",
              teachers: "Nikola Novosel",
              gradesByCategory: [
                {
                  name: "Pjevanje i sviranje",
                  grades: [[], [], [], [], [], [5], [5], [], [5], []],
                },
                {
                  name: "Intonacija, ritam i glazbeno pismo",
                  grades: [[], [], [], [], [], [], [], [], [], []],
                },
                {
                  name: "Osnove glazbene umjetnosti",
                  grades: [[], [], [], [3], [], [], [5], [], [1], [2]],
                },
              ],
              finalGrade: 4,
              lastNote: {
                note:
                  "Glazbeni stilovi.\nNije učio.Ne poznaje gradivo.Tek tu i tamo neki pojam i to otprilike.",
                date: "12.6.2017.",
                grade: "2",
              },
              lastUpdated: 1630679056.659,
            },
            {
              url: "https://ocjene.skole.hr/grade/10116437920",
              name: "Matematika",
              teachers: "Ivana Šporčić",
              gradesByCategory: [
                {
                  name:
                    "Usvojenost, razumijevanje i primjena programskih sadržaja - usmeno",
                  grades: [[], [], [4], [], [], [5], [], [], [], [5]],
                },
                {
                  name:
                    "Usvojenost, razumijevanje i primjena programskih sadržaja - pisano",
                  grades: [[], [], [4], [5], [], [5, 4], [5], [], [4], [5]],
                },
                {
                  name:
                    "Usvojenost, razumijevanje i primjena programskih sadržaja - domaći uradak",
                  grades: [[], [], [], [], [5], [], [5], [], [5], []],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note: "Analiza 6. ispita znanja - Preslikavanja ravnine",
                date: "12.6.2017.",
                grade: "5",
              },
              lastUpdated: 1630679056.659,
            },
            {
              url: "https://ocjene.skole.hr/grade/10116436910",
              name: "Biologija",
              teachers: "Velimir Kljajić",
              gradesByCategory: [
                {
                  name:
                    "Usvojenost, razumijevanje i primjena programskih sadržaja - usmeno",
                  grades: [[5], [], [], [5], [], [5], [5], [], [5], []],
                },
                {
                  name:
                    "Usvojenost, razumijevanje i primjena programskih sadržaja - pisano",
                  grades: [[], [], [4], [4], [], [3], [], [], [], [4]],
                },
                {
                  name: "Praktični radovi",
                  grades: [[], [3], [], [5], [], [5], [], [], [5], [5]],
                },
              ],
              finalGrade: 5,
              lastNote: {
                note: "Radna bilježnica",
                date: "8.6.2017.",
                grade: "5",
              },
              lastUpdated: 1630679056.659,
            },
          ],
        },
      ],
      signedIn: true,
      settings: {
        classTabsOrder: [
          "Ocjene",
          "Biljeske",
          "Ispiti",
          "Izostanci",
          "Vladanja",
          "Raspored",
          "Statistika",
        ],
        subjectsSettings: {
          margin: 0,
          zoom: 2,
          expandTablesOnHover: true,
          subjectColors: true,
          countAvgs: false,
          sortByDragging: true,
          subjectsOrder: {},
          expandedSubjects: [],
        },
        calendarSettings: {
          showEntireCalendar: false,
          zoom: 3,
          customNotes: [],
        },
        calculatorSettings: {
          selectedSchool: "",
          selectedProgram: "",
          selectedExtraPoints: "",
          userValues: [[], [], [], [], [], [], []],
        }
      },
      lastLoadedClassUrl:
        "https://ocjene.skole.hr/class_action/2115037150/course",
    },
  ],
};
