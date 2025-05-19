import { useState, useEffect } from 'react'
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Avatar,
  InputAdornment,
  IconButton,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Alert,
  useMediaQuery
} from '@mui/material'
import { 
  LockOutlined as LockOutlinedIcon,
  Visibility,
  VisibilityOff,
  Person as PersonIcon
} from '@mui/icons-material'
import '../styles/Background.css'
import { authApi } from '../services/api'

// 创建黑绿主题
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

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  // 添加表单验证状态
  const [usernameError, setUsernameError] = useState(false)
  const [passwordError, setPasswordError] = useState(false)
  
  // 检测屏幕尺寸
  const isSmallScreen = useMediaQuery(darkGreenTheme.breakpoints.down('sm'));

  // 监听窗口大小变化并设置文档语言为英文
  useEffect(() => {
    document.documentElement.lang = 'en';
    
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault()
    
    // 重置错误状态
    setUsernameError(false)
    setPasswordError(false)
    setError('')
    
    // 验证表单
    let hasError = false;
    if (!username) {
      setUsernameError(true)
      hasError = true;
    }
    
    if (!password) {
      setPasswordError(true)
      hasError = true;
    }
    
    if (hasError) {
      return;
    }

    try {
      setLoading(true)
      const response = await authApi.login({ username, password })
      
      // 保存token到localStorage
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token)
      }
      
      setIsLoggedIn(true)
      // 调用父组件传递的回调函数
      if (onLoginSuccess) {
        onLoginSuccess(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  // 计算卡片宽度 - 桌面端更宽
  const cardWidth = isSmallScreen ? '90%' : '450px';

  if (isLoggedIn) {
    return (
      <ThemeProvider theme={darkGreenTheme}>
        <CssBaseline />
        <Box
          sx={{
            width: '100vw',
            height: '100vh',
            background: 'linear-gradient(135deg, #000000 0%, #0a1f0a 50%, #0f2f0f 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'fixed',
            top: 0,
            left: 0,
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
          <Paper 
            elevation={6}
            sx={{
              width: cardWidth,
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: 2,
              border: '1px solid #4caf50',
              backdropFilter: 'blur(10px)',
              background: 'rgba(30, 30, 30, 0.7)',
              boxShadow: '0 0 20px rgba(76, 175, 80, 0.3)',
              zIndex: 1,
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
              <PersonIcon />
            </Avatar>
            <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
              Welcome back, {username}!
            </Typography>
            <Button 
              fullWidth 
              variant="contained" 
              color="primary" 
              onClick={() => setIsLoggedIn(false)}
              sx={{ mt: 2 }}
            >
              Logout
            </Button>
          </Paper>
        </Box>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={darkGreenTheme}>
      <CssBaseline />
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          background: 'linear-gradient(135deg, #000000 0%, #0a1f0a 50%, #0f2f0f 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'fixed',
          top: 0,
          left: 0,
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
        <Paper 
          elevation={6}
          sx={{
            width: cardWidth,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2,
            border: '1px solid #4caf50',
            backdropFilter: 'blur(10px)',
            background: 'rgba(30, 30, 30, 0.7)',
            boxShadow: '0 0 20px rgba(76, 175, 80, 0.3)',
            zIndex: 1,
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            User Login
          </Typography>
          <Box component="form" onSubmit={handleLogin} sx={{ mt: 3, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={usernameError}
              helperText={usernameError ? "Please enter your username" : ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: 'primary.main' }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={passwordError}
              helperText={passwordError ? "Please enter your password" : ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: 'primary.main' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </Box>
        </Paper>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 5, zIndex: 1 }}>
          {'Copyright © Your Website '}
          {new Date().getFullYear()}
        </Typography>
      </Box>
    </ThemeProvider>
  )
}

// 添加默认属性
Login.defaultProps = {
  onLoginSuccess: () => {}
}

export default Login 