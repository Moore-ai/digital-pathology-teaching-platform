'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import { X, Plus } from 'lucide-react'
import { Resource, ResourceCategory, categoryLabels } from '@/types/resource'
import { formatFileSize } from '@/lib/mock/resources'
import {
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  Divider,
} from '@mui/material'

interface ResourceEditFormProps {
  resource?: Resource
  file?: File
  onSave: (data: ResourceFormData) => void
  onCancel: () => void
  className?: string
}

export interface ResourceFormData {
  title: string
  description: string
  category: ResourceCategory
  tags: string[]
  isPublic: boolean
  allowDownload: boolean
}

const categories: ResourceCategory[] = [
  'digestive',
  'respiratory',
  'breast',
  'endocrine',
  'urinary',
  'nervous',
  'cardiovascular',
  'reproductive',
  'other',
]

// TextField 样式
const textFieldSx = {
  '& .MuiOutlinedInput-root': {
    bgcolor: 'var(--background)',
    '& fieldset': { borderColor: 'var(--border)' },
    '&:hover fieldset': { borderColor: 'var(--border)' },
    '&.Mui-focused fieldset': { borderColor: 'var(--primary)' },
  },
  '& .MuiInputBase-input': { color: 'var(--foreground)' },
  '& .MuiInputBase-input::placeholder': { color: 'var(--muted-foreground)', opacity: 1 },
}

export function ResourceEditForm({
  resource,
  file,
  onSave,
  onCancel,
  className,
}: ResourceEditFormProps): ReactNode {
  const [title, setTitle] = useState(resource?.title || file?.name?.replace(/\.[^/.]+$/, '') || '')
  const [description, setDescription] = useState(resource?.description || '')
  const [category, setCategory] = useState<ResourceCategory>(resource?.category || 'other')
  const [tags, setTags] = useState<string[]>(resource?.tags || [])
  const [newTag, setNewTag] = useState('')
  const [isPublic, setIsPublic] = useState(resource?.isPublic ?? true)
  const [allowDownload, setAllowDownload] = useState(resource?.allowDownload ?? false)

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
  }

  const handleSave = () => {
    onSave({
      title,
      description,
      category,
      tags,
      isPublic,
      allowDownload,
    })
  }

  return (
    <Box className={className} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 两栏布局 */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, flex: 1, pt: 0.5 }}>
        {/* 左栏：基本信息 */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* 文件信息 */}
          {file && (
            <Box
              sx={{
                p: 1.5,
                borderRadius: 1,
                bgcolor: 'var(--muted)',
                border: '1px solid var(--border)',
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500, color: 'var(--foreground)', mb: 0.5 }}>
                文件信息
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
                  文件名:{' '}
                  <Box component="span" sx={{ color: 'var(--foreground)' }}>
                    {file.name}
                  </Box>
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--muted-foreground)' }}>
                  文件大小:{' '}
                  <Box component="span" sx={{ color: 'var(--foreground)' }}>
                    {formatFileSize(file.size)}
                  </Box>
                </Typography>
              </Box>
            </Box>
          )}

          {/* 资料名称 */}
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'var(--foreground)', mb: 0.5 }}>
              资料名称 *
            </Typography>
            <TextField
              fullWidth
              size="small"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入资料名称"
              sx={textFieldSx}
            />
          </Box>

          {/* 资料描述 */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'var(--foreground)', mb: 0.5 }}>
              资料描述
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="输入资料描述（可选）"
              sx={{ ...textFieldSx, '& .MuiInputBase-root': { height: '100%' } }}
            />
          </Box>

          {/* 所属分类 */}
          <FormControl fullWidth size="small">
            <InputLabel sx={{ color: 'var(--muted-foreground)', '&.Mui-focused': { color: 'var(--primary)' } }}>
              所属分类 *
            </InputLabel>
            <Select
              value={category}
              label="所属分类 *"
              onChange={(e) => setCategory(e.target.value as ResourceCategory)}
              sx={{
                bgcolor: 'var(--background)',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border)' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--primary)' },
                '& .MuiSelect-select': { color: 'var(--foreground)' },
                '& .MuiSvgIcon-root': { color: 'var(--muted-foreground)' },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: 'var(--card)',
                    border: '1px solid var(--border)',
                    '& .MuiMenuItem-root': {
                      color: 'var(--foreground)',
                      '&:hover': { bgcolor: 'var(--muted)' },
                    },
                  },
                },
              }}
            >
              {categories.map(cat => (
                <MenuItem key={cat} value={cat}>
                  {categoryLabels[cat]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* 右栏：标签和权限 */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* 标签 */}
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'var(--foreground)', mb: 0.5 }}>
              标签
            </Typography>
            {tags.length > 0 && (
              <Stack direction="row" spacing={0.5} useFlexGap flexWrap="wrap" sx={{ mb: 0.5 }}>
                {tags.map(tag => (
                  <Chip
                    key={tag}
                    size="small"
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    deleteIcon={<X className="w-3 h-3" style={{ color: 'var(--error)' }} />}
                    sx={{
                      bgcolor: 'var(--muted)',
                      '& .MuiChip-label': { color: 'var(--foreground)' },
                      '& .MuiChip-deleteIcon': { color: 'var(--muted-foreground)', '&:hover': { color: 'var(--error)' } },
                    }}
                  />
                ))}
              </Stack>
            )}
            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth
                size="small"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="输入标签后点击添加"
                sx={textFieldSx}
              />
              <Button
                variant="outlined"
                size="small"
                onClick={handleAddTag}
                disabled={!newTag.trim()}
                sx={{
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)',
                  '&:hover': { borderColor: 'var(--border)', bgcolor: 'var(--muted)' },
                  '&.Mui-disabled': { borderColor: 'var(--border)', color: 'var(--muted-foreground)' },
                }}
              >
                <Plus className="w-4 h-4" style={{ marginRight: 4 }} />
                添加
              </Button>
            </Stack>
          </Box>

          {/* 权限设置 */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'var(--foreground)', mb: 1 }}>
              权限设置
            </Typography>
            <Stack spacing={1.5} sx={{ height: '100%', justifyContent: 'space-evenly' }}>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  p: 1.5,
                  borderRadius: 1,
                  border: '1px solid var(--border)',
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: 'var(--foreground)' }}>
                    设为公开资料
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
                    学生可以查看此资料
                  </Typography>
                </Box>
                <Switch
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: 'var(--primary)' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: 'var(--primary)' },
                  }}
                />
              </Stack>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  p: 1.5,
                  borderRadius: 1,
                  border: '1px solid var(--border)',
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: 'var(--foreground)' }}>
                    允许下载
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
                    用户可以下载此资料
                  </Typography>
                </Box>
                <Switch
                  checked={allowDownload}
                  onChange={(e) => setAllowDownload(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: 'var(--primary)' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: 'var(--primary)' },
                  }}
                />
              </Stack>
            </Stack>
          </Box>
        </Box>
      </Box>

      {/* 操作按钮 */}
      <Divider sx={{ borderColor: 'var(--border)', mt: 2, mb: 1.5 }} />
      <Stack direction="row" justifyContent="flex-end" spacing={1}>
        <Button
          size="small"
          variant="outlined"
          onClick={onCancel}
          sx={{
            borderColor: 'var(--border)',
            color: 'var(--foreground)',
            '&:hover': { borderColor: 'var(--border)', bgcolor: 'var(--muted)' },
          }}
        >
          取消
        </Button>
        <Button
          size="small"
          variant="contained"
          onClick={handleSave}
          disabled={!title.trim()}
          sx={{
            bgcolor: 'var(--primary)',
            '&:hover': { bgcolor: 'var(--primary)', opacity: 0.9 },
            '&.Mui-disabled': { bgcolor: 'var(--muted)' },
          }}
        >
          保存
        </Button>
      </Stack>
    </Box>
  )
}
