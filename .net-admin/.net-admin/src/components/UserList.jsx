import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  Tooltip,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  TablePagination,
  InputAdornment,
  OutlinedInput,
  Grid,
  IconButton
} from '@mui/material';
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';

// 初始用户数据
const initialUsers = [
  { 
    id: 1, 
    username: 'admin', 
    name: 'Administrator',
    password: 'admin123',
    isEnabled: true,
    description: 'System administrator with full access'
  },
  { 
    id: 2, 
    username: 'manager', 
    name: 'Content Manager',
    password: 'manager123',
    isEnabled: true,
    description: 'Content management user'
  },
  { 
    id: 3, 
    username: 'editor', 
    name: 'Content Editor',
    password: 'editor123',
    isEnabled: true,
    description: 'Can edit and publish content'
  },
  { 
    id: 4, 
    username: 'user1', 
    name: 'Regular User',
    password: 'user123',
    isEnabled: true,
    description: 'Standard user account'
  },
  { 
    id: 5, 
    username: 'guest', 
    name: 'Guest User',
    password: 'guest123',
    isEnabled: false,
    description: 'Limited access guest account'
  }
];

function UserList() {
  const [users, setUsers] = useState(initialUsers);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userFormData, setUserFormData] = useState({
    username: '',
    name: '',
    password: '',
    isEnabled: true,
    description: ''
  });
  const [userFormErrors, setUserFormErrors] = useState({});
  const [userAnchorEl, setUserAnchorEl] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEnabled, setFilterEnabled] = useState('all');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // 处理用户操作菜单
  const handleUserMenuClick = (event, id) => {
    setUserAnchorEl(event.currentTarget);
    setSelectedUserId(id);
  };

  const handleUserMenuClose = () => {
    setUserAnchorEl(null);
    setSelectedUserId(null);
  };

  // 添加用户
  const handleAddUser = () => {
    setEditingUser(null);
    setUserFormData({
      username: '',
      name: '',
      password: '',
      isEnabled: true,
      description: ''
    });
    setUserFormErrors({});
    setUserDialogOpen(true);
  };

  // 编辑用户
  const handleEditUser = () => {
    const user = users.find(user => user.id === selectedUserId);
    if (user) {
      setEditingUser(user);
      setUserFormData({
        username: user.username,
        name: user.name,
        password: user.password,
        isEnabled: user.isEnabled,
        description: user.description
      });
      setUserFormErrors({});
      setUserDialogOpen(true);
    }
    handleUserMenuClose();
  };

  // 删除用户
  const handleDeleteUser = () => {
    setUsers(users.filter(user => user.id !== selectedUserId));
    setSnackbarMessage('User deleted successfully!');
    setSnackbarOpen(true);
    handleUserMenuClose();
  };

  // 切换用户启用状态
  const handleToggleUserStatus = (id) => {
    setUsers(users.map(user => 
      user.id === id ? { ...user, isEnabled: !user.isEnabled } : user
    ));
    
    const user = users.find(user => user.id === id);
    setSnackbarMessage(`User ${user.username} ${!user.isEnabled ? 'enabled' : 'disabled'} successfully!`);
    setSnackbarOpen(true);
  };

  // 处理表单变更
  const handleUserFormChange = (e) => {
    const { name, value, checked } = e.target;
    
    if (name === 'isEnabled') {
      setUserFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setUserFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // 关闭用户对话框
  const handleUserDialogClose = () => {
    setUserDialogOpen(false);
    setShowPassword(false);
  };

  // 保存用户
  const handleSaveUser = () => {
    // 验证表单
    const errors = {};
    if (!userFormData.username.trim()) {
      errors.username = 'Username is required';
    }
    if (!userFormData.name.trim()) {
      errors.name = 'Name is required';
    }
    if (!editingUser && !userFormData.password.trim()) {
      errors.password = 'Password is required for new users';
    }
    if (!userFormData.description.trim()) {
      errors.description = 'Description is required';
    }

    if (Object.keys(errors).length > 0) {
      setUserFormErrors(errors);
      return;
    }

    if (editingUser) {
      // 更新现有用户
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { 
              ...user, 
              username: userFormData.username,
              name: userFormData.name,
              password: userFormData.password || user.password,
              description: userFormData.description,
              isEnabled: userFormData.isEnabled
            } 
          : user
      ));
      setSnackbarMessage('User updated successfully!');
    } else {
      // 添加新用户
      const newUser = {
        id: Math.max(...users.map(user => user.id), 0) + 1,
        username: userFormData.username,
        name: userFormData.name,
        password: userFormData.password,
        description: userFormData.description,
        isEnabled: userFormData.isEnabled
      };
      setUsers([...users, newUser]);
      setSnackbarMessage('User added successfully!');
    }
    
    setSnackbarOpen(true);
    setUserDialogOpen(false);
    setShowPassword(false);
  };

  // 处理搜索
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  // 处理过滤
  const handleFilterChange = (e) => {
    setFilterEnabled(e.target.value);
    setPage(0);
  };

  // 处理分页
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // 处理通知关闭
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // 切换密码可见性
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // 过滤和排序用户
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterEnabled === 'all') return matchesSearch;
    if (filterEnabled === 'enabled') return matchesSearch && user.isEnabled;
    if (filterEnabled === 'disabled') return matchesSearch && !user.isEnabled;
    
    return matchesSearch;
  });

  // 排序用户 - 按用户名字母顺序
  const sortedUsers = [...filteredUsers].sort((a, b) => a.username.localeCompare(b.username));

  // 分页
  const paginatedUsers = sortedUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#4caf50', fontWeight: 'bold', mb: 3 }}>
          User Management
        </Typography>
        
        <Paper 
          sx={{ 
            p: 2,
            mb: 3,
            background: 'rgba(30, 30, 30, 0.7)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(76, 175, 80, 0.3)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <OutlinedInput
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearchChange}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              }
              sx={{ maxWidth: 300 }}
            />
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl sx={{ minWidth: 120 }}>
                <Select
                  value={filterEnabled}
                  onChange={handleFilterChange}
                  displayEmpty
                  size="small"
                  startAdornment={
                    <InputAdornment position="start">
                      <FilterListIcon fontSize="small" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="enabled">Enabled</MenuItem>
                  <MenuItem value="disabled">Disabled</MenuItem>
                </Select>
              </FormControl>
              
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<AddIcon />}
                onClick={handleAddUser}
              >
                Add User
              </Button>
            </Box>
          </Box>
          
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <TableRow 
                      key={user.id}
                      sx={{ 
                        '&:hover': { 
                          backgroundColor: 'rgba(76, 175, 80, 0.08)' 
                        } 
                      }}
                    >
                      <TableCell component="th" scope="row">
                        {user.username}
                      </TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>
                        <Tooltip title={user.description} placement="top">
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              maxWidth: 250, 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis', 
                              whiteSpace: 'nowrap' 
                            }}
                          >
                            {user.description}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center">
                        <Switch
                          checked={user.isEnabled}
                          onChange={() => handleToggleUserStatus(user.id)}
                          color="primary"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton 
                          size="small" 
                          onClick={(e) => handleUserMenuClick(e, user.id)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1" color="text.secondary">
                        No users found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
      
      {/* 用户操作菜单 */}
      <Menu
        anchorEl={userAnchorEl}
        open={Boolean(userAnchorEl)}
        onClose={handleUserMenuClose}
      >
        <MenuItem onClick={handleEditUser}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteUser} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
      
      {/* 添加/编辑用户对话框 */}
      <Dialog open={userDialogOpen} onClose={handleUserDialogClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: 'rgba(30, 30, 30, 0.9)', color: '#4caf50', fontWeight: 'bold' }}>
          {editingUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent sx={{ bgcolor: 'rgba(30, 30, 30, 0.9)', pt: 2 }}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Username *"
                name="username"
                value={userFormData.username}
                onChange={handleUserFormChange}
                error={!!userFormErrors.username}
                helperText={userFormErrors.username}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name *"
                name="name"
                value={userFormData.name}
                onChange={handleUserFormChange}
                error={!!userFormErrors.name}
                helperText={userFormErrors.name}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={editingUser ? "Password (leave blank to keep current)" : "Password *"}
                name="password"
                type={showPassword ? "text" : "password"}
                value={userFormData.password}
                onChange={handleUserFormChange}
                error={!!userFormErrors.password}
                helperText={userFormErrors.password}
                required={!editingUser}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description *"
                name="description"
                value={userFormData.description}
                onChange={handleUserFormChange}
                error={!!userFormErrors.description}
                helperText={userFormErrors.description}
                required
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl component="fieldset" sx={{ mt: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Status
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Switch
                    checked={userFormData.isEnabled}
                    onChange={handleUserFormChange}
                    name="isEnabled"
                    color="primary"
                  />
                  <Typography variant="body2">
                    {userFormData.isEnabled ? 'Enabled' : 'Disabled'}
                  </Typography>
                </Box>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ bgcolor: 'rgba(30, 30, 30, 0.9)', px: 3, pb: 3 }}>
          <Button onClick={handleUserDialogClose} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleSaveUser} 
            color="primary" 
            variant="contained"
          >
            {editingUser ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* 通知消息 */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default UserList; 