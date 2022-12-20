<script lang="ts" setup>
import { Kid } from '~/types'
import { useStringFormatter } from '~/composables/useStringFormatter'

const { colorIsRgb, hexToRgb, favoriteColor, rgbToHex } = useStringFormatter()

const { data: kids, refresh: refreshKids } = await useFetch('/api/get-kids', {
  method: 'post'
})
if (!kids.value) {
  showError({ statusCode: 500, statusMessage: 'There was an error loading kids for this page.' })
}

const { data: users } = await useFetch('/api/get-users', {
  method: 'post'
})
if (!users.value) {
  showError({ statusCode: 500, statusMessage: 'There was an error loading users for this page.' })
}

const kidAction = ref<'delete' | 'edit' | 'idle'>('idle')
const editedKid = ref<Kid>()

// Delete kid record

async function deleteKid () {
  if (editedKid.value) {
    log('Deleting kid:', editedKid.value.name)
    const deleted = await useFetch('/api/delete-kid', {
      body: {
        id: editedKid.value.id
      },
      method: 'post'
    })

    if (deleted) {
      kidAction.value = 'idle'
      refreshKids()
    } else {
      showError({ statusCode: 500, statusMessage: 'There was an error deleting kid.' })
    }
  }
}

function startDeletingKid (kid: Kid) {
  editedKid.value = kid
  kidAction.value = 'delete'
}

// Edit or add a kid record
const editedKidAllowance = ref(0)
const editedKidColor = ref('#1FD22C')
const editedKidColorPicker = ref('#1FD22C')
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
  } else {
    showError({ statusCode: 500, statusMessage: 'There was an error saving kid.' })
  }
}

function startEditingKid (kid: Kid) {
  editedKid.value = kid

  editedKidAllowance.value = kid?.allowance ?? 0
  editedKidColor.value = kid?.color ?? '#1FD22C'
  editedKidId.value = kid?.id ?? -1
  editedKidInterest.value = kid?.interest ?? 0
  editedKidName.value = kid?.name ?? ''
  editedKidPhotoUrl.value = kid?.photoUrl ?? ''
  editedKidSlug.value = kid?.slug ?? ''

  if (colorIsRgb(editedKidColor.value)) {
    const rgb = editedKidColor.value.split(' ')
    editedKidColorPicker.value = rgbToHex(parseInt(rgb[0]), parseInt(rgb[1]), parseInt(rgb[2]))
  } else if (editedKidColor.value.startsWith('#')) {
    editedKidColorPicker.value = editedKidColor.value
  }

  kidAction.value = 'edit'
}

watch(editedKidColorPicker, () => {
  editedKidColor.value = hexToRgb(editedKidColorPicker.value)
})

const containerRef = ref()
const containerWidth = ref()
const resizeObserver = ref<ResizeObserver>()

onMounted(() => {
  if (containerRef.value) {
    resizeObserver.value = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentBoxSize) {
          const contentBoxSize = entry.contentBoxSize[0]
          containerWidth.value = contentBoxSize.inlineSize
        } else {
          containerWidth.value = entry.contentRect.width
        }
      }
    })

    resizeObserver.value.observe(containerRef.value)
  }
})
onBeforeUnmount(() => {
  if (resizeObserver.value) {
    resizeObserver.value.disconnect()
  }
})

definePageMeta({
  layout: false
})
</script>

<template>
  <div>
    <Head>
      <Title>⚙️ Settings : Kids Money</Title>
    </Head>

    <NuxtLayout name="default">
      <div class="space-y-16 w-full">
        <div v-if="kids.length" ref="containerRef" class="w-full">
          <div class="flex justify-between gap-8">
            <h2 class="text-primary-700 text-2xl dark:text-slate-300">
              Kids
            </h2>
            <div>
              <LinkButton
                class="bg-primary"
                label-text="+ Add Kid"
                @clicked="startEditingKid"
              />
            </div>
          </div>
          <div class="grid gap-8 mt-8" :class="{'xl:grid-cols-[1fr_350px] gap-12': kidAction === 'delete' || kidAction === 'edit'}">
            <div class="w-full overflow-x-auto bg-white shadow ring-1 ring-black ring-opacity-5 md:mx-0 md:rounded-lg dark:bg-primary-300">
              <table class="divide-y divide-gray-300 w-full dark:divide-primary-100">
                <thead class="bg-gray-50 dark:bg-primary-200">
                  <tr>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-slate-300">
                      Name
                    </th>
                    <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 md:table-cell dark:text-slate-300">
                      Slug
                    </th>
                    <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 md:table-cell dark:text-slate-300">
                      Photo
                    </th>
                    <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 md:table-cell dark:text-slate-300">
                      Color
                    </th>
                    <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 md:table-cell dark:text-slate-300">
                      Allowance
                    </th>
                    <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 md:table-cell dark:text-slate-300">
                      Interest
                    </th>
                    <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span class="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="w-full divide-y divide-gray-200 dark:divide-primary-200">
                  <tr v-for="kid in kids" :key="kid.slug" class="w-full">
                    <td class="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-bold text-gray-900 sm:w-auto sm:max-w-none sm:pl-6 dark:text-slate-200">
                      {{ kid.name }}
                      <dl class="grid grid-cols-3 mt-4 w-full font-normal md:hidden">
                        <div>
                          <dt class="text-xs">
                            Slug
                          </dt>
                          <dd class="mt-1 truncate text-gray-700 dark:text-primary-800">
                            {{ kid.slug }}
                          </dd>
                        </div>
                        <div>
                          <dt class="mt-4 text-xs">
                            Photo
                          </dt>
                          <dd class="mt-1 truncate text-gray-700 dark:text-primary-800">
                            <img v-if="kid.photoUrl" class="w-16 h-16 rounded-full object-cover shadow border-4" :src="kid.photoUrl" :style="{ borderColor: favoriteColor({ kid, opacity:.7 }) }">
                          </dd>
                        </div>
                        <div>
                          <dt class="mt-4 text-xs">
                            Color
                          </dt>
                          <dd class="mt-1 truncate text-gray-700 dark:text-primary-800">
                            <span class="grid grid-cols-[auto_1fr] items-center gap-2">
                              <span class="block w-8 h-8 rounded-full" :style="{ backgroundColor: favoriteColor({ kid }) }" />
                            </span>
                          </dd>
                        </div>
                        <div>
                          <dt class="mt-4 text-xs">
                            Allowance
                          </dt>
                          <dd class="mt-1 truncate text-gray-700 dark:text-primary-800">
                            {{ kid.allowance }}
                          </dd>
                        </div>
                        <div>
                          <dt class="mt-4 text-xs">
                            Interest
                          </dt>
                          <dd class="mt-1 truncate text-gray-700 dark:text-primary-800">
                            {{ kid.interest }}
                          </dd>
                        </div>
                        <div>
                          <div class="mt-4">
                            <dt class="text-xs">
                              Actions
                            </dt>
                            <dd class="mt-1 flex gap-2">
                              <LinkButton
                                class="bg-primary"
                                retain-style
                                theme="small"
                                title="Edit"
                                @clicked="startEditingKid(kid)"
                              >
                                <span class="sr-only">
                                  Edit
                                </span>
                                <IconEdit />
                              </LinkButton>
                              <LinkButton
                                class="bg-primary"
                                retain-style
                                theme="small"
                                title="Delete"
                                @clicked="startDeletingKid(kid)"
                              >
                                <span class="sr-only">
                                  Delete
                                </span>
                                <IconTrash />
                              </LinkButton>
                            </dd>
                          </div>
                        </div>

                        <div class="col-span-full">
                          <div :id="`action-target-${kid.slug}`" class="pt-2" />
                        </div>
                      </dl>
                    </td>
                    <td class="hidden px-3 py-4 text-sm text-gray-500 dark:text-primary-800 md:table-cell">
                      {{ kid.slug }}
                    </td>
                    <td class="hidden px-3 py-4 text-sm text-gray-500 dark:text-primary-800 md:table-cell">
                      <img v-if="kid.photoUrl" class="w-16 h-16 rounded-full object-cover shadow border-4" :src="kid.photoUrl" :style="{ borderColor: favoriteColor({ kid, opacity:.7 }) }">
                    </td>
                    <td class="hidden px-3 py-4 text-sm text-gray-500 dark:text-primary-800 md:table-cell">
                      <span class="grid grid-cols-[auto_1fr] items-center gap-2">
                        <span class="block w-8 h-8 rounded-full" :style="{ backgroundColor: favoriteColor({ kid }) }" />
                      </span>
                    </td>
                    <td class="hidden px-3 py-4 text-sm text-gray-500 dark:text-primary-800 md:table-cell">
                      {{ kid.allowance }}
                    </td>
                    <td class="hidden px-3 py-4 text-sm text-gray-500 dark:text-primary-800 md:table-cell">
                      {{ kid.interest }}
                    </td>
                    <td class="hidden space-x-2 py-4 pl-3 pr-4 text-right text-sm font-medium md:table-cell sm:pr-6">
                      <LinkButton
                        class="bg-primary"
                        retain-style
                        theme="small"
                        title="Edit"
                        @clicked="startEditingKid(kid)"
                      >
                        <span class="sr-only">
                          Edit
                        </span>
                        <IconEdit />
                      </LinkButton>
                      <LinkButton
                        class="bg-primary"
                        retain-style
                        theme="small"
                        title="Delete"
                        @clicked="startDeletingKid(kid)"
                      >
                        <span class="sr-only">
                          Delete
                        </span>
                        <IconTrash />
                      </LinkButton>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <Teleport v-if="kidAction === 'delete' || kidAction === 'edit'" :disabled="containerWidth >= 736" :to="`#action-target-${editedKid?.slug ?? ''}`">
              <div class="max-w-md xl:row-span-2">
                <div v-if="kidAction === 'delete'">
                  <p class="mt-4 dark:text-gray-400">
                    Are you sure you want to remove <strong>{{ editedKid.name }}</strong> and all related data?
                  </p>
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
                    <label for="editedKidName" class="block text-sm font-medium text-gray-700 dark:text-gray-400">Name</label>
                    <div class="mt-1">
                      <input
                        id="editedKidName"
                        v-model="editedKidName"
                        class="block w-full rounded-md border-gray-300 text-slate-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        type="text"
                        name="name"
                      >
                    </div>
                  </div>
                  <div>
                    <label for="editedKidSlug" class="block text-sm font-medium text-gray-700 dark:text-gray-400">Slug</label>
                    <div class="mt-1">
                      <input
                        id="editedKidSlug"
                        v-model="editedKidSlug"
                        class="block w-full rounded-md border-gray-300 text-slate-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        type="text"
                        name="name"
                      >
                    </div>
                  </div>
                  <div>
                    <label for="editedKidColor" class="block text-sm font-medium text-gray-700 dark:text-gray-400">Color</label>
                    <div class="grid grid-cols-[max-content_1fr] gap-2 mt-1">
                      <input v-model="editedKidColorPicker" type="color" class="w-9 h-9 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                      <input
                        id="editedKidColor"
                        v-model="editedKidColor"
                        class="block w-full rounded-md border-gray-300 text-slate-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        type="text"
                        name="name"
                      >
                    </div>
                  </div>
                  <div>
                    <label for="editedKidPhotoUrl" class="block text-sm font-medium text-gray-700 dark:text-gray-400">Photo URL</label>
                    <div class="mt-1">
                      <input
                        id="editedKidPhotoUrl"
                        v-model="editedKidPhotoUrl"
                        class="block w-full rounded-md border-gray-300 text-slate-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        inputmode="url"
                        name="name"
                        type="text"
                      >
                    </div>
                  </div>
                  <div>
                    <label for="editedKidAllowance" class="block text-sm font-medium text-gray-700 dark:text-gray-400">Allowance</label>
                    <div class="mt-1">
                      <input
                        id="editedKidAllowance"
                        v-model.number="editedKidAllowance"
                        class="block w-full rounded-md border-gray-300 text-slate-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        inputmode="decimal"
                        name="name"
                        type="text"
                      >
                    </div>
                  </div>
                  <div>
                    <label for="editedKidInterest" class="block text-sm font-medium text-gray-700 dark:text-gray-400">Interest</label>
                    <div class="mt-1">
                      <input
                        id="editedKidInterest"
                        v-model.number="editedKidInterest"
                        class="block w-full rounded-md border-gray-300 text-slate-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        inputmode="decimal"
                        name="name"
                        type="text"
                      >
                    </div>
                  </div>
                  <input id="editedKidId" v-model="editedKidId" type="hidden">

                  <div class="space-x-2">
                    <LinkButton
                      class="bg-primary"
                      :disabled="editedKidName === '' || editedKidSlug === ''"
                      element-type="input"
                      type="submit"
                      value="Save"
                    />
                    <LinkButton
                      class="bg-primary"
                      element-type="button"
                      label-text="Cancel"
                      type="button"
                      @click="kidAction = 'idle'"
                    />
                  </div>
                </form>
              </div>
            </Teleport>

            <div class="grid gap-10 w-full sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 dark:text-slate-300">
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
        </div>
        <div v-if="users.length">
          <h2 class="text-primary-700 text-2xl dark:text-slate-300">
            Users
          </h2>
          <ul class="mt-8 space-y-4">
            <li v-for="user in users" :key="user.username">
              <span class="block font-semibold text-2xl text-secondary">{{ user.username }}</span>
              <span class="block font-semibold text-xs leading-tight text-secondary/70 uppercase">{{ user.grownUp ? 'Admin' : 'Non-Admin' }}</span>
            </li>
          </ul>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>
