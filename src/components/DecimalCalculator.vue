<template>

<div class="card mt-0">
  <v-text-field
    class="field mr-3 d-block"
    v-model="hour"
    label="Heure"
    outlined
    @input="calc_decimal"
    @focus="arrow = 'mdi-arrow-right'"
  ></v-text-field>

  <div class="d-block mr-3">:</div>

  <v-text-field
    class="field mr-3 d-block"
    v-model="minute"
    label="Minute"
    outlined
    @input="calc_decimal"
    @focus="arrow = 'mdi-arrow-right'"
  ></v-text-field>

  <v-icon class="d-block mr-3">{{ arrow }}</v-icon>

  <v-text-field
    class="field d-block"
    v-model="decimal"
    label="Décimal"
    outlined
    @input="calc_hour"
    @focus="arrow = 'mdi-arrow-left'"
  ></v-text-field>
</div>

</template>


<script>

export default {
  name: 'DecimalCalculator',

  components: {
    
  },

  props: {
    
  },

  data() {
    return {
      hour: 0,
      minute: 0,
      decimal: 0,
      arrow: 'mdi-arrow-right',
    }
  },

  created() {

  },

  mounted() {
    
  },

  beforeDestroy() {

  },

  computed: {

  },

  methods: {
    calc_decimal() {
      if (this.hour == '') this.hour = 0
      if (this.minute == '') this.minute = 0

      let hour = parseInt(this.hour)
      let minute = Math.round(parseInt(this.minute) / 60 * 100) / 100

      if (isNaN(hour + minute)) this.decimal = ''
      else this.decimal = hour + minute
    },

    calc_hour() {
      this.hour = Math.floor(this.decimal)
      this.minute = Math.round(((this.decimal - this.hour) * 100) / 100 * 60)

      if (isNaN(this.hour + this.minute)) {
        this.hour = ''
        this.minute = ''
      }
    },
  },

  watch: {

  }
}

</script>


<style scoped>

.card {
  display: inline-flex;
  justify-content: center;
  align-items: baseline;
  height: 58px;
  margin-top: 20px;
  border-color: rgba(0, 0, 0, 0); 
}

.field {
  max-width: 150px;
}

</style>
