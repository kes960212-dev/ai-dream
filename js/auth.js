// =====================================================
// auth.js - 학생 식별 (간단 로그인)
// =====================================================
import {
  db, doc, setDoc, getDoc, serverTimestamp, DEFAULT_CLASS_CODE
} from './firebase-config.js';

const STORAGE_KEY = 'iruume_user';

// 고유 사용자 ID 생성 (반-번호-이름 조합)
function makeUserId(grade, classNum, number, name) {
  return `${grade}-${classNum}-${number}-${name}`.replace(/\s+/g, '');
}

// 학생 정보 가져오기
export function getUser() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

// 로그아웃
export function logout() {
  localStorage.removeItem(STORAGE_KEY);
  location.href = 'index.html';
}

// 학생 정보 저장
export async function saveUser(grade, classNum, number, name, classCode) {
  const userId = makeUserId(grade, classNum, number, name);
  const user = {
    userId,
    grade: String(grade),
    classNum: String(classNum),
    number: String(number),
    name: name.trim(),
    classCode: (classCode || DEFAULT_CLASS_CODE || `${grade}-${classNum}`).trim(),
    createdAt: Date.now()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));

  // Firestore에도 등록
  try {
    await setDoc(doc(db, 'users', userId), {
      ...user,
      createdAt: serverTimestamp()
    }, { merge: true });
  } catch (e) {
    console.warn('Firestore user save failed (정상 작동에는 영향 없음):', e);
  }
  return user;
}

// 현재 페이지에 로그인 가드 적용
// 로그인 안 되어 있으면 모달 표시
export function requireAuth(onLoggedIn) {
  const user = getUser();
  if (user) {
    onLoggedIn(user);
    renderNavUser(user);
  } else {
    showLoginModal(onLoggedIn);
  }
}

// 네비게이션 상단에 사용자 정보 표시
function renderNavUser(user) {
  const userBadge = document.getElementById('nav-user');
  if (userBadge) {
    userBadge.innerHTML = `${user.grade}학년 ${user.classNum}반 ${user.number}번 <strong>${escapeHtml(user.name)}</strong> <a href="#" id="logout-link" style="margin-left:8px;font-size:0.8rem;">로그아웃</a>`;
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) logoutLink.addEventListener('click', (e) => { e.preventDefault(); logout(); });
  }
}

// 로그인 모달
function showLoginModal(onLoggedIn) {
  // 기존 모달이 있으면 제거
  const existing = document.getElementById('login-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'login-modal';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal">
      <h2>👋 환영합니다!</h2>
      <p class="modal-desc">'상상하라! 나의 미래' 수업에 참여하기 전에 나를 소개해주세요.</p>
      <form id="login-form">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">학년</label>
            <input type="number" name="grade" class="form-input" min="1" max="6" value="6" required>
          </div>
          <div class="form-group">
            <label class="form-label">반</label>
            <input type="number" name="classNum" class="form-input" min="1" max="20" required>
          </div>
          <div class="form-group">
            <label class="form-label">번호</label>
            <input type="number" name="number" class="form-input" min="1" max="40" required>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">이름</label>
          <input type="text" name="name" class="form-input" placeholder="예: 홍길동" required>
        </div>
        <div class="form-group">
          <label class="form-label">학급 코드 <span style="font-weight:400;font-size:0.85em;color:var(--ink-muted);">(선생님이 알려준 코드)</span></label>
          <input type="text" name="classCode" class="form-input" placeholder="예: 2026-6-1" value="${DEFAULT_CLASS_CODE || ''}">
          <p style="font-size:0.8rem;color:var(--ink-muted);margin-top:6px;">같은 학급 코드를 입력한 친구들과 보드를 공유해요.</p>
        </div>
        <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center;">시작하기 ✨</button>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  const form = modal.querySelector('#login-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const grade = fd.get('grade');
    const classNum = fd.get('classNum');
    const number = fd.get('number');
    const name = fd.get('name');
    const classCode = fd.get('classCode');
    if (!name.trim()) return;
    const user = await saveUser(grade, classNum, number, name, classCode);
    modal.remove();
    renderNavUser(user);
    onLoggedIn(user);
  });
}

// HTML escape (보안용)
export function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Toast 메시지
export function toast(message, duration = 2500) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = message;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

// 시간 표시 헬퍼 (몇 분 전, 몇 시간 전)
export function timeAgo(timestamp) {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return '방금 전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

// 네비게이션 활성화
export function highlightNav(currentPage) {
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.dataset.page === currentPage) a.classList.add('active');
  });
}
