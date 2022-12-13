<script lang="ts" setup>
import { Kid } from '~/types'
import { useStringFormatter } from '~/composables/useStringFormatter'

const { favoriteColor } = useStringFormatter()

const { data: kids, refresh: refreshKids } = await useFetch('/api/get-kids', {
  method: 'post'
})

const kidAction = ref<'delete' | 'edit' | 'idle'>('idle')

// Delete kid record
const deletedKid = ref<Kid>()

async function deleteKid () {
  if (deletedKid.value) {
    log('Deleting kid:', deletedKid.value.name)
    const deleted = await useFetch('/api/delete-kid', {
      body: {
        id: deletedKid.value.id
      },
      method: 'post'
    })

    if (deleted) {
      kidAction.value = 'idle'
      refreshKids()
    }
  }
}

function startDeletingKid (kid: Kid) {
  deletedKid.value = kid
  kidAction.value = 'delete'
}

// Edit or add a kid record
const editedKidAllowance = ref(0)
const editedKidColor = ref('#0026ff')
const editedKidId = ref(-1)
const editedKidInterest = ref(0)
const editedKidName = ref('')
const editedKidPhotoUrl = ref()
const editedKidSlug = ref('')

async function saveKid () {
  log('Adding kid:')
  const saved = await useFetch('/api/save-kid', {
    body: {
      allowance: editedKidAllowance.value,
      color: editedKidColor.value,
      id: editedKidId.value,
      interest: editedKidInterest.value,
      name: editedKidName.value,
      photoUrl: editedKidPhotoUrl.value,
      slug: editedKidSlug.value
    },
    method: 'post'
  })

  if (saved) {
    kidAction.value = 'idle'
    refreshKids()
  }
}

function startEditingKid (slug = '') {
  if (kids.value) {
    const editedKid = kids.value.find((kid: Kid) => kid.slug === slug)

    editedKidAllowance.value = editedKid?.allowance ?? 0
    editedKidColor.value = editedKid?.color ?? '#0026ff'
    editedKidId.value = editedKid?.id ?? -1
    editedKidInterest.value = editedKid?.interest ?? 0
    editedKidName.value = editedKid?.name ?? ''
    editedKidPhotoUrl.value = editedKid?.photoUrl ?? ''
    editedKidSlug.value = editedKid?.slug ?? ''

    kidAction.value = 'edit'
  }
}

definePageMeta({
  layout: false
})
</script>

<template>
  <div>
    <NuxtLayout name="default">
      <div>
        <div class="flex justify-between gap-8">
          <h2 class="text-primary-700 text-2xl">
            Kids
          </h2>
          <div>
            <LinkButton
              class="w-10 bg-primary"
              label-text="+ Add Kid"
              @clicked="startEditingKid"
            />
          </div>
        </div>
        <div class="grid mt-8" :class="{'grid-cols-[1fr_350px] gap-12': kidAction === 'delete' || kidAction === 'edit'}">
          <div>
            <div class="-mx-4 bg-white overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
              <table class="min-w-full divide-y divide-gray-300">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Name
                    </th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Slug
                    </th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Photo
                    </th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Color
                    </th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Allowance
                    </th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Interest
                    </th>
                    <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span class="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="kid in kids" :key="kid.slug">
                    <td class="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-bold text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">
                      {{ kid.name }}
                    </td>
                    <td class="px-3 py-4 text-sm text-gray-500">
                      {{ kid.slug }}
                    </td>
                    <td class="px-3 py-4 text-sm text-gray-500">
                      <img v-if="kid.photoUrl" class="w-16 h-16 rounded-full object-cover shadow border-4" :src="kid.photoUrl" :style="{ borderColor: favoriteColor({ kid, opacity:.7 }) }">
                    </td>
                    <td class="px-3 py-4 text-sm text-gray-500">
                      <div class="grid grid-cols-[auto_1fr] items-center gap-2">
                        <span class="block w-8 h-8 rounded-full" :style="{ backgroundColor: favoriteColor({ kid, opacity:.7 }) }" />
                        <span class="font-medium" :style="{ color: favoriteColor({ kid }) }">{{ kid.color }}</span>
                      </div>
                    </td>
                    <td class="px-3 py-4 text-sm text-gray-500">
                      {{ kid.allowance }}
                    </td>
                    <td class="px-3 py-4 text-sm text-gray-500">
                      {{ kid.interest }}
                    </td>
                    <td class="space-x-2 py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <LinkButton
                        class="bg-primary"
                        retain-style
                        theme="small"
                        title="Edit"
                        @clicked="startEditingKid(kid.slug)"
                      >
                        <div class="sr-only">
                          Edit
                        </div>
                        <IconEdit />
                      </LinkButton>
                      <LinkButton
                        class="bg-primary"
                        retain-style
                        theme="small"
                        title="Delete"
                        @clicked="startDeletingKid(kid)"
                      >
                        <div class="sr-only">
                          Delete
                        </div>
                        <IconTrash />
                      </LinkButton>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="grid gap-10 mt-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              <div>
                <h2 class="text-lg font-medium">
                  Name
                </h2>
                <p class="text-sm">
                  The name of the kid however you want to spell it. You can even use emoji 🎉
                </p>
              </div>
              <div>
                <h2 class="text-lg font-medium">
                  Slug
                </h2>
                <p class="text-sm">
                  A machine-readable version of the name. This will be used as part of the URL in some places. It should not include any spaces or special characters (no-emoji-allowed-here).
                </p>
              </div>
              <div>
                <h2 class="text-lg font-medium">
                  Photo
                </h2>
                <p class="text-sm">
                  The URL of a square-ish photo to help your kid identify themselves. This should be a URL to a JPG, PNG, SVG, or GIF that is hosted somewhere with a public URL.
                </p>
              </div>
              <div>
                <h2 class="text-lg font-medium">
                  Color
                </h2>
                <p class="text-sm">
                  Whatever color you would like! Maybe the kid’s favorite color? Any CSS color value will work. You can even use named CSS colors, like <em class="font-medium" style="color: green">green</em> or <em class="font-medium" style="color: rebeccapurple">rebeccapurple</em>.
                </p>
              </div>
              <div>
                <h2 class="text-lg font-medium">
                  Allowance
                </h2>
                <p class="text-sm">
                  A dollar amount that is added whenever an <strong>Add&nbsp;Allowance</strong> command is run. This should only include a number, but decimals are fine.
                </p>
              </div>
              <div>
                <h2 class="text-lg font-medium">
                  Interest
                </h2>
                <p class="text-sm">
                  A percentage of the current total that is added whenever an <strong>Add&nbsp;Interest</strong> command is run.
                </p>
              </div>
            </div>
          </div>

          <div>
            <div v-if="kidAction === 'delete'">
              <p>Are you sure you want to remove <strong>{{ deletedKid.name }}</strong> and all related data?</p>
              <div class="mt-4 space-x-2">
                <LinkButton
                  class="bg-negative"
                  element-type="button"
                  label-text="Delete"
                  type="button"
                  @click="deleteKid"
                />
                <LinkButton
                  class="bg-primary"
                  element-type="button"
                  label-text="Cancel"
                  type="button"
                  @click="kidAction = 'idle'"
                />
              </div>
            </div>
            <form v-if="kidAction === 'edit'" id="add-kid" class="space-y-4" action="" @submit.prevent="saveKid">
              <div>
                <label for="editedKidName" class="block text-sm font-medium text-gray-700">Name</label>
                <div class="mt-1">
                  <input id="editedKidName" v-model="editedKidName" type="text" name="name" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                </div>
              </div>
              <div>
                <label for="editedKidSlug" class="block text-sm font-medium text-gray-700">Slug</label>
                <div class="mt-1">
                  <input id="editedKidSlug" v-model="editedKidSlug" type="text" name="name" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                </div>
              </div>
              <div>
                <label for="editedKidColor" class="block text-sm font-medium text-gray-700">Color</label>
                <div class="mt-1">
                  <input id="editedKidColor" v-model="editedKidColor" type="text" name="name" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                </div>
              </div>
              <div>
                <label for="editedKidPhotoUrl" class="block text-sm font-medium text-gray-700">Photo URL</label>
                <div class="mt-1">
                  <input id="editedKidPhotoUrl" v-model="editedKidPhotoUrl" type="text" name="name" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                </div>
              </div>
              <div>
                <label for="editedKidAllowance" class="block text-sm font-medium text-gray-700">Allowance</label>
                <div class="mt-1">
                  <input id="editedKidAllowance" v-model.number="editedKidAllowance" type="text" name="name" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                </div>
              </div>
              <div>
                <label for="editedKidInterest" class="block text-sm font-medium text-gray-700">Interest</label>
                <div class="mt-1">
                  <input id="editedKidInterest" v-model.number="editedKidInterest" type="text" name="name" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                </div>
              </div>
              <input id="editedKidId" v-model="editedKidId" type="hidden">

              <div class="space-x-2">
                <LinkButton
                  class="bg-primary"
                  :disabled="editedKidName === '' || editedKidSlug === ''"
                  element-type="input"
                  theme="small"
                  type="submit"
                  value="Save"
                />
                <LinkButton
                  class="bg-primary"
                  element-type="button"
                  label-text="Cancel"
                  theme="small"
                  type="button"
                  @click="kidAction = 'idle'"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>
