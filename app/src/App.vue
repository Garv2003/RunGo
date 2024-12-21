<template>
  <div class="w-full h-screen flex gap-4 p-4">
    <!-- Code editor or input for commands -->
    <textarea v-model="userInput"
      class="w-full p-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      placeholder="Type a command (e.g., 'Add task', 'List tasks')"></textarea>

    <!-- Output section -->
    <div class="w-full mt-4 p-4 bg-gray-50 border rounded-lg">
      <!-- Run button -->
      <ThemeToggle />
      <h3 class="text-lg font-semibold">Output:</h3>
      <pre class="mt-2 text-sm text-gray-800">{{ output }}</pre>
      <Button @click="handleInput"
        class="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
        Run
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import ThemeToggle from '@/components/custom/ThemeToggle.vue'

let output = "";
let userInput = "";

async function handleInput() {
  try {
    // Send the input command to the Electron backend (IPC)
    const result = await window.electronAPI.runGoCode(userInput);
    output = result; // Display the result in the output area
  } catch (error) {
    console.error("Error executing Go code:", error);
    output = "Error executing Go code";
  }
}

</script>
