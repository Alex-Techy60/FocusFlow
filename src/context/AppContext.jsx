import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AppContext = createContext(null);

const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

const todayKey = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

function AppProvider({ children }) {
  // ── Master task library (all tasks ever created) ──────────────────────────
  const [masterTasks, setMasterTasks] = useState(() =>
    loadFromStorage("ff_masterTasks", [])
  );

  // ── Daily plans: { [dateKey]: taskId[] } ──────────────────────────────────
  const [dailyPlans, setDailyPlans] = useState(() =>
    loadFromStorage("ff_dailyPlans", {})
  );

  // ── Daily snapshots: { [dateKey]: { [taskId]: completed } } ───────────────
  const [dailyProgress, setDailyProgress] = useState(() =>
    loadFromStorage("ff_dailyProgress", {})
  );

  // ── Sessions: [{ id, label, timeSlots: [{start,end}] }] ───────────────────
  const [sessions, setSessions] = useState(() =>
    loadFromStorage("ff_sessions", [])
  );

  // ── Profile ───────────────────────────────────────────────────────────────
  const [profile, setProfile] = useState(() =>
    loadFromStorage("ff_profile", {
      name: "",
      age: "",
      profession: "",
      email: "",
      bio: "",
      avatar: "",
    })
  );

  // ── Current navigation page ───────────────────────────────────────────────
  const [activePage, setActivePage] = useState("Dashboard");

  // ── Sidebar collapsed state ────────────────────────────────────────────────
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ── History date viewer ────────────────────────────────────────────────────
  const [historyDate, setHistoryDate] = useState(todayKey());

  // persist to localStorage
  useEffect(() => { saveToStorage("ff_masterTasks", masterTasks); }, [masterTasks]);
  useEffect(() => { saveToStorage("ff_dailyPlans", dailyPlans); }, [dailyPlans]);
  useEffect(() => { saveToStorage("ff_dailyProgress", dailyProgress); }, [dailyProgress]);
  useEffect(() => { saveToStorage("ff_sessions", sessions); }, [sessions]);
  useEffect(() => { saveToStorage("ff_profile", profile); }, [profile]);

  // ── Master task CRUD ───────────────────────────────────────────────────────
  const addMasterTask = useCallback((task) => {
    const id = crypto.randomUUID();
    setMasterTasks((prev) => [{ id, ...task, createdAt: todayKey() }, ...prev]);
    return id;
  }, []);

  const updateMasterTask = useCallback((id, updates) => {
    setMasterTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  }, []);

  const deleteMasterTask = useCallback((id) => {
    setMasterTasks((prev) => prev.filter((t) => t.id !== id));
    // Remove from all daily plans
    setDailyPlans((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((date) => {
        updated[date] = updated[date].filter((tid) => tid !== id);
      });
      return updated;
    });
    // Remove from daily progress snapshots
    setDailyProgress((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((date) => {
        if (updated[date] && id in updated[date]) {
          const { [id]: _, ...rest } = updated[date];
          updated[date] = rest;
        }
      });
      return updated;
    });
  }, []);

  // ── Daily plan management ──────────────────────────────────────────────────
  const addTaskToDay = useCallback((taskId, dateKey = todayKey()) => {
    setDailyPlans((prev) => {
      const existing = prev[dateKey] || [];
      if (existing.includes(taskId)) return prev;
      return { ...prev, [dateKey]: [...existing, taskId] };
    });
    // init progress entry
    setDailyProgress((prev) => {
      const dayProg = prev[dateKey] || {};
      if (dayProg[taskId] !== undefined) return prev;
      return { ...prev, [dateKey]: { ...dayProg, [taskId]: false } };
    });
  }, []);

  const removeTaskFromDay = useCallback((taskId, dateKey = todayKey()) => {
    setDailyPlans((prev) => ({
      ...prev,
      [dateKey]: (prev[dateKey] || []).filter((id) => id !== taskId),
    }));
  }, []);

  const addNewTaskToDay = useCallback((task, dateKey = todayKey()) => {
    const id = crypto.randomUUID();
    const newTask = { id, ...task, createdAt: dateKey };
    setMasterTasks((prev) => [newTask, ...prev]);
    setDailyPlans((prev) => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), id],
    }));
    setDailyProgress((prev) => ({
      ...prev,
      [dateKey]: { ...(prev[dateKey] || {}), [id]: false },
    }));
    return id;
  }, []);

  // ── Task completion toggle for a specific day ──────────────────────────────
  const toggleTaskForDay = useCallback((taskId, dateKey = todayKey()) => {
    setDailyProgress((prev) => {
      const dayProg = prev[dateKey] || {};
      return {
        ...prev,
        [dateKey]: { ...dayProg, [taskId]: !dayProg[taskId] },
      };
    });
  }, []);

  // ── Helper: get tasks for a specific day ──────────────────────────────────
  const getTasksForDay = useCallback(
    (dateKey = todayKey()) => {
      const ids = dailyPlans[dateKey] || [];
      const progress = dailyProgress[dateKey] || {};
      return ids
        .map((id) => {
          const task = masterTasks.find((t) => t.id === id);
          if (!task) return null;
          return { ...task, completed: Boolean(progress[id]) };
        })
        .filter(Boolean);
    },
    [masterTasks, dailyPlans, dailyProgress]
  );

  // ── Progress summary for all days ─────────────────────────────────────────
  const getProgressData = useCallback(() => {
    return Object.keys(dailyPlans)
      .sort()
      .map((date) => {
        const ids = dailyPlans[date] || [];
        const progress = dailyProgress[date] || {};
        const total = ids.length;
        const completed = ids.filter((id) => progress[id]).length;
        return { date, total, completed, pct: total ? Math.round((completed / total) * 100) : 0 };
      });
  }, [dailyPlans, dailyProgress]);

  // ── Sessions CRUD ──────────────────────────────────────────────────────────
  const addSession = useCallback((session) => {
    setSessions((prev) => [
      { id: crypto.randomUUID(), ...session },
      ...prev,
    ]);
  }, []);

  const updateSession = useCallback((id, updates) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  }, []);

  const deleteSession = useCallback((id) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  // ── Profile ────────────────────────────────────────────────────────────────
  const updateProfile = useCallback((updates) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        // navigation
        activePage, setActivePage,
        sidebarOpen, setSidebarOpen,
        historyDate, setHistoryDate,
        // master tasks
        masterTasks, addMasterTask, updateMasterTask, deleteMasterTask,
        // daily
        dailyPlans, dailyProgress,
        addTaskToDay, removeTaskFromDay, addNewTaskToDay,
        toggleTaskForDay,
        getTasksForDay,
        getProgressData,
        // sessions
        sessions, addSession, updateSession, deleteSession,
        // profile
        profile, updateProfile,
        // helpers
        todayKey,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export { useApp, AppProvider };
