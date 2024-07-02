# 프론트엔드+백엔드 구성 예시

* 백엔드 빌드 스크립트로 프론트엔드 빌드 연동
  * 백엔드 build.gradle > yarnBuild 태스크 확인
  * 프론트엔드 package.json > yarn build 명령 확인
    * post-build.js 를 통해 build 결과물을 백엔드 static resource로 복사

* 프론트엔드 라우터 동작에 대해 새로고침 시 백엔드의 url 처리 간섭
  * 백엔드 WebConfig.java 구성을 통해 백엔드 api 요청 외 내용은 프론트엔드로 전달됨
    * 요청된 리소스가 존재하지 않을 경우 /index.html 로 반환하여 프론트엔드 라우터 동작되는 구조

* [클라우드타입](https://cloudtype.io/) 연동을 위한 github action 구성
  * 현재 작업 중
