function checkAuth() {
   return Boolean(localStorage.getItem('token'));
}

function getAuthToken(){
      const token = localStorage.getItem('token');
      
      return token;
}