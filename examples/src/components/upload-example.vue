<template>
  <a-card title="Upload 组件">
    <tt-upload
      :headers="{
        Authorization:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoi566h55CG5ZGYIiwidXNlcklkIjoiMTk0NTMyMjQ0NjE4MjEwNTA5MSIsInVzZXJuYW1lIjoiYWRtaW4iLCJleHAiOjE3NTM0MjMzNDl9.X0U28njx1Q3jvi1cCqm535FpHpUs8Su9NaJTlNKcRN8',
      }"
      url="/api/api/file/upload"
    />
  </a-card>
</template>
<script setup></script>
