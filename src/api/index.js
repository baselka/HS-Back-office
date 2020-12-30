import axios from 'axios'
var localStorage = require( '../utils/localStorage');
// import { getPersistToken } from '../utils/localStorage'


let API_ROOT

if(process.env.NODE_ENV === 'production') {
    API_ROOT = `http://localhost:5000/api/v1/backOffice`
} else {
    API_ROOT = `https://api-staging.happy-season.com/api/v1/backOffice`
}



const handleErrors = async (error) => {
	let result = {}
	const data = error && error.response && error.response.data
	const status = error && error.response && error.response.status
	
	result = {
		status: status,
		data: data,
		error: true
	}
	return result
	
}

const handleResponse = res => {
	return res && res.data
}


const createApi = () => {
    const authToken = localStorage.getLocalStorage('persist:auth') && localStorage.getLocalStorage('persist:auth').authToken
    if (authToken) {
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Type': 'application/json',
            Authorization: authToken !== 'null' ? `Token ${authToken.replace(/['"]+/g, '')}` : ''
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
    instantEdit: (data) => requests.post('/instantEdit', data ),
	// logout: (token) => requests.post('/logout/logout.php','',token)
}


export default {
	Auth,
	Branches
}
