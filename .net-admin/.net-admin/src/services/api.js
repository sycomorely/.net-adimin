import http from '../config/api';

// API 请求函数
export const apiService = {
  // 示例：获取数据
  getData: (params) => {
    return http.get('/your-endpoint', { params });
  },
  
  // 示例：提交数据
  postData: (data) => {
    return http.post('/your-endpoint', data);
  },
  
  // 示例：更新数据
  updateData: (id, data) => {
    return http.put(`/your-endpoint/${id}`, data);
  },
  
  // 示例：删除数据
  deleteData: (id) => {
    return http.delete(`/your-endpoint/${id}`);
  }
};

// 用户认证相关 API
export const authApi = {
  login: (data) => {
    return http.post('/auth/login', data);
  },
  logout: () => {
    return http.post('/auth/logout');
  }
};

// 用户管理相关 API
export const userApi = {
  getUsers: (params) => {
    return http.get('/users', { params });
  },
  getUserById: (id) => {
    return http.get(`/users/${id}`);
  },
  createUser: (data) => {
    return http.post('/users', data);
  },
  updateUser: (id, data) => {
    return http.put(`/users/${id}`, data);
  },
  deleteUser: (id) => {
    return http.delete(`/users/${id}`);
  },
  toggleUserStatus: (id, status) => {
    return http.patch(`/users/${id}/status`, { status });
  }
};

// 角色管理相关 API
export const roleApi = {
  getRoles: (params) => {
    return http.get('/roles', { params });
  },
  getRoleById: (id) => {
    return http.get(`/roles/${id}`);
  },
  createRole: (data) => {
    return http.post('/roles', data);
  },
  updateRole: (id, data) => {
    return http.put(`/roles/${id}`, data);
  },
  deleteRole: (id) => {
    return http.delete(`/roles/${id}`);
  },
  toggleRoleStatus: (id, status) => {
    return http.patch(`/roles/${id}/status`, { status });
  }
};

// 菜单管理相关 API
export const menuApi = {
  getMenus: (params) => {
    return http.get('/menus', { params });
  },
  getMenuById: (id) => {
    return http.get(`/menus/${id}`);
  },
  createMenu: (data) => {
    return http.post('/menus', data);
  },
  updateMenu: (id, data) => {
    return http.put(`/menus/${id}`, data);
  },
  deleteMenu: (id) => {
    return http.delete(`/menus/${id}`);
  },
  toggleMenuStatus: (id, status) => {
    return http.patch(`/menus/${id}/status`, { status });
  }
}; 