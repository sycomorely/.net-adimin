import React, { useState, useEffect } from 'react';
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
import { menuApi } from '../services/api';

// 初始菜单数据
const initialMenuItems = [
  { 
    id: 1, 
    name: 'Dashboard', 
    path: '/dashboard', 
    component: 'Dashboard', 
    rank: 1, 
    isEnabled: true, 
    description: 'Main dashboard page',
    parent: null
  },
  { 
    id: 2, 
    name: 'User Management', 
    path: '/users', 
    component: 'UserList', 
    rank: 2, 
    isEnabled: true, 
    description: 'User management page',
    parent: null
  },
  { 
    id: 3, 
    name: 'User Details', 
    path: '/users/:id', 
    component: 'UserDetail', 
    rank: 1, 
    isEnabled: true, 
    description: 'User details page',
    parent: 'User Management'
  },
  { 
    id: 4, 
    name: 'Settings', 
    path: '/settings', 
    component: 'Settings', 
    rank: 3, 
    isEnabled: false, 
    description: 'Application settings',
    parent: null
  }
];

function MenuList() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [menuDialogOpen, setMenuDialogOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [menuFormData, setMenuFormData] = useState({
    name: '',
    path: '',
    component: '',
    rank: 1,
    isEnabled: true,
    description: '',
    parent: ''
  });
  const [menuFormErrors, setMenuFormErrors] = useState({});
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedMenuId, setSelectedMenuId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEnabled, setFilterEnabled] = useState('all');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // 获取菜单列表
  const fetchMenus = async () => {
    try {
      setLoading(true);
      const response = await menuApi.getMenus({
        search: searchTerm,
        status: filterEnabled === 'all' ? undefined : filterEnabled === 'enabled'
      });
      setMenuItems(response.data);
    } catch (error) {
      setSnackbarMessage('Failed to fetch menus');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载和搜索/过滤条件变化时获取菜单列表
  useEffect(() => {
    fetchMenus();
  }, [searchTerm, filterEnabled]);

  // 处理菜单操作
  const handleMenuClick = (event, id) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedMenuId(id);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedMenuId(null);
  };

  const handleAddMenu = () => {
    setEditingMenu(null);
    setMenuFormData({
      name: '',
      path: '',
      component: '',
      rank: 1,
      isEnabled: true,
      description: '',
      parent: ''
    });
    setMenuFormErrors({});
    setMenuDialogOpen(true);
  };

  const handleEditMenu = () => {
    const menuToEdit = menuItems.find(item => item.id === selectedMenuId);
    setEditingMenu(menuToEdit);
    setMenuFormData({
      name: menuToEdit.name,
      path: menuToEdit.path,
      component: menuToEdit.component,
      rank: menuToEdit.rank,
      isEnabled: menuToEdit.isEnabled,
      description: menuToEdit.description || '',
      parent: menuToEdit.parent || ''
    });
    setMenuFormErrors({});
    setMenuDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteMenu = async () => {
    try {
      await menuApi.deleteMenu(selectedMenuId);
      setMenuItems(prev => prev.filter(item => item.id !== selectedMenuId));
      setSnackbarMessage('Menu deleted successfully!');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('Failed to delete menu');
      setSnackbarOpen(true);
    }
    handleMenuClose();
  };

  const handleMenuDialogClose = () => {
    setMenuDialogOpen(false);
  };

  const handleMenuFormChange = (e) => {
    const { name, value, checked } = e.target;
    setMenuFormData(prev => ({
      ...prev,
      [name]: name === 'isEnabled' ? checked : value
    }));
    
    // Clear error when field is edited
    if (menuFormErrors[name]) {
      setMenuFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateMenuForm = () => {
    const errors = {};
    
    if (!menuFormData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!menuFormData.path.trim()) {
      errors.path = 'Path is required';
    }
    
    if (!menuFormData.component.trim()) {
      errors.component = 'Component name is required';
    }
    
    if (!menuFormData.rank) {
      errors.rank = 'Rank is required';
    } else if (isNaN(Number(menuFormData.rank)) || Number(menuFormData.rank) < 1) {
      errors.rank = 'Rank must be a positive number';
    }
    
    if (!menuFormData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    return errors;
  };

  const handleSaveMenu = async () => {
    const errors = validateMenuForm();
    
    if (Object.keys(errors).length > 0) {
      setMenuFormErrors(errors);
      return;
    }

    try {
      if (editingMenu) {
        // 更新现有菜单
        const response = await menuApi.updateMenu(editingMenu.id, {
          name: menuFormData.name,
          path: menuFormData.path,
          component: menuFormData.component,
          rank: Number(menuFormData.rank),
          isEnabled: menuFormData.isEnabled,
          description: menuFormData.description,
          parent: menuFormData.parent || null
        });
        setMenuItems(prev => 
          prev.map(item => 
            item.id === editingMenu.id ? response.data : item
          )
        );
        setSnackbarMessage('Menu updated successfully!');
      } else {
        // 添加新菜单
        const response = await menuApi.createMenu({
          name: menuFormData.name,
          path: menuFormData.path,
          component: menuFormData.component,
          rank: Number(menuFormData.rank),
          isEnabled: menuFormData.isEnabled,
          description: menuFormData.description,
          parent: menuFormData.parent || null
        });
        setMenuItems(prev => [...prev, response.data]);
        setSnackbarMessage('Menu added successfully!');
      }
      setSnackbarOpen(true);
      setMenuDialogOpen(false);
    } catch (error) {
      setSnackbarMessage(error.response?.data?.message || 'Failed to save menu');
      setSnackbarOpen(true);
    }
  };

  const handleToggleEnabled = async (id) => {
    try {
      const menu = menuItems.find(item => item.id === id);
      await menuApi.toggleMenuStatus(id, !menu.isEnabled);
      setMenuItems(prev => 
        prev.map(item => 
          item.id === id ? { ...item, isEnabled: !item.isEnabled } : item
        )
      );
      setSnackbarMessage(`Menu ${menu.name} ${!menu.isEnabled ? 'enabled' : 'disabled'} successfully!`);
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('Failed to update menu status');
      setSnackbarOpen(true);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleFilterChange = (event) => {
    setFilterEnabled(event.target.value);
    setPage(0);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Filter and search menus
  const filteredMenus = menuItems.filter(menu => {
    const matchesSearch = 
      menu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      menu.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
      menu.component.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (menu.description && menu.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterEnabled === 'all') {
      return matchesSearch;
    } else if (filterEnabled === 'enabled') {
      return matchesSearch && menu.isEnabled;
    } else {
      return matchesSearch && !menu.isEnabled;
    }
  });

  // Sort menus by rank
  const sortedMenus = [...filteredMenus].sort((a, b) => a.rank - b.rank);

  // Paginate menus
  const paginatedMenus = sortedMenus.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#4caf50', fontWeight: 'bold', mb: 3 }}>
          Menu Management
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
              placeholder="Search menus..."
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
                onClick={handleAddMenu}
              >
                Add Menu
              </Button>
            </Box>
          </Box>
          
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Path</TableCell>
                  <TableCell>Component</TableCell>
                  <TableCell>Parent</TableCell>
                  <TableCell align="center">Rank</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedMenus.length > 0 ? (
                  paginatedMenus.map((menu) => (
                    <TableRow 
                      key={menu.id}
                      sx={{ 
                        '&:hover': { 
                          backgroundColor: 'rgba(76, 175, 80, 0.08)' 
                        }
                      }}
                    >
                      <TableCell>{menu.name}</TableCell>
                      <TableCell>{menu.path}</TableCell>
                      <TableCell>{menu.component}</TableCell>
                      <TableCell>{menu.parent || '-'}</TableCell>
                      <TableCell align="center">{menu.rank}</TableCell>
                      <TableCell align="center">
                        <Switch
                          checked={menu.isEnabled}
                          onChange={() => handleToggleEnabled(menu.id)}
                          color="primary"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title={menu.description} arrow placement="top">
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              maxWidth: 200, 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis', 
                              whiteSpace: 'nowrap' 
                            }}
                          >
                            {menu.description}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton 
                          size="small" 
                          onClick={(e) => handleMenuClick(e, menu.id)}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1" color="text.secondary">
                        No menus found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            component="div"
            count={sortedMenus.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Paper>
      </Box>
      
      {/* 菜单操作菜单 */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditMenu}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteMenu} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
      
      {/* 添加/编辑菜单对话框 */}
      <Dialog open={menuDialogOpen} onClose={handleMenuDialogClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: 'rgba(30, 30, 30, 0.9)', color: '#4caf50', fontWeight: 'bold' }}>
          {editingMenu ? 'Edit Menu' : 'Add New Menu'}
        </DialogTitle>
        <DialogContent sx={{ bgcolor: 'rgba(30, 30, 30, 0.9)', pt: 2 }}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Menu Name *"
                name="name"
                value={menuFormData.name}
                onChange={handleMenuFormChange}
                error={!!menuFormErrors.name}
                helperText={menuFormErrors.name}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Path *"
                name="path"
                value={menuFormData.path}
                onChange={handleMenuFormChange}
                error={!!menuFormErrors.path}
                helperText={menuFormErrors.path}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Component Name *"
                name="component"
                value={menuFormData.component}
                onChange={handleMenuFormChange}
                error={!!menuFormErrors.component}
                helperText={menuFormErrors.component}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="parent-menu-label">Parent Menu</InputLabel>
                <Select
                  labelId="parent-menu-label"
                  name="parent"
                  value={menuFormData.parent}
                  onChange={handleMenuFormChange}
                  label="Parent Menu"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {menuItems
                    .filter(item => item.parent === null && (!editingMenu || item.id !== editingMenu.id))
                    .map(item => (
                      <MenuItem key={item.id} value={item.name}>
                        {item.name}
                      </MenuItem>
                    ))
                  }
                </Select>
                <FormHelperText>Optional</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Rank *"
                name="rank"
                type="number"
                value={menuFormData.rank}
                onChange={handleMenuFormChange}
                error={!!menuFormErrors.rank}
                helperText={menuFormErrors.rank || "Lower rank appears first"}
                required
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl component="fieldset" sx={{ mt: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Status
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Switch
                    checked={menuFormData.isEnabled}
                    onChange={handleMenuFormChange}
                    name="isEnabled"
                    color="primary"
                  />
                  <Typography variant="body2">
                    {menuFormData.isEnabled ? 'Enabled' : 'Disabled'}
                  </Typography>
                </Box>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description *"
                name="description"
                value={menuFormData.description}
                onChange={handleMenuFormChange}
                error={!!menuFormErrors.description}
                helperText={menuFormErrors.description}
                required
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ bgcolor: 'rgba(30, 30, 30, 0.9)', px: 3, pb: 3 }}>
          <Button onClick={handleMenuDialogClose} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleSaveMenu} 
            color="primary" 
            variant="contained"
          >
            {editingMenu ? 'Update' : 'Save'}
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

export default MenuList; 