import { ActionType } from "./action";

export function courseDetailReducer(state = null, action = {}) {
  switch (action.type) {
    case ActionType.SET_COURSE_DETAIL:
      return action.payload;
    default:
      return state;
  }
}

export function isLoadingCourseDetailReducer(state = true, action = {}) {
  switch (action.type) {
    case ActionType.SET_IS_LOADING_COURSE_DETAIL:
      return action.payload;
    default:
      return state;
  }
}
