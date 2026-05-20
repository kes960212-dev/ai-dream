# ✨ 상상하라! 나의 미래

> **IRUME 프레임워크** 기반 초등학교 6학년 진로 탐색·자기 이해 수업을 위한 웹사이트입니다.
> Firebase로 학생들의 실시간 협업이 가능하고, GitHub Pages로 무료 배포할 수 있습니다.

---

## 📚 수업 구성 (6차시)

| 차시 | IRUME | 주제 | 핵심 활동 |
|---|---|---|---|
| 1차시 | **I** Investigate | 미래 직업을 탐색해요 | RIASEC 진로흥미검사 (30문항·라디오차트) |
| 2차시 | **I** Investigate | 직업의 세계로 | 관심 직업 2개 조사 학습지 |
| 3차시 | **R** Recognize | 나의 강점을 발견해요 | 조하리의 창 · 친구 응원 실시간 피드백 |
| 4차시 | **U** Unite | 친구의 꿈을 응원해요 | 관심 보드 (Padlet 스타일 협업) |
| 5차시 | **M** Make | 미래 자화상을 그려요 | HTML5 Canvas 그리기 + 학급 갤러리 |
| 6차시 | **E** Evaluate | 나의 미래를 선언해요 | 미래 선언문 작성 + 학급 공개 |

부가 페이지: **교사 대시보드** (학생별 진행 현황, 통계, JSON 데이터 내보내기)

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
    // 모든 컬렉션 — 같은 학급(classCode)끼리 읽기/쓰기 허용
    match /users/{userId} {
      allow read, write: if true;
    }
    match /lesson1_results/{userId} { allow read, write: if true; }
    match /lesson2_jobs/{userId} { allow read, write: if true; }
    match /lesson3_johari/{userId} { allow read, write: if true; }
    match /lesson4_interests/{postId} { allow read, write: if true; }
    match /lesson5_portraits/{userId} { allow read, write: if true; }
    match /lesson6_declarations/{userId} { allow read, write: if true; }
  }
}
```

⚠️ **위 규칙은 인증 없이 모두 접근 가능합니다.** 수업용으로는 충분하지만,
공개 인터넷에 외부인이 접근할 수 있는 환경이라면 더 엄격한 규칙이 필요합니다.
(보안 강화 옵션은 아래 [보안 강화](#-보안-강화-선택-사항) 섹션 참고)

### STEP 4 — Firestore 복합 색인(Composite Index) 만들기

4차시·6차시는 학급 코드와 시간/공개 여부로 정렬·필터링하기 때문에 복합 색인이 필요합니다.

**가장 쉬운 방법**: 사이트를 일단 배포한 뒤 4차시 페이지에 처음 들어가면 브라우저 콘솔(F12)에
이런 오류가 뜹니다:
```
The query requires an index. You can create it here: https://console.firebase.google.com/...
```
**그 링크를 클릭하면 자동으로 색인이 만들어집니다.** 1~2분 후 정상 작동합니다.

수동으로 만들려면 Firestore > 색인 > 복합 색인 만들기:
- 컬렉션: `lesson4_interests` → 필드: `classCode` (오름차순) + `createdAt` (내림차순)
- 컬렉션: `lesson6_declarations` → 필드: `classCode` (오름차순) + `public` (오름차순)

### STEP 5 — GitHub Pages 배포

1. **GitHub 계정 만들기** (없다면): https://github.com/signup
2. **새 저장소 만들기** (Repository name 예: `imagine-future`)
   - **Public** 선택 (Pages는 무료 플랜에서 Public만 가능)
   - 빈 저장소로 생성
3. 이 폴더 전체를 저장소에 업로드:
   - GitHub 페이지에서 **uploading an existing file** 클릭
   - `index.html`, `lesson1.html`~`lesson6.html`, `teacher.html`, `css/`, `js/` 폴더를 모두 드래그&드롭
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
- ✅ 사용 순서: 1차시 → 2차시 → ... → 6차시

기본 학급 코드를 미리 설정해두려면 `js/firebase-config.js`의 `DEFAULT_CLASS_CODE` 값을 채워두세요:
```javascript
const DEFAULT_CLASS_CODE = "2026-6-1";
```

---

## 🗂 파일 구조

```
imagine-future/
├── index.html            메인 페이지
├── lesson1.html ~ lesson6.html   6개 차시 페이지
├── teacher.html          교사 대시보드
├── css/
│   └── style.css         디자인 시스템 (CSS variables, 컬러, 폰트)
├── js/
│   ├── firebase-config.js  ⚠️ 여기에 본인 Firebase 설정 입력
│   └── auth.js             학생 식별, 토스트, 공통 유틸
├── README.md             이 문서
└── .gitignore
```

---

## 🔥 Firebase 데이터 구조

| 컬렉션 | 문서 ID | 주요 필드 |
|---|---|---|
| `users` | `{학년-반-번호-이름}` | name, grade, classNum, number, classCode |
| `lesson1_results` | `userId` | scores{R,I,A,S,E,C}, top1, top2, selectedJobs |
| `lesson2_jobs` | `userId` | job1_name, job1_work, ..., job2_*, compare_* |
| `lesson3_johari` | `userId` | known[], hidden[], unknown[], symbol, feedbacks[] |
| `lesson4_interests` | `자동생성` | userId, title, description, imageUrl, likes[], comments[] |
| `lesson5_portraits` | `userId` | imageData (base64 JPEG ~50KB), caption |
| `lesson6_declarations` | `userId` | discovered, friendsView, futureMessage, firstStep, public |

---

## 🔒 보안 강화 (선택 사항)

기본 규칙은 누구나 데이터를 읽고 쓸 수 있어요. 보안을 강화하려면:

**옵션 A — IP 화이트리스트 없이 학교 내부에서만 사용**
- Firebase 콘솔의 일일 사용량을 모니터링 (Spark 무료 플랜은 충분합니다)
- 사이트 주소를 학교 안에서만 공유

**옵션 B — Firebase Anonymous Authentication 적용**
- Firebase Authentication > Sign-in method > 익명 사용 설정
- `js/firebase-config.js`와 `js/auth.js`에 `signInAnonymously` 추가
- 보안 규칙을 `if request.auth != null`로 변경
- (코드 수정이 필요해 기본 버전에서는 적용하지 않았습니다)

**옵션 C — 학급 코드를 어렵게 설정**
- `2026-6-1` 같은 추측 가능한 코드 대신 `myunghyun-jinro-2026` 같은 코드 사용

---

## 🧪 기능 점검 (수업 전 체크리스트)

배포 후 한 번 점검해보세요:

- [ ] 사이트가 열린다 (`https://계정이름.github.io/imagine-future/`)
- [ ] 첫 진입 시 학년/반/번호/이름/학급코드 입력 모달이 뜬다
- [ ] 입력 후 메인 페이지가 정상적으로 보인다
- [ ] 1차시: 30문항 검사 → 결과 차트 → 저장 클릭 → 토스트 메시지 확인
- [ ] Firebase 콘솔 > Firestore 들어가서 `lesson1_results`에 본인 데이터가 생긴 것 확인
- [ ] 4차시: 게시물 올리기 → Firestore에 들어가는지 확인
- [ ] 4차시에서 콘솔(F12)에 색인 만들기 링크가 보이면 클릭 → 색인 생성
- [ ] (선택) 다른 브라우저(시크릿)에서 다른 학생으로 가입 후 4차시 보드에서 실시간 동기화 확인

---

## 🛠 자주 묻는 질문

**Q. "Permission denied" 오류가 나요.**
A. Firebase 콘솔 > Firestore Database > **규칙** 탭에서 위 STEP 3의 규칙으로 변경 후 **게시** 버튼 클릭.

**Q. 4차시 보드가 비어있어요.**
A. 브라우저 콘솔(F12)을 열고 빨간 오류 메시지를 확인하세요. `requires an index`라는 메시지가 보이면 그 안의 링크를 클릭해 색인을 만들면 됩니다.

**Q. 학급코드가 다르면 어떻게 되나요?**
A. 학급 코드가 달라도 본인 데이터는 저장되지만, 4차시 관심 보드·5차시 갤러리·6차시 공개 선언문 등 **협업 기능**은 같은 학급 코드끼리만 보입니다.

**Q. 자화상 그림이 저장이 안 돼요.**
A. JPEG 압축 후 약 900KB가 넘으면 저장이 거부됩니다. 그림을 더 단순하게 그리거나 한 색으로 채운 면적을 줄여보세요.

**Q. 학생 이름을 잘못 입력했어요.**
A. 메인 페이지 우측 상단의 **로그아웃** 클릭 → 다시 입력하면 됩니다. (다만 새 userId로 새 데이터가 생기므로 이전 활동 결과는 분리됩니다.)

**Q. 다음 학년에 다시 사용할 수 있나요?**
A. 가능합니다! Firebase 콘솔에서 데이터를 삭제하거나 학급 코드를 새 학년 코드(`2027-6-1` 등)로 바꾸면 됩니다.

**Q. Firebase 무료 플랜으로 충분한가요?**
A. 충분합니다. Spark(무료) 플랜의 일일 한도:
  - 읽기 50,000회, 쓰기 20,000회, 저장 1GB
  - 한 반(30명)이 6차시 활동을 모두 해도 한참 남습니다.

---

## 📜 라이선스 & 출처

- 수업 설계: IRUME 프레임워크 기반 (Investigate · Recognize · Unite · Make · Evaluate)
- RIASEC 검사 문항: 일반적인 직업흥미 분류 체계를 6학년 수준으로 각색
- 문학 작품 인용: 로버트 프로스트 〈가지 않은 길〉 (Public Domain)
- 폰트: Google Fonts (Black Han Sans, Gowun Dodum, Gowun Batang)
- 외부 라이브러리: Chart.js 4.4.1 (MIT), Firebase 10.12.2 SDK

본 코드는 교육 목적의 자유로운 수정 및 배포가 가능합니다.

---

🌟 _오늘의 선언이 내일의 한 걸음이 되기를._
