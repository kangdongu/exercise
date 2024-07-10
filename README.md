# Habit

Habit은 운동 습관을 형성해주는 앱입니다.

이 앱은 체력, 근력, 체지방과 같은 외적인 부분뿐만 아니라, 사용자가 계획한 운동을 실천함으로써 무기력함을 극복하고 자기 신뢰, 성공 습관, 자존감을 향상시키며 많은 사람들의 삶에 긍정적인 영향을 주기 위해 만들어졌습니다.

배포 주소: [Habit 앱](https://kangdongu.github.io/exercise/#/)

## Habit 소개

Habit은 운동 습관을 길러주기 위한 앱으로, 사용자가 건강한 생활을 유지하고 목표를 달성할 수 있도록 돕습니다. 다양한 동기부여 요소와 사용자 친화적인 인터페이스를 제공하여 운동 기록과 추적 과정을 간편하게 만듭니다.

### 주요 기능

- **로그인**: Firebase Authentication을 사용한 간편한 로그인 및 회원가입 기능 (Facebook, Kakao, Naver 추가 예정)
- **개인 및 그룹 챌린지**: 사용자들이 자신의 운동 목표를 설정하고 도전할 수 있도록 지원합니다. 개인 챌린지에서는 개인 목표를 설정하고 진행 상황을 추적하며, 그룹 챌린지에서는 친구나 다른 사용자들과 함께 목표를 달성하기 위해 협력할 수 있습니다.
- **운동 기록**: 사용자가 매일의 운동 내용을 기록하고, 이를 통해 자신의 진행 상황을 확인할 수 있습니다. 기록된 데이터는 그래프와 달력으로 시각화되어 제공됩니다.
- **뱃지 및 도전과제**: 운동 목표를 달성하면 다양한 뱃지와 도전과제를 통해 보상을 제공합니다. 이는 사용자의 동기부여를 높이는 데 도움을 줍니다. (다양한 뱃지와 도전과제 및 뱃지 달성 시 축하 모달 추가 예정)
- **타이머 기능**: 운동 시간을 측정할 수 있는 타이머 기능을 제공하여 사용자가 효율적으로 운동할 수 있도록 돕습니다.
- **소셜 기능**: 다른 사용자들과 소통하고, 서로의 운동 기록을 공유하며 응원할 수 있습니다. 이는 운동을 지속할 수 있는 동기부여를 제공합니다.

### 장점

1. **동기부여 강화**: 다양한 뱃지와 도전과제를 통해 사용자가 지속적으로 운동할 수 있도록 동기부여를 제공합니다.
2. **사용자 친화적인 인터페이스**: 간편하고 직관적인 인터페이스를 통해 누구나 쉽게 사용할 수 있습니다.
3. **데이터 시각화**: 운동 기록을 그래프와 달력으로 시각화하여 사용자가 자신의 진행 상황을 한눈에 파악할 수 있습니다.
4. **커뮤니티 지원**: 그룹 챌린지와 소셜 기능을 통해 사용자들 간의 응원과 협력이 가능합니다.
5. **개인 맞춤형 기능**: 사용자의 운동 습관과 목표에 맞춘 개인 맞춤형 기능을 제공합니다.

### 목표

Habit의 궁극적인 목표는 사용자가 지속적으로 운동을 하여 건강한 생활을 유지하고, 자존감을 높이며, 성공적인 습관을 형성하도록 돕는 것입니다. 이를 통해 사용자들이 더 나은 삶을 살 수 있도록 지원합니다.

현재 개발자 모드 Samsung Galaxy S20 Ultra에 최적화되어 있습니다.

## 프로젝트 기여자 및 역할

이 프로젝트는 개인 프로젝트로, 모든 부분을 혼자서 맡아 개발하고 있습니다.

## 구현한 기능에 대한 자세한 설명

### 로그인
Firebase Authentication을 사용하여 사용자 인증을 처리합니다. 현재 이메일과 비밀번호를 통한 로그인과 회원가입이 가능하며, Facebook, Kakao, Naver 로그인을 추가할 예정입니다.

### 개인 및 그룹 챌린지
- **개인 챌린지**: 사용자가 자신의 운동 목표를 설정하고, 이를 달성하기 위해 진행 상황을 추적할 수 있습니다.
- **그룹 챌린지**: 친구나 다른 사용자들과 함께 목표를 설정하고, 협력하여 목표를 달성할 수 있습니다.

### 운동 기록
사용자가 매일의 운동 내용을 기록할 수 있습니다. 기록된 데이터는 그래프와 달력으로 시각화되어 제공되며, 이를 통해 자신의 진행 상황을 한눈에 파악할 수 있습니다.

### 뱃지 및 도전과제
운동 목표를 달성하면 다양한 뱃지와 도전과제를 통해 보상을 제공합니다. 이는 사용자의 동기부여를 높이는 데 도움을 줍니다.

### 타이머 기능
운동 시간을 측정할 수 있는 타이머 기능을 제공하여 사용자가 효율적으로 운동할 수 있도록 돕습니다.

### 소셜 기능
다른 사용자들과 소통하고, 서로의 운동 기록을 공유하며 응원할 수 있습니다. 이는 운동을 지속할 수 있는 동기부여를 제공합니다.

## 기술 스택 및 사용된 도구

### 주요 기술

- **React**: 사용자 인터페이스를 구축하기 위해 사용된 라이브러리입니다. React의 컴포넌트 기반 아키텍처를 통해 재사용 가능한 UI 컴포넌트를 작성하였습니다.
- **TypeScript**: 정적 타입을 지원하는 자바스크립트의 상위 집합 언어로, 코드의 안정성과 유지보수성을 높였습니다.
- **Vite**: 빠르고 효율적인 개발 환경을 제공하는 빌드 도구로, 개발 속도를 크게 향상시켰습니다.
- **Firebase**: Firebase Authentication을 통한 인증, Firestore를 이용한 데이터베이스 관리, Storage를 이용한 사진 업로드 등 다양한 기능을 활용하였습니다.

### 사용된 라이브러리

- **styled-components**: CSS-in-JS 라이브러리로, 컴포넌트별로 스타일을 관리하여 코드의 유지보수성을 높였습니다.
- **chart.js**: 데이터를 시각화하기 위한 차트 라이브러리로, 사용자의 운동 기록을 직관적으로 볼 수 있도록 다양한 차트를 구현하였습니다.
- **fullcalendar**: 달력 라이브러리로, 사용자의 운동 일정을 관리할 수 있도록 도와주었습니다.
- **date-fns**: 날짜와 시간 처리를 위한 유틸리티 라이브러리로, 다양한 날짜 형식 변환 및 조작을 쉽게 처리하였습니다.
- **framer-motion**: 애니메이션 라이브러리로, 사용자 인터페이스에 애니메이션 효과를 추가하여 사용자 경험을 향상시켰습니다.
- **react-icons**: 다양한 아이콘을 제공하는 라이브러리로, 앱의 UI를 더욱 풍부하고 직관적으로 만들었습니다.
- **react-datepicker**: 날짜 선택 컴포넌트 라이브러리로, 사용자가 운동 기록을 손쉽게 입력할 수 있도록 지원하였습니다.

## 향후 계획

- **반응형 디자인**: 다양한 기기에서 최적의 사용자 경험을 제공하기 위해 반응형 디자인을 추가할 예정입니다.
- **운동 정보 추가**: 다양한 운동 리스트와 정보를 추가하여 사용자가 더 많은 운동을 기록할 수 있도록 할 예정입니다.
- **뱃지 및 도전과제 확장**: 더 다양한 뱃지와 도전과제를 추가하고, 뱃지 달성 시 축하 모달을 추가할 예정입니다.
- **소셜 기능 강화**: 친구 초대, 댓글 및 좋아요 기능 등을 추가하여 사용자 간의 상호작용을 강화할 예정입니다.

배포 주소: [Habit 앱](https://kangdongu.github.io/exercise/#/)

## 스크린샷

로그인, 닉네임설정, 성별선택

![1](https://github.com/kangdongu/exercise/assets/162076741/e73be311-a56a-4566-8308-9d51fbabc3c2)


홈화면, 개인챌린지

![2-2](https://github.com/kangdongu/exercise/assets/162076741/984969ae-af57-45d4-96f5-8ffbbf6a0052)


그룹챌린지리스트 및 그룹생성

![3-1](https://github.com/kangdongu/exercise/assets/162076741/380e8417-214a-44e3-bba6-3a9af092a83c)


그룹챌린지 방

![3-2](https://github.com/kangdongu/exercise/assets/162076741/5c2992ef-4f42-4767-a40e-295634f87c9c)

타이머, 뱃지, 도전과제

![4](https://github.com/kangdongu/exercise/assets/162076741/814d159f-4177-4f8a-80a9-4401555417d2)


기록

![5](https://github.com/kangdongu/exercise/assets/162076741/f2d6607e-0a03-4785-bf7b-11e9adc060b5)


소셜, 프로필

![10](https://github.com/kangdongu/exercise/assets/162076741/fe488bf0-a954-4095-b65f-4c54540c91e0)

+추가할것

반응형 및 전체적인 디자인 수정보완 및 운동정보, 도전과제 뱃지, 프로필 부분에 캐릭터 등 추가 예정<br /> 현재 완성도(70%)
