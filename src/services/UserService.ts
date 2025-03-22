import instance from './httpClient'
//todo: add missing imports for interfaces, types

export class UserService {
    async login(email: String, password: String) {
        const response = await instance.post('/auth/login', { email, password });
        return response.data;
    }
    
    async register(){
    }
    
    async logout() {
        //endpoint for logout or just clear token + loggedInUser info ?
    }
}