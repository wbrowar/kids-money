<script setup lang="ts">
const { grownUp, username } = useCurrentUser()
const { kids, kidsLookup, refreshKids } = await useKids()

const kidAction = ref<'delete' | 'edit' | 'idle'>('idle')

// Delete kid record
const deletedKidId = ref<number>()

async function deleteKid () {
  log('Deleting kid:')
  const deleted = await useFetch('/api/delete-kid', {
    body: {
      id: deletedKidId.value
    },
    method: 'post'
  })

  if (deleted) {
    kidAction.value = 'idle'
    refreshKids()
  }
}

function startDeletingKid (id: number) {
  deletedKidId.value = id
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
  const editedKid = kidsLookup.value[slug]

  editedKidAllowance.value = editedKid?.allowance ?? 0
  editedKidColor.value = editedKid?.color ?? '#0026ff'
  editedKidId.value = editedKid?.id ?? -1
  editedKidInterest.value = editedKid?.interest ?? 0
  editedKidName.value = editedKid?.name ?? ''
  editedKidPhotoUrl.value = editedKid?.photoUrl ?? ''
  editedKidSlug.value = editedKid?.slug ?? ''

  kidAction.value = 'edit'
}

definePageMeta({
  layout: false
})
</script>

<template>
  <div>
    <NuxtLayout name="default">
      <template #action-buttons>
        <NuxtLink to="/">
          Home
        </NuxtLink>
      </template>

      <h1>Page: admin</h1>
      <div>
        <h2>Current User</h2>
        <p>Grown Up: {{ grownUp }}</p>
        <p>Username: {{ username }}</p>
      </div>
      <div>
        <h2>Kids</h2>
        <div class="grid" :class="{'grid-cols-[1fr_auto]': kidAction === 'delete' || kidAction === 'edit'}">
          <table class="w-full">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Slug</th>
                <th>Color</th>
                <th>Allowance</th>
                <th>Interest</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="kid in kids" :key="kid.slug">
                <td>{{ kid.photoUrl }}</td>
                <td>{{ kid.name }}</td>
                <td>{{ kid.slug }}</td>
                <td>{{ kid.color }}</td>
                <td>{{ kid.allowance }}</td>
                <td>{{ kid.interest }}</td>
                <td>
                  <button @click="startEditingKid(kid.slug)">
                    Edit
                  </button>
                  <button @click="startDeletingKid(kid.id)">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
            <button v-if="kidAction === 'idle'" @click="startEditingKid">
              + Add kid
            </button>
          </table>
          <div>
            <div v-if="kidAction === 'delete'">
              Are you sure?
              <button @click="deleteKid()">
                Delete
              </button>
              <button @click="kidAction = 'idle'">
                Cancel
              </button>
            </div>
            <form v-if="kidAction === 'edit'" id="add-kid" action="" @submit.prevent="saveKid">
              <div>
                <label for="editedKidName">Name</label>
                <input id="editedKidName" v-model="editedKidName" type="text">
              </div>
              <div>
                <label for="editedKidSlug">Slug</label>
                <input id="editedKidSlug" v-model="editedKidSlug" type="text">
              </div>
              <div>
                <label for="editedKidColor">Color</label>
                <input id="editedKidColor" v-model="editedKidColor" type="text">
              </div>
              <div>
                <label for="editedKidPhotoUrl">Photo URL</label>
                <input id="editedKidPhotoUrl" v-model="editedKidPhotoUrl" type="text">
              </div>
              <div>
                <label for="editedKidAllowance">Allowance</label>
                <input id="editedKidAllowance" v-model.number="editedKidAllowance" type="text">
              </div>
              <div>
                <label for="editedKidInterest">Interest</label>
                <input id="editedKidInterest" v-model.number="editedKidInterest" type="text">
              </div>
              <input id="editedKidId" v-model="editedKidId" type="hidden">

              <input type="submit" value="Save">
              <button type="button" @click="kidAction = 'idle'">
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    </NuxtLayout>
  </div>
</template>
