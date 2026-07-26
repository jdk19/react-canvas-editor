import axios from "axios";
import docCookies from "../utils/cookies";
// export const end = "//www.bubucuo.cn";
export const end = ""; //"//template.josephxia.com";

export function common(
  res: any,
  successCallback: Function,
  failedCallback?: Function
) {
  if (res.status === 200) {
    let code = res.data.code;
    if (code === 200) {
      successCallback(res.data.result);
    } else if (code === 401) {
      typeof failedCallback === "function"
        ? failedCallback()
        : alert("请先登录！");
    } //if (code === 500)
    else {
      typeof failedCallback === "function"
        ? failedCallback()
        : alert(res.data.msg || "信息有误，失败！");
    }
  } else if (res.status === 500) {
    typeof failedCallback === "function" ? failedCallback() : alert("失败！");
  }
}

export function getHeaders(): {
  headers: {
    Authorization: string;
  };
} {
  return {headers: {Authorization: docCookies.getItem("sessionId") || ""}};
}

export const myAxios = {
  get: (url: string, values?: any) => axios.get(url, getHeaders()),
  post: (url: string, values: any) => axios.post(url, values, getHeaders()),
};

// 注册 post
export const registerEnd = end + "/api/register";

// 用户信息
export const getUserInfo = end + "/api/info";
export const loginEnd = end + "/api/login";
export const logoutEnd = end + "/api/logout";

// 画布信息
// 根据id获取画布信息
export const getCanvasByIdEnd = end + "/api/web/content/get?id=";
// 保存画布
export const saveCanvasEnd = end + "/api/web/content/save";
// 删除画布
export const deleteCanvasByIdEnd = end + "/api/web/content/delete";

// 画布列表
export const getCanvasListEnd = end + "/api/web/content/list?pageSize=1000";
export const getTemplateListEnd = end + "/api/web/template/list?pageSize=1000";
