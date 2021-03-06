<template>
  <div>
    <ul>
      <li
        v-for="weekDay in weekDays"
        :key="weekDay"
        class="weekday-name"
      >
        <h5>{{ weekDay }}</h5>
      </li>
      <li
        v-for="emptyDay in gridInfo.firstDay"
        :key="-1 * emptyDay"
        class="empty-field"
      ></li>
      <CalendarDay
        v-for="date in gridInfo.numDays"
        :key="date"
        class="day"
        :timestamp="new Date(timestamp.getFullYear(), timestamp.getMonth(), date)"
        :isActive="isSameDay(
          activeDate,
          new Date(timestamp.getFullYear(), timestamp.getMonth(), date),
        )"
      />
      <li
        v-for="emptyDay in gridInfo.numLeftOverFields"
        :key="100 - emptyDay"
        class="empty-field"
      ></li>
    </ul>
  </div>
</template>

<script>
import CalendarDay from '@/components/CalendarDay.vue';
import { weekDayNames } from '@/constants';
import {
  today,
  daysInMonth,
  getWeekday,
  // FIXME: Why does ESLint complain that `isSameDay` doesn't exist?
  // eslint-disable-next-line
  isSameDay,
} from '@/dateUtils';

export default {
  name: 'CalendarGrid',
  components: {
    CalendarDay,
  },

  props: {
    timestamp: {
      type: Date,
      default: today,
    },
  },

  data() {
    const weekDays = weekDayNames.map(weekDay => weekDay.replace(/dag/g, ''));

    return {
      weekDays,
      activeDate: today(),
    };
  },

  computed: {
    gridInfo() {
      const year = this.timestamp.getFullYear();
      const month = this.timestamp.getMonth();

      const numDays = daysInMonth(month, year);
      const firstDay = getWeekday(year, month, 1);
      const numUsedFields = numDays + firstDay;
      const numWeeks = Math.ceil(numUsedFields / 7);
      const numLeftOverFields = numWeeks * 7 - numUsedFields;

      return {
        numDays,
        numWeeks,
        firstDay,
        numLeftOverFields,
      };
    },
  },

  methods: {
    updateTimestamp(newTimestamp) {
      this.currentTimestamp = newTimestamp;
    },

    isSameDay,
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/theme.scss';
@import '@/assets/scss/consts.scss';

$border-style: 1px solid #ccc;

ul {
  list-style-type: none;
  display: grid;
  height: calc(100% - #{$header-height});
  /*  FIXME: Consider how this will be affected by e.g. sidebars */
  // max-width: 100%;
  grid-template-columns: repeat(7, minmax(calc(100% / 7), 1fr));
  grid-template-rows: 2rem;
  grid-auto-rows: 1fr;
  border-right: $border-style;
  /* border-top: $border-style; */
  position: absolute;
  width: 100%;

  .weekday-name {
    border-bottom: $border-style;
    display: flex;
    align-items: center;
    justify-content: center;

    h5 {
      text-transform: uppercase;
      font-size: 0.9rem;
      color: rgba(0, 0, 0, 0.6);
      font-weight: 600;
    }
  }

  .empty-field {
    border-left: $border-style;
    border-bottom: $border-style;
    background-color: rgba(0, 0, 0, 0.05);
  }

  .day {
    border-left: $border-style;
    border-bottom: $border-style;
    color: $primary-text;
  }
}
</style>
