import axios from "axios";
import cookie from "js-cookie";

let API_ROOT;
let headers;

if (process.env.NODE_ENV === "production") {
  API_ROOT = `https://api-staging.happy-season.com/api/v1/back-office`;
} else {
  API_ROOT = `https://api-staging.happy-season.com/api/v1/back-office`;
}

const handleErrors = async error => {
  console.log("error", error);
  let result = {};
  if (error === "Network Error") {
    result = {
      statusCode: 401,
      statusName: "Network Error",
      data: "Network Error"
    };
    return result;
  }

  const data = error && error.response && error.response.data;
  const status = error && error.response && error.response.status;

  result = {
    statusCode: status,
    statusName: data.statusName,
    data
  };
  return result;
};

const handleResponse = res => {
  return res && res.data;
};

const createApi = () => {
  const authToken = cookie.get("token"); // localStorage.getItem('persist:auth') && localStorage.getItem('persist:auth').authToken
  if (authToken) {
    headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Type": "application/json",
      Authorization: authToken !== "null" ? `Bearer ${authToken}` : ""
    };
  } else {
    headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Type": "application/json"
    };
  }

  const api = axios.create({
    baseURL: API_ROOT,
    responseType: "json",
    headers: headers
  });

  api.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      return Promise.reject(error);
    }
  );
  return api;
};

const uploadDataFormApi = async data => {
  console.log("uploadDataFormApi data", data);
  const authToken = cookie.get("token");
  if (!authToken) return { status: "error", data: "Token not valid" };

  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + authToken);

  var formdata = new FormData();
  formdata.append("branch_id", data.id);
  for (let index = 0; index < data.images.length; index++) {
    const element = data.images[index];
    console.log("element", element);
    formdata.append("images", element, element.name);
    // formdata.append("images", fileInput.files[0], "bg.jpg");
  }

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: formdata,
    redirect: "follow"
  };
  console.log("upload-branch-images requestOptions", requestOptions);

  await fetch(API_ROOT + "/upload-branch-images/", requestOptions)
    .then(response => response.text())
    .then(result => {
      console.log("upload-branch-images success", result);
      return { status: "success", data: result };
    })
    .catch(error => {
      console.log("upload-branch-images error", error);
      return { status: "error", data: error };
    });
};

const requests = {
  get: (url, data) =>
    createApi()
      .get(`${API_ROOT}${url}`, data)
      .then(handleResponse)
      .catch(handleErrors),
  post: (url, data, externalURL) =>
    createApi()
      .post(
        `${externalURL === undefined ? `${API_ROOT}${url}` : externalURL}`,
        data
      )
      .then(handleResponse)
      .catch(handleErrors),
  patch: (url, data) =>
    createApi()
      .patch(`${API_ROOT}${url}`, data)
      .then(handleResponse)
      .catch(handleErrors),
  delete: url =>
    createApi()
      .delete(`${API_ROOT}${url}`)
      .then(handleResponse)
      .catch(handleErrors)
};

const Auth = {
  login: data => requests.post("/login", data),
  logout: token => requests.post("/logout/", token)
};

const Branches = {
  all: (data, counts) =>
    requests.get("/branches/" + data + "/" + counts + "/0/0/0/0/", {}),
  delete: branch_id => requests.delete("/delete-branch/" + branch_id, {}),
  details: id => requests.get("/branch-details/" + id, {}),
  search: data =>
    requests.get(
      "/branches/" +
        data.start +
        "/" +
        data.end +
        "/" +
        data.city +
        "/" +
        data.cat +
        "/" +
        data.subCat +
        "/" +
        data.term +
        "/",
      {}
    ),
  create: data => requests.post("/add-branch", data),
  update: data => requests.patch("/update-branch", data),
  deleteImage: data =>
    requests.delete(
      "/delete-branch-image/" + data.branch + "/" + data.image,
      {}
    ),
  instantEdit: data => requests.post("/instant-edit", data),
  changeStatus: data =>
    requests.patch(
      "/update-branch-status/" + data.branch_id + "/" + data.status,
      {}
    ),
  uploadBranchImages: data => uploadDataFormApi(data)
};

const Cities = {
  all: () => requests.get("/cities", {}),
  // delete: id => requests.post("/cities", id),
  add: data => requests.post("/add-city", data),
  update: data => requests.patch("/update-city/" + data.city_id, data)
};

const Providers = {
  all: data =>
    requests.get("/providers/" + data.start + "/" + data.end + "/0", {}),
  create: data => requests.post("/add-provider", data)
};

const Categories = {
  all: () => requests.get("/categories", {}),
  sub: () => requests.get("/subcategories", {})
};

export default {
  Auth,
  Cities,
  Categories,
  Providers,
  Branches
};
