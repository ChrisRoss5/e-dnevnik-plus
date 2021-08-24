<template>
  <div id="container" class="card">
    <iframe src="about:blank" ref="iframe" :class="{ loading }"></iframe>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { addStyleTag } from "@/scripts/utils";
import { getSectionHTML } from "@/scripts/scrapers";

export default defineComponent({
  name: "ClassSectionFrame",
  mounted() {
    this.$nextTick(this.updateContent);
  },
  data() {
    return {
      loading: true,
      urls: {
        biljeske: "https://ocjene.skole.hr/notes",
        izostanci: "https://ocjene.skole.hr/absent",
        vladanja: "https://ocjene.skole.hr/behavior",
      },
    };
  },
  methods: {
    async updateContent() {
      const iframe = this.$refs.iframe as HTMLIFrameElement;
      const doc = iframe.contentWindow!.document;
      const classId = this.$route.params.classId as string;
      const pathName = this.$route.path.match(/[^/]+$/)![0];
      const url: string = (this.urls as any)[pathName];
      this.loading = false;
      this.$emit("sectionLoading");
      await addStyleTag(doc, this.$store.state.settings.darkTheme);

      doc.body.innerHTML = `<div class="content">
					<div class="legend-text">Klik na ocjenu/zvjezdicu za vise informacija</div>

			<div class="table-container  grades-table " aria-label="GradesTable">
				<div class="flex-table header first">
					<div class="flex-row first">Ocjene proizlaze iz:</div>

						<div class="flex-row head">Ocjene po mjesecima</div>
									</div>
				<div class="flex-table header">
					<div class="flex-row first"></div>
					 											<div class="flex-row">IX</div>
											<div class="flex-row">X</div>
											<div class="flex-row">XI</div>
											<div class="flex-row">XII</div>
											<div class="flex-row">I</div>
											<div class="flex-row">II</div>
											<div class="flex-row">III</div>
											<div class="flex-row">IV</div>
											<div class="flex-row">V</div>
											<div class="flex-row">VI</div>
														</div>

					<div class="flex-table row">
						<div class="flex-row first">književnost</div>

							<div class="flex-row grade">
															</div>

							<div class="flex-row grade">
																<span class="popup mobile-only" data-title="književnost">
																			<span class=" positive " data-action-id="387403543740">4</span>								</span>
															</div>

							<div class="flex-row grade">
																<span class="popup mobile-only" data-title="književnost">
																			<span class=" negative " data-action-id="396049028600">1</span>,										<span class=" positive " data-action-id="393928040720">2</span>								</span>
															</div>

							<div class="flex-row grade">
																<span class="popup mobile-only" data-title="književnost">
																			<span class=" positive " data-action-id="407594184070">3</span>								</span>
															</div>

							<div class="flex-row grade">
															</div>

							<div class="flex-row grade">
																<span class="popup mobile-only" data-title="književnost">
																			<span class=" positive " data-action-id="422932616740">2</span>,										<span class=" negative " data-action-id="415447642080">1</span>								</span>
															</div>

							<div class="flex-row grade">
															</div>

							<div class="flex-row grade">
															</div>

							<div class="flex-row grade">
																<span class="popup mobile-only" data-title="književnost">
																			<span class=" positive " data-action-id="444181599710">3</span>								</span>
															</div>

							<div class="flex-row grade">
															</div>

					</div>

					<div class="flex-table row">
						<div class="flex-row first">jezik</div>

							<div class="flex-row grade">
																<span class="popup mobile-only" data-title="jezik">
																			<span class=" positive " data-action-id="380086745190">2</span>								</span>
															</div>

							<div class="flex-row grade">
															</div>

							<div class="flex-row grade">
																<span class="popup mobile-only" data-title="jezik">
																			<span class=" positive " data-action-id="398511335880">4</span>								</span>
															</div>

							<div class="flex-row grade">
																<span class="popup mobile-only" data-title="jezik">
																			<span class=" positive " data-action-id="408636362670">2</span>								</span>
															</div>

							<div class="flex-row grade">
															</div>

							<div class="flex-row grade">
															</div>

							<div class="flex-row grade">
																<span class="popup mobile-only" data-title="jezik">
																			<span class=" positive " data-action-id="427314627990">5</span>								</span>
															</div>

							<div class="flex-row grade">
																<span class="popup mobile-only" data-title="jezik">
																			<span class=" positive " data-action-id="435322973540">3</span>								</span>
															</div>

							<div class="flex-row grade">
															</div>

							<div class="flex-row grade">
															</div>

					</div>

					<div class="flex-table row">
						<div class="flex-row first">usmeno izražavanje</div>

							<div class="flex-row grade">
															</div>

							<div class="flex-row grade">
																<span class="popup mobile-only" data-title="usmeno izražavanje">
																			<span class=" positive " data-action-id="389026828870">4</span>								</span>
															</div>

							<div class="flex-row grade">
																<span class="popup mobile-only" data-title="usmeno izražavanje">
																			<span class=" negative " data-action-id="396051157680">1</span>								</span>
															</div>

							<div class="flex-row grade">
															</div>

							<div class="flex-row grade">
															</div>

							<div class="flex-row grade">
															</div>

							<div class="flex-row grade">
															</div>

							<div class="flex-row grade">
															</div>

							<div class="flex-row grade">
																<span class="popup mobile-only" data-title="usmeno izražavanje">
																			<span class=" positive " data-action-id="440165110490">4</span>								</span>
															</div>

							<div class="flex-row grade">
															</div>

					</div>

					<div class="flex-table row">
						<div class="flex-row first">pisano izražavanje</div>

							<div class="flex-row grade">
															</div>

							<div class="flex-row grade">
															</div>

							<div class="flex-row grade">
															</div>

							<div class="flex-row grade">
																<span class="popup mobile-only" data-title="pisano izražavanje">
																			<span class=" positive " data-action-id="398516088940">4</span>								</span>
															</div>

							<div class="flex-row grade">
															</div>

							<div class="flex-row grade">
																<span class="popup mobile-only" data-title="pisano izražavanje">
																			<span class=" positive " data-action-id="427326069270">4</span>								</span>
															</div>

							<div class="flex-row grade">
																<span class="popup mobile-only" data-title="pisano izražavanje">
																			<span class=" positive " data-action-id="427312696870">3</span>								</span>
															</div>

							<div class="flex-row grade">
																<span class="popup mobile-only" data-title="pisano izražavanje">
																			<span class=" positive " data-action-id="440083085360">3</span>								</span>
															</div>

							<div class="flex-row grade">
																<span class="popup mobile-only" data-title="pisano izražavanje">
																			<span class=" positive " data-action-id="444335595420">2</span>								</span>
															</div>

							<div class="flex-row grade">
															</div>

					</div>

				<div class="flex-table row final-grade ">
					<div class="flex-row bold first"> ZAKLJUČENO</div>
					<div class="flex-row"></div>
					<div class="flex-row"> Dobar (3) </div>
				</div>
			</div>


							<div class="section-title">BILJEŠKE</div>

		<div class="table-container  notes-table " aria-label="NotesTable">
							    <div class="flex-table header first">
                        <div class="flex-row">
                            <span>Bilješka</span>
                        </div>
                        <div class="flex-row">
                             <span>Datum</span>
                        </div>
                        <div class="flex-row">
                             <span>Ocjena</span>
                        </div>
                    </div>
									<div class="flex-table row  " data-action-id="444335915590">
						<div class="flex-row"> <span>Usmeni ispravak provjere pročitanosti lektirnoga djela (Krleža: Gospoda Glembajevi): ocjena dovoljan</span></div>

							<div class="flex-row"> <span>21.5.2021.</span></div>
												<div class="flex-row"></div>
					</div>
									<div class="flex-table row  " data-action-id="444335595420">
						<div class="flex-row"> <span>Ispravak provjere pročitanosti lektirnoga djela (I. Andrić: Prokleta avlija)</span></div>

							<div class="flex-row"> <span>21.5.2021.</span></div>
												<div class="flex-row"> <span>2</span></div>
					</div>
									<div class="flex-table row  " data-action-id="444181599710">
						<div class="flex-row"> <span>Druga pisana provjera znanja iz književnosti</span></div>

							<div class="flex-row"> <span>13.5.2021.</span></div>
												<div class="flex-row"> <span>3</span></div>
					</div>
									<div class="flex-table row  " data-action-id="440165110490">
						<div class="flex-row"> <span>Provjera pročitanosti lektirnoga djela (Ivo Brešan: Predstava Hamleta u selu Mrduša Donja)</span></div>

							<div class="flex-row"> <span>11.5.2021.</span></div>
												<div class="flex-row"> <span>4</span></div>
					</div>
									<div class="flex-table row  " data-action-id="435322973540">
						<div class="flex-row"> <span>Druga pisana provjera znanja iz jezika (leksikologija, leksikografija): 28/45</span></div>

							<div class="flex-row"> <span>23.4.2021.</span></div>
												<div class="flex-row"> <span>3</span></div>
					</div>
									<div class="flex-table row  " data-action-id="440083085360">
						<div class="flex-row"> <span>Provjera pročitanosti lektirnoga djela (R. Marinković: Kiklop)</span></div>

							<div class="flex-row"> <span>20.4.2021.</span></div>
												<div class="flex-row"> <span>3</span></div>
					</div>
									<div class="flex-table row  " data-action-id="427314627990">
						<div class="flex-row"> <span>Druga školska zadaća</span></div>

							<div class="flex-row"> <span>19.3.2021.</span></div>
												<div class="flex-row"> <span>5</span></div>
					</div>
									<div class="flex-table row  " data-action-id="427312696870">
						<div class="flex-row"> <span>Druga školska zadaća</span></div>

							<div class="flex-row"> <span>19.3.2021.</span></div>
												<div class="flex-row"> <span>3</span></div>
					</div>
									<div class="flex-table row  " data-action-id="422932616740">
						<div class="flex-row"> <span>Ispravak prve pisane provjere znanja iz književnosti: 20.5/36</span></div>

							<div class="flex-row"> <span>24.2.2021.</span></div>
												<div class="flex-row"> <span>2</span></div>
					</div>
									<div class="flex-table row  " data-action-id="427326069270">
						<div class="flex-row"> <span>Provjera pročitanosti lekirnoga djela (A. Camus: Stranac- strip: grafička organizacija, ostvarenost teme, stvaralačke tehnike, pismenost, egzistencijalistička značajka): 9/10
Učenik je poštivao većinu zadanih smjernica u izradi stripa.
Ocjena je naknadno unesena.</span></div>

							<div class="flex-row"> <span>17.2.2021.</span></div>
												<div class="flex-row"> <span>4</span></div>
					</div>
									<div class="flex-table row  negative  " data-action-id="415447642080">
						<div class="flex-row"> <span>Provjera pročitanosti lektirnoga djela (Ivo Andrić: Prokleta avlija):  13.5/31
Ocjena je naknadno upisana.</span></div>

							<div class="flex-row"> <span>16.2.2021.</span></div>
												<div class="flex-row"> <span>1</span></div>
					</div>
									<div class="flex-table row  " data-action-id="408636362670">
						<div class="flex-row"> <span>Prva pisana provjera znanja iz jezika (leksikologija): 10.5/22</span></div>

							<div class="flex-row"> <span>23.12.2020.</span></div>
												<div class="flex-row"> <span>2</span></div>
					</div>
									<div class="flex-table row  " data-action-id="407594184070">
						<div class="flex-row"> <span>Provjera pročitanosti lektirnoga djela (Povratak Filipa Latinovicza): 11.5/18</span></div>

							<div class="flex-row"> <span>16.12.2020.</span></div>
												<div class="flex-row"> <span>3</span></div>
					</div>
									<div class="flex-table row  " data-action-id="407411330640">
						<div class="flex-row"> <span>Usporedni esej (Gospoda Glembayevi/Povratak Filipa Latinovicza):
s obzirom na opisivače (A-smještanje teksta u poetiku djela, razumijevanje i poznavanje polaznoga teksta te povezivanje s cjelinom djela, potkrijepljenost tvrdnji, univerzalnost tematike, B-povezanost teksta, C-pravila standardnoga jezika), učenik ima sljedeće bodove: A (14/16), B(6/6), C (13/14).
A-učenik je predstavio poetiku djela, objasnio je pripadnost suvremenoj književnosti, tvrdnje je potkrijepio citatom, proustovska metoda nedovoljno je razrađena
B-učenik u jako maloj mjeri koristi nepovezane rečenice
C-učenik većinom poštuje pravila standardnoga jezika, potrebno je crtice zamijeniti veznicima i izbjegavati tumačenja u zagradi</span></div>

							<div class="flex-row"> <span>16.12.2020.</span></div>
												<div class="flex-row"></div>
					</div>
									<div class="flex-table row  " data-action-id="398519167420">
						<div class="flex-row"> <span>Ispravak prve pisane provjere znanja iz književnosti: učenik je predao prazan papir.</span></div>

							<div class="flex-row"> <span>2.12.2020.</span></div>
												<div class="flex-row"></div>
					</div>
									<div class="flex-table row  " data-action-id="398516088940">
						<div class="flex-row"> <span>Prva školska zadaća</span></div>

							<div class="flex-row"> <span>2.12.2020.</span></div>
												<div class="flex-row"> <span>4</span></div>
					</div>
									<div class="flex-table row  " data-action-id="398511335880">
						<div class="flex-row"> <span>Prva školska zadaća</span></div>

							<div class="flex-row"> <span>25.11.2020.</span></div>
												<div class="flex-row"> <span>4</span></div>
					</div>
									<div class="flex-table row  negative  " data-action-id="396051157680">
						<div class="flex-row"> <span>Provjera pročitanosti lektirnoga djela (M. Krleža: Gospoda Glembajevi)</span></div>

							<div class="flex-row"> <span>24.11.2020.</span></div>
												<div class="flex-row"> <span>1</span></div>
					</div>
									<div class="flex-table row  negative  " data-action-id="396049028600">
						<div class="flex-row"> <span>Prva pisana provjera znanja iz književnosti: 4.5/36</span></div>

							<div class="flex-row"> <span>17.11.2020.</span></div>
												<div class="flex-row"> <span>1</span></div>
					</div>
									<div class="flex-table row  " data-action-id="393928040720">
						<div class="flex-row"> <span>Interpretacija pjesme A. B. Šimića: 14/21</span></div>

							<div class="flex-row"> <span>4.11.2020.</span></div>
												<div class="flex-row"> <span>2</span></div>
					</div>
									<div class="flex-table row  " data-action-id="389026828870">
						<div class="flex-row"> <span>Rasprava: Gregor Samsa žrtva je društva i svoje obitelji. Opisnici (vještine govorenja-rečenična melodija, tonalitet, jasnoća izgovorenih riječi, stanke, oklijevanje, usmjerenost publici; strategije za organizaciju govora-ostvarenost teme, argumentacija tvrdnje, odgovarajući rječnik, samoizražavanje, gramatička i pravopisna obilježja, obavezni red riječi).
Ocjena je naknadno upisana zbog prof. odsustva.</span></div>

							<div class="flex-row"> <span>28.10.2020.</span></div>
												<div class="flex-row"> <span>4</span></div>
					</div>
									<div class="flex-table row  " data-action-id="387403543740">
						<div class="flex-row"> <span>Provjera pročitanosti lektirnoga djela:
Kafka: Preobrazba</span></div>

							<div class="flex-row"> <span>28.10.2020.</span></div>
												<div class="flex-row"> <span>4</span></div>
					</div>
									<div class="flex-table row  " data-action-id="380086745190">
						<div class="flex-row"> <span>Pravopisna provjera:14/28 </span></div>

							<div class="flex-row"> <span>23.9.2020.</span></div>
												<div class="flex-row"> <span>2</span></div>
					</div>
									<div class="flex-table row  " data-action-id="379877279270">
						<div class="flex-row"> <span>Inicijalni ispit znanja (13/39)
Učenik većinom ne primjenjuje pravopisna pravila.
Nije usvojena gramatička norma na razini učeničke dobi (gramatička obilježja vrsta riječi, rečenični članovi, vrste složenih rečenica).</span></div>

							<div class="flex-row"> <span>16.9.2020.</span></div>
												<div class="flex-row"></div>
					</div>
									<div class="flex-table row  " data-action-id="378423234790">
						<div class="flex-row"> <span>Učenici su upoznati s planom i programom rada, načinom vrednovanja i ocjenjivanja. Dobili popis lektirnih djela za cijelu godinu.</span></div>

							<div class="flex-row"> <span>8.9.2020.</span></div>
												<div class="flex-row"></div>
					</div>

		</div>

		</div>`;

      const sectionEl = await getSectionHTML(classId, url);
      doc.body.innerHTML = "";
      doc.body.append(sectionEl || "Greška pri učitavanju.");
      if (!sectionEl) doc.body.className = "loading-error-plus";
      const contentEl = doc.body.firstElementChild;
      if (contentEl) iframe.style.height = contentEl.scrollHeight + "px";
      this.$emit("sectionLoaded");
      this.loading = false;
    },
  },
});
</script>

<style lang="scss" scoped>
#container {
  margin: 0 auto;
  width: 954px;
  min-width: 50%;
  padding: 10px;
}

iframe {
  transition: opacity 150ms;

  &.loading {
    opacity: 0;
  }
}
</style>
