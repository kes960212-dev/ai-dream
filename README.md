# ✨ 상상하라! 나의 미래

> **IRUME 프레임워크** 기반 초등학교 6학년 진로 탐색·자기 이해 수업을 위한 웹사이트입니다.
> Firebase로 학생들의 실시간 협업이 가능하고, GitHub Pages로 무료 배포할 수 있습니다.

---

## 📚 수업 구성 (7차시)

| 차시 | IRUME | 주제 | 핵심 활동 |
|---|---|---|---|
| 1차시 | **I** Investigate | 미래 직업을 탐색해요 | 커리어넷 RIASEC 검사 결과 정리 + 라디오 차트 |
| 2차시 | **I** Investigate | 직업의 세계로 | 관심 직업 2개 조사 (이미지 + 학습지) |
| **3차시** | **R** Recognize | **변화하는 직업 세계 탐구** | **사라질·남을·생길 직업 + 생성형 AI 이미지 공유** |
| 4차시 | **R** Recognize | 나의 강점을 발견해요 | 조하리의 창 · 친구 응원 실시간 피드백 |
| 5차시 | **U** Unite | 친구의 꿈을 응원해요 | 관심 보드 (Padlet 스타일 협업) |
| 6차시 | **M** Make | 미래 자화상을 그려요 | HTML5 Canvas 그리기 + 학급 갤러리 |
| 7차시 | **E** Evaluate | 나의 미래를 선언해요 | 미래 선언문 + 학급 공개 |

부가 페이지: **교사 대시보드** (학생별 진행 현황, 통계, JSON 데이터 내보내기)

---

## ✨ 3차시 — 변화하는 직업 세계 탐구

학생들이 미래의 직업 변화를 상상하는 활동입니다. 세 가지 탐구 영역으로 구성됩니다:

- 📉 **앞으로 사라질 것 같은 직업** + 그 이유 (자동화, AI 대체, 기술 변화)
- 🌳 **미래에도 있을 것 같은 직업** + 그 이유 (사람 고유의 영역, 창의성·돌봄·관계)
- 🚀 **미래에 새로 생길 것 같은 직업** + 하는 일 + 왜 필요할지 (학생의 상상력)

각 직업마다 **생성형 AI 이미지**의 URL을 붙여 시각적으로 표현할 수 있습니다.

추천 AI 도구 (모두 무료):
- [Bing Image Creator](https://www.bing.com/images/create) (DALL-E 3)
- [Microsoft Copilot](https://copilot.microsoft.com/) (이미지 생성 기능)
- [Adobe Firefly](https://firefly.adobe.com/)
- AskUp (카카오톡 친구 추가, "그려줘 ~~" 명령)

⚠️ 학교 환경에 따라 학생 접근이 가능한 도구가 다를 수 있습니다.
교사가 한 가지를 선택해 안내하거나, 학생이 만든 이미지를 교사가 받아 호스팅 후 URL 제공하는 방법도 있습니다.
이미지 없이 글만으로도 활동이 가능하게 설계되어 있습니다.

---

## 🚀 빠른 시작 가이드

### STEP 1 — Firebase 프로젝트 만들기

1. https://console.firebase.google.com 접속 → 구글 계정으로 로그인
2. **프로젝트 추가** → 프로젝트 이름 입력 (예: `imagine-future-2026-6-1`)
3. Google Analytics는 **사용 안 함**으로 두어도 됩니다 (수업용)
4. 프로젝트 생성 완료 후 좌측 메뉴에서 **빌드 > Firestore Database** 클릭
5. **데이터베이스 만들기** → 위치는 `asia-northeast3 (서울)` 추천
6. **테스트 모드로 시작** 선택 (나중에 보안 규칙 변경)

### STEP 2 — 웹 앱 등록 & 설정 복사

1. Firebase 콘솔 홈 → 톱니바퀴 ⚙️ → **프로젝트 설정**
2. **내 앱** 섹션에서 `</>` (웹) 아이콘 클릭
3. 앱 닉네임 입력 (예: `상상하라`) → **앱 등록**
4. 화면에 표시되는 **firebaseConfig 객체**를 복사

```javascript
// 예시 (이런 모양으로 나옵니다)
const firebaseConfig = {
  apiKey: "AIzaSyB...",
  authDomain: "imagine-future-xxx.firebaseapp.com",
  projectId: "imagine-future-xxx",
  storageBucket: "imagine-future-xxx.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef..."
};
```

5. 이 사이트의 **`js/firebase-config.js`** 파일 열기 → 상단 `firebaseConfig` 객체에 본인 값으로 교체

### STEP 3 — Firestore 보안 규칙 설정

Firebase 콘솔 → **Firestore Database > 규칙** 탭으로 가서 아래 내용을 붙여넣기:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if true;
    }
    match /lesson1_results/{userId} {
      allow read, write: if true;
    }
    match /lesson2_jobs/{userId} {
      allow read, write: if true;
    }
    match /lesson3_future_jobs/{userId} {
      allow read, write: if true;
    }
    match /lesson3_johari/{userId} {
      allow read, write: if true;
    }
    match /lesson4_interests/{userId} {
      allow read, write: if true;
    }
    match /lesson5_portraits/{userId} {
      allow read, write: if true;
    }
    match /lesson6_declarations/{userId} {
      allow read, write: if true;
    }
  }
}
```

⚠️ 따옴표를 직접 입력해주세요. 다른 곳에서 복사하면 둥근따옴표('')로 자동 변환되어 오류가 날 수 있어요.

⚠️ **위 규칙은 인증 없이 모두 접근 가능합니다.** 수업용으로는 충분하지만,
공개 인터넷에 외부인이 접근할 수 있는 환경이라면 더 엄격한 규칙이 필요합니다.

### STEP 4 — Firestore 복합 색인(Composite Index) 만들기

7차시 미래 선언문은 학급 코드와 공개 여부로 필터링하기 때문에 복합 색인이 필요합니다.

**가장 쉬운 방법**: 사이트를 일단 배포한 뒤 7차시 페이지에 처음 들어가면 브라우저 콘솔(F12)에
이런 오류가 뜹니다:
```
The query requires an index. You can create it here: https://console.firebase.google.com/...
```
**그 링크를 클릭하면 자동으로 색인이 만들어집니다.** 1~2분 후 정상 작동합니다.

수동으로 만들려면 Firestore > 색인 > 복합 색인 만들기:
- 컬렉션: `lesson6_declarations` → 필드: `classCode` (오름차순) + `public` (오름차순)

### STEP 5 — GitHub Pages 배포

1. **GitHub 계정 만들기** (없다면): https://github.com/signup
2. **새 저장소 만들기** (Repository name 예: `imagine-future`)
   - **Public** 선택 (Pages는 무료 플랜에서 Public만 가능)
   - 빈 저장소로 생성
3. 이 폴더 전체를 저장소에 업로드:
   - GitHub 페이지에서 **uploading an existing file** 클릭
   - `index.html`, `lesson1.html`~`lesson7.html`, `teacher.html`, `css/`, `js/` 폴더를 모두 드래그&드롭
   - **Commit changes** 클릭
4. 저장소 → **Settings** → 왼쪽 메뉴 **Pages**
5. **Source** = `Deploy from a branch`
6. **Branch** = `main`, 폴더 = `/ (root)` → **Save**
7. 약 1~2분 후 화면 상단에 `Your site is live at https://계정이름.github.io/imagine-future/` 표시
8. 그 주소를 학생들에게 공유! 🎉

### STEP 6 — 학생들에게 안내

학생들에게 알려줄 것:
- ✅ 사이트 주소
- ✅ **학급 코드** (예: `2026-6-1`) — 학생이 가입할 때 입력해야 같은 반끼리 협업 가능
- ✅ 사용 순서: 1차시 → 2차시 → ... → 7차시
- ✅ 3차시에서 사용할 AI 이미지 도구 (학교 환경에 맞게)

기본 학급 코드를 미리 설정해두려면 `js/firebase-config.js`의 `DEFAULT_CLASS_CODE` 값을 채워두세요:
```javascript
const DEFAULT_CLASS_CODE = "2026-6-1";
```

---

## 🗂 파일 구조

```
imagine-future/
├── index.html            메인 페이지
├── lesson1.html ~ lesson7.html   7개 차시 페이지
├── teacher.html          교사 대시보드
├── css/
│   └── style.css         디자인 시스템
├── js/
│   ├── firebase-config.js  ⚠️ 여기에 본인 Firebase 설정 입력
│   └── auth.js             학생 식별, 토스트, 공통 유틸
├── README.md             이 문서
└── .gitignore
```

---

## 🔥 Firestore 데이터 구조

| 컬렉션 | 차시 | 문서 ID | 주요 필드 |
|---|---|---|---|
| `users` | — | `{학년-반-번호-이름}` | name, grade, classNum, number, classCode |
| `lesson1_results` | 1차시 | `userId` | scores{R,I,A,S,E,C}, top1, top2, typeDescription, interestedJobs |
| `lesson2_jobs` | 2차시 | `userId` | job1_name, job1_image, job1_work, job1_aptitude, job1_howto, job1_newfacts, job2_* |
| `lesson3_future_jobs` | **3차시** | `userId` | disappearing[], remaining[], emerging[], likes[], comments[] |
| `lesson3_johari` | 4차시 | `userId` | known[], hidden[], unknown[], symbolImage, feedbacks[] |
| `lesson4_interests` | 5차시 | `userId` | recentInterest, artwork, caption, likes[], comments[] |
| `lesson5_portraits` | 6차시 | `userId` | imageData, caption |
| `lesson6_declarations` | 7차시 | `userId` | discovered, friendsView, futureMessage, firstStep, public |

> 💡 컬렉션 이름은 초기 설계 때의 번호를 유지합니다. 차시는 위 표를 참고하세요.

---

## 🧪 기능 점검 (수업 전 체크리스트)

배포 후 한 번 점검해보세요:

- [ ] 사이트가 열린다 (`https://계정이름.github.io/imagine-future/`)
- [ ] 첫 진입 시 학년/반/번호/이름/학급코드 입력 모달이 뜬다
- [ ] 1차시: 점수 입력 → 차트 → 저장 → 토스트 메시지 확인
- [ ] **3차시: 사라질·남을·생길 직업 카드 추가 → 저장 → 친구들 보드에서 확인**
- [ ] **3차시: AI 이미지 URL 붙여넣기 시 이미지 미리보기 정상 표시**
- [ ] 7차시 페이지 진입 시 콘솔(F12)에 색인 만들기 링크가 보이면 클릭 → 색인 생성
- [ ] Firebase 콘솔 > Firestore에서 각 컬렉션에 데이터가 들어가는지 확인
- [ ] 다른 브라우저(시크릿)에서 다른 학생으로 가입 → 5차시·3차시 보드 실시간 동기화 확인

---

## 🛠 자주 묻는 질문

**Q. "Permission denied" 오류가 나요.**
A. Firebase 콘솔 > Firestore Database > **규칙** 탭에서 STEP 3의 규칙으로 변경 후 **게시** 클릭.

**Q. 3차시 보드가 비어있어요.**
A. 브라우저 콘솔(F12)에서 오류 확인. Firestore 보안 규칙에 `lesson3_future_jobs` 항목이 빠져있을 수 있어요.

**Q. AI 이미지가 깨져서 나와요.**
A. URL이 일시적인 링크일 수 있어요. 이미지를 자기 클라우드(Google Drive, 학교 LMS 등)에 업로드해 영구 링크를 사용하세요. 또는 비워두고 글로만 표현해도 좋습니다.

**Q. 학급코드가 다르면 어떻게 되나요?**
A. 본인 데이터는 저장되지만, 3차시·5차시·6차시·7차시 등 **협업·공유 기능**은 같은 학급 코드끼리만 보입니다.

**Q. 학생이 이름을 잘못 입력했어요.**
A. 메인 페이지 우측 상단의 **로그아웃** 클릭 → 다시 입력. (다만 새 userId로 분리됩니다.)

**Q. Firebase 무료 플랜으로 충분한가요?**
A. 충분합니다. Spark(무료) 플랜 한 반(30명) 7차시 활동에 한참 남습니다.

---

## 📜 라이선스 & 출처

- 수업 설계: IRUME 프레임워크 (Investigate · Recognize · Unite · Make · Evaluate)
- RIASEC 검사 (1차시): 커리어넷 진로흥미탐색 검사 결과 활용
- 문학 작품 (7차시): 로버트 프로스트 〈가지 않은 길〉 (Public Domain)
- 폰트: Google Fonts (Black Han Sans, Gowun Dodum, Gowun Batang)
- 외부 라이브러리: Chart.js 4.4.1 (MIT), Firebase 10.12.2 SDK

본 코드는 교육 목적의 자유로운 수정 및 배포가 가능합니다.

---

🌟 _오늘의 선언이 내일의 한 걸음이 되기를._
