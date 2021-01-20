import axios from 'axios'
import cookie from "js-cookie";

let API_ROOT
let headers

if(process.env.NODE_ENV === 'production') {
    API_ROOT = `http://localhost:5000/api/v1/back-office`
} else {
    API_ROOT = `https://api-staging.happy-season.com/api/v1/back-office`
}

const handleErrors = async (error) => {
	let result = {}
	const data = error && error.response && error.response.data
	const status = error && error.response && error.response.status
	
	result = {
		statusCode: status,
		statusName: data.statusName,
		data
	}
	return result
}

const handleResponse = res => {
	return res && res.data
}

const createApi = () => {
	const authToken = cookie.get('token'); // localStorage.getItem('persist:auth') && localStorage.getItem('persist:auth').authToken
    if (authToken) {
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Type': 'application/json',
            'Authorization': authToken !== 'null' ? `Bearer ${authToken}` : ''
        }
    } else {
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Type': 'application/json'
        }
    }

    const api = axios.create({
		baseURL: API_ROOT,
		responseType: 'json',
			headers: headers
	})

	api.interceptors.response.use(function (response) {
        return response
    }, function (error) {
        return Promise.reject(error)
    })
    return api
}

const requests = {
	get: (url,data) =>
		createApi()
			.get(`${API_ROOT}${url}`, data)
			.then(handleResponse)
			.catch(handleErrors),
    post: (url, data, externalURL) =>
        createApi()
            .post(`${externalURL === undefined ? `${API_ROOT}${url}` : externalURL}`, data)
            .then(handleResponse)
            .catch(handleErrors),
	patch: (url, data) =>
		createApi()
			.patch(`${API_ROOT}${url}`, data)
			.then(handleResponse)
			.catch(handleErrors),
	delete: (url) =>
		createApi()
			.delete(`${API_ROOT}${url}`)
			.then(handleResponse)
			.catch(handleErrors),
}

const Auth = {
    login: (data) => requests.post('/login', data ),
	logout: (token) => requests.post('/logout/',token)
}

const Branches = {
    all: (data, counts) => requests.get('/branches/'+data+'/'+counts+'/0/0/0/0/', {}),
    search: (data) => requests.get('/branches/'+data.start+'/'+data.end+'/'+data.city+'/'+data.cat+'/'+data.subCat+'/'+data.term+'/', {}),
    instantEdit: (data) => requests.post('/instant-edit', data ),
	// logout: (token) => requests.post('/logout/logout.php','',token)
}

const Cities = {
    all: () => requests.get('/cities', {}),
}

const Categories = {
    all: () => requests.get('/categories', {}),
    sub: () => requests.get('/subcategories', {}),
}

export default {
	Auth,
	Cities,
	Categories,
	Branches
}
