'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import {
  Box,
  Typography,
  Stack,
  TextField,
  Button,
  Chip,
  FormControl,
  Select,
  MenuItem,
  Switch,
  Divider,
} from '@mui/material'
import { SliceUploadItem, SliceFormData } from '@/types/slice'
import { CourseCategory } from '@/types/course'
import { X, Plus, FileImage } from 'lucide-react'

interface SliceEditFormProps {
  item: SliceUploadItem
  onSave: (data: SliceFormData) => void
  onCancel: () => void
}

const categoryOptions: { value: CourseCategory; label: string }[] = [
  { value: 'digestive', label: '消化系统' },
  { value: 'respiratory', label: '呼吸系统' },
  { value: 'breast', label: '乳腺' },
  { value: 'endocrine', label: '内分泌' },
  { value: 'urinary', label: '泌尿系统' },
  { value: 'nervous', label: '神经系统' },
  { value: 'cardiovascular', label: '心血管' },
  { value: 'reproductive', label: '生殖系统' },
  { value: 'other', label: '其他' },
]

const magnificationOptions = [
  { value: 10, label: '10x' },
  { value: 20, label: '20x' },
  { value: 40, label: '40x' },
  { value: 60, label: '60x' },
]

export function SliceEditForm({
  item,
  onSave,
  onCancel,
}: SliceEditFormProps): ReactNode {
  const [formData, setFormData] = useState<SliceFormData>({
    title: item.title,
    description: item.description,
    category: item.category,
    magnification: item.metadata?.magnification || 40,
    tags: item.tags,
    isPublic: item.isPublic,
    allowDownload: item.allowDownload,
  })

  const [newTag, setNewTag] = useState('')

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSave(formData)
  }

  const addTag = () => {
    const tag = newTag.trim()
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }))
    }
    setNewTag('')
  }

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

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

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* 文件信息 */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        sx={{
          p: 1.5,
          borderRadius: 1,
          bgcolor: 'color-mix(in srgb, var(--muted) 50%, transparent)',
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1,
            bgcolor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <FileImage className="w-5 h-5" style={{ color: 'var(--primary)' }} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: 'var(--foreground)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {item.file.name}
          </Typography>
          <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
            {(item.file.size / 1024 / 1024).toFixed(1)} MB
          </Typography>
        </Box>
      </Stack>

      {/* 标题 */}
      <Box>
        <Typography
          component="label"
          htmlFor="title"
          variant="body2"
          sx={{ display: 'block', mb: 0.5, fontWeight: 500, color: 'var(--foreground)' }}
        >
          切片标题 <Box component="span" sx={{ color: 'var(--error)' }}>*</Box>
        </Typography>
        <TextField
          id="title"
          fullWidth
          size="small"
          value={formData.title}
          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
          placeholder="输入切片标题"
          required
          sx={textFieldSx}
        />
      </Box>

      {/* 描述 */}
      <Box>
        <Typography
          component="label"
          htmlFor="description"
          variant="body2"
          sx={{ display: 'block', mb: 0.5, fontWeight: 500, color: 'var(--foreground)' }}
        >
          描述
        </Typography>
        <TextField
          id="description"
          fullWidth
          size="small"
          multiline
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="输入切片描述信息..."
          sx={textFieldSx}
        />
      </Box>

      {/* 分类和放大倍数 */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
        <Box>
          <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500, color: 'var(--foreground)' }}>
            分类 <Box component="span" sx={{ color: 'var(--error)' }}>*</Box>
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              value={formData.category}
              onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value as CourseCategory }))}
              sx={{
                bgcolor: 'var(--background)',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border)' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--primary)' },
                '& .MuiSelect-select': { color: 'var(--foreground)' },
              }}
            >
              {categoryOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box>
          <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500, color: 'var(--foreground)' }}>
            放大倍数
          </Typography>
          <FormControl fullWidth size="small">
            <Select
              value={formData.magnification.toString()}
              onChange={(e) => setFormData((prev) => ({ ...prev, magnification: parseInt(e.target.value) }))}
              sx={{
                bgcolor: 'var(--background)',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border)' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--primary)' },
                '& .MuiSelect-select': { color: 'var(--foreground)' },
              }}
            >
              {magnificationOptions.map((option) => (
                <MenuItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* 标签 */}
      <Box>
        <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500, color: 'var(--foreground)' }}>
          标签
        </Typography>
        <Stack direction="row" flexWrap="wrap" spacing={1} useFlexGap sx={{ mb: 1 }}>
          {formData.tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              onDelete={() => removeTag(tag)}
              deleteIcon={<X className="w-3 h-3" />}
              sx={{
                bgcolor: 'var(--muted)',
                '& .MuiChip-label': { color: 'var(--foreground)' },
                '& .MuiChip-deleteIcon': { color: 'var(--muted-foreground)', '&:hover': { color: 'var(--error)' } },
              }}
            />
          ))}
        </Stack>
        <Stack direction="row" spacing={1}>
          <TextField
            size="small"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder="输入标签后按回车添加"
            sx={{ flex: 1, ...textFieldSx }}
          />
          <Button
            type="button"
            variant="outlined"
            size="small"
            onClick={addTag}
            disabled={!newTag.trim()}
            sx={{
              minWidth: 40,
              borderColor: 'var(--border)',
              color: 'var(--foreground)',
              '&:hover': { borderColor: 'var(--border)', bgcolor: 'var(--muted)' },
              '&.Mui-disabled': { borderColor: 'var(--border)', color: 'var(--muted-foreground)' },
            }}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </Stack>
      </Box>

      {/* 元数据（只读） */}
      {item.metadata && (
        <Box>
          <Typography variant="body2" sx={{ mb: 0.5, color: 'var(--muted-foreground)' }}>
            切片尺寸（自动检测）
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
            <Box sx={{ p: 1.5, borderRadius: 1, bgcolor: 'color-mix(in srgb, var(--muted) 50%, transparent)' }}>
              <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
                宽度
              </Typography>
              <Typography sx={{ fontWeight: 500, color: 'var(--foreground)' }}>
                {item.metadata.width.toLocaleString()} px
              </Typography>
            </Box>
            <Box sx={{ p: 1.5, borderRadius: 1, bgcolor: 'color-mix(in srgb, var(--muted) 50%, transparent)' }}>
              <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
                高度
              </Typography>
              <Typography sx={{ fontWeight: 500, color: 'var(--foreground)' }}>
                {item.metadata.height.toLocaleString()} px
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      <Divider sx={{ borderColor: 'var(--border)' }} />

      {/* 权限设置 */}
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'var(--foreground)' }}>
              公开可见
            </Typography>
            <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
              所有用户可以浏览此切片
            </Typography>
          </Box>
          <Switch
            checked={formData.isPublic}
            onChange={(e) => setFormData((prev) => ({ ...prev, isPublic: e.target.checked }))}
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': { color: 'var(--primary)' },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: 'var(--primary)' },
            }}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'var(--foreground)' }}>
              允许下载
            </Typography>
            <Typography variant="caption" sx={{ color: 'var(--muted-foreground)' }}>
              允许用户下载原始 SVS 文件
            </Typography>
          </Box>
          <Switch
            checked={formData.allowDownload}
            onChange={(e) => setFormData((prev) => ({ ...prev, allowDownload: e.target.checked }))}
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': { color: 'var(--primary)' },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: 'var(--primary)' },
            }}
          />
        </Stack>
      </Stack>

      {/* 操作按钮 */}
      <Stack direction="row" justifyContent="flex-end" spacing={1.5} sx={{ pt: 2 }}>
        <Button
          type="button"
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
          type="submit"
          variant="contained"
          sx={{
            bgcolor: 'var(--primary)',
            '&:hover': { bgcolor: 'var(--primary)', opacity: 0.9 },
          }}
        >
          保存
        </Button>
      </Stack>
    </Box>
  )
}
