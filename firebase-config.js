// =====================================================
// Firebase 설정
// -----------------------------------------------------
// 아래 firebaseConfig를 본인의 Firebase 프로젝트 설정으로
// 교체해야 합니다. (README.md 참고)
// =====================================================

const firebaseConfig = {
  apiKey: "AIzaSyDGyttH5qsKnh4cRNIdgcjYGqgypnVt2vQ",
  authDomain: "ai-dream-69a9a.firebaseapp.com",
  databaseURL: "https://ai-dream-69a9a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ai-dream-69a9a",
  storageBucket: "ai-dream-69a9a.firebasestorage.app",
  messagingSenderId: "10542690995",
  appId: "1:10542690995:web:32209cb5d576c65e28f6c6"
};

// 학급 코드 (선생님이 사전에 정하여 학생들에게 공유)
// 예: "2026-6-1" → 2026년 6학년 1반
// 같은 학급 코드를 입력한 학생끼리만 보드를 공유합니다.
// 학생들에게 안내할 코드를 여기에 적어둘 수도 있습니다 (선택)
const DEFAULT_CLASS_CODE = ""; // 비워두면 학생이 직접 입력

// Firebase SDK (모듈 방식, CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore, collection, doc, setDoc, getDoc, getDocs,
  addDoc, deleteDoc, updateDoc, query, where, orderBy,
  onSnapshot, serverTimestamp, arrayUnion, arrayRemove, limit
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {
  app, db, DEFAULT_CLASS_CODE,
  collection, doc, setDoc, getDoc, getDocs,
  addDoc, deleteDoc, updateDoc, query, where, orderBy,
  onSnapshot, serverTimestamp, arrayUnion, arrayRemove, limit
};
