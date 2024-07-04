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

## heroicons

* Heroicons 는 Tailwind CSS를 개발한 Tailwin labs에서 제공하는 아이콘 패키지입니다.
* [홈페이지](https://heroicons.com/)
* [패키지 살펴보기](https://unpkg.com/browse/@heroicons/vue@2.1.4/)

### 사용 예시

```html
<template>
  <div>
    <BeakerIcon class="h-6 w-6 text-blue-500" />
    <UserIcon class="h-6 w-6 text-green-500" />
  </div>
</template>

<script setup>
import { BeakerIcon, UserIcon } from '@heroicons/vue/24/solid'
</script>
```

### 사용 방법

* @heroicons/vue/크기/유형
  * `Solid` @heroicons/vue/24/solid
  * `Outline` @heroicons/vue/24/outline
  * `Mini` @heroicons/vue/20/solid
