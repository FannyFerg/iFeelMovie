import axios from "axios";
class AuthService {
  constructor() {
    let service = axios.create({
      baseURL: "http://localhost:5000/auth",
      withCredentials: true
    });
    this.service = service;
  }
  signup = (username, password) => {
    return this.service
      .post("/signup", { username: username, password: password })
      .then(response => response.data);
  };
}
export default AuthService;