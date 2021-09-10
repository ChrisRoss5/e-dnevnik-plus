<template>
  <div id="calendar-container">
    <div
      class="toolbar card"
      :style="{ 'margin-right': $reactive.userOffsetWidth }"
    >
      Školski kalendar {{ schoolYearTitle }}
      <div id="options" class="toolbar-options">
        <transition-group name="opacity">
          <template v-if="calendarSettings.showEntireCalendar">
            <div
              :key="1"
              class="material-icons"
              @click="zoomOptionClicked(-1)"
              v-tooltip="'Povećaj prikaz'"
              v-wave
            >
              zoom_in
            </div>
            <div
              :key="2"
              class="material-icons"
              @click="zoomOptionClicked(1)"
              v-tooltip="'Smanji prikaz'"
              v-wave
            >
              zoom_out
            </div>
          </template>
        </transition-group>
        <div
          class="material-icons"
          :class="{ 'option-enabled': calendarSettings.showEntireCalendar }"
          @click="toggleCalendarView"
          v-tooltip="'Prikaži cijeli kalendar'"
          v-wave
        >
          calendar_view_month
        </div>
      </div>
    </div>
    <v-calendar
      v-if="calendarReady"
      id="calendar"
      :rows="calendarSettings.showEntireCalendar ? calendarRows : 1"
      :columns="calendarSettings.showEntireCalendar ? calendarColumns : 1"
      :from-date="calendarSettings.showEntireCalendar ? fromDate : today"
      :nav-visibility="calendarSettings.showEntireCalendar ? 'hidden' : 'hover'"
      :transition="'slide-h'"
      :locale="{
        id: 'hr',
        firstDayOfWeek: 2,
        masks: {
          title: 'MMMM YYYY.',
          weekdays: 'WWW',
          dayPopover: 'WWWW, D.M.YYYY.',
        },
      }"
      :is-dark="$store.state.settings.darkTheme"
      :attributes="attributes"
      is-expanded
      show-iso-weeknumbers
      @update:from-page="calendarPageChanged"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getExams } from "@/scripts/scrapers";
import { jsonClone } from "@/scripts/utils";
import { CalendarSettings, ClassInfo, User } from "@/store/state";
import { MutationTypes } from "@/store/mutations";

interface CalendarYearData {
  startingDate: string;
  endingDate: string;
  edgeDays: Record<string, string>;
  holidays: Record<string, string>;
  vacationRanges: CalendarRangeData[];
}

interface CalendarRangeData {
  start: string;
  end: string;
  label: string;
}

export default defineComponent({
  name: "Calendar",
  created() {
    const [year, month] = [this.today.getFullYear(), this.today.getMonth() + 1];
    this.calendarPageChanged({ year, month });
    this.loadCalendar();
  },
  data() {
    return {
      today: new Date(),
      schoolYearTitle: "",
      calendarReady: false,
      calendarRows: 0,
      calendarColumns: 0,
      fromDate: null as unknown as Date,
      attributes: [] as any, // TS support not available yet :/
    };
  },
  methods: {
    async loadCalendar() {
      const schoolYears: CalendarYearData[] = [
        {
          startingDate: "6.9.2021",
          endingDate: "21.6.2022",
          edgeDays: {
            "6.9.2021": "Počinje prvo polugodište",
            "23.12.2021": "Završava prvo polugodište",
            "10.1.2022": "Počinje drugo polugodište",
            "21.6.2022": "Završava drugo polugodište",
          },
          holidays: {
            "1.11.2021": "Blagdan Svih Svetih",
            "18.11.2021": "Dan sjećanja na žrtve Domovinskog rata",
            "25.12.2021": "Božić",
            "26.12.2021": "Sveti Stjepan",
            "17.4.2022": "Uskrs",
            "18.4.2022": "Uskrsni ponedjeljak",
            "1.5.2022": "Međunarodni praznik rada",
            "30.5.2022": "Dan državnosti",
            "16.6.2022": "Tijelovo",
            "22.6.2022": "Dan antifašističke borbe",
          },
          vacationRanges: [
            {
              start: "1.9.2021",
              end: "5.9.2021",
              label: "Ljetni praznici",
            },
            {
              start: "2.11.2021",
              end: "3.11.2021",
              label: "Jesenski praznici",
            },
            {
              start: "24.12.2021",
              end: "9.1.2022",
              label: "Prvi dio zimskih praznika",
            },
            {
              start: "21.2.2022",
              end: "27.2.2022",
              label: "Drugi dio zimskih praznika",
            },
            {
              start: "14.4.2022",
              end: "24.4.2022",
              label: "Proljetni praznici",
            },
            {
              start: "23.6.2022",
              end: "31.8.2022",
              label: "Ljetni praznici",
            },
          ],
        },
      ];
      this.fromDate = this.convertToDate(schoolYears[0].startingDate);
      this.calendarColumns = this.calendarSettings.zoom;
      this.calendarRows = Math.round(12 / this.calendarColumns);

      const exams = [];
      const thisYearClasses = this.classesList.filter(
        (classInfo) => classInfo.year == "2020./2021." /* this.schoolYearTitle */,  // TODO: UNCOMMENT
      );
      for (const { url } of thisYearClasses) {
        exams.push(...((await getExams(url.match(/\d+/)![0])) || []));
      }

      this.attributes = [
        {
          highlight: {
            base: { color: "gray", fillMode: "light" },
            end: {
              color: "blue",
              fillMode: "solid",
              contentStyle: { boxShadow: "0 0 15px 5px #669df6" },
            },
          },
          dates: {
            start: this.fromDate,
            end: this.today,
          },
        },
        ...schoolYears.flatMap(({ edgeDays }) =>
          Object.keys(edgeDays).map((date) => ({
            highlight: "red",
            popover: { label: edgeDays[date] },
            dates: this.convertToDate(date),
            order: 2,
          })),
        ),
        ...schoolYears.flatMap(({ holidays }) =>
          Object.keys(holidays).map((date) => ({
            highlight: "green",
            popover: { label: holidays[date] },
            dates: this.convertToDate(date),
            order: 1,
          })),
        ),
        ...schoolYears.flatMap(({ vacationRanges }) =>
          vacationRanges.map((dateRange) => ({
            highlight: {
              start: { fillMode: "outline" },
              base: { fillMode: "light" },
              end: { fillMode: "outline" },
            },
            popover: { label: dateRange.label },
            dates: {
              start: this.convertToDate(dateRange.start),
              end: this.convertToDate(dateRange.end),
            },
          })),
        ),
        ...exams.map(({ subject, note, date }) => ({
          dot: "red",
          popover: { label: subject + ": " + note },
          dates: this.convertToDate(date),
        })),
      ];
      this.calendarReady = true;
    },
    convertToDate(str: string) {
      const [d, m, y] = str.split(".").map(Number);
      return new Date(y, m - 1, d);
    },
    toggleCalendarView() {
      const settings = jsonClone(this.calendarSettings);
      settings.showEntireCalendar = !settings.showEntireCalendar;
      this.updateSettings(settings);
    },
    zoomOptionClicked(zoom: 1 | -1) {
      const columns = Math.min(this.calendarColumns + zoom, 5);
      this.calendarColumns = Math.max(1, columns);
      this.calendarRows = Math.round(12 / this.calendarColumns);
      const settings = jsonClone(this.calendarSettings);
      settings.zoom = this.calendarColumns;
      this.updateSettings(settings);
    },
    updateSettings(newSettings: CalendarSettings) {
      if (!this.user) return;
      this.$store.commit(MutationTypes.UPDATE_USER_SETTINGS, {
        user: this.user,
        settings: { calendarSettings: newSettings },
      });
    },
    calendarPageChanged(e: any) {
      const { year, month } = e;
      if (!year || !month) return;
      const firstSemester = month > 8 ? 0 : 1;
      const startYear = year - firstSemester;
      const endYear = year + 1 - firstSemester;
      this.schoolYearTitle = startYear + "./" + endYear + ".";
    },
  },
  computed: {
    user(): User | undefined {
      return this.$store.getters.user;
    },
    classesList(): ClassInfo[] {
      return this.user ? this.user.classesList : [];
    },
    calendarSettings(): CalendarSettings {
      return this.user
        ? this.user.settings.calendarSettings
        : {
            showEntireCalendar: true,
            zoom: 3,
          };
    },
  },
});
</script>

<style lang="scss">
.vc-pane {
  @extend .card;
  margin: 5px 10px;
}
</style>

<style lang="scss" scoped>
#calendar-container {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding: 10px;
  overflow-x: auto;
}

.toolbar {
  align-items: center;
  margin: 10px 0 10px 10px;
  background-position-x: 100px !important;
}

#calendar {
  border: none;
  background: transparent;
  margin: auto 0;
}

.dropdown-row {
}

.dropdown-column {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin: 3px;

  @include themed() {
    border: 1px solid t("light-blue");
  }
}

/* Calendar */
</style>
