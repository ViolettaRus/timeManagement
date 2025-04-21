const users = JSON.parse(localStorage.getItem('mockUsers')) || [];

const register = async (userData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = {
        id: Date.now(),
        ...userData
      };
      users.push(user);
      localStorage.setItem('mockUsers', JSON.stringify(users));
      
      resolve({
        user,
        token: 'mock-jwt-token'
      });
    }, 500);
  });
};

const login = async (credentials) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('mockUsers')) || [];
      const user = users.find(u => 
        u.email === credentials.email && 
        u.password === credentials.password
      );
      
      if (user) {
        resolve({
          user,
          token: 'mock-jwt-token'
        });
      } else {
        reject(new Error('Неверные учетные данные'));
      }
    }, 500);
  });
};

const updateUser = async (userData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const currentUser = JSON.parse(localStorage.getItem('mockCurrentUser')) || {};
        
      const updatedUser = {
        ...currentUser,
        ...userData,
        settings: {
          ...currentUser.settings,
          ...userData.settings
        },
        updatedAt: new Date().toISOString()
      };
        
      localStorage.setItem('mockCurrentUser', JSON.stringify(updatedUser));
        
      resolve(updatedUser);
    }, 500);
  });
}

const logout = () => {
  return Promise.resolve();
};

const mockAuth = {
  register,
  login,
  logout,
  updateUser
};

export default mockAuth;