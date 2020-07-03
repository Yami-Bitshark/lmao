<template>
<q-page>
  <div class="row q-col-gutter-sm q-ma-xs q-mr-sm">
    <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
      <q-card flat bordered class>
        <q-card-section>
          <div class="text-h6">Requetteur Graphique</div>
        </q-card-section>

        <q-separator inset></q-separator>

        <q-card-section>
          <q-form>
            <q-list>
              <q-card flat bordered class>

                <q-card-section>
                  <div>Filtres</div>
                </q-card-section>
                <q-item>
                  <q-item-section>
                    <q-item-label class="q-pb-xs">Agence</q-item-label>
                    <q-input dense outlined v-model="item.upRole" label="Agence" />
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label class="q-pb-xs">Role</q-item-label>
                    <q-input dense type="text" outlined v-model="item.role" label="Role" />
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label class="q-pb-xs">CA</q-item-label>
                    <q-input dense type="text" outlined v-model="item.ca" label="CA" />
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label class="q-pb-xs">Typologie</q-item-label>
                    <q-input dense type="text" outlined v-model="item.typology" label="Typologie" />
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label class="q-pb-xs">Date 1</q-item-label>
                    <q-input dense outlined v-model="item.d1" mask="date">
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy ref="d1Proxy" transition-show="scale" transition-hide="scale">
                            <q-date v-model="item.d1" @input="() => $refs.d1Proxy.hide()" />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </q-item-section>
                </q-item>


                <q-item>
                  <q-item-section>
                    <q-item-label class="q-pb-xs">Date 2</q-item-label>
                    <q-input dense outlined v-model="item.d2" mask="date">
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy ref="d2Proxy" transition-show="scale" transition-hide="scale">
                            <q-date v-model="item.d2" @input="() => $refs.d2Proxy.hide()" />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </q-item-section>
                </q-item>

              </q-card>
            </q-list>
            <q-card-actions align="right" class="bg-white text-teal">
              <q-btn label="Save" color="primary" @click="search" v-close-popup />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
    <div v-if="true" class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
      <q-card flat bordered class>
        <q-card-section>
          <div class="text-h6">List of Items</div>
        </q-card-section>

        <q-separator inset></q-separator>

        <q-card-section>
          <q-table :data="data" :hide-header="mode === 'grid'" :columns="columns" row-key="name" :grid="mode=='grid'" :filter="filter" :pagination.sync="pagination">
            <template v-slot:top-right="props">
              <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>

              <q-btn flat round dense :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'" @click="props.toggleFullscreen" v-if="mode === 'list'">
                <q-tooltip :disable="$q.platform.is.mobile" v-close-popup>{{props.inFullscreen ? 'Exit Fullscreen' : 'Toggle Fullscreen'}}</q-tooltip>
              </q-btn>

              <q-btn flat round dense :icon="mode === 'grid' ? 'list' : 'grid_on'" @click="mode = mode === 'grid' ? 'list' : 'grid'; separator = mode === 'grid' ? 'none' : 'horizontal'" v-if="!props.inFullscreen">
                <q-tooltip :disable="$q.platform.is.mobile" v-close-popup>{{mode==='grid' ? 'List' : 'Grid'}}</q-tooltip>
              </q-btn>

              <q-btn color="primary" icon-right="archive" label="Export to csv" no-caps @click="exportItemsTable" />
            </template>
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="name" :props="props">
                  {{props.row.name}}
                  <q-popup-edit v-model="props.row.name" @save="(val, initialValue) => editItem(val, props.row)" buttons>
                    <q-input v-model="props.row.name" dense autofocus />
                  </q-popup-edit>
                </q-td>
                <q-td key="ref1" :props="props">
                  {{props.row.ref1}}
                  <q-popup-edit v-model="props.row.ref1" @save="(val, initialValue) => editItem(val, props.row)" buttons>
                    <q-input v-model="props.row.ref1" dense autofocus />
                  </q-popup-edit>
                </q-td>
                <q-td key="ref2" :props="props">
                  {{props.row.ref2}}
                  <q-popup-edit v-model="props.row.ref2" @save="(val, initialValue) => editItem(val, props.row)" buttons>
                    <q-input v-model="props.row.ref2" dense autofocus />
                  </q-popup-edit>
                </q-td>
                <q-td key="qt" :props="props">
                  {{props.row.qt}}
                  <q-popup-edit v-model="props.row.qt" @save="(val, initialValue) => editItem(val, props.row)" buttons>
                    <q-input type="number" v-model="props.row.qt" dense autofocus />
                  </q-popup-edit>
                </q-td>
                <q-td key="qtMin" :props="props">
                  {{props.row.qtMin}}
                  <q-popup-edit v-model="props.row.qtMin" @save="(val, initialValue) => editItem(val, props.row)" buttons>
                    <q-input type="number" v-model="props.row.qtMin" dense autofocus />
                  </q-popup-edit>
                </q-td>
                <q-td key="qtMax" :props="props">
                  {{props.row.qtMax}}
                  <q-popup-edit v-model="props.row.qtMax" @save="(val, initialValue) => editItem(val, props.row)" buttons>
                    <q-input type="number" v-model="props.row.qtMax" dense autofocus />
                  </q-popup-edit>
                </q-td>
                <q-td key="price" :props="props">
                  {{props.row.price}}
                  <q-popup-edit v-model="props.row.price" @save="(val, initialValue) => editItem(val, props.row)" buttons>
                    <q-input type="number" v-model="props.row.price" dense autofocus />
                  </q-popup-edit>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>
  </div>
</q-page>
</template>

<script>
import {
  exportFile
} from "quasar";
import axios from 'axios'

function wrapCsvValue(val, formatFn) {
  let formatted = formatFn !== void 0 ? formatFn(val) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');

  return `"${formatted}"`;
}


export default {
  data() {
    return {
      editData: '',
      edit1: false,
      showTable: false,
      projectId: '',
      filter: "",
      mode: "list",
      item: {},
      pagination: {
        rowsPerPage: 10
      },
      options: [],
      columns: [{
          label: 'Agence',
          align: 'start',
          filterable: false,
          field: 'uprole_code',
          name: 'uprole_code',
        },
        {
          label: 'Role',
          field: 'role_code',
          name: 'role_code',
        },
        {
          label: 'Code Partenaire',
          field: 'partner_code',
          name: 'partner_code',
        },
        {
          label: 'Nom',
          field: 'name',
          name: 'name',
        },
        {
          label: 'Adresse',
          field: 'streetname1',
          name: 'streetname1',
        },
        {
          label: 'Itineraire',
          field: 'itinerary_code',
          name: 'itinerary_code',
        },
        {
          label: 'Typologie',
          field: 'typo',
          name: 'typo',
        }
      ],
      data: [

      ]
    };
  },
  methods: {
    search() {
      var _this = this
      axios.get('http://localhost:5000/', {
          params: {
            query: {
              item: JSON.stringify(_this.item),
            },
          },
        })
        .then(function(data) {
          _this.data = data.data
          console.log(_this.data)
        })
        .catch(function(o) {
          console.log(o)
        })

    },
    exportItemsTable() {
      // naive encoding to csv format
      const content = [this.columns.map(col => wrapCsvValue(col.label))]
        .concat(
          this.data.map(row =>
            this.columns
            .map(col =>
              wrapCsvValue(
                typeof col.field === "function" ?
                col.field(row) :
                row[col.field === void 0 ? col.name : col.field],
                col.format
              )
            )
            .join(",")
          )
        )
        .join("\r\n");

      const status = exportFile("items.csv", content, "text/csv");

      if (status !== true) {
        this.$q.notify({
          message: "Browser denied file download...",
          color: "negative",
          icon: "warning"
        });
      }
    }
  },
  created() {

  }
};
</script>

<style scoped>
</style>
