import CourseApi from "../../../api/CourseApi";
import {
  showSuccessDialog,
  showErrorDialog,
} from "../../../helpers/toolsHelper"; // Kita akan buat file ini

export const ActionType = {
  SET_COURSE_DETAIL: "SET_COURSE_DETAIL",
  SET_IS_LOADING_COURSE_DETAIL: "SET_IS_LOADING_COURSE_DETAIL",
};

export function setCourseDetailActionCreator(courseDetail) {
  return { type: ActionType.SET_COURSE_DETAIL, payload: courseDetail };
}

export function setIsLoadingCourseDetailActionCreator(isLoading) {
  return { type: ActionType.SET_IS_LOADING_COURSE_DETAIL, payload: isLoading };
}

// Thunk untuk mengambil detail kursus
export function asyncGetCourseDetail(courseId) {
  return async (dispatch) => {
    dispatch(setIsLoadingCourseDetailActionCreator(true));
    try {
      const courseDetail = await CourseApi.getCourseById(courseId);
      dispatch(
        setCourseDetailActionCreator(
          courseDetail.data.course || courseDetail.data
        )
      );
    } catch (error) {
      showErrorDialog(error.message);
      dispatch(setCourseDetailActionCreator(null));
    }
    dispatch(setIsLoadingCourseDetailActionCreator(false));
  };
}

// Thunk untuk bergabung ke kursus
export function asyncEnrollCourse(courseId) {
  return async (dispatch) => {
    try {
      await CourseApi.addStudent(courseId);
      showSuccessDialog("You have successfully joined this course!");
      // Setelah sukses, panggil lagi thunk untuk mengambil data terbaru
      dispatch(asyncGetCourseDetail(courseId));
    } catch (error) {
      showErrorDialog(error.message);
    }
  };
}

// ======================================================
// == FUNGSI YANG HILANG: asyncLeaveCourse (Tambahkan ini)
// ======================================================
export function asyncLeaveCourse(courseId) {
  return async (dispatch) => {
    try {
      await CourseApi.leaveCourse(courseId);
      showSuccessDialog("You have successfully left this course.");
      // Ambil data terbaru untuk update UI
      dispatch(asyncGetCourseDetail(courseId));
    } catch (error) {
      showErrorDialog(error.message);
    }
  };
}

// ======================================================
// == FUNGSI YANG HILANG: asyncChangeRating (Tambahkan ini)
// ======================================================
export function asyncChangeRating({ courseId, ratings, comment }) {
  return async (dispatch) => {
    try {
      await CourseApi.changeMyRating(courseId, { ratings, comment });
      showSuccessDialog("Your rating has been submitted successfully!");
      // Ambil data terbaru untuk update UI
      dispatch(asyncGetCourseDetail(courseId));
    } catch (error) {
      showErrorDialog(error.message);
    }
  };
}
