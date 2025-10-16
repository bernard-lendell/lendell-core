<template>
  <q-page class="q-pa-md">
    <div class="row row fit q-col-gutter-x-sm items-stretch content-stretch">
      <div class="col-8">
        <q-card>
          <q-card-section class="bg-primary">
            <q-input
              label="BATCH ID"
              color="secondary"
              outlined
              dark
              stack-label
              square
              debounce="900"
              autofocus
              v-model="batchId"
              :loading="this.bools.loading"
              @update:model-value="(val) => this.fetchData(val, this.tab)"
              label-slot
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:label>
                BATCH ID
                <span class="text-weight-bold text-red"> *</span>
              </template>
              <template v-slot:append>
                <q-btn-group class="q-ml-sm">
                  <q-btn
                    label="SEARCH CANDIDATE BY APP ID"
                    @click="openSearchDialog()"
                    size="11px"
                    color="secondary"
                    text-color="accent"
                    icon="fa fa-magnifying-glass"
                  ></q-btn>
                  <q-btn
                    label="ASSIGN"
                    v-if="this.selected.length > 0"
                    color="secondary"
                    text-color="accent"
                    icon="fa fa-user-plus"
                    @click="openClientDialog()"
                  ></q-btn>
                </q-btn-group>
              </template>
            </q-input>
          </q-card-section>
          <q-card-section class="q-pa-none">
            <q-separator color="secondary"></q-separator>
            <q-tabs
              v-model="this.tab"
              dense
              active-class="bg-primary text-white"
              indicator-color="secondary"
              align="justify"
            >
              <q-tab
                v-for="status in this.candidateStore.candidateStatus"
                :key="status"
                :name="status.code"
                :label="status.name.toUpperCase()"
                :disable="this.bools.loading"
              >
              </q-tab>
            </q-tabs>
            <q-separator color="bg-dark"></q-separator>

            <q-tab-panels v-model="this.tab" animated>
              <q-tab-panel
                v-for="status in this.candidateStore.candidateStatus"
                :key="status"
                :name="status.code"
                class="q-pa-none"
                style="max-height: 70vh !important"
              >
                <!--
                  :columns="this.columns" -->
                <q-table
                  class="scroll sticky-header-table"
                  :rows="this.candidateList"
                  :columns="this.columns"
                  virtual-scroll
                  row-key="external_client_id"
                  v-model:pagination="this.pagination"
                  :filter="this.filter"
                  selection="multiple"
                  v-model:selected="selected"
                  :loading="this.bools.loading"
                >
                  <template v-slot:top-right>
                    <q-input
                      outlined
                      dense
                      debounce="300"
                      input-class="text-green text-bold"
                      v-model="this.filter"
                      square
                      placeholder="Filter"
                      color="green"
                      stack-label
                      class="full-width q-pl-md"
                      filled
                    >
                      <template v-slot:append>
                        <q-icon name="search" color="green" />
                      </template>
                    </q-input>
                  </template>

                  <template v-slot:body="props">
                    <q-tr :props="props" class="cursor-pointer">
                      <q-td auto-width>
                        <q-checkbox keep-color v-model="props.selected" color="green" />
                      </q-td>
                      <q-td v-for="col in props.cols" :key="col.name" :props="props">
                        <div v-if="col.name === 'hasFiles'">
                          <div v-if="col.value === 'YES'">
                            <q-btn
                              label="FILES"
                              @click="getFiles(props.row)"
                              icon="fa fa-file"
                              size="sm"
                              color="green"
                            ></q-btn>
                          </div>
                          <div v-else>{{ col.value }}</div>
                        </div>
                        <div v-else>
                          {{ col.value }}
                        </div>
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </q-tab-panel>
            </q-tab-panels>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-4">
        <q-card class="fit">
          <q-card-section class="bg-primary text-white text-overline text-uppercase">
            <div class="row items-center justify-between">
              <div>Endorsements</div>
              <div>
                <q-btn-group>
                  <q-btn
                    icon="event"
                    color="yellow-8"
                    size="11px"
                    text-color="accent"
                    :label="`ENDORSEMENT DATE: ${this.dateLabel}`"
                  >
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-date v-model="date" landscape range @update:model-value="updateLabel()">
                      </q-date>
                    </q-popup-proxy>
                  </q-btn>
                  <!-- <q-btn
                    color="yellow-8"
                    text-color="primary"
                    icon="fa fa-download"
                    label="EXPORT"
                    @click="exportTable"
                    v-if="this.allowExport"
                  ></q-btn> -->
                </q-btn-group>
              </div>
            </div>
          </q-card-section>
          <q-card-section class="q-pa-none">
            <q-separator color="secondary"></q-separator>
            <q-tabs
              v-model="this.subTab"
              dense
              active-class="bg-primary text-white"
              indicator-color="secondary"
              align="justify"
            >
              <q-tab name="acknowledgement" label="ACKNOWLEDGEMENTS" :disable="this.bools.loading">
                <q-badge color="red" floating style="right: -45px">
                  {{ this.endorsements.acknowledgements.length }}
                </q-badge>
              </q-tab>
              <q-tab name="forReview" label="FOR REVIEW" :disable="this.bools.loading">
                <q-badge color="red" floating style="right: -45px">
                  {{ this.endorsements.forReview.length }}
                </q-badge>
              </q-tab>
            </q-tabs>
            <q-separator color="bg-dark"></q-separator>

            <q-tab-panels v-model="this.subTab" animated class="rounded-bottom-borders">
              <q-tab-panel name="acknowledgement" class="fit q-pa-none">
                <q-table
                  class="scroll sticky-header-table"
                  :rows="this.endorsements.acknowledgements"
                  :columns="this.candidateStore.endorsementColumns"
                  virtual-scroll
                  row-key="external_client_id"
                  v-model:pagination="this.pagination"
                  :filter="this.filterEndorsements"
                  :loading="this.bools.endorsmentsLoading"
                >
                  <template v-slot:top-right>
                    <q-input
                      outlined
                      dense
                      debounce="300"
                      input-class="text-green text-bold"
                      v-model="this.filterEndorsements"
                      square
                      placeholder="Filter"
                      color="green"
                      stack-label
                      class="full-width q-pl-md"
                      filled
                    >
                      <template v-slot:append>
                        <q-icon name="search" color="green" />
                      </template>
                    </q-input>
                  </template>
                  <template v-slot:header="props">
                    <q-tr :props="props">
                      <q-th auto-width />
                      <q-th v-for="col in props.cols" :key="col.name" :props="props">
                        {{ col.label }}
                      </q-th>
                    </q-tr>
                  </template>

                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td auto-width>
                        <q-btn
                          size="sm"
                          color="secondary"
                          text-color="accent"
                          round
                          dense
                          @click="props.expand = !props.expand"
                          :icon="props.expand ? 'remove' : 'add'"
                        />
                      </q-td>
                      <q-td v-for="col in props.cols" :key="col.name" :props="props">
                        {{ col.value }}
                      </q-td>
                    </q-tr>
                    <q-tr v-show="props.expand" :props="props">
                      <q-td colspan="100%">
                        <div class="text-left">{{ props.row }}.</div>
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </q-tab-panel>
              <q-tab-panel name="forReview" class="fit q-pa-none">
                <q-table
                  class="shadow-0 borderless scroll sticky-header-table"
                  :rows="this.endorsements.forReview"
                  :columns="this.candidateStore.endorsementColumns"
                  virtual-scroll
                  row-key="external_client_id"
                  v-model:pagination="this.pagination"
                  :filter="this.filterEndorsements"
                  selection="multiple"
                  v-model:selected="endorsementSelected"
                  :loading="this.bools.endorsmentsLoading"
                >
                  <template v-slot:top-left>
                    <div v-if="this.endorsementSelected.length > 0">
                      <q-btn
                        color="secondary"
                        text-color="accent"
                        size="11px"
                        label="BATCH SEND"
                        icon="fa fa-paper-plane"
                        @click="this.bools.endorsementsDialog = true"
                      ></q-btn>
                    </div>
                  </template>
                  <template v-slot:top-right>
                    <q-input
                      outlined
                      dense
                      debounce="300"
                      input-class="text-green text-bold"
                      v-model="this.filterEndorsements"
                      square
                      placeholder="Filter"
                      color="green"
                      stack-label
                      class="full-width q-pl-md"
                      filled
                    >
                      <template v-slot:append>
                        <q-icon name="search" color="green" />
                      </template>
                    </q-input>
                  </template>

                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td auto-width>
                        <q-checkbox keep-color v-model="props.selected" color="green" />
                        <q-btn
                          size="sm"
                          color="secondary"
                          text-color="accent"
                          round
                          dense
                          @click="props.expand = !props.expand"
                          :icon="props.expand ? 'remove' : 'add'"
                        />
                      </q-td>
                      <q-td v-for="col in props.cols" :key="col.name" :props="props">
                        {{ col.value }}
                      </q-td>
                    </q-tr>
                    <q-tr v-show="props.expand" :props="props">
                      <q-td colspan="100%">
                        <div class="text-left">{{ props.row }}.</div>
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </q-tab-panel>
            </q-tab-panels>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-dialog v-model="this.bools.fileDialog">
      <q-card style="width: 65vw !important; max-width: 65vw !important">
        <q-card-section class="text-uppercase text-h5" align="center">
          FILES OF {{ this.currentCandidate.full_name }}
        </q-card-section>
        <q-card-section>
          <div class="row q-pb-md">
            <div class="col text-weight-bold">Type</div>
            <div class="col text-weight-bold">Tag</div>
            <div class="col text-weight-bold">Name</div>
            <div class="col text-weight-bold">File Type</div>
            <div class="col text-weight-bold">URL</div>
          </div>
          <div class="row q-pb-sm" v-for="file of this.currentCandidate.files" :key="file">
            <div class="col">
              {{ file.type }}
            </div>
            <div class="col">
              {{ file.tag }}
            </div>
            <div class="col">
              {{ file.name }}
            </div>
            <div class="col">
              {{ file.content_type }}
            </div>
            <div class="col">
              <q-btn
                icon="fa fa-file"
                size="sm"
                :label="file.name"
                color="green"
                :href="file.content_url"
                target="_blank"
              ></q-btn>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="this.bools.clientDialog">
      <q-card style="width: 35vw !important">
        <q-card-section class="bg-green text-white text-h5" align="center">CLIENTS</q-card-section>
        <q-form ref="clientForm" @submit="assignCandidates()">
          <q-card-section class="client-details">
            <div class="row fit">
              <div class="col-12">
                <q-select
                  class="full-width"
                  stack-label
                  square
                  filled
                  v-model="endorsementDetails.client_id"
                  :options="this.candidateStore.clientsOptions"
                  :rules="[(val) => !!val || 'Field is required']"
                  emit-value
                  map-options
                  label-slot
                  dense
                  color="green"
                  options-dense
                  hide-bottom-space
                >
                  <template v-slot:label>
                    Client
                    <span class="text-weight-bold text-red"> *</span>
                  </template>
                </q-select>
              </div>
            </div>
          </q-card-section>
          <q-card-section align="right" class="bg-green" v-if="this.selected.length > 0">
            <q-btn
              type="submit"
              :label="`ASSIGN ${this.selected.length} CANDIDATE(S)`"
              color="secondary"
              text-color="accent"
              icon="fa fa-check"
            >
            </q-btn>
          </q-card-section>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="this.bools.searchDialog" persistent>
      <q-card style="width: 65vw !important; max-width: 65vw !important">
        <q-form ref="searchForm" @submit="assignAndTransferByAppId">
          <q-card-section class="bg-green text-white">
            <div class="row justify-between items-center">
              <div>SEARCH CANDIDATE BY APP ID</div>
              <div></div>
            </div>
          </q-card-section>
          <q-card-section class="q-pb-sm">
            <q-input
              outlined
              dense
              debounce="300"
              input-class="text-bold"
              v-model="this.applicationId"
              square
              color="green"
              stack-label
              class="full-width"
              filled
              label-slot
              autofocus
              :rules="[(val) => !!val || 'Field is required']"
              @update:model-value="(val) => this.fetchByApplicationId()"
            >
              <template v-slot:append>
                <q-icon name="fa fa-user" color="green" />
              </template>

              <template v-slot:label>
                <span class="text-primary"> Application ID </span>
                <span class="text-weight-bold text-red"> *</span>
              </template>
            </q-input>
          </q-card-section>

          <q-card-section class="q-pt-sm" v-if="Object.keys(this.applicationDetails).length > 0">
            <q-card square>
              <q-card-section class="q-pa-sm">
                <div class="row fit q-pl-md text-overline text-uppercase">
                  <span class="col-6">Name: {{ this.applicationDetails.full_name }}</span>
                  <span class="col-6">Birthdate: {{ this.applicationDetails.birthdate }}</span>
                  <span class="col-6">MSA: {{ this.applicationDetails.msa }}</span>
                  <span class="col-6">Status: {{ this.applicationDetails.folder }}</span>
                  <span class="col-6">Batch ID: {{ this.applicationDetails.endo_desc }}</span>
                  <span class="col-6"
                    >Endorsement Date: {{ this.applicationDetails.endo_formatdate }}</span
                  >
                </div>
              </q-card-section>
            </q-card>
            <q-separator class="q-my-md"></q-separator>
            <div class="row">
              <div class="col-12">
                <q-select
                  class="full-width"
                  stack-label
                  square
                  filled
                  v-model="endorsementDetails.client_id"
                  :options="this.candidateStore.clientsOptions"
                  :rules="[(val) => !!val || 'Field is required']"
                  emit-value
                  map-options
                  label-slot
                  dense
                  color="green"
                  options-dense
                  hide-bottom-space
                >
                  <template v-slot:label>
                    Client
                    <span class="text-weight-bold text-red"> *</span>
                  </template>
                </q-select>
              </div>
            </div>
          </q-card-section>

          <q-card-section v-if="Object.keys(this.applicationDetails).length > 0">
            <q-card v-if="this.applicationDetails.files.length > 0">
              <q-card-section class="bg-green text-white">FILES:</q-card-section>
              <q-card-section>
                <div class="row q-pb-md">
                  <div class="col text-weight-bold">Type</div>
                  <div class="col text-weight-bold">Tag</div>
                  <div class="col text-weight-bold">Name</div>
                  <div class="col text-weight-bold">File Type</div>
                  <div class="col text-weight-bold">URL</div>
                </div>
                <div class="row q-pb-sm" v-for="file of this.applicationDetails.files" :key="file">
                  <div class="col">
                    {{ file.type }}
                  </div>
                  <div class="col">
                    {{ file.tag }}
                  </div>
                  <div class="col">
                    {{ file.name }}
                  </div>
                  <div class="col">
                    {{ file.content_type }}
                  </div>
                  <div class="col">
                    <q-btn
                      icon="fa fa-file"
                      size="sm"
                      :label="file.name"
                      color="green"
                      :href="file.content_url"
                      target="_blank"
                    ></q-btn>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-card-section>
          <q-card-section align="right" class="bg-primary" v-if="!bools.applicationDialogLoading">
            <q-btn-group>
              <!-- <q-btn
                @click="fetchByApplicationId()"
                :label="'SEARCH BY APPLICATION ID'"
                color="green"
                icon="fa fa-magnifying-glass"
              >
              </q-btn> -->
              <q-btn
                :label="'ASSIGN'"
                color="secondary"
                text-color="accent"
                v-if="Object.keys(this.applicationDetails).length > 0"
                icon="fa fa-user-plus"
                type="submit"
              >
              </q-btn>
              <q-btn
                icon="fa fa-times"
                label="CLOSE"
                color="red"
                @click="closeSearchDialog"
              ></q-btn>
            </q-btn-group>
          </q-card-section>
          <q-card-section
            v-if="bools.applicationDialogLoading"
            style="height: 15vh !important"
          ></q-card-section>

          <q-inner-loading :showing="this.bools.applicationDialogLoading">
            <q-spinner-puff size="100px" color="primary" />
            <span class="q-pt-md text-overline text-uppercase">Loading, please wait ...</span>
          </q-inner-loading>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="this.bools.endorsementsDialog">
      <q-card style="max-width: 70vw !important">
        <q-card-section class="bg-primary text-white text-overline">
          <div class="row items-center justify-between">
            <div>BATCH SEND - {{ this.endorsementSelected.length }} ENDORSEMENT(S)</div>
            <div>
              <q-btn label="close" icon="fa fa-times" color="red" size="11px" v-close-popup></q-btn>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <q-table
            class="scroll sticky-header-table"
            :rows="this.endorsementSelected"
            :columns="this.candidateStore.endorsementColumns"
            virtual-scroll
            row-key="external_client_id"
            v-model:pagination="this.pagination"
            :filter="this.filterEndorsements"
            :loading="this.bools.endorsmentsLoading"
          >
            <template v-slot:top-right>
              <q-input
                outlined
                dense
                debounce="300"
                input-class="text-green text-bold"
                v-model="this.filterEndorsements"
                square
                placeholder="Filter"
                color="green"
                stack-label
                class="full-width q-pl-md"
                filled
              >
                <template v-slot:append>
                  <q-icon name="search" color="green" />
                </template>
              </q-input>
            </template>
            <template v-slot:header="props">
              <q-tr :props="props">
                <q-th auto-width />
                <q-th v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.label }}
                </q-th>
              </q-tr>
            </template>

            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td auto-width>
                  <q-btn
                    size="sm"
                    color="secondary"
                    text-color="accent"
                    round
                    dense
                    @click="props.expand = !props.expand"
                    :icon="props.expand ? 'remove' : 'add'"
                  />
                </q-td>
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                  {{ col.value }}
                </q-td>
              </q-tr>
              <q-tr v-show="props.expand" :props="props">
                <q-td colspan="100%">
                  <div class="text-left">{{ props.row }}.</div>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card-section>
        <q-card-section class="bg-primary text-white text-overline">
          <div class="row items-center justify-between">
            <div></div>
            <div>
              <q-btn
                label="BATCH SEND"
                size="11px"
                icon="fa fa-paper-plane"
                color="secondary"
                text-color="accent"
              ></q-btn>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import {
  defineComponent,
  // defineAsyncComponent
} from 'vue'
// import { useUserStore } from 'src/stores/user'
import { useHelperStore } from 'src/stores/helper'
import { useCandidateStore } from 'src/stores/candidate'

import * as utils from 'src/util'

export default defineComponent({
  name: 'DashboardPage',
  data() {
    return {
      // userStore: useUserStore(),
      helperStore: useHelperStore(),
      candidateStore: useCandidateStore(),
      bools: {
        loading: false,
        fileDialog: false,
        clientDialog: false,
        searchDialog: false,
        applicationDialogLoading: false,
        endorsementsDialog: false,
        endorsmentsLoading: false,
      },
      batchId: '',
      applicationId: '',
      tab: '',
      subTab: 'acknowledgement',
      pagination: {
        rowsPerPage: 0,
      },
      filter: '',
      filterEndorsements: '',
      candidateList: [],
      currentCandidate: {},
      selected: [],
      endorsementDetails: {
        client_id: '',
        site_id: '',
        team_id: '',
      },
      applicationDetails: {},
      date: {
        from: '',
        to: '',
      },
      dateLabel: '',
      endorsements: {
        all: [],
        acknowledgements: [],
        forReview: [],
      },
      endorsementSelected: [],
      columns: [
        {
          name: 'external_client_id',
          label: 'ID',
          field: 'external_client_id',
          align: 'center',
          // field: row => row.name,
          // format: val => `${val}`,
          sortable: true,
        },
        {
          name: 'full_name',
          align: 'center',
          label: 'FULL NAME',
          field: 'full_name',
          sortable: true,
        },
        {
          name: 'birthdate',
          align: 'center',
          label: 'BIRTHDATE',
          field: 'birthdate',
          sortable: true,
        },
        {
          name: 'endo_desc',
          align: 'center',
          label: 'ENDORSEMENT',
          field: 'endo_desc',
          sortable: true,
        },
        {
          name: 'msa',
          align: 'center',
          label: 'MSA',
          field: 'msa',
          sortable: true,
        },
        {
          name: 'package_account_name',
          align: 'center',
          label: 'PACKAGE',
          field: 'package_account_name',
          sortable: true,
        },
        {
          name: 'site',
          align: 'center',
          label: 'SITE',
          field: 'site',
          sortable: true,
        },
        {
          name: 'endo_requestor',
          align: 'center',
          label: 'REQUEST BY',
          field: 'endo_requestor',
          sortable: true,
        },
        {
          name: 'endo_dateendo_formatdate',
          align: 'center',
          label: 'ENDORSEMENT D/T',
          field: 'endo_formatdate',
          sortable: true,
        },
        {
          name: 'folder',
          align: 'center',
          label: 'STATUS',
          field: 'folder',
          sortable: true,
        },
        {
          name: 'hasFiles',
          align: 'center',
          label: 'HAS FILES?',
          field: 'hasFiles',
          sortable: true,
        },
      ],
    }
  },
  watch: {
    tab(val) {
      this.fetchData(this.batchId, val)
    },
  },
  async mounted() {
    await this.setDates()
    this.initStores()
  },
  methods: {
    async setDates() {
      const fromAndToDate = utils.fromAndToDate({ days: 7 })
      this.date.from = fromAndToDate.fromDate
      this.date.to = fromAndToDate.toDate
      this.dateLabel = `${fromAndToDate.fromDate} - ${fromAndToDate.toDate}`
    },
    updateLabel() {
      if (this.date === null) {
        this.dateLabel = 'No dates specified'
        return
      }
      if (utils.isStr(this.date)) {
        this.dateLabel = `${this.date} - ${this.date}`
        // this.$emit("reloadPR");

        // this.$emit('dateSet', this.date)
        this.initStores()
        return
      }
      this.dateLabel = `${this.date.from} - ${this.date.to}`

      this.initStores()
    },
    async initStores() {
      await this.helperStore.initStores()
      if (this.candidateStore.candidateStatus.length > 0) {
        this.tab = this.candidateStore.candidateStatus[0].code

        if (this.candidateStore.clients.length > 0) {
          await this.candidateStore.getClients({
            company_name: 'concentrix',
          })
        }

        let dateFrom = this.date.from
        let dateTo = this.date.to
        if (utils.isStr(this.date)) {
          dateFrom = this.date
          dateTo = this.date
        }

        this.bools.endorsmentsLoading = true
        const endorsements = await this.candidateStore.getEndorsements({
          fromDate: dateFrom.replaceAll('/', '-'),
          toDate: dateTo.replaceAll('/', '-'),
        })

        this.endorsements.all = endorsements

        if (endorsements.length > 0) {
          this.endorsements.acknowledgements = endorsements.filter(
            (filterEndorsements) => filterEndorsements.is_for_review !== 1,
          )
          this.endorsements.forReview = endorsements.filter(
            (filterEndorsements) => filterEndorsements.is_for_review === 1,
          )
        }

        this.bools.endorsmentsLoading = false
      }
    },

    async fetchData(batchId, status) {
      if (batchId === '') return

      this.candidateList = []
      this.bools.loading = true
      this.candidateList = await this.candidateStore.getCandidates({
        batch_id: batchId,
        status: status,
      })
      this.bools.loading = false
    },
    getFiles(row) {
      this.bools.fileDialog = true
      this.currentCandidate = row
    },
    async openClientDialog() {
      this.bools.clientDialog = true
    },

    async fetchByApplicationId() {
      this.applicationDetails = {}
      this.bools.applicationDialogLoading = true
      const candidates = await this.candidateStore.getCandidates({
        application_id: this.applicationId,
      })

      if (candidates.length > 0) {
        this.applicationDetails = candidates[0]
      }

      this.bools.applicationDialogLoading = false
    },

    async assignCandidates() {
      await this.$refs.clientForm.validate().then(async (valid) => {
        if (!valid) {
          return false
        }

        await this.saveEndorsements()
      })
    },

    async saveEndorsements() {
      if (this.candidateStore.supervisors.length === 0) {
        await this.fetchSupervisors()
      }

      let filterClients = this.candidateStore.clients.filter(
        (filterClient) => filterClient.value === this.endorsementDetails.client_id,
      )
      let filterSupervisor = []
      if (filterClients.length > 0) {
        filterSupervisor = this.candidateStore.supervisors.filter(
          (filterSupervisor) => filterSupervisor.supervisor_id === filterClients[0].supervisor_,
        )
      }

      this.$q
        .dialog({
          title: 'Confirmation',
          message: `Are you sure you want to assign the Candidate(s)?`,
          ok: {
            push: true,
          },
          cancel: {
            push: true,
            color: 'negative',
          },
        })
        .onOk(async () => {
          this.bools.loading = true
          let payload = {}

          if (filterClients.length > 0) {
            this.endorsementDetails.site_id = filterClients[0].site_id
            this.endorsementDetails.team_id = filterClients[0].team_

            if (this.selected.length > 0) {
              for (const list of this.selected) {
                list.client_id = this.endorsementDetails.client_id
                list.site_id = this.endorsementDetails.site_id
                list.team_id = this.endorsementDetails.team_id
                ;(list.supervisor_id = filterSupervisor[0].supervisor_id),
                  (list.user_supervisor_id = 'LENDELL CORE USER')
              }

              payload = this.selected
            }
          }

          await this.candidateStore.postEndorsements(payload)

          const notifPayload = {
            displayNotify: true,
            message: 'Successfully assigned candidate(s)',
            type: 'positive',
          }

          await this.helperStore.setNotification(notifPayload)

          await utils.delay(1500)

          const notifInitPayload = {
            displayNotify: false,
            message: '',
            type: '',
          }

          await this.helperStore.setNotification(notifInitPayload)

          this.bools.clientDialog = false
          await this.initStores()

          await this.closeSearchDialog()
          this.bools.loading = false
          // if (response.status === 'success') {
          //   // await this.fetchApi(this.tab)
          //   this.bools.loading = false

          //   this.$q.notify({
          //     progress: true,
          //     type: 'positive',
          //     message: 'SUCCESSFULLY ASSIGNED CANDIDATE(S)',
          //   })
          //   this.bools.apiDialog = false
          //   setTimeout(() => {
          //     window.location.reload()
          //   }, 500)
          // }
        })
    },

    async openSearchDialog() {
      this.bools.searchDialog = true
      this.applicationId = ''
      this.applicationDetails = {}
      this.endorsementDetails = {
        client_id: '',
        site_id: '',
        team_id: '',
      }
    },

    async assignAndTransferByAppId() {
      await this.$refs.searchForm.validate().then(async (valid) => {
        if (!valid) {
          return false
        }
        if (this.selected.length > 0) {
          const filterSelected = this.selected.filter(
            (filterSelected) =>
              filterSelected.external_client_id === this.applicationDetails.external_client_id,
          )
          if (filterSelected.length === 0) {
            this.selected.push(this.applicationDetails)
          }
        } else {
          this.selected.push(this.applicationDetails)
        }
        await this.saveEndorsements()
      })
    },

    closeSearchDialog() {
      this.selected = []
      this.bools.searchDialog = false
      this.applicationId = ''
      this.applicationDetails = {}
      this.endorsementDetails = {
        client_id: '',
        site_id: '',
        team_id: '',
      }
    },
  },
})
</script>

<style>
.sticky-header-table {
  height: 70vh;
}

.sticky-header-table .q-table__bottom {
  background-color: #ffffff;
  color: #4caf50;
}

.sticky-header-table thead tr:first-child th {
  background: #ffffff;
  color: #4caf50;
  top: 0;
}

.sticky-header-table .q-table__top {
  background-color: #ffffff;
  color: #4caf50;
}

.sticky-header-table thead tr th {
  position: sticky;
  z-index: 1;
}

.sticky-header-table tbody {
  scroll-margin-top: 48px;
}

.sticky-header-table tbody .q-td {
  border-color: #e0e0e0 !important;
}

.sticky-header-table tbody .q-tr:nth-child(odd) {
  /* background-color: #4caf50; */
}

.sticky-header-table tbody .q-tr:nth-child(even) {
  background-color: #eceff1;
}

.sticky-header-table tbody .q-tr:hover {
  /* background-color: #ffeb3b; */
}
</style>
