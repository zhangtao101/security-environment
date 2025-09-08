// config/index.js
export default {
  baseURL: import.meta.env.VITE_BASE_URL,
  mesUser: import.meta.env.VITE_GLOB_MES_USER,
  mesFile: import.meta.env.VITE_GLOB_MES_FILE,
  mesMessage: import.meta.env.VITE_GLOB_MES_MESSAGE,
  mesMain: import.meta.env.VITE_GLOB_MES_MAIN,
  mesMonitor: import.meta.env.VITE_GLOB_MES_MONITOR,
  kanbanSystem: import.meta.env.VITE_GLOB_KANBAN_SYSTEM
};