import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Tabs, 
  Tab, 
  ThemeProvider, 
  createTheme,
  CssBaseline,
  Avatar,
  Grid,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
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
  CircularProgress
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import { 
  CalendarMonth as CalendarIcon,
  Person as PersonIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Edit as EditIcon,
  ExitToApp as ExitToAppIcon,
  Add as AddIcon,
  Event as EventIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Menu as MenuIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { userApi, authApi } from '../services/api';

// 导入组件
import Dashboard from './Dashboard';
import MenuList from './MenuList';
import RoleList from './RoleList';
import UserList from './UserList';

// 使用与登录页面相同的主题
const darkGreenTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4caf50',
    },
    secondary: {
      main: '#2e7d32',
    },
    background: {
      default: '#121212',
      paper: 'rgba(30, 30, 30, 0.8)',
    },
  },
});

// 模拟用户数据
const initialUserData = {
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'Administrator',
  joinDate: 'January 15, 2023',
  lastLogin: 'Today at 09:45 AM',
  avatar: '👤' // 使用表情符号作为头像占位符
};

function MyPage({ onLogout }) {
  const [tabValue, setTabValue] = useState(0);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedUserData, setEditedUserData] = useState({...initialUserData});
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // 获取用户信息
  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      const response = await userApi.getUserById('current'); // 获取当前用户信息
      setUserData(response.data);
      setEditedUserData(response.data);
    } catch (error) {
      setSnackbarMessage('Failed to fetch user information');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载时获取用户信息
  useEffect(() => {
    fetchUserInfo();
  }, []);

  // 处理登出
  const handleLogout = async () => {
    try {
      await authApi.logout();
      localStorage.removeItem('token');
      if (onLogout) {
        onLogout();
      }
    } catch (error) {
      console.error('Logout failed:', error);
      // 即使登出失败，也清除本地token并执行登出
      localStorage.removeItem('token');
      if (onLogout) {
        onLogout();
      }
    }
  };

  // 处理个人信息编辑
  const handleEditToggle = () => {
    setEditMode(!editMode);
    if (editMode) {
      // 取消编辑，恢复原始数据
      setEditedUserData({...initialUserData});
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordError('');
      setAvatarFile(null);
      setAvatarPreview(null);
    }
  };

  // 处理个人信息变更
  const handleUserDataChange = (e) => {
    const { name, value } = e.target;
    setEditedUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 处理密码变更
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 验证确认密码
    if (name === 'confirmPassword' || (name === 'newPassword' && passwordData.confirmPassword)) {
      if (name === 'newPassword' && value !== passwordData.confirmPassword) {
        setPasswordError('Passwords do not match');
      } else if (name === 'confirmPassword' && value !== passwordData.newPassword) {
        setPasswordError('Passwords do not match');
      } else {
        setPasswordError('');
      }
    }
  };

  // 处理头像上传
  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // 创建预览
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 处理保存个人信息
  const handleSaveProfile = async () => {
    // 验证密码
    if (passwordData.newPassword && !passwordData.currentPassword) {
      setPasswordError('Current password is required');
      return;
    }
    
    if (passwordData.newPassword && passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    try {
      const formData = new FormData();
      
      // 添加基本信息
      formData.append('name', editedUserData.name);
      formData.append('email', editedUserData.email);
      
      // 如果有密码更改
      if (passwordData.newPassword) {
        formData.append('currentPassword', passwordData.currentPassword);
        formData.append('newPassword', passwordData.newPassword);
      }
      
      // 如果有头像文件
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const response = await userApi.updateUser('current', formData);
      
      // 更新用户数据
      setUserData(response.data);
      setEditMode(false);
      
      // 重置密码和头像状态
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordError('');
      setAvatarFile(null);
      
      // 显示成功消息
      setSnackbarMessage('Profile updated successfully!');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage(error.response?.data?.message || 'Failed to update profile');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // 渲染个人信息页面
  const renderMyInfo = () => {
    return (
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
            My Profile
          </Typography>
          <Button 
            variant={editMode ? "outlined" : "contained"} 
            color="primary" 
            startIcon={editMode ? <CloseIcon /> : <EditIcon />}
            onClick={handleEditToggle}
          >
            {editMode ? "Cancel" : "Edit Profile"}
          </Button>
        </Box>
        
        <Paper 
          sx={{ 
            p: 3,
            background: 'rgba(30, 30, 30, 0.7)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(76, 175, 80, 0.3)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {editMode ? (
                <Box sx={{ textAlign: 'center' }}>
                  <Box 
                    sx={{ 
                      width: 120, 
                      height: 120, 
                      borderRadius: '50%', 
                      overflow: 'hidden',
                      border: '3px solid #4caf50',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '3rem',
                      mb: 2,
                      mx: 'auto',
                      background: 'rgba(20, 20, 20, 0.7)',
                      position: 'relative'
                    }}
                  >
                    {avatarPreview ? (
                      <img 
                        src={avatarPreview} 
                        alt="Avatar Preview" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    ) : (
                      userData?.avatar
                    )}
                    <Box 
                      sx={{ 
                        position: 'absolute', 
                        bottom: 0, 
                        left: 0, 
                        right: 0, 
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        color: '#fff',
                        textAlign: 'center',
                        py: 0.5,
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                      }}
                      component="label"
                    >
                      Change
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleAvatarChange}
                      />
                    </Box>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Click on the avatar to change
                  </Typography>
                </Box>
              ) : (
                <Box 
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    borderRadius: '50%', 
                    overflow: 'hidden',
                    border: '3px solid #4caf50',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                    mb: 2,
                    mx: 'auto',
                    background: 'rgba(20, 20, 20, 0.7)'
                  }}
                >
                  {avatarPreview ? (
                    <img 
                      src={avatarPreview} 
                      alt="User Avatar" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    userData?.avatar
                  )}
                </Box>
              )}
              
              <Typography variant="h6" sx={{ mt: 1, textAlign: 'center' }}>
                {editMode ? editedUserData.name : userData?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                {userData?.role}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={8}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Full Name
                  </Typography>
                  {editMode ? (
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="name"
                      value={editedUserData.name}
                      onChange={handleUserDataChange}
                      size="small"
                    />
                  ) : (
                    <Typography variant="body1">{userData?.name}</Typography>
                  )}
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Email Address
                  </Typography>
                  {editMode ? (
                    <TextField
                      fullWidth
                      variant="outlined"
                      name="email"
                      value={editedUserData.email}
                      onChange={handleUserDataChange}
                      size="small"
                    />
                  ) : (
                    <Typography variant="body1">{userData?.email}</Typography>
                  )}
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Join Date
                  </Typography>
                  <Typography variant="body1">{userData?.joinDate}</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Last Login
                  </Typography>
                  <Typography variant="body1">{userData?.lastLogin}</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Account Status
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#4caf50' }}>Active</Typography>
                </Grid>
              </Grid>
            </Grid>
            
            {editMode && (
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Change Password
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Current Password"
                      name="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      size="small"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="New Password"
                      name="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      size="small"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Confirm New Password"
                      name="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      size="small"
                      error={!!passwordError}
                      helperText={passwordError}
                    />
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleSaveProfile}
                  >
                    Save Changes
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid>
        </Paper>
      </Box>
    );
  };

  return (
    <ThemeProvider theme={darkGreenTheme}>
      <CssBaseline />
      <Box
        sx={{
          width: '100vw',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #000000 0%, #0a1f0a 50%, #0f2f0f 100%)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 30% 40%, rgba(76, 175, 80, 0.15) 0%, rgba(0, 0, 0, 0) 50%), radial-gradient(circle at 70% 60%, rgba(76, 175, 80, 0.15) 0%, rgba(0, 0, 0, 0) 50%)',
            zIndex: 0,
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, p: 3, width: '100%', maxWidth: 1400, mx: 'auto' }}>
          {/* 顶部导航栏 */}
          <Paper 
            elevation={6}
            sx={{
              borderRadius: 2,
              border: '1px solid #4caf50',
              backdropFilter: 'blur(10px)',
              background: 'rgba(30, 30, 30, 0.7)',
              boxShadow: '0 0 20px rgba(76, 175, 80, 0.3)',
              mb: 3,
              overflow: 'hidden',
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              borderBottom: '1px solid rgba(76, 175, 80, 0.3)',
            }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                textColor="primary"
                indicatorColor="primary"
                variant="scrollable"
                scrollButtons="auto"
                sx={{ 
                  '& .MuiTab-root': { 
                    py: 2,
                    px: 2,
                    fontSize: '0.85rem',
                    fontWeight: 'medium',
                  },
                  '& .Mui-selected': {
                    color: '#4caf50 !important',
                  }
                }}
              >
                <Tab 
                  icon={<CalendarIcon />} 
                  iconPosition="start" 
                  label="CALENDAR" 
                  sx={{ textTransform: 'uppercase' }}
                />
                <Tab 
                  icon={<MenuIcon />} 
                  iconPosition="start" 
                  label="MENU LIST" 
                  sx={{ textTransform: 'uppercase' }}
                />
                <Tab 
                  icon={<SecurityIcon />} 
                  iconPosition="start" 
                  label="ROLE LIST" 
                  sx={{ textTransform: 'uppercase' }}
                />
                <Tab 
                  icon={<PeopleIcon />} 
                  iconPosition="start" 
                  label="USER LIST" 
                  sx={{ textTransform: 'uppercase' }}
                />
                <Tab 
                  icon={<PersonIcon />} 
                  iconPosition="start" 
                  label="MY INFO" 
                  sx={{ textTransform: 'uppercase' }}
                />
              </Tabs>
              <Box sx={{ pr: 2 }}>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  onClick={handleLogout}
                  startIcon={<ExitToAppIcon />}
                  size="small"
                >
                  Logout
                </Button>
              </Box>
            </Box>
          </Paper>
          
          {/* 内容区域 */}
          <Paper 
            elevation={6}
            sx={{
              borderRadius: 2,
              border: '1px solid #4caf50',
              backdropFilter: 'blur(10px)',
              background: 'rgba(30, 30, 30, 0.7)',
              boxShadow: '0 0 20px rgba(76, 175, 80, 0.3)',
              overflow: 'hidden',
            }}
          >
            {loading ? (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '100vh' 
              }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                {tabValue === 0 && <Dashboard />}
                {tabValue === 1 && <MenuList />}
                {tabValue === 2 && <RoleList />}
                {tabValue === 3 && <UserList />}
                {tabValue === 4 && renderMyInfo()}
              </>
            )}
          </Paper>
        </Box>
      </Box>

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
    </ThemeProvider>
  );
}

// 添加默认属性
MyPage.defaultProps = {
  onLogout: () => {}
};

export default MyPage; 