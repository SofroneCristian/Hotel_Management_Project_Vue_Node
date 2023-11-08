export async function verifyToken() {
    try {
      const response = await fetch('http://localhost:3000/protected', {
        method: 'GET',
        headers: {
          'Authorization': `${localStorage.getItem('token')}`
        }
      });
  
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('id', data.userId);
        localStorage.setItem('userRole', data.userRole);
        localStorage.setItem('email', data.email);
        localStorage.setItem('first_name', data.first_name);
        localStorage.setItem('last_name', data.last_name);
  
        return true;
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem("id");
        localStorage.removeItem("userRole");
        localStorage.removeItem("email");
        localStorage.removeItem("first_name");
        localStorage.removeItem("last_name");
  
        return false;
      }
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem("id");
      localStorage.removeItem("userRole");
      localStorage.removeItem("email");
      localStorage.removeItem("first_name");
      localStorage.removeItem("last_name");
  
      console.error('An error occurred while trying to validate the token:', error);
      return false;
    }
  }
  