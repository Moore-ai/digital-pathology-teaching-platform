'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import { User } from '@/types/user'
import {
  Box,
  Typography,
  Stack,
  Paper,
  Chip,
  Button,
  TextField,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Menu,
  MenuItem,
  Divider,
  IconButton,
  InputAdornment,
} from '@mui/material'
import {
  Search,
  Plus,
  Download,
  MoreHorizontal,
  Edit,
  Trash2,
  Ban,
} from 'lucide-react'

interface UserTableProps {
  className?: string
  users: User[]
  currentUserId?: string
}

const roleConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  student: { label: '学生', color: 'var(--info)', bgColor: 'color-mix(in srgb, var(--info) 10%, transparent)' },
  teacher: { label: '教师', color: 'var(--warning)', bgColor: 'color-mix(in srgb, var(--warning) 10%, transparent)' },
  admin: { label: '管理员', color: 'var(--secondary)', bgColor: 'color-mix(in srgb, var(--secondary) 10%, transparent)' },
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  active: { label: '正常', color: 'var(--success)', bgColor: 'color-mix(in srgb, var(--success) 10%, transparent)' },
  inactive: { label: '禁用', color: 'var(--error)', bgColor: 'color-mix(in srgb, var(--error) 10%, transparent)' },
}

export function UserTable({ className, users, currentUserId }: UserTableProps): ReactNode {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  return (
    <Paper className={className} sx={{ bgcolor: 'var(--card)', border: '1px solid var(--border)' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid var(--border)' }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'var(--foreground)' }}>
              用户管理
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
              管理系统用户账号
            </Typography>
          </Box>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Button
              variant="outlined"
              size="small"
              sx={{
                borderColor: 'var(--border)',
                color: 'var(--foreground)',
                '&:hover': { borderColor: 'var(--border)', bgcolor: 'var(--muted)' },
              }}
            >
              <Download className="w-4 h-4" style={{ marginRight: 8 }} />
              导出
            </Button>
            <Button
              variant="contained"
              size="small"
              sx={{ bgcolor: 'var(--primary)', '&:hover': { bgcolor: 'var(--primary)', opacity: 0.9 } }}
            >
              <Plus className="w-4 h-4" style={{ marginRight: 8 }} />
              添加用户
            </Button>
          </Stack>
        </Stack>
      </Box>
      <Box sx={{ p: 2 }}>
        {/* 搜索栏 */}
        <TextField
          size="small"
          placeholder="搜索用户..."
          sx={{
            width: { xs: '100%', sm: 300 },
            mb: 2,
            '& .MuiOutlinedInput-root': {
              bgcolor: 'var(--background)',
              '& fieldset': { borderColor: 'var(--border)' },
              '&:hover fieldset': { borderColor: 'var(--border)' },
              '&.Mui-focused fieldset': { borderColor: 'var(--primary)' },
            },
            '& .MuiInputBase-input': { color: 'var(--foreground)' },
            '& .MuiInputBase-input::placeholder': { color: 'var(--muted-foreground)', opacity: 1 },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
                </InputAdornment>
              ),
            },
          }}
        />

        {/* 用户表格 */}
        <TableContainer sx={{ border: '1px solid var(--border)', borderRadius: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'var(--muted-foreground)', fontWeight: 500 }}>用户</TableCell>
                <TableCell sx={{ color: 'var(--muted-foreground)', fontWeight: 500 }}>角色</TableCell>
                <TableCell sx={{ color: 'var(--muted-foreground)', fontWeight: 500 }}>状态</TableCell>
                <TableCell sx={{ color: 'var(--muted-foreground)', fontWeight: 500 }}>注册时间</TableCell>
                <TableCell align="right" sx={{ color: 'var(--muted-foreground)', fontWeight: 500 }}>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => {
                  const role = roleConfig[user.role]
                  const status = statusConfig[user.status || 'active']
                  const isCurrentUser = user.id === currentUserId

                  return (
                    <TableRow
                      key={user.id}
                      sx={{
                        '&:hover': { bgcolor: 'var(--muted)' },
                        '& td': { borderColor: 'var(--border)' },
                      }}
                    >
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                          <Avatar
                            src={user.avatar}
                            sx={{ width: 36, height: 36, bgcolor: 'var(--primary)' }}
                          >
                            {user.name.slice(0, 1)}
                          </Avatar>
                          <Box>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Typography variant="body2" sx={{ fontWeight: 500, color: 'var(--foreground)' }}>
                                {user.name}
                              </Typography>
                              {isCurrentUser && (
                                <Chip
                                  size="small"
                                  label="当前"
                                  sx={{
                                    height: 20,
                                    fontSize: '0.625rem',
                                    bgcolor: 'var(--muted)',
                                    '& .MuiChip-label': { color: 'var(--foreground)' },
                                  }}
                                />
                              )}
                            </Stack>
                            <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
                              {user.email}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={role.label}
                          sx={{
                            bgcolor: role.bgColor,
                            '& .MuiChip-label': { color: role.color },
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={status.label}
                          sx={{
                            bgcolor: status.bgColor,
                            '& .MuiChip-label': { color: status.color },
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: 'var(--muted-foreground)' }}>
                        {user.createdAt.toLocaleDateString()}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e)}
                          sx={{ color: 'var(--muted-foreground)' }}
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={users.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="每页行数"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} 共 ${count} 条`}
          sx={{
            color: 'var(--muted-foreground)',
            '& .MuiTablePagination-toolbar': { color: 'var(--foreground)' },
            '& .MuiTablePagination-select': { color: 'var(--foreground)' },
            '& .MuiTablePagination-selectIcon': { color: 'var(--muted-foreground)' },
          }}
        />
      </Box>

      {/* 操作菜单 */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          '& .MuiPaper-root': {
            bgcolor: 'var(--card)',
            border: '1px solid var(--border)',
            minWidth: 120,
          },
        }}
      >
        <MenuItem onClick={handleMenuClose} sx={{ gap: 1.5, color: 'var(--foreground)' }}>
          <Edit className="w-4 h-4" style={{ color: 'var(--muted-foreground)' }} />
          编辑
        </MenuItem>
        <Divider sx={{ borderColor: 'var(--border)' }} />
        <MenuItem onClick={handleMenuClose} sx={{ gap: 1.5, color: 'var(--error)' }}>
          <Ban className="w-4 h-4" />
          禁用
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ gap: 1.5, color: 'var(--error)' }}>
          <Trash2 className="w-4 h-4" />
          删除
        </MenuItem>
      </Menu>
    </Paper>
  )
}
