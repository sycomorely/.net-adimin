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
  FilterList as FilterListIcon
} from '@mui/icons-material';

// 初始角色数据
const initialRoles = [
  { 
    id: 1, 
    name: 'Administrator', 
    rank: 1, 
    description: 'Full system access with all permissions',
    isEnabled: true
  },
  { 
    id: 2, 
    name: 'Manager', 
    rank: 2, 
    description: 'Access to manage users and content',
    isEnabled: true
  },
  { 
    id: 3, 
    name: 'Editor', 
    rank: 3, 
    description: 'Can edit and publish content',
    isEnabled: true
  },
  { 
    id: 4, 
    name: 'User', 
    rank: 4, 
    description: 'Basic access to the system',
    isEnabled: true
  },
  { 
    id: 5, 
    name: 'Guest', 
    rank: 5, 
    description: 'Limited read-only access',
    isEnabled: false
  }
];

function RoleList() {
  const [roles, setRoles] = useState(initialRoles);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [roleFormData, setRoleFormData] = useState({
    name: '',
    rank: 1,
    description: '',
    isEnabled: true
  });
  const [roleFormErrors, setRoleFormErrors] = useState({});
  const [roleAnchorEl, setRoleAnchorEl] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEnabled, setFilterEnabled] = useState('all');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // 处理角色操作菜单
  const handleRoleMenuClick = (event, id) => {
    setRoleAnchorEl(event.currentTarget);
    setSelectedRoleId(id);
  };

  const handleRoleMenuClose = () => {
    setRoleAnchorEl(null);
    setSelectedRoleId(null);
  };

  // 添加角色
  const handleAddRole = () => {
    setEditingRole(null);
    setRoleFormData({
      name: '',
      rank: Math.max(...roles.map(role => role.rank), 0) + 1,
      description: '',
      isEnabled: true
    });
    setRoleFormErrors({});
    setRoleDialogOpen(true);
  };

  // 编辑角色
  const handleEditRole = () => {
    const role = roles.find(role => role.id === selectedRoleId);
    if (role) {
      setEditingRole(role);
      setRoleFormData({
        name: role.name,
        rank: role.rank,
        description: role.description,
        isEnabled: role.isEnabled
      });
      setRoleFormErrors({});
      setRoleDialogOpen(true);
    }
    handleRoleMenuClose();
  };

  // 删除角色
  const handleDeleteRole = () => {
    setRoles(roles.filter(role => role.id !== selectedRoleId));
    setSnackbarMessage('Role deleted successfully!');
    setSnackbarOpen(true);
    handleRoleMenuClose();
  };

  // 切换角色启用状态
  const handleToggleRoleStatus = (id) => {
    setRoles(roles.map(role => 
      role.id === id ? { ...role, isEnabled: !role.isEnabled } : role
    ));
    
    const role = roles.find(role => role.id === id);
    setSnackbarMessage(`Role ${role.name} ${!role.isEnabled ? 'enabled' : 'disabled'} successfully!`);
    setSnackbarOpen(true);
  };

  // 处理表单变更
  const handleRoleFormChange = (e) => {
    const { name, value, checked } = e.target;
    
    if (name === 'isEnabled') {
      setRoleFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setRoleFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // 关闭角色对话框
  const handleRoleDialogClose = () => {
    setRoleDialogOpen(false);
  };

  // 保存角色
  const handleSaveRole = () => {
    // 验证表单
    const errors = {};
    if (!roleFormData.name.trim()) {
      errors.name = 'Role name is required';
    }
    if (!roleFormData.description.trim()) {
      errors.description = 'Description is required';
    }
    if (!roleFormData.rank || roleFormData.rank < 1) {
      errors.rank = 'Rank must be a positive number';
    }

    if (Object.keys(errors).length > 0) {
      setRoleFormErrors(errors);
      return;
    }

    if (editingRole) {
      // 更新现有角色
      setRoles(roles.map(role => 
        role.id === editingRole.id 
          ? { 
              ...role, 
              name: roleFormData.name,
              rank: Number(roleFormData.rank),
              description: roleFormData.description,
              isEnabled: roleFormData.isEnabled
            } 
          : role
      ));
      setSnackbarMessage('Role updated successfully!');
    } else {
      // 添加新角色
      const newRole = {
        id: Math.max(...roles.map(role => role.id), 0) + 1,
        name: roleFormData.name,
        rank: Number(roleFormData.rank),
        description: roleFormData.description,
        isEnabled: roleFormData.isEnabled
      };
      setRoles([...roles, newRole]);
      setSnackbarMessage('Role added successfully!');
    }
    
    setSnackbarOpen(true);
    setRoleDialogOpen(false);
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

  // 过滤和排序角色
  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         role.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterEnabled === 'all') return matchesSearch;
    if (filterEnabled === 'enabled') return matchesSearch && role.isEnabled;
    if (filterEnabled === 'disabled') return matchesSearch && !role.isEnabled;
    
    return matchesSearch;
  });

  // 排序角色
  const sortedRoles = [...filteredRoles].sort((a, b) => a.rank - b.rank);

  // 分页
  const paginatedRoles = sortedRoles.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#4caf50', fontWeight: 'bold', mb: 3 }}>
          Role Management
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
              placeholder="Search roles..."
              value={searchTerm}
              onChange={handleSearchChange}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              }
              sx={{ maxWidth: 300 }}
            />
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FormControl sx={{ minWidth: 120, mr: 2 }}>
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
                onClick={handleAddRole}
              >
                Add Role
              </Button>
            </Box>
          </Box>
          
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="center">Rank</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRoles.length > 0 ? (
                  paginatedRoles.map((role) => (
                    <TableRow 
                      key={role.id}
                      sx={{ 
                        '&:hover': { 
                          backgroundColor: 'rgba(76, 175, 80, 0.08)' 
                        },
                        transition: 'background-color 0.2s'
                      }}
                    >
                      <TableCell component="th" scope="row">
                        <Typography variant="body1" fontWeight="medium">
                          {role.name}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">{role.rank}</TableCell>
                      <TableCell>
                        <Tooltip title={role.description} placement="top-start">
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              maxWidth: 300, 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis', 
                              whiteSpace: 'nowrap' 
                            }}
                          >
                            {role.description}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center">
                        <Switch
                          checked={role.isEnabled}
                          onChange={() => handleToggleRoleStatus(role.id)}
                          color="primary"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton 
                          size="small" 
                          onClick={(e) => handleRoleMenuClick(e, role.id)}
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
                        No roles found
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
            count={filteredRoles.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
      
      {/* 角色操作菜单 */}
      <Menu
        anchorEl={roleAnchorEl}
        open={Boolean(roleAnchorEl)}
        onClose={handleRoleMenuClose}
      >
        <MenuItem onClick={handleEditRole}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteRole} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
      
      {/* 添加/编辑角色对话框 */}
      <Dialog open={roleDialogOpen} onClose={handleRoleDialogClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: 'rgba(30, 30, 30, 0.9)', color: '#4caf50', fontWeight: 'bold' }}>
          {editingRole ? 'Edit Role' : 'Add New Role'}
        </DialogTitle>
        <DialogContent sx={{ bgcolor: 'rgba(30, 30, 30, 0.9)', pt: 2 }}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Role Name *"
                name="name"
                value={roleFormData.name}
                onChange={handleRoleFormChange}
                error={!!roleFormErrors.name}
                helperText={roleFormErrors.name}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Rank *"
                name="rank"
                type="number"
                value={roleFormData.rank}
                onChange={handleRoleFormChange}
                error={!!roleFormErrors.rank}
                helperText={roleFormErrors.rank || "Lower rank appears first"}
                required
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description *"
                name="description"
                value={roleFormData.description}
                onChange={handleRoleFormChange}
                error={!!roleFormErrors.description}
                helperText={roleFormErrors.description}
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
                    checked={roleFormData.isEnabled}
                    onChange={handleRoleFormChange}
                    name="isEnabled"
                    color="primary"
                  />
                  <Typography variant="body2">
                    {roleFormData.isEnabled ? 'Enabled' : 'Disabled'}
                  </Typography>
                </Box>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ bgcolor: 'rgba(30, 30, 30, 0.9)', px: 3, pb: 3 }}>
          <Button onClick={handleRoleDialogClose} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleSaveRole} 
            color="primary" 
            variant="contained"
          >
            {editingRole ? 'Update' : 'Save'}
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

export default RoleList; 