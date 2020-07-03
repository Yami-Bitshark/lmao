<template>
  <q-td>
    <q-chip
      v-bind:color="isActive.color"
      text-color="white"
      dense
      class="text-weight-bolder"
      square
      style="width: 85px"
    >{{isActive.status}}
    </q-chip>
  </q-td>
</template>

<script>
export default {
  name: 'ProjectStatus',
  props: ['status'],
  computed: {
   isActive : function () {
      if (this.status) {
        return {
          color : 'yellow',
          status : 'complete'
        }
      } else {
        return {
          color : 'green',
          status : 'on-going'
        }
      }
   }
   }
}
</script>
