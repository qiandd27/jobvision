import { Box, Chip } from '@mui/material';

interface TagCloudProps { tags: string[]; onTagClick?: (tag: string) => void; }

export default function TagCloud({ tags, onTagClick }: TagCloudProps) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      {tags.map(tag => (
        <Chip key={tag} label={tag} size="small" variant="outlined" onClick={() => onTagClick?.(tag)} sx={{ cursor: onTagClick ? 'pointer' : 'default' }} />
      ))}
    </Box>
  );
}
