import axios from "axios"; // fetch , axios es una forma de llamar el api libreia
const BASE_URL = import.meta.env.VITE_BASE_URL + "usuario";
class UserService {

    getUsers(){
        return axios.get(BASE_URL);
    }
    getUserById(UserId){
        return axios.get(BASE_URL + '/' + UserId);
    }
    createUser(User){
        return axios.post(BASE_URL, User);
    }
    loginUser(User){
        return axios.post(BASE_URL+ '/login/', User);
    }

    updateUsuario(usuario) {
        console.log(usuario);
        return axios.put(BASE_URL, usuario);
      }

      getSucursalByUsuario(idSucursal) {
        return axios.get(`${BASE_URL}/getSucursalByUsuario/${idSucursal}`);
      }
      getSucursalByUsuarionull() {
        return axios.get(`${BASE_URL}/getSucursalByUsuarionull`);
    }
    getallClientes() {
        const url = `${BASE_URL}/getallclientes`;
        console.log(`Fetching data from: ${url}`);
        return axios.get(url)
            .then(response => {
                console.log('Response:', response);
                return response;
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                throw error;
            });
    }
    getallencargado() {
        const url = `${BASE_URL}/getallencargado`;
        console.log(`Fetching data from: ${url}`);
        return axios.get(url)
            .then(response => {
                console.log('Response:', response);
                return response;
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                throw error;
            });
    }
    
}

export default new UserService()