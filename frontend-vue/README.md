## `<component>` 태그

```html
<template>
  <div>
    <component :is="currentComponent"></component>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ComponentA from './ComponentA.vue'
import ComponentB from './ComponentB.vue'

const currentComponent = ref(ComponentA)
</script>
```

* `<component>` 태그는 조건에 따라 다른 컴포넌트를 동적으로 렌더링할 수 있습니다.
* `:is` 속성을 통해 다음과 같은 값을 전달할 수 있습니다:
  * 등록된 컴포넌트의 이름 (문자열)
  * 가져온 컴포넌트 객체
  * HTML 요소의 이름 (예: 'div', 'span')
