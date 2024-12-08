<template>
  <div class="editor">
    <textarea v-model="code" placeholder="Write Go code here..." />
    <button @click="runCode">Run</button>
    <div class="output">
      <h3>Output:</h3>
      <pre>{{ output }}</pre>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      code: `package main\nimport "fmt"\nfunc main() {\n    fmt.Println("Hello, Go!")\n}`,
      output: "",
    };
  },
  methods: {
    async runCode() {
      const result = await window.electronAPI.runGoCode(this.code);
      this.output = result;
    },
  },
};
</script>

<style>
.editor {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
textarea {
  width: 100%;
  height: 200px;
}
</style>
