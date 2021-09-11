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
      :class="{ 'custom-calendar': !calendarSettings.showEntireCalendar }"
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
          weekdays: calendarSettings.showEntireCalendar ? 'WWW' : 'WWWW',
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
        v-if="!calendarSettings.showEntireCalendar"
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
                  : isDarkTheme
                  ? '#47628233'
                  : '#fff',
              }"
            >
              {{ attr.popover.label }}
            </div>
          </template>
        </div>
      </template>
    </v-calendar>
    <transition name="opacity">
      <CalendarNotes
        v-if="selectedDay"
        :day="selectedDay"
        @close="selectedDay = false"
      >
      </CalendarNotes>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getExams, getSchoolYears } from "@/scripts/scrapers";
import { jsonClone } from "@/scripts/utils";
import { CalendarSettings, ClassInfo, User } from "@/store/state";
import { MutationTypes } from "@/store/mutations";
import CalendarNotes from "./CalendarNotes.vue";

export interface CalendarYearData {
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
      showDayNote: false,
      selectedDay: null as any,
    };
  },
  methods: {
    async loadCalendar() {
      const schoolYears: CalendarYearData[] = await getSchoolYears();
      this.fromDate = this.convertToDate(schoolYears[0].startingDate);
      this.calendarColumns = this.calendarSettings.zoom;
      this.calendarRows = Math.round(12 / this.calendarColumns);
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
      ];
      await this.addExamsToCalendar("2020./2021." /* this.schoolYearTitle */); // TODO: UNCOMMENT
      this.calendarReady = true;
    },
    async addExamsToCalendar(schoolYear: string) {
      const thisYearClasses = this.classesList.filter(
        (classInfo) => classInfo.year == schoolYear,
      );
      for (const { url } of thisYearClasses) {
        const classId = url.match(/\d+/)![0];
        if (this.loadedClassIdExams.includes(classId)) continue;
        this.loadedClassIdExams.push(classId);
        this.attributes.push(
          ...((await getExams(classId)) || []).map(
            ({ subject, note, date }) => ({
              dot: {
                color: "red",
                style: { boxShadow: "0 0 12px 4px var(--red-500)" },
              },
              popover: { label: subject + ": " + note },
              dates: this.convertToDate(date),
            }),
          ),
        );
      }
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
      console.log(day);
      this.selectedDay = day;
      this.showDayNote = true;
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

.custom-calendar.vc-container {
  width: 0;
  margin: 0 !important;

  .is-today .vc-day-box-center-center .vc-highlight {
    box-shadow: 0 0 15px 5px #669df6;
  }

  .vc-day:not(.is-not-in-month) {
    padding: 5px;
    height: 120px;
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
  }

  .day-container {
    height: 100%;
    overflow: hidden auto;

    @include themed() {
      color: t("body-color");
    }
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
</style>
