import { configureStore } from "@reduxjs/toolkit";
import {
  courseDetailReducer,
  isLoadingCourseDetailReducer,
} from "./features/courses/states/reducer";
// Impor reducer lain di sini nanti

const store = configureStore({
  reducer: {
    courseDetail: courseDetailReducer,
    isLoadingCourseDetail: isLoadingCourseDetailReducer,
    // Tambahkan reducer lain di sini
  },
});

export default store;
