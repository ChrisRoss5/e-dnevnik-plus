<template>
  <div id="calendar-container">
    <div
      class="toolbar card"
      :style="{ 'margin-right': $reactive.userOffsetWidth }"
    >
      Školski kalendar {{ schoolYearTitle }}
      <div id="options" class="toolbar-options">
        <transition-group name="opacity">
          <template v-if="settings.showEntireCalendar">
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
          :class="{ 'option-enabled': settings.showEntireCalendar }"
          @click="toggleCalendarView"
          v-tooltip="'Prikaži cijeli kalendar'"
          v-wave
        >
          calendar_view_month
        </div>
      </div>
    </div>
    <transition name="opacity">
      <v-calendar
        v-if="calendarReady"
        id="calendar"
        :class="{ 'custom-calendar': !settings.showEntireCalendar }"
        :rows="settings.showEntireCalendar ? calendarRows : 1"
        :columns="settings.showEntireCalendar ? calendarColumns : 1"
        :from-date="settings.showEntireCalendar ? fromDate : today"
        :nav-visibility="settings.showEntireCalendar ? 'hidden' : 'hover'"
        :transition="'slide-h'"
        :locale="{
          id: 'hr',
          firstDayOfWeek: 2,
          masks: {
            title: 'MMMM YYYY.',
            weekdays: settings.showEntireCalendar ? 'WWW' : 'WWWW',
            dayPopover: 'WWWW, D.M.YYYY.',
          },
        }"
        :is-dark="isDarkTheme"
        :attributes="attributes"
        is-expanded
        show-iso-weeknumbers
        @update:from-page="updateSchoolYearTitle"
        @dayclick="dayClicked"
      >
        <template
          v-if="!settings.showEntireCalendar"
          v-slot:day-content="{ day, attributes }"
        >
          <div class="day-container" @click="dayClicked(day)">
            <div>{{ day.day }}</div>
            <template v-if="attributes">
              <div
                v-for="(attr, i) in attributes.filter((attr) => attr.popover)"
                :key="i"
                class="day-card card"
                :style="{
                  'background-color': attr.highlight
                    ? attr.highlight.base.style.backgroundColor
                    : '',
                  'border-color': attr.dot
                    ? attr.dot.base.style.backgroundColor
                    : '',
                }"
              >
                {{ attr.popover.label }}
              </div>
            </template>
          </div>
        </template>
      </v-calendar>
    </transition>
    <transition name="opacity">
      <CalendarNotes
        v-if="selectedDay"
        :day="selectedDay"
        @close="selectedDay = null"
        @manageNote="manageNote"
      >
      </CalendarNotes>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getExams, getCalendarDates } from "@/scripts/scrapers";
import { jsonClone } from "@/scripts/utils";
import { CalendarSettings, ClassInfo, User } from "@/store/state";
import { MutationTypes } from "@/store/mutations";
import CalendarNotes from "../calendar/CalendarNotes.vue";

export default defineComponent({
  components: { CalendarNotes },
  name: "Calendar",
  created() {
    const [year, month] = [this.today.getFullYear(), this.today.getMonth() + 1];
    this.updateSchoolYearTitle({ year, month });
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
      loadedClassIdExams: [] as string[],
      selectedDay: null as any,
    };
  },
  methods: {
    async loadCalendar() {
      this.calendarColumns = this.settings.zoom;
      this.calendarRows = Math.round(12 / this.calendarColumns);
      this.attributes = [
        ...(await this.getCalendarDates()),
        ...this.settings.customNotes.map((n) =>
          this.createNote(n.note, this.convertToDate(n.date)),
        ),
      ];
      await this.addExamsToCalendar(this.schoolYearTitle);
      this.calendarReady = true;
    },
    async getCalendarDates() {
      const schoolYears = await getCalendarDates();
      if (!schoolYears) return [];
      this.fromDate = this.convertToDate(schoolYears[0].startingDate);
      return [
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
      ];
    },
    async addExamsToCalendar(schoolYear: string) {
      for (const { url, year } of this.classesList) {
        if (year != schoolYear) continue;
        const classId = url.match(/\d+/)![0];
        if (this.loadedClassIdExams.includes(classId)) continue;
        this.loadedClassIdExams.push(classId);
        this.attributes = this.attributes.concat(
          ((await getExams(classId)) || []).map(({ subject, note, date }) => ({
            dot: {
              color: "red",
              style: { boxShadow: "0 0 12px 4px var(--red-500)" },
            },
            popover: { label: subject + ": " + note },
            dates: this.convertToDate(date),
          })),
        );
      }
    },
    convertToDate(str: string) {
      const [d, m, y] = str.split(".").map(Number);
      return new Date(y, m - 1, d);
    },
    convertFromDate(date: Date) {
      const temp = [date.getDate(), date.getMonth() + 1, date.getFullYear()];
      return temp.join(".");
    },
    toggleCalendarView() {
      const settings = jsonClone(this.settings);
      settings.showEntireCalendar = !settings.showEntireCalendar;
      this.updateSettings(settings);
    },
    zoomOptionClicked(zoom: 1 | -1) {
      const columns = Math.min(this.calendarColumns + zoom, 5);
      this.calendarColumns = Math.max(1, columns);
      this.calendarRows = Math.round(12 / this.calendarColumns);
      const settings = jsonClone(this.settings);
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
    updateSchoolYearTitle(newPage: any) {
      const { year, month } = newPage;
      if (!year || !month) return;
      const firstSemester = month > 8 ? 0 : 1;
      const startYear = year - firstSemester;
      const endYear = year + 1 - firstSemester;
      this.schoolYearTitle = startYear + "./" + endYear + ".";
      this.addExamsToCalendar(this.schoolYearTitle);
    },
    dayClicked(day: any) {
      this.selectedDay = day;
    },
    manageNote({ note, method }: { note: string; method: "add" | "remove" }) {
      const settings = jsonClone(this.settings);
      const date = this.convertFromDate(this.selectedDay.date);
      if (method == "remove") {
        const i = settings.customNotes.findIndex(
          (n) => n.date == date && n.note == note,
        );
        const j = this.attributes.findIndex((attr: any) => {
          if (!attr.dot || attr.dot.color != "blue") return false;
          return (
            this.convertFromDate(attr.dates) == date &&
            attr.popover.label == note
          );
        });
        console.log(this.attributes, j);

        settings.customNotes.splice(i, 1);
        this.attributes.splice(j, 1);
      } else {
        settings.customNotes.push({ date, note });
        const newNote = this.createNote(note, this.selectedDay.date);
        this.attributes = this.attributes.concat([newNote]);
      }
      this.updateSettings(settings);
      this.selectedDay = null;
    },
    createNote(note: string, date: Date) {
      return {
        dot: {
          color: "blue",
          style: { boxShadow: "0 0 12px 4px var(--blue-500)" },
        },
        popover: { label: note },
        dates: date,
      };
    },
  },
  computed: {
    user(): User | undefined {
      return this.$store.getters.user;
    },
    classesList(): ClassInfo[] {
      return this.user ? this.user.classesList : [];
    },
    settings(): CalendarSettings {
      return this.user
        ? this.user.settings.calendarSettings
        : {
            showEntireCalendar: true,
            zoom: 3,
            customNotes: [],
          };
    },
    isDarkTheme(): boolean {
      return this.$store.state.settings.darkTheme;
    },
  },
});
</script>

<style lang="scss">
.vc-pane {
  @extend .card;
  margin: 5px 10px;
}

.weekday-position-6,
.weekday-position-7 {
  color: gray;
}

.vc-dot:not(:last-child) {
  margin-right: 10px !important;
}

.custom-calendar.vc-container {
  width: 0;
  margin: 0 !important;

  .is-today .vc-day-box-center-center .vc-highlight {
    box-shadow: 0 0 15px 5px #669df6;
  }

  .vc-day:not(.is-not-in-month) {
    padding: 5px;
    min-height: 120px;
    transition: box-shadow 150ms;

    @include themed() {
      box-shadow: 0 0 1px 1px t("light-light-border-color");

      &:hover {
        box-shadow: 0 0 3px 2px t("light-border-color");
      }
    }
  }

  .vc-highlights {
    top: 0;
    height: 30px;
    overflow: visible;
  }

  .day-card {
    font-size: 14px;
    margin: 5px 3px;
    padding: 5px 8px;
    border: 1px solid transparent;
  }

  .day-container {
    height: 100%;
  }
}
</style>

<style lang="scss" scoped>
#calendar-container {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding: 10px;
  overflow: auto hidden;
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
</style>
